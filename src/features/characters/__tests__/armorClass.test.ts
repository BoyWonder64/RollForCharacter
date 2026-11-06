import { getRulesetCatalog } from "../../../data/rulesets";
import {
  computeEquippedArmorClass,
  effectiveArmorProficiencies,
  effectiveArmorProficienciesForCharacter,
  effectiveWeaponProficiencies,
  effectiveWeaponProficienciesForCharacter,
} from "../characterCalculations";
import { recomputeArmorClass } from "../armorClassRepo";
import {
  createCharacterFromOnboarding,
  getCharacter,
  levelUp,
  updateCharacter,
  type OnboardingCharacterInput,
} from "../characterRepo";
import { addCustomFeat, listCharacterFeats, removeCharacterFeat, setFeatEnabled } from "../featRepo";
import {
  addArmorFromCatalog,
  addCustomArmor,
  listCharacterArmor,
  removeCharacterArmor,
  setArmorEquipped,
} from "../gearRepo";
import { computeArmorClass } from "../startingEquipment";

jest.mock("../../../db/client");

type Armor = Parameters<typeof computeArmorClass>[1][number];
const LEATHER: Armor = { category: "Light", baseArmorClass: 11, dexModifier: "full" };
const HALF_PLATE: Armor = { category: "Medium", baseArmorClass: 15, dexModifier: "max2" };
const PLATE: Armor = { category: "Heavy", baseArmorClass: 18, dexModifier: "none" };
const SHIELD: Armor = { category: "Shield", baseArmorClass: 2, dexModifier: "none" };

describe("computeEquippedArmorClass", () => {
  it("is 10 + Dex with nothing equipped", () => {
    expect(computeEquippedArmorClass(14, [])).toBe(12);
    expect(computeEquippedArmorClass(8, [])).toBe(9);
  });

  it("applies each body armor's Dex rule", () => {
    expect(computeEquippedArmorClass(18, [LEATHER])).toBe(15); // 11 + 4
    expect(computeEquippedArmorClass(18, [HALF_PLATE])).toBe(17); // 15 + min(4, 2)
    expect(computeEquippedArmorClass(18, [PLATE])).toBe(18); // no Dex
  });

  it("still applies a negative Dex modifier to light and medium armor", () => {
    expect(computeEquippedArmorClass(8, [LEATHER])).toBe(10); // 11 - 1
    expect(computeEquippedArmorClass(8, [HALF_PLATE])).toBe(14); // 15 + min(-1, 2)
  });

  it("uses only the best body armor when more than one is equipped", () => {
    expect(computeEquippedArmorClass(10, [LEATHER, PLATE])).toBe(18);
    expect(computeEquippedArmorClass(20, [LEATHER, HALF_PLATE])).toBe(17); // leather 16 vs half plate 17
  });

  it("adds shields on top of body armor, or of unarmored AC", () => {
    expect(computeEquippedArmorClass(10, [PLATE, SHIELD])).toBe(20);
    expect(computeEquippedArmorClass(14, [SHIELD])).toBe(14); // 10 + 2 + 2
  });

  it("adds magic bonuses on both armor and shields", () => {
    expect(
      computeEquippedArmorClass(10, [
        { ...PLATE, magicBonus: 1 },
        { ...SHIELD, magicBonus: 2 },
      ])
    ).toBe(23);
  });

  it("picks the best body armor including its magic bonus", () => {
    // +3 leather (11+0+3 = 14) loses to plain plate (18) at Dex 10.
    expect(computeEquippedArmorClass(10, [{ ...LEATHER, magicBonus: 3 }, PLATE])).toBe(18);
    // +3 leather (11+4+3 = 18) beats plain half plate (15+2 = 17) at Dex 18.
    expect(computeEquippedArmorClass(18, [{ ...LEATHER, magicBonus: 3 }, HALF_PLATE])).toBe(18);
  });

  it("adds the feat bonus last", () => {
    expect(computeEquippedArmorClass(10, [PLATE], 1)).toBe(19);
    expect(computeEquippedArmorClass(10, [], 1)).toBe(11);
  });

  it("matches onboarding's computeArmorClass, which delegates to it", () => {
    const sets: Armor[][] = [[], [LEATHER], [HALF_PLATE, SHIELD], [PLATE, SHIELD]];
    for (const dex of [6, 10, 14, 20]) {
      for (const armor of sets) {
        expect(computeArmorClass(dex, armor)).toBe(computeEquippedArmorClass(dex, armor));
      }
    }
  });
});

