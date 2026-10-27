import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { characters } from "../../db/schema";
import type { AbilityScoreKey, Character } from "../../types/models";
import {
  ABILITY_LABELS,
  abilityModifier,
  averageHpGain,
  featuresGainedAtLevel,
  getClassDefinitionForCharacter,
  getClassProgressionForCharacter,
  parseConditions,
  parseFeats,
  proficiencyBonusForLevel,
  rollHpGain,
  serializeConditions,
  serializeFeats,
  serializeLanguages,
  serializeSkillProficiencies,
  type FeatureGrant,
} from "./characterCalculations";
import { MAX_EXHAUSTION_LEVEL } from "../../data/conditions";
import { rollExpression, type RollResult } from "../dice/diceEngine";
import { saveRoll } from "../dice/diceRepo";
import { resetSpellSlotUsage, setSpellSlot } from "../spells/spellRepo";

export { ABILITY_LABELS, abilityModifier };

export async function listCharacters(): Promise<Character[]> {
  return db.select().from(characters).orderBy(characters.name);
}

export async function getCharacter(id: number): Promise<Character | undefined> {
  const rows = await db.select().from(characters).where(eq(characters.id, id));
  return rows[0];
}

export async function createCharacter(name: string): Promise<Character> {
  const rows = await db
    .insert(characters)
    .values({ name, maxHp: 10, currentHp: 10 })
    .returning();
  return rows[0];
}

export type OnboardingCharacterInput = {
  name: string;
  ruleset: string;
  race: string;
  className: string;
  background: string;
  alignment?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  otherProficiencies?: string;
  featuresAndTraits?: string;
  languages?: string[];
  level: number;
  maxHp: number;
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skillProficiencies?: string[];
  notes?: string;
  usesXp?: boolean;
  experiencePoints?: number;
};

export async function createCharacterFromOnboarding(
  input: OnboardingCharacterInput
): Promise<Character> {
  const rows = await db
    .insert(characters)
    .values({
      name: input.name,
      ruleset: input.ruleset,
      race: input.race,
      className: input.className,
      background: input.background,
      alignment: input.alignment ?? "",
      personalityTraits: input.personalityTraits ?? "",
      ideals: input.ideals ?? "",
      bonds: input.bonds ?? "",
      flaws: input.flaws ?? "",
      otherProficiencies: input.otherProficiencies ?? "",
      featuresAndTraits: input.featuresAndTraits ?? "",
      languages: serializeLanguages(input.languages ?? []),
      level: input.level,
      maxHp: input.maxHp,
      currentHp: input.maxHp,
      armorClass: input.armorClass,
      speed: input.speed,
      proficiencyBonus: input.proficiencyBonus,
      strength: input.strength,
      dexterity: input.dexterity,
      constitution: input.constitution,
      intelligence: input.intelligence,
      wisdom: input.wisdom,
      charisma: input.charisma,
      skillProficiencies: serializeSkillProficiencies(input.skillProficiencies ?? []),
      notes: input.notes ?? "",
      usesXp: input.usesXp ?? false,
      experiencePoints: input.experiencePoints ?? 0,
      hitDiceRemaining: input.level,
    })
    .returning();
  return rows[0];
}

export async function deleteCharacter(id: number): Promise<void> {
  await db.delete(characters).where(eq(characters.id, id));
}

export async function updateCharacter(
  id: number,
  changes: Partial<Omit<Character, "id" | "createdAt">>
): Promise<void> {
  await db
    .update(characters)
    .set({ ...changes, updatedAt: new Date().toISOString() })
    .where(eq(characters.id, id));
}

export async function adjustHp(id: number, delta: number): Promise<void> {
  const character = await getCharacter(id);
  if (!character) return;
  const nextHp = Math.max(0, Math.min(character.maxHp, character.currentHp + delta));
  await updateCharacter(id, { currentHp: nextHp });
}

export type ApplyDamageOutcome = {
  /** Set when the character was concentrating and survived the hit -- the sheet should prompt a CON save at this DC (10, or half the damage taken if higher) or lose concentration. */
  concentrationCheckDc?: number;
};

