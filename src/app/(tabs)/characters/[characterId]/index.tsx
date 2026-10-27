import { useCallback, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  applyDamage,
  applyHeal,
  endConcentration,
  getCharacter,
} from "../../../../features/characters/characterRepo";
import { getClassDefinitionForCharacter } from "../../../../features/characters/characterCalculations";
import { listCharacterClasses } from "../../../../features/characters/characterClassRepo";
import { formatMulticlassLabel } from "../../../../features/characters/multiclass";
import type { Character, CharacterClass } from "../../../../types/models";
import { StatsTab } from "../../../../features/characters/StatsTab";
import { SpellsTab } from "../../../../features/spells/SpellsTab";
import { EquipmentTab } from "../../../../features/characters/EquipmentTab";
import { NotesTab } from "../../../../features/characters/NotesTab";
import { CharacterPreviewTab } from "../../../../features/characters/CharacterPreviewTab";
import { HealthBar } from "../../../../components/HealthBar";
import { HpDeltaModal } from "../../../../components/HpDeltaModal";
import { DeathSaveTracker } from "../../../../components/DeathSaveTracker";
import { RestModal } from "../../../../components/RestModal";
import {
  buildStructuredRollPlan,
  rollD20,
  structuredRollToResult,
} from "../../../../features/dice/structuredRolls";
import { saveRoll } from "../../../../features/dice/diceRepo";
import { useTheme } from "../../../../theme/ThemeContext";
import { CharacterThemeProvider } from "../../../../theme/CharacterThemeContext";
import type { Theme } from "../../../../theme/colors";

type TabKey = "stats" | "spells" | "equipment" | "notes" | "preview";

const FIXED_DAMAGE_COLOR = "#B3261E";
const FIXED_HEAL_COLOR = "#2E7D32";

export default function CharacterSheetScreen() {
  const { characterId: characterIdParam } = useLocalSearchParams<{
    characterId: string;
  }>();
  const characterId = Number(characterIdParam);
  const [character, setCharacter] = useState<Character | null>(null);

  const refresh = useCallback(() => {
    getCharacter(characterId).then((result) => setCharacter(result ?? null));
  }, [characterId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!character) {
    return <LoadingView />;
  }

  // Everything below resolves `useTheme()` from this character's own
  // theme/font override (falling back to the device global when unset) --
  // see CharacterThemeContext.tsx. The screens reached via the "Roll" and
  // "Edit" header links are NOT wrapped like this (they're not tied to a
  // single character's own view in the same way), so they stay on the
  // global theme.
  return (
    <CharacterThemeProvider character={character}>
      <CharacterSheetBody
        character={character}
        characterId={characterId}
        characterIdParam={characterIdParam}
        refresh={refresh}
      />
    </CharacterThemeProvider>
  );
}

function LoadingView() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.loading}>Loading…</Text>
    </View>
  );
}

