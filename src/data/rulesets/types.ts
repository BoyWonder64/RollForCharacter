import type { AbilityScoreKey } from "../../types/models";

/** One named racial trait (e.g. Darkvision, Stonecunning), verbatim SRD rules text. */
export type RaceTrait = {
  name: string;
  description: string;
};

/**
 * A race's fixed language grant, for editions (2014 5e) where languages are
 * determined by race rather than chosen freely at character creation. e.g.
 * Dwarf: `{ granted: ["common", "dwarvish"] }`; Human: `{ granted: ["common"],
 * choice: { count: 1 } }`. Undefined on a `RaceDefinition` when that edition
 * either doesn't model languages this way (see `RulesetCatalog.universalLanguageGrant`)
 * or doesn't model them at all yet (3.5e, Custom race).
 */
export type RaceLanguageGrant = {
  /** LanguageDefinition ids always known, e.g. ["common", "draconic"]. */
  granted: string[];
  /** Extra languages of the player's choice, on top of `granted`. */
  choice?: { count: number };
};

export type RaceDefinition = {
  id: string;
  name: string;
  speed: number;
  size: "Small" | "Medium";
  abilityBonuses: Partial<Record<AbilityScoreKey, number>>;
  /** e.g. Half-Elf: +1 to two abilities of the player's choice, on top of abilityBonuses */
  chooseAbilityBonus?: {
    count: number;
    amount: number;
    excluding?: AbilityScoreKey[];
  };
  summary: string;
  /** Named mechanical traits (Darkvision, Trance, Breath Weapon, etc), shown read-only on the sheet. Undefined for editions/races not yet populated with structured trait data. */
  traits?: RaceTrait[];
  /** This race's fixed language grant. See `RaceLanguageGrant` -- undefined when language choice is universal for the ruleset (2024 5e) or not modeled yet (3.5e). */
  languages?: RaceLanguageGrant;
};

/** A known language a character can speak/read/write. */
export type LanguageDefinition = {
  id: string;
  name: string;
  /** Secret/exotic languages (Abyssal, Druidic, Thieves' Cant, etc) vs the widespread "Standard" ones. */
  rare: boolean;
  /** Short note on who speaks it -- shown on tap, same spirit as skill/ability descriptions elsewhere in the app. */
  typicalSpeakers: string;
};

export type SkillDefinition = {
  id: string;
  name: string;
  ability: AbilityScoreKey;
};

/** 5e's four weapon-category proficiency groupings, plus "Simple"/"Martial" for a class's blanket grant across both melee and ranged. */
export type WeaponProficiencyCategory = WeaponCategory | "Simple" | "Martial";

// A single piece of starting gear. `weaponChoice` is used wherever the SRD
// says "any simple weapon" or "a martial melee weapon" -- rather than leaving
// that as unresolvable flavor text, onboarding resolves it to a real
// `WeaponDefinition` the player picks from the full catalog for that
// category, so they always see concrete stats instead of a vague label.
export type EquipmentGrant =
  | { kind: "weapon"; weaponId: string; quantity?: number }
  | { kind: "weaponChoice"; category: WeaponProficiencyCategory; quantity?: number }
  | { kind: "armor"; armorId: string }
  /** A generic item with no catalog stats (a pack, a holy symbol, ammunition, etc). */
  | { kind: "item"; name: string; quantity?: number; description?: string };

/** One alternative within a startingEquipment line -- every grant in it is received together if this option is the one chosen. */
export type EquipmentOption = EquipmentGrant[];

/** One line of starting gear. More than one option means the player picks exactly one; a single option is granted automatically. */
export type EquipmentLine = EquipmentOption[];

export type ClassDefinition = {
  id: string;
  name: string;
  hitDie: 6 | 8 | 10 | 12;
  // 5e-style ability-save proficiency model (2014 and 2024 5e both use this
  // -- a flat proficiency bonus added to one of six ability saves). Optional
  // because it doesn't fit every edition's mechanics -- see
  // `baseSaveProgression` below for 3.5e's structurally different model.
  savingThrows?: [AbilityScoreKey, AbilityScoreKey];
  spellcastingAbility?: AbilityScoreKey;
  /**
   * 5e multiclassing's spellcasting rule: "full" casters count every class
   * level toward the shared multiclass slot table, "half" casters
   * (Paladin/Ranger) count `floor(level / 2)`, and "pact" (Warlock) is
   * excluded from that table entirely -- Pact Magic is its own separate
   * slot pool, tracked at Warlock's own class level. Undefined for
   * non-spellcasters.
   */
  casterType?: "full" | "half" | "pact";
  /** How many skills this class picks, and from which list (skill ids). */
  skillChoices?: { count: number; options: string[] };
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  startingEquipment?: EquipmentLine[];
  /**
   * 3.5e's base save progression: a "good" save starts at +2 and scales
   * faster per level, a "poor" save scales slower -- a structurally
   * different mechanic from 5e's flat per-ability proficiency, so it's its
   * own field rather than forced into `savingThrows`.
   */
  baseSaveProgression?: { fortitude: "good" | "poor"; reflex: "good" | "poor"; will: "good" | "poor" };
  /** 3.5e "class skills" (skill ids) -- reference list only; full skill-point/rank tracking isn't modeled. */
  classSkills?: string[];
  summary: string;
};

export type ClassFeature = {
  level: number;
  name: string;
  /** Full mechanical rules text. Verbatim SRD/CC-BY content where the class itself is SRD content. */
  description: string;
};

