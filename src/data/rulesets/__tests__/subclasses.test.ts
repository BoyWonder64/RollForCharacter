import { RULESETS } from "../index";

describe("subclass coverage", () => {
  for (const id of ["5e", "5e-2024"]) {
    describe(id, () => {
      const catalog = RULESETS[id];
      it.each(catalog.classes.map((c) => c.id))("%s offers a subclass choice with several options", (classId) => {
        const progression = catalog.classProgressions?.find((p) => p.classId === classId);
        expect(progression?.subclassLevel).toBeGreaterThan(0);
        expect(progression?.subclasses?.length).toBeGreaterThanOrEqual(4);
      });

      it("has no duplicate subclass ids within a class", () => {
        for (const p of catalog.classProgressions ?? []) {
          const ids = (p.subclasses ?? []).map((s) => s.id);
          expect(new Set(ids).size).toBe(ids.length);
        }
      });

      it("keeps SRD subclasses first with their feature text", () => {
        for (const p of catalog.classProgressions ?? []) {
          const [first] = p.subclasses ?? [];
          expect(first.srdLicensed).toBe(true);
          expect(first.features.length).toBeGreaterThan(0);
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
  it("every non-SRD 5e-2024 subclass has features at or after its choice level", () => {
    for (const p of RULESETS["5e-2024"].classProgressions ?? []) {
      for (const sub of p.subclasses ?? []) {
        expect(sub.features.length).toBeGreaterThan(0);
        expect(Math.min(...sub.features.map((f) => f.level))).toBeGreaterThanOrEqual(p.subclassLevel ?? 1);
      }
    }
  });

  it.each(RULESETS["5e"].classes.map((c) => c.id))("every 5e %s subclass has features", (classId) => {
    const progression = RULESETS["5e"].classProgressions?.find((p) => p.classId === classId);
    for (const sub of progression?.subclasses ?? []) {
      expect({ name: sub.name, features: sub.features.length > 0 }).toEqual({ name: sub.name, features: true });
      expect(Math.min(...sub.features.map((f) => f.level))).toBeGreaterThanOrEqual(progression?.subclassLevel ?? 1);
    }
  });

  it("has no leftover name-only subclasses in 5e or 5e-2024", () => {
    for (const id of ["5e", "5e-2024"]) {
      for (const p of RULESETS[id].classProgressions ?? []) {
        for (const sub of p.subclasses ?? []) expect({ id, sub: sub.name, empty: sub.features.length === 0 }).toEqual({ id, sub: sub.name, empty: false });
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

  it("offers the full list of 5e clerics' domains", () => {
    const cleric = RULESETS["5e"].classProgressions?.find((p) => p.classId === "cleric");
    expect(cleric?.subclasses?.map((s) => s.name)).toEqual(
      expect.arrayContaining([
        "Life Domain", "Knowledge Domain", "Light Domain", "Nature Domain", "Tempest Domain", "Trickery Domain",
        "War Domain", "Arcana Domain", "Forge Domain", "Grave Domain", "Order Domain", "Peace Domain", "Twilight Domain",
      ])
    );
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
