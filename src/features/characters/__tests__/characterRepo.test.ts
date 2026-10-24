import {
  ABILITY_LABELS,
  abilityModifier,
  adjustHp,
  createCharacter,
  createCharacterFromOnboarding,
  deleteCharacter,
  getCharacter,
  listCharacters,
  updateCharacter,
  type OnboardingCharacterInput,
} from "../characterRepo";

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
