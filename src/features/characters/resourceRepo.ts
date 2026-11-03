import { and, asc, eq, type InferSelectModel } from "drizzle-orm";
import { db } from "../../db/client";
import {
  characterClasses,
  characterCustomResources,
  characterResourceOverrides,
  characterResourceUses,
  homebrewResources,
} from "../../db/schema";
import type { ClassResourceDefinition } from "../../data/rulesets/types";
import type { AbilityScoreKey, Character, CharacterCustomResource } from "../../types/models";
import { rollExpression, type RollResult } from "../dice/diceEngine";
import { saveRoll } from "../dice/diceRepo";
import { isValidRollFormula, resolveRollFormula } from "../dice/rollFormula";
import {
  abilityModifier,
  findSubclass,
  getClassDefinitionForCharacter,
  getClassProgression,
  getRaceDefinitionForCharacter,
} from "./characterCalculations";
import { touchCharacterUpdatedAt } from "./syncClock";

export type CharacterResource = {
  definition: ClassResourceDefinition;
  max: number;
  remaining: number;
  /** Set only for player-created resources: the `character_custom_resources` row id, used to edit/delete it. */
  customId?: number;
  description?: string;
  /** Player-made only: CampaignItemIconId, or "" for none. */
  icon?: string;
  /** Player-made only: dice formula rolled with a use, e.g. "1d10 + level". Empty/undefined = no roll. */
  rollFormula?: string;
  /** Built-in only: true when the player hid it via a house rule. Only listed with `includeHidden`. */
  hidden?: boolean;
  /** Built-in only: the ruleset's max, before any override. */
  defaultMax?: number;
  /** Built-in only: the player's overriding max, if set. */
  overrideMax?: number;
};

type CharacterResourceOverride = InferSelectModel<typeof characterResourceOverrides>;

export type CustomResourceMaxMode = "fixed" | "level" | "ability";
export type CustomResourceRecharge = "short" | "long" | "manual";

/** Everything the create/edit form collects for a player-made resource. */
export type CustomResourceInput = {
  name: string;
  description: string;
  maxMode: CustomResourceMaxMode;
  fixedMax: number;
  /** Level -> total uses from that level on, e.g. `{ 1: 2, 5: 3 }`. Used when `maxMode` is "level". */
  usesByLevel: Record<number, number>;
  ability: AbilityScoreKey;
  abilityBonus: number;
  abilityMinimum: number;
  rechargeOn: CustomResourceRecharge;
  isPointPool: boolean;
  /** CampaignItemIconId, or "" for none. */
  icon: string;
  /** Dice formula (see rollFormula.ts), or "" for no roll. */
  rollFormula: string;
};

const CUSTOM_RESOURCE_PREFIX = "custom-";

export function customResourceId(rowId: number): string {
  return `${CUSTOM_RESOURCE_PREFIX}${rowId}`;
}

/** Parses "1:2, 5:3" (level:uses pairs) into breakpoints. Malformed or non-positive pairs are skipped. */
export function parseLevelBreakpoints(text: string): Record<number, number> {
  const result: Record<number, number> = {};
  for (const part of text.split(/[,\n;]/)) {
    const match = part.trim().match(/^(\d+)\s*[:=]\s*(\d+)$/);
    if (!match) continue;
    const level = Number(match[1]);
    const uses = Number(match[2]);
    if (level >= 1 && uses >= 0) result[level] = uses;
  }
  return result;
}

export function formatLevelBreakpoints(breakpoints: Record<number, number>): string {
  return Object.entries(breakpoints)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([level, uses]) => `${level}:${uses}`)
    .join(", ");
}

function parseStoredBreakpoints(json: string): Record<number, number> {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<number, number> = {};
    for (const [level, uses] of Object.entries(parsed)) {
      if (typeof uses === "number" && Number(level) >= 1) result[Number(level)] = uses;
    }
    return result;
  } catch {
    return {};
  }
}

/** A stored row back into the form's shape, for editing. */
export function customRowToInput(row: CharacterCustomResource): CustomResourceInput {
  return {
    name: row.name,
    description: row.description,
    maxMode: row.maxMode as CustomResourceMaxMode,
    fixedMax: row.fixedMax,
    usesByLevel: parseStoredBreakpoints(row.usesByLevel),
    ability: row.ability as AbilityScoreKey,
    abilityBonus: row.abilityBonus,
    abilityMinimum: row.abilityMinimum,
    rechargeOn: row.rechargeOn as CustomResourceRecharge,
    isPointPool: row.isPointPool,
    icon: row.icon,
    rollFormula: row.rollFormula,
  };
}

