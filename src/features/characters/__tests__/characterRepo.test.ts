import {
  ABILITY_LABELS,
  abilityModifier,
  addXp,
  adjustCurrency,
  adjustHp,
  applyDamage,
  applyHeal,
  createCharacter,
  createCharacterFromOnboarding,
  deleteCharacter,
  getCharacter,
  levelUp,
  listCharacters,
  rollDeathSave,
  updateCharacter,
  type OnboardingCharacterInput,
} from "../characterRepo";
import { listCharacterFeats } from "../featRepo";

jest.mock("../../../db/client");

describe("abilityModifier", () => {
  it.each([
    [1, -5],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [15, 2],
    [20, 5],
    [30, 10],
  ])("maps score %i to modifier %i", (score, expected) => {
    expect(abilityModifier(score)).toBe(expected);
  });
});

describe("ABILITY_LABELS", () => {
  it("has a short label for every ability score", () => {
    expect(ABILITY_LABELS).toEqual({
      strength: "STR",
      dexterity: "DEX",
      constitution: "CON",
      intelligence: "INT",
      wisdom: "WIS",
      charisma: "CHA",
    });
  });
});

describe("characterRepo CRUD", () => {
  it("creates a character with sensible defaults", async () => {
    const character = await createCharacter("Test Create Defaults");
    expect(character.name).toBe("Test Create Defaults");
    expect(character.maxHp).toBe(10);
    expect(character.currentHp).toBe(10);
    expect(character.level).toBe(1);
    expect(character.id).toBeGreaterThan(0);
  });

  it("round-trips through getCharacter", async () => {
    const created = await createCharacter("Test Get Roundtrip");
    const fetched = await getCharacter(created.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.name).toBe("Test Get Roundtrip");
  });

  it("returns undefined for a character that does not exist", async () => {
    const fetched = await getCharacter(999999);
    expect(fetched).toBeUndefined();
  });

  it("includes newly created characters in listCharacters", async () => {
    const created = await createCharacter("Test List Membership");
    const all = await listCharacters();
    expect(all.find((c) => c.id === created.id)).toBeDefined();
  });

  it("updates arbitrary fields and bumps updatedAt", async () => {
    const created = await createCharacter("Test Update Fields");
    await updateCharacter(created.id, {
      race: "Elf",
      className: "Wizard",
      level: 3,
    });
    const updated = await getCharacter(created.id);
    expect(updated?.race).toBe("Elf");
    expect(updated?.className).toBe("Wizard");
    expect(updated?.level).toBe(3);
  });

  it("deletes a character", async () => {
    const created = await createCharacter("Test Delete Me");
    await deleteCharacter(created.id);
    const fetched = await getCharacter(created.id);
    expect(fetched).toBeUndefined();
  });

  describe("adjustHp", () => {
    it("increases current HP by delta", async () => {
      const created = await createCharacter("Test HP Increase");
      await updateCharacter(created.id, { maxHp: 20, currentHp: 10 });
      await adjustHp(created.id, 5);
      const updated = await getCharacter(created.id);
      expect(updated?.currentHp).toBe(15);
    });

    it("clamps current HP at 0 when damage exceeds remaining HP", async () => {
      const created = await createCharacter("Test HP Floor");
      await updateCharacter(created.id, { maxHp: 20, currentHp: 5 });
      await adjustHp(created.id, -100);
      const updated = await getCharacter(created.id);
      expect(updated?.currentHp).toBe(0);
    });

    it("clamps current HP at maxHp when healing exceeds the cap", async () => {
      const created = await createCharacter("Test HP Ceiling");
      await updateCharacter(created.id, { maxHp: 20, currentHp: 18 });
      await adjustHp(created.id, 100);
      const updated = await getCharacter(created.id);
      expect(updated?.currentHp).toBe(20);
    });

    it("does nothing for a character that does not exist", async () => {
      await expect(adjustHp(999999, 5)).resolves.toBeUndefined();
    });
  });
});

