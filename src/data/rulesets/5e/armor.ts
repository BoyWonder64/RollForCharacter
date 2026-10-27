import type { ArmorDefinition } from "../types";

// Full armor table from the 5e SRD (CC-BY licensed).
export const ARMOR_5E: ArmorDefinition[] = [
  // Light Armor
  { id: "padded", name: "Padded", category: "Light", cost: "5 gp", baseArmorClass: 11, dexModifier: "full", stealthDisadvantage: true, weight: 8, description: "Layers of quilted cloth stuffed with fiber. Cheap and quiet to move in, but it muffles stealth rather than enabling it." },
  { id: "leather", name: "Leather", category: "Light", cost: "10 gp", baseArmorClass: 11, dexModifier: "full", stealthDisadvantage: false, weight: 10, description: "A stiffened leather chest piece over a softer leather layer. Light enough to move freely in, offering modest protection." },
  { id: "studded-leather", name: "Studded Leather", category: "Light", cost: "45 gp", baseArmorClass: 12, dexModifier: "full", stealthDisadvantage: false, weight: 13, description: "Tough leather reinforced with rivets and metal studs, the best protection a light-armored fighter can get without sacrificing mobility." },

  // Medium Armor
  { id: "hide", name: "Hide", category: "Medium", cost: "10 gp", baseArmorClass: 12, dexModifier: "max2", stealthDisadvantage: false, weight: 12, description: "Crude armor made from thick furs and pelts, favored by those living off the land." },
  { id: "chain-shirt", name: "Chain Shirt", category: "Medium", cost: "50 gp", baseArmorClass: 13, dexModifier: "max2", stealthDisadvantage: false, weight: 20, description: "A shirt of interlocking metal rings worn over padding, balancing protection with freedom of movement." },
  { id: "scale-mail", name: "Scale Mail", category: "Medium", cost: "50 gp", baseArmorClass: 14, dexModifier: "max2", stealthDisadvantage: true, weight: 45, description: "A coat of leather covered in overlapping metal scales, sturdy but noisy." },
  { id: "breastplate", name: "Breastplate", category: "Medium", cost: "400 gp", baseArmorClass: 14, dexModifier: "max2", stealthDisadvantage: false, weight: 20, description: "A fitted metal chest plate worn with supple leather, solid protection that doesn't restrict the wearer." },
  { id: "half-plate", name: "Half Plate", category: "Medium", cost: "750 gp", baseArmorClass: 15, dexModifier: "max2", stealthDisadvantage: true, weight: 40, description: "Shaped metal plates covering most of the body over a leather base, the heaviest armor that still allows some agility." },

  // Heavy Armor
  { id: "ring-mail", name: "Ring Mail", category: "Heavy", cost: "30 gp", baseArmorClass: 14, dexModifier: "none", stealthDisadvantage: true, weight: 40, description: "Leather armor studded with metal rings, heavy and loud but cheaper than true mail." },
  { id: "chain-mail", name: "Chain Mail", category: "Heavy", cost: "75 gp", baseArmorClass: 16, dexModifier: "none", strengthRequirement: 13, stealthDisadvantage: true, weight: 55, description: "A full coat of interlocking metal rings, heavy enough to demand real strength to wear effectively." },
  { id: "splint", name: "Splint", category: "Heavy", cost: "200 gp", baseArmorClass: 17, dexModifier: "none", strengthRequirement: 15, stealthDisadvantage: true, weight: 60, description: "Narrow vertical metal strips riveted to a leather backing, strong protection at the cost of agility." },
  { id: "plate", name: "Plate", category: "Heavy", cost: "1500 gp", baseArmorClass: 18, dexModifier: "none", strengthRequirement: 15, stealthDisadvantage: true, weight: 65, description: "A full suit of shaped, fitted metal plates covering the entire body -- the pinnacle of armor, and priced like it." },

  // Shield
  { id: "shield", name: "Shield", category: "Shield", cost: "10 gp", baseArmorClass: 2, dexModifier: "none", stealthDisadvantage: false, weight: 6, description: "A broad wooden or metal shield strapped to one arm, adding extra protection on top of whatever else is worn." },
];
