export interface Business {
  id: string;
  name: string;
  role: string;
}

export const MOCK_BUSINESSES: Business[] = [
  { id: 'b_1', name: 'Consultancy SaaS', role: 'Owner' },
  { id: 'b_2', name: 'Dev Agency', role: 'Partner' },
];

export type LeadStatus = 'Nuevo' | 'Enriquecido' | 'Contactado' | 'Respondido' | 'Reunión Agendada' | 'Suscripción Cancelada' | 'Rechazado';

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedin: string;
  fitScore: number;
  intentScore: number;
  status: LeadStatus;
  painPoint?: string;
  lastAction?: string;
}

export type OutreachStatus = 'Borrador' | 'Aprobado' | 'Enviado' | 'Fallido';

export interface OutreachDraft {
  id: string;
  leadId: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  suggestedAt: string;
}

export const MOckMetrics = {
  timeSaved: '12h',
  leadsFound: 145,
  replyRate: '12.4%',
  meetingsBooked: 4,
  optOutRate: '1.2%',
  manualModifications: '18%',
};

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l_1',
    name: 'Sarah Jenkins',
    title: 'CTO',
    company: 'FintechFlow',
    email: 'sarah@fintechflow.com',
    linkedin: 'linkedin.com/in/sarahjenkins',
    fitScore: 95,
    intentScore: 82,
    status: 'Nuevo',
    painPoint: 'Alto tiempo en onboarding',
    lastAction: 'Enriquecido vía LinkedIn',
  },
  {
    id: 'l_2',
    name: 'Marcus Thorne',
    title: 'VP Engineering',
    company: 'Logitech Solutions',
    email: 'm.thorne@logisolutions.net',
    linkedin: 'linkedin.com/in/marcusthorne',
    fitScore: 88,
    intentScore: 94,
    status: 'Contactado',
    painPoint: 'Sobrecostes en nube',
    lastAction: 'Secuencia de email 1 enviada',
  },
  {
    id: 'l_3',
    name: 'Elena Rostova',
    title: 'Founder & CEO',
    company: 'SaaSify',
    email: 'elena@saasify.co',
    linkedin: 'linkedin.com/in/elenarostova',
    fitScore: 75,
    intentScore: 40,
    status: 'Nuevo',
    painPoint: 'Tasa de churn creciendo',
    lastAction: 'Importado de CSV',
  },
  {
    id: 'l_4',
    name: 'David Chen',
    title: 'Director of Sales',
    company: 'OmniCorp',
    email: 'dchen@omnicorp.com',
    linkedin: 'linkedin.com/in/davidchen',
    fitScore: 92,
    intentScore: 88,
    status: 'Respondido',
    painPoint: 'Bajo cumplimiento cuota',
    lastAction: 'Respondió a Follow-up 2',
  },
  {
    id: 'l_5',
    name: 'Amelia Pond',
    title: 'Head of Growth',
    company: 'Tardis Tech',
    email: 'amelia@tardistech.uk',
    linkedin: 'linkedin.com/in/ameliapond',
    fitScore: 60,
    intentScore: 20,
    status: 'Suscripción Cancelada',
    painPoint: 'N/A',
    lastAction: 'Baja de la campaña',
  },
];

export const MOCK_DRAFTS: OutreachDraft[] = [
  {
    id: 'd_1',
    leadId: 'l_1',
    subject: 'Speed up developer onboarding at FintechFlow',
    body: `Hi Sarah,\n\nI noticed FintechFlow is rapidly expanding its engineering team this quarter. Typically, CTOs I speak with struggle to get new hires pushing code within the first week due to complex internal tools.\n\nOur platform integrates directly into your existing repo to provide AI-guided onboarding, reducing ramp time by up to 40%.\n\nOpen to a brief chat next Tuesday to see if this aligns with your Q3 goals?\n\nBest,\nAndres`,
    status: 'Borrador',
    suggestedAt: new Date().toISOString(),
  },
  {
    id: 'd_2',
    leadId: 'l_3',
    subject: 'Quick question about SaaSify retention',
    body: `Hi Elena,\n\nSaw your recent post about the challenges of scaling customer success. Decreasing churn clearly seems to be top of mind for SaaSify right now.\n\nI run an AI SDR tool that helps you reach exactly the customers who are showing high intent, so your team focuses on closing rather than cold calling.\n\nWould you be open to exploring how this could work for your team?\n\nBest,\nAndres`,
    status: 'Borrador',
    suggestedAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const MOCK_INBOX = [
  {
    id: 'i_1',
    leadId: 'l_4',
    from: 'David Chen',
    subject: 'Re: OmniCorp outbound strategy',
    snippet: 'This sounds interesting. Im open to a 15 min intro call next week...',
    date: new Date().toISOString(),
    classification: 'Interesado',
    isRead: false,
  },
  {
    id: 'i_2',
    leadId: 'l_5',
    from: 'Amelia Pond',
    subject: 'Re: Tardis Tech growth',
    snippet: 'Please remove me from your mailing list.',
    date: new Date(Date.now() - 86400000).toISOString(),
    classification: 'Objeción/Baja',
    isRead: true,
  }
]
