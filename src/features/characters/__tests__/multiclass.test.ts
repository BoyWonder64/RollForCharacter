import {
  combinedCasterLevel,
  formatMulticlassLabel,
  isMulticlassed,
  multiclassSpellSlots,
  totalMulticlassSlots,
  warlockPactMagicRow,
  type ClassLevelEntry,
} from "../multiclass";

describe("combinedCasterLevel", () => {
  it("sums full casters at face value", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "bard", className: "Bard", level: 3 },
      { classId: "wizard", className: "Wizard", level: 2 },
    ];
    expect(combinedCasterLevel(rows, "5e")).toBe(5);
  });

  it("counts half casters as floor(level / 2)", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "paladin", className: "Paladin", level: 5 },
      { classId: "wizard", className: "Wizard", level: 1 },
    ];
    // floor(5/2) + 1 = 2 + 1 = 3
    expect(combinedCasterLevel(rows, "5e")).toBe(3);
  });

  it("contributes 0 for a half caster at level 1", () => {
    const rows: ClassLevelEntry[] = [{ classId: "ranger", className: "Ranger", level: 1 }];
    expect(combinedCasterLevel(rows, "5e")).toBe(0);
  });

  it("excludes pact (Warlock) levels entirely", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "warlock", className: "Warlock", level: 5 },
      { classId: "wizard", className: "Wizard", level: 3 },
    ];
    expect(combinedCasterLevel(rows, "5e")).toBe(3);
  });

  it("ignores non-caster classes", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "fighter", className: "Fighter", level: 10 },
      { classId: "wizard", className: "Wizard", level: 2 },
    ];
    expect(combinedCasterLevel(rows, "5e")).toBe(2);
  });
});

describe("multiclassSpellSlots", () => {
  it("returns undefined for a combined level of 0", () => {
    expect(multiclassSpellSlots(0, "5e")).toBeUndefined();
  });

  it("matches the PHB multiclass table at combined level 1", () => {
    expect(multiclassSpellSlots(1, "5e")).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("matches the PHB multiclass table at combined level 3", () => {
    expect(multiclassSpellSlots(3, "5e")).toEqual([4, 2, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("matches the PHB multiclass table at combined level 5", () => {
    expect(multiclassSpellSlots(5, "5e")).toEqual([4, 3, 2, 0, 0, 0, 0, 0, 0]);
  });

  it("matches the PHB multiclass table at combined level 20", () => {
    expect(multiclassSpellSlots(20, "5e")).toEqual([4, 3, 3, 3, 3, 2, 2, 1, 1]);
  });

  it("clamps a combined level above 20 to the level-20 row", () => {
    expect(multiclassSpellSlots(25, "5e")).toEqual([4, 3, 3, 3, 3, 2, 2, 1, 1]);
  });
});

describe("warlockPactMagicRow", () => {
  it("returns undefined when no class row is a Warlock", () => {
    const rows: ClassLevelEntry[] = [{ classId: "wizard", className: "Wizard", level: 5 }];
    expect(warlockPactMagicRow(rows, "5e")).toBeUndefined();
  });

  it.each(["5e", "5e-2024"])("returns the Pact Magic slots at the Warlock's own level (%s)", (ruleset) => {
    const rows: ClassLevelEntry[] = [
      { classId: "wizard", className: "Wizard", level: 4 },
      { classId: "warlock", className: "Warlock", level: 5 },
    ];
    // Warlock 5: two 3rd-level slots.
    expect(warlockPactMagicRow(rows, ruleset)?.slots).toEqual([0, 0, 2, 0, 0, 0, 0, 0, 0]);
  });
});

describe("totalMulticlassSlots", () => {
  it("adds Pact Magic slots to the shared pool instead of replacing it", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "wizard", className: "Wizard", level: 4 },
      { classId: "warlock", className: "Warlock", level: 2 },
    ];
    // Shared pool is a level-4 caster ([4,3,0...]); Warlock 2 adds two 1st-level slots.
    expect(totalMulticlassSlots(rows, "5e")).toEqual([6, 3, 0, 0, 0, 0, 0, 0, 0]);
  });

  it("is just the Pact slots for a Warlock-only character", () => {
    const rows: ClassLevelEntry[] = [{ classId: "warlock", className: "Warlock", level: 11 }];
    expect(totalMulticlassSlots(rows, "5e")).toEqual([0, 0, 0, 0, 3, 0, 0, 0, 0]);
  });

  it("is undefined with no spellcasting classes", () => {
    expect(totalMulticlassSlots([{ classId: "fighter", className: "Fighter", level: 5 }], "5e")).toBeUndefined();
  });
});

describe("isMulticlassed", () => {
  it("is false for zero or one class row", () => {
    expect(isMulticlassed([])).toBe(false);
    expect(isMulticlassed([{ classId: "fighter", className: "Fighter", level: 3 }])).toBe(false);
  });

  it("is true for two or more class rows", () => {
    expect(
      isMulticlassed([
        { classId: "fighter", className: "Fighter", level: 3 },
        { classId: "wizard", className: "Wizard", level: 2 },
      ])
    ).toBe(true);
  });
});

describe("formatMulticlassLabel", () => {
  it("falls back to the bare class name for zero rows", () => {
    expect(formatMulticlassLabel([], "Fighter")).toBe("Fighter");
  });

  it("falls back to 'No class' when there's nothing at all", () => {
    expect(formatMulticlassLabel([], "")).toBe("No class");
  });

  it("joins every class and level", () => {
    const rows: ClassLevelEntry[] = [
      { classId: "fighter", className: "Fighter", level: 3 },
      { classId: "wizard", className: "Wizard", level: 2 },
    ];
    expect(formatMulticlassLabel(rows, "Fighter")).toBe("Fighter 3 / Wizard 2");
  });
});
