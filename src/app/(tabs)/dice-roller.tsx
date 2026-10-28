import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageStyle,
  type StyleProp,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InvalidDiceExpressionError, parseDiceExpression, rollExpression, type RollResult } from "../../features/dice/diceEngine";
import { clearRollHistory, recentRolls, saveRoll } from "../../features/dice/diceRepo";
import {
  buildStructuredRollPlan,
  detectSingleD20Flag,
  naturalD20Flag,
  rollD20,
  spellSaveDc,
  structuredRollToResult,
  type AdvantageMode,
  type NaturalD20Flag,
  type RollMode,
} from "../../features/dice/structuredRolls";
import { ABILITY_LABELS, isSkillProficient, type CharacterFeat } from "../../features/characters/characterCalculations";
import { listCharacters } from "../../features/characters/characterRepo";
import { listCharacterFeats } from "../../features/characters/featRepo";
import { DEFAULT_RULESET, getRulesetCatalog } from "../../data/rulesets";
import {
  DIE_TYPES,
  getDieFaceIcon,
  sidesForDieType,
  type DieType,
} from "../../features/dice/diceFaceAssets";
import type { AbilityScoreKey, Character } from "../../types/models";
import { useTheme } from "../../theme/ThemeContext";
import type { Theme } from "../../theme/colors";
import { useIconSettings } from "../../features/icons/IconSettingsContext";
import { getTabIcon } from "../../features/icons/iconAssets";
import { useDmMode } from "../../features/settings/DmModeContext";
import { useRollHistorySetting } from "../../features/settings/RollHistoryContext";
import { DmCreatureTracker } from "../../components/DmCreatureTracker";

function inferDieType(expr: string): DieType | null {
  try {
    const parsed = parseDiceExpression(expr);
    if (parsed.terms.length !== 1 || parsed.terms[0].count !== 1) return null;
    const candidate = `d${parsed.terms[0].sides}`;
    return (DIE_TYPES as string[]).includes(candidate) ? (candidate as DieType) : null;
  } catch {
    return null;
  }
}

/** Splits a "1d20 (14) + 3 (STR) + 3 (prof)" style breakdown into one term per line. */
function splitBreakdownTerms(breakdown: string): string[] {
  return breakdown.split(/\s(?=[+-]\s)/);
}

type DieFace = { die: DieType; value: number };

type InitiativeEntry = { id: string; label: string; value: number };

function randomDieFace(die: DieType): DieFace {
  const sides = sidesForDieType(die);
  return { die, value: die === "d100" ? 100 : 1 + Math.floor(Math.random() * sides) };
}

function representativeDieFace(die: DieType): DieFace {
  return { die, value: sidesForDieType(die) };
}

function DieFaceImage({
  face,
  imageStyle,
}: {
  face: DieFace;
  imageStyle: StyleProp<ImageStyle>;
}) {
  const icon = getDieFaceIcon(face.die, face.value);
  if (!icon) return null;
  // fadeDuration=0 kills the platform's default crossfade on source change --
  // without it, every face swap (several times a second while cycling, plus
  // the final landed result) visibly fades in instead of snapping, which
  // reads as lag even though the image itself is already preloaded/cached.
  return (
    <Image source={icon} style={imageStyle} resizeMode="contain" fadeDuration={0} />
  );
}

const ABILITIES: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];
const ATTACK_ABILITIES: AbilityScoreKey[] = ["strength", "dexterity"];

type ScreenMode = "freeform" | RollMode;

const MODES: { key: ScreenMode; label: string }[] = [
  { key: "freeform", label: "Freeform" },
  { key: "check", label: "Check" },
  { key: "save", label: "Save" },
  { key: "attack", label: "Attack" },
];

type AttackSubType = "weapon" | "spell" | "initiative";

/** Attack mode covers weapon/spell attacks and initiative under one tab,
 *  each resolving to its own underlying roll mode for buildStructuredRollPlan. */
function resolveAttackRollMode(screenMode: ScreenMode, subType: AttackSubType): RollMode {
  if (screenMode !== "attack") return screenMode as RollMode;
  if (subType === "spell") return "spell";
  if (subType === "initiative") return "initiative";
  return "attack";
}

const SELECTED_CHARACTER_KEY = "rollforcharacter.diceRoller.characterId";
const ROLL_ANIMATION_MS = 650;
const BURST_PARTICLE_COUNT = 14;
const BURST_ANGLES = Array.from(
  { length: BURST_PARTICLE_COUNT },
  (_, i) => (i / BURST_PARTICLE_COUNT) * Math.PI * 2 + (i % 2 ? 0.15 : -0.15)
);

