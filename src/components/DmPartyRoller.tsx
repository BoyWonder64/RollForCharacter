import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_RULESET, getRulesetCatalog } from "../data/rulesets";
import { ABILITY_LABELS } from "../features/characters/characterCalculations";
import { listCharacterFeats } from "../features/characters/featRepo";
import { saveRoll } from "../features/dice/diceRepo";
import {
  buildStructuredRollPlan,
  rollD20,
  structuredRollToResult,
  type AdvantageMode,
  type RollMode,
} from "../features/dice/structuredRolls";
import { setPartyInitiative } from "../features/dm/dmCreatureRepo";
import { ABILITY_KEYS } from "../features/dm/monsterRolls";
import type { RollSink } from "../features/dm/rollLog";
import { useRollHistorySetting } from "../features/settings/RollHistoryContext";
import type { AbilityScoreKey, Character } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

const SELECTION_KEY = "rollforcharacter.dm.partySelection";

type PartyRollType = "initiative" | "save" | "check" | "skill";

const ROLL_TYPES: { key: PartyRollType; label: string }[] = [
  { key: "save", label: "Save" },
  { key: "check", label: "Ability check" },
  { key: "skill", label: "Skill check" },
  { key: "initiative", label: "Initiative" },
];

const ADVANTAGE_OPTIONS: AdvantageMode[] = ["disadvantage", "normal", "advantage"];

// Party-member chips get a bit more breathing room than the default chip,
// since they're the first and most frequently tapped control here.
const partyChip = { paddingHorizontal: 12, paddingVertical: 8 };
const resultRow = { paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 10, marginTop: 6 };

type PartyResult = {
  characterId: number;
  name: string;
  total: number | null;
  breakdown: string;
  natural: number | null;
  error?: string;
};