describe("effective armor and weapon proficiencies", () => {
  const catalog = getRulesetCatalog("5e");
  const cleric = catalog.classes.find((c) => c.id === "cleric")!;
  const progression = catalog.classProgressions?.find((p) => p.classId === "cleric");
  const life = progression?.subclasses?.find((s) => s.id === "life-domain");

  it("2014 Life Domain grants Heavy armor on top of the Cleric's list", () => {
    expect(life).toBeDefined();
    expect(cleric.armorProficiencies).not.toContain("Heavy armor");
    const armor = effectiveArmorProficiencies(cleric, life);
    expect(armor).toEqual(expect.arrayContaining([...(cleric.armorProficiencies ?? []), "Heavy armor"]));
  });

  it("returns the class's own lists with no subclass", () => {
    expect(effectiveArmorProficiencies(cleric, undefined)).toEqual(cleric.armorProficiencies);
    expect(effectiveWeaponProficiencies(cleric, undefined)).toEqual(cleric.weaponProficiencies);
  });

  it("adds a subclass's bonus weapon proficiencies", () => {
    const weapons = effectiveWeaponProficiencies(cleric, { bonusWeaponProficiencies: ["Martial weapons"] });
    expect(weapons).toContain("Martial weapons");
  });

  it("reads the character's own class and subclass", async () => {
    const character = await createCharacterFromOnboarding({
      ...BASE_CHARACTER,
      name: "Life Cleric",
      className: "Cleric",
      subclass: "life-domain",
      level: 1,
    });
    expect(effectiveArmorProficienciesForCharacter(character)).toContain("Heavy armor");
    expect(effectiveWeaponProficienciesForCharacter(character)).toEqual(
      expect.arrayContaining(cleric.weaponProficiencies ?? [])
    );

    const plain = await createCharacterFromOnboarding({ ...BASE_CHARACTER, name: "Plain Cleric", className: "Cleric" });
    expect(effectiveArmorProficienciesForCharacter(plain)).not.toContain("Heavy armor");
  });
});

const BASE_CHARACTER: OnboardingCharacterInput = {
  name: "AC Fighter",
  ruleset: "5e",
  race: "Human",
  className: "Fighter",
  background: "",
  level: 4,
  maxHp: 36,
  armorClass: 16,
  speed: 30,
  proficiencyBonus: 2,
  strength: 16,
  dexterity: 14, // +2
  constitution: 14,
  intelligence: 10,
  wisdom: 10,
  charisma: 8,
};

async function armorClassOf(characterId: number): Promise<number | undefined> {
  return (await getCharacter(characterId))?.armorClass;
}

