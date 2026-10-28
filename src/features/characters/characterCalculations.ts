import {
  CUSTOM_CLASS_FALLBACK,
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  getRulesetCatalog,
} from "../../data/rulesets";
import type {
  ClassDefinition,
  ClassFeature,
  ClassProgression,
  ClassTrait,
  RaceDefinition,
  RaceTrait,
  SkillDefinition,
  SpellSlotRow,
  Subclass,
} from "../../data/rulesets/types";
import type { AbilityScoreKey, Character } from "../../types/models";
import { rollDie } from "../dice/diceEngine";

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export const ABILITY_LABELS: Record<AbilityScoreKey, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

export function proficiencyBonusForLevel(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

/**
 * 5e fixed/average HP: max hit die + CON mod at level 1, then
 * (floor(hitDie / 2) + 1) + CON mod per level after that.
 */
export function calculateMaxHp(
  hitDie: number,
  level: number,
  conModifier: number
): number {
  const perLevelAverage = Math.floor(hitDie / 2) + 1;
  const firstLevel = hitDie + conModifier;
  const laterLevels = (level - 1) * (perLevelAverage + conModifier);
  return Math.max(level, firstLevel + laterLevels);
}

/** HP gained for one level: average (`floor(hitDie/2)+1`) + CON mod, minimum 1. */
export function averageHpGain(hitDie: number, conModifier: number): number {
  return Math.max(1, Math.floor(hitDie / 2) + 1 + conModifier);
}

/** HP gained for one level by rolling the class's hit die, + CON mod, minimum 1. */
export function rollHpGain(hitDie: number, conModifier: number): { roll: number; total: number } {
  const roll = rollDie(hitDie);
  return { roll, total: Math.max(1, roll + conModifier) };
}

export function armorClassBaseline(dexterityScore: number): number {
  return 10 + abilityModifier(dexterityScore);
}

/**
 * A mechanical benefit a feat (catalog or homebrew) grants -- always fully
 * resolved (any player choice, like which ability or which skills, already
 * baked in), stored as JSON on a `character_feats` row. `abilityScoreIncrease`
 * is special: it's applied once, immediately, directly to the character's
 * ability score column (see `featRepo.applyAbilityScoreIncrease`) rather than
 * contributing to `aggregateFeatEffects` below -- disabling the feat
 * afterward doesn't revert it, matching 5e's own permanent-increase rule.
 */
export type FeatEffect =
  | { kind: "abilityScoreIncrease"; ability: AbilityScoreKey; amount: number; max: number }
  | { kind: "skillProficiency"; skillIds: string[] }
  | { kind: "savingThrowProficiency"; ability: AbilityScoreKey }
  | { kind: "armorClassBonus"; amount: number }
  | { kind: "initiativeProficiencyBonus" }
  | { kind: "rangedAttackBonus"; amount: number }
  | { kind: "meleeAttackBonus"; amount: number };

/** A feat a character has taken -- catalog pick or homebrew, parsed from a `character_feats` row. */
export type CharacterFeat = {
  id: number;
  name: string;
  prerequisite: string;
  description: string;
  sourceName: string;
  enabled: boolean;
  effects: FeatEffect[];
};

/** A feat choice fully resolved (any player choice already baked into `effects`), ready to be written as a `character_feats` row -- shared shape between the sheet's own "+ Add Feat" flow and the Level Up ASI/feat step. */
export type ResolvedFeatPick = {
  /** Omitted for a homebrew/custom feat. */
  catalogFeatId?: number;
  name: string;
  prerequisite: string;
  description: string;
  sourceName: string;
  effects: FeatEffect[];
};

export function parseFeatEffects(json: string): FeatEffect[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as FeatEffect[]) : [];
  } catch {
    return [];
  }
}

export function serializeFeatEffects(effects: FeatEffect[]): string {
  return JSON.stringify(effects);
}

