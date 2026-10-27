import { levelForXp, MAX_XP_LEVEL, xpThresholdForLevel, xpToNextLevel } from "../xpTable";

describe("xpThresholdForLevel (5e)", () => {
  it.each([
    [1, 0],
    [2, 300],
    [3, 900],
    [5, 6500],
    [10, 64000],
    [20, 355000],
  ])("level %i needs %i XP", (level, expected) => {
    expect(xpThresholdForLevel("5e", level)).toBe(expected);
  });

  it("uses the same table for the 2024 revision", () => {
    expect(xpThresholdForLevel("5e-2024", 10)).toBe(xpThresholdForLevel("5e", 10));
  });

  it("clamps above level 20 to the level-20 threshold", () => {
    expect(xpThresholdForLevel("5e", 25)).toBe(355000);
  });

  it("clamps below level 1 to the level-1 threshold", () => {
    expect(xpThresholdForLevel("5e", 0)).toBe(0);
  });
});

describe("xpThresholdForLevel (3.5e)", () => {
  it.each([
    [1, 0],
    [2, 1000],
    [3, 3000],
    [5, 10000],
    [10, 45000],
    [20, 190000],
  ])("level %i needs %i XP", (level, expected) => {
    expect(xpThresholdForLevel("3.5e", level)).toBe(expected);
  });
});

describe("levelForXp", () => {
  it("returns level 1 for 0 XP", () => {
    expect(levelForXp("5e", 0)).toBe(1);
  });

  it("returns the exact level at its threshold", () => {
    expect(levelForXp("5e", 6500)).toBe(5);
  });

  it("returns the level just below the next threshold", () => {
    expect(levelForXp("5e", 6499)).toBe(4);
  });

  it("caps at level 20 for very high XP", () => {
    expect(levelForXp("5e", 10_000_000)).toBe(20);
  });
});

describe("xpToNextLevel", () => {
  it("computes the remaining XP to the next level", () => {
    expect(xpToNextLevel("5e", 4, 3000)).toBe(6500 - 3000);
  });

  it("floors at 0 once XP already exceeds the next threshold", () => {
    expect(xpToNextLevel("5e", 4, 7000)).toBe(0);
  });

  it("returns undefined at the level cap", () => {
    expect(xpToNextLevel("5e", MAX_XP_LEVEL, 500000)).toBeUndefined();
  });
});
