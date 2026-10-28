import { useMemo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  longRest,
  shortRest,
  spendHitDie,
  type SpendHitDieOutcome,
} from "../features/characters/characterRepo";
import { getClassDefinitionForCharacter } from "../features/characters/characterCalculations";
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
  const [lastRoll, setLastRoll] = useState<SpendHitDieOutcome | null>(null);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const hitDie = getClassDefinitionForCharacter(character).hitDie;
  const atFullHp = character.currentHp >= character.maxHp;
  const spendDisabled = character.hitDiceRemaining <= 0 || atFullHp;
  const parsedManualValue = parseInt(manualValue, 10);
  const manualValueValid =
    Number.isInteger(parsedManualValue) && parsedManualValue >= 1 && parsedManualValue <= hitDie;

  async function handleSpendHitDie(manualRoll?: number) {
    const outcome = await spendHitDie(character.id, manualRoll);
    if (outcome) setLastRoll(outcome);
    onChanged();
  }

  function handleManualSubmit() {
    if (!manualValueValid) return;
    handleSpendHitDie(parsedManualValue);
    setManualValue("");
    setManualEntryOpen(false);
  }

  async function handleShortRest() {
    await shortRest(character.id);
    onChanged();
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
        Spend a Hit Die to roll d{hitDie} + CON and heal that much -- usable any time you&apos;re
        not in combat, as many times as you have dice left.
      </Text>
      <Text style={styles.hitDiceText}>
        Hit Dice: {character.hitDiceRemaining}/{character.level} (d{hitDie})
      </Text>
      <View style={styles.hitDiceButtonRow}>
        <Pressable
          style={[styles.spendButton, spendDisabled && styles.spendButtonDisabled]}
          disabled={spendDisabled}
          onPress={() => handleSpendHitDie()}
        >
          <Text style={styles.spendButtonText}>Roll For Me</Text>
        </Pressable>
        <Pressable
          style={[styles.spendButton, spendDisabled && styles.spendButtonDisabled]}
          disabled={spendDisabled}
          onPress={() => setManualEntryOpen((prev) => !prev)}
        >
          <Text style={styles.spendButtonText}>I Rolled My Own</Text>
        </Pressable>
      </View>
      {manualEntryOpen && (
        <View style={styles.manualEntryRow}>
          <Text style={styles.manualEntryLabel}>You rolled a d{hitDie} of</Text>
          <TextInput
            style={styles.manualInput}
            keyboardType="number-pad"
            value={manualValue}
            onChangeText={setManualValue}
            placeholder={`1-${hitDie}`}
            placeholderTextColor={theme.colors.textMuted}
            maxLength={2}
          />
          <Pressable
            style={[styles.confirmButton, !manualValueValid && styles.spendButtonDisabled]}
            disabled={!manualValueValid}
            onPress={handleManualSubmit}
          >
            <Text style={styles.spendButtonText}>Apply</Text>
          </Pressable>
        </View>
      )}
      {lastRoll && (
        <Text style={styles.lastRollText}>
          Rolled {lastRoll.roll.total} → healed {lastRoll.healed} HP (now {character.currentHp}/
          {character.maxHp}).
        </Text>
      )}
      <Pressable style={styles.secondaryButton} onPress={handleShortRest}>
        <Text style={styles.secondaryButtonText}>Finish Short Rest</Text>
      </Pressable>
      <Text style={styles.helperText}>
        Recharges Action Surge, Second Wind, and any other class feature that regains uses on a
        short rest.
      </Text>

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
    hitDiceText: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      marginBottom: 8,
    },
    hitDiceButtonRow: { flexDirection: "row", gap: 10 },
    spendButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 10,
      alignItems: "center",
    },
    spendButtonDisabled: { opacity: 0.5 },
    spendButtonText: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    manualEntryRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    manualEntryLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
      flexShrink: 1,
    },
    manualInput: {
      width: 56,
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      textAlign: "center",
    },
    confirmButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    lastRollText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 8,
      fontFamily: theme.displayFontFamily,
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
