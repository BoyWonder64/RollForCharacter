-- RollForCharacter: accounts + cloud sync + party mode
-- Run this whole file once in the Supabase SQL Editor on a fresh project.

-- ============ Character cloud sync ============
-- One JSONB document per character (not a relational mirror of the local
-- SQLite schema) -- see the implementation plan for why: local child tables
-- have no per-row updatedAt to diff against, so sync happens at whole-
-- character granularity with last-write-wins conflict resolution.
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Stable id generated client-side (expo-crypto randomUUID) at character
  -- creation time -- local SQLite autoincrement ids aren't globally unique,
  -- so they can't identify "the same character" across devices.
  client_sync_id uuid not null,
  name text not null,
  data jsonb not null,
  portrait_path text,
  client_updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  unique (user_id, client_sync_id)
);

create index characters_user_id_idx on public.characters(user_id);

create or replace function public.touch_server_updated_at()
returns trigger language plpgsql as $$
begin
  new.server_updated_at = now();
  return new;
end;
$$;

create trigger characters_touch_updated_at
  before update on public.characters
  for each row execute function public.touch_server_updated_at();

alter table public.characters enable row level security;

create policy "characters_select_own" on public.characters
  for select using (auth.uid() = user_id);
create policy "characters_insert_own" on public.characters
  for insert with check (auth.uid() = user_id);
create policy "characters_update_own" on public.characters
  for update using (auth.uid() = user_id);
create policy "characters_delete_own" on public.characters
  for delete using (auth.uid() = user_id);

-- ============ Party mode ============
create table public.parties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  dm_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.party_members (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.parties(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('dm', 'player')),
  joined_at timestamptz not null default now(),
  unique (party_id, user_id)
);

create table public.party_snapshots (
  party_member_id uuid primary key references public.party_members(id) on delete cascade,
  character_client_sync_id uuid not null,
  name text not null,
  race text not null,
  class_name text not null,
  level integer not null,
  visibility jsonb not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.parties enable row level security;
alter table public.party_members enable row level security;
alter table public.party_snapshots enable row level security;

create or replace function public.is_party_member(p_party_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.party_members
    where party_id = p_party_id and user_id = auth.uid()
  );
$$;

-- Plain SELECT policies on `parties` can't support "look up a party by
-- invite code" for someone who isn't a member yet (is_party_member() is
-- false until the join itself has happened) -- a chicken-and-egg problem.
-- create_party/join_party_by_code below are `security definer` RPCs that
-- do the lookup + both inserts as one atomic unit, bypassing table-level
-- RLS deliberately and only for this narrow, controlled path. Direct table
-- access stays members-only.
create policy "parties_select_members" on public.parties
  for select using (public.is_party_member(id));
create policy "parties_delete_dm_only" on public.parties
  for delete using (auth.uid() = dm_user_id);

create policy "party_members_select_same_party" on public.party_members
  for select using (public.is_party_member(party_id));
create policy "party_members_delete_self_or_dm" on public.party_members
  for delete using (
    auth.uid() = user_id
    or auth.uid() = (select dm_user_id from public.parties where id = party_id)
  );

create policy "party_snapshots_select_same_party" on public.party_snapshots
  for select using (
    public.is_party_member((select party_id from public.party_members where id = party_member_id))
  );
create policy "party_snapshots_upsert_own" on public.party_snapshots
  for insert with check (
    party_member_id in (select id from public.party_members where user_id = auth.uid())
  );
create policy "party_snapshots_update_own" on public.party_snapshots
  for update using (
    party_member_id in (select id from public.party_members where user_id = auth.uid())
  );

-- party_snapshots uses `updated_at` (not `server_updated_at`), so it needs its
-- own trigger function; reusing touch_server_updated_at() errors on update.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger party_snapshots_touch_updated_at
  before update on public.party_snapshots
  for each row execute function public.touch_updated_at();

-- Create a party: generates a unique invite code server-side (retrying on
-- collision) and inserts the creator as its DM member, atomically.
create or replace function public.create_party(p_name text)
returns table(id uuid, name text, invite_code text)
language plpgsql security definer as $$
declare
  v_code text;
  v_party_id uuid;
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no ambiguous 0/O/1/I
  v_attempt int := 0;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_chars, 1 + floor(random() * length(v_chars))::int, 1);
    end loop;

    begin
      insert into public.parties (name, invite_code, dm_user_id)
      values (p_name, v_code, auth.uid())
      returning public.parties.id into v_party_id;
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 5 then
        raise exception 'Could not generate a unique invite code, try again';
      end if;
    end;
  end loop;

  insert into public.party_members (party_id, user_id, display_name, role)
  values (
    v_party_id,
    auth.uid(),
    coalesce((auth.jwt() -> 'user_metadata' ->> 'display_name'), split_part(auth.jwt() ->> 'email', '@', 1)),
    'dm'
  );

  return query select public.parties.id, public.parties.name, public.parties.invite_code
    from public.parties where public.parties.id = v_party_id;
end;
$$;

-- Join a party by invite code: looks the party up (bypassing the
-- members-only SELECT policy, deliberately, since the caller is proving
-- membership by presenting the code) and inserts the caller as a player.
create or replace function public.join_party_by_code(p_code text)
returns table(id uuid, name text)
language plpgsql security definer as $$
declare
  v_party_id uuid;
  v_party_name text;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  select public.parties.id, public.parties.name into v_party_id, v_party_name
    from public.parties where invite_code = upper(p_code);

  if v_party_id is null then
    raise exception 'Invite code not found';
  end if;

  insert into public.party_members (party_id, user_id, display_name, role)
  values (
    v_party_id,
    auth.uid(),
    coalesce((auth.jwt() -> 'user_metadata' ->> 'display_name'), split_part(auth.jwt() ->> 'email', '@', 1)),
    'player'
  )
  on conflict (party_id, user_id) do nothing;

  return query select v_party_id, v_party_name;
end;
$$;

-- Realtime: push party_members/party_snapshots changes to subscribers
-- instead of the old 15s poll.
alter publication supabase_realtime add table public.party_members;
alter publication supabase_realtime add table public.party_snapshots;

-- ============ Storage (portraits bucket) ============
-- Create the "portraits" bucket (private) in the dashboard first, then run
-- this. Portraits are stored at "{user_id}/{syncId}.jpg".
create policy "portraits_owner_rw" on storage.objects
  for all using (
    bucket_id = 'portraits' and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'portraits' and (storage.foldername(name))[1] = auth.uid()::text
  );
