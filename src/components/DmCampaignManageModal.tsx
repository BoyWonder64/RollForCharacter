import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from "react-native";
import { Text, TextInput } from "./AppText";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

type Props = {
  visible: boolean;
  campaignName: string;
  /** Deleting is only offered when more than one campaign exists. */
  canDelete: boolean;
  onClose: () => void;
  onRename: (newName: string) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
};

/**
 * Rename / delete a DM campaign. Lives in its own modal (like note and event
 * editing) so the destructive action is never one stray tap away: deleting
 * needs a deliberate "Delete campaign" press, then typing the campaign's name.
 */
export function DmCampaignManageModal({
  visible,
  campaignName,
  canDelete,
  onClose,
  onRename,
  onDelete,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const [nameDraft, setNameDraft] = useState(campaignName);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (visible) {
      setNameDraft(campaignName);
      setConfirming(false);
      setConfirmText("");
    }
  }, [visible, campaignName]);

  const canRename = nameDraft.trim().length > 0 && nameDraft.trim() !== campaignName;
  const confirmMatches = confirmText.trim().toLowerCase() === campaignName.trim().toLowerCase();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Manage Campaign</Text>

            <Text style={styles.subTitle}>Name</Text>
            <TextInput
              style={styles.input}
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="Campaign name"
              placeholderTextColor={theme.colors.textMuted}
            />
            <Pressable
              style={[styles.primaryButton, { marginTop: 10 }, !canRename && styles.disabled]}
              disabled={!canRename}
              onPress={() => onRename(nameDraft)}
            >
              <Text style={styles.primaryButtonText}>Rename</Text>
            </Pressable>

            {canDelete ? (
              <>
                <Text style={[styles.subTitle, { marginTop: 24 }]}>Danger zone</Text>
                {confirming ? (
                  <>
                    <Text style={[styles.hint, { marginBottom: 8 }]}>
                      This permanently deletes the campaign with all of its notes and timeline.
                      Type "{campaignName}" to confirm.
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={confirmText}
                      onChangeText={setConfirmText}
                      placeholder={campaignName}
                      placeholderTextColor={theme.colors.textMuted}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Pressable
                      style={[
                        styles.dangerButton,
                        { marginTop: 10 },
                        !confirmMatches && styles.disabled,
                      ]}
                      disabled={!confirmMatches}
                      onPress={() => onDelete()}
                    >
                      <Text style={styles.dangerButtonText}>Permanently Delete</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable style={styles.secondaryButton} onPress={() => setConfirming(true)}>
                    <Text style={[styles.secondaryButtonText, { color: theme.colors.danger }]}>
                      Delete campaign…
                    </Text>
                  </Pressable>
                )}
              </>
            ) : null}

            <Pressable style={[styles.secondaryButton, { marginTop: 20 }]} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
