import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { CreatePartyModal } from "../../components/CreatePartyModal";
import { JoinPartyModal } from "../../components/JoinPartyModal";
import { createDmStyles } from "../../components/dmStyles";
import { listCharacters } from "../../features/characters/characterRepo";
import { useAuth } from "../../features/auth/AuthContext";
import {
  getPartyVisibility,
  getSelectedPartyCharacterId,
  setPartyVisibility as savePartyVisibility,
  setSelectedPartyCharacterId as saveSelectedPartyCharacterId,
} from "../../features/party/partyPrefs";
import {
  disbandParty,
  getMyParty,
  kickMember,
  leaveParty,
  pushSnapshot,
  subscribeToParty,
  type MyPartyView,
  type PartyMemberView,
} from "../../features/party/partyRepo";
import {
  DEFAULT_PARTY_VISIBILITY,
  PARTY_VISIBILITY_SECTIONS,
  buildPartySnapshot,
  type PartyVisibility,
} from "../../features/party/partySnapshot";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { Character } from "../../types/models";

function SignedOutNotice({ styles }: { styles: ReturnType<typeof createDmStyles> }) {
  const theme = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.sectionTitle}>Sign in to use Party mode</Text>
      <Text style={[styles.hint, { marginBottom: 12 }]}>
        Party mode connects your characters with other players over the cloud so a DM can
        review the party remotely. Sign in from Settings to turn it on.
      </Text>
      <Pressable style={styles.primaryButton} onPress={() => router.push("/(tabs)/settings")}>
        <Text style={styles.primaryButtonText}>Go to Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

function MemberCard({
  member,
  styles,
  onKick,
}: {
  member: PartyMemberView;
  styles: ReturnType<typeof createDmStyles>;
  onKick?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const data = member.data;

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded((v) => !v)}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>
              {member.name ?? member.displayName}
              {member.role === "dm" ? "  (DM)" : ""}
            </Text>
            <Text style={styles.hint}>
              {member.className
                ? `${member.race} ${member.className} · Level ${member.level}`
                : "Hasn't shared a character yet"}
            </Text>
          </View>
          <Text style={styles.hint}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={{ marginTop: 8, gap: 4 }}>
          {data?.stats && (
            <Text style={styles.hint}>
              HP {data.stats.currentHp}/{data.stats.maxHp} · AC {data.stats.armorClass}
              {data.stats.conditions.length > 0 ? ` · ${data.stats.conditions.join(", ")}` : ""}
              {data.stats.inspiration ? " · Inspired" : ""}
            </Text>
          )}
          {data?.inventory && (
            <Text style={styles.hint}>
              Carrying:{" "}
              {[...data.inventory.weapons, ...data.inventory.armor].map((i) => i.name).join(", ") ||
                "nothing listed"}
            </Text>
          )}
          {data?.spells && (
            <Text style={styles.hint}>
              Spells: {data.spells.spells.map((s) => s.name).join(", ") || "none"}
            </Text>
          )}
          {data?.notes?.characterNotes ? (
            <Text style={styles.hint}>{data.notes.characterNotes}</Text>
          ) : null}
          {!data && <Text style={styles.hint}>Nothing shared yet.</Text>}
          {onKick && (
            <Pressable style={[styles.secondaryButton, { marginTop: 8 }]} onPress={onKick}>
              <Text style={styles.secondaryButtonText}>Remove from party</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function createLocalStyles(theme: Theme) {
  return StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
    },
  });
}

