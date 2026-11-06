import type {
  ArmorDefinition,
  ClassDefinition,
  EquipmentGrant,
  EquipmentLine,
  RulesetCatalog,
  WeaponDefinition,
} from "../../data/rulesets";
import { CUSTOM_OPTION_ID } from "../../data/rulesets";
import { optionsForToolCategory } from "../../data/rulesets/toolsAndInstruments";
import { computeEquippedArmorClass } from "./characterCalculations";
import { rollExpression } from "../dice/diceEngine";
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
  /** Grant key -> catalog id (or itemChoice option name) the player swapped that grant to (or CUSTOM_PICK / NO_PICK). Absent = the kit's own item. */
  picks: Record<string, string>;
  /** Grant key -> typed weapon/item name, for CUSTOM_PICK. */
  customNames: Record<string, string>;
  /** Grant key -> rolled gold total, for `goldRoll` grants -- rolled once (see `rollGoldOption`), cached here so re-renders don't re-roll it. */
  rolledAmounts: Record<string, number>;
};

export const EMPTY_SELECTION: StartingEquipmentSelection = {
  optionIndex: {},
  picks: {},
  customNames: {},
  rolledAmounts: {},
};

export function grantKey(lineIndex: number, optionIndex: number, grantIndex: number): string {
  return `${lineIndex}:${optionIndex}:${grantIndex}`;
}

export function chosenOptionIndex(selection: StartingEquipmentSelection, lineIndex: number): number {
  return selection.optionIndex[lineIndex] ?? 0;
}

// ---------------------------------------------------------------------------
// Proficiency
// ---------------------------------------------------------------------------

/**
 * Metal-free armor, for classes whose armor proficiency is restricted to
 * "(nonmetal)" (2014 and 3.5e Druid). 5e never splits Shield into
 * wooden/metal variants -- its one generic `shield` entry is treated as the
 * default nonmetal-compliant option, same as the real game leaves it to the
 * table, rather than exempting shields from the nonmetal check entirely.
 * 3.5e does split shields by material (see armor.ts) -- only the wooden
 * variants (and the materially-unspecified Buckler) qualify there.
 */
const NONMETAL_ARMOR_IDS = new Set([
  "padded",
  "leather",
  "studded-leather",
  "hide",
  "shield",
  "buckler",
  "shield-light-wooden",
  "shield-heavy-wooden",
]);

/**
 * Whether a class's free-text armor proficiencies ("Light armor", "Medium
 * armor (nonmetal)", "All armor", "Shields (except tower shields)",
 * "Shields (nonmetal, except tower shields)", ...) cover this armor. The
 * parenthetical, when present, is a comma-separated list of qualifiers
 * (3.5e sometimes combines two, e.g. Druid's armor list).
 */
