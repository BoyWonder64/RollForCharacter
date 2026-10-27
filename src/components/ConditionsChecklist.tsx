import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { CONDITIONS, EXHAUSTION_DESCRIPTION, MAX_EXHAUSTION_LEVEL } from "../data/conditions";
import {
  setExhaustionLevel,
  toggleCondition,
} from "../features/characters/characterRepo";
import { parseConditions } from "../features/characters/characterCalculations";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import type { Character } from "../types/models";

/**
 * A simple sheet checklist of active 5e conditions, plus exhaustion's
 * separate 0-6 level -- nothing here changes any other stat automatically.
 * Tap a condition to toggle it; long-press to see what it does.
 */
export function ConditionsChecklist({
  character,
  onChanged,
}: {
  character: Character;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const active = parseConditions(character);

  async function handleToggle(conditionId: string) {
    await toggleCondition(character.id, conditionId);
    onChanged();
  }

  async function handleExhaustionChange(delta: number) {
    await setExhaustionLevel(character.id, character.exhaustionLevel + delta);
    onChanged();
  }

  return (
    <View>
      <View style={styles.chipRow}>
        {CONDITIONS.map((condition) => {
          const isActive = active.includes(condition.id);
          return (
            <Pressable
              key={condition.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleToggle(condition.id)}
              onLongPress={() => Alert.alert(condition.name, condition.description)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {condition.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.exhaustionRow}>
        <Pressable onPress={() => Alert.alert("Exhaustion", EXHAUSTION_DESCRIPTION)}>
          <Text style={styles.exhaustionLabel}>Exhaustion</Text>
        </Pressable>
        <View style={styles.exhaustionControls}>
          <Pressable
            style={[styles.exhaustionButton, character.exhaustionLevel <= 0 && styles.exhaustionButtonDisabled]}
            disabled={character.exhaustionLevel <= 0}
            onPress={() => handleExhaustionChange(-1)}
          >
            <Text style={styles.exhaustionButtonText}>−</Text>
          </Pressable>
          <Text style={styles.exhaustionValue}>{character.exhaustionLevel}</Text>
          <Pressable
            style={[
              styles.exhaustionButton,
              character.exhaustionLevel >= MAX_EXHAUSTION_LEVEL && styles.exhaustionButtonDisabled,
            ]}
            disabled={character.exhaustionLevel >= MAX_EXHAUSTION_LEVEL}
            onPress={() => handleExhaustionChange(1)}
          >
            <Text style={styles.exhaustionButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    chip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    chipActive: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },
    chipText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    chipTextActive: { color: theme.colors.primaryText },
    exhaustionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    exhaustionLabel: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    exhaustionControls: { flexDirection: "row", alignItems: "center", gap: 10 },
    exhaustionButton: {
      width: 28,
      height: 28,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    exhaustionButtonDisabled: { opacity: 0.4 },
    exhaustionButtonText: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
    exhaustionValue: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 15,
      minWidth: 16,
      textAlign: "center",
    },
  });
}
