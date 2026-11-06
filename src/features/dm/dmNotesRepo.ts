import { and, desc, eq } from "drizzle-orm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/client";
import { dmNotes, dmTimelineEvents } from "../../db/schema";

// --- Campaigns -------------------------------------------------------------
// A campaign is just a name that notes and timeline events are tagged with.
// The list of names (so a brand-new campaign with no notes yet still exists)
// and which one is selected live in AsyncStorage; rows from before campaigns
// existed (campaign = '') are adopted into the first campaign on load.

const CAMPAIGNS_KEY = "rollforcharacter.dm.campaigns";
export const DEFAULT_CAMPAIGN_NAME = "My Campaign";

export type DmCampaigns = { names: string[]; active: string };

async function saveCampaigns(state: DmCampaigns): Promise<DmCampaigns> {
  await AsyncStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(state));
  return state;
}

/** False until the DM has gone through (or skipped) the first-run campaign setup. */
export async function isDmOnboarded(): Promise<boolean> {
  return (await AsyncStorage.getItem(CAMPAIGNS_KEY)) !== null;
}

/** Finishes onboarding: names the first campaign (or keeps the default if blank). */
export async function completeDmOnboarding(firstCampaignName: string): Promise<DmCampaigns> {
  const state = await loadDmCampaigns(); // saves the default campaign
  return renameDmCampaign(state.names[0], firstCampaignName);
}

export async function loadDmCampaigns(): Promise<DmCampaigns> {
  let state: DmCampaigns | null = null;
  try {
    const raw = await AsyncStorage.getItem(CAMPAIGNS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.names) && parsed.names.length > 0) {
      state = { names: parsed.names.map(String), active: String(parsed.active ?? "") };
    }
  } catch {
    state = null;
  }
  if (!state) state = { names: [DEFAULT_CAMPAIGN_NAME], active: DEFAULT_CAMPAIGN_NAME };
  if (!state.names.includes(state.active)) state.active = state.names[0];

  // Adopt pre-campaign rows into the first campaign.
  await db.update(dmNotes).set({ campaign: state.names[0] }).where(eq(dmNotes.campaign, ""));
  await db
    .update(dmTimelineEvents)
    .set({ campaign: state.names[0] })
    .where(eq(dmTimelineEvents.campaign, ""));
  return saveCampaigns(state);
}

export async function createDmCampaign(name: string): Promise<DmCampaigns> {
  const trimmed = name.trim();
  const state = await loadDmCampaigns();
  if (!trimmed) return state;
  const existing = state.names.find((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (existing) return saveCampaigns({ ...state, active: existing });
  return saveCampaigns({ names: [...state.names, trimmed], active: trimmed });
}

export async function setActiveDmCampaign(name: string): Promise<DmCampaigns> {
  const state = await loadDmCampaigns();
  if (!state.names.includes(name)) return state;
  return saveCampaigns({ ...state, active: name });
}

export async function renameDmCampaign(oldName: string, newName: string): Promise<DmCampaigns> {
  const trimmed = newName.trim();
  const state = await loadDmCampaigns();
  if (!trimmed || trimmed === oldName || !state.names.includes(oldName)) return state;
  if (state.names.some((n) => n.toLowerCase() === trimmed.toLowerCase() && n !== oldName)) {
    return state; // would collide with another campaign
  }
  await db.update(dmNotes).set({ campaign: trimmed }).where(eq(dmNotes.campaign, oldName));
  await db
    .update(dmTimelineEvents)
    .set({ campaign: trimmed })
    .where(eq(dmTimelineEvents.campaign, oldName));
  return saveCampaigns({
    names: state.names.map((n) => (n === oldName ? trimmed : n)),
    active: state.active === oldName ? trimmed : state.active,
  });
}

/** Deletes a campaign AND its notes/timeline. Refuses to delete the last one. */
export async function deleteDmCampaign(name: string): Promise<DmCampaigns> {
  const state = await loadDmCampaigns();
  if (state.names.length <= 1 || !state.names.includes(name)) return state;
  await db.delete(dmNotes).where(eq(dmNotes.campaign, name));
  await db.delete(dmTimelineEvents).where(eq(dmTimelineEvents.campaign, name));
  const names = state.names.filter((n) => n !== name);
  return saveCampaigns({ names, active: state.active === name ? names[0] : state.active });
}

// --- Session notes journal ---------------------------------------------
// Most recent first, same spirit as a character's campaignNotes -- a log of
// entries you add to over the course of a campaign, not one evolving blob.

/** Notes for one campaign, or every note when no campaign is given. */
export async function listDmNotes(campaign?: string) {
  const query = db.select().from(dmNotes);
  return (campaign === undefined ? query : query.where(eq(dmNotes.campaign, campaign))).orderBy(
    desc(dmNotes.createdAt)
  );
}

export type DmNoteInput = { subject: string; body: string };

export async function addDmNote(input: DmNoteInput, campaign = ""): Promise<void> {
  await db.insert(dmNotes).values({ campaign, subject: input.subject, body: input.body });
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
export async function migrateLegacySessionNotesIfNeeded(campaign = ""): Promise<void> {
  const stored = await AsyncStorage.getItem(LEGACY_NOTES_KEY);
  if (!stored || !stored.trim()) return;
  await addDmNote({ subject: "Session notes (imported)", body: stored.trim() }, campaign);
  await AsyncStorage.removeItem(LEGACY_NOTES_KEY);
}

// --- Campaign timeline ---------------------------------------------------
// Ordered by `sortOrder`, which a new event defaults to one past the
// current max -- so the timeline reads in the order events were logged
// unless the DM edits an entry's date/order later.

export async function listDmTimelineEvents(campaign?: string) {
  const query = db.select().from(dmTimelineEvents);
  return (campaign === undefined ? query : query.where(eq(dmTimelineEvents.campaign, campaign)))
    .orderBy(dmTimelineEvents.sortOrder, dmTimelineEvents.id);
}

export type DmTimelineEventInput = { title: string; eventDate: string; body: string };

export async function addDmTimelineEvent(
  input: DmTimelineEventInput,
  campaign = ""
): Promise<void> {
  const rows = await db
    .select()
    .from(dmTimelineEvents)
    .where(and(eq(dmTimelineEvents.campaign, campaign)));
  const nextOrder = rows.reduce((max, r) => Math.max(max, r.sortOrder), 0) + 1;
  await db.insert(dmTimelineEvents).values({ ...input, campaign, sortOrder: nextOrder });
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
