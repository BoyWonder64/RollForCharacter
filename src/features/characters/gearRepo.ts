import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterArmor, characterWeapons } from "../../db/schema";
import { getRulesetCatalog } from "../../data/rulesets";
import type { ArmorDefinition, WeaponDefinition } from "../../data/rulesets";
import { abilityModifier, type FeatEffectBundle } from "./characterCalculations";

export function listWeaponCatalog(ruleset: string): WeaponDefinition[] {
  return getRulesetCatalog(ruleset).weapons ?? [];
}

export function listArmorCatalog(ruleset: string): ArmorDefinition[] {
  return getRulesetCatalog(ruleset).armor ?? [];
}

/** `characterWeapons.properties` is stored as a comma-separated list. */
export function parseWeaponProperties(properties: string): string[] {
  return properties ? properties.split(",").filter(Boolean) : [];
}

export async function listCharacterWeapons(characterId: number) {
  return db
    .select()
    .from(characterWeapons)
    .where(eq(characterWeapons.characterId, characterId))
    .orderBy(characterWeapons.createdAt);
}

export async function listCharacterArmor(characterId: number) {
  return db
    .select()
    .from(characterArmor)
    .where(eq(characterArmor.characterId, characterId))
    .orderBy(characterArmor.createdAt);
}

export type CustomWeaponInput = {
  name: string;
  category?: string;
  cost?: string;
  damageDice?: string;
  damageType?: string;
  weight?: number;
  properties?: string[];
  description?: string;
  isMagic?: boolean;
  magicBonus?: number;
};

export async function addWeaponFromCatalog(
  characterId: number,
  ruleset: string,
  catalogId: string
): Promise<void> {
  const definition = listWeaponCatalog(ruleset).find((w) => w.id === catalogId);
  if (!definition) return;
  await db.insert(characterWeapons).values({
    characterId,
    catalogId: definition.id,
    name: definition.name,
    category: definition.category,
    cost: definition.cost,
    damageDice: definition.damageDice,
    damageType: definition.damageType,
    weight: definition.weight,
    properties: definition.properties.join(","),
    description: definition.description,
  });
}

export async function addCustomWeapon(
  characterId: number,
  input: CustomWeaponInput
): Promise<void> {
  await db.insert(characterWeapons).values({
    characterId,
    catalogId: null,
    name: input.name,
    category: input.category ?? "",
    cost: input.cost ?? "",
    damageDice: input.damageDice ?? "",
    damageType: input.damageType ?? "",
    weight: input.weight ?? 0,
    properties: (input.properties ?? []).join(","),
    description: input.description ?? "",
    isMagic: input.isMagic ?? false,
    magicBonus: input.magicBonus ?? 0,
  });
}

export async function removeCharacterWeapon(weaponId: number): Promise<void> {
  await db.delete(characterWeapons).where(eq(characterWeapons.id, weaponId));
}

export async function setWeaponEquipped(weaponId: number, equipped: boolean): Promise<void> {
  await db.update(characterWeapons).set({ equipped }).where(eq(characterWeapons.id, weaponId));
}

export type CustomArmorInput = {
  name: string;
  category?: string;
  cost?: string;
  baseArmorClass?: number;
  dexModifier?: "full" | "max2" | "none";
  strengthRequirement?: number;
  stealthDisadvantage?: boolean;
  weight?: number;
  description?: string;
  isMagic?: boolean;
  magicBonus?: number;
};

export async function addArmorFromCatalog(
  characterId: number,
  ruleset: string,
  catalogId: string
): Promise<void> {
  const definition = listArmorCatalog(ruleset).find((a) => a.id === catalogId);
  if (!definition) return;
  await db.insert(characterArmor).values({
    characterId,
    catalogId: definition.id,
    name: definition.name,
    category: definition.category,
    cost: definition.cost,
    baseArmorClass: definition.baseArmorClass,
    dexModifier: definition.dexModifier,
    strengthRequirement: definition.strengthRequirement,
    stealthDisadvantage: definition.stealthDisadvantage,
    weight: definition.weight,
    description: definition.description,
  });
}

export async function addCustomArmor(
  characterId: number,
  input: CustomArmorInput
): Promise<void> {
  await db.insert(characterArmor).values({
    characterId,
    catalogId: null,
    name: input.name,
    category: input.category ?? "",
    cost: input.cost ?? "",
    baseArmorClass: input.baseArmorClass ?? 10,
    dexModifier: input.dexModifier ?? "full",
    strengthRequirement: input.strengthRequirement,
    stealthDisadvantage: input.stealthDisadvantage ?? false,
    weight: input.weight ?? 0,
    description: input.description ?? "",
    isMagic: input.isMagic ?? false,
    magicBonus: input.magicBonus ?? 0,
  });
}

