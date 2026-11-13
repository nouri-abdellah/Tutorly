-- Phase 2.1: curriculum database foundation.
-- No curriculum content is seeded here. These tables are ready for reviewed,
-- version-controlled content imports.

create table public.curricula (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    country text not null,
    grade_level text not null,
    academic_stream text not null,
    subject text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint curricula_name_not_blank check (btrim(name) <> ''),
    constraint curricula_country_not_blank check (btrim(country) <> ''),
    constraint curricula_grade_level_not_blank check (btrim(grade_level) <> ''),
    constraint curricula_academic_stream_not_blank check (btrim(academic_stream) <> ''),
    constraint curricula_subject_not_blank check (btrim(subject) <> '')
);

comment on table public.curricula is
    'A curriculum definition. Actual Algerian curriculum content remains unreviewed and unseeded.';

create table public.curriculum_versions (
    id uuid primary key default gen_random_uuid(),
    curriculum_id uuid not null
        references public.curricula (id) on delete restrict,
    academic_year text not null,
    status text not null default 'draft',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint curriculum_versions_academic_year_not_blank
        check (btrim(academic_year) <> ''),
    constraint curriculum_versions_status_check
        check (status in ('draft', 'reviewed', 'published', 'archived')),
    constraint curriculum_versions_academic_year_unique
        unique (curriculum_id, academic_year)
);

comment on table public.curriculum_versions is
    'An academic-year version of a curriculum. Only published versions are readable by students.';

create table public.curriculum_sources (
    id uuid primary key default gen_random_uuid(),
    curriculum_version_id uuid not null
        references public.curriculum_versions (id) on delete restrict,
    title text not null,
    issuer text,
    source_url text,
    document_date date,
    created_at timestamptz not null default now(),
    constraint curriculum_sources_title_not_blank check (btrim(title) <> '')
);

comment on table public.curriculum_sources is
    'Provenance metadata for reviewed curriculum documents. PDF binaries are not stored in PostgreSQL.';

create table public.curriculum_units (
    id uuid primary key default gen_random_uuid(),
    curriculum_version_id uuid not null
        references public.curriculum_versions (id) on delete restrict,
    title text not null,
    description text,
    display_order integer not null,
    source_id uuid
        references public.curriculum_sources (id) on delete restrict,
    source_page text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint curriculum_units_title_not_blank check (btrim(title) <> ''),
    constraint curriculum_units_display_order_non_negative check (display_order >= 0),
    constraint curriculum_units_display_order_unique
        unique (curriculum_version_id, display_order)
);

comment on table public.curriculum_units is
    'Ordered units within one curriculum version.';

create table public.topics (
    id uuid primary key default gen_random_uuid(),
    unit_id uuid not null
        references public.curriculum_units (id) on delete restrict,
    title text not null,
    description text,
    display_order integer not null,
    source_id uuid
        references public.curriculum_sources (id) on delete restrict,
    source_page text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint topics_title_not_blank check (btrim(title) <> ''),
    constraint topics_display_order_non_negative check (display_order >= 0),
    constraint topics_display_order_unique unique (unit_id, display_order)
);

comment on table public.topics is
    'Ordered lessons or topics within one curriculum unit.';

create table public.skills (
    id uuid primary key default gen_random_uuid(),
    curriculum_version_id uuid not null
        references public.curriculum_versions (id) on delete restrict,
    code text not null,
    title text not null,
    description text,
    difficulty_level integer,
    source_id uuid
        references public.curriculum_sources (id) on delete restrict,
    source_page text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint skills_code_not_blank check (btrim(code) <> ''),
    constraint skills_title_not_blank check (btrim(title) <> ''),
    constraint skills_difficulty_level_range
        check (difficulty_level is null or difficulty_level between 1 and 5),
    constraint skills_code_unique unique (curriculum_version_id, code)
);

comment on table public.skills is
    'Independently assessable skills within one curriculum version.';

