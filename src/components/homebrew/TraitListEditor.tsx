import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import { createDmStyles } from "../dmStyles";

export type NamedTrait = { name: string; description: string };

/**
 * Editable list of {name, description} entries -- RaceTrait, ClassTrait, and
 * MonsterTraitEntry are all this exact shape, so this one component covers
 * race/class/subclass traits and (as three separate instances in one form)
 * a monster's traits/actions/legendary actions.
 */
export function TraitListEditor({
  label,
  traits,
  onChange,
  namePlaceholder = "Name (e.g. Darkvision)",
}: {
  label: string;
  traits: NamedTrait[];
  onChange: (traits: NamedTrait[]) => void;
  namePlaceholder?: string;
}) {
  const theme = useTheme();
  const dm = useMemo(() => createDmStyles(theme), [theme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  function addTrait() {
    const name = newName.trim();
    if (!name) return;
    onChange([...traits, { name, description: newDescription.trim() }]);
    setNewName("");
    setNewDescription("");
  }

  function removeTrait(index: number) {
    onChange(traits.filter((_, i) => i !== index));
  }

  return (
    <View>
      <Text style={dm.subTitle}>{label}</Text>
      {traits.map((trait, i) => (
        <View key={`${trait.name}-${i}`} style={styles.traitRow}>
          <View style={styles.traitInfo}>
            <Text style={styles.traitName}>{trait.name}</Text>
            {trait.description.length > 0 && (
              <Text style={dm.hint}>{trait.description}</Text>
            )}
          </View>
          <Pressable style={dm.squareButton} onPress={() => removeTrait(i)}>
            <Text style={dm.squareButtonText}>×</Text>
          </Pressable>
        </View>
      ))}
      <TextInput
        style={[dm.input, styles.spaced]}
        value={newName}
        onChangeText={setNewName}
        placeholder={namePlaceholder}
        placeholderTextColor={theme.colors.textMuted}
      />
      <TextInput
        style={[dm.input, styles.spaced, styles.multiline]}
        value={newDescription}
        onChangeText={setNewDescription}
        placeholder="What does it do?"
        placeholderTextColor={theme.colors.textMuted}
        multiline
      />
      <Pressable
        style={[dm.secondaryButton, styles.spaced, !newName.trim() && dm.disabled]}
        disabled={!newName.trim()}
        onPress={addTrait}
      >
        <Text style={dm.secondaryButtonText}>+ Add {label.slice(0, -1) || "entry"}</Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    traitRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 8,
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    traitInfo: { flex: 1 },
    traitName: { color: theme.colors.text, fontWeight: "700", fontSize: 13 },
    spaced: { marginTop: 8 },
    multiline: { minHeight: 50, textAlignVertical: "top" },
  });
}