/** Short display label for one effect, e.g. "+1 Strength (already applied)" or "+2 Ranged attacks" -- used by `FeatsList` and the feat picker's confirmation step. */
export function describeFeatEffect(effect: FeatEffect, ruleset: string): string {
  switch (effect.kind) {
    case "abilityScoreIncrease":
      return `+${effect.amount} ${ABILITY_LABELS[effect.ability]} (already applied)`;
    case "skillProficiency": {
      const skills = getRulesetCatalog(ruleset).skills;
      const names = effect.skillIds.map((id) => skills.find((s) => s.id === id)?.name ?? id);
      return `Proficiency: ${names.join(", ")}`;
    }
    case "savingThrowProficiency":
      return `${ABILITY_LABELS[effect.ability]} save proficiency`;
    case "armorClassBonus":
      return `+${effect.amount} Armor Class`;
    case "initiativeProficiencyBonus":
      return "+Proficiency Bonus to Initiative";
    case "rangedAttackBonus":
      return `+${effect.amount} Ranged attack rolls`;
    case "meleeAttackBonus":
      return `+${effect.amount} Melee attack rolls`;
  }
}

export type FeatEffectBundle = {
  skillProficiencyIds: string[];
  savingThrowProficiencies: AbilityScoreKey[];
  armorClassBonus: number;
  hasInitiativeProficiencyBonus: boolean;
  rangedAttackBonus: number;
  meleeAttackBonus: number;
};

/**
 * Combines every *live* effect of a character's currently-enabled feats --
 * `abilityScoreIncrease` is deliberately excluded (see `FeatEffect` above,
 * it's a one-time permanent mutation applied when the feat was added, not a
 * standing bonus). Disabled feats contribute nothing.
 */
export function aggregateFeatEffects(feats: Pick<CharacterFeat, "enabled" | "effects">[]): FeatEffectBundle {
  const bundle: FeatEffectBundle = {
    skillProficiencyIds: [],
    savingThrowProficiencies: [],
    armorClassBonus: 0,
    hasInitiativeProficiencyBonus: false,
    rangedAttackBonus: 0,
    meleeAttackBonus: 0,
  };
  for (const feat of feats) {
    if (!feat.enabled) continue;
    for (const effect of feat.effects) {
      switch (effect.kind) {
        case "skillProficiency":
          bundle.skillProficiencyIds.push(...effect.skillIds);
          break;
        case "savingThrowProficiency":
          bundle.savingThrowProficiencies.push(effect.ability);
          break;
        case "armorClassBonus":
          bundle.armorClassBonus += effect.amount;
          break;
        case "initiativeProficiencyBonus":
          bundle.hasInitiativeProficiencyBonus = true;
          break;
        case "rangedAttackBonus":
          bundle.rangedAttackBonus += effect.amount;
          break;
        case "meleeAttackBonus":
          bundle.meleeAttackBonus += effect.amount;
          break;
        // abilityScoreIncrease: applied once at add-time, nothing to aggregate.
      }
    }
  }
  return bundle;
}

/** 5e/3.5e initiative: Dexterity modifier, plus proficiency bonus if an enabled feat (e.g. Alert) grants it. */
export function initiativeModifier(character: Character, feats: CharacterFeat[] = []): number {
  const bonus = aggregateFeatEffects(feats).hasInitiativeProficiencyBonus ? character.proficiencyBonus : 0;
  return abilityModifier(character.dexterity) + bonus;
}

