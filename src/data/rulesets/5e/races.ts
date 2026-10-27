import type { RaceDefinition } from "../types";

// Core races from the 5e SRD 5.1 (base races only -- no subraces yet).
// `traits` and `languages` are sourced verbatim from the real document via
// the open5e v2 API (`document__key=srd-2014`, publisher Wizards of the
// Coast, CC BY 4.0 / OGL 1.0a) -- curled directly, not paraphrased from
// memory, per this project's sourcing rule.
export const RACES_5E: RaceDefinition[] = [
  {
    id: "dragonborn",
    name: "Dragonborn",
    speed: 30,
    size: "Medium",
    abilityBonuses: { strength: 2, charisma: 1 },
    summary: "Draconic ancestry grants a breath weapon and damage resistance.",
    languages: { granted: ["common", "draconic"] },
    traits: [
      {
        name: "Draconic Ancestry",
        description:
          "You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table.\n\nBlack: Acid, 5 by 30 ft. line (Dex. save)\nBlue: Lightning, 5 by 30 ft. line (Dex. save)\nBrass: Fire, 5 by 30 ft. line (Dex. save)\nBronze: Lightning, 5 by 30 ft. line (Dex. save)\nCopper: Acid, 5 by 30 ft. line (Dex. save)\nGold: Fire, 15 ft. cone (Dex. save)\nGreen: Poison, 15 ft. cone (Con. save)\nRed: Fire, 15 ft. cone (Dex. save)\nSilver: Cold, 15 ft. cone (Con. save)\nWhite: Cold, 15 ft. cone (Con. save)",
      },
      {
        name: "Breath Weapon",
        description:
          "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.\n\nWhen you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.",
      },
      {
        name: "Damage Resistance",
        description: "You have resistance to the damage type associated with your draconic ancestry.",
      },
    ],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    speed: 25,
    size: "Medium",
    abilityBonuses: { constitution: 2 },
    summary: "Sturdy and resilient, with resistance to poison and stonecunning.",
    languages: { granted: ["common", "dwarvish"] },
    traits: [
      {
        name: "Darkvision",
        description:
          "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      {
        name: "Dwarven Resilience",
        description:
          "You have advantage on saving throws against poison, and you have resistance against poison damage.",
      },
      {
        name: "Dwarven Combat Training",
        description: "You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.",
      },
      {
        name: "Tool Proficiency",
        description:
          "You gain proficiency with the artisan's tools of your choice: smith's tools, brewer's supplies, or mason's tools.",
      },
      {
        name: "Stonecunning",
        description:
          "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.",
      },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: { dexterity: 2 },
    summary: "Keen senses, fey ancestry, and trance instead of sleep.",
    languages: { granted: ["common", "elvish"] },
    traits: [
      {
        name: "Darkvision",
        description:
          "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      { name: "Keen Senses", description: "You have proficiency in the Perception skill." },
      {
        name: "Fey Ancestry",
        description:
          "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      },
      {
        name: "Trance",
        description:
          "Elves don't need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.",
      },
    ],
  },
  {
    id: "gnome",
    name: "Gnome",
    speed: 25,
    size: "Small",
    abilityBonuses: { intelligence: 2 },
    summary: "Advantage on Intelligence, Wisdom, and Charisma saves against magic.",
    languages: { granted: ["common", "gnomish"] },
    traits: [
      {
        name: "Darkvision",
        description:
          "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      {
        name: "Gnome Cunning",
        description: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
      },
    ],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: { charisma: 2 },
    chooseAbilityBonus: { count: 2, amount: 1, excluding: ["charisma"] },
    summary: "Fey ancestry and skill versatility, caught between two worlds.",
    languages: { granted: ["common", "elvish"], choice: { count: 1 } },
    traits: [
      {
        name: "Darkvision",
        description:
          "Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      {
        name: "Fey Ancestry",
        description:
          "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
      },
      { name: "Skill Versatility", description: "You gain proficiency in two skills of your choice." },
    ],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    speed: 30,
    size: "Medium",
    abilityBonuses: { strength: 2, constitution: 1 },
    summary: "Relentless endurance lets you shrug off a killing blow once per rest.",
    languages: { granted: ["common", "orc"] },
    traits: [
      {
        name: "Darkvision",
        description:
          "Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      { name: "Menacing", description: "You gain proficiency in the Intimidation skill." },
      {
        name: "Relentless Endurance",
        description:
          "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
      },
      {
        name: "Savage Attacks",
        description:
          "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
      },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    speed: 25,
    size: "Small",
    abilityBonuses: { dexterity: 2 },
    summary: "Lucky and brave, small enough to slip through larger creatures' spaces.",
    languages: { granted: ["common", "halfling"] },
    traits: [
      {
        name: "Lucky",
        description:
          "When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
      },
      { name: "Brave", description: "You have advantage on saving throws against being frightened." },
      {
        name: "Halfling Nimbleness",
        description: "You can move through the space of any creature that is of a size larger than yours.",
      },
    ],
  },
  {
    id: "human",
    name: "Human",
    speed: 30,
    size: "Medium",
    abilityBonuses: {
      strength: 1,
      dexterity: 1,
      constitution: 1,
      intelligence: 1,
      wisdom: 1,
      charisma: 1,
    },
    summary: "Versatile and ambitious, with a well-rounded set of abilities.",
    languages: { granted: ["common"], choice: { count: 1 } },
  },
  {
    id: "tiefling",
    name: "Tiefling",
    speed: 30,
    size: "Medium",
    abilityBonuses: { intelligence: 1, charisma: 2 },
    summary: "Infernal heritage grants fire resistance and innate magic.",
    languages: { granted: ["common", "infernal"] },
    traits: [
      {
        name: "Darkvision",
        description:
          "Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
      },
      { name: "Hellish Resistance", description: "You have resistance to fire damage." },
      {
        name: "Infernal Legacy",
        description:
          "You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest. When you reach 5th level, you can cast the darkness spell once with this trait and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.",
      },
    ],
  },
];
