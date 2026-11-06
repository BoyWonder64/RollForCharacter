import { getRulesetCatalog } from "../../../data/rulesets";
import type { ClassDefinition, EquipmentGrant } from "../../../data/rulesets";
import { createCharacter, getCharacter } from "../characterRepo";
import { listCharacterArmor, listCharacterWeapons, listGearItems } from "../gearRepo";
import { applyStartingGear } from "../startingGearRepo";
import {
  CUSTOM_PICK,
  EMPTY_SELECTION,
  NO_PICK,
  armorCandidates,
  computeArmorClass,
  describeOption,
  goldInsteadChoice,
  grantKey,
  isProficientWithArmor,
  itemChoiceOptions,
  resolveStartingGear,
  resolvedItemChoiceName,
  rollGoldOption,
  weaponCandidates,
  type StartingEquipmentSelection,
} from "../startingEquipment";

jest.mock("../../../db/client");

const CATALOG_2024 = getRulesetCatalog("5e-2024");
const CATALOG_2014 = getRulesetCatalog("5e");
const CATALOG_35E = getRulesetCatalog("3.5e");

function classOf(catalog: typeof CATALOG_2024, id: string): ClassDefinition {
  return catalog.classes.find((c) => c.id === id)!;
}

describe("isProficientWithArmor", () => {
  const armor = (id: string, category: string) => ({ id, category }) as never;

  it("matches by category and shields", () => {
    expect(isProficientWithArmor(armor("leather", "Light"), ["Light armor"])).toBe(true);
    expect(isProficientWithArmor(armor("chain-mail", "Heavy"), ["Light armor", "Medium armor"])).toBe(false);
    expect(isProficientWithArmor(armor("shield", "Shield"), ["Light armor"])).toBe(false);
    expect(isProficientWithArmor(armor("shield", "Shield"), ["Shields"])).toBe(true);
  });

  it("treats All armor as every non-shield armor", () => {
    expect(isProficientWithArmor(armor("plate", "Heavy"), ["All armor", "Shields"])).toBe(true);
  });

  it("restricts nonmetal proficiency to metal-free armor", () => {
    const druid = ["Light armor", "Medium armor (nonmetal)", "Shields (nonmetal)"];
    expect(isProficientWithArmor(armor("hide", "Medium"), druid)).toBe(true);
    expect(isProficientWithArmor(armor("chain-shirt", "Medium"), druid)).toBe(false);
    expect(isProficientWithArmor(armor("shield", "Shield"), druid)).toBe(true);
  });

  it("is false with no proficiencies", () => {
    expect(isProficientWithArmor(armor("padded", "Light"), [])).toBe(false);
  });
});

