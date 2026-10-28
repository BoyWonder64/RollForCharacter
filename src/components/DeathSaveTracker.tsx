import { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  reviveCharacter,
  rollDeathSave,
  stabilizeDeathSaves,
  type DeathSaveOutcome,
} from "../features/characters/characterRepo";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getSpellSchoolIcon } from "../features/icons/iconAssets";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

export function DeathSaveTracker({
  characterId,
  successes,
  failures,
  onChanged,
}: {
  characterId: number;
  successes: number;
  failures: number;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [lastOutcome, setLastOutcome] = useState<DeathSaveOutcome | null>(null);

  // Reusing the Necromancy spell-school icon as a skull -- there's no
  // dedicated skull asset yet.
  const skullIcon = iconsEnabled ? getSpellSchoolIcon(iconStyle, "necromancy") : undefined;

  const resolved = successes >= 3 || failures >= 3;
  const dead = failures >= 3;

  async function handleRoll() {
    const outcome = await rollDeathSave(characterId);
    if (outcome) setLastOutcome(outcome);
    onChanged();
  }

  function handleStabilize() {
    Alert.alert(
      "Stabilize Character",
      "Mark this character as stabilized without rolling? Use this when an ally's Medicine check succeeds, or to stop rolling death saves.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stabilize",
          onPress: async () => {
            await stabilizeDeathSaves(characterId);
            setLastOutcome(null);
            onChanged();
          },
        },
      ]
    );
  }

  function handleRevive() {
    Alert.alert(
      "Revive Character",
      "Bring this character back from death at 1 HP? This is for DM fiat, a revivify spell, or correcting a mistake.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revive",
          onPress: async () => {
            await reviveCharacter(characterId);
            setLastOutcome(null);
            onChanged();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {skullIcon && (
          <Image source={skullIcon} style={styles.skullIcon} resizeMode="contain" />
        )}
        <Text style={styles.title}>{dead ? "Dead" : "Dying — 0 HP"}</Text>
      </View>

      <View style={styles.pipRow}>
        <Text style={styles.pipLabel}>Successes</Text>
        <View style={styles.pips}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.pip, i < successes && styles.pipSuccessOn]} />
          ))}
        </View>
      </View>
      <View style={styles.pipRow}>
        <Text style={styles.pipLabel}>Failures</Text>
        <View style={styles.pips}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.pip, i < failures && styles.pipFailureOn]} />
          ))}
        </View>
      </View>

      {!resolved && (
        <>
          <Pressable style={styles.rollButton} onPress={handleRoll}>
            <Text style={styles.rollButtonText}>Roll Death Save</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleStabilize}>
            <Text style={styles.secondaryButtonText}>Stabilize / Stop Rolling</Text>
          </Pressable>
          <Text style={styles.helperText}>
            An ally within 5 feet can stabilize you instead of rolling: on their turn, they use
            an action for a DC 10 Wisdom (Medicine) check against you. Success stabilizes you (no
            HP gained, but no more death saves needed) until you&apos;re healed or take damage again.
          </Text>
          <Text style={styles.warningText}>This is a big deal — real dice are recommended.</Text>
        </>
      )}

      {resolved && (
        <>
          <Text style={styles.resolvedText}>
            {dead ? "Three failures — this character has died." : "Stabilized."}
          </Text>
          {dead && (
            <Pressable style={styles.reviveButton} onPress={handleRevive}>
              <Text style={styles.reviveButtonText}>Revive at 1 HP</Text>
            </Pressable>
          )}
        </>
      )}

      {lastOutcome && (
        <Text style={styles.lastRollText}>
          Last roll: {lastOutcome.roll}
          {lastOutcome.roll === 20
            ? " — natural 20! Wakes at 1 HP."
            : lastOutcome.roll === 1
              ? " — natural 1, counts as two failures."
              : ""}
        </Text>
      )}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      borderRadius: theme.radius,
      padding: 14,
      marginTop: 12,
    },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    skullIcon: { width: 28, height: 28 },
    title: {
      color: theme.colors.danger,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    pipRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
    pipLabel: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily },
    pips: { flexDirection: "row", gap: 6 },
    pip: {
      width: 16,
      height: 16,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
    },
    pipSuccessOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    pipFailureOn: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },
    rollButton: {
      backgroundColor: theme.colors.danger,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    rollButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    reviveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    reviveButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    resolvedText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      marginTop: 6,
    },
    lastRollText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 6,
      fontFamily: theme.displayFontFamily,
    },
    helperText: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 8,
      fontFamily: theme.displayFontFamily,
    },
    warningText: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 6,
      fontFamily: theme.displayFontFamily,
    },
  });
}
