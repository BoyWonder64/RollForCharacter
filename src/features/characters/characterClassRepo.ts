import { asc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characterClasses } from "../../db/schema";
import { CUSTOM_OPTION_ID } from "../../data/rulesets";
import type { AbilityScoreKey, Character, CharacterClass } from "../../types/models";
import {
  abilityModifier,
  appendHomebrewFeatures,
  averageHpGain,
  featuresGainedAtLevel,
  getClassDefinition,
  getClassDefinitionForCharacter,
  getClassProgression,
  proficiencyBonusForLevel,
  rollHpGain,
  serializeCustomClassSavingThrows,
  serializeCustomProficiencyList,
  type FeatureGrant,
} from "./characterCalculations";
import { getCharacter, updateCharacter, type LevelUpChoices } from "./characterRepo";
import { addResolvedFeat } from "./featRepo";
import { setSpellSlot } from "../spells/spellRepo";

/**
 * A `characterClasses` row's own `ClassDefinition`, honoring the custom-class
 * overlay fields on `characters` (hit die, saves, proficiencies) when that
 * row is the homebrew slot (`classId === CUSTOM_OPTION_ID`) -- same merge
 * `getClassDefinitionForCharacter` does for the primary class, just keyed by
 * this row's own `classId` instead of `character.className`. Only one
 * `characterClasses` row can ever be the homebrew slot (see `addClass`'s
 * duplicate-classId guard), so there's no ambiguity about whose overlay data
 * the shared `characters.customClass*` columns belong to.
 */
function classDefinitionForRow(
  character: Character,
  classId: string
): ReturnType<typeof getClassDefinition> {
  return classId === CUSTOM_OPTION_ID
    ? getClassDefinitionForCharacter({ ...character, className: classId })
    : getClassDefinition(character.ruleset, classId);
}

export type ClassLevelOutcome = {
  /** This class's own new level (not the character's total level). */
  newLevel: number;
  /** Character's new total level, summed across every class. */
  totalLevel: number;
  hpGain: number;
  roll?: number;
  proficiencyBonus: number;
  subclassChosen?: string;
  featuresGained: FeatureGrant[];
};

export async function listCharacterClasses(characterId: number): Promise<CharacterClass[]> {
  return db
    .select()
    .from(characterClasses)
    .where(eq(characterClasses.characterId, characterId))
    .orderBy(asc(characterClasses.sortOrder));
}

/**
 * A never-multiclassed character has zero `characterClasses` rows --
 * `characters.className`/`level`/`subclass` alone are the source of truth
 * until now. The first time a second class is ever added, this seeds a
 * sort_order 0 row mirroring those fields so the full class list is
 * complete from that point forward. No-op (returns the existing rows) once
 * any rows already exist.
 */
async function seedPrimaryClassRowIfNeeded(character: Character): Promise<CharacterClass[]> {
  const existing = await listCharacterClasses(character.id);
  if (existing.length > 0) return existing;

  const classDef = getClassDefinitionForCharacter(character);
  const rows = await db
    .insert(characterClasses)
    .values({
      characterId: character.id,
      classId: classDef.id,
      className: character.className || classDef.name,
      level: character.level,
      subclass: character.subclass,
      sortOrder: 0,
    })
    .returning();
  return rows;
}

/**
 * Recomputes `characters.level` (sum of every class row's level) and
 * `characters.className`/`subclass`/`proficiencyBonus` (mirroring the
 * sort_order 0 / "primary" class -- also the RAW-correct class for 5e
 * saving-throw proficiency) after any class-level mutation below.
 */
async function syncCharacterClassMirror(characterId: number): Promise<CharacterClass[]> {
  const rows = await listCharacterClasses(characterId);
  if (rows.length === 0) return rows;

  const totalLevel = rows.reduce((sum, row) => sum + row.level, 0);
  const primary = rows[0];
  await updateCharacter(characterId, {
    level: totalLevel,
    className: primary.className,
    subclass: primary.subclass,
    proficiencyBonus: proficiencyBonusForLevel(totalLevel),
  });
  return rows;
}

