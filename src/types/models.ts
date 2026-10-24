import type { InferSelectModel } from "drizzle-orm";
import type {
  characterEquipment,
  characterSpells,
  characters,
  diceRollHistory,
  dressUpItems,
  spellSlots,
  spells,
} from "../db/schema";

export type Character = InferSelectModel<typeof characters>;
export type SpellSlot = InferSelectModel<typeof spellSlots>;
export type Spell = InferSelectModel<typeof spells>;
export type CharacterSpell = InferSelectModel<typeof characterSpells>;
export type DressUpItem = InferSelectModel<typeof dressUpItems>;
export type CharacterEquipment = InferSelectModel<typeof characterEquipment>;
export type DiceRoll = InferSelectModel<typeof diceRollHistory>;

export type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";
