import type {
  ArmorDefinition,
  ClassDefinition,
  EquipmentGrant,
  EquipmentLine,
  RulesetCatalog,
  WeaponDefinition,
} from "../../data/rulesets";
import { CUSTOM_OPTION_ID } from "../../data/rulesets";
import { abilityModifier } from "./characterCalculations";
import { isProficientWithWeapon } from "./gearRepo";

// Pure logic behind onboarding's Starting Equipment step: which weapons/armor
// a class may swap each kit item for (by proficiency), what the player's
// selections add up to, and the starting Armor Class that results. No React,
// no database -- the UI lives in StartingEquipmentStep.tsx and persistence in
// startingGearRepo.ts.

/** A pick value meaning "type my own weapon" -- the typed name lives in `customNames`. */
export const CUSTOM_PICK = CUSTOM_OPTION_ID;
/** A pick value meaning "I don't want this armor/shield". */
export const NO_PICK = "none";

export type StartingEquipmentSelection = {
  /** Line index -> which of that line's options the player chose (default 0). */
  optionIndex: Record<number, number>;
  /** Grant key -> catalog id the player swapped that grant to (or CUSTOM_PICK / NO_PICK). Absent = the kit's own item. */
  picks: Record<string, string>;
  /** Grant key -> typed weapon name, for CUSTOM_PICK. */
  customNames: Record<string, string>;
};

export const EMPTY_SELECTION: StartingEquipmentSelection = { optionIndex: {}, picks: {}, customNames: {} };

export function grantKey(lineIndex: number, optionIndex: number, grantIndex: number): string {
  return `${lineIndex}:${optionIndex}:${grantIndex}`;
}

export function chosenOptionIndex(selection: StartingEquipmentSelection, lineIndex: number): number {
  return selection.optionIndex[lineIndex] ?? 0;
}

// ---------------------------------------------------------------------------
// Proficiency
// ---------------------------------------------------------------------------

/** Metal-free armor, for classes whose armor proficiency is restricted to "(nonmetal)" (2014 Druid). */
const NONMETAL_ARMOR_IDS = new Set(["padded", "leather", "studded-leather", "hide"]);

/**
 * Whether a class's free-text armor proficiencies ("Light armor", "Medium
 * armor (nonmetal)", "All armor", "Shields", ...) cover this armor.
 */
export function isProficientWithArmor(
  armor: Pick<ArmorDefinition, "id" | "category">,
  armorProficiencies: string[] | undefined
): boolean {
  if (!armorProficiencies || armorProficiencies.length === 0) return false;
  return armorProficiencies.some((proficiency) => {
    const text = proficiency.toLowerCase();
    const nonmetalOnly = text.includes("(nonmetal)");
    const base = text.replace(/\s*\(nonmetal\)/, "").trim();
    if (nonmetalOnly && armor.category !== "Shield" && !NONMETAL_ARMOR_IDS.has(armor.id)) return false;
    if (armor.category === "Shield") return base === "shields";
    if (base === "all armor") return true;
    return base === `${armor.category.toLowerCase()} armor`;
  });
}

// ---------------------------------------------------------------------------
// Swap candidates
// ---------------------------------------------------------------------------

export type Candidate<T> = { def: T; proficient: boolean };

type CatalogView = Pick<RulesetCatalog, "weapons" | "armor">;
type ProficiencyView = Pick<ClassDefinition, "armorProficiencies" | "weaponProficiencies">;

/** What kind of choice a grant is: a weapon (fixed or "any simple weapon"), body armor, a shield, or not swappable (items, gold). */
export function swapKind(grant: EquipmentGrant, catalog: CatalogView): "weapon" | "armor" | "shield" | null {
  if (grant.kind === "weapon" || grant.kind === "weaponChoice") return "weapon";
  if (grant.kind === "armor") {
    return catalog.armor?.find((a) => a.id === grant.armorId)?.category === "Shield" ? "shield" : "armor";
  }
  return null;
}