create table public.topic_skills (
    topic_id uuid not null
        references public.topics (id) on delete restrict,
    skill_id uuid not null
        references public.skills (id) on delete restrict,
    display_order integer not null,
    created_at timestamptz not null default now(),
    primary key (topic_id, skill_id),
    constraint topic_skills_display_order_non_negative check (display_order >= 0)
);

comment on table public.topic_skills is
    'Many-to-many links between topics and skills in the same curriculum version.';

create table public.skill_prerequisites (
    skill_id uuid not null
        references public.skills (id) on delete restrict,
    prerequisite_skill_id uuid not null
        references public.skills (id) on delete restrict,
    created_at timestamptz not null default now(),
    primary key (skill_id, prerequisite_skill_id),
    constraint skill_prerequisites_not_self
        check (skill_id <> prerequisite_skill_id)
);

comment on table public.skill_prerequisites is
    'Directed prerequisite edges between skills in the same curriculum version.';

-- Non-redundant indexes for foreign keys that are not covered by a primary key
-- or unique constraint. Composite indexes above already cover their leading
-- foreign-key columns.
create index curriculum_sources_version_id_idx
    on public.curriculum_sources (curriculum_version_id);
create index curriculum_versions_status_idx
    on public.curriculum_versions (status);
create index curriculum_units_source_id_idx
    on public.curriculum_units (source_id);
create index topics_source_id_idx
    on public.topics (source_id);
create index skills_source_id_idx
    on public.skills (source_id);
create index topic_skills_skill_id_idx
    on public.topic_skills (skill_id);
create index skill_prerequisites_prerequisite_skill_id_idx
    on public.skill_prerequisites (prerequisite_skill_id);

create function public.set_curriculum_updated_at()
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

revoke all on function public.set_curriculum_updated_at()
    from public, anon, authenticated, service_role;

create trigger set_curricula_updated_at
before update on public.curricula
for each row
execute function public.set_curriculum_updated_at();

create trigger set_curriculum_versions_updated_at
before update on public.curriculum_versions
for each row
execute function public.set_curriculum_updated_at();

create trigger set_curriculum_units_updated_at
before update on public.curriculum_units
for each row
execute function public.set_curriculum_updated_at();

create trigger set_topics_updated_at
before update on public.topics
for each row
execute function public.set_curriculum_updated_at();

create trigger set_skills_updated_at
before update on public.skills
for each row
execute function public.set_curriculum_updated_at();

-- Structural parents and many-to-many endpoints are immutable. Reassigning a
-- row to another version would otherwise bypass cross-version invariants after
-- the original insert had been checked.
create function public.prevent_curriculum_structure_reparent()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    column_name text;
    index integer;
begin
    for index in 0 .. tg_nargs - 1 loop
        column_name := tg_argv[index];
        if to_jsonb(new) ->> column_name
            is distinct from to_jsonb(old) ->> column_name then
            raise exception
                'curriculum structure relationships cannot be reassigned'
                using errcode = '23514';
        end if;
    end loop;
    return new;
end;
$$;

revoke all on function public.prevent_curriculum_structure_reparent()
    from public, anon, authenticated, service_role;

create trigger prevent_curriculum_versions_curriculum_change
before update of curriculum_id on public.curriculum_versions
for each row
execute function public.prevent_curriculum_structure_reparent('curriculum_id');

create trigger prevent_curriculum_sources_version_change
before update of curriculum_version_id on public.curriculum_sources
for each row
execute function public.prevent_curriculum_structure_reparent(
    'curriculum_version_id'
);

create trigger prevent_curriculum_units_version_change
before update of curriculum_version_id on public.curriculum_units
for each row
execute function public.prevent_curriculum_structure_reparent(
    'curriculum_version_id'
);

create trigger prevent_topics_unit_change
before update of unit_id on public.topics
for each row
execute function public.prevent_curriculum_structure_reparent('unit_id');

create trigger prevent_skills_version_change
before update of curriculum_version_id on public.skills
for each row
execute function public.prevent_curriculum_structure_reparent(
    'curriculum_version_id'
);

