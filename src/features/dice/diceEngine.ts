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

export class InvalidDiceExpressionError extends Error {}

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

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollExpression(expression: string): RollResult {
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