function matchesCategory(weapon: WeaponDefinition, category: string): boolean {
  if (category === "Simple") return weapon.category.startsWith("Simple");
  if (category === "Martial") return weapon.category.startsWith("Martial");
  return weapon.category === category;
}

/**
 * Every weapon the player can pick for this grant. A fixed weapon ("mace")
 * can be swapped for ANY weapon the class is proficient with; an "any simple
 * weapon" grant lists that whole category as the rules say. Proficient
 * weapons come first; `showAll` also lists the rest of the catalog (flagged
 * not-proficient) for house rules or subclass proficiencies that aren't
 * modeled yet. The kit's own weapon is always included.
 */
export function weaponCandidates(
  grant: EquipmentGrant,
  catalog: CatalogView,
  proficiencies: ProficiencyView,
  showAll: boolean
): Candidate<WeaponDefinition>[] {
  const weapons = catalog.weapons ?? [];
  const tagged = (w: WeaponDefinition): Candidate<WeaponDefinition> => ({
    def: w,
    proficient: isProficientWithWeapon(w, proficiencies.weaponProficiencies),
  });
  let pool: Candidate<WeaponDefinition>[];
  if (grant.kind === "weaponChoice") {
    pool = weapons.filter((w) => matchesCategory(w, grant.category)).map(tagged);
  } else if (grant.kind === "weapon") {
    pool = weapons
      .map(tagged)
      .filter((c) => showAll || c.proficient || c.def.id === grant.weaponId);
  } else {
    return [];
  }
  // Stable sort: proficient first, catalog order within each group.
  return [...pool].sort((a, b) => Number(b.proficient) - Number(a.proficient));
}

/** Armor (or shields) the player can pick for this grant, same rules as `weaponCandidates`. */
export function armorCandidates(
  grant: EquipmentGrant,
  catalog: CatalogView,
  proficiencies: ProficiencyView,
  showAll: boolean
): Candidate<ArmorDefinition>[] {
  if (grant.kind !== "armor") return [];
  const armor = catalog.armor ?? [];
  const wantShield = swapKind(grant, catalog) === "shield";
  return armor
    .filter((a) => (a.category === "Shield") === wantShield)
    .map((a) => ({ def: a, proficient: isProficientWithArmor(a, proficiencies.armorProficiencies) }))
    .filter((c) => showAll || c.proficient || c.def.id === grant.armorId)
    .sort((a, b) => Number(b.proficient) - Number(a.proficient));
}

// ---------------------------------------------------------------------------
// Resolving a selection
// ---------------------------------------------------------------------------

export type ResolvedWeapon = { def?: WeaponDefinition; customName?: string; quantity: number };
export type ResolvedItem = { name: string; quantity: number; description: string };

export type ResolvedGear = {
  weapons: ResolvedWeapon[];
  armor: ArmorDefinition[];
  items: ResolvedItem[];
  gold: number;
};

/** The weapon id a grant currently resolves to: the player's swap, else the kit's own, else (for "any X weapon") the first proficient match. */
export function resolvedWeaponId(
  grant: EquipmentGrant,
  key: string,
  selection: StartingEquipmentSelection,
  catalog: CatalogView,
  proficiencies: ProficiencyView
): string | undefined {
  const picked = selection.picks[key];
  if (picked && picked !== CUSTOM_PICK) return picked;
  if (grant.kind === "weapon") return grant.weaponId;
  return weaponCandidates(grant, catalog, proficiencies, false)[0]?.def.id;
}

/** The armor id a grant currently resolves to, or undefined when the player chose to go without. */
export function resolvedArmorId(grant: EquipmentGrant, key: string, selection: StartingEquipmentSelection): string | undefined {
  const picked = selection.picks[key];
  if (picked === NO_PICK) return undefined;
  if (picked) return picked;
  return grant.kind === "armor" ? grant.armorId : undefined;
}

