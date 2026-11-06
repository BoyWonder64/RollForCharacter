import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { characters } from "../../../db/schema";
import { createCharacter, getCharacter, updateCharacter } from "../../characters/characterRepo";
import { addGearItem, listGearItems } from "../../characters/gearRepo";
import { buildCharacterDocument } from "../characterDocument";
import { pullCharacters, pushCharacter, syncAll } from "../syncEngine";

jest.mock("../../../db/client");
jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories must use require
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// --- A fake Supabase: one in-memory `characters` table plus portrait storage.
type CloudRow = {
  user_id: string;
  client_sync_id: string;
  name: string;
  data: unknown;
  portrait_path: string | null;
  client_updated_at: string;
  deleted: boolean;
};

const mockCloud = {
  user: { id: "user-1" } as { id: string } | null,
  rows: [] as CloudRow[],
  uploads: [] as string[],
  upsertError: null as Error | null,
};

jest.mock("../../supabase/supabaseClient", () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: { getUser: async () => ({ data: { user: mockCloud.user } }) },
    from: () => ({
      upsert: async (row: CloudRow) => {
        if (mockCloud.upsertError) return { error: mockCloud.upsertError };
        const stored = JSON.parse(JSON.stringify(row)) as CloudRow;
        const i = mockCloud.rows.findIndex(
          (r) => r.user_id === row.user_id && r.client_sync_id === row.client_sync_id
        );
        if (i >= 0) mockCloud.rows[i] = stored;
        else mockCloud.rows.push(stored);
        return { error: null };
      },
      select: () => {
        const filters: [keyof CloudRow, unknown][] = [];
        const query = {
          eq(column: keyof CloudRow, value: unknown) {
            filters.push([column, value]);
            return query;
          },
          then(resolve: (result: { data: CloudRow[]; error: null }) => void) {
            const data = mockCloud.rows.filter((r) => filters.every(([c, v]) => r[c] === v));
            resolve({ data: JSON.parse(JSON.stringify(data)), error: null });
          },
        };
        return query;
      },
    }),
    storage: {
      from: () => ({
        upload: async (path: string) => {
          mockCloud.uploads.push(path);
          return { error: null };
        },
        createSignedUrl: async (path: string) => ({ data: { signedUrl: `https://signed.example/${path}` }, error: null }),
      }),
    },
  },
}));

const LAST_PUSHED = "rollforcharacter.sync.lastPushed.";
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

let syncCount = 0;

async function makeSyncedCharacter(name: string) {
  const created = await createCharacter(name);
  // A fresh row's updatedAt is SQLite's "YYYY-MM-DD HH:MM:SS"; one write makes it ISO like every later edit.
  await updateCharacter(created.id, { syncId: `sync-engine-${++syncCount}` });
  return (await getCharacter(created.id))!;
}

function cloudRowFor(syncId: string): CloudRow | undefined {
  return mockCloud.rows.find((r) => r.client_sync_id === syncId);
}

async function deleteAllLocalCharacters() {
  for (const row of await db.select().from(characters)) {
    await db.delete(characters).where(eq(characters.id, row.id));
  }
}

beforeEach(async () => {
  mockCloud.user = { id: "user-1" };
  mockCloud.rows = [];
  mockCloud.uploads = [];
  mockCloud.upsertError = null;
  await AsyncStorage.clear();
  await deleteAllLocalCharacters();
  globalThis.fetch = jest.fn(async () => ({
    arrayBuffer: async () => new ArrayBuffer(4),
    blob: async () => new Blob(),
  })) as unknown as typeof fetch;
});

describe("pushCharacter", () => {
  it("uploads the character document and remembers what it pushed", async () => {
    const hero = await makeSyncedCharacter("Pusher");
    await addGearItem(hero.id, { name: "Rope", quantity: 1 });
    const current = (await getCharacter(hero.id))!;

    await pushCharacter(hero.id);

    const row = cloudRowFor(hero.syncId!);
    expect(row).toMatchObject({
      user_id: "user-1",
      name: "Pusher",
      portrait_path: null,
      client_updated_at: current.updatedAt,
      deleted: false,
    });
    expect(row!.data).toEqual(JSON.parse(JSON.stringify(await buildCharacterDocument(hero.id))));
    expect(await AsyncStorage.getItem(`${LAST_PUSHED}${hero.syncId}`)).toBe(current.updatedAt);
  });

  it("skips a character that hasn't changed since the last push", async () => {
    const hero = await makeSyncedCharacter("Unchanged");
    await pushCharacter(hero.id);
    mockCloud.rows = [];

    await pushCharacter(hero.id);
    expect(mockCloud.rows).toEqual([]);
  });

  it("pushes again after an edit", async () => {
    const hero = await makeSyncedCharacter("Edited");
    await pushCharacter(hero.id);
    await tick();
    await updateCharacter(hero.id, { currentHp: 3 });

    await pushCharacter(hero.id);
    expect((cloudRowFor(hero.syncId!)!.data as { character: { currentHp: number } }).character.currentHp).toBe(3);
  });

  it("uploads the portrait under the user's folder", async () => {
    const hero = await makeSyncedCharacter("Portrait");
    await updateCharacter(hero.id, { portraitUri: "file:///portrait.jpg" });

    await pushCharacter(hero.id);
    const path = `user-1/${hero.syncId}.jpg`;
    expect(mockCloud.uploads).toEqual([path]);
    expect(cloudRowFor(hero.syncId!)!.portrait_path).toBe(path);
  });

  it("does nothing when signed out", async () => {
    const hero = await makeSyncedCharacter("Signed Out");
    mockCloud.user = null;
    await pushCharacter(hero.id);
    expect(mockCloud.rows).toEqual([]);
  });

  it("does nothing for a character with no sync id", async () => {
    const hero = await createCharacter("No Sync Id");
    await updateCharacter(hero.id, { syncId: null });
    await pushCharacter(hero.id);
    expect(mockCloud.rows).toEqual([]);
  });

  it("throws on an upload error and doesn't mark the character as pushed", async () => {
    const hero = await makeSyncedCharacter("Failing");
    mockCloud.upsertError = new Error("network down");

    await expect(pushCharacter(hero.id)).rejects.toThrow("network down");
    expect(await AsyncStorage.getItem(`${LAST_PUSHED}${hero.syncId}`)).toBeNull();

    mockCloud.upsertError = null;
    await pushCharacter(hero.id);
    expect(cloudRowFor(hero.syncId!)).toBeDefined();
  });
});

