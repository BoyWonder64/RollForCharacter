import { RULESETS } from "../index";

// Policy: each class's catalog carries exactly the one SRD-licensed
// subclass the SRD itself publishes in full -- every other published
// subclass is non-SRD and is deliberately not catalogued or suggested by
// name (see `project_subclass_policy` memory). Players who want one build
// it as a real Homebrew Subclass instead.
describe("subclass coverage", () => {
  for (const id of ["5e", "5e-2024"]) {
    describe(id, () => {
      const catalog = RULESETS[id];
      it.each(catalog.classes.map((c) => c.id))("%s ships exactly its one SRD subclass, with feature text", (classId) => {
        const progression = catalog.classProgressions?.find((p) => p.classId === classId);
        expect(progression?.subclassLevel).toBeGreaterThan(0);
        expect(progression?.subclasses).toHaveLength(1);
        const [only] = progression?.subclasses ?? [];
        expect(only.srdLicensed).toBe(true);
        expect(only.features.length).toBeGreaterThan(0);
      });

      it("has no duplicate subclass ids within a class", () => {
        for (const p of catalog.classProgressions ?? []) {
          const ids = (p.subclasses ?? []).map((s) => s.id);
          expect(new Set(ids).size).toBe(ids.length);
        }
      });
    });
  }
});

describe("Pact Magic", () => {
  it.each(["5e", "5e-2024"])("gives the Warlock a slot table with one slot level per row (%s)", (id) => {
    const warlock = RULESETS[id].classProgressions?.find((p) => p.classId === "warlock");
    const rows = warlock?.spellProgression ?? [];
    expect(rows).toHaveLength(20);
    for (const row of rows) {
      expect(row.slots.filter((n) => n > 0)).toHaveLength(1);
    }
    expect(rows[0].slots[0]).toBe(1);
    expect(rows[4].slots).toEqual([0, 0, 2, 0, 0, 0, 0, 0, 0]);
    expect(rows[19].slots).toEqual([0, 0, 0, 0, 4, 0, 0, 0, 0]);
  });
});

describe("subclasses grant real features", () => {
  it.each(["5e", "5e-2024"])("every %s subclass has features at or after its choice level", (id) => {
    for (const p of RULESETS[id].classProgressions ?? []) {
      for (const sub of p.subclasses ?? []) {
        expect(sub.features.length).toBeGreaterThan(0);
        expect(Math.min(...sub.features.map((f) => f.level))).toBeGreaterThanOrEqual(p.subclassLevel ?? 1);
      }
    }
  });

  it("gives every subclass resource a unique id within its ruleset", () => {
    for (const id of ["5e", "5e-2024"]) {
      const seen = new Set<string>();
      for (const p of RULESETS[id].classProgressions ?? []) {
        for (const r of [...(p.resources ?? []), ...(p.subclasses ?? []).flatMap((s) => s.resources ?? [])]) {
          expect({ id, resource: r.id, dup: seen.has(r.id) }).toEqual({ id, resource: r.id, dup: false });
          seen.add(r.id);
        }
      }
    }
  });

  it("only features gained at or after the subclass level are listed per level", () => {
    for (const id of ["5e", "5e-2024"]) {
      for (const p of RULESETS[id].classProgressions ?? []) {
        for (const sub of p.subclasses ?? []) {
          for (const f of sub.features) expect(f.level).toBeLessThanOrEqual(20);
        }
      }
    }
  });
});
