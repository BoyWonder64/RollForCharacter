import { RACES_5E } from "./5e/races";
import { CLASSES_5E } from "./5e/classes";
import { CLASS_PROGRESSIONS_5E } from "./5e/classProgression";
import { SPELLS_5E } from "./5e/spells";
import { SKILLS_5E } from "./5e/skills";
import { WEAPONS_5E } from "./5e/weapons";
import { ARMOR_5E } from "./5e/armor";
import { RACES_5E_2024 } from "./5e-2024/races";
import { CLASSES_5E_2024 } from "./5e-2024/classes";
import { CLASS_PROGRESSIONS_5E_2024 } from "./5e-2024/classProgression";
import { SPELLS_5E_2024 } from "./5e-2024/spells";
import { SKILLS_5E_2024 } from "./5e-2024/skills";
import { RACES_35E } from "./3.5e/races";
import { CLASSES_35E } from "./3.5e/classes";
import { CLASS_PROGRESSIONS_35E } from "./3.5e/classProgression";
import { SPELLS_35E } from "./3.5e/spells";
import { SKILLS_35E } from "./3.5e/skills";
import { SRD_LANGUAGES } from "./sharedLanguages";
import type { RulesetCatalog } from "./types";

// Every ruleset the app supports is registered here; onboarding's ruleset
// picker and every lookup in this file reads from this record generically,
// so a new entry is immediately selectable with no UI changes needed.
export const RULESETS: Record<string, RulesetCatalog> = {
  "5e": {
    id: "5e",
    label: "D&D 5th Edition (2014)",
    races: RACES_5E,
    classes: CLASSES_5E,
    classProgressions: CLASS_PROGRESSIONS_5E,
    spells: SPELLS_5E,
    skills: SKILLS_5E,
    weapons: WEAPONS_5E,
    armor: ARMOR_5E,
    languages: SRD_LANGUAGES,
  },
  "5e-2024": {
    id: "5e-2024",
    label: "D&D 5th Edition (2024)",
    races: RACES_5E_2024,
    classes: CLASSES_5E_2024,
    classProgressions: CLASS_PROGRESSIONS_5E_2024,
    spells: SPELLS_5E_2024,
    skills: SKILLS_5E_2024,
    languages: SRD_LANGUAGES,
    // 2024 SRD: "Your character knows at least three languages: Common plus
    // two languages you roll or choose from the Standard Languages table" --
    // a universal chargen grant independent of species (verified against
    // the real document's "Choose Languages" section).
    universalLanguageGrant: { granted: ["common"], chooseCount: 2 },
    backgroundAbilityBonus: { totalPoints: 3, maxPerAbility: 2 },
  },
  "3.5e": {
    id: "3.5e",
    label: "D&D 3.5 Edition",
    races: RACES_35E,
    classes: CLASSES_35E,
    classProgressions: CLASS_PROGRESSIONS_35E,
    spells: SPELLS_35E,
    skills: SKILLS_35E,
  },
};

export const DEFAULT_RULESET = "5e";

export function getRulesetCatalog(ruleset: string): RulesetCatalog {
  return RULESETS[ruleset] ?? RULESETS[DEFAULT_RULESET];
}

export type {
  ArmorCategory,
  ArmorDefinition,
  ClassDefinition,
  ClassFeature,
  ClassProgression,
  ClassTrait,
  EquipmentGrant,
  EquipmentLine,
  EquipmentOption,
  LanguageDefinition,
  RaceDefinition,
  RaceLanguageGrant,
  RaceTrait,
  RulesetCatalog,
  SkillDefinition,
  SpellDefinition,
  SpellSlotRow,
  Subclass,
  WeaponCategory,
  WeaponDefinition,
  WeaponProficiencyCategory,
} from "./types";
export {
  ALIGNMENTS,
  CUSTOM_OPTION_ID,
  CUSTOM_RACE_FALLBACK,
  CUSTOM_CLASS_FALLBACK,
} from "./types";