/** Turns a stored custom row into the same shape catalog resources use, so max/spend/rest logic needs no special cases. */
export function customRowToDefinition(row: CharacterCustomResource): ClassResourceDefinition {
  const definition: ClassResourceDefinition = {
    id: customResourceId(row.id),
    name: row.name,
    isPointPool: row.isPointPool || undefined,
  };
  if (row.maxMode === "ability") {
    definition.usesFromAbilityModifier = {
      ability: row.ability as AbilityScoreKey,
      grantedAtLevel: 1,
      minimum: row.abilityMinimum,
      bonus: row.abilityBonus || undefined,
    };
  } else if (row.maxMode === "level") {
    definition.usesByLevel = parseStoredBreakpoints(row.usesByLevel);
  } else {
    definition.usesByLevel = { 1: row.fixedMax };
  }
  if (row.rechargeOn === "short") definition.shortRestRegain = "all";
  if (row.rechargeOn === "manual") definition.manualRecharge = true;
  return definition;
}

/** The class/level/subclass triples to check for resources -- real `characterClasses` rows if the character has multiclassed, otherwise the single primary class/level/subclass stored directly on `characters`. Queried directly (not via characterClassRepo) to avoid a circular import with characterRepo.ts. */
async function effectiveClassLevels(
  character: Character
): Promise<{ classId: string; level: number; subclass: string }[]> {
  const rows = await db
    .select()
    .from(characterClasses)
    .where(eq(characterClasses.characterId, character.id));
  if (rows.length > 0) {
    return rows.map((row) => ({ classId: row.classId, level: row.level, subclass: row.subclass }));
  }
  return [
    {
      classId: getClassDefinitionForCharacter(character).id,
      level: character.level,
      subclass: character.subclass,
    },
  ];
}

/**
 * A resource's max uses at `level` -- either the highest `usesByLevel`
 * breakpoint at or below it, or (for resources like Bardic Inspiration)
 * the relevant ability modifier once `usesFromAbilityModifier.grantedAtLevel`
 * is reached. Returns 0 if the feature isn't gained yet at that level.
 */
function maxUses(definition: ClassResourceDefinition, level: number, character: Character): number {
  if (definition.usesFromAbilityModifier) {
    const { ability, grantedAtLevel, minimum, bonus, multiplyByLevel } = definition.usesFromAbilityModifier;
    if (level < grantedAtLevel) return 0;
    const perLevel = Math.max(minimum, (bonus ?? 0) + abilityModifier(character[ability]));
    return multiplyByLevel ? level * perLevel : perLevel;
  }
  let max = 0;
  for (const [breakpoint, uses] of Object.entries(definition.usesByLevel ?? {})) {
    if (Number(breakpoint) <= level) max = Math.max(max, uses);
  }
  return max;
}

/**
 * Every limited-use class resource (Action Surge, Second Wind, Indomitable,
 * ...) this character has gained so far, across every class they have
 * levels in, merged with however many uses they've already spent. A
 * resource not yet granted at the character's current class level is
 * omitted entirely.
 */
