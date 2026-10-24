import { sql } from "drizzle-orm";
import {
  integer,
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
  maxHp: integer("max_hp").notNull().default(0),
  currentHp: integer("current_hp").notNull().default(0),
  tempHp: integer("temp_hp").notNull().default(0),
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
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
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
  name: text("name").notNull(),
  level: integer("level").notNull().default(0),
  school: text("school").notNull().default(""),
  castingTime: text("casting_time").notNull().default(""),
  range: text("range").notNull().default(""),
  duration: text("duration").notNull().default(""),
  components: text("components").notNull().default(""),
  description: text("description").notNull().default(""),
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

export const dressUpItems = sqliteTable("dress_up_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slot: text("slot").notNull(),
  packId: text("pack_id").notNull().default("base"),
  imageAsset: text("image_asset").notNull(),
});

export const characterEquipment = sqliteTable("character_equipment", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  dressUpItemId: integer("dress_up_item_id")
    .notNull()
    .references(() => dressUpItems.id, { onDelete: "cascade" }),
  slot: text("slot").notNull(),
});

export const diceRollHistory = sqliteTable("dice_roll_history", {
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
