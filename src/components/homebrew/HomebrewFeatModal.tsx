import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import { createHomebrewFeat, updateHomebrewFeat, type HomebrewFeatInput } from "../../features/characters/featRepo";

export type HomebrewFeatRow = { id: number } & HomebrewFeatInput;

export function HomebrewFeatModal({
  visible,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  initial?: HomebrewFeatRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [prerequisite, setPrerequisite] = useState(initial?.prerequisite ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewFeatInput = {
      name: name.trim(),
      prerequisite: prerequisite.trim(),
      description: description.trim(),
    };
    if (initial) await updateHomebrewFeat(initial.id, input);
    else await createHomebrewFeat(input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Feat" : "New Homebrew Feat"}</Text>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 420 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Battle Reflexes"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />
              <Text style={styles.hint}>Prerequisite (optional)</Text>
              <TextInput
                style={styles.input}
                value={prerequisite}
                onChangeText={setPrerequisite}
                placeholder="e.g. Level 4+"
                placeholderTextColor={theme.colors.textMuted}
              />
              <Text style={styles.hint}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                value={description}
                onChangeText={setDescription}
                placeholder="What does this feat do?"
                placeholderTextColor={theme.colors.textMuted}
                multiline
              />
              <Text style={[styles.hint, { marginTop: 4 }]}>
                Mechanical effects (ability score increases, etc.) aren&apos;t set here yet -- add
                those after taking the feat onto a character.
              </Text>
            </KeyboardAwareScrollView>

            <View style={[styles.row, { marginTop: 12 }]}>
              <Pressable style={[styles.secondaryButton, { flex: 1 }]} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, { flex: 1 }, !canSave && styles.disabled]}
                disabled={!canSave}
                onPress={handleSave}
              >
                <Text style={styles.primaryButtonText}>{initial ? "Save" : "Create"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <KeyboardToolbar />
      </View>
    </Modal>
  );
}
