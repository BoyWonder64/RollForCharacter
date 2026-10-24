import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { getCharacter, updateCharacter } from "../../../../features/characters/characterRepo";
import type { AbilityScoreKey, Character } from "../../../../types/models";
import { useTheme } from "../../../../theme/ThemeContext";
import type { Theme } from "../../../../theme/colors";

const ABILITY_FIELDS: { key: AbilityScoreKey; label: string }[] = [
  { key: "strength", label: "Strength" },
  { key: "dexterity", label: "Dexterity" },
  { key: "constitution", label: "Constitution" },
  { key: "intelligence", label: "Intelligence" },
  { key: "wisdom", label: "Wisdom" },
  { key: "charisma", label: "Charisma" },
];

type FormState = {
  name: string;
  race: string;
  className: string;
  level: string;
  maxHp: string;
  armorClass: string;
  speed: string;
  proficiencyBonus: string;
  notes: string;
  abilities: Record<AbilityScoreKey, string>;
};

function toFormState(character: Character): FormState {
  return {
    name: character.name,
    race: character.race,
    className: character.className,
    level: String(character.level),
    maxHp: String(character.maxHp),
    armorClass: String(character.armorClass),
    speed: String(character.speed),
    proficiencyBonus: String(character.proficiencyBonus),
    notes: character.notes,
    abilities: {
      strength: String(character.strength),
      dexterity: String(character.dexterity),
      constitution: String(character.constitution),
      intelligence: String(character.intelligence),
      wisdom: String(character.wisdom),
      charisma: String(character.charisma),
    },
  };
}

function toInt(value: string, fallback: number): number {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function EditCharacterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { characterId: characterIdParam } = useLocalSearchParams<{
    characterId: string;
  }>();
  const characterId = Number(characterIdParam);
  const [form, setForm] = useState<FormState | null>(null);
  const [currentHp, setCurrentHp] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getCharacter(characterId).then((character) => {
        if (character) {
          setForm(toFormState(character));
          setCurrentHp(character.currentHp);
        }
      });
    }, [characterId])
  );

  if (!form) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </View>
    );
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateAbility(key: AbilityScoreKey, value: string) {
    setForm((prev) =>
      prev ? { ...prev, abilities: { ...prev.abilities, [key]: value } } : prev
    );
  }

  async function handleSave() {
    if (!form) return;
    const maxHp = toInt(form.maxHp, 0);
    await updateCharacter(characterId, {
      name: form.name.trim() || "Unnamed Character",
      race: form.race.trim(),
      className: form.className.trim(),
      level: Math.max(1, toInt(form.level, 1)),
      maxHp,
      currentHp: Math.min(currentHp, maxHp),
      armorClass: toInt(form.armorClass, 10),
      speed: toInt(form.speed, 30),
      proficiencyBonus: toInt(form.proficiencyBonus, 2),
      notes: form.notes,
      strength: toInt(form.abilities.strength, 10),
      dexterity: toInt(form.abilities.dexterity, 10),
      constitution: toInt(form.abilities.constitution, 10),
      intelligence: toInt(form.abilities.intelligence, 10),
      wisdom: toInt(form.abilities.wisdom, 10),
      charisma: toInt(form.abilities.charisma, 10),
    });
    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Field label="Name" value={form.name} onChangeText={(v) => updateField("name", v)} />
      <View style={styles.row}>
        <Field
          label="Race"
          value={form.race}
          onChangeText={(v) => updateField("race", v)}
          style={styles.half}
        />
        <Field
          label="Class"
          value={form.className}
          onChangeText={(v) => updateField("className", v)}
          style={styles.half}
        />
      </View>

      <View style={styles.row}>
        <Field
          label="Level"
          value={form.level}
          onChangeText={(v) => updateField("level", v)}
          keyboardType="number-pad"
          style={styles.third}
        />
        <Field
          label="Max HP"
          value={form.maxHp}
          onChangeText={(v) => updateField("maxHp", v)}
          keyboardType="number-pad"
          style={styles.third}
        />
        <Field
          label="Armor Class"
          value={form.armorClass}
          onChangeText={(v) => updateField("armorClass", v)}
          keyboardType="number-pad"
          style={styles.third}
        />
      </View>

      <View style={styles.row}>
        <Field
          label="Speed (ft)"
          value={form.speed}
          onChangeText={(v) => updateField("speed", v)}
          keyboardType="number-pad"
          style={styles.half}
        />
        <Field
          label="Proficiency Bonus"
          value={form.proficiencyBonus}
          onChangeText={(v) => updateField("proficiencyBonus", v)}
          keyboardType="number-pad"
          style={styles.half}
        />
      </View>

      <Text style={styles.sectionTitle}>Ability Scores</Text>
      <View style={styles.abilityGrid}>
        {ABILITY_FIELDS.map(({ key, label }) => (
          <Field
            key={key}
            label={label}
            value={form.abilities[key]}
            onChangeText={(v) => updateAbility(key, v)}
            keyboardType="number-pad"
            style={styles.third}
          />
        ))}
      </View>

      <Field
        label="Notes"
        value={form.notes}
        onChangeText={(v) => updateField("notes", v)}
        multiline
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  multiline,
  style,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad";
  multiline?: boolean;
  style?: object;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.field, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        placeholderTextColor={theme.colors.textMuted}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 16, gap: 4 },
    loading: { color: theme.colors.textMuted, textAlign: "center", marginTop: 32 },
    row: { flexDirection: "row", gap: 10 },
    half: { flex: 1 },
    third: { flex: 1 },
    field: { marginBottom: 14 },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
    },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    multilineInput: { minHeight: 80, textAlignVertical: "top" },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    abilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 32,
    },
    saveButtonText: { color: theme.colors.primaryText, fontWeight: "700", fontSize: 16 },
  });
}
