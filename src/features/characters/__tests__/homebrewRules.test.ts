import {
  abilityScoreCap,
  attunementCap,
  critRangeMin,
  deathSaveLimits,
  inspirationCap,
  inspirationCount,
} from "../homebrewRules";
import { addConcentration, getConcentrations, removeConcentration } from "../concentration";
import { naturalD20Flag } from "../../dice/structuredRolls";

const off = { homebrewEnabled: false };
const on = { homebrewEnabled: true };

describe("homebrew rule helpers", () => {
  it("ignore every override while homebrew is off", () => {
    expect(deathSaveLimits({ ...off, deathSaveSuccessesNeeded: 5, deathSaveFailuresNeeded: 1 })).toEqual({
      successes: 3,
      failures: 3,
    });
    expect(critRangeMin({ ...off, critRangeMin: 18 })).toBe(20);
    expect(attunementCap({ ...off, attunementLimit: 5 })).toBeNull();
    expect(abilityScoreCap({ ...off, abilityScoreMax: 30 })).toBe(20);
    expect(inspirationCap({ ...off, inspirationMax: 4 })).toBe(1);
  });

  it("apply overrides while homebrew is on", () => {
    expect(deathSaveLimits({ ...on, deathSaveSuccessesNeeded: 5, deathSaveFailuresNeeded: 1 })).toEqual({
      successes: 5,
      failures: 1,
    });
    expect(critRangeMin({ ...on, critRangeMin: 19 })).toBe(19);
    expect(attunementCap({ ...on, attunementLimit: 5 })).toBe(5);
    expect(abilityScoreCap({ ...on, abilityScoreMax: 24 })).toBe(24);
    expect(inspirationCap({ ...on, inspirationMax: 4 })).toBe(4);
  });

  it("counts inspiration from the boolean for older rows", () => {
    expect(inspirationCount({ inspirationPoints: 0, inspiration: true })).toBe(1);
    expect(inspirationCount({ inspirationPoints: 3, inspiration: true })).toBe(3);
    expect(inspirationCount({ inspirationPoints: 0, inspiration: false })).toBe(0);
  });

  it("flags a crit from the character's crit range", () => {
    expect(naturalD20Flag(19)).toBeNull();
    expect(naturalD20Flag(19, 19)).toBe("nat20");
    expect(naturalD20Flag(1, 19)).toBe("nat1");
    expect(naturalD20Flag(18, 19)).toBeNull();
  });
});

describe("concentration slots", () => {
  const base = {
    concentratingSpellId: null,
    concentratingSpellName: "",
    extraConcentrations: "[]",
    homebrewEnabled: true,
    extraConcentrationSlots: 1,
  };

  it("holds two spells with one extra slot and drops the oldest on a third", () => {
    let c = { ...base, ...addConcentration(base, { id: 1, name: "Bless" }) };
    c = { ...c, ...addConcentration(c, { id: 2, name: "Haste" }) };
    expect(getConcentrations(c).map((e) => e.name)).toEqual(["Bless", "Haste"]);
    c = { ...c, ...addConcentration(c, { id: 3, name: "Fly" }) };
    expect(getConcentrations(c).map((e) => e.name)).toEqual(["Haste", "Fly"]);
  });

  it("is limited to one spell with homebrew off", () => {
    const stock = { ...base, homebrewEnabled: false };
    let c = { ...stock, ...addConcentration(stock, { id: 1, name: "Bless" }) };
    c = { ...c, ...addConcentration(c, { id: 2, name: "Haste" }) };
    expect(getConcentrations(c).map((e) => e.name)).toEqual(["Haste"]);
  });

  it("removes one spell by position, or all", () => {
    let c = { ...base, ...addConcentration(base, { id: 1, name: "Bless" }) };
    c = { ...c, ...addConcentration(c, { id: 2, name: "Haste" }) };
    expect(getConcentrations({ ...c, ...removeConcentration(c, 0) }).map((e) => e.name)).toEqual(["Haste"]);
    expect(getConcentrations({ ...c, ...removeConcentration(c) })).toEqual([]);
  });
});