/**
 * Apply damage, 5e-aware: if the character is already at 0 HP, further
 * damage doesn't go negative -- it counts as a death save failure instead
 * (two if the hit is marked a critical). A hit that drops the character to
 * 0 HP breaks concentration outright (incapacitated, no save); a hit that
 * leaves them above 0 just calls for a concentration check, reported back
 * for the UI to prompt.
 */
export async function applyDamage(
  id: number,
  amount: number,
  options?: { critical?: boolean }
): Promise<ApplyDamageOutcome | undefined> {
  const character = await getCharacter(id);
  if (!character || amount <= 0) return undefined;

  if (character.currentHp <= 0) {
    const failureCount = options?.critical ? 2 : 1;
    const failures = Math.min(3, character.deathSaveFailures + failureCount);
    await updateCharacter(id, { deathSaveFailures: failures });
    return undefined;
  }

  const wasConcentrating = character.concentratingSpellName !== "";
  const nextHp = Math.max(0, character.currentHp - amount);

  if (wasConcentrating && nextHp === 0) {
    await updateCharacter(id, {
      currentHp: nextHp,
      concentratingSpellId: null,
      concentratingSpellName: "",
    });
    return undefined;
  }

  await updateCharacter(id, { currentHp: nextHp });

  if (wasConcentrating && nextHp > 0) {
    return { concentrationCheckDc: Math.max(10, Math.floor(amount / 2)) };
  }
  return undefined;
}

/** Heal, clamped to max HP. Waking from 0 HP clears death save progress. */
export async function applyHeal(id: number, amount: number): Promise<void> {
  const character = await getCharacter(id);
  if (!character || amount <= 0) return;

  const wasDown = character.currentHp <= 0;
  const nextHp = Math.min(character.maxHp, character.currentHp + amount);
  await updateCharacter(id, {
    currentHp: nextHp,
    ...(wasDown ? { deathSaveSuccesses: 0, deathSaveFailures: 0 } : {}),
  });
}

const CURRENCY_COLUMNS = {
  copper: "copperPieces",
  silver: "silverPieces",
  electrum: "electrumPieces",
  gold: "goldPieces",
  platinum: "platinumPieces",
} as const;

export type CurrencyDenomination = keyof typeof CURRENCY_COLUMNS;

/** Adjusts one currency denomination by `delta` (negative to spend), clamped at 0. */
export async function adjustCurrency(
  id: number,
  denomination: CurrencyDenomination,
  delta: number
): Promise<void> {
  const character = await getCharacter(id);
  if (!character || delta === 0) return;
  const column = CURRENCY_COLUMNS[denomination];
  const next = Math.max(0, character[column] + delta);
  await updateCharacter(id, { [column]: next } as Partial<Character>);
}

/** Toggles one condition (e.g. "poisoned") on/off the character's active-conditions checklist. */
export async function toggleCondition(id: number, conditionId: string): Promise<void> {
  const character = await getCharacter(id);
  if (!character) return;
  const active = parseConditions(character);
  const next = active.includes(conditionId)
    ? active.filter((c) => c !== conditionId)
    : [...active, conditionId];
  await updateCharacter(id, { conditions: serializeConditions(next) });
}

/** Sets exhaustion level, clamped to 5e's 0-6 range (6 = death). */
export async function setExhaustionLevel(id: number, level: number): Promise<void> {
  await updateCharacter(id, { exhaustionLevel: Math.max(0, Math.min(MAX_EXHAUSTION_LEVEL, level)) });
}

/** Flips the 5e Inspiration flag -- a DM-granted die the player can later spend for advantage. */
export async function toggleInspiration(id: number): Promise<void> {
  const character = await getCharacter(id);
  if (!character) return;
  await updateCharacter(id, { inspiration: !character.inspiration });
}

/** Adds (or subtracts, for corrections) XP, clamped at 0. No auto-leveling -- Level Up stays a separate, deliberate action. */
export async function addXp(id: number, delta: number): Promise<void> {
  const character = await getCharacter(id);
  if (!character || delta === 0) return;
  const next = Math.max(0, character.experiencePoints + delta);
  await updateCharacter(id, { experiencePoints: next });
}

export type HpGainMethod = "average" | "roll" | "manual";

export type AsiOrFeatChoice =
  | { type: "ability"; increases: Partial<Record<AbilityScoreKey, number>> }
  | { type: "feat"; feat: string };

