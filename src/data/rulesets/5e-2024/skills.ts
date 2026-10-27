import type { SkillDefinition } from "../types";

// The 2024 SRD 5.2 skill list. Verified against the official document
// (via the open5e API, document key "srd-2024") -- the 2024 revision kept
// the same 18 skills and the same ability-score pairing as the 2014 SRD;
// nothing changed here except flavor wording in the rules text itself.
export const SKILLS_5E_2024: SkillDefinition[] = [
  { id: "acrobatics", name: "Acrobatics", ability: "dexterity" },
  { id: "animal-handling", name: "Animal Handling", ability: "wisdom" },
  { id: "arcana", name: "Arcana", ability: "intelligence" },
  { id: "athletics", name: "Athletics", ability: "strength" },
  { id: "deception", name: "Deception", ability: "charisma" },
  { id: "history", name: "History", ability: "intelligence" },
  { id: "insight", name: "Insight", ability: "wisdom" },
  { id: "intimidation", name: "Intimidation", ability: "charisma" },
  { id: "investigation", name: "Investigation", ability: "intelligence" },
  { id: "medicine", name: "Medicine", ability: "wisdom" },
  { id: "nature", name: "Nature", ability: "intelligence" },
  { id: "perception", name: "Perception", ability: "wisdom" },
  { id: "performance", name: "Performance", ability: "charisma" },
  { id: "persuasion", name: "Persuasion", ability: "charisma" },
  { id: "religion", name: "Religion", ability: "intelligence" },
  { id: "sleight-of-hand", name: "Sleight of Hand", ability: "dexterity" },
  { id: "stealth", name: "Stealth", ability: "dexterity" },
  { id: "survival", name: "Survival", ability: "wisdom" },
];