export function applyRaceAbilityBonuses(
  baseScores: Record<AbilityScoreKey, number>,
  race: RaceDefinition,
  chosenBonusAbilities: AbilityScoreKey[] = []
): Record<AbilityScoreKey, number> {
  const result = { ...baseScores };

  for (const [key, bonus] of Object.entries(race.abilityBonuses) as [
    AbilityScoreKey,
    number,
  ][]) {
    result[key] += bonus;
  }

  if (race.chooseAbilityBonus) {
    for (const key of chosenBonusAbilities) {
      result[key] += race.chooseAbilityBonus.amount;
    }
  }

  return result;
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/** 5e's classic rolled-ability-score method: roll 4d6, drop the lowest die, sum the rest. */
export function roll4d6DropLowest(): { dice: number[]; dropped: number; total: number } {
  const dice = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  const sorted = [...dice].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted.slice(1).reduce((sum, v) => sum + v, 0);
  return { dice, dropped, total };
}

/**
 * Resolves a class name or catalog id (e.g. "Fighter" or "fighter") to its
 * `ClassDefinition` for a given ruleset -- lookups match on `name` first
 * (the common case, since onboarding stores the display name), falling back
 * to `id` for safety, and finally to the generic custom-class definition
 * (labelled with whatever was typed) if nothing in the ruleset catalog
 * matches at all. The character-scoped helpers below are thin wrappers
 * around this for the common "this character's (primary) class" case; a
 * multiclassed character's non-primary classes are resolved by calling this
 * directly with that `characterClasses` row's own `classId`/`className`.
 */
export function getClassDefinition(ruleset: string, classNameOrId: string): ClassDefinition {
  const catalog = getRulesetCatalog(ruleset);
  const needle = classNameOrId.trim().toLowerCase();
  const match = catalog.classes.find(
    (c) => c.name.toLowerCase() === needle || c.id.toLowerCase() === needle
  );
  if (match) return match;
  return { ...CUSTOM_CLASS_FALLBACK, name: classNameOrId || CUSTOM_CLASS_FALLBACK.name };
}

const ABILITY_SCORE_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

/** `customClassSavingThrows`/`customRaceAbilityBonuses` etc only ever carry data when `className`/`race` resolved to CUSTOM_CLASS_FALLBACK/CUSTOM_RACE_FALLBACK -- a character who picked a real catalog class/race has them at their column defaults and this type lets every call site (including a hand-built literal that predates a choice, like Edit's class-switch preview) omit them instead of needing the full row. */
type CustomClassOverlay = Partial<
  Pick<
    Character,
    | "customClassHitDie"
    | "customClassSavingThrows"
    | "customClassArmorProficiencies"
    | "customClassWeaponProficiencies"
  >
>;

/** Comma-separated free-text labels, same encoding as `skillProficiencies` -- used for a custom class's armor/weapon proficiency lists. */
export function parseCustomProficiencyList(value: string | undefined): string[] {
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

export function serializeCustomProficiencyList(values: string[]): string {
  return values.join(",");
}

export function parseCustomClassSavingThrows(value: string | undefined): AbilityScoreKey[] {
  if (!value) return [];
  return value.split(",").filter((key): key is AbilityScoreKey =>
    ABILITY_SCORE_KEYS.includes(key as AbilityScoreKey)
  );
}

export function serializeCustomClassSavingThrows(keys: AbilityScoreKey[]): string {
  return keys.join(",");
}

export function getClassDefinitionForCharacter(
  character: Pick<Character, "ruleset" | "className"> & CustomClassOverlay
): ClassDefinition {
  const base = getClassDefinition(character.ruleset, character.className);
  if (base.id !== CUSTOM_OPTION_ID) return base;

  const savingThrows = parseCustomClassSavingThrows(character.customClassSavingThrows);
  return {
    ...base,
    hitDie: (character.customClassHitDie as ClassDefinition["hitDie"]) || base.hitDie,
    savingThrows:
      savingThrows.length === 2 ? (savingThrows as [AbilityScoreKey, AbilityScoreKey]) : base.savingThrows,
    armorProficiencies: parseCustomProficiencyList(character.customClassArmorProficiencies),
    weaponProficiencies: parseCustomProficiencyList(character.customClassWeaponProficiencies),
  };
}

/**
 * Looks up the current ruleset's per-level/subclass progression data for a
 * class, if that ruleset/class has any registered yet (see
 * `RulesetCatalog.classProgressions` -- sparse while editions are still
 * being populated, so callers must handle `undefined`).
 */
export function getClassProgression(ruleset: string, classId: string): ClassProgression | undefined {
  return getRulesetCatalog(ruleset).classProgressions?.find((p) => p.classId === classId);
}

export function getClassProgressionForCharacter(character: Character): ClassProgression | undefined {
  return getClassProgression(character.ruleset, getClassDefinitionForCharacter(character).id);
}

export function findSubclass(progression: ClassProgression, subclassId: string): Subclass | undefined {
  return progression.subclasses?.find((s) => s.id === subclassId);
}

/** See `parseCustomRaceTraits` -- same JSON-array-of-{name,description} encoding, for a custom class's hand-entered traits. */
export function parseCustomClassTraits(json: string | undefined): ClassTrait[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is ClassTrait => !!t && typeof t.name === "string" && typeof t.description === "string"
    );
  } catch {
    return [];
  }
}

