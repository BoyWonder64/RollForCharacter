// 5e SRD/PHB spells-known and cantrips-known progressions, by class and
// character level (index 0 = level 1). "Prepared" casters (Cleric, Druid,
// Paladin, Wizard) don't have a fixed known-spells table -- they prepare
// (spellcasting ability modifier + level, minimum 1) each day from a wider
// list (Wizard additionally keeps a spellbook, modeled here as "known").
//
// Sourced from the standard PHB class tables (well-established, stable
// since 2014 -- same confidence level as the hit die/saving throw data
// already hand-entered in `5e/classes.ts`), not fetched live.
type KnownCasterTable = { cantrips: number[]; spells: number[] };

const BARD: KnownCasterTable = {
  cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  spells: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
};

const SORCERER: KnownCasterTable = {
  cantrips: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  spells: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
};

const WARLOCK: KnownCasterTable = {
  cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  spells: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
};

// Ranger is a half-caster with no spells (and no cantrips) until level 2.
const RANGER: KnownCasterTable = {
  cantrips: new Array(20).fill(0),
  spells: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
};

const WIZARD_CANTRIPS = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const CLERIC_CANTRIPS = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const DRUID_CANTRIPS = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

export type SpellLimits = {
  cantrips: number;
  spells: number;
  mode: "known" | "prepared";
};

const KNOWN_CASTERS: Record<string, KnownCasterTable> = {
  bard: BARD,
  sorcerer: SORCERER,
  warlock: WARLOCK,
  ranger: RANGER,
};

/**
 * Returns how many cantrips + spells this class/level combination gets to
 * pick at character creation, or undefined if the class isn't a recognized
 * 5e spellcaster (lets the caller fall back to "pick freely").
 * `spellAbilityModifier` is only used for "prepared" classes.
 */
export function getSpellLimits(
  classId: string,
  level: number,
  spellAbilityModifier: number
): SpellLimits | undefined {
  const index = Math.min(19, Math.max(0, level - 1));

  const known = KNOWN_CASTERS[classId];
  if (known) {
    return { cantrips: known.cantrips[index], spells: known.spells[index], mode: "known" };
  }

  const prepared = Math.max(1, spellAbilityModifier + level);
  if (classId === "wizard") {
    // Spellbook size, not daily-prepared count -- starts with 6, +2/level.
    return { cantrips: WIZARD_CANTRIPS[index], spells: 6 + (level - 1) * 2, mode: "known" };
  }
  if (classId === "cleric") {
    return { cantrips: CLERIC_CANTRIPS[index], spells: prepared, mode: "prepared" };
  }
  if (classId === "druid") {
    return { cantrips: DRUID_CANTRIPS[index], spells: prepared, mode: "prepared" };
  }
  if (classId === "paladin") {
    // No cantrips; only available from level 2 (the caller already gates
    // onboarding's spell step on that).
    return { cantrips: 0, spells: prepared, mode: "prepared" };
  }

  return undefined;
}
