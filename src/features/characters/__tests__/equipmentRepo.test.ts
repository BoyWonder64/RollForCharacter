import { createCharacter } from "../characterRepo";
import {
  EQUIPMENT_SLOTS,
  equipItem,
  isMultiSlot,
  listCharacterEquipment,
  listEquipmentItems,
  unequipItem,
  unequipSlot,
} from "../equipmentRepo";
import { db } from "../../../db/client";
import { equipmentItems } from "../../../db/schema";

jest.mock("../../../db/client");

async function makeCatalogItem(name: string, slot: string) {
  const rows = await db
    .insert(equipmentItems)
    .values({ name, slot, imageAsset: "placeholder" })
    .returning();
  return rows[0];
}

describe("equipmentRepo", () => {
  describe("listEquipmentItems", () => {
    it("lists all catalog items when no slot filter is given", async () => {
      await makeCatalogItem("List All Helm", "Head");
      await makeCatalogItem("List All Blade", "Left Hand");

      const all = await listEquipmentItems();
      expect(all.find((i) => i.name === "List All Helm")).toBeDefined();
      expect(all.find((i) => i.name === "List All Blade")).toBeDefined();
    });

    it("filters by slot when given", async () => {
      await makeCatalogItem("Filter Helm", "Head");
      await makeCatalogItem("Filter Blade", "Left Hand");

      const headItems = await listEquipmentItems("Head");
      expect(headItems.every((i) => i.slot === "Head")).toBe(true);
      expect(headItems.find((i) => i.name === "Filter Helm")).toBeDefined();
      expect(headItems.find((i) => i.name === "Filter Blade")).toBeUndefined();
    });
  });

  describe("equipItem / unequipSlot / listCharacterEquipment", () => {
    it("equips an item into an empty slot", async () => {
      const character = await createCharacter("Equip Empty Slot");
      const helm = await makeCatalogItem("Equip Empty Helm", "Head");

      await equipItem(character.id, "Head", helm.id);

      const equipped = await listCharacterEquipment(character.id);
      expect(equipped).toHaveLength(1);
      expect(equipped[0]).toMatchObject({ slot: "Head", name: "Equip Empty Helm" });
    });

    it("replaces whatever was in the slot instead of stacking", async () => {
      const character = await createCharacter("Equip Replace Slot");
      const helmA = await makeCatalogItem("Replace Helm A", "Head");
      const helmB = await makeCatalogItem("Replace Helm B", "Head");

      await equipItem(character.id, "Head", helmA.id);
      await equipItem(character.id, "Head", helmB.id);

      const equipped = await listCharacterEquipment(character.id);
      expect(equipped).toHaveLength(1);
      expect(equipped[0].name).toBe("Replace Helm B");
    });

    it("tracks separate slots independently", async () => {
      const character = await createCharacter("Equip Multi Slot");
      const helm = await makeCatalogItem("Multi Slot Helm", "Head");
      const sword = await makeCatalogItem("Multi Slot Sword", "Left Hand");

      await equipItem(character.id, "Head", helm.id);
      await equipItem(character.id, "Left Hand", sword.id);

      const equipped = await listCharacterEquipment(character.id);
      expect(equipped).toHaveLength(2);
      expect(equipped.map((e) => e.slot).sort()).toEqual(["Head", "Left Hand"]);
    });

    it("unequips a slot", async () => {
      const character = await createCharacter("Unequip Slot");
      const helm = await makeCatalogItem("Unequip Helm", "Head");

      await equipItem(character.id, "Head", helm.id);
      await unequipSlot(character.id, "Head");

      const equipped = await listCharacterEquipment(character.id);
      expect(equipped).toHaveLength(0);
    });

    it("does nothing when unequipping an already-empty slot", async () => {
      const character = await createCharacter("Unequip Empty Slot");
      await expect(unequipSlot(character.id, "Head")).resolves.toBeUndefined();
    });

    it("only returns equipment for the requested character", async () => {
      const characterA = await createCharacter("Equip Scope A");
      const characterB = await createCharacter("Equip Scope B");
      const helm = await makeCatalogItem("Scope Helm", "Head");

      await equipItem(characterA.id, "Head", helm.id);

      const equippedB = await listCharacterEquipment(characterB.id);
      expect(equippedB).toHaveLength(0);
    });
  });

  describe("slots", () => {
    it("includes Feet alongside the original slots", () => {
      expect(EQUIPMENT_SLOTS).toEqual([
        "Head",
        "Body",
        "Feet",
        "Left Hand",
        "Right Hand",
        "Back",
        "Accessory",
      ]);
    });

    it("flags only Accessory as multi-select", () => {
      expect(isMultiSlot("Accessory")).toBe(true);
      expect(isMultiSlot("Head")).toBe(false);
      expect(isMultiSlot("Back")).toBe(false);
    });
  });

  describe("multi-select Accessory slot", () => {
    it("stacks items instead of replacing", async () => {
      const character = await createCharacter("Accessory Stack");
      const ringA = await makeCatalogItem("Ring A", "Accessory");
      const ringB = await makeCatalogItem("Ring B", "Accessory");

      await equipItem(character.id, "Accessory", ringA.id);
      await equipItem(character.id, "Accessory", ringB.id);

      const equipped = await listCharacterEquipment(character.id);
      expect(equipped).toHaveLength(2);
      expect(equipped.map((e) => e.name).sort()).toEqual(["Ring A", "Ring B"]);
    });

    it("unequipItem removes just the one row", async () => {
      const character = await createCharacter("Accessory Remove One");
      const ringA = await makeCatalogItem("Remove Ring A", "Accessory");
      const ringB = await makeCatalogItem("Remove Ring B", "Accessory");

      await equipItem(character.id, "Accessory", ringA.id);
      await equipItem(character.id, "Accessory", ringB.id);
      const equipped = await listCharacterEquipment(character.id);
      const toRemove = equipped.find((e) => e.name === "Remove Ring A")!;

      await unequipItem(toRemove.id);

      const after = await listCharacterEquipment(character.id);
      expect(after).toHaveLength(1);
      expect(after[0].name).toBe("Remove Ring B");
    });

    it("unequipSlot clears every item in the slot", async () => {
      const character = await createCharacter("Accessory Clear All");
      const ringA = await makeCatalogItem("Clear Ring A", "Accessory");
      const ringB = await makeCatalogItem("Clear Ring B", "Accessory");

      await equipItem(character.id, "Accessory", ringA.id);
      await equipItem(character.id, "Accessory", ringB.id);
      await unequipSlot(character.id, "Accessory");

      const after = await listCharacterEquipment(character.id);
      expect(after).toHaveLength(0);
    });
  });
});