function CharacterSheetBody({
  character,
  characterId,
  characterIdParam,
  refresh,
}: {
  character: Character;
  characterId: number;
  characterIdParam: string;
  refresh: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<TabKey>("stats");
  const [hpModalMode, setHpModalMode] = useState<"damage" | "heal" | null>(null);
  const [restModalOpen, setRestModalOpen] = useState(false);
  const [classRows, setClassRows] = useState<CharacterClass[]>([]);

  useFocusEffect(
    useCallback(() => {
      listCharacterClasses(characterId).then(setClassRows);
    }, [characterId])
  );

  async function handleHpDeltaConfirm(amount: number, options?: { critical?: boolean }) {
    if (hpModalMode === "damage") {
      const outcome = await applyDamage(characterId, amount, options);
      setHpModalMode(null);
      refresh();
      if (outcome?.concentrationCheckDc) {
        promptConcentrationCheck(outcome.concentrationCheckDc);
      }
      return;
    }
    if (hpModalMode === "heal") {
      await applyHeal(characterId, amount);
    }
    setHpModalMode(null);
    refresh();
  }

  /**
   * 5e concentration check: taking damage while concentrating calls for a
   * CON save at `dc` (10, or half the damage taken if higher) or the spell
   * ends. Rolled on demand rather than auto-rolled so the player can choose
   * to just drop concentration instead.
   */
  function promptConcentrationCheck(dc: number) {
    Alert.alert(
      "Concentration Check",
      `You took damage while concentrating on "${character.concentratingSpellName}". Roll a CON save (DC ${dc}) or lose concentration.`,
      [
        {
          text: "End Concentration",
          style: "destructive",
          onPress: async () => {
            await endConcentration(characterId);
            refresh();
          },
        },
        {
          text: "Roll Save",
          onPress: async () => {
            const plan = buildStructuredRollPlan({
              mode: "save",
              character,
              ability: "constitution",
              advantageMode: "normal",
            });
            if ("error" in plan) return;
            const raw = rollD20("normal", plan.modifier);
            const result = structuredRollToResult(
              { ...plan, label: "Concentration Save" },
              raw,
              "normal"
            );
            await saveRoll(result, characterId);
            if (raw.total < dc) {
              await endConcentration(characterId);
              Alert.alert("Concentration Lost", `Rolled ${raw.total} vs DC ${dc}.`);
            } else {
              Alert.alert("Concentration Held", `Rolled ${raw.total} vs DC ${dc}.`);
            }
            refresh();
          },
        },
      ]
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "stats", label: "Stats" },
    { key: "spells", label: "Spells" },
    { key: "equipment", label: "Equipment" },
    { key: "notes", label: "Notes" },
    { key: "preview", label: "Dress Up" },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: character.name,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/dice-roller",
                    params: { characterId: characterIdParam },
                  })
                }
              >
                <Text style={styles.editLink}>Roll</Text>
              </Pressable>
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
            </View>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.identityRow}>
          {character.portraitUri && (
            <Image source={{ uri: character.portraitUri }} style={styles.headerPortrait} />
          )}
          <Text style={styles.subtitle}>
            {character.race || "Unknown race"} ·{" "}
            {formatMulticlassLabel(classRows, character.className || "No class")} · Level{" "}
            {character.level}
            {character.alignment ? ` · ${character.alignment}` : ""}
          </Text>
        </View>

        <View style={styles.hpRow}>
          <View style={styles.hpBarGroup}>
            <HealthBar current={character.currentHp} max={character.maxHp} />
            <Text style={styles.hpText}>
              {character.currentHp} / {character.maxHp} HP
            </Text>
          </View>
          <Pressable
            style={styles.damageButton}
            onPress={() => setHpModalMode("damage")}
          >
            <Text style={styles.damageButtonText}>Damage</Text>
          </Pressable>
          <Pressable style={styles.healButton} onPress={() => setHpModalMode("heal")}>
            <Text style={styles.healButtonText}>Heal</Text>
          </Pressable>
        </View>

        <View style={styles.restRow}>
          <Pressable onPress={() => setRestModalOpen(true)}>
            <Text style={styles.hitDiceText}>
              Hit Dice: {character.hitDiceRemaining}/{character.level} (d
              {getClassDefinitionForCharacter(character).hitDie}) -- spend during a short rest to
              heal
            </Text>
          </Pressable>
          <Pressable style={styles.restButton} onPress={() => setRestModalOpen(true)}>
            <Text style={styles.restButtonText}>Rest</Text>
          </Pressable>
        </View>

        {character.currentHp <= 0 && (
          <DeathSaveTracker
            characterId={characterId}
            successes={character.deathSaveSuccesses}
            failures={character.deathSaveFailures}
            onChanged={refresh}
          />
        )}
      </View>

      <HpDeltaModal
        visible={hpModalMode !== null}
        mode={hpModalMode ?? "damage"}
        onClose={() => setHpModalMode(null)}
        onConfirm={handleHpDeltaConfirm}
      />

      <RestModal
        visible={restModalOpen}
        character={character}
        onClose={() => setRestModalOpen(false)}
        onChanged={refresh}
      />

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              numberOfLines={1}
              style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
        {activeTab === "stats" && <StatsTab character={character} onChanged={refresh} />}
        {activeTab === "spells" && (
          <SpellsTab character={character} onCharacterChanged={refresh} />
        )}
        {activeTab === "equipment" && <EquipmentTab character={character} />}
        {activeTab === "notes" && <NotesTab character={character} />}
        {activeTab === "preview" && <CharacterPreviewTab characterId={characterId} />}
      </ScrollView>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loading: { color: theme.colors.textMuted, textAlign: "center", marginTop: 32 },
    headerActions: { flexDirection: "row", gap: 14 },
    editLink: {
      color: theme.colors.accent,
      fontWeight: "700",
      marginRight: 4,
      fontFamily: theme.displayFontFamily,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    identityRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerPortrait: { width: 36, height: 36, borderRadius: theme.radius },
    subtitle: { color: theme.colors.textMuted, fontFamily: theme.displayFontFamily, flexShrink: 1 },
    hpRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 12,
    },
    // Fixed red/green regardless of theme mood -- damage/heal meaning should
    // read the same way everywhere, not shift with each mood's accent color.
    damageButton: {
      backgroundColor: FIXED_DAMAGE_COLOR,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    damageButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    healButton: {
      backgroundColor: FIXED_HEAL_COLOR,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    healButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    hpBarGroup: { gap: 4, flex: 1 },
    hpText: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
    restRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
    },
    hitDiceText: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      flexShrink: 1,
      marginRight: 10,
    },
    restButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    restButtonText: {
      color: theme.colors.accent,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
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
    tabLabel: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    tabLabelActive: { color: theme.colors.text },
    tabContent: { flex: 1 },
  });
}
