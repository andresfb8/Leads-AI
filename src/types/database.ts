import { Lead, OutreachDraft, InboxMessage, Business, LeadStatus, OutreachStatus } from '@/src/data/mock';

// ─── DB row shapes (snake_case) ────────────────────────────────────────────

export interface DbBusiness {
  id: string;
  user_id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface DbLead {
  id: string;
  business_id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedin: string;
  fit_score: number;
  intent_score: number;
  status: string;
  pain_point: string;
  last_action: string;
  created_at: string;
  updated_at: string;
}

export interface DbOutreachDraft {
  id: string;
  business_id: string;
  lead_id: string;
  subject: string;
  body: string;
  status: string;
  suggested_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbInboxMessage {
  id: string;
  business_id: string;
  lead_id: string | null;
  from_name: string;
  subject: string;
  snippet: string;
  classification: string;
  is_read: boolean;
  received_at: string;
  created_at: string;
}

// ─── Mappers ───────────────────────────────────────────────────────────────

export function dbToBusiness(row: DbBusiness): Business {
  return { id: row.id, name: row.name, role: row.role };
}

export function dbToLead(row: DbLead): Lead {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    company: row.company,
    email: row.email,
    linkedin: row.linkedin,
    fitScore: row.fit_score,
    intentScore: row.intent_score,
    status: row.status as LeadStatus,
    painPoint: row.pain_point,
    lastAction: row.last_action,
  };
}

export function leadToDb(businessId: string, lead: Lead): Omit<DbLead, 'created_at' | 'updated_at'> {
  return {
    id: lead.id,
    business_id: businessId,
    name: lead.name,
    title: lead.title,
    company: lead.company,
    email: lead.email,
    linkedin: lead.linkedin,
    fit_score: lead.fitScore,
    intent_score: lead.intentScore,
    status: lead.status,
    pain_point: lead.painPoint ?? '',
    last_action: lead.lastAction ?? '',
  };
}

export function dbToDraft(row: DbOutreachDraft): OutreachDraft {
  return {
    id: row.id,
    leadId: row.lead_id,
    subject: row.subject,
    body: row.body,
    status: row.status as OutreachStatus,
    suggestedAt: row.suggested_at,
  };
}

export function draftToDb(
  businessId: string,
  draft: OutreachDraft
): Omit<DbOutreachDraft, 'created_at' | 'updated_at'> {
  return {
    id: draft.id,
    business_id: businessId,
    lead_id: draft.leadId,
    subject: draft.subject,
    body: draft.body,
    status: draft.status,
    suggested_at: draft.suggestedAt,
  };
}

export function dbToInboxMessage(row: DbInboxMessage): InboxMessage {
  return {
    id: row.id,
    leadId: row.lead_id ?? '',
    from: row.from_name,
    subject: row.subject,
    snippet: row.snippet,
    classification: row.classification,
    isRead: row.is_read,
    date: row.received_at,
  };
}

export function inboxToDb(
  businessId: string,
  msg: InboxMessage
): Omit<DbInboxMessage, 'created_at'> {
  return {
    id: msg.id,
    business_id: businessId,
    lead_id: msg.leadId || null,
    from_name: msg.from,
    subject: msg.subject,
    snippet: msg.snippet,
    classification: msg.classification,
    is_read: msg.isRead,
    received_at: msg.date,
  };
}
