import type { RaceDefinition } from "../types";

// Core races from the 3.5e SRD (d20srd.org, "The Hypertext d20 SRD", the
// v3.5 d20 System Reference Document -- Open Game Content under the OGL
// v1.0a).
//
// Ability bonuses/penalties, speed, and size are taken directly from each
// race's SRD entry. Unlike 5e, 3.5e's core races have fixed (not
// player-chosen) ability adjustments, so `chooseAbilityBonus` is unused here.
// `traits` are the SRD's racial trait lines from
// https://www.d20srd.org/srd/races.htm, copied verbatim (including each
// race's Favored Class and languages, which aren't modeled as structured
// fields -- 3.5e has no language catalog yet).
export const RACES_35E: RaceDefinition[] = [
  {
    id: "human",
    name: "Human",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Versatile and ambitious: 1 extra feat at 1st level and 4 extra skill points at 1st level (1 extra per level thereafter), but no ability score adjustments.",
    traits: [
      {
        name: "Size",
        description:
          "Medium: As Medium creatures, humans have no special bonuses or penalties due to their size.",
      },
      {
        name: "Extra Feat",
        description:
          "1 extra feat at 1st level.",
      },
      {
        name: "Extra Skill Points",
        description:
          "4 extra skill points at 1st level and 1 extra skill point at each additional level.",
      },
      {
        name: "Languages",
        description:
          "Automatic Language: Common. Bonus Languages: Any (other than secret languages, such as Druidic). See the Speak Language skill.",
      },
      {
        name: "Favored Class",
        description:
          "Any. When determining whether a multiclass human takes an experience point penalty, his or her highest-level class does not count.",
      },
    ],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    speed: 20,
    size: "Medium",
    abilityBonuses: { constitution: 2, charisma: -2 },
    summary:
      "Stonecunning and darkvision, with bonuses against poison, spells, and giants; base speed isn't reduced by armor or load.",
    traits: [
      {
        name: "Size",
        description:
          "Medium: As Medium creatures, dwarves have no special bonuses or penalties due to their size.",
      },
      {
        name: "Speed",
        description:
          "Dwarf base land speed is 20 feet. However, dwarves can move at this speed even when wearing medium or heavy armor or when carrying a medium or heavy load (unlike other creatures, whose speed is reduced in such situations).",
      },
      {
        name: "Darkvision",
        description:
          "Dwarves can see in the dark up to 60 feet. Darkvision is black and white only, but it is otherwise like normal sight, and dwarves can function just fine with no light at all.",
      },
      {
        name: "Stonecunning",
        description:
          "This ability grants a dwarf a +2 racial bonus on Search checks to notice unusual stonework, such as sliding walls, stonework traps, new construction (even when built to match the old), unsafe stone surfaces, shaky stone ceilings, and the like. Something that isn’t stone but that is disguised as stone also counts as unusual stonework. A dwarf who merely comes within 10 feet of unusual stonework can make a Search check as if he were actively searching, and a dwarf can use the Search skill to find stonework traps as a rogue can. A dwarf can also intuit depth, sensing his approximate depth underground as naturally as a human can sense which way is up.",
      },
      {
        name: "Weapon Familiarity",
        description:
          "Dwarves may treat dwarven waraxes and dwarven urgroshes as martial weapons, rather than exotic weapons.",
      },
      {
        name: "Stability",
        description:
          "A dwarf gains a +4 bonus on ability checks made to resist being bull rushed or tripped when standing on the ground (but not when climbing, flying, riding, or otherwise not standing firmly on the ground).",
      },
      {
        name: "Poison Resistance",
        description:
          "+2 racial bonus on saving throws against poison.",
      },
      {
        name: "Spell Resistance",
        description:
          "+2 racial bonus on saving throws against spells and spell-like effects.",
      },
      {
        name: "Orc and Goblinoid Bonus",
        description:
          "+1 racial bonus on attack rolls against orcs and goblinoids.",
      },
      {
        name: "Giant Dodge",
        description:
          "+4 dodge bonus to Armor Class against monsters of the giant type. Any time a creature loses its Dexterity bonus (if any) to Armor Class, such as when it’s caught flat-footed, it loses its dodge bonus, too.",
      },
      {
        name: "Appraise Bonus",
        description:
          "+2 racial bonus on Appraise checks that are related to stone or metal items.",
      },
      {
        name: "Craft Bonus",
        description:
          "+2 racial bonus on Craft checks that are related to stone or metal.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Dwarven. Bonus Languages: Giant, Gnome, Goblin, Orc, Terran, and Undercommon.",
      },
      {
        name: "Favored Class",
        description:
          "Fighter. A multiclass dwarf’s fighter class does not count when determining whether he takes an experience point penalty for multiclassing.",
      },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: { dexterity: 2, constitution: -2 },
    summary:
      "Low-light vision, immunity to magic sleep effects, and bonus Listen/Search/Spot checks.",
    traits: [
      {
        name: "Size",
        description:
          "Medium: As Medium creatures, elves have no special bonuses or penalties due to their size.",
      },
      {
        name: "Sleep Immunity and Enchantment Resistance",
        description:
          "Immunity to magic sleep effects, and a +2 racial saving throw bonus against enchantment spells or effects.",
      },
      {
        name: "Low-Light Vision",
        description:
          "An elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. She retains the ability to distinguish color and detail under these conditions.",
      },
      {
        name: "Weapon Proficiency",
        description:
          "Elves receive the Martial Weapon Proficiency feats for the longsword, rapier, longbow (including composite longbow), and shortbow (including composite shortbow) as bonus feats.",
      },
      {
        name: "Keen Senses",
        description:
          "+2 racial bonus on Listen, Search, and Spot checks. An elf who merely passes within 5 feet of a secret or concealed door is entitled to a Search check to notice it as if she were actively looking for it.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Elven. Bonus Languages: Draconic, Gnoll, Gnome, Goblin, Orc, and Sylvan.",
      },
      {
        name: "Favored Class",
        description:
          "Wizard. A multiclass elf’s wizard class does not count when determining whether she takes an experience point penalty for multiclassing.",
      },
    ],
  },
  {
    id: "gnome",
    name: "Gnome",
    speed: 20,
    size: "Small",
    abilityBonuses: { constitution: 2, strength: -2 },
    summary:
      "Low-light vision, minor innate spell-like abilities, and bonuses against illusions.",
    traits: [
      {
        name: "Size",
        description:
          "Small: As a Small creature, a gnome gains a +1 size bonus to Armor Class, a +1 size bonus on attack rolls, and a +4 size bonus on Hide checks, but he uses smaller weapons than humans use, and his lifting and carrying limits are three-quarters of those of a Medium character.",
      },
      {
        name: "Low-Light Vision",
        description:
          "A gnome can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. He retains the ability to distinguish color and detail under these conditions.",
      },
      {
        name: "Weapon Familiarity",
        description:
          "Gnomes may treat gnome hooked hammers as martial weapons rather than exotic weapons.",
      },
      {
        name: "Illusion Resistance",
        description:
          "+2 racial bonus on saving throws against illusions.",
      },
      {
        name: "Illusion Mastery",
        description:
          "Add +1 to the Difficulty Class for all saving throws against illusion spells cast by gnomes. This adjustment stacks with those from similar effects.",
      },
      {
        name: "Kobold and Goblinoid Bonus",
        description:
          "+1 racial bonus on attack rolls against kobolds and goblinoids.",
      },
      {
        name: "Giant Dodge",
        description:
          "+4 dodge bonus to Armor Class against monsters of the giant type. Any time a creature loses its Dexterity bonus (if any) to Armor Class, such as when it’s caught flat-footed, it loses its dodge bonus, too.",
      },
      {
        name: "Keen Hearing",
        description:
          "+2 racial bonus on Listen checks.",
      },
      {
        name: "Alchemy Bonus",
        description:
          "+2 racial bonus on Craft (alchemy) checks.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Gnome. Bonus Languages: Draconic, Dwarven, Elven, Giant, Goblin, and Orc. In addition, a gnome can speak with a burrowing mammal (a badger, fox, rabbit, or the like). This ability is innate to gnomes. See the speak with animals spell description.",
      },
      {
        name: "Spell-Like Abilities",
        description:
          "1/day—speak with animals (burrowing mammal only, duration 1 minute). A gnome with a Charisma score of at least 10 also has the following spell-like abilities: 1/day—dancing lights, ghost sound, prestidigitation. Caster level 1st; save DC 10 + gnome’s Cha modifier + spell level.",
      },
      {
        name: "Favored Class",
        description:
          "Bard. A multiclass gnome’s bard class does not count when determining whether he takes an experience point penalty.",
      },
    ],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Low-light vision and fey ancestry, caught between two worlds; no ability score adjustments.",
    traits: [
      {
        name: "Size",
        description:
          "Medium: As Medium creatures, half-elves have no special bonuses or penalties due to their size.",
      },
      {
        name: "Sleep Immunity and Enchantment Resistance",
        description:
          "Immunity to sleep spells and similar magical effects, and a +2 racial bonus on saving throws against enchantment spells or effects.",
      },
      {
        name: "Low-Light Vision",
        description:
          "A half-elf can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. She retains the ability to distinguish color and detail under these conditions.",
      },
      {
        name: "Keen Senses",
        description:
          "+1 racial bonus on Listen, Search, and Spot checks.",
      },
      {
        name: "Social Skills",
        description:
          "+2 racial bonus on Diplomacy and Gather Information checks.",
      },
      {
        name: "Elven Blood",
        description:
          "For all effects related to race, a half-elf is considered an elf.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Elven. Bonus Languages: Any (other than secret languages, such as Druidic).",
      },
      {
        name: "Favored Class",
        description:
          "Any. When determining whether a multiclass half-elf takes an experience point penalty, her highest-level class does not count.",
      },
    ],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    speed: 30,
    size: "Medium",
    abilityBonuses: { strength: 2, intelligence: -2, charisma: -2 },
    summary:
      "Orc blood grants darkvision, at the cost of Intelligence and Charisma.",
    traits: [
      {
        name: "Minimum Intelligence",
        description:
          "A half-orc’s starting Intelligence score is always at least 3. If this adjustment would lower the character’s score to 1 or 2, his score is nevertheless 3.",
      },
      {
        name: "Size",
        description:
          "Medium: As Medium creatures, half-orcs have no special bonuses or penalties due to their size.",
      },
      {
        name: "Darkvision",
        description:
          "Half-orcs (and orcs) can see in the dark up to 60 feet. Darkvision is black and white only, but it is otherwise like normal sight, and half-orcs can function just fine with no light at all.",
      },
      {
        name: "Orc Blood",
        description:
          "For all effects related to race, a half-orc is considered an orc.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Orc. Bonus Languages: Draconic, Giant, Gnoll, Goblin, and Abyssal.",
      },
      {
        name: "Favored Class",
        description:
          "Barbarian. A multiclass half-orc’s barbarian class does not count when determining whether he takes an experience point penalty.",
      },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    speed: 20,
    size: "Small",
    abilityBonuses: { dexterity: 2, strength: -2 },
    summary:
      "Lucky and nimble, with bonuses to Climb, Jump, Listen, and Move Silently, and to all saving throws.",
    traits: [
      {
        name: "Size",
        description:
          "Small: As a Small creature, a halfling gains a +1 size bonus to Armor Class, a +1 size bonus on attack rolls, and a +4 size bonus on Hide checks, but she uses smaller weapons than humans use, and her lifting and carrying limits are three-quarters of those of a Medium character.",
      },
      {
        name: "Nimble",
        description:
          "+2 racial bonus on Climb, Jump, Listen, and Move Silently checks.",
      },
      {
        name: "Lucky Saves",
        description:
          "+1 racial bonus on all saving throws.",
      },
      {
        name: "Fearless",
        description:
          "+2 morale bonus on saving throws against fear: This bonus stacks with the halfling’s +1 bonus on saving throws in general.",
      },
      {
        name: "Thrown Weapon Bonus",
        description:
          "+1 racial bonus on attack rolls with thrown weapons and slings.",
      },
      {
        name: "Languages",
        description:
          "Automatic Languages: Common and Halfling. Bonus Languages: Dwarven, Elven, Gnome, Goblin, and Orc.",
      },
      {
        name: "Favored Class",
        description:
          "Rogue. A multiclass halfling’s rogue class does not count when determining whether she takes an experience point penalty for multiclassing.",
      },
    ],
  },
];
