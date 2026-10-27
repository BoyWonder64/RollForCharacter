import { eq, like, and } from "drizzle-orm";
import { db } from "../../db/client";
import { characterMagicItems, magicItems } from "../../db/schema";

const RARITY_ORDER: Record<string, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  "Very Rare": 3,
  Legendary: 4,
  Artifact: 5,
};

/** The full reference magic item catalog, optionally filtered by name search and/or exact rarity. */
export async function listMagicItemCatalog(search?: string, rarity?: string) {
  const conditions = [];
  if (search && search.trim()) conditions.push(like(magicItems.name, `%${search.trim()}%`));
  if (rarity) conditions.push(eq(magicItems.rarity, rarity));

  const rows = await db
    .select()
    .from(magicItems)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return rows.sort((a, b) => {
    const rarityDiff = (RARITY_ORDER[a.rarity] ?? 99) - (RARITY_ORDER[b.rarity] ?? 99);
    if (rarityDiff !== 0) return rarityDiff;
    return a.name.localeCompare(b.name);
  });
}

/** Every distinct rarity present in the catalog, in game order (for a filter chip row). */
export async function listMagicItemRarities(): Promise<string[]> {
  const rows = await db.selectDistinct({ rarity: magicItems.rarity }).from(magicItems);
  return rows
    .map((r) => r.rarity)
    .filter(Boolean)
    .sort((a, b) => (RARITY_ORDER[a] ?? 99) - (RARITY_ORDER[b] ?? 99));
}

export async function listCharacterMagicItems(characterId: number) {
  return db
    .select()
    .from(characterMagicItems)
    .where(eq(characterMagicItems.characterId, characterId))
    .orderBy(characterMagicItems.createdAt);
}

export type CustomMagicItemInput = {
  name: string;
  category?: string;
  rarity?: string;
  requiresAttunement?: boolean;
  description?: string;
};

export async function addMagicItemFromCatalog(characterId: number, catalogId: number): Promise<void> {
  const [definition] = await db.select().from(magicItems).where(eq(magicItems.id, catalogId));
  if (!definition) return;
  await db.insert(characterMagicItems).values({
    characterId,
    catalogId: definition.id,
    name: definition.name,
    category: definition.category,
    rarity: definition.rarity,
    requiresAttunement: definition.requiresAttunement,
    description: definition.description,
  });
}

export async function addCustomMagicItem(
  characterId: number,
  input: CustomMagicItemInput
): Promise<void> {
  await db.insert(characterMagicItems).values({
    characterId,
    catalogId: null,
    name: input.name,
    category: input.category ?? "",
    rarity: input.rarity ?? "",
    requiresAttunement: input.requiresAttunement ?? false,
    description: input.description ?? "",
  });
}

export async function removeCharacterMagicItem(itemId: number): Promise<void> {
  await db.delete(characterMagicItems).where(eq(characterMagicItems.id, itemId));
}

export async function setMagicItemAttuned(itemId: number, attuned: boolean): Promise<void> {
  await db.update(characterMagicItems).set({ attuned }).where(eq(characterMagicItems.id, itemId));
}

export async function setMagicItemEquipped(itemId: number, equipped: boolean): Promise<void> {
  await db.update(characterMagicItems).set({ equipped }).where(eq(characterMagicItems.id, itemId));
}
