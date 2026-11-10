import { useCallback, useMemo, useState } from "react";
import { PixelFrameOverlay, SectionHeading } from "./PixelFrame";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./AppText";
import { useFocusEffect } from "expo-router";
import {
  addCatalogFeat,
  addCustomFeat,
  listCharacterFeats,
  removeCharacterFeat,
  setFeatEnabled,
} from "../features/characters/featRepo";
import { describeFeatEffect, type CharacterFeat, type ResolvedFeatPick } from "../features/characters/characterCalculations";
import type { Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "../theme/colors";
import { FeatPickerModal } from "./FeatPickerModal";
import { withAlpha, BOX_ALPHA } from "../theme/alpha";

/**
 * Every feat a character has taken -- catalog or homebrew -- shown as a
 * toggleable list, same spirit as `ConditionsChecklist`/`ClassResourceTracker`.
 * Disabling a feat excludes its live effects (skill/save proficiency, AC,
 * initiative, attack bonus -- see `aggregateFeatEffects`) without deleting
 * it; an ability score increase it already granted stays applied either way.
 */
export function FeatsList({ character }: { character: Character }) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [feats, setFeats] = useState<CharacterFeat[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const refresh = useCallback(() => {
    listCharacterFeats(character).then(setFeats);
  }, [character]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleToggle(feat: CharacterFeat) {
    await setFeatEnabled(feat.id, !feat.enabled);
    refresh();
  }

  function handleRemove(feat: CharacterFeat) {
    Alert.alert("Remove feat?", `Remove "${feat.name}" from this character?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeCharacterFeat(feat.id);
          refresh();
        },
      },
    ]);
  }

  async function handlePick(feat: ResolvedFeatPick) {
    if (feat.catalogFeatId) {
      await addCatalogFeat(
        character,
        {
          id: feat.catalogFeatId,
          name: feat.name,
          prerequisite: feat.prerequisite,
          description: feat.description,
          sourceName: feat.sourceName,
        },
        feat.effects
      );
    } else {
      await addCustomFeat(character, feat);
    }
    setPickerVisible(false);
    refresh();
  }

  return (
    <View style={styles.container}>
      <PixelFrameOverlay />
      <View style={styles.headerRow}>
        <SectionHeading title="Feats" textStyle={styles.sectionTitle} />
        <Pressable style={styles.addButton} onPress={() => setPickerVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Feat</Text>
        </Pressable>
      </View>

      {feats.length === 0 && <Text style={styles.empty}>No feats yet.</Text>}

      {feats.map((feat) => {
        const expanded = expandedId === feat.id;
        return (
          <View key={feat.id} style={[styles.row, !feat.enabled && styles.rowDisabled]}>
            <Pressable
              style={[styles.toggle, feat.enabled && styles.toggleOn]}
              onPress={() => handleToggle(feat)}
            >
              {feat.enabled && <Text style={styles.toggleMark}>✓</Text>}
            </Pressable>
            <Pressable style={styles.rowInfo} onPress={() => setExpandedId(expanded ? null : feat.id)}>
              <Text style={styles.name}>{feat.name}</Text>
              {feat.prerequisite ? <Text style={styles.meta}>Prerequisite: {feat.prerequisite}</Text> : null}
              {feat.effects.map((effect, idx) => (
                <Text key={idx} style={styles.effect}>
                  {describeFeatEffect(effect, character.ruleset)}
                </Text>
              ))}
              {expanded && feat.description ? <Text style={styles.description}>{feat.description}</Text> : null}
            </Pressable>
            <Pressable onPress={() => handleRemove(feat)} hitSlop={8}>
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </View>
        );
      })}

      <FeatPickerModal
        visible={pickerVisible}
        character={character}
        onClose={() => setPickerVisible(false)}
        onPick={handlePick}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: withAlpha(theme.colors.surface, BOX_ALPHA),
      borderWidth: theme.pixel ? 0 : 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: theme.pixel ? 18 : 14,
    },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    addButton: {
      backgroundColor: theme.mode === "light" ? theme.colors.surfaceAlt : theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    addButtonText: {
      color: theme.mode === "light" ? "#0A0A0A" : theme.colors.primaryText,
      fontSize: 12,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    empty: {
      color: theme.colors.textMuted,
      fontSize: 13,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      backgroundColor: withAlpha(theme.colors.surfaceAlt, BOX_ALPHA),
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 6,
    },
    rowDisabled: { opacity: 0.55 },
    toggle: {
      width: 22,
      height: 22,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    toggleOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    toggleMark: { color: theme.colors.primaryText, fontSize: 13, fontWeight: "700" },
    rowInfo: { flex: 1 },
    name: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    meta: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
    effect: { color: theme.colors.accent, fontSize: 12, marginTop: 2, fontWeight: "600" },
    description: { color: theme.colors.text, fontSize: 12, lineHeight: 17, marginTop: 6 },
    remove: { color: theme.colors.accent, fontSize: 18, paddingHorizontal: 4 },
  });
}
