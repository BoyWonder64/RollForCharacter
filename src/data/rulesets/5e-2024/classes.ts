import type { ClassDefinition, EquipmentLine } from "../types";

// 5e-2024 has no weapon/armor stat catalog in this app (see the
// `startingEquipment` note below), so each gear line becomes a plain `item`
// grant with no resolvable stats -- just the SRD text, split on "or" into
// pickable alternatives wherever the SRD offers a choice (same helper as
// `3.5e/classes.ts`).
function flavorLines(lines: string[]): EquipmentLine[] {
  return lines.map((line) =>
    line.split(/\s*,?\s+or\s+/i).map((part) => [{ kind: "item" as const, name: part.trim() }])
  );
}

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
// `startingEquipment` is a short representative list (the SRD's "Option
// A" gear choice for each class), not the full branching "choose A, B,
// (or C)" equipment packages or the gold-piece alternative -- same
// simplification the 2014 ruleset file uses, for the same reason (no
// enforced inventory/currency system yet).
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
    startingEquipment: flavorLines(["A greataxe", "Four handaxes", "An explorer's pack"]),
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
    startingEquipment: flavorLines(["Leather armor", "Two daggers", "A musical instrument", "An entertainer's pack"]),
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
    startingEquipment: flavorLines(["A chain shirt", "A shield", "A mace", "A holy symbol"]),
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
    startingEquipment: flavorLines(["Leather armor", "A shield", "A sickle", "A druidic focus", "An explorer's pack"]),
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
    startingEquipment: flavorLines(["Chain mail", "A greatsword", "A flail", "Eight javelins", "A dungeoneer's pack"]),
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
    startingEquipment: flavorLines(["A spear", "Five daggers", "An artisan's tools or musical instrument", "An explorer's pack"]),
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
    startingEquipment: flavorLines(["Chain mail", "A shield", "A longsword", "Six javelins", "A holy symbol"]),
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
    startingEquipment: flavorLines(["Studded leather armor", "A scimitar and a shortsword", "A longbow and a quiver of 20 arrows", "A druidic focus"]),
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
    startingEquipment: flavorLines(["Leather armor", "Two daggers", "A shortsword", "A shortbow and a quiver of arrows", "Thieves' tools", "A burglar's pack"]),
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
    startingEquipment: flavorLines(["A spear", "Two daggers", "An arcane focus", "A dungeoneer's pack"]),
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
    startingEquipment: flavorLines(["Leather armor", "A sickle", "Two daggers", "An arcane focus", "A book of occult lore", "A scholar's pack"]),
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
    startingEquipment: flavorLines(["Two daggers", "An arcane focus", "A robe", "A spellbook", "A scholar's pack"]),
    summary: "A scholarly magic-user capable of manipulating reality through study.",
  },
];
