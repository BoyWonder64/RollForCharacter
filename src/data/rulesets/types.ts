import type { AbilityScoreKey } from "../../types/models";

export type RaceDefinition = {
  id: string;
  name: string;
  speed: number;
  size: "Small" | "Medium";
  abilityBonuses: Partial<Record<AbilityScoreKey, number>>;
  /** e.g. Half-Elf: +1 to two abilities of the player's choice, on top of abilityBonuses */
  chooseAbilityBonus?: {
    count: number;
    amount: number;
    excluding?: AbilityScoreKey[];
  };
  summary: string;
};

export type ClassDefinition = {
  id: string;
  name: string;
  hitDie: 6 | 8 | 10 | 12;
  savingThrows: [AbilityScoreKey, AbilityScoreKey];
  spellcastingAbility?: AbilityScoreKey;
  summary: string;
};

export type RulesetCatalog = {
  id: string;
  label: string;
  races: RaceDefinition[];
  classes: ClassDefinition[];
};

export const CUSTOM_OPTION_ID = "custom";

// Used when the player types their own race/class instead of picking one
// from the catalog -- gives the HP/stat calculators sane generic defaults.
export const CUSTOM_RACE_FALLBACK: RaceDefinition = {
  id: CUSTOM_OPTION_ID,
  name: "Custom",
  speed: 30,
  size: "Medium",
  abilityBonuses: {},
  summary: "A custom race you define yourself.",
};

export const CUSTOM_CLASS_FALLBACK: ClassDefinition = {
  id: CUSTOM_OPTION_ID,
  name: "Custom",
  hitDie: 8,
  savingThrows: ["strength", "constitution"],
  summary: "A custom class you define yourself.",
};
