import { eq, type InferSelectModel } from "drizzle-orm";
import { db } from "../../db/client";
import { characters, homebrewClasses, homebrewRaces, homebrewSubclasses } from "../../db/schema";
import type { ClassTrait, RaceTrait } from "../../data/rulesets/types";
import type { AbilityScoreKey, Character } from "../../types/models";
import {
  parseCustomClassSavingThrows,
  parseCustomClassTraits,
  parseCustomProficiencyList,
  parseCustomRaceAbilityBonuses,
  parseCustomRaceTraits,
  serializeCustomClassSavingThrows,
  serializeCustomClassTraits,
  serializeCustomProficiencyList,
  serializeCustomRaceAbilityBonuses,
  serializeCustomRaceTraits,
} from "./characterCalculations";

// Shared homebrew library for races/classes/subclasses -- see the comment
// above `homebrewRaces` in src/db/schema.ts. Today's inline customRace*/
// customClass* overlay columns on `characters` (one per character, merged
// onto CUSTOM_RACE_FALLBACK/CUSTOM_CLASS_FALLBACK in characterCalculations.ts)
// are left completely untouched: picking a library entry just clones its
// fields onto those same columns, the same way picking a catalog weapon
// clones onto characterWeapons. `homebrewRaceId`/`homebrewClassId`/
// `homebrewSubclassId` on `characters` are provenance backpointers only --
// never read by the calculation functions -- so an edit to a library entry
// never retroactively changes a character that already took it.

export type HomebrewRaceInput = {
  name: string;
  abilityBonuses?: Partial<Record<AbilityScoreKey, number>>;
  size?: "Small" | "Medium";
  speed?: number;
  traits?: RaceTrait[];
};

export type HomebrewRaceRow = {
  id: number;
  ruleset: string;
  name: string;
  abilityBonuses: Partial<Record<AbilityScoreKey, number>>;
  size: string;
  speed: number;
  traits: RaceTrait[];
  createdAt: string;
};

function parseHomebrewRace(row: InferSelectModel<typeof homebrewRaces>): HomebrewRaceRow {
  return {
    ...row,
    abilityBonuses: parseCustomRaceAbilityBonuses(row.abilityBonuses),
    traits: parseCustomRaceTraits(row.traits),
  };
}

export async function listHomebrewRaces(ruleset?: string): Promise<HomebrewRaceRow[]> {
  const rows = await db.select().from(homebrewRaces).orderBy(homebrewRaces.name);
  return rows.filter((r) => !ruleset || r.ruleset === ruleset).map(parseHomebrewRace);
}

export async function createHomebrewRace(ruleset: string, input: HomebrewRaceInput): Promise<number> {
  const [row] = await db
    .insert(homebrewRaces)
    .values({
      ruleset,
      name: input.name,
      abilityBonuses: serializeCustomRaceAbilityBonuses(input.abilityBonuses ?? {}),
      size: input.size ?? "Medium",
      speed: input.speed ?? 30,
      traits: serializeCustomRaceTraits(input.traits ?? []),
    })
    .returning();
  return row.id;
}

export async function updateHomebrewRace(id: number, input: HomebrewRaceInput): Promise<void> {
  await db
    .update(homebrewRaces)
    .set({
      name: input.name,
      abilityBonuses: serializeCustomRaceAbilityBonuses(input.abilityBonuses ?? {}),
      size: input.size ?? "Medium",
      speed: input.speed ?? 30,
      traits: serializeCustomRaceTraits(input.traits ?? []),
    })
    .where(eq(homebrewRaces.id, id));
}

export async function deleteHomebrewRace(id: number): Promise<void> {
  await db.delete(homebrewRaces).where(eq(homebrewRaces.id, id));
}

/**
 * Picks a library race for a character: clones its fields onto the custom*
 * overlay columns (same CUSTOM_OPTION_ID merge path a one-off custom race
 * already uses), and sets `homebrewRaceId` as a provenance backpointer only.
 */
