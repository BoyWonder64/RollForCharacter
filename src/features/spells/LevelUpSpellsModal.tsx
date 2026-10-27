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
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { ClassDefinition } from "../../data/rulesets/types";

const SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CATALOG_RESULT_LIMIT = 40;

type CatalogSpell = Awaited<ReturnType<typeof listSpellCatalog>>[number];

type LevelUpSpellsModalProps = {
  visible: boolean;
  slotTotals: { level: number; total: number }[];
  knownSpellIds: Set<number>;
  matchedClass: ClassDefinition | undefined;
  onClose: () => void;
  onAdjustSlotTotal: (level: number, current: number, delta: number) => void;
  onAddFromCatalog: (spellId: number) => void;
};

/**
 * One window for a level-up moment: adjust spell slot totals and add newly
 * learned spells side by side. Slots and spells are deliberately NOT locked
 * together here (e.g. gaining a 2nd-level slot doesn't restrict you to
 * picking a 2nd-level spell) -- 5e doesn't tie the two together that way.
 */
export function LevelUpSpellsModal({ visible, onClose, ...rest }: LevelUpSpellsModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {/* Only mounted while visible, so search/filter state always starts fresh on open. */}
          {visible && <LevelUpSpellsForm onClose={onClose} {...rest} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function LevelUpSpellsForm({
  slotTotals,
  knownSpellIds,
  matchedClass,
  onClose,
  onAdjustSlotTotal,
  onAddFromCatalog,
}: Omit<LevelUpSpellsModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [search, setSearch] = useState("");
  const [onlyMyClass, setOnlyMyClass] = useState(true);
  const [results, setResults] = useState<CatalogSpell[]>([]);

  useEffect(() => {
    listSpellCatalog({
      classId: onlyMyClass && matchedClass ? matchedClass.id : undefined,
      search: search.trim() || undefined,
    }).then(setResults);
  }, [search, onlyMyClass, matchedClass]);

  const visibleResults = results.slice(0, CATALOG_RESULT_LIMIT);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Level Up</Text>
      <Text style={styles.hint}>Bump your spell slots and add any spells you just learned.</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Spell Slots</Text>
        {SLOT_LEVELS.map((level) => {
          const total = slotTotals.find((s) => s.level === level)?.total ?? 0;
          return (
            <View key={level} style={styles.slotRow}>
              <Text style={styles.slotRowLabel}>Level {level}</Text>
              <View style={styles.slotRowControls}>
                <Pressable
                  style={[styles.stepButton, total === 0 && styles.stepButtonDisabled]}
                  onPress={() => onAdjustSlotTotal(level, total, -1)}
                  disabled={total === 0}
                >
                  <Text style={styles.stepButtonText}>−</Text>
                </Pressable>
                <Text style={styles.slotRowTotal}>{total}</Text>
                <Pressable
                  style={styles.stepButton}
                  onPress={() => onAdjustSlotTotal(level, total, 1)}
                >
                  <Text style={styles.stepButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>Add a Spell</Text>
        <TextInput
          style={styles.input}
          placeholder="Search spells…"
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {matchedClass && (
          <Pressable style={styles.classFilterChip} onPress={() => setOnlyMyClass((v) => !v)}>
            <Text style={styles.classFilterChipText}>
              {onlyMyClass ? `✓ ${matchedClass.name} only` : "Showing all classes"}
            </Text>
          </Pressable>
        )}

        {visibleResults.length === 0 ? (
          <Text style={styles.empty}>No matching spells.</Text>
        ) : (
          visibleResults.map((spell) => {
            const known = knownSpellIds.has(spell.id);
            return (
              <Pressable
                key={spell.id}
                style={styles.catalogRow}
                disabled={known}
                onPress={() => onAddFromCatalog(spell.id)}
              >
                <View style={styles.spellInfo}>
                  <Text style={styles.spellName}>{spell.name}</Text>
                  <Text style={styles.spellMeta}>
                    {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} · {spell.school}
                  </Text>
                </View>
                <Text style={known ? styles.catalogKnownText : styles.catalogAddText}>
                  {known ? "Known" : "Add"}
                </Text>
              </Pressable>
            );
          })
        )}
        {results.length > CATALOG_RESULT_LIMIT && (
          <Text style={styles.catalogTruncatedHint}>
            Showing {CATALOG_RESULT_LIMIT} of {results.length} — keep typing to narrow.
          </Text>
        )}
      </ScrollView>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Done</Text>
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
      marginBottom: 4,
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginBottom: 14,
      fontFamily: theme.displayFontFamily,
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
    slotRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    slotRowLabel: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    slotRowControls: { flexDirection: "row", alignItems: "center", gap: 14 },
    slotRowTotal: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      minWidth: 20,
      textAlign: "center",
      fontFamily: theme.displayFontFamily,
    },
    stepButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      width: 38,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
    },
    stepButtonDisabled: { opacity: 0.4 },
    stepButtonText: {
      color: theme.colors.accent,
      fontSize: 20,
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
    empty: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily, fontSize: 13 },
    catalogRow: {
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 8,
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
    catalogAddText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    catalogKnownText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    catalogTruncatedHint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontFamily: theme.displayFontFamily,
      marginTop: 4,
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