export function isProficientWithArmor(
  armor: Pick<ArmorDefinition, "id" | "category">,
  armorProficiencies: string[] | undefined
): boolean {
  if (!armorProficiencies || armorProficiencies.length === 0) return false;
  return armorProficiencies.some((proficiency) => {
    const text = proficiency.toLowerCase();
    const qualifierMatch = text.match(/\(([^)]+)\)/);
    const qualifiers = qualifierMatch ? qualifierMatch[1].split(",").map((q) => q.trim()) : [];
    const base = text.replace(/\s*\([^)]+\)/, "").trim();

    if (qualifiers.includes("nonmetal") && !NONMETAL_ARMOR_IDS.has(armor.id)) return false;
    if (qualifiers.includes("except tower shields") && armor.id === "shield-tower") return false;

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

/**
 * The multiplier applied to a `goldRoll` grant's dice total -- the dice
 * engine has no multiplication operator, so "NdM x10" is expressed as a
 * fixed constant here rather than in the formula string itself.
 */
const GOLD_ROLL_MULTIPLIER = 10;

/**
 * Rolls a `goldRoll` grant's dice formula (x `GOLD_ROLL_MULTIPLIER`) once,
 * caching the result in the returned selection at `key` -- call this when
 * the player selects an option containing the grant, if it isn't already
 * cached. Re-rendering the same selection afterward just redisplays the
 * cached roll (see `resolveStartingGear`/`describeOption`'s `goldRoll`
 * case) rather than rolling again.
 */
export function rollGoldOption(
  grant: Extract<EquipmentGrant, { kind: "goldRoll" }>,
  key: string,
  selection: StartingEquipmentSelection
): StartingEquipmentSelection {
  if (key in selection.rolledAmounts) return selection;
  const amount = rollExpression(grant.formula).total * GOLD_ROLL_MULTIPLIER;
  return { ...selection, rolledAmounts: { ...selection.rolledAmounts, [key]: amount } };
}

/** Every named option an `itemChoice` grant offers -- its category's catalog list (or the union of both, for a combined choice like 2024 Monk's "artisan's tools or musical instrument"). */
export function itemChoiceOptions(grant: Extract<EquipmentGrant, { kind: "itemChoice" }>): string[] {
  const categories = Array.isArray(grant.category) ? grant.category : [grant.category];
  return categories.flatMap((c) => optionsForToolCategory(c));
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

/** The named option an `itemChoice` grant currently resolves to: the player's pick, else the category's first option. */
export function resolvedItemChoiceName(
  grant: Extract<EquipmentGrant, { kind: "itemChoice" }>,
  key: string,
  selection: StartingEquipmentSelection
): string | undefined {
  const picked = selection.picks[key];
  if (picked && picked !== CUSTOM_PICK) return picked;
  return itemChoiceOptions(grant)[0];
}

/**
 * If the player has chosen a lone `goldRoll` option on any line, that's
 * "take gold instead of my whole kit" (2014 5e's generic, non-PHB
 * alternative -- see `EquipmentGrant`'s `goldRoll` case), not just that
 * one line's own gold -- every other line's grant is meant to be forgone,
 * not stacked on top. Returns that line's grant key, or undefined when no
 * line is currently set to a lone `goldRoll` option.
 */
export function goldInsteadChoice(
  lines: EquipmentLine[],
  selection: StartingEquipmentSelection
): { lineIndex: number; key: string } | undefined {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const optionIndex = chosenOptionIndex(selection, lineIndex);
    const option = lines[lineIndex][optionIndex];
    if (option?.length === 1 && option[0].kind === "goldRoll") {
      return { lineIndex, key: grantKey(lineIndex, optionIndex, 0) };
    }
  }
  return undefined;
}

/** Flattens the chosen option of every line into concrete gear to give the new character. */
export function resolveStartingGear(
  lines: EquipmentLine[],
  selection: StartingEquipmentSelection,
  catalog: CatalogView,
  proficiencies: ProficiencyView
): ResolvedGear {
  const gear: ResolvedGear = { weapons: [], armor: [], items: [], gold: 0 };
  const goldInstead = goldInsteadChoice(lines, selection);
  if (goldInstead) return { ...gear, gold: selection.rolledAmounts[goldInstead.key] ?? 0 };
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
        case "itemChoice": {
          const quantity = grant.quantity ?? 1;
          if (selection.picks[key] === CUSTOM_PICK) {
            const customName = (selection.customNames[key] ?? "").trim();
            if (customName) gear.items.push({ name: customName, quantity, description: "" });
            return;
          }
          const name = resolvedItemChoiceName(grant, key, selection);
          if (name) gear.items.push({ name, quantity, description: "" });
          return;
        }
        case "gold":
          gear.gold += grant.amount;
          return;
        case "goldRoll":
          gear.gold += selection.rolledAmounts[key] ?? 0;
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
 * Starting Armor Class from the chosen armor -- the onboarding-time case of
 * `computeEquippedArmorClass` (characterCalculations.ts), before any
 * enchantment or feat bonus exists yet.
 */
export function computeArmorClass(
  dexterityScore: number,
  armor: Pick<ArmorDefinition, "category" | "baseArmorClass" | "dexModifier">[]
): number {
  return computeEquippedArmorClass(dexterityScore, armor);
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
        case "itemChoice": {
          if (selection.picks[key] === CUSTOM_PICK) {
            return `${qty}${(selection.customNames[key] ?? "").trim() || "Custom item"}`;
          }
          return `${qty}${resolvedItemChoiceName(grant, key, selection) ?? "Item"}`;
        }
        case "gold":
          return `${grant.amount} gp`;
        case "goldRoll":
          return `${selection.rolledAmounts[key] ?? 0} gp`;
      }
    })
    .join(", ");
}
