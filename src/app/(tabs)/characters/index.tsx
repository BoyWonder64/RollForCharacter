import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AdBanner } from "../../../components/ads/AdBanner";
import { deleteCharacter, listCharacters } from "../../../features/characters/characterRepo";
import { listCharacterClasses } from "../../../features/characters/characterClassRepo";
import { formatMulticlassLabel } from "../../../features/characters/multiclass";
import { deletePortrait } from "../../../features/characters/portraitStorage";
import { getRulesetCatalog } from "../../../data/rulesets";
import type { Character, CharacterClass } from "../../../types/models";
import { useTheme } from "../../../theme/ThemeContext";
import type { Theme } from "../../../theme/colors";

export default function CharacterListScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [classRowsById, setClassRowsById] = useState<Record<number, CharacterClass[]>>({});

  const refresh = useCallback(() => {
    listCharacters().then(async (list) => {
      setCharacters(list);
      // One small query per character -- the multiclass table is empty for
      // the common never-multiclassed case, so this is cheap, and a list
      // screen's character count is small (a handful, not hundreds).
      const entries = await Promise.all(
        list.map(async (c) => [c.id, await listCharacterClasses(c.id)] as const)
      );
      setClassRowsById(Object.fromEntries(entries));
    });
  }, []);

  // Re-fetching on focus covers both "opening" (first mount) and
  // "closing" (returning from a character's sheet) at this single
  // screen boundary -- the ad banner below lives only here.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  function handleDelete(character: Character) {
    Alert.alert(
      "Delete character?",
      `This permanently deletes ${character.name} and all their spells, equipment, and roll history. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deletePortrait(character.portraitUri);
            await deleteCharacter(character.id);
            refresh();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <AdBanner placement="top" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Your Characters</Text>
          <Pressable
            style={styles.createButton}
            onPress={() => router.push("/(tabs)/characters/new")}
          >
            <Text style={styles.createButtonText}>+ New</Text>
          </Pressable>
        </View>

        {characters.length > 0 && (
          <Text style={styles.hint}>Long-press a character to delete it.</Text>
        )}

        <FlatList
          data={characters}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.empty}>No characters yet. Add one above.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/characters/[characterId]",
                  params: { characterId: String(item.id) },
                })
              }
              onLongPress={() => handleDelete(item)}
            >
              {item.portraitUri ? (
                <Image source={{ uri: item.portraitUri }} style={styles.rowPortrait} />
              ) : (
                <View style={styles.rowPortraitPlaceholder} />
              )}
              <View style={styles.rowInfo}>
                <View style={styles.rowNameRow}>
                  <Text style={styles.rowName}>{item.name}</Text>
                  <View style={styles.rulesetBadge}>
                    <Text style={styles.rulesetBadgeText}>
                      {getRulesetCatalog(item.ruleset).label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.rowSub}>
                  {item.race || "Unknown race"} ·{" "}
                  {formatMulticlassLabel(classRowsById[item.id] ?? [], item.className || "No class")} ·
                  Lvl {item.level}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, padding: 16 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    createButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    hint: { color: theme.colors.textMuted, fontSize: 12, marginBottom: 10 },
    listContent: { gap: 8 },
    empty: { color: theme.colors.textMuted, textAlign: "center", marginTop: 32 },
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 14,
    },
    rowPortrait: { width: 44, height: 44, borderRadius: theme.radius, marginRight: 12 },
    rowPortraitPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      marginRight: 12,
    },
    rowInfo: { flex: 1 },
    rowNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    rowName: {
      color: theme.colors.text,
      fontSize: 17,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    rulesetBadge: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    rulesetBadgeText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    rowSub: { color: theme.colors.textMuted, marginTop: 2 },
  });
}