export type Subclass = {
  id: string;
  name: string;
  summary: string;
  /**
   * True only when this subclass's own feature text is itself SRD/OGL/CC-BY
   * licensed and safe to ship verbatim -- the same distinction already made
   * for backgrounds (see `project_character_onboarding` memory). Each 5e
   * SRD edition publishes exactly one subclass per class under this rule;
   * every other subclass (Battle Master, Circle of the Moon, etc.) is
   * PHB-only content, so it's represented with `srdLicensed: false` and no
   * copied feature text -- name/summary only, same free-text spirit as the
   * Background picker's "Custom..." option.
   */
  srdLicensed: boolean;
  features: ClassFeature[];
};

export type SpellSlotRow = {
  level: number;
  /** Index 0 = 1st-level slots, index 1 = 2nd-level, etc. */
  slots: number[];
  cantripsKnown?: number;
  /** Omit for prepared casters (cleric/druid/paladin/wizard) -- they prepare from their whole list instead of learning a fixed number. */
  spellsKnown?: number;
};

export type ClassProgression = {
  /** Matches `ClassDefinition.id`. */
  classId: string;
  /** Level at which this class chooses a subclass. Absent for classes with no subclass (rare, but kept optional for 3.5e-style classes). */
  subclassLevel?: number;
  /** The SRD's name for "subclass" in this class's own fiction, e.g. "Divine Domain", "Martial Archetype", "Primal Path". */
  subclassLabel?: string;
  subclasses?: Subclass[];
  /** 5e Ability Score Improvement / feat-choice levels (2014 & 2024 both use 4/8/12/16/19 for most classes, plus class-specific bonus levels). */
  asiLevels?: number[];
  /** 3.5e-style feat-only choice levels, kept separate from ability-score increases since 3.5e splits the two. */
  featLevels?: number[];
  /** 3.5e-style pure ability-score-increase levels (no feat attached). */
  abilityScoreIncreaseLevels?: number[];
  /** Base-class features by the level they're first gained (not subclass features -- those live on each `Subclass`). */
  features: ClassFeature[];
  /** Spellcasting progression table, for classes that cast spells. */
  spellProgression?: SpellSlotRow[];
};

export type SpellDefinition = {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  components: string;
  concentration: boolean;
  ritual: boolean;
  /** ClassDefinition ids (e.g. "wizard") that can cast this spell. */
  classes: string[];
  description: string;
};

export type WeaponCategory = "Simple Melee" | "Simple Ranged" | "Martial Melee" | "Martial Ranged";

export type WeaponDefinition = {
  id: string;
  name: string;
  category: WeaponCategory;
  cost: string;
  /** e.g. "1d8", "2d6" -- empty for the Net, which deals no damage. */
  damageDice: string;
  damageType: "Bludgeoning" | "Piercing" | "Slashing" | "";
  /** Pounds. */
  weight: number;
  /** Human-readable property list, e.g. ["Finesse", "Light", "Thrown (range 20/60)"]. */
  properties: string[];
  /** What this weapon is and how it's used -- shown to the player in the Equipment tab. */
  description: string;
};

export type ArmorCategory = "Light" | "Medium" | "Heavy" | "Shield";

export type ArmorDefinition = {
  id: string;
  name: string;
  category: ArmorCategory;
  cost: string;
  /**
   * Base AC the armor provides on its own (before Dex), e.g. 11 for Padded.
   * For Shield this is the flat AC bonus (+2) added on top of whatever else
   * the wearer has equipped, rather than a base to replace.
   */
  baseArmorClass: number;
  /** How the wearer's Dex modifier applies on top of `baseArmorClass`. Shields don't use Dex at all. */
  dexModifier: "full" | "max2" | "none";
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
  /** Pounds. */
  weight: number;
  /** What this armor is and how it's worn -- shown to the player in the Equipment tab. */
  description: string;
};

export type RulesetCatalog = {
  id: string;
  label: string;
  races: RaceDefinition[];
  classes: ClassDefinition[];
  /** Per-level/subclass data driving the Level Up workflow. Optional and sparse while editions are still being populated -- see TODO.md. */
  classProgressions?: ClassProgression[];
  spells: SpellDefinition[];
  skills: SkillDefinition[];
  /** Optional and sparse while editions are still being populated -- see TODO.md. */
  weapons?: WeaponDefinition[];
  armor?: ArmorDefinition[];
  /** The selectable language catalog for this ruleset. Undefined for editions not yet populated (3.5e) -- onboarding/edit fall back to the old freetext field in that case. */
  languages?: LanguageDefinition[];
  /**
   * Set only for editions where every character gets the same language grant
   * regardless of race (2024 5e: "Common plus two languages you choose").
   * When unset, each race's own `RaceDefinition.languages` grant applies
   * instead (2014 5e).
   */
  universalLanguageGrant?: { granted: string[]; chooseCount: number };
};

// The 9 standard alignments shared across D&D editions (not ruleset-specific
// content, just a generic roleplay axis) -- used by onboarding's alignment
// picker and Edit's alignment field for every ruleset.
export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
] as const;

export const CUSTOM_OPTION_ID = "custom";

// Used when the player types their own race/class instead of picking one
// from the catalog -- gives the HP/stat calculators sane generic defaults.
export const CUSTOM_RACE_FALLBACK: RaceDefinition = {
  id: CUSTOM_OPTION_ID,
  name: "Custom",
  speed: 30,
  size: "Medium",
  abilityBonuses: {},
  summary: "A custom race you define yourself.",
};

export const CUSTOM_CLASS_FALLBACK: ClassDefinition = {
  id: CUSTOM_OPTION_ID,
  name: "Custom",
  hitDie: 8,
  savingThrows: ["strength", "constitution"],
  summary: "A custom class you define yourself.",
};
