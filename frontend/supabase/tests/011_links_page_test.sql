-- Tests for the links page migrations. Run after all migrations in the disposable test database.
\set ON_ERROR_STOP off
\pset footer off

drop schema if exists t cascade;
create schema t;
grant usage on schema t to authenticated;

create function t.ok(name text, cond boolean) returns void language plpgsql as $$
begin
  raise notice '% %', case when cond then 'PASS' else 'FAIL' end, name;
end $$;

create function t.as_user(uid text) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'aal', 'aal2')::text, false);
$$;

grant execute on all functions in schema t to authenticated;

set role authenticated;
select t.as_user('11111111-1111-1111-1111-111111111111');

insert into public.links (name, url, icon_letter, color, sort_order)
values ('Adres sonra', null, 'A', '#244d9c', 99);
select t.ok('custom links may be created before their URL is known',
  exists (select 1 from public.links where name = 'Adres sonra' and url is null));

delete from public.links where name = 'Adres sonra';
select t.ok('staff cannot physically delete links',
  exists (select 1 from public.links where name = 'Adres sonra'));

update public.links set active = false where name = 'Adres sonra';
select t.ok('staff can remove a custom link from the page',
  exists (select 1 from public.links where name = 'Adres sonra' and not active));

update public.links set active = false where system_key = 'uts';
select t.ok('system link removal preserves its row for sale history',
  exists (select 1 from public.links where system_key = 'uts' and not active));

reset role;
