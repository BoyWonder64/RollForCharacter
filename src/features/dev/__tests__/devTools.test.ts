import { createCharacter, getCharacter, listCharacters, updateCharacter } from "../../characters/characterRepo";
import { addGearItem } from "../../characters/gearRepo";
import { listSpellSlots } from "../../spells/spellRepo";
import { buildCharacterDocument } from "../../sync/characterDocument";
import { createSampleCharacter, duplicateCharacter, rulesetWarnings, runDataHealthCheck } from "../devTools";

jest.mock("../../../db/client");

describe("duplicateCharacter", () => {
  it("copies the character and its children under a new name and sync id", async () => {
    const original = await createCharacter("Original");
    await updateCharacter(original.id, { syncId: "dev-original", race: "Dwarf", level: 3 });
    await addGearItem(original.id, { name: "Rope", quantity: 2, description: "" });

    const copyId = await duplicateCharacter(original.id);
    expect(copyId).toBeDefined();
    expect(copyId).not.toBe(original.id);

    const copy = await getCharacter(copyId!);
    expect(copy?.name).toBe("Original (Copy)");
    expect(copy?.race).toBe("Dwarf");
    expect(copy?.syncId).not.toBe("dev-original");
    expect((await buildCharacterDocument(copyId!))?.gearItems.map((g) => g.name)).toEqual(["Rope"]);
    // The original is untouched.
    expect((await getCharacter(original.id))?.name).toBe("Original");
  });

  it("returns undefined for a missing character", async () => {
    expect(await duplicateCharacter(999999)).toBeUndefined();
  });
});

describe("createSampleCharacter", () => {
  it("builds a level-5 wizard with real level-up results", async () => {
    const { characterId } = await createSampleCharacter("5e", 5, "wizard");
    const character = await getCharacter(characterId);
    expect(character?.level).toBe(5);
    expect(character?.className).toBe("Wizard");
    expect(character?.proficiencyBonus).toBe(3);
    expect(character!.maxHp).toBeGreaterThan(5);
    const slots = await listSpellSlots(characterId);
    expect(slots.length).toBeGreaterThan(0);
  });

  it("works for every ruleset's first class at level 1 and 20", async () => {
    for (const ruleset of ["5e", "5e-2024", "3.5e"]) {
      for (const level of [1, 20]) {
        const { characterId } = await createSampleCharacter(ruleset, level);
        expect((await getCharacter(characterId))?.level).toBe(level);
      }
    }
    expect((await listCharacters()).length).toBeGreaterThan(0);
  });
});

describe("data health check", () => {
  it("reports row counts and catalog warnings as lists", async () => {
    const report = await runDataHealthCheck();
    expect(report.counts.find((c) => c.label === "Characters")?.value).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(report.warnings)).toBe(true);
    expect(rulesetWarnings()).toEqual(report.warnings);
  });
});
