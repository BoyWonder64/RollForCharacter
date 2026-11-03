import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Button } from "../../components/Button";
import { DmCreatureCard } from "../../components/DmCreatureCard";
import { DmCreaturePickerModal } from "../../components/DmCreaturePickerModal";
import { DmEncountersModal } from "../../components/DmEncountersModal";
import { DmInitiativeTracker } from "../../components/DmInitiativeTracker";
import { DmPartyRoller } from "../../components/DmPartyRoller";
import { DmSessionNotes } from "../../components/DmSessionNotes";
import { createDmStyles } from "../../components/dmStyles";
import { listCharacters } from "../../features/characters/characterRepo";
import {
  clearDmCreatures,
  getMonsterCatalog,
  listDmCreatures,
  listPartyInitiative,
  type DmCreatureRow,
  type MonsterCatalogRow,
} from "../../features/dm/dmCreatureRepo";
import { DIFFICULTY_LABELS, rateEncounterDifficulty } from "../../features/dm/encounterDifficulty";
import { appendRoll, type DmRollEntry, type RollSink } from "../../features/dm/rollLog";
import { useDmMode } from "../../features/settings/DmModeContext";
import { useTheme } from "../../theme/ThemeContext";
import type { Character } from "../../types/models";

type TabKey = "encounter" | "party" | "log" | "notes";

function naturalBadge(entry: DmRollEntry, styles: ReturnType<typeof createDmStyles>) {
  if (entry.natural === 20) return <Text style={styles.good}>{"  Nat 20!"}</Text>;
  if (entry.natural === 1) return <Text style={styles.bad}>{"  Nat 1"}</Text>;
  return null;
}

/**
 * DM mode's screen: build an encounter of SRD monsters and track one
 * combined initiative order (Encounter), roll for the party in bulk
 * (Party), see every roll made here (Log), and jot session-wide reminders
 * (Notes) -- tabbed the same way a character's own sheet is, so each stays
 * scrollable on its own instead of one very long page.
 */
