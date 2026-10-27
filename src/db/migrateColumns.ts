import type { SQLiteDatabase } from "expo-sqlite";
import { EQUIPMENT_CATALOG } from "./seedEquipmentItems";

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
  // character_equipment originally referenced the dress_up_items table via a
  // dress_up_item_id column; both were renamed to equipment_items /
  // equipment_item_id. CREATE TABLE IF NOT EXISTS created equipment_items
  // fine (it's a new table name), but on-device character_equipment tables
  // created before the rename still have the old dress_up_item_id column
  // and are missing this one.
  {
    table: "character_equipment",
    column: "equipment_item_id",
    definition: "INTEGER NOT NULL DEFAULT 0 REFERENCES equipment_items(id) ON DELETE CASCADE",
  },
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
];

// The `equipment_item_id` entry in COLUMN_MIGRATIONS above only ever ADDED
// the new column -- it never got rid of the old `dress_up_item_id` column,
// which is still `NOT NULL` with no default on any on-device table created
// before the rename. That leftover NOT NULL constraint fails every insert
// (`equipItem` never supplies a value for a column it doesn't know exists),
// even once `equipment_item_id` is present. Since `character_equipment` only
// holds cosmetic equip state (no mechanical stats, nothing else references
// it), the safe fix is to drop and recreate the table from scratch rather
// than try to ALTER COLUMN around SQLite's limited column-drop support.
function migrateDressUpItemIdRename(sqliteDb: SQLiteDatabase): void {
  const columns = sqliteDb.getAllSync<{ name: string }>(
    "PRAGMA table_info(character_equipment);",
    []
  );
  const hasStaleColumn = columns.some((c) => c.name === "dress_up_item_id");
  if (!hasStaleColumn) return;

  sqliteDb.execSync("DROP TABLE character_equipment;");
  sqliteDb.execSync(`
    CREATE TABLE character_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      equipment_item_id INTEGER NOT NULL REFERENCES equipment_items(id) ON DELETE CASCADE,
      slot TEXT NOT NULL
    );
  `);
}

// The Legs slot was removed from EQUIPMENT_SLOTS (greaves/robe-legwear/
// vambrace catalog items folded back into Body) -- devices that already ran
// `seedEquipmentItemsIfNeeded` have real `equipment_items` rows (and
// possibly `character_equipment` rows) sitting on the now-gone "Legs" slot.
// Reassign them to "Body" rather than leaving them orphaned.
function migrateLegsSlotRemoval(sqliteDb: SQLiteDatabase): void {
  sqliteDb.execSync("UPDATE equipment_items SET slot = 'Body' WHERE slot = 'Legs';");
  sqliteDb.execSync("UPDATE character_equipment SET slot = 'Body' WHERE slot = 'Legs';");
}

// Left Hand and Right Hand started out split (swords only / shields only),
// then grew a full combined sword+shield list, then the entire weapon
// region of the sheet (axes/daggers/wands/etc, ~368 icons each) -- all as
// extra rows appended to EQUIPMENT_CATALOG over time, every one reusing an
// existing image (no new files, just more catalog rows). `seedEquipmentItemsIfNeeded`
// only runs once (guarded on the table being non-empty), so a device that
// already seeded under an older/smaller catalog needs each round of new
// rows inserted directly -- this just diffs the live EQUIPMENT_CATALOG
// against what's already in the table and inserts whatever's missing, so
// it stays correct as more rows get added here in the future too.
function migrateHandSlotCrossList(sqliteDb: SQLiteDatabase): void {
  // Runs before `seedEquipmentItemsIfNeeded` -- on a brand-new install the
  // table is still empty at this point, and seeding will insert the full
  // (already-correct) catalog in one pass, every Left/Right Hand row
  // included. Only a device that seeded under an older catalog needs rows
  // inserted directly here.
  const seeded = sqliteDb.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM equipment_items;",
    []
  );
  if (!seeded || seeded.count === 0) return;

  const existing = sqliteDb.getAllSync<{ slot: string; image_asset: string }>(
    "SELECT slot, image_asset FROM equipment_items WHERE slot IN ('Left Hand', 'Right Hand');",
    []
  );
  const existingKeys = new Set(existing.map((row) => `${row.slot}::${row.image_asset}`));

  sqliteDb.withTransactionSync(() => {
    for (const [name, slot, imageAsset] of EQUIPMENT_CATALOG) {
      if (slot !== "Left Hand" && slot !== "Right Hand") continue;
      if (existingKeys.has(`${slot}::${imageAsset}`)) continue;
      sqliteDb.runSync(
        "INSERT INTO equipment_items (name, slot, pack_id, image_asset) VALUES (?, ?, 'base', ?)",
        [name, slot, imageAsset]
      );
    }
  });
}

// Pauldron (a shoulder-only armor piece) was the first Body catalog
// category -- it doesn't read as a clothing option next to robes/tunics/
// dresses, so it's been pulled from EQUIPMENT_CATALOG entirely. `equipment_items`
// is referenced by `character_equipment.equipment_item_id ON DELETE CASCADE`,
// so deleting the catalog rows also clears anyone who had one equipped.
function migratePauldronRemoval(sqliteDb: SQLiteDatabase): void {
  sqliteDb.execSync("DELETE FROM equipment_items WHERE image_asset LIKE 'body-pauldron-%';");
}

// The first pass at "all weapons" for Left/Right Hand used a coarse 3-bucket
// scheme (Dagger/Axe/Wand) that lumped pickaxes, crossbows, maces, morning
// stars/flails, whips, and tridents all in as "Dagger" or "Axe". Replaced
// with a proper per-shape categorization (see `build_weapons_precise.py`'s
// row bands, referenced from EQUIPMENT_ICON_CATALOG.md). The old `weapon-*`
// keys don't match the new ones 1:1 (different category names, different
// dedupe suffixes), so rather than try to reconcile them, drop every old
// `weapon-*` row and let `migrateHandSlotCrossList` below re-insert the
// current (correct) set from EQUIPMENT_CATALOG.
function migrateWeaponCategoryRedo(sqliteDb: SQLiteDatabase): void {
  sqliteDb.execSync(
    "DELETE FROM equipment_items WHERE image_asset LIKE 'weapon-%' AND slot IN ('Left Hand', 'Right Hand');"
  );
}

export function runColumnMigrations(sqliteDb: SQLiteDatabase): void {
  migrateDressUpItemIdRename(sqliteDb);
  migrateLegsSlotRemoval(sqliteDb);
  migrateWeaponCategoryRedo(sqliteDb);
  migrateHandSlotCrossList(sqliteDb);
  migratePauldronRemoval(sqliteDb);

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
}