describe("pullCharacters", () => {
  it("creates a local copy of a cloud character this device has never seen", async () => {
    const source = await makeSyncedCharacter("From Another Device");
    await addGearItem(source.id, { name: "Lantern", quantity: 1 });
    await pushCharacter(source.id);
    await deleteAllLocalCharacters();

    await pullCharacters();

    const [local] = await db.select().from(characters);
    expect(local).toMatchObject({ name: "From Another Device", syncId: source.syncId });
    expect((await listGearItems(local.id)).map((g) => g.name)).toEqual(["Lantern"]);
  });

  it("applies the cloud portrait as a signed URL", async () => {
    const source = await makeSyncedCharacter("Portrait Pull");
    await updateCharacter(source.id, { portraitUri: "file:///p.jpg" });
    await pushCharacter(source.id);
    await deleteAllLocalCharacters();

    await pullCharacters();
    const [local] = await db.select().from(characters);
    expect(local.portraitUri).toBe(`https://signed.example/user-1/${source.syncId}.jpg`);
  });

  it("overwrites a local character when the cloud copy is newer", async () => {
    const hero = await makeSyncedCharacter("Shared");
    await pushCharacter(hero.id);
    const row = cloudRowFor(hero.syncId!)!;
    row.client_updated_at = new Date(Date.now() + 60_000).toISOString();
    (row.data as { character: { currentHp: number; notes: string } }).character.currentHp = 1;
    (row.data as { character: { notes: string } }).character.notes = "Edited on the phone.";

    await pullCharacters();
    expect(await getCharacter(hero.id)).toMatchObject({ currentHp: 1, notes: "Edited on the phone." });
  });

  it("keeps the local character when it's newer than the cloud copy", async () => {
    const hero = await makeSyncedCharacter("Local Wins");
    await pushCharacter(hero.id);
    const row = cloudRowFor(hero.syncId!)!;
    row.client_updated_at = "2020-01-01T00:00:00.000Z";
    (row.data as { character: { notes: string } }).character.notes = "Stale cloud copy.";

    await pullCharacters();
    expect((await getCharacter(hero.id))!.notes).not.toBe("Stale cloud copy.");
  });

  it("ignores deleted cloud rows and other users' rows", async () => {
    const source = await makeSyncedCharacter("Hidden");
    await pushCharacter(source.id);
    const doc = cloudRowFor(source.syncId!)!;
    mockCloud.rows = [
      { ...doc, client_sync_id: "deleted-one", deleted: true },
      { ...doc, client_sync_id: "someone-elses", user_id: "user-2" },
    ];
    await deleteAllLocalCharacters();

    await pullCharacters();
    expect(await db.select().from(characters)).toEqual([]);
  });

  it("does nothing when signed out", async () => {
    const source = await makeSyncedCharacter("Signed Out Pull");
    await pushCharacter(source.id);
    await deleteAllLocalCharacters();
    mockCloud.user = null;

    await pullCharacters();
    expect(await db.select().from(characters)).toEqual([]);
  });
});

describe("syncAll", () => {
  it("pushes every synced local character, then pulls new cloud ones", async () => {
    const a = await makeSyncedCharacter("Alpha");
    const b = await makeSyncedCharacter("Beta");
    mockCloud.rows.push({
      user_id: "user-1",
      client_sync_id: "gamma-from-cloud",
      name: "Gamma",
      data: { ...(await buildCharacterDocument(a.id))!, character: { ...(await buildCharacterDocument(a.id))!.character, name: "Gamma" } },
      portrait_path: null,
      client_updated_at: new Date().toISOString(),
      deleted: false,
    });

    await syncAll();

    expect(mockCloud.rows.map((r) => r.name).sort()).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(cloudRowFor(b.syncId!)).toBeDefined();
    const names = (await db.select().from(characters)).map((r) => r.name).sort();
    expect(names).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("does nothing when signed out", async () => {
    await makeSyncedCharacter("Offline");
    mockCloud.user = null;
    await syncAll();
    expect(mockCloud.rows).toEqual([]);
  });
});
