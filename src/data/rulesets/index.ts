import { RACES_5E } from "./5e/races";
import { CLASSES_5E } from "./5e/classes";
import type { RulesetCatalog } from "./types";

// Add further editions here (e.g. "3.5e") by providing their own
// races/classes data modules and registering a catalog entry below.
export const RULESETS: Record<string, RulesetCatalog> = {
  "5e": {
    id: "5e",
    label: "D&D 5th Edition",
    races: RACES_5E,
    classes: CLASSES_5E,
  },
};

export const DEFAULT_RULESET = "5e";

export function getRulesetCatalog(ruleset: string): RulesetCatalog {
  return RULESETS[ruleset] ?? RULESETS[DEFAULT_RULESET];
}

export type { ClassDefinition, RaceDefinition, RulesetCatalog } from "./types";
export {
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  CUSTOM_CLASS_FALLBACK,
} from "./types";
