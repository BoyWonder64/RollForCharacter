import { eq } from "drizzle-orm";
import { db } from "../../../db/client";
import { campaignNotes } from "../../../db/schema";
import {
  addCampaignItem,
  addCampaignNote,
  listCampaignItems,
  listCampaignNotes,
  removeCampaignItem,
  removeCampaignNote,
  updateCampaignNote,
} from "../campaignRepo";
import { createCharacter, getCharacter, updateCharacter } from "../characterRepo";

jest.mock("../../../db/client");

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

/** A fresh row's updatedAt is SQLite's "YYYY-MM-DD HH:MM:SS" default; one write switches it to ISO so times compare. */
async function makeCharacter(name: string) {
  const character = await createCharacter(name);
  await updateCharacter(character.id, {});
  return character;
}

async function updatedAtOf(characterId: number): Promise<number> {
  return new Date((await getCharacter(characterId))!.updatedAt).getTime();
}

describe("campaign notes", () => {
  it("adds, edits and removes a note, scoped to its character", async () => {
    const hero = await createCharacter("Journal Hero");
    const other = await createCharacter("Someone Else");

    await addCampaignNote(hero.id, { subject: "Session 1", body: "Met the innkeeper." });
    await addCampaignNote(other.id, { subject: "Not mine", body: "" });

    const [note] = await listCampaignNotes(hero.id);
    expect(note).toMatchObject({ characterId: hero.id, subject: "Session 1", body: "Met the innkeeper." });
    expect(await listCampaignNotes(hero.id)).toHaveLength(1);

    await updateCampaignNote(note.id, { subject: "Session 1 (edited)", body: "Met the innkeeper's twin." });
    const [edited] = await listCampaignNotes(hero.id);
    expect(edited).toMatchObject({ id: note.id, subject: "Session 1 (edited)", body: "Met the innkeeper's twin." });

    await removeCampaignNote(note.id);
    expect(await listCampaignNotes(hero.id)).toEqual([]);
    expect(await listCampaignNotes(other.id)).toHaveLength(1);
  });

  it("lists newest first", async () => {
    const hero = await createCharacter("Ordered Journal");
    await addCampaignNote(hero.id, { subject: "Older", body: "" });
    await addCampaignNote(hero.id, { subject: "Newer", body: "" });
    const older = (await listCampaignNotes(hero.id)).find((r) => r.subject === "Older")!;
    await db.update(campaignNotes).set({ createdAt: "2020-01-01 00:00:00" }).where(eq(campaignNotes.id, older.id));

    expect((await listCampaignNotes(hero.id)).map((r) => r.subject)).toEqual(["Newer", "Older"]);
  });

  it("bumps the character's updatedAt on every write so it syncs", async () => {
    const hero = await makeCharacter("Sync Journal");
    let last = await updatedAtOf(hero.id);

    await tick();
    await addCampaignNote(hero.id, { subject: "A", body: "" });
    expect(await updatedAtOf(hero.id)).toBeGreaterThan(last);
    last = await updatedAtOf(hero.id);

    const [note] = await listCampaignNotes(hero.id);
    await tick();
    await updateCampaignNote(note.id, { subject: "B", body: "" });
    expect(await updatedAtOf(hero.id)).toBeGreaterThan(last);
    last = await updatedAtOf(hero.id);

    await tick();
    await removeCampaignNote(note.id);
    expect(await updatedAtOf(hero.id)).toBeGreaterThan(last);
  });

  it("ignores edits and removals of a note that doesn't exist", async () => {
    await expect(updateCampaignNote(999_999, { subject: "x", body: "" })).resolves.toBeUndefined();
    await expect(removeCampaignNote(999_999)).resolves.toBeUndefined();
  });
});

describe("campaign items", () => {
  it("adds and removes items, defaulting the description to empty", async () => {
    const hero = await createCharacter("Item Hero");
    await addCampaignItem(hero.id, { name: "Rusty key", icon: "key" });
    await addCampaignItem(hero.id, { name: "Strange map", icon: "book", description: "Shows a tower." });

    const items = await listCampaignItems(hero.id);
    expect(items.map((i) => [i.name, i.icon, i.description])).toEqual([
      ["Rusty key", "key", ""],
      ["Strange map", "book", "Shows a tower."],
    ]);

    await removeCampaignItem(items[0].id);
    expect((await listCampaignItems(hero.id)).map((i) => i.name)).toEqual(["Strange map"]);
  });

  it("bumps the character's updatedAt on add and remove", async () => {
    const hero = await makeCharacter("Sync Items");
    let last = await updatedAtOf(hero.id);

    await tick();
    await addCampaignItem(hero.id, { name: "Potion", icon: "potion" });
    expect(await updatedAtOf(hero.id)).toBeGreaterThan(last);
    last = await updatedAtOf(hero.id);

    const [item] = await listCampaignItems(hero.id);
    await tick();
    await removeCampaignItem(item.id);
    expect(await updatedAtOf(hero.id)).toBeGreaterThan(last);
  });
});
