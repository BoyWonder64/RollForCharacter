import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characters, diceRollHistory } from "../../db/schema";
import type { RollResult } from "./diceEngine";

export async function saveRoll(roll: RollResult, characterId?: number) {
  await db.insert(diceRollHistory).values({
    characterId: characterId ?? null,
    expression: roll.expression,
    result: roll.total,
    breakdown: roll.breakdown,
  });
}

export async function recentRolls(characterId?: number, limit = 20) {
  const query = db
    .select({ roll: diceRollHistory, characterName: characters.name })
    .from(diceRollHistory)
    .leftJoin(characters, eq(diceRollHistory.characterId, characters.id));
  const rows = characterId
    ? await query.where(eq(diceRollHistory.characterId, characterId))
    : await query;
  return rows
    .map((row) => ({ ...row.roll, characterName: row.characterName }))
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);
}

export async function clearRollHistory(characterId?: number): Promise<void> {
  if (characterId) {
    await db.delete(diceRollHistory).where(eq(diceRollHistory.characterId, characterId));
  } else {
    await db.delete(diceRollHistory);
  }
}
