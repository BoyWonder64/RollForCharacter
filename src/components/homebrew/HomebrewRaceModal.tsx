import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import type { AbilityScoreKey } from "../../types/models";
import {
  createHomebrewRace,
  updateHomebrewRace,
  type HomebrewRaceInput,
} from "../../features/characters/homebrewRepo";
import { TraitListEditor, type NamedTrait } from "./TraitListEditor";

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

  const canSave = name.trim().length > 0;

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
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Race" : "New Homebrew Race"}</Text>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 440 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
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
                keyboardType="number-pad"
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
        <KeyboardToolbar />
      </View>
    </Modal>
  );
}
