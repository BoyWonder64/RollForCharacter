import { useCallback, useMemo, useState } from "react";
import { PixelFrameOverlay, SectionHeading } from "../../components/PixelFrame";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Text, TextInput } from "../../components/AppText";
import { useFocusEffect } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import type { Character } from "../../types/models";
import {
  addArmorFromCatalog,
  addCustomArmor,
  addCustomWeapon,
  addGearItem,
  addWeaponFromCatalog,
  describeArmorAc,
  describeAttackBonus,
  describeWeaponDamage,
  isProficientWithWeapon,
  listArmorCatalog,
  listCharacterArmor,
  listCharacterWeapons,
  listGearItems,
  listWeaponCatalog,
  parseWeaponProperties,
  removeCharacterArmor,
  removeCharacterWeapon,
  setArmorEquipped,
  setGearItemQuantity,
  setWeaponEquipped,
  weaponAttackBonus,
  weaponFeatAttackBonus,
  type CustomArmorInput,
  type CustomWeaponInput,
} from "./gearRepo";
import { aggregateFeatEffects, effectiveWeaponProficienciesForCharacter } from "./characterCalculations";
import { listCharacterFeats } from "./featRepo";
import { AddWeaponModal } from "../../components/AddWeaponModal";
import { AddArmorModal } from "../../components/AddArmorModal";
import { AddMagicItemModal } from "../../components/AddMagicItemModal";
import {
  addCustomMagicItem,
  addMagicItemFromCatalog,
  listCharacterMagicItems,
  removeCharacterMagicItem,
  setMagicItemAttuned,
  setMagicItemEquipped,
  type CustomMagicItemInput,
} from "./magicItemRepo";
import { withAlpha } from "../../theme/alpha";

type WeaponRow = Awaited<ReturnType<typeof listCharacterWeapons>>[number];
type ArmorRow = Awaited<ReturnType<typeof listCharacterArmor>>[number];
type MagicItemRow = Awaited<ReturnType<typeof listCharacterMagicItems>>[number];
type GearItemRow = Awaited<ReturnType<typeof listGearItems>>[number];

