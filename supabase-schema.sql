create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  main_condition text,
  payload jsonb not null,
  assigned_caregiver_id uuid,
  created_at timestamptz default now()
);

create table if not exists caregivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  skills text[] default '{}',
  experience_level text not null,
  personality_type text not null,
  specialties text[] default '{}',
  availability text not null,
  created_at timestamptz default now()
);

alter table patients add constraint fk_assigned_caregiver
  foreign key (assigned_caregiver_id) references caregivers(id);
