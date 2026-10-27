import { getClassDefinition, getClassProgression } from "./characterCalculations";
import type { SpellSlotRow } from "../../data/rulesets/types";
import type { CharacterClass } from "../../types/models";

/**
 * The minimal shape every helper below actually needs -- a real
 * `CharacterClass` row satisfies this automatically, but callers previewing
 * a not-yet-saved hypothetical class list (e.g. "what would slots look like
 * after this level-up") can pass plain objects without faking the rest of
 * a DB row's fields.
 */
export type ClassLevelEntry = Pick<CharacterClass, "classId" | "level" | "className">;

/**
 * 5e multiclass spellcasting: "full" casters (Bard/Cleric/Druid/Sorcerer/
 * Wizard) count every class level toward the shared multiclass slot table;
 * "half" casters (Paladin/Ranger) count `floor(level / 2)` (so a level-1
 * half-caster contributes 0); "pact" (Warlock) is excluded entirely --
 * Pact Magic is a wholly separate resource, see `warlockPactMagicRow` below.
 */
export function combinedCasterLevel(rows: ClassLevelEntry[], ruleset: string): number {
  return rows.reduce((sum, row) => {
    const casterType = getClassDefinition(ruleset, row.classId).casterType;
    if (casterType === "full") return sum + row.level;
    if (casterType === "half") return sum + Math.floor(row.level / 2);
    return sum;
  }, 0);
}

/**
 * The standard 5e multiclass slots-per-level table is identical to a
 * single full caster's own table, so this reuses Wizard's `spellProgression`
 * (any full caster's would do) rather than hand-duplicating the table.
 * Undefined below level 1 or above the table's range.
 */
export function multiclassSpellSlots(
  combinedLevel: number,
  ruleset: string
): SpellSlotRow["slots"] | undefined {
  if (combinedLevel <= 0) return undefined;
  const wizardProgression = getClassProgression(ruleset, "wizard");
  return wizardProgression?.spellProgression?.find((row) => row.level === Math.min(20, combinedLevel))
    ?.slots;
}

/**
 * Warlock's Pact Magic slots, read from Warlock's own single-class
 * `spellProgression` at Warlock's own class level -- a separate resource,
 * never combined into `multiclassSpellSlots` above. Undefined if this
 * character has no Warlock levels.
 */
export function warlockPactMagicRow(
  rows: ClassLevelEntry[],
  ruleset: string
): SpellSlotRow | undefined {
  const warlockRow = rows.find(
    (row) => getClassDefinition(ruleset, row.classId).casterType === "pact"
  );
  if (!warlockRow) return undefined;
  return getClassProgression(ruleset, warlockRow.classId)?.spellProgression?.find(
    (row) => row.level === warlockRow.level
  );
}

export function isMulticlassed(rows: unknown[]): boolean {
  return rows.length > 1;
}

/** e.g. "Fighter 3 / Wizard 2". Falls back to a bare class name for the common single-class case (zero rows). */
export function formatMulticlassLabel(rows: ClassLevelEntry[], fallbackClassName: string): string {
  if (rows.length === 0) return fallbackClassName || "No class";
  return rows.map((row) => `${row.className} ${row.level}`).join(" / ");
}
