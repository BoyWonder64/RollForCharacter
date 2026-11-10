import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeBackdropArt, ThemeBackdropFooter } from "../../../../components/ThemeBackdropArt";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "../../../../components/AppText";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
  levelUp,
  type LevelUpChoices,
} from "../../../../features/characters/characterRepo";
import { addClass, levelUpClass, listCharacterClasses } from "../../../../features/characters/characterClassRepo";
import { formatMulticlassLabel } from "../../../../features/characters/multiclass";
import type { Character, CharacterClass } from "../../../../types/models";
import { StatsTab } from "../../../../features/characters/StatsTab";
import { SpellsTab } from "../../../../features/spells/SpellsTab";
import { EquipmentTab } from "../../../../features/characters/EquipmentTab";
import { NotesTab } from "../../../../features/characters/NotesTab";
import { PixelBanner, PixelFrameOverlay } from "../../../../components/PixelFrame";
import { HealthBar } from "../../../../components/HealthBar";
import { HpDeltaModal } from "../../../../components/HpDeltaModal";
import { DeathSaveTracker } from "../../../../components/DeathSaveTracker";
import { LevelUpModal } from "../../../../components/LevelUpModal";
import { levelForXp } from "../../../../features/characters/xpTable";
import { RestModal } from "../../../../components/RestModal";
import {
  buildStructuredRollPlan,
  rollD20,
  structuredRollToResult,
} from "../../../../features/dice/structuredRolls";
import { saveRoll } from "../../../../features/dice/diceRepo";
import { useTheme, useThemeContext } from "../../../../theme/ThemeContext";
import { CharacterThemeProvider } from "../../../../theme/CharacterThemeContext";
import type { Theme } from "../../../../theme/colors";

type TabKey = "stats" | "spells" | "equipment" | "notes";

// Memoised so switching sheet tabs (a state change in the sheet body) only flips
// display styles instead of re-rendering all four tabs.
const StatsPane = memo(StatsTab);
const SpellsPane = memo(SpellsTab);
const EquipmentPane = memo(EquipmentTab);
const NotesPane = memo(NotesTab);

const FIXED_DAMAGE_COLOR = "#B3261E";
const FIXED_HEAL_COLOR = "#2E7D32";