/** Only the "ability" branch mutates `updates` directly -- a "feat" choice is written as its own `character_feats` row afterward, via `addResolvedFeat` (see `levelUpClass`), since it needs its own insert rather than a column on `characters`. */
function applyAsiChoice(
  character: Character,
  updates: Partial<Character>,
  choices: LevelUpChoices
): void {
  if (choices.asiChoice?.type === "ability") {
    for (const [key, amount] of Object.entries(choices.asiChoice.increases) as [
      AbilityScoreKey,
      number,
    ][]) {
      updates[key] = Math.min(20, character[key] + amount);
    }
  }
}

async function applySpellSlotUpdates(characterId: number, choices: LevelUpChoices): Promise<void> {
  if (!choices.spellSlotUpdates) return;
  for (const { spellLevel, total } of choices.spellSlotUpdates) {
    await setSpellSlot(characterId, spellLevel, total);
  }
}

/**
 * Takes the character's very first level in a brand-new class -- the entry
 * point for multiclassing. Lazily seeds the primary class's own row first
 * (see `seedPrimaryClassRowIfNeeded`) if this is the character's first time
 * multiclassing. HP gain always comes from `classId`'s own hit die (never
 * the level-1 max-hit-die formula -- that only ever applies to a
 * character's very first level overall, which this never re-triggers).
 * Returns undefined if the character doesn't exist, or already has this
 * class (use `levelUpClass` to add a level to an existing class instead).
 * A character may multiclass into any number of classes -- RAW 5e places
 * no cap on how many classes a character can take.
 */
export async function addClass(
  characterId: number,
  classId: string,
  className: string,
  choices: LevelUpChoices
): Promise<ClassLevelOutcome | undefined> {
  const character = await getCharacter(characterId);
  if (!character) return undefined;

  const existingRows = await seedPrimaryClassRowIfNeeded(character);
  if (existingRows.some((row) => row.classId === classId)) return undefined;

  // A brand-new homebrew class's hit die/saves/proficiencies are being set
  // up for the very first time right now (the Multiclass workflow's
  // custom-class builder, same fields onboarding's does) -- read `classDef`
  // off a character shimmed with whatever was just chosen, not the
  // (not-yet-persisted) character row, so this level's HP roll uses the
  // right hit die immediately.
  const isCustomClass = classId === CUSTOM_OPTION_ID;
  const characterForClassDef: Character = isCustomClass
    ? {
        ...character,
        customClassHitDie: choices.customClassHitDie ?? character.customClassHitDie,
        customClassSavingThrows: choices.customClassSavingThrows
          ? serializeCustomClassSavingThrows(choices.customClassSavingThrows)
          : character.customClassSavingThrows,
        customClassArmorProficiencies: choices.customClassArmorProficiencies
          ? serializeCustomProficiencyList(choices.customClassArmorProficiencies)
          : character.customClassArmorProficiencies,
        customClassWeaponProficiencies: choices.customClassWeaponProficiencies
          ? serializeCustomProficiencyList(choices.customClassWeaponProficiencies)
          : character.customClassWeaponProficiencies,
      }
    : character;
  const classDef = classDefinitionForRow(characterForClassDef, classId);
  const conModifier = abilityModifier(character.constitution);

  const gain =
    choices.hpMethod === "manual"
      ? { roll: undefined, total: 0 }
      : choices.hpMethod === "roll"
        ? rollHpGain(classDef.hitDie, conModifier)
        : { roll: undefined, total: averageHpGain(classDef.hitDie, conModifier) };

  await db.insert(characterClasses).values({
    characterId,
    classId,
    className: className || classDef.name,
    level: 1,
    subclass: "",
    sortOrder: existingRows.length,
  });

  const characterUpdates: Partial<Character> = {
    maxHp: character.maxHp + gain.total,
    currentHp: character.currentHp + gain.total,
    // A new level (in any class) grants one more (unspent) Hit Die to the
    // pool, same invariant `levelUp` maintains -- which specific die type
    // was just added isn't tracked (hitDiceRemaining is still a single
    // undifferentiated pool, same simplification noted on the schema
    // column until multiclass hit dice are modeled).
    hitDiceRemaining: character.hitDiceRemaining + 1,
  };
  if (isCustomClass) {
    characterUpdates.customClassHitDie = characterForClassDef.customClassHitDie;
    characterUpdates.customClassSavingThrows = characterForClassDef.customClassSavingThrows;
    characterUpdates.customClassArmorProficiencies = characterForClassDef.customClassArmorProficiencies;
    characterUpdates.customClassWeaponProficiencies = characterForClassDef.customClassWeaponProficiencies;
  }
  if (choices.homebrewFeatures && choices.homebrewFeatures.length > 0) {
    characterUpdates.featuresAndTraits = appendHomebrewFeatures(
      character.featuresAndTraits,
      1,
      choices.homebrewFeatures
    );
  }
  await updateCharacter(characterId, characterUpdates);

  await applySpellSlotUpdates(characterId, choices);

  const rows = await syncCharacterClassMirror(characterId);
  const totalLevel = rows.reduce((sum, row) => sum + row.level, 0);

  const progression = getClassProgression(character.ruleset, classId);
  const featuresGained = isCustomClass
    ? (choices.homebrewFeatures ?? []).map((f) => ({ ...f, level: 1, source: "class" as const }))
    : progression
      ? featuresGainedAtLevel(progression, 1, "")
      : [];

  return {
    newLevel: 1,
    totalLevel,
    hpGain: gain.total,
    roll: gain.roll,
    proficiencyBonus: proficiencyBonusForLevel(totalLevel),
    featuresGained,
  };
}

