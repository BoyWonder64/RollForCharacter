import {
  evaluateDiceExpression,
  InvalidDiceExpressionError,
  isValidDiceExpression,
} from "./advancedDice";

export type DiceTerm = {
  count: number;
  sides: number;
};

export type ParsedExpression = {
  terms: DiceTerm[];
  modifier: number;
};

const EXPRESSION_PATTERN = /^\s*(\d*d\d+(?:\s*[+-]\s*\d*d\d+)*)(\s*[+-]\s*\d+)?\s*$/i;
const TERM_PATTERN = /([+-]?)\s*(\d*)d(\d+)/gi;

export { InvalidDiceExpressionError, isValidDiceExpression };

/**
 * Parses only the simple `NdS ± NdS ± N` form, as structured terms. Anything
 * richer (keep/drop, rerolls, parentheses, ...) is handled by `rollExpression`
 * and `isValidDiceExpression`; see advancedDice.ts for the notation.
 */
export function parseDiceExpression(expression: string): ParsedExpression {
  const trimmed = expression.trim();
  if (!EXPRESSION_PATTERN.test(trimmed)) {
    throw new InvalidDiceExpressionError(`"${expression}" is not a valid dice expression`);
  }

  const terms: DiceTerm[] = [];
  let match: RegExpExecArray | null;
  TERM_PATTERN.lastIndex = 0;
  while ((match = TERM_PATTERN.exec(trimmed)) !== null) {
    const sign = match[1] === "-" ? -1 : 1;
    const count = match[2] ? parseInt(match[2], 10) : 1;
    const sides = parseInt(match[3], 10);
    terms.push({ count: count * sign, sides });
  }

  const modifierMatch = trimmed.match(/([+-]\s*\d+)\s*$/);
  const modifier = modifierMatch
    ? parseInt(modifierMatch[1].replace(/\s/g, ""), 10)
    : 0;

  return { terms, modifier };
}

export type RollResult = {
  expression: string;
  total: number;
  breakdown: string;
  rolls: { sides: number; value: number }[];
};

/**
 * Developer-mode dice control. "random" is normal play. The others exist so
 * features like crit stingers and nat-1 handling can be tested on demand.
 *  - nat20 / nat1: every d20 comes up 20 / 1, other dice stay random.
 *  - max / min: every die comes up its highest / lowest face.
 *  - seeded: a repeatable sequence from `seed`.
 */
export type DiceOverrideMode = "random" | "nat20" | "nat1" | "max" | "min" | "seeded";

export const DICE_OVERRIDE_MODES: { key: DiceOverrideMode; label: string; description: string }[] = [
  {
    key: "random",
    label: "Random",
    description: "Normal play. Each die lands on a random face, all faces equally likely.",
  },
  {
    key: "nat20",
    label: "Nat 20",
    description:
      "Every d20 comes up 20, so you can test crits and the nat 20 sound. Other dice (damage, hit dice) stay random.",
  },
  {
    key: "nat1",
    label: "Nat 1",
    description:
      "Every d20 comes up 1, so you can test fumbles and the nat 1 sound. Other dice stay random.",
  },
  {
    key: "max",
    label: "Max",
    description: "Every die of every size lands on its highest face (d6 = 6, d12 = 12, d20 = 20).",
  },
  {
    key: "min",
    label: "Min",
    description: "Every die of every size lands on 1.",
  },
  {
    key: "seeded",
    label: "Seeded",
    description:
      "Rolls still look random but follow a fixed sequence set by the seed number. The same seed gives the same rolls in the same order, so you can reproduce a bug. Restart sequence replays it from the start.",
  },
];

let overrideMode: DiceOverrideMode = "random";
// null = use Math.random directly (looked up per call so test spies still work).
let seededRandom: (() => number) | null = null;

/** mulberry32: small, fast, deterministic PRNG. */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sets the override. Calling with "seeded" restarts the sequence from `seed`. */
export function setDiceOverride(mode: DiceOverrideMode, seed = 1): void {
  overrideMode = mode;
  seededRandom = mode === "seeded" ? createSeededRandom(seed) : null;
}

export function getDiceOverrideMode(): DiceOverrideMode {
  return overrideMode;
}

export function rollDie(sides: number): number {
  switch (overrideMode) {
    case "nat20":
      if (sides === 20) return 20;
      break;
    case "nat1":
      if (sides === 20) return 1;
      break;
    case "max":
      return sides;
    case "min":
      return 1;
  }
  return Math.floor((seededRandom ? seededRandom() : Math.random()) * sides) + 1;
}

export function rollExpression(expression: string): RollResult {
  if (!EXPRESSION_PATTERN.test(expression.trim())) {
    const result = evaluateDiceExpression(expression, rollDie);
    return { expression, total: result.total, breakdown: result.breakdown, rolls: result.rolls };
  }
  const { terms, modifier } = parseDiceExpression(expression);

  const rolls: { sides: number; value: number }[] = [];
  let total = 0;

  for (const term of terms) {
    const count = Math.abs(term.count);
    const sign = term.count < 0 ? -1 : 1;
    for (let i = 0; i < count; i++) {
      const value = rollDie(term.sides);
      rolls.push({ sides: term.sides, value });
      total += value * sign;
    }
  }

  total += modifier;

  const rollsBySign: Record<string, number[]> = {};
  let rollIndex = 0;
  for (const term of terms) {
    const count = Math.abs(term.count);
    const sign = term.count < 0 ? "-" : "+";
    const key = `${sign}d${term.sides}`;
    rollsBySign[key] = rollsBySign[key] ?? [];
    for (let i = 0; i < count; i++) {
      rollsBySign[key].push(rolls[rollIndex].value);
      rollIndex++;
    }
  }

  const breakdownParts = Object.entries(rollsBySign).map(([key, values], index) => {
    const sign = key[0];
    const sides = key.slice(2);
    const term = `${values.length}d${sides} (${values.join(", ")})`;
    return index === 0 && sign === "+" ? term : `${sign} ${term}`;
  });
  if (modifier !== 0) {
    breakdownParts.push(`${modifier > 0 ? "+" : "-"} ${Math.abs(modifier)}`);
  }

  return {
    expression,
    total,
    breakdown: breakdownParts.join(" "),
    rolls,
  };
}
