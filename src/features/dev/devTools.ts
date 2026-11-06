import * as Crypto from "expo-crypto";
import { sql } from "drizzle-orm";
import { db } from "../../db/client";
import {
  characters,
  dmCreatures,
  feats,
  magicItems,
  monsters,
  spells,
  homebrewClasses,
  homebrewRaces,
  homebrewSubclasses,
  homebrewWeapons,
  homebrewArmor,
} from "../../db/schema";
import { RULESETS, getRulesetCatalog } from "../../data/rulesets";
import type { AbilityScoreKey } from "../../types/models";
import {
  abilityModifier,
  proficiencyBonusForLevel,
  spellProgressionRowForLevel,
} from "../characters/characterCalculations";
import { createCharacterFromOnboarding, levelUp } from "../characters/characterRepo";
import { persistPortrait } from "../characters/portraitStorage";
import { buildCharacterDocument, createCharacterFromDocument } from "../sync/characterDocument";
import { setSpellSlot } from "../spells/spellRepo";

/**
 * Developer-mode helpers. Nothing here is reachable unless Developer mode is
 * on (the Settings section that calls these only renders then).
 */

/** Clones a character, with all its child rows, as a new local-only character ("<name> (Copy)"). */
export async function duplicateCharacter(characterId: number): Promise<number | undefined> {
  const doc = await buildCharacterDocument(characterId);
  if (!doc) return undefined;

  // The portrait file is owned by one character (deleting a character deletes
  // its file), so the copy gets its own file rather than sharing the path.
  let portraitUri = doc.character.portraitUri;
  if (portraitUri) {
    try {
      portraitUri = await persistPortrait(portraitUri);
    } catch {
      portraitUri = null;
    }
  }

  const copy = { ...doc, character: { ...doc.character, name: `${doc.character.name} (Copy)`, portraitUri } };
  return createCharacterFromDocument(copy, Crypto.randomUUID());
}

/** Standard array, highest first, in the order a class's priorities usually fall. */
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export const SAMPLE_LEVELS = [1, 5, 10, 20] as const;

export type SampleCharacterResult = { characterId: number; name: string };

/**
 * Builds a ready-to-test character: the ruleset's first race, the given class
 * (or the first class), the standard array with the class's saving-throw
 * abilities and casting ability prioritized, then `level - 1` real level-ups
 * (average HP) so proficiency, hit dice, subclass and spell slots follow the
 * same code path as play. Known limits, on purpose: no starting equipment, no
 * skills, no known/prepared spells, and ASI levels are skipped rather than
 * guessed at.
 */
export async function createSampleCharacter(
  ruleset: string,
  level: number,
  classId?: string
): Promise<SampleCharacterResult> {
  const catalog = getRulesetCatalog(ruleset);
  const classDef = catalog.classes.find((c) => c.id === classId) ?? catalog.classes[0];
  const race = catalog.races[0];
  const progression = catalog.classProgressions?.find((p) => p.classId === classDef.id);

  const priorities: AbilityScoreKey[] = [];
  const wanted: (AbilityScoreKey | undefined)[] = [
    classDef.spellcastingAbility,
    ...(classDef.savingThrows ?? []),
    "constitution",
    "dexterity",
  ];
  for (const key of wanted) {
    if (key && !priorities.includes(key)) priorities.push(key);
  }
  for (const key of ABILITY_KEYS) if (!priorities.includes(key)) priorities.push(key);

  const scores = {} as Record<AbilityScoreKey, number>;
  priorities.forEach((key, index) => {
    scores[key] = STANDARD_ARRAY[index] + (race.abilityBonuses[key] ?? 0);
  });

  const conMod = abilityModifier(scores.constitution);
  const name = `Test ${classDef.name} L${level} (${ruleset})`;

  const created = await createCharacterFromOnboarding({
    name,
    ruleset,
    race: race.name,
    className: classDef.name,
    background: "",
    level: 1,
    maxHp: Math.max(1, classDef.hitDie + conMod),
    armorClass: 10 + abilityModifier(scores.dexterity),
    speed: race.speed,
    proficiencyBonus: proficiencyBonusForLevel(1),
    strength: scores.strength,
    dexterity: scores.dexterity,
    constitution: scores.constitution,
    intelligence: scores.intelligence,
    wisdom: scores.wisdom,
    charisma: scores.charisma,
  });

  const level1Row = progression ? spellProgressionRowForLevel(progression, 1) : undefined;
  await applySlots(created.id, level1Row?.slots);

  for (let next = 2; next <= level; next++) {
    const row = progression ? spellProgressionRowForLevel(progression, next) : undefined;
    const subclassId =
      progression && progression.subclassLevel === next ? progression.subclasses?.[0]?.id : undefined;
    await levelUp(created.id, {
      hpMethod: "average",
      subclassId,
      spellSlotUpdates: row?.slots.map((total, index) => ({ spellLevel: index + 1, total })),
    });
  }

  return { characterId: created.id, name };
}

async function applySlots(characterId: number, slots: number[] | undefined): Promise<void> {
  if (!slots) return;
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] > 0) await setSpellSlot(characterId, i + 1, slots[i]);
  }
}

export type HealthReport = {
  counts: { label: string; value: number }[];
  warnings: string[];
};

async function countRows(table: unknown): Promise<number> {
  const [row] = await db.select({ n: sql<number>`count(*)` }).from(table as typeof characters);
  return Number(row?.n ?? 0);
}

/** Row counts for the main tables, plus data-quality warnings across every ruleset catalog. */
export async function runDataHealthCheck(): Promise<HealthReport> {
  const tables: [string, unknown][] = [
    ["Characters", characters],
    ["Spell catalog", spells],
    ["Feat catalog", feats],
    ["Magic item catalog", magicItems],
    ["Monster catalog", monsters],
    ["DM custom creatures", dmCreatures],
    ["Homebrew races", homebrewRaces],
    ["Homebrew classes", homebrewClasses],
    ["Homebrew subclasses", homebrewSubclasses],
    ["Homebrew weapons", homebrewWeapons],
    ["Homebrew armor", homebrewArmor],
  ];
  const counts = [];
  for (const [label, table] of tables) counts.push({ label, value: await countRows(table) });

  return { counts, warnings: rulesetWarnings() };
}

/** Pure catalog checks, so they can run (and be tested) without a database. */
export function rulesetWarnings(): string[] {
  const warnings: string[] = [];
  for (const [rulesetId, catalog] of Object.entries(RULESETS)) {
    if (catalog.races.length === 0) warnings.push(`${rulesetId}: no races`);
    for (const cls of catalog.classes) {
      const where = `${rulesetId} ${cls.name}`;
      const progression = catalog.classProgressions?.find((p) => p.classId === cls.id);
      if (!progression) {
        warnings.push(`${where}: no class progression`);
        continue;
      }
      if (progression.features.length === 0) warnings.push(`${where}: no class features`);
      if (!cls.startingEquipment || cls.startingEquipment.length === 0) {
        warnings.push(`${where}: no starting equipment`);
      }
      if (cls.spellcastingAbility && !progression.spellProgression) {
        warnings.push(`${where}: has a spellcasting ability but no spell slot table`);
      }
      if (progression.subclassLevel && !(progression.subclasses?.length)) {
        warnings.push(`${where}: subclass at level ${progression.subclassLevel} but none catalogued`);
      }
    }
  }
  return warnings;
}
