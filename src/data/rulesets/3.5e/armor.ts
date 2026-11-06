import type { ArmorDefinition } from "../types";

// Full armor and shields table from the 3.5e SRD (OGL 1.0a), fetched via
// curl from https://www.d20srd.org/srd/equipment/armor.htm (archived copy
// used -- see LEGAL.md). Unlike 5e, 3.5e splits light and heavy shields
// into wooden/steel variants (identical stats, different cost/weight) --
// both are kept as separate entries, which also solves the 5e ruleset's
// "shield material" simplification (see `NONMETAL_ARMOR_IDS` in
// startingEquipment.ts) naturally for 3.5e: a nonmetal-restricted class
// picks the wooden variant for real, rather than relying on a single
// generic Shield entry standing in for either material.
//
// Not catalogued here (not standalone wearable armor, despite being listed
// on this page): armor spikes, a locked gauntlet, and shield spikes --
// these are upgrades bolted onto a piece of armor/shield already in this
// catalog, not their own item.
export const ARMOR_35E: ArmorDefinition[] = [
  { id: "padded", name: "Padded", category: "Light", cost: "5 gp", baseArmorClass: 1, dexModifier: "full", stealthDisadvantage: false, weight: 10, description: "A light armor, granting a +1 armor bonus to AC.", armorCheckPenalty: 0, maxDexBonus: 8, arcaneSpellFailure: 5, speedWith30FtBase: 30, speedWith20FtBase: 20 },
  { id: "leather", name: "Leather", category: "Light", cost: "10 gp", baseArmorClass: 2, dexModifier: "max2", stealthDisadvantage: false, weight: 15, description: "A light armor, granting a +2 armor bonus to AC.", armorCheckPenalty: 0, maxDexBonus: 6, arcaneSpellFailure: 10, speedWith30FtBase: 30, speedWith20FtBase: 20 },
  { id: "studded-leather", name: "Studded leather", category: "Light", cost: "25 gp", baseArmorClass: 3, dexModifier: "max2", stealthDisadvantage: true, weight: 20, description: "A light armor, granting a +3 armor bonus to AC.", armorCheckPenalty: -1, maxDexBonus: 5, arcaneSpellFailure: 15, speedWith30FtBase: 30, speedWith20FtBase: 20 },
  { id: "chain-shirt", name: "Chain shirt", category: "Light", cost: "100 gp", baseArmorClass: 4, dexModifier: "max2", stealthDisadvantage: true, weight: 25, description: "A light armor, granting a +4 armor bonus to AC.", armorCheckPenalty: -2, maxDexBonus: 4, arcaneSpellFailure: 20, speedWith30FtBase: 30, speedWith20FtBase: 20 },
  { id: "hide", name: "Hide", category: "Medium", cost: "15 gp", baseArmorClass: 3, dexModifier: "max2", stealthDisadvantage: true, weight: 25, description: "A medium armor, granting a +3 armor bonus to AC.", armorCheckPenalty: -3, maxDexBonus: 4, arcaneSpellFailure: 20, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "scale-mail", name: "Scale mail", category: "Medium", cost: "50 gp", baseArmorClass: 4, dexModifier: "max2", stealthDisadvantage: true, weight: 30, description: "A medium armor, granting a +4 armor bonus to AC.", armorCheckPenalty: -4, maxDexBonus: 3, arcaneSpellFailure: 25, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "chainmail", name: "Chainmail", category: "Medium", cost: "150 gp", baseArmorClass: 5, dexModifier: "max2", stealthDisadvantage: true, weight: 40, description: "A medium armor, granting a +5 armor bonus to AC.", armorCheckPenalty: -5, maxDexBonus: 2, arcaneSpellFailure: 30, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "breastplate", name: "Breastplate", category: "Medium", cost: "200 gp", baseArmorClass: 5, dexModifier: "max2", stealthDisadvantage: true, weight: 30, description: "A medium armor, granting a +5 armor bonus to AC.", armorCheckPenalty: -4, maxDexBonus: 3, arcaneSpellFailure: 25, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "splint-mail", name: "Splint mail", category: "Heavy", cost: "200 gp", baseArmorClass: 6, dexModifier: "none", stealthDisadvantage: true, weight: 45, description: "A heavy armor, granting a +6 armor bonus to AC.", armorCheckPenalty: -7, maxDexBonus: 0, arcaneSpellFailure: 40, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "banded-mail", name: "Banded mail", category: "Heavy", cost: "250 gp", baseArmorClass: 6, dexModifier: "max2", stealthDisadvantage: true, weight: 35, description: "A heavy armor, granting a +6 armor bonus to AC.", armorCheckPenalty: -6, maxDexBonus: 1, arcaneSpellFailure: 35, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "half-plate", name: "Half-plate", category: "Heavy", cost: "600 gp", baseArmorClass: 7, dexModifier: "none", stealthDisadvantage: true, weight: 50, description: "A heavy armor, granting a +7 armor bonus to AC.", armorCheckPenalty: -7, maxDexBonus: 0, arcaneSpellFailure: 40, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "full-plate", name: "Full plate", category: "Heavy", cost: "1,500 gp", baseArmorClass: 8, dexModifier: "max2", stealthDisadvantage: true, weight: 50, description: "A heavy armor, granting a +8 armor bonus to AC.", armorCheckPenalty: -6, maxDexBonus: 1, arcaneSpellFailure: 35, speedWith30FtBase: 20, speedWith20FtBase: 15 },
  { id: "buckler", name: "Buckler", category: "Shield", cost: "15 gp", baseArmorClass: 1, dexModifier: "none", stealthDisadvantage: true, weight: 5, description: "A shield, granting a +1 shield bonus to AC.", armorCheckPenalty: -1, arcaneSpellFailure: 5 },
  { id: "shield-light-wooden", name: "Shield, light wooden", category: "Shield", cost: "3 gp", baseArmorClass: 1, dexModifier: "none", stealthDisadvantage: true, weight: 5, description: "A shield, granting a +1 shield bonus to AC.", armorCheckPenalty: -1, arcaneSpellFailure: 5 },
  { id: "shield-light-steel", name: "Shield, light steel", category: "Shield", cost: "9 gp", baseArmorClass: 1, dexModifier: "none", stealthDisadvantage: true, weight: 6, description: "A shield, granting a +1 shield bonus to AC.", armorCheckPenalty: -1, arcaneSpellFailure: 5 },
  { id: "shield-heavy-wooden", name: "Shield, heavy wooden", category: "Shield", cost: "7 gp", baseArmorClass: 2, dexModifier: "none", stealthDisadvantage: true, weight: 10, description: "A shield, granting a +2 shield bonus to AC.", armorCheckPenalty: -2, arcaneSpellFailure: 15 },
  { id: "shield-heavy-steel", name: "Shield, heavy steel", category: "Shield", cost: "20 gp", baseArmorClass: 2, dexModifier: "none", stealthDisadvantage: true, weight: 15, description: "A shield, granting a +2 shield bonus to AC.", armorCheckPenalty: -2, arcaneSpellFailure: 15 },
  { id: "shield-tower", name: "Shield, tower", category: "Shield", cost: "30 gp", baseArmorClass: 4, dexModifier: "none", stealthDisadvantage: true, weight: 45, description: "A shield, granting a +4 shield bonus to AC.", armorCheckPenalty: -10, maxDexBonus: 2, arcaneSpellFailure: 50 },
];
