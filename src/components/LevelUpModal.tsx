import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ABILITY_LABELS,
  featuresGainedAtLevel,
  getClassDefinition,
  getClassDefinitionForCharacter,
  getClassProgression,
  getClassProgressionForCharacter,
  needsAsiOrFeatChoice,
  needsSubclassChoice,
  spellProgressionRowForLevel,
  type FeatureGrant,
} from "../features/characters/characterCalculations";
import {
  combinedCasterLevel,
  isMulticlassed,
  multiclassSpellSlots,
  warlockPactMagicRow,
} from "../features/characters/multiclass";
import type { AsiOrFeatChoice, HpGainMethod, LevelUpChoices } from "../features/characters/characterRepo";
import type { AbilityScoreKey, Character, CharacterClass } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import { FeatPickerModal } from "./FeatPickerModal";
import { MulticlassModalForm } from "./MulticlassModal";

type LevelUpModalProps = {
  visible: boolean;
  character: Character;
  /** Every class this character has levels in -- empty for the common (never-multiclassed) case. */
  classRows: CharacterClass[];
  onClose: () => void;
  /** `classId` is only passed once the character has multiclassed (2+ rows), identifying which class's level-up this is. */
  onConfirm: (choices: LevelUpChoices, classId?: string) => void;
  /** Taking a first level in a brand-new class, surfaced as an option alongside leveling up an existing one. */
  onMulticlassConfirm: (classId: string, className: string, choices: LevelUpChoices) => void;
};

const ORDINAL_SUFFIX: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return `${n}${ORDINAL_SUFFIX[n % 10] ?? "th"}`;
}

export function LevelUpModal({
  visible,
  character,
  classRows,
  onClose,
  onConfirm,
  onMulticlassConfirm,
}: LevelUpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <ModalBackdrop>
        {/* Only mounted while visible, so state always starts fresh on open. */}
        {visible && (
          <LevelUpModalForm
            character={character}
            classRows={classRows}
            onClose={onClose}
            onConfirm={onConfirm}
            onMulticlassConfirm={onMulticlassConfirm}
          />
        )}
      </ModalBackdrop>
    </Modal>
  );
}

function ModalBackdrop({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.backdrop}>{children}</View>
    </KeyboardAvoidingView>
  );
}

type Step =
  | "choose-class"
  | "choose"
  | "hp-method"
  | "subclass"
  | "asi-type"
  | "asi-ability-mode"
  | "asi-ability-pick"
  | "asi-feat"
  | "features"
  | "spells"
  | "summary";

