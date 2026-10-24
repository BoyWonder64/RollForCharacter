export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ruleset TEXT NOT NULL DEFAULT '5e',
    race TEXT NOT NULL DEFAULT '',
    class_name TEXT NOT NULL DEFAULT '',
    background TEXT NOT NULL DEFAULT '',
    level INTEGER NOT NULL DEFAULT 1,
    max_hp INTEGER NOT NULL DEFAULT 0,
    current_hp INTEGER NOT NULL DEFAULT 0,
    temp_hp INTEGER NOT NULL DEFAULT 0,
    armor_class INTEGER NOT NULL DEFAULT 10,
    speed INTEGER NOT NULL DEFAULT 30,
    proficiency_bonus INTEGER NOT NULL DEFAULT 2,
    strength INTEGER NOT NULL DEFAULT 10,
    dexterity INTEGER NOT NULL DEFAULT 10,
    constitution INTEGER NOT NULL DEFAULT 10,
    intelligence INTEGER NOT NULL DEFAULT 10,
    wisdom INTEGER NOT NULL DEFAULT 10,
    charisma INTEGER NOT NULL DEFAULT 10,
    notes TEXT NOT NULL DEFAULT '',
    portrait_uri TEXT,
    created_at TEXT NOT NULL DEFAULT (current_timestamp),
    updated_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS spell_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    used INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    school TEXT NOT NULL DEFAULT '',
    casting_time TEXT NOT NULL DEFAULT '',
    range TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    components TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS character_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    spell_id INTEGER NOT NULL REFERENCES spells(id) ON DELETE CASCADE,
    prepared INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS dress_up_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slot TEXT NOT NULL,
    pack_id TEXT NOT NULL DEFAULT 'base',
    image_asset TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS character_equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    dress_up_item_id INTEGER NOT NULL REFERENCES dress_up_items(id) ON DELETE CASCADE,
    slot TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dice_roll_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    expression TEXT NOT NULL,
    result INTEGER NOT NULL,
    breakdown TEXT NOT NULL,
    rolled_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
`;
