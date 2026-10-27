import { getSpellRollType, getSpellSaveAbility } from "../spellRollType";

describe("getSpellRollType", () => {
  it("classifies a spell attack roll", () => {
    expect(
      getSpellRollType("Make a ranged spell attack against the target. On a hit...")
    ).toBe("attack");
  });

  it("classifies a saving throw spell", () => {
    expect(
      getSpellRollType("Each creature must make a dexterity saving throw.")
    ).toBe("save");
  });

  it("classifies a spell with neither as none", () => {
    expect(getSpellRollType("You touch a willing creature. Its hit point maximum...")).toBe(
      "none"
    );
  });

  it("treats a missing description as none", () => {
    expect(getSpellRollType(null)).toBe("none");
    expect(getSpellRollType(undefined)).toBe("none");
    expect(getSpellRollType("")).toBe("none");
  });

  it("prefers attack when a description mentions both (attack checked first)", () => {
    expect(
      getSpellRollType("Make a melee spell attack. A creature hit must also make a saving throw.")
    ).toBe("attack");
  });
});

describe("getSpellSaveAbility", () => {
  it("extracts the saving throw ability", () => {
    expect(getSpellSaveAbility("The target must make a wisdom saving throw.")).toBe("wisdom");
  });

  it("returns undefined when no save ability is mentioned", () => {
    expect(getSpellSaveAbility("Make a ranged spell attack.")).toBeUndefined();
  });

  it("returns undefined for a missing description", () => {
    expect(getSpellSaveAbility(null)).toBeUndefined();
  });
});
