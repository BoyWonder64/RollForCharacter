import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characters } from "../../db/schema";

/**
 * Bumps `characters.updatedAt` with no other change -- the cloud sync
 * engine's dirty clock. Only characterRepo.ts's `updateCharacter`
 * chokepoint stamps `updatedAt` otherwise, so every child-table repo
 * (weapons, armor, gear, feats, resources, campaign notes, spells,
 * equipment, magic items) calls this from its own write paths. Kept in its
 * own leaf module with no imports from other repos -- several of those
 * repos are already imported BY characterRepo.ts, so importing
 * characterRepo back from them would cycle.
 */
export async function touchCharacterUpdatedAt(characterId: number): Promise<void> {
  await db
    .update(characters)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(characters.id, characterId));
}
