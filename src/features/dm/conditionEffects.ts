import { CONDITIONS } from "../../data/conditions";
import type { AbilityScoreKey } from "../../types/models";
import type { RollResult } from "../dice/diceEngine";
import type { AdvantageMode } from "../dice/structuredRolls";

/**
 * What a creature's active SRD conditions do to the rolls *it* makes.
 * Only the clear-cut mechanical effects are applied automatically; effects
 * that depend on the situation the app can't see (e.g. a check that needs
 * sight) are surfaced as notes so the DM can rule on them.
 */

export type ConditionRollKind = "attack" | "check" | "save";

export type ConditionRollEffect = {
  /** Condition names granting advantage. */
  advantage: string[];
  /** Condition names imposing disadvantage. */
  disadvantage: string[];
  /** Condition names that make the roll fail automatically. */
  autoFail: string[];
  /** Human-readable rule lines to show alongside the roll. */
  notes: string[];
};

type Rule = {
  kinds: ConditionRollKind[];
  /** Limit to saves/checks of these abilities. Omitted = any ability. */
  abilities?: AbilityScoreKey[];
  effect: "advantage" | "disadvantage" | "autoFail" | "note";
  text: string;
};

const RULES: Record<string, Rule[]> = {
  blinded: [
    { kinds: ["attack"], effect: "disadvantage", text: "disadvantage on attack rolls" },
    { kinds: ["check"], effect: "note", text: "automatically fails checks that require sight" },
  ],
  deafened: [
    { kinds: ["check"], effect: "note", text: "automatically fails checks that require hearing" },
  ],
  frightened: [
    {
      kinds: ["attack", "check"],
      effect: "disadvantage",
      text: "disadvantage on attacks and ability checks while the source of fear is in sight",
    },
  ],
  invisible: [{ kinds: ["attack"], effect: "advantage", text: "advantage on attack rolls" }],
  poisoned: [
    { kinds: ["attack", "check"], effect: "disadvantage", text: "disadvantage on attacks and ability checks" },
  ],
  prone: [{ kinds: ["attack"], effect: "disadvantage", text: "disadvantage on attack rolls" }],
  restrained: [
    { kinds: ["attack"], effect: "disadvantage", text: "disadvantage on attack rolls" },
    { kinds: ["save"], abilities: ["dexterity"], effect: "disadvantage", text: "disadvantage on Dexterity saves" },
  ],
  paralyzed: [
    {
      kinds: ["save"],
      abilities: ["strength", "dexterity"],
      effect: "autoFail",
      text: "automatically fails Strength and Dexterity saves",
    },
    { kinds: ["attack"], effect: "note", text: "incapacitated: can't take actions" },
  ],
  petrified: [
    {
      kinds: ["save"],
      abilities: ["strength", "dexterity"],
      effect: "autoFail",
      text: "automatically fails Strength and Dexterity saves",
    },
    { kinds: ["attack"], effect: "note", text: "incapacitated: can't take actions" },
  ],
  stunned: [
    {
      kinds: ["save"],
      abilities: ["strength", "dexterity"],
      effect: "autoFail",
      text: "automatically fails Strength and Dexterity saves",
    },
    { kinds: ["attack"], effect: "note", text: "incapacitated: can't take actions" },
  ],
  unconscious: [
    {
      kinds: ["save"],
      abilities: ["strength", "dexterity"],
      effect: "autoFail",
      text: "automatically fails Strength and Dexterity saves",
    },
    { kinds: ["attack"], effect: "note", text: "incapacitated: can't take actions" },
  ],
  incapacitated: [{ kinds: ["attack"], effect: "note", text: "can't take actions" }],
  grappled: [],
  charmed: [{ kinds: ["attack"], effect: "note", text: "can't attack the charmer" }],
};

/** Effects on attack rolls made *against* a creature with these conditions. */
const AGAINST_RULES: Record<string, string> = {
  blinded: "Attacks against it have advantage",
  invisible: "Attacks against it have disadvantage",
  paralyzed: "Attacks against it have advantage; hits within 5 ft are crits",
  petrified: "Attacks against it have advantage",
  prone: "Attacks against it have advantage within 5 ft, disadvantage otherwise",
  restrained: "Attacks against it have advantage",
  stunned: "Attacks against it have advantage",
  unconscious: "Attacks against it have advantage; hits within 5 ft are crits",
};

function conditionName(id: string): string {
  return CONDITIONS.find((c) => c.id === id)?.name ?? id;
}

export function conditionRollEffect(
  conditionIds: string[],
  kind: ConditionRollKind,
  ability?: AbilityScoreKey
): ConditionRollEffect {
  const result: ConditionRollEffect = { advantage: [], disadvantage: [], autoFail: [], notes: [] };
  for (const id of conditionIds) {
    for (const rule of RULES[id] ?? []) {
      if (!rule.kinds.includes(kind)) continue;
      if (rule.abilities && (!ability || !rule.abilities.includes(ability))) continue;
      const name = conditionName(id);
      if (rule.effect === "advantage") result.advantage.push(name);
      else if (rule.effect === "disadvantage") result.disadvantage.push(name);
      else if (rule.effect === "autoFail") result.autoFail.push(name);
      result.notes.push(`${name}: ${rule.text}`);
    }
  }
  return result;
}

/**
 * Combines the DM's manual Adv/Disadv toggle with condition effects. Per the
 * SRD, any source of advantage plus any source of disadvantage cancel out to
 * a normal roll, no matter how many of each there are.
 */
export function combineAdvantage(manual: AdvantageMode, effect: ConditionRollEffect): AdvantageMode {
  const hasAdvantage = manual === "advantage" || effect.advantage.length > 0;
  const hasDisadvantage = manual === "disadvantage" || effect.disadvantage.length > 0;
  if (hasAdvantage && hasDisadvantage) return "normal";
  if (hasAdvantage) return "advantage";
  if (hasDisadvantage) return "disadvantage";
  return "normal";
}

/** Appends the condition rules (and any automatic failure) to a logged roll. */
export function annotateWithConditions<T extends RollResult>(result: T, effect: ConditionRollEffect): T {
  if (effect.notes.length === 0) return result;
  const autoFail = effect.autoFail.length > 0 ? `AUTOMATIC FAILURE (${effect.autoFail.join(", ")}) · ` : "";
  return {
    ...result,
    breakdown: `${autoFail}${result.breakdown} · ${effect.notes.join(" · ")}`,
  };
}

/** One line per active condition that changes attacks made against the creature. */
export function attacksAgainstNotes(conditionIds: string[]): string[] {
  return conditionIds
    .filter((id) => AGAINST_RULES[id])
    .map((id) => `${conditionName(id)}: ${AGAINST_RULES[id]}`);
}