export async function listCharacterResources(
  character: Character,
  options: { includeHidden?: boolean } = {}
): Promise<CharacterResource[]> {
  const entries: {
    definition: ClassResourceDefinition;
    max: number;
    customId?: number;
    description?: string;
    icon?: string;
    rollFormula?: string;
  }[] = [];
  for (const { classId, level, subclass } of await effectiveClassLevels(character)) {
    const progression = getClassProgression(character.ruleset, classId);
    for (const definition of progression?.resources ?? []) {
      const max = maxUses(definition, level, character);
      if (max > 0) entries.push({ definition, max });
    }
    const chosenSubclass = progression && subclass ? findSubclass(progression, subclass) : undefined;
    for (const definition of chosenSubclass?.resources ?? []) {
      const max = maxUses(definition, level, character);
      if (max > 0) entries.push({ definition, max });
    }
  }
  const race = getRaceDefinitionForCharacter(character);
  for (const definition of race.resources ?? []) {
    const max = maxUses(definition, character.level, character);
    if (max > 0) entries.push({ definition, max });
  }
  for (const row of await listCustomResourceRows(character.id)) {
    const definition = customRowToDefinition(row);
    // A custom resource is never "not yet gained" -- if its breakpoints give 0 uses at this level it simply isn't shown, same as catalog ones.
    const max = maxUses(definition, character.level, character);
    if (max > 0) {
      entries.push({
        definition,
        max,
        customId: row.id,
        description: row.description,
        icon: row.icon,
        rollFormula: row.rollFormula,
      });
    }
  }
  if (entries.length === 0) return [];

  const rows = await db
    .select()
    .from(characterResourceUses)
    .where(eq(characterResourceUses.characterId, character.id));
  const remainingByResource = new Map(rows.map((row) => [row.resourceId, row.usesRemaining]));
  const overrides = await listResourceOverrides(character.id);

  const result: CharacterResource[] = [];
  for (const { definition, max: catalogMax, customId, description, icon, rollFormula } of entries) {
    // House rules apply to built-in resources only; a custom one is edited directly.
    const override = customId === undefined ? overrides.get(definition.id) : undefined;
    const hidden = override?.hidden ?? false;
    if (hidden && !options.includeHidden) continue;
    const max = override?.maxOverride != null ? override.maxOverride : catalogMax;
    result.push({
      definition,
      max,
      // Clamped: lowering a resource's max (or a level change) can leave a stored count above it.
      remaining: Math.min(max, remainingByResource.get(definition.id) ?? max),
      customId,
      description,
      icon,
      rollFormula,
      hidden,
      defaultMax: customId === undefined ? catalogMax : undefined,
      overrideMax: override?.maxOverride ?? undefined,
    });
  }
  return result;
}

async function listResourceOverrides(characterId: number): Promise<Map<string, CharacterResourceOverride>> {
  const rows = await db
    .select()
    .from(characterResourceOverrides)
    .where(eq(characterResourceOverrides.characterId, characterId));
  return new Map(rows.map((row) => [row.resourceId, row]));
}

/**
 * Sets a per-character house rule on a built-in resource: a different max
 * (`maxOverride`, at least 1, or null for the ruleset's) and/or hiding it.
 * Passing the defaults (not hidden, null max) removes the override.
 */
export async function setResourceOverride(
  characterId: number,
  resourceId: string,
  change: { hidden: boolean; maxOverride: number | null }
): Promise<void> {
  const maxOverride = change.maxOverride === null ? null : Math.max(1, Math.floor(change.maxOverride));
  const where = and(
    eq(characterResourceOverrides.characterId, characterId),
    eq(characterResourceOverrides.resourceId, resourceId)
  );
  const existing = await db.select().from(characterResourceOverrides).where(where);
  if (!change.hidden && maxOverride === null) {
    if (existing.length > 0) await db.delete(characterResourceOverrides).where(where);
    await touchCharacterUpdatedAt(characterId);
    return;
  }
  if (existing.length > 0) {
    await db.update(characterResourceOverrides).set({ hidden: change.hidden, maxOverride }).where(where);
  } else {
    await db
      .insert(characterResourceOverrides)
      .values({ characterId, resourceId, hidden: change.hidden, maxOverride });
  }
  await touchCharacterUpdatedAt(characterId);
}

/**
 * The house-rules popup's "Reset" button: clears any max-uses/hidden
 * override on a built-in resource AND refills its remaining uses to the
 * (now default) max -- clearing the override alone leaves a spent resource
 * looking untouched, which reads as the button doing nothing.
 */
export async function resetResource(character: Character, resourceId: string): Promise<void> {
  await setResourceOverride(character.id, resourceId, { hidden: false, maxOverride: null });
  const resource = (await listCharacterResources(character, { includeHidden: true })).find(
    (r) => r.definition.id === resourceId
  );
  if (resource) await setRemaining(character.id, resourceId, resource.max);
}

/**
 * Rolls a resource's attached formula (e.g. Second Wind's "1d10 + level")
 * against the character and records it in roll history. Does NOT spend a use
 * -- callers pair it with `spendResourceUse`. Returns undefined if the
 * resource has no roll.
 */
