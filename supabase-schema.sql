-- Extensions
create extension if not exists pgcrypto;

-- Core tenants
create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid not null references clinics(id) on delete cascade,
  role text not null check (role in ('admin', 'staff')),
  full_name text,
  created_at timestamptz default now()
);

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  name text not null,
  main_condition text,
  risk_level text check (risk_level in ('low','medium','high')),
  assessment jsonb not null default '{}'::jsonb,
  stage text not null default 'Assessment' check (stage in ('Lead','Assessment','Assigned','Active','Closed')),
  assigned_caregiver_id uuid,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

create table if not exists caregivers (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  name text not null,
  skills text[] default '{}',
  personality_type text,
  experience_level text,
  specialties text[] default '{}',
  availability text not null default 'available',
  created_at timestamptz default now()
);

alter table patients add constraint fk_patient_caregiver foreign key (assigned_caregiver_id) references caregivers(id);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  patient_id uuid not null references patients(id) on delete cascade,
  caregiver_id uuid not null references caregivers(id) on delete cascade,
  score int not null,
  explanation text,
  created_at timestamptz default now()
);

create table if not exists care_plans (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  patient_id uuid not null references patients(id) on delete cascade,
  content jsonb not null,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  name text not null,
  contact text,
  status text not null default 'Lead' check (status in ('Lead','Assessment','Assigned','Active','Closed')),
  notes text,
  created_at timestamptz default now()
);

-- Helper: current clinic from profile
create or replace function public.current_clinic_id()
returns uuid
language sql
stable
as $$
  select clinic_id from public.users where id = auth.uid()
$$;

-- RLS
alter table clinics enable row level security;
alter table users enable row level security;
alter table patients enable row level security;
alter table caregivers enable row level security;
alter table matches enable row level security;
alter table care_plans enable row level security;
alter table leads enable row level security;

create policy "users view own clinic" on users for select using (clinic_id = current_clinic_id());
create policy "users manage own clinic" on users for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());

create policy "patients clinic isolation" on patients for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());
create policy "caregivers clinic isolation" on caregivers for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());
create policy "matches clinic isolation" on matches for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());
create policy "care plans clinic isolation" on care_plans for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());
create policy "leads clinic isolation" on leads for all using (clinic_id = current_clinic_id()) with check (clinic_id = current_clinic_id());

create policy "clinics view own" on clinics for select using (id = current_clinic_id());
