import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  deleteCharacter,
  getCharacter,
  updateCharacter,
} from "../../../../features/characters/characterRepo";
import {
  getClassDefinitionForCharacter,
  parseLanguages,
  parseSavingThrowProficiencies,
  parseSkillProficiencies,
  serializeLanguages,
  serializeSavingThrowProficiencies,
  serializeSkillProficiencies,
} from "../../../../features/characters/characterCalculations";
import { deletePortrait, persistPortrait } from "../../../../features/characters/portraitStorage";
import { ALIGNMENTS, getRulesetCatalog } from "../../../../data/rulesets";
import type { AbilityScoreKey, Character } from "../../../../types/models";
import { useTheme } from "../../../../theme/ThemeContext";
import { CharacterThemeProvider } from "../../../../theme/CharacterThemeContext";
import { THEME_FAMILIES, type Theme, type ThemeFamilyId } from "../../../../theme/colors";
import { FONT_CHOICE_ORDER, FONT_CHOICES, type FontChoiceId } from "../../../../theme/fonts";

const FAMILY_ORDER: ThemeFamilyId[] = [
  "crimson",
  "classic",
  "parchment",
  "grimdark",
  "journal",
  "steampunk",
  "scifi",
  "shadow",
  "western",
  "galaxy",
];

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
  alignment: string;
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  otherProficiencies: string;
  featuresAndTraits: string;
  notes: string;
  usesXp: boolean;
  experiencePoints: string;
  themeFamily: ThemeFamilyId | null;
  fontChoice: FontChoiceId | null;
  portraitUri: string | null;
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
    alignment: character.alignment,
    personalityTraits: character.personalityTraits,
    ideals: character.ideals,
    bonds: character.bonds,
    flaws: character.flaws,
    otherProficiencies: character.otherProficiencies,
    featuresAndTraits: character.featuresAndTraits,
    notes: character.notes,
    usesXp: character.usesXp,
    experiencePoints: String(character.experiencePoints),
    themeFamily: character.themeFamily as ThemeFamilyId | null,
    fontChoice: character.fontChoice as FontChoiceId | null,
    portraitUri: character.portraitUri,
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
  const { characterId: characterIdParam } = useLocalSearchParams<{
    characterId: string;
  }>();
  const characterId = Number(characterIdParam);
  const [character, setCharacter] = useState<Character | null>(null);

  useFocusEffect(
    useCallback(() => {
      getCharacter(characterId).then((result) => setCharacter(result ?? null));
    }, [characterId])
  );

  if (!character) {
    return <LoadingView />;
  }

  // Wrapped the same way as the character sheet (CharacterThemeContext.tsx)
  // so the Appearance picker below previews this character's own override
  // live, not the device global.
  return (
    <CharacterThemeProvider character={character}>
      <EditCharacterBody characterId={characterId} />
    </CharacterThemeProvider>
  );
}

function LoadingView() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.loading}>Loading…</Text>
    </View>
  );
}

