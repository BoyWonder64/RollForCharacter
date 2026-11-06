import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import {
  createHomebrewMagicItem,
  updateHomebrewMagicItem,
  type HomebrewMagicItemInput,
} from "../../features/characters/magicItemRepo";

export type HomebrewMagicItemRow = { id: number } & HomebrewMagicItemInput;

export function HomebrewMagicItemModal({
  visible,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  initial?: HomebrewMagicItemRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [rarity, setRarity] = useState(initial?.rarity ?? "");
  const [requiresAttunement, setRequiresAttunement] = useState(initial?.requiresAttunement ?? false);
  const [description, setDescription] = useState(initial?.description ?? "");

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewMagicItemInput = {
      name: name.trim(),
      category: category.trim(),
      rarity: rarity.trim(),
      requiresAttunement,
      description: description.trim(),
    };
    if (initial) await updateHomebrewMagicItem(initial.id, input);
    else await createHomebrewMagicItem(input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Magic Item" : "New Homebrew Magic Item"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 420 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Ring of Jumping"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />
              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g. Ring"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Rarity</Text>
                  <TextInput
                    style={styles.input}
                    value={rarity}
                    onChangeText={setRarity}
                    placeholder="e.g. Rare"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
              <Pressable style={[styles.row, { marginTop: 10 }]} onPress={() => setRequiresAttunement((v) => !v)}>
                <View style={[styles.squareButton, requiresAttunement && styles.chipActive]}>
                  <Text style={styles.squareButtonText}>{requiresAttunement ? "✓" : ""}</Text>
                </View>
                <Text style={styles.hint}>Requires attunement</Text>
              </Pressable>
              <Text style={styles.hint}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
                value={description}
                onChangeText={setDescription}
                placeholder="What does this item do?"
                placeholderTextColor={theme.colors.textMuted}
                multiline
              />
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
      </View>
    </Modal>
  );
}
