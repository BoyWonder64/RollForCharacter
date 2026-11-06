-- Fix for databases that already ran 0001 before it was corrected:
-- party_snapshots has `updated_at`, but its trigger called a function that
-- sets `server_updated_at`, so every UPDATE failed with
-- 'record "new" has no field "server_updated_at"'.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists party_snapshots_touch_updated_at on public.party_snapshots;
create trigger party_snapshots_touch_updated_at
  before update on public.party_snapshots
  for each row execute function public.touch_updated_at();
