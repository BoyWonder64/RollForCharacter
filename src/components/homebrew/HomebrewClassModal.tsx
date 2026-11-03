import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import type { AbilityScoreKey } from "../../types/models";
import {
  createHomebrewClass,
  updateHomebrewClass,
  type HomebrewClassInput,
} from "../../features/characters/homebrewRepo";
import { TraitListEditor, type NamedTrait } from "./TraitListEditor";

export type HomebrewClassRow = { id: number } & HomebrewClassInput;

const ABILITIES: { key: AbilityScoreKey; label: string }[] = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
];

const HIT_DICE = [6, 8, 10, 12] as const;

export function HomebrewClassModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewClassRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [hitDie, setHitDie] = useState<(typeof HIT_DICE)[number]>(
    (initial?.hitDie as (typeof HIT_DICE)[number]) ?? 8
  );
  const [savingThrows, setSavingThrows] = useState<AbilityScoreKey[]>(initial?.savingThrows ?? []);
  const [armorProficiencies, setArmorProficiencies] = useState((initial?.armorProficiencies ?? []).join(", "));
  const [weaponProficiencies, setWeaponProficiencies] = useState(
    (initial?.weaponProficiencies ?? []).join(", ")
  );
  const [traits, setTraits] = useState<NamedTrait[]>(initial?.traits ?? []);

  const canSave = name.trim().length > 0;

  function toggleSavingThrow(key: AbilityScoreKey) {
    setSavingThrows((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 2) return prev;
      return [...prev, key];
    });
  }

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewClassInput = {
      name: name.trim(),
      hitDie,
      savingThrows,
      armorProficiencies: armorProficiencies
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      weaponProficiencies: weaponProficiencies
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      traits,
    };
    if (initial) await updateHomebrewClass(initial.id, input);
    else await createHomebrewClass(ruleset, input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Class" : "New Homebrew Class"}</Text>
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
                placeholder="e.g. Runeblade"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={styles.subTitle}>Hit Die</Text>
              <View style={styles.wrapRow}>
                {HIT_DICE.map((die) => (
                  <Pressable key={die} style={[styles.chip, hitDie === die && styles.chipActive]} onPress={() => setHitDie(die)}>
                    <Text style={[styles.chipText, hitDie === die && styles.chipTextActive]}>d{die}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.subTitle}>Saving Throw Proficiencies (choose {savingThrows.length}/2)</Text>
              <View style={styles.wrapRow}>
                {ABILITIES.map(({ key, label }) => {
                  const selected = savingThrows.includes(key);
                  return (
                    <Pressable key={key} style={[styles.chip, selected && styles.chipActive]} onPress={() => toggleSavingThrow(key)}>
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.hint}>Armor Proficiencies</Text>
              <TextInput
                style={styles.input}
                value={armorProficiencies}
                onChangeText={setArmorProficiencies}
                placeholder="e.g. Light armor, Shields"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.hint}>Weapon Proficiencies</Text>
              <TextInput
                style={styles.input}
                value={weaponProficiencies}
                onChangeText={setWeaponProficiencies}
                placeholder="e.g. Simple weapons, Shortswords"
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