export default function DiceRollerScreen() {
  const theme = useTheme();
  const { iconsEnabled, iconStyle } = useIconSettings();
  const { dmMode } = useDmMode();
  const { historyEnabled } = useRollHistorySetting();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // Arriving from a character's own screen (a "Roll" link there) locks this
  // screen to that character for the visit, regardless of DM mode -- you
  // came here to roll as a specific character, not to switch between them.
  const { characterId: lockedCharacterIdParam } = useLocalSearchParams<{
    characterId?: string;
  }>();
  const lockedCharacterId = lockedCharacterIdParam ? Number(lockedCharacterIdParam) : null;

  const [mode, setMode] = useState<ScreenMode>("freeform");
  const [expression, setExpression] = useState("1d20");
  const [ability, setAbility] = useState<AbilityScoreKey | null>(null);
  const [checkBy, setCheckBy] = useState<"ability" | "skill">("skill");
  const [skillId, setSkillId] = useState<string | null>(null);
  // Attack mode covers a weapon swing (ability + proficiency, picked
  // manually), a spell attack (spellcasting ability + proficiency, always
  // applied), and initiative (DEX only, no crit/damage follow-up) -- all
  // d20 rolls, so they share one tab instead of three.
  const [attackType, setAttackType] = useState<AttackSubType>("weapon");
  const [proficient, setProficient] = useState(false);
  const [advantageMode, setAdvantageMode] = useState<AdvantageMode>("normal");
  const [extraModifierText, setExtraModifierText] = useState("");

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  const [isRolling, setIsRolling] = useState(false);
  const [rollingNumber, setRollingNumber] = useState(1);
  const [rollingFace, setRollingFace] = useState<DieFace | undefined>(undefined);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [lastRollFace, setLastRollFace] = useState<DieFace | undefined>(undefined);
  // Only ever set for an Attack-mode roll -- 5e's crit rule (auto-hit +
  // double damage dice / auto-miss) specifically applies to attack rolls,
  // not every d20 roll, unlike the red/white flash which is cosmetic and
  // fires for any structured mode.
  const [attackCritFlag, setAttackCritFlag] = useState<NaturalD20Flag>(null);
  // Set for ANY single-d20 roll that comes up natural 1 or 20 (check, save,
  // attack, spell, or a bare "1d20" in freeform) -- called out in the math
  // breakdown itself, separate from the attack-only crit messaging above.
  const [naturalFlag, setNaturalFlag] = useState<NaturalD20Flag>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Awaited<ReturnType<typeof recentRolls>>>([]);
  // Running initiative order for the current encounter -- rolled one
  // character at a time, kept on screen (not cleared by the focus-reset
  // effect below) until the DM removes an entry, e.g. when a combatant
  // drops out or needs a re-roll.
  const [initiativeRolls, setInitiativeRolls] = useState<InitiativeEntry[]>([]);
  const nextInitiativeId = useRef(0);

  const [spin] = useState(() => new Animated.Value(0));
  const [punch] = useState(() => new Animated.Value(1));
  const [flash] = useState(() => new Animated.Value(0));
  const [flashColor, setFlashColor] = useState<string | null>(null);
  // Nat-20/nat-1 only: a sparkle (or skull) burst + screen flash, on top of
  // the ordinary crit flash, so the two extreme roll outcomes read as a much
  // bigger deal than every other roll. Same mechanism, opposite dressing.
  const [holyBurst] = useState(() => new Animated.Value(0));
  const [doomBurst] = useState(() => new Animated.Value(0));
  const [screenFlash] = useState(() => new Animated.Value(0));
  const [screenFlashColor, setScreenFlashColor] = useState("#FFF4D6");
  const [showHolyBurst, setShowHolyBurst] = useState(false);
  const [showDoomBurst, setShowDoomBurst] = useState(false);

  // Derived, not stored: a locked characterId (arrived via a character's own
  // "Roll" link) wins outright; otherwise falls back to the persisted
  // choice, then the first character, without needing an effect to
  // "default" the state.
  const effectiveCharacterId =
    lockedCharacterId && characters.some((c) => c.id === lockedCharacterId)
      ? lockedCharacterId
      : selectedCharacterId && characters.some((c) => c.id === selectedCharacterId)
        ? selectedCharacterId
        : characters[0]?.id ?? null;
  const selectedCharacter = characters.find((c) => c.id === effectiveCharacterId) ?? null;
  const showCharacterSwitcher = dmMode && !lockedCharacterId;
  const [selectedCharacterFeats, setSelectedCharacterFeats] = useState<CharacterFeat[]>([]);

  useEffect(() => {
    (selectedCharacter ? listCharacterFeats(selectedCharacter) : Promise.resolve([])).then(
      setSelectedCharacterFeats
    );
  }, [selectedCharacter]);

  const refreshHistory = useCallback(() => {
    if (!historyEnabled) {
      setHistory([]);
      return;
    }
    recentRolls().then(setHistory);
  }, [historyEnabled]);

  const refreshCharacters = useCallback(() => {
    listCharacters().then((loaded) => setCharacters(loaded));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(SELECTED_CHARACTER_KEY).then((stored) => {
      if (stored) setSelectedCharacterId(Number(stored));
    });
  }, []);

  // Arriving locked to a character makes it the sticky default too, so a
  // later plain visit to this tab (no param) keeps rolling for them.
  useEffect(() => {
    if (!lockedCharacterId) return;
    AsyncStorage.setItem(SELECTED_CHARACTER_KEY, String(lockedCharacterId)).catch(() => {});
  }, [lockedCharacterId]);

  // Resetting the displayed result (not the history) every time this screen
  // gains focus is deliberate: without it, React Navigation keeps the tab
  // mounted and an old roll from a previous visit stays on screen looking
  // like it "already rolled" something you never asked for.
  useFocusEffect(
    useCallback(() => {
      refreshHistory();
      refreshCharacters();
      setLastRoll(null);
      setLastRollFace(undefined);
      setAttackCritFlag(null);
      setNaturalFlag(null);
      setError(null);
    }, [refreshHistory, refreshCharacters])
  );

  function selectMode(next: ScreenMode) {
    if (isRolling) return;
    setMode(next);
    setAbility(null);
    setCheckBy("skill");
    setSkillId(null);
    setAttackType("weapon");
    setProficient(next === "attack");
    setAdvantageMode("normal");
    setExtraModifierText("");
    setError(null);
    setLastRoll(null);
    setLastRollFace(undefined);
    setAttackCritFlag(null);
    setNaturalFlag(null);
  }

  function selectCharacter(id: number) {
    setSelectedCharacterId(id);
    AsyncStorage.setItem(SELECTED_CHARACTER_KEY, String(id)).catch(() => {});
  }

  function parsedExtraModifier(): number {
    const parsed = parseInt(extraModifierText, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  async function playRollAnimation(dieType: DieType | null): Promise<void> {
    setIsRolling(true);
    spin.setValue(0);
    const cycle = setInterval(() => {
      if (dieType) {
        setRollingFace(randomDieFace(dieType));
      } else {
        setRollingFace(undefined);
        setRollingNumber(1 + Math.floor(Math.random() * 20));
      }
    }, 70);
    const animation = Animated.timing(spin, {
      toValue: 1,
      duration: ROLL_ANIMATION_MS,
      useNativeDriver: true,
    });
    await new Promise<void>((resolve) => {
      animation.start(() => resolve());
    });
    clearInterval(cycle);
    setIsRolling(false);
  }

  function landPunch() {
    punch.setValue(1);
    Animated.sequence([
      Animated.timing(punch, { toValue: 1.2, duration: 90, useNativeDriver: true }),
      Animated.timing(punch, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
  }

  function triggerCritFlash(flag: NaturalD20Flag) {
    if (!flag) return;
    const isNat20 = flag === "nat20";
    setFlashColor(isNat20 ? "#FFFFFF" : theme.colors.danger);
    flash.setValue(0);
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: isNat20 ? 550 : 400, useNativeDriver: true }),
    ]).start();
    if (isNat20) triggerHolyBurst();
    if (flag === "nat1") triggerDoomBurst();
  }

  function triggerHolyBurst() {
    setScreenFlashColor("#FFF4D6");
    setShowHolyBurst(true);
    holyBurst.setValue(0);
    screenFlash.setValue(0);
    Animated.parallel([
      Animated.timing(holyBurst, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(screenFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(screenFlash, { toValue: 0, duration: 550, useNativeDriver: true }),
      ]),
    ]).start(() => setShowHolyBurst(false));
  }

  function triggerDoomBurst() {
    setScreenFlashColor("#4A0000");
    setShowDoomBurst(true);
    doomBurst.setValue(0);
    screenFlash.setValue(0);
    Animated.parallel([
      Animated.timing(doomBurst, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(screenFlash, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(screenFlash, { toValue: 0, duration: 550, useNativeDriver: true }),
      ]),
    ]).start(() => setShowDoomBurst(false));
  }

  async function rollFreeform(expr: string) {
    if (isRolling) return;
    try {
      parseDiceExpression(expr);
    } catch (err) {
      if (err instanceof InvalidDiceExpressionError) {
        setError(err.message);
        return;
      }
      throw err;
    }
    setError(null);
    const dieType = inferDieType(expr);
    await playRollAnimation(dieType);
    const result = rollExpression(expr);
    setLastRoll(result);
    setLastRollFace(
      dieType && result.rolls.length === 1
        ? { die: dieType, value: result.rolls[0].value }
        : undefined
    );
    setAttackCritFlag(null);
    const flag = detectSingleD20Flag(result.rolls);
    setNaturalFlag(flag);
    landPunch();
    triggerCritFlash(flag);
    if (historyEnabled) {
      await saveRoll(result, selectedCharacter?.id);
      refreshHistory();
    }
  }

  async function rollStructured() {
    if (isRolling) return;
    if (!selectedCharacter) {
      setError("Select a character first.");
      return;
    }
    if (mode === "check" && checkBy === "skill" && !skillId) {
      setError("Choose a skill first.");
      return;
    }
    const plan = buildStructuredRollPlan({
      mode: resolveAttackRollMode(mode, attackType),
      character: selectedCharacter,
      feats: selectedCharacterFeats,
      ability: ability ?? undefined,
      skillId: mode === "check" && checkBy === "skill" ? skillId ?? undefined : undefined,
      proficient,
      extraModifier: parsedExtraModifier(),
      advantageMode,
    });
    if ("error" in plan) {
      setError(plan.error);
      return;
    }
    setError(null);
    await playRollAnimation("d20");
    const raw = rollD20(advantageMode, plan.modifier);
    const result = structuredRollToResult(plan, raw, advantageMode);
    setLastRoll(result);
    setLastRollFace({ die: "d20", value: raw.used });
    const critFlag = naturalD20Flag(raw.used);
    setAttackCritFlag(mode === "attack" && attackType !== "initiative" ? critFlag : null);
    setNaturalFlag(critFlag);
    landPunch();
    triggerCritFlash(critFlag);
    if (mode === "attack" && attackType === "initiative") {
      const entry: InitiativeEntry = {
        id: `initiative-${nextInitiativeId.current++}`,
        label: selectedCharacter.name,
        value: result.total,
      };
      setInitiativeRolls((prev) => [...prev, entry].sort((a, b) => b.value - a.value));
    }
    if (historyEnabled) {
      await saveRoll(result, selectedCharacter.id);
      refreshHistory();
    }
  }

  function removeInitiativeRoll(id: string) {
    setInitiativeRolls((prev) => prev.filter((entry) => entry.id !== id));
  }

  /** Jumps to Freeform with the input ready for a weapon's damage dice. */
  function handleRollDamage() {
    setMode("freeform");
    setExpression("");
    setLastRoll(null);
    setLastRollFace(undefined);
    setAttackCritFlag(null);
    setNaturalFlag(null);
    setError(null);
  }

  function handleClearHistory() {
    if (history.length === 0) return;
    Alert.alert("Clear roll history?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearRollHistory();
          refreshHistory();
        },
      },
    ]);
  }

  const abilityChoices = mode === "attack" ? ATTACK_ABILITIES : ABILITIES;
  const diceIcon = iconsEnabled ? getTabIcon(iconStyle, "dice-roller") : undefined;
  const caster = selectedCharacter ? spellSaveDc(selectedCharacter) : undefined;
  const skillCatalog = getRulesetCatalog(selectedCharacter?.ruleset ?? DEFAULT_RULESET).skills;
  const idleDieType: DieType = mode === "freeform" ? inferDieType(expression) ?? "d20" : "d20";
  const idleFace = representativeDieFace(idleDieType);

  // Derived into one value rather than three separate conditional JSX
  // branches -- keeping a single <Image> mount point across
  // rolling/landed/idle means only its `source` prop changes, instead of
  // the native image view being torn down and recreated on every state
  // change (which read as a visible delay even with fadeDuration=0).
  const isIdleDisplay = !isRolling && !lastRoll;
  const displayFace: DieFace | null = isRolling
    ? rollingFace ?? null
    : lastRoll
      ? lastRollFace ?? null
      : idleFace;
  const displayNumber = isRolling ? rollingNumber : lastRoll ? lastRoll.total : null;

  // Live preview of the computed modifier -- shown before rolling so
  // proficiency (or the lack of it) is visible up front, not just inferred
  // from the result afterwards.
  const rollPreview =
    mode !== "freeform" && selectedCharacter
      ? buildStructuredRollPlan({
          mode: resolveAttackRollMode(mode, attackType),
          character: selectedCharacter,
          feats: selectedCharacterFeats,
          ability: ability ?? undefined,
          skillId: mode === "check" && checkBy === "skill" ? skillId ?? undefined : undefined,
          proficient,
          extraModifier: parsedExtraModifier(),
          advantageMode,
        })
      : null;

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "1080deg"] });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.titleRow}>
        {diceIcon ? <Image source={diceIcon} style={styles.titleIcon} /> : null}
        <Text style={styles.title}>Dice Roller</Text>
      </View>

      <View style={styles.modeTabBar}>
        {MODES.map((m) => (
          <Pressable
            key={m.key}
            style={[styles.modeTab, mode === m.key && styles.modeTabActive]}
            onPress={() => selectMode(m.key)}
          >
            <Text
              style={[styles.modeTabLabel, mode === m.key && styles.modeTabLabelActive]}
              numberOfLines={1}
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {dmMode && <DmCreatureTracker />}

        {(mode !== "freeform" || (showCharacterSwitcher && characters.length > 0)) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Character</Text>
            {characters.length === 0 ? (
              <Text style={styles.hint}>Create a character first to use {mode} rolls.</Text>
            ) : showCharacterSwitcher ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipRow}>
                  {characters.map((c) => (
                    <Pressable
                      key={c.id}
                      disabled={isRolling}
                      style={[styles.chip, effectiveCharacterId === c.id && styles.chipActive]}
                      onPress={() => selectCharacter(c.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          effectiveCharacterId === c.id && styles.chipTextActive,
                        ]}
                      >
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.hint}>
                Rolling as {selectedCharacter?.name ?? "your character"}. Turn on DM mode in
                Settings to roll for other characters.
              </Text>
            )}
          </View>
        )}

        {mode === "freeform" && (
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={expression}
                onChangeText={setExpression}
                placeholder="e.g. 2d6+3"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                onSubmitEditing={() => rollFreeform(expression)}
              />
            </View>
            <View style={styles.quickRow}>
              {DIE_TYPES.map((die) => (
                <Pressable
                  key={die}
                  disabled={isRolling}
                  style={styles.quickDie}
                  onPress={() => {
                    setExpression(`1${die}`);
                    rollFreeform(`1${die}`);
                  }}
                >
                  <DieFaceImage
                    face={representativeDieFace(die)}
                    imageStyle={styles.quickDieImage}
                  />
                  <Text style={styles.quickDieLabel}>{die}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === "check" && (
          <View style={styles.section}>
            <View style={styles.advantageRow}>
              {(["skill", "ability"] as const).map((option) => (
                <Pressable
                  key={option}
                  disabled={isRolling}
                  style={[styles.advantageButton, checkBy === option && styles.advantageButtonActive]}
                  onPress={() => {
                    setCheckBy(option);
                    setAbility(null);
                    setSkillId(null);
                  }}
                >
                  <Text
                    style={[styles.advantageText, checkBy === option && styles.advantageTextActive]}
                  >
                    {option === "skill" ? "By skill" : "By ability"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === "attack" && (
          <View style={styles.section}>
            <View style={styles.advantageRow}>
              {(["weapon", "spell", "initiative"] as const).map((option) => (
                <Pressable
                  key={option}
                  disabled={isRolling}
                  style={[
                    styles.advantageButton,
                    attackType === option && styles.advantageButtonActive,
                  ]}
                  onPress={() => {
                    setAttackType(option);
                    setAbility(null);
                    setLastRoll(null);
                    setLastRollFace(undefined);
                    setAttackCritFlag(null);
                    setNaturalFlag(null);
                    setError(null);
                  }}
                >
                  <Text
                    style={[
                      styles.advantageText,
                      attackType === option && styles.advantageTextActive,
                    ]}
                  >
                    {option === "weapon" ? "Weapon" : option === "spell" ? "Spell" : "Initiative"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === "check" && checkBy === "skill" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill</Text>
            <View style={styles.quickRow}>
              {skillCatalog.map((skill) => {
                const active = skillId === skill.id;
                const prof = selectedCharacter
                  ? isSkillProficient(selectedCharacter, skill.id, selectedCharacterFeats)
                  : false;
                return (
                  <Pressable
                    key={skill.id}
                    disabled={isRolling}
                    style={[styles.skillChip, active && styles.skillChipActive]}
                    onPress={() => setSkillId(skill.id)}
                  >
                    <Text style={[styles.skillChipText, active && styles.skillChipTextActive]}>
                      {skill.name}
                      {prof ? " ✓" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {((mode === "check" && checkBy === "ability") ||
          mode === "save" ||
          (mode === "attack" && attackType === "weapon")) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ability</Text>
            <View style={styles.quickRow}>
              {abilityChoices.map((key) => {
                const active = ability === key;
                return (
                  <Pressable
                    key={key}
                    disabled={isRolling}
                    style={[styles.dieFace, active && styles.dieFaceActive]}
                    onPress={() => setAbility(key)}
                  >
                    <Text style={[styles.dieFaceText, active && styles.dieFaceTextActive]}>
                      {ABILITY_LABELS[key]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {mode === "attack" && attackType === "spell" && (
          <View style={styles.section}>
            {selectedCharacter ? (
              caster !== undefined ? (
                <Text style={styles.hint}>
                  {selectedCharacter.className} spell save DC {caster}. Rolling uses the
                  spellcasting ability automatically.
                </Text>
              ) : (
                <Text style={styles.hint}>
                  {selectedCharacter.className || "This class"} has no spellcasting ability.
                </Text>
              )
            ) : null}
          </View>
        )}

        {mode === "attack" && attackType === "initiative" && (
          <View style={styles.section}>
            <Text style={styles.hint}>Rolling uses DEX automatically.</Text>
          </View>
        )}

        {mode === "attack" && attackType === "initiative" && initiativeRolls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Initiative Order</Text>
            {initiativeRolls.map((entry) => (
              <View key={entry.id} style={styles.initiativeRow}>
                <Text style={styles.initiativeValue}>{entry.value}</Text>
                <Text style={styles.initiativeLabel} numberOfLines={1}>
                  {entry.label}
                </Text>
                <Pressable
                  style={styles.initiativeRemoveButton}
                  onPress={() => removeInitiativeRoll(entry.id)}
                >
                  <Text style={styles.initiativeRemoveButtonText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {mode !== "freeform" && (
          <View style={styles.section}>
            <View style={styles.optionsRow}>
              {((mode === "check" && checkBy === "ability") ||
                (mode === "attack" && attackType === "weapon")) && (
                <Pressable
                  style={styles.proficientToggle}
                  onPress={() => setProficient((v) => !v)}
                  disabled={isRolling}
                >
                  <View style={[styles.checkbox, proficient && styles.checkboxChecked]} />
                  <Text style={styles.proficientLabel}>Proficient</Text>
                </Pressable>
              )}
              <TextInput
                style={styles.extraInput}
                value={extraModifierText}
                onChangeText={setExtraModifierText}
                placeholder="+0"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.advantageRow}>
              {(["disadvantage", "normal", "advantage"] as AdvantageMode[]).map((option) => (
                <Pressable
                  key={option}
                  disabled={isRolling}
                  style={[
                    styles.advantageButton,
                    advantageMode === option && styles.advantageButtonActive,
                  ]}
                  onPress={() => setAdvantageMode(option)}
                >
                  <Text
                    style={[
                      styles.advantageText,
                      advantageMode === option && styles.advantageTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {rollPreview && !("error" in rollPreview) && (
          <Text style={styles.previewText}>
            {rollPreview.label}: {rollPreview.modifierBreakdown || "+0"} ={" "}
            {rollPreview.modifier >= 0 ? "+" : ""}
            {rollPreview.modifier}
          </Text>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.rollStageWrap}>
          <Animated.View
            style={[
              styles.rollStage,
              { transform: [{ rotate: spinDeg }, { scale: punch }] },
            ]}
          >
            {displayFace ? (
              <DieFaceImage
                face={displayFace}
                imageStyle={[styles.rollStageImage, isIdleDisplay && styles.rollStageIdleImage]}
              />
            ) : (
              <Text style={isIdleDisplay ? styles.rollStageIdleText : styles.rollStageText}>
                {displayNumber ?? "?"}
              </Text>
            )}
            <Animated.View
              pointerEvents="none"
              style={[styles.critFlashOverlay, { backgroundColor: flashColor ?? "transparent", opacity: flash }]}
            />
          </Animated.View>

          {showHolyBurst && (
            <View pointerEvents="none" style={styles.burstField}>
              <Animated.View
                style={[
                  styles.burstGlow,
                  {
                    opacity: holyBurst.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0, 0.6, 0],
                    }),
                    transform: [
                      {
                        scale: holyBurst.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4, 2.6],
                        }),
                      },
                    ],
                  },
                ]}
              />
              {BURST_ANGLES.map((angle, i) => {
                const distance = 85 + (i % 3) * 28;
                return (
                  <Animated.Text
                    key={i}
                    style={[
                      styles.burstSparkle,
                      {
                        opacity: holyBurst.interpolate({
                          inputRange: [0, 0.15, 0.7, 1],
                          outputRange: [0, 1, 1, 0],
                        }),
                        transform: [
                          {
                            translateX: holyBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.cos(angle) * distance],
                            }),
                          },
                          {
                            translateY: holyBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.sin(angle) * distance],
                            }),
                          },
                          {
                            scale: holyBurst.interpolate({
                              inputRange: [0, 0.2, 1],
                              outputRange: [0.3, 1.3, 0.5],
                            }),
                          },
                          {
                            rotate: holyBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: i % 2 ? ["0deg", "180deg"] : ["0deg", "-180deg"],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {i % 3 === 0 ? "✦" : "✨"}
                  </Animated.Text>
                );
              })}
            </View>
          )}

          {showDoomBurst && (
            <View pointerEvents="none" style={styles.burstField}>
              <Animated.View
                style={[
                  styles.doomGlow,
                  {
                    opacity: doomBurst.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0, 0.6, 0],
                    }),
                    transform: [
                      {
                        scale: doomBurst.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4, 2.6],
                        }),
                      },
                    ],
                  },
                ]}
              />
              {BURST_ANGLES.map((angle, i) => {
                const distance = 85 + (i % 3) * 28;
                return (
                  <Animated.Text
                    key={i}
                    style={[
                      styles.doomSkull,
                      {
                        opacity: doomBurst.interpolate({
                          inputRange: [0, 0.15, 0.7, 1],
                          outputRange: [0, 1, 1, 0],
                        }),
                        transform: [
                          {
                            translateX: doomBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.cos(angle) * distance],
                            }),
                          },
                          {
                            translateY: doomBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.sin(angle) * distance],
                            }),
                          },
                          {
                            scale: doomBurst.interpolate({
                              inputRange: [0, 0.2, 1],
                              outputRange: [0.3, 1.3, 0.5],
                            }),
                          },
                          {
                            rotate: doomBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: i % 2 ? ["0deg", "180deg"] : ["0deg", "-180deg"],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {"💀"}
                  </Animated.Text>
                );
              })}
            </View>
          )}

          {!isRolling && !lastRoll && (
            <Text style={styles.hint}>Nothing rolled yet.</Text>
          )}
          {!isRolling && lastRoll && (
            <>
              <View style={styles.resultBreakdownCard}>
                {splitBreakdownTerms(lastRoll.breakdown).map((term, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.resultBreakdownLine,
                      index === 0 && styles.resultBreakdownLinePrimary,
                    ]}
                  >
                    {term}
                  </Text>
                ))}
                {naturalFlag && (
                  <Text
                    style={naturalFlag === "nat20" ? styles.naturalBadgeHit : styles.naturalBadgeMiss}
                  >
                    {naturalFlag === "nat20" ? "Natural 20!" : "Natural 1"}
                  </Text>
                )}
              </View>
              {lastRollFace && (
                <View style={styles.resultTotalRow}>
                  <Text style={styles.resultTotalLabel}>Total</Text>
                  <Text style={styles.resultTotal}>{lastRoll.total}</Text>
                </View>
              )}
              {attackCritFlag && (
                <Text
                  style={
                    attackCritFlag === "nat20" ? styles.critHitText : styles.critMissText
                  }
                >
                  {attackCritFlag === "nat20"
                    ? "Critical Hit! Roll damage dice twice."
                    : "Critical Miss — automatic miss, no damage."}
                </Text>
              )}
            </>
          )}

          <Pressable
            style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
            disabled={isRolling}
            onPress={() => (mode === "freeform" ? rollFreeform(expression) : rollStructured())}
          >
            <Text style={styles.rollButtonText}>{isRolling ? "Rolling…" : "Roll"}</Text>
          </Pressable>

          {!isRolling && mode === "attack" && attackType !== "initiative" && lastRoll && (
            <Pressable style={styles.damageRollButton} onPress={handleRollDamage}>
              <Text style={styles.damageRollButtonText}>Roll Damage</Text>
            </Pressable>
          )}
        </View>

        {historyEnabled ? (
          <>
            <View style={styles.historyHeaderRow}>
              <Text style={styles.sectionTitle}>History</Text>
              {history.length > 0 && (
                <Pressable onPress={handleClearHistory}>
                  <Text style={styles.clearHistoryText}>Clear</Text>
                </Pressable>
              )}
            </View>
            {history.map((roll) => (
              <View key={roll.id} style={styles.historyRow}>
                <Text style={styles.historyExpression} numberOfLines={1}>
                  {roll.expression}
                </Text>
                <Text style={styles.historyBreakdown} numberOfLines={1}>
                  {roll.breakdown}
                </Text>
                <Text style={styles.historyTotal}>{roll.result}</Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.historyHeaderRow}>
            <Text style={styles.sectionTitle}>History</Text>
            <Text style={styles.hint}>Off — turn on in Settings.</Text>
          </View>
        )}

        <Text style={styles.realDiceNote}>Rolling real dice at the table is always better.</Text>
      </ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.screenFlashOverlay,
          {
            backgroundColor: screenFlashColor,
            opacity: screenFlash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: 16, paddingBottom: 40 },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    titleIcon: { width: 28, height: 28 },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
    },
    modeTabBar: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      marginTop: 12,
    },
    modeTab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    modeTabActive: { borderBottomColor: theme.colors.primary },
    modeTabLabel: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      fontSize: 13,
    },
    modeTabLabelActive: { color: theme.colors.text },
    section: { marginTop: 16 },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginBottom: 8,
    },
    hint: { color: theme.colors.textMuted, fontSize: 13 },
    chipRow: { flexDirection: "row", gap: 8 },
    chip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    chipText: { color: theme.colors.text, fontWeight: "600" },
    chipTextActive: { color: theme.colors.primaryText },
    inputRow: { flexDirection: "row", gap: 8 },
    input: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
    dieFace: {
      width: 56,
      height: 56,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      alignItems: "center",
      justifyContent: "center",
    },
    dieFaceActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    dieFaceText: {
      color: theme.colors.text,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      fontSize: 18,
    },
    dieFaceTextActive: { color: theme.colors.primaryText },
    quickDie: { alignItems: "center", width: 60 },
    quickDieImage: { width: 40, height: 40 },
    quickDieLabel: {
      color: theme.colors.textMuted,
      fontSize: 14,
      fontWeight: "700",
      fontFamily: theme.displayFontFamily,
      marginTop: 2,
    },
    skillChip: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    skillChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    skillChipText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
      fontSize: 15,
    },
    skillChipTextActive: { color: theme.colors.primaryText },
    optionsRow: { flexDirection: "row", alignItems: "center", gap: 16 },
    proficientToggle: { flexDirection: "row", alignItems: "center", gap: 8 },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    checkboxChecked: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    proficientLabel: { color: theme.colors.text, fontWeight: "600", fontSize: 15 },
    extraInput: {
      width: 70,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 10,
      paddingVertical: 8,
      textAlign: "center",
    },
    advantageRow: { flexDirection: "row", gap: 8, marginTop: 12 },
    advantageButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingVertical: 8,
      alignItems: "center",
    },
    advantageButtonActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
    advantageText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      textTransform: "capitalize",
      fontSize: 14,
    },
    advantageTextActive: { color: theme.colors.primaryText },
    initiativeRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 6,
      gap: 10,
    },
    initiativeValue: {
      color: theme.colors.text,
      fontWeight: "800",
      fontFamily: theme.displayFontFamily,
      fontSize: 18,
      width: 28,
      textAlign: "center",
    },
    initiativeLabel: { flex: 1, color: theme.colors.text, fontWeight: "600" },
    initiativeRemoveButton: {
      width: 26,
      height: 26,
      borderRadius: theme.radius,
      backgroundColor: theme.colors.danger,
      alignItems: "center",
      justifyContent: "center",
    },
    initiativeRemoveButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    error: { color: theme.colors.danger, marginTop: 12 },
    previewText: {
      color: theme.colors.accent,
      fontSize: 13,
      fontWeight: "600",
      marginTop: 12,
      textAlign: "center",
    },
    rollStageWrap: { alignItems: "center", marginTop: 24, marginBottom: 8 },
    rollStage: {
      width: 120,
      height: 120,
      borderWidth: 3,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    critFlashOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
    burstField: {
      position: "absolute",
      top: -80,
      left: "50%",
      marginLeft: -140,
      width: 280,
      height: 280,
      alignItems: "center",
      justifyContent: "center",
    },
    burstGlow: {
      position: "absolute",
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: "#FFE9A8",
    },
    burstSparkle: {
      position: "absolute",
      fontSize: 22,
      color: "#FFE9A8",
      textShadowColor: "#FFD76A",
      textShadowRadius: 8,
      textShadowOffset: { width: 0, height: 0 },
    },
    doomGlow: {
      position: "absolute",
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: "#4A0000",
    },
    doomSkull: {
      position: "absolute",
      fontSize: 22,
      textShadowColor: "#000000",
      textShadowRadius: 8,
      textShadowOffset: { width: 0, height: 0 },
    },
    screenFlashOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    rollStageText: { color: theme.colors.text, fontSize: 44, fontWeight: "800" },
    rollStageIdleText: { color: theme.colors.textMuted, fontSize: 44, fontWeight: "800" },
    rollStageImage: { width: 90, height: 90 },
    rollStageIdleImage: { opacity: 0.35 },
    resultBreakdownCard: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginTop: 10,
      alignSelf: "stretch",
      gap: 4,
    },
    resultBreakdownLine: {
      color: theme.colors.textMuted,
      fontSize: 14,
      textAlign: "center",
    },
    resultBreakdownLinePrimary: {
      color: theme.colors.text,
      fontWeight: "700",
    },
    naturalBadgeHit: {
      color: theme.colors.primary,
      fontWeight: "800",
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
    },
    naturalBadgeMiss: {
      color: theme.colors.danger,
      fontWeight: "800",
      fontSize: 14,
      textAlign: "center",
      marginTop: 4,
    },
    resultTotalRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 6,
      marginTop: 10,
    },
    resultTotalLabel: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    resultTotal: { color: theme.colors.text, fontSize: 30, fontWeight: "800" },
    rollButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius,
      paddingHorizontal: 32,
      paddingVertical: 12,
      marginTop: 16,
    },
    rollButtonDisabled: { opacity: 0.6 },
    rollButtonText: {
      color: theme.colors.primaryText,
      fontWeight: "700",
      fontSize: 16,
      fontFamily: theme.displayFontFamily,
    },
    critHitText: {
      color: theme.colors.primary,
      fontWeight: "800",
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
    critMissText: {
      color: theme.colors.danger,
      fontWeight: "800",
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
    damageRollButton: {
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius,
      paddingHorizontal: 24,
      paddingVertical: 10,
      marginTop: 10,
    },
    damageRollButtonText: {
      color: theme.colors.accent,
      fontWeight: "700",
      fontSize: 14,
      fontFamily: theme.displayFontFamily,
    },
    historyHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 24,
      marginBottom: 8,
    },
    clearHistoryText: {
      color: theme.colors.danger,
      fontWeight: "600",
      fontFamily: theme.displayFontFamily,
    },
    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius,
      padding: 10,
      marginBottom: 6,
      gap: 8,
    },
    historyExpression: { color: theme.colors.text, width: 90, fontWeight: "600" },
    historyBreakdown: { color: theme.colors.textMuted, flex: 1, fontSize: 12 },
    historyTotal: { color: theme.colors.text, fontWeight: "700" },
    realDiceNote: {
      color: theme.colors.textMuted,
      fontSize: 11,
      textAlign: "center",
      marginTop: 20,
      fontStyle: "italic",
    },
  });
}