export default function PartyScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const localStyles = useMemo(() => createLocalStyles(theme), [theme]);
  const { user, loading: authLoading, signOut } = useAuth();

  const [partyView, setPartyView] = useState<MyPartyView | null>(null);
  const [partyLoading, setPartyLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<PartyVisibility>(DEFAULT_PARTY_VISIBILITY);
  const [createVisible, setCreateVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);

  useEffect(() => {
    listCharacters().then(setCharacters);
    getSelectedPartyCharacterId().then(setSelectedCharacterId);
    getPartyVisibility().then(setVisibility);
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setPartyLoading(false);
      return;
    }
    try {
      const view = await getMyParty();
      setPartyView(view);
      if (view && view.role === "player" && selectedCharacterId) {
        const snapshot = await buildPartySnapshot(selectedCharacterId, visibility);
        if (snapshot) await pushSnapshot(view.party.id, snapshot);
      }
    } finally {
      setPartyLoading(false);
    }
  }, [user, selectedCharacterId, visibility]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Live updates instead of polling: re-fetch whenever the roster or any
  // member's shared snapshot changes.
  useEffect(() => {
    if (!partyView) return;
    const channel = subscribeToParty(partyView.party.id, refresh);
    return () => {
      channel.unsubscribe();
    };
    // Resubscribe only when the party itself changes, not on every refresh --
    // `refresh()` itself sets `partyView`, so including the whole object
    // would tear down and recreate the channel on every snapshot update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyView?.party.id, refresh]);

  function selectCharacter(characterId: number) {
    setSelectedCharacterId(characterId);
    saveSelectedPartyCharacterId(characterId);
  }

  function toggleVisibility(key: keyof PartyVisibility) {
    setVisibility((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePartyVisibility(next);
      return next;
    });
  }

  function handleLeave() {
    if (!partyView) return;
    const isDm = partyView.role === "dm";
    Alert.alert(isDm ? "Disband the party?" : "Leave the party?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: isDm ? "Disband" : "Leave",
        style: "destructive",
        onPress: async () => {
          if (isDm) await disbandParty(partyView.party.id);
          else await leaveParty(partyView.party.id);
          setPartyView(null);
        },
      },
    ]);
  }

  async function handleKick(memberUserId: string) {
    if (!partyView) return;
    await kickMember(partyView.party.id, memberUserId);
    refresh();
  }

  if (authLoading) {
    return (
      <View style={[localStyles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <SignedOutNotice styles={styles} />;
  }

  if (partyLoading) {
    return (
      <View style={[localStyles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const teammates = partyView?.members.filter((m) => m.userId !== user.id) ?? [];
  const players = partyView?.members.filter((m) => m.role !== "dm") ?? [];
  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? "you";

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Signed in as {displayName}</Text>
          <Pressable onPress={signOut}>
            <Text style={styles.bad}>Sign out</Text>
          </Pressable>
        </View>

        {!partyView ? (
          <View style={styles.section}>
            <Text style={styles.hint}>
              You&apos;re not in a party yet. Create one as the DM, or join one with an invite code.
            </Text>
            <View style={[styles.wrapRow, { marginTop: 10 }]}>
              <Pressable style={styles.primaryButton} onPress={() => setCreateVisible(true)}>
                <Text style={styles.primaryButtonText}>Create a party</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => setJoinVisible(true)}>
                <Text style={styles.secondaryButtonText}>Join with code</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>{partyView.party.name}</Text>
                <Pressable style={styles.dangerButton} onPress={handleLeave}>
                  <Text style={styles.dangerButtonText}>
                    {partyView.role === "dm" ? "Disband" : "Leave"}
                  </Text>
                </Pressable>
              </View>
              {partyView.party.inviteCode && (
                <View style={styles.card}>
                  <Text style={styles.hint}>Invite code</Text>
                  <Text style={[styles.sectionTitle, { letterSpacing: 3 }]}>
                    {partyView.party.inviteCode}
                  </Text>
                </View>
              )}
            </View>

            {partyView.role === "player" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Share your character</Text>
                <Text style={styles.hint}>
                  Pick which character represents you, then choose what the DM can see.
                </Text>
                <View style={[styles.wrapRow, { marginTop: 8 }]}>
                  {characters.map((c) => (
                    <Pressable
                      key={c.id}
                      style={[styles.chip, selectedCharacterId === c.id && styles.chipActive]}
                      onPress={() => selectCharacter(c.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedCharacterId === c.id && styles.chipTextActive,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                  {characters.length === 0 && (
                    <Text style={styles.hint}>Create a character first, on the Characters tab.</Text>
                  )}
                </View>

                {selectedCharacterId && (
                  <View style={{ marginTop: 12, gap: 8 }}>
                    {PARTY_VISIBILITY_SECTIONS.map((section) => (
                      <View key={section.key} style={localStyles.toggleRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.sectionTitle}>{section.label}</Text>
                          <Text style={styles.hint}>{section.hint}</Text>
                        </View>
                        <Switch
                          value={visibility[section.key]}
                          onValueChange={() => toggleVisibility(section.key)}
                          trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.primary }}
                          thumbColor={theme.colors.primaryText}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {partyView.role === "dm" ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Party</Text>
                {players.length === 0 ? (
                  <Text style={styles.hint}>
                    No players have joined yet — share the invite code above.
                  </Text>
                ) : (
                  players.map((member) => (
                    <MemberCard
                      key={member.memberId}
                      member={member}
                      styles={styles}
                      onKick={() => handleKick(member.userId)}
                    />
                  ))
                )}
              </View>
            ) : (
              teammates.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Party</Text>
                  {teammates.map((member) => (
                    <MemberCard key={member.memberId} member={member} styles={styles} />
                  ))}
                </View>
              )
            )}
          </>
        )}
      </ScrollView>

      <CreatePartyModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreated={() => {
          setCreateVisible(false);
          refresh();
        }}
      />
      <JoinPartyModal
        visible={joinVisible}
        onClose={() => setJoinVisible(false)}
        onJoined={() => {
          setJoinVisible(false);
          refresh();
        }}
      />
    </View>
  );
}
