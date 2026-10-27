import type { SQLiteDatabase } from "expo-sqlite";
import { FEATS } from "../data/feats";

const INSERT_SQL = `
  INSERT INTO feats
    (slug, ruleset, name, prerequisite, description, source_key, source_name)
  VALUES (?, '5e', ?, ?, ?, ?, ?)
`;

/**
 * One-time seed of the feats reference catalog (SRD 2024, Wizards of the
 * Coast -- see docs/DND_CONTENT_SOURCES.md) into the local
 * `feats` table. Runs synchronously on first launch only.
 *
 * Guards on `slug` (every catalog feat has one), not row count overall, same
 * reasoning as `seedSpellsIfNeeded` -- a column-migration default backfill
 * could otherwise falsely satisfy a plain count guard.
 */
export function seedFeatsIfNeeded(sqliteDb: SQLiteDatabase): void {
  // Third-party (Level Up A5E) feats were briefly seeded in an earlier pass
  // and then removed from the catalog at the user's request -- this cleans
  // up any dev install that already seeded them, independent of the
  // row-count guard below (which only controls whether the SRD feats get
  // (re-)inserted).
  sqliteDb.runSync("DELETE FROM feats WHERE source_key = 'a5e-ag'");

  const existing = sqliteDb.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM feats WHERE slug IS NOT NULL",
    []
  );
  if (existing && existing.count > 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const feat of FEATS) {
      sqliteDb.runSync(INSERT_SQL, [
        feat.id,
        feat.name,
        feat.prerequisite,
        feat.description,
        feat.sourceKey,
        feat.sourceName,
      ]);
    }
  });
}
