/**
 * Pixel-art character portraits the player can pick instead of uploading
 * their own photo. Cropped from the "32rogues" sprite sheet by Seth Boyles
 * (Copyright 2024, see src/app/legal.tsx) and upscaled 4x with
 * nearest-neighbour so they stay crisp. Per that license the sprites ship
 * only as in-app portraits -- do not publish the raw sheet.
 */
export type SpritePortrait = { id: string; label: string; source: number };

export const SPRITE_PORTRAITS: SpritePortrait[] = [
  { id: "dwarf", label: "Dwarf", source: require("../../assets/portraits/dwarf.png") },
  { id: "elf", label: "Elf", source: require("../../assets/portraits/elf.png") },
  { id: "ranger", label: "Ranger", source: require("../../assets/portraits/ranger.png") },
  { id: "rogue", label: "Rogue", source: require("../../assets/portraits/rogue.png") },
  { id: "bandit", label: "Bandit", source: require("../../assets/portraits/bandit.png") },
  { id: "knight", label: "Knight", source: require("../../assets/portraits/knight.png") },
  { id: "male-fighter", label: "Male Fighter", source: require("../../assets/portraits/male-fighter.png") },
  { id: "female-knight", label: "Female Knight", source: require("../../assets/portraits/female-knight.png") },
  { id: "female-knight-helmetless", label: "Female Knight Helmetless", source: require("../../assets/portraits/female-knight-helmetless.png") },
  { id: "shield-knight", label: "Shield Knight", source: require("../../assets/portraits/shield-knight.png") },
  { id: "monk", label: "Monk", source: require("../../assets/portraits/monk.png") },
  { id: "priest", label: "Priest", source: require("../../assets/portraits/priest.png") },
  { id: "female-war-cleric", label: "Female War Cleric", source: require("../../assets/portraits/female-war-cleric.png") },
  { id: "male-war-cleric", label: "Male War Cleric", source: require("../../assets/portraits/male-war-cleric.png") },
  { id: "templar", label: "Templar", source: require("../../assets/portraits/templar.png") },
  { id: "schema-monk", label: "Schema Monk", source: require("../../assets/portraits/schema-monk.png") },
  { id: "elder-schema-monk", label: "Elder Schema Monk", source: require("../../assets/portraits/elder-schema-monk.png") },
  { id: "male-barbarian", label: "Male Barbarian", source: require("../../assets/portraits/male-barbarian.png") },
  { id: "male-winter-barbarian", label: "Male Winter Barbarian", source: require("../../assets/portraits/male-winter-barbarian.png") },
  { id: "female-winter-barbarian", label: "Female Winter Barbarian", source: require("../../assets/portraits/female-winter-barbarian.png") },
  { id: "swordsman", label: "Swordsman", source: require("../../assets/portraits/swordsman.png") },
  { id: "fencer", label: "Fencer", source: require("../../assets/portraits/fencer.png") },
  { id: "female-barbarian", label: "Female Barbarian", source: require("../../assets/portraits/female-barbarian.png") },
  { id: "female-wizard", label: "Female Wizard", source: require("../../assets/portraits/female-wizard.png") },
  { id: "male-wizard", label: "Male Wizard", source: require("../../assets/portraits/male-wizard.png") },
  { id: "druid", label: "Druid", source: require("../../assets/portraits/druid.png") },
  { id: "desert-sage", label: "Desert Sage", source: require("../../assets/portraits/desert-sage.png") },
  { id: "dwarf-mage", label: "Dwarf Mage", source: require("../../assets/portraits/dwarf-mage.png") },
  { id: "warlock", label: "Warlock", source: require("../../assets/portraits/warlock.png") },
  { id: "farmer-thresher", label: "Farmer Thresher", source: require("../../assets/portraits/farmer-thresher.png") },
  { id: "farmer-scythe", label: "Farmer Scythe", source: require("../../assets/portraits/farmer-scythe.png") },
  { id: "farmer-pitchfork", label: "Farmer Pitchfork", source: require("../../assets/portraits/farmer-pitchfork.png") },
  { id: "baker", label: "Baker", source: require("../../assets/portraits/baker.png") },
  { id: "blacksmith", label: "Blacksmith", source: require("../../assets/portraits/blacksmith.png") },
  { id: "scholar", label: "Scholar", source: require("../../assets/portraits/scholar.png") },
  { id: "peasant-coalburner", label: "Peasant Coalburner", source: require("../../assets/portraits/peasant-coalburner.png") },
  { id: "peasant", label: "Peasant", source: require("../../assets/portraits/peasant.png") },
  { id: "shopkeep", label: "Shopkeep", source: require("../../assets/portraits/shopkeep.png") },
  { id: "elderly-woman", label: "Elderly Woman", source: require("../../assets/portraits/elderly-woman.png") },
  { id: "elderly-man", label: "Elderly Man", source: require("../../assets/portraits/elderly-man.png") },
];

export function findSpritePortrait(id: string): SpritePortrait | undefined {
  return SPRITE_PORTRAITS.find((p) => p.id === id);
}