function EditCharacterBody({ characterId }: { characterId: number }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [form, setForm] = useState<FormState | null>(null);
  const [currentHp, setCurrentHp] = useState(0);
  const [ruleset, setRuleset] = useState("5e");
  const [skillIds, setSkillIds] = useState<Set<string>>(new Set());
  const [extraSavingThrows, setExtraSavingThrows] = useState<Set<AbilityScoreKey>>(new Set());
  const [languageIds, setLanguageIds] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      getCharacter(characterId).then((character) => {
        if (character) {
          setForm(toFormState(character));
          setCurrentHp(character.currentHp);
          setRuleset(character.ruleset);
          setSkillIds(new Set(parseSkillProficiencies(character)));
          setExtraSavingThrows(new Set(parseSavingThrowProficiencies(character)));
          setLanguageIds(new Set(parseLanguages(character)));
        }
      });
    }, [characterId])
  );

  const catalog = getRulesetCatalog(ruleset);

  function toggleSkill(skillId: string) {
    setSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  }

  // The class's own two saves are fixed, not a player choice -- this only
  // toggles EXTRA proficiencies (e.g. from the Resilient feat).
  const classSavingThrows: AbilityScoreKey[] =
    getClassDefinitionForCharacter({ ruleset, className: form?.className ?? "" }).savingThrows ??
    [];

  function toggleSavingThrow(key: AbilityScoreKey) {
    if (classSavingThrows.includes(key)) return;
    setExtraSavingThrows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function toggleLanguage(languageId: string) {
    setLanguageIds((prev) => {
      const next = new Set(prev);
      if (next.has(languageId)) {
        next.delete(languageId);
      } else {
        next.add(languageId);
      }
      return next;
    });
  }

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

  async function handlePickPortrait() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    if (result.canceled) return;
    try {
      const persistedUri = await persistPortrait(result.assets[0].uri, form?.portraitUri);
      updateField("portraitUri", persistedUri);
    } catch {
      Alert.alert("Couldn't set portrait", "Something went wrong saving that image.");
    }
  }

  function handleRemovePortrait() {
    deletePortrait(form?.portraitUri);
    updateField("portraitUri", null);
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
      alignment: form.alignment,
      personalityTraits: form.personalityTraits,
      ideals: form.ideals,
      bonds: form.bonds,
      flaws: form.flaws,
      otherProficiencies: form.otherProficiencies,
      featuresAndTraits: form.featuresAndTraits,
      notes: form.notes,
      portraitUri: form.portraitUri,
      strength: toInt(form.abilities.strength, 10),
      dexterity: toInt(form.abilities.dexterity, 10),
      constitution: toInt(form.abilities.constitution, 10),
      intelligence: toInt(form.abilities.intelligence, 10),
      wisdom: toInt(form.abilities.wisdom, 10),
      charisma: toInt(form.abilities.charisma, 10),
      skillProficiencies: serializeSkillProficiencies(Array.from(skillIds)),
      savingThrowProficiencies: serializeSavingThrowProficiencies(Array.from(extraSavingThrows)),
      languages: serializeLanguages(Array.from(languageIds)),
      usesXp: form.usesXp,
      experiencePoints: Math.max(0, toInt(form.experiencePoints, 0)),
      themeFamily: form.themeFamily,
      fontChoice: form.fontChoice,
    });
    router.back();
  }

  function handleDelete() {
    Alert.alert(
      "Delete character?",
      `This permanently deletes ${form?.name || "this character"} and all their spells, equipment, and roll history. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deletePortrait(form?.portraitUri);
            await deleteCharacter(characterId);
            router.replace("/(tabs)/characters");
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
      <View style={styles.portraitRow}>
        <Pressable onPress={handlePickPortrait}>
          {form.portraitUri ? (
            <Image source={{ uri: form.portraitUri }} style={styles.portraitImage} />
          ) : (
            <View style={styles.portraitPlaceholder}>
              <Text style={styles.portraitPlaceholderText}>Add Photo</Text>
            </View>
          )}
        </Pressable>
        <View style={styles.portraitActions}>
          <Pressable onPress={handlePickPortrait}>
            <Text style={styles.portraitActionText}>
              {form.portraitUri ? "Change Photo" : "Choose Photo"}
            </Text>
          </Pressable>
          {form.portraitUri && (
            <Pressable onPress={handleRemovePortrait}>
              <Text style={styles.portraitActionTextDanger}>Remove</Text>
            </Pressable>
          )}
        </View>
      </View>

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
            style={styles.abilityField}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Skill Proficiencies</Text>
      <View style={styles.skillGrid}>
        {catalog.skills.map((skill) => {
          const selected = skillIds.has(skill.id);
          return (
            <Pressable
              key={skill.id}
              onPress={() => toggleSkill(skill.id)}
              style={[styles.skillChip, selected && styles.skillChipActive]}
            >
              <Text style={[styles.skillChipText, selected && styles.skillChipTextActive]}>
                {skill.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Saving Throw Proficiencies</Text>
      <View style={styles.skillGrid}>
        {ABILITY_FIELDS.map(({ key, label }) => {
          const fromClass = classSavingThrows.includes(key);
          const selected = fromClass || extraSavingThrows.has(key);
          return (
            <Pressable
              key={key}
              onPress={() => toggleSavingThrow(key)}
              disabled={fromClass}
              style={[
                styles.skillChip,
                selected && styles.skillChipActive,
                fromClass && styles.skillChipLocked,
              ]}
            >
              <Text style={[styles.skillChipText, selected && styles.skillChipTextActive]}>
                {label}
                {fromClass ? " (Class)" : ""}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {catalog.languages && (
        <>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.skillGrid}>
            {catalog.languages.map((lang) => {
              const selected = languageIds.has(lang.id);
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => toggleLanguage(lang.id)}
                  style={[styles.skillChip, selected && styles.skillChipActive]}
                >
                  <Text style={[styles.skillChipText, selected && styles.skillChipTextActive]}>
                    {lang.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Alignment</Text>
      <View style={styles.skillGrid}>
        {ALIGNMENTS.map((option) => {
          const selected = form.alignment === option;
          return (
            <Pressable
              key={option}
              onPress={() => updateField("alignment", selected ? "" : option)}
              style={[styles.skillChip, selected && styles.skillChipActive]}
            >
              <Text style={[styles.skillChipText, selected && styles.skillChipTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Personality</Text>
      <Field
        label="Personality Traits"
        value={form.personalityTraits}
        onChangeText={(v) => updateField("personalityTraits", v)}
        multiline
      />
      <Field
        label="Ideals"
        value={form.ideals}
        onChangeText={(v) => updateField("ideals", v)}
        multiline
      />
      <Field
        label="Bonds"
        value={form.bonds}
        onChangeText={(v) => updateField("bonds", v)}
        multiline
      />
      <Field
        label="Flaws"
        value={form.flaws}
        onChangeText={(v) => updateField("flaws", v)}
        multiline
      />

      <Text style={styles.sectionTitle}>Other Proficiencies &amp; Traits</Text>
      <Field
        label="Other Proficiencies & Languages"
        value={form.otherProficiencies}
        onChangeText={(v) => updateField("otherProficiencies", v)}
        multiline
      />
      <Field
        label="Features & Traits"
        value={form.featuresAndTraits}
        onChangeText={(v) => updateField("featuresAndTraits", v)}
        multiline
      />

      <Text style={styles.sectionTitle}>Experience</Text>
      <Pressable
        style={styles.xpToggle}
        onPress={() => updateField("usesXp", !form.usesXp)}
      >
        <View style={[styles.xpCheckbox, form.usesXp && styles.xpCheckboxOn]} />
        <Text style={styles.xpToggleLabel}>Track XP (instead of milestone leveling)</Text>
      </Pressable>
      {form.usesXp && (
        <Field
          label="Experience Points"
          value={form.experiencePoints}
          onChangeText={(v) => updateField("experiencePoints", v)}
          keyboardType="number-pad"
        />
      )}

      <Text style={styles.sectionTitle}>Appearance</Text>
      <Text style={styles.hint}>
        Give this character its own theme and font, independent of your device&apos;s
        default (Settings → Theme/Font).
      </Text>
      <Text style={styles.subLabel}>Theme</Text>
      <Pressable
        style={[styles.familyRow, form.themeFamily === null && styles.familyRowActive]}
        onPress={() => updateField("themeFamily", null)}
      >
        <Text
          style={[styles.familyLabel, form.themeFamily === null && styles.familyLabelActive]}
        >
          Use device default
        </Text>
      </Pressable>
      {FAMILY_ORDER.map((familyId) => {
        const definition = THEME_FAMILIES[familyId];
        const active = form.themeFamily === familyId;
        const swatchColors = theme.mode === "dark" ? definition.dark : definition.light;
        return (
          <Pressable
            key={familyId}
            style={[styles.familyRow, active && styles.familyRowActive]}
            onPress={() => updateField("themeFamily", familyId)}
          >
            <View style={[styles.swatch, { backgroundColor: swatchColors.primary }]} />
            <Text style={[styles.familyLabel, active && styles.familyLabelActive]}>
              {definition.label}
            </Text>
          </Pressable>
        );
      })}

      <Text style={styles.subLabel}>Font</Text>
      <Pressable
        style={[styles.familyRow, form.fontChoice === null && styles.familyRowActive]}
        onPress={() => updateField("fontChoice", null)}
      >
        <Text
          style={[styles.familyLabel, form.fontChoice === null && styles.familyLabelActive]}
        >
          Use device default
        </Text>
      </Pressable>
      {FONT_CHOICE_ORDER.map((fontId) => {
        const option = FONT_CHOICES[fontId];
        const active = form.fontChoice === fontId;
        return (
          <Pressable
            key={fontId}
            style={[styles.familyRow, active && styles.familyRowActive]}
            onPress={() => updateField("fontChoice", fontId)}
          >
            <Text
              style={[
                styles.familyLabel,
                active && styles.familyLabelActive,
                option.fontFamily ? { fontFamily: option.fontFamily } : null,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      <Field
        label="Notes"
        value={form.notes}
        onChangeText={(v) => updateField("notes", v)}
        multiline
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Character</Text>
      </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    portraitRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 18 },
    portraitImage: {
      width: 72,
      height: 72,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
    },
    portraitPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    portraitPlaceholderText: {
      color: theme.colors.textMuted,
      fontSize: 11,
      textAlign: "center",
      fontFamily: theme.displayFontFamily,
    },
    portraitActions: { gap: 8 },
    portraitActionText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    portraitActionTextDanger: {
      color: theme.colors.danger,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
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
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontFamily: theme.displayFontFamily,
    },
    multilineInput: { minHeight: 80, textAlignVertical: "top" },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
    },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 10 },
    subLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 6,
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
    familyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 6,
      gap: 10,
    },
    familyRowActive: { borderColor: theme.colors.primary },
    swatch: { width: 20, height: 20, borderRadius: theme.radius },
    familyLabel: { color: theme.colors.text, fontWeight: "600" },
    familyLabelActive: { color: theme.colors.accent },
    abilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    abilityField: { flexBasis: "31%", flexGrow: 0 },
    skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
    skillChip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    skillChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    skillChipLocked: { opacity: 0.85 },
    skillChipText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    skillChipTextActive: { color: theme.colors.primaryText },
    xpToggle: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
    xpCheckbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    xpCheckboxOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    xpToggleLabel: { color: theme.colors.text, fontWeight: "600", fontFamily: theme.displayFontFamily },
    saveButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 32,
    },
    saveButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 16,
      fontFamily: theme.displayFontFamily,
    },
    deleteButton: {
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 12,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: theme.colors.danger,
    },
    deleteButtonText: {
      color: theme.colors.danger,
      fontWeight: "700",
      fontSize: 16,
      fontFamily: theme.displayFontFamily,
    },
  });
}
