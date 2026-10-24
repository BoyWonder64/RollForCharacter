import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { adjustHp, getCharacter } from "../../../../features/characters/characterRepo";
import type { Character } from "../../../../types/models";
import { StatsTab } from "../../../../features/characters/StatsTab";
import { SpellsTab } from "../../../../features/spells/SpellsTab";
import { DressUpTab } from "../../../../features/characters/DressUpTab";
import { useTheme } from "../../../../theme/ThemeContext";
import type { Theme } from "../../../../theme/colors";

type TabKey = "stats" | "spells" | "dressup";

const TABS: { key: TabKey; label: string }[] = [
  { key: "stats", label: "Stats" },
  { key: "spells", label: "Spells" },
  { key: "dressup", label: "Dress-Up" },
];

export default function CharacterSheetScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { characterId: characterIdParam } = useLocalSearchParams<{
    characterId: string;
  }>();
  const characterId = Number(characterIdParam);
  const [character, setCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("stats");

  const refresh = useCallback(() => {
    getCharacter(characterId).then((result) => setCharacter(result ?? null));
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </View>
    );
  }

  async function handleHpChange(delta: number) {
    await adjustHp(characterId, delta);
    refresh();
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: character.name,
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/characters/[characterId]/edit",
                  params: { characterId: characterIdParam },
                })
              }
            >
              <Text style={styles.editLink}>Edit</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {character.race || "Unknown race"} · {character.className || "No class"} ·
          Level {character.level}
        </Text>

        <View style={styles.hpRow}>
          <Pressable style={styles.hpButton} onPress={() => handleHpChange(-1)}>
            <Text style={styles.hpButtonText}>-</Text>
          </Pressable>
          <Text style={styles.hpText}>
            {character.currentHp} / {character.maxHp} HP
          </Text>
          <Pressable style={styles.hpButton} onPress={() => handleHpChange(1)}>
            <Text style={styles.hpButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
        {activeTab === "stats" && <StatsTab character={character} />}
        {activeTab === "spells" && <SpellsTab characterId={characterId} />}
        {activeTab === "dressup" && <DressUpTab />}
      </ScrollView>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loading: { color: theme.colors.textMuted, textAlign: "center", marginTop: 32 },
    editLink: { color: theme.colors.accent, fontWeight: "700", marginRight: 4 },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    subtitle: { color: theme.colors.textMuted },
    hpRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 12,
    },
    hpButton: {
      width: 32,
      height: 32,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    hpButtonText: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
    hpText: { color: theme.colors.text, fontSize: 16, fontWeight: "600" },
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabButtonActive: { borderBottomColor: theme.colors.primary },
    tabLabel: { color: theme.colors.textMuted, fontWeight: "600" },
    tabLabelActive: { color: theme.colors.text },
    tabContent: { flex: 1 },
  });
}
