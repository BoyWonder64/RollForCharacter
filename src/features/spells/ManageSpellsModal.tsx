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
import { listSpellCatalog } from "./spellRepo";
import { SpellDetailModal, type SpellDetailData } from "./SpellDetailModal";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { ClassDefinition } from "../../data/rulesets/types";

type KnownSpell = SpellDetailData & { characterSpellId: number; id: number };
type CatalogSpell = Awaited<ReturnType<typeof listSpellCatalog>>[number];

type ManageSpellsModalProps = {
  visible: boolean;
  knownSpells: KnownSpell[];
  matchedClass: ClassDefinition | undefined;
  onClose: () => void;
  onAddFromCatalog: (spellId: number) => void;
  onAddCustom: (name: string, level: number) => void;
  onRemove: (characterSpellId: number, name: string) => void;
};

const CATALOG_RESULT_LIMIT = 40;

export function ManageSpellsModal({
  visible,
  knownSpells,
  matchedClass,
  onClose,
  onAddFromCatalog,
  onAddCustom,
  onRemove,
}: ManageSpellsModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [search, setSearch] = useState("");
  const [onlyMyClass, setOnlyMyClass] = useState(true);
  const [results, setResults] = useState<CatalogSpell[]>([]);
  const [customName, setCustomName] = useState("");
  const [customLevel, setCustomLevel] = useState("0");
  const [detailSpell, setDetailSpell] = useState<SpellDetailData | null>(null);

  useEffect(() => {
    if (!visible) return;
    listSpellCatalog({
      classId: onlyMyClass && matchedClass ? matchedClass.id : undefined,
      search: search.trim() || undefined,
    }).then(setResults);
  }, [visible, search, onlyMyClass, matchedClass]);

  const knownIds = new Set(knownSpells.map((s) => s.id));
  const visibleResults = results.slice(0, CATALOG_RESULT_LIMIT);

  function handleAddCustom() {
    const name = customName.trim();
    if (!name) return;
    const level = Math.max(0, Math.min(9, parseInt(customLevel, 10) || 0));
    onAddCustom(name, level);
    setCustomName("");
    setCustomLevel("0");
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
        {visible && (
          <View style={styles.card}>
            <Text style={styles.title}>Manage Spells</Text>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionLabel}>Known Spells</Text>
              {knownSpells.length === 0 ? (
                <Text style={styles.empty}>No spells added yet.</Text>
              ) : (
                knownSpells.map((spell) => (
                  <View key={spell.characterSpellId} style={styles.knownRow}>
                    <View style={styles.spellInfo}>
                      <Text style={styles.knownName}>{spell.name}</Text>
                      <Text style={styles.knownLevel}>
                        {spell.level === 0 ? "Cantrip" : `Lvl ${spell.level}`}
                      </Text>
                    </View>
                    <Pressable style={styles.detailButton} onPress={() => setDetailSpell(spell)}>
                      <Text style={styles.detailButtonText}>Details</Text>
                    </Pressable>
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => onRemove(spell.characterSpellId, spell.name)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                  </View>
                ))
              )}

              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                Add From Catalog
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Search spells…"
                placeholderTextColor={theme.colors.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
              />
              {matchedClass && (
                <Pressable
                  style={styles.classFilterChip}
                  onPress={() => setOnlyMyClass((v) => !v)}
                >
                  <Text style={styles.classFilterChipText}>
                    {onlyMyClass ? `✓ ${matchedClass.name} only` : "Showing all classes"}
                  </Text>
                </Pressable>
              )}

              {visibleResults.length === 0 ? (
                <Text style={styles.empty}>No matching spells.</Text>
              ) : (
                visibleResults.map((spell) => {
                  const known = knownIds.has(spell.id);
                  return (
                    <View key={spell.id} style={styles.catalogRow}>
                      <View style={styles.spellInfo}>
                        <Text style={styles.spellName}>{spell.name}</Text>
                        <Text style={styles.spellMeta}>
                          {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} ·{" "}
                          {spell.school}
                        </Text>
                      </View>
                      <Pressable style={styles.detailButton} onPress={() => setDetailSpell(spell)}>
                        <Text style={styles.detailButtonText}>Details</Text>
                      </Pressable>
                      <Pressable
                        style={known ? styles.catalogKnownButton : styles.catalogAddButton}
                        disabled={known}
                        onPress={() => onAddFromCatalog(spell.id)}
                      >
                        <Text style={known ? styles.catalogKnownText : styles.catalogAddText}>
                          {known ? "Known" : "Add"}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })
              )}
              {results.length > CATALOG_RESULT_LIMIT && (
                <Text style={styles.catalogTruncatedHint}>
                  Showing {CATALOG_RESULT_LIMIT} of {results.length} — keep typing to narrow.
                </Text>
              )}

              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                Can&apos;t find it? Add a custom spell
              </Text>
              <View style={styles.addSpellRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Spell name"
                  placeholderTextColor={theme.colors.textMuted}
                  value={customName}
                  onChangeText={setCustomName}
                />
                <TextInput
                  style={[styles.input, { width: 48 }]}
                  placeholder="Lvl"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                  value={customLevel}
                  onChangeText={setCustomLevel}
                />
                <Pressable style={styles.addButton} onPress={handleAddCustom}>
                  <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
              </View>
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Done</Text>
            </Pressable>
          </View>
        )}
        </View>
      </KeyboardAvoidingView>

      <SpellDetailModal
        visible={detailSpell !== null}
        spell={detailSpell}
        onClose={() => setDetailSpell(null)}
      />
    </Modal>
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
      maxWidth: 440,
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
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
    },
    scroll: { flexGrow: 0 },
    scrollContent: { paddingBottom: 4 },
    sectionLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      fontFamily: theme.displayFontFamily,
      marginBottom: 6,
    },
    sectionLabelSpaced: { marginTop: 16 },
    empty: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily, fontSize: 13 },
    knownRow: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
      gap: 8,
    },
    knownName: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    knownLevel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontFamily: theme.displayFontFamily,
    },
    removeButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    removeButtonText: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    detailButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    detailButtonText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 8,
    },
    classFilterChip: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginBottom: 8,
    },
    classFilterChipText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    catalogRow: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
      gap: 8,
    },
    spellInfo: { flex: 1 },
    spellName: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    spellMeta: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    catalogAddButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    catalogKnownButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    catalogAddText: {
      color: theme.colors.primaryText,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    catalogKnownText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    catalogTruncatedHint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontFamily: theme.displayFontFamily,
      marginTop: 4,
    },
    addSpellRow: { flexDirection: "row", gap: 8 },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      justifyContent: "center",
    },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    closeButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 16,
    },
    closeButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
