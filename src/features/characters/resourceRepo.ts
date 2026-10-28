import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterClasses, characterResourceUses } from "../../db/schema";
import type { ClassResourceDefinition } from "../../data/rulesets/types";
import type { Character } from "../../types/models";
import {
  abilityModifier,
  findSubclass,
  getClassDefinitionForCharacter,
  getClassProgression,
  getRaceDefinitionForCharacter,
} from "./characterCalculations";

export type CharacterResource = {
  definition: ClassResourceDefinition;
  max: number;
  remaining: number;
};

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
export async function listCharacterResources(character: Character): Promise<CharacterResource[]> {
  const entries: { definition: ClassResourceDefinition; max: number }[] = [];
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
  if (entries.length === 0) return [];

  const rows = await db
    .select()
    .from(characterResourceUses)
    .where(eq(characterResourceUses.characterId, character.id));
  const remainingByResource = new Map(rows.map((row) => [row.resourceId, row.usesRemaining]));

  return entries.map(({ definition, max }) => ({
    definition,
    max,
    remaining: remainingByResource.get(definition.id) ?? max,
  }));
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

/** Restores every class resource to its max -- a long rest, which always fully recharges everything regardless of each resource's `shortRestRegain`. */
export async function restoreAllResources(character: Character): Promise<void> {
  const resources = await listCharacterResources(character);
  for (const resource of resources) {
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