export default function CharacterSheetScreen() {
  const { characterId: characterIdParam } = useLocalSearchParams<{
    characterId: string;
  }>();
  const characterId = Number(characterIdParam);
  const [character, setCharacter] = useState<Character | null>(null);

  const refresh = useCallback(() => {
    getCharacter(characterId).then((result) => {
      const next = result ?? null;
      // Runs on every focus: keep the same object when nothing changed so the
      // memoised tabs below don't all re-render just because the tab was revisited.
      setCharacter((prev) => (prev && next && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    });
  }, [characterId]);

  const { setActiveCharacter } = useThemeContext();

  // Opening a character makes it the active one: the whole app (tabs, settings,
  // dice roller) then wears this character's theme until another is chosen.
  useFocusEffect(
    useCallback(() => {
      refresh();
      setActiveCharacter(characterId);
    }, [refresh, setActiveCharacter, characterId])
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
  // Tabs stay mounted once built (hidden with display:none) so switching is a
  // style flip, not a full unmount/remount + data reload. The others are built
  // in the background right after the first paint, one per tick.
  const [mountedTabs, setMountedTabs] = useState<TabKey[]>(["stats"]);
  useEffect(() => {
    const timers = (["spells", "equipment", "notes"] as TabKey[]).map((key, i) =>
      setTimeout(() => setMountedTabs((prev) => (prev.includes(key) ? prev : [...prev, key])), 250 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  const isMounted = (key: TabKey) => activeTab === key || mountedTabs.includes(key);
  const tabPane = (key: TabKey) => ({ display: activeTab === key ? ("flex" as const) : ("none" as const) });
  const [hpModalMode, setHpModalMode] = useState<"damage" | "heal" | null>(null);
  const [restModalOpen, setRestModalOpen] = useState(false);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [classRows, setClassRows] = useState<CharacterClass[]>([]);

  useFocusEffect(
    useCallback(() => {
      listCharacterClasses(characterId).then(setClassRows);
    }, [characterId])
  );

  async function handleLevelUpConfirm(choices: LevelUpChoices, classId?: string) {
    const outcome = classId
      ? await levelUpClass(characterId, classId, choices)
      : await levelUp(characterId, choices);
    setLevelUpModalOpen(false);
    refresh();
    listCharacterClasses(characterId).then(setClassRows);
    if (outcome) {
      const profLine =
        outcome.proficiencyBonus !== character.proficiencyBonus
          ? `\nProficiency bonus is now +${outcome.proficiencyBonus}.`
          : "";
      const hpLine =
        choices.hpMethod === "manual"
          ? `Set your HP for this level yourself in Edit.`
          : `+${outcome.hpGain} max HP${
              outcome.roll !== undefined ? ` (rolled ${outcome.roll})` : ""
            }`;
      const featureLines = outcome.featuresGained.map((f) => `• ${f.name}`).join("\n");
      const body = [hpLine + profLine, featureLines].filter(Boolean).join("\n\n");
      Alert.alert(`Level ${outcome.newLevel}!`, body);
    }
  }

  async function handleMulticlassConfirm(
    classId: string,
    className: string,
    choices: LevelUpChoices
  ) {
    const outcome = await addClass(characterId, classId, className, choices);
    setLevelUpModalOpen(false);
    refresh();
    listCharacterClasses(characterId).then(setClassRows);
    if (outcome) {
      const hpLine =
        choices.hpMethod === "manual"
          ? "Set your HP for this level yourself in Edit."
          : `+${outcome.hpGain} max HP${outcome.roll !== undefined ? ` (rolled ${outcome.roll})` : ""}`;
      const featureLines = outcome.featuresGained.map((f) => `• ${f.name}`).join("\n");
      const body = [hpLine, featureLines].filter(Boolean).join("\n\n");
      Alert.alert(`${className} 1!`, body);
    }
  }

  const xpReadyToLevelUp =
    character.usesXp && levelForXp(character.ruleset, character.experiencePoints) > character.level;

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

  const identityText = `${character.race || "Unknown race"} · ${formatMulticlassLabel(
    classRows,
    character.className || "No class"
  )} · Level ${character.level}`;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "stats", label: "Stats" },
    { key: "spells", label: "Spells" },
    { key: "equipment", label: "Equipment" },
    { key: "notes", label: "Notes" },
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
          {character.portraitUri &&
            (theme.pixel ? (
              <View style={styles.portraitFrame}>
                <Image source={{ uri: character.portraitUri }} style={styles.framedPortrait} />
                <PixelFrameOverlay scale={0.75} />
              </View>
            ) : (
              <Image source={{ uri: character.portraitUri }} style={styles.headerPortrait} />
            ))}
          {theme.pixel ? (
            <View style={styles.bannerWrap}>
              <PixelBanner title={identityText} variant="ribbon" fullWidth textStyle={styles.bannerText} />
            </View>
          ) : (
            <Text style={styles.subtitle}>{identityText}</Text>
          )}
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
          <Pressable onPress={() => setActiveTab("stats")}>
            <Text style={styles.hitDiceText}>
              Hit Dice: {character.hitDiceRemaining}/{character.level}
            </Text>
          </Pressable>
          <View style={styles.restActions}>
            <Pressable style={styles.levelUpButton} onPress={() => setLevelUpModalOpen(true)}>
              <Text style={styles.levelUpButtonText}>
                Level Up{xpReadyToLevelUp ? " ✓" : ""}
              </Text>
            </Pressable>
            <Pressable style={styles.restButton} onPress={() => setRestModalOpen(true)}>
              <Text style={styles.restButtonText}>Rest</Text>
            </Pressable>
          </View>
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

      <LevelUpModal
        visible={levelUpModalOpen}
        character={character}
        classRows={classRows}
        onClose={() => setLevelUpModalOpen(false)}
        onConfirm={handleLevelUpConfirm}
        onMulticlassConfirm={handleMulticlassConfirm}
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

      <KeyboardAwareScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled"
        style={styles.tabContent}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        bottomOffset={24}
      >
        <View style={{ flexGrow: 1 }}>
          <ThemeBackdropArt bottomGears={activeTab !== "spells" && activeTab !== "notes"} />
        {isMounted("stats") && (
          <View style={tabPane("stats")}>
            <StatsPane character={character} onChanged={refresh} />
          </View>
        )}
        {isMounted("spells") && (
          <View style={tabPane("spells")}>
            <SpellsPane character={character} onCharacterChanged={refresh} />
          </View>
        )}
        {isMounted("equipment") && (
          <View style={tabPane("equipment")}>
            <EquipmentPane character={character} onChanged={refresh} />
          </View>
        )}
        {isMounted("notes") && (
          <View style={tabPane("notes")}>
            <NotesPane character={character} />
          </View>
        )}
          <ThemeBackdropFooter />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.screenBackground },
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
    portraitFrame: { width: 56, height: 56, padding: 8 },
    framedPortrait: { width: 40, height: 40 },
    headerPortrait: { width: 36, height: 36, borderRadius: theme.radius },
    bannerWrap: { flex: 1 },
    bannerText: { fontSize: 14 },
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
    restActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    levelUpButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    levelUpButtonText: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
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
