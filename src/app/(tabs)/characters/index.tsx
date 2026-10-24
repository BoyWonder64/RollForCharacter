import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AdBanner } from "../../../components/ads/AdBanner";
import {
  deleteCharacter,
  listCharacters,
} from "../../../features/characters/characterRepo";
import type { Character } from "../../../types/models";
import { useTheme } from "../../../theme/ThemeContext";
import type { Theme } from "../../../theme/colors";

export default function CharacterListScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [characters, setCharacters] = useState<Character[]>([]);

  const refresh = useCallback(() => {
    listCharacters().then(setCharacters);
  }, []);

  // Re-fetching on focus covers both "opening" (first mount) and
  // "closing" (returning from a character's sheet) at this single
  // screen boundary -- the ad banner below lives only here.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  async function handleDelete(id: number) {
    await deleteCharacter(id);
    refresh();
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
            >
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowSub}>
                  {item.race || "Unknown race"} · {item.className || "No class"} · Lvl{" "}
                  {item.level}
                </Text>
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
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
    title: { color: theme.colors.text, fontSize: 24, fontWeight: "700" },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    createButtonText: { color: theme.colors.primaryText, fontWeight: "600" },
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
    rowInfo: { flex: 1 },
    rowName: { color: theme.colors.text, fontSize: 17, fontWeight: "600" },
    rowSub: { color: theme.colors.textMuted, marginTop: 2 },
    deleteButton: { paddingHorizontal: 10, paddingVertical: 6 },
    deleteButtonText: { color: theme.colors.danger },
  });
}
