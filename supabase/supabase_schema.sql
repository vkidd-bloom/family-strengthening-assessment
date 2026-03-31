-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Organizations
-- One per agency. Linked to the coordinator's auth account.
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Cohorts
-- A cohort is one instance of the assessment being run —
-- e.g. "Whole Agency" or "Intake Team Q1 2026".
-- Each cohort gets a unique token used in the shareable respondent link.
create table cohorts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  label text not null,                  -- e.g. "Whole Agency" or "Intake Team"
  token text unique not null default encode(gen_random_bytes(6), 'hex'),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Responses
-- One row per respondent submission.
-- Answers are stored as a JSONB object keyed by question ID.
-- Role and unit are optional — used for slicing aggregated results.
create table responses (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  role text,                            -- optional: e.g. "Line Staff", "Supervisor"
  unit text,                            -- optional: e.g. "Intake Team", "Family Services"
  answers jsonb not null,               -- e.g. { "q1": "building_momentum", "q2": "getting_started", ... }
  submitted_at timestamptz default now()
);

-- Row-level security
-- Coordinators can only see cohorts and responses belonging to their organization.
alter table organizations enable row level security;
alter table cohorts enable row level security;
alter table responses enable row level security;

-- Organizations: coordinator can read/write their own org
create policy "Coordinators manage their org"
  on organizations for all
  using (
    id in (
      select organization_id from cohorts where created_by = auth.uid()
    )
  );

-- Cohorts: coordinator can read/write cohorts they created
create policy "Coordinators manage their cohorts"
  on cohorts for all
  using (created_by = auth.uid());

-- Responses: anyone can insert (respondents don't have accounts)
-- Only the cohort coordinator can read responses
create policy "Anyone can submit a response"
  on responses for insert
  with check (true);

create policy "Coordinators can read responses for their cohorts"
  on responses for select
  using (
    cohort_id in (
      select id from cohorts where created_by = auth.uid()
    )
  );

-- Responses are readable by token lookup (for the respondent link flow)
-- This is handled in the app via a Supabase Edge Function or service role,
-- not via direct RLS, to keep respondents fully anonymous.
