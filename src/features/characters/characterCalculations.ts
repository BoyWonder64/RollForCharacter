import type { RaceDefinition } from "../../data/rulesets/types";
import type { AbilityScoreKey } from "../../types/models";

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

export function armorClassBaseline(dexterityScore: number): number {
  return 10 + abilityModifier(dexterityScore);
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
