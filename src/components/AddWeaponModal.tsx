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
import type { WeaponCategory, WeaponDefinition } from "../data/rulesets";
import type { CustomWeaponInput } from "../features/characters/gearRepo";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getCampaignItemIcon } from "../features/icons/iconAssets";

const CATEGORY_FILTERS: ("All" | "Owned" | WeaponCategory)[] = [
  "All",
  "Owned",
  "Simple Melee",
  "Simple Ranged",
  "Martial Melee",
  "Martial Ranged",
];

const DAMAGE_TYPES = ["Bludgeoning", "Piercing", "Slashing", ""] as const;

type AddWeaponModalProps = {
  visible: boolean;
  catalog: WeaponDefinition[];
  ownedCatalogIds: Set<string>;
  onClose: () => void;
  onPickCatalog: (catalogId: string) => void;
  onAddCustom: (input: CustomWeaponInput) => void;
};

export function AddWeaponModal({
  visible,
  catalog,
  ownedCatalogIds,
  onClose,
  onPickCatalog,
  onAddCustom,
}: AddWeaponModalProps) {
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
            <AddWeaponModalForm
              catalog={catalog}
              ownedCatalogIds={ownedCatalogIds}
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

function AddWeaponModalForm({
  catalog,
  ownedCatalogIds,
  onClose,
  onPickCatalog,
  onAddCustom,
}: Omit<AddWeaponModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const swordIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "sword") : undefined;
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Owned" | WeaponCategory>("All");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<WeaponCategory>("Simple Melee");
  const [cost, setCost] = useState("");
  const [damageDice, setDamageDice] = useState("");
  const [damageType, setDamageType] = useState<string>("");
  const [weightText, setWeightText] = useState("");
  const [propertiesText, setPropertiesText] = useState("");
  const [description, setDescription] = useState("");

  const visibleCatalog =
    categoryFilter === "All"
      ? catalog
      : categoryFilter === "Owned"
        ? catalog.filter((w) => ownedCatalogIds.has(w.id))
        : catalog.filter((w) => w.category === categoryFilter);

  function handleAddCustom() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddCustom({
      name: trimmed,
      category,
      cost: cost.trim(),
      damageDice: damageDice.trim(),
      damageType,
      weight: parseFloat(weightText) || 0,
      properties: propertiesText
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      description: description.trim(),
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {swordIcon && <Image source={swordIcon} style={styles.titleIcon} resizeMode="contain" />}
        <Text style={styles.title}>Add Weapon</Text>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
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
          </ScrollView>

          <ScrollView style={styles.catalogList}>
            {visibleCatalog.map((weapon) => (
              <Pressable
                key={weapon.id}
                style={styles.catalogRow}
                onPress={() => onPickCatalog(weapon.id)}
              >
                <View style={styles.catalogInfo}>
                  <Text style={styles.catalogName}>{weapon.name}</Text>
                  <Text style={styles.catalogMeta}>
                    {weapon.damageDice ? `${weapon.damageDice} ${weapon.damageType}` : "No damage"}
                    {weapon.properties.length > 0 ? ` · ${weapon.properties.join(", ")}` : ""}
                  </Text>
                  {weapon.description ? (
                    <Text style={styles.catalogDescription}>{weapon.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.catalogCost}>{weapon.cost}</Text>
              </Pressable>
            ))}
            {visibleCatalog.length === 0 && (
              <Text style={styles.empty}>
                {categoryFilter === "Owned"
                  ? "No owned weapons yet."
                  : "No weapons in this category yet."}
              </Text>
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
            placeholder="e.g. Moonblade"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.chipRow}>
            {(["Simple Melee", "Simple Ranged", "Martial Melee", "Martial Ranged"] as const).map(
              (c) => (
                <Pressable
                  key={c}
                  style={[styles.filterChip, category === c && styles.filterChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[styles.filterChipText, category === c && styles.filterChipTextActive]}
                  >
                    {c}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          <View style={styles.row}>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Damage Dice</Text>
              <TextInput
                style={styles.input}
                value={damageDice}
                onChangeText={setDamageDice}
                placeholder="1d8"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Weight (lb)</Text>
              <TextInput
                style={styles.input}
                value={weightText}
                onChangeText={setWeightText}
                placeholder="3"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Damage Type</Text>
          <View style={styles.chipRow}>
            {DAMAGE_TYPES.map((t) => (
              <Pressable
                key={t || "none"}
                style={[styles.filterChip, damageType === t && styles.filterChipActive]}
                onPress={() => setDamageType(t)}
              >
                <Text
                  style={[styles.filterChipText, damageType === t && styles.filterChipTextActive]}
                >
                  {t || "None"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Cost</Text>
          <TextInput
            style={styles.input}
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 15 gp"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.fieldLabel}>Properties (comma-separated)</Text>
          <TextInput
            style={styles.input}
            value={propertiesText}
            onChangeText={setPropertiesText}
            placeholder="Finesse, Light, Thrown (range 20/60)"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this weapon, and how is it used?"
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
    chipScroll: { marginBottom: 8 },
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
