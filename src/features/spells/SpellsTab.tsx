import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  addSpellToCharacter,
  adjustSpellSlotUsage,
  listSpellSlots,
  listSpellsForCharacter,
  setSpellSlot,
  togglePrepared,
} from "./spellRepo";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

type SpellRow = Awaited<ReturnType<typeof listSpellsForCharacter>>[number];
type SlotRow = Awaited<ReturnType<typeof listSpellSlots>>[number];

const SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SpellsTab({ characterId }: { characterId: number }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [spellRows, setSpellRows] = useState<SpellRow[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [newSpellName, setNewSpellName] = useState("");
  const [newSpellLevel, setNewSpellLevel] = useState("0");

  const refresh = useCallback(() => {
    listSpellsForCharacter(characterId).then(setSpellRows);
    listSpellSlots(characterId).then(setSlots);
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleAddSpell() {
    const name = newSpellName.trim();
    if (!name) return;
    const level = Math.max(0, Math.min(9, parseInt(newSpellLevel, 10) || 0));
    await addSpellToCharacter(characterId, name, level);
    setNewSpellName("");
    setNewSpellLevel("0");
    refresh();
  }

  async function handleToggle(characterSpellId: number, prepared: boolean) {
    await togglePrepared(characterSpellId, !prepared);
    refresh();
  }

  async function handleSlotTotal(level: number, current: number, delta: number) {
    const next = Math.max(0, current + delta);
    await setSpellSlot(characterId, level, next);
    refresh();
  }

  async function handleSlotUse(slotId: number, delta: number) {
    await adjustSpellSlotUsage(slotId, delta);
    refresh();
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Spell Slots</Text>
      <View style={styles.slotGrid}>
        {SLOT_LEVELS.map((level) => {
          const slot = slots.find((s) => s.level === level);
          const total = slot?.total ?? 0;
          if (total === 0 && !slot) {
            return null;
          }
          return (
            <View key={level} style={styles.slotCard}>
              <Text style={styles.slotLevel}>Lvl {level}</Text>
              <Text style={styles.slotCount}>
                {slot ? slot.used : 0}/{total}
              </Text>
              <View style={styles.slotButtons}>
                <Pressable
                  onPress={() => slot && handleSlotUse(slot.id, 1)}
                  style={styles.slotButton}
                >
                  <Text style={styles.slotButtonText}>Use</Text>
                </Pressable>
                <Pressable
                  onPress={() => slot && handleSlotUse(slot.id, -1)}
                  style={styles.slotButton}
                >
                  <Text style={styles.slotButtonText}>Free</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.addSlotRow}>
        {SLOT_LEVELS.map((level) => {
          const slot = slots.find((s) => s.level === level);
          return (
            <Pressable
              key={level}
              style={styles.addSlotButton}
              onPress={() => handleSlotTotal(level, slot?.total ?? 0, 1)}
            >
              <Text style={styles.addSlotButtonText}>+L{level}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Spells</Text>
      <View style={styles.addSpellRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Spell name"
          placeholderTextColor={theme.colors.textMuted}
          value={newSpellName}
          onChangeText={setNewSpellName}
        />
        <TextInput
          style={[styles.input, { width: 48 }]}
          placeholder="Lvl"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="number-pad"
          value={newSpellLevel}
          onChangeText={setNewSpellLevel}
        />
        <Pressable style={styles.addButton} onPress={handleAddSpell}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {spellRows.length === 0 ? (
        <Text style={styles.empty}>No spells added yet.</Text>
      ) : (
        spellRows.map((spell) => (
          <Pressable
            key={spell.characterSpellId}
            style={styles.spellRow}
            onPress={() => handleToggle(spell.characterSpellId, spell.prepared)}
          >
            <View style={styles.spellInfo}>
              <Text style={styles.spellName}>{spell.name}</Text>
              <Text style={styles.spellMeta}>
                {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
              </Text>
            </View>
            <View style={[styles.preparedPill, spell.prepared && styles.preparedPillOn]}>
              <Text
                style={[
                  styles.preparedPillText,
                  spell.prepared && styles.preparedPillTextOn,
                ]}
              >
                {spell.prepared ? "Prepared" : "Unprepared"}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
      marginTop: 4,
    },
    slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
    slotCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
      minWidth: 70,
    },
    slotLevel: { color: theme.colors.textMuted, fontSize: 11, fontWeight: "700" },
    slotCount: { color: theme.colors.text, fontSize: 16, fontWeight: "700", marginTop: 2 },
    slotButtons: { flexDirection: "row", gap: 6, marginTop: 6 },
    slotButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      padding: 4,
    },
    slotButtonText: { color: theme.colors.text, fontSize: 10 },
    addSlotRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    addSlotButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      padding: 6,
    },
    addSlotButtonText: { color: theme.colors.accent, fontSize: 11, fontWeight: "700" },
    addSpellRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      justifyContent: "center",
    },
    addButtonText: { color: theme.colors.primaryText, fontWeight: "600" },
    empty: { color: theme.colors.textMuted },
    spellRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    spellInfo: { flex: 1 },
    spellName: { color: theme.colors.text, fontSize: 15, fontWeight: "600" },
    spellMeta: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    preparedPill: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    preparedPillOn: { backgroundColor: theme.colors.primary },
    preparedPillText: { color: theme.colors.text, fontSize: 11, fontWeight: "600" },
    preparedPillTextOn: { color: theme.colors.primaryText },
  });
}
