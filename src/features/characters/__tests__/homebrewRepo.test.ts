import { createCharacter, getCharacter } from "../characterRepo";
import { getClassDefinitionForCharacter, getRaceDefinitionForCharacter } from "../characterCalculations";
import {
  createHomebrewClass,
  createHomebrewRace,
  createHomebrewSubclass,
  deleteHomebrewClass,
  deleteHomebrewRace,
  listHomebrewClasses,
  listHomebrewRaces,
  listHomebrewSubclasses,
  promoteInlineCustomClassToLibrary,
  promoteInlineCustomRaceToLibrary,
  setCharacterHomebrewClass,
  setCharacterHomebrewRace,
  setCharacterHomebrewSubclass,
  updateHomebrewClass,
  updateHomebrewRace,
} from "../homebrewRepo";

jest.mock("../../../db/client");

describe("homebrewRepo races", () => {
  it("creates a homebrew race, lists it, and picking it clones fields onto a character", async () => {
    const raceId = await createHomebrewRace("5e", {
      name: "Starborn",
      abilityBonuses: { wisdom: 2 },
      size: "Small",
      speed: 25,
      traits: [{ name: "Starlight", description: "See in dim light as if bright." }],
    });

    expect((await listHomebrewRaces("5e")).map((r) => r.name)).toContain("Starborn");

    const character = await createCharacter("Homebrew Race Owner");
    await setCharacterHomebrewRace(character.id, raceId);

    const updated = await getCharacter(character.id);
    expect(updated?.homebrewRaceId).toBe(raceId);
    expect(updated?.race).toBe("Starborn");

    const resolved = getRaceDefinitionForCharacter(updated!);
    expect(resolved).toMatchObject({ name: "Starborn", size: "Small", speed: 25 });
    expect(resolved.abilityBonuses).toEqual({ wisdom: 2 });
    expect(resolved.traits).toEqual([{ name: "Starlight", description: "See in dim light as if bright." }]);
  });

  it("editing a library race does not change a character that already took it", async () => {
    const raceId = await createHomebrewRace("5e", { name: "Edit Race", speed: 30 });
    const character = await createCharacter("Homebrew Race Edit Owner");
    await setCharacterHomebrewRace(character.id, raceId);

    await updateHomebrewRace(raceId, { name: "Edited Race", speed: 40 });

    const unchanged = await getCharacter(character.id);
    expect(unchanged?.race).toBe("Edit Race");
    const libraryEntry = (await listHomebrewRaces("5e")).find((r) => r.id === raceId);
    expect(libraryEntry).toMatchObject({ name: "Edited Race", speed: 40 });
  });

  it("deletes a homebrew race from the library", async () => {
    const raceId = await createHomebrewRace("5e", { name: "Delete Race" });
    await deleteHomebrewRace(raceId);
    expect((await listHomebrewRaces("5e")).find((r) => r.id === raceId)).toBeUndefined();
  });

  it("promotes a character's one-off custom race into a reusable library entry", async () => {
    const character = await createCharacter("Homebrew Race Promote");
    await setCharacterHomebrewRace(
      character.id,
      await createHomebrewRace("5e", { name: "Temp", abilityBonuses: { strength: 1 }, size: "Medium", speed: 35 })
    );
    const before = await getCharacter(character.id);

    const libraryId = await promoteInlineCustomRaceToLibrary(before!);
    const [promoted] = (await listHomebrewRaces("5e")).filter((r) => r.id === libraryId);
    expect(promoted).toMatchObject({ name: "Temp", size: "Medium", speed: 35 });
    expect(promoted.abilityBonuses).toEqual({ strength: 1 });
  });
});

describe("homebrewRepo classes", () => {
  it("creates a homebrew class, lists it, and picking it clones fields onto a character", async () => {
    const classId = await createHomebrewClass("5e", {
      name: "Runeblade",
      hitDie: 10,
      savingThrows: ["strength", "wisdom"],
      armorProficiencies: ["Light armor"],
      weaponProficiencies: ["Simple weapons", "Martial weapons"],
      traits: [{ name: "Rune Strike", description: "Deal extra force damage." }],
    });

    expect((await listHomebrewClasses("5e")).map((c) => c.name)).toContain("Runeblade");

    const character = await createCharacter("Homebrew Class Owner");
    await setCharacterHomebrewClass(character.id, classId);

    const updated = await getCharacter(character.id);
    expect(updated?.homebrewClassId).toBe(classId);
    expect(updated?.className).toBe("Runeblade");

    const resolved = getClassDefinitionForCharacter(updated!);
    expect(resolved).toMatchObject({ name: "Runeblade", hitDie: 10 });
    expect(resolved.savingThrows).toEqual(["strength", "wisdom"]);
    expect(resolved.armorProficiencies).toEqual(["Light armor"]);
    expect(resolved.weaponProficiencies).toEqual(["Simple weapons", "Martial weapons"]);
  });

  it("editing a library class does not change a character that already took it", async () => {
    const classId = await createHomebrewClass("5e", { name: "Edit Class", hitDie: 8 });
    const character = await createCharacter("Homebrew Class Edit Owner");
    await setCharacterHomebrewClass(character.id, classId);

    await updateHomebrewClass(classId, { name: "Edited Class", hitDie: 12 });

    const unchanged = await getCharacter(character.id);
    expect(unchanged?.className).toBe("Edit Class");
    const libraryEntry = (await listHomebrewClasses("5e")).find((c) => c.id === classId);
    expect(libraryEntry).toMatchObject({ name: "Edited Class", hitDie: 12 });
  });

  it("deletes a homebrew class from the library", async () => {
    const classId = await createHomebrewClass("5e", { name: "Delete Class" });
    await deleteHomebrewClass(classId);
    expect((await listHomebrewClasses("5e")).find((c) => c.id === classId)).toBeUndefined();
  });

  it("promotes a character's one-off custom class into a reusable library entry", async () => {
    const character = await createCharacter("Homebrew Class Promote");
    await setCharacterHomebrewClass(
      character.id,
      await createHomebrewClass("5e", { name: "Temp Class", hitDie: 6, savingThrows: ["dexterity", "intelligence"] })
    );
    const before = await getCharacter(character.id);

    const libraryId = await promoteInlineCustomClassToLibrary(before!);
    const [promoted] = (await listHomebrewClasses("5e")).filter((c) => c.id === libraryId);
    expect(promoted).toMatchObject({ name: "Temp Class", hitDie: 6 });
    expect(promoted.savingThrows).toEqual(["dexterity", "intelligence"]);
  });
});

describe("homebrewRepo subclasses", () => {
  it("creates a homebrew subclass, lists it filtered by parent class, and picking it sets the character's subclass", async () => {
    const subclassId = await createHomebrewSubclass("5e", {
      name: "Path of the Ember",
      parentClassId: "barbarian",
      traits: [{ name: "Ember Rage", description: "Deal fire damage while raging." }],
    });

    const forBarbarian = await listHomebrewSubclasses({ ruleset: "5e", parentClassId: "barbarian" });
    expect(forBarbarian.map((s) => s.name)).toEqual(["Path of the Ember"]);
    expect(await listHomebrewSubclasses({ ruleset: "5e", parentClassId: "wizard" })).toHaveLength(0);

    const character = await createCharacter("Homebrew Subclass Owner");
    await setCharacterHomebrewSubclass(character.id, subclassId);

    const updated = await getCharacter(character.id);
    expect(updated?.homebrewSubclassId).toBe(subclassId);
    expect(updated?.subclass).toBe("Path of the Ember");
  });
});