export type LevelUpChoices = {
  hpMethod: HpGainMethod;
  /** Subclass id, only when this level is the class's subclass-choice level. */
  subclassId?: string;
  /** Only when this level grants an Ability Score Improvement / feat (or, for 3.5e, a feat-only/ability-only choice). */
  asiChoice?: AsiOrFeatChoice;
  /** New total slots per spell level (1-9), for classes whose spellcasting table changes at this level. */
  spellSlotUpdates?: { spellLevel: number; total: number }[];
};

export type LevelUpOutcome = {
  newLevel: number;
  hpGain: number;
  roll?: number;
  proficiencyBonus: number;
  subclassChosen?: string;
  featuresGained: FeatureGrant[];
};

/**
 * Increments a character's level by one and applies every choice the Level
 * Up workflow walked the player through: HP gain (method depends on
 * `choices.hpMethod`; "manual" leaves HP untouched for the player to set
 * via Edit instead), proficiency bonus (recomputed in case the new level
 * crosses a breakpoint), a subclass pick (only legal/expected at that
 * class's subclass-choice level), an Ability Score Improvement or feat
 * (ability increases are clamped at 20 per the 5e rule; feats are appended
 * as freeform text -- no structured feat catalog exists yet), and any
 * updated spell slot totals. Returns the newly-granted class/subclass
 * features too, so the UI can show them after the fact.
 */
export async function levelUp(
  id: number,
  choices: LevelUpChoices
): Promise<LevelUpOutcome | undefined> {
  const character = await getCharacter(id);
  if (!character) return undefined;

  const classDef = getClassDefinitionForCharacter(character);
  const conModifier = abilityModifier(character.constitution);
  const newLevel = character.level + 1;

  const gain =
    choices.hpMethod === "manual"
      ? { roll: undefined, total: 0 }
      : choices.hpMethod === "roll"
        ? rollHpGain(classDef.hitDie, conModifier)
        : { roll: undefined, total: averageHpGain(classDef.hitDie, conModifier) };

  const proficiencyBonus = proficiencyBonusForLevel(newLevel);

  const updates: Partial<Character> = {
    level: newLevel,
    maxHp: character.maxHp + gain.total,
    currentHp: character.currentHp + gain.total,
    proficiencyBonus,
    // A new level grants one more (unspent) Hit Die to the pool.
    hitDiceRemaining: character.hitDiceRemaining + 1,
  };

  if (choices.subclassId) {
    updates.subclass = choices.subclassId;
  }

  if (choices.asiChoice?.type === "ability") {
    for (const [key, amount] of Object.entries(choices.asiChoice.increases) as [
      AbilityScoreKey,
      number,
    ][]) {
      updates[key] = Math.min(20, character[key] + amount);
    }
  } else if (choices.asiChoice?.type === "feat") {
    updates.feats = serializeFeats([...parseFeats(character), choices.asiChoice.feat]);
  }

  await updateCharacter(id, updates);

  if (choices.spellSlotUpdates) {
    for (const { spellLevel, total } of choices.spellSlotUpdates) {
      await setSpellSlot(id, spellLevel, total);
    }
  }

  const progression = getClassProgressionForCharacter(character);
  const featuresGained = progression
    ? featuresGainedAtLevel(progression, newLevel, choices.subclassId ?? character.subclass)
    : [];

  return {
    newLevel,
    hpGain: gain.total,
    roll: gain.roll,
    proficiencyBonus,
    subclassChosen: choices.subclassId,
    featuresGained,
  };
}

export type DeathSaveResult = "stabilized" | "success" | "failure" | "dead";

export type DeathSaveOutcome = {
  roll: number;
  result: DeathSaveResult;
  successes: number;
  failures: number;
};

/**
 * Roll a 5e death saving throw (flat d20, no modifiers) for a character at
 * 0 HP: 10+ is a success, below 10 a failure, a natural 1 counts as two
 * failures, and a natural 20 wakes the character at 1 HP. Three successes
 * stabilizes them; three failures and they die. Logged to roll history via
 * the normal dice engine/repo so it shows up in the character's roll log.
 */