export default function EncounterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const { dmMode } = useDmMode();

  const [activeTab, setActiveTab] = useState<TabKey>("encounter");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<DmCreatureRow[]>([]);
  const [partyInitiative, setPartyInitiativeState] = useState<Record<number, number>>({});
  const [catalog, setCatalog] = useState<MonsterCatalogRow[]>([]);
  const [log, setLog] = useState<DmRollEntry[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [encountersVisible, setEncountersVisible] = useState(false);

  const catalogById = useMemo(() => new Map(catalog.map((m) => [m.id, m])), [catalog]);

  const difficulty = useMemo(() => {
    const monsterXpValues = creatures.map((c) => (c.monsterId !== null ? catalogById.get(c.monsterId)?.xp ?? 0 : 0));
    return rateEncounterDifficulty(monsterXpValues, characters.map((c) => c.level));
  }, [creatures, catalogById, characters]);

  const refresh = useCallback(() => {
    listCharacters().then(setCharacters);
    listDmCreatures().then(setCreatures);
    listPartyInitiative().then(setPartyInitiativeState);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      getMonsterCatalog().then(setCatalog);
    }, [refresh])
  );

  const handleRoll: RollSink = useCallback((result, natural = null, dc) => {
    setLog((prev) => appendRoll(prev, result, natural, dc));
  }, []);

  function handleClearAll() {
    if (creatures.length === 0) return;
    Alert.alert("Clear the encounter?", "Removes every creature. Save it first to keep it.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearDmCreatures();
          refresh();
        },
      },
    ]);
  }

  if (!dmMode) {
    return (
      <View style={[localStyles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.hint}>Turn on DM mode in Settings to use the Encounter tab.</Text>
      </View>
    );
  }

  const latest = log[0];
  const tabs: { key: TabKey; label: string }[] = [
    { key: "encounter", label: "Encounter" },
    { key: "party", label: "Party" },
    { key: "log", label: "Log" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        {latest ? (
          <View style={styles.row}>
            <Text style={[styles.resultTotal, { fontSize: 30, minWidth: 56, textAlign: "center" }]}>
              {latest.total}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle} numberOfLines={1}>
                {latest.label}
                {naturalBadge(latest, styles)}
              </Text>
              <Text style={styles.resultBreakdown} numberOfLines={2}>
                {latest.breakdown}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>Nothing rolled yet — rolls appear here.</Text>
        )}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              numberOfLines={1}
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
              {tab.key === "log" && log.length > 0 ? ` (${log.length})` : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {activeTab === "encounter" && (
          <>
            <DmInitiativeTracker
              characters={characters}
              creatures={creatures}
              partyInitiative={partyInitiative}
              catalogById={catalogById}
              onRoll={handleRoll}
              onChanged={refresh}
            />

            <View style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>
                  Creatures{creatures.length > 0 ? ` (${creatures.length})` : ""}
                </Text>
                <View style={styles.row}>
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Saved"
                    textStyle={styles.secondaryButtonText}
                    onPress={() => setEncountersVisible(true)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    title="Clear"
                    textStyle={styles.secondaryButtonText}
                    disabled={creatures.length === 0}
                    onPress={handleClearAll}
                  />
                </View>
              </View>

              <Button
                variant="primary"
                title="+ Add creatures"
                textStyle={styles.primaryButtonText}
                fullWidth
                style={{ marginBottom: 10 }}
                onPress={() => setPickerVisible(true)}
              />

              {creatures.length > 0 && characters.length > 0 && (
                <Text style={[styles.hint, { marginBottom: 10 }]}>
                  {difficulty.band ? DIFFICULTY_LABELS[difficulty.band] : "Below Easy"} for the party ·{" "}
                  {difficulty.adjustedXp} XP (adjusted) vs {difficulty.thresholds.medium} Medium /{" "}
                  {difficulty.thresholds.deadly} Deadly
                </Text>
              )}

              {creatures.length === 0 ? (
                <Text style={styles.hint}>
                  No creatures yet. Add some from the SRD bestiary, or make your own.
                </Text>
              ) : (
                creatures.map((creature) => (
                  <DmCreatureCard
                    key={creature.id}
                    creature={creature}
                    monster={creature.monsterId !== null ? catalogById.get(creature.monsterId) : undefined}
                    onRoll={handleRoll}
                    onChanged={refresh}
                  />
                ))
              )}
            </View>
          </>
        )}

        {activeTab === "party" && (
          <DmPartyRoller characters={characters} onRoll={handleRoll} onChanged={refresh} />
        )}

        {activeTab === "log" && (
          <View>
            {log.length === 0 ? (
              <Text style={styles.hint}>Nothing rolled yet — rolls made anywhere in DM mode appear here.</Text>
            ) : (
              <>
                <View style={styles.headerRow}>
                  <Text style={styles.sectionTitle}>Roll log</Text>
                  <Pressable onPress={() => setLog([])}>
                    <Text style={styles.bad}>Clear</Text>
                  </Pressable>
                </View>
                {log.map((entry) => (
                  <View key={entry.id} style={[styles.card, styles.row, { paddingVertical: 8 }]}>
                    <Text style={[styles.resultTotal, { width: 44, textAlign: "center", fontSize: 18 }]}>
                      {entry.total}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sectionTitle} numberOfLines={1}>
                        {entry.label}
                        {naturalBadge(entry, styles)}
                      </Text>
                      <Text style={styles.resultBreakdown} numberOfLines={2}>
                        {entry.breakdown}
                      </Text>
                    </View>
                    {entry.dc !== undefined && (
                      <Text style={entry.total >= entry.dc ? styles.good : styles.bad}>
                        {entry.total >= entry.dc ? "Pass" : "Fail"}
                      </Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {activeTab === "notes" && <DmSessionNotes />}
      </ScrollView>

      <DmCreaturePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onChanged={refresh}
      />
      <DmEncountersModal
        visible={encountersVisible}
        hasCreatures={creatures.length > 0}
        onClose={() => setEncountersVisible(false)}
        onChanged={refresh}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
});
