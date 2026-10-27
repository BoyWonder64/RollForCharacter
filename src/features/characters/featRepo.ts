import { db } from "../../db/client";
import { feats } from "../../db/schema";
import { parseFeats, serializeFeats } from "./characterCalculations";
import { updateCharacter } from "./characterRepo";
import type { Character } from "../../types/models";

/** Browsable feats catalog (SRD 2024, Wizards of the Coast). */
export async function listFeatCatalog(search?: string) {
  const rows = await db.select().from(feats).orderBy(feats.name);
  if (!search) return rows;
  const needle = search.toLowerCase();
  return rows.filter((f) => f.name.toLowerCase().includes(needle));
}

/**
 * Appends a feat (catalog or freely typed) onto `character.feats`, the
 * existing newline-separated free-text field -- used by both the Level Up
 * ASI/feat step and anywhere else a feat gets added, so there's one shared
 * place doing the parse/serialize dance instead of each call site
 * duplicating it. Storage is intentionally unchanged: a catalog pick is just
 * a nicer way to produce the same free-text entry a typed-in feat already
 * produces.
 */
export async function addFeatToCharacter(
  character: Character,
  entry: { name: string; description?: string }
): Promise<void> {
  const text = entry.description ? `${entry.name} -- ${entry.description}` : entry.name;
  const updated = serializeFeats([...parseFeats(character), text]);
  await updateCharacter(character.id, { feats: updated });
}
