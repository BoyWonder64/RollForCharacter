import { db } from "../../../db/client";
import { monsters } from "../../../db/schema";
import { createCharacter } from "../../characters/characterRepo";
import {
  addCustomDmCreature,
  addDmCreatureFromCatalog,
  clearAllInitiative,
  clearDmCreatures,
  deleteSavedEncounter,
  listDmCreatures,
  listPartyInitiative,
  listSavedEncounters,
  loadSavedEncounter,
  removeDmCreature,
  saveCurrentEncounter,
  setDmCreatureAbilityUses,
  setDmCreatureInitiative,
  setPartyInitiative,
  toggleDmCreatureCondition,
} from "../dmCreatureRepo";
import { parseUsedAbilities } from "../monsterRolls";

jest.mock("../../../db/client");

async function insertGoblin(): Promise<number> {
  const [row] = await db
    .insert(monsters)
    .values({ name: "Goblin", hitPoints: 7, hitDice: "2d6", armorClass: 15, dexterity: 14 })
    .returning({ id: monsters.id });
  return row.id;
}

describe("dmCreatureRepo", () => {
  beforeEach(async () => {
    await clearDmCreatures();
    await clearAllInitiative();
  });

  it("adds catalog creatures with stats copied over and numbers a group", async () => {
    const goblinId = await insertGoblin();
    const names = await addDmCreatureFromCatalog(goblinId, { quantity: 3 });
    expect(names).toEqual(["Goblin 1", "Goblin 2", "Goblin 3"]);

    const creatures = await listDmCreatures();
    expect(creatures).toHaveLength(3);
    expect(creatures[0]).toMatchObject({
      monsterId: goblinId,
      currentHp: 7,
      maxHp: 7,
      armorClass: 15,
      dexterity: 14,
    });
  });

  it("keeps a single creature unnumbered, then renumbers it when a second joins", async () => {
    const goblinId = await insertGoblin();
    expect(await addDmCreatureFromCatalog(goblinId)).toEqual(["Goblin"]);
    expect(await addDmCreatureFromCatalog(goblinId)).toEqual(["Goblin 2"]);
    const names = (await listDmCreatures()).map((c) => c.name);
    expect(names).toEqual(["Goblin 1", "Goblin 2"]);
  });

  it("rolls HP from hit dice when asked", async () => {
    const goblinId = await insertGoblin();
    await addDmCreatureFromCatalog(goblinId, { quantity: 10, rollHp: true });
    for (const creature of await listDmCreatures()) {
      expect(creature.maxHp).toBeGreaterThanOrEqual(2);
      expect(creature.maxHp).toBeLessThanOrEqual(12);
      expect(creature.currentHp).toBe(creature.maxHp);
    }
  });

  it("adds custom creatures with a dexterity", async () => {
    await addCustomDmCreature("Bandit", 11, 12, { dexterity: 12, quantity: 2 });
    const creatures = await listDmCreatures();
    expect(creatures.map((c) => c.name)).toEqual(["Bandit 1", "Bandit 2"]);
    expect(creatures[0]).toMatchObject({ monsterId: null, dexterity: 12 });
  });

  it("tracks initiative, conditions and limited-ability uses", async () => {
    await addCustomDmCreature("Ogre", 59, 11);
    const [ogre] = await listDmCreatures();

    await setDmCreatureInitiative(ogre.id, 17);
    await toggleDmCreatureCondition(ogre.id, "prone");
    await toggleDmCreatureCondition(ogre.id, "stunned");
    await toggleDmCreatureCondition(ogre.id, "prone");
    await setDmCreatureAbilityUses(ogre.id, "Slam", 2);

    const [updated] = await listDmCreatures();
    expect(updated.initiative).toBe(17);
    expect(updated.conditions).toBe("stunned");
    expect(parseUsedAbilities(updated.usedAbilities)).toEqual({ Slam: 2 });

    await setDmCreatureAbilityUses(ogre.id, "Slam", 0);
    expect((await listDmCreatures())[0].usedAbilities).toBe("");
  });

  it("stores party initiative and clears it with the creatures'", async () => {
    const hero = await createCharacter("DM Party Hero");
    await setPartyInitiative(hero.id, 12);
    await setPartyInitiative(hero.id, 15);
    expect(await listPartyInitiative()).toEqual({ [hero.id]: 15 });

    await addCustomDmCreature("Rat", 1, 10);
    const [rat] = await listDmCreatures();
    await setDmCreatureInitiative(rat.id, 4);

    await clearAllInitiative();
    expect(await listPartyInitiative()).toEqual({});
    expect((await listDmCreatures())[0].initiative).toBeNull();

    await setPartyInitiative(hero.id, 9);
    await setPartyInitiative(hero.id, null);
    expect(await listPartyInitiative()).toEqual({});
  });

  it("saves an encounter and loads it back at full health", async () => {
    const goblinId = await insertGoblin();
    await addDmCreatureFromCatalog(goblinId, { quantity: 2 });
    await addCustomDmCreature("Boss", 40, 16, { dexterity: 8 });
    const [first] = await listDmCreatures();
    await removeDmCreature(first.id);

    expect(await saveCurrentEncounter("Cave ambush")).not.toBeNull();
    await clearDmCreatures();
    expect(await saveCurrentEncounter("Empty")).toBeNull();

    const [saved] = await listSavedEncounters();
    expect(saved).toMatchObject({ name: "Cave ambush", creatureCount: 2 });

    await loadSavedEncounter(saved.id);
    const loaded = await listDmCreatures();
    expect(loaded.map((c) => c.name)).toEqual(["Goblin 2", "Boss"]);
    expect(loaded.every((c) => c.currentHp === c.maxHp && c.initiative === null)).toBe(true);
    expect(loaded[1].dexterity).toBe(8);

    await deleteSavedEncounter(saved.id);
    expect(await listSavedEncounters()).toEqual([]);
  });
});
