import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  CUSTOM_CLASS_FALLBACK,
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  DEFAULT_RULESET,
  getRulesetCatalog,
  type ClassDefinition,
  type RaceDefinition,
} from "../../../data/rulesets";
import {
  applyRaceAbilityBonuses,
  armorClassBaseline,
  calculateMaxHp,
  proficiencyBonusForLevel,
  STANDARD_ARRAY,
} from "../../../features/characters/characterCalculations";
import {
  ABILITY_LABELS,
  abilityModifier,
  createCharacterFromOnboarding,
} from "../../../features/characters/characterRepo";
import type { AbilityScoreKey } from "../../../types/models";
import { useTheme } from "../../../theme/ThemeContext";
import type { Theme } from "../../../theme/colors";

const STEPS = [
  "name",
  "race",
  "class",
  "background",
  "level",
  "abilities",
  "review",
] as const;
type Step = (typeof STEPS)[number];

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const catalog = getRulesetCatalog(DEFAULT_RULESET);

function clampLevel(value: string): number {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, parsed));
}

export default function NewCharacterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [stepIndex, setStepIndex] = useState(0);
  const step: Step = STEPS[stepIndex];

  const [name, setName] = useState("");

  const [raceId, setRaceId] = useState<string | null>(null);
  const [customRaceName, setCustomRaceName] = useState("");

  const [classId, setClassId] = useState<string | null>(null);
  const [customClassName, setCustomClassName] = useState("");

  const [background, setBackground] = useState("");
  const [level, setLevel] = useState("1");

  const [assignments, setAssignments] = useState<
    Partial<Record<AbilityScoreKey, number>>
  >({});
  const [chosenBonusAbilities, setChosenBonusAbilities] = useState<
    AbilityScoreKey[]
  >([]);

  const selectedRace: RaceDefinition | null =
    raceId === CUSTOM_OPTION_ID
      ? CUSTOM_RACE_FALLBACK
      : catalog.races.find((r) => r.id === raceId) ?? null;

  const selectedClass: ClassDefinition | null =
    classId === CUSTOM_OPTION_ID
      ? CUSTOM_CLASS_FALLBACK
      : catalog.classes.find((c) => c.id === classId) ?? null;

  const raceNameValue =
    raceId === CUSTOM_OPTION_ID
      ? customRaceName.trim() || "Custom Race"
      : selectedRace?.name ?? "";

  const classNameValue =
    classId === CUSTOM_OPTION_ID
      ? customClassName.trim() || "Custom Class"
      : selectedClass?.name ?? "";

  const levelNum = clampLevel(level);

  const finalAbilityScores = useMemo((): Record<AbilityScoreKey, number> => {
    const base: Record<AbilityScoreKey, number> = {
      strength: assignments.strength ?? 10,
      dexterity: assignments.dexterity ?? 10,
      constitution: assignments.constitution ?? 10,
      intelligence: assignments.intelligence ?? 10,
      wisdom: assignments.wisdom ?? 10,
      charisma: assignments.charisma ?? 10,
    };
    if (!selectedRace || raceId === CUSTOM_OPTION_ID) return base;
    return applyRaceAbilityBonuses(base, selectedRace, chosenBonusAbilities);
  }, [assignments, selectedRace, raceId, chosenBonusAbilities]);

  const derivedMaxHp = selectedClass
    ? calculateMaxHp(
        selectedClass.hitDie,
        levelNum,
        abilityModifier(finalAbilityScores.constitution)
      )
    : 10;
  const derivedArmorClass = armorClassBaseline(finalAbilityScores.dexterity);
  const derivedSpeed = selectedRace?.speed ?? 30;
  const derivedProficiencyBonus = proficiencyBonusForLevel(levelNum);

  function canGoNext(): boolean {
    switch (step) {
      case "name":
        return name.trim().length > 0;
      case "race":
        return (
          raceId !== null &&
          (raceId !== CUSTOM_OPTION_ID || customRaceName.trim().length > 0)
        );
      case "class":
        return (
          classId !== null &&
          (classId !== CUSTOM_OPTION_ID || customClassName.trim().length > 0)
        );
      case "background":
        return true;
      case "level":
        return level.trim().length > 0;
      case "abilities": {
        const allAssigned = ABILITY_KEYS.every((key) => assignments[key] !== undefined);
        if (!allAssigned) return false;
        if (selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID) {
          return chosenBonusAbilities.length === selectedRace.chooseAbilityBonus.count;
        }
        return true;
      }
      case "review":
        return true;
    }
  }

  function goNext() {
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepIndex(stepIndex - 1);
  }

  function selectAbilityValue(ability: AbilityScoreKey, value: number) {
    setAssignments((prev) => {
      const next = { ...prev };
      if (next[ability] === value) {
        delete next[ability];
      } else {
        next[ability] = value;
      }
      return next;
    });
  }

  function isValueUsedByOther(value: number, ability: AbilityScoreKey): boolean {
    return Object.entries(assignments).some(
      ([key, used]) => key !== ability && used === value
    );
  }

  function toggleBonusAbility(key: AbilityScoreKey) {
    const maxCount = selectedRace?.chooseAbilityBonus?.count ?? 0;
    setChosenBonusAbilities((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= maxCount) return prev;
      return [...prev, key];
    });
  }

  async function handleCreate() {
    const created = await createCharacterFromOnboarding({
      name: name.trim(),
      ruleset: DEFAULT_RULESET,
      race: raceNameValue,
      className: classNameValue,
      background: background.trim(),
      level: levelNum,
      maxHp: derivedMaxHp,
      armorClass: derivedArmorClass,
      speed: derivedSpeed,
      proficiencyBonus: derivedProficiencyBonus,
      strength: finalAbilityScores.strength,
      dexterity: finalAbilityScores.dexterity,
      constitution: finalAbilityScores.constitution,
      intelligence: finalAbilityScores.intelligence,
      wisdom: finalAbilityScores.wisdom,
      charisma: finalAbilityScores.charisma,
    });
    router.replace({
      pathname: "/(tabs)/characters/[characterId]",
      params: { characterId: String(created.id) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stepCounter}>
        Step {stepIndex + 1} of {STEPS.length}
      </Text>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {step === "name" && (
          <View>
            <Text style={styles.title}>What&apos;s your character&apos;s name?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Character name"
              placeholderTextColor={theme.colors.textMuted}
              autoFocus
            />
          </View>
        )}

        {step === "race" && (
          <View>
            <Text style={styles.title}>Choose a race</Text>
            {catalog.races.map((race) => (
              <ChoiceRow
                key={race.id}
                label={race.name}
                sublabel={race.summary}
                selected={raceId === race.id}
                onPress={() => setRaceId(race.id)}
              />
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own race"
              selected={raceId === CUSTOM_OPTION_ID}
              onPress={() => setRaceId(CUSTOM_OPTION_ID)}
            />
            {raceId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customRaceName}
                onChangeText={setCustomRaceName}
                placeholder="Race name"
                placeholderTextColor={theme.colors.textMuted}
              />
            )}
          </View>
        )}

        {step === "class" && (
          <View>
            <Text style={styles.title}>Choose a class</Text>
            {catalog.classes.map((klass) => (
              <ChoiceRow
                key={klass.id}
                label={klass.name}
                sublabel={klass.summary}
                selected={classId === klass.id}
                onPress={() => setClassId(klass.id)}
              />
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own class"
              selected={classId === CUSTOM_OPTION_ID}
              onPress={() => setClassId(CUSTOM_OPTION_ID)}
            />
            {classId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customClassName}
                onChangeText={setCustomClassName}
                placeholder="Class name"
                placeholderTextColor={theme.colors.textMuted}
              />
            )}
          </View>
        )}

        {step === "background" && (
          <View>
            <Text style={styles.title}>Background (optional)</Text>
            <TextInput
              style={styles.input}
              value={background}
              onChangeText={setBackground}
              placeholder="e.g. Soldier, Sage, Criminal…"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        )}

        {step === "level" && (
          <View>
            <Text style={styles.title}>Starting level</Text>
            <TextInput
              style={styles.input}
              value={level}
              onChangeText={setLevel}
              keyboardType="number-pad"
              placeholder="1"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        )}

        {step === "abilities" && (
          <View>
            <Text style={styles.title}>Assign ability scores</Text>
            <Text style={styles.hint}>
              Place each of {STANDARD_ARRAY.join(", ")} on an ability score.
            </Text>
            {ABILITY_KEYS.map((key) => (
              <View key={key} style={styles.abilityRow}>
                <Text style={styles.abilityRowLabel}>{ABILITY_LABELS[key]}</Text>
                <View style={styles.abilityValues}>
                  {STANDARD_ARRAY.map((value) => {
                    const assignedHere = assignments[key] === value;
                    const disabled = !assignedHere && isValueUsedByOther(value, key);
                    return (
                      <Pressable
                        key={value}
                        disabled={disabled}
                        onPress={() => selectAbilityValue(key, value)}
                        style={[
                          styles.abilityValueButton,
                          assignedHere && styles.abilityValueButtonActive,
                          disabled && styles.abilityValueButtonDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.abilityValueText,
                            assignedHere && styles.abilityValueTextActive,
                          ]}
                        >
                          {value}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}

            {selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID && (
              <View style={styles.bonusSection}>
                <Text style={styles.hint}>
                  Choose {selectedRace.chooseAbilityBonus.count} abilities to gain +
                  {selectedRace.chooseAbilityBonus.amount} from your race.
                </Text>
                <View style={styles.bonusRow}>
                  {ABILITY_KEYS.filter(
                    (key) => !selectedRace.chooseAbilityBonus?.excluding?.includes(key)
                  ).map((key) => {
                    const chosen = chosenBonusAbilities.includes(key);
                    return (
                      <Pressable
                        key={key}
                        onPress={() => toggleBonusAbility(key)}
                        style={[styles.bonusChip, chosen && styles.bonusChipActive]}
                      >
                        <Text
                          style={[styles.bonusChipText, chosen && styles.bonusChipTextActive]}
                        >
                          {ABILITY_LABELS[key]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {step === "review" && (
          <View>
            <Text style={styles.title}>Review</Text>
            <Text style={styles.reviewName}>{name}</Text>
            <Text style={styles.reviewSub}>
              {raceNameValue} · {classNameValue} · Level {levelNum}
              {background.trim() ? ` · ${background.trim()}` : ""}
            </Text>

            <View style={styles.summaryRow}>
              <SummaryStat label="Max HP" value={String(derivedMaxHp)} />
              <SummaryStat label="Armor Class" value={String(derivedArmorClass)} />
              <SummaryStat label="Speed" value={`${derivedSpeed} ft`} />
              <SummaryStat label="Prof. Bonus" value={`+${derivedProficiencyBonus}`} />
            </View>

            <View style={styles.abilityGrid}>
              {ABILITY_KEYS.map((key) => (
                <View key={key} style={styles.abilityCard}>
                  <Text style={styles.abilityCardLabel}>{ABILITY_LABELS[key]}</Text>
                  <Text style={styles.abilityCardScore}>{finalAbilityScores[key]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.navRow}>
        <Pressable style={styles.navButtonSecondary} onPress={goBack}>
          <Text style={styles.navButtonSecondaryText}>
            {stepIndex === 0 ? "Cancel" : "Back"}
          </Text>
        </Pressable>
        {step === "review" ? (
          <Pressable style={styles.navButtonPrimary} onPress={handleCreate}>
            <Text style={styles.navButtonPrimaryText}>Create Character</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.navButtonPrimary, !canGoNext() && styles.navButtonDisabled]}
            disabled={!canGoNext()}
            onPress={goNext}
          >
            <Text style={styles.navButtonPrimaryText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function ChoiceRow({
  label,
  sublabel,
  selected,
  onPress,
}: {
  label: string;
  sublabel: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      style={[styles.choiceRow, selected && styles.choiceRowActive]}
      onPress={onPress}
    >
      <Text style={styles.choiceRowLabel}>{label}</Text>
      <Text style={styles.choiceRowSub}>{sublabel}</Text>
    </Pressable>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    stepCounter: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 12,
    },
    body: { flex: 1 },
    bodyContent: { padding: 16 },
    title: { color: theme.colors.text, fontSize: 22, fontWeight: "700", marginBottom: 16 },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 12 },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 8,
    },
    choiceRow: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius,
      padding: 14,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: "transparent",
    },
    choiceRowActive: { borderColor: theme.colors.primary },
    choiceRowLabel: { color: theme.colors.text, fontSize: 16, fontWeight: "600" },
    choiceRowSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    abilityRow: { marginBottom: 16 },
    abilityRowLabel: { color: theme.colors.text, fontWeight: "700", marginBottom: 6 },
    abilityValues: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    abilityValueButton: {
      width: 44,
      height: 44,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    abilityValueButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    abilityValueButtonDisabled: { opacity: 0.3 },
    abilityValueText: { color: theme.colors.text, fontWeight: "700" },
    abilityValueTextActive: { color: theme.colors.primaryText },
    bonusSection: { marginTop: 8 },
    bonusRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    bonusChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bonusChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    bonusChipText: { color: theme.colors.text, fontWeight: "600" },
    bonusChipTextActive: { color: theme.colors.primaryText },
    reviewName: { color: theme.colors.text, fontSize: 20, fontWeight: "700" },
    reviewSub: { color: theme.colors.textMuted, marginTop: 4, marginBottom: 16 },
    summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" },
    summaryCard: {
      flex: 1,
      minWidth: "22%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      alignItems: "center",
    },
    summaryValue: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      marginTop: 4,
      textAlign: "center",
    },
    abilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    abilityCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    abilityCardLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: "700" },
    abilityCardScore: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 4,
    },
    navRow: {
      flexDirection: "row",
      gap: 10,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    navButtonPrimary: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    navButtonDisabled: { opacity: 0.4 },
    navButtonPrimaryText: { color: theme.colors.primaryText, fontWeight: "700" },
    navButtonSecondary: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    navButtonSecondaryText: { color: theme.colors.text, fontWeight: "700" },
  });
}
