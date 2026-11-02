import type { ClassProgression, SpellSlotRow } from "./types";

/**
 * Warlock Pact Magic: a small number of slots that are all the same (highest)
 * level, so a row is expressed in the shared `slots` shape (index 0 = 1st
 * level) with every other level 0. The 2014 and 2024 Warlock tables are
 * identical in slot count, slot level and cantrips known; both editions
 * prepare/know the same number of spells.
 */
const SLOT_COUNT = [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4];
const SLOT_LEVEL = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const CANTRIPS = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const SPELLS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15];

export const WARLOCK_PACT_MAGIC: SpellSlotRow[] = SLOT_COUNT.map((count, index) => ({
  level: index + 1,
  slots: Array.from({ length: 9 }, (_, slotIndex) => (slotIndex + 1 === SLOT_LEVEL[index] ? count : 0)),
  cantripsKnown: CANTRIPS[index],
  spellsKnown: SPELLS[index],
}));

/** Adds Pact Magic to Warlock's progression where the data file has none. */
export function withPactMagic(progressions: ClassProgression[]): ClassProgression[] {
  return progressions.map((progression) =>
    progression.classId === "warlock" && !progression.spellProgression
      ? { ...progression, spellProgression: WARLOCK_PACT_MAGIC }
      : progression
  );
}
