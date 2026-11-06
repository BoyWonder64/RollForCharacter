import { useMemo } from "react";
import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./AppText";
import { longRest, shortRest } from "../features/characters/characterRepo";
import type { Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

type RestModalProps = {
  visible: boolean;
  character: Character;
  onClose: () => void;
  onChanged: () => void;
};

export function RestModal({ visible, character, onClose, onChanged }: RestModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Only mounted while visible, so lastRoll always starts fresh on open. */}
        {visible && (
          <RestModalForm character={character} onClose={onClose} onChanged={onChanged} />
        )}
      </View>
    </Modal>
  );
}

function RestModalForm({
  character,
  onClose,
  onChanged,
}: Omit<RestModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  async function handleShortRest() {
    await shortRest(character.id);
    onChanged();
    onClose();
    Alert.alert(
      "Short Rest Complete",
      "Recharged Action Surge, Second Wind, and any other class feature that regains uses on a short rest."
    );
  }

  function handleLongRest() {
    Alert.alert(
      "Take a Long Rest?",
      "Restores all HP and spell slots, and regains some spent Hit Dice.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Long Rest",
          onPress: async () => {
            const outcome = await longRest(character.id);
            onChanged();
            onClose();
            if (outcome) {
              Alert.alert(
                "Long Rest Complete",
                `Restored ${outcome.hpRestored} HP and ${outcome.hitDiceRestored} Hit ${outcome.hitDiceRestored === 1 ? "Die" : "Dice"}.`
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rest</Text>

      <Text style={styles.sectionLabel}>Short Rest</Text>
      <Text style={styles.helperText}>
        Recharges Action Surge, Second Wind, and any other class feature that regains uses on a
        short rest -- usable any time you&apos;re not in combat. Spend Hit Dice to heal in the
        Class Resources card.
      </Text>
      <Pressable style={styles.secondaryButton} onPress={handleShortRest}>
        <Text style={styles.secondaryButtonText}>Finish Short Rest</Text>
      </Pressable>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Long Rest</Text>
      <Text style={styles.helperText}>
        Full HP, all spell slots, and some Hit Dice back -- an in-game 8 hours.
      </Text>
      <Pressable style={styles.longRestButton} onPress={handleLongRest}>
        <Text style={styles.longRestButtonText}>Take Long Rest</Text>
      </Pressable>

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
      maxWidth: 360,
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
      marginBottom: 14,
    },
    sectionLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontFamily: theme.displayFontFamily,
      marginBottom: 8,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 10,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 16,
    },
    helperText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginBottom: 10,
      fontFamily: theme.displayFontFamily,
    },
    longRestButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    longRestButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    closeButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 14,
    },
    closeButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
