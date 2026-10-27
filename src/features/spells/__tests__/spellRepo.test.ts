import { createCharacter } from "../../characters/characterRepo";
import {
  addCatalogSpellToCharacter,
  addSpellToCharacter,
  adjustSpellSlotUsage,
  listSpellCatalog,
  listSpellSlots,
  listSpellsForCharacter,
  removeCharacterSpell,
  setSpellSlot,
  togglePrepared,
} from "../spellRepo";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "../../../db/client";
import { spells } from "../../../db/schema";

jest.mock("../../../db/client");

async function makeCharacter(name: string) {
  return createCharacter(name);
}

async function makeCatalogSpell(overrides: Partial<InferInsertModel<typeof spells>> = {}) {
  const rows = await db
    .insert(spells)
    .values({
      name: "Catalog Test Spell",
      level: 1,
      school: "Evocation",
      classes: "wizard",
      ...overrides,
    })
    .returning();
  return rows[0];
}

describe("spellRepo spells", () => {
  it("adds a spell to a character and lists it", async () => {
    const character = await makeCharacter("Spell List Owner");
    await addSpellToCharacter(character.id, "Fireball", 3);

    const spells = await listSpellsForCharacter(character.id);
    expect(spells).toHaveLength(1);
    expect(spells[0]).toMatchObject({
      name: "Fireball",
      level: 3,
      prepared: false,
    });
  });

  it("reuses an existing spell row instead of duplicating the catalog entry", async () => {
    const characterA = await makeCharacter("Spell Reuse A");
    const characterB = await makeCharacter("Spell Reuse B");

    await addSpellToCharacter(characterA.id, "Shield", 1);
    await addSpellToCharacter(characterB.id, "Shield", 1);

    const spellsA = await listSpellsForCharacter(characterA.id);
    const spellsB = await listSpellsForCharacter(characterB.id);

    expect(spellsA[0].id).toBe(spellsB[0].id);
  });

  it("only lists spells belonging to the requested character", async () => {
    const characterA = await makeCharacter("Spell Scope A");
    const characterB = await makeCharacter("Spell Scope B");

    await addSpellToCharacter(characterA.id, "Magic Missile", 1);
    await addSpellToCharacter(characterB.id, "Cure Wounds", 1);

    const spellsA = await listSpellsForCharacter(characterA.id);
    expect(spellsA.map((s) => s.name)).toEqual(["Magic Missile"]);
  });

  it("toggles prepared state", async () => {
    const character = await makeCharacter("Spell Prepared Toggle");
    await addSpellToCharacter(character.id, "Mage Armor", 1);
    const [spell] = await listSpellsForCharacter(character.id);

    await togglePrepared(spell.characterSpellId, true);
    const afterPrepare = await listSpellsForCharacter(character.id);
    expect(afterPrepare[0].prepared).toBe(true);

    await togglePrepared(spell.characterSpellId, false);
    const afterUnprepare = await listSpellsForCharacter(character.id);
    expect(afterUnprepare[0].prepared).toBe(false);
  });

  it("removes a spell from a character", async () => {
    const character = await makeCharacter("Spell Remove Target");
    await addSpellToCharacter(character.id, "Thunderwave", 1);
    const [spell] = await listSpellsForCharacter(character.id);

    await removeCharacterSpell(spell.characterSpellId);
    const remaining = await listSpellsForCharacter(character.id);
    expect(remaining).toHaveLength(0);
  });
});

