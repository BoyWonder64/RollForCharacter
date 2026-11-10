import { useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Text } from "../../components/AppText";
import { Button } from "../../components/Button";
import { RULESETS } from "../../data/rulesets";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import { SAMPLE_LEVELS, createSampleCharacter, runDataHealthCheck, type HealthReport } from "./devTools";
import { withAlpha, BOX_ALPHA } from "../../theme/alpha";

/** Developer-mode tools in Settings: sample characters and the data health check. */
export function DevToolsSection() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [ruleset, setRuleset] = useState("5e-2024");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<HealthReport | null>(null);

  async function handleSample(level: number) {
    setBusy(true);
    try {
      const { name } = await createSampleCharacter(ruleset, level);
      Alert.alert("Sample character created", `${name} is on the Characters tab.`);
    } catch (error) {
      Alert.alert("Couldn't create sample character", String(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleHealthCheck() {
    setBusy(true);
    try {
      setReport(await runDataHealthCheck());
    } catch (error) {
      Alert.alert("Health check failed", String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Sample characters</Text>
      <Text style={styles.hint}>
        Creates a ready-to-test character: the ruleset&apos;s first race and first class, standard array
        scores, then real level-ups at average HP (so proficiency, hit dice, subclass and spell slots
        follow the normal rules). No starting equipment, skills or prepared spells, and ability score
        improvements are skipped. To duplicate a real character instead, long-press it on the
        Characters tab.
      </Text>
      <View style={styles.row}>
        {Object.values(RULESETS).map((r) => (
          <Button
            key={r.id}
            title={r.id}
            size="sm"
            selected={ruleset === r.id}
            variant={ruleset === r.id ? "primary" : "secondary"}
            onPress={() => setRuleset(r.id)}
          />
        ))}
      </View>
      <View style={styles.row}>
        {SAMPLE_LEVELS.map((level) => (
          <Button
            key={level}
            title={`Level ${level}`}
            size="sm"
            disabled={busy}
            onPress={() => handleSample(level)}
          />
        ))}
      </View>

      <Text style={[styles.title, styles.gap]}>Data health check</Text>
      <Text style={styles.hint}>
        Counts rows in the main tables and checks every ruleset for classes missing a progression,
        features, starting equipment or spell slots.
      </Text>
      <Button title="Run health check" size="sm" disabled={busy} onPress={handleHealthCheck} />
      {report && (
        <View style={styles.report}>
          {report.counts.map((c) => (
            <Text key={c.label} style={styles.line}>{`${c.label}: ${c.value}`}</Text>
          ))}
          <Text style={[styles.line, styles.gap]}>
            {report.warnings.length === 0
              ? "Catalog checks: no problems found."
              : `Catalog checks: ${report.warnings.length} warning(s)`}
          </Text>
          {report.warnings.map((w) => (
            <Text key={w} style={styles.warning}>{`• ${w}`}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    box: {
      backgroundColor: withAlpha(theme.colors.surface, BOX_ALPHA),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 14,
      marginTop: 12,
    },
    title: { color: theme.colors.text, fontSize: 15, fontWeight: "600" },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginVertical: 8 },
    row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
    gap: { marginTop: 16 },
    report: { marginTop: 12 },
    line: { color: theme.colors.text, fontSize: 13 },
    warning: { color: theme.colors.danger, fontSize: 12, marginTop: 2 },
  });
}
