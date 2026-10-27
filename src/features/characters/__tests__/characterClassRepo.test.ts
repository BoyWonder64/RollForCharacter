import { createCharacterFromOnboarding, getCharacter, type OnboardingCharacterInput } from "../characterRepo";
import { addClass, levelUpClass, listCharacterClasses } from "../characterClassRepo";

jest.mock("../../../db/client");

function makeFighter(overrides: Partial<OnboardingCharacterInput> = {}) {
  return createCharacterFromOnboarding({
    name: "Multiclass Fighter",
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

describe("addClass", () => {
  it("lazily seeds the primary class row and adds the new class at level 1", async () => {
    const character = await makeFighter();

    const outcome = await addClass(character.id, "wizard", "Wizard", { hpMethod: "average" });

    // Wizard hit die 6, +2 CON: floor(6/2)+1+2 = 6
    expect(outcome).toMatchObject({ newLevel: 1, totalLevel: 5, hpGain: 6, proficiencyBonus: 3 });

    const rows = await listCharacterClasses(character.id);
    expect(rows).toMatchObject([
      { classId: "fighter", className: "Fighter", level: 4, sortOrder: 0 },
      { classId: "wizard", className: "Wizard", level: 1, sortOrder: 1 },
    ]);
  });

  it("syncs the character's total level, HP, and proficiency bonus mirror", async () => {
    const character = await makeFighter();
    await addClass(character.id, "wizard", "Wizard", { hpMethod: "average" });

    const updated = await getCharacter(character.id);
    expect(updated?.level).toBe(5);
    expect(updated?.maxHp).toBe(42); // 36 + 6
    expect(updated?.currentHp).toBe(42);
    expect(updated?.proficiencyBonus).toBe(3);
    // Primary class mirror stays the character's FIRST class (also the
    // RAW-correct one for 5e saving-throw proficiency).
    expect(updated?.className).toBe("Fighter");
  });

  it("applies a rolled HP gain instead of the average", async () => {
    const character = await makeFighter();
    // d6 roll: floor(Math.random()*6)+1 === 4, bucket midpoint
    jest.spyOn(Math, "random").mockReturnValue((4 - 0.5) / 6);

    const outcome = await addClass(character.id, "wizard", "Wizard", { hpMethod: "roll" });

    expect(outcome).toMatchObject({ roll: 4, hpGain: 6 }); // 4 + 2 CON
    jest.restoreAllMocks();
  });

  it("does nothing when the character already has that class", async () => {
    const character = await makeFighter();
    await addClass(character.id, "wizard", "Wizard", { hpMethod: "average" });

    const outcome = await addClass(character.id, "wizard", "Wizard", { hpMethod: "average" });

    expect(outcome).toBeUndefined();
    const rows = await listCharacterClasses(character.id);
    expect(rows).toHaveLength(2);
  });

  it("returns undefined for a character that does not exist", async () => {
    await expect(addClass(999999, "wizard", "Wizard", { hpMethod: "average" })).resolves.toBeUndefined();
  });
});

describe("levelUpClass", () => {
  it("levels up a non-primary class without touching the primary class mirror", async () => {
    const character = await makeFighter();
    await addClass(character.id, "wizard", "Wizard", { hpMethod: "manual" });

    const outcome = await levelUpClass(character.id, "wizard", { hpMethod: "manual" });

    expect(outcome).toMatchObject({ newLevel: 2, totalLevel: 6 });
    const rows = await listCharacterClasses(character.id);
    expect(rows.find((r) => r.classId === "wizard")).toMatchObject({ level: 2 });
    expect(rows.find((r) => r.classId === "fighter")).toMatchObject({ level: 4 });

    const updated = await getCharacter(character.id);
    expect(updated?.level).toBe(6);
    expect(updated?.className).toBe("Fighter");
    expect(updated?.subclass).toBe("");
  });

  it("updates the character's subclass mirror when the PRIMARY class levels into its subclass choice", async () => {
    const character = await makeFighter({ level: 2 }); // Fighter's subclass-choice level is 3
    await addClass(character.id, "wizard", "Wizard", { hpMethod: "manual" });

    const outcome = await levelUpClass(character.id, "fighter", {
      hpMethod: "manual",
      subclassId: "champion",
    });

    expect(outcome?.subclassChosen).toBe("champion");
    const updated = await getCharacter(character.id);
    expect(updated?.subclass).toBe("champion");
    expect(updated?.level).toBe(4); // Fighter 3 + Wizard 1
  });

  it("returns undefined for a class the character doesn't have", async () => {
    const character = await makeFighter();
    const outcome = await levelUpClass(character.id, "wizard", { hpMethod: "manual" });
    expect(outcome).toBeUndefined();
  });

  it("returns undefined for a character that does not exist", async () => {
    await expect(levelUpClass(999999, "fighter", { hpMethod: "manual" })).resolves.toBeUndefined();
  });
});
