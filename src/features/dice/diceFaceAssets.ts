import { Asset } from "expo-asset";

// Individual polyhedral die-face sprites, sliced from the user-provided
// `pixel assets/Dice/Dices_colorful.png` sheet (free for commercial use,
// no attribution required -- see FEATURES.md). Each face shows its own rolled
// number baked into the art, so these double as both the quick-dice/result
// icon and the frames for the roll-cycling animation.
//
// d100 only has one icon ("00"): the sheet provides a tens-die face set
// (10/20/.../90/00) meant to pair with a second ones-die for a real
// percentile roll, but the dice engine treats d100 as a single 1-100 value,
// so a full two-die composite isn't modeled here -- a documented
// simplification, not a missing asset.
const D4: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d4/1.png"),
  "2": require("../../../assets/icons/dice/d4/2.png"),
  "3": require("../../../assets/icons/dice/d4/3.png"),
  "4": require("../../../assets/icons/dice/d4/4.png"),
};

const D6: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d6/1.png"),
  "2": require("../../../assets/icons/dice/d6/2.png"),
  "3": require("../../../assets/icons/dice/d6/3.png"),
  "4": require("../../../assets/icons/dice/d6/4.png"),
  "5": require("../../../assets/icons/dice/d6/5.png"),
  "6": require("../../../assets/icons/dice/d6/6.png"),
};

const D8: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d8/1.png"),
  "2": require("../../../assets/icons/dice/d8/2.png"),
  "3": require("../../../assets/icons/dice/d8/3.png"),
  "4": require("../../../assets/icons/dice/d8/4.png"),
  "5": require("../../../assets/icons/dice/d8/5.png"),
  "6": require("../../../assets/icons/dice/d8/6.png"),
  "7": require("../../../assets/icons/dice/d8/7.png"),
  "8": require("../../../assets/icons/dice/d8/8.png"),
};

const D10: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d10/1.png"),
  "2": require("../../../assets/icons/dice/d10/2.png"),
  "3": require("../../../assets/icons/dice/d10/3.png"),
  "4": require("../../../assets/icons/dice/d10/4.png"),
  "5": require("../../../assets/icons/dice/d10/5.png"),
  "6": require("../../../assets/icons/dice/d10/6.png"),
  "7": require("../../../assets/icons/dice/d10/7.png"),
  "8": require("../../../assets/icons/dice/d10/8.png"),
  "9": require("../../../assets/icons/dice/d10/9.png"),
  "10": require("../../../assets/icons/dice/d10/10.png"),
};

const D12: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d12/1.png"),
  "2": require("../../../assets/icons/dice/d12/2.png"),
  "3": require("../../../assets/icons/dice/d12/3.png"),
  "4": require("../../../assets/icons/dice/d12/4.png"),
  "5": require("../../../assets/icons/dice/d12/5.png"),
  "6": require("../../../assets/icons/dice/d12/6.png"),
  "7": require("../../../assets/icons/dice/d12/7.png"),
  "8": require("../../../assets/icons/dice/d12/8.png"),
  "9": require("../../../assets/icons/dice/d12/9.png"),
  "10": require("../../../assets/icons/dice/d12/10.png"),
  "11": require("../../../assets/icons/dice/d12/11.png"),
  "12": require("../../../assets/icons/dice/d12/12.png"),
};

const D20: Record<string, number> = {
  "1": require("../../../assets/icons/dice/d20/1.png"),
  "2": require("../../../assets/icons/dice/d20/2.png"),
  "3": require("../../../assets/icons/dice/d20/3.png"),
  "4": require("../../../assets/icons/dice/d20/4.png"),
  "5": require("../../../assets/icons/dice/d20/5.png"),
  "6": require("../../../assets/icons/dice/d20/6.png"),
  "7": require("../../../assets/icons/dice/d20/7.png"),
  "8": require("../../../assets/icons/dice/d20/8.png"),
  "9": require("../../../assets/icons/dice/d20/9.png"),
  "10": require("../../../assets/icons/dice/d20/10.png"),
  "11": require("../../../assets/icons/dice/d20/11.png"),
  "12": require("../../../assets/icons/dice/d20/12.png"),
  "13": require("../../../assets/icons/dice/d20/13.png"),
  "14": require("../../../assets/icons/dice/d20/14.png"),
  "15": require("../../../assets/icons/dice/d20/15.png"),
  "16": require("../../../assets/icons/dice/d20/16.png"),
  "17": require("../../../assets/icons/dice/d20/17.png"),
  "18": require("../../../assets/icons/dice/d20/18.png"),
  "19": require("../../../assets/icons/dice/d20/19.png"),
  "20": require("../../../assets/icons/dice/d20/20.png"),
};

const D100: Record<string, number> = {
  "00": require("../../../assets/icons/dice/d100/00.png"),
};

// Preload + decode every face up front (same fix as HealthBar.tsx's tier
// frames): without this, the rapid cycling during the roll animation shows
// a visible delay/blank flash per frame while each not-yet-cached local
// image decodes for the first time.
Asset.loadAsync([
  ...Object.values(D4),
  ...Object.values(D6),
  ...Object.values(D8),
  ...Object.values(D10),
  ...Object.values(D12),
  ...Object.values(D20),
  ...Object.values(D100),
]).catch(() => {});

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

export const DIE_TYPES: DieType[] = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

const FACES_BY_DIE: Record<DieType, Record<string, number>> = {
  d4: D4,
  d6: D6,
  d8: D8,
  d10: D10,
  d12: D12,
  d20: D20,
  d100: D100,
};

export function sidesForDieType(die: DieType): number {
  return die === "d100" ? 100 : parseInt(die.slice(1), 10);
}

/** The exact face icon for a rolled value, or undefined if out of range / unknown die. */
export function getDieFaceIcon(die: DieType, faceValue: number): number | undefined {
  if (die === "d100") return FACES_BY_DIE.d100["00"];
  return FACES_BY_DIE[die]?.[String(faceValue)];
}

/**
 * The d10 sheet draws its max face as a bare "0" (the real physical-die
 * convention), which reads ambiguously in this app. Rather than hand-edit
 * a ~6px-tall baked-in digit on a 34x38px source sprite (too small to
 * touch up cleanly), the screen overlays a matching "1" in front of it at
 * render time -- this flags exactly when that overlay is needed.
 */
export function needsTensPrefix(die: DieType, faceValue: number): boolean {
  return die === "d10" && faceValue === 10;
}
