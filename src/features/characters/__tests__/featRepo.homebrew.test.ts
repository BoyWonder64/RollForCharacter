import { createCharacter } from "../characterRepo";
import {
  addCatalogFeat,
  createHomebrewFeat,
  deleteHomebrewFeat,
  listCharacterFeats,
  listFeatCatalog,
  updateHomebrewFeat,
} from "../featRepo";
import { db } from "../../../db/client";
import { feats } from "../../../db/schema";

jest.mock("../../../db/client");

describe("featRepo homebrew library", () => {
  it("creates a homebrew feat, visible in the catalog, and usable like a seeded one", async () => {
    const id = await createHomebrewFeat({ name: "Library Feat", prerequisite: "Level 4", description: "Custom bonus." });

    const catalog = await listFeatCatalog();
    expect(catalog.find((f) => f.id === id)).toMatchObject({
      name: "Library Feat",
      sourceKey: "homebrew",
      sourceName: "Homebrew",
    });

    const character = await createCharacter("Homebrew Feat Owner");
    const [catalogFeat] = catalog.filter((f) => f.id === id);
    await addCatalogFeat(character, catalogFeat, []);

    const taken = await listCharacterFeats(character);
    expect(taken.map((f) => f.name)).toEqual(["Library Feat"]);
  });

  it("edits a homebrew feat in place", async () => {
    const id = await createHomebrewFeat({ name: "Edit Feat" });
    await updateHomebrewFeat(id, { name: "Edited Feat", description: "Now with a description." });

    const catalog = await listFeatCatalog();
    expect(catalog.find((f) => f.id === id)).toMatchObject({
      name: "Edited Feat",
      description: "Now with a description.",
    });
  });

  it("refuses to edit or delete a non-homebrew (seeded) feat", async () => {
    const [seeded] = await db
      .insert(feats)
      .values({ name: "Seeded Feat Guard", sourceKey: "srd-2024", sourceName: "SRD 5.2" })
      .returning();

    await updateHomebrewFeat(seeded.id, { name: "Hijacked" });
    await deleteHomebrewFeat(seeded.id);

    const catalog = await listFeatCatalog();
    expect(catalog.find((f) => f.id === seeded.id)).toMatchObject({ name: "Seeded Feat Guard" });
  });

  it("deletes a homebrew feat from the library", async () => {
    const id = await createHomebrewFeat({ name: "Delete Feat" });
    await deleteHomebrewFeat(id);

    const catalog = await listFeatCatalog();
    expect(catalog.find((f) => f.id === id)).toBeUndefined();
  });
});
