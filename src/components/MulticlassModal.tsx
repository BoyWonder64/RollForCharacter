import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CUSTOM_OPTION_ID, getRulesetCatalog } from "../data/rulesets";
import type { ClassDefinition } from "../data/rulesets/types";
import {
  ABILITY_LABELS,
  abilityModifier,
  featuresGainedAtLevel,
  getClassDefinitionForCharacter,
  getClassProgression,
} from "../features/characters/characterCalculations";
import {
  combinedCasterLevel,
  multiclassSpellSlots,
  type ClassLevelEntry,
} from "../features/characters/multiclass";
import type { HpGainMethod, LevelUpChoices } from "../features/characters/characterRepo";
import type { AbilityScoreKey, Character, CharacterClass } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";

type MulticlassModalFormProps = {
  character: Character;
  /** Classes this character already has levels in -- excluded from the picker. */
  classRows: CharacterClass[];
  onClose: () => void;
  onConfirm: (classId: string, className: string, choices: LevelUpChoices) => void;
};

type Step = "choose-class" | "hp-method" | "homebrew-features" | "features" | "spells" | "summary";

export function MulticlassModalForm({
  character,
  classRows,
  onClose,
  onConfirm,
}: MulticlassModalFormProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const heldClassIds = new Set(classRows.map((row) => row.classId));
  const availableClasses = getRulesetCatalog(character.ruleset).classes.filter(
    (c) => !heldClassIds.has(c.id)
  );
  // The custom-class overlay fields (hit die, saves, proficiencies) live as
  // a single shared slot on `characters` -- see `getClassDefinitionForCharacter`
  // -- so only one `characterClasses` row can ever be the homebrew one.
  const alreadyHasCustomClass = heldClassIds.has(CUSTOM_OPTION_ID);

  const [step, setStep] = useState<Step>("choose-class");
  const [chosenClass, setChosenClass] = useState<ClassDefinition | null>(null);
  const [hpMethod, setHpMethod] = useState<HpGainMethod>("average");
  const [customClassName, setCustomClassName] = useState("");
  const [customHitDie, setCustomHitDie] = useState<ClassDefinition["hitDie"]>(8);
  const [customSavingThrows, setCustomSavingThrows] = useState<AbilityScoreKey[]>([]);
  const [customArmorProficiencies, setCustomArmorProficiencies] = useState("");
  const [customWeaponProficiencies, setCustomWeaponProficiencies] = useState("");
  const [homebrewFeatures, setHomebrewFeatures] = useState<{ name: string; description: string }[]>([]);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");

  const isCustomClass = chosenClass?.id === CUSTOM_OPTION_ID;
  const conModifier = abilityModifier(character.constitution);
  const progression = chosenClass ? getClassProgression(character.ruleset, chosenClass.id) : undefined;
  // A homebrew class has no catalog `ClassProgression` to list level-1
  // features from -- the player's own `homebrewFeatures` (entered on the
  // "homebrew-features" step below) stand in for it instead, same spirit as
  // the Level Up workflow's own "homebrew-level" step.
  const gainedFeatures = isCustomClass
    ? homebrewFeatures.map((f) => ({ ...f, level: 1, source: "class" as const }))
    : progression
      ? featuresGainedAtLevel(progression, 1, "")
      : [];

  // Gaining this class's first level only ever matters for spell slots if
  // the new class itself casts -- Warlock's Pact Magic is a wholly separate
  // resource (not shown here; manage it via the Spell Slots modal), so only
  // full/half casters get a projected combined-slot preview. `classRows` is
  // empty for a character's first-ever multiclass (table is seeded lazily),
  // so the existing primary class is read straight off `character` instead.
  const existingClassEntries: ClassLevelEntry[] =
    classRows.length > 0
      ? classRows
      : [
          {
            classId: getClassDefinitionForCharacter(character).id,
            className: character.className,
            level: character.level,
          },
        ];
  const projectedSlots =
    chosenClass?.spellcastingAbility && chosenClass.casterType !== "pact"
      ? multiclassSpellSlots(
          combinedCasterLevel(
            [...existingClassEntries, { classId: chosenClass.id, className: chosenClass.name, level: 1 }],
            character.ruleset
          ),
          character.ruleset
        )
      : undefined;

  function buildChoices(): LevelUpChoices {
    const choices: LevelUpChoices = { hpMethod };
    if (projectedSlots) {
      choices.spellSlotUpdates = projectedSlots.map((total, idx) => ({ spellLevel: idx + 1, total }));
    }
    if (isCustomClass) {
      choices.customClassHitDie = customHitDie;
      choices.customClassSavingThrows = customSavingThrows;
      choices.customClassArmorProficiencies = customArmorProficiencies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      choices.customClassWeaponProficiencies = customWeaponProficiencies
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (homebrewFeatures.length > 0) {
        choices.homebrewFeatures = homebrewFeatures;
      }
    }
    return choices;
  }

  function afterHpMethod() {
    if (isCustomClass) {
      setStep("homebrew-features");
      return;
    }
    setStep(gainedFeatures.length > 0 ? "features" : projectedSlots ? "spells" : "summary");
  }

  if (step === "choose-class") {
    const hitDieOptions: ClassDefinition["hitDie"][] = [6, 8, 10, 12];
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Multiclass</Text>
        <Text style={styles.hint}>
          Pick a new class to take your first level in. This is a permanent character choice --
          see the Player&apos;s Handbook multiclassing rules before committing.
        </Text>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.buttonColumn}>
            {availableClasses.map((c) => (
              <Pressable
                key={c.id}
                style={styles.optionButton}
                onPress={() => {
                  setChosenClass(c);
                  setStep("hp-method");
                }}
              >
                <Text style={styles.optionButtonTitle}>{c.name}</Text>
                <Text style={styles.optionButtonSub}>{c.summary}</Text>
              </Pressable>
            ))}
            {availableClasses.length === 0 && (
              <Text style={styles.hint}>This character already has every class in this ruleset.</Text>
            )}
          </View>

          {alreadyHasCustomClass ? (
            <Text style={[styles.hint, { marginTop: 16 }]}>
              This character already has a homebrew class -- only one homebrew class slot is
              supported per character.
            </Text>
          ) : (
            <>
              <Text style={[styles.hint, { marginTop: 16 }]}>
                Don&apos;t see it, or using homebrew? Add a custom class.
              </Text>
              <TextInput
                style={styles.input}
                value={customClassName}
                onChangeText={setCustomClassName}
                placeholder="e.g. Artificer"
                placeholderTextColor={theme.colors.textMuted}
              />
              <Text style={[styles.hint, { marginTop: 12, marginBottom: 8 }]}>Hit die</Text>
              <View style={styles.chipRow}>
                {hitDieOptions.map((die) => (
                  <Pressable
                    key={die}
                    style={[styles.chip, customHitDie === die && styles.chipSelected]}
                    onPress={() => setCustomHitDie(die)}
                  >
                    <Text style={[styles.chipText, customHitDie === die && styles.chipTextSelected]}>
                      d{die}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.hint, { marginBottom: 8 }]}>
                Saving throw proficiencies (choose {customSavingThrows.length}/2)
              </Text>
              <View style={styles.chipRow}>
                {(Object.keys(ABILITY_LABELS) as AbilityScoreKey[]).map((key) => {
                  const selected = customSavingThrows.includes(key);
                  return (
                    <Pressable
                      key={key}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() =>
                        setCustomSavingThrows((prev) => {
                          if (prev.includes(key)) return prev.filter((k) => k !== key);
                          if (prev.length >= 2) return prev;
                          return [...prev, key];
                        })
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {ABILITY_LABELS[key]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.hint, { marginBottom: 8 }]}>Armor proficiencies</Text>
              <TextInput
                style={styles.input}
                value={customArmorProficiencies}
                onChangeText={setCustomArmorProficiencies}
                placeholder="e.g. Light armor, Shields"
                placeholderTextColor={theme.colors.textMuted}
              />
              <Text style={[styles.hint, { marginTop: 10, marginBottom: 8 }]}>Weapon proficiencies</Text>
              <TextInput
                style={styles.input}
                value={customWeaponProficiencies}
                onChangeText={setCustomWeaponProficiencies}
                placeholder="e.g. Simple weapons, Shortswords"
                placeholderTextColor={theme.colors.textMuted}
              />

              <Pressable
                style={[
                  styles.primaryButton,
                  !customClassName.trim() && styles.primaryButtonDisabled,
                ]}
                disabled={!customClassName.trim()}
                onPress={() => {
                  const name = customClassName.trim();
                  setChosenClass({
                    id: CUSTOM_OPTION_ID,
                    name,
                    hitDie: customHitDie,
                    savingThrows:
                      customSavingThrows.length === 2
                        ? (customSavingThrows as [AbilityScoreKey, AbilityScoreKey])
                        : undefined,
                    summary: "Custom class",
                  });
                  setStep("hp-method");
                }}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  if (!chosenClass) return null;

  if (step === "hp-method") {
    return (
      <StepCard
        title={`${chosenClass.name} 1`}
        hint="How do you want to determine the HP you gain from this first level?"
        onBack={() => setStep("choose-class")}
        styles={styles}
      >
        <View style={styles.buttonColumn}>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setHpMethod("average");
              afterHpMethod();
            }}
          >
            <Text style={styles.optionButtonTitle}>Take Average</Text>
            <Text style={styles.optionButtonSub}>
              {Math.floor(chosenClass.hitDie / 2) + 1 + conModifier} HP (floor(d{chosenClass.hitDie}/2)+1 + CON)
            </Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setHpMethod("roll");
              afterHpMethod();
            }}
          >
            <Text style={styles.optionButtonTitle}>Roll Hit Die</Text>
            <Text style={styles.optionButtonSub}>Could be higher, could be lower</Text>
          </Pressable>
        </View>
      </StepCard>
    );
  }

  if (step === "homebrew-features") {
    return (
      <StepCard
        title={`${chosenClass.name} 1`}
        hint="This is a homebrew class -- there's no catalog of what it gains at level 1, so tell us yourself."
        onBack={() => setStep("hp-method")}
        styles={styles}
        scroll
      >
        <View style={{ gap: 8 }}>
          {homebrewFeatures.map((f, idx) => (
            <View key={`${f.name}-${idx}`} style={styles.traitRow}>
              <View style={styles.traitInfo}>
                <Text style={styles.featureName}>{f.name}</Text>
                {f.description.length > 0 && <Text style={styles.featureText}>{f.description}</Text>}
              </View>
              <Pressable
                onPress={() => setHomebrewFeatures((prev) => prev.filter((_, i) => i !== idx))}
              >
                <Text style={styles.traitRemove}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={newFeatureName}
          onChangeText={setNewFeatureName}
          placeholder="Feature name (e.g. Switch Axe Mastery)"
          placeholderTextColor={theme.colors.textMuted}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={newFeatureDescription}
          onChangeText={setNewFeatureDescription}
          placeholder="What does it do?"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
        <Pressable
          style={[styles.optionButton, !newFeatureName.trim() && styles.primaryButtonDisabled]}
          disabled={!newFeatureName.trim()}
          onPress={() => {
            setHomebrewFeatures((prev) => [
              ...prev,
              { name: newFeatureName.trim(), description: newFeatureDescription.trim() },
            ]);
            setNewFeatureName("");
            setNewFeatureDescription("");
          }}
        >
          <Text style={styles.optionButtonTitle}>+ Add Feature</Text>
        </Pressable>
        <Pressable
          style={styles.primaryButton}
          onPress={() => setStep(projectedSlots ? "spells" : "summary")}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  if (step === "features") {
    return (
      <StepCard
        title={`${chosenClass.name} 1 Features`}
        hint="Here's what you gained at level 1 of this class."
        onBack={undefined}
        styles={styles}
        scroll
      >
        <View style={{ gap: 14 }}>
          {gainedFeatures.map((f, idx) => (
            <View key={`${f.name}-${idx}`}>
              <Text style={styles.featureName}>{f.name}</Text>
              <Text style={styles.featureText}>{f.description}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => setStep(projectedSlots ? "spells" : "summary")}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  if (step === "spells" && projectedSlots) {
    return (
      <StepCard
        title="Spellcasting Updated"
        hint="Your combined multiclass spell slots have been recalculated to include this new class."
        onBack={undefined}
        styles={styles}
      >
        <View style={styles.chipRow}>
          {projectedSlots.map((total, idx) =>
            total > 0 ? (
              <View key={idx} style={styles.slotChip}>
                <Text style={styles.slotChipText}>
                  {idx + 1}: {total}
                </Text>
              </View>
            ) : null
          )}
        </View>
        <Pressable style={styles.primaryButton} onPress={() => setStep("summary")}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  // summary
  const choices = buildChoices();
  return (
    <StepCard title={`Confirm ${chosenClass.name} 1`} hint="" onBack={undefined} styles={styles} scroll>
      <View style={{ gap: 6 }}>
        <Text style={styles.featureText}>HP method: {choices.hpMethod}</Text>
        {choices.spellSlotUpdates ? (
          <Text style={styles.featureText}>Spell slots updated.</Text>
        ) : null}
        {choices.homebrewFeatures?.map((f, idx) => (
          <Text key={`${f.name}-${idx}`} style={styles.featureText}>
            New: {f.name}
            {f.description ? ` -- ${f.description}` : ""}
          </Text>
        ))}
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => onConfirm(chosenClass.id, chosenClass.name, choices)}
      >
        <Text style={styles.primaryButtonText}>Confirm Multiclass</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </StepCard>
  );
}

function StepCard({
  title,
  hint,
  onBack,
  styles,
  scroll,
  children,
}: {
  title: string;
  hint: string;
  onBack: (() => void) | undefined;
  styles: ReturnType<typeof createStyles>;
  scroll?: boolean;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </>
  );
  return <View style={styles.card}>{content}{onBack && (
    <Pressable style={styles.cancelButton} onPress={onBack}>
      <Text style={styles.cancelButtonText}>Back</Text>
    </Pressable>
  )}</View>;
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 360,
      maxHeight: "85%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 6,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 16 },
    scroll: { maxHeight: 420 },
    buttonColumn: { gap: 10 },
    optionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      paddingHorizontal: 14,
      alignItems: "center",
    },
    optionButtonTitle: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 15,
      fontFamily: theme.displayFontFamily,
    },
    optionButtonSub: {
      color: theme.colors.primaryText,
      fontSize: 11,
      marginTop: 2,
      opacity: 0.85,
      textAlign: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 16,
    },
    primaryButtonDisabled: { opacity: 0.4 },
    primaryButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 15,
      fontFamily: theme.displayFontFamily,
    },
    cancelButton: { alignItems: "center", marginTop: 14, paddingVertical: 6 },
    cancelButtonText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      marginBottom: 10,
    },
    multilineInput: { minHeight: 70, textAlignVertical: "top" },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
    chip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontWeight: "600", fontSize: 13 },
    chipTextSelected: { color: theme.colors.primaryText },
    slotChip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    slotChipText: { color: theme.colors.text, fontWeight: "700", fontSize: 12 },
    featureName: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 14,
      fontFamily: theme.displayFontFamily,
      marginBottom: 2,
    },
    featureText: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 18 },
    traitRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
    },
    traitInfo: { flex: 1, paddingRight: 8 },
    traitRemove: { color: theme.colors.accent, fontSize: 16, paddingHorizontal: 4 },
  });
}
