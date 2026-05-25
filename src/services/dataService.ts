import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { Lead, OutreachDraft, InboxMessage, Business, LeadStatus } from '@/src/data/mock';
import {
  dbToBusiness,
  dbToLead,
  leadToDb,
  dbToDraft,
  draftToDb,
  dbToInboxMessage,
  inboxToDb,
} from '@/src/types/database';

function guard() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
}

// ─── Businesses ──────────────────────────────────────────────────────────────

export const businessService = {
  async fetchAll(): Promise<Business[]> {
    guard();
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at');
    if (error) throw error;
    return data.map(dbToBusiness);
  },

  async create(name: string, role = 'Owner'): Promise<Business> {
    guard();
    const { data, error } = await supabase
      .from('businesses')
      .insert({ name, role })
      .select()
      .single();
    if (error) throw error;
    return dbToBusiness(data);
  },
};

// ─── Leads ───────────────────────────────────────────────────────────────────

export const leadsService = {
  async fetch(businessId: string): Promise<Lead[]> {
    guard();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(dbToLead);
  },

  async upsertMany(businessId: string, leads: Lead[]): Promise<void> {
    guard();
    const rows = leads.map(l => leadToDb(businessId, l));
    const { error } = await supabase.from('leads').upsert(rows);
    if (error) throw error;
  },

  async updateStatus(leadId: string, status: LeadStatus, lastAction?: string): Promise<void> {
    guard();
    const { error } = await supabase
      .from('leads')
      .update({ status, ...(lastAction ? { last_action: lastAction } : {}) })
      .eq('id', leadId);
    if (error) throw error;
  },
};

// ─── Outreach Drafts ─────────────────────────────────────────────────────────

export const draftsService = {
  async fetch(businessId: string): Promise<OutreachDraft[]> {
    guard();
    const { data, error } = await supabase
      .from('outreach_drafts')
      .select('*')
      .eq('business_id', businessId)
      .order('suggested_at', { ascending: false });
    if (error) throw error;
    return data.map(dbToDraft);
  },

  async upsertMany(businessId: string, drafts: OutreachDraft[]): Promise<void> {
    guard();
    const rows = drafts.map(d => draftToDb(businessId, d));
    const { error } = await supabase.from('outreach_drafts').upsert(rows);
    if (error) throw error;
  },

  async approve(draftId: string, subject: string, body: string): Promise<void> {
    guard();
    const { error } = await supabase
      .from('outreach_drafts')
      .update({ status: 'Aprobado', subject, body })
      .eq('id', draftId);
    if (error) throw error;
  },

  async delete(draftId: string): Promise<void> {
    guard();
    const { error } = await supabase.from('outreach_drafts').delete().eq('id', draftId);
    if (error) throw error;
  },
};

// ─── Inbox Messages ──────────────────────────────────────────────────────────

export const inboxService = {
  async fetch(businessId: string): Promise<InboxMessage[]> {
    guard();
    const { data, error } = await supabase
      .from('inbox_messages')
      .select('*')
      .eq('business_id', businessId)
      .order('received_at', { ascending: false });
    if (error) throw error;
    return data.map(dbToInboxMessage);
  },

  async upsertMany(businessId: string, messages: InboxMessage[]): Promise<void> {
    guard();
    const rows = messages.map(m => inboxToDb(businessId, m));
    const { error } = await supabase.from('inbox_messages').upsert(rows);
    if (error) throw error;
  },

  async updateClassification(msgId: string, classification: string): Promise<void> {
    guard();
    const { error } = await supabase
      .from('inbox_messages')
      .update({ classification, is_read: true })
      .eq('id', msgId);
    if (error) throw error;
  },

  async markRead(msgId: string): Promise<void> {
    guard();
    const { error } = await supabase
      .from('inbox_messages')
      .update({ is_read: true })
      .eq('id', msgId);
    if (error) throw error;
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