/**
 * Adds a level to a class the character already has (the multiclass-aware
 * equivalent of `levelUp` in characterRepo.ts, parameterized by which class
 * is gaining the level). Subclass/ASI/feature lookups resolve against that
 * class's own progression and own new level -- 5e multiclass breakpoints
 * (subclass-choice level, ASI levels) are per-class-level, not per total
 * character level. Returns undefined if the character or that class row
 * doesn't exist.
 */
export async function levelUpClass(
  characterId: number,
  classId: string,
  choices: LevelUpChoices
): Promise<ClassLevelOutcome | undefined> {
  const character = await getCharacter(characterId);
  if (!character) return undefined;

  const rows = await listCharacterClasses(characterId);
  const row = rows.find((r) => r.classId === classId);
  if (!row) return undefined;

  const classDef = classDefinitionForRow(character, classId);
  const conModifier = abilityModifier(character.constitution);
  const newClassLevel = row.level + 1;

  const gain =
    choices.hpMethod === "manual"
      ? { roll: undefined, total: 0 }
      : choices.hpMethod === "roll"
        ? rollHpGain(classDef.hitDie, conModifier)
        : { roll: undefined, total: averageHpGain(classDef.hitDie, conModifier) };

  await db
    .update(characterClasses)
    .set({
      level: newClassLevel,
      ...(choices.subclassId ? { subclass: choices.subclassId } : {}),
    })
    .where(eq(characterClasses.id, row.id));

  const characterUpdates: Partial<Character> = {
    maxHp: character.maxHp + gain.total,
    currentHp: character.currentHp + gain.total,
    hitDiceRemaining: character.hitDiceRemaining + 1,
  };
  applyAsiChoice(character, characterUpdates, choices);
  if (choices.homebrewFeatures && choices.homebrewFeatures.length > 0) {
    characterUpdates.featuresAndTraits = appendHomebrewFeatures(
      character.featuresAndTraits,
      newClassLevel,
      choices.homebrewFeatures
    );
  }
  await updateCharacter(characterId, characterUpdates);

  if (choices.asiChoice?.type === "feat") {
    await addResolvedFeat(character, choices.asiChoice.feat);
  }

  await applySpellSlotUpdates(characterId, choices);

  const updatedRows = await syncCharacterClassMirror(characterId);
  const totalLevel = updatedRows.reduce((sum, r) => sum + r.level, 0);

  const progression = getClassProgression(character.ruleset, classId);
  const effectiveSubclass = choices.subclassId ?? row.subclass;
  const featuresGained = classId === CUSTOM_OPTION_ID
    ? (choices.homebrewFeatures ?? []).map((f) => ({ ...f, level: newClassLevel, source: "class" as const }))
    : progression
      ? featuresGainedAtLevel(progression, newClassLevel, effectiveSubclass)
      : [];

  return {
    newLevel: newClassLevel,
    totalLevel,
    hpGain: gain.total,
    roll: gain.roll,
    proficiencyBonus: proficiencyBonusForLevel(totalLevel),
    subclassChosen: choices.subclassId,
    featuresGained,
  };
}
