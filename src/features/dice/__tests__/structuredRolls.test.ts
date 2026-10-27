import {
  buildStructuredRollPlan,
  detectSingleD20Flag,
  naturalD20Flag,
  rollD20,
  spellSaveDc,
  structuredRollToResult,
} from "../structuredRolls";
import type { Character } from "../../../types/models";

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: "Test",
    ruleset: "5e",
    race: "Human",
    className: "Fighter",
    subclass: "",
    background: "",
    feats: "",
    alignment: "",
    personalityTraits: "",
    ideals: "",
    bonds: "",
    flaws: "",
    languages: "",
    otherProficiencies: "",
    featuresAndTraits: "",
    inspiration: false,
    level: 5,
    maxHp: 40,
    currentHp: 40,
    tempHp: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    hitDiceRemaining: 5,
    conditions: "",
    exhaustionLevel: 0,
    concentratingSpellId: null,
    concentratingSpellName: "",
    skillProficiencies: "",
    savingThrowProficiencies: "",
    armorClass: 16,
    speed: 30,
    proficiencyBonus: 3,
    strength: 16,
    dexterity: 14,
    constitution: 14,
    intelligence: 10,
    wisdom: 12,
    charisma: 8,
    notes: "",
    portraitUri: null,
    copperPieces: 0,
    silverPieces: 0,
    electrumPieces: 0,
    goldPieces: 0,
    platinumPieces: 0,
    tracksProvisions: false,
    usesXp: false,
    experiencePoints: 0,
    themeFamily: null,
    fontChoice: null,
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}

describe("buildStructuredRollPlan", () => {
  it("builds a check with no proficiency by default", () => {
    const plan = buildStructuredRollPlan({
      mode: "check",
      character: makeCharacter(),
      ability: "strength",
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "STR Check",
      modifier: 3,
      modifierBreakdown: "+ 3 (STR)",
    });
  });

  it("adds proficiency to a check when proficient is set", () => {
    const plan = buildStructuredRollPlan({
      mode: "check",
      character: makeCharacter(),
      ability: "strength",
      proficient: true,
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "STR Check",
      modifier: 6,
      modifierBreakdown: "+ 3 (STR) + 3 (Proficiency)",
    });
  });

  it("auto-applies proficiency to a save for a class's proficient ability", () => {
    // Fighter is proficient in STR and CON saves.
    const plan = buildStructuredRollPlan({
      mode: "save",
      character: makeCharacter(),
      ability: "strength",
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "STR Save",
      modifier: 6,
      modifierBreakdown: "+ 3 (STR) + 3 (Proficiency)",
    });
  });

  it("does not apply proficiency to a save for a non-proficient ability", () => {
    const plan = buildStructuredRollPlan({
      mode: "save",
      character: makeCharacter(),
      ability: "intelligence",
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "INT Save",
      modifier: 0,
      modifierBreakdown: "+ 0 (INT)",
    });
  });

  it("applies proficiency to a save granted by savingThrowProficiencies even when the class doesn't grant it", () => {
    // Fighter isn't normally proficient in INT saves (only STR/CON) -- a
    // feat like Resilient can grant one anyway.
    const plan = buildStructuredRollPlan({
      mode: "save",
      character: makeCharacter({ savingThrowProficiencies: "intelligence" }),
      ability: "intelligence",
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "INT Save",
      modifier: 3,
      modifierBreakdown: "+ 0 (INT) + 3 (Proficiency)",
    });
  });

  it("includes an extra manual modifier", () => {
    const plan = buildStructuredRollPlan({
      mode: "attack",
      character: makeCharacter(),
      ability: "strength",
      proficient: true,
      extraModifier: 1,
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "STR Attack",
      modifier: 7,
      modifierBreakdown: "+ 3 (STR) + 3 (Proficiency) + 1 (Bonus)",
    });
  });

  it("derives spell attack modifier from the class's spellcasting ability", () => {
    const plan = buildStructuredRollPlan({
      mode: "spell",
      character: makeCharacter({ className: "Cleric", wisdom: 16 }),
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "Spell Attack",
      modifier: 6,
      modifierBreakdown: "+ 3 (WIS) + 3 (Proficiency)",
    });
  });

  it("falls back to the highest mental stat for a class with no spellcasting ability", () => {
    // Fighter: INT 10, WIS 12, CHA 8 -- WIS is highest, so that's used.
    const plan = buildStructuredRollPlan({
      mode: "spell",
      character: makeCharacter({ className: "Fighter" }),
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "Spell Attack",
      modifier: 4,
      modifierBreakdown: "+ 1 (WIS) + 3 (Proficiency)",
    });
  });

  it("matches a class by display name (as onboarding stores it)", () => {
    // Regression guard: character.className is stored as "Wizard", not "wizard".
    const plan = buildStructuredRollPlan({
      mode: "spell",
      character: makeCharacter({ className: "Wizard", intelligence: 18 }),
      advantageMode: "normal",
    });
    expect(plan).toEqual({ label: "Spell Attack", modifier: 7, modifierBreakdown: "+ 4 (INT) + 3 (Proficiency)" });
  });

  it("derives ability + proficiency automatically for a skill-based check", () => {
    const plan = buildStructuredRollPlan({
      mode: "check",
      character: makeCharacter({ wisdom: 14, skillProficiencies: "perception" }),
      skillId: "perception",
      advantageMode: "normal",
    });
    expect(plan).toEqual({
      label: "Perception Check",
      modifier: 5,
      modifierBreakdown: "+ 2 (WIS) + 3 (Proficiency)",
    });
  });

  it("omits proficiency for a skill-based check the character isn't proficient in", () => {
    const plan = buildStructuredRollPlan({
      mode: "check",
      character: makeCharacter({ wisdom: 14, skillProficiencies: "stealth" }),
      skillId: "perception",
      advantageMode: "normal",
    });
    expect(plan).toEqual({ label: "Perception Check", modifier: 2, modifierBreakdown: "+ 2 (WIS)" });
  });

  it("errors for an unknown skill id", () => {
    const plan = buildStructuredRollPlan({
      mode: "check",
      character: makeCharacter(),
      skillId: "not-a-real-skill",
      advantageMode: "normal",
    });
    expect(plan).toEqual({ error: "Unknown skill." });
  });
});

