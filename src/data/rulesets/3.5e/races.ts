import type { RaceDefinition } from "../types";

// Core races from the 3.5e SRD (d20srd.org, "The Hypertext d20 SRD", the
// v3.5 d20 System Reference Document -- Open Game Content under the OGL
// v1.0a). See the LEGAL.md note in this directory for full sourcing detail.
//
// Ability bonuses/penalties, speed, and size are taken directly from each
// race's SRD entry. Unlike 5e, 3.5e's core races have fixed (not
// player-chosen) ability adjustments, so `chooseAbilityBonus` is unused here.
// Favored class, bonus languages, darkvision/low-light vision, and other
// racial traits (e.g. dwarf stonecunning, elf weapon proficiencies, gnome
// spell-like abilities) are real SRD content but aren't modeled by
// `RaceDefinition` -- summarized in `summary` as flavor text only, same
// simplification the 5e race file makes.
export const RACES_35E: RaceDefinition[] = [
  {
    id: "human",
    name: "Human",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary: "Versatile and ambitious: 1 extra feat at 1st level and 4 extra skill points at 1st level (1 extra per level thereafter), but no ability score adjustments.",
  },
  {
    id: "dwarf",
    name: "Dwarf",
    speed: 20,
    size: "Medium",
    abilityBonuses: { constitution: 2, charisma: -2 },
    summary: "Stonecunning and darkvision, with bonuses against poison, spells, and giants; base speed isn't reduced by armor or load.",
  },
  {
    id: "elf",
    name: "Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: { dexterity: 2, constitution: -2 },
    summary: "Low-light vision, immunity to magic sleep effects, and bonus Listen/Search/Spot checks.",
  },
  {
    id: "gnome",
    name: "Gnome",
    speed: 20,
    size: "Small",
    abilityBonuses: { constitution: 2, strength: -2 },
    summary: "Low-light vision, minor innate spell-like abilities, and bonuses against illusions.",
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary: "Low-light vision and fey ancestry, caught between two worlds; no ability score adjustments.",
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    speed: 30,
    size: "Medium",
    abilityBonuses: { strength: 2, intelligence: -2, charisma: -2 },
    summary: "Orc blood grants darkvision, at the cost of Intelligence and Charisma.",
  },
  {
    id: "halfling",
    name: "Halfling",
    speed: 20,
    size: "Small",
    abilityBonuses: { dexterity: 2, strength: -2 },
    summary: "Lucky and nimble, with bonuses to Climb, Jump, Listen, and Move Silently, and to all saving throws.",
  },
];