export function serializeCustomClassTraits(traits: ClassTrait[]): string {
  return JSON.stringify(traits);
}

/**
 * The character's class (+ chosen subclass) features gained so far, filtered
 * to `primaryClassLevel` -- the persistent, tap-to-view-description
 * counterpart to `racialTraitsForCharacter`, shown on the sheet rather than
 * only flashed once in the Level Up alert. `primaryClassLevel` is the
 * primary class's OWN level, not `character.level` once multiclassed (that
 * mirrors the SUM across every class -- see the `characterClasses` schema
 * comment), so callers pass `classRows[0]?.level ?? character.level`.
 *
 * A custom class has no catalog `ClassProgression` to look up, so its
 * player-entered `customClassTraits` are returned instead (see
 * `parseCustomClassTraits`), same free-text-fallback spirit as
 * `customRaceTraits`.
 */
export function classFeaturesForCharacter(
  character: Pick<Character, "ruleset" | "className" | "subclass" | "customClassTraits">,
  primaryClassLevel: number
): FeatureGrant[] {
  const classDef = getClassDefinition(character.ruleset, character.className);
  if (classDef.id === CUSTOM_OPTION_ID) {
    return parseCustomClassTraits(character.customClassTraits).map((t) => ({
      ...t,
      level: 1,
      source: "class" as const,
    }));
  }

  const progression = getClassProgression(character.ruleset, classDef.id);
  if (!progression) return [];

  const classFeatures: FeatureGrant[] = progression.features
    .filter((f) => f.level <= primaryClassLevel)
    .map((f) => ({ ...f, source: "class" as const }));

  const subclass = character.subclass ? findSubclass(progression, character.subclass) : undefined;
  const subclassFeatures: FeatureGrant[] = subclass
    ? subclass.features
        .filter((f) => f.level <= primaryClassLevel)
        .map((f) => ({ ...f, source: "subclass" as const }))
    : [];

  return [...classFeatures, ...subclassFeatures].sort((a, b) => a.level - b.level);
}

/** True when `newLevel` is this class's subclass-choice level and none has been picked yet. */
export function needsSubclassChoice(
  progression: ClassProgression,
  newLevel: number,
  currentSubclass: string
): boolean {
  return progression.subclassLevel === newLevel && !currentSubclass;
}

/**
 * True when `newLevel` grants an Ability Score Improvement / feat choice
 * (5e), or a 3.5e-style feat-only or pure ability-score-increase choice.
 * Ruleset-agnostic: it just checks whichever of these arrays the ruleset's
 * data actually populates.
 */
export function needsAsiOrFeatChoice(progression: ClassProgression, newLevel: number): boolean {
  return (
    (progression.asiLevels?.includes(newLevel) ?? false) ||
    (progression.featLevels?.includes(newLevel) ?? false) ||
    (progression.abilityScoreIncreaseLevels?.includes(newLevel) ?? false)
  );
}

export type FeatureGrant = ClassFeature & { source: "class" | "subclass" };

/**
 * All class + (if chosen) subclass features newly granted at `newLevel` --
 * what the Level Up workflow shows the player as "here's what you got".
 * Excludes the subclass-choice level's own placeholder entry (that's its
 * own step), but includes a chosen subclass's level-1-of-that-subclass
 * features (e.g. a Divine Domain's bonus features gained the moment it's
 * picked).
 */
export function featuresGainedAtLevel(
  progression: ClassProgression,
  newLevel: number,
  subclassId: string
): FeatureGrant[] {
  const classFeatures: FeatureGrant[] = progression.features
    .filter((f) => f.level === newLevel)
    .map((f) => ({ ...f, source: "class" as const }));

  const subclass = subclassId ? findSubclass(progression, subclassId) : undefined;
  const subclassFeatures: FeatureGrant[] = subclass
    ? subclass.features.filter((f) => f.level === newLevel).map((f) => ({ ...f, source: "subclass" as const }))
    : [];

  return [...classFeatures, ...subclassFeatures];
}

export function spellProgressionRowForLevel(
  progression: ClassProgression,
  level: number
): SpellSlotRow | undefined {
  return progression.spellProgression?.find((row) => row.level === level);
}

/** `character.feats` is stored as newline-separated freeform feat text. */
export function parseFeats(character: Character): string[] {
  return character.feats
    ? character.feats.split("\n").filter(Boolean)
    : [];
}

