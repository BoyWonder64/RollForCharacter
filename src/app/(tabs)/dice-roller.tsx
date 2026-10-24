import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { InvalidDiceExpressionError, rollExpression, type RollResult } from "../../features/dice/diceEngine";
import { recentRolls, saveRoll } from "../../features/dice/diceRepo";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

const QUICK_DICE = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export default function DiceRollerScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [expression, setExpression] = useState("1d20");
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Awaited<ReturnType<typeof recentRolls>>>([]);

  const refreshHistory = useCallback(() => {
    recentRolls().then(setHistory);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshHistory();
    }, [refreshHistory])
  );

  async function handleRoll(expr: string) {
    try {
      const result = rollExpression(expr);
      setLastRoll(result);
      setError(null);
      await saveRoll(result);
      refreshHistory();
    } catch (err) {
      if (err instanceof InvalidDiceExpressionError) {
        setError(err.message);
      } else {
        throw err;
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dice Roller</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={expression}
          onChangeText={setExpression}
          placeholder="e.g. 2d6+3"
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          onSubmitEditing={() => handleRoll(expression)}
        />
        <Pressable style={styles.rollButton} onPress={() => handleRoll(expression)}>
          <Text style={styles.rollButtonText}>Roll</Text>
        </Pressable>
      </View>

      <View style={styles.quickRow}>
        {QUICK_DICE.map((die) => (
          <Pressable
            key={die}
            style={styles.quickButton}
            onPress={() => {
              setExpression(`1${die}`);
              handleRoll(`1${die}`);
            }}
          >
            <Text style={styles.quickButtonText}>{die}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {lastRoll ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultTotal}>{lastRoll.total}</Text>
          <Text style={styles.resultExpression}>{lastRoll.expression}</Text>
          <Text style={styles.resultBreakdown}>{lastRoll.breakdown}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>History</Text>
      <ScrollView style={styles.history}>
        {history.map((roll) => (
          <View key={roll.id} style={styles.historyRow}>
            <Text style={styles.historyExpression}>{roll.expression}</Text>
            <Text style={styles.historyBreakdown}>{roll.breakdown}</Text>
            <Text style={styles.historyTotal}>{roll.result}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    title: { color: theme.colors.text, fontSize: 24, fontWeight: "700", marginBottom: 16 },
    inputRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    input: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    rollButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 20,
      justifyContent: "center",
    },
    rollButtonText: { color: theme.colors.primaryText, fontWeight: "700" },
    quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    quickButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    quickButtonText: { color: theme.colors.text, fontWeight: "600" },
    error: { color: theme.colors.danger, marginBottom: 12 },
    resultCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
      alignItems: "center",
      marginBottom: 16,
    },
    resultTotal: { color: theme.colors.text, fontSize: 40, fontWeight: "800" },
    resultExpression: {
      color: theme.colors.accent,
      fontSize: 14,
      marginTop: 4,
      fontWeight: "600",
    },
    resultBreakdown: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4 },
    sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 8 },
    history: { flex: 1 },
    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 6,
    },
    historyExpression: { color: theme.colors.text, width: 70, fontWeight: "600" },
    historyBreakdown: { color: theme.colors.textMuted, flex: 1, fontSize: 12 },
    historyTotal: { color: theme.colors.text, fontWeight: "700" },
  });
}
