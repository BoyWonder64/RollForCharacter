export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ruleset TEXT NOT NULL DEFAULT '5e',
    race TEXT NOT NULL DEFAULT '',
    class_name TEXT NOT NULL DEFAULT '',
    background TEXT NOT NULL DEFAULT '',
    level INTEGER NOT NULL DEFAULT 1,
    subclass TEXT NOT NULL DEFAULT '',
    feats TEXT NOT NULL DEFAULT '',
    alignment TEXT NOT NULL DEFAULT '',
    personality_traits TEXT NOT NULL DEFAULT '',
    ideals TEXT NOT NULL DEFAULT '',
    bonds TEXT NOT NULL DEFAULT '',
    flaws TEXT NOT NULL DEFAULT '',
    languages TEXT NOT NULL DEFAULT '',
    other_proficiencies TEXT NOT NULL DEFAULT '',
    features_and_traits TEXT NOT NULL DEFAULT '',
    inspiration INTEGER NOT NULL DEFAULT 0,
    max_hp INTEGER NOT NULL DEFAULT 0,
    current_hp INTEGER NOT NULL DEFAULT 0,
    temp_hp INTEGER NOT NULL DEFAULT 0,
    death_save_successes INTEGER NOT NULL DEFAULT 0,
    death_save_failures INTEGER NOT NULL DEFAULT 0,
    hit_dice_remaining INTEGER NOT NULL DEFAULT 1,
    conditions TEXT NOT NULL DEFAULT '',
    exhaustion_level INTEGER NOT NULL DEFAULT 0,
    concentrating_spell_id INTEGER REFERENCES character_spells(id) ON DELETE SET NULL,
    concentrating_spell_name TEXT NOT NULL DEFAULT '',
    homebrew_enabled INTEGER NOT NULL DEFAULT 0,
    extra_concentration_slots INTEGER NOT NULL DEFAULT 0,
    extra_concentrations TEXT NOT NULL DEFAULT '[]',
    death_save_successes_needed INTEGER NOT NULL DEFAULT 3,
    death_save_failures_needed INTEGER NOT NULL DEFAULT 3,
    crit_range_min INTEGER NOT NULL DEFAULT 20,
    attunement_limit INTEGER NOT NULL DEFAULT 3,
    ability_score_max INTEGER NOT NULL DEFAULT 20,
    inspiration_max INTEGER NOT NULL DEFAULT 1,
    inspiration_points INTEGER NOT NULL DEFAULT 0,
    skill_proficiencies TEXT NOT NULL DEFAULT '',
    saving_throw_proficiencies TEXT NOT NULL DEFAULT '',
    custom_race_ability_bonuses TEXT NOT NULL DEFAULT '',
    custom_race_size TEXT NOT NULL DEFAULT 'Medium',
    custom_race_speed INTEGER NOT NULL DEFAULT 30,
    custom_race_traits TEXT NOT NULL DEFAULT '',
    custom_class_hit_die INTEGER NOT NULL DEFAULT 8,
    custom_class_saving_throws TEXT NOT NULL DEFAULT '',
    custom_class_armor_proficiencies TEXT NOT NULL DEFAULT '',
    custom_class_weapon_proficiencies TEXT NOT NULL DEFAULT '',
    custom_class_traits TEXT NOT NULL DEFAULT '',
    homebrew_race_id INTEGER REFERENCES homebrew_races(id) ON DELETE SET NULL,
    homebrew_class_id INTEGER REFERENCES homebrew_classes(id) ON DELETE SET NULL,
    homebrew_subclass_id INTEGER REFERENCES homebrew_subclasses(id) ON DELETE SET NULL,
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
    sync_id TEXT,
    copper_pieces INTEGER NOT NULL DEFAULT 0,
    silver_pieces INTEGER NOT NULL DEFAULT 0,
    electrum_pieces INTEGER NOT NULL DEFAULT 0,
    gold_pieces INTEGER NOT NULL DEFAULT 0,
    platinum_pieces INTEGER NOT NULL DEFAULT 0,
    tracks_provisions INTEGER NOT NULL DEFAULT 0,
    uses_xp INTEGER NOT NULL DEFAULT 0,
    experience_points INTEGER NOT NULL DEFAULT 0,
    theme_family TEXT,
    font_choice TEXT,
    created_at TEXT NOT NULL DEFAULT (current_timestamp),
    updated_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS character_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL,
    class_name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    subclass TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
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
    slug TEXT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    school TEXT NOT NULL DEFAULT '',
    casting_time TEXT NOT NULL DEFAULT '',
    range TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    components TEXT NOT NULL DEFAULT '',
    concentration INTEGER NOT NULL DEFAULT 0,
    ritual INTEGER NOT NULL DEFAULT 0,
    classes TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    source_key TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS character_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    spell_id INTEGER NOT NULL REFERENCES spells(id) ON DELETE CASCADE,
    prepared INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS character_weapons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    catalog_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    cost TEXT NOT NULL DEFAULT '',
    damage_dice TEXT NOT NULL DEFAULT '',
    damage_type TEXT NOT NULL DEFAULT '',
    weight REAL NOT NULL DEFAULT 0,
    properties TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    equipped INTEGER NOT NULL DEFAULT 0,
    is_magic INTEGER NOT NULL DEFAULT 0,
    magic_bonus INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    homebrew_source_id INTEGER REFERENCES homebrew_weapons(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS character_gear_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS character_armor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    catalog_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    cost TEXT NOT NULL DEFAULT '',
    base_armor_class INTEGER NOT NULL DEFAULT 10,
    dex_modifier TEXT NOT NULL DEFAULT 'full',
    strength_requirement INTEGER,
    stealth_disadvantage INTEGER NOT NULL DEFAULT 0,
    weight REAL NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    equipped INTEGER NOT NULL DEFAULT 0,
    is_magic INTEGER NOT NULL DEFAULT 0,
    magic_bonus INTEGER NOT NULL DEFAULT 0,
    homebrew_source_id INTEGER REFERENCES homebrew_armor(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS campaign_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    subject TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp),
    updated_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS campaign_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'chest',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS feats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    prerequisite TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    source_key TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS character_feats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    catalog_feat_id INTEGER REFERENCES feats(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    prerequisite TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT '',
    enabled INTEGER NOT NULL DEFAULT 1,
    effects TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS magic_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    rarity TEXT NOT NULL DEFAULT '',
    requires_attunement INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    source_key TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS character_magic_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    catalog_id INTEGER REFERENCES magic_items(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    rarity TEXT NOT NULL DEFAULT '',
    requires_attunement INTEGER NOT NULL DEFAULT 0,
    attuned INTEGER NOT NULL DEFAULT 0,
    equipped INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS monsters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT,
    name TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT '',
    alignment TEXT NOT NULL DEFAULT '',
    armor_class INTEGER NOT NULL DEFAULT 10,
    armor_detail TEXT NOT NULL DEFAULT '',
    hit_points INTEGER NOT NULL DEFAULT 1,
    hit_dice TEXT NOT NULL DEFAULT '',
    speed TEXT NOT NULL DEFAULT '',
    strength INTEGER NOT NULL DEFAULT 10,
    dexterity INTEGER NOT NULL DEFAULT 10,
    constitution INTEGER NOT NULL DEFAULT 10,
    intelligence INTEGER NOT NULL DEFAULT 10,
    wisdom INTEGER NOT NULL DEFAULT 10,
    charisma INTEGER NOT NULL DEFAULT 10,
    challenge_rating TEXT NOT NULL DEFAULT '0',
    xp INTEGER NOT NULL DEFAULT 0,
    senses TEXT NOT NULL DEFAULT '',
    languages TEXT NOT NULL DEFAULT '',
    traits TEXT NOT NULL DEFAULT '',
    actions TEXT NOT NULL DEFAULT '',
    legendary_actions TEXT NOT NULL DEFAULT '',
    source_key TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS dm_creatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    current_hp INTEGER NOT NULL DEFAULT 0,
    max_hp INTEGER NOT NULL DEFAULT 0,
    armor_class INTEGER NOT NULL DEFAULT 10,
    notes TEXT NOT NULL DEFAULT '',
    dexterity INTEGER NOT NULL DEFAULT 10,
    initiative INTEGER,
    conditions TEXT NOT NULL DEFAULT '',
    used_abilities TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS dm_party_initiative (
    character_id INTEGER PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    initiative INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dm_encounters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    creatures TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS dm_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp),
    updated_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS dm_timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    event_date TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS character_resource_uses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL,
    uses_remaining INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS character_custom_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    max_mode TEXT NOT NULL DEFAULT 'fixed',
    fixed_max INTEGER NOT NULL DEFAULT 1,
    uses_by_level TEXT NOT NULL DEFAULT '{}',
    ability TEXT NOT NULL DEFAULT 'charisma',
    ability_bonus INTEGER NOT NULL DEFAULT 0,
    ability_minimum INTEGER NOT NULL DEFAULT 1,
    recharge_on TEXT NOT NULL DEFAULT 'long',
    is_point_pool INTEGER NOT NULL DEFAULT 0,
    icon TEXT NOT NULL DEFAULT '',
    roll_formula TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    homebrew_source_id INTEGER REFERENCES homebrew_resources(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS character_resource_overrides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL,
    hidden INTEGER NOT NULL DEFAULT 0,
    max_override INTEGER
  );

  CREATE TABLE IF NOT EXISTS dice_roll_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
    expression TEXT NOT NULL,
    result INTEGER NOT NULL,
    breakdown TEXT NOT NULL,
    rolled_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_weapons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    cost TEXT NOT NULL DEFAULT '',
    damage_dice TEXT NOT NULL DEFAULT '',
    damage_type TEXT NOT NULL DEFAULT '',
    weight REAL NOT NULL DEFAULT 0,
    properties TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    is_magic INTEGER NOT NULL DEFAULT 0,
    magic_bonus INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_armor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    cost TEXT NOT NULL DEFAULT '',
    base_armor_class INTEGER NOT NULL DEFAULT 10,
    dex_modifier TEXT NOT NULL DEFAULT 'full',
    strength_requirement INTEGER,
    stealth_disadvantage INTEGER NOT NULL DEFAULT 0,
    weight REAL NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    is_magic INTEGER NOT NULL DEFAULT 0,
    magic_bonus INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    max_mode TEXT NOT NULL DEFAULT 'fixed',
    fixed_max INTEGER NOT NULL DEFAULT 1,
    uses_by_level TEXT NOT NULL DEFAULT '{}',
    ability TEXT NOT NULL DEFAULT 'charisma',
    ability_bonus INTEGER NOT NULL DEFAULT 0,
    ability_minimum INTEGER NOT NULL DEFAULT 1,
    recharge_on TEXT NOT NULL DEFAULT 'long',
    is_point_pool INTEGER NOT NULL DEFAULT 0,
    icon TEXT NOT NULL DEFAULT '',
    roll_formula TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    ability_bonuses TEXT NOT NULL DEFAULT '',
    size TEXT NOT NULL DEFAULT 'Medium',
    speed INTEGER NOT NULL DEFAULT 30,
    traits TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    hit_die INTEGER NOT NULL DEFAULT 8,
    saving_throws TEXT NOT NULL DEFAULT '',
    armor_proficiencies TEXT NOT NULL DEFAULT '',
    weapon_proficiencies TEXT NOT NULL DEFAULT '',
    traits TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );

  CREATE TABLE IF NOT EXISTS homebrew_subclasses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruleset TEXT NOT NULL DEFAULT '5e',
    name TEXT NOT NULL,
    parent_class_id TEXT NOT NULL DEFAULT '',
    traits TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
`;
