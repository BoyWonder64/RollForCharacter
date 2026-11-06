import type { ClassDefinition, EquipmentLine } from "../types";
import { armor, gold, item, itemChoice, weapon } from "../equipmentHelpers";

// ---------------------------------------------------------------------------
// Legal note (2024 D&D 5th Edition ruleset -- "SRD 5.2")
// ---------------------------------------------------------------------------
// Source: the official System Reference Document 5.2 ("SRD 5.2"), Wizards
// of the Coast's free rules reference for the 2024 revision of D&D 5th
// Edition (the printing informally nicknamed "5.5e" -- WotC's own name for
// it is simply "the 2024 rules"/"D&D 5e (2024)"). Released April 2025.
// Official SRD 5.2 permalink: https://dnd.wizards.com/resources/systems-reference-document
// Current SRD 5.2 PDF (as verified at the time of writing):
//   https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf
//
// License (verified, not assumed): SRD 5.2 is released under the
// Creative Commons Attribution 4.0 International license (CC BY 4.0) --
// NOT the Open Game License (OGL 1.0a) that covered the 2014 SRD 5.1.
// WotC's own SRD page (dndbeyond.com/srd) states SRD 5.2 content is
// "published under the Creative Commons Attribution 4.0 International
// License (CC-BY-4.0)" and is "permanently available under those terms."
// This is a materially different license from the 2014 ruleset in this
// same app (`src/data/rulesets/5e/`), which is OGL 1.0a-licensed -- do
// not assume the two rulesets share one license file/attribution; CC BY
// 4.0 requires attribution to Wizards of the Coast (and, per WotC's SRD
// page, a link to the license) wherever this content/derived content
// ships, which the 2014 OGL text does not require in the same way.
//
// Sourcing method (same discipline as `src/data/rulesets/5e/`, carried
// over deliberately): this data was NOT written from memory or guessed.
// It was fetched live from the open5e API v2 (https://api.open5e.com/v2/),
// which already hosts SRD 5.2 as its own first-class document
// (`document__key=srd-2024`, gamesystem "5th Edition 2024", license
// "Creative Commons Attribution 4.0" / key `cc-by-40` -- independently
// confirming the license finding above from a second source), then
// transformed by small Python scripts into these TypeScript modules.
// Spot-checked against the official SRD text/WotC's own posts for the
// specific 2024 mechanical changes called out in the comments below
// (species ability-bonus removal, Dwarf/Gnome speed, Druid/Bard/Wizard
// weapon-proficiency simplification, Fighter/Wizard skill-list changes).
//
// `startingEquipment` is the SRD 5.2 "Starting Equipment" row for each
// class, checked against the open5e v2 text (`document__key=srd-2024`): one
// line whose options are the SRD's A / B (/ C) packages, including the
// "gold instead" alternatives. Weapon and armor grants resolve against the
// shared 2014 weapon/armor catalogs (same stats; 2024 weapon Mastery isn't
// modeled), and onboarding lets the player swap any of them for another
// weapon or armor their class is proficient with.
// ---------------------------------------------------------------------------