export async function removeCharacterArmor(armorId: number): Promise<void> {
  await db.delete(characterArmor).where(eq(characterArmor.id, armorId));
}

export async function setArmorEquipped(armorId: number, equipped: boolean): Promise<void> {
  await db.update(characterArmor).set({ equipped }).where(eq(characterArmor.id, armorId));
}

/**
 * Display label for an armor's AC, e.g. "11 + Dex modifier" or "+2" for a
 * shield. A nonzero `magicBonus` (enchantment, e.g. a "+1 Breastplate") is
 * folded into a shield's flat bonus or appended as a suffix otherwise.
 */
export function describeArmorAc(armor: {
  category: string;
  baseArmorClass: number;
  dexModifier: string;
  magicBonus?: number;
}): string {
  const bonus = armor.magicBonus ?? 0;
  if (armor.category === "Shield") return `+${armor.baseArmorClass + bonus}`;
  const bonusSuffix = bonus ? ` +${bonus}` : "";
  if (armor.dexModifier === "full") return `${armor.baseArmorClass} + Dex modifier${bonusSuffix}`;
  if (armor.dexModifier === "max2") return `${armor.baseArmorClass} + Dex modifier (max 2)${bonusSuffix}`;
  return `${armor.baseArmorClass}${bonusSuffix}`;
}

/**
 * Whether a class's weapon proficiency list covers this weapon -- either a
 * blanket "Simple weapons"/"Martial weapons" grant matching the weapon's
 * category, or a specific weapon name (5e lists these in plural, e.g.
 * "Longswords", "Hand crossbows").
 */
export function isProficientWithWeapon(
  weapon: { name: string; category: string },
  weaponProficiencies: string[] | undefined
): boolean {
  if (!weaponProficiencies || weaponProficiencies.length === 0) return false;
  const category = weapon.category.toLowerCase();
  const name = weapon.name.toLowerCase();
  return weaponProficiencies.some((proficiency) => {
    const text = proficiency.toLowerCase();
    if (text === "simple weapons" && category.startsWith("simple")) return true;
    if (text === "martial weapons" && category.startsWith("martial")) return true;
    return text === name || text === `${name}s`;
  });
}

/**
 * Which ability modifier applies to this weapon's attack roll: Dex for
 * ranged weapons, the better of Str/Dex for Finesse weapons, Str otherwise.
 */
export function weaponAbilityModifier(
  weapon: { category: string; properties: string },
  strengthScore: number,
  dexterityScore: number
): number {
  const strMod = abilityModifier(strengthScore);
  const dexMod = abilityModifier(dexterityScore);
  if (weapon.category.includes("Ranged")) return dexMod;
  if (/finesse/i.test(weapon.properties)) return Math.max(strMod, dexMod);
  return strMod;
}

/** Whichever of a feat-effect bundle's ranged/melee attack bonuses applies to this weapon (e.g. Archery's +2 to Ranged weapons). */
export function weaponFeatAttackBonus(
  weapon: { category: string },
  featEffects: Pick<FeatEffectBundle, "rangedAttackBonus" | "meleeAttackBonus">
): number {
  return weapon.category.includes("Ranged") ? featEffects.rangedAttackBonus : featEffects.meleeAttackBonus;
}

/**
 * Full attack bonus for a weapon: ability modifier plus proficiency bonus if
 * proficient, plus the weapon's enchantment bonus (e.g. a "+1 Longsword"),
 * plus any feat-granted bonus (e.g. Archery's +2 to Ranged attacks).
 */
export function weaponAttackBonus(
  weapon: { category: string; properties: string; magicBonus?: number },
  strengthScore: number,
  dexterityScore: number,
  proficiencyBonus: number,
  proficient: boolean,
  featBonus = 0
): number {
  return (
    weaponAbilityModifier(weapon, strengthScore, dexterityScore) +
    (proficient ? proficiencyBonus : 0) +
    (weapon.magicBonus ?? 0) +
    featBonus
  );
}

/** Display label for an attack bonus, e.g. "+5" or "-1". */
export function describeAttackBonus(bonus: number): string {
  return bonus >= 0 ? `+${bonus}` : `${bonus}`;
}

/** Display label for a weapon's damage, e.g. "1d8 +1 Slashing" for an enchanted weapon. */
export function describeWeaponDamage(weapon: {
  damageDice: string;
  damageType: string;
  magicBonus?: number;
}): string {
  if (!weapon.damageDice) return "No damage";
  const bonus = weapon.magicBonus ?? 0;
  const dice = bonus ? `${weapon.damageDice} +${bonus}` : weapon.damageDice;
  return weapon.damageType ? `${dice} ${weapon.damageType}` : dice;
}