export async function setCharacterHomebrewRace(characterId: number, homebrewRaceId: number): Promise<void> {
  const [lib] = await db.select().from(homebrewRaces).where(eq(homebrewRaces.id, homebrewRaceId));
  if (!lib) return;
  await db
    .update(characters)
    .set({
      race: lib.name,
      homebrewRaceId: lib.id,
      customRaceAbilityBonuses: lib.abilityBonuses,
      customRaceSize: lib.size,
      customRaceSpeed: lib.speed,
      customRaceTraits: lib.traits,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(characters.id, characterId));
}

/**
 * Saves a character's existing one-off custom race as a reusable library
 * entry, so pre-library homebrew isn't orphaned. Does not change the
 * character or set its `homebrewRaceId` -- call `setCharacterHomebrewRace`
 * separately if the character should also point at the new entry.
 */
export async function promoteInlineCustomRaceToLibrary(
  character: Pick<
    Character,
    "ruleset" | "race" | "customRaceAbilityBonuses" | "customRaceSize" | "customRaceSpeed" | "customRaceTraits"
  >
): Promise<number> {
  return createHomebrewRace(character.ruleset, {
    name: character.race,
    abilityBonuses: parseCustomRaceAbilityBonuses(character.customRaceAbilityBonuses),
    size: character.customRaceSize === "Small" ? "Small" : "Medium",
    speed: character.customRaceSpeed,
    traits: parseCustomRaceTraits(character.customRaceTraits),
  });
}

export type HomebrewClassInput = {
  name: string;
  hitDie?: number;
  savingThrows?: AbilityScoreKey[];
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  traits?: ClassTrait[];
};

export type HomebrewClassRow = {
  id: number;
  ruleset: string;
  name: string;
  hitDie: number;
  savingThrows: AbilityScoreKey[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  traits: ClassTrait[];
  createdAt: string;
};

function parseHomebrewClass(row: InferSelectModel<typeof homebrewClasses>): HomebrewClassRow {
  return {
    ...row,
    savingThrows: parseCustomClassSavingThrows(row.savingThrows),
    armorProficiencies: parseCustomProficiencyList(row.armorProficiencies),
    weaponProficiencies: parseCustomProficiencyList(row.weaponProficiencies),
    traits: parseCustomClassTraits(row.traits),
  };
}

export async function listHomebrewClasses(ruleset?: string): Promise<HomebrewClassRow[]> {
  const rows = await db.select().from(homebrewClasses).orderBy(homebrewClasses.name);
  return rows.filter((r) => !ruleset || r.ruleset === ruleset).map(parseHomebrewClass);
}

export async function createHomebrewClass(ruleset: string, input: HomebrewClassInput): Promise<number> {
  const [row] = await db
    .insert(homebrewClasses)
    .values({
      ruleset,
      name: input.name,
      hitDie: input.hitDie ?? 8,
      savingThrows: serializeCustomClassSavingThrows(input.savingThrows ?? []),
      armorProficiencies: serializeCustomProficiencyList(input.armorProficiencies ?? []),
      weaponProficiencies: serializeCustomProficiencyList(input.weaponProficiencies ?? []),
      traits: serializeCustomClassTraits(input.traits ?? []),
    })
    .returning();
  return row.id;
}

export async function updateHomebrewClass(id: number, input: HomebrewClassInput): Promise<void> {
  await db
    .update(homebrewClasses)
    .set({
      name: input.name,
      hitDie: input.hitDie ?? 8,
      savingThrows: serializeCustomClassSavingThrows(input.savingThrows ?? []),
      armorProficiencies: serializeCustomProficiencyList(input.armorProficiencies ?? []),
      weaponProficiencies: serializeCustomProficiencyList(input.weaponProficiencies ?? []),
      traits: serializeCustomClassTraits(input.traits ?? []),
    })
    .where(eq(homebrewClasses.id, id));
}

export async function deleteHomebrewClass(id: number): Promise<void> {
  await db.delete(homebrewClasses).where(eq(homebrewClasses.id, id));
}

/** See `setCharacterHomebrewRace` -- same clone-and-backpointer pattern, for class. */
export async function setCharacterHomebrewClass(characterId: number, homebrewClassId: number): Promise<void> {
  const [lib] = await db.select().from(homebrewClasses).where(eq(homebrewClasses.id, homebrewClassId));
  if (!lib) return;
  await db
    .update(characters)
    .set({
      className: lib.name,
      homebrewClassId: lib.id,
      customClassHitDie: lib.hitDie,
      customClassSavingThrows: lib.savingThrows,
      customClassArmorProficiencies: lib.armorProficiencies,
      customClassWeaponProficiencies: lib.weaponProficiencies,
      customClassTraits: lib.traits,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(characters.id, characterId));
}

/** See `promoteInlineCustomRaceToLibrary` -- same reasoning, for class. */
export async function promoteInlineCustomClassToLibrary(
  character: Pick<
    Character,
    | "ruleset"
    | "className"
    | "customClassHitDie"
    | "customClassSavingThrows"
    | "customClassArmorProficiencies"
    | "customClassWeaponProficiencies"
    | "customClassTraits"
  >
): Promise<number> {
  return createHomebrewClass(character.ruleset, {
    name: character.className,
    hitDie: character.customClassHitDie,
    savingThrows: parseCustomClassSavingThrows(character.customClassSavingThrows),
    armorProficiencies: parseCustomProficiencyList(character.customClassArmorProficiencies),
    weaponProficiencies: parseCustomProficiencyList(character.customClassWeaponProficiencies),
    traits: parseCustomClassTraits(character.customClassTraits),
  });
}

// Subclasses are flavor-only for now (named traits shown on the sheet) --
// there's no existing per-character "custom subclass" overlay to mirror or
// promote from, since subclass has only ever been a free-text column. Full
// homebrew class progression (subclass-gated features/spell slots) is
// separate, later work -- see TODO.md.

export type HomebrewSubclassInput = {
  name: string;
  /** A built-in ClassDefinition id (e.g. "fighter") or a homebrewClasses id, same free-form-id spirit as catalogId elsewhere. */
  parentClassId: string;
  traits?: ClassTrait[];
};

export type HomebrewSubclassRow = {
  id: number;
  ruleset: string;
  name: string;
  parentClassId: string;
  traits: ClassTrait[];
  createdAt: string;
};

function parseHomebrewSubclass(row: InferSelectModel<typeof homebrewSubclasses>): HomebrewSubclassRow {
  return { ...row, traits: parseCustomClassTraits(row.traits) };
}

export async function listHomebrewSubclasses(filter?: {
  ruleset?: string;
  parentClassId?: string;
}): Promise<HomebrewSubclassRow[]> {
  const rows = await db.select().from(homebrewSubclasses).orderBy(homebrewSubclasses.name);
  return rows
    .filter((r) => !filter?.ruleset || r.ruleset === filter.ruleset)
    .filter((r) => !filter?.parentClassId || r.parentClassId === filter.parentClassId)
    .map(parseHomebrewSubclass);
}

export async function createHomebrewSubclass(
  ruleset: string,
  input: HomebrewSubclassInput
): Promise<number> {
  const [row] = await db
    .insert(homebrewSubclasses)
    .values({
      ruleset,
      name: input.name,
      parentClassId: input.parentClassId,
      traits: serializeCustomClassTraits(input.traits ?? []),
    })
    .returning();
  return row.id;
}

export async function updateHomebrewSubclass(id: number, input: HomebrewSubclassInput): Promise<void> {
  await db
    .update(homebrewSubclasses)
    .set({
      name: input.name,
      parentClassId: input.parentClassId,
      traits: serializeCustomClassTraits(input.traits ?? []),
    })
    .where(eq(homebrewSubclasses.id, id));
}

export async function deleteHomebrewSubclass(id: number): Promise<void> {
  await db.delete(homebrewSubclasses).where(eq(homebrewSubclasses.id, id));
}

/** Sets a character's subclass (free text, same as today) and records the library backpointer. */
export async function setCharacterHomebrewSubclass(
  characterId: number,
  homebrewSubclassId: number
): Promise<void> {
  const [lib] = await db.select().from(homebrewSubclasses).where(eq(homebrewSubclasses.id, homebrewSubclassId));
  if (!lib) return;
  await db
    .update(characters)
    .set({
      subclass: lib.name,
      homebrewSubclassId: lib.id,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(characters.id, characterId));
}
