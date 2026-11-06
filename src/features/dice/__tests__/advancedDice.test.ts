import {
  evaluateDiceExpression,
  InvalidDiceExpressionError,
  isValidDiceExpression,
} from "../advancedDice";

/** A roller that returns the given faces in order, then repeats the last one. */
function sequence(...faces: number[]) {
  let i = 0;
  return () => faces[Math.min(i++, faces.length - 1)];
}

describe("keep / drop", () => {
  it("2d20kh1 keeps the higher die (advantage)", () => {
    const r = evaluateDiceExpression("2d20kh1", sequence(7, 15));
    expect(r.total).toBe(15);
    expect(r.rolls).toEqual([{ sides: 20, value: 15 }]);
    expect(r.breakdown).toBe("2d20kh1 (~7~, 15)");
  });

  it("2d20kl1 keeps the lower die (disadvantage)", () => {
    const r = evaluateDiceExpression("2d20kl1", sequence(7, 15));
    expect(r.total).toBe(7);
    expect(r.rolls).toEqual([{ sides: 20, value: 7 }]);
  });

  it("k is shorthand for kh", () => {
    expect(evaluateDiceExpression("2d20k1", sequence(3, 9)).total).toBe(9);
  });

  it("4d6kh3 and 4d6dl1 both drop the lowest die", () => {
    expect(evaluateDiceExpression("4d6kh3", sequence(5, 3, 6, 1)).total).toBe(14);
    expect(evaluateDiceExpression("4d6dl1", sequence(5, 3, 6, 1)).total).toBe(14);
  });

  it("dh drops the highest die", () => {
    expect(evaluateDiceExpression("3d6dh1", sequence(2, 6, 4)).total).toBe(6);
  });

  it("keeps the nat-20 check honest: dropped dice are not in rolls", () => {
    const r = evaluateDiceExpression("2d20kl1", sequence(20, 4));
    expect(r.rolls).toEqual([{ sides: 20, value: 4 }]);
  });

  it("keeping more dice than rolled keeps them all", () => {
    expect(evaluateDiceExpression("2d6kh5", sequence(2, 3)).total).toBe(5);
  });
});

describe("rerolls and minimums", () => {
  it("r<=2 rerolls until above 2 (Great Weapon Fighting)", () => {
    const r = evaluateDiceExpression("1d6r<=2", sequence(1, 2, 5));
    expect(r.total).toBe(5);
  });

  it("ro<=2 rerolls only once", () => {
    const r = evaluateDiceExpression("1d6ro<=2", sequence(1, 2, 5));
    expect(r.total).toBe(2);
  });

  it("r1 rerolls exactly 1s", () => {
    expect(evaluateDiceExpression("2d6r1", sequence(1, 4, 3)).total).toBe(7);
  });

  it("an always-matching reroll terminates", () => {
    expect(evaluateDiceExpression("1d6r>=1", () => 3).total).toBe(3);
  });

  it("min2 lifts 1s to 2 (Elemental Adept)", () => {
    expect(evaluateDiceExpression("2d6min2", sequence(1, 5)).total).toBe(7);
  });
});

describe("exploding", () => {
  it("! rolls another die on the max face", () => {
    const r = evaluateDiceExpression("1d6!", sequence(6, 6, 2));
    expect(r.total).toBe(14);
    expect(r.rolls).toHaveLength(3);
  });

  it("an always-exploding die is capped", () => {
    const r = evaluateDiceExpression("1d4!", () => 4);
    expect(r.rolls.length).toBeLessThanOrEqual(22);
  });
});

describe("arithmetic", () => {
  it("handles parentheses and multiplication", () => {
    expect(evaluateDiceExpression("2*(1d6+3)", sequence(4)).total).toBe(14);
  });

  it("respects precedence", () => {
    expect(evaluateDiceExpression("1d6+2*3", sequence(1)).total).toBe(7);
  });

  it("division rounds down", () => {
    expect(evaluateDiceExpression("1d6/2", sequence(5)).total).toBe(2);
  });

  it("supports a negative flat modifier and unary minus", () => {
    expect(evaluateDiceExpression("1d10 + -1", sequence(6)).total).toBe(5);
    expect(evaluateDiceExpression("-1d4+10", sequence(3)).total).toBe(7);
  });

  it("combines modified dice with other terms", () => {
    expect(evaluateDiceExpression("2d20kh1+5", sequence(3, 12)).total).toBe(17);
  });

  it("d% is a d100", () => {
    expect(evaluateDiceExpression("d%", sequence(42)).total).toBe(42);
  });
});

describe("validation", () => {
  it.each([
    "2d20kh1",
    "4d6dl1",
    "1d6r<=2",
    "1d6!",
    "(1d6+2)*2",
    "1d20 + 5",
    "2d6+3+2",
  ])("accepts %p", (expr) => {
    expect(isValidDiceExpression(expr)).toBe(true);
  });

  it.each([
    "",
    "abc",
    "5",
    "1d",
    "1d6+",
    "(1d6",
    "1d6)",
    "1d6/0",
    "1d6r",
    "1d6min",
    "0d6",
    "101d6",
    "1d1001",
    "1d6**2",
    "1d6 kh",
  ])("rejects %p", (expr) => {
    expect(isValidDiceExpression(expr)).toBe(false);
  });

  it("throws InvalidDiceExpressionError when rolling garbage", () => {
    expect(() => evaluateDiceExpression("nope", () => 1)).toThrow(InvalidDiceExpressionError);
  });
});
