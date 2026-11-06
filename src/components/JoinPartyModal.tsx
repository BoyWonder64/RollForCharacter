import { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, View } from "react-native";
import { Text, TextInput } from "./AppText";
import { useTheme } from "../theme/ThemeContext";
import { joinParty } from "../features/party/partyRepo";
import { createDmStyles } from "./dmStyles";

/** Player-side: enter the DM's invite code to join their party. */
export function JoinPartyModal({
  visible,
  onClose,
  onJoined,
}: {
  visible: boolean;
  onClose: () => void;
  onJoined: () => void;
}) {
  const theme = useTheme();
  const styles = createDmStyles(theme);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleJoin() {
    if (!code.trim()) return;
    setSubmitting(true);
    try {
      await joinParty(code.trim().toUpperCase());
      setCode("");
      onJoined();
    } catch (err) {
      Alert.alert("Couldn't join that party", err instanceof Error ? err.message : "Try again.");
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
          <Text style={styles.modalTitle}>Join a party</Text>
          <Text style={[styles.hint, { marginBottom: 10 }]}>
            Ask your DM for the invite code.
          </Text>
          <TextInput
            style={[styles.input, { letterSpacing: 2 }]}
            value={code}
            onChangeText={setCode}
            placeholder="ABC123"
            placeholderTextColor={theme.colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <View style={[styles.row, { marginTop: 14, justifyContent: "flex-end" }]}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, (submitting || !code.trim()) && styles.disabled]}
              disabled={submitting || !code.trim()}
              onPress={handleJoin}
            >
              <Text style={styles.primaryButtonText}>Join</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
