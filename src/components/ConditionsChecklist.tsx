import { useMemo, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CONDITIONS, EXHAUSTION_DESCRIPTION, MAX_EXHAUSTION_LEVEL } from "../data/conditions";
import {
  setExhaustionLevel,
  toggleCondition,
} from "../features/characters/characterRepo";
import { parseConditions } from "../features/characters/characterCalculations";
import { useIconSettings } from "../features/icons/IconSettingsContext";
import { getConditionIcon } from "../features/icons/iconAssets";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import type { Character } from "../types/models";

/**
 * A simple sheet checklist of active 5e conditions, plus exhaustion's
 * separate 0-6 level -- nothing here changes any other stat automatically.
 * Active conditions show as chips; tapping one removes it. A button opens
 * a picker with the full list to add from (tap to toggle, info icon for
 * what it does).
 */
export function ConditionsChecklist({
  character,
  onChanged,
}: {
  character: Character;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const active = parseConditions(character);
  const { iconsEnabled, iconStyle } = useIconSettings();
  const exhaustionIcon = iconsEnabled ? getConditionIcon(iconStyle, "exhaustion") : undefined;
  const [pickerOpen, setPickerOpen] = useState(false);
  const activeConditions = CONDITIONS.filter((condition) => active.includes(condition.id));

  async function handleToggle(conditionId: string) {
    await toggleCondition(character.id, conditionId);
    onChanged();
  }

  async function handleExhaustionChange(delta: number) {
    await setExhaustionLevel(character.id, character.exhaustionLevel + delta);
    onChanged();
  }

  return (
    <View>
      <View style={styles.chipRow}>
        {activeConditions.map((condition) => {
          const icon = iconsEnabled ? getConditionIcon(iconStyle, condition.id) : undefined;
          return (
            <Pressable
              key={condition.id}
              style={styles.chip}
              onPress={() => handleToggle(condition.id)}
              onLongPress={() => Alert.alert(condition.name, condition.description)}
            >
              {icon && (
                <Image source={icon} style={styles.chipIcon} resizeMode="contain" />
              )}
              <Text style={styles.chipText}>{condition.name}</Text>
              <Text style={styles.chipRemove}>×</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.addChip} onPress={() => setPickerOpen(true)}>
          <Text style={styles.addChipText}>
            {activeConditions.length === 0 ? "+ Add Condition" : "+ Edit"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.exhaustionRow}>
        <Pressable
          style={styles.exhaustionLabelRow}
          onPress={() => Alert.alert("Exhaustion", EXHAUSTION_DESCRIPTION)}
        >
          {exhaustionIcon && (
            <Image source={exhaustionIcon} style={styles.chipIcon} resizeMode="contain" />
          )}
          <Text style={styles.exhaustionLabel}>Exhaustion</Text>
        </Pressable>
        <View style={styles.exhaustionControls}>
          <Pressable
            style={[styles.exhaustionButton, character.exhaustionLevel <= 0 && styles.exhaustionButtonDisabled]}
            disabled={character.exhaustionLevel <= 0}
            onPress={() => handleExhaustionChange(-1)}
          >
            <Text style={styles.exhaustionButtonText}>−</Text>
          </Pressable>
          <Text style={styles.exhaustionValue}>{character.exhaustionLevel}</Text>
          <Pressable
            style={[
              styles.exhaustionButton,
              character.exhaustionLevel >= MAX_EXHAUSTION_LEVEL && styles.exhaustionButtonDisabled,
            ]}
            disabled={character.exhaustionLevel >= MAX_EXHAUSTION_LEVEL}
            onPress={() => handleExhaustionChange(1)}
          >
            <Text style={styles.exhaustionButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Conditions</Text>
            <ScrollView style={styles.list}>
              {CONDITIONS.map((condition) => {
                const isActive = active.includes(condition.id);
                const icon = iconsEnabled ? getConditionIcon(iconStyle, condition.id) : undefined;
                return (
                  <Pressable
                    key={condition.id}
                    style={styles.listRow}
                    onPress={() => handleToggle(condition.id)}
                  >
                    <View style={[styles.checkbox, isActive && styles.checkboxActive]}>
                      {isActive && <Text style={styles.checkboxMark}>✓</Text>}
                    </View>
                    {icon && (
                      <Image source={icon} style={styles.chipIcon} resizeMode="contain" />
                    )}
                    <Text style={styles.listRowText}>{condition.name}</Text>
                    <Pressable
                      hitSlop={8}
                      onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert(condition.name, condition.description);
                      }}
                    >
                      <Text style={styles.infoToggle}>ⓘ</Text>
                    </Pressable>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={styles.doneButton} onPress={() => setPickerOpen(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.colors.danger,
      borderWidth: 1,
      borderColor: theme.colors.danger,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    chipIcon: { width: 16, height: 16 },
    chipText: {
      color: theme.colors.primaryText,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    chipRemove: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "700",
      marginLeft: 2,
    },
    addChip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    addChipText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    exhaustionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    exhaustionLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    exhaustionLabel: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 13,
      fontFamily: theme.displayFontFamily,
    },
    exhaustionControls: { flexDirection: "row", alignItems: "center", gap: 10 },
    exhaustionButton: {
      width: 28,
      height: 28,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    exhaustionButtonDisabled: { opacity: 0.4 },
    exhaustionButtonText: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
    exhaustionValue: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 15,
      minWidth: 16,
      textAlign: "center",
    },
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
      marginBottom: 12,
      fontFamily: theme.displayFontFamily,
    },
    list: { maxHeight: 360 },
    listRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxActive: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },
    checkboxMark: { color: theme.colors.primaryText, fontSize: 12, fontWeight: "700" },
    listRowText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    infoToggle: { color: theme.colors.accent, fontSize: 16, paddingLeft: 4 },
    doneButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 12,
    },
    doneButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
  });
}