describe("2024 Cleric kit", () => {
  const cleric = classOf(CATALOG_2024, "cleric");

  it("offers the SRD's two packages: the kit (with gold) and gold only", () => {
    const [line] = cleric.startingEquipment!;
    expect(line).toHaveLength(2);
    expect(line[1]).toEqual([{ kind: "gold", amount: 110 }]);
    const names = describeOption(line[0], 0, 0, EMPTY_SELECTION, CATALOG_2024, cleric);
    expect(names).toBe("Chain Shirt, Shield, Mace, Holy Symbol, Priest's Pack, 7 gp");
  });

  it("lets the player swap the mace for any proficient weapon", () => {
    const mace = cleric.startingEquipment![0][0][2];
    const options = weaponCandidates(mace, CATALOG_2024, cleric, false);
    expect(options.length).toBeGreaterThan(5);
    expect(options.every((c) => c.proficient)).toBe(true);
    expect(options.map((c) => c.def.category).every((c) => c.startsWith("Simple"))).toBe(true);
  });

  it("lists non-proficient weapons only when asked", () => {
    const mace = cleric.startingEquipment![0][0][2];
    const all = weaponCandidates(mace, CATALOG_2024, cleric, true);
    expect(all.some((c) => !c.proficient)).toBe(true);
    // Proficient ones still sort first.
    const firstNon = all.findIndex((c) => !c.proficient);
    expect(all.slice(0, firstNon).every((c) => c.proficient)).toBe(true);
  });

  it("offers light and medium armor for the chain shirt, not heavy, until show-all", () => {
    const chainShirt = cleric.startingEquipment![0][0][0];
    const ids = armorCandidates(chainShirt, CATALOG_2024, cleric, false).map((c) => c.def.id);
    expect(ids).toEqual(expect.arrayContaining(["padded", "leather", "studded-leather", "hide", "chain-shirt", "breastplate"]));
    expect(ids).not.toContain("chain-mail");
    expect(ids).not.toContain("shield");
    const everything = armorCandidates(chainShirt, CATALOG_2024, cleric, true).map((c) => c.def.id);
    expect(everything).toContain("plate");
    expect(everything).not.toContain("shield");
  });

  it("offers only shields for the shield grant", () => {
    const shield = cleric.startingEquipment![0][0][1];
    expect(armorCandidates(shield, CATALOG_2024, cleric, true).map((c) => c.def.id)).toEqual(["shield"]);
  });

  it("resolves default and swapped choices into concrete gear", () => {
    const def = resolveStartingGear(cleric.startingEquipment!, EMPTY_SELECTION, CATALOG_2024, cleric);
    expect(def.weapons.map((w) => w.def?.id)).toEqual(["mace"]);
    expect(def.armor.map((a) => a.id)).toEqual(["chain-shirt", "shield"]);
    expect(def.items.map((i) => i.name)).toEqual(["Holy Symbol", "Priest's Pack"]);
    expect(def.gold).toBe(7);

    const swapped: StartingEquipmentSelection = {
      ...EMPTY_SELECTION,
      picks: { [grantKey(0, 0, 2)]: "quarterstaff", [grantKey(0, 0, 0)]: "breastplate", [grantKey(0, 0, 1)]: NO_PICK },
    };
    const gear = resolveStartingGear(cleric.startingEquipment!, swapped, CATALOG_2024, cleric);
    expect(gear.weapons.map((w) => w.def?.id)).toEqual(["quarterstaff"]);
    expect(gear.armor.map((a) => a.id)).toEqual(["breastplate"]);
  });

  it("gold-only option grants just gold", () => {
    const gear = resolveStartingGear(cleric.startingEquipment!, { ...EMPTY_SELECTION, optionIndex: { 0: 1 } }, CATALOG_2024, cleric);
    expect(gear).toEqual({ weapons: [], armor: [], items: [], gold: 110 });
  });

  it("supports a typed custom weapon", () => {
    const key = grantKey(0, 0, 2);
    const gear = resolveStartingGear(
      cleric.startingEquipment!,
      { ...EMPTY_SELECTION, picks: { [key]: CUSTOM_PICK }, customNames: { [key]: " Sun Hammer " } },
      CATALOG_2024,
      cleric
    );
    expect(gear.weapons).toEqual([{ customName: "Sun Hammer", quantity: 1 }]);
  });
});

describe("every class's starting equipment", () => {
  for (const [label, catalog] of [
    ["2014", CATALOG_2014],
    ["2024", CATALOG_2024],
    ["3.5e", CATALOG_35E],
  ] as const) {
    for (const klass of catalog.classes) {
      it(`${label} ${klass.name}: every grant resolves against the catalog`, () => {
        for (const line of klass.startingEquipment ?? []) {
          for (const option of line) {
            for (const grant of option) {
              if (grant.kind === "weapon") expect(catalog.weapons?.some((w) => w.id === grant.weaponId)).toBe(true);
              if (grant.kind === "armor") expect(catalog.armor?.some((a) => a.id === grant.armorId)).toBe(true);
            }
          }
        }
      });

      it(`${label} ${klass.name}: default selection resolves and swap lists are never empty`, () => {
        const lines = klass.startingEquipment ?? [];
        expect(lines.length).toBeGreaterThan(0);
        const gear = resolveStartingGear(lines, EMPTY_SELECTION, catalog, klass);
        expect(gear.weapons.length + gear.armor.length + gear.items.length + gear.gold).toBeGreaterThan(0);
        lines.forEach((line) =>
          line.forEach((option) =>
            option.forEach((grant: EquipmentGrant) => {
              if (grant.kind === "weapon" || grant.kind === "weaponChoice") {
                expect(weaponCandidates(grant, catalog, klass, false).length).toBeGreaterThan(0);
              }
              if (grant.kind === "armor") {
                expect(armorCandidates(grant, catalog, klass, false).length).toBeGreaterThan(0);
              }
            })
          )
        );
      });
    }
  }

  it("2024: every class offers a gold-only alternative", () => {
    for (const klass of CATALOG_2024.classes) {
      const line = klass.startingEquipment![0];
      expect(line[line.length - 1]).toEqual([expect.objectContaining({ kind: "gold" })]);
    }
  });

  it("2024 Fighter has all three SRD packages", () => {
    expect(classOf(CATALOG_2024, "fighter").startingEquipment![0]).toHaveLength(3);
  });
});

