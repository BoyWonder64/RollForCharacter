import type { AbilityScoreKey } from "../../types/models";
import type { ToolOrInstrumentCategory } from "./toolsAndInstruments";

/** One named racial trait (e.g. Darkvision, Stonecunning), verbatim SRD rules text. */
export type RaceTrait = {
  name: string;
  description: string;
};

/**
 * One named trait a homebrew class grants, typed in by hand (e.g. a custom
 * class's "Wild Shape" or "Smite"). Same free-text shape as `RaceTrait` --
 * every catalog class's real features already come structured and
 * level-gated via `ClassFeature`/`ClassProgression`, so this only ever
 * carries data for a character whose `className` resolved to
 * `CUSTOM_CLASS_FALLBACK`.
 */
export type ClassTrait = RaceTrait;

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
  /** Other names this race was stored under before it was split into subraces (e.g. 2014 "Dwarf" -> "Hill Dwarf"), so existing characters still resolve. */
  aliases?: string[];
  /** Races that let the player pick their size (2024 Human/Tiefling: Medium or Small). `size` is the default/first option. */
  sizeOptions?: Array<"Small" | "Medium">;
  /** Flat max HP added at every character level (Dwarven Toughness: 1). */
  hitPointBonusPerLevel?: number;
  /** Named mechanical traits (Darkvision, Trance, Breath Weapon, etc), shown read-only on the sheet. Undefined for editions/races not yet populated with structured trait data. */
  traits?: RaceTrait[];
  /** This race's fixed language grant. See `RaceLanguageGrant` -- undefined when language choice is universal for the ruleset (2024 5e) or not modeled yet (3.5e). */
  languages?: RaceLanguageGrant;
  /** This race's limited-use traits (Breath Weapon, Relentless Endurance, ...), tracked the same way as `ClassProgression.resources`. Gated by total character level rather than a class level. */
  resources?: ClassResourceDefinition[];
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
  | { kind: "item"; name: string; quantity?: number; description?: string }
  /** Starting money (gold pieces) -- the "+ 7 GP" that comes bundled with a kit, or a fixed-amount "take gold instead" option (2024 5e, by class). */
  | { kind: "gold"; amount: number }
  /**
   * A generic, non-PHB-specific "take gold instead" option (2014 5e, which
   * has no SRD-licensed per-class gold table to draw real amounts from --
   * see TODO.md). Rolled once via `formula` (a dice-engine expression, e.g.
   * "4d4*10") the first time the player selects it, same for every 2014
   * class rather than copying WotC's per-class PHB numbers; the rolled
   * total is cached in `StartingEquipmentSelection.rolledAmounts`
   * (startingEquipment.ts) so re-renders don't re-roll it.
   */
  | { kind: "goldRoll"; formula: string }
  /**
   * One of a named "your choice" gear category the SRD leaves open (a
   * musical instrument, a type of artisan's tools, a gaming set) -- see
   * `toolsAndInstruments.ts`. `category` can list more than one when the
   * kit itself offers a combined choice (e.g. 2024 Monk's "artisan's tools
   * or musical instrument").
   */
  | { kind: "itemChoice"; category: ToolOrInstrumentCategory | ToolOrInstrumentCategory[]; quantity?: number };

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
   * SRD edition catalogs exactly one subclass per class under this rule;
   * every other published subclass (Battle Master, Circle of the Moon,
   * etc.) is non-SRD and is deliberately *not* catalogued or suggested by
   * name here -- see `project_subclass_policy` memory. A player who wants
   * one builds it as a real Homebrew Subclass (full traits) instead of
   * this app shipping a pre-written name/summary for it.
   */
  srdLicensed: boolean;
  features: ClassFeature[];
  /** This subclass's own limited-use resources (Wholeness of Body, Holy Nimbus, ...), on top of whatever the base class grants. Sparse -- only populated where the SRD-licensed subclass actually has one. */
  resources?: ClassResourceDefinition[];
  /**
   * Extra armor/weapon proficiencies this subclass grants on top of its base
   * class's (e.g. 2014 Life Domain Cleric's "Bonus Proficiency: heavy armor"
   * feature) -- same free-text phrasing as `ClassDefinition.armorProficiencies`/
   * `weaponProficiencies`, unioned in by `effectiveArmorProficiencies`/
   * `effectiveWeaponProficiencies` (characterCalculations.ts) rather than
   * read directly, since most subclasses grant none.
   */
  bonusArmorProficiencies?: string[];
  bonusWeaponProficiencies?: string[];
};

/**
 * A limited-use class feature (Action Surge, Second Wind, Indomitable,
 * Channel Divinity, Rage, ...) tracked as a generic uses-pool rather than a
 * dedicated DB column per feature -- `character_resource_uses` stores one
 * row per character per resource, keyed by `id` here.
 */
