import {
  InvalidDiceExpressionError,
  parseDiceExpression,
  rollExpression,
} from "../diceEngine";

describe("parseDiceExpression", () => {
  it("parses a single die with implicit count", () => {
    expect(parseDiceExpression("d8")).toEqual({
      terms: [{ count: 1, sides: 8 }],
      modifier: 0,
    });
  });

  it("parses a single die with explicit count", () => {
    expect(parseDiceExpression("3d6")).toEqual({
      terms: [{ count: 3, sides: 6 }],
      modifier: 0,
    });
  });

  it("parses a positive modifier", () => {
    expect(parseDiceExpression("2d6+3")).toEqual({
      terms: [{ count: 2, sides: 6 }],
      modifier: 3,
    });
  });

  it("parses a negative modifier", () => {
    expect(parseDiceExpression("1d8-2")).toEqual({
      terms: [{ count: 1, sides: 8 }],
      modifier: -2,
    });
  });

  it("parses multiple dice terms combined with addition", () => {
    expect(parseDiceExpression("1d20+1d4")).toEqual({
      terms: [
        { count: 1, sides: 20 },
        { count: 1, sides: 4 },
      ],
      modifier: 0,
    });
  });

  it("parses multiple dice terms combined with subtraction", () => {
    expect(parseDiceExpression("1d20-1d4")).toEqual({
      terms: [
        { count: 1, sides: 20 },
        { count: -1, sides: 4 },
      ],
      modifier: 0,
    });
  });

  it("parses multiple dice terms plus a trailing modifier", () => {
    expect(parseDiceExpression("2d6+1d4+1")).toEqual({
      terms: [
        { count: 2, sides: 6 },
        { count: 1, sides: 4 },
      ],
      modifier: 1,
    });
  });

  it("tolerates surrounding and internal whitespace", () => {
    expect(parseDiceExpression("  1d20 + 3  ")).toEqual({
      terms: [{ count: 1, sides: 20 }],
      modifier: 3,
    });
  });

  it.each(["", "abc", "1d", "d", "2d", "1d6+", "+1d6", "2d6+3+2", "1d6**2"])(
    "rejects invalid expression %p",
    (expression) => {
      expect(() => parseDiceExpression(expression)).toThrow(
        InvalidDiceExpressionError
      );
    }
  );
});

describe("rollExpression", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockRandomSequence(values: number[]) {
    let i = 0;
    jest.spyOn(Math, "random").mockImplementation(() => {
      const value = values[i] ?? values[values.length - 1];
      i += 1;
      return value;
    });
  }

  it("rolls a single die and returns its value as the total", () => {
    // Math.random() -> 0.5 on a d20 => floor(0.5 * 20) + 1 = 11
    mockRandomSequence([0.5]);
    const result = rollExpression("1d20");
    expect(result.total).toBe(11);
    expect(result.rolls).toEqual([{ sides: 20, value: 11 }]);
    expect(result.expression).toBe("1d20");
  });

  it("floors to the minimum possible value", () => {
    mockRandomSequence([0]);
    const result = rollExpression("1d20");
    expect(result.total).toBe(1);
  });

  it("floors to the maximum possible value just under 1.0", () => {
    mockRandomSequence([0.999999]);
    const result = rollExpression("1d20");
    expect(result.total).toBe(20);
  });

  it("sums multiple dice of the same term and adds the modifier", () => {
    // d6 rolls: floor(x*6)+1 for x = 0, 1/6, 2/6 => 1, 2, 3
    mockRandomSequence([0, 1 / 6, 2 / 6]);
    const result = rollExpression("3d6+4");
    expect(result.total).toBe(1 + 2 + 3 + 4);
    expect(result.rolls).toHaveLength(3);
  });

  it("subtracts a negative dice term from the total", () => {
    // 1d20 -> 0.5 => 11, 1d4 -> 0 => 1, so total = 11 - 1 = 10
    mockRandomSequence([0.5, 0]);
    const result = rollExpression("1d20-1d4");
    expect(result.total).toBe(10);
  });

  it("includes a human-readable breakdown with the modifier", () => {
    mockRandomSequence([0.5]);
    const result = rollExpression("1d20+5");
    expect(result.breakdown).toContain("+d20[11]");
    expect(result.breakdown).toContain("+5");
  });

  it("omits the modifier from the breakdown when it is zero", () => {
    mockRandomSequence([0.5]);
    const result = rollExpression("1d20");
    expect(result.breakdown).not.toContain("+0");
  });

  it("throws for an invalid expression instead of rolling", () => {
    expect(() => rollExpression("not-dice")).toThrow(
      InvalidDiceExpressionError
    );
  });

  it.each([4, 6, 8, 10, 12, 20, 100])(
    "always rolls within [1, sides] for d%i over many trials",
    (sides) => {
      for (let i = 0; i < 200; i++) {
        const result = rollExpression(`1d${sides}`);
        expect(result.total).toBeGreaterThanOrEqual(1);
        expect(result.total).toBeLessThanOrEqual(sides);
      }
    }
  );
});
