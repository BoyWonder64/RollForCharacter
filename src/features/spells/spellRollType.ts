import type { AbilityScoreKey } from "../../types/models";

export type SpellRollType = "attack" | "save" | "none";

const SAVE_ABILITY_PATTERNS: [RegExp, AbilityScoreKey][] = [
  [/strength saving throw/i, "strength"],
  [/dexterity saving throw/i, "dexterity"],
  [/constitution saving throw/i, "constitution"],
  [/intelligence saving throw/i, "intelligence"],
  [/wisdom saving throw/i, "wisdom"],
  [/charisma saving throw/i, "charisma"],
];

/**
 * Best-effort classification of how a spell resolves, read from its SRD
 * description text (the catalog has no dedicated "attack vs save" column).
 * A spell that calls for a "spell attack" is an attack roll the caster
 * makes; one that calls for a "<ability> saving throw" instead targets the
 * recipient's save, so the caster has nothing to roll just for casting it.
 */
export function getSpellRollType(description: string | null | undefined): SpellRollType {
  if (!description) return "none";
  if (/spell attack/i.test(description)) return "attack";
  if (/saving throw/i.test(description)) return "save";
  return "none";
}

/** The ability a save-type spell's target rolls against, if it can be determined. */
export function getSpellSaveAbility(
  description: string | null | undefined
): AbilityScoreKey | undefined {
  if (!description) return undefined;
  const match = SAVE_ABILITY_PATTERNS.find(([pattern]) => pattern.test(description));
  return match?.[1];
}
