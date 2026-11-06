import type { ClassDefinition, EquipmentLine } from "../types";
import { armor, goldRoll, item, itemChoice, weapon, weaponChoice } from "../equipmentHelpers";

// Core classes from the 5e SRD: hit die, saving throw proficiencies,
// spellcasting ability (where applicable), skill choices, armor/weapon
// proficiencies, and starting equipment.
//
// `startingEquipment` models the SRD's real "choose (a) or (b)" starting
// packages -- each line is a list of alternative bundles (`EquipmentOption`s)
// the player picks exactly one of, or a single bundle that's granted
// automatically. Vague SRD phrasing like "any martial weapon" is resolved to
// a `weaponChoice` grant, which onboarding expands into the full list of
// matching weapons (with real stats) for the player to pick from.
//
// Each class's first line also offers `goldRoll("4d4")` -- 2014 5e's "take
// gold instead of your whole kit" alternative. The PHB's real per-class gold
// tables (e.g. Barbarian: 2d4x10gp) aren't in the SRD, so rather than add a
// non-SRD source, every class gets the same generic roll instead -- see
// TODO.md and `EquipmentGrant`'s `goldRoll` case.
export const CLASSES_5E: ClassDefinition[] = [
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
      [[weapon("greataxe")], [weaponChoice("Martial Melee")], [goldRoll("4d4")]],
      [[weapon("handaxe", 2)], [weaponChoice("Simple")]],
      [[item("Explorer's Pack"), weapon("javelin", 4)]],
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
    weaponProficiencies: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    startingEquipment: [
      [[weapon("rapier")], [weapon("longsword")], [weaponChoice("Simple")], [goldRoll("4d4")]],
      [[item("Diplomat's Pack")], [item("Entertainer's Pack")]],
      [[itemChoice("instrument")]],
      [[armor("leather"), weapon("dagger")]],
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
      [[weapon("mace")], [weapon("warhammer")], [goldRoll("4d4")]],
      [[armor("scale-mail")], [armor("leather")], [armor("chain-mail")]],
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weaponChoice("Simple")]],
      [[item("Priest's Pack")], [item("Explorer's Pack")]],
      [[armor("shield"), item("Holy Symbol")]],
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
      options: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"],
    },
    armorProficiencies: ["Light armor", "Medium armor (nonmetal)", "Shields (nonmetal)"],
    weaponProficiencies: ["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
    startingEquipment: [
      [[armor("shield")], [weaponChoice("Simple")], [goldRoll("4d4")]],
      [[weapon("scimitar")], [weaponChoice("Simple Melee")]],
      [[armor("leather"), item("Explorer's Pack"), item("Druidic Focus")]],
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
      options: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "perception", "survival"],
    },
    armorProficiencies: ["All armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [[armor("chain-mail")], [armor("leather"), weapon("longbow"), item("Arrows", 20)], [goldRoll("4d4")]],
      [[weaponChoice("Martial"), armor("shield")], [weaponChoice("Martial", 2)]],
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weapon("handaxe", 2)]],
      [[item("Dungeoneer's Pack")], [item("Explorer's Pack")]],
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
    weaponProficiencies: ["Simple weapons", "Shortswords"],
    startingEquipment: [
      [[weapon("shortsword")], [weaponChoice("Simple")], [goldRoll("4d4")]],
      [[weapon("dart", 10)]],
      [[item("Dungeoneer's Pack")], [item("Explorer's Pack")]],
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
    armorProficiencies: ["All armor", "Shields"],
    weaponProficiencies: ["Simple weapons", "Martial weapons"],
    startingEquipment: [
      [[weaponChoice("Martial"), armor("shield")], [weaponChoice("Martial", 2)], [goldRoll("4d4")]],
      [[weapon("javelin", 5)], [weaponChoice("Simple Melee")]],
      [[item("Priest's Pack")], [item("Explorer's Pack")]],
      [[armor("chain-mail"), item("Holy Symbol")]],
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
      [[armor("scale-mail")], [armor("leather")], [goldRoll("4d4")]],
      [[weapon("shortsword", 2)], [weaponChoice("Simple Melee", 2)]],
      [[item("Dungeoneer's Pack")], [item("Explorer's Pack")]],
      [[weapon("longbow"), item("Arrows", 20)]],
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
        "perception", "performance", "persuasion", "sleight-of-hand", "stealth",
      ],
    },
    armorProficiencies: ["Light armor"],
    weaponProficiencies: ["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    startingEquipment: [
      [[weapon("rapier")], [weapon("shortsword")], [goldRoll("4d4")]],
      [[weapon("shortbow"), item("Arrows", 20)], [weapon("shortsword")]],
      [[item("Burglar's Pack")], [item("Dungeoneer's Pack")], [item("Explorer's Pack")]],
      [[armor("leather"), item("Thieves' Tools"), weapon("dagger", 2)]],
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
    weaponProficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    startingEquipment: [
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weaponChoice("Simple")], [goldRoll("4d4")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
      [[item("Dungeoneer's Pack")], [item("Explorer's Pack")]],
      [[weapon("dagger", 2)]],
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
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weaponChoice("Simple")], [goldRoll("4d4")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
      [[item("Scholar's Pack")], [item("Dungeoneer's Pack")]],
      [[armor("leather"), weaponChoice("Simple"), weapon("dagger", 2)]],
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
    skillChoices: { count: 2, options: ["arcana", "history", "insight", "investigation", "medicine", "religion"] },
    armorProficiencies: [],
    weaponProficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    startingEquipment: [
      [[weapon("quarterstaff")], [weapon("dagger")], [goldRoll("4d4")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
      [[item("Scholar's Pack")], [item("Explorer's Pack")]],
      [[item("Spellbook")]],
    ] as EquipmentLine[],
    summary: "A scholarly magic-user capable of manipulating reality through study.",
  },
];
