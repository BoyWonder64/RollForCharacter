import type { SQLiteDatabase } from "expo-sqlite";
import { MONSTERS_5E } from "../data/monsters";

const INSERT_SQL = `
  INSERT INTO monsters
    (slug, name, size, type, alignment, armor_class, armor_detail, hit_points, hit_dice, speed,
     strength, dexterity, constitution, intelligence, wisdom, charisma, challenge_rating, xp,
     senses, languages, traits, actions, legendary_actions, source_key, source_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// SRD 5.1 monsters whose open5e feed carried Monster Manual "Variant"/coven
// sidebar traits that are not in the SRD (copyright audit 2026-11-09). Those
// traits were removed from MONSTERS_5E; this re-syncs the trait list for
// databases seeded before that, so the old rows lose them too.
const MONSTERS_WITH_REMOVED_TRAITS = new Set([
  "srd_balor", "srd_djinni", "srd_dust-mephit", "srd_efreeti", "srd_erinyes", "srd_ettercap",
  "srd_giant-lizard", "srd_glabrezu", "srd_green-hag", "srd_hezrou", "srd_ice-mephit", "srd_imp",
  "srd_magma-mephit", "srd_marilith", "srd_nalfeshnee", "srd_night-hag", "srd_pseudodragon",
  "srd_quasit", "srd_satyr", "srd_sea-hag", "srd_steam-mephit", "srd_troll", "srd_vrock",
]);

function stripNonSrdTraits(sqliteDb: SQLiteDatabase): void {
  sqliteDb.withTransactionSync(() => {
    for (const m of MONSTERS_5E) {
      if (!MONSTERS_WITH_REMOVED_TRAITS.has(m.slug)) continue;
      sqliteDb.runSync("UPDATE monsters SET traits = ? WHERE slug = ?", [
        JSON.stringify(m.traits),
        m.slug,
      ]);
    }
  });
}

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
  if (existing && existing.count > 0) {
    stripNonSrdTraits(sqliteDb);
    return;
  }

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
