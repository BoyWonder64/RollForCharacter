import type { MonsterTraitEntry } from "../../data/monsters";
import { abilityModifier, ABILITY_LABELS } from "../characters/characterCalculations";
import type { AbilityScoreKey } from "../../types/models";
import { parseDiceExpression, rollExpression, type RollResult } from "../dice/diceEngine";
import {
  rollD20,
  structuredRollToResult,
  type AdvantageMode,
} from "../dice/structuredRolls";

/**
 * Turns a monster stat block's free-text action/trait entries (SRD 2014 and
 * 2024 wording) into things the DM can roll: attack bonuses, damage dice,
 * save DCs, recharge, and which other actions a Multiattack is made of.
 * Anything it can't understand just comes back with no roll attached, and
 * the UI falls back to showing the raw text.
 */

export type MonsterScores = Record<AbilityScoreKey, number>;

export const ABILITY_KEYS: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export type DamagePart = {
  /** Null for flat damage with no dice, e.g. "5 piercing damage". */
  expression: string | null;
  average: number;
  type: string;
};

export type AttackRoll = {
  kind: "melee" | "ranged" | "melee-or-ranged";
  bonus: number;
};

export type SaveRequirement = {
  ability: AbilityScoreKey;
  dc: number;
};

export type AbilityLimit =
  | { kind: "recharge"; min: number }
  | { kind: "perDay"; uses: number }
  | { kind: "rest" };

export type ActionComponent = { name: string; count: number };

export type ParsedEntry = {
  name: string;
  /** Name with any "(Recharge 5-6)" / "(3/Day)" suffix removed. */
  baseName: string;
  description: string;
  attack: AttackRoll | null;
  /** Damage of the hit itself (before any save rider). */
  damage: DamagePart[];
  save: SaveRequirement | null;
  /** Damage dealt on a failed save (save-based actions only). */
  saveDamage: DamagePart[];
  halfOnSave: boolean;
  limit: AbilityLimit | null;
  /** Other actions this one is made of (Multiattack, legendary "makes one X attack"). */
  components: ActionComponent[];
  /** e.g. a legendary "makes a Wisdom (Perception) check". */
  check: { ability: AbilityScoreKey; skill: string } | null;
};

const ABILITY_NAMES: Record<string, AbilityScoreKey> = {
  strength: "strength",
  dexterity: "dexterity",
  constitution: "constitution",
  intelligence: "intelligence",
  wisdom: "wisdom",
  charisma: "charisma",
};
const ABILITY_PATTERN = "Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma";

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function normalizeDashes(text: string): string {
  return text.replace(/[−–—]/g, "-");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** "14 (2d10 + 6) piercing damage" and flat "5 piercing damage", in order. */
export function parseDamageParts(text: string): DamagePart[] {
  const parts: DamagePart[] = [];
  const pattern = /(\d+)(?:\s*\(([^)]*d\d+[^)]*)\))?\s+([A-Za-z]+)\s+damage/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(normalizeDashes(text))) !== null) {
    const expression = match[2] ? match[2].replace(/\s+/g, "") : null;
    if (expression) {
      try {
        parseDiceExpression(expression);
      } catch {
        parts.push({ expression: null, average: parseInt(match[1], 10), type: match[3].toLowerCase() });
        continue;
      }
    }
    parts.push({
      expression,
      average: parseInt(match[1], 10),
      type: match[3].toLowerCase(),
    });
  }
  return parts;
}

function parseAttack(text: string): AttackRoll | null {
  const match = text.match(
    /(Melee or Ranged|Melee|Ranged)(?: Weapon| Spell)?(?: Attack Roll| Attack):\s*([+-]\s*\d+)/i
  );
  if (!match) return null;
  const kindText = match[1].toLowerCase();
  return {
    kind: kindText.includes("or") ? "melee-or-ranged" : kindText === "ranged" ? "ranged" : "melee",
    bonus: parseInt(normalizeDashes(match[2]).replace(/\s/g, ""), 10),
  };
}

function parseSave(text: string): SaveRequirement | null {
  const oldStyle = text.match(new RegExp(`DC (\\d+) (${ABILITY_PATTERN}) saving throw`, "i"));
  if (oldStyle) {
    return {
      dc: parseInt(oldStyle[1], 10),
      ability: ABILITY_NAMES[oldStyle[2].toLowerCase()],
    };
  }
  const newStyle = text.match(new RegExp(`(${ABILITY_PATTERN}) Saving Throw: DC (\\d+)`, "i"));
  if (newStyle) {
    return {
      dc: parseInt(newStyle[2], 10),
      ability: ABILITY_NAMES[newStyle[1].toLowerCase()],
    };
  }
  return null;
}