export function serializeFeats(feats: string[]): string {
  return feats.join("\n");
}

/** `character.skillProficiencies` is stored as a comma-separated list of skill ids. */
export function parseSkillProficiencies(character: Character): string[] {
  return character.skillProficiencies
    ? character.skillProficiencies.split(",").filter(Boolean)
    : [];
}

export function serializeSkillProficiencies(skillIds: string[]): string {
  return skillIds.join(",");
}

export function isSkillProficient(character: Character, skillId: string, feats: CharacterFeat[] = []): boolean {
  return (
    parseSkillProficiencies(character).includes(skillId) ||
    aggregateFeatEffects(feats).skillProficiencyIds.includes(skillId)
  );
}

/**
 * `character.savingThrowProficiencies` stores EXTRA saving-throw
 * proficiencies beyond the two a class grants automatically -- e.g. the
 * Resilient feat, or a future multiclass rule. Comma-separated
 * AbilityScoreKey ids, unioned with the class's fixed list rather than
 * replacing it (a class's own two saves are never a player choice).
 */
export function parseSavingThrowProficiencies(character: Character): AbilityScoreKey[] {
  return character.savingThrowProficiencies
    ? (character.savingThrowProficiencies.split(",").filter(Boolean) as AbilityScoreKey[])
    : [];
}

export function serializeSavingThrowProficiencies(abilities: AbilityScoreKey[]): string {
  return abilities.join(",");
}

/**
 * A homebrew class has no `ClassProgression` (see `ClassDefinition`/
 * `RulesetCatalog.classProgressions`), so there's no catalog to list what it
 * gains at a given level -- the player types it in themselves on the Level
 * Up workflow's homebrew-features step instead. Appended into the existing
 * freeform `featuresAndTraits` box (the same "racial traits, background
 * feature, and anything else not already covered by the structured
 * class-progression features" catch-all the schema comment describes) rather
 * than a new structured per-level table, same free-text-fallback spirit as
 * every other homebrew/custom field in this app.
 */
export function appendHomebrewFeatures(
  existingFeaturesAndTraits: string,
  level: number,
  features: { name: string; description: string }[]
): string {
  if (features.length === 0) return existingFeaturesAndTraits;
  const block = features
    .map((f) => (f.description ? `Level ${level}: ${f.name} -- ${f.description}` : `Level ${level}: ${f.name}`))
    .join("\n");
  return existingFeaturesAndTraits ? `${existingFeaturesAndTraits}\n${block}` : block;
}

export function isSavingThrowProficient(
  character: Character,
  ability: AbilityScoreKey,
  feats: CharacterFeat[] = []
): boolean {
  const classDef = getClassDefinitionForCharacter(character);
  return (
    (classDef.savingThrows?.includes(ability) ?? false) ||
    parseSavingThrowProficiencies(character).includes(ability) ||
    aggregateFeatEffects(feats).savingThrowProficiencies.includes(ability)
  );
}

/** 5e passive score: 10 + the skill's modifier (ability mod, plus proficiency bonus if proficient) -- no roll. Used for passive Perception/Investigation/Insight. */
export function passiveSkillScore(character: Character, skill: SkillDefinition, feats: CharacterFeat[] = []): number {
  return (
    10 +
    abilityModifier(character[skill.ability]) +
    (isSkillProficient(character, skill.id, feats) ? character.proficiencyBonus : 0)
  );
}

/** `character.conditions` is stored as a comma-separated list of ConditionDefinition ids (see src/data/conditions.ts). Exhaustion is tracked separately via `exhaustionLevel` since it's leveled, not boolean. */
export function parseConditions(character: Character): string[] {
  return character.conditions ? character.conditions.split(",").filter(Boolean) : [];
}

export function serializeConditions(conditionIds: string[]): string {
  return conditionIds.join(",");
}

export function hasCondition(character: Character, conditionId: string): boolean {
  return parseConditions(character).includes(conditionId);
}

/**
 * Resolves a race name or catalog id (e.g. "Dwarf" or "dwarf") to its
 * `RaceDefinition` for a given ruleset -- same name-then-id-then-custom-fallback
 * matching as `getClassDefinition` above.
 */
