import { abilityModifier } from "../characters/characterCalculations";
import type { Character } from "../../types/models";
import { InvalidDiceExpressionError, parseDiceExpression } from "./diceEngine";

/**
 * A dice expression that may also name character values, e.g. Second Wind's
 * "1d10 + level" or a Bardic-style "1d6 + cha". `level` is total character
 * level, `prof` the proficiency bonus, and str/dex/con/int/wis/cha the ability
 * MODIFIERS. Everything else must already be plain dice math that
 * `parseDiceExpression` accepts.
 */
const TOKEN_PATTERN = /\b(level|prof|str|dex|con|int|wis|cha)\b/gi;

export const ROLL_FORMULA_TOKENS = ["level", "prof", "str", "dex", "con", "int", "wis", "cha"] as const;

function tokenValue(token: string, character: Character): number {
  switch (token.toLowerCase()) {
    case "level":
      return character.level;
    case "prof":
      return character.proficiencyBonus;
    case "str":
      return abilityModifier(character.strength);
    case "dex":
      return abilityModifier(character.dexterity);
    case "con":
      return abilityModifier(character.constitution);
    case "int":
      return abilityModifier(character.intelligence);
    case "wis":
      return abilityModifier(character.wisdom);
    default:
      return abilityModifier(character.charisma);
  }
}

/** Sums every trailing flat bonus so "1d10 + 5 + -1" collapses to a single modifier the dice parser accepts. */
function normalizeFlatTerms(expression: string): string {
  const parts = expression.replace(/\s+/g, "").match(/[+-]?[^+-]+/g) ?? [];
  const diceParts: string[] = [];
  let flat = 0;
  for (const part of parts) {
    if (/d/i.test(part)) diceParts.push(part);
    else flat += Number(part);
  }
  if (diceParts.length === 0 || Number.isNaN(flat)) return expression;
  const dice = diceParts.map((p, i) => (i === 0 ? p.replace(/^\+/, "") : p)).join(" ");
  return flat === 0 ? dice : `${dice} ${flat > 0 ? "+" : "-"} ${Math.abs(flat)}`;
}

/** Substitutes the character's values into `formula` and returns a plain dice expression. Throws `InvalidDiceExpressionError` if the result isn't one. */
export function resolveRollFormula(formula: string, character: Character): string {
  // A negative modifier substitutes as "+ -1"; the two replaces below fold double signs before normalizing.
  const substituted = formula.replace(TOKEN_PATTERN, (token) => String(tokenValue(token, character)));
  const normalized = normalizeFlatTerms(substituted.replace(/\+\s*-/g, "- ").replace(/-\s*-/g, "+ "));
  parseDiceExpression(normalized);
  return normalized;
}

/** True if `formula` would resolve to a valid dice expression for some character. Used by the form to enable Save. */
export function isValidRollFormula(formula: string): boolean {
  if (!formula.trim()) return false;
  try {
    parseDiceExpression(normalizeFlatTerms(formula.replace(TOKEN_PATTERN, "1")));
    return true;
  } catch (error) {
    if (error instanceof InvalidDiceExpressionError) return false;
    throw error;
  }
}
