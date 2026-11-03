import { eq } from "drizzle-orm";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/client";
import { characters } from "../../db/schema";
import { isSupabaseConfigured, supabase } from "../supabase/supabaseClient";
import { applyCharacterDocument, buildCharacterDocument, createCharacterFromDocument } from "./characterDocument";

const LAST_PUSHED_PREFIX = "rollforcharacter.sync.lastPushed.";

async function getLastPushed(syncId: string): Promise<string | null> {
  return AsyncStorage.getItem(`${LAST_PUSHED_PREFIX}${syncId}`);
}

async function setLastPushed(syncId: string, clientUpdatedAt: string): Promise<void> {
  await AsyncStorage.setItem(`${LAST_PUSHED_PREFIX}${syncId}`, clientUpdatedAt);
}

/**
 * Reads a portrait (a local `file://` URI on native, or a `data:`/`https:`
 * URI on web/after a pull) into bytes `supabase-js` can upload. Re-uploads
 * even a portrait that was just pulled down from Storage -- simpler than
 * tracking "is this URI already ours," at the cost of one redundant
 * round-trip per sync for an unchanged portrait.
 */
async function readPortraitBytes(uri: string): Promise<Blob | ArrayBuffer> {
  const response = await fetch(uri);
  return Platform.OS === "web" ? await response.blob() : await response.arrayBuffer();
}

async function uploadPortrait(userId: string, syncId: string, portraitUri: string): Promise<string> {
  const bytes = await readPortraitBytes(portraitUri);
  const path = `${userId}/${syncId}.jpg`;
  const { error } = await supabase.storage
    .from("portraits")
    .upload(path, bytes, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
  return path;
}

async function applyPortraitFromCloud(characterId: number, path: string): Promise<void> {
  const { data, error } = await supabase.storage.from("portraits").createSignedUrl(path, 3600);
  if (error || !data) return;
  await db.update(characters).set({ portraitUri: data.signedUrl }).where(eq(characters.id, characterId));
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

  const portraitPath = row.portraitUri ? await uploadPortrait(user.id, row.syncId, row.portraitUri) : null;

  const { error } = await supabase.from("characters").upsert(
    {
      user_id: user.id,
      client_sync_id: row.syncId,
      name: row.name,
      data: doc,
      portrait_path: portraitPath,
      client_updated_at: row.updatedAt,
      deleted: false,
    },
    { onConflict: "user_id,client_sync_id" }
  );
  if (error) throw error;

  await setLastPushed(row.syncId, row.updatedAt);
}

/** Pulls every cloud character for the signed-in user, inserting ones this device has never seen and overwriting local ones the cloud copy is newer than (last-write-wins, whole-character granularity). */
export async function pullCharacters(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const { data: cloudRows, error } = await supabase
    .from("characters")
    .select("client_sync_id, data, portrait_path, client_updated_at")
    .eq("user_id", user.id)
    .eq("deleted", false);
  if (error) throw error;

  const localRows = await db.select().from(characters);
  const localBySyncId = new Map(
    localRows.filter((r) => r.syncId).map((r) => [r.syncId as string, r])
  );

  for (const cloud of cloudRows ?? []) {
    const local = localBySyncId.get(cloud.client_sync_id);

    if (!local) {
      const newId = await createCharacterFromDocument(cloud.data, cloud.client_sync_id);
      if (cloud.portrait_path) await applyPortraitFromCloud(newId, cloud.portrait_path);
      await setLastPushed(cloud.client_sync_id, cloud.client_updated_at);
      continue;
    }

    const localTime = new Date(local.updatedAt).getTime();
    const remoteTime = new Date(cloud.client_updated_at).getTime();
    if (remoteTime > localTime) {
      await applyCharacterDocument(local.id, cloud.data);
      if (cloud.portrait_path) await applyPortraitFromCloud(local.id, cloud.portrait_path);
      await setLastPushed(cloud.client_sync_id, cloud.client_updated_at);
    }
  }
}

/** Pushes every locally-dirty character, then pulls -- the one entry point screens call (sign-in, foreground, manual "Sync now"). No-op if signed out or Supabase isn't configured. */
export async function syncAll(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const localRows = await db.select().from(characters);
  for (const row of localRows) {
    if (row.syncId) await pushCharacter(row.id);
  }
  await pullCharacters();
}
