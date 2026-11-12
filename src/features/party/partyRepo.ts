import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../supabase/supabaseClient";
import type { PartySnapshotPayload, PartyVisibility } from "./partySnapshot";

export type PartyRole = "dm" | "player";

export type PartyMemberView = {
  memberId: string;
  userId: string;
  displayName: string;
  role: PartyRole;
  name: string | null;
  race: string | null;
  className: string | null;
  level: number | null;
  data: PartySnapshotPayload["data"] | null;
  visibility: PartyVisibility | null;
};

export type MyPartyView = {
  party: { id: string; name: string; inviteCode?: string };
  role: PartyRole;
  members: PartyMemberView[];
};

type CreatePartyRpcResult = { id: string; name: string; invite_code: string };
type JoinPartyRpcResult = { id: string; name: string };

export async function createParty(name: string): Promise<{ party: { id: string; name: string; inviteCode: string }; role: "dm" }> {
  const { data, error } = await supabase.rpc("create_party", { p_name: name }).single();
  if (error) throw error;
  const result = data as CreatePartyRpcResult;
  return {
    party: { id: result.id, name: result.name, inviteCode: result.invite_code },
    role: "dm",
  };
}

export async function joinParty(inviteCode: string): Promise<{ party: { id: string; name: string }; role: "player" }> {
  const { data, error } = await supabase.rpc("join_party_by_code", { p_code: inviteCode }).single();
  if (error) throw error;
  const result = data as JoinPartyRpcResult;
  return { party: { id: result.id, name: result.name }, role: "player" };
}

export async function getMyParty(): Promise<MyPartyView | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: myMembership, error: membershipError } = await supabase
    .from("party_members")
    .select("party_id, role")
    .eq("user_id", user.id)
    // Nothing stops an account joining a second party; without a limit,
    // maybeSingle() errors on two rows and the Party tab stops loading.
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (membershipError) throw membershipError;
  if (!myMembership) return null;

  const { data: party, error: partyError } = await supabase
    .from("parties")
    .select("id, name, invite_code, dm_user_id")
    .eq("id", myMembership.party_id)
    .single();
  if (partyError) throw partyError;

  const { data: members, error: membersError } = await supabase
    .from("party_members")
    .select("id, user_id, display_name, role, party_snapshots(character_client_sync_id, name, race, class_name, level, visibility, data)")
    .eq("party_id", party.id);
  if (membersError) throw membersError;

  const role: PartyRole = party.dm_user_id === user.id ? "dm" : "player";

  return {
    party: { id: party.id, name: party.name, inviteCode: role === "dm" ? party.invite_code : undefined },
    role,
    members: members.map((m) => {
      const snapshot = Array.isArray(m.party_snapshots) ? m.party_snapshots[0] : m.party_snapshots;
      return {
        memberId: m.id,
        userId: m.user_id,
        displayName: m.display_name,
        role: m.role as PartyRole,
        name: snapshot?.name ?? null,
        race: snapshot?.race ?? null,
        className: snapshot?.class_name ?? null,
        level: snapshot?.level ?? null,
        data: snapshot?.data ?? null,
        visibility: snapshot?.visibility ?? null,
      };
    }),
  };
}

export async function pushSnapshot(partyId: string, snapshot: PartySnapshotPayload): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("Not signed in");

  const { data: member, error: memberError } = await supabase
    .from("party_members")
    .select("id")
    .eq("party_id", partyId)
    .eq("user_id", user.id)
    .single();
  if (memberError) throw memberError;

  const { error } = await supabase.from("party_snapshots").upsert({
    party_member_id: member.id,
    character_client_sync_id: snapshot.characterSyncId,
    name: snapshot.name,
    race: snapshot.race,
    class_name: snapshot.className,
    level: snapshot.level,
    visibility: snapshot.visibility,
    data: snapshot.data,
  });
  if (error) throw error;
}

export async function leaveParty(partyId: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;
  const { error } = await supabase
    .from("party_members")
    .delete()
    .eq("party_id", partyId)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function kickMember(partyId: string, memberUserId: string): Promise<void> {
  const { error } = await supabase
    .from("party_members")
    .delete()
    .eq("party_id", partyId)
    .eq("user_id", memberUserId);
  if (error) throw error;
}

export async function disbandParty(partyId: string): Promise<void> {
  const { error } = await supabase.from("parties").delete().eq("id", partyId);
  if (error) throw error;
}

/** Live updates for a party's roster/snapshots -- replaces the old 15s poll. */
export function subscribeToParty(partyId: string, onChange: () => void): RealtimeChannel {
  return supabase
    .channel(`party-${partyId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "party_members", filter: `party_id=eq.${partyId}` },
      onChange
    )
    .on("postgres_changes", { event: "*", schema: "public", table: "party_snapshots" }, onChange)
    .subscribe();
}
