import type { RollResult } from "../../dice/diceEngine";
import { appendRoll } from "../rollLog";

function roll(expression: string, total: number): RollResult {
  return { expression, total, breakdown: `${total}`, rolls: [] };
}

describe("appendRoll", () => {
  it("puts the newest roll first with its natural face and DC", () => {
    let log = appendRoll([], roll("1d20+3", 15), 12);
    log = appendRoll(log, roll("2d6", 7), null);
    log = appendRoll(log, roll("1d20+5", 18), 13, 15);

    expect(log.map((e) => [e.label, e.total, e.natural, e.dc])).toEqual([
      ["1d20+5", 18, 13, 15],
      ["2d6", 7, null, undefined],
      ["1d20+3", 15, 12, undefined],
    ]);
  });

  it("defaults natural to null", () => {
    expect(appendRoll([], roll("1d8", 4))[0].natural).toBeNull();
  });

  it("gives every entry a unique id", () => {
    let log = appendRoll([], roll("1d4", 1));
    log = appendRoll(log, roll("1d4", 2));
    log = appendRoll(log, roll("1d4", 3));
    expect(new Set(log.map((e) => e.id)).size).toBe(3);
  });

  it("keeps only the 30 most recent rolls", () => {
    let log = appendRoll([], roll("first", 0));
    for (let i = 1; i <= 34; i++) log = appendRoll(log, roll(`roll ${i}`, i));
    expect(log).toHaveLength(30);
    expect(log[0].label).toBe("roll 34");
    expect(log[29].label).toBe("roll 5");
  });

  it("doesn't mutate the log it's given", () => {
    const original = appendRoll([], roll("1d6", 3));
    const copy = [...original];
    appendRoll(original, roll("1d6", 5));
    expect(original).toEqual(copy);
  });
});
