import {
  annotateWithConditions,
  attacksAgainstNotes,
  combineAdvantage,
  conditionRollEffect,
} from "../conditionEffects";

describe("conditionRollEffect", () => {
  it("gives poisoned creatures disadvantage on attacks and checks but not saves", () => {
    expect(conditionRollEffect(["poisoned"], "attack").disadvantage).toEqual(["Poisoned"]);
    expect(conditionRollEffect(["poisoned"], "check", "wisdom").disadvantage).toEqual(["Poisoned"]);
    expect(conditionRollEffect(["poisoned"], "save", "wisdom").notes).toEqual([]);
  });

  it("auto-fails only Strength and Dexterity saves while stunned", () => {
    expect(conditionRollEffect(["stunned"], "save", "dexterity").autoFail).toEqual(["Stunned"]);
    expect(conditionRollEffect(["stunned"], "save", "wisdom").autoFail).toEqual([]);
  });

  it("limits restrained's save penalty to Dexterity", () => {
    expect(conditionRollEffect(["restrained"], "save", "dexterity").disadvantage).toEqual(["Restrained"]);
    expect(conditionRollEffect(["restrained"], "save", "strength").disadvantage).toEqual([]);
  });

  it("notes situational effects without changing the roll", () => {
    const effect = conditionRollEffect(["blinded"], "check", "wisdom");
    expect(effect.disadvantage).toEqual([]);
    expect(effect.notes).toHaveLength(1);
  });
});

describe("combineAdvantage", () => {
  it("cancels advantage and disadvantage from any sources", () => {
    const invisiblePoisoned = conditionRollEffect(["invisible", "poisoned"], "attack");
    expect(combineAdvantage("normal", invisiblePoisoned)).toBe("normal");
    const poisoned = conditionRollEffect(["poisoned"], "attack");
    expect(combineAdvantage("advantage", poisoned)).toBe("normal");
    expect(combineAdvantage("normal", poisoned)).toBe("disadvantage");
  });

  it("keeps the manual toggle when no condition applies", () => {
    expect(combineAdvantage("advantage", conditionRollEffect([], "attack"))).toBe("advantage");
  });
});

describe("annotateWithConditions", () => {
  const base = { expression: "Goblin: Dexterity Save", total: 14, breakdown: "1d20 (12) + 2", rolls: [] };

  it("leaves rolls untouched when no condition applies", () => {
    expect(annotateWithConditions(base, conditionRollEffect([], "save", "dexterity"))).toEqual(base);
  });

  it("flags automatic failures and writes out the rule", () => {
    const result = annotateWithConditions(base, conditionRollEffect(["paralyzed"], "save", "dexterity"));
    expect(result.breakdown).toMatch(/^AUTOMATIC FAILURE \(Paralyzed\)/);
    expect(result.breakdown).toContain("automatically fails Strength and Dexterity saves");
  });
});

describe("attacksAgainstNotes", () => {
  it("lists only conditions that affect attacks against the creature", () => {
    expect(attacksAgainstNotes(["poisoned", "prone"])).toEqual([
      "Prone: Attacks against it have advantage within 5 ft, disadvantage otherwise",
    ]);
  });
});
