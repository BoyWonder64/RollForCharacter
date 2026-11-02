import { eq, inArray } from "drizzle-orm";
import { db } from "../../db/client";
import { dmCreatures, dmEncounters, dmPartyInitiative, monsters } from "../../db/schema";
import type { MonsterTraitEntry } from "../../data/monsters";
import { rollExpression } from "../dice/diceEngine";
import { parseUsedAbilities, serializeUsedAbilities } from "./monsterRolls";

export type MonsterCatalogRow = {
  id: number;
  slug: string | null;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  armorDetail: string;
  hitPoints: number;
  hitDice: string;
  speed: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  challengeRating: string;
  xp: number;
  senses: string;
  languages: string;
  traits: MonsterTraitEntry[];
  actions: MonsterTraitEntry[];
  legendaryActions: MonsterTraitEntry[];
  sourceKey: string;
  sourceName: string;
};

function parseTraitEntries(raw: string): MonsterTraitEntry[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MonsterTraitEntry[];
  } catch {
    return [];
  }
}

/** Full monster catalog -- 656 entries (SRD 2014 + 2024), fine to load at once; no server-side search here. */
export async function listMonsterCatalog(): Promise<MonsterCatalogRow[]> {
  const rows = await db.select().from(monsters);
  return rows.map((r) => ({
    ...r,
    traits: parseTraitEntries(r.traits),
    actions: parseTraitEntries(r.actions),
    legendaryActions: parseTraitEntries(r.legendaryActions),
  }));
}

let catalogCache: MonsterCatalogRow[] | null = null;

/** The catalog never changes at runtime, so parse it once per app session. */
export async function getMonsterCatalog(): Promise<MonsterCatalogRow[]> {
  if (!catalogCache) catalogCache = await listMonsterCatalog();
  return catalogCache;
}

export async function listDmCreatures() {
  return db
    .select()
    .from(dmCreatures)
    .orderBy(dmCreatures.sortOrder, dmCreatures.createdAt, dmCreatures.id);
}

export type DmCreatureRow = Awaited<ReturnType<typeof listDmCreatures>>[number];

/** "Goblin 3" -> { base: "Goblin", n: 3 }; an unnumbered name has n = 0. */
function splitNumber(name: string): { base: string; n: number } {
  const match = name.match(/^(.*\S)\s+(\d+)$/);
  return match ? { base: match[1], n: parseInt(match[2], 10) } : { base: name, n: 0 };
}

/**
 * Names for `quantity` new creatures called `baseName`, numbered after any
 * already in the encounter ("Goblin 1".."Goblin 4"). A lone creature keeps
 * its plain name; once a second one joins, the first is renumbered to 1.
 */
async function nextNames(baseName: string, quantity: number): Promise<string[]> {
  const existing = await db.select().from(dmCreatures);
  const same = existing.filter((c) => splitNumber(c.name).base === baseName);
  if (same.length === 0 && quantity === 1) return [baseName];
  let highest = same.reduce((max, c) => Math.max(max, splitNumber(c.name).n), 0);
  const plain = same.find((c) => splitNumber(c.name).n === 0);
  if (plain) {
    highest = Math.max(highest, 1);
    await db
      .update(dmCreatures)
      .set({ name: `${baseName} 1` })
      .where(eq(dmCreatures.id, plain.id));
  }
  return Array.from({ length: quantity }, (_, i) => `${baseName} ${highest + i + 1}`);
}

export type AddCreatureOptions = {
  quantity?: number;
  /** Roll the hit dice for HP instead of using the stat block's average. */
  rollHp?: boolean;
};

function clampQuantity(quantity: number | undefined): number {
  return Math.max(1, Math.min(quantity ?? 1, 30));
}

function rolledHitPoints(hitDice: string, average: number): number {
  try {
    return Math.max(1, rollExpression(hitDice).total);
  } catch {
    return average;
  }
}

/** Returns the names of the creatures added (numbered when there is more than one). */
export async function addDmCreatureFromCatalog(
  catalogId: number,
  options: AddCreatureOptions = {}
): Promise<string[]> {
  const [def] = await db.select().from(monsters).where(eq(monsters.id, catalogId));
  if (!def) return [];
  const names = await nextNames(def.name, clampQuantity(options.quantity));
  for (const name of names) {
    const hp = options.rollHp ? rolledHitPoints(def.hitDice, def.hitPoints) : def.hitPoints;
    await db.insert(dmCreatures).values({
      monsterId: def.id,
      name,
      currentHp: hp,
      maxHp: hp,
      armorClass: def.armorClass,
      dexterity: def.dexterity,
    });
  }
  return names;
}

export async function addCustomDmCreature(
  name: string,
  maxHp: number,
  armorClass: number,
  options: { dexterity?: number; quantity?: number } = {}
): Promise<string[]> {
  const names = await nextNames(name, clampQuantity(options.quantity));
  for (const creatureName of names) {
    await db.insert(dmCreatures).values({
      monsterId: null,
      name: creatureName,
      currentHp: maxHp,
      maxHp,
      armorClass,
      dexterity: options.dexterity ?? 10,
    });
  }
  return names;
}

export async function updateDmCreatureHp(id: number, currentHp: number): Promise<void> {
  await db.update(dmCreatures).set({ currentHp }).where(eq(dmCreatures.id, id));
}

export async function updateDmCreatureNotes(id: number, notes: string): Promise<void> {
  await db.update(dmCreatures).set({ notes }).where(eq(dmCreatures.id, id));
}

