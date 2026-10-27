import type { SQLiteDatabase } from "expo-sqlite";
import { SPELLS_5E } from "../data/rulesets/5e/spells";

const INSERT_SQL = `
  INSERT INTO spells
    (slug, ruleset, name, level, school, casting_time, range, duration, components, concentration, ritual, classes, description)
  VALUES (?, '5e', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

/**
 * One-time seed of the 5e SRD spell catalog into the local `spells` table.
 * Runs synchronously on first launch only -- skipped once the catalog is
 * already present.
 *
 * Guards on `slug` (every catalog spell has one; a player's own free-typed
 * custom spell never does), not `ruleset`: `ruleset` has a DEFAULT value,
 * and SQLite backfills column defaults onto *existing* rows when a column
 * is added via migration -- so an old custom spell row could end up with
 * ruleset='5e' too after a migration runs, which would falsely satisfy a
 * ruleset-based guard and skip seeding the real catalog.
 */
export function seedSpellsIfNeeded(sqliteDb: SQLiteDatabase): void {
  const existing = sqliteDb.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM spells WHERE slug IS NOT NULL",
    []
  );
  if (existing && existing.count > 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const spell of SPELLS_5E) {
      sqliteDb.runSync(INSERT_SQL, [
        spell.id,
        spell.name,
        spell.level,
        spell.school,
        spell.castingTime,
        spell.range,
        spell.duration,
        spell.components,
        spell.concentration ? 1 : 0,
        spell.ritual ? 1 : 0,
        spell.classes.join(","),
        spell.description,
      ]);
    }
  });
}
