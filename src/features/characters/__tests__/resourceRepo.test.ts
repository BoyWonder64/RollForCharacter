import { recentRolls } from "../../dice/diceRepo";
import { createCharacter, getCharacter, longRest, shortRest, updateCharacter } from "../characterRepo";
import {
  addCustomResource,
  applyShortRestRecharge,
  formatLevelBreakpoints,
  listCharacterResources,
  listCustomResources,
  parseLevelBreakpoints,
  removeCustomResource,
  rollResource,
  setResourceOverride,
  restoreResourceUse,
  spendResourceUse,
  updateCustomResource,
  type CustomResourceInput,
} from "../resourceRepo";

jest.mock("../../../db/client");

const BASE_INPUT: CustomResourceInput = {
  name: "Wild Surge",
  description: "A homebrew burst of power.",
  maxMode: "fixed",
  fixedMax: 2,
  usesByLevel: {},
  ability: "charisma",
  abilityBonus: 0,
  abilityMinimum: 1,
  rechargeOn: "long",
  isPointPool: false,
  icon: "",
  rollFormula: "",
};

async function freshCharacter(name: string) {
  const created = await createCharacter(name);
  return (await getCharacter(created.id))!;
}

function find(resources: Awaited<ReturnType<typeof listCharacterResources>>, name: string) {
  return resources.find((r) => r.definition.name === name);
}