export async function rollResource(character: Character, resource: CharacterResource): Promise<RollResult | undefined> {
  if (!resource.rollFormula) return undefined;
  const resolved = resolveRollFormula(resource.rollFormula, character);
  const roll = rollExpression(resolved);
  const labelled = { ...roll, expression: `${resource.definition.name}: ${resolved}` };
  await saveRoll(labelled, character.id);
  return labelled;
}

async function listCustomResourceRows(characterId: number): Promise<CharacterCustomResource[]> {
  return db
    .select()
    .from(characterCustomResources)
    .where(eq(characterCustomResources.characterId, characterId))
    .orderBy(asc(characterCustomResources.sortOrder), asc(characterCustomResources.id));
}

/** Every player-created resource row for a character, including ones whose max is currently 0 (hidden from the tracker) so they can still be edited. */
export async function listCustomResources(characterId: number): Promise<CharacterCustomResource[]> {
  return listCustomResourceRows(characterId);
}

function rowValues(input: CustomResourceInput) {
  const rollFormula = input.rollFormula.trim();
  if (rollFormula && !isValidRollFormula(rollFormula)) {
    throw new Error(`"${rollFormula}" is not a valid roll formula.`);
  }
  return {
    icon: input.icon,
    rollFormula,
    name: input.name.trim(),
    description: input.description.trim(),
    maxMode: input.maxMode,
    fixedMax: Math.max(0, Math.floor(input.fixedMax)),
    usesByLevel: JSON.stringify(input.usesByLevel),
    ability: input.ability,
    abilityBonus: Math.floor(input.abilityBonus),
    abilityMinimum: Math.max(0, Math.floor(input.abilityMinimum)),
    rechargeOn: input.rechargeOn,
    isPointPool: input.isPointPool,
  };
}

/** Creates a player-made ability/tracker. Throws if the name is blank. */
export async function addCustomResource(
  characterId: number,
  input: CustomResourceInput
): Promise<CharacterCustomResource> {
  if (!input.name.trim()) throw new Error("A custom resource needs a name.");
  const existing = await listCustomResourceRows(characterId);
  const sortOrder = existing.reduce((highest, row) => Math.max(highest, row.sortOrder), -1) + 1;
  const [row] = await db
    .insert(characterCustomResources)
    .values({ characterId, sortOrder, ...rowValues(input) })
    .returning();
  await touchCharacterUpdatedAt(characterId);
  return row;
}

/** Edits a player-made resource in place. Spent uses are kept (and clamped to the new max when listed). */
export async function updateCustomResource(id: number, input: CustomResourceInput): Promise<void> {
  if (!input.name.trim()) throw new Error("A custom resource needs a name.");
  const [row] = await db.select().from(characterCustomResources).where(eq(characterCustomResources.id, id));
  await db.update(characterCustomResources).set(rowValues(input)).where(eq(characterCustomResources.id, id));
  if (row) await touchCharacterUpdatedAt(row.characterId);
}

/** Deletes a player-made resource along with its spent-use record. */
export async function removeCustomResource(id: number): Promise<void> {
  const rows = await db.select().from(characterCustomResources).where(eq(characterCustomResources.id, id));
  if (rows.length === 0) return;
  await db
    .delete(characterResourceUses)
    .where(
      and(
        eq(characterResourceUses.characterId, rows[0].characterId),
        eq(characterResourceUses.resourceId, customResourceId(id))
      )
    );
  await db.delete(characterCustomResources).where(eq(characterCustomResources.id, id));
  await touchCharacterUpdatedAt(rows[0].characterId);
}

// --- Shared homebrew library -----------------------------------------------
// `character_custom_resources` is character-scoped only, so this is a new
// global table (same shape minus characterId/sortOrder, reusing `rowValues`).
// "Taking" one from the library clones its fields onto a fresh
// character_custom_resources row, same as addCustomResource, with
// `homebrewSourceId` left as a provenance backpointer.

export async function listHomebrewResources() {
  return db.select().from(homebrewResources).orderBy(asc(homebrewResources.name));
}

export async function createHomebrewResource(input: CustomResourceInput): Promise<number> {
  if (!input.name.trim()) throw new Error("A custom resource needs a name.");
  const [row] = await db.insert(homebrewResources).values(rowValues(input)).returning();
  return row.id;
}

export async function updateHomebrewResource(id: number, input: CustomResourceInput): Promise<void> {
  if (!input.name.trim()) throw new Error("A custom resource needs a name.");
  await db.update(homebrewResources).set(rowValues(input)).where(eq(homebrewResources.id, id));
}

