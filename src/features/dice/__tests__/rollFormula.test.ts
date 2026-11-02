import { isValidRollFormula, resolveRollFormula } from "../rollFormula";
import type { Character } from "../../../types/models";

function character(overrides: Partial<Character> = {}): Character {
  return { level: 5, proficiencyBonus: 3, strength: 10, dexterity: 10, constitution: 14, intelligence: 10, wisdom: 10, charisma: 8, ...overrides } as Character;
}

describe("rollFormula", () => {
  it("substitutes level", () => {
    expect(resolveRollFormula("1d10 + level", character())).toBe("1d10 + 5");
  });

  it("substitutes ability modifiers and proficiency, case-insensitively", () => {
    expect(resolveRollFormula("2d6 + CON + prof", character())).toBe("2d6 + 5");
  });

  it("folds a negative modifier into a subtraction", () => {
    expect(resolveRollFormula("1d6 + cha", character())).toBe("1d6 - 1");
  });

  it("drops a zero modifier", () => {
    expect(resolveRollFormula("1d8 + str", character())).toBe("1d8");
  });

  it("leaves plain dice expressions alone", () => {
    expect(resolveRollFormula("3d8", character())).toBe("3d8");
  });

  it("rejects text that is not dice math", () => {
    expect(() => resolveRollFormula("fireball", character())).toThrow();
    expect(isValidRollFormula("fireball")).toBe(false);
    expect(isValidRollFormula("")).toBe(false);
  });

  it("validates formulas with tokens", () => {
    expect(isValidRollFormula("1d10 + level")).toBe(true);
    expect(isValidRollFormula("1d6 + cha + prof")).toBe(true);
  });
});
