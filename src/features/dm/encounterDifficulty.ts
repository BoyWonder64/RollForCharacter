// 5e (2014) DMG "Building Encounters" tables -- these specific numbers are
// widely republished as game-mechanics reference data (Kobold Fight Club,
// D&D Beyond's encounter builder, etc.), the same way this app already
// stores each SRD monster's XP value for its challenge rating. Not SRD
// text; flagged here so it's easy to find if that ever needs revisiting.
// Verified 2026-11-02 against the published DMG table.

export type DifficultyBand = "easy" | "medium" | "hard" | "deadly";

export const DIFFICULTY_LABELS: Record<DifficultyBand, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  deadly: "Deadly",
};

// Per-character XP threshold by level, one row per difficulty.
const XP_THRESHOLDS_BY_LEVEL: Record<DifficultyBand, number[]> = {
  easy: [
    25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100,
    2400, 2800,
  ],
  medium: [
    50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900,
    4200, 4900, 5700,
  ],
  hard: [
    75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900,
    6300, 7300, 8500,
  ],
  deadly: [
    100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200,
    8800, 9500, 10900, 12700,
  ],
};

function thresholdForLevel(band: DifficultyBand, level: number): number {
  const table = XP_THRESHOLDS_BY_LEVEL[band];
  const index = Math.min(table.length, Math.max(1, level)) - 1;
  return table[index];
}

/** Sum of each party member's threshold at their own level, for one difficulty band. */
export function partyXpThreshold(levels: number[], band: DifficultyBand): number {
  return levels.reduce((sum, level) => sum + thresholdForLevel(band, level), 0);
}

// 1 monster, 2, 3-6, 7-10, 11-14, 15+.
const MULTIPLIER_BRACKETS = [1, 1.5, 2, 2.5, 3, 4];

function multiplierBracketIndex(monsterCount: number): number {
  if (monsterCount === 1) return 0;
  if (monsterCount === 2) return 1;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 3;
  if (monsterCount <= 14) return 4;
  return 5;
}

/**
 * The DMG's encounter multiplier: more monsters acting in a round is
 * tougher than their raw XP implies, because of action economy. Stepped up
 * one bracket for a party smaller than 3, and down one bracket for a party
 * of 6 or more (the DMG's party-size adjustment).
 */
export function encounterMultiplier(monsterCount: number, partySize: number): number {
  if (monsterCount <= 0) return 1;
  let index = multiplierBracketIndex(monsterCount);
  if (partySize < 3) index = Math.min(index + 1, MULTIPLIER_BRACKETS.length - 1);
  else if (partySize >= 6) index = Math.max(index - 1, 0);
  return MULTIPLIER_BRACKETS[index];
}

export type EncounterDifficulty = {
  /** Sum of the encounter's monsters' XP, unmultiplied. */
  baseXp: number;
  /** `baseXp * encounterMultiplier`, the figure actually compared to thresholds. */
  adjustedXp: number;
  /** Null when the party is empty, so there's nothing to compare against. */
  band: DifficultyBand | null;
  thresholds: Record<DifficultyBand, number>;
};

const BAND_ORDER: DifficultyBand[] = ["easy", "medium", "hard", "deadly"];

/**
 * Where a built encounter lands against the party's difficulty thresholds.
 * `partyLevels` is each character's own level (multiclass totals, not
 * per-class); `monsterXpValues` is one entry per creature in the encounter
 * (custom creatures with no catalog stat block contribute 0).
 */
export function rateEncounterDifficulty(
  monsterXpValues: number[],
  partyLevels: number[]
): EncounterDifficulty {
  const baseXp = monsterXpValues.reduce((sum, xp) => sum + xp, 0);
  const multiplier = encounterMultiplier(monsterXpValues.length, partyLevels.length);
  const adjustedXp = Math.round(baseXp * multiplier);
  const thresholds = {
    easy: partyXpThreshold(partyLevels, "easy"),
    medium: partyXpThreshold(partyLevels, "medium"),
    hard: partyXpThreshold(partyLevels, "hard"),
    deadly: partyXpThreshold(partyLevels, "deadly"),
  };
  if (partyLevels.length === 0) return { baseXp, adjustedXp, band: null, thresholds };

  let band: DifficultyBand | null = null;
  for (const candidate of BAND_ORDER) {
    if (adjustedXp >= thresholds[candidate]) band = candidate;
  }
  return { baseXp, adjustedXp, band, thresholds };
}