describe("spellRepo catalog", () => {
  it("lists catalog spells filtered by class", async () => {
    await makeCatalogSpell({ name: "Catalog Wizard Spell", classes: "wizard" });
    await makeCatalogSpell({ name: "Catalog Cleric Spell", classes: "cleric" });
    await makeCatalogSpell({ name: "Catalog Multi Spell", classes: "cleric,wizard" });

    const wizardSpells = await listSpellCatalog({ classId: "wizard" });
    const names = wizardSpells.map((s) => s.name);
    expect(names).toContain("Catalog Wizard Spell");
    expect(names).toContain("Catalog Multi Spell");
    expect(names).not.toContain("Catalog Cleric Spell");
  });

  it("filters catalog spells by case-insensitive search text", async () => {
    await makeCatalogSpell({ name: "Catalog Fireball Variant" });

    const results = await listSpellCatalog({ search: "fireball variant" });
    expect(results.map((s) => s.name)).toContain("Catalog Fireball Variant");
  });

  it("filters catalog spells by level", async () => {
    await makeCatalogSpell({ name: "Catalog Level One", level: 1 });
    await makeCatalogSpell({ name: "Catalog Level Two", level: 2 });

    const results = await listSpellCatalog({ level: 1 });
    const names = results.map((s) => s.name);
    expect(names).toContain("Catalog Level One");
    expect(names).not.toContain("Catalog Level Two");
  });

  it("combines class and search filters", async () => {
    await makeCatalogSpell({ name: "Catalog Combo Match", classes: "druid" });
    await makeCatalogSpell({ name: "Catalog Combo Mismatch Class", classes: "wizard" });
    await makeCatalogSpell({ name: "Catalog Other Name", classes: "druid" });

    const results = await listSpellCatalog({ classId: "druid", search: "combo" });
    expect(results.map((s) => s.name)).toEqual(["Catalog Combo Match"]);
  });

  it("adds a catalog spell directly to a character by id", async () => {
    const character = await makeCharacter("Catalog Add Target");
    const catalogSpell = await makeCatalogSpell({ name: "Catalog Add Spell" });

    await addCatalogSpellToCharacter(character.id, catalogSpell.id);

    const characterSpells = await listSpellsForCharacter(character.id);
    expect(characterSpells).toHaveLength(1);
    expect(characterSpells[0]).toMatchObject({
      name: "Catalog Add Spell",
      prepared: false,
    });
  });
});

describe("spellRepo spell slots", () => {
  it("creates a slot on first use", async () => {
    const character = await makeCharacter("Slot Create");
    await setSpellSlot(character.id, 1, 4);

    const slots = await listSpellSlots(character.id);
    expect(slots).toHaveLength(1);
    expect(slots[0]).toMatchObject({ level: 1, total: 4, used: 0 });
  });

  it("updates total on an existing slot instead of duplicating it", async () => {
    const character = await makeCharacter("Slot Update");
    await setSpellSlot(character.id, 2, 2);
    await setSpellSlot(character.id, 2, 3);

    const slots = await listSpellSlots(character.id);
    expect(slots).toHaveLength(1);
    expect(slots[0].total).toBe(3);
  });

  it("tracks slots independently per level", async () => {
    const character = await makeCharacter("Slot Per Level");
    await setSpellSlot(character.id, 1, 4);
    await setSpellSlot(character.id, 2, 3);

    const slots = await listSpellSlots(character.id);
    expect(slots.map((s) => [s.level, s.total])).toEqual([
      [1, 4],
      [2, 3],
    ]);
  });

  it("increments used when spending a slot, clamped to total", async () => {
    const character = await makeCharacter("Slot Use Clamp High");
    await setSpellSlot(character.id, 1, 2);
    const [slot] = await listSpellSlots(character.id);

    await adjustSpellSlotUsage(slot.id, 1);
    await adjustSpellSlotUsage(slot.id, 1);
    await adjustSpellSlotUsage(slot.id, 1); // one more than total

    const slots = await listSpellSlots(character.id);
    expect(slots[0].used).toBe(2);
  });

  it("clamps used at 0 when freeing more slots than are in use", async () => {
    const character = await makeCharacter("Slot Use Clamp Low");
    await setSpellSlot(character.id, 1, 2);
    const [slot] = await listSpellSlots(character.id);

    await adjustSpellSlotUsage(slot.id, 1);
    await adjustSpellSlotUsage(slot.id, -5);

    const slots = await listSpellSlots(character.id);
    expect(slots[0].used).toBe(0);
  });

  it("does nothing when using a slot that does not exist", async () => {
    await expect(adjustSpellSlotUsage(999999, 1)).resolves.toBeUndefined();
  });
});
