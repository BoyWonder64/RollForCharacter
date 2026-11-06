import { MONSTERS_5E } from "../../../data/monsters";
import {
  doubleDice,
  parseDamageParts,
  parseEntry,
  parseStatBlock,
  parseUsedAbilities,
  rollDamageParts,
  serializeUsedAbilities,
} from "../monsterRolls";

function find(name: string, sourceKey: string) {
  const monster = MONSTERS_5E.find((m) => m.name === name && m.sourceKey === sourceKey);
  if (!monster) throw new Error(`${name} (${sourceKey}) not in catalog`);
  return monster;
}

describe("parseEntry", () => {
  it("parses a 2014 melee attack with two damage types", () => {
    const parsed = parseEntry({
      name: "Bite",
      description:
        "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage.",
    });
    expect(parsed.attack).toEqual({ kind: "melee", bonus: 11 });
    expect(parsed.damage).toEqual([
      { expression: "2d10+6", average: 17, type: "piercing" },
      { expression: "1d8", average: 4, type: "acid" },
    ]);
  });

  it("parses a 2024 attack roll", () => {
    const parsed = parseEntry({
      name: "Tentacle",
      description:
        "Melee Attack Roll: +9, reach 15 ft. 12 (2d6 + 5) Bludgeoning damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 14) from one of four tentacles.",
    });
    expect(parsed.attack).toEqual({ kind: "melee", bonus: 9 });
    expect(parsed.damage).toEqual([{ expression: "2d6+5", average: 12, type: "bludgeoning" }]);
  });

  it("keeps a save rider's damage out of the attack's hit damage", () => {
    const parsed = parseEntry({
      name: "Sting",
      description:
        "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) piercing damage. The target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one.",
    });
    expect(parsed.damage).toEqual([{ expression: "1d6+2", average: 5, type: "piercing" }]);
  });

  it("parses a save-based action with half damage on success (2014)", () => {
    const parsed = parseEntry({
      name: "Fire Breath (Recharge 5-6)",
      description:
        "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much damage on a successful one.",
    });
    expect(parsed.save).toEqual({ ability: "dexterity", dc: 21 });
    expect(parsed.saveDamage).toEqual([{ expression: "12d10", average: 66, type: "fire" }]);
    expect(parsed.halfOnSave).toBe(true);
    expect(parsed.limit).toEqual({ kind: "recharge", min: 5 });
    expect(parsed.baseName).toBe("Fire Breath");
  });

  it("parses a 2024 saving throw action", () => {
    const parsed = parseEntry({
      name: "Consume Memories",
      description:
        "Intelligence Saving Throw: DC 16, one creature within 30 feet. Failure: 10 (3d6) Psychic damage. Success: Half damage.",
    });
    expect(parsed.save).toEqual({ ability: "intelligence", dc: 16 });
    expect(parsed.saveDamage).toEqual([{ expression: "3d6", average: 10, type: "psychic" }]);
    expect(parsed.halfOnSave).toBe(true);
  });

  it("reads recharge, per-day and rest limits from the name", () => {
    expect(parseEntry({ name: "Breath (Recharge 6)", description: "" }).limit).toEqual({
      kind: "recharge",
      min: 6,
    });
    expect(parseEntry({ name: "Teleport (Recharge 4–6)", description: "" }).limit).toEqual({
      kind: "recharge",
      min: 4,
    });
    expect(parseEntry({ name: "Spellcasting (3/Day)", description: "" }).limit).toEqual({
      kind: "perDay",
      uses: 3,
    });
    expect(
      parseEntry({ name: "Relentless (Recharges after a Short or Long Rest)", description: "" })
        .limit
    ).toEqual({ kind: "rest" });
  });

  it("splits a multiattack into counted components", () => {
    const parsed = parseEntry(
      { name: "Multiattack", description: "The aboleth makes three tentacle attacks." },
      ["Tentacle", "Tail"]
    );
    expect(parsed.components).toEqual([{ name: "Tentacle", count: 3 }]);

    const mixed = parseEntry(
      {
        name: "Multiattack",
        description: "The dragon makes three attacks: one with its bite and two with its claws.",
      },
      ["Bite", "Claw"]
    );
    expect(mixed.components).toEqual([
      { name: "Bite", count: 1 },
      { name: "Claw", count: 2 },
    ]);
  });

  it("reads a skill check", () => {
    const parsed = parseEntry({
      name: "Detect",
      description: "The aboleth makes a Wisdom (Perception) check.",
    });
    expect(parsed.check).toEqual({ ability: "wisdom", skill: "Perception" });
  });
});

