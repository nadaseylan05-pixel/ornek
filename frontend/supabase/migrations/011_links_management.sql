-- Let staff create links before an address is known, like the Links page design.
-- Link removal is a soft delete (active = false) so sale_tasks history remains intact.

begin;

alter table public.links drop constraint if exists links_url_required;

commit;
