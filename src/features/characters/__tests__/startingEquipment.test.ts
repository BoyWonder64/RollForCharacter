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
  grantKey,
  isProficientWithArmor,
  resolveStartingGear,
  weaponCandidates,
  type StartingEquipmentSelection,
} from "../startingEquipment";

jest.mock("../../../db/client");

const CATALOG_2024 = getRulesetCatalog("5e-2024");
const CATALOG_2014 = getRulesetCatalog("5e");

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
