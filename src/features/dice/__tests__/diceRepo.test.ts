import { createCharacter } from "../../characters/characterRepo";
import { recentRolls, saveRoll } from "../diceRepo";
import type { RollResult } from "../diceEngine";

jest.mock("../../../db/client");

function makeRoll(overrides: Partial<RollResult> = {}): RollResult {
  return {
    expression: "1d20",
    total: 11,
    breakdown: "+d20[11]",
    rolls: [{ sides: 20, value: 11 }],
    ...overrides,
  };
}

describe("diceRepo", () => {
  it("saves a roll without a character and lists it back", async () => {
    await saveRoll(makeRoll({ expression: "1d20", total: 17 }));
    const rolls = await recentRolls();
    expect(rolls.find((r) => r.result === 17 && r.expression === "1d20")).toBeDefined();
  });

  it("associates a roll with a character when provided", async () => {
    const character = await createCharacter("Dice Repo Owner");
    await saveRoll(makeRoll({ expression: "2d6+3", total: 9 }), character.id);

    const rolls = await recentRolls(character.id);
    expect(rolls).toHaveLength(1);
    expect(rolls[0]).toMatchObject({
      characterId: character.id,
      expression: "2d6+3",
      result: 9,
    });
  });

  it("does not return another character's rolls when scoped", async () => {
    const characterA = await createCharacter("Dice Repo Scope A");
    const characterB = await createCharacter("Dice Repo Scope B");

    await saveRoll(makeRoll({ expression: "1d4", total: 2 }), characterA.id);
    await saveRoll(makeRoll({ expression: "1d6", total: 4 }), characterB.id);

    const rollsForA = await recentRolls(characterA.id);
    expect(rollsForA).toHaveLength(1);
    expect(rollsForA[0].expression).toBe("1d4");
  });

  it("returns most recent rolls first", async () => {
    const character = await createCharacter("Dice Repo Ordering");
    await saveRoll(makeRoll({ expression: "1d20", total: 1 }), character.id);
    await saveRoll(makeRoll({ expression: "1d20", total: 2 }), character.id);
    await saveRoll(makeRoll({ expression: "1d20", total: 3 }), character.id);

    const rolls = await recentRolls(character.id);
    expect(rolls.map((r) => r.result)).toEqual([3, 2, 1]);
  });

  it("limits the number of rolls returned", async () => {
    const character = await createCharacter("Dice Repo Limit");
    for (let i = 0; i < 5; i++) {
      await saveRoll(makeRoll({ expression: "1d20", total: i }), character.id);
    }

    const rolls = await recentRolls(character.id, 2);
    expect(rolls).toHaveLength(2);
  });
});
