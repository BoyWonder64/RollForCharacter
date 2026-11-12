// Encounter difficulty from the SRD 5.2.1 "XP Budget per Character" table
// (Combat Encounter Difficulty, Step 2), CC BY 4.0, Wizards of the Coast --
// see Settings -> Legal & Licenses. Numbers verified against the official
// SRD 5.2.1 PDF. The SRD's method is simple: multiply the per-character
// budget for the chosen difficulty by the party size, then spend that budget
// on creatures' XP values. There is no monster-count multiplier.

export type DifficultyBand = "low" | "moderate" | "high";

export const DIFFICULTY_LABELS: Record<DifficultyBand, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

// Per-character XP budget by character level (index 0 = level 1), per band.
const XP_BUDGET_BY_LEVEL: Record<DifficultyBand, number[]> = {
  low: [
    50, 100, 150, 250, 500, 600, 750, 1000, 1300, 1600, 1900, 2200, 2600, 2900, 3300, 3800, 4500,
    5000, 5500, 6400,
  ],
  moderate: [
    75, 150, 225, 375, 750, 1000, 1300, 1700, 2000, 2300, 2900, 3700, 4200, 4900, 5400, 6100, 7200,
    8700, 10700, 13200,
  ],
  high: [
    100, 200, 400, 500, 1100, 1400, 1700, 2100, 2600, 3100, 4100, 4700, 5400, 6200, 7800, 9800,
    11700, 14200, 17200, 22000,
  ],
};

function budgetForLevel(band: DifficultyBand, level: number): number {
  const table = XP_BUDGET_BY_LEVEL[band];
  const index = Math.min(table.length, Math.max(1, level)) - 1;
  return table[index];
}

/** Sum of each party member's budget at their own level, for one difficulty band. */
export function partyXpBudget(levels: number[], band: DifficultyBand): number {
  return levels.reduce((sum, level) => sum + budgetForLevel(band, level), 0);
}

export type EncounterDifficulty = {
  /** Sum of the encounter's monsters' XP -- the figure compared to the budgets. */
  totalXp: number;
  /** Null when the party is empty, or the encounter is below the Low budget. */
  band: DifficultyBand | null;
  budgets: Record<DifficultyBand, number>;
};

const BAND_ORDER: DifficultyBand[] = ["low", "moderate", "high"];

/**
 * Where a built encounter lands against the party's XP budgets: the highest
 * band whose budget the encounter's total XP reaches. `partyLevels` is each
 * character's own level (multiclass totals, not per-class); `monsterXpValues`
 * is one entry per creature (custom creatures with no catalog stat block
 * contribute 0).
 */
export function rateEncounterDifficulty(
  monsterXpValues: number[],
  partyLevels: number[]
): EncounterDifficulty {
  const totalXp = monsterXpValues.reduce((sum, xp) => sum + xp, 0);
  const budgets = {
    low: partyXpBudget(partyLevels, "low"),
    moderate: partyXpBudget(partyLevels, "moderate"),
    high: partyXpBudget(partyLevels, "high"),
  };
  if (partyLevels.length === 0) return { totalXp, band: null, budgets };

  let band: DifficultyBand | null = null;
  for (const candidate of BAND_ORDER) {
    if (totalXp >= budgets[candidate]) band = candidate;
  }
  return { totalXp, band, budgets };
}
