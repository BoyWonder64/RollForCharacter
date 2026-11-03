import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { CONDITIONS } from "../data/conditions";
import { abilityModifier, ABILITY_LABELS } from "../features/characters/characterCalculations";
import { InvalidDiceExpressionError, rollExpression } from "../features/dice/diceEngine";
import type { AdvantageMode } from "../features/dice/structuredRolls";
import {
  removeDmCreature,
  setDmCreatureAbilityUses,
  setDmCreatureInitiative,
  toggleDmCreatureCondition,
  updateDmCreatureHp,
  updateDmCreatureNotes,
  type DmCreatureRow,
  type MonsterCatalogRow,
} from "../features/dm/dmCreatureRepo";
import {
  ABILITY_KEYS,
  parseStatBlock,
  parseUsedAbilities,
  rangeLabel,
  rollDamageParts,
  rollMonsterCheck,
  rollMonsterD20,
  rollMonsterInitiative,
  rollRecharge,
  type MonsterScores,
  type ParsedEntry,
} from "../features/dm/monsterRolls";
import type { RollSink } from "../features/dm/rollLog";
import type { AbilityScoreKey } from "../types/models";
import { useTheme } from "../theme/ThemeContext";
import { createDmStyles } from "./dmStyles";

const ADVANTAGE_OPTIONS: { key: AdvantageMode; label: string }[] = [
  { key: "disadvantage", label: "Disadv" },
  { key: "normal", label: "Normal" },
  { key: "advantage", label: "Adv" },
];

