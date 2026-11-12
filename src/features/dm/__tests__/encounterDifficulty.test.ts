import { partyXpBudget, rateEncounterDifficulty } from "../encounterDifficulty";

describe("partyXpBudget", () => {
  it("matches the SRD 5.2.1 budgets for a single level-1 character", () => {
    expect(partyXpBudget([1], "low")).toBe(50);
    expect(partyXpBudget([1], "moderate")).toBe(75);
    expect(partyXpBudget([1], "high")).toBe(100);
  });

  it("matches the SRD 5.2.1 budgets at level 20", () => {
    expect(partyXpBudget([20], "low")).toBe(6400);
    expect(partyXpBudget([20], "moderate")).toBe(13200);
    expect(partyXpBudget([20], "high")).toBe(22000);
  });

  it("sums per-character budgets for a mixed-level party", () => {
    expect(partyXpBudget([1, 1, 3, 3], "moderate")).toBe(75 + 75 + 225 + 225);
  });

  it("clamps out-of-range levels to the 1-20 table", () => {
    expect(partyXpBudget([0], "low")).toBe(50);
    expect(partyXpBudget([25], "high")).toBe(22000);
  });
});

describe("rateEncounterDifficulty", () => {
  it("rates a 200-XP encounter for four level-1 characters as Low", () => {
    // SRD example: a Low encounter for four level 1 characters has a 200 XP budget.
    const result = rateEncounterDifficulty([50, 50, 50, 50], [1, 1, 1, 1]);
    expect(result.totalXp).toBe(200);
    expect(result.band).toBe("low");
  });

  it("picks the highest band whose budget is reached", () => {
    expect(rateEncounterDifficulty([300], [1, 1, 1, 1]).band).toBe("moderate");
    expect(rateEncounterDifficulty([400], [1, 1, 1, 1]).band).toBe("high");
  });

  it("does not multiply XP by monster count", () => {
    const one = rateEncounterDifficulty([200], [1, 1, 1, 1]);
    const four = rateEncounterDifficulty([50, 50, 50, 50], [1, 1, 1, 1]);
    expect(four.totalXp).toBe(one.totalXp);
    expect(four.band).toBe(one.band);
  });

  it("returns a null band below the Low budget", () => {
    expect(rateEncounterDifficulty([10], [1, 1, 1, 1]).band).toBeNull();
  });

  it("returns a null band for an empty party", () => {
    expect(rateEncounterDifficulty([50], []).band).toBeNull();
  });
});
