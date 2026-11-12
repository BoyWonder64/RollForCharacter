import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.sync.pendingDeletes";

/**
 * Sync ids of characters deleted on this device whose deletion hasn't
 * reached the cloud yet. Without this list a deleted character would be
 * re-created by the next pull, because its cloud row still exists.
 */
export async function listPendingDeletes(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Remembers that a character was deleted locally. Never throws: a storage failure must not block the delete itself. */
export async function recordPendingDelete(syncId: string): Promise<void> {
  try {
    const current = await listPendingDeletes();
    if (current.includes(syncId)) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...current, syncId]));
  } catch {
    // Storage unavailable -- the deletion just won't propagate to the cloud.
  }
}

export async function clearPendingDelete(syncId: string): Promise<void> {
  try {
    const current = await listPendingDeletes();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current.filter((id) => id !== syncId)));
  } catch {
    // Retried on the next sync.
  }
}
