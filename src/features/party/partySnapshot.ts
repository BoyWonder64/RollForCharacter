import { abilityModifier, parseConditions } from "../characters/characterCalculations";
import { getCharacter } from "../characters/characterRepo";
import { listCampaignNotes } from "../characters/campaignRepo";
import { listCharacterArmor, listCharacterWeapons, listGearItems } from "../characters/gearRepo";
import { listSpellsForCharacter } from "../spells/spellRepo";
import type { AbilityScoreKey } from "../../types/models";

export type PartyVisibility = {
  stats: boolean;
  inventory: boolean;
  spells: boolean;
  notes: boolean;
};

export const DEFAULT_PARTY_VISIBILITY: PartyVisibility = {
  stats: true,
  inventory: false,
  spells: false,
  notes: false,
};

export const PARTY_VISIBILITY_SECTIONS: { key: keyof PartyVisibility; label: string; hint: string }[] = [
  { key: "stats", label: "Stats & combat", hint: "HP, AC, abilities, conditions, death saves" },
  { key: "inventory", label: "Inventory", hint: "Equipped weapons/armor and gear" },
  { key: "spells", label: "Spells", hint: "Known/prepared spells" },
  { key: "notes", label: "Notes", hint: "Character notes and campaign journal" },
];

export type PartyStatsSection = {
  maxHp: number;
  currentHp: number;
  armorClass: number;
  speed: number;
  abilities: Record<AbilityScoreKey, number>;
  modifiers: Record<AbilityScoreKey, number>;
  conditions: string[];
  exhaustionLevel: number;
  inspiration: boolean;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
};

export type PartyInventorySection = {
  weapons: { name: string; equipped: boolean }[];
  armor: { name: string; equipped: boolean }[];
  gear: { name: string; quantity: number }[];
};

export type PartySpellsSection = {
  spells: { name: string; level: number; prepared: boolean }[];
};

export type PartyNotesSection = {
  characterNotes: string;
  journal: { subject: string; body: string; createdAt: string }[];
};

export type PartySnapshotData = {
  stats?: PartyStatsSection;
  inventory?: PartyInventorySection;
  spells?: PartySpellsSection;
  notes?: PartyNotesSection;
};

export type PartySnapshotPayload = {
  /** The character's stable cloud-sync id (characters.syncId), not its local autoincrement id -- the only id meaningful once this leaves the device. */
  characterSyncId: string;
  name: string;
  race: string;
  className: string;
  level: number;
  visibility: PartyVisibility;
  data: PartySnapshotData;
};

const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

function statsSection(character: Awaited<ReturnType<typeof getCharacter>> & object): PartyStatsSection {
  const abilities = {} as Record<AbilityScoreKey, number>;
  const modifiers = {} as Record<AbilityScoreKey, number>;
  for (const key of ABILITY_KEYS) {
    abilities[key] = character[key];
    modifiers[key] = abilityModifier(character[key]);
  }
  return {
    maxHp: character.maxHp,
    currentHp: character.currentHp,
    armorClass: character.armorClass,
    speed: character.speed,
    abilities,
    modifiers,
    conditions: parseConditions(character),
    exhaustionLevel: character.exhaustionLevel,
    inspiration: character.inspiration,
    deathSaveSuccesses: character.deathSaveSuccesses,
    deathSaveFailures: character.deathSaveFailures,
  };
}

async function inventorySection(characterId: number): Promise<PartyInventorySection> {
  const [weapons, armor, gear] = await Promise.all([
    listCharacterWeapons(characterId),
    listCharacterArmor(characterId),
    listGearItems(characterId),
  ]);
  return {
    weapons: weapons.map((w) => ({ name: w.name, equipped: w.equipped })),
    armor: armor.map((a) => ({ name: a.name, equipped: a.equipped })),
    gear: gear.map((g) => ({ name: g.name, quantity: g.quantity })),
  };
}

async function spellsSection(characterId: number): Promise<PartySpellsSection> {
  const spells = await listSpellsForCharacter(characterId);
  return {
    spells: spells.map((s) => ({ name: s.name, level: s.level, prepared: s.prepared })),
  };
}

async function notesSection(
  characterId: number,
  character: { notes: string }
): Promise<PartyNotesSection> {
  const notes = await listCampaignNotes(characterId);
  return {
    characterNotes: character.notes,
    journal: notes.map((n) => ({ subject: n.subject, body: n.body, createdAt: n.createdAt })),
  };
}

/** Builds the JSON payload pushed to Supabase's party_snapshots table -- only the sections `visibility` has turned on. */
export async function buildPartySnapshot(
  characterId: number,
  visibility: PartyVisibility
): Promise<PartySnapshotPayload | undefined> {
  const character = await getCharacter(characterId);
  if (!character || !character.syncId) return undefined;

  const data: PartySnapshotData = {};
  if (visibility.stats) data.stats = statsSection(character);
  if (visibility.inventory) data.inventory = await inventorySection(characterId);
  if (visibility.spells) data.spells = await spellsSection(characterId);
  if (visibility.notes) data.notes = await notesSection(characterId, character);

  return {
    characterSyncId: character.syncId,
    name: character.name,
    race: character.race,
    className: character.className,
    level: character.level,
    visibility,
    data,
  };
}