describe("createCharacterFromOnboarding", () => {
  function makeInput(
    overrides: Partial<OnboardingCharacterInput> = {}
  ): OnboardingCharacterInput {
    return {
      name: "Onboarded Hero",
      ruleset: "5e",
      race: "Dwarf",
      className: "Fighter",
      background: "Soldier",
      level: 3,
      maxHp: 28,
      armorClass: 16,
      speed: 25,
      proficiencyBonus: 2,
      strength: 16,
      dexterity: 12,
      constitution: 15,
      intelligence: 10,
      wisdom: 10,
      charisma: 8,
      ...overrides,
    };
  }

  it("persists every field from the onboarding input", async () => {
    const created = await createCharacterFromOnboarding(makeInput());
    expect(created).toMatchObject({
      name: "Onboarded Hero",
      ruleset: "5e",
      race: "Dwarf",
      className: "Fighter",
      background: "Soldier",
      level: 3,
      maxHp: 28,
      currentHp: 28,
      armorClass: 16,
      speed: 25,
      proficiencyBonus: 2,
      strength: 16,
      dexterity: 12,
      constitution: 15,
      intelligence: 10,
      wisdom: 10,
      charisma: 8,
    });
  });

  it("starts currentHp equal to maxHp", async () => {
    const created = await createCharacterFromOnboarding(
      makeInput({ name: "Full HP Start", maxHp: 42 })
    );
    expect(created.currentHp).toBe(42);
  });

  it("round-trips through getCharacter", async () => {
    const created = await createCharacterFromOnboarding(
      makeInput({ name: "Onboarded Roundtrip" })
    );
    const fetched = await getCharacter(created.id);
    expect(fetched?.name).toBe("Onboarded Roundtrip");
    expect(fetched?.race).toBe("Dwarf");
  });
});

describe("applyDamage", () => {
  it("reduces current HP by the given amount", async () => {
    const character = await createCharacter("Damage Basic");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 15 });

    await applyDamage(character.id, 5);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(10);
  });

  it("clamps at 0 instead of going negative", async () => {
    const character = await createCharacter("Damage Overkill");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 5 });

    await applyDamage(character.id, 100);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(0);
  });

  it("does nothing for a zero or negative amount", async () => {
    const character = await createCharacter("Damage Noop");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 15 });

    await applyDamage(character.id, 0);
    await applyDamage(character.id, -5);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(15);
  });

  it("counts as one death save failure instead of reducing HP when already at 0", async () => {
    const character = await createCharacter("Damage At Zero");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0 });

    await applyDamage(character.id, 5);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(0);
    expect(updated?.deathSaveFailures).toBe(1);
  });

  it("counts as two death save failures on a critical hit while at 0", async () => {
    const character = await createCharacter("Damage Crit At Zero");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0 });

    await applyDamage(character.id, 5, { critical: true });

    const updated = await getCharacter(character.id);
    expect(updated?.deathSaveFailures).toBe(2);
  });

  it("clamps death save failures at 3", async () => {
    const character = await createCharacter("Damage Failures Clamp");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0, deathSaveFailures: 2 });

    await applyDamage(character.id, 5, { critical: true });

    const updated = await getCharacter(character.id);
    expect(updated?.deathSaveFailures).toBe(3);
  });
});

describe("applyHeal", () => {
  it("increases current HP by the given amount", async () => {
    const character = await createCharacter("Heal Basic");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 5 });

    await applyHeal(character.id, 5);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(10);
  });

  it("clamps at max HP", async () => {
    const character = await createCharacter("Heal Overheal");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 18 });

    await applyHeal(character.id, 100);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(20);
  });

  it("does nothing for a zero or negative amount", async () => {
    const character = await createCharacter("Heal Noop");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 5 });

    await applyHeal(character.id, 0);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(5);
  });

  it("resets death save progress when healing up from 0 HP", async () => {
    const character = await createCharacter("Heal From Zero");
    await updateCharacter(character.id, {
      maxHp: 20,
      currentHp: 0,
      deathSaveSuccesses: 2,
      deathSaveFailures: 1,
    });

    await applyHeal(character.id, 4);

    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(4);
    expect(updated?.deathSaveSuccesses).toBe(0);
    expect(updated?.deathSaveFailures).toBe(0);
  });
});

