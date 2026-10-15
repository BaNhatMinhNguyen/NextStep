begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.pilot_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table private.pilot_members enable row level security;
revoke all on private.pilot_members from public, anon, authenticated;

-- Membership is assigned by a project administrator after verifying the SSO
-- identity. Email suffixes and user-editable metadata never authorize access.
create function private.has_pilot_access() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from private.pilot_members m
    where m.user_id = (select auth.uid()) and m.enabled and m.expires_at > now());
$$;
revoke all on function private.has_pilot_access() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.has_pilot_access() to authenticated;
-- Expose only an invoker wrapper; the private table remains inaccessible.
create function public.has_pilot_access() returns boolean
language sql stable security invoker set search_path = '' as $$
  select private.has_pilot_access();
$$;
revoke all on function public.has_pilot_access() from public, anon;
grant execute on function public.has_pilot_access() to authenticated;

create function public.valid_checklist_profile(p jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare k text; v text;
begin
  if p is null then return true; end if;
  if jsonb_typeof(p) is distinct from 'object' or length(p::text)>3000
    or (select count(*) from jsonb_object_keys(p))<>11
    or p->>'level' is distinct from 'First-year undergraduate' or p->>'visa' is distinct from 'F-1'
    or not coalesce(p->>'term' in ('Fall','Spring'),false)
    or jsonb_typeof(p->'year') is distinct from 'string'
    or jsonb_typeof(p->'stage') is distinct from 'number'
    or not coalesce(p->>'year' ~ '^20[0-9]{2}$',false)
    or not coalesce(p->>'stage' in ('0','1','2','3'),false)
    then return false; end if;
  foreach k in array array['arrival','departure','moveIn','submitted','programStart','addressChanged'] loop
    if jsonb_typeof(p->k) is distinct from 'string' then return false; end if;
    v=p->>k;
    if v<>'' and (v !~ '^20[0-9]{2}-[0-9]{2}-[0-9]{2}$' or (v::date)::text<>v) then return false; end if;
  end loop;
  if p->>'arrival'<>'' and p->>'departure'<>'' and p->>'departure'>p->>'arrival' then return false; end if;
  if p->>'arrival'<>'' and p->>'moveIn'<>'' and p->>'moveIn'<p->>'arrival' then return false; end if;
  return true;
exception when others then return false;
end; $$;
revoke all on function public.valid_checklist_profile(jsonb) from public,anon;
grant execute on function public.valid_checklist_profile(jsonb) to authenticated;

create table public.task_catalog (
  id text primary key,
  priority text not null check(priority in ('Required','Recommended','Conditional')),
  title text not null,
  constraint task_id_size check(length(id) between 1 and 80)
);
create table public.user_checklists (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb,
  revision bigint not null default 0 check(revision >= 0),
  updated_at timestamptz not null default now(),
  constraint profile_scope check(public.valid_checklist_profile(profile))
);
create table public.user_tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null references public.task_catalog(id),
  status text not null default 'Not Started' check(status in ('Not Started','In Progress','Completed','Not Applicable')),
  target date,
  primary key(user_id,task_id),
  check(target is null or target between date '2000-01-01' and date '2099-12-31')
);
create table public.information_reports (
  user_id uuid not null references auth.users(id) on delete cascade,
  id uuid not null,
  task_id text not null references public.task_catalog(id),
  reason text not null check(reason in ('Outdated instructions','Wrong deadline','Broken official link','Unclear information','Other')),
  note text not null default '' check(length(note)<=500),
  created_at timestamptz not null default now(),
  primary key(user_id,id)
);
alter table public.task_catalog enable row level security;
alter table public.user_checklists enable row level security;
alter table public.user_tasks enable row level security;
alter table public.information_reports enable row level security;
revoke all on public.task_catalog,public.user_checklists,public.user_tasks,public.information_reports from public,anon,authenticated;
grant select on public.task_catalog to authenticated;
grant select,insert,update,delete on public.user_checklists,public.user_tasks,public.information_reports to authenticated;
create policy catalog_read on public.task_catalog for select to authenticated using ((select public.has_pilot_access()));
create policy checklist_owner on public.user_checklists for all to authenticated
  using(user_id=(select auth.uid()) and (select public.has_pilot_access()))
  with check(user_id=(select auth.uid()) and (select public.has_pilot_access()));
create policy task_owner on public.user_tasks for all to authenticated
  using(user_id=(select auth.uid()) and (select public.has_pilot_access()))
  with check(user_id=(select auth.uid()) and (select public.has_pilot_access()));
