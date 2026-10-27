// Cumulative XP required to REACH each level (index 0 = level 1 = 0 XP).
// Sourced from each ruleset's official Character Advancement table, not
// retyped from a secondary chart site -- verified 2026-10-26.

// 5e (2014 PHB "Character Advancement" table). The 2024 PHB kept the exact
// same table, so "5e" and "5e-2024" share this one.
const XP_THRESHOLDS_5E = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

// 3.5e SRD "Character Advancement" table -- follows the closed-form
// 500 * level * (level - 1), verified against the table's published values.
const XP_THRESHOLDS_35E = Array.from({ length: 20 }, (_, i) => {
  const level = i + 1;
  return 500 * level * (level - 1);
});

function xpTableForRuleset(ruleset: string): number[] {
  return ruleset === "3.5e" ? XP_THRESHOLDS_35E : XP_THRESHOLDS_5E;
}

export const MAX_XP_LEVEL = 20;

/** Cumulative XP needed to reach `level` (clamped to the table's 1-20 range). */
export function xpThresholdForLevel(ruleset: string, level: number): number {
  const table = xpTableForRuleset(ruleset);
  const index = Math.min(table.length, Math.max(1, level)) - 1;
  return table[index];
}

/** The highest level this much XP qualifies for. */
export function levelForXp(ruleset: string, xp: number): number {
  const table = xpTableForRuleset(ruleset);
  let level = 1;
  for (let i = 0; i < table.length; i++) {
    if (xp >= table[i]) level = i + 1;
  }
  return level;
}

/** XP still needed to reach `level + 1`, or undefined if already at the level cap. */
export function xpToNextLevel(ruleset: string, level: number, xp: number): number | undefined {
  const table = xpTableForRuleset(ruleset);
  if (level >= table.length) return undefined;
  return Math.max(0, table[level] - xp);
}
