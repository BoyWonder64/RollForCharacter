import type { SQLiteDatabase } from "expo-sqlite";
import { MONSTERS_5E } from "../data/monsters";

const INSERT_SQL = `
  INSERT INTO monsters
    (slug, name, size, type, alignment, armor_class, armor_detail, hit_points, hit_dice, speed,
     strength, dexterity, constitution, intelligence, wisdom, charisma, challenge_rating, xp,
     senses, languages, traits, actions, legendary_actions, source_key, source_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * One-time seed of the SRD 5.1 + 5.2 monster/creature catalog into the local
 * `monsters` table. Mirrors `seedSpellsIfNeeded`'s pattern exactly, including
 * guarding on `slug IS NOT NULL` rather than row count alone for the same
 * reason documented there (a migration can backfill column defaults onto
 * unrelated existing rows).
 */
export function seedMonstersIfNeeded(sqliteDb: SQLiteDatabase): void {
  const existing = sqliteDb.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM monsters WHERE slug IS NOT NULL",
    []
  );
  if (existing && existing.count > 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const m of MONSTERS_5E) {
      sqliteDb.runSync(INSERT_SQL, [
        m.slug,
        m.name,
        m.size,
        m.type,
        m.alignment,
        m.armorClass,
        m.armorDetail,
        m.hitPoints,
        m.hitDice,
        m.speed,
        m.strength,
        m.dexterity,
        m.constitution,
        m.intelligence,
        m.wisdom,
        m.charisma,
        m.challengeRating,
        m.xp,
        m.senses,
        m.languages,
        JSON.stringify(m.traits),
        JSON.stringify(m.actions),
        JSON.stringify(m.legendaryActions),
        m.sourceKey,
        m.sourceName,
      ]);
    }
  });
}
