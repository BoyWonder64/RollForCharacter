import { createCharacter } from "../characterRepo";
import {
  addArmorFromCatalog,
  addCustomArmor,
  addCustomWeapon,
  addWeaponFromCatalog,
  describeArmorAc,
  describeAttackBonus,
  isProficientWithWeapon,
  listArmorCatalog,
  listCharacterArmor,
  listCharacterWeapons,
  listWeaponCatalog,
  parseWeaponProperties,
  removeCharacterArmor,
  removeCharacterWeapon,
  setArmorEquipped,
  setWeaponEquipped,
  weaponAttackBonus,
} from "../gearRepo";

jest.mock("../../../db/client");

describe("gearRepo", () => {
  describe("listWeaponCatalog / listArmorCatalog", () => {
    it("returns the 5e SRD weapon catalog", () => {
      const weapons = listWeaponCatalog("5e");
      expect(weapons.find((w) => w.id === "longsword")).toMatchObject({
        name: "Longsword",
        damageDice: "1d8",
      });
    });

    it("returns the 5e SRD armor catalog", () => {
      const armor = listArmorCatalog("5e");
      expect(armor.find((a) => a.id === "chain-mail")).toMatchObject({
        name: "Chain Mail",
        baseArmorClass: 16,
      });
    });

    it("falls back to the default ruleset catalog for an unknown ruleset", () => {
      expect(listWeaponCatalog("made-up").length).toBeGreaterThan(0);
    });
  });

  describe("weapons", () => {
    it("adds a weapon from the catalog", async () => {
      const character = await createCharacter("Gear Catalog Weapon");

      await addWeaponFromCatalog(character.id, "5e", "longsword");

      const weapons = await listCharacterWeapons(character.id);
      expect(weapons).toHaveLength(1);
      expect(weapons[0]).toMatchObject({
        name: "Longsword",
        catalogId: "longsword",
        damageDice: "1d8",
        damageType: "Slashing",
        equipped: false,
      });
      expect(parseWeaponProperties(weapons[0].properties)).toEqual(["Versatile (1d10)"]);
    });

    it("adds a custom weapon", async () => {
      const character = await createCharacter("Gear Custom Weapon");

      await addCustomWeapon(character.id, {
        name: "Moonblade",
        category: "Martial Melee",
        damageDice: "1d10",
        damageType: "Radiant",
        properties: ["Finesse", "Glows"],
      });

      const weapons = await listCharacterWeapons(character.id);
      expect(weapons).toHaveLength(1);
      expect(weapons[0]).toMatchObject({ name: "Moonblade", catalogId: null });
      expect(parseWeaponProperties(weapons[0].properties)).toEqual(["Finesse", "Glows"]);
    });

    it("toggles equipped state", async () => {
      const character = await createCharacter("Gear Weapon Equip");
      await addWeaponFromCatalog(character.id, "5e", "dagger");
      const [weapon] = await listCharacterWeapons(character.id);

      await setWeaponEquipped(weapon.id, true);
      const [equipped] = await listCharacterWeapons(character.id);
      expect(equipped.equipped).toBe(true);

      await setWeaponEquipped(weapon.id, false);
      const [unequipped] = await listCharacterWeapons(character.id);
      expect(unequipped.equipped).toBe(false);
    });

    it("removes a weapon", async () => {
      const character = await createCharacter("Gear Weapon Remove");
      await addWeaponFromCatalog(character.id, "5e", "shortsword");
      const [weapon] = await listCharacterWeapons(character.id);

      await removeCharacterWeapon(weapon.id);

      expect(await listCharacterWeapons(character.id)).toHaveLength(0);
    });

    it("only returns weapons for the requested character", async () => {
      const characterA = await createCharacter("Gear Weapon Scope A");
      const characterB = await createCharacter("Gear Weapon Scope B");
      await addWeaponFromCatalog(characterA.id, "5e", "dagger");

      expect(await listCharacterWeapons(characterB.id)).toHaveLength(0);
    });
  });

  describe("armor", () => {
    it("adds armor from the catalog", async () => {
      const character = await createCharacter("Gear Catalog Armor");

      await addArmorFromCatalog(character.id, "5e", "breastplate");

      const armor = await listCharacterArmor(character.id);
      expect(armor).toHaveLength(1);
      expect(armor[0]).toMatchObject({
        name: "Breastplate",
        catalogId: "breastplate",
        baseArmorClass: 14,
        dexModifier: "max2",
        equipped: false,
      });
      expect(describeArmorAc(armor[0])).toBe("14 + Dex modifier (max 2)");
    });

    it("adds custom armor", async () => {
      const character = await createCharacter("Gear Custom Armor");

      await addCustomArmor(character.id, {
        name: "Dragonscale Mail",
        category: "Medium",
        baseArmorClass: 15,
        dexModifier: "max2",
        stealthDisadvantage: false,
      });

      const armor = await listCharacterArmor(character.id);
      expect(armor).toHaveLength(1);
      expect(armor[0]).toMatchObject({ name: "Dragonscale Mail", catalogId: null, baseArmorClass: 15 });
    });

    it("describes a shield's AC as a flat bonus", () => {
      const shield = listArmorCatalog("5e").find((a) => a.id === "shield")!;
      expect(describeArmorAc(shield)).toBe("+2");
    });

    it("toggles equipped state", async () => {
      const character = await createCharacter("Gear Armor Equip");
      await addArmorFromCatalog(character.id, "5e", "leather");
      const [item] = await listCharacterArmor(character.id);

      await setArmorEquipped(item.id, true);
      const [equipped] = await listCharacterArmor(character.id);
      expect(equipped.equipped).toBe(true);
    });

    it("removes armor", async () => {
      const character = await createCharacter("Gear Armor Remove");
      await addArmorFromCatalog(character.id, "5e", "shield");
      const [item] = await listCharacterArmor(character.id);

      await removeCharacterArmor(item.id);

      expect(await listCharacterArmor(character.id)).toHaveLength(0);
    });

    it("only returns armor for the requested character", async () => {
      const characterA = await createCharacter("Gear Armor Scope A");
      const characterB = await createCharacter("Gear Armor Scope B");
      await addArmorFromCatalog(characterA.id, "5e", "shield");

      expect(await listCharacterArmor(characterB.id)).toHaveLength(0);
    });
  });

  describe("weapon attack bonus", () => {
    // weaponAttackBonus/isProficientWithWeapon take the character_weapons row
    // shape, where `properties` is the comma-joined string (not the catalog's
    // string[]) -- same as what listCharacterWeapons returns.
    function asRow(definition: ReturnType<typeof listWeaponCatalog>[number]) {
      return { ...definition, properties: definition.properties.join(",") };
    }
    const longsword = asRow(listWeaponCatalog("5e").find((w) => w.id === "longsword")!);
    const rapier = asRow(listWeaponCatalog("5e").find((w) => w.id === "rapier")!);
    const longbow = asRow(listWeaponCatalog("5e").find((w) => w.id === "longbow")!);

    it("recognizes a blanket 'Martial weapons' proficiency", () => {
      expect(isProficientWithWeapon(longsword, ["Simple weapons", "Martial weapons"])).toBe(true);
      expect(isProficientWithWeapon(longsword, ["Simple weapons"])).toBe(false);
    });

    it("recognizes a specific plural weapon-name proficiency", () => {
      expect(isProficientWithWeapon(longsword, ["Simple weapons", "Longswords"])).toBe(true);
      expect(isProficientWithWeapon(rapier, ["Simple weapons", "Longswords"])).toBe(false);
    });

    it("uses the better of Str/Dex for a Finesse weapon", () => {
      // Str 10 (+0), Dex 16 (+3) -- Finesse picks the higher modifier.
      expect(weaponAttackBonus(rapier, 10, 16, 2, true)).toBe(5);
    });

    it("uses Dex for a ranged weapon regardless of Str", () => {
      expect(weaponAttackBonus(longbow, 16, 14, 2, true)).toBe(4);
    });

    it("omits the proficiency bonus when not proficient", () => {
      expect(weaponAttackBonus(longsword, 14, 10, 2, false)).toBe(2);
    });

    it("formats a bonus with an explicit sign", () => {
      expect(describeAttackBonus(5)).toBe("+5");
      expect(describeAttackBonus(0)).toBe("+0");
      expect(describeAttackBonus(-1)).toBe("-1");
    });
  });
});