describe("recomputeArmorClass (sheet AC follows what's equipped)", () => {
  it("writes 10 + Dex when nothing is equipped", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await recomputeArmorClass(character.id);
    expect(await armorClassOf(character.id)).toBe(12);
  });

  it("is a no-op for an unknown character", async () => {
    await expect(recomputeArmorClass(999_999)).resolves.toBeUndefined();
  });

  it("recomputes when armor is added already equipped", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await addArmorFromCatalog(character.id, "5e", "chain-mail", { equipped: true });
    expect(await armorClassOf(character.id)).toBe(16);
    await addArmorFromCatalog(character.id, "5e", "shield", { equipped: true });
    expect(await armorClassOf(character.id)).toBe(18);
  });

  it("leaves AC alone when armor is added unequipped", async () => {
    const character = await createCharacterFromOnboarding({ ...BASE_CHARACTER, armorClass: 13 });
    await addArmorFromCatalog(character.id, "5e", "plate");
    expect(await armorClassOf(character.id)).toBe(13);
  });

  it("recomputes on equip and unequip", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await addArmorFromCatalog(character.id, "5e", "plate");
    const [plate] = await listCharacterArmor(character.id);

    await setArmorEquipped(plate.id, true);
    expect(await armorClassOf(character.id)).toBe(18);

    await setArmorEquipped(plate.id, false);
    expect(await armorClassOf(character.id)).toBe(12);
  });

  it("recomputes when equipped armor is removed", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await addArmorFromCatalog(character.id, "5e", "plate", { equipped: true });
    const [plate] = await listCharacterArmor(character.id);

    await removeCharacterArmor(plate.id);
    expect(await armorClassOf(character.id)).toBe(12);
  });

  it("counts a custom armor's magic bonus once it's equipped", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await addCustomArmor(character.id, {
      name: "+1 Breastplate",
      category: "Medium",
      baseArmorClass: 14,
      dexModifier: "max2",
      isMagic: true,
      magicBonus: 1,
    });
    const [breastplate] = await listCharacterArmor(character.id);
    await setArmorEquipped(breastplate.id, true);
    expect(await armorClassOf(character.id)).toBe(17); // 14 + 2 + 1
  });

  it("adds a feat's AC bonus when taken, and drops it when disabled or removed", async () => {
    let character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await addArmorFromCatalog(character.id, "5e", "chain-mail", { equipped: true });
    character = (await getCharacter(character.id))!;

    await addCustomFeat(character, {
      name: "Defensive Training",
      effects: [{ kind: "armorClassBonus", amount: 1 }],
    });
    expect(await armorClassOf(character.id)).toBe(17);

    const [feat] = await listCharacterFeats(character);
    await setFeatEnabled(feat.id, false);
    expect(await armorClassOf(character.id)).toBe(16);

    await setFeatEnabled(feat.id, true);
    expect(await armorClassOf(character.id)).toBe(17);

    await removeCharacterFeat(feat.id);
    expect(await armorClassOf(character.id)).toBe(16);
  });

  it("doesn't touch AC for a feat with no AC effect", async () => {
    const character = await createCharacterFromOnboarding({ ...BASE_CHARACTER, armorClass: 15 });
    await addCustomFeat(character, { name: "Lucky-ish" });
    expect(await armorClassOf(character.id)).toBe(15);
  });

  it("recomputes after a Dexterity increase at level-up", async () => {
    const character = await createCharacterFromOnboarding({ ...BASE_CHARACTER, level: 3 });
    await addArmorFromCatalog(character.id, "5e", "leather", { equipped: true });
    expect(await armorClassOf(character.id)).toBe(13); // 11 + 2

    await levelUp(character.id, {
      hpMethod: "manual",
      asiChoice: { type: "ability", increases: { dexterity: 2 } },
    });
    expect((await getCharacter(character.id))?.dexterity).toBe(16);
    expect(await armorClassOf(character.id)).toBe(14); // 11 + 3
  });

  it("leaves AC alone after a non-Dex ability increase at level-up", async () => {
    const character = await createCharacterFromOnboarding({ ...BASE_CHARACTER, level: 3, armorClass: 15 });
    await levelUp(character.id, {
      hpMethod: "manual",
      asiChoice: { type: "ability", increases: { strength: 2 } },
    });
    expect(await armorClassOf(character.id)).toBe(15);
  });

  it("bumps updatedAt so the change syncs", async () => {
    const character = await createCharacterFromOnboarding(BASE_CHARACTER);
    await updateCharacter(character.id, {});
    await new Promise((resolve) => setTimeout(resolve, 5));
    const before = (await getCharacter(character.id))!.updatedAt;
    await new Promise((resolve) => setTimeout(resolve, 5));
    await recomputeArmorClass(character.id);
    const after = (await getCharacter(character.id))!.updatedAt;
    expect(new Date(after).getTime()).toBeGreaterThan(new Date(before).getTime());
  });
});