export type ClassResourceDefinition = {
  /** Stable key, namespaced per class (e.g. "fighter-action-surge"). */
  id: string;
  name: string;
  /**
   * Total uses at each level breakpoint this class grants/increases it,
   * e.g. `{ 2: 1, 17: 2 }` for Action Surge. The highest key <= the
   * character's level applies; below the lowest key, the feature isn't
   * gained yet. Mutually exclusive with `usesFromAbilityModifier` -- exactly
   * one governs a given resource's max.
   */
  usesByLevel?: Record<number, number>;
  /**
   * For resources whose max uses is an ability modifier rather than a fixed
   * number per level (e.g. Bardic Inspiration: Charisma modifier, minimum
   * 1). `grantedAtLevel` is the level this feature is first gained --
   * before it, the resource isn't shown at all, same as being absent from
   * `usesByLevel`.
   */
  usesFromAbilityModifier?: {
    ability: AbilityScoreKey;
    grantedAtLevel: number;
    minimum: number;
    /** Flat addition before the `minimum` floor -- e.g. Paladin Divine Sense is "1 + Charisma modifier" (`bonus: 1`), vs. Bardic Inspiration's bare modifier (`bonus` omitted). */
    bonus?: number;
    /** When true, the result is multiplied by the character's level in this class -- 3.5e Lay on Hands is "paladin level x Charisma bonus" (`multiplyByLevel: true`, `minimum: 0`), a hit-point pool rather than a discrete use count. */
    multiplyByLevel?: boolean;
  };
  /**
   * Uses regained on a short rest: "all" for the common full-reset case
   * (Action Surge), or a fixed number for partial recovery (2024 Second
   * Wind regains only 1 use per short rest). Omitted when this resource
   * only recovers on a long rest (e.g. Indomitable). A long rest always
   * restores every resource to its max regardless of this field.
   */
  shortRestRegain?: "all" | number;
  /**
   * Point pools that scale into the dozens (Ki/Focus Points, Sorcery
   * Points, Lay on Hands) rather than a handful of discrete uses --
   * rendered as a numeric stepper instead of a pip row.
   */
  isPointPool?: boolean;
  /** Player-created resources only: never recharged by any rest, not even a long rest -- only the +/- controls change it. */
  manualRecharge?: boolean;
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
  /** This class's limited-use resources (Action Surge, Second Wind, ...). Sparse -- only populated for classes/editions covered so far. */
  resources?: ClassResourceDefinition[];
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

export type WeaponCategory =
  | "Simple Melee"
  | "Simple Ranged"
  | "Martial Melee"
  | "Martial Ranged"
  // 3.5e's third proficiency tier, above Martial -- requires the Exotic
  // Weapon Proficiency feat unless a class grants the specific weapon.
  | "Exotic Melee"
  | "Exotic Ranged";

export type WeaponDefinition = {
  id: string;
  name: string;
  category: WeaponCategory;
  cost: string;
  /**
   * e.g. "1d8", "2d6" -- empty for the Net, which deals no damage. A double
   * weapon (3.5e only, e.g. Dwarven Urgrosh) has two head's worth separated
   * by "/", e.g. "1d6/1d4" -- `damageType` pairs up the same way when the
   * two heads differ.
   */
  damageDice: string;
  /**
   * e.g. "Piercing or slashing" (3.5e's Dagger) when a weapon's own SRD
   * entry lists more than one type, or "Bludgeoning/Piercing" (3.5e's
   * paired-head double weapons) -- not a strict enum since 3.5e's real data
   * doesn't fit one cleanly, unlike 5e's single-type weapons.
   */
  damageType: string;
  /** Pounds. */
  weight: number;
  /** Human-readable property list, e.g. ["Finesse", "Light", "Thrown (range 20/60)"]. */
  properties: string[];
  /** What this weapon is and how it's used -- shown to the player in the Equipment tab. */
  description: string;
  /**
   * 2024 5e's Weapon Mastery property (e.g. Longsword: Sap) -- undefined for
   * 2014/3.5e weapons, which don't have masteries. SRD 5.2, CC-BY licensed.
   */
  mastery?: { name: string; description: string };
  /**
   * 3.5e-only mechanical fields the 5e catalog has no equivalent for
   * (5e's `properties` strings and flat x2 crit cover the same ground
   * differently) -- undefined for 2014/2024 weapons.
   */
  threatRange?: number; // e.g. 19 for "19-20/x2"; omitted when the weapon has no expanded threat range (a plain x2/x3/x4).
  criticalMultiplier?: number; // e.g. 2, 3, 4.
  rangeIncrement?: number; // Feet, for a thrown or projectile weapon. Omitted for a pure melee weapon.
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
  /**
   * 5e's coarse "does this armor impose Stealth disadvantage" flag.
   * Derived from `armorCheckPenalty` for 3.5e armor (which has a graduated
   * penalty instead) -- true whenever that penalty is nonzero.
   */
  stealthDisadvantage: boolean;
  /** Pounds. */
  weight: number;
  /** What this armor is and how it's worn -- shown to the player in the Equipment tab. */
  description: string;
  /**
   * 3.5e-only mechanical fields with no 5e equivalent -- undefined for
   * 2014/2024 armor. `maxDexBonus`, where present, is the precise number to
   * use instead of the coarse `dexModifier` bucket above.
   */
  maxDexBonus?: number;
  armorCheckPenalty?: number;
  /** Percent, e.g. 15 for "15%". */
  arcaneSpellFailure?: number;
  /** The reduced speed (feet) for a wearer whose unencumbered speed is 30 or 20 ft -- unchanged from base for light armor/shields, lower for medium/heavy. */
  speedWith30FtBase?: number;
  speedWith20FtBase?: number;
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
  /**
   * 2024 5e ties ability-score increases to Background instead of Species
   * (see RACES_5E_2024's empty `abilityBonuses`). This app doesn't model
   * named backgrounds' specific 3-ability lists (Background is free-text,
   * a deliberate licensing choice), so this is generic: the player freely
   * distributes `totalPoints` across any abilities, capped at
   * `maxPerAbility` each -- matches the two legal splits (+2/+1 or
   * +1/+1/+1) without needing named-background data.
   */
  backgroundAbilityBonus?: { totalPoints: number; maxPerAbility: number };
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