// Core classes from the 2024 SRD 5.2: hit die, saving throw proficiencies,
// spellcasting ability (where applicable), skill choices, armor/weapon
// proficiencies, and a representative starting-equipment summary.
//
// Mechanically this is a direct parallel to `5e/classes.ts` -- same six
// ability scores, same flat proficiency-bonus/ability-save model -- but
// every field below was re-verified against the real 2024 text rather
// than copied from the 2014 file. Real, verified changes worth flagging:
//  - Fighter's skill list gained Persuasion; Wizard's gained Nature.
//  - Druid, Bard, Sorcerer, Warlock, and Wizard weapon proficiencies were
//    simplified to just "Simple weapons" (2014 listed specific weapons
//    like hand crossbows/rapiers/scimitars/daggers per class).
//  - Druid's armor proficiency dropped the 2014 "nonmetal" restriction.
//  - Hit dice, saving-throw pairs, and spellcasting abilities are
//    unchanged from 2014 for every class.
export const CLASSES_5E_2024: ClassDefinition[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    hitDie: 12,
    savingThrows: ["strength", "constitution"],
    skillChoices: {
      count: 2,
      options: ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"],
    },
    armorProficiencies: ["Light armor", "Medium armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [[weapon("greataxe"), weapon("handaxe", 4), item("Explorer's Pack"), gold(15)], [gold(75)]],
    ] as EquipmentLine[],
    summary: "A fierce warrior who channels primal rage in battle.",
  },
  {
    id: "bard",
    name: "Bard",
    hitDie: 8,
    savingThrows: ["dexterity", "charisma"],
    spellcastingAbility: "charisma",
    casterType: "full",
    skillChoices: {
      count: 3,
      options: [
        "acrobatics", "animal-handling", "arcana", "athletics", "deception", "history",
        "insight", "intimidation", "investigation", "medicine", "nature", "perception",
        "performance", "persuasion", "religion", "sleight-of-hand", "stealth", "survival",
      ],
    },
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [armor("leather"), weapon("dagger", 2), itemChoice("instrument"), item("Entertainer's Pack"), gold(19)],
        [gold(90)],
      ],
    ] as EquipmentLine[],
    summary: "An inspiring magician whose power echoes through music.",
  },
  {
    id: "cleric",
    name: "Cleric",
    hitDie: 8,
    savingThrows: ["wisdom", "charisma"],
    spellcastingAbility: "wisdom",
    casterType: "full",
    skillChoices: { count: 2, options: ["history", "insight", "medicine", "persuasion", "religion"] },
    armorProficiencies: ["Light armor", "Medium armor", "Shields"],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [armor("chain-shirt"), armor("shield"), weapon("mace"), item("Holy Symbol"), item("Priest's Pack"), gold(7)],
        [gold(110)],
      ],
    ] as EquipmentLine[],
    summary: "A priestly champion who wields divine magic in service of a deity.",
  },
  {
    id: "druid",
    name: "Druid",
    hitDie: 8,
    savingThrows: ["intelligence", "wisdom"],
    spellcastingAbility: "wisdom",
    casterType: "full",
    skillChoices: {
      count: 2,
      options: ["animal-handling", "arcana", "insight", "medicine", "nature", "perception", "religion", "survival"],
    },
    armorProficiencies: ["Light armor", "Shields"],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [
          armor("leather"),
          armor("shield"),
          weapon("sickle"),
          weapon("quarterstaff"),
          item("Druidic Focus (Quarterstaff)", 1, "Your Quarterstaff doubles as your Druidic Focus for casting druid spells."),
          item("Explorer's Pack"),
          item("Herbalism Kit"),
          gold(9),
        ],
        [gold(50)],
      ],
    ] as EquipmentLine[],
    summary: "A priest of nature, wielding elemental forces and shifting shape.",
  },
  {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    savingThrows: ["strength", "constitution"],
    skillChoices: {
      count: 2,
      options: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"],
    },
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [
        [armor("chain-mail"), weapon("greatsword"), weapon("flail"), weapon("javelin", 8), item("Dungeoneer's Pack"), gold(4)],
        [
          armor("studded-leather"),
          weapon("scimitar"),
          weapon("shortsword"),
          weapon("longbow"),
          item("Arrows", 20),
          item("Quiver"),
          item("Dungeoneer's Pack"),
          gold(11),
        ],
        [gold(155)],
      ],
    ] as EquipmentLine[],
    summary: "A master of martial combat, skilled with a variety of weapons and armor.",
  },
  {
    id: "monk",
    name: "Monk",
    hitDie: 8,
    savingThrows: ["strength", "dexterity"],
    skillChoices: { count: 2, options: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] },
    armorProficiencies: [],
    weaponProficiencies: ["Simple weapons", "Martial weapons with the Light property"],
    startingEquipment: [
      [
        [
          weapon("spear"),
          weapon("dagger", 5),
          itemChoice(["artisanTools", "instrument"]),
          item("Explorer's Pack"),
          gold(11),
        ],
        [gold(50)],
      ],
    ] as EquipmentLine[],
    summary: "A master of martial arts who channels inner energy.",
  },
  {
    id: "paladin",
    name: "Paladin",
    hitDie: 10,
    savingThrows: ["wisdom", "charisma"],
    spellcastingAbility: "charisma",
    casterType: "half",
    skillChoices: { count: 2, options: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"] },
    armorProficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [
        [
          armor("chain-mail"),
          armor("shield"),
          weapon("longsword"),
          weapon("javelin", 6),
          item("Holy Symbol"),
          item("Priest's Pack"),
          gold(9),
        ],
        [gold(150)],
      ],
    ] as EquipmentLine[],
    summary: "A holy warrior bound by an oath to a higher cause.",
  },
  {
    id: "ranger",
    name: "Ranger",
    hitDie: 10,
    savingThrows: ["strength", "dexterity"],
    spellcastingAbility: "wisdom",
    casterType: "half",
    skillChoices: {
      count: 3,
      options: ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"],
    },
    armorProficiencies: ["Light armor", "Medium armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [
        [
          armor("studded-leather"),
          weapon("scimitar"),
          weapon("shortsword"),
          weapon("longbow"),
          item("Arrows", 20),
          item("Quiver"),
          item("Druidic Focus (sprig of mistletoe)", 1, "A sprig of mistletoe used to channel druidic magic."),
          item("Explorer's Pack"),
          gold(7),
        ],
        [gold(150)],
      ],
    ] as EquipmentLine[],
    summary: "A warrior of the wilds, skilled in tracking and survival.",
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: 8,
    savingThrows: ["dexterity", "intelligence"],
    skillChoices: {
      count: 4,
      options: [
        "acrobatics", "athletics", "deception", "insight", "intimidation", "investigation",
        "perception", "persuasion", "sleight-of-hand", "stealth",
      ],
    },
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons", "Martial weapons with the Finesse or Light property"],
    startingEquipment: [
      [
        [
          armor("leather"),
          weapon("dagger", 2),
          weapon("shortsword"),
          weapon("shortbow"),
          item("Arrows", 20),
          item("Quiver"),
          item("Thieves' Tools"),
          item("Burglar's Pack"),
          gold(8),
        ],
        [gold(100)],
      ],
    ] as EquipmentLine[],
    summary: "A stealthy and cunning adventurer who relies on skill and precision.",
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    hitDie: 6,
    savingThrows: ["constitution", "charisma"],
    spellcastingAbility: "charisma",
    casterType: "full",
    skillChoices: { count: 2, options: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"] },
    armorProficiencies: [],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [
          weapon("spear"),
          weapon("dagger", 2),
          item("Arcane Focus (crystal)", 1, "A crystal used to channel arcane magic."),
          item("Dungeoneer's Pack"),
          gold(28),
        ],
        [gold(50)],
      ],
    ] as EquipmentLine[],
    summary: "A spellcaster who draws on an innate magical bloodline.",
  },
  {
    id: "warlock",
    name: "Warlock",
    hitDie: 8,
    savingThrows: ["wisdom", "charisma"],
    spellcastingAbility: "charisma",
    casterType: "pact",
    skillChoices: { count: 2, options: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"] },
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [
          armor("leather"),
          weapon("sickle"),
          weapon("dagger", 2),
          item("Arcane Focus (orb)", 1, "An orb used to channel arcane magic."),
          item("Book (occult lore)", 1, "A book of occult lore."),
          item("Scholar's Pack"),
          gold(15),
        ],
        [gold(100)],
      ],
    ] as EquipmentLine[],
    summary: "A wielder of magic granted through a pact with an otherworldly patron.",
  },
  {
    id: "wizard",
    name: "Wizard",
    hitDie: 6,
    savingThrows: ["intelligence", "wisdom"],
    spellcastingAbility: "intelligence",
    casterType: "full",
    skillChoices: { count: 2, options: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"] },
    armorProficiencies: [],
    weaponProficiencies: ["Simple weapons"],
    startingEquipment: [
      [
        [
          weapon("dagger", 2),
          weapon("quarterstaff"),
          item("Arcane Focus (Quarterstaff)", 1, "Your Quarterstaff doubles as your Arcane Focus for casting wizard spells."),
          item("Robe"),
          item("Spellbook"),
          item("Scholar's Pack"),
          gold(5),
        ],
        [gold(55)],
      ],
    ] as EquipmentLine[],
    summary: "A scholarly magic-user capable of manipulating reality through study.",
  },
];
