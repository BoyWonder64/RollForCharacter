/**
 * Full dice-expression evaluator: dice with modifiers, arithmetic, parentheses.
 *
 * Grammar
 *   expr     := term (("+" | "-") term)*
 *   term     := unary (("*" | "/") unary)*       "/" rounds down
 *   unary    := "-" unary | primary
 *   primary  := number | dice | "(" expr ")"
 *   dice     := [count] "d" (sides | "%") modifier*
 *   modifier := ("kh"|"kl"|"k")[n]   keep highest / lowest n (default 1; "k" = "kh")
 *             | ("dh"|"dl")[n]       drop highest / lowest n (default 1)
 *             | "r" cmp n            reroll until the die no longer matches
 *             | "ro" cmp n           reroll once
 *             | "min" n              treat any lower face as n
 *             | "!" [cmp n]          explode (default: on the max face)
 *   cmp      := "<=" | ">=" | "<" | ">" | "="  (default "=")
 *
 * D&D examples: 2d20kh1 (advantage), 2d20kl1 (disadvantage), 4d6dl1 or 4d6kh3
 * (ability scores), 2d6r<=2 / 2d6ro<=2 (Great Weapon Fighting), 1d6min2.
 *
 * Takes the die roller as a parameter so diceEngine's override modes (nat20,
 * seeded, ...) keep working, and so diceEngine can import this without a cycle.
 */

export class InvalidDiceExpressionError extends Error {}

export type AdvancedRollResult = {
  total: number;
  breakdown: string;
  /** Kept dice only; dropped dice never count toward nat-20/nat-1 checks. */
  rolls: { sides: number; value: number }[];
  diceCount: number;
};

type Comparator = "=" | "<" | ">" | "<=" | ">=";
type Condition = { cmp: Comparator; value: number };
type KeepDrop = { kind: "kh" | "kl" | "dh" | "dl"; n: number };

type Node = { value: number; text: string };

const MAX_DICE = 100;
const MAX_SIDES = 1000;
const MAX_EXPLOSIONS = 20;
const MAX_REROLLS = 100;
const MAX_DEPTH = 20;

function matches(value: number, condition: Condition): boolean {
  switch (condition.cmp) {
    case "<":
      return value < condition.value;
    case ">":
      return value > condition.value;
    case "<=":
      return value <= condition.value;
    case ">=":
      return value >= condition.value;
    default:
      return value === condition.value;
  }
}

class Evaluator {
  private pos = 0;
  private depth = 0;
  diceCount = 0;
  readonly rolls: { sides: number; value: number }[] = [];

  constructor(
    private readonly source: string,
    private readonly rollDie: (sides: number) => number
  ) {}

  evaluate(): Node {
    const node = this.parseExpr();
    this.skipSpace();
    if (this.pos < this.source.length) this.fail();
    if (this.diceCount === 0) {
      throw new InvalidDiceExpressionError(`"${this.source}" has no dice to roll`);
    }
    return node;
  }

  private fail(): never {
    throw new InvalidDiceExpressionError(`"${this.source}" is not a valid dice expression`);
  }

  private skipSpace(): void {
    while (this.pos < this.source.length && /\s/.test(this.source[this.pos])) this.pos++;
  }

  private peek(): string {
    this.skipSpace();
    return this.source[this.pos] ?? "";
  }

  private parseExpr(): Node {
    let left = this.parseTerm();
    for (;;) {
      const op = this.peek();
      if (op !== "+" && op !== "-") return left;
      this.pos++;
      const right = this.parseTerm();
      left =
        op === "+"
          ? { value: left.value + right.value, text: `${left.text} + ${right.text}` }
          : { value: left.value - right.value, text: `${left.text} - ${right.text}` };
    }
  }

  private parseTerm(): Node {
    let left = this.parseUnary();
    for (;;) {
      const op = this.peek();
      if (op !== "*" && op !== "/") return left;
      this.pos++;
      const right = this.parseUnary();
      if (op === "*") {
        left = { value: left.value * right.value, text: `${left.text} × ${right.text}` };
      } else {
        if (right.value === 0) {
          throw new InvalidDiceExpressionError(`"${this.source}" divides by zero`);
        }
        left = { value: Math.floor(left.value / right.value), text: `${left.text} ÷ ${right.text}` };
      }
    }
  }