export function EquipmentTab({ character, onChanged }: { character: Character; onChanged?: () => void }) {
  const characterId = character.id;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const weaponCatalog = useMemo(() => listWeaponCatalog(character.ruleset), [character.ruleset]);
  const armorCatalog = useMemo(() => listArmorCatalog(character.ruleset), [character.ruleset]);
  const weaponProficiencies = useMemo(
    () => effectiveWeaponProficienciesForCharacter(character),
    [character]
  );

  const [weapons, setWeapons] = useState<WeaponRow[]>([]);
  const [armor, setArmor] = useState<ArmorRow[]>([]);
  const [magicItems, setMagicItems] = useState<MagicItemRow[]>([]);
  const [gearItems, setGearItems] = useState<GearItemRow[]>([]);
  const [newGearName, setNewGearName] = useState("");
  const [newGearDescription, setNewGearDescription] = useState("");
  const [addWeaponOpen, setAddWeaponOpen] = useState(false);
  const [addArmorOpen, setAddArmorOpen] = useState(false);
  const [addMagicItemOpen, setAddMagicItemOpen] = useState(false);
  const [feats, setFeats] = useState<Awaited<ReturnType<typeof listCharacterFeats>>>([]);
  const featEffects = useMemo(() => aggregateFeatEffects(feats), [feats]);

  // Weapons already owned (added during onboarding or since) -- drives the
  // Add Weapon modal's "Owned" filter.
  const ownedWeaponCatalogIds = useMemo(
    () => new Set(weapons.map((w) => w.catalogId).filter((id): id is string => !!id)),
    [weapons]
  );

  const refreshWeapons = useCallback(() => {
    listCharacterWeapons(characterId).then(setWeapons);
  }, [characterId]);

  const refreshArmor = useCallback(() => {
    listCharacterArmor(characterId).then(setArmor);
  }, [characterId]);

  const refreshMagicItems = useCallback(() => {
    listCharacterMagicItems(characterId).then(setMagicItems);
  }, [characterId]);

  const refreshFeats = useCallback(() => {
    listCharacterFeats(character).then(setFeats);
  }, [character]);

  const refreshGear = useCallback(() => {
    listGearItems(characterId).then(setGearItems);
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refreshWeapons();
      refreshArmor();
      refreshMagicItems();
      refreshGear();
      refreshFeats();
    }, [refreshWeapons, refreshArmor, refreshMagicItems, refreshGear, refreshFeats])
  );

  async function handleAddGear() {
    if (!newGearName.trim()) return;
    await addGearItem(characterId, { name: newGearName, description: newGearDescription });
    setNewGearName("");
    setNewGearDescription("");
    refreshGear();
  }

  async function handleGearQuantity(item: GearItemRow, delta: number) {
    await setGearItemQuantity(item.id, item.quantity + delta);
    refreshGear();
  }

  async function handlePickWeapon(catalogId: string) {
    await addWeaponFromCatalog(characterId, character.ruleset, catalogId);
    setAddWeaponOpen(false);
    refreshWeapons();
  }

  async function handleAddCustomWeapon(input: CustomWeaponInput) {
    await addCustomWeapon(characterId, input);
    setAddWeaponOpen(false);
    refreshWeapons();
  }

  function handleRemoveWeapon(weaponId: number, name: string) {
    Alert.alert("Remove weapon?", `Remove "${name}" from this character's weapons?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCharacterWeapon(weaponId);
          refreshWeapons();
        },
      },
    ]);
  }

  async function handleToggleWeaponEquipped(weapon: WeaponRow) {
    await setWeaponEquipped(weapon.id, !weapon.equipped);
    refreshWeapons();
  }

  async function handlePickArmor(catalogId: string) {
    await addArmorFromCatalog(characterId, character.ruleset, catalogId);
    setAddArmorOpen(false);
    refreshArmor();
  }

  async function handleAddCustomArmor(input: CustomArmorInput) {
    await addCustomArmor(characterId, input);
    setAddArmorOpen(false);
    refreshArmor();
  }

  function handleRemoveArmor(armorId: number, name: string) {
    Alert.alert("Remove armor?", `Remove "${name}" from this character's armor?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCharacterArmor(armorId);
          refreshArmor();
          onChanged?.();
        },
      },
    ]);
  }

  async function handleToggleArmorEquipped(item: ArmorRow) {
    await setArmorEquipped(item.id, !item.equipped);
    refreshArmor();
    onChanged?.();
  }

  async function handlePickMagicItem(catalogId: number) {
    await addMagicItemFromCatalog(characterId, catalogId);
    setAddMagicItemOpen(false);
    refreshMagicItems();
  }

  async function handleAddCustomMagicItem(input: CustomMagicItemInput) {
    await addCustomMagicItem(characterId, input);
    setAddMagicItemOpen(false);
    refreshMagicItems();
  }

  function handleRemoveMagicItem(itemId: number, name: string) {
    Alert.alert("Remove magic item?", `Remove "${name}" from this character's items?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCharacterMagicItem(itemId);
          refreshMagicItems();
        },
      },
    ]);
  }

  async function handleToggleMagicItemAttuned(item: MagicItemRow) {
    await setMagicItemAttuned(item.id, !item.attuned);
    refreshMagicItems();
  }

  async function handleToggleMagicItemEquipped(item: MagicItemRow) {
    await setMagicItemEquipped(item.id, !item.equipped);
    refreshMagicItems();
  }


  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <SectionHeading title="Weapons" textStyle={styles.sectionTitle} />
        </View>
        <Pressable style={styles.actionLink} onPress={() => setAddWeaponOpen(true)}>
          <Text style={styles.actionLinkText}>+ Add Weapon</Text>
        </Pressable>
      </View>

      {weapons.length === 0 ? (
        <Text style={styles.empty}>No weapons yet.</Text>
      ) : (
        weapons.map((weapon) => {
          const proficient = isProficientWithWeapon(weapon, weaponProficiencies);
          // Weapon Mastery (2024 5e only) is catalog-only rules text, not a
          // per-character column, so it's looked up by catalogId rather than
          // read off the weapon row.
          const mastery = weaponCatalog.find((w) => w.id === weapon.catalogId)?.mastery;
          const attackBonus = weaponAttackBonus(
            weapon,
            character.strength,
            character.dexterity,
            character.proficiencyBonus,
            proficient,
            weaponFeatAttackBonus(weapon, featEffects)
          );
          return (
            <Pressable
              key={weapon.id}
              style={[styles.itemRow, weapon.equipped && styles.itemRowEquipped]}
              onPress={() => handleToggleWeaponEquipped(weapon)}
            >
              <PixelFrameOverlay scale={0.75} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {weapon.isMagic ? "✨ " : ""}
                  {weapon.name}
                  {weapon.quantity > 1 ? ` ×${weapon.quantity}` : ""}
                  {weapon.isMagic && weapon.magicBonus ? ` (+${weapon.magicBonus})` : ""}
                  {weapon.equipped ? " (Equipped)" : ""}
                </Text>
                <Text style={styles.itemDescription}>
                  Attack {describeAttackBonus(attackBonus)}
                  {` · ${describeWeaponDamage(weapon)}`}
                  {weapon.category ? ` · ${weapon.category}` : ""}
                </Text>
                {parseWeaponProperties(weapon.properties).length > 0 && (
                  <Text style={styles.itemDescription}>
                    {parseWeaponProperties(weapon.properties).join(", ")}
                  </Text>
                )}
                {mastery && (
                  <Text style={styles.itemDescription}>Mastery: {mastery.name}</Text>
                )}
                {weapon.description ? (
                  <Text style={styles.itemFlavor}>{weapon.description}</Text>
                ) : null}
              </View>
              <Pressable onPress={() => handleRemoveWeapon(weapon.id, weapon.name)}>
                <Text style={styles.removeLink}>Remove</Text>
              </Pressable>
            </Pressable>
          );
        })
      )}

      <AddWeaponModal
        visible={addWeaponOpen}
        catalog={weaponCatalog}
        ownedCatalogIds={ownedWeaponCatalogIds}
        onClose={() => setAddWeaponOpen(false)}
        onPickCatalog={handlePickWeapon}
        onAddCustom={handleAddCustomWeapon}
      />

      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <SectionHeading title="Armor" textStyle={styles.sectionTitle} />
        </View>
        <Pressable style={styles.actionLink} onPress={() => setAddArmorOpen(true)}>
          <Text style={styles.actionLinkText}>+ Add Armor</Text>
        </Pressable>
      </View>

      {armor.length === 0 ? (
        <Text style={styles.empty}>No armor yet.</Text>
      ) : (
        armor.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.itemRow, item.equipped && styles.itemRowEquipped]}
            onPress={() => handleToggleArmorEquipped(item)}
          >
            <PixelFrameOverlay scale={0.75} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.isMagic ? "✨ " : ""}
                {item.name}
                {item.isMagic && item.magicBonus ? ` (+${item.magicBonus})` : ""}
                {item.equipped ? " (Equipped)" : ""}
              </Text>
              <Text style={styles.itemDescription}>
                AC {describeArmorAc(item)}
                {item.category ? ` · ${item.category}` : ""}
              </Text>
              {(item.strengthRequirement || item.stealthDisadvantage) && (
                <Text style={styles.itemDescription}>
                  {item.strengthRequirement ? `Str ${item.strengthRequirement}` : ""}
                  {item.strengthRequirement && item.stealthDisadvantage ? " · " : ""}
                  {item.stealthDisadvantage ? "Stealth disadvantage" : ""}
                </Text>
              )}
              {item.description ? (
                <Text style={styles.itemFlavor}>{item.description}</Text>
              ) : null}
            </View>
            <Pressable onPress={() => handleRemoveArmor(item.id, item.name)}>
              <Text style={styles.removeLink}>Remove</Text>
            </Pressable>
          </Pressable>
        ))
      )}

      <AddArmorModal
        visible={addArmorOpen}
        catalog={armorCatalog}
        onClose={() => setAddArmorOpen(false)}
        onPickCatalog={handlePickArmor}
        onAddCustom={handleAddCustomArmor}
      />

      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <SectionHeading title="Gear & Supplies" textStyle={styles.sectionTitle} />
        </View>
      </View>

      {gearItems.length === 0 ? (
        <Text style={styles.empty}>No packs, tools, or supplies yet.</Text>
      ) : (
        gearItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <PixelFrameOverlay scale={0.75} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.name}
                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
              </Text>
              {item.description ? <Text style={styles.itemFlavor}>{item.description}</Text> : null}
            </View>
            <View style={styles.itemActions}>
              <View style={styles.qtyRow}>
                <Pressable onPress={() => handleGearQuantity(item, -1)} hitSlop={8}>
                  <Text style={styles.attuneLink}>−</Text>
                </Pressable>
                <Pressable onPress={() => handleGearQuantity(item, 1)} hitSlop={8}>
                  <Text style={styles.attuneLink}>+</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => handleGearQuantity(item, -item.quantity)}>
                <Text style={styles.removeLink}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
      <View style={styles.addGearBlock}>
        <View style={styles.addGearRow}>
          <TextInput
            style={styles.addGearInput}
            value={newGearName}
            onChangeText={setNewGearName}
            placeholder="Add an item (rope, rations, torch…)"
            placeholderTextColor={theme.colors.textMuted}
            onSubmitEditing={handleAddGear}
            returnKeyType="next"
          />
          <Pressable style={styles.actionLink} onPress={handleAddGear}>
            <Text style={styles.actionLinkText}>Add</Text>
          </Pressable>
        </View>
        <TextInput
          style={[styles.addGearInput, styles.addGearDescription]}
          value={newGearDescription}
          onChangeText={setNewGearDescription}
          placeholder="Description (optional)"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
      </View>

      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <SectionHeading title="Magic Items" textStyle={styles.sectionTitle} />
        </View>
        <Pressable style={styles.actionLink} onPress={() => setAddMagicItemOpen(true)}>
          <Text style={styles.actionLinkText}>+ Add Magic Item</Text>
        </Pressable>
      </View>

      {magicItems.length === 0 ? (
        <Text style={styles.empty}>No magic items yet.</Text>
      ) : (
        magicItems.map((item) => (
          <View key={item.id} style={[styles.itemRow, item.equipped && styles.itemRowEquipped]}>
            <PixelFrameOverlay scale={0.75} />
            <Pressable style={styles.itemInfo} onPress={() => handleToggleMagicItemEquipped(item)}>
              <Text style={styles.itemName}>
                {item.name}
                {item.equipped ? " (Equipped)" : ""}
              </Text>
              <Text style={styles.itemDescription}>
                {item.rarity}
                {item.category ? ` · ${item.category}` : ""}
                {item.requiresAttunement ? ` · ${item.attuned ? "Attuned" : "Needs attunement"}` : ""}
              </Text>
              {item.description ? <Text style={styles.itemFlavor}>{item.description}</Text> : null}
            </Pressable>
            <View style={styles.itemActions}>
              {item.requiresAttunement && (
                <Pressable onPress={() => handleToggleMagicItemAttuned(item)}>
                  <Text style={styles.attuneLink}>{item.attuned ? "Unattune" : "Attune"}</Text>
                </Pressable>
              )}
              <Pressable onPress={() => handleRemoveMagicItem(item.id, item.name)}>
                <Text style={styles.removeLink}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <AddMagicItemModal
        visible={addMagicItemOpen}
        onClose={() => setAddMagicItemOpen(false)}
        onPickCatalog={handlePickMagicItem}
        onAddCustom={handleAddCustomMagicItem}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    actionLink: {
      backgroundColor: theme.mode === "light" ? theme.colors.surfaceAlt : theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionLinkText: {
      color: theme.mode === "light" ? "#0A0A0A" : theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 12,
      fontFamily: theme.displayFontFamily,
    },
    empty: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: withAlpha(theme.colors.surface, theme.boxAlpha),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
      gap: 10,
    },
    itemRowEquipped: { borderColor: theme.colors.primary, borderWidth: 2 },
    itemInfo: { flex: 1 },
    itemName: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    itemDescription: {
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 2,
      fontFamily: theme.displayFontFamily,
    },
    itemFlavor: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontStyle: "italic",
      marginTop: 4,
      lineHeight: 16,
      fontFamily: theme.displayFontFamily,
    },
    removeLink: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    itemActions: { alignItems: "flex-end", gap: 8 },
    qtyRow: { flexDirection: "row", gap: 18 },
    addGearBlock: { marginBottom: 20, gap: 8 },
    addGearRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    addGearDescription: { minHeight: 60, textAlignVertical: "top" },
    addGearInput: {
      flex: 1,
      backgroundColor: withAlpha(theme.colors.surfaceAlt, theme.boxAlpha),
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontFamily: theme.displayFontFamily,
    },
    attuneLink: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
