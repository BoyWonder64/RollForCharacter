import { getRulesetCatalog } from "..";
import { WEAPONS_5E } from "../5e/weapons";
import { WEAPONS_5E_2024 } from "../5e-2024/weapons";

// The eight Weapon Mastery properties defined in SRD 5.2.
const MASTERY_NAMES = new Set(["Cleave", "Graze", "Nick", "Push", "Sap", "Slow", "Topple", "Vex"]);

describe("2024 Weapon Mastery", () => {
  it("is the weapon table 5e-2024 ships", () => {
    expect(getRulesetCatalog("5e-2024").weapons).toBe(WEAPONS_5E_2024);
  });

  it("keeps every 2014 weapon, in order, with unchanged base stats", () => {
    expect(WEAPONS_5E_2024.map((w) => w.id)).toEqual(WEAPONS_5E.map((w) => w.id));
    WEAPONS_5E_2024.forEach((weapon, i) => {
      const { mastery: _mastery, ...stats } = weapon;
      expect(stats).toEqual(WEAPONS_5E[i]);
    });
  });

  it("gives every weapon except the net a mastery", () => {
    const missing = WEAPONS_5E_2024.filter((w) => !w.mastery).map((w) => w.id);
    expect(missing).toEqual(["net"]);
  });

  it("only uses the eight SRD mastery properties, each with one consistent description", () => {
    const descriptions = new Map<string, string>();
    for (const weapon of WEAPONS_5E_2024) {
      if (!weapon.mastery) continue;
      expect(MASTERY_NAMES).toContain(weapon.mastery.name);
      expect(weapon.mastery.description.length).toBeGreaterThan(20);
      const seen = descriptions.get(weapon.mastery.name);
      if (seen) expect(weapon.mastery.description).toBe(seen);
      else descriptions.set(weapon.mastery.name, weapon.mastery.description);
    }
    expect(new Set(descriptions.keys())).toEqual(MASTERY_NAMES);
  });

  it("matches SRD 5.2 for a few well-known weapons", () => {
    const masteryOf = (id: string) => WEAPONS_5E_2024.find((w) => w.id === id)?.mastery?.name;
    expect(masteryOf("longsword")).toBe("Sap");
    expect(masteryOf("greataxe")).toBe("Cleave");
    expect(masteryOf("dagger")).toBe("Nick");
    expect(masteryOf("longbow")).toBe("Slow");
    expect(masteryOf("greatsword")).toBe("Graze");
  });

  it("isn't added to the 2014 or 3.5e tables", () => {
    expect(WEAPONS_5E.some((w) => w.mastery)).toBe(false);
    expect((getRulesetCatalog("5e").weapons ?? []).some((w) => w.mastery)).toBe(false);
    expect((getRulesetCatalog("3.5e").weapons ?? []).some((w) => w.mastery)).toBe(false);
  });
});
