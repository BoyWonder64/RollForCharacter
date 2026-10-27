import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  EQUIPMENT_SLOTS,
  equipItem,
  isMultiSlot,
  listCharacterEquipment,
  listEquipmentItems,
  unequipItem,
  unequipSlot,
  type EquipmentSlot,
} from "./equipmentRepo";
import { getEquipmentItemAsset } from "./equipmentItemAssets";
import { EquipItemModal } from "../../components/EquipItemModal";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";

// Diablo-style inventory slot colors -- fixed regardless of the app's theme
// mood, same way a stone/metal equipment socket wouldn't change with the
// room's lighting.
const SLOT_BG = "#D9D9D9";
const SLOT_BORDER = "#8A8A8A";

type EquippedRow = Awaited<ReturnType<typeof listCharacterEquipment>>[number];
type CatalogItem = Awaited<ReturnType<typeof listEquipmentItems>>[number];

export function CharacterPreviewTab({ characterId }: { characterId: number }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [equipped, setEquipped] = useState<EquippedRow[]>([]);
  const [openSlot, setOpenSlot] = useState<EquipmentSlot | null>(null);
  const [slotCatalog, setSlotCatalog] = useState<CatalogItem[]>([]);

  const refresh = useCallback(() => {
    listCharacterEquipment(characterId).then(setEquipped);
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleOpenSlot(slot: EquipmentSlot) {
    setSlotCatalog(await listEquipmentItems(slot));
    setOpenSlot(slot);
  }

  async function handleEquip(equipmentItemId: number) {
    if (!openSlot) return;
    await equipItem(characterId, openSlot, equipmentItemId);
    refresh();
  }

  async function handleUnequip(characterEquipmentId: number) {
    await unequipItem(characterEquipmentId);
    refresh();
  }

  async function handleClearSlot(slot: EquipmentSlot) {
    await unequipSlot(characterId, slot);
    refresh();
  }

  function equippedFor(slot: EquipmentSlot): EquippedRow[] {
    return equipped.filter((row) => row.slot === slot);
  }

  return (
    <View>
      <View style={styles.grid}>
        {EQUIPMENT_SLOTS.map((slot) => {
          const items = equippedFor(slot);
          const multi = isMultiSlot(slot);
          const first = items[0];
          const icon = first ? getEquipmentItemAsset(first.imageAsset) : undefined;
          return (
            <View key={slot} style={styles.slotWrap}>
              <View style={styles.slotOuter}>
                <Pressable style={styles.slotBox} onPress={() => handleOpenSlot(slot)}>
                  {icon && <Image source={icon} style={styles.slotIcon} resizeMode="contain" />}
                </Pressable>
                {multi && items.length > 0 && (
                  <View style={styles.slotCountBadge} pointerEvents="none">
                    <Text style={styles.slotCountBadgeText}>{items.length}</Text>
                  </View>
                )}
                {items.length > 0 && (
                  <Pressable
                    style={styles.slotClearBadge}
                    hitSlop={10}
                    onPress={() => handleClearSlot(slot)}
                  >
                    <Text style={styles.slotClearBadgeText}>✕</Text>
                  </Pressable>
                )}
              </View>
              <Text style={styles.slotGridLabel} numberOfLines={1}>
                {slot}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Change Outfit</Text>
      {EQUIPMENT_SLOTS.map((slot) => {
        const items = equippedFor(slot);
        return (
          <Pressable key={slot} style={styles.slotRow} onPress={() => handleOpenSlot(slot)}>
            <Text style={styles.slotName}>{slot}</Text>
            <Text style={styles.slotValue} numberOfLines={1}>
              {items.length === 0
                ? "Empty"
                : items.length === 1
                  ? items[0].name
                  : `${items.length} equipped`}
            </Text>
          </Pressable>
        );
      })}

      <EquipItemModal
        visible={openSlot !== null}
        slot={openSlot}
        isMulti={openSlot ? isMultiSlot(openSlot) : false}
        catalog={slotCatalog}
        equipped={openSlot ? equippedFor(openSlot) : []}
        onClose={() => setOpenSlot(null)}
        onEquip={handleEquip}
        onUnequip={handleUnequip}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    slotWrap: { width: "22%", alignItems: "center" },
    slotOuter: {
      width: "100%",
      aspectRatio: 1,
      position: "relative",
    },
    slotBox: {
      width: "100%",
      height: "100%",
      backgroundColor: SLOT_BG,
      borderWidth: 2,
      borderColor: SLOT_BORDER,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    slotIcon: { width: "72%", height: "72%" },
    slotCountBadge: {
      position: "absolute",
      top: 2,
      right: 2,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      paddingHorizontal: 3,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    slotCountBadgeText: {
      color: theme.colors.primaryText,
      fontSize: 9,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    slotClearBadge: {
      position: "absolute",
      top: 2,
      left: 2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    slotClearBadgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
      lineHeight: 12,
    },
    slotGridLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      marginTop: 4,
      textAlign: "center",
      fontFamily: theme.displayFontFamily,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 10,
    },
    slotRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 12,
      marginBottom: 8,
    },
    slotName: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    slotValue: {
      color: theme.colors.textMuted,
      fontFamily: theme.displayFontFamily,
      flexShrink: 1,
      marginLeft: 10,
    },
  });
}
