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

export type CurrencyDenomination = "copper" | "silver" | "electrum" | "gold" | "platinum";

const DENOMINATIONS: { key: CurrencyDenomination; label: string }[] = [
  { key: "copper", label: "CP" },
  { key: "silver", label: "SP" },
  { key: "electrum", label: "EP" },
  { key: "gold", label: "GP" },
  { key: "platinum", label: "PP" },
];

type CurrencyModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (denomination: CurrencyDenomination, delta: number) => void;
};

export function CurrencyModal({ visible, onClose, onConfirm }: CurrencyModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && <CurrencyModalForm onClose={onClose} onConfirm={onConfirm} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CurrencyModalForm({ onClose, onConfirm }: Omit<CurrencyModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [denomination, setDenomination] = useState<CurrencyDenomination>("gold");
  const [amountText, setAmountText] = useState("");
  const coinIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "coin") : undefined;

  function handleConfirm(sign: 1 | -1) {
    const amount = parseInt(amountText, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    onConfirm(denomination, amount * sign);
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {coinIcon && <Image source={coinIcon} style={styles.titleIcon} resizeMode="contain" />}
        <Text style={styles.title}>Currency</Text>
      </View>
      <View style={styles.chipRow}>
        {DENOMINATIONS.map((d) => (
          <Pressable
            key={d.key}
            style={[styles.chip, denomination === d.key && styles.chipActive]}
            onPress={() => setDenomination(d.key)}
          >
            <Text style={[styles.chipText, denomination === d.key && styles.chipTextActive]}>
              {d.label}
            </Text>
          </Pressable>
        ))}
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
      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.spendButton} onPress={() => handleConfirm(-1)}>
          <Text style={styles.spendButtonText}>Spend</Text>
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
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    titleIcon: { width: 22, height: 22 },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    chipRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
    chip: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    chipTextActive: { color: theme.colors.primaryText },
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
    spendButton: {
      flex: 1,
      backgroundColor: theme.colors.danger,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    spendButtonText: { color: "#FFFFFF", fontWeight: "700", fontFamily: theme.displayFontFamily },
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
