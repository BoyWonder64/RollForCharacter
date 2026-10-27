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
import type { ArmorCategory, ArmorDefinition } from "../data/rulesets";
import { describeArmorAc, type CustomArmorInput } from "../features/characters/gearRepo";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getCampaignItemIcon } from "../features/icons/iconAssets";

const CATEGORY_FILTERS: ("All" | ArmorCategory)[] = ["All", "Light", "Medium", "Heavy", "Shield"];
const DEX_MODIFIERS = ["full", "max2", "none"] as const;
const DEX_MODIFIER_LABELS: Record<(typeof DEX_MODIFIERS)[number], string> = {
  full: "Full Dex",
  max2: "Dex (max 2)",
  none: "No Dex",
};

type AddArmorModalProps = {
  visible: boolean;
  catalog: ArmorDefinition[];
  onClose: () => void;
  onPickCatalog: (catalogId: string) => void;
  onAddCustom: (input: CustomArmorInput) => void;
};

export function AddArmorModal({
  visible,
  catalog,
  onClose,
  onPickCatalog,
  onAddCustom,
}: AddArmorModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && (
            <AddArmorModalForm
              catalog={catalog}
              onClose={onClose}
              onPickCatalog={onPickCatalog}
              onAddCustom={onAddCustom}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function AddArmorModalForm({
  catalog,
  onClose,
  onPickCatalog,
  onAddCustom,
}: Omit<AddArmorModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const shieldIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "shield") : undefined;
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [categoryFilter, setCategoryFilter] = useState<"All" | ArmorCategory>("All");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ArmorCategory>("Light");
  const [cost, setCost] = useState("");
  const [baseAcText, setBaseAcText] = useState("");
  const [dexModifier, setDexModifier] = useState<(typeof DEX_MODIFIERS)[number]>("full");
  const [strengthText, setStrengthText] = useState("");
  const [stealthDisadvantage, setStealthDisadvantage] = useState(false);
  const [weightText, setWeightText] = useState("");
  const [description, setDescription] = useState("");

  const visibleCatalog =
    categoryFilter === "All" ? catalog : catalog.filter((a) => a.category === categoryFilter);

  function handleAddCustom() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddCustom({
      name: trimmed,
      category,
      cost: cost.trim(),
      baseArmorClass: parseInt(baseAcText, 10) || 10,
      dexModifier,
      strengthRequirement: strengthText.trim() ? parseInt(strengthText, 10) : undefined,
      stealthDisadvantage,
      weight: parseFloat(weightText) || 0,
      description: description.trim(),
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {shieldIcon && <Image source={shieldIcon} style={styles.titleIcon} resizeMode="contain" />}
        <Text style={styles.title}>Add Armor</Text>
      </View>

      <View style={styles.modeRow}>
        <Pressable
          style={[styles.modeTab, mode === "catalog" && styles.modeTabActive]}
          onPress={() => setMode("catalog")}
        >
          <Text style={[styles.modeTabText, mode === "catalog" && styles.modeTabTextActive]}>
            Catalog
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeTab, mode === "custom" && styles.modeTabActive]}
          onPress={() => setMode("custom")}
        >
          <Text style={[styles.modeTabText, mode === "custom" && styles.modeTabTextActive]}>
            Custom
          </Text>
        </Pressable>
      </View>

      {mode === "catalog" ? (
        <>
          <View style={styles.chipRow}>
            {CATEGORY_FILTERS.map((c) => (
              <Pressable
                key={c}
                style={[styles.filterChip, categoryFilter === c && styles.filterChipActive]}
                onPress={() => setCategoryFilter(c)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    categoryFilter === c && styles.filterChipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <ScrollView style={styles.catalogList}>
            {visibleCatalog.map((armor) => (
              <Pressable
                key={armor.id}
                style={styles.catalogRow}
                onPress={() => onPickCatalog(armor.id)}
              >
                <View style={styles.catalogInfo}>
                  <Text style={styles.catalogName}>{armor.name}</Text>
                  <Text style={styles.catalogMeta}>
                    AC {describeArmorAc(armor)}
                    {armor.strengthRequirement ? ` · Str ${armor.strengthRequirement}` : ""}
                    {armor.stealthDisadvantage ? " · Stealth disadvantage" : ""}
                  </Text>
                  {armor.description ? (
                    <Text style={styles.catalogDescription}>{armor.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.catalogCost}>{armor.cost}</Text>
              </Pressable>
            ))}
            {visibleCatalog.length === 0 && (
              <Text style={styles.empty}>No armor in this category yet.</Text>
            )}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.customForm}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Dragonscale Mail"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.chipRow}>
            {(["Light", "Medium", "Heavy", "Shield"] as const).map((c) => (
              <Pressable
                key={c}
                style={[styles.filterChip, category === c && styles.filterChipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.filterChipText, category === c && styles.filterChipTextActive]}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Base AC</Text>
              <TextInput
                style={styles.input}
                value={baseAcText}
                onChangeText={setBaseAcText}
                placeholder="11"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Weight (lb)</Text>
              <TextInput
                style={styles.input}
                value={weightText}
                onChangeText={setWeightText}
                placeholder="10"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Dex Modifier</Text>
          <View style={styles.chipRow}>
            {DEX_MODIFIERS.map((d) => (
              <Pressable
                key={d}
                style={[styles.filterChip, dexModifier === d && styles.filterChipActive]}
                onPress={() => setDexModifier(d)}
              >
                <Text
                  style={[styles.filterChipText, dexModifier === d && styles.filterChipTextActive]}
                >
                  {DEX_MODIFIER_LABELS[d]}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Cost</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={setCost}
                placeholder="e.g. 50 gp"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Str Req. (optional)</Text>
              <TextInput
                style={styles.input}
                value={strengthText}
                onChangeText={setStrengthText}
                placeholder="13"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setStealthDisadvantage((v) => !v)}
          >
            <View style={[styles.checkbox, stealthDisadvantage && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Disadvantage on Stealth checks</Text>
          </Pressable>

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this armor, and how is it worn?"
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />
        </ScrollView>
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        {mode === "custom" && (
          <Pressable style={styles.addButton} onPress={handleAddCustom}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>
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
      maxWidth: 420,
      maxHeight: "80%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    titleIcon: { width: 22, height: 22 },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    modeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    modeTab: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    modeTabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    modeTabText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    modeTabTextActive: { color: theme.colors.primaryText },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
    filterChip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    filterChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    filterChipText: {
      color: theme.colors.text,
      fontSize: 11,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    filterChipTextActive: { color: theme.colors.primaryText },
    catalogList: { maxHeight: 320 },
    catalogRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: 10,
    },
    catalogInfo: { flex: 1 },
    catalogName: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    catalogMeta: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    catalogDescription: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontStyle: "italic",
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    catalogCost: { color: theme.colors.textMuted, fontSize: 11, fontFamily: theme.displayFontFamily },
    empty: {
      color: theme.colors.textMuted,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: theme.displayFontFamily,
    },
    customForm: { maxHeight: 400 },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 10,
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
    multilineInput: { minHeight: 60, textAlignVertical: "top" },
    row: { flexDirection: "row", gap: 10 },
    rowField: { flex: 1 },
    checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
    },
    checkboxChecked: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    checkboxLabel: { color: theme.colors.text, fontFamily: theme.displayFontFamily, fontSize: 13 },
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
  });
}