function signed(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

function toInt(text: string): number {
  const parsed = parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * One creature in the encounter: HP, conditions, and (when expanded) every
 * roll its stat block offers -- initiative, ability checks and saves, each
 * action's attack and damage, multiattack, recharge / per-day abilities,
 * legendary actions -- plus a freeform dice box. Rolls go to `onRoll`.
 */
export function DmCreatureCard({
  creature,
  monster,
  onRoll,
  onChanged,
}: {
  creature: DmCreatureRow;
  monster: MonsterCatalogRow | undefined;
  onRoll: RollSink;
  onChanged: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => createDmStyles(theme), [theme]);

  const [expanded, setExpanded] = useState(false);
  const [hpAmount, setHpAmount] = useState("");
  const [advantage, setAdvantage] = useState<AdvantageMode>("normal");
  const [bonusText, setBonusText] = useState("");
  const [freeform, setFreeform] = useState("");
  const [showConditions, setShowConditions] = useState(false);
  const [openText, setOpenText] = useState<string | null>(null);
  // Natural d20 of the last attack rolled per action, so the damage buttons
  // can show a crit / auto-miss hint without the DM remembering the roll.
  const [lastNatural, setLastNatural] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState(creature.notes);

  const statBlock = useMemo(() => (monster ? parseStatBlock(monster) : null), [monster]);
  const scores: MonsterScores | null = monster
    ? {
        strength: monster.strength,
        dexterity: monster.dexterity,
        constitution: monster.constitution,
        intelligence: monster.intelligence,
        wisdom: monster.wisdom,
        charisma: monster.charisma,
      }
    : null;

  const used = parseUsedAbilities(creature.usedAbilities);
  const activeConditions = creature.conditions ? creature.conditions.split(",").filter(Boolean) : [];
  const down = creature.currentHp <= 0;
  const bonus = toInt(bonusText);

  // Surfaced outside the (collapsed-by-default) Traits list so it's one tap
  // to spend mid-fight, instead of expanding the card to find it.
  const legendaryResistance = statBlock?.traits.find(
    (t) => t.limit?.kind === "perDay" && /legendary resistance/i.test(t.baseName)
  );
  const legendaryResistanceLeft = legendaryResistance
    ? Math.max(0, (legendaryResistance.limit as { kind: "perDay"; uses: number }).uses - (used[legendaryResistance.name] ?? 0))
    : 0;

  async function change(action: () => Promise<void>) {
    await action();
    onChanged();
  }

  function applyHp(sign: 1 | -1) {
    const amount = Math.abs(toInt(hpAmount)) || 1;
    const next = Math.max(0, Math.min(creature.maxHp, creature.currentHp + sign * amount));
    setHpAmount("");
    return change(() => updateDmCreatureHp(creature.id, next));
  }

  function rollInitiative() {
    const dex = scores?.dexterity ?? creature.dexterity;
    const outcome = rollMonsterInitiative(creature.name, dex, advantage, bonus);
    onRoll(outcome, outcome.natural);
    return change(() => setDmCreatureInitiative(creature.id, outcome.total));
  }

  function rollAbility(ability: AbilityScoreKey, kind: "check" | "save") {
    if (!scores) return;
    const outcome = rollMonsterCheck(creature.name, scores, ability, kind, bonus, advantage);
    onRoll(outcome, outcome.natural);
  }

  function rollAttack(entry: ParsedEntry): number | null {
    if (!entry.attack) return null;
    const outcome = rollMonsterD20(
      `${creature.name}: ${entry.baseName} attack`,
      entry.attack.bonus + bonus,
      "attack bonus",
      advantage
    );
    onRoll(outcome, outcome.natural);
    setLastNatural((prev) => ({ ...prev, [entry.name]: outcome.natural ?? 0 }));
    return outcome.natural;
  }

  function rollDamage(entry: ParsedEntry, crit: boolean) {
    const parts = entry.attack ? entry.damage : entry.saveDamage;
    const result = rollDamageParts(`${creature.name}: ${entry.baseName} damage`, parts, {
      crit,
      halve: entry.halfOnSave,
    });
    if (result) onRoll(result, null);
  }

  /** A Multiattack (or legendary "makes one X attack"): every component attack, then its damage. */
  function rollComponents(entry: ParsedEntry) {
    if (!statBlock) return;
    for (const component of entry.components) {
      const target = statBlock.actions.find((a) => a.baseName === component.name);
      if (!target?.attack) continue;
      for (let i = 0; i < component.count; i++) {
        const natural = rollAttack(target);
        if (natural === 1) continue;
        rollDamage(target, natural === 20);
      }
    }
  }

  async function spend(entry: ParsedEntry) {
    if (!entry.limit) return;
    const current = used[entry.name] ?? 0;
    const cap = entry.limit.kind === "perDay" ? entry.limit.uses : 1;
    if (current < cap) await setDmCreatureAbilityUses(creature.id, entry.name, current + 1);
  }

  function spendAndRollDamage(entry: ParsedEntry) {
    rollDamage(entry, false);
    return change(() => spend(entry));
  }

  function rollRechargeFor(entry: ParsedEntry) {
    if (entry.limit?.kind !== "recharge") return;
    const { value, recharged } = rollRecharge(entry.limit.min);
    onRoll(
      {
        expression: `${creature.name}: ${entry.baseName} recharge`,
        total: value,
        breakdown: `1d6 (${value}) — needs ${entry.limit.min}+ → ${recharged ? "recharged!" : "still expended"}`,
        rolls: [{ sides: 6, value }],
      },
      null
    );
    if (recharged) return change(() => setDmCreatureAbilityUses(creature.id, entry.name, 0));
  }

  function rollFreeform() {
    try {
      const result = rollExpression(freeform);
      onRoll({ ...result, expression: `${creature.name}: ${result.expression}` }, null);
    } catch (err) {
      if (err instanceof InvalidDiceExpressionError) {
        onRoll({ expression: creature.name, total: 0, breakdown: err.message, rolls: [] }, null);
        return;
      }
      throw err;
    }
  }

  function renderLimit(entry: ParsedEntry) {
    if (!entry.limit) return null;
    const count = used[entry.name] ?? 0;
    if (entry.limit.kind === "perDay") {
      const left = Math.max(0, entry.limit.uses - count);
      return (
        <View style={styles.row}>
          <Pressable
            style={styles.squareButton}
            onPress={() => change(() => setDmCreatureAbilityUses(creature.id, entry.name, count - 1))}
          >
            <Text style={styles.squareButtonText}>+</Text>
          </Pressable>
          <Text style={styles.hint}>
            {left}/{entry.limit.uses} left
          </Text>
          <Pressable style={styles.squareButton} onPress={() => change(() => spend(entry))}>
            <Text style={styles.squareButtonText}>−</Text>
          </Pressable>
        </View>
      );
    }
    const expended = count > 0;
    return (
      <View style={styles.row}>
        <Pressable
          style={[styles.chip, expended && styles.chipActive]}
          onPress={() => change(() => setDmCreatureAbilityUses(creature.id, entry.name, expended ? 0 : 1))}
        >
          <Text style={[styles.chipText, expended && styles.chipTextActive]}>
            {expended ? "Expended" : "Ready"}
          </Text>
        </Pressable>
        {entry.limit.kind === "recharge" && expended ? (
          <Pressable style={styles.secondaryButton} onPress={() => rollRechargeFor(entry)}>
            <Text style={styles.secondaryButtonText}>Roll recharge</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  function renderEntry(entry: ParsedEntry) {
    const natural = lastNatural[entry.name];
    const critHint = natural === 20 ? "Critical hit!" : natural === 1 ? "Natural 1 — miss" : null;
    const damageSummary = (entry.attack ? entry.damage : entry.saveDamage)
      .map((d) => `${d.expression ?? d.average} ${d.type}`)
      .join(" + ");
    const limitedOut = !!entry.limit && entry.limit.kind !== "perDay" && (used[entry.name] ?? 0) > 0;

    return (
      <View
        key={entry.name}
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingVertical: 8,
          gap: 6,
          opacity: limitedOut ? 0.6 : 1,
        }}
      >
        <Pressable onPress={() => setOpenText(openText === entry.name ? null : entry.name)}>
          <Text style={styles.sectionTitle}>
            {entry.baseName}
            {entry.limit ? <Text style={styles.hint}>{`  ${rangeLabel(entry.limit)}`}</Text> : null}
          </Text>
          {entry.attack ? (
            <Text style={styles.hint}>
              {entry.attack.kind === "ranged" ? "Ranged" : entry.attack.kind === "melee" ? "Melee" : "Melee/Ranged"}{" "}
              {signed(entry.attack.bonus)} · {damageSummary || "no damage dice"}
            </Text>
          ) : entry.save ? (
            <Text style={styles.hint}>
              DC {entry.save.dc} {ABILITY_LABELS[entry.save.ability]} save
              {damageSummary ? ` · ${damageSummary}` : ""}
              {entry.halfOnSave ? " · half on success" : ""}
            </Text>
          ) : entry.components.length > 0 ? (
            <Text style={styles.hint}>
              {entry.components.map((c) => `${c.count}× ${c.name}`).join(", ")}
            </Text>
          ) : (
            <Text style={styles.hint}>Tap to read</Text>
          )}
        </Pressable>

        {renderLimit(entry)}

        <View style={styles.wrapRow}>
          {entry.attack ? (
            <>
              <Pressable style={styles.primaryButton} onPress={() => rollAttack(entry)}>
                <Text style={styles.primaryButtonText}>Attack {signed(entry.attack.bonus + bonus)}</Text>
              </Pressable>
              {entry.damage.length > 0 && (
                <>
                  <Pressable style={styles.secondaryButton} onPress={() => rollDamage(entry, false)}>
                    <Text style={styles.secondaryButtonText}>Damage</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.secondaryButton, natural === 20 && { borderColor: theme.colors.primary }]}
                    onPress={() => rollDamage(entry, true)}
                  >
                    <Text style={styles.secondaryButtonText}>Crit</Text>
                  </Pressable>
                </>
              )}
            </>
          ) : null}
          {!entry.attack && entry.saveDamage.length > 0 ? (
            <Pressable
              style={styles.primaryButton}
              onPress={() => (entry.limit ? spendAndRollDamage(entry) : rollDamage(entry, false))}
            >
              <Text style={styles.primaryButtonText}>{entry.limit ? "Use & roll damage" : "Roll damage"}</Text>
            </Pressable>
          ) : null}
          {entry.components.length > 0 ? (
            <Pressable style={styles.primaryButton} onPress={() => rollComponents(entry)}>
              <Text style={styles.primaryButtonText}>Roll attacks</Text>
            </Pressable>
          ) : null}
          {entry.check && scores ? (
            <Pressable
              style={styles.primaryButton}
              onPress={() => rollAbility(entry.check!.ability, "check")}
            >
              <Text style={styles.primaryButtonText}>
                {entry.check.skill} {signed(abilityModifier(scores[entry.check.ability]) + bonus)}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {critHint ? (
          <Text style={natural === 20 ? styles.good : styles.bad}>{critHint}</Text>
        ) : null}
        {openText === entry.name ? <Text style={styles.hint}>{entry.description}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded((v) => !v)}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.sectionTitle,
                down && { textDecorationLine: "line-through", color: theme.colors.textMuted },
              ]}
            >
              {creature.name}
              {down ? <Text style={styles.bad}>{"  Down"}</Text> : null}
            </Text>
            <Text style={styles.hint}>
              AC {creature.armorClass} · HP {creature.currentHp}/{creature.maxHp}
              {monster ? ` · CR ${monster.challengeRating}` : ""}
              {creature.initiative !== null ? ` · Init ${creature.initiative}` : ""}
            </Text>
          </View>
          <Text style={styles.hint}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </Pressable>

      {legendaryResistance && (
        <View style={[styles.row, { marginTop: 4 }]}>
          <Pressable
            style={[styles.squareButton, legendaryResistanceLeft === 0 && styles.disabled]}
            disabled={legendaryResistanceLeft === 0}
            onPress={() => change(() => spend(legendaryResistance))}
          >
            <Text style={styles.squareButtonText}>−</Text>
          </Pressable>
          <Text style={styles.hint}>
            Legendary Resistance {legendaryResistanceLeft}/
            {(legendaryResistance.limit as { kind: "perDay"; uses: number }).uses}
          </Text>
          <Pressable
            style={styles.squareButton}
            onPress={() =>
              change(() =>
                setDmCreatureAbilityUses(
                  creature.id,
                  legendaryResistance.name,
                  Math.max(0, (used[legendaryResistance.name] ?? 0) - 1)
                )
              )
            }
          >
            <Text style={styles.squareButtonText}>+</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.row}>
        <TextInput
          style={styles.smallInput}
          value={hpAmount}
          onChangeText={setHpAmount}
          placeholder="1"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="number-pad"
        />
        <Pressable style={styles.dangerButton} onPress={() => applyHp(-1)}>
          <Text style={styles.dangerButtonText}>Damage</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => applyHp(1)}>
          <Text style={styles.secondaryButtonText}>Heal</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          style={styles.squareButton}
          onPress={() => change(() => removeDmCreature(creature.id))}
        >
          <Text style={styles.squareButtonText}>✕</Text>
        </Pressable>
      </View>

      {activeConditions.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <View style={styles.wrapRow}>
            {activeConditions.map((id) => {
              const condition = CONDITIONS.find((c) => c.id === id);
              const open = openText === `cond:${id}`;
              return (
                <View key={id} style={[styles.chip, styles.chipActive, styles.row]}>
                  <Pressable onPress={() => setOpenText(open ? null : `cond:${id}`)}>
                    <Text style={[styles.chipText, styles.chipTextActive]}>
                      {condition?.name ?? id}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => change(() => toggleDmCreatureCondition(creature.id, id))}>
                    <Text style={[styles.chipText, styles.chipTextActive]}>{"  ✕"}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          {activeConditions
            .filter((id) => openText === `cond:${id}`)
            .map((id) => (
              <Text key={id} style={[styles.hint, { marginTop: 4 }]}>
                {CONDITIONS.find((c) => c.id === id)?.description}
              </Text>
            ))}
        </View>
      )}

      {expanded && (
        <View style={{ marginTop: 8 }}>
          <Pressable onPress={() => setShowConditions((v) => !v)}>
            <Text style={styles.subTitle}>{showConditions ? "Conditions ▲" : "Conditions ▼"}</Text>
          </Pressable>
          {showConditions && (
            <View style={styles.wrapRow}>
              {CONDITIONS.map((condition) => {
                const active = activeConditions.includes(condition.id);
                return (
                  <Pressable
                    key={condition.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => change(() => toggleDmCreatureCondition(creature.id, condition.id))}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {condition.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.subTitle}>Rolls</Text>
          <View style={[styles.row, { flexWrap: "wrap" }]}>
            {ADVANTAGE_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={[styles.chip, advantage === option.key && styles.chipActive]}
                onPress={() => setAdvantage(option.key)}
              >
                <Text style={[styles.chipText, advantage === option.key && styles.chipTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
            <Text style={styles.hint}>Bonus</Text>
            <TextInput
              style={styles.smallInput}
              value={bonusText}
              onChangeText={setBonusText}
              placeholder="+0"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View style={[styles.wrapRow, { marginTop: 8 }]}>
            <Pressable style={styles.primaryButton} onPress={rollInitiative}>
              <Text style={styles.primaryButtonText}>
                Initiative {signed(abilityModifier(scores?.dexterity ?? creature.dexterity) + bonus)}
              </Text>
            </Pressable>
          </View>

          {scores && (
            <>
              <Text style={styles.subTitle}>Ability checks &amp; saves</Text>
              {ABILITY_KEYS.map((ability) => {
                const mod = abilityModifier(scores[ability]);
                return (
                  <View
                    key={ability}
                    style={[styles.row, { paddingVertical: 3, justifyContent: "space-between" }]}
                  >
                    <Text style={[styles.sectionTitle, { width: 90 }]}>
                      {ABILITY_LABELS[ability]} {scores[ability]}
                      <Text style={styles.hint}>{`  ${signed(mod)}`}</Text>
                    </Text>
                    <View style={styles.row}>
                      <Pressable style={styles.secondaryButton} onPress={() => rollAbility(ability, "check")}>
                        <Text style={styles.secondaryButtonText}>Check</Text>
                      </Pressable>
                      <Pressable style={styles.secondaryButton} onPress={() => rollAbility(ability, "save")}>
                        <Text style={styles.secondaryButtonText}>Save</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
              <Text style={styles.hint}>
                Saves and checks use the raw ability modifier; use Bonus for proficiency.
              </Text>
            </>
          )}

          {statBlock && statBlock.actions.length > 0 && (
            <>
              <Text style={styles.subTitle}>Actions</Text>
              {statBlock.actions.map(renderEntry)}
            </>
          )}
          {statBlock && statBlock.legendaryActions.length > 0 && (
            <>
              <Text style={styles.subTitle}>Legendary actions</Text>
              {statBlock.legendaryActions.map(renderEntry)}
            </>
          )}
          {statBlock && statBlock.traits.length > 0 && (
            <>
              <Text style={styles.subTitle}>Traits</Text>
              {statBlock.traits.map(renderEntry)}
            </>
          )}

          {!monster && (
            <Text style={styles.hint}>
              Custom creature — roll initiative above, or use the freeform box for anything else.
            </Text>
          )}

          <Text style={styles.subTitle}>Freeform roll</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={freeform}
              onChangeText={setFreeform}
              placeholder="e.g. 1d20+4"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              onSubmitEditing={rollFreeform}
            />
            <Pressable style={styles.primaryButton} onPress={rollFreeform}>
              <Text style={styles.primaryButtonText}>Roll</Text>
            </Pressable>
          </View>

          <Text style={styles.subTitle}>Notes</Text>
          <TextInput
            style={[styles.input, { minHeight: 44 }]}
            value={notes}
            onChangeText={setNotes}
            onEndEditing={() => updateDmCreatureNotes(creature.id, notes)}
            placeholder="Tactics, loot, reminders…"
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />
        </View>
      )}
    </View>
  );
}
