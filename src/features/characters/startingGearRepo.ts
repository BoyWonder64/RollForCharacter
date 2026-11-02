import {
  addArmorFromCatalog,
  addCustomWeapon,
  addGearItem,
  addWeaponFromCatalog,
} from "./gearRepo";
import { adjustCurrency } from "./characterRepo";
import type { ResolvedGear } from "./startingEquipment";

/**
 * Gives a newly created character everything the Starting Equipment step
 * resolved to: weapons (stacked by quantity), armor and shields, packs/foci/
 * ammunition as gear items, and the kit's gold. Armor and shields are equipped
 * (they are what the starting Armor Class was computed from) and so is the
 * first weapon; everything else starts stowed.
 */
export async function applyStartingGear(characterId: number, ruleset: string, gear: ResolvedGear): Promise<void> {
  let firstWeapon = true;
  for (const weapon of gear.weapons) {
    const equipped = firstWeapon;
    firstWeapon = false;
    if (weapon.def) {
      await addWeaponFromCatalog(characterId, ruleset, weapon.def.id, { equipped, quantity: weapon.quantity });
    } else if (weapon.customName) {
      await addCustomWeapon(characterId, { name: weapon.customName, quantity: weapon.quantity });
    }
  }
  for (const armor of gear.armor) {
    await addArmorFromCatalog(characterId, ruleset, armor.id, { equipped: true });
  }
  for (const item of gear.items) {
    await addGearItem(characterId, item);
  }
  if (gear.gold > 0) await adjustCurrency(characterId, "gold", gear.gold);
}
