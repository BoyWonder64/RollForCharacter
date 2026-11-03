import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import type { AbilityScoreKey } from "../types/models";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import {
  CAMPAIGN_ITEM_ICON_IDS,
  CAMPAIGN_ITEM_ICON_LABELS,
  getCampaignItemIcon,
  type CampaignItemIconId,
} from "../features/icons/iconAssets";
import { isValidRollFormula, ROLL_FORMULA_TOKENS } from "../features/dice/rollFormula";
import {
  formatLevelBreakpoints,
  parseLevelBreakpoints,
  type CustomResourceInput,
  type CustomResourceMaxMode,
  type CustomResourceRecharge,
} from "../features/characters/resourceRepo";

const ABILITIES: { key: AbilityScoreKey; label: string }[] = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
];

const MAX_MODES: { id: CustomResourceMaxMode; label: string }[] = [
  { id: "fixed", label: "Fixed" },
  { id: "level", label: "By level" },
  { id: "ability", label: "Ability mod" },
];

const RECHARGES: { id: CustomResourceRecharge; label: string }[] = [
  { id: "short", label: "Short rest" },
  { id: "long", label: "Long rest" },
  { id: "manual", label: "Manual" },
];

type CustomResourceModalProps = {
  visible: boolean;
  /** Pre-fills the form when editing; omit to create a new resource. */
  initial?: CustomResourceInput;
  onClose: () => void;
  onConfirm: (input: CustomResourceInput) => void;
  /** Shown as a Delete button only when editing. */
  onDelete?: () => void;
};