describe("2014 Cleric proficiency filtering", () => {
  const cleric = classOf(CATALOG_2014, "cleric");

  it("hides chain mail and warhammer until show-all", () => {
    const armorLine = cleric.startingEquipment![1];
    const armorGrant = armorLine[0][0];
    const armorIds = armorCandidates(armorGrant, CATALOG_2014, cleric, false).map((c) => c.def.id);
    expect(armorIds).toContain("scale-mail");
    expect(armorIds).toContain("leather");
    expect(armorIds).not.toContain("chain-mail");
    expect(armorCandidates(armorGrant, CATALOG_2014, cleric, true).map((c) => c.def.id)).toContain("chain-mail");
  });
});

describe("computeArmorClass", () => {
  const find = (id: string) => CATALOG_2024.armor!.find((a) => a.id === id)!;

  it("is 10 + Dex with no armor", () => {
    expect(computeArmorClass(14, [])).toBe(12);
  });

  it("applies each armor's Dex rule and shield bonus", () => {
    expect(computeArmorClass(16, [find("leather")])).toBe(14); // 11 + 3
    expect(computeArmorClass(16, [find("chain-shirt")])).toBe(15); // 13 + max 2
    expect(computeArmorClass(16, [find("chain-mail")])).toBe(16); // 16 + 0
    expect(computeArmorClass(10, [find("chain-shirt"), find("shield")])).toBe(15); // 13 + 0 + 2
  });
});

