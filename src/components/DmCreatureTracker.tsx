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
  addDmCreatureFromCatalog,
  listDmCreatures,
  listMonsterCatalog,
  removeDmCreature,
  updateDmCreatureHp,
  type MonsterCatalogRow,
} from "../features/dm/dmCreatureRepo";

type DmCreatureRow = Awaited<ReturnType<typeof listDmCreatures>>[number];

const PAGE_SIZE = 30;

/**
 * DM mode's "add creature" feature (TODO.md): a button that opens the SRD
 * monster catalog to add to an active encounter list, with current/max HP
 * shown and a remove button per row. Independent of any character -- DM
 * mode is a global toggle, not tied to one character's sheet.
 */
export function DmCreatureTracker() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [active, setActive] = useState<DmCreatureRow[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [catalog, setCatalog] = useState<MonsterCatalogRow[]>([]);
  const [search, setSearch] = useState("");
  const [resultLimit, setResultLimit] = useState(PAGE_SIZE);

  function refresh() {
    listDmCreatures().then(setActive);
  }

  useEffect(() => {
    refresh();
  }, []);

  function openPicker() {
    if (catalog.length === 0) {
      listMonsterCatalog().then(setCatalog);
    }
    setPickerVisible(true);
  }

  async function handlePick(monsterId: number) {
    await addDmCreatureFromCatalog(monsterId);
    setPickerVisible(false);
    setSearch("");
    setResultLimit(PAGE_SIZE);
    refresh();
  }

  async function handleRemove(id: number) {
    await removeDmCreature(id);
    refresh();
  }

  async function handleHpChange(creature: DmCreatureRow, delta: number) {
    const next = Math.max(0, Math.min(creature.maxHp, creature.currentHp + delta));
    await updateDmCreatureHp(creature.id, next);
    refresh();
  }

  const filtered = search.trim()
    ? catalog.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()))
    : catalog;

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Creatures</Text>
        <Pressable style={styles.addButton} onPress={openPicker}>
          <Text style={styles.addButtonText}>+ Add Creature</Text>
        </Pressable>
      </View>

      {active.length === 0 ? (
        <Text style={styles.hint}>No active creatures. Add one from the SRD bestiary.</Text>
      ) : (
        active.map((creature) => (
          <View key={creature.id} style={styles.creatureRow}>
            <View style={styles.creatureInfo}>
              <Text style={styles.creatureName}>{creature.name}</Text>
              <Text style={styles.creatureMeta}>
                AC {creature.armorClass} · HP {creature.currentHp}/{creature.maxHp}
              </Text>
            </View>
            <View style={styles.hpControls}>
              <Pressable style={styles.hpButton} onPress={() => handleHpChange(creature, -1)}>
                <Text style={styles.hpButtonText}>−</Text>
              </Pressable>
              <Pressable style={styles.hpButton} onPress={() => handleHpChange(creature, 1)}>
                <Text style={styles.hpButtonText}>+</Text>
              </Pressable>
              <Pressable style={styles.removeButton} onPress={() => handleRemove(creature.id)}>
                <Text style={styles.removeButtonText}>✕</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Add Creature</Text>
            <TextInput
              style={styles.input}
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                setResultLimit(PAGE_SIZE);
              }}
              placeholder="Search by name…"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
            />
            <ScrollView style={styles.catalogList}>
              {filtered.slice(0, resultLimit).map((m) => (
                <Pressable key={m.id} style={styles.catalogRow} onPress={() => handlePick(m.id)}>
                  <View style={styles.catalogInfo}>
                    <Text style={styles.catalogName}>{m.name}</Text>
                    <Text style={styles.catalogMeta}>
                      {m.size} {m.type} · CR {m.challengeRating} · AC {m.armorClass} · HP{" "}
                      {m.hitPoints}
                    </Text>
                  </View>
                </Pressable>
              ))}
              {filtered.length === 0 && catalog.length > 0 && (
                <Text style={styles.empty}>No creatures match that search.</Text>
              )}
              {catalog.length === 0 && <Text style={styles.empty}>Loading catalog…</Text>}
              {resultLimit < filtered.length && (
                <Pressable
                  style={styles.showMoreButton}
                  onPress={() => setResultLimit((n) => n + PAGE_SIZE)}
                >
                  <Text style={styles.showMoreButtonText}>
                    Show more ({filtered.length - resultLimit} remaining)
                  </Text>
                </Pressable>
              )}
            </ScrollView>
            <Pressable style={styles.secondaryButton} onPress={() => setPickerVisible(false)}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    section: { marginTop: 16 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13 },
    creatureRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 6,
      gap: 8,
    },
    creatureInfo: { flex: 1 },
    creatureName: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      fontSize: 14,
    },
    creatureMeta: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    hpControls: { flexDirection: "row", alignItems: "center", gap: 6 },
    hpButton: {
      width: 26,
      height: 26,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    hpButtonText: { color: theme.colors.text, fontWeight: "700", fontSize: 15 },
    removeButton: {
      width: 26,
      height: 26,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    removeButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
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
      fontFamily: theme.displayFontFamily,
      marginBottom: 12,
    },
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
    catalogList: { maxHeight: 360 },
    catalogRow: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    catalogInfo: { flex: 1 },
    catalogName: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    catalogMeta: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
    empty: { color: theme.colors.textMuted, textAlign: "center", paddingVertical: 20 },
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
    secondaryButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 12,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
