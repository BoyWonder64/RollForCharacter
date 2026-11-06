import { getDiceOverrideMode, rollDie, setDiceOverride } from "../diceEngine";

afterEach(() => setDiceOverride("random"));

describe("dice override", () => {
  it("defaults to random", () => {
    expect(getDiceOverrideMode()).toBe("random");
  });

  it("forces natural 20s and 1s on d20 only", () => {
    setDiceOverride("nat20");
    expect(rollDie(20)).toBe(20);
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(rollDie(6)).toBe(1);
    jest.restoreAllMocks();

    setDiceOverride("nat1");
    expect(rollDie(20)).toBe(1);
  });

  it("max and min force every die", () => {
    setDiceOverride("max");
    expect([rollDie(4), rollDie(12), rollDie(20)]).toEqual([4, 12, 20]);
    setDiceOverride("min");
    expect([rollDie(4), rollDie(12), rollDie(20)]).toEqual([1, 1, 1]);
  });

  it("seeded rolls repeat for the same seed and stay in range", () => {
    setDiceOverride("seeded", 42);
    const first = Array.from({ length: 20 }, () => rollDie(20));
    setDiceOverride("seeded", 42);
    const second = Array.from({ length: 20 }, () => rollDie(20));
    expect(second).toEqual(first);
    expect(first.every((v) => v >= 1 && v <= 20)).toBe(true);
    expect(new Set(first).size).toBeGreaterThan(1);
  });
});
