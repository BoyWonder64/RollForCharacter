import type { RollResult } from "../dice/diceEngine";

export type DmRollEntry = {
  id: number;
  label: string;
  total: number;
  breakdown: string;
  /** Natural d20 face for d20 rolls; null for damage / freeform rolls. */
  natural: number | null;
  /** Set when the roll was compared to a DC (party saves, creature save DCs). */
  dc?: number;
};

/** Receives every roll the encounter screen's cards and rollers make. */
export type RollSink = (result: RollResult, natural?: number | null, dc?: number) => void;

const MAX_LOG_ENTRIES = 30;

let nextId = 1;

export function appendRoll(
  log: DmRollEntry[],
  result: RollResult,
  natural: number | null = null,
  dc?: number
): DmRollEntry[] {
  const entry: DmRollEntry = {
    id: nextId++,
    label: result.expression,
    total: result.total,
    breakdown: result.breakdown,
    natural,
    dc,
  };
  return [entry, ...log].slice(0, MAX_LOG_ENTRIES);
}