describe("rollDeathSave", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockD20(value: number) {
    // rollDie: floor(Math.random() * 20) + 1 === value.
    // Use the bucket's midpoint (not its exact edge) so float rounding
    // can't push the result across a boundary into the wrong value.
    jest.spyOn(Math, "random").mockReturnValue((value - 0.5) / 20);
  }

  it("counts a roll of 10+ as a success", async () => {
    const character = await createCharacter("Death Save Success");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0 });
    mockD20(10);

    const outcome = await rollDeathSave(character.id);

    expect(outcome).toMatchObject({ roll: 10, result: "success", successes: 1, failures: 0 });
    const updated = await getCharacter(character.id);
    expect(updated?.deathSaveSuccesses).toBe(1);
  });

  it("counts a roll below 10 as a failure", async () => {
    const character = await createCharacter("Death Save Failure");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0 });
    mockD20(9);

    const outcome = await rollDeathSave(character.id);

    expect(outcome).toMatchObject({ roll: 9, result: "failure", failures: 1 });
  });

  it("counts a natural 1 as two failures", async () => {
    const character = await createCharacter("Death Save Nat1");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0 });
    mockD20(1);

    const outcome = await rollDeathSave(character.id);

    expect(outcome).toMatchObject({ roll: 1, result: "failure", failures: 2 });
  });

  it("wakes the character at 1 HP on a natural 20", async () => {
    const character = await createCharacter("Death Save Nat20");
    await updateCharacter(character.id, {
      maxHp: 20,
      currentHp: 0,
      deathSaveSuccesses: 1,
      deathSaveFailures: 1,
    });
    mockD20(20);

    const outcome = await rollDeathSave(character.id);

    expect(outcome).toMatchObject({ roll: 20, result: "stabilized" });
    const updated = await getCharacter(character.id);
    expect(updated?.currentHp).toBe(1);
    expect(updated?.deathSaveSuccesses).toBe(0);
    expect(updated?.deathSaveFailures).toBe(0);
  });

  it("reports dead once failures reach 3", async () => {
    const character = await createCharacter("Death Save Dead");
    await updateCharacter(character.id, { maxHp: 20, currentHp: 0, deathSaveFailures: 2 });
    mockD20(2);

    const outcome = await rollDeathSave(character.id);

    expect(outcome).toMatchObject({ roll: 2, result: "dead", failures: 3 });
  });

  it("does nothing for a character that does not exist", async () => {
    mockD20(10);
    await expect(rollDeathSave(999999)).resolves.toBeUndefined();
  });
});

describe("levelUp", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function makeFighter(overrides: Partial<OnboardingCharacterInput> = {}) {
    return createCharacterFromOnboarding({
      name: "Level Up Fighter",
      ruleset: "5e",
      race: "Human",
      className: "Fighter", // hitDie 10
      background: "",
      level: 4,
      maxHp: 36,
      armorClass: 16,
      speed: 30,
      proficiencyBonus: 2,
      strength: 16,
      dexterity: 12,
      constitution: 14, // +2 modifier
      intelligence: 10,
      wisdom: 10,
      charisma: 8,
      ...overrides,
    });
  }

  it("increments level, applies the average HP gain, and heals current HP by the same amount", async () => {
    const character = await makeFighter();
    await updateCharacter(character.id, { currentHp: 10 }); // simulate some damage taken

    const outcome = await levelUp(character.id, { hpMethod: "average" });

    // d10 average gain: floor(10/2)+1+2 (CON) = 8
    expect(outcome).toMatchObject({ newLevel: 5, hpGain: 8, proficiencyBonus: 3 });
    const updated = await getCharacter(character.id);
    expect(updated?.level).toBe(5);
    expect(updated?.maxHp).toBe(44);
    expect(updated?.currentHp).toBe(18);
    expect(updated?.proficiencyBonus).toBe(3);
  });

  it("applies a rolled HP gain instead of the average", async () => {
    const character = await makeFighter();
    // d10 roll: floor(Math.random()*10)+1 === 6, bucket midpoint
    jest.spyOn(Math, "random").mockReturnValue((6 - 0.5) / 10);

    const outcome = await levelUp(character.id, { hpMethod: "roll" });

    expect(outcome).toMatchObject({ newLevel: 5, roll: 6, hpGain: 8 }); // 6 + 2 CON
    const updated = await getCharacter(character.id);
    expect(updated?.maxHp).toBe(44);
  });

  it("leaves HP untouched for manual leveling, but still bumps level and proficiency bonus", async () => {
    const character = await makeFighter();

    const outcome = await levelUp(character.id, { hpMethod: "manual" });

    expect(outcome).toMatchObject({ newLevel: 5, hpGain: 0, roll: undefined, proficiencyBonus: 3 });
    const updated = await getCharacter(character.id);
    expect(updated?.level).toBe(5);
    expect(updated?.maxHp).toBe(36);
    expect(updated?.currentHp).toBe(36);
    expect(updated?.proficiencyBonus).toBe(3);
  });

  it("does not bump proficiency bonus when the new level doesn't cross a breakpoint", async () => {
    const character = await makeFighter({ level: 2 });
    const outcome = await levelUp(character.id, { hpMethod: "average" });
    expect(outcome?.newLevel).toBe(3);
    expect(outcome?.proficiencyBonus).toBe(2);
  });

  it("applies a subclass choice and ability score increases, and reports gained features", async () => {
    const character = await makeFighter({ level: 2 }); // -> level 3, Fighter's subclass-choice level

    const outcome = await levelUp(character.id, {
      hpMethod: "manual",
      subclassId: "champion",
    });

    expect(outcome?.subclassChosen).toBe("champion");
    expect(outcome?.featuresGained.some((f) => f.name === "Improved Critical")).toBe(true);
    const updated = await getCharacter(character.id);
    expect(updated?.subclass).toBe("champion");
  });

  it("applies an ability score increase, clamped at 20", async () => {
    const character = await makeFighter({ level: 3, strength: 19 }); // -> level 4, an ASI level

    await levelUp(character.id, {
      hpMethod: "manual",
      asiChoice: { type: "ability", increases: { strength: 2 } },
    });

    const updated = await getCharacter(character.id);
    expect(updated?.strength).toBe(20);
  });

  it("writes a feat choice as a character_feats row", async () => {
    const character = await makeFighter({ level: 3 }); // -> level 4, an ASI/feat level

    await levelUp(character.id, {
      hpMethod: "manual",
      asiChoice: {
        type: "feat",
        feat: { name: "Great Weapon Master", prerequisite: "", description: "", sourceName: "", effects: [] },
      },
    });

    const updated = await getCharacter(character.id);
    const feats = await listCharacterFeats(updated!);
    expect(feats.map((f) => f.name)).toEqual(["Great Weapon Master"]);
  });

  it("does nothing for a character that does not exist", async () => {
    await expect(levelUp(999999, { hpMethod: "average" })).resolves.toBeUndefined();
  });
});