describe("naturalD20Flag", () => {
  it("flags a natural 1", () => {
    expect(naturalD20Flag(1)).toBe("nat1");
  });

  it("flags a natural 20", () => {
    expect(naturalD20Flag(20)).toBe("nat20");
  });

  it("flags nothing for any other value", () => {
    expect(naturalD20Flag(11)).toBeNull();
  });
});

describe("detectSingleD20Flag", () => {
  it("flags a natural 1 from a single d20 roll", () => {
    expect(detectSingleD20Flag([{ sides: 20, value: 1 }])).toBe("nat1");
  });

  it("flags a natural 20 mixed with other dice (e.g. 1d20+1d4)", () => {
    expect(
      detectSingleD20Flag([
        { sides: 20, value: 20 },
        { sides: 4, value: 3 },
      ])
    ).toBe("nat20");
  });

  it("flags nothing when there's more than one d20 (ambiguous)", () => {
    expect(
      detectSingleD20Flag([
        { sides: 20, value: 1 },
        { sides: 20, value: 1 },
      ])
    ).toBeNull();
  });

  it("flags nothing when there's no d20 at all", () => {
    expect(detectSingleD20Flag([{ sides: 6, value: 1 }])).toBeNull();
  });
});

describe("spellSaveDc", () => {
  it("computes 8 + proficiency + spellcasting modifier", () => {
    expect(spellSaveDc(makeCharacter({ className: "Cleric", wisdom: 16 }))).toBe(14);
  });

  it("still computes a DC for a non-caster, via the highest mental stat", () => {
    // Fighter: INT 10, WIS 12, CHA 8 -- WIS is highest: 8 + 3 prof + 1 WIS mod.
    expect(spellSaveDc(makeCharacter({ className: "Fighter" }))).toBe(12);
  });
});

describe("rollD20", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockRandomSequence(values: number[]) {
    let i = 0;
    jest.spyOn(Math, "random").mockImplementation(() => {
      const value = values[i] ?? values[values.length - 1];
      i += 1;
      return value;
    });
  }

  it("rolls a single d20 at normal", () => {
    mockRandomSequence([0.5]);
    const roll = rollD20("normal", 3);
    expect(roll).toEqual({ dice: [11], used: 11, modifier: 3, total: 14 });
  });

  it("takes the higher of two d20s at advantage", () => {
    mockRandomSequence([0.5, 0.95]);
    const roll = rollD20("advantage", 0);
    expect(roll.dice).toEqual([11, 20]);
    expect(roll.used).toBe(20);
    expect(roll.total).toBe(20);
  });

  it("takes the lower of two d20s at disadvantage", () => {
    mockRandomSequence([0.5, 0.95]);
    const roll = rollD20("disadvantage", 0);
    expect(roll.dice).toEqual([11, 20]);
    expect(roll.used).toBe(11);
    expect(roll.total).toBe(11);
  });
});

describe("structuredRollToResult", () => {
  it("adapts a normal roll into the shared RollResult shape", () => {
    const result = structuredRollToResult(
      { label: "STR Save", modifier: 6, modifierBreakdown: "+ 3 (STR) + 3 (Proficiency)" },
      { dice: [14], used: 14, modifier: 6, total: 20 },
      "normal"
    );
    expect(result).toEqual({
      expression: "STR Save",
      total: 20,
      breakdown: "1d20 (14) + 3 (STR) + 3 (Proficiency)",
      rolls: [{ sides: 20, value: 14 }],
    });
  });

  it("notes which die was used and the advantage mode for a 2-die roll", () => {
    const result = structuredRollToResult(
      { label: "DEX Check", modifier: 2, modifierBreakdown: "+ 2 (DEX)" },
      { dice: [5, 17], used: 17, modifier: 2, total: 19 },
      "advantage"
    );
    expect(result.expression).toBe("DEX Check (advantage)");
    expect(result.breakdown).toBe("2d20 (5, 17) → 17 + 2 (DEX)");
    expect(result.rolls).toEqual([
      { sides: 20, value: 5 },
      { sides: 20, value: 17 },
    ]);
  });
});
