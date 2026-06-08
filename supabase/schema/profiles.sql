create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  position text not null,
  avatar_url text,
  dob date,
  bio text,
  status text not null default 'active',
  highlight_images text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles
  add column if not exists created_at timestamp with time zone not null default now(),
  add column if not exists updated_at timestamp with time zone not null default now(),
  add column if not exists avatar_url text,
  add column if not exists dob date,
  add column if not exists bio text,
  add column if not exists status text not null default 'active',
  add column if not exists highlight_images text[] not null default '{}';

update public.profiles
set
  status = coalesce(nullif(status, ''), 'active'),
  highlight_images = coalesce(highlight_images, '{}');

alter table public.profiles
  alter column status set default 'active',
  alter column status set not null,
  alter column highlight_images set default '{}',
  alter column highlight_images set not null;

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Authenticated users can view public profile rows" on public.profiles;

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

DROP POLICY IF EXISTS "Allow read profiles" ON public.profiles;

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT (
  id,
  email,
  name,
  position,
  avatar_url,
  dob,
  bio,
  status,
  highlight_images,
  created_at,
  updated_at
) ON public.profiles TO authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false)
AS
  SELECT
    id,
    name,
    position,
    avatar_url,
    dob,
    bio,
    status,
    highlight_images
  FROM public.profiles;

REVOKE ALL ON public.public_profiles FROM anon, authenticated;
GRANT SELECT ON public.public_profiles TO authenticated;