  private parseUnary(): Node {
    if (this.peek() === "-") {
      this.pos++;
      const inner = this.parseUnary();
      return { value: -inner.value, text: `-${inner.text}` };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Node {
    const ch = this.peek();
    if (ch === "(") {
      if (++this.depth > MAX_DEPTH) this.fail();
      this.pos++;
      const inner = this.parseExpr();
      if (this.peek() !== ")") this.fail();
      this.pos++;
      this.depth--;
      return { value: inner.value, text: `(${inner.text})` };
    }
    if (/\d/.test(ch)) {
      const n = this.readInt();
      if (/[dD]/.test(this.source[this.pos] ?? "") && this.diceFollows()) return this.parseDice(n);
      return { value: n, text: String(n) };
    }
    if (/[dD]/.test(ch) && this.diceFollows()) return this.parseDice(1);
    return this.fail();
  }

  /** True if the "d" at `pos` begins a die (followed by sides or "%"). */
  private diceFollows(): boolean {
    return /[\d%]/.test(this.source[this.pos + 1] ?? "");
  }

  private readInt(): number {
    const start = this.pos;
    while (/\d/.test(this.source[this.pos] ?? "")) this.pos++;
    if (this.pos === start) this.fail();
    return parseInt(this.source.slice(start, this.pos), 10);
  }

  private readOptionalInt(fallback: number): number {
    return /\d/.test(this.source[this.pos] ?? "") ? this.readInt() : fallback;
  }

  private readCondition(defaultCmp: Comparator | null): Condition | null {
    const two = this.source.slice(this.pos, this.pos + 2);
    let cmp: Comparator | null = null;
    if (two === "<=" || two === ">=") {
      cmp = two;
      this.pos += 2;
    } else if (["<", ">", "="].includes(this.source[this.pos] ?? "")) {
      cmp = this.source[this.pos] as Comparator;
      this.pos++;
    }
    if (cmp === null) {
      if (!/\d/.test(this.source[this.pos] ?? "") || defaultCmp === null) return null;
      cmp = defaultCmp;
    }
    return { cmp, value: this.readInt() };
  }

  private parseDice(count: number): Node {
    this.pos++; // the "d"
    let sides: number;
    if (this.source[this.pos] === "%") {
      this.pos++;
      sides = 100;
    } else {
      sides = this.readInt();
    }
    if (count < 1 || count > MAX_DICE || sides < 1 || sides > MAX_SIDES) {
      throw new InvalidDiceExpressionError(
        `"${this.source}" uses too many dice or too many sides (max ${MAX_DICE} dice, d${MAX_SIDES})`
      );
    }

    let reroll: { condition: Condition; once: boolean } | null = null;
    let minimum: number | null = null;
    let explode: Condition | null | undefined;
    const keepDrops: KeepDrop[] = [];
    const notationStart = this.pos;

    for (;;) {
      const rest = this.source.slice(this.pos).toLowerCase();
      if (rest.startsWith("kh") || rest.startsWith("kl") || rest.startsWith("dh") || rest.startsWith("dl")) {
        const kind = rest.slice(0, 2) as KeepDrop["kind"];
        this.pos += 2;
        keepDrops.push({ kind, n: this.readOptionalInt(1) });
      } else if (rest.startsWith("k")) {
        this.pos += 1;
        keepDrops.push({ kind: "kh", n: this.readOptionalInt(1) });
      } else if (rest.startsWith("min")) {
        this.pos += 3;
        minimum = this.readInt();
      } else if (rest.startsWith("ro") || rest.startsWith("r")) {
        const once = rest.startsWith("ro");
        this.pos += once ? 2 : 1;
        const condition = this.readCondition("=");
        if (!condition) this.fail();
        reroll = { condition, once };
      } else if (rest.startsWith("!")) {
        this.pos += 1;
        explode = this.readCondition("=") ?? { cmp: "=", value: sides };
      } else {
        break;
      }
    }
    const notation = `${count}d${sides}${this.source.slice(notationStart, this.pos).replace(/\s+/g, "")}`;
    this.diceCount += count;

    // Generate every die (with rerolls, minimums and explosions) into one pool.
    const pool: { value: number; kept: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      let explosions = 0;
      let isExtra = false;
      do {
        let value = this.rollDie(sides);
        if (reroll) {
          let tries = 0;
          const limit = reroll.once ? 1 : MAX_REROLLS;
          while (matches(value, reroll.condition) && tries < limit) {
            value = this.rollDie(sides);
            tries++;
          }
        }
        if (minimum !== null) value = Math.max(value, minimum);
        pool.push({ value, kept: true });
        isExtra = explode != null && matches(value, explode) && ++explosions <= MAX_EXPLOSIONS;
      } while (isExtra);
    }

    for (const { kind, n } of keepDrops) {
      const alive = pool.filter((die) => die.kept).sort((a, b) => a.value - b.value);
      const amount = Math.min(n, alive.length);
      const lowest = alive.slice(0, amount);
      const highest = alive.slice(alive.length - amount);
      if (kind === "dl") lowest.forEach((die) => (die.kept = false));
      else if (kind === "dh") highest.forEach((die) => (die.kept = false));
      else if (kind === "kh") alive.slice(0, alive.length - amount).forEach((die) => (die.kept = false));
      else alive.slice(amount).forEach((die) => (die.kept = false));
    }

    let value = 0;
    for (const die of pool) {
      if (!die.kept) continue;
      value += die.value;
      this.rolls.push({ sides, value: die.value });
    }
    const faces = pool.map((die) => (die.kept ? String(die.value) : `~${die.value}~`)).join(", ");
    return { value, text: `${notation} (${faces})` };
  }
}

/** Rolls `expression`. Throws `InvalidDiceExpressionError` if it can't be parsed. */
export function evaluateDiceExpression(
  expression: string,
  rollDie: (sides: number) => number
): AdvancedRollResult {
  const evaluator = new Evaluator(expression, rollDie);
  const node = evaluator.evaluate();
  return {
    total: node.value,
    breakdown: node.text,
    rolls: evaluator.rolls,
    diceCount: evaluator.diceCount,
  };
}

/** True if `expression` parses (and contains at least one die). Rolls nothing random. */
export function isValidDiceExpression(expression: string): boolean {
  try {
    evaluateDiceExpression(expression, () => 1);
    return true;
  } catch (error) {
    if (error instanceof InvalidDiceExpressionError) return false;
    throw error;
  }
}
