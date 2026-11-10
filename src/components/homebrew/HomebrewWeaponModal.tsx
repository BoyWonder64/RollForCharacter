import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import {
  createHomebrewWeapon,
  updateHomebrewWeapon,
  type CustomWeaponInput,
} from "../../features/characters/gearRepo";
import { DoneAccessory } from "../DoneAccessory";

const CATEGORIES = ["Simple Melee", "Simple Ranged", "Martial Melee", "Martial Ranged"] as const;
const DAMAGE_TYPES = ["Bludgeoning", "Piercing", "Slashing", ""] as const;

export type HomebrewWeaponRow = { id: number } & CustomWeaponInput;

export function HomebrewWeaponModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewWeaponRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    (initial?.category as (typeof CATEGORIES)[number]) ?? "Simple Melee"
  );
  const [damageDice, setDamageDice] = useState(initial?.damageDice ?? "");
  const [damageType, setDamageType] = useState<(typeof DAMAGE_TYPES)[number]>(
    (initial?.damageType as (typeof DAMAGE_TYPES)[number]) ?? ""
  );
  const [weightText, setWeightText] = useState(String(initial?.weight ?? 0));
  const [cost, setCost] = useState(initial?.cost ?? "");
  const [propertiesText, setPropertiesText] = useState((initial?.properties ?? []).join(", "));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isMagic, setIsMagic] = useState(initial?.isMagic ?? false);
  const [magicBonusText, setMagicBonusText] = useState(String(initial?.magicBonus ?? 1));

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: CustomWeaponInput = {
      name: name.trim(),
      category,
      cost: cost.trim(),
      damageDice: damageDice.trim(),
      damageType,
      weight: Number(weightText) || 0,
      properties: propertiesText
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      description: description.trim(),
      isMagic,
      magicBonus: isMagic ? Math.max(0, Number(magicBonusText) || 0) : 0,
    };
    if (initial) await updateHomebrewWeapon(initial.id, input);
    else await createHomebrewWeapon(ruleset, input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
<DoneAccessory id="done-HomebrewWeaponModal" />
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Weapon" : "New Homebrew Weapon"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 420 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Emberfang"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={[styles.subTitle]}>Category</Text>
              <View style={styles.wrapRow}>
                {CATEGORIES.map((c) => (
                  <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Damage Dice</Text>
                  <TextInput
                    style={styles.input}
                    value={damageDice}
                    onChangeText={setDamageDice}
                    placeholder="1d8"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Weight (lb)</Text>
                  <TextInput
                    style={styles.input}
                    value={weightText}
                    onChangeText={setWeightText}
                    keyboardType="decimal-pad" inputAccessoryViewID="done-HomebrewWeaponModal"
                  />
                </View>
              </View>

              <Text style={styles.subTitle}>Damage Type</Text>
              <View style={styles.wrapRow}>
                {DAMAGE_TYPES.map((t) => (
                  <Pressable key={t || "none"} style={[styles.chip, damageType === t && styles.chipActive]} onPress={() => setDamageType(t)}>
                    <Text style={[styles.chipText, damageType === t && styles.chipTextActive]}>{t || "None"}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.hint}>Cost</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="e.g. 15 gp"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.hint}>Properties (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={propertiesText}
                onChangeText={setPropertiesText}
                placeholder="Finesse, Light, Thrown (range 20/60)"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Text style={styles.hint}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
                value={description}
                onChangeText={setDescription}
                placeholder="What is this weapon, and how is it used?"
                placeholderTextColor={theme.colors.textMuted}
                multiline
              />

              <Pressable style={[styles.row, { marginTop: 10 }]} onPress={() => setIsMagic((v) => !v)}>
                <View style={[styles.squareButton, isMagic && styles.chipActive]}>
                  <Text style={styles.squareButtonText}>{isMagic ? "✓" : ""}</Text>
                </View>
                <Text style={styles.hint}>Magic item (enchanted)</Text>
              </Pressable>
              {isMagic && (
                <TextInput
                  style={styles.input}
                  value={magicBonusText}
                  onChangeText={setMagicBonusText}
                  placeholder="Enchantment bonus, e.g. 1"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad" inputAccessoryViewID="done-HomebrewWeaponModal"
                />
              )}
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
