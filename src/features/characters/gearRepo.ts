import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import {
  characterArmor,
  characterGearItems,
  characterWeapons,
  homebrewArmor,
  homebrewWeapons,
} from "../../db/schema";
import { getRulesetCatalog } from "../../data/rulesets";
import type { ArmorDefinition, WeaponDefinition } from "../../data/rulesets";
import { abilityModifier, type FeatEffectBundle } from "./characterCalculations";
import { recomputeArmorClass } from "./armorClassRepo";
import { touchCharacterUpdatedAt } from "./syncClock";

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
  quantity?: number;
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

export type AddGearOptions = { equipped?: boolean; quantity?: number };

export async function addWeaponFromCatalog(
  characterId: number,
  ruleset: string,
  catalogId: string,
  options: AddGearOptions = {}
): Promise<void> {
  const definition = listWeaponCatalog(ruleset).find((w) => w.id === catalogId);
  if (!definition) return;
  await db.insert(characterWeapons).values({
    characterId,
    equipped: options.equipped ?? false,
    quantity: Math.max(1, options.quantity ?? 1),
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
  await touchCharacterUpdatedAt(characterId);
}

export async function addCustomWeapon(
  characterId: number,
  input: CustomWeaponInput
): Promise<void> {
  await db.insert(characterWeapons).values({
    characterId,
    quantity: Math.max(1, input.quantity ?? 1),
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
  await touchCharacterUpdatedAt(characterId);
}

// --- Shared homebrew library -----------------------------------------------
// Weapons/armor have no DB catalog at all (WeaponDefinition/ArmorDefinition
// are static TS data), so these are new global tables. "Taking" one clones
// its fields onto a character_weapons/character_armor row, same shape as
// addWeaponFromCatalog/addArmorFromCatalog, with `homebrewSourceId` left as
// a provenance backpointer (never a live reference).

export async function listHomebrewWeapons(ruleset?: string) {
  const rows = await db.select().from(homebrewWeapons).orderBy(homebrewWeapons.name);
  return ruleset ? rows.filter((w) => w.ruleset === ruleset) : rows;
}

export async function createHomebrewWeapon(ruleset: string, input: CustomWeaponInput): Promise<number> {
  const [row] = await db
    .insert(homebrewWeapons)
    .values({
      ruleset,
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
    })
    .returning();
  return row.id;
}

export async function updateHomebrewWeapon(id: number, input: CustomWeaponInput): Promise<void> {
  await db
    .update(homebrewWeapons)
    .set({
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
    })
    .where(eq(homebrewWeapons.id, id));
}

export async function deleteHomebrewWeapon(id: number): Promise<void> {
  await db.delete(homebrewWeapons).where(eq(homebrewWeapons.id, id));
}

export async function addWeaponFromHomebrew(
  characterId: number,
  homebrewId: number,
  options: AddGearOptions = {}
): Promise<void> {
  const [definition] = await db.select().from(homebrewWeapons).where(eq(homebrewWeapons.id, homebrewId));
  if (!definition) return;
  await db.insert(characterWeapons).values({
    characterId,
    equipped: options.equipped ?? false,
    quantity: Math.max(1, options.quantity ?? 1),
    catalogId: null,
    homebrewSourceId: definition.id,
    name: definition.name,
    category: definition.category,
    cost: definition.cost,
    damageDice: definition.damageDice,
    damageType: definition.damageType,
    weight: definition.weight,
    properties: definition.properties,
    description: definition.description,
    isMagic: definition.isMagic,
    magicBonus: definition.magicBonus,
  });
  await touchCharacterUpdatedAt(characterId);
}

export async function listHomebrewArmor(ruleset?: string) {
  const rows = await db.select().from(homebrewArmor).orderBy(homebrewArmor.name);
  return ruleset ? rows.filter((a) => a.ruleset === ruleset) : rows;
}

export async function createHomebrewArmor(ruleset: string, input: CustomArmorInput): Promise<number> {
  const [row] = await db
    .insert(homebrewArmor)
    .values({
      ruleset,
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
    })
    .returning();
  return row.id;
}

export async function updateHomebrewArmor(id: number, input: CustomArmorInput): Promise<void> {
  await db
    .update(homebrewArmor)
    .set({
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
    })
    .where(eq(homebrewArmor.id, id));
}

export async function deleteHomebrewArmor(id: number): Promise<void> {
  await db.delete(homebrewArmor).where(eq(homebrewArmor.id, id));
}

export async function addArmorFromHomebrew(
  characterId: number,
  homebrewId: number,
  options: AddGearOptions = {}
): Promise<void> {
  const [definition] = await db.select().from(homebrewArmor).where(eq(homebrewArmor.id, homebrewId));
  if (!definition) return;
  await db.insert(characterArmor).values({
    characterId,
    equipped: options.equipped ?? false,
    catalogId: null,
    homebrewSourceId: definition.id,
    name: definition.name,
    category: definition.category,
    cost: definition.cost,
    baseArmorClass: definition.baseArmorClass,
    dexModifier: definition.dexModifier,
    strengthRequirement: definition.strengthRequirement,
    stealthDisadvantage: definition.stealthDisadvantage,
    weight: definition.weight,
    description: definition.description,
    isMagic: definition.isMagic,
    magicBonus: definition.magicBonus,
  });
  await touchCharacterUpdatedAt(characterId);
  if (options.equipped) await recomputeArmorClass(characterId);
}

export async function removeCharacterWeapon(weaponId: number): Promise<void> {
  const [row] = await db.select().from(characterWeapons).where(eq(characterWeapons.id, weaponId));
  await db.delete(characterWeapons).where(eq(characterWeapons.id, weaponId));
  if (row) await touchCharacterUpdatedAt(row.characterId);
}

export async function setWeaponEquipped(weaponId: number, equipped: boolean): Promise<void> {
  const [row] = await db.select().from(characterWeapons).where(eq(characterWeapons.id, weaponId));
  await db.update(characterWeapons).set({ equipped }).where(eq(characterWeapons.id, weaponId));
  if (row) await touchCharacterUpdatedAt(row.characterId);
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
  catalogId: string,
  options: AddGearOptions = {}
): Promise<void> {
  const definition = listArmorCatalog(ruleset).find((a) => a.id === catalogId);
  if (!definition) return;
  await db.insert(characterArmor).values({
    characterId,
    equipped: options.equipped ?? false,
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
  await touchCharacterUpdatedAt(characterId);
  if (options.equipped) await recomputeArmorClass(characterId);
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
  await touchCharacterUpdatedAt(characterId);
}

export async function listGearItems(characterId: number) {
  return db
    .select()
    .from(characterGearItems)
    .where(eq(characterGearItems.characterId, characterId))
    .orderBy(characterGearItems.createdAt, characterGearItems.id);
}

/** Adds a pack, focus, tool, ammunition, etc. Adding a name the character already has (case-insensitive) stacks onto that row instead of duplicating it. */
export async function addGearItem(
  characterId: number,
  input: { name: string; quantity?: number; description?: string }
): Promise<void> {
  const name = input.name.trim();
  if (!name) return;
  const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
  const existing = (await listGearItems(characterId)).find((row) => row.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    await db
      .update(characterGearItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(characterGearItems.id, existing.id));
    await touchCharacterUpdatedAt(characterId);
    return;
  }
  await db.insert(characterGearItems).values({
    characterId,
    name,
    quantity,
    description: input.description?.trim() ?? "",
  });
  await touchCharacterUpdatedAt(characterId);
}

/** Sets a gear item's quantity; 0 or less removes it. */
export async function setGearItemQuantity(itemId: number, quantity: number): Promise<void> {
  const [row] = await db.select().from(characterGearItems).where(eq(characterGearItems.id, itemId));
  if (quantity <= 0) {
    await db.delete(characterGearItems).where(eq(characterGearItems.id, itemId));
  } else {
    await db.update(characterGearItems).set({ quantity: Math.floor(quantity) }).where(eq(characterGearItems.id, itemId));
  }
  if (row) await touchCharacterUpdatedAt(row.characterId);
}

export async function removeGearItem(itemId: number): Promise<void> {
  const [row] = await db.select().from(characterGearItems).where(eq(characterGearItems.id, itemId));
  await db.delete(characterGearItems).where(eq(characterGearItems.id, itemId));
  if (row) await touchCharacterUpdatedAt(row.characterId);
}

export async function removeCharacterArmor(armorId: number): Promise<void> {
  const [row] = await db.select().from(characterArmor).where(eq(characterArmor.id, armorId));
  await db.delete(characterArmor).where(eq(characterArmor.id, armorId));
  if (row) {
    await touchCharacterUpdatedAt(row.characterId);
    if (row.equipped) await recomputeArmorClass(row.characterId);
  }
}

export async function setArmorEquipped(armorId: number, equipped: boolean): Promise<void> {
  const [row] = await db.select().from(characterArmor).where(eq(characterArmor.id, armorId));
  await db.update(characterArmor).set({ equipped }).where(eq(characterArmor.id, armorId));
  if (row) {
    await touchCharacterUpdatedAt(row.characterId);
    await recomputeArmorClass(row.characterId);
  }
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
  maxDexBonus?: number;
}): string {
  const bonus = armor.magicBonus ?? 0;
  if (armor.category === "Shield") return `+${armor.baseArmorClass + bonus}`;
  const bonusSuffix = bonus ? ` +${bonus}` : "";
  if (armor.maxDexBonus !== undefined) {
    return `${armor.baseArmorClass} + Dex modifier (max ${armor.maxDexBonus})${bonusSuffix}`;
  }
  if (armor.dexModifier === "full") return `${armor.baseArmorClass} + Dex modifier${bonusSuffix}`;
  if (armor.dexModifier === "max2") return `${armor.baseArmorClass} + Dex modifier (max 2)${bonusSuffix}`;
  return `${armor.baseArmorClass}${bonusSuffix}`;
}

/**
 * "Crossbow, hand" (this app's/the SRD table's "Type, qualifier" sort
 * order) vs. "Hand crossbow" (how 3.5e class data writes proficiency
 * lists, in natural reading order) -- flips a comma-form name's two halves
 * so both notations compare equal. No-op for a name with no comma.
 */
function normalizeWeaponName(name: string): string {
  const [base, qualifier] = name.split(", ");
  return qualifier ? `${qualifier} ${base}` : name;
}

/**
 * Whether a class's weapon proficiency list covers this weapon -- either a
 * blanket "Simple weapons"/"Martial weapons" grant matching the weapon's
 * category (2014/2024 5e's phrasing) or "All simple weapons"/"All martial
 * weapons" (3.5e's), or a specific weapon name (5e lists these in plural,
 * e.g. "Longswords", "Hand crossbows"; 3.5e lists them singular, in
 * natural word order -- see `normalizeWeaponName` -- and sometimes
 * combines two named weapons, e.g. "Crossbow (light or heavy)").
 */
export function isProficientWithWeapon(
  weapon: { name: string; category: string; properties?: string | string[] },
  weaponProficiencies: string[] | undefined
): boolean {
  if (!weaponProficiencies || weaponProficiencies.length === 0) return false;
  const category = weapon.category.toLowerCase();
  const name = normalizeWeaponName(weapon.name.toLowerCase());
  const properties = (Array.isArray(weapon.properties) ? weapon.properties.join(",") : weapon.properties ?? "").toLowerCase();
  return weaponProficiencies.some((proficiency) => {
    const text = proficiency.toLowerCase();
    if ((text === "simple weapons" || text === "all simple weapons") && category.startsWith("simple")) return true;
    if ((text === "martial weapons" || text === "all martial weapons") && category.startsWith("martial")) return true;
    // e.g. 2024 Rogue: "Martial weapons with the Finesse or Light property".
    const qualified = text.match(/^martial weapons with the (.+) property$/);
    if (qualified && category.startsWith("martial")) {
      return qualified[1].split(/\s+or\s+/).some((property) => properties.includes(property.trim()));
    }
    // e.g. 3.5e Monk: "Crossbow (light or heavy)" covers both named weapons.
    const combined = text.match(/^(\w+) \((.+)\)$/);
    if (combined) {
      return combined[2]
        .split(/\s+or\s+/)
        .some((qualifier) => normalizeWeaponName(`${combined[1]}, ${qualifier.trim()}`) === name);
    }
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
