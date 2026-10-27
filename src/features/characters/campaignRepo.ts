import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { campaignItems, campaignNotes } from "../../db/schema";
import type { CampaignItemIconId } from "../icons/iconAssets";

/** Most recent first -- this is a journal history, not a single evolving blob. */
export async function listCampaignNotes(characterId: number) {
  return db
    .select()
    .from(campaignNotes)
    .where(eq(campaignNotes.characterId, characterId))
    .orderBy(desc(campaignNotes.createdAt));
}

export async function addCampaignNote(
  characterId: number,
  input: { subject: string; body: string }
) {
  await db.insert(campaignNotes).values({
    characterId,
    subject: input.subject,
    body: input.body,
  });
}

export async function updateCampaignNote(
  noteId: number,
  input: { subject: string; body: string }
) {
  await db
    .update(campaignNotes)
    .set({ subject: input.subject, body: input.body, updatedAt: new Date().toISOString() })
    .where(eq(campaignNotes.id, noteId));
}

export async function removeCampaignNote(noteId: number) {
  await db.delete(campaignNotes).where(eq(campaignNotes.id, noteId));
}

export async function listCampaignItems(characterId: number) {
  return db
    .select()
    .from(campaignItems)
    .where(eq(campaignItems.characterId, characterId))
    .orderBy(campaignItems.createdAt);
}

export async function addCampaignItem(
  characterId: number,
  input: { name: string; icon: CampaignItemIconId; description?: string }
) {
  await db.insert(campaignItems).values({
    characterId,
    name: input.name,
    icon: input.icon,
    description: input.description ?? "",
  });
}

export async function removeCampaignItem(campaignItemId: number) {
  await db.delete(campaignItems).where(eq(campaignItems.id, campaignItemId));
}