export function CustomResourceModal(props: CustomResourceModalProps) {
  const { visible, onClose } = props;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>{visible && <CustomResourceForm {...props} />}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CustomResourceForm({ initial, onClose, onConfirm, onDelete }: CustomResourceModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [maxMode, setMaxMode] = useState<CustomResourceMaxMode>(initial?.maxMode ?? "fixed");
  const [fixedMax, setFixedMax] = useState(String(initial?.fixedMax ?? 1));
  const [breakpoints, setBreakpoints] = useState(formatLevelBreakpoints(initial?.usesByLevel ?? {}));
  const [ability, setAbility] = useState<AbilityScoreKey>(initial?.ability ?? "charisma");
  const [abilityBonus, setAbilityBonus] = useState(String(initial?.abilityBonus ?? 0));
  const [abilityMinimum, setAbilityMinimum] = useState(String(initial?.abilityMinimum ?? 1));
  const [rechargeOn, setRechargeOn] = useState<CustomResourceRecharge>(initial?.rechargeOn ?? "long");
  const [isPointPool, setIsPointPool] = useState(initial?.isPointPool ?? false);
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [rollFormula, setRollFormula] = useState(initial?.rollFormula ?? "");
  const { iconsEnabled, iconStyle } = useIconSettings();

  const parsedBreakpoints = parseLevelBreakpoints(breakpoints);
  const rollFormulaOk = rollFormula.trim() === "" || isValidRollFormula(rollFormula);
  const canSave =
    name.trim().length > 0 &&
    rollFormulaOk &&
    (maxMode !== "fixed" || Number(fixedMax) >= 1) &&
    (maxMode !== "level" || Object.keys(parsedBreakpoints).length > 0);

  function handleConfirm() {
    if (!canSave) return;
    onConfirm({
      name: name.trim(),
      description: description.trim(),
      maxMode,
      fixedMax: Math.max(1, Number(fixedMax) || 1),
      usesByLevel: parsedBreakpoints,
      ability,
      abilityBonus: Number(abilityBonus) || 0,
      abilityMinimum: Math.max(0, Number(abilityMinimum) || 0),
      rechargeOn,
      isPointPool,
      icon,
      rollFormula: rollFormula.trim(),
    });
  }

  return (
    <View style={styles.card}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{initial ? "Edit Ability" : "Create Ability"}</Text>

        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Second Wind, Wild Surge"
          placeholderTextColor={theme.colors.textMuted}
          autoFocus={!initial}
        />

        <Text style={styles.fieldLabel}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="What it does…"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />

        <Text style={styles.fieldLabel}>Number of uses</Text>
        <ChipRow options={MAX_MODES} value={maxMode} onChange={setMaxMode} styles={styles} />
        {maxMode === "fixed" && (
          <TextInput
            style={[styles.input, styles.shortInput]}
            value={fixedMax}
            onChangeText={setFixedMax}
            keyboardType="number-pad"
          />
        )}
        {maxMode === "level" && (
          <>
            <TextInput
              style={[styles.input, styles.spacedInput]}
              value={breakpoints}
              onChangeText={setBreakpoints}
              placeholder="level:uses, e.g. 1:1, 5:2, 11:3"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>
              Total uses from each listed level on. Hidden until the first listed level is reached.
            </Text>
          </>
        )}
        {maxMode === "ability" && (
          <>
            <ChipRow
              options={ABILITIES.map((a) => ({ id: a.key, label: a.label }))}
              value={ability}
              onChange={setAbility}
              styles={styles}
            />
            <View style={[styles.pairRow, styles.spacedInput]}>
              <View style={styles.pairCell}>
                <Text style={styles.fieldLabel}>Bonus</Text>
                <TextInput
                  style={styles.input}
                  value={abilityBonus}
                  onChangeText={setAbilityBonus}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.pairCell}>
                <Text style={styles.fieldLabel}>Minimum</Text>
                <TextInput
                  style={styles.input}
                  value={abilityMinimum}
                  onChangeText={setAbilityMinimum}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <Text style={styles.hint}>Uses = ability modifier + bonus, never below the minimum.</Text>
          </>
        )}

        <Text style={styles.fieldLabel}>Recharges on</Text>
        <ChipRow options={RECHARGES} value={rechargeOn} onChange={setRechargeOn} styles={styles} />
        <Text style={styles.hint}>
          {rechargeOn === "short"
            ? "Fully restored by a short or long rest."
            : rechargeOn === "long"
              ? "Fully restored by a long rest."
              : "Never restored by resting. Use the controls to change it."}
        </Text>

        <Text style={styles.fieldLabel}>Display</Text>
        <ChipRow
          options={[
            { id: "pips", label: "Dots" },
            { id: "counter", label: "Counter (+/-)" },
          ]}
          value={isPointPool ? "counter" : "pips"}
          onChange={(id) => setIsPointPool(id === "counter")}
          styles={styles}
        />
        <Text style={styles.hint}>
          {isPointPool
            ? "A number with + and - buttons. Best for big pools, like 20 hit points of healing."
            : "A row of dots, one per use. Tap a dot to spend or restore a use. Best for a few uses, like 2 or 3."}
        </Text>

        <Text style={styles.fieldLabel}>Roll (optional)</Text>
        <TextInput
          style={[styles.input, !rollFormulaOk && styles.inputInvalid]}
          value={rollFormula}
          onChangeText={setRollFormula}
          placeholder="e.g. 1d10 + level"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={[styles.hint, !rollFormulaOk && styles.hintInvalid]}>
          {rollFormulaOk
            ? `Dice, plus any of: ${ROLL_FORMULA_TOKENS.join(", ")} (ability names mean the modifier). Adds a Roll button.`
            : "Not a valid roll. Use dice like 1d10, optionally + level, prof, or an ability."}
        </Text>

        <Text style={styles.fieldLabel}>Icon (optional)</Text>
        <View style={styles.iconGrid}>
          <Pressable onPress={() => setIcon("")} style={[styles.iconChip, icon === "" && styles.iconChipActive]}>
            <Text style={styles.iconFallback}>None</Text>
          </Pressable>
          {CAMPAIGN_ITEM_ICON_IDS.map((id: CampaignItemIconId) => {
            const source = iconsEnabled ? getCampaignItemIcon(iconStyle, id) : undefined;
            return (
              <Pressable key={id} onPress={() => setIcon(id)} style={[styles.iconChip, icon === id && styles.iconChipActive]}>
                {source ? (
                  <Image source={source} style={styles.iconImage} resizeMode="contain" />
                ) : (
                  <Text style={styles.iconFallback}>{CAMPAIGN_ITEM_ICON_LABELS[id][0]}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        {onDelete && (
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.addButton, !canSave && styles.disabled]} disabled={!canSave} onPress={handleConfirm}>
          <Text style={styles.addButtonText}>{initial ? "Save" : "Create"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ChipRow<T extends string>({
  options,
  value,
  onChange,
  styles,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 400,
      maxHeight: "90%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 4,
    },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 12,
      fontFamily: theme.displayFontFamily,
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 6,
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontFamily: theme.displayFontFamily,
    },
    inputInvalid: { borderColor: "#c0392b" },
    hintInvalid: { color: "#c0392b" },
    iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    iconChip: {
      width: 44,
      height: 44,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    iconChipActive: { borderColor: theme.colors.primary, borderWidth: 2 },
    iconImage: { width: 28, height: 28 },
    iconFallback: { color: theme.colors.text, fontWeight: "700", fontSize: 11 },
    shortInput: { width: 90, marginTop: 8 },
    spacedInput: { marginTop: 10 },
    multilineInput: { minHeight: 60, textAlignVertical: "top" },
    pairRow: { flexDirection: "row", gap: 10 },
    pairCell: { flex: 1 },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, rowGap: 8 },
    chip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontSize: 12, fontFamily: theme.displayFontFamily },
    chipTextActive: { color: theme.colors.primaryText, fontWeight: "700" },
    buttonRow: { flexDirection: "row", gap: 8, marginTop: 16 },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    deleteButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 12,
      paddingHorizontal: 14,
      alignItems: "center",
    },
    deleteButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    addButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    disabled: { opacity: 0.5 },
  });
}
