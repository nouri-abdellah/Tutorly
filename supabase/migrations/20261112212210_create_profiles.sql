-- Minimal student profile owned by the Supabase Auth user.
-- No personal fields are approved for Phase 1.

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is
    'Minimal authenticated-student profile. Ownership is auth.users.id.';

create function public.set_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke all on function public.set_profile_updated_at() from public, anon, authenticated, service_role;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profile_updated_at();

-- Create exactly one profile for each Auth user. The trigger is idempotent so a
-- retried or replayed insert cannot create duplicate profile rows.
create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id)
    values (new.id)
    on conflict (id) do nothing;
    return new;
end;
$$;

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated, service_role;

create trigger create_profile_on_auth_user_created
after insert on auth.users
for each row
execute function public.create_profile_for_new_user();

alter table public.profiles enable row level security;

-- Deliberately narrow privileges: no profile fields are approved as
-- student-editable, so students receive read access only. The updated_at
-- trigger remains for future trusted database updates.
revoke all on table public.profiles from public, anon, authenticated, service_role;
grant select on table public.profiles to authenticated;

create policy "Students can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);
