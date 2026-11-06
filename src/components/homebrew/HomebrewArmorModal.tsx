import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import {
  createHomebrewArmor,
  updateHomebrewArmor,
  type CustomArmorInput,
} from "../../features/characters/gearRepo";
import { DoneAccessory } from "../DoneAccessory";

const CATEGORIES = ["Light", "Medium", "Heavy", "Shield"] as const;
const DEX_MODIFIERS = ["full", "max2", "none"] as const;
const DEX_MODIFIER_LABELS: Record<(typeof DEX_MODIFIERS)[number], string> = {
  full: "Full Dex",
  max2: "Dex (max 2)",
  none: "No Dex",
};

export type HomebrewArmorRow = { id: number } & CustomArmorInput;

export function HomebrewArmorModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewArmorRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    (initial?.category as (typeof CATEGORIES)[number]) ?? "Light"
  );
  const [baseAcText, setBaseAcText] = useState(String(initial?.baseArmorClass ?? 10));
  const [weightText, setWeightText] = useState(String(initial?.weight ?? 0));
  const [dexModifier, setDexModifier] = useState<(typeof DEX_MODIFIERS)[number]>(
    (initial?.dexModifier as (typeof DEX_MODIFIERS)[number]) ?? "full"
  );
  const [cost, setCost] = useState(initial?.cost ?? "");
  const [strengthReqText, setStrengthReqText] = useState(
    initial?.strengthRequirement != null ? String(initial.strengthRequirement) : ""
  );
  const [stealthDisadvantage, setStealthDisadvantage] = useState(initial?.stealthDisadvantage ?? false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isMagic, setIsMagic] = useState(initial?.isMagic ?? false);
  const [magicBonusText, setMagicBonusText] = useState(String(initial?.magicBonus ?? 1));

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: CustomArmorInput = {
      name: name.trim(),
      category,
      cost: cost.trim(),
      baseArmorClass: Number(baseAcText) || 10,
      dexModifier,
      strengthRequirement: strengthReqText.trim() ? Number(strengthReqText) : undefined,
      stealthDisadvantage,
      weight: Number(weightText) || 0,
      description: description.trim(),
      isMagic,
      magicBonus: isMagic ? Math.max(0, Number(magicBonusText) || 0) : 0,
    };
    if (initial) await updateHomebrewArmor(initial.id, input);
    else await createHomebrewArmor(ruleset, input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
<DoneAccessory id="done-HomebrewArmorModal" />
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Armor" : "New Homebrew Armor"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 420 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Dragonscale Mail"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={styles.subTitle}>Category</Text>
              <View style={styles.wrapRow}>
                {CATEGORIES.map((c) => (
                  <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Base AC</Text>
                  <TextInput style={styles.input} value={baseAcText} onChangeText={setBaseAcText} keyboardType="number-pad" inputAccessoryViewID="done-HomebrewArmorModal" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Weight (lb)</Text>
                  <TextInput style={styles.input} value={weightText} onChangeText={setWeightText} keyboardType="decimal-pad" inputAccessoryViewID="done-HomebrewArmorModal" />
                </View>
              </View>

              <Text style={styles.subTitle}>Dex Modifier</Text>
              <View style={styles.wrapRow}>
                {DEX_MODIFIERS.map((d) => (
                  <Pressable key={d} style={[styles.chip, dexModifier === d && styles.chipActive]} onPress={() => setDexModifier(d)}>
                    <Text style={[styles.chipText, dexModifier === d && styles.chipTextActive]}>{DEX_MODIFIER_LABELS[d]}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Cost</Text>
                  <TextInput
                    style={styles.input}
                    value={cost}
                    onChangeText={setCost}
                    placeholder="e.g. 50 gp"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Str Req. (optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={strengthReqText}
                    onChangeText={setStrengthReqText}
                    keyboardType="number-pad" inputAccessoryViewID="done-HomebrewArmorModal"
                  />
                </View>
              </View>

              <Pressable style={[styles.row, { marginTop: 10 }]} onPress={() => setStealthDisadvantage((v) => !v)}>
                <View style={[styles.squareButton, stealthDisadvantage && styles.chipActive]}>
                  <Text style={styles.squareButtonText}>{stealthDisadvantage ? "✓" : ""}</Text>
                </View>
                <Text style={styles.hint}>Stealth disadvantage</Text>
              </Pressable>

              <Text style={styles.hint}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
                value={description}
                onChangeText={setDescription}
                placeholder="What is this armor, and how is it made?"
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
                  keyboardType="number-pad" inputAccessoryViewID="done-HomebrewArmorModal"
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
