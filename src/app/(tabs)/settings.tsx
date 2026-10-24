import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeContext, type ThemePreference } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

const OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: "system", label: "System" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
];

export default function SettingsScreen() {
  const { theme, preference, setPreference } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.optionRow}>
        {OPTIONS.map((option) => {
          const active = preference === option.key;
          return (
            <Pressable
              key={option.key}
              style={[styles.optionButton, active && styles.optionButtonActive]}
              onPress={() => setPreference(option.key)}
            >
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 12,
    },
    optionRow: { flexDirection: "row", gap: 8 },
    optionButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    optionButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionLabel: { color: theme.colors.text, fontWeight: "600" },
    optionLabelActive: { color: theme.colors.primaryText },
  });
}
