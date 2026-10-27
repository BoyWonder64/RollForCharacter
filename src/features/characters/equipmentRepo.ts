import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterEquipment, equipmentItems } from "../../db/schema";

export const EQUIPMENT_SLOTS = [
  "Head",
  "Body",
  "Feet",
  "Left Hand",
  "Right Hand",
  "Back",
  "Accessory",
] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

// Every other slot holds at most one item (equipping replaces whatever was
// there). Accessory is multi-select -- equipping adds another ring/necklace
// instead of replacing the last one.
const MULTI_SLOTS: ReadonlySet<EquipmentSlot> = new Set(["Accessory"]);
export function isMultiSlot(slot: EquipmentSlot): boolean {
  return MULTI_SLOTS.has(slot);
}

export async function listEquipmentItems(slot?: EquipmentSlot) {
  const rows = await db.select().from(equipmentItems);
  return slot ? rows.filter((item) => item.slot === slot) : rows;
}

export async function listCharacterEquipment(characterId: number) {
  return db
    .select({
      id: characterEquipment.id,
      slot: characterEquipment.slot,
      equipmentItemId: equipmentItems.id,
      name: equipmentItems.name,
      imageAsset: equipmentItems.imageAsset,
      packId: equipmentItems.packId,
    })
    .from(characterEquipment)
    .innerJoin(equipmentItems, eq(characterEquipment.equipmentItemId, equipmentItems.id))
    .where(eq(characterEquipment.characterId, characterId));
}

export async function equipItem(
  characterId: number,
  slot: EquipmentSlot,
  equipmentItemId: number
): Promise<void> {
  if (isMultiSlot(slot)) {
    await db.insert(characterEquipment).values({ characterId, slot, equipmentItemId });
    return;
  }

  const existing = await db
    .select()
    .from(characterEquipment)
    .where(eq(characterEquipment.characterId, characterId));

  const currentForSlot = existing.find((row) => row.slot === slot);
  if (currentForSlot) {
    await db
      .update(characterEquipment)
      .set({ equipmentItemId })
      .where(eq(characterEquipment.id, currentForSlot.id));
  } else {
    await db.insert(characterEquipment).values({ characterId, slot, equipmentItemId });
  }
}

// Unequips every item in the given slot (for a multi-select slot like
// Accessory, this clears all of them -- use `unequipItem` to remove just one).
export async function unequipSlot(characterId: number, slot: EquipmentSlot): Promise<void> {
  const existing = await db
    .select()
    .from(characterEquipment)
    .where(eq(characterEquipment.characterId, characterId));

  for (const row of existing.filter((row) => row.slot === slot)) {
    await db.delete(characterEquipment).where(eq(characterEquipment.id, row.id));
  }
}

// Unequips a single equipped row by its own id -- needed for multi-select
// slots where several items share the same slot and only one should go.
export async function unequipItem(characterEquipmentId: number): Promise<void> {
  await db.delete(characterEquipment).where(eq(characterEquipment.id, characterEquipmentId));
}
