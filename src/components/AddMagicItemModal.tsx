import { useEffect, useMemo, useState } from "react";
import {
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
import {
  listMagicItemCatalog,
  listMagicItemRarities,
  type CustomMagicItemInput,
} from "../features/characters/magicItemRepo";

type CatalogRow = Awaited<ReturnType<typeof listMagicItemCatalog>>[number];

type AddMagicItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onPickCatalog: (catalogId: number) => void;
  onAddCustom: (input: CustomMagicItemInput) => void;
};

export function AddMagicItemModal({
  visible,
  onClose,
  onPickCatalog,
  onAddCustom,
}: AddMagicItemModalProps) {
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
            <AddMagicItemModalForm onClose={onClose} onPickCatalog={onPickCatalog} onAddCustom={onAddCustom} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function AddMagicItemModalForm({
  onClose,
  onPickCatalog,
  onAddCustom,
}: Omit<AddMagicItemModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [rarities, setRarities] = useState<string[]>([]);
  const [results, setResults] = useState<CatalogRow[]>([]);
  const [resultLimit, setResultLimit] = useState(30);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rarity, setRarity] = useState("");
  const [requiresAttunement, setRequiresAttunement] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    listMagicItemRarities().then(setRarities);
  }, []);

  useEffect(() => {
    if (mode !== "catalog") return;
    listMagicItemCatalog(search.trim() || undefined, rarityFilter ?? undefined).then(setResults);
  }, [mode, search, rarityFilter]);

  function handleAddCustom() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddCustom({
      name: trimmed,
      category: category.trim(),
      rarity: rarity.trim(),
      requiresAttunement,
      description: description.trim(),
    });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Magic Item</Text>

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
          <TextInput
            style={styles.input}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setResultLimit(30);
            }}
            placeholder="Search magic items…"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            <View style={styles.chipRow}>
              <Pressable
                style={[styles.filterChip, rarityFilter === null && styles.filterChipActive]}
                onPress={() => {
                  setRarityFilter(null);
                  setResultLimit(30);
                }}
              >
                <Text
                  style={[styles.filterChipText, rarityFilter === null && styles.filterChipTextActive]}
                >
                  All
                </Text>
              </Pressable>
              {rarities.map((r) => (
                <Pressable
                  key={r}
                  style={[styles.filterChip, rarityFilter === r && styles.filterChipActive]}
                  onPress={() => {
                    setRarityFilter(rarityFilter === r ? null : r);
                    setResultLimit(30);
                  }}
                >
                  <Text
                    style={[styles.filterChipText, rarityFilter === r && styles.filterChipTextActive]}
                  >
                    {r}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <ScrollView style={styles.catalogList}>
            {results.slice(0, resultLimit).map((item) => {
              const expanded = expandedId === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={styles.catalogRow}
                  onPress={() => onPickCatalog(item.id)}
                >
                  <View style={styles.catalogInfo}>
                    <Text style={styles.catalogName}>{item.name}</Text>
                    <Text style={styles.catalogMeta}>
                      {item.rarity}
                      {item.category ? ` · ${item.category}` : ""}
                      {item.requiresAttunement ? " · Requires attunement" : ""}
                    </Text>
                    {expanded && item.description ? (
                      <Text style={styles.catalogDescription}>{item.description}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    hitSlop={8}
                    onPress={(e) => {
                      e.stopPropagation();
                      setExpandedId(expanded ? null : item.id);
                    }}
                  >
                    <Text style={styles.infoToggle}>{expanded ? "▲" : "ⓘ"}</Text>
                  </Pressable>
                </Pressable>
              );
            })}
            {results.length === 0 && <Text style={styles.empty}>No magic items match.</Text>}
            {resultLimit < results.length && (
              <Pressable style={styles.showMoreButton} onPress={() => setResultLimit((n) => n + 30)}>
                <Text style={styles.showMoreButtonText}>
                  Show more ({results.length - resultLimit} remaining)
                </Text>
              </Pressable>
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
            placeholder="e.g. Ring of Jumping"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />
          <View style={styles.row}>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Category</Text>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g. Ring"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            <View style={styles.rowField}>
              <Text style={styles.fieldLabel}>Rarity</Text>
              <TextInput
                style={styles.input}
                value={rarity}
                onChangeText={setRarity}
                placeholder="e.g. Rare"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
          </View>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setRequiresAttunement((v) => !v)}
          >
            <View style={[styles.checkbox, requiresAttunement && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Requires attunement</Text>
          </Pressable>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="What does this item do?"
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
      maxHeight: "85%",
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
      marginBottom: 12,
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
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
      fontFamily: theme.displayFontFamily,
    },
    chipScroll: { marginBottom: 10 },
    chipRow: { flexDirection: "row", gap: 6 },
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
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 6,
      fontFamily: theme.displayFontFamily,
    },
    infoToggle: { color: theme.colors.accent, fontSize: 14, paddingLeft: 8 },
    empty: {
      color: theme.colors.textMuted,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: theme.displayFontFamily,
    },
    showMoreButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    showMoreButtonText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    customForm: { maxHeight: 400 },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 4,
      fontFamily: theme.displayFontFamily,
    },
    row: { flexDirection: "row", gap: 10 },
    rowField: { flex: 1 },
    multilineInput: { minHeight: 60, textAlignVertical: "top" },
    checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4, marginBottom: 10 },
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
