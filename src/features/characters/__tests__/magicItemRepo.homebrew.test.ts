import { createCharacter } from "../characterRepo";
import {
  addMagicItemFromCatalog,
  createHomebrewMagicItem,
  deleteHomebrewMagicItem,
  listCharacterMagicItems,
  listMagicItemCatalog,
  updateHomebrewMagicItem,
} from "../magicItemRepo";
import { db } from "../../../db/client";
import { magicItems } from "../../../db/schema";

jest.mock("../../../db/client");

describe("magicItemRepo homebrew library", () => {
  it("creates a homebrew magic item, visible in the catalog, and usable like a seeded one", async () => {
    const id = await createHomebrewMagicItem({
      name: "Amulet of Library Making",
      category: "Wondrous item",
      rarity: "Rare",
      requiresAttunement: true,
    });

    const catalog = await listMagicItemCatalog();
    expect(catalog.find((i) => i.id === id)).toMatchObject({
      name: "Amulet of Library Making",
      sourceKey: "homebrew",
      sourceName: "Homebrew",
    });

    const character = await createCharacter("Homebrew Magic Item Owner");
    await addMagicItemFromCatalog(character.id, id);

    const taken = await listCharacterMagicItems(character.id);
    expect(taken.map((i) => i.name)).toEqual(["Amulet of Library Making"]);
  });

  it("edits a homebrew magic item in place", async () => {
    const id = await createHomebrewMagicItem({ name: "Edit Item" });
    await updateHomebrewMagicItem(id, { name: "Edited Item", rarity: "Legendary" });

    const catalog = await listMagicItemCatalog();
    expect(catalog.find((i) => i.id === id)).toMatchObject({ name: "Edited Item", rarity: "Legendary" });
  });

  it("refuses to edit or delete a non-homebrew (seeded) magic item", async () => {
    const [seeded] = await db
      .insert(magicItems)
      .values({ name: "Seeded Item Guard", sourceKey: "srd-2024", sourceName: "SRD 5.2" })
      .returning();

    await updateHomebrewMagicItem(seeded.id, { name: "Hijacked" });
    await deleteHomebrewMagicItem(seeded.id);

    const catalog = await listMagicItemCatalog();
    expect(catalog.find((i) => i.id === seeded.id)).toMatchObject({ name: "Seeded Item Guard" });
  });

  it("deletes a homebrew magic item from the library", async () => {
    const id = await createHomebrewMagicItem({ name: "Delete Item" });
    await deleteHomebrewMagicItem(id);

    const catalog = await listMagicItemCatalog();
    expect(catalog.find((i) => i.id === id)).toBeUndefined();
  });
});
