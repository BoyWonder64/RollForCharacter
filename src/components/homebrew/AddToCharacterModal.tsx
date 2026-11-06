import { useMemo } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { Text } from "../AppText";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import type { Character } from "../../types/models";

/** Picks which character a homebrew library entry should be applied to. */
export function AddToCharacterModal({
  visible,
  characters,
  itemName,
  onClose,
  onPick,
}: {
  visible: boolean;
  characters: Character[];
  itemName: string;
  onClose: () => void;
  onPick: (characterId: number) => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add &quot;{itemName}&quot; to…</Text>
          {characters.length === 0 ? (
            <Text style={[styles.hint, { marginBottom: 10 }]}>
              No characters match this ruleset yet. Create one first.
            </Text>
          ) : (
            <ScrollView style={{ maxHeight: 360 }}>
              {characters.map((c) => (
                <Pressable key={c.id} style={styles.card} onPress={() => onPick(c.id)}>
                  <Text style={styles.sectionTitle}>{c.name}</Text>
                  <Text style={styles.hint}>
                    {[c.race, c.className].filter(Boolean).join(" ") || "No race/class set"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          <View style={[styles.row, { marginTop: 14, justifyContent: "flex-end" }]}>
            <Pressable style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