create trigger prevent_topic_skills_relationship_change
before update of topic_id, skill_id on public.topic_skills
for each row
execute function public.prevent_curriculum_structure_reparent(
    'topic_id',
    'skill_id'
);

create trigger prevent_skill_prerequisites_relationship_change
before update of skill_id, prerequisite_skill_id on public.skill_prerequisites
for each row
execute function public.prevent_curriculum_structure_reparent(
    'skill_id',
    'prerequisite_skill_id'
);

-- A topic and its linked skill must belong to the same curriculum version.
create function public.enforce_topic_skill_version_consistency()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    topic_version_id uuid;
    skill_version_id uuid;
begin
    select unit.curriculum_version_id
    into topic_version_id
    from public.topics as topic
    join public.curriculum_units as unit on unit.id = topic.unit_id
    where topic.id = new.topic_id;

    select skill.curriculum_version_id
    into skill_version_id
    from public.skills as skill
    where skill.id = new.skill_id;

    if topic_version_id is null or skill_version_id is null then
        raise exception 'topic or skill does not exist'
            using errcode = '23503';
    end if;

    if topic_version_id <> skill_version_id then
        raise exception
            'topic and skill must belong to the same curriculum version'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

revoke all on function public.enforce_topic_skill_version_consistency()
    from public, anon, authenticated, service_role;

create trigger enforce_topic_skill_version_consistency
before insert or update of topic_id, skill_id on public.topic_skills
for each row
execute function public.enforce_topic_skill_version_consistency();

-- Prerequisites must connect skills in the same version and must not create a
-- direct or indirect cycle. The advisory lock serializes prerequisite writes
-- for one curriculum version so two concurrent transactions cannot each miss
-- the other's uncommitted edge and jointly create a cycle.
create function public.enforce_skill_prerequisite_consistency()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    skill_version_id uuid;
    prerequisite_version_id uuid;
    has_cycle boolean;
begin
    select skill.curriculum_version_id
    into skill_version_id
    from public.skills as skill
    where skill.id = new.skill_id;

    select skill.curriculum_version_id
    into prerequisite_version_id
    from public.skills as skill
    where skill.id = new.prerequisite_skill_id;

    if skill_version_id is null or prerequisite_version_id is null then
        raise exception 'skill prerequisite references a missing skill'
            using errcode = '23503';
    end if;

    if skill_version_id <> prerequisite_version_id then
        raise exception
            'prerequisite skills must belong to the same curriculum version'
            using errcode = '23514';
    end if;

    if new.skill_id = new.prerequisite_skill_id then
        raise exception 'a skill cannot be its own prerequisite'
            using errcode = '23514';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(skill_version_id::text, 0));

    if tg_op = 'UPDATE' then
        with recursive reachable(skill_id) as (
            select new.prerequisite_skill_id
            union
            select edge.prerequisite_skill_id
            from public.skill_prerequisites as edge
            join reachable on edge.skill_id = reachable.skill_id
            where not (
                edge.skill_id = old.skill_id
                and edge.prerequisite_skill_id = old.prerequisite_skill_id
            )
        )
        select exists (
            select 1 from reachable where skill_id = new.skill_id
        )
        into has_cycle;
    else
        with recursive reachable(skill_id) as (
            select new.prerequisite_skill_id
            union
            select edge.prerequisite_skill_id
            from public.skill_prerequisites as edge
            join reachable on edge.skill_id = reachable.skill_id
        )
        select exists (
            select 1 from reachable where skill_id = new.skill_id
        )
        into has_cycle;
    end if;

    if has_cycle then
        raise exception 'skill prerequisite cycle is not allowed'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

revoke all on function public.enforce_skill_prerequisite_consistency()
    from public, anon, authenticated, service_role;

create trigger enforce_skill_prerequisite_consistency
before insert or update of skill_id, prerequisite_skill_id
on public.skill_prerequisites
for each row
execute function public.enforce_skill_prerequisite_consistency();

