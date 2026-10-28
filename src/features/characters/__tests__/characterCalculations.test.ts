import {
  aggregateFeatEffects,
  applyRaceAbilityBonuses,
  armorClassBaseline,
  averageHpGain,
  calculateMaxHp,
  proficiencyBonusForLevel,
  roll4d6DropLowest,
  rollHpGain,
  STANDARD_ARRAY,
  type CharacterFeat,
  type FeatEffect,
} from "../characterCalculations";
import type { RaceDefinition } from "../../../data/rulesets/types";

describe("proficiencyBonusForLevel", () => {
  it.each([
    [1, 2],
    [4, 2],
    [5, 3],
    [8, 3],
    [9, 4],
    [12, 4],
    [13, 5],
    [16, 5],
    [17, 6],
    [20, 6],
  ])("level %i -> +%i", (level, expected) => {
    expect(proficiencyBonusForLevel(level)).toBe(expected);
  });
});

describe("calculateMaxHp", () => {
  it("uses max hit die plus CON modifier at level 1", () => {
    // d8 class, +2 CON mod: 8 + 2 = 10
    expect(calculateMaxHp(8, 1, 2)).toBe(10);
  });

  it("adds the fixed per-level average for each level after 1st", () => {
    // d8 class, level 3, +2 CON mod:
    // level 1: 8 + 2 = 10
    // levels 2-3: 2 * (floor(8/2)+1 + 2) = 2 * (5 + 2) = 14
    // total: 24
    expect(calculateMaxHp(8, 3, 2)).toBe(24);
  });

  it("matches the known d12 barbarian average of 7 per level", () => {
    // d12, level 2, 0 CON mod: 12 + (floor(12/2)+1) = 12 + 7 = 19
    expect(calculateMaxHp(12, 2, 0)).toBe(19);
  });

  it("matches the known d6 wizard average of 4 per level", () => {
    // d6, level 2, 0 CON mod: 6 + (floor(6/2)+1) = 6 + 4 = 10
    expect(calculateMaxHp(6, 2, 0)).toBe(10);
  });

  it("never returns less than 1 HP per level even with a very negative CON modifier", () => {
    expect(calculateMaxHp(6, 5, -5)).toBeGreaterThanOrEqual(5);
  });
});

describe("aggregateFeatEffects", () => {
  function feat(enabled: boolean, effects: FeatEffect[]): Pick<CharacterFeat, "enabled" | "effects"> {
    return { enabled, effects };
  }

  it("combines live effects across every enabled feat", () => {
    const bundle = aggregateFeatEffects([
      feat(true, [{ kind: "armorClassBonus", amount: 1 }]),
      feat(true, [{ kind: "rangedAttackBonus", amount: 2 }]),
      feat(true, [{ kind: "skillProficiency", skillIds: ["perception", "stealth"] }]),
      feat(true, [{ kind: "savingThrowProficiency", ability: "wisdom" }]),
      feat(true, [{ kind: "initiativeProficiencyBonus" }]),
    ]);
    expect(bundle).toEqual({
      skillProficiencyIds: ["perception", "stealth"],
      savingThrowProficiencies: ["wisdom"],
      armorClassBonus: 1,
      hasInitiativeProficiencyBonus: true,
      rangedAttackBonus: 2,
      meleeAttackBonus: 0,
    });
  });

  it("excludes a disabled feat's effects entirely", () => {
    const bundle = aggregateFeatEffects([
      feat(false, [{ kind: "armorClassBonus", amount: 1 }]),
      feat(true, [{ kind: "meleeAttackBonus", amount: 3 }]),
    ]);
    expect(bundle.armorClassBonus).toBe(0);
    expect(bundle.meleeAttackBonus).toBe(3);
  });

  it("never contributes an abilityScoreIncrease effect -- it's a one-time mutation applied elsewhere", () => {
    const bundle = aggregateFeatEffects([
      feat(true, [{ kind: "abilityScoreIncrease", ability: "strength", amount: 1, max: 20 }]),
    ]);
    expect(bundle).toEqual({
      skillProficiencyIds: [],
      savingThrowProficiencies: [],
      armorClassBonus: 0,
      hasInitiativeProficiencyBonus: false,
      rangedAttackBonus: 0,
      meleeAttackBonus: 0,
    });
  });

  it("sums the same bonus kind across multiple feats", () => {
    const bundle = aggregateFeatEffects([
      feat(true, [{ kind: "rangedAttackBonus", amount: 2 }]),
      feat(true, [{ kind: "rangedAttackBonus", amount: 1 }]),
    ]);
    expect(bundle.rangedAttackBonus).toBe(3);
  });
});

describe("armorClassBaseline", () => {
  it.each([
    [10, 10],
    [14, 12],
    [8, 9],
    [20, 15],
  ])("dex score %i -> AC %i", (dexScore, expectedAc) => {
    expect(armorClassBaseline(dexScore)).toBe(expectedAc);
  });
});

