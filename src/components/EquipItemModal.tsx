import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import type { EquipmentSlot } from "../features/characters/equipmentRepo";
import { getEquipmentItemAsset } from "../features/characters/equipmentItemAssets";

export type EquipCatalogItem = {
  id: number;
  name: string;
  imageAsset: string;
};

export type EquippedItemRow = {
  id: number;
  equipmentItemId: number;
  name: string;
  imageAsset: string;
};

type EquipItemModalProps = {
  visible: boolean;
  slot: EquipmentSlot | null;
  isMulti: boolean;
  catalog: EquipCatalogItem[];
  equipped: EquippedItemRow[];
  onClose: () => void;
  onEquip: (equipmentItemId: number) => void | Promise<void>;
  onUnequip: (characterEquipmentId: number) => void | Promise<void>;
};

export function EquipItemModal({
  visible,
  slot,
  isMulti,
  catalog,
  equipped,
  onClose,
  onEquip,
  onUnequip,
}: EquipItemModalProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.backdrop}>
          {visible && slot && (
            <EquipItemModalForm
              slot={slot}
              isMulti={isMulti}
              catalog={catalog}
              equipped={equipped}
              onClose={onClose}
              onEquip={onEquip}
              onUnequip={onUnequip}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EquipItemModalForm({
  slot,
  isMulti,
  catalog,
  equipped,
  onClose,
  onEquip,
  onUnequip,
}: Omit<EquipItemModalProps, "visible"> & { slot: EquipmentSlot }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((item) => item.name.toLowerCase().includes(q));
  }, [catalog, query]);

  const visibleCatalog = filtered;

  async function handlePick(item: EquipCatalogItem) {
    await onEquip(item.id);
    if (!isMulti) onClose();
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{isMulti ? `Add ${slot}` : `Equip ${slot}`}</Text>

      {equipped.length > 0 && (
        <View style={styles.equippedSection}>
          <Text style={styles.sectionLabel}>Currently Equipped</Text>
          {equipped.map((item) => {
            const icon = getEquipmentItemAsset(item.imageAsset);
            return (
              <View key={item.id} style={styles.equippedRow}>
                {icon && <Image source={icon} style={styles.rowThumb} resizeMode="contain" />}
                <Text style={styles.equippedName}>{item.name}</Text>
                <Pressable onPress={() => onUnequip(item.id)}>
                  <Text style={styles.removeLink}>Remove</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${slot.toLowerCase()} items…`}
        placeholderTextColor={theme.colors.textMuted}
      />

      <ScrollView style={styles.catalogList}>
        {visibleCatalog.map((item) => {
          const icon = getEquipmentItemAsset(item.imageAsset);
          const isEquipped = equipped.some((e) => e.equipmentItemId === item.id);
          return (
            <Pressable
              key={item.id}
              style={[styles.catalogRow, isEquipped && styles.catalogRowActive]}
              onPress={() => handlePick(item)}
            >
              {icon && <Image source={icon} style={styles.rowThumb} resizeMode="contain" />}
              <Text style={styles.catalogName}>{item.name}</Text>
              {isEquipped && <Text style={styles.catalogEquippedMark}>✓</Text>}
            </Pressable>
          );
        })}
        {visibleCatalog.length === 0 && (
          <Text style={styles.empty}>No items found.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>{isMulti ? "Done" : "Cancel"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 420,
      maxHeight: "80%",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 12,
    },
    sectionLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      marginBottom: 6,
      fontFamily: theme.displayFontFamily,
    },
    equippedSection: {
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 10,
    },
    equippedRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 6,
    },
    equippedName: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
      fontFamily: theme.displayFontFamily,
    },
    removeLink: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    input: {
      backgroundColor: theme.colors.surfaceAlt,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
      fontFamily: theme.displayFontFamily,
    },
    catalogList: { maxHeight: 320 },
    catalogRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    catalogRowActive: { backgroundColor: theme.colors.surfaceAlt },
    catalogEquippedMark: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontSize: 14,
    },
    rowThumb: { width: 32, height: 32 },
    catalogName: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
      fontFamily: theme.displayFontFamily,
    },
    empty: {
      color: theme.colors.textMuted,
      textAlign: "center",
      paddingVertical: 20,
      fontFamily: theme.displayFontFamily,
    },
    hint: {
      color: theme.colors.textMuted,
      fontSize: 11,
      textAlign: "center",
      paddingVertical: 8,
      fontFamily: theme.displayFontFamily,
    },
    buttonRow: { flexDirection: "row", gap: 8, marginTop: 14 },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
