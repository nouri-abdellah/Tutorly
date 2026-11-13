-- Enforce that curriculum provenance rows belong to the same curriculum version
-- as the content record that references them. NULL source references remain
-- allowed.

create function public.enforce_source_version_consistency()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
    content_version_id uuid;
    source_version_id uuid;
    version_source text := tg_argv[0];
begin
    if new.source_id is null then
        return new;
    end if;

    if version_source = 'topic' then
        select unit.curriculum_version_id
        into content_version_id
        from public.curriculum_units as unit
        where unit.id = new.unit_id;
    elsif version_source = 'direct' then
        content_version_id := new.curriculum_version_id;
    else
        raise exception 'invalid source consistency trigger configuration'
            using errcode = 'XX000';
    end if;

    select source.curriculum_version_id
    into source_version_id
    from public.curriculum_sources as source
    where source.id = new.source_id;

    if content_version_id is null then
        raise exception 'curriculum content parent does not exist'
            using errcode = '23503';
    end if;

    if source_version_id is null then
        raise exception 'curriculum source does not exist'
            using errcode = '23503';
    end if;

    if content_version_id <> source_version_id then
        raise exception
            'curriculum source must belong to the same curriculum version'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

revoke all on function public.enforce_source_version_consistency()
    from public, anon, authenticated, service_role;

create trigger enforce_curriculum_units_source_version
before insert or update of source_id on public.curriculum_units
for each row
execute function public.enforce_source_version_consistency('direct');

create trigger enforce_topics_source_version
before insert or update of source_id on public.topics
for each row
execute function public.enforce_source_version_consistency('topic');

create trigger enforce_skills_source_version
before insert or update of source_id on public.skills
for each row
execute function public.enforce_source_version_consistency('direct');