export function getRaceDefinition(ruleset: string, raceNameOrId: string): RaceDefinition {
  const catalog = getRulesetCatalog(ruleset);
  const needle = raceNameOrId.trim().toLowerCase();
  const match = catalog.races.find(
    (r) => r.name.toLowerCase() === needle || r.id.toLowerCase() === needle
  );
  if (match) return match;
  return { ...CUSTOM_RACE_FALLBACK, name: raceNameOrId || CUSTOM_RACE_FALLBACK.name };
}

/** See `CustomClassOverlay` above -- same reasoning, for a custom race's ability bonuses/size/speed/traits. */
type CustomRaceOverlay = Partial<
  Pick<Character, "customRaceAbilityBonuses" | "customRaceSize" | "customRaceSpeed" | "customRaceTraits">
>;

export function parseCustomRaceAbilityBonuses(
  json: string | undefined
): Partial<Record<AbilityScoreKey, number>> {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const result: Partial<Record<AbilityScoreKey, number>> = {};
    for (const key of ABILITY_SCORE_KEYS) {
      const value = parsed[key];
      if (typeof value === "number" && value !== 0) result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

export function serializeCustomRaceAbilityBonuses(
  bonuses: Partial<Record<AbilityScoreKey, number>>
): string {
  return JSON.stringify(bonuses);
}

export function parseCustomRaceTraits(json: string | undefined): RaceTrait[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is RaceTrait => !!t && typeof t.name === "string" && typeof t.description === "string"
    );
  } catch {
    return [];
  }
}

export function serializeCustomRaceTraits(traits: RaceTrait[]): string {
  return JSON.stringify(traits);
}

export function getRaceDefinitionForCharacter(
  character: Pick<Character, "ruleset" | "race"> & CustomRaceOverlay
): RaceDefinition {
  const base = getRaceDefinition(character.ruleset, character.race);
  if (base.id !== CUSTOM_OPTION_ID) return base;

  return {
    ...base,
    abilityBonuses: parseCustomRaceAbilityBonuses(character.customRaceAbilityBonuses),
    size: character.customRaceSize === "Small" ? "Small" : "Medium",
    speed: character.customRaceSpeed || base.speed,
    traits: parseCustomRaceTraits(character.customRaceTraits),
  };
}

/** The character's race's structured traits (Darkvision, Trance, etc), or `[]` for a race without structured data yet (3.5e). A custom race's own user-entered traits (see `customRaceTraits`) come through here too, once set. */
export function racialTraitsForCharacter(
  character: Pick<Character, "ruleset" | "race"> & CustomRaceOverlay
): RaceTrait[] {
  return getRaceDefinitionForCharacter(character).traits ?? [];
}

/**
 * How many languages a race grants automatically, and how many more the
 * player chooses freely, for a given ruleset/race -- honors
 * `RulesetCatalog.universalLanguageGrant` (2024 5e's "Common plus two of
 * your choice", independent of race) ahead of the race's own grant (2014
 * 5e). Falls back to "Common, no choice" for rulesets with no language
 * catalog yet (3.5e, Custom race) since that's true regardless of edition.
 */
export function languageGrantForRace(
  ruleset: string,
  race: RaceDefinition | null
): { granted: string[]; chooseCount: number } {
  const catalog = getRulesetCatalog(ruleset);
  if (catalog.universalLanguageGrant) {
    return {
      granted: catalog.universalLanguageGrant.granted,
      chooseCount: catalog.universalLanguageGrant.chooseCount,
    };
  }
  if (race?.languages) {
    return { granted: race.languages.granted, chooseCount: race.languages.choice?.count ?? 0 };
  }
  return { granted: ["common"], chooseCount: 0 };
}

/** `character.languages` is stored as a comma-separated list of LanguageDefinition ids. Empty for rulesets with no language catalog yet (3.5e) -- those still rely on the freetext `otherProficiencies` field. */
export function parseLanguages(character: Character): string[] {
  return character.languages ? character.languages.split(",").filter(Boolean) : [];
}

export function serializeLanguages(languageIds: string[]): string {
  return languageIds.join(",");
}

export function knowsLanguage(character: Character, languageId: string): boolean {
  return parseLanguages(character).includes(languageId);
}
