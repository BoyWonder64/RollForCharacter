import { addCampaignNote } from "../../characters/campaignRepo";
import { createCharacter, updateCharacter } from "../../characters/characterRepo";
import { addArmorFromCatalog, addGearItem, addWeaponFromCatalog } from "../../characters/gearRepo";
import { addSpellToCharacter } from "../../spells/spellRepo";
import { DEFAULT_PARTY_VISIBILITY, PARTY_VISIBILITY_SECTIONS, buildPartySnapshot } from "../partySnapshot";

jest.mock("../../../db/client");

const ALL = { stats: true, inventory: true, spells: true, notes: true };
const NONE = { stats: false, inventory: false, spells: false, notes: false };

let heroCount = 0;

async function makeHero() {
  const syncId = `party-hero-${++heroCount}`;
  const hero = await createCharacter("Party Hero");
  await updateCharacter(hero.id, {
    syncId,
    race: "Elf",
    className: "Wizard",
    level: 3,
    maxHp: 20,
    currentHp: 14,
    armorClass: 12,
    dexterity: 14,
    intelligence: 17,
    conditions: "poisoned,prone",
    inspiration: true,
    notes: "Afraid of geese.",
  });
  await addWeaponFromCatalog(hero.id, "5e", "dagger", { equipped: true });
  await addArmorFromCatalog(hero.id, "5e", "leather");
  await addGearItem(hero.id, { name: "Torch", quantity: 3 });
  await addSpellToCharacter(hero.id, "Party Test Spell", 1);
  await addCampaignNote(hero.id, { subject: "Secret", body: "I stole the crown." });
  return { ...hero, syncId };
}

describe("buildPartySnapshot", () => {
  it("defaults to sharing only stats", () => {
    expect(DEFAULT_PARTY_VISIBILITY).toEqual({ stats: true, inventory: false, spells: false, notes: false });
    expect(PARTY_VISIBILITY_SECTIONS.map((s) => s.key).sort()).toEqual(["inventory", "notes", "spells", "stats"]);
  });

  it("returns undefined for an unknown character", async () => {
    expect(await buildPartySnapshot(999_999, ALL)).toBeUndefined();
  });

  it("returns undefined for a character with no sync id", async () => {
    const hero = await createCharacter("Unsynced");
    await updateCharacter(hero.id, { syncId: null });
    expect(await buildPartySnapshot(hero.id, ALL)).toBeUndefined();
  });

  it("identifies the character by its sync id, not its local id", async () => {
    const hero = await makeHero();
    expect(await buildPartySnapshot(hero.id, NONE)).toEqual({
      characterSyncId: hero.syncId,
      name: "Party Hero",
      race: "Elf",
      className: "Wizard",
      level: 3,
      visibility: NONE,
      data: {},
    });
  });

  it("shares only the sections that are turned on", async () => {
    const hero = await makeHero();
    const snapshot = await buildPartySnapshot(hero.id, DEFAULT_PARTY_VISIBILITY);
    expect(Object.keys(snapshot!.data)).toEqual(["stats"]);
    expect(JSON.stringify(snapshot)).not.toContain("stole the crown");
    expect(JSON.stringify(snapshot)).not.toContain("Afraid of geese");
    expect(JSON.stringify(snapshot)).not.toContain("Torch");
    expect(JSON.stringify(snapshot)).not.toContain("Party Test Spell");
  });

  it("builds the stats section", async () => {
    const hero = await makeHero();
    const { stats } = (await buildPartySnapshot(hero.id, ALL))!.data;
    expect(stats).toMatchObject({
      maxHp: 20,
      currentHp: 14,
      armorClass: 12,
      conditions: ["poisoned", "prone"],
      inspiration: true,
    });
    expect(stats!.abilities.intelligence).toBe(17);
    expect(stats!.modifiers.intelligence).toBe(3);
    expect(stats!.modifiers.dexterity).toBe(2);
  });

  it("builds the inventory, spells and notes sections", async () => {
    const hero = await makeHero();
    const { inventory, spells, notes } = (await buildPartySnapshot(hero.id, ALL))!.data;
    expect(inventory).toEqual({
      weapons: [{ name: "Dagger", equipped: true }],
      armor: [{ name: "Leather", equipped: false }],
      gear: [{ name: "Torch", quantity: 3 }],
    });
    expect(spells!.spells).toEqual([expect.objectContaining({ name: "Party Test Spell", level: 1 })]);
    expect(notes!.characterNotes).toBe("Afraid of geese.");
    expect(notes!.journal).toEqual([expect.objectContaining({ subject: "Secret", body: "I stole the crown." })]);
  });
});
