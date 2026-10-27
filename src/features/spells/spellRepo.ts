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
      concentration: spells.concentration,
      ritual: spells.ritual,
      description: spells.description,
      prepared: characterSpells.prepared,
      characterSpellId: characterSpells.id,
    })
    .from(characterSpells)
    .innerJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.characterId, characterId))
    .orderBy(spells.level, spells.name);
}

/**
 * Browse the spell catalog (the seeded 5e SRD list plus any custom spells
 * players have typed in), optionally filtered by class and/or search text.
 * `classId` matches against the comma-separated `classes` column client-side
 * (the catalog is only ~300-400 rows, not worth a fragile SQL LIKE match).
 */
export async function listSpellCatalog(filter?: {
  classId?: string;
  search?: string;
  level?: number;
}) {
  const rows = await db.select().from(spells).orderBy(spells.level, spells.name);

  return rows.filter((spell) => {
    if (filter?.classId) {
      const classList = spell.classes.split(",").map((c) => c.trim());
      if (!classList.includes(filter.classId)) return false;
    }
    if (filter?.level !== undefined && spell.level !== filter.level) {
      return false;
    }
    if (filter?.search) {
      if (!spell.name.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
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

/** Add a spell the player picked directly from the catalog (by its row id). */
export async function addCatalogSpellToCharacter(
  characterId: number,
  spellId: number
) {
  await db.insert(characterSpells).values({
    characterId,
    spellId,
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

/** Refreshes every spell slot to fully unused -- a long rest's spellcasting recovery. */
export async function resetSpellSlotUsage(characterId: number) {
  await db
    .update(spellSlots)
    .set({ used: 0 })
    .where(eq(spellSlots.characterId, characterId));
}
