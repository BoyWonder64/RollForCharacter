import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterSpells, spellSlots, spells } from "../../db/schema";

export async function listSpellsForCharacter(characterId: number) {
  return db
    .select({
      id: spells.id,
      name: spells.name,
      level: spells.level,
      school: spells.school,
      castingTime: spells.castingTime,
      range: spells.range,
      duration: spells.duration,
      components: spells.components,
      description: spells.description,
      prepared: characterSpells.prepared,
      characterSpellId: characterSpells.id,
    })
    .from(characterSpells)
    .innerJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.characterId, characterId))
    .orderBy(spells.level, spells.name);
}

export async function addSpellToCharacter(
  characterId: number,
  spellName: string,
  level: number
) {
  const existing = await db
    .select()
    .from(spells)
    .where(eq(spells.name, spellName));

  const spell =
    existing[0] ??
    (
      await db.insert(spells).values({ name: spellName, level }).returning()
    )[0];

  await db.insert(characterSpells).values({
    characterId,
    spellId: spell.id,
    prepared: false,
  });
}

export async function togglePrepared(characterSpellId: number, prepared: boolean) {
  await db
    .update(characterSpells)
    .set({ prepared })
    .where(eq(characterSpells.id, characterSpellId));
}

export async function removeCharacterSpell(characterSpellId: number) {
  await db.delete(characterSpells).where(eq(characterSpells.id, characterSpellId));
}

export async function listSpellSlots(characterId: number) {
  return db
    .select()
    .from(spellSlots)
    .where(eq(spellSlots.characterId, characterId))
    .orderBy(spellSlots.level);
}

export async function setSpellSlot(
  characterId: number,
  level: number,
  total: number
) {
  const existing = await db
    .select()
    .from(spellSlots)
    .where(eq(spellSlots.characterId, characterId));

  const row = existing.find((slot) => slot.level === level);
  if (row) {
    await db
      .update(spellSlots)
      .set({ total })
      .where(eq(spellSlots.id, row.id));
  } else {
    await db.insert(spellSlots).values({ characterId, level, total, used: 0 });
  }
}

export async function adjustSpellSlotUsage(slotId: number, delta: number) {
  const rows = await db.select().from(spellSlots).where(eq(spellSlots.id, slotId));
  const slot = rows[0];
  if (!slot) return;
  const used = Math.max(0, Math.min(slot.total, slot.used + delta));
  await db.update(spellSlots).set({ used }).where(eq(spellSlots.id, slotId));
}