describe("applyStartingGear", () => {
  it("saves weapons (stacked), armor equipped, items and gold for a 2024 Cleric", async () => {
    const cleric = classOf(CATALOG_2024, "cleric");
    const gear = resolveStartingGear(cleric.startingEquipment!, EMPTY_SELECTION, CATALOG_2024, cleric);
    const character = await createCharacter("Starting Gear Cleric");
    await applyStartingGear(character.id, "5e-2024", gear);

    const weapons = await listCharacterWeapons(character.id);
    expect(weapons.map((w) => w.name)).toEqual(["Mace"]);
    expect(weapons[0].equipped).toBe(true);
    const armor = await listCharacterArmor(character.id);
    expect(armor.map((a) => a.name).sort()).toEqual(["Chain Shirt", "Shield"]);
    expect(armor.every((a) => a.equipped)).toBe(true);
    expect((await listGearItems(character.id)).map((i) => i.name)).toEqual(["Holy Symbol", "Priest's Pack"]);
    expect((await getCharacter(character.id))!.goldPieces).toBe(7);
  });

  it("stacks quantities instead of duplicating rows", async () => {
    const fighter = classOf(CATALOG_2024, "fighter");
    const selection: StartingEquipmentSelection = { ...EMPTY_SELECTION, optionIndex: { 0: 1 } }; // Option B
    const gear = resolveStartingGear(fighter.startingEquipment!, selection, CATALOG_2024, fighter);
    const character = await createCharacter("Starting Gear Fighter B");
    await applyStartingGear(character.id, "5e-2024", gear);

    const items = await listGearItems(character.id);
    expect(items.find((i) => i.name === "Arrows")?.quantity).toBe(20);
    expect((await getCharacter(character.id))!.goldPieces).toBe(11);
  });

  it("keeps a weapon quantity on a single row", async () => {
    const barbarian = classOf(CATALOG_2024, "barbarian");
    const gear = resolveStartingGear(barbarian.startingEquipment!, EMPTY_SELECTION, CATALOG_2024, barbarian);
    const character = await createCharacter("Starting Gear Barbarian");
    await applyStartingGear(character.id, "5e-2024", gear);
    const weapons = await listCharacterWeapons(character.id);
    expect(weapons.find((w) => w.name === "Handaxe")?.quantity).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// "Your choice" items (instruments, artisan's tools) and 2014 rolled gold
// ---------------------------------------------------------------------------

describe("itemChoice grants", () => {
  type ItemChoice = Extract<EquipmentGrant, { kind: "itemChoice" }>;
  const instrument: ItemChoice = { kind: "itemChoice", category: "instrument" };
  const toolsOrInstrument: ItemChoice = { kind: "itemChoice", category: ["artisanTools", "instrument"], quantity: 1 };
  const lines: EquipmentGrant[][][] = [[[instrument]], [[toolsOrInstrument]]];
  const view = CATALOG_2024;
  const profs = classOf(CATALOG_2024, "bard");

  it("lists a category's named options, and every category for a combined choice", () => {
    const instruments = itemChoiceOptions(instrument);
    expect(instruments).toContain("Lute");
    expect(instruments).not.toContain("Smith's Tools");

    const combined = itemChoiceOptions(toolsOrInstrument);
    expect(combined).toEqual(expect.arrayContaining(["Lute", "Smith's Tools"]));
    expect(combined.length).toBe(instruments.length + itemChoiceOptions({ kind: "itemChoice", category: "artisanTools" }).length);
  });

  it("defaults to the category's first option", () => {
    expect(resolvedItemChoiceName(instrument, grantKey(0, 0, 0), EMPTY_SELECTION)).toBe(itemChoiceOptions(instrument)[0]);
  });

  it("resolves the player's pick into a named gear item", () => {
    const selection: StartingEquipmentSelection = {
      ...EMPTY_SELECTION,
      picks: { [grantKey(0, 0, 0)]: "Lute", [grantKey(1, 0, 0)]: "Smith's Tools" },
    };
    const gear = resolveStartingGear(lines, selection, view, profs);
    expect(gear.items).toEqual([
      { name: "Lute", quantity: 1, description: "" },
      { name: "Smith's Tools", quantity: 1, description: "" },
    ]);
    expect(describeOption(lines[0][0], 0, 0, selection, view, profs)).toBe("Lute");
  });

  it("supports a typed custom item, and drops it when left blank", () => {
    const key = grantKey(0, 0, 0);
    const typed: StartingEquipmentSelection = {
      ...EMPTY_SELECTION,
      picks: { [key]: CUSTOM_PICK },
      customNames: { [key]: "  Hurdy-gurdy  " },
    };
    expect(resolveStartingGear([lines[0]], typed, view, profs).items).toEqual([
      { name: "Hurdy-gurdy", quantity: 1, description: "" },
    ]);
    expect(describeOption(lines[0][0], 0, 0, typed, view, profs)).toBe("Hurdy-gurdy");

    const blank: StartingEquipmentSelection = { ...EMPTY_SELECTION, picks: { [key]: CUSTOM_PICK } };
    expect(resolveStartingGear([lines[0]], blank, view, profs).items).toEqual([]);
    expect(describeOption(lines[0][0], 0, 0, blank, view, profs)).toBe("Custom item");
  });

  it("2024 Bard's kit offers an instrument of the player's choice", () => {
    const bard = classOf(CATALOG_2024, "bard");
    const grants = bard.startingEquipment!.flat(2);
    expect(grants).toContainEqual({ kind: "itemChoice", category: "instrument", quantity: undefined });
  });
});

describe("rolled starting gold (2014 \"gold instead\")", () => {
  const goldRoll = { kind: "goldRoll", formula: "4d4" } as const;
  const kitLine = [[{ kind: "item", name: "Explorer's Pack" }], [goldRoll]] as never;
  const otherLine = [[{ kind: "item", name: "Torch", quantity: 2 }]] as never;
  const view = CATALOG_2014;
  const profs = classOf(CATALOG_2014, "fighter");

  afterEach(() => jest.restoreAllMocks());

  it("rolls the formula x10 once and caches it", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.99); // every d4 rolls 4
    const key = grantKey(0, 1, 0);
    const rolled = rollGoldOption(goldRoll, key, EMPTY_SELECTION);
    expect(rolled.rolledAmounts[key]).toBe(160);

    jest.spyOn(Math, "random").mockReturnValue(0); // would roll all 1s
    const again = rollGoldOption(goldRoll, key, rolled);
    expect(again).toBe(rolled);
    expect(again.rolledAmounts[key]).toBe(160);
  });

  it("stays within 4d4 x10 bounds", () => {
    for (let i = 0; i < 50; i++) {
      const amount = rollGoldOption(goldRoll, "k", EMPTY_SELECTION).rolledAmounts.k;
      expect(amount).toBeGreaterThanOrEqual(40);
      expect(amount).toBeLessThanOrEqual(160);
      expect(amount % 10).toBe(0);
    }
  });

  it("doesn't mutate the selection it's given", () => {
    const before = { ...EMPTY_SELECTION, rolledAmounts: {} };
    rollGoldOption(goldRoll, "k", before);
    expect(before.rolledAmounts).toEqual({});
  });

  it("is only 'gold instead' when the lone goldRoll option is chosen", () => {
    expect(goldInsteadChoice([kitLine, otherLine], EMPTY_SELECTION)).toBeUndefined();
    const chosen = { ...EMPTY_SELECTION, optionIndex: { 0: 1 } };
    expect(goldInsteadChoice([kitLine, otherLine], chosen)).toEqual({ lineIndex: 0, key: grantKey(0, 1, 0) });
  });

  it("forfeits every other line's gear when gold instead is chosen", () => {
    const key = grantKey(0, 1, 0);
    const selection = { ...EMPTY_SELECTION, optionIndex: { 0: 1 }, rolledAmounts: { [key]: 110 } };
    expect(resolveStartingGear([kitLine, otherLine], selection, view, profs)).toEqual({
      weapons: [],
      armor: [],
      items: [],
      gold: 110,
    });
    expect(describeOption([goldRoll], 0, 1, selection, view, profs)).toBe("110 gp");
  });

  it("grants 0 gp, not NaN, before the roll has happened", () => {
    const selection = { ...EMPTY_SELECTION, optionIndex: { 0: 1 } };
    expect(resolveStartingGear([kitLine], selection, view, profs).gold).toBe(0);
  });

  it("keeps the normal kit when the kit option is chosen", () => {
    const gear = resolveStartingGear([kitLine, otherLine], EMPTY_SELECTION, view, profs);
    expect(gear.items.map((i) => i.name)).toEqual(["Explorer's Pack", "Torch"]);
    expect(gear.gold).toBe(0);
  });

  it("every 2014 class's first line ends with a lone 4d4 gold option", () => {
    for (const klass of CATALOG_2014.classes) {
      if (!klass.startingEquipment?.length) continue;
      const firstLine = klass.startingEquipment[0];
      expect({ id: klass.id, last: firstLine[firstLine.length - 1] }).toEqual({ id: klass.id, last: [goldRoll] });
    }
  });

  it("no 2024 class uses a rolled gold option (2024 gold is fixed)", () => {
    const grants = CATALOG_2024.classes.flatMap((c) => c.startingEquipment ?? []).flat(2);
    expect(grants.some((g) => g.kind === "goldRoll")).toBe(false);
  });
});

describe("2014 Druid nonmetal shield", () => {
  it("counts the generic SRD shield as nonmetal-compliant", () => {
    const druid = classOf(CATALOG_2014, "druid");
    const shield = (CATALOG_2014.armor ?? []).find((a) => a.id === "shield")!;
    expect(isProficientWithArmor(shield, druid.armorProficiencies)).toBe(true);
  });
});

describe("3.5e armor proficiency qualifiers", () => {
  const find = (id: string) => CATALOG_35E.armor!.find((a) => a.id === id)!;

  it("excludes the tower shield from an 'except tower shields' grant", () => {
    const barbarianProfs = classOf(CATALOG_35E, "barbarian").armorProficiencies;
    expect(isProficientWithArmor(find("shield-heavy-steel"), barbarianProfs)).toBe(true);
    expect(isProficientWithArmor(find("shield-tower"), barbarianProfs)).toBe(false);
  });

  it("includes the tower shield when the grant says so", () => {
    const fighterProfs = classOf(CATALOG_35E, "fighter").armorProficiencies;
    expect(isProficientWithArmor(find("shield-tower"), fighterProfs)).toBe(true);
  });

  it("Druid's combined 'nonmetal, except tower shields' only allows wooden shields", () => {
    const druidProfs = classOf(CATALOG_35E, "druid").armorProficiencies;
    expect(isProficientWithArmor(find("shield-light-wooden"), druidProfs)).toBe(true);
    expect(isProficientWithArmor(find("shield-light-steel"), druidProfs)).toBe(false);
    expect(isProficientWithArmor(find("shield-tower"), druidProfs)).toBe(false);
    expect(isProficientWithArmor(find("buckler"), druidProfs)).toBe(true);
  });
});

describe("3.5e weapons/armor catalog", () => {
  it("every id referenced by 3.5e classes resolves in the catalog", () => {
    for (const klass of CATALOG_35E.classes) {
      for (const line of klass.startingEquipment ?? []) {
        for (const option of line) {
          for (const grant of option) {
            if (grant.kind === "weapon") {
              expect(CATALOG_35E.weapons?.some((w) => w.id === grant.weaponId)).toBe(true);
            }
            if (grant.kind === "armor") {
              expect(CATALOG_35E.armor?.some((a) => a.id === grant.armorId)).toBe(true);
            }
          }
        }
      }
    }
  });

  it("splits 3.5e shields into wooden/steel variants, unlike 5e's single generic Shield", () => {
    const shieldIds = (CATALOG_35E.armor ?? []).filter((a) => a.category === "Shield").map((a) => a.id);
    expect(shieldIds).toEqual(
      expect.arrayContaining([
        "buckler",
        "shield-light-wooden",
        "shield-light-steel",
        "shield-heavy-wooden",
        "shield-heavy-steel",
        "shield-tower",
      ])
    );
  });

  it("double weapons keep both heads' damage dice", () => {
    const urgrosh = CATALOG_35E.weapons!.find((w) => w.id === "urgrosh-dwarven")!;
    expect(urgrosh.damageDice).toBe("1d8/1d6");
    expect(urgrosh.damageType).toBe("Slashing or piercing");
  });
});
