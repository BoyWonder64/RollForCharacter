import { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { createParty } from "../features/party/partyRepo";
import { createDmStyles } from "./dmStyles";

/** DM-side: name a new party and get back its invite code to share. */
export function CreatePartyModal({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const theme = useTheme();
  const styles = createDmStyles(theme);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createParty(name.trim());
      setName("");
      onCreated();
    } catch (err) {
      Alert.alert("Couldn't create the party", err instanceof Error ? err.message : "Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Create a party</Text>
          <Text style={[styles.hint, { marginBottom: 10 }]}>
            You&apos;ll be the DM. Players join later with an invite code.
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Party name"
            placeholderTextColor={theme.colors.textMuted}
          />
          <View style={[styles.row, { marginTop: 14, justifyContent: "flex-end" }]}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, (submitting || !name.trim()) && styles.disabled]}
              disabled={submitting || !name.trim()}
              onPress={handleCreate}
            >
              <Text style={styles.primaryButtonText}>Create</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
