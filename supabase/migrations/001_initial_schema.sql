-- Leads-AI initial database schema
-- Run this in the Supabase SQL editor or via supabase db push

create extension if not exists "uuid-ossp";

-- ─── Businesses ──────────────────────────────────────────────────────────────

create table public.businesses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  role        text not null default 'Owner',
  created_at  timestamptz default now()
);

-- ─── Knowledge Config ─────────────────────────────────────────────────────────

create table public.knowledge_configs (
  id                  uuid primary key default uuid_generate_v4(),
  business_id         uuid references public.businesses(id) on delete cascade not null unique,
  value_proposition   text default '',
  pain_points         text default '',
  roles               text default '',
  company_size        text default '',
  industries          text default '',
  geographies         text default '',
  enrich_website      boolean default true,
  enrich_maps         boolean default true,
  enrich_instagram    boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ─── Leads ───────────────────────────────────────────────────────────────────

create table public.leads (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid references public.businesses(id) on delete cascade not null,
  name          text not null,
  title         text default '',
  company       text default '',
  email         text default '',
  linkedin      text default '',
  fit_score     integer default 0 check (fit_score between 0 and 100),
  intent_score  integer default 0 check (intent_score between 0 and 100),
  status        text default 'Nuevo',
  pain_point    text default '',
  last_action   text default '',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── Outreach Drafts ─────────────────────────────────────────────────────────

create table public.outreach_drafts (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid references public.businesses(id) on delete cascade not null,
  lead_id       uuid references public.leads(id) on delete cascade not null,
  subject       text default '',
  body          text default '',
  status        text default 'Borrador',
  suggested_at  timestamptz default now(),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── Inbox Messages ──────────────────────────────────────────────────────────

create table public.inbox_messages (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid references public.businesses(id) on delete cascade not null,
  lead_id         uuid references public.leads(id) on delete set null,
  from_name       text not null,
  subject         text default '',
  snippet         text default '',
  classification  text default 'Pregunta',
  is_read         boolean default false,
  received_at     timestamptz default now(),
  created_at      timestamptz default now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────

alter table public.businesses        enable row level security;
alter table public.knowledge_configs enable row level security;
alter table public.leads             enable row level security;
alter table public.outreach_drafts   enable row level security;
alter table public.inbox_messages    enable row level security;

-- Helper: check if the current user owns a business
create or replace function public.user_owns_business(bid uuid)
returns boolean
language sql security definer
as $$
  select exists (
    select 1 from public.businesses
    where id = bid and user_id = auth.uid()
  );
$$;

create policy "own businesses"
  on public.businesses for all
  using (auth.uid() = user_id);

create policy "own knowledge configs"
  on public.knowledge_configs for all
  using (user_owns_business(business_id));

create policy "own leads"
  on public.leads for all
  using (user_owns_business(business_id));

create policy "own outreach drafts"
  on public.outreach_drafts for all
  using (user_owns_business(business_id));

create policy "own inbox messages"
  on public.inbox_messages for all
  using (user_owns_business(business_id));

-- ─── Auto-update updated_at ──────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create trigger outreach_drafts_updated_at
  before update on public.outreach_drafts
  for each row execute function public.set_updated_at();

create trigger knowledge_configs_updated_at
  before update on public.knowledge_configs
  for each row execute function public.set_updated_at();
