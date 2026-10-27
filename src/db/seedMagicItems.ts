import type { SQLiteDatabase } from "expo-sqlite";
import { MAGIC_ITEMS } from "../data/magicItems";

const INSERT_SQL = `
  INSERT INTO magic_items
    (slug, name, category, rarity, requires_attunement, description, source_key, source_name)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * One-time seed of the magic item catalog (5e SRD 5.1 + 5.2) into the local
 * `magic_items` table. Runs synchronously on first launch only -- skipped
 * once the catalog is already present. Guards on `slug IS NOT NULL`, same
 * reasoning as `seedSpellsIfNeeded` (a column-migration default backfill
 * could otherwise falsely satisfy a cruder guard).
 */
export function seedMagicItemsIfNeeded(sqliteDb: SQLiteDatabase): void {
  const existing = sqliteDb.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM magic_items WHERE slug IS NOT NULL",
    []
  );
  if (existing && existing.count > 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const item of MAGIC_ITEMS) {
      sqliteDb.runSync(INSERT_SQL, [
        item.slug,
        item.name,
        item.category,
        item.rarity,
        item.requiresAttunement ? 1 : 0,
        item.description,
        item.sourceKey,
        item.sourceName,
      ]);
    }
  });
}
