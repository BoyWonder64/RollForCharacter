import { sql } from "drizzle-orm";
import {
  type AnySQLiteColumn,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  ruleset: text("ruleset").notNull().default("5e"),
  race: text("race").notNull().default(""),
  className: text("class_name").notNull().default(""),
  background: text("background").notNull().default(""),
  level: integer("level").notNull().default(1),
  // The subclass id/name chosen via Level Up (e.g. "path-of-the-berserker"),
  // once the character reaches its class's subclass-choice level. Empty
  // until then.
  subclass: text("subclass").notNull().default(""),
  // Newline-separated free-text feat names/descriptions picked at ASI/feat
  // levels -- no structured feat catalog exists yet, so this is freeform
  // text input, same spirit as the free-text Background field.
  feats: text("feats").notNull().default(""),
  // Generic roleplay/sheet fields -- all freeform text (no structured catalog
  // behind any of these, same spirit as Background/Notes) except alignment,
  // which is picked from the fixed ALIGNMENTS list but still stored as plain
  // text since it's shared across rulesets.
  alignment: text("alignment").notNull().default(""),
  personalityTraits: text("personality_traits").notNull().default(""),
  ideals: text("ideals").notNull().default(""),
  bonds: text("bonds").notNull().default(""),
  flaws: text("flaws").notNull().default(""),
  // Comma-separated LanguageDefinition ids (src/data/rulesets/sharedLanguages.ts),
  // e.g. "common,draconic". Only populated for rulesets with a structured
  // language catalog (5e, 5e-2024) -- 3.5e has no catalog yet, so its
  // languages still live in the freetext `otherProficiencies` box below.
  languages: text("languages").notNull().default(""),
  // The 5e sheet's "Other Proficiencies & Languages" box -- tool
  // proficiencies aren't structurally modeled anywhere in this app, so this
  // stays freeform rather than a fixed catalog. Languages themselves moved
  // to the structured `languages` column above for rulesets that have a
  // catalog; this box still holds the user's own notes/extras.
  otherProficiencies: text("other_proficiencies").notNull().default(""),
  // The 5e sheet's "Features & Traits" box -- racial traits, background
  // feature, and anything else not already covered by the structured
  // class-progression features tracked via Level Up.
  featuresAndTraits: text("features_and_traits").notNull().default(""),
  // 5e Inspiration: a DM-granted die the player can later spend for
  // advantage. Toggled directly from the character sheet.
  inspiration: integer("inspiration", { mode: "boolean" }).notNull().default(false),
  maxHp: integer("max_hp").notNull().default(0),
  currentHp: integer("current_hp").notNull().default(0),
  tempHp: integer("temp_hp").notNull().default(0),
  deathSaveSuccesses: integer("death_save_successes").notNull().default(0),
  deathSaveFailures: integer("death_save_failures").notNull().default(0),
  // Unspent Hit Dice -- total pool is `level` (single-class only, same
  // limitation as the rest of the schema until multiclassing is modeled).
  // Starts at 1 on creation, gains one per level up, and is spent (not
  // reset) by a short rest; a long rest regains half the total (rounded
  // down, minimum 1).
  hitDiceRemaining: integer("hit_dice_remaining").notNull().default(1),
  // Comma-separated ConditionDefinition ids (src/data/conditions.ts), e.g.
  // "poisoned,prone". A simple sheet checklist, not a combat-grid tracker --
  // nothing here changes any derived stat automatically.
  conditions: text("conditions").notNull().default(""),
  // 5e exhaustion (0-6, 6 = death) -- tracked separately from `conditions`
  // since it's leveled rather than boolean.
  exhaustionLevel: integer("exhaustion_level").notNull().default(0),
  // The single character_spells row (5e only allows one spell of
  // concentration at a time) this character is currently concentrating on.
  // Null when not concentrating. `concentratingSpellName` is denormalized
  // alongside it so the sheet can still show what was being concentrated on
  // even if that spell is later unlearned (ON DELETE SET NULL clears the id
  // but leaves the name).
  concentratingSpellId: integer("concentrating_spell_id").references(
    (): AnySQLiteColumn => characterSpells.id,
    { onDelete: "set null" }
  ),
  concentratingSpellName: text("concentrating_spell_name").notNull().default(""),
  // Comma-separated SkillDefinition ids (e.g. "perception,animal-handling").
  skillProficiencies: text("skill_proficiencies").notNull().default(""),
  // Comma-separated AbilityScoreKey ids (e.g. "wisdom") -- EXTRA saving-throw
  // proficiencies beyond the two a class grants automatically (e.g. the
  // Resilient feat), unioned with the class's fixed list rather than
  // replacing it.
  savingThrowProficiencies: text("saving_throw_proficiencies").notNull().default(""),
  // Homebrew overlay fields, read only when `race`/`className` doesn't match
  // any entry in the ruleset's catalog (i.e. resolves to CUSTOM_RACE_FALLBACK/
  // CUSTOM_CLASS_FALLBACK -- see getRaceDefinitionForCharacter/
  // getClassDefinitionForCharacter in characterCalculations.ts, which merge
  // these onto the fallback). One custom race and one custom class per
  // character -- a second multiclassed custom class isn't modeled, same
  // limitation as the rest of this schema until multiclassing is modeled
  // more fully.
  customRaceAbilityBonuses: text("custom_race_ability_bonuses").notNull().default(""), // JSON: Partial<Record<AbilityScoreKey, number>>
  customRaceSize: text("custom_race_size").notNull().default("Medium"),
  customRaceSpeed: integer("custom_race_speed").notNull().default(30),
  customRaceTraits: text("custom_race_traits").notNull().default(""), // JSON: RaceTrait[]
  customClassHitDie: integer("custom_class_hit_die").notNull().default(8),
  customClassSavingThrows: text("custom_class_saving_throws").notNull().default(""), // comma-separated AbilityScoreKey, e.g. "strength,constitution"
  customClassArmorProficiencies: text("custom_class_armor_proficiencies").notNull().default(""), // comma-separated free-text labels
  customClassWeaponProficiencies: text("custom_class_weapon_proficiencies").notNull().default(""), // comma-separated free-text labels
  customClassTraits: text("custom_class_traits").notNull().default(""), // JSON: ClassTrait[]
  // Backpointers to a shared homebrew-library entry this character's race/
  // class/subclass was picked from (see homebrewRaces/homebrewClasses/
  // homebrewSubclasses below) -- provenance only. Picking one clones its
  // fields onto the custom* columns above the same way picking a catalog
  // item clones onto characterWeapons/characterArmor, so the existing
  // CUSTOM_OPTION_ID merge path in characterCalculations.ts needs no changes
  // and a library edit never retroactively changes a character that already
  // took it. Null for a one-off custom race/class never saved to the library.
  homebrewRaceId: integer("homebrew_race_id").references((): AnySQLiteColumn => homebrewRaces.id, {
    onDelete: "set null",
  }),
  homebrewClassId: integer("homebrew_class_id").references((): AnySQLiteColumn => homebrewClasses.id, {
    onDelete: "set null",
  }),
  homebrewSubclassId: integer("homebrew_subclass_id").references(
    (): AnySQLiteColumn => homebrewSubclasses.id,
    { onDelete: "set null" }
  ),
  armorClass: integer("armor_class").notNull().default(10),
  speed: integer("speed").notNull().default(30),
  proficiencyBonus: integer("proficiency_bonus").notNull().default(2),
  strength: integer("strength").notNull().default(10),
  dexterity: integer("dexterity").notNull().default(10),
  constitution: integer("constitution").notNull().default(10),
  intelligence: integer("intelligence").notNull().default(10),
  wisdom: integer("wisdom").notNull().default(10),
  charisma: integer("charisma").notNull().default(10),
  notes: text("notes").notNull().default(""),
  portraitUri: text("portrait_uri"),
  // Stable cross-device identity for cloud sync (Supabase `characters.client_sync_id`)
  // and for Party mode's `character_client_sync_id` -- this local autoincrement
  // `id` isn't globally unique, so it can't serve either purpose. Generated via
  // expo-crypto's randomUUID() at creation time; backfilled for older rows by
  // migrateColumns.ts.
  syncId: text("sync_id"),
  // Standard 5e denominations.
  copperPieces: integer("copper_pieces").notNull().default(0),
  silverPieces: integer("silver_pieces").notNull().default(0),
  electrumPieces: integer("electrum_pieces").notNull().default(0),
  goldPieces: integer("gold_pieces").notNull().default(0),
  platinumPieces: integer("platinum_pieces").notNull().default(0),
  // Set during onboarding; whether this character's table tracks food/water
  // supply. No provisions-consumption mechanic is built yet -- this just
  // records the player's stated preference for when one exists.
  tracksProvisions: integer("tracks_provisions", { mode: "boolean" }).notNull().default(false),
  // Set during onboarding: whether this character levels up via tracked XP
  // (vs. the DM just calling for a level-up, "milestone" style). When true,
  // `experiencePoints` is shown/editable and compared against the ruleset's
  // XP-per-level table; when false, leveling is purely the manual button.
  usesXp: integer("uses_xp", { mode: "boolean" }).notNull().default(false),
  experiencePoints: integer("experience_points").notNull().default(0),
  // Null means "use the device's global theme/font" -- only set once a
  // player picks an explicit per-character override in Edit.
  themeFamily: text("theme_family"),
  fontChoice: text("font_choice"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// One row per class a character has levels in. A never-multiclassed
// character has zero rows here -- `characters.className`/`level`/`subclass`
// alone are the single source of truth until the player actually
// multiclasses (see `addClass` in characterClassRepo.ts, which lazily seeds
// a sort_order 0 row from those fields the first time it's needed). Once
// rows exist, `characters.level` becomes the SUM of every row's level here,
// and `characters.className`/`subclass` mirror the sort_order 0 (first/
// "primary") class only -- which is also the RAW-correct class for 5e
// saving-throw proficiency, so every existing single-class lookup that
// reads those two fields off `characters` stays correct unchanged.
export const characterClasses = sqliteTable("character_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  // ClassDefinition id (e.g. "fighter"), or "custom" for a typed-in class.
  classId: text("class_id").notNull(),
  className: text("class_name").notNull(),
  level: integer("level").notNull().default(1),
  subclass: text("subclass").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const spellSlots = sqliteTable("spell_slots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  level: integer("level").notNull(),
  total: integer("total").notNull().default(0),
  used: integer("used").notNull().default(0),
});

export const spells = sqliteTable("spells", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Catalog key (e.g. "acid-splash") -- lets the seeder upsert by identity
  // instead of by name, and lets onboarding/spell-picker code look a spell
  // up without needing its DB-assigned id. Null for spells a player typed
  // in by hand (not from a ruleset catalog).
  slug: text("slug"),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  level: integer("level").notNull().default(0),
  school: text("school").notNull().default(""),
  castingTime: text("casting_time").notNull().default(""),
  range: text("range").notNull().default(""),
  duration: text("duration").notNull().default(""),
  components: text("components").notNull().default(""),
  concentration: integer("concentration", { mode: "boolean" }).notNull().default(false),
  ritual: integer("ritual", { mode: "boolean" }).notNull().default(false),
  // Comma-separated ClassDefinition ids (e.g. "sorcerer,wizard").
  classes: text("classes").notNull().default(""),
  description: text("description").notNull().default(""),
  // Which source this came from, same attribution pattern as feats/magicItems/
  // monsters below -- "" for the original seeded rows (predates this column),
  // "homebrew" for a library spell created via createHomebrewSpell.
  sourceKey: text("source_key").notNull().default(""),
  sourceName: text("source_name").notNull().default(""),
});

export const characterSpells = sqliteTable("character_spells", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  spellId: integer("spell_id")
    .notNull()
    .references(() => spells.id, { onDelete: "cascade" }),
  prepared: integer("prepared", { mode: "boolean" }).notNull().default(false),
});

