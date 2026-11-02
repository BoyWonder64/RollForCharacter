import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { abilityModifier } from "../features/characters/characterCalculations";
import {
  clearAllInitiative,
  setDmCreatureInitiative,
  setPartyInitiative,
  type DmCreatureRow,
  type MonsterCatalogRow,
} from "../features/dm/dmCreatureRepo";
import { rollMonsterInitiative } from "../features/dm/monsterRolls";
import type { RollSink } from "../features/dm/rollLog";
import type { Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

type Combatant = {
  key: string;
  name: string;
  kind: "party" | "creature";
  id: number;
  initiative: number | null;
  tiebreak: number;
  down: boolean;
};

/**
 * One combined initiative order for the party and every creature, with a
 * round counter and a Next-turn button. Values are editable (type in a
 * player's real roll). "Roll creatures" rolls every creature without an
 * initiative yet; with "group" on, creatures from the same stat block share
 * one roll, the way the DMG suggests for a big pack.
 */
export function DmInitiativeTracker({
  characters,
  creatures,
  partyInitiative,
  catalogById,
  onRoll,
  onChanged,
}: {
  characters: Character[];
  creatures: DmCreatureRow[];
  partyInitiative: Record<number, number>;
  catalogById: Map<number, MonsterCatalogRow>;
  onRoll: RollSink;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [group, setGroup] = useState(false);
  const [round, setRound] = useState(1);
  const [turnKey, setTurnKey] = useState<string | null>(null);

  const combatants: Combatant[] = [
    ...characters.map<Combatant>((c) => ({
      key: `p${c.id}`,
      name: c.name,
      kind: "party",
      id: c.id,
      initiative: partyInitiative[c.id] ?? null,
      tiebreak: abilityModifier(c.dexterity),
      down: false,
    })),
    ...creatures.map<Combatant>((c) => ({
      key: `c${c.id}`,
      name: c.name,
      kind: "creature",
      id: c.id,
      initiative: c.initiative,
      tiebreak: abilityModifier(catalogById.get(c.monsterId ?? -1)?.dexterity ?? c.dexterity),
      down: c.currentHp <= 0,
    })),
  ];

  const ordered = combatants
    .filter((c) => c.initiative !== null)
    .sort((a, b) => (b.initiative as number) - (a.initiative as number) || b.tiebreak - a.tiebreak);
  const waiting = combatants.filter((c) => c.initiative === null);

  const currentIndex = ordered.findIndex((c) => c.key === turnKey);

  function nextTurn() {
    if (ordered.length === 0) return;
    const next = currentIndex + 1;
    if (currentIndex === -1) {
      setTurnKey(ordered[0].key);
    } else if (next >= ordered.length) {
      setRound((r) => r + 1);
      setTurnKey(ordered[0].key);
    } else {
      setTurnKey(ordered[next].key);
    }
  }

  async function rollCreatures() {
    const pending = creatures.filter((c) => c.initiative === null);
    const sharedByMonster = new Map<number, number>();
    for (const creature of pending) {
      const monster = catalogById.get(creature.monsterId ?? -1);
      const dex = monster?.dexterity ?? creature.dexterity;
      let total = creature.monsterId !== null ? sharedByMonster.get(creature.monsterId) : undefined;
      if (total === undefined || !group || creature.monsterId === null) {
        const label = group && monster ? `${monster.name} (group)` : creature.name;
        const outcome = rollMonsterInitiative(label, dex);
        onRoll(outcome, outcome.natural);
        total = outcome.total;
        if (group && creature.monsterId !== null) sharedByMonster.set(creature.monsterId, total);
      }
      await setDmCreatureInitiative(creature.id, total);
    }
    onChanged();
  }

  async function handleReset() {
    await clearAllInitiative();
    setRound(1);
    setTurnKey(null);
    onChanged();
  }

  async function handleEdit(combatant: Combatant, text: string) {
    const trimmed = text.trim();
    const value = trimmed === "" ? null : parseInt(trimmed, 10);
    if (value !== null && !Number.isFinite(value)) return;
    if (combatant.kind === "party") await setPartyInitiative(combatant.id, value);
    else await setDmCreatureInitiative(combatant.id, value);
    onChanged();
  }

  function renderRow(combatant: Combatant) {
    const active = combatant.key === turnKey;
    return (
      <View
        key={combatant.key}
        style={[
          styles.row,
          {
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: active ? theme.colors.surfaceAlt : "transparent",
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { width: 14 }]}>{active ? "▶" : ""}</Text>
        <TextInput
          style={styles.smallInput}
          defaultValue={combatant.initiative === null ? "" : String(combatant.initiative)}
          key={`${combatant.key}-${combatant.initiative}`}
          placeholder="—"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numbers-and-punctuation"
          onEndEditing={(e) => handleEdit(combatant, e.nativeEvent.text)}
        />
        <Text
          style={[
            styles.sectionTitle,
            { flex: 1 },
            combatant.down && { textDecorationLine: "line-through", color: theme.colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {combatant.name}
        </Text>
        <Text style={styles.hint}>{combatant.kind === "party" ? "Party" : "Foe"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Initiative · Round {round}</Text>
        <View style={styles.row}>
          <Pressable style={styles.secondaryButton} onPress={handleReset}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, ordered.length === 0 && styles.disabled]}
            disabled={ordered.length === 0}
            onPress={nextTurn}
          >
            <Text style={styles.primaryButtonText}>
              {currentIndex === -1 ? "Start" : "Next turn"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={[styles.row, { flexWrap: "wrap" }]}>
          <Pressable
            style={[styles.secondaryButton, creatures.every((c) => c.initiative !== null) && styles.disabled]}
            disabled={creatures.every((c) => c.initiative !== null)}
            onPress={rollCreatures}
          >
            <Text style={styles.secondaryButtonText}>Roll creatures</Text>
          </Pressable>
          <Pressable style={[styles.chip, group && styles.chipActive]} onPress={() => setGroup((v) => !v)}>
            <Text style={[styles.chipText, group && styles.chipTextActive]}>
              Group same type
            </Text>
          </Pressable>
        </View>
        <Text style={[styles.hint, { marginTop: 6 }]}>
          Roll party initiative from the Party roller, or type a value in any row. Ties go to the
          higher DEX.
        </Text>

        {ordered.length === 0 && waiting.length === 0 ? (
          <Text style={[styles.hint, { marginTop: 8 }]}>Nobody is in the encounter yet.</Text>
        ) : (
          <View style={{ marginTop: 8 }}>
            {ordered.map(renderRow)}
            {waiting.length > 0 && (
              <>
                <Text style={styles.subTitle}>Not rolled</Text>
                {waiting.map(renderRow)}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