function toInt(text: string): number {
  const parsed = parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Rolls one thing for several party members at once -- initiative, a save,
 * an ability check or a skill check -- with a shared advantage mode, bonus
 * and optional DC (pass / fail shown per character). Initiative results are
 * written to the encounter's initiative order.
 */
export function DmPartyRoller({
  characters,
  onRoll,
  onChanged,
}: {
  characters: Character[];
  onRoll: RollSink;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);
  const { historyEnabled } = useRollHistorySetting();

  // null = nobody has touched the selection yet, which means "everyone".
  const [selection, setSelection] = useState<number[] | null>(null);
  const [rollType, setRollType] = useState<PartyRollType>("save");
  const [ability, setAbility] = useState<AbilityScoreKey>("dexterity");
  const [skillId, setSkillId] = useState<string | null>(null);
  const [advantage, setAdvantage] = useState<AdvantageMode>("normal");
  const [bonusText, setBonusText] = useState("");
  const [dcText, setDcText] = useState("");
  const [results, setResults] = useState<PartyResult[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(SELECTION_KEY)
      .then((stored) => {
        if (stored) setSelection(JSON.parse(stored) as number[]);
      })
      .catch(() => {});
  }, []);

  const selectedIds = useMemo(
    () => (selection ?? characters.map((c) => c.id)).filter((id) => characters.some((c) => c.id === id)),
    [selection, characters]
  );
  const selectedCharacters = characters.filter((c) => selectedIds.includes(c.id));
  const skills = getRulesetCatalog(selectedCharacters[0]?.ruleset ?? DEFAULT_RULESET).skills;
  const dc = dcText.trim() === "" ? null : toInt(dcText);

  function persist(next: number[]) {
    setSelection(next);
    AsyncStorage.setItem(SELECTION_KEY, JSON.stringify(next)).catch(() => {});
  }

  function toggle(id: number) {
    persist(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  }

  async function handleRoll() {
    if (selectedCharacters.length === 0) return;
    if (rollType === "skill" && !skillId) {
      setResults([
        { characterId: -1, name: "", total: null, breakdown: "", natural: null, error: "Choose a skill first." },
      ]);
      return;
    }
    const mode: RollMode = rollType === "initiative" ? "initiative" : rollType === "save" ? "save" : "check";
    const next: PartyResult[] = [];
    for (const character of selectedCharacters) {
      const feats = await listCharacterFeats(character);
      const plan = buildStructuredRollPlan({
        mode,
        character,
        feats,
        ability: rollType === "initiative" || rollType === "skill" ? undefined : ability,
        skillId: rollType === "skill" ? skillId ?? undefined : undefined,
        extraModifier: toInt(bonusText),
        advantageMode: advantage,
      });
      if ("error" in plan) {
        next.push({
          characterId: character.id,
          name: character.name,
          total: null,
          breakdown: "",
          natural: null,
          error: plan.error,
        });
        continue;
      }
      const raw = rollD20(advantage, plan.modifier);
      const result = structuredRollToResult(plan, raw, advantage);
      next.push({
        characterId: character.id,
        name: character.name,
        total: result.total,
        breakdown: result.breakdown,
        natural: raw.used,
      });
      onRoll(
        { ...result, expression: `${character.name}: ${result.expression}` },
        raw.used,
        rollType === "initiative" || dc === null ? undefined : dc
      );
      if (historyEnabled) await saveRoll(result, character.id);
      if (rollType === "initiative") await setPartyInitiative(character.id, result.total);
    }
    setResults(next.sort((a, b) => (b.total ?? -Infinity) - (a.total ?? -Infinity)));
    if (rollType === "initiative") onChanged();
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Party roller</Text>
        <View style={styles.row}>
          <Pressable style={styles.chip} onPress={() => persist(characters.map((c) => c.id))}>
            <Text style={styles.chipText}>All</Text>
          </Pressable>
          <Pressable style={styles.chip} onPress={() => persist([])}>
            <Text style={styles.chipText}>None</Text>
          </Pressable>
        </View>
      </View>

      {characters.length === 0 ? (
        <Text style={styles.hint}>Create a character first to roll for the party.</Text>
      ) : (
        <View style={styles.card}>
          <View style={[styles.headerRow, { marginBottom: 6 }]}>
            <Text style={styles.subTitle}>Party</Text>
            <Text style={styles.hint}>
              {selectedCharacters.length} of {characters.length} selected
            </Text>
          </View>
          <View style={styles.wrapRow}>
            {characters.map((c) => {
              const active = selectedIds.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  style={[styles.chip, partyChip, active && styles.chipActive]}
                  onPress={() => toggle(c.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.subTitle, { marginTop: 18 }]}>Roll</Text>
          <View style={styles.wrapRow}>
            {ROLL_TYPES.map((t) => (
              <Pressable
                key={t.key}
                style={[styles.chip, rollType === t.key && styles.chipActive]}
                onPress={() => {
                  setRollType(t.key);
                  setResults([]);
                }}
              >
                <Text style={[styles.chipText, rollType === t.key && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {(rollType === "save" || rollType === "check") && (
            <>
              <Text style={styles.subTitle}>Ability</Text>
              <View style={styles.wrapRow}>
                {ABILITY_KEYS.map((key) => (
                  <Pressable
                    key={key}
                    style={[styles.chip, ability === key && styles.chipActive]}
                    onPress={() => setAbility(key)}
                  >
                    <Text style={[styles.chipText, ability === key && styles.chipTextActive]}>
                      {ABILITY_LABELS[key]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {rollType === "initiative" && (
            <Text style={[styles.hint, { marginTop: 10 }]}>
              Usually the party rolls their own initiative and reports it in the tracker above —
              use this only if you&apos;re rolling on their behalf.
            </Text>
          )}

          {rollType === "skill" && (
            <>
              <Text style={styles.subTitle}>Skill</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.row}>
                  {skills.map((skill) => (
                    <Pressable
                      key={skill.id}
                      style={[styles.chip, skillId === skill.id && styles.chipActive]}
                      onPress={() => setSkillId(skill.id)}
                    >
                      <Text style={[styles.chipText, skillId === skill.id && styles.chipTextActive]}>
                        {skill.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </>
          )}

          <Text style={[styles.subTitle, { marginTop: 18 }]}>Advantage</Text>
          <View style={styles.wrapRow}>
            {ADVANTAGE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[styles.chip, advantage === option && styles.chipActive]}
                onPress={() => setAdvantage(option)}
              >
                <Text
                  style={[
                    styles.chipText,
                    advantage === option && styles.chipTextActive,
                    { textTransform: "capitalize" },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.row, { marginTop: 18, gap: 20 }]}>
            <View>
              <Text style={styles.subTitle}>Bonus</Text>
              <TextInput
                style={styles.smallInput}
                value={bonusText}
                onChangeText={setBonusText}
                placeholder="+0"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            {rollType !== "initiative" && (
              <View>
                <Text style={styles.subTitle}>DC</Text>
                <TextInput
                  style={styles.smallInput}
                  value={dcText}
                  onChangeText={setDcText}
                  placeholder="—"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                />
              </View>
            )}
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              { marginTop: 16, paddingVertical: 12 },
              selectedCharacters.length === 0 && styles.disabled,
            ]}
            disabled={selectedCharacters.length === 0}
            onPress={handleRoll}
          >
            <Text style={styles.primaryButtonText}>
              {selectedCharacters.length === 0
                ? "Select at least one character"
                : `Roll for ${selectedCharacters.length} ${
                    selectedCharacters.length === 1 ? "character" : "characters"
                  }`}
            </Text>
          </Pressable>

          {results.length > 0 && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.subTitle}>Results</Text>
              {results.map((r) => {
                const passed = dc !== null && rollType !== "initiative" && r.total !== null ? r.total >= dc : null;
                return (
                  <View
                    key={r.characterId}
                    style={[
                      styles.row,
                      resultRow,
                      {
                        backgroundColor: theme.colors.surfaceAlt,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.resultTotal, { width: 48, textAlign: "center" }]}>
                      {r.total ?? "—"}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sectionTitle}>
                        {r.name}
                        {r.natural === 20 ? <Text style={styles.good}>{"  Nat 20!"}</Text> : null}
                        {r.natural === 1 ? <Text style={styles.bad}>{"  Nat 1"}</Text> : null}
                      </Text>
                      <Text style={styles.resultBreakdown}>{r.error ?? r.breakdown}</Text>
                    </View>
                    {passed !== null && (
                      <Text style={passed ? styles.good : styles.bad}>{passed ? "Pass" : "Fail"}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
