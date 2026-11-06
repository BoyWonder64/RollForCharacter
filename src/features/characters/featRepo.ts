import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterFeats, characters, feats } from "../../db/schema";
import {
  parseFeatEffects,
  serializeFeatEffects,
  type CharacterFeat,
  type FeatEffect,
  type ResolvedFeatPick,
} from "./characterCalculations";
import type { AbilityScoreKey, Character } from "../../types/models";
import { touchCharacterUpdatedAt } from "./syncClock";
import { recomputeArmorClass } from "./armorClassRepo";

// Writes the ability score columns directly (not via characterRepo's
// `updateCharacter`) to avoid a circular import -- characterRepo.ts itself
// calls `addResolvedFeat` for the Level Up ASI/feat step, same reasoning
// `resourceRepo.ts` documents for querying `characterClasses` directly
// instead of going through characterClassRepo.

/** Browsable feats catalog (SRD 2024, Wizards of the Coast). */
export async function listFeatCatalog(search?: string) {
  const rows = await db.select().from(feats).orderBy(feats.name);
  if (!search) return rows;
  const needle = search.toLowerCase();
  return rows.filter((f) => f.name.toLowerCase().includes(needle));
}

/** Every feat a character has taken, catalog or homebrew. */
export async function listCharacterFeats(character: Pick<Character, "id">): Promise<CharacterFeat[]> {
  const rows = await db.select().from(characterFeats).where(eq(characterFeats.characterId, character.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    prerequisite: row.prerequisite,
    description: row.description,
    sourceName: row.sourceName,
    enabled: row.enabled,
    effects: parseFeatEffects(row.effects),
  }));
}

/**
 * Any `abilityScoreIncrease` effects in `effects` are applied immediately,
 * once, directly to the character's ability score column (clamped at each
 * effect's own `max`) -- see `FeatEffect`'s doc comment for why this is a
 * one-time mutation rather than a standing bonus `aggregateFeatEffects`
 * would apply on every render.
 */
async function applyAbilityScoreIncreases(character: Character, effects: FeatEffect[]): Promise<void> {
  const updates: Partial<Record<AbilityScoreKey, number>> = {};
  let current = character;
  for (const effect of effects) {
    if (effect.kind !== "abilityScoreIncrease") continue;
    const base = updates[effect.ability] ?? current[effect.ability];
    updates[effect.ability] = Math.min(effect.max, base + effect.amount);
  }
  if (Object.keys(updates).length > 0) {
    await db
      .update(characters)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(characters.id, character.id));
  }
}

/**
 * Writes a fully-resolved feat pick as a new `character_feats` row --
 * shared by the sheet's own "+ Add Feat" flow (`addCatalogFeat`/
 * `addCustomFeat` below) and the Level Up ASI/feat step, which already has
 * the same resolved shape by the time it calls this.
 */
export async function addResolvedFeat(character: Character, feat: ResolvedFeatPick): Promise<void> {
  await applyAbilityScoreIncreases(character, feat.effects);
  await db.insert(characterFeats).values({
    characterId: character.id,
    catalogFeatId: feat.catalogFeatId ?? null,
    name: feat.name,
    prerequisite: feat.prerequisite,
    description: feat.description,
    sourceName: feat.sourceName,
    enabled: true,
    effects: serializeFeatEffects(feat.effects),
  });
  await touchCharacterUpdatedAt(character.id);
  if (feat.effects.some((e) => e.kind === "armorClassBonus")) await recomputeArmorClass(character.id);
}

/** Adds a feat picked from the catalog, with its player choices already resolved into `effects`. */
export async function addCatalogFeat(
  character: Character,
  catalogFeat: { id: number; name: string; prerequisite: string; description: string; sourceName: string },
  effects: FeatEffect[]
): Promise<void> {
  await addResolvedFeat(character, { ...catalogFeat, catalogFeatId: catalogFeat.id, effects });
}

/** Adds a freely-typed homebrew feat -- optionally with its own mechanical effects, same as a catalog pick. */
export async function addCustomFeat(
  character: Character,
  entry: { name: string; prerequisite?: string; description?: string; effects?: FeatEffect[] }
): Promise<void> {
  await addResolvedFeat(character, {
    name: entry.name,
    prerequisite: entry.prerequisite ?? "",
    description: entry.description ?? "",
    sourceName: "",
    effects: entry.effects ?? [],
  });
}

function hasArmorClassBonus(effectsJson: string): boolean {
  return parseFeatEffects(effectsJson).some((e) => e.kind === "armorClassBonus");
}

export async function setFeatEnabled(characterFeatId: number, enabled: boolean): Promise<void> {
  const [row] = await db.select().from(characterFeats).where(eq(characterFeats.id, characterFeatId));
  await db.update(characterFeats).set({ enabled }).where(eq(characterFeats.id, characterFeatId));
  if (row) {
    await touchCharacterUpdatedAt(row.characterId);
    if (hasArmorClassBonus(row.effects)) await recomputeArmorClass(row.characterId);
  }
}

export async function removeCharacterFeat(characterFeatId: number): Promise<void> {
  const [row] = await db.select().from(characterFeats).where(eq(characterFeats.id, characterFeatId));
  await db.delete(characterFeats).where(eq(characterFeats.id, characterFeatId));
  if (row) {
    await touchCharacterUpdatedAt(row.characterId);
    if (hasArmorClassBonus(row.effects)) await recomputeArmorClass(row.characterId);
  }
}

// --- Shared homebrew library -----------------------------------------------
// A homebrew feat is just a `feats` row tagged `sourceKey: "homebrew"` --
// the catalog table is already global, so `listFeatCatalog` already returns
// these, and `addCatalogFeat` already works unchanged via `catalogFeatId`.
// The guard on update/delete keeps seeded SRD rows from ever being edited.

export type HomebrewFeatInput = {
  name: string;
  prerequisite?: string;
  description?: string;
};

export async function createHomebrewFeat(input: HomebrewFeatInput): Promise<number> {
  const [row] = await db
    .insert(feats)
    .values({
      name: input.name,
      prerequisite: input.prerequisite ?? "",
      description: input.description ?? "",
      sourceKey: "homebrew",
      sourceName: "Homebrew",
    })
    .returning();
  return row.id;
}

export async function updateHomebrewFeat(id: number, input: HomebrewFeatInput): Promise<void> {
  const [row] = await db.select().from(feats).where(eq(feats.id, id));
  if (!row || row.sourceKey !== "homebrew") return;
  await db
    .update(feats)
    .set({
      name: input.name,
      prerequisite: input.prerequisite ?? "",
      description: input.description ?? "",
    })
    .where(eq(feats.id, id));
}

export async function deleteHomebrewFeat(id: number): Promise<void> {
  const [row] = await db.select().from(feats).where(eq(feats.id, id));
  if (!row || row.sourceKey !== "homebrew") return;
  await db.delete(feats).where(eq(feats.id, id));
}
