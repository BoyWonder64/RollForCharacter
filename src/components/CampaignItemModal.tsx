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
import {
  CAMPAIGN_ITEM_ICON_IDS,
  CAMPAIGN_ITEM_ICON_LABELS,
  getCampaignItemIcon,
  type CampaignItemIconId,
} from "../features/icons/iconAssets";

type CampaignItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (input: { name: string; icon: CampaignItemIconId; description: string }) => void;
};

export function CampaignItemModal({ visible, onClose, onConfirm }: CampaignItemModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && <CampaignItemModalForm onClose={onClose} onConfirm={onConfirm} />}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CampaignItemModalForm({ onClose, onConfirm }: Omit<CampaignItemModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<CampaignItemIconId>(CAMPAIGN_ITEM_ICON_IDS[0]);

  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm({ name: trimmed, icon, description: description.trim() });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Add Item</Text>

      <Text style={styles.fieldLabel}>Icon</Text>
      <View style={styles.iconGrid}>
        {CAMPAIGN_ITEM_ICON_IDS.map((id) => {
          const active = icon === id;
          const iconSource = iconsEnabled ? getCampaignItemIcon(iconStyle, id) : undefined;
          return (
            <Pressable
              key={id}
              onPress={() => setIcon(id)}
              style={[styles.iconChip, active && styles.iconChipActive]}
            >
              {iconSource ? (
                <Image source={iconSource} style={styles.iconImage} resizeMode="contain" />
              ) : (
                <Text style={styles.iconFallback}>{CAMPAIGN_ITEM_ICON_LABELS[id][0]}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. The Duke's Signet Ring"
        placeholderTextColor={theme.colors.textMuted}
        autoFocus
      />

      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="What is it, where did it come from…"
        placeholderTextColor={theme.colors.textMuted}
        multiline
      />

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={handleConfirm}>
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
      marginBottom: 12,
    },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 10,
      fontFamily: theme.displayFontFamily,
    },
    iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    iconChip: {
      width: 48,
      height: 48,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    iconChipActive: { borderColor: theme.colors.primary, borderWidth: 2 },
    iconImage: { width: 32, height: 32 },
    iconFallback: { color: theme.colors.text, fontWeight: "700" },
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
    multilineInput: { minHeight: 70, textAlignVertical: "top" },
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
