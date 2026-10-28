import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  listCharacterResources,
  restoreResourceUse,
  spendResourceUse,
  type CharacterResource,
} from "../features/characters/resourceRepo";
import type { Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

/**
 * Shows every limited-use class resource the character has gained so far
 * (Action Surge, Second Wind, Indomitable, ...) as a pip tracker with a tap
 * to spend a use. Resources recharge via the Rest modal (short/long rest) --
 * see `shortRest`/`longRest` in characterRepo.ts. Renders nothing if the
 * character's class has no resources defined yet, or none are gained at
 * their current level.
 */
export function ClassResourceTracker({ character }: { character: Character }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [resources, setResources] = useState<CharacterResource[]>([]);

  const refresh = useCallback(() => {
    listCharacterResources(character).then(setResources);
  }, [character]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleUse(resourceId: string) {
    await spendResourceUse(character, resourceId);
    refresh();
  }

  async function handleStep(resourceId: string, amount: number) {
    if (amount < 0) await spendResourceUse(character, resourceId, -amount);
    else await restoreResourceUse(character, resourceId, amount);
    refresh();
  }

  if (resources.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Resources</Text>
      {resources.map(({ definition, max, remaining }) => (
        <View key={definition.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.name}>{definition.name}</Text>
            <Text style={styles.count}>
              {remaining}/{max}
            </Text>
          </View>
          {definition.isPointPool ? (
            <View style={styles.poolRow}>
              <Pressable
                style={[styles.useButton, remaining <= 0 && styles.useButtonDisabled]}
                disabled={remaining <= 0}
                onPress={() => handleStep(definition.id, -1)}
              >
                <Text style={styles.useButtonText}>-1</Text>
              </Pressable>
              <Pressable
                style={[styles.useButton, remaining >= max && styles.useButtonDisabled]}
                disabled={remaining >= max}
                onPress={() => handleStep(definition.id, 1)}
              >
                <Text style={styles.useButtonText}>+1</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.pipsRow}>
              <View style={styles.pips}>
                {Array.from({ length: max }, (_, i) => (
                  <View key={i} style={[styles.pip, i < remaining && styles.pipOn]} />
                ))}
              </View>
              <Pressable
                style={[styles.useButton, remaining <= 0 && styles.useButtonDisabled]}
                disabled={remaining <= 0}
                onPress={() => handleUse(definition.id)}
              >
                <Text style={styles.useButtonText}>Use</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 14,
      marginTop: 12,
    },
    title: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
    },
    row: { marginBottom: 10 },
    rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    name: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    count: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    pipsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      gap: 10,
    },
    pips: { flexDirection: "row", gap: 6, flexShrink: 1 },
    poolRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 10 },
    pip: {
      width: 16,
      height: 16,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
    },
    pipOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    useButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    useButtonDisabled: { opacity: 0.5 },
    useButtonText: {
      color: theme.colors.primaryText,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
