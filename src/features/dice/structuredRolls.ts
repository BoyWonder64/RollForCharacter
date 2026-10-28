import { getRulesetCatalog } from "../../data/rulesets";
import {
  ABILITY_LABELS,
  abilityModifier,
  getClassDefinitionForCharacter,
  initiativeModifier,
  isSavingThrowProficient,
  isSkillProficient,
  type CharacterFeat,
} from "../characters/characterCalculations";
import type { AbilityScoreKey, Character } from "../../types/models";
import { rollDie, type RollResult } from "./diceEngine";

export type RollMode = "check" | "save" | "attack" | "spell" | "initiative";
export type AdvantageMode = "normal" | "advantage" | "disadvantage";

export type StructuredRollInput = {
  mode: RollMode;
  character: Character;
  /** This character's feats -- only "initiative" and a skill-based "check" currently fold any of these in (Alert's initiative bonus, a feat-granted skill proficiency). Defaults to none. */
  feats?: CharacterFeat[];
  /** Ignored for "spell" (the class's spellcasting ability is used instead). */
  ability?: AbilityScoreKey;
  /** "check" mode only: a specific skill (e.g. "perception") instead of a raw ability. Overrides `ability`/`proficient`. */
  skillId?: string;
  /** "check"/"attack" only -- "save", "spell", and a skill-based check derive proficiency automatically. */
  proficient?: boolean;
  extraModifier?: number;
  advantageMode: AdvantageMode;
};

export type StructuredRollPlan = {
  label: string;
  modifier: number;
  modifierBreakdown: string;
};

const FALLBACK_SPELLCASTING_ABILITIES: AbilityScoreKey[] = ["intelligence", "wisdom", "charisma"];

/**
 * A class's defined spellcasting ability if it has one, otherwise the
 * highest of the three mental stats. Falling back like this (instead of
 * refusing) lets non-caster classes still roll/cast spells they picked up
 * from a feat, magic item, or homebrew -- any class can end up with a spell
 * or two, not just the ones with a dedicated spellcasting progression.
 */
export function getSpellcastingAbility(character: Character): AbilityScoreKey {
  const classAbility = getClassDefinitionForCharacter(character).spellcastingAbility;
  if (classAbility) return classAbility;
  return FALLBACK_SPELLCASTING_ABILITIES.reduce((best, ability) =>
    character[ability] > character[best] ? ability : best
  );
}

export function spellSaveDc(character: Character): number {
  const ability = getSpellcastingAbility(character);
  return 8 + character.proficiencyBonus + abilityModifier(character[ability]);
}

/**
 * Computes the flat modifier + a human label for a structured roll. Returns
 * `{ error }` instead when the roll can't be built (e.g. a non-caster asked
 * for a spell attack) so the screen can show why, rather than silently
 * rolling a wrong number.
 */
export function buildStructuredRollPlan(
  input: StructuredRollInput
): StructuredRollPlan | { error: string } {
  const { mode, character, extraModifier = 0, feats = [] } = input;
  const parts: string[] = [];
  let modifier = 0;
  let label: string;

  const pushPart = (value: number, label: string) => {
    parts.push(`${value >= 0 ? "+" : "-"} ${Math.abs(value)} (${label})`);
  };

  if (mode === "spell") {
    const ability = getSpellcastingAbility(character);
    const mod = abilityModifier(character[ability]);
    modifier += mod + character.proficiencyBonus;
    pushPart(mod, ABILITY_LABELS[ability]);
    pushPart(character.proficiencyBonus, "Proficiency");
    label = "Spell Attack";
  } else if (mode === "initiative") {
    const mod = initiativeModifier(character, feats);
    modifier += mod;
    pushPart(mod, ABILITY_LABELS.dexterity);
    label = "Initiative";
  } else if (mode === "check" && input.skillId) {
    const skill = getRulesetCatalog(character.ruleset).skills.find((s) => s.id === input.skillId);
    if (!skill) return { error: "Unknown skill." };
    const mod = abilityModifier(character[skill.ability]);
    modifier += mod;
    pushPart(mod, ABILITY_LABELS[skill.ability]);
    if (isSkillProficient(character, skill.id, feats)) {
      modifier += character.proficiencyBonus;
      pushPart(character.proficiencyBonus, "Proficiency");
    }
    label = `${skill.name} Check`;
  } else {
    const ability = input.ability;
    if (!ability) return { error: "Choose an ability first." };
    const mod = abilityModifier(character[ability]);
    modifier += mod;
    pushPart(mod, ABILITY_LABELS[ability]);

    if (mode === "save") {
      if (isSavingThrowProficient(character, ability, feats)) {
        modifier += character.proficiencyBonus;
        pushPart(character.proficiencyBonus, "Proficiency");
      }
      label = `${ABILITY_LABELS[ability]} Save`;
    } else if (mode === "check") {
      if (input.proficient) {
        modifier += character.proficiencyBonus;
        pushPart(character.proficiencyBonus, "Proficiency");
      }
      label = `${ABILITY_LABELS[ability]} Check`;
    } else {
      if (input.proficient) {
        modifier += character.proficiencyBonus;
        pushPart(character.proficiencyBonus, "Proficiency");
      }
      label = `${ABILITY_LABELS[ability]} Attack`;
    }
  }

  if (extraModifier) {
    modifier += extraModifier;
    pushPart(extraModifier, "Bonus");
  }

  return { label, modifier, modifierBreakdown: parts.join(" ") };
}

export type D20Roll = {
  dice: number[];
  used: number;
  modifier: number;
  total: number;
};

export function rollD20(advantageMode: AdvantageMode, modifier: number): D20Roll {
  const first = rollDie(20);
  if (advantageMode === "normal") {
    return { dice: [first], used: first, modifier, total: first + modifier };
  }
  const second = rollDie(20);
  const used = advantageMode === "advantage" ? Math.max(first, second) : Math.min(first, second);
  return { dice: [first, second], used, modifier, total: used + modifier };
}

export function structuredRollToResult(
  plan: StructuredRollPlan,
  roll: D20Roll,
  advantageMode: AdvantageMode
): RollResult {
  const suffix = advantageMode === "normal" ? "" : ` (${advantageMode})`;
  const diceLabel =
    roll.dice.length === 1
      ? `1d20 (${roll.dice[0]})`
      : `2d20 (${roll.dice.join(", ")}) → ${roll.used}`;
  const breakdown = [diceLabel, plan.modifierBreakdown].filter(Boolean).join(" ");
  return {
    expression: `${plan.label}${suffix}`,
    total: roll.total,
    breakdown,
    rolls: roll.dice.map((value) => ({ sides: 20, value })),
  };
}

export type NaturalD20Flag = "nat1" | "nat20" | null;

/** A natural 1 or 20 on the die that actually determines the roll (the "used" die under advantage/disadvantage). */
export function naturalD20Flag(usedValue: number): NaturalD20Flag {
  if (usedValue === 1) return "nat1";
  if (usedValue === 20) return "nat20";
  return null;
}

/**
 * For a freeform roll with no single clear "the d20": flags a nat 1/20 only
 * when exactly one d20 was rolled (e.g. "1d20+5"). Ambiguous for something
 * like "2d20", so that's deliberately left unflagged rather than guessed.
 */
export function detectSingleD20Flag(rolls: { sides: number; value: number }[]): NaturalD20Flag {
  const d20s = rolls.filter((r) => r.sides === 20);
  if (d20s.length !== 1) return null;
  return naturalD20Flag(d20s[0].value);
}
