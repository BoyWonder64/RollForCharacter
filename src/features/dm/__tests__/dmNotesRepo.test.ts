import AsyncStorage from "@react-native-async-storage/async-storage";
import { eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { dmNotes } from "../../../db/schema";
import {
  addDmNote,
  addDmTimelineEvent,
  listDmNotes,
  listDmTimelineEvents,
  migrateLegacySessionNotesIfNeeded,
  removeDmNote,
  removeDmTimelineEvent,
  updateDmNote,
  updateDmTimelineEvent,
} from "../dmNotesRepo";

jest.mock("../../../db/client");
jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- jest.mock factories must use require
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const LEGACY_KEY = "rollforcharacter.dm.sessionNotes";

// The DM tables are global (not per character), so each test clears them.
beforeEach(async () => {
  for (const note of await listDmNotes()) await removeDmNote(note.id);
  for (const event of await listDmTimelineEvents()) await removeDmTimelineEvent(event.id);
  await AsyncStorage.clear();
});

describe("DM session notes", () => {
  it("adds, edits and removes notes", async () => {
    await addDmNote({ subject: "Session 1", body: "Goblins." });
    const [note] = await listDmNotes();
    expect(note).toMatchObject({ subject: "Session 1", body: "Goblins." });

    await updateDmNote(note.id, { subject: "Session 1", body: "Goblins and a wolf." });
    expect((await listDmNotes())[0].body).toBe("Goblins and a wolf.");

    await removeDmNote(note.id);
    expect(await listDmNotes()).toEqual([]);
  });

  it("lists newest first", async () => {
    await addDmNote({ subject: "Older", body: "" });
    await addDmNote({ subject: "Newer", body: "" });
    const older = (await listDmNotes()).find((n) => n.subject === "Older")!;
    await db.update(dmNotes).set({ createdAt: "2020-01-01 00:00:00" }).where(eq(dmNotes.id, older.id));
    expect((await listDmNotes()).map((n) => n.subject)).toEqual(["Newer", "Older"]);
  });
});

describe("migrateLegacySessionNotesIfNeeded", () => {
  it("imports the old single note once, trimmed, and removes the old key", async () => {
    await AsyncStorage.setItem(LEGACY_KEY, "  The dragon is in the well.  \n");

    await migrateLegacySessionNotesIfNeeded();
    expect(await listDmNotes()).toEqual([
      expect.objectContaining({ subject: "Session notes (imported)", body: "The dragon is in the well." }),
    ]);
    expect(await AsyncStorage.getItem(LEGACY_KEY)).toBeNull();

    await migrateLegacySessionNotesIfNeeded();
    expect(await listDmNotes()).toHaveLength(1);
  });

  it("does nothing when there's no old note", async () => {
    await migrateLegacySessionNotesIfNeeded();
    expect(await listDmNotes()).toEqual([]);
  });

  it("does nothing for a whitespace-only old note", async () => {
    await AsyncStorage.setItem(LEGACY_KEY, "   \n ");
    await migrateLegacySessionNotesIfNeeded();
    expect(await listDmNotes()).toEqual([]);
  });
});

describe("DM campaign timeline", () => {
  it("appends events in the order they're logged", async () => {
    await addDmTimelineEvent({ title: "The heist", eventDate: "Day 3", body: "" });
    await addDmTimelineEvent({ title: "The escape", eventDate: "Day 4", body: "" });
    await addDmTimelineEvent({ title: "The reckoning", eventDate: "Day 9", body: "" });

    const events = await listDmTimelineEvents();
    expect(events.map((e) => e.title)).toEqual(["The heist", "The escape", "The reckoning"]);
    expect(events.map((e) => e.sortOrder)).toEqual([1, 2, 3]);
  });

  it("puts a new event after the current highest order, even after a removal", async () => {
    await addDmTimelineEvent({ title: "A", eventDate: "", body: "" });
    await addDmTimelineEvent({ title: "B", eventDate: "", body: "" });
    const [a] = await listDmTimelineEvents();
    await removeDmTimelineEvent(a.id);
    await addDmTimelineEvent({ title: "C", eventDate: "", body: "" });

    expect((await listDmTimelineEvents()).map((e) => [e.title, e.sortOrder])).toEqual([
      ["B", 2],
      ["C", 3],
    ]);
  });

  it("edits an event without changing its place", async () => {
    await addDmTimelineEvent({ title: "First", eventDate: "Day 1", body: "" });
    await addDmTimelineEvent({ title: "Second", eventDate: "Day 2", body: "" });
    const [first] = await listDmTimelineEvents();

    await updateDmTimelineEvent(first.id, { title: "First (edited)", eventDate: "Day 1, dusk", body: "Notes" });
    const events = await listDmTimelineEvents();
    expect(events[0]).toMatchObject({ title: "First (edited)", eventDate: "Day 1, dusk", body: "Notes", sortOrder: 1 });
    expect(events[1].title).toBe("Second");
  });
});
