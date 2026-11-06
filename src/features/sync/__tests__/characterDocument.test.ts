import { addCampaignItem, addCampaignNote } from "../../characters/campaignRepo";
import { createCharacter, getCharacter, updateCharacter } from "../../characters/characterRepo";
import { addCustomFeat } from "../../characters/featRepo";
import { addArmorFromCatalog, addCustomWeapon, addGearItem, addWeaponFromCatalog } from "../../characters/gearRepo";
import { addCustomMagicItem } from "../../characters/magicItemRepo";
import { addCustomResource, setResourceOverride } from "../../characters/resourceRepo";
import { addSpellToCharacter, listSpellsForCharacter, setSpellSlot } from "../../spells/spellRepo";
import {
  applyCharacterDocument,
  buildCharacterDocument,
  createCharacterFromDocument,
  type CharacterDocument,
} from "../characterDocument";

jest.mock("../../../db/client");

let syncCount = 0;

/** A character with at least one row in most sync-managed child tables. */
async function makeFullCharacter(name: string) {
  const created = await createCharacter(name);
  await updateCharacter(created.id, {
    syncId: `doc-test-${++syncCount}`,
    race: "Dwarf",
    className: "Cleric",
    level: 5,
    maxHp: 38,
    currentHp: 21,
    wisdom: 16,
    notes: "Keeps a ledger of grudges.",
  });
  await setSpellSlot(created.id, 1, 4);
  await setSpellSlot(created.id, 2, 2);
  await addSpellToCharacter(created.id, "Doc Test Bless", 1);
  await addWeaponFromCatalog(created.id, "5e", "warhammer", { equipped: true });
  await addCustomWeapon(created.id, { name: "Grandfather's Axe", damageDice: "1d8", damageType: "slashing" });
  await addArmorFromCatalog(created.id, "5e", "chain-mail", { equipped: true });
  await addGearItem(created.id, { name: "Ale", quantity: 4, description: "Stout." });
  await addCampaignNote(created.id, { subject: "Oath", body: "Avenge the hold." });
  await addCampaignItem(created.id, { name: "Ancestor's ring", icon: "key", description: "" });
  await addCustomFeat((await getCharacter(created.id))!, {
    name: "Stone Skin",
    description: "Homebrew.",
    effects: [{ kind: "armorClassBonus", amount: 1 }],
  });
  await addCustomMagicItem(created.id, { name: "Lantern of Ancestors", rarity: "Uncommon" });
  await addCustomResource(created.id, {
    name: "Ancestral Call",
    description: "",
    maxMode: "fixed",
    fixedMax: 2,
    usesByLevel: {},
    ability: "wisdom",
    abilityBonus: 0,
    abilityMinimum: 1,
    rechargeOn: "long",
    isPointPool: false,
    icon: "",
    rollFormula: "1d6",
  });
  await setResourceOverride(created.id, "cleric-channel-divinity", { hidden: true, maxOverride: null });
  return (await getCharacter(created.id))!;
}

/** Children come back in insertion order; sort so documents compare regardless of row order. */
function normalize(doc: CharacterDocument | undefined): CharacterDocument {
  const sorted = JSON.parse(JSON.stringify(doc)) as CharacterDocument;
  for (const key of Object.keys(sorted) as (keyof CharacterDocument)[]) {
    const value = sorted[key];
    if (Array.isArray(value)) (value as unknown[]).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }
  return sorted;
}

describe("buildCharacterDocument", () => {
  it("returns undefined for an unknown character", async () => {
    expect(await buildCharacterDocument(999_999)).toBeUndefined();
  });

  it("leaves out the local-only identity fields", async () => {
    const character = await makeFullCharacter("Identity");
    const doc = (await buildCharacterDocument(character.id))!;
    for (const field of ["id", "syncId", "createdAt", "updatedAt"]) {
      expect(doc.character).not.toHaveProperty(field);
    }
    expect(doc.character).toMatchObject({ name: "Identity", race: "Dwarf", level: 5, currentHp: 21 });
  });

  it("collects every child table", async () => {
    const character = await makeFullCharacter("Collector");
    const doc = (await buildCharacterDocument(character.id))!;
    expect(doc.spellSlots).toEqual(
      expect.arrayContaining([
        { level: 1, total: 4, used: 0 },
        { level: 2, total: 2, used: 0 },
      ])
    );
    expect(doc.spells).toEqual([expect.objectContaining({ name: "Doc Test Bless", level: 1 })]);
    expect(doc.weapons.map((w) => w.name).sort()).toEqual(["Grandfather's Axe", "Warhammer"]);
    expect(doc.weapons.find((w) => w.name === "Warhammer")).toMatchObject({ catalogId: "warhammer", equipped: true });
    expect(doc.armor).toEqual([expect.objectContaining({ catalogId: "chain-mail", equipped: true })]);
    expect(doc.gearItems).toEqual([{ name: "Ale", quantity: 4, description: "Stout." }]);
    expect(doc.campaignNotes).toEqual([expect.objectContaining({ subject: "Oath", body: "Avenge the hold." })]);
    expect(doc.campaignItems).toEqual([{ name: "Ancestor's ring", icon: "key", description: "" }]);
    expect(doc.feats).toEqual([expect.objectContaining({ slug: null, name: "Stone Skin", enabled: true })]);
    expect(doc.magicItemsOwned).toEqual([expect.objectContaining({ slug: null, name: "Lantern of Ancestors" })]);
    expect(doc.customResources).toEqual([expect.objectContaining({ name: "Ancestral Call", rollFormula: "1d6" })]);
    expect(doc.resourceOverrides).toEqual([{ resourceId: "cleric-channel-divinity", hidden: true, maxOverride: null }]);
  });

  it("survives a JSON round trip unchanged (it's stored as JSON in the cloud)", async () => {
    const character = await makeFullCharacter("Json");
    const doc = await buildCharacterDocument(character.id);
    expect(JSON.parse(JSON.stringify(doc))).toEqual(doc);
  });
});