function parseLimit(name: string): AbilityLimit | null {
  const recharge = normalizeDashes(name).match(/\(Recharge (\d)(?:\s*-\s*\d)?\)/i);
  if (recharge) return { kind: "recharge", min: parseInt(recharge[1], 10) };
  const perDay = name.match(/\((\d+)\/Day/i);
  if (perDay) return { kind: "perDay", uses: parseInt(perDay[1], 10) };
  if (/\(Recharges? after a Short or Long Rest\)/i.test(name)) return { kind: "rest" };
  return null;
}

function parseCheck(text: string): ParsedEntry["check"] {
  const match = text.match(new RegExp(`(${ABILITY_PATTERN}) \\(([A-Za-z ]+)\\) check`, "i"));
  if (!match) return null;
  return { ability: ABILITY_NAMES[match[1].toLowerCase()], skill: match[2].trim() };
}

/**
 * Which of a creature's other attack actions this entry's text tells the DM
 * to make ("makes three tentacle attacks", "one with its bite and one with
 * its claws"). A name mentioned with no count counts once.
 */
function parseComponents(text: string, attackNames: string[], ownName: string): ActionComponent[] {
  const found: ActionComponent[] = [];
  for (const name of attackNames) {
    if (name.toLowerCase() === ownName.toLowerCase()) continue;
    const escaped = escapeRegExp(name.toLowerCase());
    const counted = text
      .toLowerCase()
      .match(new RegExp(`\\b(one|two|three|four|five|six|seven|eight|nine|ten|\\d+)\\b(?:\\s+[\\w-]+){0,3}?\\s+${escaped}s?\\b`));
    if (counted) {
      const raw = counted[1];
      found.push({ name, count: NUMBER_WORDS[raw] ?? parseInt(raw, 10) });
      continue;
    }
    if (new RegExp(`\\b${escaped}s?\\b`, "i").test(text)) {
      found.push({ name, count: 1 });
    }
  }
  return found;
}

function entryBaseName(name: string): string {
  return name.replace(/\s*\((?:Recharge|Recharges|\d+\/Day)[^)]*\)\s*$/i, "").trim();
}

export function parseEntry(entry: MonsterTraitEntry, attackNames: string[] = []): ParsedEntry {
  const text = normalizeDashes(entry.description);
  const attack = parseAttack(text);
  const save = parseSave(text);

  // For an attack, damage before any DC / saving-throw sentence is the hit
  // itself; whatever comes after belongs to the save rider, shown as text.
  const riderStart = text.search(/\bDC \d+|saving throw/i);
  const hitText = attack && riderStart > 0 ? text.slice(0, riderStart) : text;
  const damage = attack ? parseDamageParts(hitText) : [];
  const saveDamage = !attack && save ? parseDamageParts(text) : [];

  const baseName = entryBaseName(entry.name);
  const components = attack
    ? []
    : parseComponents(text, attackNames, baseName).filter((c) => c.count > 0);

  return {
    name: entry.name,
    baseName,
    description: entry.description,
    attack,
    damage,
    save,
    saveDamage,
    halfOnSave: !attack && save !== null && /half/i.test(text),
    limit: parseLimit(entry.name),
    components,
    check: parseCheck(text),
  };
}

export type ParsedStatBlock = {
  actions: ParsedEntry[];
  legendaryActions: ParsedEntry[];
  traits: ParsedEntry[];
};

export function parseStatBlock(block: {
  actions: MonsterTraitEntry[];
  legendaryActions: MonsterTraitEntry[];
  traits: MonsterTraitEntry[];
}): ParsedStatBlock {
  const attackNames = block.actions
    .filter((a) => parseAttack(a.description) !== null)
    .map((a) => entryBaseName(a.name));
  return {
    actions: block.actions.map((a) => parseEntry(a, attackNames)),
    legendaryActions: block.legendaryActions.map((a) => parseEntry(a, attackNames)),
    traits: block.traits.map((a) => parseEntry(a, [])),
  };
}

export function monsterModifier(scores: MonsterScores, ability: AbilityScoreKey): number {
  return abilityModifier(scores[ability]);
}

// --- Rolling -------------------------------------------------------------

export type MonsterRollOutcome = RollResult & {
  /** Natural d20 that decided the roll, when it was a d20 roll. */
  natural: number | null;
};

function signed(value: number): string {
  return `${value >= 0 ? "+" : "-"} ${Math.abs(value)}`;
}