export async function rollDeathSave(id: number): Promise<DeathSaveOutcome | undefined> {
  const character = await getCharacter(id);
  if (!character) return undefined;

  const roll = rollExpression("1d20");
  await saveRoll(roll, id);
  const value = roll.total;

  if (value === 20) {
    await updateCharacter(id, {
      currentHp: 1,
      deathSaveSuccesses: 0,
      deathSaveFailures: 0,
    });
    return { roll: value, result: "stabilized", successes: 0, failures: 0 };
  }

  if (value === 1) {
    const failures = Math.min(3, character.deathSaveFailures + 2);
    await updateCharacter(id, { deathSaveFailures: failures });
    return {
      roll: value,
      result: failures >= 3 ? "dead" : "failure",
      successes: character.deathSaveSuccesses,
      failures,
    };
  }

  if (value >= 10) {
    const successes = Math.min(3, character.deathSaveSuccesses + 1);
    await updateCharacter(id, { deathSaveSuccesses: successes });
    return {
      roll: value,
      result: "success",
      successes,
      failures: character.deathSaveFailures,
    };
  }

  const failures = Math.min(3, character.deathSaveFailures + 1);
  await updateCharacter(id, { deathSaveFailures: failures });
  return {
    roll: value,
    result: failures >= 3 ? "dead" : "failure",
    successes: character.deathSaveSuccesses,
    failures,
  };
}

/** Starts concentrating on a spell, replacing any previous one -- 5e only allows concentrating on one spell at a time. */
export async function startConcentration(
  id: number,
  characterSpellId: number,
  spellName: string
): Promise<void> {
  await updateCharacter(id, {
    concentratingSpellId: characterSpellId,
    concentratingSpellName: spellName,
  });
}

/** Ends concentration, if any -- a deliberate stop, a failed concentration save, or dropping to 0 HP. */
export async function endConcentration(id: number): Promise<void> {
  await updateCharacter(id, { concentratingSpellId: null, concentratingSpellName: "" });
}

export type SpendHitDieOutcome = {
  roll: RollResult;
  healed: number;
  hitDiceRemaining: number;
};

/**
 * Spends one Hit Die during a short rest: rolls the class's hit die + CON
 * modifier (never healing less than 0), adds it to current HP (capped at
 * max), and removes one Hit Die from the pool. No-op if none remain.
 */
export async function spendHitDie(id: number): Promise<SpendHitDieOutcome | undefined> {
  const character = await getCharacter(id);
  if (!character || character.hitDiceRemaining <= 0) return undefined;

  const hitDie = getClassDefinitionForCharacter(character).hitDie;
  const conModifier = abilityModifier(character.constitution);
  const sign = conModifier >= 0 ? "+" : "-";
  const roll = rollExpression(`1d${hitDie}${sign}${Math.abs(conModifier)}`);
  await saveRoll(roll, id);

  const healed = Math.max(0, roll.total);
  const nextHp = Math.min(character.maxHp, character.currentHp + healed);
  const hitDiceRemaining = character.hitDiceRemaining - 1;
  await updateCharacter(id, { currentHp: nextHp, hitDiceRemaining });

  return { roll, healed, hitDiceRemaining };
}

export type LongRestOutcome = {
  hpRestored: number;
  hitDiceRestored: number;
};

/**
 * 5e long rest: full HP restore, regain half the total Hit Dice pool
 * (rounded down, minimum 1, capped at the pool's max), every spell slot
 * refreshed, one level of exhaustion removed, and death save progress
 * cleared.
 */
export async function longRest(id: number): Promise<LongRestOutcome | undefined> {
  const character = await getCharacter(id);
  if (!character) return undefined;

  const hpRestored = character.maxHp - character.currentHp;
  const hitDiceRegain = Math.max(1, Math.floor(character.level / 2));
  const hitDiceRestored = Math.min(
    character.level - character.hitDiceRemaining,
    hitDiceRegain
  );

  await updateCharacter(id, {
    currentHp: character.maxHp,
    hitDiceRemaining: character.hitDiceRemaining + hitDiceRestored,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    exhaustionLevel: Math.max(0, character.exhaustionLevel - 1),
  });
  await resetSpellSlotUsage(id);

  return { hpRestored, hitDiceRestored };
}
