import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import {
  Lead,
  OutreachDraft,
  InboxMessage,
  LeadStatus,
  MOCK_LEADS,
  MOCK_DRAFTS,
  MOCK_INBOX,
} from '@/src/data/mock';

interface BusinessData {
  leads: Lead[];
  drafts: OutreachDraft[];
  inbox: InboxMessage[];
}

type AppData = Record<string, BusinessData>;

const INITIAL_DATA: AppData = {
  b_1: { leads: MOCK_LEADS, drafts: MOCK_DRAFTS, inbox: MOCK_INBOX },
  b_2: { leads: [], drafts: [], inbox: [] },
};

function ensureBusiness(data: AppData, businessId: string): AppData {
  if (data[businessId]) return data;
  return { ...data, [businessId]: { leads: [], drafts: [], inbox: [] } };
}

interface AppContextValue {
  getLeads: (businessId: string) => Lead[];
  getDrafts: (businessId: string) => OutreachDraft[];
  getInbox: (businessId: string) => InboxMessage[];
  addLeads: (businessId: string, newLeads: Lead[]) => void;
  updateLeadStatus: (businessId: string, leadId: string, status: LeadStatus, lastAction?: string) => void;
  approveDraft: (businessId: string, draftId: string, subject: string, body: string) => void;
  rejectDraft: (businessId: string, draftId: string) => void;
  updateInboxClassification: (businessId: string, msgId: string, classification: string) => void;
  markInboxRead: (businessId: string, msgId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useLocalStorage<AppData>('leads_ai_app_state', INITIAL_DATA);

  const getLeads = useCallback(
    (businessId: string) => data[businessId]?.leads ?? [],
    [data]
  );

  const getDrafts = useCallback(
    (businessId: string) => data[businessId]?.drafts ?? [],
    [data]
  );

  const getInbox = useCallback(
    (businessId: string) => data[businessId]?.inbox ?? [],
    [data]
  );

  const addLeads = useCallback(
    (businessId: string, newLeads: Lead[]) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            leads: [...newLeads, ...safe[businessId].leads],
          },
        };
      });
    },
    [setData]
  );

  const updateLeadStatus = useCallback(
    (businessId: string, leadId: string, status: LeadStatus, lastAction?: string) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            leads: safe[businessId].leads.map(l =>
              l.id === leadId
                ? { ...l, status, ...(lastAction ? { lastAction } : {}) }
                : l
            ),
          },
        };
      });
    },
    [setData]
  );

  const approveDraft = useCallback(
    (businessId: string, draftId: string, subject: string, body: string) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        const draft = safe[businessId].drafts.find(d => d.id === draftId);
        const leadId = draft?.leadId;

        const updatedDrafts = safe[businessId].drafts.map(d =>
          d.id === draftId ? { ...d, subject, body, status: 'Aprobado' as const } : d
        );

        const updatedLeads = leadId
          ? safe[businessId].leads.map(l =>
              l.id === leadId
                ? { ...l, status: 'Contactado' as LeadStatus, lastAction: 'Email aprobado y programado' }
                : l
            )
          : safe[businessId].leads;

        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            drafts: updatedDrafts,
            leads: updatedLeads,
          },
        };
      });
    },
    [setData]
  );

  const rejectDraft = useCallback(
    (businessId: string, draftId: string) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            drafts: safe[businessId].drafts.filter(d => d.id !== draftId),
          },
        };
      });
    },
    [setData]
  );

  const updateInboxClassification = useCallback(
    (businessId: string, msgId: string, classification: string) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            inbox: safe[businessId].inbox.map(m =>
              m.id === msgId ? { ...m, classification, isRead: true } : m
            ),
          },
        };
      });
    },
    [setData]
  );

  const markInboxRead = useCallback(
    (businessId: string, msgId: string) => {
      setData(prev => {
        const safe = ensureBusiness(prev, businessId);
        return {
          ...safe,
          [businessId]: {
            ...safe[businessId],
            inbox: safe[businessId].inbox.map(m =>
              m.id === msgId ? { ...m, isRead: true } : m
            ),
          },
        };
      });
    },
    [setData]
  );

  return (
    <AppContext.Provider
      value={{
        getLeads,
        getDrafts,
        getInbox,
        addLeads,
        updateLeadStatus,
        approveDraft,
        rejectDraft,
        updateInboxClassification,
        markInboxRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
