import type { InferSelectModel } from "drizzle-orm";
import type {
  campaignItems,
  campaignNotes,
  characterArmor,
  characterClasses,
  characterEquipment,
  characterSpells,
  characterWeapons,
  characters,
  diceRollHistory,
  equipmentItems,
  spellSlots,
  spells,
} from "../db/schema";

export type Character = InferSelectModel<typeof characters>;
export type CharacterClass = InferSelectModel<typeof characterClasses>;
export type SpellSlot = InferSelectModel<typeof spellSlots>;
export type Spell = InferSelectModel<typeof spells>;
export type CharacterSpell = InferSelectModel<typeof characterSpells>;
export type EquipmentItem = InferSelectModel<typeof equipmentItems>;
export type CharacterEquipment = InferSelectModel<typeof characterEquipment>;
export type CharacterWeapon = InferSelectModel<typeof characterWeapons>;
export type CharacterArmor = InferSelectModel<typeof characterArmor>;
export type CampaignItem = InferSelectModel<typeof campaignItems>;
export type CampaignNote = InferSelectModel<typeof campaignNotes>;
export type DiceRoll = InferSelectModel<typeof diceRollHistory>;

export type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";
