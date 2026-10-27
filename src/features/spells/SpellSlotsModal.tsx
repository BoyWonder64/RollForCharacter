import { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

const SLOT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

type SlotTotals = { level: number; total: number }[];

type SpellSlotsModalProps = {
  visible: boolean;
  slots: SlotTotals;
  onClose: () => void;
  onAdjustTotal: (level: number, current: number, delta: number) => void;
};

export function SpellSlotsModal({
  visible,
  slots,
  onClose,
  onAdjustTotal,
}: SpellSlotsModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {visible && (
          <View style={styles.card}>
            <Text style={styles.title}>Spell Slots</Text>
            <Text style={styles.hint}>
              Set how many slots this character has at each level — e.g. after leveling up.
            </Text>

            <ScrollView style={styles.scroll}>
              {SLOT_LEVELS.map((level) => {
                const total = slots.find((s) => s.level === level)?.total ?? 0;
                return (
                  <View key={level} style={styles.row}>
                    <Text style={styles.rowLabel}>Level {level}</Text>
                    <View style={styles.rowControls}>
                      <Pressable
                        style={[styles.stepButton, total === 0 && styles.stepButtonDisabled]}
                        onPress={() => onAdjustTotal(level, total, -1)}
                        disabled={total === 0}
                      >
                        <Text style={styles.stepButtonText}>−</Text>
                      </Pressable>
                      <Text style={styles.rowTotal}>{total}</Text>
                      <Pressable
                        style={styles.stepButton}
                        onPress={() => onAdjustTotal(level, total, 1)}
                      >
                        <Text style={styles.stepButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Done</Text>
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
      maxWidth: 400,
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
      marginBottom: 4,
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginBottom: 14,
      fontFamily: theme.displayFontFamily,
    },
    scroll: { flexGrow: 0 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    rowLabel: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    rowControls: { flexDirection: "row", alignItems: "center", gap: 16 },
    rowTotal: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      minWidth: 24,
      textAlign: "center",
      fontFamily: theme.displayFontFamily,
    },
    stepButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    stepButtonDisabled: { opacity: 0.4 },
    stepButtonText: {
      color: theme.colors.accent,
      fontSize: 22,
      fontWeight: "700",
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
