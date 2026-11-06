import type { InferSelectModel } from "drizzle-orm";
import type {
  campaignItems,
  campaignNotes,
  characterArmor,
  characterClasses,
  characterFeats,
  characterGearItems,
  characterCustomResources,
  characterResourceUses,
  characterSpells,
  characterWeapons,
  characters,
  diceRollHistory,
  spellSlots,
  spells,
} from "../db/schema";

export type Character = InferSelectModel<typeof characters>;
export type CharacterClass = InferSelectModel<typeof characterClasses>;
export type SpellSlot = InferSelectModel<typeof spellSlots>;
export type Spell = InferSelectModel<typeof spells>;
export type CharacterSpell = InferSelectModel<typeof characterSpells>;
export type CharacterWeapon = InferSelectModel<typeof characterWeapons>;
export type CharacterGearItem = InferSelectModel<typeof characterGearItems>;
export type CharacterArmor =InferSelectModel<typeof characterArmor>;
export type CampaignItem = InferSelectModel<typeof campaignItems>;
export type CampaignNote = InferSelectModel<typeof campaignNotes>;
export type DiceRoll = InferSelectModel<typeof diceRollHistory>;
export type CharacterResourceUse = InferSelectModel<typeof characterResourceUses>;
export type CharacterCustomResource = InferSelectModel<typeof characterCustomResources>;
export type CharacterFeatRow = InferSelectModel<typeof characterFeats>;

export type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";
