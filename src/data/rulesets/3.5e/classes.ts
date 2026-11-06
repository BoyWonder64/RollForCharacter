import type { ClassDefinition } from "../types";
import { armor, item, itemChoice, weapon, weaponChoice } from "../equipmentHelpers";

// Core classes from the 3.5e SRD (d20srd.org, "The Hypertext d20 SRD", the
// v3.5 d20 System Reference Document -- Open Game Content under the OGL
// v1.0a). See the LEGAL.md note in this directory for full sourcing detail.
//
// 3.5e's resolution mechanics differ structurally from 5e's, which is why
// several fields below are left unset rather than forced into the wrong
// shape:
//
// - `savingThrows` (5e's flat-proficiency-on-one-of-six-abilities model) is
//   left unset for every 3.5e class. 3.5e instead uses Fortitude/Reflex/Will
//   saves with a per-class "good" (starts at +2, scales ~2/3 of level) or
//   "poor" (scales ~1/3 of level) progression -- see `baseSaveProgression`,
//   which IS populated below from the real SRD save tables.
// - `skillChoices` (5e's "pick N skills from this list") is left unset.
//   3.5e instead gives every class a fixed list of class skills plus a
//   number of skill POINTS per level to spend on ranks (1 pt/rank in a class
//   skill, 2 pts/rank cross-class) -- a point-buy system this app doesn't
//   model numerically yet. `classSkills` below is the real SRD class-skill
//   list (skill ids) for reference/filtering only.
// - Base Attack Bonus (full/3-4/half progression per class, confirmed from
//   each class's SRD level table) isn't in `ClassDefinition` at all -- there
//   is no field for it. It's noted in `summary` as flavor text only.
// - `startingEquipment` below resolves to real weapon/armor stats (see
//   weapons.ts/armor.ts) the same way 2014/2024 5e's does, but the SRD
//   class pages don't publish the PHB's own "starting package" table (not
//   open content) -- so the specific *combinations* below are this app's
//   own representative picks inferred from each class's proficiencies, not
//   a transcription of the real PHB table. Every weapon/armor grant is
//   still swappable for anything else the class is proficient with, same
//   as every other ruleset.
// - Hit die: `ClassDefinition.hitDie` only allows 6 | 8 | 10 | 12, but the
//   3.5e SRD Sorcerer and Wizard both have a d4 hit die. Rather than edit
//   the shared type, they're set to 6 here (the closest allowed value,
//   rounded up) -- a known inaccuracy to revisit if `hitDie`'s type is ever
//   widened.
export const CLASSES_35E: ClassDefinition[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    hitDie: 12,
    baseSaveProgression: { fortitude: "good", reflex: "poor", will: "poor" },
    classSkills: ["climb", "craft", "handle-animal", "intimidate", "jump", "listen", "ride", "survival", "swim"],
    armorProficiencies: ["Light armor", "Medium armor", "Shields (except tower shields)"],
    weaponProficiencies: ["All simple weapons", "All martial weapons"],
    startingEquipment: [
      [[weapon("greataxe")], [weaponChoice("Martial")]],
      [[armor("hide")]],
      [[weapon("javelin", 4)]],
    ],
    summary: "A ferocious warrior fueled by rage, with full base attack bonus progression and the fastest land speed of any class.",
  },
  {
    id: "bard",
    name: "Bard",
    hitDie: 6,
    spellcastingAbility: "charisma",
    classSkills: [
      "appraise", "balance", "bluff", "climb", "concentration", "craft", "decipher-script", "diplomacy",
      "disguise", "escape-artist", "gather-information", "hide", "jump",
      "knowledge-arcana", "knowledge-architecture-engineering", "knowledge-dungeoneering", "knowledge-geography",
      "knowledge-history", "knowledge-local", "knowledge-nature", "knowledge-nobility-royalty", "knowledge-religion", "knowledge-the-planes",
      "listen", "move-silently", "perform", "profession", "sense-motive", "sleight-of-hand", "speak-language",
      "spellcraft", "swim", "tumble", "use-magic-device",
    ],
    armorProficiencies: ["Light armor", "Shields (except tower shields)"],
    weaponProficiencies: ["All simple weapons", "Longsword", "Rapier", "Sap", "Short sword", "Shortbow", "Whip"],
    startingEquipment: [
      [[weapon("rapier")]],
      [[armor("leather")]],
      [[itemChoice("instrument")]],
    ],
    summary: "An arcane spellcaster and jack-of-all-skills whose bardic music inspires allies; 3/4 base attack bonus progression.",
  },
  {
    id: "cleric",
    name: "Cleric",
    hitDie: 8,
    spellcastingAbility: "wisdom",
    classSkills: ["concentration", "craft", "diplomacy", "heal", "knowledge-arcana", "knowledge-history", "knowledge-religion", "knowledge-the-planes", "profession", "spellcraft"],
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields (except tower shields)"],
    weaponProficiencies: ["All simple weapons"],
    startingEquipment: [
      [[weapon("mace-heavy")], [weaponChoice("Simple")]],
      [[armor("scale-mail")]],
      [[armor("shield-light-wooden"), item("Holy Symbol")]],
    ],
    summary: "A divine spellcaster who chooses two domains from their deity, with 3/4 base attack bonus progression and the ability to turn or rebuke undead.",
  },
  {
    id: "druid",
    name: "Druid",
    hitDie: 8,
    spellcastingAbility: "wisdom",
    classSkills: ["concentration", "craft", "diplomacy", "handle-animal", "heal", "knowledge-nature", "listen", "profession", "ride", "spellcraft", "spot", "survival", "swim"],
    armorProficiencies: ["Light armor (nonmetal)", "Medium armor (nonmetal)", "Shields (nonmetal, except tower shields)"],
    weaponProficiencies: ["Club", "Dagger", "Dart", "Quarterstaff", "Scimitar", "Sickle", "Shortspear", "Sling", "Spear"],
    startingEquipment: [
      [[weapon("scimitar")], [weapon("sickle")]],
      [[armor("leather")], [armor("hide")]],
      [[armor("shield-light-wooden"), item("Druidic Focus")]],
    ],
    summary: "A divine spellcaster devoted to nature, able to wild shape into animals and summon nature's allies; 3/4 base attack bonus progression.",
  },
  {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    classSkills: ["climb", "craft", "handle-animal", "intimidate", "jump", "ride", "swim"],
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields (including tower shields)"],
    weaponProficiencies: ["All simple weapons", "All martial weapons"],
    startingEquipment: [
      [[weapon("longsword")], [weaponChoice("Martial")]],
      [[armor("chain-shirt")]],
      [[armor("shield-heavy-steel")]],
    ],
    summary: "A master of martial combat with the most bonus feats of any class, and full base attack bonus progression.",
  },
  {
    id: "monk",
    name: "Monk",
    hitDie: 8,
    baseSaveProgression: { fortitude: "good", reflex: "good", will: "good" },
    classSkills: ["balance", "climb", "concentration", "craft", "diplomacy", "escape-artist", "hide", "jump", "knowledge-arcana", "knowledge-religion", "listen", "move-silently", "perform", "profession", "sense-motive", "spot", "swim", "tumble"],
    armorProficiencies: [],
    weaponProficiencies: ["Club", "Crossbow (light or heavy)", "Dagger", "Handaxe", "Javelin", "Kama", "Nunchaku", "Quarterstaff", "Sai", "Shuriken", "Siangham", "Sling"],
    startingEquipment: [
      [[weapon("shuriken", 5)], [weapon("quarterstaff")]],
    ],
    summary: "A martial artist who fights unarmed and unarmored, with all three saves good and 3/4 base attack bonus progression -- unique among core classes.",
  },
  {
    id: "paladin",
    name: "Paladin",
    hitDie: 10,
    spellcastingAbility: "wisdom",
    classSkills: ["concentration", "craft", "diplomacy", "handle-animal", "heal", "knowledge-nobility-royalty", "knowledge-religion", "profession", "ride", "sense-motive"],
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields (except tower shields)"],
    weaponProficiencies: ["All simple weapons", "All martial weapons"],
    startingEquipment: [
      [[weapon("longsword")], [weaponChoice("Martial")]],
      [[armor("banded-mail")]],
      [[armor("shield-heavy-steel"), item("Holy Symbol")]],
    ],
    summary: "A holy warrior with smite evil, divine grace, and (from 4th level) a small number of divine spells; full base attack bonus progression.",
  },
  {
    id: "ranger",
    name: "Ranger",
    hitDie: 8,
    spellcastingAbility: "wisdom",
    classSkills: ["climb", "concentration", "craft", "handle-animal", "heal", "hide", "jump", "knowledge-dungeoneering", "knowledge-geography", "knowledge-nature", "listen", "move-silently", "profession", "ride", "search", "spot", "survival", "swim", "use-rope"],
    armorProficiencies: ["Light armor", "Shields (except tower shields)"],
    weaponProficiencies: ["All simple weapons", "All martial weapons"],
    startingEquipment: [
      [[weapon("longbow")], [weaponChoice("Martial")]],
      [[weapon("sword-short", 2)], [weaponChoice("Martial Melee")]],
      [[armor("leather")]],
    ],
    summary: "A warrior of the wilds with a favored enemy and (from 4th level) a small number of divine spells; full base attack bonus progression.",
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: 6,
    classSkills: [
      "appraise", "balance", "bluff", "climb", "craft", "decipher-script", "diplomacy", "disable-device",
      "disguise", "escape-artist", "forgery", "gather-information", "hide", "intimidate", "jump",
      "knowledge-local", "listen", "move-silently", "open-lock", "perform", "profession", "search",
      "sense-motive", "sleight-of-hand", "spot", "swim", "tumble", "use-magic-device", "use-rope",
    ],
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["All simple weapons", "Hand crossbow", "Rapier", "Sap", "Shortbow", "Short sword"],
    startingEquipment: [
      [[weapon("sword-short")], [weapon("rapier")]],
      [[weapon("shortbow"), item("Arrows", 20)]],
      [[armor("leather"), item("Thieves' Tools")]],
    ],
    summary: "A skillful, stealthy opportunist with sneak attack and the most class skills of any core class; 3/4 base attack bonus progression.",
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    hitDie: 6, // Real SRD value is d4 -- see file-top note; ClassDefinition.hitDie can't express it.
    spellcastingAbility: "charisma",
    classSkills: ["bluff", "concentration", "craft", "knowledge-arcana", "profession", "spellcraft"],
    armorProficiencies: [],
    weaponProficiencies: ["All simple weapons"],
    startingEquipment: [
      [[weapon("dagger")], [weapon("crossbow-light")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
    ],
    summary: "An innate arcane spellcaster who casts spells known without preparation, from a magical bloodline; half base attack bonus progression.",
  },
  {
    id: "wizard",
    name: "Wizard",
    hitDie: 6, // Real SRD value is d4 -- see file-top note; ClassDefinition.hitDie can't express it.
    spellcastingAbility: "intelligence",
    classSkills: [
      "concentration", "craft", "decipher-script",
      "knowledge-arcana", "knowledge-architecture-engineering", "knowledge-dungeoneering", "knowledge-geography",
      "knowledge-history", "knowledge-local", "knowledge-nature", "knowledge-nobility-royalty", "knowledge-religion", "knowledge-the-planes",
      "profession", "spellcraft",
    ],
    armorProficiencies: [],
    weaponProficiencies: ["Club", "Dagger", "Heavy crossbow", "Light crossbow", "Quarterstaff"],
    startingEquipment: [
      [[weapon("quarterstaff")], [weapon("dagger")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
      [[item("Spellbook")]],
    ],
    summary: "A scholarly arcane spellcaster who prepares spells from a spellbook; half base attack bonus progression.",
  },
];
