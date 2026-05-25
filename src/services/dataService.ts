import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '@/src/lib/firebase';
import { Lead, OutreachDraft, InboxMessage, Business, LeadStatus } from '@/src/data/mock';

function guard() {
  if (!isFirebaseConfigured) throw new Error('Firebase not configured');
}

function uid(): string {
  const u = auth.currentUser;
  if (!u) throw new Error('Not authenticated');
  return u.uid;
}

// ─── Businesses ──────────────────────────────────────────────────────────────

export const businessService = {
  async fetchAll(): Promise<Business[]> {
    guard();
    const q = query(
      collection(db, 'businesses'),
      where('userId', '==', uid()),
      orderBy('createdAt')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, name: data.name, role: data.role };
    });
  },

  async create(name: string, role = 'Owner'): Promise<Business> {
    guard();
    const ref = doc(collection(db, 'businesses'));
    await setDoc(ref, { userId: uid(), name, role, createdAt: serverTimestamp() });
    return { id: ref.id, name, role };
  },
};

// ─── Leads ───────────────────────────────────────────────────────────────────

export const leadsService = {
  async fetch(businessId: string): Promise<Lead[]> {
    guard();
    const q = query(
      collection(db, 'leads'),
      where('userId', '==', uid()),
      where('businessId', '==', businessId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const v = d.data();
      return {
        id: d.id,
        name: v.name,
        title: v.title,
        company: v.company,
        email: v.email,
        linkedin: v.linkedin,
        fitScore: v.fitScore,
        intentScore: v.intentScore,
        status: v.status as LeadStatus,
        painPoint: v.painPoint,
        lastAction: v.lastAction,
      };
    });
  },

  async upsertMany(businessId: string, leads: Lead[]): Promise<void> {
    guard();
    const batch = writeBatch(db);
    leads.forEach(l => {
      const ref = doc(db, 'leads', l.id);
      batch.set(ref, {
        userId: uid(),
        businessId,
        name: l.name,
        title: l.title,
        company: l.company,
        email: l.email,
        linkedin: l.linkedin,
        fitScore: l.fitScore,
        intentScore: l.intentScore,
        status: l.status,
        painPoint: l.painPoint ?? '',
        lastAction: l.lastAction ?? '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });
    await batch.commit();
  },

  async updateStatus(leadId: string, status: LeadStatus, lastAction?: string): Promise<void> {
    guard();
    await updateDoc(doc(db, 'leads', leadId), {
      status,
      ...(lastAction ? { lastAction } : {}),
      updatedAt: serverTimestamp(),
    });
  },
};

// ─── Outreach Drafts ─────────────────────────────────────────────────────────

export const draftsService = {
  async fetch(businessId: string): Promise<OutreachDraft[]> {
    guard();
    const q = query(
      collection(db, 'outreach_drafts'),
      where('userId', '==', uid()),
      where('businessId', '==', businessId),
      orderBy('suggestedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const v = d.data();
      return {
        id: d.id,
        leadId: v.leadId,
        subject: v.subject,
        body: v.body,
        status: v.status,
        suggestedAt: v.suggestedAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
  },

  async upsertMany(businessId: string, drafts: OutreachDraft[]): Promise<void> {
    guard();
    const batch = writeBatch(db);
    drafts.forEach(d => {
      const ref = doc(db, 'outreach_drafts', d.id);
      batch.set(ref, {
        userId: uid(),
        businessId,
        leadId: d.leadId,
        subject: d.subject,
        body: d.body,
        status: d.status,
        suggestedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });
    await batch.commit();
  },

  async approve(draftId: string, subject: string, body: string): Promise<void> {
    guard();
    await updateDoc(doc(db, 'outreach_drafts', draftId), {
      status: 'Aprobado',
      subject,
      body,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(draftId: string): Promise<void> {
    guard();
    await deleteDoc(doc(db, 'outreach_drafts', draftId));
  },
};

// ─── Inbox Messages ──────────────────────────────────────────────────────────

export const inboxService = {
  async fetch(businessId: string): Promise<InboxMessage[]> {
    guard();
    const q = query(
      collection(db, 'inbox_messages'),
      where('userId', '==', uid()),
      where('businessId', '==', businessId),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const v = d.data();
      return {
        id: d.id,
        leadId: v.leadId ?? '',
        from: v.from,
        subject: v.subject,
        snippet: v.snippet,
        classification: v.classification,
        isRead: v.isRead,
        date: v.date?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
  },

  async upsertMany(businessId: string, messages: InboxMessage[]): Promise<void> {
    guard();
    const batch = writeBatch(db);
    messages.forEach(m => {
      const ref = doc(db, 'inbox_messages', m.id);
      batch.set(ref, {
        userId: uid(),
        businessId,
        leadId: m.leadId || null,
        from: m.from,
        subject: m.subject,
        snippet: m.snippet,
        classification: m.classification,
        isRead: m.isRead,
        date: serverTimestamp(),
      }, { merge: true });
    });
    await batch.commit();
  },

  async updateClassification(msgId: string, classification: string): Promise<void> {
    guard();
    await updateDoc(doc(db, 'inbox_messages', msgId), { classification, isRead: true });
  },

  async markRead(msgId: string): Promise<void> {
    guard();
    await updateDoc(doc(db, 'inbox_messages', msgId), { isRead: true });
  },
};

// ─── Bulk load for a business ─────────────────────────────────────────────────

export async function loadBusinessData(businessId: string) {
  const [leads, drafts, inbox] = await Promise.all([
    leadsService.fetch(businessId),
    draftsService.fetch(businessId),
    inboxService.fetch(businessId),
  ]);
  return { leads, drafts, inbox };
}