describe("createCharacterFromDocument", () => {
  it("recreates the character and every child row on a new local id", async () => {
    const original = await makeFullCharacter("Original");
    const doc = (await buildCharacterDocument(original.id))!;

    const copyId = await createCharacterFromDocument(JSON.parse(JSON.stringify(doc)), "pulled-sync-id");
    expect(copyId).not.toBe(original.id);

    const copy = (await getCharacter(copyId))!;
    expect(copy.syncId).toBe("pulled-sync-id");
    expect(normalize(await buildCharacterDocument(copyId))).toEqual(normalize(doc));
  });

  it("reuses the existing spell row instead of creating a duplicate", async () => {
    const original = await makeFullCharacter("Spell Reuse");
    const doc = (await buildCharacterDocument(original.id))!;
    const copyId = await createCharacterFromDocument(doc, "spell-reuse-copy");

    const [originalSpell] = await listSpellsForCharacter(original.id);
    const [copiedSpell] = await listSpellsForCharacter(copyId);
    expect(copiedSpell.id).toBeDefined();
    expect(copiedSpell.id).toBe(originalSpell.id);
  });

  it("creates a spell row for a spell this device has never seen", async () => {
    const original = await makeFullCharacter("New Spell");
    const doc = (await buildCharacterDocument(original.id))!;
    doc.spells = [{ slug: null, name: "Spell Only In The Cloud", level: 3, prepared: true }];

    const copyId = await createCharacterFromDocument(doc, "new-spell-copy");
    expect(await listSpellsForCharacter(copyId)).toEqual([
      expect.objectContaining({ name: "Spell Only In The Cloud", level: 3, prepared: true }),
    ]);
  });

  it("drops concentration, since the spell row it pointed at has a new id", async () => {
    const original = await makeFullCharacter("Concentrating");
    const doc = (await buildCharacterDocument(original.id))!;
    doc.character = { ...doc.character, concentratingSpellId: 12345 } as CharacterDocument["character"];

    const copyId = await createCharacterFromDocument(doc, "concentrating-copy");
    expect((await getCharacter(copyId))!.concentratingSpellId).toBeNull();
  });

  it("handles a bare character with no child rows", async () => {
    const bare = await createCharacter("Bare");
    const doc = (await buildCharacterDocument(bare.id))!;
    const copyId = await createCharacterFromDocument(doc, "bare-copy");
    expect(normalize(await buildCharacterDocument(copyId))).toEqual(normalize(doc));
  });
});

describe("applyCharacterDocument", () => {
  it("replaces the local character's fields and children with the document's", async () => {
    const local = await makeFullCharacter("Local");
    const remoteSource = await makeFullCharacter("Remote");
    await updateCharacter(remoteSource.id, { currentHp: 5, notes: "Changed elsewhere." });
    await addGearItem(remoteSource.id, { name: "Rope", quantity: 1 });
    const remoteDoc = (await buildCharacterDocument(remoteSource.id))!;

    await applyCharacterDocument(local.id, remoteDoc);

    const applied = (await buildCharacterDocument(local.id))!;
    expect(normalize(applied)).toEqual(normalize(remoteDoc));
    const row = (await getCharacter(local.id))!;
    expect(row.syncId).toBe(local.syncId);
    expect(row).toMatchObject({ name: "Remote", currentHp: 5, notes: "Changed elsewhere." });
  });

  it("removes child rows the document no longer has", async () => {
    const local = await makeFullCharacter("Shrinking");
    const empty = await createCharacter("Empty Source");
    const emptyDoc = (await buildCharacterDocument(empty.id))!;

    await applyCharacterDocument(local.id, emptyDoc);
    const after = (await buildCharacterDocument(local.id))!;
    for (const key of Object.keys(after) as (keyof CharacterDocument)[]) {
      if (Array.isArray(after[key])) expect({ key, rows: after[key] }).toEqual({ key, rows: [] });
    }
  });

  it("doesn't touch other characters' rows", async () => {
    const bystander = await makeFullCharacter("Bystander");
    const before = normalize(await buildCharacterDocument(bystander.id));
    const target = await makeFullCharacter("Target");
    const empty = await createCharacter("Empty Again");

    await applyCharacterDocument(target.id, (await buildCharacterDocument(empty.id))!);
    expect(normalize(await buildCharacterDocument(bystander.id))).toEqual(before);
  });
});