create policy report_owner on public.information_reports for all to authenticated
  using(user_id=(select auth.uid()) and (select public.has_pilot_access()))
  with check(user_id=(select auth.uid()) and (select public.has_pilot_access()));

create function public.check_task_priority() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.status='Not Applicable' and exists(select 1 from public.task_catalog c where c.id=new.task_id and c.priority='Required') then
    raise exception 'Required tasks cannot be excluded' using errcode='22023';
  end if;
  return new;
end; $$;
revoke all on function public.check_task_priority() from public,anon;
grant execute on function public.check_task_priority() to authenticated;
create trigger check_task_priority before insert or update on public.user_tasks for each row execute function public.check_task_priority();

create function public.load_checklist() returns jsonb
language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null or not public.has_pilot_access() then raise exception 'Access denied' using errcode='42501'; end if;
  select jsonb_build_object('revision',coalesce(c.revision,0),'state',jsonb_build_object(
    'version',2,'profile',c.profile,
    'statuses',coalesce((select jsonb_object_agg(t.task_id,t.status) from public.user_tasks t where t.user_id=auth.uid()),'{}'::jsonb),
    'targets',coalesce((select jsonb_object_agg(t.task_id,t.target::text) from public.user_tasks t where t.user_id=auth.uid() and t.target is not null),'{}'::jsonb),
    'reminders','[]'::jsonb,
    'reports',coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'taskId',r.task_id,'reason',r.reason,'note',r.note,'created',to_char(r.created_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) order by r.created_at,r.id) from public.information_reports r where r.user_id=auth.uid()),'[]'::jsonb)
  )) into result from (values(1)) placeholder(n) left join public.user_checklists c on c.user_id=auth.uid();
  return result;
end; $$;

-- A transaction saves the profile, task rows and reports together. The revision
-- check prevents a stale browser from silently overwriting a newer save.
create function public.save_checklist(expected_revision bigint,payload jsonb) returns bigint
language plpgsql security invoker set search_path = '' as $$
declare current_revision bigint; row jsonb; item record; target_value date;
begin
  if auth.uid() is null or not public.has_pilot_access() then raise exception 'Access denied' using errcode='42501'; end if;
  if expected_revision is null or expected_revision<0 or payload is null or length(payload::text)>100000
    or jsonb_typeof(payload) is distinct from 'object' or payload->>'version' is distinct from '2'
    or jsonb_typeof(payload->'statuses') is distinct from 'object' or jsonb_typeof(payload->'targets') is distinct from 'object'
    or jsonb_typeof(payload->'reports') is distinct from 'array' or payload->'reminders' is distinct from '[]'::jsonb
    or jsonb_array_length(payload->'reports')>100
    or not (payload ? 'profile')
    or exists(select 1 from jsonb_object_keys(payload) k where k not in ('version','profile','statuses','targets','reports','reminders'))
  then raise exception 'Invalid checklist' using errcode='22023'; end if;
  insert into public.user_checklists(user_id) values(auth.uid()) on conflict(user_id) do nothing;
  select revision into current_revision from public.user_checklists where user_id=auth.uid() for update;
  if current_revision<>expected_revision then raise exception 'Checklist conflict' using errcode='40001'; end if;
  update public.user_checklists set profile=nullif(payload->'profile','null'::jsonb),revision=revision+1,updated_at=now() where user_id=auth.uid();
  delete from public.user_tasks where user_id=auth.uid();
  for item in select key from jsonb_each(payload->'statuses') union select key from jsonb_each(payload->'targets') loop
    if (payload->'statuses'->>item.key)='Not Applicable' and exists(select 1 from public.task_catalog c where c.id=item.key and c.priority='Required') then raise exception 'Required task' using errcode='22023'; end if;
    target_value=nullif(payload->'targets'->>item.key,'')::date;
    insert into public.user_tasks(user_id,task_id,status,target) values(auth.uid(),item.key,coalesce(payload->'statuses'->>item.key,'Not Started'),target_value);
  end loop;
  delete from public.information_reports where user_id=auth.uid();
  for row in select value from jsonb_array_elements(payload->'reports') loop
    insert into public.information_reports(user_id,id,task_id,reason,note,created_at)
      values(auth.uid(),(row->>'id')::uuid,row->>'taskId',row->>'reason',row->>'note',(row->>'created')::timestamptz);
  end loop;
  return current_revision+1;
end; $$;
revoke all on function public.load_checklist(),public.save_checklist(bigint,jsonb) from public,anon;
grant execute on function public.load_checklist(),public.save_checklist(bigint,jsonb) to authenticated;
commit;