export async function setDmCreatureInitiative(
  id: number,
  initiative: number | null
): Promise<void> {
  await db.update(dmCreatures).set({ initiative }).where(eq(dmCreatures.id, id));
}

export async function toggleDmCreatureCondition(id: number, conditionId: string): Promise<void> {
  const [row] = await db.select().from(dmCreatures).where(eq(dmCreatures.id, id));
  if (!row) return;
  const active = row.conditions ? row.conditions.split(",").filter(Boolean) : [];
  const next = active.includes(conditionId)
    ? active.filter((c) => c !== conditionId)
    : [...active, conditionId];
  await db
    .update(dmCreatures)
    .set({ conditions: next.join(",") })
    .where(eq(dmCreatures.id, id));
}

/** Sets how many times a limited ability (recharge / per-day / rest) has been used. */
export async function setDmCreatureAbilityUses(
  id: number,
  abilityName: string,
  used: number
): Promise<void> {
  const [row] = await db.select().from(dmCreatures).where(eq(dmCreatures.id, id));
  if (!row) return;
  const map = parseUsedAbilities(row.usedAbilities);
  map[abilityName] = Math.max(0, used);
  await db
    .update(dmCreatures)
    .set({ usedAbilities: serializeUsedAbilities(map) })
    .where(eq(dmCreatures.id, id));
}

export async function removeDmCreature(id: number): Promise<void> {
  await db.delete(dmCreatures).where(eq(dmCreatures.id, id));
}

export async function clearDmCreatures(): Promise<void> {
  await db.delete(dmCreatures);
}

/** Clears every creature's and party member's initiative (start of a new combat). */
export async function clearAllInitiative(): Promise<void> {
  await db.update(dmCreatures).set({ initiative: null });
  await db.delete(dmPartyInitiative);
}

// --- Party initiative --------------------------------------------------------

export async function listPartyInitiative(): Promise<Record<number, number>> {
  const rows = await db.select().from(dmPartyInitiative);
  return Object.fromEntries(rows.map((r) => [r.characterId, r.initiative]));
}

export async function setPartyInitiative(
  characterId: number,
  initiative: number | null
): Promise<void> {
  if (initiative === null) {
    await db.delete(dmPartyInitiative).where(eq(dmPartyInitiative.characterId, characterId));
    return;
  }
  await db
    .insert(dmPartyInitiative)
    .values({ characterId, initiative })
    .onConflictDoUpdate({ target: dmPartyInitiative.characterId, set: { initiative } });
}

// --- Saved encounters -----------------------------------------------------------

type SavedCreature = {
  monsterId: number | null;
  name: string;
  maxHp: number;
  armorClass: number;
  dexterity: number;
  notes: string;
};

export type SavedEncounter = {
  id: number;
  name: string;
  creatureCount: number;
  createdAt: string;
};

function parseSavedCreatures(raw: string): SavedCreature[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedCreature[]) : [];
  } catch {
    return [];
  }
}

/** Snapshots the active creature list; returns null when there is nothing to save. */
export async function saveCurrentEncounter(name: string): Promise<number | null> {
  const creatures = await listDmCreatures();
  if (creatures.length === 0) return null;
  const snapshot: SavedCreature[] = creatures.map((c) => ({
    monsterId: c.monsterId,
    name: c.name,
    maxHp: c.maxHp,
    armorClass: c.armorClass,
    dexterity: c.dexterity,
    notes: c.notes,
  }));
  const [row] = await db
    .insert(dmEncounters)
    .values({ name: name.trim() || "Encounter", creatures: JSON.stringify(snapshot) })
    .returning({ id: dmEncounters.id });
  return row.id;
}

export async function listSavedEncounters(): Promise<SavedEncounter[]> {
  const rows = await db.select().from(dmEncounters);
  return rows
    .sort((a, b) => b.id - a.id)
    .map((r) => ({
      id: r.id,
      name: r.name,
      creatureCount: parseSavedCreatures(r.creatures).length,
      createdAt: r.createdAt,
    }));
}

/** Replaces the active encounter with a saved one: full HP, no initiative. */
export async function loadSavedEncounter(id: number): Promise<void> {
  const [row] = await db.select().from(dmEncounters).where(eq(dmEncounters.id, id));
  if (!row) return;
  const creatures = parseSavedCreatures(row.creatures);
  // A catalog creature whose monster row no longer exists must not break the FK.
  const catalogIds = creatures.map((c) => c.monsterId).filter((m): m is number => m !== null);
  const present = new Set<number>(
    catalogIds.length === 0
      ? []
      : (
          await db
            .select({ id: monsters.id })
            .from(monsters)
            .where(inArray(monsters.id, catalogIds))
        ).map((r) => r.id)
  );
  await clearDmCreatures();
  await db.delete(dmPartyInitiative);
  for (const c of creatures) {
    await db.insert(dmCreatures).values({
      monsterId: c.monsterId !== null && present.has(c.monsterId) ? c.monsterId : null,
      name: c.name,
      currentHp: c.maxHp,
      maxHp: c.maxHp,
      armorClass: c.armorClass,
      dexterity: c.dexterity,
      notes: c.notes ?? "",
    });
  }
}

export async function deleteSavedEncounter(id: number): Promise<void> {
  await db.delete(dmEncounters).where(eq(dmEncounters.id, id));
}
