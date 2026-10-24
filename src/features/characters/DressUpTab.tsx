import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

const EQUIP_SLOTS = ["Head", "Body", "Weapon", "Shield", "Back", "Accessory"];

export function DressUpTab() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Equipment Slots</Text>
      <View style={styles.grid}>
        {EQUIP_SLOTS.map((slot) => (
          <View key={slot} style={styles.slotCard}>
            <View style={styles.slotPlaceholder} />
            <Text style={styles.slotLabel}>{slot}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>
        Character packs with new outfits and gear are coming in a future update.
      </Text>
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
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    slotCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
    },
    slotPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      marginBottom: 6,
    },
    slotLabel: { color: theme.colors.textMuted, fontSize: 12 },
    note: { color: theme.colors.textMuted, marginTop: 20, lineHeight: 18 },
  });
}
