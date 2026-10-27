import type { SkillDefinition } from "../types";

// The 3.5e SRD skill list and the ability each is checked against, sourced
// from d20srd.org (d20srd.org/srd/skills/*.htm and the individual class
// pages' "Class Skills (and the key ability for each skill)" lines, which
// state the key ability directly) -- Open Game Content under the OGL v1.0a.
// See the LEGAL.md note in this directory for full sourcing detail.
//
// 3.5e has ~36 base skills (vs 5e's 18), and Knowledge is actually ~10
// separate trained-only skills (one per field of study), each requiring its
// own ranks -- so it's split out here into one SkillDefinition per SRD-listed
// field rather than one generic "Knowledge" entry, bringing the total to 45.
// Craft, Profession, and Perform are *also* open-ended ("Craft (any)," etc.
// in the SRD) but don't have a fixed named list of subtypes the way
// Knowledge does, so each stays a single entry, consistent with how most
// digital 3.5e tools model them.
//
// Speak Language is listed in the SRD with key ability "None" -- it's a
// trained-only, no-roll skill (you simply know a language or don't). Since
// `SkillDefinition.ability` is required and has no "none" option, it's set
// to "intelligence" here as a documented convention (matching the fact that
// bonus languages are tied to an Intelligence bonus elsewhere in the rules),
// not because the SRD assigns it one.
//
// Full 3.5e skill-point/rank tracking (skill points per level, 1 pt/rank in
// a class skill vs 2 pts/rank cross-class, max ranks = level + 3) isn't
// modeled -- see the classSkills note in classes.ts.
export const SKILLS_35E: SkillDefinition[] = [
  { id: "appraise", name: "Appraise", ability: "intelligence" },
  { id: "balance", name: "Balance", ability: "dexterity" },
  { id: "bluff", name: "Bluff", ability: "charisma" },
  { id: "climb", name: "Climb", ability: "strength" },
  { id: "concentration", name: "Concentration", ability: "constitution" },
  { id: "craft", name: "Craft", ability: "intelligence" },
  { id: "decipher-script", name: "Decipher Script", ability: "intelligence" },
  { id: "diplomacy", name: "Diplomacy", ability: "charisma" },
  { id: "disable-device", name: "Disable Device", ability: "intelligence" },
  { id: "disguise", name: "Disguise", ability: "charisma" },
  { id: "escape-artist", name: "Escape Artist", ability: "dexterity" },
  { id: "forgery", name: "Forgery", ability: "intelligence" },
  { id: "gather-information", name: "Gather Information", ability: "charisma" },
  { id: "handle-animal", name: "Handle Animal", ability: "charisma" },
  { id: "heal", name: "Heal", ability: "wisdom" },
  { id: "hide", name: "Hide", ability: "dexterity" },
  { id: "intimidate", name: "Intimidate", ability: "charisma" },
  { id: "jump", name: "Jump", ability: "strength" },
  { id: "knowledge-arcana", name: "Knowledge (Arcana)", ability: "intelligence" },
  { id: "knowledge-architecture-engineering", name: "Knowledge (Architecture and Engineering)", ability: "intelligence" },
  { id: "knowledge-dungeoneering", name: "Knowledge (Dungeoneering)", ability: "intelligence" },
  { id: "knowledge-geography", name: "Knowledge (Geography)", ability: "intelligence" },
  { id: "knowledge-history", name: "Knowledge (History)", ability: "intelligence" },
  { id: "knowledge-local", name: "Knowledge (Local)", ability: "intelligence" },
  { id: "knowledge-nature", name: "Knowledge (Nature)", ability: "intelligence" },
  { id: "knowledge-nobility-royalty", name: "Knowledge (Nobility and Royalty)", ability: "intelligence" },
  { id: "knowledge-religion", name: "Knowledge (Religion)", ability: "intelligence" },
  { id: "knowledge-the-planes", name: "Knowledge (The Planes)", ability: "intelligence" },
  { id: "listen", name: "Listen", ability: "wisdom" },
  { id: "move-silently", name: "Move Silently", ability: "dexterity" },
  { id: "open-lock", name: "Open Lock", ability: "dexterity" },
  { id: "perform", name: "Perform", ability: "charisma" },
  { id: "profession", name: "Profession", ability: "wisdom" },
  { id: "ride", name: "Ride", ability: "dexterity" },
  { id: "search", name: "Search", ability: "intelligence" },
  { id: "sense-motive", name: "Sense Motive", ability: "wisdom" },
  { id: "sleight-of-hand", name: "Sleight of Hand", ability: "dexterity" },
  { id: "speak-language", name: "Speak Language", ability: "intelligence" },
  { id: "spellcraft", name: "Spellcraft", ability: "intelligence" },
  { id: "spot", name: "Spot", ability: "wisdom" },
  { id: "survival", name: "Survival", ability: "wisdom" },
  { id: "swim", name: "Swim", ability: "strength" },
  { id: "tumble", name: "Tumble", ability: "dexterity" },
  { id: "use-magic-device", name: "Use Magic Device", ability: "charisma" },
  { id: "use-rope", name: "Use Rope", ability: "dexterity" },
];
