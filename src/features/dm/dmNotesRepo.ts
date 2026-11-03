import { desc, eq } from "drizzle-orm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/client";
import { dmNotes, dmTimelineEvents } from "../../db/schema";

// --- Session notes journal ---------------------------------------------
// Most recent first, same spirit as a character's campaignNotes -- a log of
// entries you add to over the course of a campaign, not one evolving blob.

export async function listDmNotes() {
  return db.select().from(dmNotes).orderBy(desc(dmNotes.createdAt));
}

export type DmNoteInput = { subject: string; body: string };

export async function addDmNote(input: DmNoteInput): Promise<void> {
  await db.insert(dmNotes).values({ subject: input.subject, body: input.body });
}

export async function updateDmNote(id: number, input: DmNoteInput): Promise<void> {
  await db
    .update(dmNotes)
    .set({ subject: input.subject, body: input.body, updatedAt: new Date().toISOString() })
    .where(eq(dmNotes.id, id));
}

export async function removeDmNote(id: number): Promise<void> {
  await db.delete(dmNotes).where(eq(dmNotes.id, id));
}

const LEGACY_NOTES_KEY = "rollforcharacter.dm.sessionNotes";

/**
 * One-time move of the old single freeform-textbox session note into the
 * new notes list, so no DM loses what they'd already written when this
 * screen switched from one AsyncStorage blob to a list of entries. Removes
 * the legacy key afterward so it can never be imported twice.
 */
export async function migrateLegacySessionNotesIfNeeded(): Promise<void> {
  const stored = await AsyncStorage.getItem(LEGACY_NOTES_KEY);
  if (!stored || !stored.trim()) return;
  await addDmNote({ subject: "Session notes (imported)", body: stored.trim() });
  await AsyncStorage.removeItem(LEGACY_NOTES_KEY);
}

// --- Campaign timeline ---------------------------------------------------
// Ordered by `sortOrder`, which a new event defaults to one past the
// current max -- so the timeline reads in the order events were logged
// unless the DM edits an entry's date/order later.

export async function listDmTimelineEvents() {
  return db
    .select()
    .from(dmTimelineEvents)
    .orderBy(dmTimelineEvents.sortOrder, dmTimelineEvents.id);
}

export type DmTimelineEventInput = { title: string; eventDate: string; body: string };

export async function addDmTimelineEvent(input: DmTimelineEventInput): Promise<void> {
  const rows = await db.select().from(dmTimelineEvents);
  const nextOrder = rows.reduce((max, r) => Math.max(max, r.sortOrder), 0) + 1;
  await db.insert(dmTimelineEvents).values({ ...input, sortOrder: nextOrder });
}

export async function updateDmTimelineEvent(
  id: number,
  input: DmTimelineEventInput
): Promise<void> {
  await db.update(dmTimelineEvents).set(input).where(eq(dmTimelineEvents.id, id));
}

export async function removeDmTimelineEvent(id: number): Promise<void> {
  await db.delete(dmTimelineEvents).where(eq(dmTimelineEvents.id, id));
}
