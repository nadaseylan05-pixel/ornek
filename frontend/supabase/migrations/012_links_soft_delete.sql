-- Remove the earlier hard-delete policy. Link removal must preserve references in sale_tasks.

begin;

drop policy if exists "staff delete custom links" on public.links;

commit;
