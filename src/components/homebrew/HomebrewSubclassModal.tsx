import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TextInput } from "../AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import { getRulesetCatalog } from "../../data/rulesets";
import {
  createHomebrewSubclass,
  updateHomebrewSubclass,
  type HomebrewSubclassInput,
} from "../../features/characters/homebrewRepo";
import { TraitListEditor, type NamedTrait } from "./TraitListEditor";

export type HomebrewSubclassRow = { id: number } & HomebrewSubclassInput;

export function HomebrewSubclassModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewSubclassRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const classOptions = useMemo(() => getRulesetCatalog(ruleset).classes, [ruleset]);

  const [name, setName] = useState(initial?.name ?? "");
  const [parentClassId, setParentClassId] = useState(initial?.parentClassId ?? "");
  const [traits, setTraits] = useState<NamedTrait[]>(initial?.traits ?? []);

  const canSave = name.trim().length > 0 && parentClassId.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewSubclassInput = {
      name: name.trim(),
      parentClassId: parentClassId.trim(),
      traits,
    };
    if (initial) await updateHomebrewSubclass(initial.id, input);
    else await createHomebrewSubclass(ruleset, input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Subclass" : "New Homebrew Subclass"}</Text>
            <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 440 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Path of the Ember"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={styles.subTitle}>Parent Class</Text>
              <View style={styles.wrapRow}>
                {classOptions.map((c) => (
                  <Pressable
                    key={c.id}
                    style={[styles.chip, parentClassId === c.id && styles.chipActive]}
                    onPress={() => setParentClassId(c.id)}
                  >
                    <Text style={[styles.chipText, parentClassId === c.id && styles.chipTextActive]}>{c.name}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>Or type a class id (built-in, or a homebrew class&apos;s)</Text>
              <TextInput
                style={styles.input}
                value={parentClassId}
                onChangeText={setParentClassId}
                placeholder="e.g. barbarian"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
              />

              <View style={{ marginTop: 12 }}>
                <TraitListEditor label="Traits" traits={traits} onChange={setTraits} />
              </View>
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
