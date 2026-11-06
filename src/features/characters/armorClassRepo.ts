import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterArmor, characterFeats, characters } from "../../db/schema";
import { aggregateFeatEffects, computeEquippedArmorClass, parseFeatEffects } from "./characterCalculations";

/**
 * Recomputes and writes `characters.armorClass` from whatever's currently
 * equipped (plus feat bonuses) -- the AC counterpart of `touchCharacterUpdatedAt`.
 * Kept in its own leaf module with no imports from other repos: gearRepo.ts
 * (equip/unequip), featRepo.ts (feat add/toggle/remove), and characterRepo.ts
 * (a Dex ASI at level-up) all need to trigger this, and several of those
 * already import each other or are imported BY characterRepo.ts, so a
 * shared recompute helper living in any one of them would cycle -- same
 * reasoning `syncClock.ts` documents for `touchCharacterUpdatedAt`.
 */
export async function recomputeArmorClass(characterId: number): Promise<void> {
  const [character] = await db.select().from(characters).where(eq(characters.id, characterId));
  if (!character) return;

  const equippedArmor = await db
    .select()
    .from(characterArmor)
    .where(and(eq(characterArmor.characterId, characterId), eq(characterArmor.equipped, true)));

  const featRows = await db.select().from(characterFeats).where(eq(characterFeats.characterId, characterId));
  const featEffects = aggregateFeatEffects(
    featRows.map((row) => ({ enabled: row.enabled, effects: parseFeatEffects(row.effects) }))
  );

  const armorClass = computeEquippedArmorClass(character.dexterity, equippedArmor, featEffects.armorClassBonus);

  await db
    .update(characters)
    .set({ armorClass, updatedAt: new Date().toISOString() })
    .where(eq(characters.id, characterId));
}
