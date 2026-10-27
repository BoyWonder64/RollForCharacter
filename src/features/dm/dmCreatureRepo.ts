import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { dmCreatures, monsters } from "../../db/schema";
import type { MonsterTraitEntry } from "../../data/monsters";

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

export async function listDmCreatures() {
  return db.select().from(dmCreatures).orderBy(dmCreatures.sortOrder, dmCreatures.createdAt);
}

export async function addDmCreatureFromCatalog(catalogId: number): Promise<void> {
  const [def] = await db.select().from(monsters).where(eq(monsters.id, catalogId));
  if (!def) return;
  await db.insert(dmCreatures).values({
    monsterId: def.id,
    name: def.name,
    currentHp: def.hitPoints,
    maxHp: def.hitPoints,
    armorClass: def.armorClass,
  });
}

export async function addCustomDmCreature(name: string, maxHp: number, armorClass: number): Promise<void> {
  await db.insert(dmCreatures).values({
    monsterId: null,
    name,
    currentHp: maxHp,
    maxHp,
    armorClass,
  });
}

export async function updateDmCreatureHp(id: number, currentHp: number): Promise<void> {
  await db.update(dmCreatures).set({ currentHp }).where(eq(dmCreatures.id, id));
}

export async function removeDmCreature(id: number): Promise<void> {
  await db.delete(dmCreatures).where(eq(dmCreatures.id, id));
}
