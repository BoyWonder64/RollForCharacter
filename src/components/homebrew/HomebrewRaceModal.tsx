import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import type { AbilityScoreKey } from "../../types/models";
import {
  createHomebrewRace,
  updateHomebrewRace,
  type HomebrewRaceInput,
} from "../../features/characters/homebrewRepo";
import { getRulesetCatalog } from "../../data/rulesets";
import { TraitListEditor, type NamedTrait } from "./TraitListEditor";
import { DoneAccessory } from "../DoneAccessory";

export type HomebrewRaceRow = { id: number } & HomebrewRaceInput;

const ABILITIES: { key: AbilityScoreKey; label: string }[] = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
];

export function HomebrewRaceModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewRaceRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [abilityBonuses, setAbilityBonuses] = useState<Partial<Record<AbilityScoreKey, number>>>(
    initial?.abilityBonuses ?? {}
  );
  const [size, setSize] = useState<"Small" | "Medium">(initial?.size ?? "Medium");
  const [speedText, setSpeedText] = useState(String(initial?.speed ?? 30));
  const [traits, setTraits] = useState<NamedTrait[]>(initial?.traits ?? []);

  const [baseRaceId, setBaseRaceId] = useState<string | null>(null);
  const baseRaces = useMemo(() => getRulesetCatalog(ruleset).races, [ruleset]);

  const canSave = name.trim().length > 0;

  // Subrace-style starting point: copies the chosen race's bonuses, size, speed
  // and traits into the form so the user only edits what makes theirs different.
  function pickBaseRace(raceId: string | null) {
    setBaseRaceId(raceId);
    const race = baseRaces.find((r) => r.id === raceId);
    if (!race) return;
    setAbilityBonuses({ ...race.abilityBonuses });
    setSize(race.size);
    setSpeedText(String(race.speed));
    setTraits((race.traits ?? []).map((t) => ({ name: t.name, description: t.description })));
  }

  function adjustBonus(key: AbilityScoreKey, delta: number) {
    setAbilityBonuses((prev) => ({
      ...prev,
      [key]: Math.max(-2, Math.min(3, (prev[key] ?? 0) + delta)),
    }));
  }

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewRaceInput = {
      name: name.trim(),
      abilityBonuses,
      size,
      speed: Math.max(0, Number(speedText) || 0),
      traits,
    };
    if (initial) await updateHomebrewRace(initial.id, input);
    else await createHomebrewRace(ruleset, input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
<DoneAccessory id="done-HomebrewRaceModal" />
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Race" : "New Homebrew Race"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 440 }}
              bottomOffset={60}
            >
              {!initial && baseRaces.length > 0 && (
                <>
                  <Text style={styles.subTitle}>Base Race / Subrace (optional)</Text>
                  <Text style={styles.hint}>
                    Start from an existing race or subrace, then change whatever makes yours different.
                  </Text>
                  <View style={styles.wrapRow}>
                    <Pressable
                      style={[styles.chip, baseRaceId === null && styles.chipActive]}
                      onPress={() => setBaseRaceId(null)}
                    >
                      <Text style={[styles.chipText, baseRaceId === null && styles.chipTextActive]}>
                        From scratch
                      </Text>
                    </Pressable>
                    {baseRaces.map((r) => (
                      <Pressable
                        key={r.id}
                        style={[styles.chip, baseRaceId === r.id && styles.chipActive]}
                        onPress={() => pickBaseRace(r.id)}
                      >
                        <Text style={[styles.chipText, baseRaceId === r.id && styles.chipTextActive]}>
                          {r.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              <Text style={[styles.hint, { marginTop: 12 }]}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Starborn"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={styles.subTitle}>Ability Score Bonuses</Text>
              {ABILITIES.map(({ key, label }) => {
                const value = abilityBonuses[key] ?? 0;
                return (
                  <View key={key} style={[styles.row, { marginTop: 6 }]}>
                    <Text style={[styles.hint, { flex: 1 }]}>{label}</Text>
                    <Pressable style={styles.squareButton} onPress={() => adjustBonus(key, -1)}>
                      <Text style={styles.squareButtonText}>−</Text>
                    </Pressable>
                    <Text style={[styles.sectionTitle, { minWidth: 28, textAlign: "center" }]}>
                      {value > 0 ? `+${value}` : value}
                    </Text>
                    <Pressable style={styles.squareButton} onPress={() => adjustBonus(key, 1)}>
                      <Text style={styles.squareButtonText}>+</Text>
                    </Pressable>
                  </View>
                );
              })}

              <Text style={styles.subTitle}>Size</Text>
              <View style={styles.wrapRow}>
                {(["Small", "Medium"] as const).map((s) => (
                  <Pressable key={s} style={[styles.chip, size === s && styles.chipActive]} onPress={() => setSize(s)}>
                    <Text style={[styles.chipText, size === s && styles.chipTextActive]}>{s}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.hint}>Speed (feet)</Text>
              <TextInput
                style={styles.input}
                value={speedText}
                onChangeText={setSpeedText}
                keyboardType="number-pad" inputAccessoryViewID="done-HomebrewRaceModal"
                placeholder="30"
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={{ marginTop: 12 }}>
                <TraitListEditor label="Traits" traits={traits} onChange={setTraits} />
              </View>
            </KeyboardAwareScrollView>

            <View style={[styles.row, { marginTop: 12 }]}>
              <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, { flex: 1 }, !canSave && styles.disabled]}
                disabled={!canSave}
                onPress={handleSave}
              >
                <Text style={styles.primaryButtonText}>{initial ? "Save" : "Create"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