/** A d20 + flat modifier roll, labelled for the DM's roll log. */
export function rollMonsterD20(
  label: string,
  modifier: number,
  modifierLabel: string,
  advantageMode: AdvantageMode = "normal"
): MonsterRollOutcome {
  const raw = rollD20(advantageMode, modifier);
  const result = structuredRollToResult(
    {
      label,
      modifier,
      modifierBreakdown: modifier === 0 ? "" : `${signed(modifier)} (${modifierLabel})`,
    },
    raw,
    advantageMode
  );
  return { ...result, natural: raw.used };
}

export function rollMonsterCheck(
  creatureName: string,
  scores: MonsterScores,
  ability: AbilityScoreKey,
  kind: "check" | "save",
  extraBonus = 0,
  advantageMode: AdvantageMode = "normal"
): MonsterRollOutcome {
  const mod = monsterModifier(scores, ability) + extraBonus;
  const label = `${creatureName}: ${ABILITY_LABELS[ability]} ${kind === "save" ? "Save" : "Check"}`;
  return rollMonsterD20(label, mod, ABILITY_LABELS[ability], advantageMode);
}

export function rollMonsterInitiative(
  creatureName: string,
  dexterity: number,
  advantageMode: AdvantageMode = "normal",
  extraBonus = 0
): MonsterRollOutcome {
  return rollMonsterD20(
    `${creatureName}: Initiative`,
    abilityModifier(dexterity) + extraBonus,
    ABILITY_LABELS.dexterity,
    advantageMode
  );
}

export function rollMonsterAttack(
  creatureName: string,
  entry: ParsedEntry,
  advantageMode: AdvantageMode = "normal"
): MonsterRollOutcome | null {
  if (!entry.attack) return null;
  return rollMonsterD20(
    `${creatureName}: ${entry.baseName} attack`,
    entry.attack.bonus,
    "attack bonus",
    advantageMode
  );
}

/** A critical hit rolls each damage die twice (flat bonuses are not doubled). */
export function doubleDice(expression: string): string {
  const { terms, modifier } = parseDiceExpression(expression);
  const dice = terms
    .map((term, index) => {
      const count = Math.abs(term.count) * 2;
      const sign = term.count < 0 ? "-" : index === 0 ? "" : "+";
      return `${sign}${count}d${term.sides}`;
    })
    .join("");
  return modifier === 0 ? dice : `${dice}${modifier > 0 ? "+" : "-"}${Math.abs(modifier)}`;
}

export function rollDamageParts(
  label: string,
  parts: DamagePart[],
  options: { crit?: boolean; halve?: boolean } = {}
): RollResult | null {
  if (parts.length === 0) return null;
  let total = 0;
  const rolls: RollResult["rolls"] = [];
  const pieces: string[] = [];
  for (const part of parts) {
    if (part.expression) {
      const expression = options.crit ? doubleDice(part.expression) : part.expression;
      const rolled = rollExpression(expression);
      total += rolled.total;
      rolls.push(...rolled.rolls);
      pieces.push(`${rolled.breakdown} = ${rolled.total} ${part.type}`);
    } else {
      total += part.average;
      pieces.push(`${part.average} ${part.type}`);
    }
  }
  const suffix = options.crit ? " (crit)" : "";
  const half = options.halve ? Math.floor(total / 2) : null;
  return {
    expression: `${label}${suffix}`,
    total,
    breakdown: pieces.join(" + ") + (half !== null ? ` (half on save: ${half})` : ""),
    rolls,
  };
}

/** Rolls a recharge die; true when the ability recharges. */
export function rollRecharge(min: number): { value: number; recharged: boolean } {
  const value = Math.floor(Math.random() * 6) + 1;
  return { value, recharged: value >= min };
}

export function rangeLabel(limit: AbilityLimit): string {
  if (limit.kind === "recharge") return limit.min >= 6 ? "Recharge 6" : `Recharge ${limit.min}–6`;
  if (limit.kind === "perDay") return `${limit.uses}/Day`;
  return "Rest";
}

// --- Used-ability bookkeeping -----------------------------------------------

export type UsedAbilities = Record<string, number>;

export function parseUsedAbilities(raw: string): UsedAbilities {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as UsedAbilities) : {};
  } catch {
    return {};
  }
}

export function serializeUsedAbilities(used: UsedAbilities): string {
  const pruned = Object.fromEntries(Object.entries(used).filter(([, count]) => count > 0));
  return Object.keys(pruned).length === 0 ? "" : JSON.stringify(pruned);
}