alter table public.curricula enable row level security;
alter table public.curriculum_versions enable row level security;
alter table public.curriculum_sources enable row level security;
alter table public.curriculum_units enable row level security;
alter table public.topics enable row level security;
alter table public.skills enable row level security;
alter table public.topic_skills enable row level security;
alter table public.skill_prerequisites enable row level security;

-- Students and anonymous visitors can read only content whose parent version
-- is published. Archived, reviewed, and draft versions are not visible.
create policy "Published curricula are readable"
on public.curricula
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.curriculum_versions as version
        where version.curriculum_id = curricula.id
          and version.status = 'published'
    )
);

create policy "Published curriculum versions are readable"
on public.curriculum_versions
for select
to anon, authenticated
using (status = 'published');

create policy "Published curriculum sources are readable"
on public.curriculum_sources
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.curriculum_versions as version
        where version.id = curriculum_sources.curriculum_version_id
          and version.status = 'published'
    )
);

create policy "Published curriculum units are readable"
on public.curriculum_units
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.curriculum_versions as version
        where version.id = curriculum_units.curriculum_version_id
          and version.status = 'published'
    )
);

create policy "Published topics are readable"
on public.topics
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.curriculum_units as unit
        join public.curriculum_versions as version
            on version.id = unit.curriculum_version_id
        where unit.id = topics.unit_id
          and version.status = 'published'
    )
);

create policy "Published skills are readable"
on public.skills
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.curriculum_versions as version
        where version.id = skills.curriculum_version_id
          and version.status = 'published'
    )
);

create policy "Published topic-skill links are readable"
on public.topic_skills
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.topics as topic
        join public.curriculum_units as unit on unit.id = topic.unit_id
        join public.curriculum_versions as version
            on version.id = unit.curriculum_version_id
        where topic.id = topic_skills.topic_id
          and version.status = 'published'
    )
);

create policy "Published skill prerequisites are readable"
on public.skill_prerequisites
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.skills as skill
        join public.curriculum_versions as version
            on version.id = skill.curriculum_version_id
        where skill.id = skill_prerequisites.skill_id
          and version.status = 'published'
    )
);

-- Explicit grants: students and anonymous visitors can only SELECT. The
-- Service Role has privileged DML solely for trusted imports, administration,
-- and integration-test setup; it is never used by student request paths.
revoke all on table public.curricula
    from public, anon, authenticated, service_role;
revoke all on table public.curriculum_versions
    from public, anon, authenticated, service_role;
revoke all on table public.curriculum_sources
    from public, anon, authenticated, service_role;
revoke all on table public.curriculum_units
    from public, anon, authenticated, service_role;
revoke all on table public.topics
    from public, anon, authenticated, service_role;
revoke all on table public.skills
    from public, anon, authenticated, service_role;
revoke all on table public.topic_skills
    from public, anon, authenticated, service_role;
revoke all on table public.skill_prerequisites
    from public, anon, authenticated, service_role;

grant select on table public.curricula to anon, authenticated;
grant select on table public.curriculum_versions to anon, authenticated;
grant select on table public.curriculum_sources to anon, authenticated;
grant select on table public.curriculum_units to anon, authenticated;
grant select on table public.topics to anon, authenticated;
grant select on table public.skills to anon, authenticated;
grant select on table public.topic_skills to anon, authenticated;
grant select on table public.skill_prerequisites to anon, authenticated;

grant select, insert, update, delete on table public.curricula to service_role;
grant select, insert, update, delete on table public.curriculum_versions to service_role;
grant select, insert, update, delete on table public.curriculum_sources to service_role;
grant select, insert, update, delete on table public.curriculum_units to service_role;
grant select, insert, update, delete on table public.topics to service_role;
grant select, insert, update, delete on table public.skills to service_role;
grant select, insert, update, delete on table public.topic_skills to service_role;
grant select, insert, update, delete on table public.skill_prerequisites to service_role;