describe("parseDamageParts", () => {
  it("handles flat damage and unicode minus signs", () => {
    expect(parseDamageParts("deals 5 piercing damage")).toEqual([
      { expression: null, average: 5, type: "piercing" },
    ]);
    expect(parseDamageParts("Hit: 3 (1d6 − 1) slashing damage")).toEqual([
      { expression: "1d6-1", average: 3, type: "slashing" },
    ]);
  });
});

describe("doubleDice", () => {
  it("doubles dice but not the flat bonus", () => {
    expect(doubleDice("2d10+6")).toBe("4d10+6");
    expect(doubleDice("2d6+1d8-1")).toBe("4d6+2d8-1");
    expect(doubleDice("1d8")).toBe("2d8");
    expect(doubleDice("2d6r<=2+3")).toBe("4d6r<=2+3");
    expect(doubleDice("(1d6+2)*2")).toBe("(2d6+2)*2");
  });
});

describe("rollDamageParts", () => {
  it("sums multiple parts and stays in range", () => {
    const parts = parseDamageParts("17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage");
    for (let i = 0; i < 50; i++) {
      const result = rollDamageParts("Bite", parts)!;
      expect(result.total).toBeGreaterThanOrEqual(2 + 6 + 1);
      expect(result.total).toBeLessThanOrEqual(20 + 6 + 8);
    }
    const crit = rollDamageParts("Bite", parts, { crit: true })!;
    expect(crit.total).toBeGreaterThanOrEqual(4 + 6 + 2);
    expect(crit.expression).toBe("Bite (crit)");
  });

  it("returns null when there is nothing to roll", () => {
    expect(rollDamageParts("Nothing", [])).toBeNull();
  });
});

describe("used abilities", () => {
  it("round-trips and drops spent-nothing entries", () => {
    const raw = serializeUsedAbilities({ "Fire Breath": 1, Teleport: 0 });
    expect(parseUsedAbilities(raw)).toEqual({ "Fire Breath": 1 });
    expect(serializeUsedAbilities({})).toBe("");
    expect(parseUsedAbilities("not json")).toEqual({});
  });
});

describe("SRD catalog coverage", () => {
  it("parses real stat blocks", () => {
    const aboleth = parseStatBlock(find("Aboleth", "srd-2014"));
    const tail = aboleth.actions.find((a) => a.baseName === "Tail")!;
    expect(tail.attack?.bonus).toBe(9);
    expect(tail.damage[0].expression).toBe("3d6+5");
    const multi = aboleth.actions.find((a) => a.baseName === "Multiattack")!;
    expect(multi.components).toEqual([{ name: "Tentacle", count: 3 }]);

    const aboleth2024 = parseStatBlock(find("Aboleth", "srd-2024"));
    expect(aboleth2024.actions.find((a) => a.baseName === "Tentacle")?.attack?.bonus).toBe(9);
  });

  it("gives every to-hit action an attack bonus and nearly all a damage roll", () => {
    let attacks = 0;
    let withoutAttack = 0;
    let withoutDamage = 0;
    for (const monster of MONSTERS_5E) {
      const block = parseStatBlock(monster);
      block.actions.forEach((entry, index) => {
        const text = monster.actions[index].description;
        if (/to hit|Attack Roll/i.test(text) && /Hit:|damage/i.test(text)) {
          attacks++;
          if (!entry.attack) withoutAttack++;
          else if (entry.damage.length === 0) withoutDamage++;
        }
      });
    }
    expect(attacks).toBeGreaterThan(500);
    expect(withoutAttack / attacks).toBeLessThan(0.02);
    expect(withoutDamage / attacks).toBeLessThan(0.1);
  });
});
