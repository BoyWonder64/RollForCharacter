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

type XpModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (delta: number) => void;
};

export function XpModal({ visible, onClose, onConfirm }: XpModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && <XpModalForm onClose={onClose} onConfirm={onConfirm} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function XpModalForm({ onClose, onConfirm }: Omit<XpModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [amountText, setAmountText] = useState("");

  function handleConfirm(sign: 1 | -1) {
    const amount = parseInt(amountText, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    onConfirm(amount * sign);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Experience Points</Text>
      <TextInput
        style={styles.input}
        value={amountText}
        onChangeText={setAmountText}
        placeholder="0"
        placeholderTextColor={theme.colors.textMuted}
        keyboardType="number-pad"
        autoFocus
      />
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.correctButton} onPress={() => handleConfirm(-1)}>
          <Text style={styles.correctButtonText}>Subtract</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={() => handleConfirm(1)}>
          <Text style={styles.addButtonText}>Add</Text>
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
      maxWidth: 320,
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
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 18,
      textAlign: "center",
    },
    buttonRow: { flexDirection: "row", gap: 8, marginTop: 20 },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    correctButton: {
      flex: 1,
      backgroundColor: theme.colors.danger,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    correctButtonText: { color: "#FFFFFF", fontWeight: "700", fontFamily: theme.displayFontFamily },
    addButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    addButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