describe("applyRaceAbilityBonuses", () => {
  const baseScores = {
    strength: 15,
    dexterity: 14,
    constitution: 13,
    intelligence: 12,
    wisdom: 10,
    charisma: 8,
  };

  it("applies fixed ability bonuses from the race", () => {
    const dwarf: RaceDefinition = {
      id: "dwarf",
      name: "Dwarf",
      speed: 25,
      size: "Medium",
      abilityBonuses: { constitution: 2 },
      summary: "",
    };
    const result = applyRaceAbilityBonuses(baseScores, dwarf);
    expect(result.constitution).toBe(15);
    expect(result.strength).toBe(15); // unaffected
  });

  it("applies multiple fixed bonuses (e.g. Human +1 to all)", () => {
    const human: RaceDefinition = {
      id: "human",
      name: "Human",
      speed: 30,
      size: "Medium",
      abilityBonuses: {
        strength: 1,
        dexterity: 1,
        constitution: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
      },
      summary: "",
    };
    const result = applyRaceAbilityBonuses(baseScores, human);
    expect(result).toEqual({
      strength: 16,
      dexterity: 15,
      constitution: 14,
      intelligence: 13,
      wisdom: 11,
      charisma: 9,
    });
  });

  it("applies chosen bonus abilities on top of fixed bonuses (e.g. Half-Elf)", () => {
    const halfElf: RaceDefinition = {
      id: "half-elf",
      name: "Half-Elf",
      speed: 30,
      size: "Medium",
      abilityBonuses: { charisma: 2 },
      chooseAbilityBonus: { count: 2, amount: 1, excluding: ["charisma"] },
      summary: "",
    };
    const result = applyRaceAbilityBonuses(baseScores, halfElf, [
      "strength",
      "wisdom",
    ]);
    expect(result.charisma).toBe(10); // 8 + 2 fixed
    expect(result.strength).toBe(16); // 15 + 1 chosen
    expect(result.wisdom).toBe(11); // 10 + 1 chosen
    expect(result.dexterity).toBe(14); // untouched
  });

  it("does not mutate the input scores object", () => {
    const dwarf: RaceDefinition = {
      id: "dwarf",
      name: "Dwarf",
      speed: 25,
      size: "Medium",
      abilityBonuses: { constitution: 2 },
      summary: "",
    };
    const copy = { ...baseScores };
    applyRaceAbilityBonuses(baseScores, dwarf);
    expect(baseScores).toEqual(copy);
  });
});

describe("STANDARD_ARRAY", () => {
  it("is the classic 5e standard array", () => {
    expect(STANDARD_ARRAY).toEqual([15, 14, 13, 12, 10, 8]);
  });
});

function mockRandomSequence(values: number[]) {
  let i = 0;
  jest.spyOn(Math, "random").mockImplementation(() => {
    const value = values[i] ?? values[values.length - 1];
    i += 1;
    return value;
  });
}

describe("roll4d6DropLowest", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("drops the lowest die and sums the other three", () => {
    // d6 rolls from x=0,1/6,2/6,5/6 -> 1,2,3,6
    mockRandomSequence([0, 1 / 6, 2 / 6, 5 / 6]);
    const result = roll4d6DropLowest();
    expect(result.dice).toEqual([1, 2, 3, 6]);
    expect(result.dropped).toBe(1);
    expect(result.total).toBe(11); // 2 + 3 + 6
  });

  it("drops only one instance of the lowest value when there are ties", () => {
    // all four dice roll 1/6 -> value 2
    mockRandomSequence([1 / 6]);
    const result = roll4d6DropLowest();
    expect(result.dice).toEqual([2, 2, 2, 2]);
    expect(result.dropped).toBe(2);
    expect(result.total).toBe(6); // 2 + 2 + 2 (three of the four twos)
  });
});

describe("averageHpGain", () => {
  it("uses floor(hitDie/2)+1 plus the CON modifier", () => {
    expect(averageHpGain(8, 2)).toBe(7); // 4+1+2
  });

  it("floors at a minimum of 1 even with a very negative CON modifier", () => {
    expect(averageHpGain(6, -5)).toBe(1);
  });
});

describe("rollHpGain", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rolls the hit die and adds the CON modifier", () => {
    mockRandomSequence([0.5]); // d8 -> floor(0.5*8)+1 = 5
    const result = rollHpGain(8, 2);
    expect(result.roll).toBe(5);
    expect(result.total).toBe(7);
  });

  it("floors the total at a minimum of 1", () => {
    mockRandomSequence([0]); // d6 -> 1
    const result = rollHpGain(6, -5);
    expect(result.roll).toBe(1);
    expect(result.total).toBe(1);
  });
});
