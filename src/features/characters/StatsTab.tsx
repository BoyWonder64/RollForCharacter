import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ABILITY_LABELS, abilityModifier } from "./characterRepo";
import type { AbilityScoreKey, Character } from "../../types/models";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function StatsTab({ character }: { character: Character }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <View style={styles.summaryRow}>
        <SummaryStat label="Armor Class" value={String(character.armorClass)} />
        <SummaryStat label="Speed" value={`${character.speed} ft`} />
        <SummaryStat label="Prof. Bonus" value={formatModifier(character.proficiencyBonus)} />
      </View>

      <Text style={styles.sectionTitle}>Ability Scores</Text>
      <View style={styles.abilityGrid}>
        {ABILITY_KEYS.map((key) => {
          const score = character[key];
          const modifier = abilityModifier(score);
          return (
            <View key={key} style={styles.abilityCard}>
              <Text style={styles.abilityLabel}>{ABILITY_LABELS[key]}</Text>
              <Text style={styles.abilityScore}>{score}</Text>
              <Text style={styles.abilityModifier}>{formatModifier(modifier)}</Text>
            </View>
          );
        })}
      </View>

      {character.notes ? (
        <>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{character.notes}</Text>
        </>
      ) : null}
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      alignItems: "center",
    },
    summaryValue: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
    summaryLabel: { color: theme.colors.textMuted, fontSize: 11, marginTop: 4 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
      marginTop: 4,
    },
    abilityGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    abilityCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    abilityLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: "700" },
    abilityScore: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 4 },
    abilityModifier: { color: theme.colors.accent, fontSize: 13, marginTop: 2 },
    notes: { color: theme.colors.text, lineHeight: 20 },
  });
}
