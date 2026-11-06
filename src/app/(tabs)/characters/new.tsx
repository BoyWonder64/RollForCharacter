import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { Text, TextInput } from "../../../components/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { router } from "expo-router";
import {
  ALIGNMENTS,
  CUSTOM_CLASS_FALLBACK,
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  DEFAULT_RULESET,
  RULESETS,
  getRulesetCatalog,
  type ClassDefinition,
  type ClassTrait,
  type RaceDefinition,
  type RaceTrait,
} from "../../../data/rulesets";
import {
  EMPTY_SELECTION,
  computeArmorClass,
  describeOption,
  resolveStartingGear,
  type StartingEquipmentSelection,
} from "../../../features/characters/startingEquipment";
import { applyStartingGear } from "../../../features/characters/startingGearRepo";
import { StartingEquipmentStep } from "../../../components/StartingEquipmentStep";
import {
  appendHomebrewFeatures,
  applyRaceAbilityBonuses,
  calculateMaxHp,
  calculateMaxHpFromRolls,
  describeFeatEffect,
  type ResolvedFeatPick,
  effectiveArmorProficiencies,
  effectiveWeaponProficiencies,
  findSubclass,
  getClassProgression,
  languageGrantForRace,
  customLanguageId,
  isCustomLanguageId,
  customLanguageName,
  proficiencyBonusForLevel,
  roll4d6DropLowest,
  STANDARD_ARRAY,
} from "../../../features/characters/characterCalculations";
import {
  ABILITY_LABELS,
  abilityModifier,
  createCharacterFromOnboarding,
  getCharacter,
  updateCharacter,
} from "../../../features/characters/characterRepo";
import { addResolvedFeat } from "../../../features/characters/featRepo";
import { rollDie } from "../../../features/dice/diceEngine";
import { FeatPickerModal } from "../../../components/FeatPickerModal";
import { CreatingOverlay } from "../../../components/CreatingOverlay";
import {
  addCatalogSpellToCharacter,
  setSpellSlot,
  listSpellCatalog,
} from "../../../features/spells/spellRepo";
import { getSpellLimits } from "../../../features/characters/spellLimits";
import { PortraitPicker, type PortraitChoice } from "../../../components/PortraitPicker";
import { findSpritePortrait } from "../../../data/spritePortraits";
import {
  persistBundledPortrait,
  persistPortrait,
} from "../../../features/characters/portraitStorage";
import { SubclassPicker } from "../../../components/SubclassPicker";
import { xpThresholdForLevel } from "../../../features/characters/xpTable";
import type { AbilityScoreKey } from "../../../types/models";
import { useTheme } from "../../../theme/ThemeContext";
import type { Theme } from "../../../theme/colors";
import { useIconSettings } from "../../../features/icons/IconSettingsContext";
import { getSpellSchoolIcon } from "../../../features/icons/iconAssets";
import { DoneAccessory } from "../../../components/DoneAccessory";

const ALL_STEPS = [
  "ruleset",
  "name",
  "race",
  "languages",
  "class",
  "background",
  "alignment",
  "personality",
  "proficiencies",
  "level",
  "subclass",
  "experience",
  "abilities",
  // Levels above 1 only: the Ability Score Improvements / feats the character
  // would have taken on the way up, then HP for every level gained. Both come
  // after abilities because they depend on the final scores (CON for HP).
  "asi",
  "hp",
  "skills",
  // After abilities and subclass so the Armor Class preview uses real scores
  // and any subclass proficiencies are already known.
  "equipment",
  "spells",
  // Homebrew classes only, levels above 1: a catalog class's features are
  // derived from its level on the sheet, a custom one has to be told.
  "features",
  "portrait",
  "review",
] as const;
type Step = (typeof ALL_STEPS)[number];

type AsiChoice =
  | { kind: "ability"; mode: "one" | "two"; abilities: AbilityScoreKey[] }
  | { kind: "feat"; feat: ResolvedFeatPick | null };

/** 5e's standard Ability Score Improvement levels, used for homebrew classes (which have no progression table). */
const CUSTOM_CLASS_ASI_LEVELS = [4, 8, 12, 16, 19];

type CatalogRow = Awaited<ReturnType<typeof listSpellCatalog>>[number];
const SPELL_RESULT_PAGE_SIZE = 30;

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

function clampLevel(value: string): number {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(20, Math.max(1, parsed));
}

