import type { RaceDefinition } from "../types";

// Core species from the 2024 SRD 5.2 (WotC calls them "species" now, not
// "races" -- this file keeps the shared `RaceDefinition` type name/shape
// since that's what the rest of the app's models use, but the roster and
// every trait below was verified against the real 2024 document, not
// copied from the 2014 5e/races.ts file).
//
// Sourced via the open5e API (v2, document key "srd-2024", which mirrors
// WotC's official System Reference Document 5.2, CC BY 4.0).
//
// Two mechanical changes from 2014 that are easy to miss and were
// verified here rather than assumed:
//  - Species no longer grant fixed (or player-chosen) ability score
//    bonuses at all. In the 2024 rules, ability score increases come from
//    your chosen Background instead (+2/+1 or +1/+1/+1 across three
//    listed abilities). Background isn't modeled as its own concept in
//    this app yet, so every species below has an empty `abilityBonuses`
//    -- this is accurate to the source, not a placeholder.
//  - Dwarf and Gnome speed increased from 25 feet (2014) to 30 feet
//    (2024); Half-Elf and Half-Orc were dropped from the SRD roster, and
//    Orc and Goliath were added as their own full species.
//  - Human and Tiefling let the player choose Small or Medium size; the
//    `size` field here (constrained to "Small" | "Medium" by the shared
//    type) defaults to the SRD's first-listed option, Medium, with the
//    choice noted in `summary`.
// `traits` below are sourced verbatim from the real document via the open5e
// v2 API (`document__key=srd-2024`, publisher Wizards of the Coast, CC BY
// 4.0) -- curled directly, not paraphrased from memory, per this project's
// sourcing rule. No per-species `languages` here: the 2024 SRD moved
// language choice to a universal chargen step independent of species (see
// `RulesetCatalog.universalLanguageGrant` on the "5e-2024" entry in
// `rulesets/index.ts`, sourced from the same document's "Choose Languages"
// section).
export const RACES_5E_2024: RaceDefinition[] = [
  {
    id: "dragonborn",
    name: "Dragonborn",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Draconic ancestry grants a breath weapon, damage resistance matched to your dragon type, darkvision, and (from level 5) temporary flight.",
    traits: [
      {
        name: "Draconic Ancestry",
        description:
          "Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.\n\nBlack: Acid. Blue: Lightning. Brass: Fire. Bronze: Lightning. Copper: Acid. Gold: Fire. Green: Poison. Red: Fire. Silver: Cold. White: Cold.",
      },
      {
        name: "Breath Weapon",
        description:
          "When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide (choose the shape each time). Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases by 1d10 when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10).\n\nYou can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
      },
      {
        name: "Damage Resistance",
        description: "You have Resistance to the damage type determined by your Draconic Ancestry trait.",
      },
      { name: "Darkvision", description: "You have Darkvision with a range of 60 feet." },
      {
        name: "Draconic Flight",
        description:
          "When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings (no action required) or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Once you use this trait, you can't use it again until you finish a Long Rest.",
      },
    ],
    resources: [
      {
        id: "dragonborn-breath-weapon",
        name: "Breath Weapon",
        usesByLevel: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 },
      },
      {
        id: "dragonborn-draconic-flight",
        name: "Draconic Flight",
        usesByLevel: { 5: 1 },
      },
    ],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "120-foot darkvision, resistance to poison damage and advantage against the Poisoned condition, extra hit points every level, and stonecunning tremorsense.",
    traits: [
      { name: "Darkvision", description: "You have Darkvision with a range of 120 feet." },
      {
        name: "Dwarven Resilience",
        description:
          "You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.",
      },
      {
        name: "Dwarven Toughness",
        description: "Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.",
      },
      {
        name: "Stonecunning",
        description:
          "As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
      },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Darkvision, a chosen magical lineage (Drow, High, or Wood), fey ancestry against being charmed, a bonus skill from Keen Senses, and trance instead of sleep.",
    traits: [
      { name: "Darkvision", description: "You have Darkvision with a range of 60 feet." },
      {
        name: "Elven Lineage",
        description:
          "You are part of a lineage that grants you supernatural abilities. Choose a lineage from the Elven Lineages table -- Drow, High Elf, or Wood Elf -- and gain its level 1 benefit; you learn a higher-level spell from it at levels 3 and 5.",
      },
      {
        name: "Fey Ancestry",
        description: "You have Advantage on saving throws you make to avoid or end the Charmed condition.",
      },
      {
        name: "Keen Senses",
        description: "You have proficiency in the Insight, Perception, or Survival skill.",
      },
      {
        name: "Trance",
        description:
          "You don't need to sleep, and magic can't put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.",
      },
    ],
  },
  {
    id: "gnome",
    name: "Gnome",
    speed: 30,
    size: "Small",
    abilityBonuses: {},
    summary:
      "Darkvision, advantage on Intelligence, Wisdom, and Charisma saving throws, and a chosen magical lineage (Forest or Rock).",
    traits: [
      { name: "Darkvision", description: "You have Darkvision with a range of 60 feet." },
      {
        name: "Gnomish Cunning",
        description: "You have Advantage on Intelligence, Wisdom, and Charisma saving throws.",
      },
      {
        name: "Gnomish Lineage",
        description:
          "You are part of a lineage that grants you supernatural abilities. Choose Forest Gnome (Minor Illusion cantrip plus Speak with Animals) or Rock Gnome (Mending and Prestidigitation cantrips, plus a tiny clockwork device you can craft).",
      },
    ],
  },
  {
    id: "goliath",
    name: "Goliath",
    speed: 35,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Giant ancestry grants a chosen supernatural boon, Large Form lets you grow a size category from level 5, and Powerful Build eases grapples and carrying capacity.",
    traits: [
      {
        name: "Giant Ancestry",
        description:
          "You are descended from Giants. Choose one benefit -- Cloud's Jaunt, Fire's Burn, Frost's Chill, Hill's Tumble, Stone's Endurance, or Storm's Thunder -- usable a number of times equal to your Proficiency Bonus, regained on a Long Rest.",
      },
      {
        name: "Large Form",
        description:
          "Starting at character level 5, you can change your size to Large as a Bonus Action if you're in a big enough space, for 10 minutes. You have Advantage on Strength checks and your Speed increases by 10 feet during that time. Once you use this trait, you can't use it again until you finish a Long Rest.",
      },
      {
        name: "Powerful Build",
        description:
          "You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.",
      },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    speed: 30,
    size: "Small",
    abilityBonuses: {},
    summary:
      "Brave against being frightened, nimble enough to move through larger creatures' spaces, lucky rerolls on natural 1s, and naturally stealthy.",
    traits: [
      {
        name: "Brave",
        description: "You have Advantage on saving throws you make to avoid or end the Frightened condition.",
      },
      {
        name: "Halfling Nimbleness",
        description:
          "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.",
      },
      {
        name: "Luck",
        description:
          "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.",
      },
      {
        name: "Naturally Stealthy",
        description:
          "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.",
      },
    ],
  },
  {
    id: "human",
    name: "Human",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Choose Medium or Small size. Gains Heroic Inspiration after every long rest, a bonus skill proficiency, and a free Origin feat.",
    traits: [
      { name: "Resourceful", description: "You gain Heroic Inspiration whenever you finish a Long Rest." },
      { name: "Skillful", description: "You gain proficiency in one skill of your choice." },
      {
        name: "Versatile",
        description: "You gain an Origin feat of your choice. Skilled is recommended.",
      },
    ],
  },
  {
    id: "orc",
    name: "Orc",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Adrenaline Rush grants a bonus-action Dash with temporary hit points, plus 120-foot darkvision and Relentless Endurance to drop to 1 HP instead of 0.",
    traits: [
      {
        name: "Adrenaline Rush",
        description:
          "You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.",
      },
      { name: "Darkvision", description: "You have Darkvision with a range of 120 feet." },
      {
        name: "Relentless Endurance",
        description:
          "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't do so again until you finish a Long Rest.",
      },
    ],
    resources: [
      {
        id: "orc-adrenaline-rush",
        name: "Adrenaline Rush",
        usesByLevel: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 },
        shortRestRegain: "all",
      },
      {
        id: "orc-relentless-endurance",
        name: "Relentless Endurance",
        usesByLevel: { 1: 1 },
      },
    ],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    speed: 30,
    size: "Medium",
    abilityBonuses: {},
    summary:
      "Choose Medium or Small size. Darkvision, a chosen fiendish legacy (Abyssal, Chthonic, or Infernal), and the Thaumaturgy cantrip from Otherworldly Presence.",
    traits: [
      { name: "Darkvision", description: "You have Darkvision with a range of 60 feet." },
      {
        name: "Fiendish Legacy",
        description:
          "You are the recipient of a legacy that grants you supernatural abilities. Choose Abyssal, Chthonic, or Infernal; you gain its level 1 benefit, and learn a higher-level spell from it at levels 3 and 5.",
      },
      {
        name: "Otherworldly Presence",
        description:
          "You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy trait.",
      },
    ],
  },
];
