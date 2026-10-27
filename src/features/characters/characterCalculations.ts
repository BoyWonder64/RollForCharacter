import { CUSTOM_CLASS_FALLBACK, CUSTOM_RACE_FALLBACK, getRulesetCatalog } from "../../data/rulesets";
import type {
  ClassDefinition,
  ClassFeature,
  ClassProgression,
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

/** 5e/3.5e initiative: Dexterity modifier (no proficiency bonus unless granted by a feat/feature). */
export function initiativeModifier(character: Character): number {
  return abilityModifier(character.dexterity);
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

export function getClassDefinitionForCharacter(
  character: Pick<Character, "ruleset" | "className">
): ClassDefinition {
  return getClassDefinition(character.ruleset, character.className);
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

export function isSkillProficient(character: Character, skillId: string): boolean {
  return parseSkillProficiencies(character).includes(skillId);
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

export function isSavingThrowProficient(character: Character, ability: AbilityScoreKey): boolean {
  const classDef = getClassDefinitionForCharacter(character);
  return (
    (classDef.savingThrows?.includes(ability) ?? false) ||
    parseSavingThrowProficiencies(character).includes(ability)
  );
}

/** 5e passive score: 10 + the skill's modifier (ability mod, plus proficiency bonus if proficient) -- no roll. Used for passive Perception/Investigation/Insight. */
export function passiveSkillScore(character: Character, skill: SkillDefinition): number {
  return (
    10 +
    abilityModifier(character[skill.ability]) +
    (isSkillProficient(character, skill.id) ? character.proficiencyBonus : 0)
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

export function getRaceDefinitionForCharacter(character: Pick<Character, "ruleset" | "race">): RaceDefinition {
  return getRaceDefinition(character.ruleset, character.race);
}

/** The character's race's structured traits (Darkvision, Trance, etc), or `[]` for a race without structured data yet (3.5e, Custom). */
export function racialTraitsForCharacter(character: Pick<Character, "ruleset" | "race">): RaceTrait[] {
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