export default function NewCharacterScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Custom-text fields ("Type your own race/class/weapon") tend to sit below
  // a long list of choices, so the keyboard can still crowd them even with
  // auto-scroll-into-view. Mirroring the live value into a banner fixed
  // above the ScrollView (so it's never under the keyboard) lets the user
  // see what they're typing regardless of scroll position.
  const [livePreview, setLivePreview] = useState<{
    key: string;
    label: string;
    value: string;
  } | null>(null);

  function showPreview(key: string, label: string, value: string) {
    setLivePreview({ key, label, value });
  }

  function previewBlurHandler(key: string) {
    return () => setLivePreview((prev) => (prev?.key === key ? null : prev));
  }

  function previewChangeHandler(key: string, setValue: (text: string) => void) {
    return (text: string) => {
      setValue(text);
      setLivePreview((prev) => (prev?.key === key ? { ...prev, value: text } : prev));
    };
  }
  const { iconsEnabled, iconStyle } = useIconSettings();
  const [stepIndex, setStepIndex] = useState(0);

  const [ruleset, setRuleset] = useState(DEFAULT_RULESET);
  const catalog = useMemo(() => getRulesetCatalog(ruleset), [ruleset]);

  const [name, setName] = useState("");
  const [subclass, setSubclass] = useState("");
  const [portraitChoice, setPortraitChoice] = useState<PortraitChoice>(null);

  const [raceId, setRaceId] = useState<string | null>(null);
  const [customRaceName, setCustomRaceName] = useState("");
  const [selectedExtraLanguageIds, setSelectedExtraLanguageIds] = useState<Set<string>>(new Set());
  // Homebrew race fields -- only used when raceId === CUSTOM_OPTION_ID, see
  // `getRaceDefinitionForCharacter`.
  const [customRaceAbilityBonuses, setCustomRaceAbilityBonuses] = useState<
    Partial<Record<AbilityScoreKey, number>>
  >({});
  const [customRaceSize, setCustomRaceSize] = useState<"Small" | "Medium">("Medium");
  const [customRaceSpeed, setCustomRaceSpeed] = useState("30");
  const [customRaceTraits, setCustomRaceTraits] = useState<RaceTrait[]>([]);
  const [newTraitName, setNewTraitName] = useState("");
  const [newTraitDescription, setNewTraitDescription] = useState("");

  const [classId, setClassId] = useState<string | null>(null);
  const [customClassName, setCustomClassName] = useState("");
  // Homebrew class fields -- only used when classId === CUSTOM_OPTION_ID, see
  // `getClassDefinitionForCharacter`.
  const [customClassHitDie, setCustomClassHitDie] = useState<6 | 8 | 10 | 12>(8);
  const [customClassSavingThrows, setCustomClassSavingThrows] = useState<AbilityScoreKey[]>([]);
  const [customClassArmorProficiencies, setCustomClassArmorProficiencies] = useState("");
  const [customClassWeaponProficiencies, setCustomClassWeaponProficiencies] = useState("");
  const [customClassTraits, setCustomClassTraits] = useState<ClassTrait[]>([]);
  const [newClassTraitName, setNewClassTraitName] = useState("");
  const [newClassTraitDescription, setNewClassTraitDescription] = useState("");

  const [background, setBackground] = useState("");
  // 2024 5e only -- see `RulesetCatalog.backgroundAbilityBonus`. Unused (and
  // reset) for rulesets where ability increases come from race instead.
  const [backgroundAbilityBonuses, setBackgroundAbilityBonuses] = useState<
    Partial<Record<AbilityScoreKey, number>>
  >({});
  const [personalityTraits, setPersonalityTraits] = useState("");
  const [ideals, setIdeals] = useState("");
  const [bonds, setBonds] = useState("");
  const [flaws, setFlaws] = useState("");
  const [alignment, setAlignment] = useState<string | null>(null);
  const [otherProficiencies, setOtherProficiencies] = useState("");
  const [featuresAndTraits, setFeaturesAndTraits] = useState("");
  const [level, setLevel] = useState("1");
  const [usesXp, setUsesXp] = useState<boolean | null>(null);

  // Levels above 1 -- see the "asi", "hp" and "features" steps.
  const [asiChoices, setAsiChoices] = useState<Record<number, AsiChoice>>({});
  const [featPickerLevel, setFeatPickerLevel] = useState<number | null>(null);
  const [hpMethod, setHpMethod] = useState<"average" | "roll">("average");
  // One raw hit-die roll per level after the first. Only trusted while its
  // length is `level - 1` (picking a different level clears it).
  const [hpRolls, setHpRolls] = useState<number[]>([]);
  const [homebrewFeatures, setHomebrewFeatures] = useState<
    { level: number; name: string; description: string }[]
  >([]);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [newFeatureLevel, setNewFeatureLevel] = useState(2);

  const [abilityMethod, setAbilityMethod] = useState<"standard" | "roll">("standard");
  const [assignments, setAssignments] = useState<Partial<Record<AbilityScoreKey, number>>>({});
  // Per-ability roll detail (the 4 dice + which was dropped), "roll" method only -- kept
  // separately from `assignments` (the actual score, which both methods write into) so the
  // UI can show "4, 3, 2 (dropped 1)" alongside the total and support rerolling one ability.
  const [rolledDetails, setRolledDetails] = useState<
    Partial<Record<AbilityScoreKey, { dice: number[]; dropped: number }>>
  >({});
  const [chosenBonusAbilities, setChosenBonusAbilities] = useState<AbilityScoreKey[]>([]);

  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());

  // The player's starting-equipment choices: which package per line, and any
  // weapon/armor swapped for another. See startingEquipment.ts.
  const [equipmentSelection, setEquipmentSelection] =
    useState<StartingEquipmentSelection>(EMPTY_SELECTION);

  const [selectedSpellIds, setSelectedSpellIds] = useState<Set<number>>(new Set());
  const [spellSearch, setSpellSearch] = useState("");
  const [spellCatalogResults, setSpellCatalogResults] = useState<CatalogRow[]>([]);
  const [onlySpellClass, setOnlySpellClass] = useState(true);
  const [spellResultLimit, setSpellResultLimit] = useState(SPELL_RESULT_PAGE_SIZE);
  const [expandedSpellIds, setExpandedSpellIds] = useState<Set<number>>(new Set());

  const selectedRace: RaceDefinition | null =
    raceId === CUSTOM_OPTION_ID
      ? {
          ...CUSTOM_RACE_FALLBACK,
          abilityBonuses: customRaceAbilityBonuses,
          size: customRaceSize,
          speed: parseInt(customRaceSpeed, 10) || 30,
          traits: customRaceTraits,
        }
      : (catalog.races.find((r) => r.id === raceId) ?? null);

  // Only meaningful once a language catalog exists for this ruleset (5e,
  // 5e-2024) -- 3.5e has none yet, so its "languages" step is filtered out
  // below and this stays unused for it.
  const languageGrant = languageGrantForRace(ruleset, selectedRace);
  const languageChoiceOptions = (catalog.languages ?? []).filter(
    (l) => !languageGrant.granted.includes(l.id),
  );

  // What's granted and how many extra choices are available depends on the
  // race/ruleset, so a stale selection from a previous one can't carry over
  // (e.g. switching away from a race with more choice slots than the new
  // one allows) -- cleared right where race/ruleset are chosen rather than
  // via an effect.
  function selectRuleset(id: string) {
    setRuleset(id);
    setSelectedExtraLanguageIds(new Set());
    setBackgroundAbilityBonuses({});
  }

  // Tapping the already-selected race/class row collapses its detail panel; tapping again re-opens it.
  const [collapsedDetail, setCollapsedDetail] = useState<string | null>(null);

  function selectRace(id: string) {
    if (id === raceId) {
      setCollapsedDetail((c) => (c === `race:${id}` ? null : `race:${id}`));
      return;
    }
    setCollapsedDetail(null);
    setRaceId(id);
    setSelectedExtraLanguageIds(new Set());
  }

  const [customLanguageText, setCustomLanguageText] = useState("");
  // Custom (typed) languages are bonus picks: they never count against the race's "choose N" limit.
  const listedPickCount = (ids: Set<string>) =>
    Array.from(ids).filter((id) => !isCustomLanguageId(id)).length;
  function addCustomLanguage() {
    const id = customLanguageId(customLanguageText);
    if (!id) return;
    setSelectedExtraLanguageIds((prev) => {
      if (prev.has(id)) return prev;
      return new Set(prev).add(id);
    });
    setCustomLanguageText("");
  }

  function toggleExtraLanguage(languageId: string) {
    setSelectedExtraLanguageIds((prev) => {
      const next = new Set(prev);
      if (next.has(languageId)) {
        next.delete(languageId);
      } else {
        if (!isCustomLanguageId(languageId) && listedPickCount(prev) >= languageGrant.chooseCount)
          return prev;
        next.add(languageId);
      }
      return next;
    });
  }

  const selectedClass: ClassDefinition | null = useMemo(
    () =>
      classId === CUSTOM_OPTION_ID
        ? {
            ...CUSTOM_CLASS_FALLBACK,
            hitDie: customClassHitDie,
            savingThrows:
              customClassSavingThrows.length === 2
                ? (customClassSavingThrows as [AbilityScoreKey, AbilityScoreKey])
                : CUSTOM_CLASS_FALLBACK.savingThrows,
            armorProficiencies: customClassArmorProficiencies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            weaponProficiencies: customClassWeaponProficiencies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : (catalog.classes.find((c) => c.id === classId) ?? null),
    [
      classId,
      catalog,
      customClassHitDie,
      customClassSavingThrows,
      customClassArmorProficiencies,
      customClassWeaponProficiencies,
    ],
  );

  const raceNameValue =
    raceId === CUSTOM_OPTION_ID
      ? customRaceName.trim() || "Custom Race"
      : (selectedRace?.name ?? "");

  const classNameValue =
    classId === CUSTOM_OPTION_ID
      ? customClassName.trim() || "Custom Class"
      : (selectedClass?.name ?? "");

  const levelNum = clampLevel(level);

  // Cleric/Sorcerer/Warlock pick a subclass at 1st level, others at 2nd or
  // 3rd -- only ask once the starting level actually reaches it (later
  // levels get the same choice through Level Up).
  const subclassProgression =
    classId !== null && classId !== CUSTOM_OPTION_ID && selectedClass
      ? getClassProgression(ruleset, selectedClass.id)
      : undefined;
  const offersSubclass =
    !!subclassProgression?.subclassLevel &&
    (subclassProgression.subclasses?.length ?? 0) > 0 &&
    levelNum >= subclassProgression.subclassLevel;

  // If the starting level already reaches the subclass-choice level and one's
  // been picked, fold its bonus proficiencies (e.g. 2014 Life Domain Cleric's
  // heavy armor) into the class definition the Starting Equipment step sees,
  // so its weapon/armor swap picker honors them too.
  const chosenSubclass =
    subclassProgression && subclass ? findSubclass(subclassProgression, subclass) : undefined;
  const classDefForEquipment: ClassDefinition | null = selectedClass
    ? {
        ...selectedClass,
        armorProficiencies: effectiveArmorProficiencies(selectedClass, chosenSubclass),
        weaponProficiencies: effectiveWeaponProficiencies(selectedClass, chosenSubclass),
      }
    : null;

  // Paladins and Rangers are 5e half-casters -- they get no spells at all
  // until character level 2 (first-level spell slots), unlike full casters
  // who get cantrips/spells starting at level 1.
  const HALF_CASTER_IDS = ["paladin", "ranger"];
  const spellcastingMinLevel = selectedClass && HALF_CASTER_IDS.includes(selectedClass.id) ? 2 : 1;

  const isSpellcaster =
    classId !== null &&
    classId !== CUSTOM_OPTION_ID &&
    !!selectedClass?.spellcastingAbility &&
    levelNum >= spellcastingMinLevel;

  const hasEquipmentChoices =
    classId !== null && classId !== CUSTOM_OPTION_ID && !!selectedClass?.startingEquipment;

  // Levels (2 and up) at which the character gets an Ability Score
  // Improvement / feat. Level 1 never asks, so a level 1 character's flow is
  // unchanged. Homebrew classes have no table, so they get 5e's standard
  // levels as an optional default.
  const isCustomClass = classId === CUSTOM_OPTION_ID;
  const asiLevels: number[] = Array.from(
    new Set(
      isCustomClass
        ? CUSTOM_CLASS_ASI_LEVELS
        : [
            ...(subclassProgression?.asiLevels ?? []),
            ...(subclassProgression?.featLevels ?? []),
            ...(subclassProgression?.abilityScoreIncreaseLevels ?? []),
          ],
    ),
  )
    .filter((l) => l >= 2 && l <= levelNum)
    .sort((a, b) => a - b);

  const steps: Step[] = ALL_STEPS.filter((s) => {
    if (s === "asi") return asiLevels.length > 0;
    if (s === "hp") return levelNum > 1 && selectedClass !== null;
    if (s === "features") return isCustomClass && levelNum > 1;
    if (s === "spells") return isSpellcaster;
    if (s === "equipment") return hasEquipmentChoices;
    if (s === "subclass") return offersSubclass;
    // 3.5e has no language catalog yet -- its languages still live in the
    // freetext "Other Proficiencies" field on the proficiencies step.
    if (s === "languages") return !!catalog.languages;
    return true;
  });
  const step: Step = steps[stepIndex] ?? steps[steps.length - 1];

  const maxOnboardingSpellLevel = Math.min(9, Math.ceil(levelNum / 2));

  useEffect(() => {
    if (step !== "spells" || !selectedClass) return;
    listSpellCatalog({
      classId: onlySpellClass ? selectedClass.id : undefined,
      search: spellSearch.trim() || undefined,
    }).then((rows) =>
      setSpellCatalogResults(rows.filter((r) => r.level <= maxOnboardingSpellLevel)),
    );
  }, [step, selectedClass, spellSearch, maxOnboardingSpellLevel, onlySpellClass]);

  // Custom/homebrew classes have no skill-choice data to constrain by, so
  // they get a generic "pick 2 of anything" fallback instead of blocking
  // the step entirely.
  const skillChoiceSpec = selectedClass?.skillChoices ?? {
    count: 2,
    options: catalog.skills.map((s) => s.id),
  };

  // Players can pick ANY skill, not just the ones their class normally
  // grants -- the class's usual list is just grouped first for reference,
  // same free-text-fallback spirit as the race/class pickers' "Custom..."
  // option.
  const classSkillIds = new Set(
    classId !== null && classId !== CUSTOM_OPTION_ID
      ? (selectedClass?.skillChoices?.options ?? [])
      : [],
  );
  const groupedSkillOptions =
    classSkillIds.size > 0
      ? {
          classSkills: catalog.skills.filter((s) => classSkillIds.has(s.id)),
          otherSkills: catalog.skills.filter((s) => !classSkillIds.has(s.id)),
        }
      : { classSkills: [], otherSkills: catalog.skills };

  function toggleSkillSelection(skillId: string) {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        if (next.size >= skillChoiceSpec.count) return prev;
        next.add(skillId);
      }
      return next;
    });
  }

  function selectClass(id: string) {
    if (id === classId) {
      setCollapsedDetail((c) => (c === `class:${id}` ? null : `class:${id}`));
      return;
    }
    setCollapsedDetail(null);
    setClassId(id);
    setSubclass("");
    setSelectedSkillIds(new Set());
    setEquipmentSelection(EMPTY_SELECTION);
    // ASI levels, hit die and features all belong to the old class.
    setAsiChoices({});
    setHpRolls([]);
    setHomebrewFeatures([]);
  }

  function selectLevel(n: number) {
    setLevel(String(n));
    setHpRolls([]);
    setHpMethod("average");
  }

  /** One-line kit summary for a class, with the given choices applied (default = each line's first option). */
  function describeKit(klass: ClassDefinition, selection: StartingEquipmentSelection): string {
    return (klass.startingEquipment ?? [])
      .map((line, i) => {
        const optionIndex = selection.optionIndex[i] ?? 0;
        return describeOption(
          line[optionIndex] ?? line[0] ?? [],
          i,
          optionIndex,
          selection,
          catalog,
          klass,
        );
      })
      .join("; ");
  }

  function toggleSpellSelection(spell: CatalogRow) {
    setSelectedSpellIds((prev) => {
      const next = new Set(prev);
      if (next.has(spell.id)) {
        next.delete(spell.id);
        return next;
      }
      if (spellLimits) {
        const isCantrip = spell.level === 0;
        const countOfType = spellCatalogResults.filter(
          (s) => next.has(s.id) && (s.level === 0) === isCantrip,
        ).length;
        const limit = isCantrip ? spellLimits.cantrips : spellLimits.spells;
        if (countOfType >= limit) return prev;
      }
      next.add(spell.id);
      return next;
    });
  }

  function toggleSpellExpanded(spellId: number) {
    setExpandedSpellIds((prev) => {
      const next = new Set(prev);
      if (next.has(spellId)) {
        next.delete(spellId);
      } else {
        next.add(spellId);
      }
      return next;
    });
  }

  const baseAbilityScores: Record<AbilityScoreKey, number> = {
    strength: assignments.strength ?? 10,
    dexterity: assignments.dexterity ?? 10,
    constitution: assignments.constitution ?? 10,
    intelligence: assignments.intelligence ?? 10,
    wisdom: assignments.wisdom ?? 10,
    charisma: assignments.charisma ?? 10,
  };
  const finalAbilityScores: Record<AbilityScoreKey, number> = (() => {
    const withRace = !selectedRace
      ? baseAbilityScores
      : applyRaceAbilityBonuses(baseAbilityScores, selectedRace, chosenBonusAbilities);
    if (!catalog.backgroundAbilityBonus) return withRace;
    const result = { ...withRace };
    for (const [key, bonus] of Object.entries(backgroundAbilityBonuses) as [
      AbilityScoreKey,
      number,
    ][]) {
      result[key] += bonus;
    }
    return result;
  })();

  // What gets written to the character row: race/background bonuses plus the
  // chosen ability-score increases. Feat-granted increases are NOT in here --
  // `addResolvedFeat` applies those itself once the character exists.
  const scoresForCreate: Record<AbilityScoreKey, number> = (() => {
    const result = { ...finalAbilityScores };
    for (const lvl of asiLevels) {
      const choice = asiChoices[lvl];
      if (choice?.kind !== "ability") continue;
      const amount = choice.mode === "one" ? 2 : 1;
      for (const key of choice.abilities) {
        // Capped at 20, but never pulled down if a score already starts higher.
        result[key] = Math.max(result[key], Math.min(20, result[key] + amount));
      }
    }
    return result;
  })();
  // The end result the sheet will show: everything above plus feat increases.
  // Drives HP (CON), AC (DEX), spell limits and the review screen.
  const adjustedScores: Record<AbilityScoreKey, number> = (() => {
    const result = { ...scoresForCreate };
    for (const lvl of asiLevels) {
      const choice = asiChoices[lvl];
      if (choice?.kind !== "feat" || !choice.feat) continue;
      for (const effect of choice.feat.effects) {
        if (effect.kind !== "abilityScoreIncrease") continue;
        result[effect.ability] = Math.min(effect.max, result[effect.ability] + effect.amount);
      }
    }
    return result;
  })();

  function asiChoiceComplete(lvl: number): boolean {
    const choice = asiChoices[lvl];
    if (!choice) return false;
    if (choice.kind === "feat") return choice.feat !== null;
    return choice.abilities.length === (choice.mode === "one" ? 1 : 2);
  }

  function setAsiKind(lvl: number, kind: AsiChoice["kind"]) {
    setAsiChoices((prev) => {
      const current = prev[lvl];
      if (current?.kind === kind) return prev;
      return {
        ...prev,
        [lvl]:
          kind === "ability"
            ? { kind: "ability", mode: "one", abilities: [] }
            : { kind: "feat", feat: null },
      };
    });
  }

  function setAsiMode(lvl: number, mode: "one" | "two") {
    setAsiChoices((prev) => ({ ...prev, [lvl]: { kind: "ability", mode, abilities: [] } }));
  }

  function toggleAsiAbility(lvl: number, key: AbilityScoreKey) {
    setAsiChoices((prev) => {
      const choice = prev[lvl];
      if (choice?.kind !== "ability") return prev;
      const limit = choice.mode === "one" ? 1 : 2;
      let abilities: AbilityScoreKey[];
      if (choice.abilities.includes(key)) abilities = choice.abilities.filter((k) => k !== key);
      else if (choice.abilities.length < limit) abilities = [...choice.abilities, key];
      else if (limit === 1) abilities = [key];
      else return prev;
      return { ...prev, [lvl]: { ...choice, abilities } };
    });
  }

  /** Combined race + background ability-score bonus for one ability, for display while assigning scores -- doesn't include the base assigned value. */
  function totalBonusFor(key: AbilityScoreKey): number {
    const fixed = selectedRace?.abilityBonuses[key] ?? 0;
    const chosen =
      selectedRace?.chooseAbilityBonus && chosenBonusAbilities.includes(key)
        ? selectedRace.chooseAbilityBonus.amount
        : 0;
    const background = backgroundAbilityBonuses[key] ?? 0;
    return fixed + chosen + background;
  }

  // Suggest abilities to raise, derived only from SRD class data (spellcasting ability + saving throw proficiencies).
  const suggestedAbilities: AbilityScoreKey[] =
    selectedClass && classId !== CUSTOM_OPTION_ID
      ? Array.from(
          new Set<AbilityScoreKey>([
            ...(selectedClass.spellcastingAbility ? [selectedClass.spellcastingAbility] : []),
            ...(selectedClass.savingThrows ?? []),
          ]),
        )
      : [];

  const spellLimits =
    selectedClass && selectedClass.spellcastingAbility
      ? getSpellLimits(
          selectedClass.id,
          levelNum,
          abilityModifier(adjustedScores[selectedClass.spellcastingAbility]),
          ruleset,
        )
      : undefined;

  const racialHpBonus = selectedRace?.hitPointBonusPerLevel ?? 0;
  const hpRollsValid = hpMethod === "roll" && hpRolls.length === levelNum - 1;
  const derivedMaxHp = selectedClass
    ? hpRollsValid
      ? calculateMaxHpFromRolls(
          selectedClass.hitDie,
          hpRolls,
          abilityModifier(adjustedScores.constitution),
          racialHpBonus,
        )
      : calculateMaxHp(
          selectedClass.hitDie,
          levelNum,
          abilityModifier(adjustedScores.constitution),
          racialHpBonus,
        )
    : 10;

  function rollAllHp() {
    if (!selectedClass) return;
    setHpRolls(Array.from({ length: levelNum - 1 }, () => rollDie(selectedClass.hitDie)));
  }

  function rerollHpLevel(index: number) {
    if (!selectedClass) return;
    setHpRolls((prev) => prev.map((r, i) => (i === index ? rollDie(selectedClass.hitDie) : r)));
  }

  function selectHpMethod(method: "average" | "roll") {
    setHpMethod(method);
    if (method === "roll") rollAllHp();
  }
  // What the starting-equipment step resolved to (empty for a custom class, which has no kit).
  const resolvedGear = selectedClass
    ? resolveStartingGear(
        selectedClass.startingEquipment ?? [],
        equipmentSelection,
        catalog,
        selectedClass,
      )
    : null;
  const derivedArmorClass = computeArmorClass(
    adjustedScores.dexterity,
    resolvedGear?.armor ?? [],
  );
  const derivedSpeed = selectedRace?.speed ?? 30;
  const derivedProficiencyBonus = proficiencyBonusForLevel(levelNum);

  function canGoNext(): boolean {
    switch (step) {
      case "ruleset":
        return true;
      case "name":
        return name.trim().length > 0;
      case "portrait":
        return true;
      case "race":
        return raceId !== null && (raceId !== CUSTOM_OPTION_ID || customRaceName.trim().length > 0);
      case "languages":
        return listedPickCount(selectedExtraLanguageIds) === languageGrant.chooseCount;
      case "class":
        return (
          classId !== null && (classId !== CUSTOM_OPTION_ID || customClassName.trim().length > 0)
        );
      case "equipment":
        return true;
      case "background": {
        if (!catalog.backgroundAbilityBonus) return true;
        const total = Object.values(backgroundAbilityBonuses).reduce((a, b) => a + (b ?? 0), 0);
        return total === catalog.backgroundAbilityBonus.totalPoints;
      }
      case "alignment":
        return true;
      case "personality":
        return true;
      case "proficiencies":
        return true;
      case "level":
        return level.trim().length > 0;
      case "subclass":
        return true;
      case "experience":
        return usesXp !== null;
      case "abilities": {
        const allAssigned = ABILITY_KEYS.every((key) => assignments[key] !== undefined);
        if (!allAssigned) return false;
        if (selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID) {
          return chosenBonusAbilities.length === selectedRace.chooseAbilityBonus.count;
        }
        return true;
      }
      case "asi":
        // Homebrew classes' levels are a guess at 5e's defaults, so every
        // choice is optional there; catalog classes need each one made.
        return isCustomClass || asiLevels.every(asiChoiceComplete);
      case "hp":
        return hpMethod === "average" || hpRollsValid;
      case "features":
        return true;
      case "skills":
        return true;
      case "spells":
        return true;
      case "review":
        return true;
    }
  }

  function goNext() {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepIndex(stepIndex - 1);
  }

  function selectAbilityMethod(method: "standard" | "roll") {
    setAbilityMethod(method);
    setAssignments({});
    setRolledDetails({});
  }

  function rollAbilityScore(ability: AbilityScoreKey) {
    const result = roll4d6DropLowest();
    setAssignments((prev) => ({ ...prev, [ability]: result.total }));
    setRolledDetails((prev) => ({
      ...prev,
      [ability]: { dice: result.dice, dropped: result.dropped },
    }));
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
    return Object.entries(assignments).some(([key, used]) => key !== ability && used === value);
  }

  function toggleBonusAbility(key: AbilityScoreKey) {
    const maxCount = selectedRace?.chooseAbilityBonus?.count ?? 0;
    setChosenBonusAbilities((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= maxCount) return prev;
      return [...prev, key];
    });
  }

  function equipmentSummaryText(): string {
    if (!selectedClass || (selectedClass.startingEquipment ?? []).length === 0) return "";
    return `Starting Equipment: ${describeKit(selectedClass, equipmentSelection)}`;
  }

  /** Spell slots are otherwise only set by Level Up, so a character started above level 1 would have none. */
  async function applyStartingSpellSlots(characterId: number) {
    if (!selectedClass || classId === CUSTOM_OPTION_ID) return;
    const row = getClassProgression(ruleset, selectedClass.id)?.spellProgression?.find(
      (r) => r.level === levelNum,
    );
    if (!row) return;
    for (const [index, total] of row.slots.entries()) {
      if (total > 0) await setSpellSlot(characterId, index + 1, total);
    }
  }

  const creatingRef = useRef(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setCreating(true);
    try {
      await createNow();
    } catch (error) {
      creatingRef.current = false;
      setCreating(false);
      throw error;
    }
  }

  async function createNow() {
    let featuresText = featuresAndTraits.trim();
    if (isCustomClass) {
      for (const feature of [...homebrewFeatures].sort((a, b) => a.level - b.level)) {
        if (feature.level > levelNum) continue;
        featuresText = appendHomebrewFeatures(featuresText, feature.level, [feature]);
      }
    }
    const created = await createCharacterFromOnboarding({
      name: name.trim(),
      ruleset,
      race: raceNameValue,
      className: classNameValue,
      subclass: offersSubclass ? subclass.trim() : "",
      background: background.trim(),
      alignment: alignment ?? "",
      personalityTraits: personalityTraits.trim(),
      ideals: ideals.trim(),
      bonds: bonds.trim(),
      flaws: flaws.trim(),
      otherProficiencies: otherProficiencies.trim(),
      featuresAndTraits: featuresText,
      languages: catalog.languages
        ? [...languageGrant.granted, ...Array.from(selectedExtraLanguageIds)]
        : [],
      level: levelNum,
      maxHp: derivedMaxHp,
      armorClass: derivedArmorClass,
      speed: derivedSpeed,
      proficiencyBonus: derivedProficiencyBonus,
      strength: scoresForCreate.strength,
      dexterity: scoresForCreate.dexterity,
      constitution: scoresForCreate.constitution,
      intelligence: scoresForCreate.intelligence,
      wisdom: scoresForCreate.wisdom,
      charisma: scoresForCreate.charisma,
      skillProficiencies: Array.from(selectedSkillIds),
      notes: "",
      usesXp: usesXp ?? false,
      experiencePoints: usesXp ? xpThresholdForLevel(ruleset, levelNum) : 0,
      ...(raceId === CUSTOM_OPTION_ID
        ? {
            customRaceAbilityBonuses,
            customRaceSize,
            customRaceSpeed: parseInt(customRaceSpeed, 10) || 30,
            customRaceTraits,
          }
        : {}),
      ...(classId === CUSTOM_OPTION_ID
        ? {
            customClassHitDie,
            customClassSavingThrows,
            customClassArmorProficiencies: customClassArmorProficiencies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            customClassWeaponProficiencies: customClassWeaponProficiencies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            customClassTraits,
          }
        : {}),
    });
    // Portrait is cosmetic: a failure to save it shouldn't lose the character.
    try {
      let portraitUri: string | null = null;
      if (portraitChoice?.kind === "upload")
        portraitUri = await persistPortrait(portraitChoice.uri);
      else if (portraitChoice?.kind === "sprite") {
        const sprite = findSpritePortrait(portraitChoice.id);
        if (sprite) portraitUri = await persistBundledPortrait(sprite.source);
      }
      if (portraitUri) await updateCharacter(created.id, { portraitUri });
    } catch (error) {
      console.warn("Portrait save failed", error);
      Alert.alert(
        "Portrait not saved",
        "Your character was created, but the portrait couldn't be saved. You can add it from the Edit screen.",
      );
    }
    if (resolvedGear) await applyStartingGear(created.id, ruleset, resolvedGear);
    await applyStartingSpellSlots(created.id);
    for (const spellId of selectedSpellIds) {
      await addCatalogSpellToCharacter(created.id, spellId);
    }
    // Feats last: they apply their own ability increases on top of the saved
    // scores and recompute AC from the gear that's now on the character.
    // Re-read the character each time so a second feat sees the first's changes.
    for (const lvl of asiLevels) {
      const choice = asiChoices[lvl];
      if (choice?.kind !== "feat" || !choice.feat) continue;
      const fresh = await getCharacter(created.id);
      if (fresh) await addResolvedFeat(fresh, choice.feat);
    }
    router.replace({
      pathname: "/(tabs)/characters/[characterId]",
      params: { characterId: String(created.id) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stepCounter}>
        Step {stepIndex + 1} of {steps.length}
      </Text>

      {livePreview && (
        <View style={styles.livePreviewBanner}>
          <Text style={styles.livePreviewLabel}>{livePreview.label}</Text>
          <Text style={styles.livePreviewValue} numberOfLines={1}>
            {livePreview.value.length > 0 ? livePreview.value : "…"}
          </Text>
        </View>
      )}

      <KeyboardAwareScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        bottomOffset={60}
      >
        {step === "ruleset" && (
          <View>
            <Text style={styles.title}>Which rules are you playing with?</Text>
            <Text style={styles.hint}>
              This determines the races, classes, spells, and skills available for this character.
            </Text>
            {Object.values(RULESETS).map((rs) => (
              <ChoiceRow
                key={rs.id}
                label={rs.label}
                sublabel={`${rs.classes.length} classes · ${rs.races.length} races · ${rs.spells.length} spells`}
                selected={ruleset === rs.id}
                onPress={() => selectRuleset(rs.id)}
              />
            ))}
          </View>
        )}

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

        {step === "portrait" && (
          <View>
            <Text style={styles.title}>Choose a portrait</Text>
            <Text style={styles.hint}>
              Pick a pixel-art hero or upload your own image. You can skip this and change it later.
            </Text>
            <PortraitPicker value={portraitChoice} onChange={setPortraitChoice} />
          </View>
        )}

        {step === "race" && (
          <View>
            <Text style={styles.title}>Choose a race</Text>
            {catalog.races.map((race) => (
              <View key={race.id}>
                <ChoiceRow
                  label={race.name}
                  sublabel={race.summary}
                  selected={raceId === race.id}
                  onPress={() => selectRace(race.id)}
                />
                {raceId === race.id && collapsedDetail !== `race:${race.id}` && (
                  <View style={styles.detailPanel}>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Speed: </Text>
                      {race.speed} ft
                    </Text>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Size: </Text>
                      {race.sizeOptions ? race.sizeOptions.join(" or ") : race.size}
                    </Text>
                    {Object.keys(race.abilityBonuses).length > 0 && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ability Bonuses: </Text>
                        {Object.entries(race.abilityBonuses)
                          .map(
                            ([key, value]) =>
                              `${value >= 0 ? "+" : ""}${value} ${ABILITY_LABELS[key as AbilityScoreKey]}`,
                          )
                          .join(", ")}
                      </Text>
                    )}
                    {Object.keys(race.abilityBonuses).length === 0 &&
                      !race.chooseAbilityBonus &&
                      catalog.backgroundAbilityBonus && (
                        <Text style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Ability Bonuses: </Text>
                          None from {race.name}. Your ability score increases come from your
                          background: +{catalog.backgroundAbilityBonus.maxPerAbility} to one score
                          and +
                          {catalog.backgroundAbilityBonus.totalPoints -
                            catalog.backgroundAbilityBonus.maxPerAbility}{" "}
                          to another, or +1 to three scores.
                        </Text>
                      )}
                    {race.chooseAbilityBonus && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Choice Bonus: </Text>+
                        {race.chooseAbilityBonus.amount} to {race.chooseAbilityBonus.count} ability
                        score
                        {race.chooseAbilityBonus.count > 1 ? "s" : ""} of your choice
                        {race.chooseAbilityBonus.excluding &&
                        race.chooseAbilityBonus.excluding.length > 0
                          ? ` (not ${race.chooseAbilityBonus.excluding
                              .map((a) => ABILITY_LABELS[a])
                              .join(", ")})`
                          : ""}
                      </Text>
                    )}
                    {race.traits && race.traits.length > 0 && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Traits: </Text>
                        {race.traits.map((t) => t.name).join(", ")}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own race"
              selected={raceId === CUSTOM_OPTION_ID}
              onPress={() => selectRace(CUSTOM_OPTION_ID)}
            />
            {raceId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customRaceName}
                onChangeText={previewChangeHandler("customRace", setCustomRaceName)}
                placeholder="Race name"
                placeholderTextColor={theme.colors.textMuted}
                onFocus={() => showPreview("customRace", "Race name", customRaceName)}
                onBlur={previewBlurHandler("customRace")}
              />
            )}
            {raceId === CUSTOM_OPTION_ID && (
              <View style={styles.customBuilderSection}>
                <Text style={styles.customBuilderLabel}>Ability Score Bonuses</Text>
                {ABILITY_KEYS.map((key) => {
                  const value = customRaceAbilityBonuses[key] ?? 0;
                  return (
                    <View key={key} style={styles.stepperRow}>
                      <Text style={styles.stepperLabel}>{ABILITY_LABELS[key]}</Text>
                      <View style={styles.stepperControls}>
                        <Pressable
                          style={styles.stepperButton}
                          onPress={() =>
                            setCustomRaceAbilityBonuses((prev) => ({
                              ...prev,
                              [key]: Math.max(-2, (prev[key] ?? 0) - 1),
                            }))
                          }
                        >
                          <Text style={styles.stepperButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.stepperValue}>{value > 0 ? `+${value}` : value}</Text>
                        <Pressable
                          style={styles.stepperButton}
                          onPress={() =>
                            setCustomRaceAbilityBonuses((prev) => ({
                              ...prev,
                              [key]: Math.min(3, (prev[key] ?? 0) + 1),
                            }))
                          }
                        >
                          <Text style={styles.stepperButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}

                <Text style={styles.customBuilderLabel}>Size</Text>
                <View style={styles.skillGrid}>
                  {(["Small", "Medium"] as const).map((size) => (
                    <Pressable
                      key={size}
                      onPress={() => setCustomRaceSize(size)}
                      style={[styles.skillCard, customRaceSize === size && styles.skillCardActive]}
                    >
                      <Text
                        style={[
                          styles.skillCardText,
                          customRaceSize === size && styles.skillCardTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.customBuilderLabel}>Speed (feet)</Text>
                <TextInput
                  style={styles.input}
                  value={customRaceSpeed}
                  onChangeText={setCustomRaceSpeed}
                  keyboardType="number-pad" inputAccessoryViewID="done-new"
                  placeholder="30"
                  placeholderTextColor={theme.colors.textMuted}
                />

                <Text style={styles.customBuilderLabel}>Traits</Text>
                {customRaceTraits.map((trait, i) => (
                  <View key={`${trait.name}-${i}`} style={styles.traitRow}>
                    <View style={styles.traitInfo}>
                      <Text style={styles.traitName}>{trait.name}</Text>
                      {trait.description.length > 0 && (
                        <Text style={styles.traitDescription}>{trait.description}</Text>
                      )}
                    </View>
                    <Pressable
                      onPress={() =>
                        setCustomRaceTraits((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      <Text style={styles.traitRemove}>×</Text>
                    </Pressable>
                  </View>
                ))}
                <TextInput
                  style={styles.input}
                  value={newTraitName}
                  onChangeText={setNewTraitName}
                  placeholder="Trait name (e.g. Darkvision)"
                  placeholderTextColor={theme.colors.textMuted}
                />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={newTraitDescription}
                  onChangeText={setNewTraitDescription}
                  placeholder="What does it do?"
                  placeholderTextColor={theme.colors.textMuted}
                  multiline
                />
                <Pressable
                  style={[
                    styles.smallAddButton,
                    !newTraitName.trim() && styles.smallAddButtonDisabled,
                  ]}
                  disabled={!newTraitName.trim()}
                  onPress={() => {
                    setCustomRaceTraits((prev) => [
                      ...prev,
                      {
                        name: newTraitName.trim(),
                        description: newTraitDescription.trim(),
                      },
                    ]);
                    setNewTraitName("");
                    setNewTraitDescription("");
                  }}
                >
                  <Text style={styles.smallAddButtonText}>Add Trait</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {step === "languages" && (
          <View>
            <Text style={styles.title}>Languages</Text>
            <Text style={styles.hint}>
              {languageGrant.granted.length > 0
                ? `You automatically know: ${languageGrant.granted
                    .map((id) =>
                      isCustomLanguageId(id)
                        ? customLanguageName(id)
                        : (catalog.languages?.find((l) => l.id === id)?.name ?? id),
                    )
                    .join(", ")}.`
                : ""}{" "}
              {languageChoiceOptions.length > 0 && languageGrant.chooseCount > 0
                ? `Choose ${languageGrant.chooseCount} more.`
                : ""}
            </Text>
            {languageGrant.chooseCount > 0 && (
              <>
                <View style={styles.skillGrid}>
                  {languageChoiceOptions.map((lang) => {
                    const selected = selectedExtraLanguageIds.has(lang.id);
                    return (
                      <Pressable
                        key={lang.id}
                        onPress={() => toggleExtraLanguage(lang.id)}
                        style={[styles.skillCard, selected && styles.skillCardActive]}
                      >
                        <Text
                          style={[styles.skillCardText, selected && styles.skillCardTextActive]}
                        >
                          {lang.name}
                        </Text>
                        <Text style={[styles.skillCardSub, selected && styles.skillCardTextActive]}>
                          {lang.rare ? "Rare" : "Standard"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={styles.hint}>
                  {listedPickCount(selectedExtraLanguageIds)} / {languageGrant.chooseCount}{" "}
                  selected.
                </Text>
              </>
            )}
            <View style={styles.skillGrid}>
              {Array.from(selectedExtraLanguageIds)
                .filter(isCustomLanguageId)
                .map((id) => (
                  <Pressable
                    key={id}
                    onPress={() => toggleExtraLanguage(id)}
                    style={[styles.skillCard, styles.skillCardActive]}
                  >
                    <Text style={[styles.skillCardText, styles.skillCardTextActive]}>
                      {customLanguageName(id)}
                    </Text>
                    <Text style={[styles.skillCardSub, styles.skillCardTextActive]}>
                      Custom
                    </Text>
                  </Pressable>
                ))}
            </View>
            <TextInput
              style={styles.input}
              value={customLanguageText}
              onChangeText={setCustomLanguageText}
              onSubmitEditing={addCustomLanguage}
              placeholder="Custom language, e.g. Satyr"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="done"
            />
          </View>
        )}

        {step === "class" && (
          <View>
            <Text style={styles.title}>Choose a class</Text>
            {catalog.classes.map((klass) => (
              <View key={klass.id}>
                <ChoiceRow
                  label={klass.name}
                  sublabel={klass.summary}
                  selected={classId === klass.id}
                  onPress={() => selectClass(klass.id)}
                />
                {classId === klass.id && collapsedDetail !== `class:${klass.id}` && (
                  <View style={styles.detailPanel}>
                    <Text style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Hit Die: </Text>d{klass.hitDie}
                    </Text>
                    {klass.savingThrows && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Saving Throws: </Text>
                        {klass.savingThrows.map((a) => ABILITY_LABELS[a]).join(", ")}
                      </Text>
                    )}
                    {klass.spellcastingAbility && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Spellcasting: </Text>
                        {ABILITY_LABELS[klass.spellcastingAbility]}
                      </Text>
                    )}
                    {klass.skillChoices && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Skills: </Text>
                        Choose {klass.skillChoices.count} from{" "}
                        {klass.skillChoices.options
                          .map((id) => catalog.skills.find((s) => s.id === id)?.name ?? id)
                          .join(", ")}
                      </Text>
                    )}
                    {klass.armorProficiencies && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Armor: </Text>
                        {klass.armorProficiencies.length > 0
                          ? klass.armorProficiencies.join(", ")
                          : "None"}
                      </Text>
                    )}
                    {klass.weaponProficiencies && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Weapons: </Text>
                        {klass.weaponProficiencies.join(", ")}
                      </Text>
                    )}
                    {klass.startingEquipment && (
                      <Text style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Starting Equipment: </Text>
                        {describeKit(klass, EMPTY_SELECTION)}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
            <ChoiceRow
              label="Custom…"
              sublabel="Type your own class"
              selected={classId === CUSTOM_OPTION_ID}
              onPress={() => selectClass(CUSTOM_OPTION_ID)}
            />
            {classId === CUSTOM_OPTION_ID && (
              <TextInput
                style={styles.input}
                value={customClassName}
                onChangeText={previewChangeHandler("customClass", setCustomClassName)}
                placeholder="Class name"
                placeholderTextColor={theme.colors.textMuted}
                onFocus={() => showPreview("customClass", "Class name", customClassName)}
                onBlur={previewBlurHandler("customClass")}
              />
            )}
            {classId === CUSTOM_OPTION_ID && (
              <View style={styles.customBuilderSection}>
                <Text style={styles.customBuilderLabel}>Hit Die</Text>
                <View style={styles.skillGrid}>
                  {([6, 8, 10, 12] as const).map((die) => (
                    <Pressable
                      key={die}
                      onPress={() => setCustomClassHitDie(die)}
                      style={[
                        styles.skillCard,
                        customClassHitDie === die && styles.skillCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.skillCardText,
                          customClassHitDie === die && styles.skillCardTextActive,
                        ]}
                      >
                        d{die}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.customBuilderLabel}>
                  Saving Throw Proficiencies (choose {customClassSavingThrows.length}/2)
                </Text>
                <View style={styles.skillGrid}>
                  {ABILITY_KEYS.map((key) => {
                    const selected = customClassSavingThrows.includes(key);
                    return (
                      <Pressable
                        key={key}
                        onPress={() =>
                          setCustomClassSavingThrows((prev) => {
                            if (prev.includes(key)) return prev.filter((k) => k !== key);
                            if (prev.length >= 2) return prev;
                            return [...prev, key];
                          })
                        }
                        style={[styles.skillCard, selected && styles.skillCardActive]}
                      >
                        <Text
                          style={[styles.skillCardText, selected && styles.skillCardTextActive]}
                        >
                          {ABILITY_LABELS[key]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.customBuilderLabel}>Armor Proficiencies</Text>
                <TextInput
                  style={styles.input}
                  value={customClassArmorProficiencies}
                  onChangeText={setCustomClassArmorProficiencies}
                  placeholder="e.g. Light armor, Shields"
                  placeholderTextColor={theme.colors.textMuted}
                />

                <Text style={styles.customBuilderLabel}>Weapon Proficiencies</Text>
                <TextInput
                  style={styles.input}
                  value={customClassWeaponProficiencies}
                  onChangeText={setCustomClassWeaponProficiencies}
                  placeholder="e.g. Simple weapons, Shortswords"
                  placeholderTextColor={theme.colors.textMuted}
                />

                <Text style={styles.customBuilderLabel}>Traits</Text>
                {customClassTraits.map((trait, i) => (
                  <View key={`${trait.name}-${i}`} style={styles.traitRow}>
                    <View style={styles.traitInfo}>
                      <Text style={styles.traitName}>{trait.name}</Text>
                      {trait.description.length > 0 && (
                        <Text style={styles.traitDescription}>{trait.description}</Text>
                      )}
                    </View>
                    <Pressable
                      onPress={() =>
                        setCustomClassTraits((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      <Text style={styles.traitRemove}>×</Text>
                    </Pressable>
                  </View>
                ))}
                <TextInput
                  style={styles.input}
                  value={newClassTraitName}
                  onChangeText={setNewClassTraitName}
                  placeholder="Trait name (e.g. Second Wind)"
                  placeholderTextColor={theme.colors.textMuted}
                />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={newClassTraitDescription}
                  onChangeText={setNewClassTraitDescription}
                  placeholder="What does it do?"
                  placeholderTextColor={theme.colors.textMuted}
                  multiline
                />
                <Pressable
                  style={[
                    styles.smallAddButton,
                    !newClassTraitName.trim() && styles.smallAddButtonDisabled,
                  ]}
                  disabled={!newClassTraitName.trim()}
                  onPress={() => {
                    setCustomClassTraits((prev) => [
                      ...prev,
                      {
                        name: newClassTraitName.trim(),
                        description: newClassTraitDescription.trim(),
                      },
                    ]);
                    setNewClassTraitName("");
                    setNewClassTraitDescription("");
                  }}
                >
                  <Text style={styles.smallAddButtonText}>Add Trait</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {step === "equipment" && selectedClass && classDefForEquipment && (
          <StartingEquipmentStep
            classDef={classDefForEquipment}
            catalog={catalog}
            dexterity={adjustedScores.dexterity}
            selection={equipmentSelection}
            onChange={setEquipmentSelection}
            customInputProps={(key, value, setValue) => ({
              onChangeText: previewChangeHandler(`weapon:${key}`, setValue),
              onFocus: () => showPreview(`weapon:${key}`, "Weapon name", value),
              onBlur: previewBlurHandler(`weapon:${key}`),
            })}
          />
        )}

        {step === "background" && (
          <View>
            <Text style={styles.title}>Background (optional)</Text>
            <TextInput
              style={styles.input}
              value={background}
              onChangeText={setBackground}
              placeholder="e.g. Acolyte…"
              placeholderTextColor={theme.colors.textMuted}
            />
            {catalog.backgroundAbilityBonus && (
              <View style={styles.customBuilderSection}>
                <Text style={styles.customBuilderLabel}>Background Ability Scores</Text>
                <Text style={styles.hint}>
                  2024 rules grant ability score increases from your background rather than your
                  species. Distribute {catalog.backgroundAbilityBonus.totalPoints} points across
                  your abilities ({catalog.backgroundAbilityBonus.maxPerAbility} max each) — e.g.
                  +2/+1 to two abilities, or +1/+1/+1 to three.
                </Text>
                <Text style={styles.hint}>
                  {Object.values(backgroundAbilityBonuses).reduce((a, b) => a + (b ?? 0), 0)} /{" "}
                  {catalog.backgroundAbilityBonus.totalPoints} points allocated
                </Text>
                {ABILITY_KEYS.map((key) => {
                  const value = backgroundAbilityBonuses[key] ?? 0;
                  const total = Object.values(backgroundAbilityBonuses).reduce(
                    (a, b) => a + (b ?? 0),
                    0,
                  );
                  const maxPerAbility = catalog.backgroundAbilityBonus!.maxPerAbility;
                  const totalPoints = catalog.backgroundAbilityBonus!.totalPoints;
                  return (
                    <View key={key} style={styles.stepperRow}>
                      <Text style={styles.stepperLabel}>{ABILITY_LABELS[key]}</Text>
                      <View style={styles.stepperControls}>
                        <Pressable
                          style={styles.stepperButton}
                          disabled={value <= 0}
                          onPress={() =>
                            setBackgroundAbilityBonuses((prev) => ({
                              ...prev,
                              [key]: Math.max(0, (prev[key] ?? 0) - 1),
                            }))
                          }
                        >
                          <Text style={styles.stepperButtonText}>−</Text>
                        </Pressable>
                        <Text style={styles.stepperValue}>{value > 0 ? `+${value}` : value}</Text>
                        <Pressable
                          style={styles.stepperButton}
                          disabled={value >= maxPerAbility || total >= totalPoints}
                          onPress={() =>
                            setBackgroundAbilityBonuses((prev) => ({
                              ...prev,
                              [key]: Math.min(maxPerAbility, (prev[key] ?? 0) + 1),
                            }))
                          }
                        >
                          <Text style={styles.stepperButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {step === "alignment" && (
          <View>
            <Text style={styles.title}>Alignment (optional)</Text>
            <Text style={styles.hint}>
              A rough compass for how your character approaches morality and order.
            </Text>
            {ALIGNMENTS.map((option) => (
              <ChoiceRow
                key={option}
                label={option}
                sublabel=""
                selected={alignment === option}
                onPress={() => setAlignment(alignment === option ? null : option)}
              />
            ))}
          </View>
        )}

        {step === "personality" && (
          <View>
            <Text style={styles.title}>Personality (optional)</Text>
            <Text style={styles.hint}>
              The four roleplay prompts from the standard character sheet.
            </Text>
            <Text style={styles.fieldLabel}>Personality Traits</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={personalityTraits}
              onChangeText={setPersonalityTraits}
              placeholder="How does your character act, speak, or see the world?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
            <Text style={styles.fieldLabel}>Ideals</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={ideals}
              onChangeText={setIdeals}
              placeholder="What principles does your character believe in?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
            <Text style={styles.fieldLabel}>Bonds</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={bonds}
              onChangeText={setBonds}
              placeholder="Who or what is your character tied to?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
            <Text style={styles.fieldLabel}>Flaws</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={flaws}
              onChangeText={setFlaws}
              placeholder="What weakness or vice might get your character in trouble?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
          </View>
        )}

        {step === "proficiencies" && (
          <View>
            <Text style={styles.title}>Proficiencies &amp; Traits (optional)</Text>
            <Text style={styles.hint}>
              Anything else from the sheet that doesn&apos;t fit elsewhere — tool proficiencies
              {catalog.languages ? "" : ", languages you speak"}
              {selectedRace?.traits ? "" : ", racial traits"}, or your background feature.
              {selectedRace?.traits
                ? " Your race's traits are tracked automatically and show up on the sheet."
                : ""}
            </Text>
            <Text style={styles.fieldLabel}>
              {catalog.languages ? "Other Proficiencies" : "Other Proficiencies & Languages"}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={otherProficiencies}
              onChangeText={setOtherProficiencies}
              placeholder={
                catalog.languages ? "e.g. Thieves' tools" : "e.g. Thieves' tools, Common, Elvish…"
              }
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
            <Text style={styles.fieldLabel}>
              {selectedRace?.traits ? "Background Feature & Other Traits" : "Features & Traits"}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={featuresAndTraits}
              onChangeText={setFeaturesAndTraits}
              placeholder={
                selectedRace?.traits
                  ? "e.g. Shelter of the Faithful…"
                  : "e.g. Darkvision, Lucky, Shelter of the Faithful…"
              }
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />
          </View>
        )}

        {step === "level" && (
          <View>
            <Text style={styles.title}>Starting level</Text>
            <Text style={styles.hint}>
              Level 1 is a brand-new adventurer. Pick a higher level to bring in an existing
              character — the steps ahead will also cover everything gained along the way: hit
              points for each level, ability score improvements or feats, spell slots, and any
              subclass.
            </Text>
            <View style={styles.skillGrid}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <Pressable
                  key={n}
                  onPress={() => selectLevel(n)}
                  style={[styles.skillCard, levelNum === n && styles.skillCardActive]}
                >
                  <Text style={[styles.skillCardText, levelNum === n && styles.skillCardTextActive]}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>
            {subclassProgression?.subclassLevel !== undefined &&
              (subclassProgression.subclasses?.length ?? 0) > 0 &&
              levelNum < subclassProgression.subclassLevel && (
                <Text style={styles.hint}>
                  A {classNameValue} chooses their {subclassProgression.subclassLabel ?? "subclass"}{" "}
                  at level {subclassProgression.subclassLevel}, so you won&apos;t be asked for one
                  at level {levelNum}. Start at level {subclassProgression.subclassLevel} or higher
                  to pick it now, or choose it when you level up.
                </Text>
              )}
          </View>
        )}

        {step === "subclass" && subclassProgression && (
          <View>
            <Text style={styles.title}>{subclassProgression.subclassLabel ?? "Subclass"}</Text>
            <Text style={styles.hint}>
              A level {levelNum} {classNameValue} has already chosen one. Pick yours, type your own,
              or leave it for later — you can change it any time from Edit.
            </Text>
            <SubclassPicker
              progression={subclassProgression}
              value={subclass}
              onChange={setSubclass}
            />
          </View>
        )}

        {step === "experience" && (
          <View>
            <Text style={styles.title}>Track Experience Points?</Text>
            <Text style={styles.hint}>
              Some tables track XP from quests and monsters to determine when you level up; others
              just have the DM call for a level-up at a good story moment (&quot;milestone&quot;
              leveling). Either is fine — this only changes what shows up on this character&apos;s
              sheet.
            </Text>
            <View style={styles.advantageRow}>
              {([true, false] as const).map((value) => (
                <Pressable
                  key={String(value)}
                  style={[styles.advantageButton, usesXp === value && styles.advantageButtonActive]}
                  onPress={() => setUsesXp(value)}
                >
                  <Text
                    style={[styles.advantageText, usesXp === value && styles.advantageTextActive]}
                  >
                    {value ? "Yes, track XP" : "No, milestone leveling"}
                  </Text>
                </Pressable>
              ))}
            </View>
            {usesXp === true && (
              <Text style={styles.hint}>
                Starting at {xpThresholdForLevel(ruleset, levelNum)} XP (the minimum for level{" "}
                {levelNum}).
              </Text>
            )}
          </View>
        )}

        {step === "abilities" && (
          <View>
            <Text style={styles.title}>Assign ability scores</Text>
            {suggestedAbilities.length > 0 && (
              <Text style={[styles.hint, { marginBottom: 8 }]}>
                Tip: a {classNameValue} leans on{" "}
                {suggestedAbilities.map((k) => ABILITY_LABELS[k]).join(" and ")} (its{" "}
                {selectedClass?.spellcastingAbility
                  ? "spellcasting ability and saving throws"
                  : "saving throws"}
                ), so consider putting your higher scores there.
              </Text>
            )}
            <View style={styles.advantageRow}>
              {(["standard", "roll"] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[
                    styles.advantageButton,
                    abilityMethod === method && styles.advantageButtonActive,
                  ]}
                  onPress={() => selectAbilityMethod(method)}
                >
                  <Text
                    style={[
                      styles.advantageText,
                      abilityMethod === method && styles.advantageTextActive,
                    ]}
                  >
                    {method === "standard" ? "Standard Array" : "Roll (4d6 drop lowest)"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {abilityMethod === "standard" ? (
              <>
                <Text style={styles.hint}>
                  Place each of {STANDARD_ARRAY.join(", ")} on an ability score.
                </Text>
                {ABILITY_KEYS.map((key) => {
                  const bonus = totalBonusFor(key);
                  return (
                    <View key={key} style={styles.abilityRow}>
                      <Text style={styles.abilityRowLabel}>{ABILITY_LABELS[key]}</Text>
                      {bonus !== 0 && (
                        <Text style={styles.rollAbilityDetail}>
                          {bonus > 0 ? `+${bonus}` : bonus} racial/background bonus
                          {assignments[key] !== undefined ? ` → ${assignments[key]! + bonus}` : ""}
                        </Text>
                      )}
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
                  );
                })}
              </>
            ) : (
              <>
                <Text style={styles.hint}>
                  Roll each ability independently — 4d6, dropping the lowest die. Reroll any of them
                  as many times as you like.
                </Text>
                {ABILITY_KEYS.map((key) => {
                  const detail = rolledDetails[key];
                  const score = assignments[key];
                  const bonus = totalBonusFor(key);
                  return (
                    <View key={key} style={styles.rollAbilityRow}>
                      <Text style={styles.abilityRowLabel}>{ABILITY_LABELS[key]}</Text>
                      <View style={styles.rollAbilityResult}>
                        {bonus !== 0 && (
                          <Text style={styles.rollAbilityDetail}>
                            {bonus > 0 ? `+${bonus}` : bonus} racial/background
                            {score !== undefined ? ` → ${score + bonus}` : ""}
                          </Text>
                        )}
                        {score !== undefined && detail ? (
                          <Text style={styles.rollAbilityDetail}>
                            {detail.dice.join(", ")} (dropped {detail.dropped})
                          </Text>
                        ) : (
                          <Text style={styles.rollAbilityDetail}>Not rolled yet</Text>
                        )}
                      </View>
                      <Text style={styles.rollAbilityScore}>{score ?? "—"}</Text>
                      <Pressable
                        style={styles.rollAbilityButton}
                        onPress={() => rollAbilityScore(key)}
                      >
                        <Text style={styles.rollAbilityButtonText}>
                          {score !== undefined ? "Reroll" : "Roll"}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </>
            )}

            {selectedRace?.chooseAbilityBonus && raceId !== CUSTOM_OPTION_ID && (
              <View style={styles.bonusSection}>
                <Text style={styles.hint}>
                  Choose {selectedRace.chooseAbilityBonus.count} abilities to gain +
                  {selectedRace.chooseAbilityBonus.amount} from your race.
                </Text>
                <View style={styles.bonusRow}>
                  {ABILITY_KEYS.filter(
                    (key) => !selectedRace.chooseAbilityBonus?.excluding?.includes(key),
                  ).map((key) => {
                    const chosen = chosenBonusAbilities.includes(key);
                    return (
                      <Pressable
                        key={key}
                        onPress={() => toggleBonusAbility(key)}
                        style={[styles.bonusChip, chosen && styles.bonusChipActive]}
                      >
                        <Text style={[styles.bonusChipText, chosen && styles.bonusChipTextActive]}>
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

        {step === "asi" && (
          <View>
            <Text style={styles.title}>Ability Score Improvements</Text>
            <Text style={styles.hint}>
              A level {levelNum} {classNameValue} has earned {asiLevels.length} of these. At each
              one, raise your ability scores (max 20) or take a feat.
              {isCustomClass
                ? " Homebrew classes use the standard 5e levels as a guess — skip any your class doesn't have."
                : ""}
            </Text>
            {asiLevels.map((lvl) => {
              const choice = asiChoices[lvl];
              return (
                <View key={lvl} style={styles.customBuilderSection}>
                  <Text style={styles.customBuilderLabel}>Level {lvl}</Text>
                  <View style={styles.advantageRow}>
                    {(["ability", "feat"] as const).map((kind) => (
                      <Pressable
                        key={kind}
                        style={[
                          styles.advantageButton,
                          choice?.kind === kind && styles.advantageButtonActive,
                        ]}
                        onPress={() => setAsiKind(lvl, kind)}
                      >
                        <Text
                          style={[
                            styles.advantageText,
                            choice?.kind === kind && styles.advantageTextActive,
                          ]}
                        >
                          {kind === "ability" ? "Ability Scores" : "Take a Feat"}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {choice?.kind === "ability" && (
                    <>
                      <View style={styles.advantageRow}>
                        {(["one", "two"] as const).map((mode) => (
                          <Pressable
                            key={mode}
                            style={[
                              styles.advantageButton,
                              choice.mode === mode && styles.advantageButtonActive,
                            ]}
                            onPress={() => setAsiMode(lvl, mode)}
                          >
                            <Text
                              style={[
                                styles.advantageText,
                                choice.mode === mode && styles.advantageTextActive,
                              ]}
                            >
                              {mode === "one" ? "+2 to one" : "+1 to two"}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                      <View style={styles.bonusRow}>
                        {ABILITY_KEYS.map((key) => {
                          const chosen = choice.abilities.includes(key);
                          return (
                            <Pressable
                              key={key}
                              onPress={() => toggleAsiAbility(lvl, key)}
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
                    </>
                  )}

                  {choice?.kind === "feat" && (
                    <>
                      {choice.feat && (
                        <View style={styles.traitRow}>
                          <View style={styles.traitInfo}>
                            <Text style={styles.traitName}>{choice.feat.name}</Text>
                            {choice.feat.effects.map((effect, idx) => (
                              <Text key={idx} style={styles.traitDescription}>
                                {describeFeatEffect(effect, ruleset)}
                              </Text>
                            ))}
                          </View>
                        </View>
                      )}
                      <Pressable style={styles.smallAddButton} onPress={() => setFeatPickerLevel(lvl)}>
                        <Text style={styles.smallAddButtonText}>
                          {choice.feat ? "Change Feat" : "Browse Feat Catalog"}
                        </Text>
                      </Pressable>
                    </>
                  )}
                </View>
              );
            })}
            <FeatPickerModal
              visible={featPickerLevel !== null}
              character={{ ruleset, ...adjustedScores }}
              onClose={() => setFeatPickerLevel(null)}
              onPick={(feat) => {
                const lvl = featPickerLevel;
                setFeatPickerLevel(null);
                if (lvl === null) return;
                setAsiChoices((prev) => ({ ...prev, [lvl]: { kind: "feat", feat } }));
              }}
            />
          </View>
        )}

        {step === "hp" && selectedClass && (
          <View>
            <Text style={styles.title}>Hit points</Text>
            <Text style={styles.hint}>
              Level 1 gives the maximum of your d{selectedClass.hitDie} plus Constitution. For each
              of the {levelNum - 1} levels after that, take the average or roll the die.
            </Text>
            <View style={styles.advantageRow}>
              {(["average", "roll"] as const).map((method) => (
                <Pressable
                  key={method}
                  style={[styles.advantageButton, hpMethod === method && styles.advantageButtonActive]}
                  onPress={() => selectHpMethod(method)}
                >
                  <Text
                    style={[styles.advantageText, hpMethod === method && styles.advantageTextActive]}
                  >
                    {method === "average" ? "Take Average" : "Roll Hit Dice"}
                  </Text>
                </Pressable>
              ))}
            </View>
            {hpRollsValid && (
              <View style={styles.customBuilderSection}>
                {hpRolls.map((roll, i) => {
                  const gained =
                    Math.max(1, roll + abilityModifier(adjustedScores.constitution)) + racialHpBonus;
                  return (
                    <View key={i} style={styles.stepperRow}>
                      <Text style={styles.stepperLabel}>
                        Level {i + 2}: rolled {roll} → +{gained}
                      </Text>
                      <Pressable style={styles.rollAbilityButton} onPress={() => rerollHpLevel(i)}>
                        <Text style={styles.rollAbilityButtonText}>Reroll</Text>
                      </Pressable>
                    </View>
                  );
                })}
                <Pressable style={styles.smallAddButton} onPress={rollAllHp}>
                  <Text style={styles.smallAddButtonText}>Reroll All</Text>
                </Pressable>
              </View>
            )}
            <Text style={styles.hint}>
              Max HP: {derivedMaxHp} (Constitution {adjustedScores.constitution}, modifier{" "}
              {abilityModifier(adjustedScores.constitution) >= 0 ? "+" : ""}
              {abilityModifier(adjustedScores.constitution)} per level).
            </Text>
          </View>
        )}

        {step === "features" && (
          <View>
            <Text style={styles.title}>Class features</Text>
            <Text style={styles.hint}>
              This is a homebrew class, so there&apos;s no catalog of what it gains. Add the
              features it has earned by level {levelNum} (optional) — they&apos;re saved to the
              sheet&apos;s Features &amp; Traits.
            </Text>
            {homebrewFeatures.map((feature, i) => (
              <View key={`${feature.name}-${i}`} style={styles.traitRow}>
                <View style={styles.traitInfo}>
                  <Text style={styles.traitName}>
                    Level {feature.level}: {feature.name}
                  </Text>
                  {feature.description.length > 0 && (
                    <Text style={styles.traitDescription}>{feature.description}</Text>
                  )}
                </View>
                <Pressable onPress={() => setHomebrewFeatures((prev) => prev.filter((_, idx) => idx !== i))}>
                  <Text style={styles.traitRemove}>×</Text>
                </Pressable>
              </View>
            ))}
            <Text style={styles.customBuilderLabel}>Gained at level</Text>
            <View style={styles.skillGrid}>
              {Array.from({ length: levelNum - 1 }, (_, i) => i + 2).map((n) => {
                const active = Math.min(newFeatureLevel, levelNum) === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => setNewFeatureLevel(n)}
                    style={[styles.skillCard, active && styles.skillCardActive]}
                  >
                    <Text style={[styles.skillCardText, active && styles.skillCardTextActive]}>
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              style={styles.input}
              value={newFeatureName}
              onChangeText={setNewFeatureName}
              placeholder="Feature name"
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
              style={[styles.smallAddButton, !newFeatureName.trim() && styles.smallAddButtonDisabled]}
              disabled={!newFeatureName.trim()}
              onPress={() => {
                setHomebrewFeatures((prev) => [
                  ...prev,
                  {
                    level: Math.min(newFeatureLevel, levelNum),
                    name: newFeatureName.trim(),
                    description: newFeatureDescription.trim(),
                  },
                ]);
                setNewFeatureName("");
                setNewFeatureDescription("");
              }}
            >
              <Text style={styles.smallAddButtonText}>Add Feature</Text>
            </Pressable>
          </View>
        )}

        {step === "skills" && (
          <View>
            <Text style={styles.title}>Skill Proficiencies</Text>
            <Text style={styles.hint}>
              Choose {skillChoiceSpec.count} skills this character is proficient in — you
              aren&apos;t limited to your class&apos;s usual list, so pick whatever fits your
              character.{" "}
              {groupedSkillOptions.classSkills.length > 0
                ? `${selectedClass?.name}'s usual skills are grouped first for reference.`
                : ""}{" "}
              Background-granted skills aren&apos;t tracked separately yet, so include those here
              too if you know them.
            </Text>
            {groupedSkillOptions.classSkills.length > 0 && (
              <>
                <Text style={styles.equipmentGroupLabel}>{selectedClass?.name}&apos;s Skills</Text>
                <View style={styles.skillGrid}>
                  {groupedSkillOptions.classSkills.map((skill) => {
                    const selected = selectedSkillIds.has(skill.id);
                    return (
                      <Pressable
                        key={skill.id}
                        onPress={() => toggleSkillSelection(skill.id)}
                        style={[styles.skillCard, selected && styles.skillCardActive]}
                      >
                        <Text
                          style={[styles.skillCardText, selected && styles.skillCardTextActive]}
                        >
                          {skill.name}
                        </Text>
                        <Text style={[styles.skillCardSub, selected && styles.skillCardTextActive]}>
                          {ABILITY_LABELS[skill.ability]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
            <Text style={styles.equipmentGroupLabel}>
              {groupedSkillOptions.classSkills.length > 0 ? "Other Skills" : "Skills"}
            </Text>
            <View style={styles.skillGrid}>
              {groupedSkillOptions.otherSkills.map((skill) => {
                const selected = selectedSkillIds.has(skill.id);
                return (
                  <Pressable
                    key={skill.id}
                    onPress={() => toggleSkillSelection(skill.id)}
                    style={[styles.skillCard, selected && styles.skillCardActive]}
                  >
                    <Text style={[styles.skillCardText, selected && styles.skillCardTextActive]}>
                      {skill.name}
                    </Text>
                    <Text style={[styles.skillCardSub, selected && styles.skillCardTextActive]}>
                      {ABILITY_LABELS[skill.ability]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.hint}>
              {selectedSkillIds.size} / {skillChoiceSpec.count} selected.
            </Text>
          </View>
        )}

        {step === "spells" && selectedClass && (
          <View>
            <Text style={styles.title}>Starting Spells</Text>
            <Text style={styles.hint}>
              Shows spells up to level {maxOnboardingSpellLevel} (an approximation of what a level{" "}
              {levelNum} {selectedClass.name} can access — not exact slot-by-slot scaling). Tap a
              spell to pick it; tap the ⓘ to read what it does.
            </Text>
            {spellLimits && (
              <View style={styles.spellLimitRow}>
                {spellLimits.cantrips > 0 && (
                  <Text style={styles.spellLimitText}>
                    Cantrips:{" "}
                    {selectedSpellIds.size > 0
                      ? spellCatalogResults.filter(
                          (s) => selectedSpellIds.has(s.id) && s.level === 0,
                        ).length
                      : 0}{" "}
                    / {spellLimits.cantrips}
                  </Text>
                )}
                <Text style={styles.spellLimitText}>
                  {spellLimits.mode === "prepared" ? "Prepared" : "Known"} spells:{" "}
                  {
                    spellCatalogResults.filter((s) => selectedSpellIds.has(s.id) && s.level > 0)
                      .length
                  }{" "}
                  / {spellLimits.spells}
                </Text>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={spellSearch}
                onChangeText={(text) => {
                  setSpellSearch(text);
                  setSpellResultLimit(SPELL_RESULT_PAGE_SIZE);
                }}
                placeholder="Search spells…"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.spellClassFilterChip}
                onPress={() => {
                  setOnlySpellClass((v) => !v);
                  setSpellResultLimit(SPELL_RESULT_PAGE_SIZE);
                }}
              >
                <Text style={styles.spellClassFilterChipText}>
                  {onlySpellClass ? selectedClass.name : "All classes"}
                </Text>
              </Pressable>
            </View>
            {spellCatalogResults.slice(0, spellResultLimit).map((spell) => {
              const selected = selectedSpellIds.has(spell.id);
              const expanded = expandedSpellIds.has(spell.id);
              const icon = iconsEnabled ? getSpellSchoolIcon(iconStyle, spell.school) : undefined;
              return (
                <Pressable
                  key={spell.id}
                  style={[
                    styles.choiceRow,
                    styles.spellChoiceRow,
                    selected && styles.choiceRowActive,
                  ]}
                  onPress={() => toggleSpellSelection(spell)}
                >
                  {icon && (
                    <Image source={icon} style={styles.spellChoiceIcon} resizeMode="contain" />
                  )}
                  <View style={styles.spellChoiceText}>
                    <View style={styles.spellChoiceHeaderRow}>
                      <Text style={styles.choiceRowLabel}>{spell.name}</Text>
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleSpellExpanded(spell.id);
                        }}
                      >
                        <Text style={styles.spellInfoToggle}>{expanded ? "▲" : "ⓘ"}</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.choiceRowSub}>
                      {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} · {spell.school}
                    </Text>
                    {expanded && <Text style={styles.spellDescription}>{spell.description}</Text>}
                  </View>
                </Pressable>
              );
            })}
            {spellResultLimit < spellCatalogResults.length && (
              <Pressable
                style={styles.showMoreButton}
                onPress={() => setSpellResultLimit((n) => n + SPELL_RESULT_PAGE_SIZE)}
              >
                <Text style={styles.showMoreButtonText}>
                  Show more ({spellCatalogResults.length - spellResultLimit} remaining)
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {step === "review" && (
          <View>
            <Text style={styles.title}>Review</Text>
            <Text style={styles.reviewName}>{name}</Text>
            <Text style={styles.reviewSub}>
              {catalog.label} · {raceNameValue} · {classNameValue} · Level {levelNum}
              {background.trim() ? ` · ${background.trim()}` : ""}
              {alignment ? ` · ${alignment}` : ""}
              {offersSubclass && subclass.trim()
                ? ` · ${subclassProgression?.subclasses?.find((s) => s.id === subclass)?.name ?? subclass.trim()}`
                : ""}
              {selectedSpellIds.size > 0 ? ` · ${selectedSpellIds.size} spells` : ""}
            </Text>
            {selectedSkillIds.size > 0 && (
              <Text style={styles.reviewSub}>
                Proficient:{" "}
                {Array.from(selectedSkillIds)
                  .map((id) => catalog.skills.find((s) => s.id === id)?.name ?? id)
                  .join(", ")}
              </Text>
            )}
            {asiLevels.some((lvl) => {
              const c = asiChoices[lvl];
              return c?.kind === "feat" && c.feat;
            }) && (
              <Text style={styles.reviewSub}>
                Feats:{" "}
                {asiLevels
                  .map((lvl) => asiChoices[lvl])
                  .flatMap((c) => (c?.kind === "feat" && c.feat ? [c.feat.name] : []))
                  .join(", ")}
              </Text>
            )}
            {equipmentSummaryText() !== "" && (
              <Text style={styles.reviewSub}>{equipmentSummaryText()}</Text>
            )}
            {catalog.languages &&
              languageGrant.granted.length + selectedExtraLanguageIds.size > 0 && (
                <Text style={styles.reviewSub}>
                  Languages:{" "}
                  {[...languageGrant.granted, ...Array.from(selectedExtraLanguageIds)]
                    .map((id) =>
                      isCustomLanguageId(id)
                        ? customLanguageName(id)
                        : (catalog.languages?.find((l) => l.id === id)?.name ?? id),
                    )
                    .join(", ")}
                </Text>
              )}
            <Text style={styles.reviewSub}>
              {usesXp
                ? `Tracking XP (starting at ${xpThresholdForLevel(ruleset, levelNum)})`
                : "Milestone leveling (no XP tracked)"}
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
                  <Text style={styles.abilityCardScore}>{adjustedScores[key]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      <DoneAccessory id="done-new" />

      <View style={styles.navRow}>
        <Pressable style={styles.navButtonSecondary} onPress={goBack}>
          <Text style={styles.navButtonSecondaryText}>{stepIndex === 0 ? "Cancel" : "Back"}</Text>
        </Pressable>
        {step === "review" ? (
          <Pressable
            style={[styles.navButtonPrimary, creating && styles.navButtonDisabled]}
            disabled={creating}
            onPress={handleCreate}
          >
            <Text style={styles.navButtonPrimaryText}>
              {creating ? "Creating..." : "Create Character"}
            </Text>
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
      <CreatingOverlay visible={creating} />
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
    <Pressable style={[styles.choiceRow, selected && styles.choiceRowActive]} onPress={onPress}>
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
    container: { flex: 1, backgroundColor: theme.screenBackground },
    stepCounter: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 12,
    },
    body: { flex: 1 },
    bodyContent: { padding: 16 },
    livePreviewBanner: {
      marginHorizontal: 16,
      marginTop: 10,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    livePreviewLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    livePreviewValue: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    title: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 16,
      fontFamily: theme.displayFontFamily,
    },
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
    multilineInput: {
      minHeight: 70,
      textAlignVertical: "top",
      marginBottom: 12,
    },
    fieldLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
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
    choiceRowLabel: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    choiceRowSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
    spellChoiceRow: { flexDirection: "row", alignItems: "center" },
    spellChoiceIcon: { width: 28, height: 28, marginRight: 10 },
    spellChoiceText: { flex: 1 },
    spellChoiceHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    spellInfoToggle: {
      color: theme.colors.accent,
      fontSize: 14,
      paddingLeft: 8,
    },
    spellDescription: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 6,
    },
    spellLimitRow: { flexDirection: "row", gap: 14, marginBottom: 10 },
    spellLimitText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    inputRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
    spellClassFilterChip: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      justifyContent: "center",
    },
    spellClassFilterChipText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    showMoreButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 8,
    },
    showMoreButtonText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    abilityRow: { marginBottom: 16 },
    abilityRowLabel: {
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
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
    advantageRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
    advantageButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    advantageButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    advantageText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    advantageTextActive: { color: theme.colors.primaryText },
    rollAbilityRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 8,
      gap: 8,
    },
    rollAbilityResult: { flex: 1 },
    rollAbilityDetail: { color: theme.colors.textMuted, fontSize: 11 },
    rollAbilityScore: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 18,
      minWidth: 28,
      textAlign: "center",
    },
    rollAbilityButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    rollAbilityButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
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
    bonusChipText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    bonusChipTextActive: { color: theme.colors.primaryText },
    detailPanel: {
      marginTop: 4,
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      gap: 6,
    },
    detailRow: { color: theme.colors.text, fontSize: 13, lineHeight: 18 },
    detailLabel: { fontWeight: "700", color: theme.colors.textMuted },
    equipmentGroupLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    skillGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
    skillCard: {
      width: "31%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
    },
    skillCardActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    skillCardText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      textAlign: "center",
    },
    skillCardSub: { color: theme.colors.textMuted, fontSize: 10, marginTop: 2 },
    skillCardTextActive: { color: theme.colors.primaryText },
    reviewName: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    reviewSub: {
      color: theme.colors.textMuted,
      marginTop: 4,
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap",
    },
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
    abilityCardLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
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
    navButtonPrimaryText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    navButtonSecondary: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    navButtonSecondaryText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    customBuilderSection: { marginTop: 16 },
    customBuilderLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
      marginTop: 4,
      fontFamily: theme.displayFontFamily,
    },
    stepperRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 6,
    },
    stepperLabel: {
      color: theme.colors.text,
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    stepperControls: { flexDirection: "row", alignItems: "center", gap: 10 },
    stepperButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    stepperButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
    },
    stepperValue: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      minWidth: 28,
      textAlign: "center",
      fontFamily: theme.displayFontFamily,
    },
    smallAddButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 10,
      alignItems: "center",
      marginTop: 4,
      marginBottom: 12,
    },
    smallAddButtonDisabled: { opacity: 0.4 },
    smallAddButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    traitRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 8,
    },
    traitInfo: { flex: 1, paddingRight: 8 },
    traitName: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    traitDescription: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    traitRemove: {
      color: theme.colors.accent,
      fontSize: 16,
      paddingHorizontal: 4,
    },
  });
}
