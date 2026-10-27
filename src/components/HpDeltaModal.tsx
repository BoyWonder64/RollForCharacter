import { useMemo, useState } from "react";
import {
  Image,
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
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getCampaignItemIcon } from "../features/icons/iconAssets";

type HpDeltaModalProps = {
  visible: boolean;
  mode: "damage" | "heal";
  onClose: () => void;
  onConfirm: (amount: number, options?: { critical?: boolean }) => void;
};

export function HpDeltaModal({ visible, mode, onClose, onConfirm }: HpDeltaModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {/* Only mounted while visible, so its form state always starts
              fresh on open instead of needing an effect to reset it. */}
          {visible && (
            <HpDeltaModalForm mode={mode} onClose={onClose} onConfirm={onConfirm} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function HpDeltaModalForm({
  mode,
  onClose,
  onConfirm,
}: Omit<HpDeltaModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [amountText, setAmountText] = useState("");
  const [critical, setCritical] = useState(false);

  function handleConfirm() {
    const amount = parseInt(amountText, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    onConfirm(amount, mode === "damage" ? { critical } : undefined);
  }

  const title = mode === "damage" ? "Take Damage" : "Heal";
  const titleIcon = iconsEnabled
    ? getCampaignItemIcon(iconStyle, mode === "damage" ? "sword" : "potion")
    : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {titleIcon && <Image source={titleIcon} style={styles.titleIconImg} resizeMode="contain" />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={amountText}
        onChangeText={setAmountText}
        placeholder="0"
        placeholderTextColor={theme.colors.textMuted}
        keyboardType="number-pad"
        autoFocus
      />
      {mode === "damage" && (
        <Pressable style={styles.criticalRow} onPress={() => setCritical((v) => !v)}>
          <View style={[styles.checkbox, critical && styles.checkboxOn]} />
          <Text style={styles.criticalLabel}>Critical hit</Text>
        </Pressable>
      )}
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handleConfirm}>
          <Text style={styles.primaryButtonText}>{title}</Text>
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
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    titleIconImg: { width: 22, height: 22 },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
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
      fontSize: 18,
      textAlign: "center",
    },
    criticalRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 14,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
    },
    checkboxOn: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
    criticalLabel: { color: theme.colors.text, fontFamily: theme.displayFontFamily },
    buttonRow: { flexDirection: "row", gap: 10, marginTop: 20 },
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
    primaryButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    primaryButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
