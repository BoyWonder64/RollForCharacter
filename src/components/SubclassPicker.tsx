import { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { ClassProgression } from "../data/rulesets";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

type Props = {
  progression: ClassProgression;
  /** Subclass id for a catalog pick, or the player's own typed name for a custom one. Empty string means none chosen. */
  value: string;
  onChange: (value: string) => void;
  /** Optional hook for screens that need to scroll the custom-name field above the keyboard. */
  onCustomFocus?: Parameters<typeof TextInput>[0]["onFocus"];
};

/**
 * Chooses a class's subclass (Bard College, Divine Domain, Martial
 * Archetype, ...). Lists the ruleset's catalog entries, plus a "Custom"
 * option for anything not catalogued -- every edition only ships its SRD
 * subclasses' text, so the rest of a class's subclasses are typed by name.
 * Shared by onboarding and the edit screen; Level Up has its own
 * step-by-step version of the same choice.
 */
export function SubclassPicker({ progression, value, onChange, onCustomFocus }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const subclasses = progression.subclasses ?? [];
  const isCatalogPick = subclasses.some((s) => s.id === value);
  const isCustom = value !== "" && !isCatalogPick;
  const selected = subclasses.find((s) => s.id === value);

  return (
    <View>
      <View style={styles.chips}>
        <Chip label="None yet" active={value === ""} onPress={() => onChange("")} styles={styles} />
        {subclasses.map((sub) => (
          <Chip
            key={sub.id}
            label={sub.name}
            active={sub.id === value}
            onPress={() => onChange(sub.id)}
            styles={styles}
          />
        ))}
        <Chip
          label="Custom…"
          active={isCustom}
          // A lone space marks "custom picked, name not typed yet" without matching a catalog id.
          onPress={() => onChange(isCustom ? value : " ")}
          styles={styles}
        />
      </View>
      {selected && (
        <Text style={styles.hint}>
          {selected.srdLicensed
            ? selected.summary
            : "Not SRD content — we only record the name, so add your own notes for its features."}
        </Text>
      )}
      {isCustom && (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={onCustomFocus}
          placeholder={progression.subclassLabel ? `Name of your ${progression.subclassLabel}` : "Subclass name"}
          placeholderTextColor={theme.colors.textMuted}
        />
      )}
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  styles,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: theme.radius,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontSize: 14 },
    chipTextActive: { color: theme.colors.primaryText, fontWeight: "600" },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginTop: 8 },
    input: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
    },
  });
}