/** Flattens the chosen option of every line into concrete gear to give the new character. */
export function resolveStartingGear(
  lines: EquipmentLine[],
  selection: StartingEquipmentSelection,
  catalog: CatalogView,
  proficiencies: ProficiencyView
): ResolvedGear {
  const gear: ResolvedGear = { weapons: [], armor: [], items: [], gold: 0 };
  lines.forEach((line, lineIndex) => {
    const optionIndex = chosenOptionIndex(selection, lineIndex);
    const option = line[optionIndex] ?? line[0] ?? [];
    option.forEach((grant, grantIndex) => {
      const key = grantKey(lineIndex, optionIndex, grantIndex);
      switch (grant.kind) {
        case "weapon":
        case "weaponChoice": {
          const quantity = grant.quantity ?? 1;
          if (selection.picks[key] === CUSTOM_PICK) {
            const customName = (selection.customNames[key] ?? "").trim();
            if (customName) gear.weapons.push({ customName, quantity });
            return;
          }
          const id = resolvedWeaponId(grant, key, selection, catalog, proficiencies);
          const def = catalog.weapons?.find((w) => w.id === id);
          if (def) gear.weapons.push({ def, quantity });
          return;
        }
        case "armor": {
          const id = resolvedArmorId(grant, key, selection);
          const def = catalog.armor?.find((a) => a.id === id);
          if (def) gear.armor.push(def);
          return;
        }
        case "item":
          gear.items.push({ name: grant.name, quantity: grant.quantity ?? 1, description: grant.description ?? "" });
          return;
        case "gold":
          gear.gold += grant.amount;
          return;
      }
    });
  });
  return gear;
}

// ---------------------------------------------------------------------------
// Armor Class
// ---------------------------------------------------------------------------

/**
 * Starting Armor Class from the chosen armor: the best single body armor
 * (base AC plus Dex per its rule, defaulting to 10 + Dex unarmored) plus any
 * shield bonuses. Matches `describeArmorAc` in gearRepo.ts.
 */
export function computeArmorClass(
  dexterityScore: number,
  armor: Pick<ArmorDefinition, "category" | "baseArmorClass" | "dexModifier">[]
): number {
  const dex = abilityModifier(dexterityScore);
  const body = armor.filter((a) => a.category !== "Shield");
  const shields = armor.filter((a) => a.category === "Shield");
  const bodyAc = body.length
    ? Math.max(
        ...body.map((a) => {
          const dexPart = a.dexModifier === "full" ? dex : a.dexModifier === "max2" ? Math.min(dex, 2) : 0;
          return a.baseArmorClass + dexPart;
        })
      )
    : 10 + dex;
  return bodyAc + shields.reduce((sum, s) => sum + s.baseArmorClass, 0);
}

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

/** One-line summary of what a kit option gives, honoring the player's swaps. */
export function describeOption(
  option: EquipmentGrant[],
  lineIndex: number,
  optionIndex: number,
  selection: StartingEquipmentSelection,
  catalog: CatalogView,
  proficiencies: ProficiencyView
): string {
  return option
    .map((grant, grantIndex) => {
      const key = grantKey(lineIndex, optionIndex, grantIndex);
      const qty = "quantity" in grant && grant.quantity && grant.quantity > 1 ? `${grant.quantity} × ` : "";
      switch (grant.kind) {
        case "weapon":
        case "weaponChoice": {
          if (selection.picks[key] === CUSTOM_PICK) {
            return `${qty}${(selection.customNames[key] ?? "").trim() || "Custom weapon"}`;
          }
          const id = resolvedWeaponId(grant, key, selection, catalog, proficiencies);
          return `${qty}${catalog.weapons?.find((w) => w.id === id)?.name ?? "Weapon"}`;
        }
        case "armor": {
          const id = resolvedArmorId(grant, key, selection);
          return id ? (catalog.armor?.find((a) => a.id === id)?.name ?? id) : "No armor";
        }
        case "item":
          return `${qty}${grant.name}`;
        case "gold":
          return `${grant.amount} gp`;
      }
    })
    .join(", ");
}
