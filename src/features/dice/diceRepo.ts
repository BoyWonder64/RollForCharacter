import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { diceRollHistory } from "../../db/schema";
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
  const query = db.select().from(diceRollHistory);
  const rows = characterId
    ? await query.where(eq(diceRollHistory.characterId, characterId))
    : await query;
  return rows
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);
}