export async function deleteHomebrewResource(id: number): Promise<void> {
  await db.delete(homebrewResources).where(eq(homebrewResources.id, id));
}

export async function addResourceFromHomebrew(
  characterId: number,
  homebrewId: number
): Promise<CharacterCustomResource> {
  const [definition] = await db.select().from(homebrewResources).where(eq(homebrewResources.id, homebrewId));
  if (!definition) throw new Error("That homebrew resource no longer exists.");
  const existing = await listCustomResourceRows(characterId);
  const sortOrder = existing.reduce((highest, row) => Math.max(highest, row.sortOrder), -1) + 1;
  const [row] = await db
    .insert(characterCustomResources)
    .values({
      characterId,
      sortOrder,
      homebrewSourceId: definition.id,
      name: definition.name,
      description: definition.description,
      maxMode: definition.maxMode,
      fixedMax: definition.fixedMax,
      usesByLevel: definition.usesByLevel,
      ability: definition.ability as AbilityScoreKey,
      abilityBonus: definition.abilityBonus,
      abilityMinimum: definition.abilityMinimum,
      rechargeOn: definition.rechargeOn,
      isPointPool: definition.isPointPool,
      icon: definition.icon,
      rollFormula: definition.rollFormula,
    })
    .returning();
  await touchCharacterUpdatedAt(characterId);
  return row;
}

async function setRemaining(characterId: number, resourceId: string, remaining: number): Promise<void> {
  const existing = await db
    .select()
    .from(characterResourceUses)
    .where(
      and(
        eq(characterResourceUses.characterId, characterId),
        eq(characterResourceUses.resourceId, resourceId)
      )
    );

  if (existing.length > 0) {
    await db
      .update(characterResourceUses)
      .set({ usesRemaining: remaining })
      .where(eq(characterResourceUses.id, existing[0].id));
  } else {
    await db.insert(characterResourceUses).values({ characterId, resourceId, usesRemaining: remaining });
  }
  await touchCharacterUpdatedAt(characterId);
}

/**
 * Spends `amount` uses of a resource (e.g. Action Surge, or several Sorcery
 * Points at once), clamped at 0. No-op if the resource isn't recognized at
 * the character's current level.
 *
 * Named `spendResourceUse` rather than `useResource` -- a `use...` name
 * reads as a React Hook to the linter (and to readers), which this isn't.
 */
export async function spendResourceUse(character: Character, resourceId: string, amount = 1): Promise<void> {
  const resources = await listCharacterResources(character);
  const resource = resources.find((r) => r.definition.id === resourceId);
  if (!resource || resource.remaining <= 0) return;
  await setRemaining(character.id, resourceId, Math.max(0, resource.remaining - amount));
}

/** Restores `amount` uses of a resource (e.g. undoing a misspend on a point pool), clamped at its max. No-op if the resource isn't recognized at the character's current level. */
export async function restoreResourceUse(character: Character, resourceId: string, amount = 1): Promise<void> {
  const resources = await listCharacterResources(character);
  const resource = resources.find((r) => r.definition.id === resourceId);
  if (!resource || resource.remaining >= resource.max) return;
  await setRemaining(character.id, resourceId, Math.min(resource.max, resource.remaining + amount));
}

/** Restores every class resource to its max -- a long rest, which fully recharges everything regardless of each resource's `shortRestRegain`, except player-made resources set to manual recharge. */
export async function restoreAllResources(character: Character): Promise<void> {
  const resources = await listCharacterResources(character);
  for (const resource of resources) {
    if (resource.definition.manualRecharge) continue;
    await setRemaining(character.id, resource.definition.id, resource.max);
  }
}

/** Applies a short rest's recharge rules: "all" resets to max, a number regains that many uses (capped at max), and a resource with no `shortRestRegain` is left untouched. */
export async function applyShortRestRecharge(character: Character): Promise<void> {
  const resources = await listCharacterResources(character);
  for (const resource of resources) {
    if (resource.definition.shortRestRegain === undefined) continue;
    const regain =
      resource.definition.shortRestRegain === "all" ? resource.max : resource.definition.shortRestRegain;
    const next = Math.min(resource.max, resource.remaining + regain);
    if (next !== resource.remaining) await setRemaining(character.id, resource.definition.id, next);
  }
}
