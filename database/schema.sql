-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  farm_location text,
  preferred_units text default 'metric' check (preferred_units in ('metric', 'imperial')),
  created_at timestamptz default now()
);

-- Fields table
create table fields (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  field_name text not null,
  crop_type text not null,
  soil_type text,
  area_acres numeric,
  irrigation_type text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

-- Advisories table
create table advisories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  field_id uuid references fields(id) on delete set null,
  crop_type text not null,
  growth_stage text,
  symptoms_description text not null,
  severity_rating text,
  weather_conditions text,
  image_url text,
  ai_diagnosis jsonb not null,
  action_items_completed jsonb default '[]',
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table fields enable row level security;
alter table advisories enable row level security;

-- Profiles RLS
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Fields RLS
create policy "Users manage own fields"
  on fields for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Advisories RLS
create policy "Users manage own advisories"
  on advisories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile on user signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
