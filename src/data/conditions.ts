export type ConditionDefinition = {
  id: string;
  name: string;
  description: string;
};

// The 14 boolean 5e SRD conditions, shared across rulesets here since 3.5e's
// own list overlaps almost entirely -- this is a simple sheet checklist (see
// TODO.md), not a mechanically-enforced status-effect system, so nothing
// toggled here changes any derived stat automatically. Exhaustion is tracked
// separately (see `exhaustionLevel` on the character) since it's leveled
// rather than boolean.
export const CONDITIONS: ConditionDefinition[] = [
  {
    id: "blinded",
    name: "Blinded",
    description:
      "Can't see, and automatically fails any check that requires sight. Attack rolls against you have advantage, and your attack rolls have disadvantage.",
  },
  {
    id: "charmed",
    name: "Charmed",
    description:
      "Can't attack the charmer or target them with harmful abilities. The charmer has advantage on social checks against you.",
  },
  {
    id: "deafened",
    name: "Deafened",
    description: "Can't hear, and automatically fails any check that requires hearing.",
  },
  {
    id: "frightened",
    name: "Frightened",
    description:
      "Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. Can't willingly move closer to it.",
  },
  {
    id: "grappled",
    name: "Grappled",
    description:
      "Speed becomes 0. Ends if the grappler is incapacitated, or if an effect removes you from the grappler's reach.",
  },
  {
    id: "incapacitated",
    name: "Incapacitated",
    description: "Can't take actions or reactions.",
  },
  {
    id: "invisible",
    name: "Invisible",
    description:
      "Impossible to see without special sense. Attack rolls against you have disadvantage, and your attack rolls have advantage.",
  },
  {
    id: "paralyzed",
    name: "Paralyzed",
    description:
      "Incapacitated and can't move or speak. Automatically fails Strength and Dexterity saves. Attacks against you have advantage, and any hit is a critical if the attacker is within 5 feet.",
  },
  {
    id: "petrified",
    name: "Petrified",
    description:
      "Transformed into stone. Incapacitated, can't move or speak, and unaware of surroundings. Attacks against you have advantage, and you automatically fail Strength and Dexterity saves.",
  },
  {
    id: "poisoned",
    name: "Poisoned",
    description: "Disadvantage on attack rolls and ability checks.",
  },
  {
    id: "prone",
    name: "Prone",
    description:
      "Only movement option is to crawl, unless standing up. Disadvantage on attack rolls. Attacks against you have advantage if the attacker is within 5 feet, otherwise disadvantage.",
  },
  {
    id: "restrained",
    name: "Restrained",
    description:
      "Speed becomes 0. Disadvantage on attack rolls and Dexterity saves. Attack rolls against you have advantage.",
  },
  {
    id: "stunned",
    name: "Stunned",
    description:
      "Incapacitated, can't move, and can speak only falteringly. Automatically fails Strength and Dexterity saves. Attacks against you have advantage.",
  },
  {
    id: "unconscious",
    name: "Unconscious",
    description:
      "Incapacitated, can't move or speak, and unaware of surroundings. Drops whatever it's holding and falls prone. Automatically fails Strength and Dexterity saves, and attacks against you have advantage, with any hit a critical if the attacker is within 5 feet.",
  },
];

export const MAX_EXHAUSTION_LEVEL = 6;

export const EXHAUSTION_DESCRIPTION =
  "Stacks from 1 to 6, each level adding the previous ones' effects: 1) Disadvantage on ability checks 2) Speed halved 3) Disadvantage on attack rolls and saving throws 4) Hit point maximum halved 5) Speed reduced to 0 6) Death. A long rest removes one level, provided you have food and drink.";
