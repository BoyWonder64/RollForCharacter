import { useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { useTheme } from "../../theme/ThemeContext";
import { createDmStyles } from "../dmStyles";
import { getRulesetCatalog } from "../../data/rulesets";
import { createHomebrewSpell, updateHomebrewSpell, type HomebrewSpellInput } from "../../features/spells/spellRepo";

export type HomebrewSpellRow = { id: number } & HomebrewSpellInput;

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function HomebrewSpellModal({
  visible,
  ruleset,
  initial,
  onClose,
  onSaved,
}: {
  visible: boolean;
  ruleset: string;
  initial?: HomebrewSpellRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const classOptions = useMemo(() => getRulesetCatalog(ruleset).classes, [ruleset]);

  const [name, setName] = useState(initial?.name ?? "");
  const [level, setLevel] = useState(initial?.level ?? 1);
  const [school, setSchool] = useState(initial?.school ?? "");
  const [castingTime, setCastingTime] = useState(initial?.castingTime ?? "");
  const [range, setRange] = useState(initial?.range ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [components, setComponents] = useState(initial?.components ?? "");
  const [concentration, setConcentration] = useState(initial?.concentration ?? false);
  const [ritual, setRitual] = useState(initial?.ritual ?? false);
  const [classes, setClasses] = useState<string[]>(initial?.classes ?? []);
  const [description, setDescription] = useState(initial?.description ?? "");

  const canSave = name.trim().length > 0;

  function toggleClass(id: string) {
    setClasses((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSave() {
    if (!canSave) return;
    const input: HomebrewSpellInput = {
      name: name.trim(),
      level,
      school: school.trim(),
      castingTime: castingTime.trim(),
      range: range.trim(),
      duration: duration.trim(),
      components: components.trim(),
      concentration,
      ritual,
      classes,
      description: description.trim(),
    };
    if (initial) await updateHomebrewSpell(initial.id, input);
    else await createHomebrewSpell(input);
    onSaved();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{initial ? "Edit Spell" : "New Homebrew Spell"}</Text>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 440 }}
              bottomOffset={60}
            >
              <Text style={styles.hint}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Ember Burst"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />

              <Text style={styles.subTitle}>Level</Text>
              <View style={styles.wrapRow}>
                {LEVELS.map((l) => (
                  <Pressable key={l} style={[styles.chip, level === l && styles.chipActive]} onPress={() => setLevel(l)}>
                    <Text style={[styles.chipText, level === l && styles.chipTextActive]}>
                      {l === 0 ? "Cantrip" : l}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>School</Text>
                  <TextInput style={styles.input} value={school} onChangeText={setSchool} placeholder="Evocation" placeholderTextColor={theme.colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Casting Time</Text>
                  <TextInput style={styles.input} value={castingTime} onChangeText={setCastingTime} placeholder="1 action" placeholderTextColor={theme.colors.textMuted} />
                </View>
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Range</Text>
                  <TextInput style={styles.input} value={range} onChangeText={setRange} placeholder="60 feet" placeholderTextColor={theme.colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hint}>Duration</Text>
                  <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="Instantaneous" placeholderTextColor={theme.colors.textMuted} />
                </View>
              </View>

              <Text style={styles.hint}>Components</Text>
              <TextInput
                style={styles.input}
                value={components}
                onChangeText={setComponents}
                placeholder="V, S, M (a pinch of ash)"
                placeholderTextColor={theme.colors.textMuted}
              />

              <View style={[styles.row, { marginTop: 10 }]}>
                <Pressable style={styles.row} onPress={() => setConcentration((v) => !v)}>
                  <View style={[styles.squareButton, concentration && styles.chipActive]}>
                    <Text style={styles.squareButtonText}>{concentration ? "✓" : ""}</Text>
                  </View>
                  <Text style={styles.hint}>Concentration</Text>
                </Pressable>
              </View>
              <View style={[styles.row, { marginTop: 10 }]}>
                <Pressable style={styles.row} onPress={() => setRitual((v) => !v)}>
                  <View style={[styles.squareButton, ritual && styles.chipActive]}>
                    <Text style={styles.squareButtonText}>{ritual ? "✓" : ""}</Text>
                  </View>
                  <Text style={styles.hint}>Ritual</Text>
                </Pressable>
              </View>

              <Text style={styles.subTitle}>Classes</Text>
              <View style={styles.wrapRow}>
                {classOptions.map((c) => (
                  <Pressable
                    key={c.id}
                    style={[styles.chip, classes.includes(c.id) && styles.chipActive]}
                    onPress={() => toggleClass(c.id)}
                  >
                    <Text style={[styles.chipText, classes.includes(c.id) && styles.chipTextActive]}>{c.name}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.hint}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                value={description}
                onChangeText={setDescription}
                placeholder="What does this spell do?"
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
        <KeyboardToolbar />
      </View>
    </Modal>
  );
}
