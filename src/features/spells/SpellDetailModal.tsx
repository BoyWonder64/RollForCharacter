import { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

export type SpellDetailData = {
  name: string;
  level: number;
  school?: string | null;
  castingTime?: string | null;
  range?: string | null;
  duration?: string | null;
  components?: string | null;
  concentration?: boolean | null;
  ritual?: boolean | null;
  description?: string | null;
};

type SpellDetailModalProps = {
  visible: boolean;
  spell: SpellDetailData | null;
  onClose: () => void;
};

export function SpellDetailModal({ visible, spell, onClose }: SpellDetailModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {visible && spell && (
          <View style={styles.card}>
            <Text style={styles.title}>{spell.name}</Text>
            <Text style={styles.subtitle}>
              {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
              {spell.school ? ` · ${spell.school}` : ""}
              {spell.ritual ? " · Ritual" : ""}
              {spell.concentration ? " · Concentration" : ""}
            </Text>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              <View style={styles.statGrid}>
                {spell.castingTime && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Casting Time</Text>
                    <Text style={styles.statValue}>{spell.castingTime}</Text>
                  </View>
                )}
                {spell.range && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Range</Text>
                    <Text style={styles.statValue}>{spell.range}</Text>
                  </View>
                )}
                {spell.duration && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Duration</Text>
                    <Text style={styles.statValue}>{spell.duration}</Text>
                  </View>
                )}
                {spell.components && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Components</Text>
                    <Text style={styles.statValue}>{spell.components}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.description}>
                {spell.description || "No description available for this spell."}
              </Text>
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        )}
      </View>
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
      fontSize: 19,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 13,
      marginTop: 4,
      marginBottom: 12,
      fontFamily: theme.displayFontFamily,
    },
    scroll: { flexGrow: 0 },
    scrollContent: { paddingBottom: 4 },
    statGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 14 },
    statItem: { minWidth: "40%" },
    statLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      fontWeight: "700",
      textTransform: "uppercase",
      fontFamily: theme.displayFontFamily,
    },
    statValue: {
      color: theme.colors.text,
      fontSize: 13,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    description: {
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 19,
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
