import type { AbilityScoreKey } from "../types/models";

/**
 * What a catalog feat's `FeatPickerModal` entry must resolve into a
 * concrete `FeatEffect` (see characterCalculations.ts) when the player
 * picks it -- `abilityScoreImprovement` is the ASI feat's own "+2 to one
 * ability, or +1 to two" rule (same choice as the Level Up ability-increase
 * step); `abilityScoreIncreaseChoice` is the simpler "+amount to one
 * ability you pick" shape used by Grappler and the Boon-of-... feats.
 * Feats with no clean numeric effect (Great Weapon Fighting, Two-Weapon
 * Fighting, Magic Initiate, Savage Attacker) omit this -- their full rules
 * text is still shown, same as an untouched racial trait.
 */
export type FeatEffectTemplate =
  | { kind: "abilityScoreImprovement"; max: number }
  | { kind: "abilityScoreIncreaseChoice"; amount: number; max: number; chooseFrom?: AbilityScoreKey[] }
  | { kind: "skillProficiency"; count: number }
  | { kind: "armorClassBonus"; amount: number }
  | { kind: "initiativeProficiencyBonus" }
  | { kind: "rangedAttackBonus"; amount: number }
  | { kind: "meleeAttackBonus"; amount: number };

export type FeatDefinition = {
  id: string;
  name: string;
  prerequisite: string;
  description: string;
  sourceKey: string;
  sourceName: string;
  effectTemplate?: FeatEffectTemplate;
};

// 17 feats from the 2024 SRD 5.2 (Wizards of the Coast, CC BY 4.0).
// Sourced via the open5e v2 API (/v2/feats/?document__key=srd-2024),
// curled raw (never WebFetch, to avoid paraphrasing exact rules text) --
// see docs/DND_CONTENT_SOURCES.md. WotC content only, deliberately --
// third-party feats (Level Up A5E) were pulled in an earlier pass and then
// removed at the user's request.
export const FEATS: FeatDefinition[] = [
  {
    id: "srd-2024-ability-score-improvement",
    name: "Ability Score Improvement",
    prerequisite: "Level 4+",
    description: "- Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can't increase an ability score above 20.\n\n- You can take this feat more than once.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreImprovement", max: 20 },
  },
  {
    id: "srd-2024-alert",
    name: "Alert",
    prerequisite: "",
    description: "You gain the following benefits.\n\n- When you roll Initiative, you can add your Proficiency Bonus to the roll.\n\n- Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can't make this swap if you or the ally has the Incapacitated condition.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "initiativeProficiencyBonus" },
  },
  {
    id: "srd-2024-archery",
    name: "Archery",
    prerequisite: "Fighting Style Feature",
    description: "You gain a +2 bonus to attack rolls you make with Ranged weapons.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "rangedAttackBonus", amount: 2 },
  },
  {
    id: "srd-2024-boon-of-combat-prowess",
    name: "Boon of Combat Prowess",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- When you miss with an attack roll, you can hit instead. Once you use this benefit, you can't use it again until the start of your next turn.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-dimensional-travel",
    name: "Boon of Dimensional Travel",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- Immediately after you take the Attack action or the Magic action, you can teleport up to 30 feet to an unoccupied space you can see.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-fate",
    name: "Boon of Fate",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- When you or another creature within 60 feet of you succeeds on or fails a D20 Test, you can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once you use this benefit, you can't use it again until you roll Initiative or finish a Short or Long Rest.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-irresistible-offense",
    name: "Boon of Irresistible Offense",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- The Bludgeoning, Piercing, and Slashing damage you deal always ignores Resistance.\n\n- When you roll a 20 on the d20 for an attack roll, you can deal extra damage to the target equal to the ability score increased by this feat. The extra damage's type is the same as the attack's type.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-spell-recall",
    name: "Boon of Spell Recall",
    prerequisite: "Level 19+, Spellcasting Feature",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- Whenever you cast a spell with a level 1â€“4 spell slot, roll 1d4. If the number you roll is the same as the slot's level, the slot isn't expended.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-the-night-spirit",
    name: "Boon of the Night Spirit",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- While within Dim Light or Darkness, you can give yourself the Invisible condition as a Bonus Action. The condition ends on you immediately after you take an action, a Bonus Action, or a Reaction.\n\n- While within Dim Light or Darkness, you have Resistance to all damage except Psychic and Radiant.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-boon-of-truesight",
    name: "Boon of Truesight",
    prerequisite: "Level 19+",
    description: "You gain the following benefits.\n\n- Increase one ability score of your choice by 1, to a maximum of 30.\n\n- You have Truesight with a range of 60 feet.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "abilityScoreIncreaseChoice", amount: 1, max: 30 },
  },
  {
    id: "srd-2024-defense",
    name: "Defense",
    prerequisite: "Fighting Style Feature",
    description: "While you're wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "armorClassBonus", amount: 1 },
  },
  {
    id: "srd-2024-grappler",
    name: "Grappler",
    prerequisite: "Level 4+, Strength or Dexterity 13+",
    description: "You gain the following benefits.\n\n- Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\n- When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn.\n\n- You have Advantage on attack rolls against a creature Grappled by you.\n\n- You don't have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: {
      kind: "abilityScoreIncreaseChoice",
      amount: 1,
      max: 20,
      chooseFrom: ["strength", "dexterity"],
    },
  },
  {
    id: "srd-2024-great-weapon-fighting",
    name: "Great Weapon Fighting",
    prerequisite: "Fighting Style Feature",
    description: "When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    id: "srd-2024-magic-initiate",
    name: "Magic Initiate",
    prerequisite: "",
    description: "You gain the following benefits.\n\n- You learn two cantrips of your choice from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for this feat's spells (choose when you select this feat).\n\n- Choose a level 1 spell from the same list you selected for this feat's cantrips. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have.\n\n- Whenever you gain a new level, you can replace one of the spells you chose for this feat with a different spell of the same level from the chosen spell list.\n\n- You can take this feat more than once, but you must choose a different spell list each time.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    id: "srd-2024-savage-attacker",
    name: "Savage Attacker",
    prerequisite: "",
    description: "You've trained to deal particularly damaging strikes. Once per turn when you hit a target with a weapon, you can roll the weapon's damage dice twice and use either roll against the target.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    id: "srd-2024-skilled",
    name: "Skilled",
    prerequisite: "",
    description: "- You gain proficiency in any combination of three skills or tools of your choice.\n\n- You can take this feat more than once.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
    effectTemplate: { kind: "skillProficiency", count: 3 },
  },
  {
    id: "srd-2024-two-weapon-fighting",
    name: "Two-Weapon Fighting",
    prerequisite: "Fighting Style Feature",
    description: "When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack if you aren't already adding it to the damage.",
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
];