describe("custom resources", () => {
  describe("level breakpoint text", () => {
    it("parses level:uses pairs and skips malformed ones", () => {
      expect(parseLevelBreakpoints("1:2, 5:3\n11=4; nope, 0:9, 3:x")).toEqual({ 1: 2, 5: 3, 11: 4 });
    });

    it("round-trips through format", () => {
      expect(formatLevelBreakpoints(parseLevelBreakpoints("5:3, 1:2"))).toBe("1:2, 5:3");
    });
  });

  it("adds a fixed-max resource that shows up full", async () => {
    const character = await freshCharacter("Custom Fixed");
    const row = await addCustomResource(character.id, BASE_INPUT);

    const resources = await listCharacterResources(character);
    expect(find(resources, "Wild Surge")).toMatchObject({ max: 2, remaining: 2, customId: row.id });
    expect(find(resources, "Wild Surge")?.definition.id).toBe(`custom-${row.id}`);
  });

  it("rejects a blank name", async () => {
    const character = await freshCharacter("Custom Blank");
    await expect(addCustomResource(character.id, { ...BASE_INPUT, name: "  " })).rejects.toThrow();
  });

  it("spends and restores uses like a catalog resource", async () => {
    const character = await freshCharacter("Custom Spend");
    const row = await addCustomResource(character.id, BASE_INPUT);
    const id = `custom-${row.id}`;

    await spendResourceUse(character, id);
    expect(find(await listCharacterResources(character), "Wild Surge")?.remaining).toBe(1);
    await restoreResourceUse(character, id);
    expect(find(await listCharacterResources(character), "Wild Surge")?.remaining).toBe(2);
  });

  it("scales max uses by level breakpoints", async () => {
    const character = await freshCharacter("Custom Level");
    await addCustomResource(character.id, {
      ...BASE_INPUT,
      maxMode: "level",
      usesByLevel: { 1: 1, 5: 3 },
    });
    expect(find(await listCharacterResources(character), "Wild Surge")?.max).toBe(1);

    await updateCharacter(character.id, { level: 5 });
    const leveled = (await getCharacter(character.id))!;
    expect(find(await listCharacterResources(leveled), "Wild Surge")?.max).toBe(3);
  });

  it("derives max uses from an ability modifier with bonus and minimum", async () => {
    const character = await freshCharacter("Custom Ability");
    await updateCharacter(character.id, { charisma: 16 });
    const updated = (await getCharacter(character.id))!;
    await addCustomResource(character.id, {
      ...BASE_INPUT,
      maxMode: "ability",
      ability: "charisma",
      abilityBonus: 1,
      abilityMinimum: 1,
    });
    expect(find(await listCharacterResources(updated), "Wild Surge")?.max).toBe(4);
  });

  it("recharges per its setting on rests", async () => {
    const character = await freshCharacter("Custom Rests");
    const shortRow = await addCustomResource(character.id, { ...BASE_INPUT, name: "Short", rechargeOn: "short" });
    const longRow = await addCustomResource(character.id, { ...BASE_INPUT, name: "Long", rechargeOn: "long" });
    const manualRow = await addCustomResource(character.id, { ...BASE_INPUT, name: "Manual", rechargeOn: "manual" });
    for (const row of [shortRow, longRow, manualRow]) await spendResourceUse(character, `custom-${row.id}`, 2);

    await applyShortRestRecharge(character);
    let resources = await listCharacterResources(character);
    expect(find(resources, "Short")?.remaining).toBe(2);
    expect(find(resources, "Long")?.remaining).toBe(0);
    expect(find(resources, "Manual")?.remaining).toBe(0);

    await longRest(character.id);
    resources = await listCharacterResources(character);
    expect(find(resources, "Long")?.remaining).toBe(2);
    expect(find(resources, "Manual")?.remaining).toBe(0);
  });

  it("clamps spent uses when the max is lowered by an edit", async () => {
    const character = await freshCharacter("Custom Edit");
    const row = await addCustomResource(character.id, { ...BASE_INPUT, fixedMax: 4 });
    await spendResourceUse(character, `custom-${row.id}`, 1); // 3 left
    await updateCustomResource(row.id, { ...BASE_INPUT, fixedMax: 2 });

    expect(find(await listCharacterResources(character), "Wild Surge")).toMatchObject({ max: 2, remaining: 2 });
  });

  it("removes a resource and its spent-use record", async () => {
    const character = await freshCharacter("Custom Remove");
    const row = await addCustomResource(character.id, BASE_INPUT);
    await spendResourceUse(character, `custom-${row.id}`);
    await removeCustomResource(row.id);

    expect(await listCustomResources(character.id)).toHaveLength(0);
    expect(find(await listCharacterResources(character), "Wild Surge")).toBeUndefined();
  });

  it("works alongside shortRest on the character", async () => {
    const character = await freshCharacter("Custom ShortRest");
    const row = await addCustomResource(character.id, { ...BASE_INPUT, rechargeOn: "short" });
    await spendResourceUse(character, `custom-${row.id}`, 2);
    await shortRest(character.id);
    expect(find(await listCharacterResources(character), "Wild Surge")?.remaining).toBe(2);
  });

  it("stores an icon and rejects an invalid roll formula", async () => {
    const character = await freshCharacter("Custom Icon");
    await addCustomResource(character.id, { ...BASE_INPUT, icon: "potion" });
    expect(find(await listCharacterResources(character), "Wild Surge")?.icon).toBe("potion");
    await expect(addCustomResource(character.id, { ...BASE_INPUT, rollFormula: "fireball" })).rejects.toThrow();
  });

  describe("roll formula", () => {
    afterEach(() => jest.restoreAllMocks());

    it("rolls the resolved formula and saves it to history without spending a use", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0.5); // d10 -> 6
      const character = await freshCharacter("Custom Roll");
      await updateCharacter(character.id, { level: 3 });
      const leveled = (await getCharacter(character.id))!;
      await addCustomResource(character.id, { ...BASE_INPUT, name: "Second Wind", rollFormula: "1d10 + level" });

      const resource = find(await listCharacterResources(leveled), "Second Wind")!;
      const result = await rollResource(leveled, resource);

      expect(result?.total).toBe(9);
      expect(result?.expression).toBe("Second Wind: 1d10 + 3");
      expect((await recentRolls(character.id))[0]).toMatchObject({ result: 9 });
      expect(find(await listCharacterResources(leveled), "Second Wind")?.remaining).toBe(2);
    });

    it("returns nothing for a resource with no roll", async () => {
      const character = await freshCharacter("Custom NoRoll");
      await addCustomResource(character.id, BASE_INPUT);
      const resource = find(await listCharacterResources(character), "Wild Surge")!;
      expect(await rollResource(character, resource)).toBeUndefined();
    });
  });

  describe("overriding built-in resources", () => {
    async function fighter(name: string) {
      const character = await freshCharacter(name);
      await updateCharacter(character.id, { className: "Fighter", level: 2 });
      return (await getCharacter(character.id))!;
    }

    it("changes a built-in max and keeps the default visible", async () => {
      const character = await fighter("Override Max");
      const base = find(await listCharacterResources(character), "Action Surge")!;
      expect(base.max).toBe(1);

      await setResourceOverride(character.id, base.definition.id, { hidden: false, maxOverride: 3 });
      const changed = find(await listCharacterResources(character), "Action Surge")!;
      expect(changed).toMatchObject({ max: 3, remaining: 3, defaultMax: 1, overrideMax: 3 });
    });

    it("hides a built-in, lists it only when asked, and restores it", async () => {
      const character = await fighter("Override Hide");
      const id = find(await listCharacterResources(character), "Action Surge")!.definition.id;

      await setResourceOverride(character.id, id, { hidden: true, maxOverride: null });
      expect(find(await listCharacterResources(character), "Action Surge")).toBeUndefined();
      expect(find(await listCharacterResources(character, { includeHidden: true }), "Action Surge")?.hidden).toBe(true);

      await setResourceOverride(character.id, id, { hidden: false, maxOverride: null });
      expect(find(await listCharacterResources(character), "Action Surge")?.hidden).toBe(false);
    });

    it("does not apply overrides to custom resources", async () => {
      const character = await fighter("Override Custom");
      const row = await addCustomResource(character.id, BASE_INPUT);
      await setResourceOverride(character.id, "custom-" + row.id, { hidden: true, maxOverride: 9 });
      expect(find(await listCharacterResources(character), "Wild Surge")).toMatchObject({ max: 2 });
    });
  });
});
