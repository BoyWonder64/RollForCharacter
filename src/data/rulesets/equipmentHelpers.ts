import type { EquipmentGrant, WeaponProficiencyCategory } from "./types";
import type { ToolOrInstrumentCategory } from "./toolsAndInstruments";

// Builders for a class's `startingEquipment`, shared by every ruleset that
// models real weapon/armor grants (5e and 5e-2024).

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
  "Quiver": "Holds up to 20 arrows.",
  "Herbalism Kit": "Pouches, clippers, and a mortar and pestle for identifying plants and brewing remedies.",
  "Robe": "Simple, loose-fitting spellcaster's robes.",
};

export function weapon(weaponId: string, quantity?: number): EquipmentGrant {
  return { kind: "weapon", weaponId, quantity };
}
export function weaponChoice(category: WeaponProficiencyCategory, quantity?: number): EquipmentGrant {
  return { kind: "weaponChoice", category, quantity };
}
export function armor(armorId: string): EquipmentGrant {
  return { kind: "armor", armorId };
}
export function item(name: string, quantity?: number, description?: string): EquipmentGrant {
  return { kind: "item", name, quantity, description: description ?? ITEM_DESCRIPTIONS[name] };
}
export function gold(amount: number): EquipmentGrant {
  return { kind: "gold", amount };
}
/** See `EquipmentGrant`'s `goldRoll` case -- a generic, non-PHB "take gold instead" option. */
export function goldRoll(formula: string): EquipmentGrant {
  return { kind: "goldRoll", formula };
}
export function itemChoice(
  category: ToolOrInstrumentCategory | ToolOrInstrumentCategory[],
  quantity?: number
): EquipmentGrant {
  return { kind: "itemChoice", category, quantity };
}
