/** Rule overrides a character can opt into under Edit -> Homebrew. Stock 5e values apply while it is off. */
export type HomebrewFields = {
  homebrewEnabled: boolean;
  deathSaveSuccessesNeeded: number;
  deathSaveFailuresNeeded: number;
  critRangeMin: number;
  attunementLimit: number;
  abilityScoreMax: number;
  inspirationMax: number;
  inspirationPoints: number;
  inspiration: boolean;
};

export type DeathSaveFields = Pick<
  HomebrewFields,
  "homebrewEnabled" | "deathSaveSuccessesNeeded" | "deathSaveFailuresNeeded"
>;

export const DEFAULT_DEATH_SAVE_LIMIT = 3;
export const DEFAULT_CRIT_RANGE_MIN = 20;
export const DEFAULT_ATTUNEMENT_LIMIT = 3;
export const DEFAULT_ABILITY_SCORE_MAX = 20;
export const DEFAULT_INSPIRATION_MAX = 1;

export function deathSaveLimits(c: DeathSaveFields): { successes: number; failures: number } {
  if (!c.homebrewEnabled) {
    return { successes: DEFAULT_DEATH_SAVE_LIMIT, failures: DEFAULT_DEATH_SAVE_LIMIT };
  }
  return {
    successes: Math.max(1, c.deathSaveSuccessesNeeded),
    failures: Math.max(1, c.deathSaveFailuresNeeded),
  };
}

/** Lowest natural d20 result that counts as a critical (20 normally, 19 for a 19-20 crit range, ...). */
export function critRangeMin(c: Pick<HomebrewFields, "homebrewEnabled" | "critRangeMin"> | null | undefined): number {
  if (!c || !c.homebrewEnabled) return DEFAULT_CRIT_RANGE_MIN;
  return Math.min(DEFAULT_CRIT_RANGE_MIN, Math.max(2, c.critRangeMin));
}

/** Max attuned items, or null when no limit is enforced (stock behaviour: the app never capped it). */
export function attunementCap(c: Pick<HomebrewFields, "homebrewEnabled" | "attunementLimit">): number | null {
  return c.homebrewEnabled ? Math.max(1, c.attunementLimit) : null;
}

/** Highest an ability score can be raised to by level-ups and feats. */
export function abilityScoreCap(c: Pick<HomebrewFields, "homebrewEnabled" | "abilityScoreMax">): number {
  return c.homebrewEnabled ? Math.max(DEFAULT_ABILITY_SCORE_MAX, c.abilityScoreMax) : DEFAULT_ABILITY_SCORE_MAX;
}

/** How many inspiration points can be held at once. */
export function inspirationCap(c: Pick<HomebrewFields, "homebrewEnabled" | "inspirationMax">): number {
  return c.homebrewEnabled ? Math.max(1, c.inspirationMax) : DEFAULT_INSPIRATION_MAX;
}

/** Inspiration points held now. `inspirationPoints` is the truth; the boolean covers rows from before it existed. */
export function inspirationCount(c: Pick<HomebrewFields, "inspirationPoints" | "inspiration">): number {
  return Math.max(c.inspirationPoints, c.inspiration ? 1 : 0);
}
