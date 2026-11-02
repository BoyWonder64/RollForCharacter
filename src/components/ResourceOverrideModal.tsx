import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

export type ResourceOverrideChange = { hidden: boolean; maxOverride: number | null };

type ResourceOverrideModalProps = {
  visible: boolean;
  name: string;
  /** The ruleset's own max for this resource. */
  defaultMax: number;
  /** The current override, if any. */
  overrideMax?: number;
  hidden: boolean;
  onClose: () => void;
  onSave: (change: ResourceOverrideChange) => void;
};

/** House rules for a built-in ability: change its number of uses, or hide it. Blank max = use the ruleset's. */
export function ResourceOverrideModal(props: ResourceOverrideModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.backdrop}>{props.visible && <OverrideForm {...props} />}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function OverrideForm({ name, defaultMax, overrideMax, hidden, onClose, onSave }: ResourceOverrideModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [maxText, setMaxText] = useState(overrideMax !== undefined ? String(overrideMax) : "");
  const [isHidden, setIsHidden] = useState(hidden);

  const parsed = maxText.trim() === "" ? null : Number(maxText);
  const valid = parsed === null || (Number.isInteger(parsed) && parsed >= 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.hint}>House rules for this built-in ability. Ruleset default: {defaultMax} use{defaultMax === 1 ? "" : "s"}.</Text>

      <Text style={styles.fieldLabel}>Uses (leave blank for default)</Text>
      <TextInput
        style={[styles.input, !valid && styles.inputInvalid]}
        value={maxText}
        onChangeText={setMaxText}
        keyboardType="number-pad"
        placeholder={String(defaultMax)}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Pressable style={[styles.toggle, isHidden && styles.toggleOn]} onPress={() => setIsHidden(!isHidden)}>
        <Text style={[styles.toggleText, isHidden && styles.toggleTextOn]}>
          {isHidden ? "Hidden from the sheet" : "Hide from the sheet"}
        </Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={() => onSave({ hidden: false, maxOverride: null })}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.addButton, !valid && styles.disabled]}
          disabled={!valid}
          onPress={() => onSave({ hidden: isHidden, maxOverride: parsed })}
        >
          <Text style={styles.addButtonText}>Save</Text>
        </Pressable>
      </View>
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
    },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4, fontFamily: theme.displayFontFamily },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 14,
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontFamily: theme.displayFontFamily,
    },
    inputInvalid: { borderColor: "#c0392b" },
    toggle: {
      marginTop: 14,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
    },
    toggleOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    toggleText: { color: theme.colors.text, fontSize: 13, fontFamily: theme.displayFontFamily },
    toggleTextOn: { color: theme.colors.primaryText, fontWeight: "700" },
    buttonRow: { flexDirection: "row", gap: 8, marginTop: 20 },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    secondaryButtonText: { color: theme.colors.text, fontWeight: "700", fontFamily: theme.displayFontFamily },
    addButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    addButtonText: { color: theme.colors.primaryText, fontWeight: "700", fontFamily: theme.displayFontFamily },
    disabled: { opacity: 0.5 },
  });
}