// A weapon in a character's inventory -- either copied from a ruleset's
// `WeaponDefinition` catalog (via `catalogId`) or typed in by hand (`catalogId`
// null), same free-text-fallback spirit as the race/class pickers.
export const characterWeapons = sqliteTable("character_weapons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  // WeaponDefinition id this was added from, e.g. "longsword". Null for a
  // custom weapon the player typed in themselves.
  catalogId: text("catalog_id"),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  cost: text("cost").notNull().default(""),
  damageDice: text("damage_dice").notNull().default(""),
  damageType: text("damage_type").notNull().default(""),
  weight: real("weight").notNull().default(0),
  // Comma-separated property strings, e.g. "Finesse,Light,Thrown (range 20/60)".
  properties: text("properties").notNull().default(""),
  description: text("description").notNull().default(""),
  equipped: integer("equipped", { mode: "boolean" }).notNull().default(false),
  // Whether this is an enchanted weapon (e.g. a "+1 Longsword") -- magicBonus
  // is the flat enchantment bonus applied to attack rolls.
  isMagic: integer("is_magic", { mode: "boolean" }).notNull().default(false),
  magicBonus: integer("magic_bonus").notNull().default(0),
  // A stack of identical weapons (4 handaxes, 5 daggers) is one row.
  quantity: integer("quantity").notNull().default(1),
  // Backpointer to the homebrewWeapons library row this was cloned from, if
  // any -- see the comment on characters.homebrewRaceId for why this is a
  // clone-and-backpointer rather than a live reference.
  homebrewSourceId: integer("homebrew_source_id").references(
    (): AnySQLiteColumn => homebrewWeapons.id,
    { onDelete: "set null" }
  ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A non-weapon, non-armor item in a character's inventory: packs, holy
// symbols and other foci, tools, ammunition, ... Mostly granted by a class's
// starting equipment, but also addable by hand.
export const characterGearItems = sqliteTable("character_gear_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  description: text("description").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// An armor/shield in a character's inventory -- same catalog-or-custom
// pattern as `characterWeapons` above.
export const characterArmor = sqliteTable("character_armor", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  // ArmorDefinition id this was added from, e.g. "chain-mail". Null for a
  // custom armor the player typed in themselves.
  catalogId: text("catalog_id"),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  cost: text("cost").notNull().default(""),
  baseArmorClass: integer("base_armor_class").notNull().default(10),
  dexModifier: text("dex_modifier").notNull().default("full"),
  strengthRequirement: integer("strength_requirement"),
  stealthDisadvantage: integer("stealth_disadvantage", { mode: "boolean" })
    .notNull()
    .default(false),
  weight: real("weight").notNull().default(0),
  description: text("description").notNull().default(""),
  equipped: integer("equipped", { mode: "boolean" }).notNull().default(false),
  // Whether this is an enchanted item (e.g. "+1 Plate Armor") -- magicBonus is
  // the flat enchantment bonus applied to AC.
  isMagic: integer("is_magic", { mode: "boolean" }).notNull().default(false),
  magicBonus: integer("magic_bonus").notNull().default(0),
  // Backpointer to the homebrewArmor library row this was cloned from, if
  // any -- see the comment on characters.homebrewRaceId.
  homebrewSourceId: integer("homebrew_source_id").references((): AnySQLiteColumn => homebrewArmor.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A journal entry in a character's campaign notes history -- subject +
// body, editable after the fact, distinct from `characters.notes`
// (a single freeform notes field, edited only from Edit -- starting
// equipment is real characterWeapons/characterArmor rows, not text here).
export const campaignNotes = sqliteTable("campaign_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A "special item" the campaign notes mention -- narrative.
export const campaignItems = sqliteTable("campaign_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  // CampaignItemIconId (src/features/icons/iconAssets.ts) -- a string key,
  // not a file path, same pattern as every other icon lookup in this app.
  icon: text("icon").notNull().default("chest"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Reference catalog of feats (5e SRD 5.2, CC BY 4.0 -- see
// docs/DND_CONTENT_SOURCES.md). Browsable only;
// picking one still writes into `characters.feats` free text, same as a
// hand-typed feat, so nothing about the existing ASI/feat-choice flow had to
// change.
export const feats = sqliteTable("feats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug"),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  prerequisite: text("prerequisite").notNull().default(""),
  description: text("description").notNull().default(""),
  // Which official WotC SRD document this came from (e.g. "srd-2024") and
  // its display name, for the Settings → Legal & Licenses attribution
  // screen -- see docs/DND_CONTENT_SOURCES.md's "Scope" note. This table
  // also holds player-created homebrew feats (see `createHomebrewFeat` in
  // featRepo.ts), tagged `sourceKey: "homebrew"` / `sourceName: "Homebrew"`
  // instead of a real SRD key. Homebrew rows are the player's own content,
  // not covered by the SRD/CC-BY/OGL credits that screen lists.
  sourceKey: text("source_key").notNull().default(""),
  sourceName: text("source_name").notNull().default(""),
});

// A feat a character has actually taken -- catalog pick or homebrew,
// same catalog-or-custom pattern as `characterMagicItems`. Replaces the
// old freeform `characters.feats` text column (kept in place, no longer
// written to -- see `migrateLegacyFeatsIfNeeded`) so a feat can be shown,
// toggled, and removed individually instead of living in one opaque blob.
// `effects` is a JSON-encoded array of resolved `FeatEffect` objects (see
// characterCalculations.ts) -- any player choice (which ability, which
// skills) is already baked in, same spirit as `customRaceTraits`.
export const characterFeats = sqliteTable("character_feats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  catalogFeatId: integer("catalog_feat_id").references(() => feats.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  prerequisite: text("prerequisite").notNull().default(""),
  description: text("description").notNull().default(""),
  sourceName: text("source_name").notNull().default(""),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  effects: text("effects").notNull().default("[]"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Reference catalog of magic items (5e SRD 5.1 + 5.2, CC BY 4.0).
export const magicItems = sqliteTable("magic_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug"),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  rarity: text("rarity").notNull().default(""),
  requiresAttunement: integer("requires_attunement", { mode: "boolean" })
    .notNull()
    .default(false),
  description: text("description").notNull().default(""),
  sourceKey: text("source_key").notNull().default(""),
  sourceName: text("source_name").notNull().default(""),
});

// A magic item in a character's inventory -- same catalog-or-custom pattern
// as `characterWeapons`/`characterArmor`.
export const characterMagicItems = sqliteTable("character_magic_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  catalogId: integer("catalog_id").references(() => magicItems.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  rarity: text("rarity").notNull().default(""),
  requiresAttunement: integer("requires_attunement", { mode: "boolean" })
    .notNull()
    .default(false),
  attuned: integer("attuned", { mode: "boolean" }).notNull().default(false),
  equipped: integer("equipped", { mode: "boolean" }).notNull().default(false),
  description: text("description").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Reference catalog of monster/creature stat blocks (5e SRD 5.1 + 5.2, CC BY
// 4.0). `traits`/`actions`/`legendaryActions` are each a JSON-encoded array
// of {name, description}, same encoding style as other JSON-ish text columns
// in this schema (e.g. `properties` on characterWeapons).
export const monsters = sqliteTable("monsters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug"),
  name: text("name").notNull(),
  size: text("size").notNull().default(""),
  type: text("type").notNull().default(""),
  alignment: text("alignment").notNull().default(""),
  armorClass: integer("armor_class").notNull().default(10),
  armorDetail: text("armor_detail").notNull().default(""),
  hitPoints: integer("hit_points").notNull().default(1),
  hitDice: text("hit_dice").notNull().default(""),
  speed: text("speed").notNull().default(""),
  strength: integer("strength").notNull().default(10),
  dexterity: integer("dexterity").notNull().default(10),
  constitution: integer("constitution").notNull().default(10),
  intelligence: integer("intelligence").notNull().default(10),
  wisdom: integer("wisdom").notNull().default(10),
  charisma: integer("charisma").notNull().default(10),
  challengeRating: text("challenge_rating").notNull().default("0"),
  xp: integer("xp").notNull().default(0),
  senses: text("senses").notNull().default(""),
  languages: text("languages").notNull().default(""),
  traits: text("traits").notNull().default(""),
  actions: text("actions").notNull().default(""),
  legendaryActions: text("legendary_actions").notNull().default(""),
  sourceKey: text("source_key").notNull().default(""),
  sourceName: text("source_name").notNull().default(""),
});

// A creature DM mode has added to its active/encounter list -- independent
// of any single character (DM mode is a global toggle, not character-bound).
// `monsterId` is null for a creature added ad hoc rather than from the
// catalog.
export const dmCreatures = sqliteTable("dm_creatures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  monsterId: integer("monster_id").references(() => monsters.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  currentHp: integer("current_hp").notNull().default(0),
  maxHp: integer("max_hp").notNull().default(0),
  armorClass: integer("armor_class").notNull().default(10),
  notes: text("notes").notNull().default(""),
  // Used for initiative on a creature with no catalog stat block (a catalog
  // creature rolls from its monster row's dexterity instead).
  dexterity: integer("dexterity").notNull().default(10),
  // Null until rolled/entered; the encounter tracker orders by this.
  initiative: integer("initiative"),
  // Comma-separated condition ids, same format as `characters.conditions`.
  conditions: text("conditions").notNull().default(""),
  // JSON map of ability name -> times used, for recharge / per-day / rest
  // limited abilities. Empty string means nothing spent.
  usedAbilities: text("used_abilities").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A party member's initiative in the current encounter -- kept separate from
// `characters` so DM mode's tracker never touches the character sheet.
export const dmPartyInitiative = sqliteTable("dm_party_initiative", {
  characterId: integer("character_id")
    .primaryKey()
    .references(() => characters.id, { onDelete: "cascade" }),
  initiative: integer("initiative").notNull(),
});

// A saved encounter: a JSON snapshot of the creature list (name, catalog id,
// max HP, AC, DEX) so it can be loaded back at full health later.
export const dmEncounters = sqliteTable("dm_encounters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  creatures: text("creatures").notNull().default("[]"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A DM session-notes journal entry -- same subject+body shape as a
// character's `campaignNotes`, but global to DM mode (not tied to any one
// character, same spirit as `dmCreatures`/`dmEncounters`). Replaces the old
// single freeform AsyncStorage textbox; see `migrateLegacySessionNotesIfNeeded`
// in dmNotesRepo.ts for the one-time move of whatever was already written
// there into this table.
export const dmNotes = sqliteTable("dm_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaign: text("campaign").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A single entry in the DM's running timeline of campaign events -- global
// to DM mode like `dmNotes` above. `eventDate` is a freeform label (a
// session number or an in-game calendar date) since campaigns don't share
// one date format; `sortOrder` is what the timeline actually displays in,
// set to one past the current max on insert so new events default to the
// end of the list.
export const dmTimelineEvents = sqliteTable("dm_timeline_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  campaign: text("campaign").notNull().default(""),
  title: text("title").notNull().default(""),
  eventDate: text("event_date").notNull().default(""),
  body: text("body").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// One row per character per limited-use class resource they've spent any
// uses of (Action Surge, Second Wind, Indomitable, ...) -- see
// `ClassResourceDefinition` (src/data/rulesets/types.ts). A generic pool
// shared by every such feature across every class, instead of a dedicated
// column per feature; `resourceId` matches a `ClassResourceDefinition.id`.
// No row yet means "at max for the character's current level" -- rows are
// only written once a use is spent or a rest recharges one.
export const characterResourceUses = sqliteTable("character_resource_uses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  resourceId: text("resource_id").notNull(),
  usesRemaining: integer("uses_remaining").notNull().default(0),
});

// A limited-use ability or tracker the player created themselves (their own
// Action Surge / Second Wind / table-specific counter). Converted to a
// `ClassResourceDefinition` with id `custom-<id>` by `listCharacterResources`,
// so spent uses live in `character_resource_uses` like every catalog resource.
export const characterCustomResources = sqliteTable("character_custom_resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  // How max uses is computed: "fixed" (`fixedMax`), "level" (`usesByLevel`
  // breakpoints), or "ability" (ability modifier + bonus, floored at
  // `abilityMinimum`). Mirrors ClassResourceDefinition's two shapes.
  maxMode: text("max_mode").notNull().default("fixed"),
  fixedMax: integer("fixed_max").notNull().default(1),
  usesByLevel: text("uses_by_level").notNull().default("{}"), // JSON: Record<level, uses>
  ability: text("ability").notNull().default("charisma"),
  abilityBonus: integer("ability_bonus").notNull().default(0),
  abilityMinimum: integer("ability_minimum").notNull().default(1),
  // "short": fully recharges on a short or long rest. "long": long rest only.
  // "manual": never recharges on a rest -- only the +/- controls change it.
  rechargeOn: text("recharge_on").notNull().default("long"),
  isPointPool: integer("is_point_pool", { mode: "boolean" }).notNull().default(false),
  // CampaignItemIconId (src/features/icons/iconAssets.ts), or "" for none.
  icon: text("icon").notNull().default(""),
  // Optional dice formula rolled alongside spending a use, e.g. "1d10 + level"
  // (see src/features/dice/rollFormula.ts). Empty = no roll.
  rollFormula: text("roll_formula").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  // Backpointer to the homebrewResources library row this was cloned from,
  // if any -- see the comment on characters.homebrewRaceId.
  homebrewSourceId: integer("homebrew_source_id").references(
    (): AnySQLiteColumn => homebrewResources.id,
    { onDelete: "set null" }
  ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A per-character house rule on a BUILT-IN (ruleset catalog) resource: change
// its max uses, or hide it entirely. No row = the resource behaves as the
// ruleset defines it. `resourceId` matches a ClassResourceDefinition.id.
export const characterResourceOverrides = sqliteTable("character_resource_overrides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  resourceId: text("resource_id").notNull(),
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
  // Null = keep the ruleset's max.
  maxOverride: integer("max_override"),
});

export const diceRollHistory =sqliteTable("dice_roll_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").references(() => characters.id, {
    onDelete: "set null",
  }),
  expression: text("expression").notNull(),
  result: integer("result").notNull(),
  breakdown: text("breakdown").notNull(),
  rolledAt: text("rolled_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ---------------------------------------------------------------------------
// Shared homebrew library -- global, not character-scoped, so a piece of
// homebrew can be created once and reused across characters, same spirit as
// the seeded feats/magicItems/monsters catalogs. Weapons/armor/resources have
// no catalog table to piggyback on (WeaponDefinition/ArmorDefinition are
// static TS data, character_custom_resources is character-scoped only), and
// races/classes/subclasses have no table at all today (they're stored inline
// on `characters`), so each gets its own table here. A character "takes" one
// of these by cloning its fields onto its own row/table (characterWeapons,
// characterArmor, characterCustomResources, or the custom* columns on
// characters), with a `homebrewSourceId`/`homebrewRaceId` etc. backpointer --
// never a live reference -- matching this schema's existing catalogId
// pattern throughout.
// ---------------------------------------------------------------------------

export const homebrewWeapons = sqliteTable("homebrew_weapons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  cost: text("cost").notNull().default(""),
  damageDice: text("damage_dice").notNull().default(""),
  damageType: text("damage_type").notNull().default(""),
  weight: real("weight").notNull().default(0),
  properties: text("properties").notNull().default(""),
  description: text("description").notNull().default(""),
  isMagic: integer("is_magic", { mode: "boolean" }).notNull().default(false),
  magicBonus: integer("magic_bonus").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const homebrewArmor = sqliteTable("homebrew_armor", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  category: text("category").notNull().default(""),
  cost: text("cost").notNull().default(""),
  baseArmorClass: integer("base_armor_class").notNull().default(10),
  dexModifier: text("dex_modifier").notNull().default("full"),
  strengthRequirement: integer("strength_requirement"),
  stealthDisadvantage: integer("stealth_disadvantage", { mode: "boolean" })
    .notNull()
    .default(false),
  weight: real("weight").notNull().default(0),
  description: text("description").notNull().default(""),
  isMagic: integer("is_magic", { mode: "boolean" }).notNull().default(false),
  magicBonus: integer("magic_bonus").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Mirrors characterCustomResources minus characterId -- see CustomResourceInput
// in resourceRepo.ts for the field shapes (maxMode/usesByLevel/ability/etc).
export const homebrewResources = sqliteTable("homebrew_resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  maxMode: text("max_mode").notNull().default("fixed"),
  fixedMax: integer("fixed_max").notNull().default(1),
  usesByLevel: text("uses_by_level").notNull().default("{}"), // JSON: Record<level, uses>
  ability: text("ability").notNull().default("charisma"),
  abilityBonus: integer("ability_bonus").notNull().default(0),
  abilityMinimum: integer("ability_minimum").notNull().default(1),
  rechargeOn: text("recharge_on").notNull().default("long"),
  isPointPool: integer("is_point_pool", { mode: "boolean" }).notNull().default(false),
  icon: text("icon").notNull().default(""),
  rollFormula: text("roll_formula").notNull().default(""),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A reusable homebrew race -- same fields as the customRace* overlay columns
// on `characters`, just not tied to one character. Picking one from the
// library (see homebrewRepo.ts's setCharacterHomebrewRace) copies these onto
// that character's customRace* columns, same CUSTOM_OPTION_ID merge path as
// a one-off custom race, with `characters.homebrewRaceId` left as a
// provenance backpointer.
export const homebrewRaces = sqliteTable("homebrew_races", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  abilityBonuses: text("ability_bonuses").notNull().default(""), // JSON: Partial<Record<AbilityScoreKey, number>>
  size: text("size").notNull().default("Medium"),
  speed: integer("speed").notNull().default(30),
  traits: text("traits").notNull().default(""), // JSON: RaceTrait[]
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A reusable homebrew class -- same fields as the customClass* overlay
// columns on `characters`. See homebrewRaces above for the pick-from-library
// pattern (setCharacterHomebrewClass).
export const homebrewClasses = sqliteTable("homebrew_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  hitDie: integer("hit_die").notNull().default(8),
  savingThrows: text("saving_throws").notNull().default(""), // comma-separated AbilityScoreKey, e.g. "strength,constitution"
  armorProficiencies: text("armor_proficiencies").notNull().default(""), // comma-separated free-text labels
  weaponProficiencies: text("weapon_proficiencies").notNull().default(""), // comma-separated free-text labels
  traits: text("traits").notNull().default(""), // JSON: ClassTrait[]
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// A reusable homebrew subclass -- flavor-only for now (named traits shown on
// the sheet), same as a homebrew class's traits. `parentClassId` is either a
// built-in ClassDefinition id (e.g. "fighter") or a homebrewClasses.id
// stringified, same free-form-id spirit as catalogId elsewhere in this
// schema. Full per-level homebrew class progression (spell slots, scaling
// resources) is a separate, later piece of work -- see TODO.md.
export const homebrewSubclasses = sqliteTable("homebrew_subclasses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleset: text("ruleset").notNull().default("5e"),
  name: text("name").notNull(),
  parentClassId: text("parent_class_id").notNull().default(""),
  traits: text("traits").notNull().default(""), // JSON: ClassTrait[]
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
