import type { SQLiteDatabase } from "expo-sqlite";
import * as Crypto from "expo-crypto";

type ColumnMigration = {
  table: string;
  column: string;
  definition: string;
};

// Every column added to a table AFTER its original CREATE TABLE statement
// goes here. `CREATE TABLE IF NOT EXISTS` (schemaSql.ts) only helps a
// brand-new install -- it's a no-op against an existing table, so an
// on-device database from before one of these columns existed would throw
// "no such column" on first use otherwise. Each entry here is applied as
// `ALTER TABLE ... ADD COLUMN ...`, which is safe to re-run: an "already
// exists" failure is expected and swallowed, anything else is rethrown.
const COLUMN_MIGRATIONS: ColumnMigration[] = [
  { table: "dm_notes", column: "campaign", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "dm_timeline_events", column: "campaign", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "dm_creatures", column: "dexterity", definition: "INTEGER NOT NULL DEFAULT 10" },
  { table: "dm_creatures", column: "initiative", definition: "INTEGER" },
  { table: "dm_creatures", column: "conditions", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "dm_creatures", column: "used_abilities", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "ruleset", definition: "TEXT NOT NULL DEFAULT '5e'" },
  { table: "characters", column: "background", definition: "TEXT NOT NULL DEFAULT ''" },
  {
    table: "characters",
    column: "death_save_successes",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  {
    table: "characters",
    column: "death_save_failures",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  {
    table: "characters",
    column: "skill_proficiencies",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  { table: "spells", column: "slug", definition: "TEXT" },
  { table: "spells", column: "ruleset", definition: "TEXT NOT NULL DEFAULT '5e'" },
  {
    table: "spells",
    column: "concentration",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  { table: "spells", column: "ritual", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "spells", column: "classes", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "copper_pieces", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "characters", column: "silver_pieces", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "characters", column: "electrum_pieces", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "characters", column: "gold_pieces", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "characters", column: "platinum_pieces", definition: "INTEGER NOT NULL DEFAULT 0" },
  {
    table: "characters",
    column: "tracks_provisions",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  { table: "characters", column: "uses_xp", definition: "INTEGER NOT NULL DEFAULT 0" },
  {
    table: "characters",
    column: "experience_points",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  { table: "characters", column: "theme_family", definition: "TEXT" },
  { table: "characters", column: "font_choice", definition: "TEXT" },
  { table: "characters", column: "subclass", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "feats", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "alignment", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "personality_traits", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "ideals", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "bonds", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "flaws", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "other_proficiencies", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "features_and_traits", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "inspiration", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "character_weapons", column: "description", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "character_armor", column: "description", definition: "TEXT NOT NULL DEFAULT ''" },
  {
    table: "characters",
    column: "concentrating_spell_id",
    definition: "INTEGER REFERENCES character_spells(id) ON DELETE SET NULL",
  },
  {
    table: "characters",
    column: "concentrating_spell_name",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  { table: "characters", column: "homebrew_enabled", definition: "INTEGER NOT NULL DEFAULT 0" },
  {
    table: "characters",
    column: "extra_concentration_slots",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  { table: "characters", column: "extra_concentrations", definition: "TEXT NOT NULL DEFAULT '[]'" },
  {
    table: "characters",
    column: "death_save_successes_needed",
    definition: "INTEGER NOT NULL DEFAULT 3",
  },
  {
    table: "characters",
    column: "death_save_failures_needed",
    definition: "INTEGER NOT NULL DEFAULT 3",
  },
  {
    table: "characters",
    column: "hit_dice_remaining",
    definition: "INTEGER NOT NULL DEFAULT 1",
  },
  { table: "characters", column: "conditions", definition: "TEXT NOT NULL DEFAULT ''" },
  {
    table: "characters",
    column: "exhaustion_level",
    definition: "INTEGER NOT NULL DEFAULT 0",
  },
  {
    table: "characters",
    column: "saving_throw_proficiencies",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  { table: "characters", column: "languages", definition: "TEXT NOT NULL DEFAULT ''" },
  {
    table: "characters",
    column: "custom_race_ability_bonuses",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  { table: "characters", column: "custom_race_size", definition: "TEXT NOT NULL DEFAULT 'Medium'" },
  { table: "characters", column: "custom_race_speed", definition: "INTEGER NOT NULL DEFAULT 30" },
  { table: "characters", column: "custom_race_traits", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "custom_class_hit_die", definition: "INTEGER NOT NULL DEFAULT 8" },
  {
    table: "characters",
    column: "custom_class_saving_throws",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  {
    table: "characters",
    column: "custom_class_armor_proficiencies",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  {
    table: "characters",
    column: "custom_class_weapon_proficiencies",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  {
    table: "characters",
    column: "custom_class_traits",
    definition: "TEXT NOT NULL DEFAULT ''",
  },
  { table: "character_weapons", column: "is_magic", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "character_weapons", column: "magic_bonus", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "character_armor", column: "is_magic", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "character_armor", column: "magic_bonus", definition: "INTEGER NOT NULL DEFAULT 0" },
  { table: "character_weapons", column: "quantity", definition: "INTEGER NOT NULL DEFAULT 1" },
  // character_custom_resources shipped first without icon/roll_formula.
  { table: "character_custom_resources", column: "icon", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "character_custom_resources", column: "roll_formula", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "characters", column: "sync_id", definition: "TEXT" },
  // Shared homebrew library -- the homebrew_* tables themselves are new
  // tables, created for every install (new or existing) by CREATE_TABLES_SQL's
  // `IF NOT EXISTS`. Only these new COLUMNS on pre-existing tables need an
  // explicit migration here.
  {
    table: "characters",
    column: "homebrew_race_id",
    definition: "INTEGER REFERENCES homebrew_races(id) ON DELETE SET NULL",
  },
  {
    table: "characters",
    column: "homebrew_class_id",
    definition: "INTEGER REFERENCES homebrew_classes(id) ON DELETE SET NULL",
  },
  {
    table: "characters",
    column: "homebrew_subclass_id",
    definition: "INTEGER REFERENCES homebrew_subclasses(id) ON DELETE SET NULL",
  },
  {
    table: "character_weapons",
    column: "homebrew_source_id",
    definition: "INTEGER REFERENCES homebrew_weapons(id) ON DELETE SET NULL",
  },
  {
    table: "character_armor",
    column: "homebrew_source_id",
    definition: "INTEGER REFERENCES homebrew_armor(id) ON DELETE SET NULL",
  },
  {
    table: "character_custom_resources",
    column: "homebrew_source_id",
    definition: "INTEGER REFERENCES homebrew_resources(id) ON DELETE SET NULL",
  },
  { table: "spells", column: "source_key", definition: "TEXT NOT NULL DEFAULT ''" },
  { table: "spells", column: "source_name", definition: "TEXT NOT NULL DEFAULT ''" },
];

// The Dress Up feature (equipment_items / character_equipment) was removed.
// Drop its tables from devices that still have them. character_equipment goes
// first since it references equipment_items.
function migrateDropDressUp(sqliteDb: SQLiteDatabase): void {
  sqliteDb.execSync("DROP TABLE IF EXISTS character_equipment;");
  sqliteDb.execSync("DROP TABLE IF EXISTS equipment_items;");
}

// `characters.feats` was the only place a feat lived -- a newline-separated
// free-text blob, never shown anywhere on the sheet (see
// `src/features/characters/featRepo.ts`). Structured `character_feats` rows
// replace it; this is the one-time move of whatever free text already
// exists into that table, one row per non-blank line, so no on-device
// character loses feats it already had. Guarded per-character (not just on
// `character_feats` being empty overall) so re-running this after the
// player has already added real structured feats of their own can't
// duplicate anything -- it only ever backfills a character with zero rows.
// `characters.feats` itself is left untouched (nothing writes to it
// anymore, but this app's SQLite migrations never drop columns).
function migrateLegacyFeatsIfNeeded(sqliteDb: SQLiteDatabase): void {
  const rows = sqliteDb.getAllSync<{ id: number; feats: string }>(
    "SELECT id, feats FROM characters WHERE feats IS NOT NULL AND feats != '';",
    []
  );
  if (rows.length === 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const row of rows) {
      const existing = sqliteDb.getFirstSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM character_feats WHERE character_id = ?;",
        [row.id]
      );
      if (existing && existing.count > 0) continue;

      const lines = row.feats
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        sqliteDb.runSync(
          "INSERT INTO character_feats (character_id, name, effects) VALUES (?, ?, '[]');",
          [row.id, line]
        );
      }
    }
  });
}

// Backfills `sync_id` for any character created before cloud sync existed --
// new characters get one at creation time (characterRepo.ts), but existing
// rows need one assigned once so sync/Party mode have a stable id to key on.
function migrateBackfillSyncIds(sqliteDb: SQLiteDatabase): void {
  const rows = sqliteDb.getAllSync<{ id: number }>(
    "SELECT id FROM characters WHERE sync_id IS NULL;",
    []
  );
  if (rows.length === 0) return;

  sqliteDb.withTransactionSync(() => {
    for (const row of rows) {
      sqliteDb.runSync("UPDATE characters SET sync_id = ? WHERE id = ?;", [
        Crypto.randomUUID(),
        row.id,
      ]);
    }
  });
}

export function runColumnMigrations(sqliteDb: SQLiteDatabase): void {
  migrateDropDressUp(sqliteDb);

  for (const { table, column, definition } of COLUMN_MIGRATIONS) {
    try {
      sqliteDb.execSync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("duplicate column name")) {
        throw error;
      }
      // Column already exists on this install -- nothing to do.
    }
  }

  // Must run after the loop above -- on a device old enough to be missing
  // the `feats` column entirely, this query would fail until that ADD
  // COLUMN has run.
  migrateLegacyFeatsIfNeeded(sqliteDb);
  migrateBackfillSyncIds(sqliteDb);
}
