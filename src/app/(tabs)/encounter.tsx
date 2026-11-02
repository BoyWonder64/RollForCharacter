import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { DmCreatureCard } from "../../components/DmCreatureCard";
import { DmCreaturePickerModal } from "../../components/DmCreaturePickerModal";
import { DmEncountersModal } from "../../components/DmEncountersModal";
import { DmInitiativeTracker } from "../../components/DmInitiativeTracker";
import { DmPartyRoller } from "../../components/DmPartyRoller";
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
import { appendRoll, type DmRollEntry, type RollSink } from "../../features/dm/rollLog";
import { useDmMode } from "../../features/settings/DmModeContext";
import { useTheme } from "../../theme/ThemeContext";
import type { Character } from "../../types/models";

function naturalBadge(entry: DmRollEntry, styles: ReturnType<typeof createDmStyles>) {
  if (entry.natural === 20) return <Text style={styles.good}>{"  Nat 20!"}</Text>;
  if (entry.natural === 1) return <Text style={styles.bad}>{"  Nat 1"}</Text>;
  return null;
}

/**
 * DM mode's encounter screen: roll for the party (Party roller), build an
 * encounter of SRD monsters, track one combined initiative order, and roll
 * anything on a creature's stat block. Creature rolls are shown here and
 * deliberately never written to the roll history, since they're the DM's.
 */
export default function EncounterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const { dmMode } = useDmMode();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [creatures, setCreatures] = useState<DmCreatureRow[]>([]);
  const [partyInitiative, setPartyInitiativeState] = useState<Record<number, number>>({});
  const [catalog, setCatalog] = useState<MonsterCatalogRow[]>([]);
  const [log, setLog] = useState<DmRollEntry[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [encountersVisible, setEncountersVisible] = useState(false);

  const catalogById = useMemo(() => new Map(catalog.map((m) => [m.id, m])), [catalog]);

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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <View style={styles.row}>
          <Pressable style={[styles.primaryButton, { flex: 1 }]} onPress={() => setPickerVisible(true)}>
            <Text style={styles.primaryButtonText}>+ Add creatures</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setEncountersVisible(true)}>
            <Text style={styles.secondaryButtonText}>Saved</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, creatures.length === 0 && styles.disabled]}
            disabled={creatures.length === 0}
            onPress={handleClearAll}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </Pressable>
        </View>

        <DmPartyRoller characters={characters} onRoll={handleRoll} onChanged={refresh} />

        <DmInitiativeTracker
          characters={characters}
          creatures={creatures}
          partyInitiative={partyInitiative}
          catalogById={catalogById}
          onRoll={handleRoll}
          onChanged={refresh}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
            Creatures{creatures.length > 0 ? ` (${creatures.length})` : ""}
          </Text>
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

        {log.length > 1 && (
          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Roll log</Text>
              <Pressable onPress={() => setLog([])}>
                <Text style={styles.bad}>Clear</Text>
              </Pressable>
            </View>
            {log.slice(1).map((entry) => (
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
          </View>
        )}
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