function LevelUpModalForm({
  character,
  classRows,
  onClose,
  onConfirm,
  onMulticlassConfirm,
}: Omit<LevelUpModalProps, "visible">) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isMulticlass = isMulticlassed(classRows);
  const [targetClassId, setTargetClassId] = useState<string>(
    isMulticlass ? "" : getClassDefinitionForCharacter(character).id
  );
  const targetRow = classRows.find((row) => row.classId === targetClassId);

  // Non-multiclass (the common case, `classRows` empty): everything below
  // falls back to the character's own fields, identical to before this
  // feature existed. Multiclassed: scoped to whichever class was chosen on
  // the new "choose-class" step -- 5e multiclass breakpoints (subclass
  // choice, ASI levels) are per-CLASS level, not per total character level.
  const currentLevel = targetRow?.level ?? character.level;
  const currentSubclass = targetRow?.subclass ?? character.subclass;
  const newLevel = currentLevel + 1;
  const targetClassDef = targetRow
    ? getClassDefinition(character.ruleset, targetRow.classId)
    : getClassDefinitionForCharacter(character);
  const progression = targetRow
    ? getClassProgression(character.ruleset, targetRow.classId)
    : getClassProgressionForCharacter(character);
  const needsSubclass = progression ? needsSubclassChoice(progression, newLevel, currentSubclass) : false;
  const needsAsi = progression ? needsAsiOrFeatChoice(progression, newLevel) : false;

  const [step, setStep] = useState<Step>("choose-class");
  const [multiclassMode, setMulticlassMode] = useState(false);
  const [hpMethod, setHpMethod] = useState<HpGainMethod>("average");
  const [subclassId, setSubclassId] = useState<string>("");
  const [customSubclassName, setCustomSubclassName] = useState("");
  const [abilityMode, setAbilityMode] = useState<"one" | "two">("one");
  const [selectedAbilities, setSelectedAbilities] = useState<AbilityScoreKey[]>([]);
  const [featText, setFeatText] = useState("");
  const [featPickerVisible, setFeatPickerVisible] = useState(false);

  if (multiclassMode) {
    return (
      <MulticlassModalForm
        character={character}
        classRows={classRows}
        onClose={() => setMulticlassMode(false)}
        onConfirm={onMulticlassConfirm}
      />
    );
  }

  const effectiveSubclassId = subclassId || currentSubclass;
  const gainedFeatures: FeatureGrant[] = progression
    ? featuresGainedAtLevel(progression, newLevel, effectiveSubclassId)
    : [];

  // Single-class: the ruleset's own per-level slot table, same as always.
  // Multiclass: only this class's own level-up can ever change a slot pool
  // (another class leveling doesn't touch this one's), computed either via
  // Warlock's own Pact Magic table at Warlock's own level, or the shared
  // multiclass table keyed off every full/half caster's combined level.
  const spellRow = (() => {
    if (!progression) return undefined;
    if (!isMulticlass) return spellProgressionRowForLevel(progression, newLevel);
    if (!targetRow || !targetClassDef.spellcastingAbility) return undefined;
    const hypotheticalRows = classRows.map((row) =>
      row.id === targetRow.id ? { ...row, level: newLevel } : row
    );
    if (targetClassDef.casterType === "pact") {
      return warlockPactMagicRow(hypotheticalRows, character.ruleset);
    }
    const slots = multiclassSpellSlots(combinedCasterLevel(hypotheticalRows, character.ruleset), character.ruleset);
    return slots ? { level: newLevel, slots } : undefined;
  })();

  function nextAfter(resolvedSubclass: string, asiDone: boolean) {
    if (!asiDone && needsAsi) {
      setStep("asi-type");
      return;
    }
    const features = progression ? featuresGainedAtLevel(progression, newLevel, resolvedSubclass) : [];
    if (features.length > 0) {
      setStep("features");
      return;
    }
    if (spellRow) {
      setStep("spells");
      return;
    }
    setStep("summary");
  }

  function finishAsi() {
    nextAfter(effectiveSubclassId, true);
  }

  function buildChoices(): LevelUpChoices {
    const choices: LevelUpChoices = { hpMethod };
    if (needsSubclass) {
      choices.subclassId = subclassId || customSubclassName.trim();
    }
    if (needsAsi) {
      if (abilityMode && selectedAbilities.length > 0) {
        const amount = abilityMode === "one" ? 2 : 1;
        const increases: Partial<Record<AbilityScoreKey, number>> = {};
        for (const key of selectedAbilities) increases[key] = amount;
        choices.asiChoice = { type: "ability", increases } satisfies AsiOrFeatChoice;
      } else if (featText.trim()) {
        choices.asiChoice = { type: "feat", feat: featText.trim() } satisfies AsiOrFeatChoice;
      }
    }
    if (spellRow) {
      choices.spellSlotUpdates = spellRow.slots.map((total, idx) => ({
        spellLevel: idx + 1,
        total,
      }));
    }
    return choices;
  }

  if (step === "choose-class") {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Gain a Level</Text>
        <Text style={styles.hint}>
          {isMulticlass
            ? "Which class is gaining this level?"
            : "Level up your class, or take your first level in a new one."}
        </Text>
        <View style={styles.buttonColumn}>
          {isMulticlass ? (
            classRows.map((row) => (
              <Pressable
                key={row.id}
                style={styles.optionButton}
                onPress={() => {
                  setTargetClassId(row.classId);
                  setStep("choose");
                }}
              >
                <Text style={styles.optionButtonTitle}>
                  {row.className} {row.level} → {row.level + 1}
                </Text>
              </Pressable>
            ))
          ) : (
            <Pressable style={styles.optionButton} onPress={() => setStep("choose")}>
              <Text style={styles.optionButtonTitle}>
                {character.className} {character.level} → {character.level + 1}
              </Text>
            </Pressable>
          )}
          <Pressable style={styles.optionButton} onPress={() => setMulticlassMode(true)}>
            <Text style={styles.optionButtonTitle}>+ Multiclass</Text>
            <Text style={styles.optionButtonSub}>Take your first level in a new class</Text>
          </Pressable>
        </View>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  if (step === "choose") {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {isMulticlass ? `${targetRow?.className} ` : ""}Level {currentLevel} → {newLevel}
        </Text>
        <Text style={styles.hint}>How do you want to handle this level-up?</Text>
        <View style={styles.buttonColumn}>
          <Pressable style={styles.optionButton} onPress={() => setStep("hp-method")}>
            <Text style={styles.optionButtonTitle}>Use the App&apos;s Workflow</Text>
            <Text style={styles.optionButtonSub}>
              Walks through HP, subclass, ASI/feat, and new features
            </Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => onConfirm({ hpMethod: "manual" }, isMulticlass ? targetClassId : undefined)}
          >
            <Text style={styles.optionButtonTitle}>I&apos;ll Set It Myself</Text>
            <Text style={styles.optionButtonSub}>
              Bumps the level only — edit everything yourself afterward
            </Text>
          </Pressable>
        </View>
        <Pressable style={styles.cancelButton} onPress={() => setStep("choose-class")}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  if (step === "hp-method") {
    return (
      <StepCard
        title={`Level ${currentLevel} → ${newLevel}`}
        hint="How do you want to determine the HP you gain?"
        onBack={() => setStep("choose")}
        styles={styles}
      >
        <View style={styles.buttonColumn}>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setHpMethod("average");
              nextAfter(effectiveSubclassId, !needsAsi);
              if (needsSubclass) setStep("subclass");
            }}
          >
            <Text style={styles.optionButtonTitle}>Take Average</Text>
            <Text style={styles.optionButtonSub}>The safe, predictable option</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setHpMethod("roll");
              if (needsSubclass) {
                setStep("subclass");
              } else {
                nextAfter(effectiveSubclassId, !needsAsi);
              }
            }}
          >
            <Text style={styles.optionButtonTitle}>Roll Hit Die</Text>
            <Text style={styles.optionButtonSub}>Could be higher, could be lower</Text>
          </Pressable>
        </View>
      </StepCard>
    );
  }

  if (step === "subclass") {
    const subclasses = progression?.subclasses ?? [];
    return (
      <StepCard
        title={progression?.subclassLabel ? `Choose Your ${progression.subclassLabel}` : "Choose Your Subclass"}
        hint="This is a one-time choice that shapes the rest of this character's features."
        onBack={() => setStep("hp-method")}
        styles={styles}
        scroll
      >
        {subclasses.length > 0 ? (
          <View style={styles.buttonColumn}>
            {subclasses.map((sub) => (
              <Pressable
                key={sub.id}
                style={styles.optionButton}
                onPress={() => {
                  setSubclassId(sub.id);
                  nextAfter(sub.id, false);
                }}
              >
                <Text style={styles.optionButtonTitle}>{sub.name}</Text>
                <Text style={styles.optionButtonSub}>
                  {sub.srdLicensed ? sub.summary : "Not SRD content — pick this and add your own notes."}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <>
            <Text style={styles.hint}>
              We don&apos;t have detailed data for this ruleset&apos;s subclasses yet — type the name of
              the one you picked.
            </Text>
            <TextInput
              style={styles.input}
              value={customSubclassName}
              onChangeText={setCustomSubclassName}
              placeholder="e.g. Battle Master"
              placeholderTextColor={theme.colors.textMuted}
            />
            <Pressable
              style={styles.primaryButton}
              onPress={() => {
                const name = customSubclassName.trim();
                setSubclassId(name);
                nextAfter(name, false);
              }}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          </>
        )}
      </StepCard>
    );
  }

  if (step === "asi-type") {
    return (
      <StepCard
        title="Ability Score Improvement"
        hint={`At level ${newLevel}, you can increase your ability scores or take a feat.`}
        onBack={() => (needsSubclass ? setStep("subclass") : setStep("hp-method"))}
        styles={styles}
      >
        <View style={styles.buttonColumn}>
          <Pressable style={styles.optionButton} onPress={() => setStep("asi-ability-mode")}>
            <Text style={styles.optionButtonTitle}>Increase Ability Scores</Text>
            <Text style={styles.optionButtonSub}>+2 to one score, or +1 to two scores (max 20)</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => setStep("asi-feat")}>
            <Text style={styles.optionButtonTitle}>Take a Feat</Text>
            <Text style={styles.optionButtonSub}>Type the feat you&apos;re taking</Text>
          </Pressable>
        </View>
      </StepCard>
    );
  }

  if (step === "asi-ability-mode") {
    return (
      <StepCard
        title="Increase Ability Scores"
        hint="Choose how to split the increase."
        onBack={() => setStep("asi-type")}
        styles={styles}
      >
        <View style={styles.buttonColumn}>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setAbilityMode("one");
              setSelectedAbilities([]);
              setStep("asi-ability-pick");
            }}
          >
            <Text style={styles.optionButtonTitle}>+2 to One Ability</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              setAbilityMode("two");
              setSelectedAbilities([]);
              setStep("asi-ability-pick");
            }}
          >
            <Text style={styles.optionButtonTitle}>+1 to Two Abilities</Text>
          </Pressable>
        </View>
      </StepCard>
    );
  }

  if (step === "asi-ability-pick") {
    const limit = abilityMode === "one" ? 1 : 2;
    const abilityKeys = Object.keys(ABILITY_LABELS) as AbilityScoreKey[];
    return (
      <StepCard
        title={abilityMode === "one" ? "Pick One Ability (+2)" : "Pick Two Abilities (+1 each)"}
        hint={`Current score shown in parentheses. Select ${limit}.`}
        onBack={() => setStep("asi-ability-mode")}
        styles={styles}
      >
        <View style={styles.chipRow}>
          {abilityKeys.map((key) => {
            const selected = selectedAbilities.includes(key);
            return (
              <Pressable
                key={key}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => {
                  if (selected) {
                    setSelectedAbilities(selectedAbilities.filter((k) => k !== key));
                  } else if (selectedAbilities.length < limit) {
                    setSelectedAbilities([...selectedAbilities, key]);
                  }
                }}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {ABILITY_LABELS[key]} ({character[key]})
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          style={[styles.primaryButton, selectedAbilities.length !== limit && styles.primaryButtonDisabled]}
          disabled={selectedAbilities.length !== limit}
          onPress={finishAsi}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  if (step === "asi-feat") {
    return (
      <StepCard
        title="Take a Feat"
        hint="Browse the feat catalog, or type your own (e.g. a homebrew feat your table uses)."
        onBack={() => setStep("asi-type")}
        styles={styles}
      >
        <Pressable style={styles.optionButton} onPress={() => setFeatPickerVisible(true)}>
          <Text style={styles.optionButtonTitle}>Browse Feat Catalog</Text>
          <Text style={styles.optionButtonSub}>SRD 2024 + Level Up A5E&apos;s Adventurer&apos;s Guide</Text>
        </Pressable>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={featText}
          onChangeText={setFeatText}
          placeholder="e.g. Great Weapon Master"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
        <Pressable
          style={[styles.primaryButton, !featText.trim() && styles.primaryButtonDisabled]}
          disabled={!featText.trim()}
          onPress={finishAsi}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
        <FeatPickerModal
          visible={featPickerVisible}
          onClose={() => setFeatPickerVisible(false)}
          onPick={(entry) => {
            setFeatText(entry.description ? `${entry.name} -- ${entry.description}` : entry.name);
            setFeatPickerVisible(false);
          }}
        />
      </StepCard>
    );
  }

  if (step === "features") {
    return (
      <StepCard
        title={`New at Level ${newLevel}`}
        hint="Here's what you gained this level."
        onBack={undefined}
        styles={styles}
        scroll
      >
        <View style={{ gap: 14 }}>
          {gainedFeatures.map((f, idx) => (
            <View key={`${f.name}-${idx}`}>
              <Text style={styles.featureName}>
                {f.name}
                {f.source === "subclass" ? " (subclass)" : ""}
              </Text>
              <Text style={styles.featureText}>{f.description}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => (spellRow ? setStep("spells") : setStep("summary"))}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  if (step === "spells" && spellRow) {
    return (
      <StepCard
        title="Spellcasting Updated"
        hint={
          isMulticlass
            ? "Your combined multiclass spell slots have been recalculated for this level."
            : "Your spell slots have been recalculated for this level."
        }
        onBack={undefined}
        styles={styles}
      >
        <View style={styles.chipRow}>
          {spellRow.slots.map((total, idx) =>
            total > 0 ? (
              <View key={idx} style={styles.slotChip}>
                <Text style={styles.slotChipText}>
                  {ordinal(idx + 1)}: {total}
                </Text>
              </View>
            ) : null
          )}
        </View>
        {spellRow.cantripsKnown !== undefined && (
          <Text style={styles.hint}>Cantrips known: {spellRow.cantripsKnown}</Text>
        )}
        {spellRow.spellsKnown !== undefined && (
          <Text style={styles.hint}>Spells known: {spellRow.spellsKnown}</Text>
        )}
        <Pressable style={styles.primaryButton} onPress={() => setStep("summary")}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
      </StepCard>
    );
  }

  // summary
  const choices = buildChoices();
  return (
    <StepCard title={`Confirm Level ${newLevel}`} hint="" onBack={undefined} styles={styles} scroll>
      <View style={{ gap: 6 }}>
        <Text style={styles.featureText}>HP method: {choices.hpMethod}</Text>
        {choices.subclassId ? (
          <Text style={styles.featureText}>Subclass: {choices.subclassId}</Text>
        ) : null}
        {choices.asiChoice?.type === "ability" ? (
          <Text style={styles.featureText}>
            Ability increases:{" "}
            {Object.entries(choices.asiChoice.increases)
              .map(([k, v]) => `${ABILITY_LABELS[k as AbilityScoreKey]} +${v}`)
              .join(", ")}
          </Text>
        ) : null}
        {choices.asiChoice?.type === "feat" ? (
          <Text style={styles.featureText}>Feat: {choices.asiChoice.feat}</Text>
        ) : null}
        {choices.spellSlotUpdates ? (
          <Text style={styles.featureText}>Spell slots updated for level {newLevel}.</Text>
        ) : null}
      </View>
      <Pressable
        style={styles.primaryButton}
        onPress={() => onConfirm(choices, isMulticlass ? targetClassId : undefined)}
      >
        <Text style={styles.primaryButtonText}>Confirm Level Up</Text>
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
  return (
    <View style={styles.card}>
      {scroll ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {onBack && (
        <Pressable style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </Pressable>
      )}
    </View>
  );
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
    scroll: { maxHeight: 420 },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 6,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 16 },
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
  });
}
