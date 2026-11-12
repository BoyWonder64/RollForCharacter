import { eq } from "drizzle-orm";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/client";
import { characters } from "../../db/schema";
import { deletePortrait, persistPortrait } from "../characters/portraitStorage";
import { isSupabaseConfigured, supabase } from "../supabase/supabaseClient";
import { applyCharacterDocument, buildCharacterDocument, createCharacterFromDocument } from "./characterDocument";
import { clearPendingDelete, listPendingDeletes } from "./pendingDeletes";

const LAST_PUSHED_PREFIX = "rollforcharacter.sync.lastPushed.";

async function getLastPushed(syncId: string): Promise<string | null> {
  return AsyncStorage.getItem(`${LAST_PUSHED_PREFIX}${syncId}`);
}

async function setLastPushed(syncId: string, clientUpdatedAt: string): Promise<void> {
  await AsyncStorage.setItem(`${LAST_PUSHED_PREFIX}${syncId}`, clientUpdatedAt);
}

/**
 * Milliseconds for a character timestamp. A row that was never edited still
 * has SQLite's `CURRENT_TIMESTAMP` form ("YYYY-MM-DD HH:MM:SS", UTC with no
 * zone marker), which `Date` would read as local time or reject outright.
 */
export function timestampMs(value: string): number {
  const sqliteForm = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)$/.exec(value);
  const ms = new Date(sqliteForm ? `${sqliteForm[1]}T${sqliteForm[2]}Z` : value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function portraitPathFor(userId: string, syncId: string): string {
  return `${userId}/${syncId}.jpg`;
}

/** True for a portrait that already lives in the cloud (a signed URL from an earlier pull), so there's nothing local to upload. */
function isRemotePortrait(uri: string): boolean {
  return /^https?:\/\//i.test(uri);
}

/** Reads a local portrait (`file://` on native, `data:` on web) into bytes `supabase-js` can upload. */
async function readPortraitBytes(uri: string): Promise<Blob | ArrayBuffer> {
  const response = await fetch(uri);
  // `ok` is absent on some file:// responses; only an explicit failure counts.
  if (response.ok === false) throw new Error(`Couldn't read portrait (${response.status})`);
  return Platform.OS === "web" ? await response.blob() : await response.arrayBuffer();
}

async function uploadPortrait(userId: string, syncId: string, portraitUri: string): Promise<string> {
  const bytes = await readPortraitBytes(portraitUri);
  const path = portraitPathFor(userId, syncId);
  const { error } = await supabase.storage
    .from("portraits")
    .upload(path, bytes, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
  return path;
}

/**
 * Copies the cloud portrait into this device's own storage. A signed URL
 * expires after an hour, so storing the URL itself would leave a broken
 * image (and a later push would upload the error page as the portrait).
 * Writes `portraitUri` without touching `updatedAt`: this isn't an edit.
 */
async function applyPortraitFromCloud(
  characterId: number,
  path: string | null,
  currentUri: string | null
): Promise<void> {
  if (!path) {
    if (currentUri) {
      deletePortrait(currentUri);
      await db.update(characters).set({ portraitUri: null }).where(eq(characters.id, characterId));
    }
    return;
  }
  try {
    const { data, error } = await supabase.storage.from("portraits").createSignedUrl(path, 3600);
    if (error || !data) return;
    const localUri = await persistPortrait(data.signedUrl, currentUri);
    await db.update(characters).set({ portraitUri: localUri }).where(eq(characters.id, characterId));
  } catch {
    // Portrait download failed -- keep whatever this device already shows.
  }
}

/** Pushes one character to Supabase, skipping it if nothing has changed since the last successful push. */
export async function pushCharacter(characterId: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const [row] = await db.select().from(characters).where(eq(characters.id, characterId));
  if (!row || !row.syncId) return;

  const lastPushed = await getLastPushed(row.syncId);
  if (lastPushed === row.updatedAt) return;

  const doc = await buildCharacterDocument(characterId);
  if (!doc) return;

  // `undefined` leaves the cloud's portrait_path column as it is.
  let portraitPath: string | null | undefined;
  if (!row.portraitUri) {
    portraitPath = null;
  } else if (isRemotePortrait(row.portraitUri)) {
    portraitPath = portraitPathFor(user.id, row.syncId);
  } else {
    try {
      portraitPath = await uploadPortrait(user.id, row.syncId, row.portraitUri);
    } catch {
      // A missing or unreadable image file must not block the character itself from syncing.
      portraitPath = undefined;
    }
  }

  const { error } = await supabase.from("characters").upsert(
    {
      user_id: user.id,
      client_sync_id: row.syncId,
      name: row.name,
      data: doc,
      ...(portraitPath !== undefined ? { portrait_path: portraitPath } : {}),
      client_updated_at: row.updatedAt,
      deleted: false,
    },
    { onConflict: "user_id,client_sync_id" }
  );
  if (error) throw error;

  await setLastPushed(row.syncId, row.updatedAt);
}

/** Marks characters deleted on this device as deleted in the cloud, so no device pulls them back. */
async function pushPendingDeletes(userId: string): Promise<void> {
  for (const syncId of await listPendingDeletes()) {
    const { error } = await supabase
      .from("characters")
      .update({ deleted: true, client_updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("client_sync_id", syncId);
    if (error) continue; // Stays in the list; retried on the next sync.
    try {
      await supabase.storage.from("portraits").remove([portraitPathFor(userId, syncId)]);
    } catch {
      // An orphaned image is harmless.
    }
    await AsyncStorage.removeItem(`${LAST_PUSHED_PREFIX}${syncId}`);
    await clearPendingDelete(syncId);
  }
}

/**
 * Pulls every cloud character for the signed-in user: inserts ones this
 * device has never seen, overwrites local ones the cloud copy is newer
 * than (last-write-wins, whole-character granularity), and removes local
 * ones another device deleted after this device last changed them.
 */
export async function pullCharacters(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const { data: cloudRows, error } = await supabase
    .from("characters")
    .select("client_sync_id, data, portrait_path, client_updated_at, deleted")
    .eq("user_id", user.id);
  if (error) throw error;

  const pendingDeletes = new Set(await listPendingDeletes());
  const localRows = await db.select().from(characters);
  const localBySyncId = new Map(
    localRows.filter((r) => r.syncId).map((r) => [r.syncId as string, r])
  );

  for (const cloud of cloudRows ?? []) {
    // Deleted here, cloud not told yet -- don't bring it back.
    if (pendingDeletes.has(cloud.client_sync_id)) continue;

    const local = localBySyncId.get(cloud.client_sync_id);
    const remoteTime = timestampMs(cloud.client_updated_at);

    if (cloud.deleted) {
      // Deleted on another device. An edit made here after that deletion wins and re-uploads on the next push.
      if (local && remoteTime >= timestampMs(local.updatedAt)) {
        deletePortrait(local.portraitUri);
        await db.delete(characters).where(eq(characters.id, local.id));
        await AsyncStorage.removeItem(`${LAST_PUSHED_PREFIX}${cloud.client_sync_id}`);
      }
      continue;
    }

    try {
      if (!local) {
        const newId = await createCharacterFromDocument(cloud.data, cloud.client_sync_id, cloud.client_updated_at);
        await applyPortraitFromCloud(newId, cloud.portrait_path, null);
        await setLastPushed(cloud.client_sync_id, cloud.client_updated_at);
        continue;
      }

      if (remoteTime > timestampMs(local.updatedAt)) {
        await applyCharacterDocument(local.id, cloud.data, cloud.client_updated_at);
        await applyPortraitFromCloud(local.id, cloud.portrait_path, local.portraitUri);
        await setLastPushed(cloud.client_sync_id, cloud.client_updated_at);
      }
    } catch (err) {
      // One unreadable cloud document must not stop the rest from syncing.
      console.warn("Couldn't apply a cloud character", err);
    }
  }
}

let syncInFlight: Promise<void> | null = null;

async function runSync(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  await pushPendingDeletes(user.id);

  let firstError: unknown;
  const localRows = await db.select().from(characters);
  for (const row of localRows) {
    if (!row.syncId) continue;
    try {
      await pushCharacter(row.id);
    } catch (err) {
      // Keep going: one character failing to upload shouldn't block the others or the pull.
      firstError ??= err;
    }
  }
  await pullCharacters();
  if (firstError) throw firstError;
}

/**
 * Pushes local deletions and every locally-dirty character, then pulls --
 * the one entry point screens call (sign-in, foreground, manual "Sync
 * now"). No-op if signed out or Supabase isn't configured. Calls that
 * overlap share one run: two pulls at once would each create the same new
 * cloud character locally.
 */
export function syncAll(): Promise<void> {
  if (!isSupabaseConfigured) return Promise.resolve();
  if (!syncInFlight) {
    syncInFlight = runSync().finally(() => {
      syncInFlight = null;
    });
  }
  return syncInFlight;
}
