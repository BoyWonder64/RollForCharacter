import type { ClassDefinition, EquipmentGrant, EquipmentLine, WeaponProficiencyCategory } from "../types";

// Common pack/item descriptions reused across multiple classes' starting
// gear, keyed by the item's display name -- see `item()` below.
const ITEM_DESCRIPTIONS: Record<string, string> = {
  "Explorer's Pack": "A backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, a waterskin, and 50 feet of hempen rope strapped to the outside.",
  "Dungeoneer's Pack": "A backpack, crowbar, hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, a waterskin, and 50 feet of hempen rope strapped to the outside.",
  "Diplomat's Pack": "A chest, two cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 10 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.",
  "Entertainer's Pack": "A backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.",
  "Scholar's Pack": "A backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.",
  "Priest's Pack": "A backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.",
  "Burglar's Pack": "A backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days of rations, a tinderbox, and a waterskin, with 50 feet of hempen rope strapped to the outside.",
  "Holy Symbol": "A sacred emblem of your deity, used as a spellcasting focus for divine magic.",
  "Druidic Focus": "A sprig of mistletoe, a wooden staff, or a similar natural object used to channel druidic magic.",
  "Component Pouch": "A small watertight pouch holding the material components used to cast spells.",
  "Arcane Focus": "An orb, crystal, rod, wand, or similar object used to channel arcane magic.",
  "Musical Instrument": "Your choice of instrument, such as a lute, flute, or drum.",
  "Thieves' Tools": "A set of lockpicks and small tools used to pick locks and disarm traps.",
  "Spellbook": "A book of the spells you know, used to prepare your spells each day.",
  "Crossbow Bolts": "Ammunition for a crossbow.",
  "Arrows": "Ammunition for a bow.",
};

function weapon(weaponId: string, quantity?: number): EquipmentGrant {
  return { kind: "weapon", weaponId, quantity };
}
function weaponChoice(category: WeaponProficiencyCategory, quantity?: number): EquipmentGrant {
  return { kind: "weaponChoice", category, quantity };
}
function armor(armorId: string): EquipmentGrant {
  return { kind: "armor", armorId };
}
function item(name: string, quantity?: number, description?: string): EquipmentGrant {
  return { kind: "item", name, quantity, description: description ?? ITEM_DESCRIPTIONS[name] };
}

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
      [[weapon("greataxe")], [weaponChoice("Martial Melee")]],
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
      [[weapon("rapier")], [weapon("longsword")], [weaponChoice("Simple")]],
      [[item("Diplomat's Pack")], [item("Entertainer's Pack")]],
      [[item("Musical Instrument")]],
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
      [[weapon("mace")], [weapon("warhammer")]],
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
      [[armor("shield")], [weaponChoice("Simple")]],
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
      [[armor("chain-mail")], [armor("leather"), weapon("longbow"), item("Arrows", 20)]],
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
      [[weapon("shortsword")], [weaponChoice("Simple")]],
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
      [[weaponChoice("Martial"), armor("shield")], [weaponChoice("Martial", 2)]],
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
      [[armor("scale-mail")], [armor("leather")]],
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
      [[weapon("rapier")], [weapon("shortsword")]],
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
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weaponChoice("Simple")]],
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
      [[weapon("light-crossbow"), item("Crossbow Bolts", 20)], [weaponChoice("Simple")]],
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
      [[weapon("quarterstaff")], [weapon("dagger")]],
      [[item("Component Pouch")], [item("Arcane Focus")]],
      [[item("Scholar's Pack")], [item("Explorer's Pack")]],
      [[item("Spellbook")]],
    ] as EquipmentLine[],
    summary: "A scholarly magic-user capable of manipulating reality through study.",
  },
];
