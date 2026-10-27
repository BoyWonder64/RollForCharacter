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
import { listFeatCatalog } from "../features/characters/featRepo";

type CatalogRow = Awaited<ReturnType<typeof listFeatCatalog>>[number];

type FeatPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  /** `description` is omitted for a freely-typed custom feat. */
  onPick: (entry: { name: string; description?: string }) => void;
};

export function FeatPickerModal({ visible, onClose, onPick }: FeatPickerModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && <FeatPickerModalForm onClose={onClose} onPick={onPick} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FeatPickerModalForm({
  onClose,
  onPick,
}: Omit<FeatPickerModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CatalogRow[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    listFeatCatalog(search.trim() || undefined).then(setResults);
  }, [search]);

  function handleAddCustom() {
    const trimmed = customName.trim();
    if (!trimmed) return;
    onPick({ name: trimmed });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Choose a Feat</Text>

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
            onChangeText={setSearch}
            placeholder="Search feats…"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="none"
          />
          <ScrollView style={styles.catalogList}>
            {results.map((feat) => {
              const expanded = expandedId === feat.id;
              return (
                <Pressable
                  key={feat.id}
                  style={styles.catalogRow}
                  onPress={() => onPick({ name: feat.name, description: feat.description })}
                >
                  <View style={styles.catalogInfo}>
                    <View style={styles.catalogHeaderRow}>
                      <Text style={styles.catalogName}>{feat.name}</Text>
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : feat.id);
                        }}
                      >
                        <Text style={styles.infoToggle}>{expanded ? "▲" : "ⓘ"}</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.catalogMeta}>
                      {feat.prerequisite ? `Prerequisite: ${feat.prerequisite} · ` : ""}
                      {feat.sourceName}
                    </Text>
                    {expanded && <Text style={styles.catalogDescription}>{feat.description}</Text>}
                  </View>
                </Pressable>
              );
            })}
            {results.length === 0 && <Text style={styles.empty}>No feats match.</Text>}
          </ScrollView>
        </>
      ) : (
        <>
          <Text style={styles.fieldLabel}>Feat Name</Text>
          <TextInput
            style={styles.input}
            value={customName}
            onChangeText={setCustomName}
            placeholder="e.g. Great Weapon Master"
            placeholderTextColor={theme.colors.textMuted}
            autoFocus
          />
          <Pressable
            style={[styles.addButton, !customName.trim() && styles.addButtonDisabled]}
            disabled={!customName.trim()}
            onPress={handleAddCustom}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </>
      )}

      <Pressable style={styles.secondaryButton} onPress={onClose}>
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </Pressable>
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
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
    catalogList: { maxHeight: 320 },
    catalogRow: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    catalogInfo: { flex: 1 },
    catalogHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    catalogName: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    infoToggle: { color: theme.colors.accent, fontSize: 14, paddingLeft: 8 },
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
    },
    empty: {
      color: theme.colors.textMuted,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: theme.displayFontFamily,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginBottom: 10,
    },
    addButtonDisabled: { opacity: 0.5 },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    secondaryButton: {
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
  });
}
