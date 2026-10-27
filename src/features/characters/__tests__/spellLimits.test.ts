import { getSpellLimits } from "../spellLimits";

describe("getSpellLimits", () => {
  it("returns the level-1 known-caster table for a Bard", () => {
    expect(getSpellLimits("bard", 1, 3)).toEqual({ cantrips: 2, spells: 4, mode: "known" });
  });

  it("returns the level-5 known-caster table for a Sorcerer", () => {
    expect(getSpellLimits("sorcerer", 5, 4)).toEqual({ cantrips: 5, spells: 6, mode: "known" });
  });

  it("gives a Ranger zero spells and cantrips at level 1", () => {
    expect(getSpellLimits("ranger", 1, 2)).toEqual({ cantrips: 0, spells: 0, mode: "known" });
  });

  it("gives a Ranger its level-2 known spells", () => {
    expect(getSpellLimits("ranger", 2, 2)).toEqual({ cantrips: 0, spells: 2, mode: "known" });
  });

  it("computes a Cleric's prepared count as ability modifier + level", () => {
    expect(getSpellLimits("cleric", 3, 3)).toEqual({ cantrips: 3, spells: 6, mode: "prepared" });
  });

  it("floors a Cleric's prepared count at 1 even with a negative modifier", () => {
    expect(getSpellLimits("cleric", 1, -2)).toEqual({ cantrips: 3, spells: 1, mode: "prepared" });
  });

  it("gives a Paladin no cantrips but a prepared spell count", () => {
    expect(getSpellLimits("paladin", 2, 3)).toEqual({ cantrips: 0, spells: 5, mode: "prepared" });
  });

  it("grows a Wizard's spellbook by 2 per level from a base of 6", () => {
    expect(getSpellLimits("wizard", 1, 3)).toEqual({ cantrips: 3, spells: 6, mode: "known" });
    expect(getSpellLimits("wizard", 4, 3)).toEqual({ cantrips: 4, spells: 12, mode: "known" });
  });

  it("returns undefined for a non-spellcasting class", () => {
    expect(getSpellLimits("fighter", 5, 0)).toBeUndefined();
  });

  it("clamps level above 20 to the level-20 row", () => {
    expect(getSpellLimits("bard", 25, 5)).toEqual(getSpellLimits("bard", 20, 5));
  });
});
