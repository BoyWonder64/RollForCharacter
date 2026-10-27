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

export type CampaignNoteDraft = { subject: string; body: string };

type CampaignNoteModalProps = {
  visible: boolean;
  initial?: CampaignNoteDraft;
  onClose: () => void;
  onConfirm: (draft: CampaignNoteDraft) => void;
};

export function CampaignNoteModal({ visible, initial, onClose, onConfirm }: CampaignNoteModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && (
            <CampaignNoteModalForm initial={initial} onClose={onClose} onConfirm={onConfirm} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CampaignNoteModalForm({
  initial,
  onClose,
  onConfirm,
}: Omit<CampaignNoteModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { iconsEnabled, iconStyle } = useIconSettings();
  // The parent only mounts this form while the modal is visible (see
  // CampaignNoteModal above), so a fresh `initial` always means a fresh
  // mount -- no effect needed to re-seed these on change.
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const scrollIcon = iconsEnabled ? getCampaignItemIcon(iconStyle, "scroll") : undefined;

  function handleConfirm() {
    const trimmedSubject = subject.trim();
    if (!trimmedSubject) return;
    onConfirm({ subject: trimmedSubject, body: body.trim() });
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        {scrollIcon && <Image source={scrollIcon} style={styles.titleIcon} resizeMode="contain" />}
        <Text style={styles.title}>{initial ? "Edit Note" : "Add Note"}</Text>
      </View>

      <Text style={styles.fieldLabel}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g. The ambush at Raven's Pass"
        placeholderTextColor={theme.colors.textMuted}
        autoFocus
      />

      <Text style={styles.fieldLabel}>Note</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={body}
        onChangeText={setBody}
        placeholder="What happened…"
        placeholderTextColor={theme.colors.textMuted}
        multiline
      />

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={handleConfirm}>
          <Text style={styles.addButtonText}>{initial ? "Save" : "Add"}</Text>
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
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    titleIcon: { width: 22, height: 22 },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 10,
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
    multilineInput: { minHeight: 120, textAlignVertical: "top" },
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
