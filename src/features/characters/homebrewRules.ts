/** Rule overrides a character can opt into under Edit -> Homebrew. Stock 5e values apply while it is off. */
export type DeathSaveFields = {
  homebrewEnabled: boolean;
  deathSaveSuccessesNeeded: number;
  deathSaveFailuresNeeded: number;
};

export const DEFAULT_DEATH_SAVE_LIMIT = 3;

export function deathSaveLimits(c: DeathSaveFields): { successes: number; failures: number } {
  if (!c.homebrewEnabled) {
    return { successes: DEFAULT_DEATH_SAVE_LIMIT, failures: DEFAULT_DEATH_SAVE_LIMIT };
  }
  return {
    successes: Math.max(1, c.deathSaveSuccessesNeeded),
    failures: Math.max(1, c.deathSaveFailuresNeeded),
  };
}