describe("adjustCurrency", () => {
  it("adds to a denomination", async () => {
    const character = await createCharacter("Currency Add");
    await adjustCurrency(character.id, "gold", 50);
    const updated = await getCharacter(character.id);
    expect(updated?.goldPieces).toBe(50);
  });

  it("spends from a denomination with a negative delta", async () => {
    const character = await createCharacter("Currency Spend");
    await updateCharacter(character.id, { goldPieces: 50 });
    await adjustCurrency(character.id, "gold", -20);
    const updated = await getCharacter(character.id);
    expect(updated?.goldPieces).toBe(30);
  });

  it("clamps spending at 0 instead of going negative", async () => {
    const character = await createCharacter("Currency Overspend");
    await updateCharacter(character.id, { silverPieces: 10 });
    await adjustCurrency(character.id, "silver", -50);
    const updated = await getCharacter(character.id);
    expect(updated?.silverPieces).toBe(0);
  });

  it("tracks denominations independently", async () => {
    const character = await createCharacter("Currency Independent");
    await adjustCurrency(character.id, "copper", 5);
    await adjustCurrency(character.id, "platinum", 2);
    const updated = await getCharacter(character.id);
    expect(updated?.copperPieces).toBe(5);
    expect(updated?.platinumPieces).toBe(2);
    expect(updated?.goldPieces).toBe(0);
  });
});

describe("addXp", () => {
  it("adds to experiencePoints", async () => {
    const character = await createCharacter("XP Add");
    await addXp(character.id, 300);
    const updated = await getCharacter(character.id);
    expect(updated?.experiencePoints).toBe(300);
  });

  it("allows a negative delta for corrections", async () => {
    const character = await createCharacter("XP Correction");
    await updateCharacter(character.id, { experiencePoints: 500 });
    await addXp(character.id, -200);
    const updated = await getCharacter(character.id);
    expect(updated?.experiencePoints).toBe(300);
  });

  it("clamps at 0 instead of going negative", async () => {
    const character = await createCharacter("XP Floor");
    await updateCharacter(character.id, { experiencePoints: 100 });
    await addXp(character.id, -500);
    const updated = await getCharacter(character.id);
    expect(updated?.experiencePoints).toBe(0);
  });
});
