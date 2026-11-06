import type { WeaponDefinition } from "../types";
import { WEAPONS_5E } from "../5e/weapons";

// 2024 5e's Weapon Mastery property per weapon (SRD 5.2, CC-BY licensed),
// fetched from open5e's srd-2024 item catalog
// (https://api.open5e.com/v2/items/?document__key=srd-2024). The weapon
// stats themselves are unchanged from 2014 (verified identical in the SRD),
// so this only adds the one new field on top of WEAPONS_5E rather than
// duplicating the whole table -- see index.ts's old comment on this gap.
const WEAPON_MASTERY_2024: Record<string, { name: string; description: string }> = {
  "battleaxe": { name: "Topple", description: "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition." },
  "blowgun": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "club": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  "dagger": { name: "Nick", description: "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn." },
  "dart": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "flail": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "glaive": { name: "Graze", description: "If your attack roll with this weapon misses a creature, you can deal damage to that creature equal to the ability modifier you used to make the attack roll. This damage is the same type dealt by the weapon, and the damage can be increased only by increasing the ability modifier." },
  "greataxe": { name: "Cleave", description: "If you hit a creature with a melee attack roll using this weapon, you can make a melee attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach. On a hit, the second creature takes the weapon's damage, but don't add your ability modifier to that damage unless that modifier is negative. You can make this extra attack only once per turn." },
  "greatclub": { name: "Push", description: "If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller." },
  "greatsword": { name: "Graze", description: "If your attack roll with this weapon misses a creature, you can deal damage to that creature equal to the ability modifier you used to make the attack roll. This damage is the same type dealt by the weapon, and the damage can be increased only by increasing the ability modifier." },
  "halberd": { name: "Cleave", description: "If you hit a creature with a melee attack roll using this weapon, you can make a melee attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach. On a hit, the second creature takes the weapon's damage, but don't add your ability modifier to that damage unless that modifier is negative. You can make this extra attack only once per turn." },
  "hand-crossbow": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "handaxe": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "heavy-crossbow": { name: "Push", description: "If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller." },
  "javelin": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  "lance": { name: "Topple", description: "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition." },
  "light-crossbow": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  "light-hammer": { name: "Nick", description: "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn." },
  "longbow": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  "longsword": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "mace": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "maul": { name: "Topple", description: "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition." },
  "morningstar": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "pike": { name: "Push", description: "If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller." },
  "quarterstaff": { name: "Topple", description: "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition." },
  "rapier": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "scimitar": { name: "Nick", description: "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn." },
  "shortbow": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "shortsword": { name: "Vex", description: "If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn." },
  "sickle": { name: "Nick", description: "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn." },
  "sling": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  "spear": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "trident": { name: "Topple", description: "If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition." },
  "war-pick": { name: "Sap", description: "If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn." },
  "warhammer": { name: "Push", description: "If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller." },
  "whip": { name: "Slow", description: "If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet." },
  // "net" has no Mastery property in the SRD -- it deals no damage.
};

export const WEAPONS_5E_2024: WeaponDefinition[] = WEAPONS_5E.map((weapon) => {
  const mastery = WEAPON_MASTERY_2024[weapon.id];
  return mastery ? { ...weapon, mastery } : weapon;
});
