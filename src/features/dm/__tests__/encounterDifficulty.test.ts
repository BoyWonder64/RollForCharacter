import {
  encounterMultiplier,
  partyXpThreshold,
  rateEncounterDifficulty,
} from "../encounterDifficulty";

describe("partyXpThreshold", () => {
  it("matches the published DMG thresholds for a single level-1 character", () => {
    expect(partyXpThreshold([1], "easy")).toBe(25);
    expect(partyXpThreshold([1], "medium")).toBe(50);
    expect(partyXpThreshold([1], "hard")).toBe(75);
    expect(partyXpThreshold([1], "deadly")).toBe(100);
  });

  it("sums per-character thresholds for a mixed-level party", () => {
    expect(partyXpThreshold([1, 1, 3, 3], "medium")).toBe(50 + 50 + 150 + 150);
  });
});

describe("encounterMultiplier", () => {
  it("is 1x for a single monster against a normal party", () => {
    expect(encounterMultiplier(1, 4)).toBe(1);
  });

  it("steps up for more monsters", () => {
    expect(encounterMultiplier(2, 4)).toBe(1.5);
    expect(encounterMultiplier(4, 4)).toBe(2);
    expect(encounterMultiplier(8, 4)).toBe(2.5);
    expect(encounterMultiplier(15, 4)).toBe(4);
  });

  it("adjusts one bracket up for a small party and down for a large one", () => {
    expect(encounterMultiplier(4, 2)).toBe(2.5);
    expect(encounterMultiplier(4, 6)).toBe(1.5);
  });
});

describe("rateEncounterDifficulty", () => {
  it("rates a single 75-XP monster against a normal-sized level-1 party as Easy", () => {
    // Party of exactly 3 triggers no size adjustment, so the 1-monster
    // multiplier stays 1x and the party's Easy threshold is 75 (25 * 3).
    const result = rateEncounterDifficulty([75], [1, 1, 1]);
    expect(result.baseXp).toBe(75);
    expect(result.adjustedXp).toBe(75);
    expect(result.band).toBe("easy");
  });

  it("applies the monster-count multiplier before comparing to thresholds", () => {
    // Base 100 XP alone would only clear the Easy threshold (100) for four
    // level-1 characters, but 4 monsters carries a 2x multiplier -> 200
    // adjusted, which clears the Medium threshold (200) instead.
    const result = rateEncounterDifficulty([25, 25, 25, 25], [1, 1, 1, 1]);
    expect(result.baseXp).toBe(100);
    expect(result.adjustedXp).toBe(200);
    expect(result.band).toBe("medium");
  });

  it("returns a null band for an empty party", () => {
    const result = rateEncounterDifficulty([50], []);
    expect(result.band).toBeNull();
  });
});
