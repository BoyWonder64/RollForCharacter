import type { ClassProgression } from "../types";

/** A resource pool that grows by exactly 1 per level (Ki points, Sorcery points) or `multiplier` per level (Lay on Hands, at x5) -- a breakpoint table from `fromLevel` through `toLevel` inclusive. */
function pointsEqualToLevel(fromLevel: number, toLevel: number, multiplier = 1): Record<number, number> {
  const byLevel: Record<number, number> = {};
  for (let level = fromLevel; level <= toLevel; level++) byLevel[level] = level * multiplier;
  return byLevel;
}

// Per-level class & subclass progression for 5e (2014 SRD 5.1, OGL 1.0a).
// Sourced verbatim from the open5e API (document__slug=wotc-srd), not
// transcribed from memory -- see TODO.md for the sourcing method. Each
// class's `subclasses` array holds exactly the one subclass the SRD itself
// publishes in full (e.g. Path of the Berserker, School of Evocation);
// every other published subclass is PHB-only content and isn't included.
export const CLASS_PROGRESSIONS_5E: ClassProgression[] = [
  {
    classId: "barbarian",
    subclassLevel: 3,
    subclassLabel: "Primal Path",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "barbarian-rage",
        name: "Rage",
        // 20th-level Barbarians rage an unlimited number of times -- approximated as a very large number since usesByLevel has no "unlimited" concept.
        usesByLevel: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6, 20: 999 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Rage",
        description: `In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. 
 
While raging, you gain the following benefits if you aren't wearing heavy armor: 
 
* You have advantage on Strength checks and Strength saving throws. 
* When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table. 
* You have resistance to bludgeoning, piercing, and slashing damage. 
 
If you are able to cast spells, you can't cast them or concentrate on them while raging. 
 
Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action. 
 
Once you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.`,
      },
      {
        level: 1,
        name: "Unarmored Defense",
        description: `While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.`,
      },
      {
        level: 2,
        name: "Danger Sense",
        description: `At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. 
 
You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.`,
      },
      {
        level: 2,
        name: "Reckless Attack",
        description: `Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Extra Attack",
        description: `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
      },
      {
        level: 5,
        name: "Fast Movement",
        description: `Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.`,
      },
      {
        level: 7,
        name: "Feral Instinct",
        description: `By 7th level, your instincts are so honed that you have advantage on initiative rolls. 
 
Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.`,
      },
      {
        level: 9,
        name: "Brutal Critical",
        description: `Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack. 
 
This increases to two additional dice at 13th level and three additional dice at 17th level.`,
      },
      {
        level: 11,
        name: "Relentless Rage",
        description: `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead. 
 
Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`,
      },
      {
        level: 15,
        name: "Persistent Rage",
        description: `Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.`,
      },
      {
        level: 18,
        name: "Indomitable Might",
        description: `Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.`,
      },
      {
        level: 20,
        name: "Primal Champion",
        description: `At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.`,
      },
    ],
    subclasses: [
      {
        id: "path-of-the-berserker",
        name: "Path of the Berserker",
        summary: `For some barbarians, rage is a means to an end- that end being violence. The Path of the Berserker is a path of untrammeled fury, slick with blood. As you enter the berserker's rage, you thrill in the chaos of battle, heedless of your own health or well-being.`,
        srdLicensed: true,
        features: [
          {
            level: 3,
            name: "Frenzy",
            description: `Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion (as described in appendix A).`,
          },
          {
            level: 6,
            name: "Mindless Rage",
            description: `Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.`,
          },
          {
            level: 10,
            name: "Intimidating Presence",
            description: `Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you. 
 
If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.`,
          },
          {
            level: 14,
            name: "Retaliation",
            description: `Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.`,
          },
        ],
      },
    ],
  },
  {
    classId: "bard",
    subclassLevel: 3,
    subclassLabel: "Bard College",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "bard-bardic-inspiration",
        name: "Bardic Inspiration",
        usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 1, minimum: 1 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Bardic Inspiration",
        description: `You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6. 
 
Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time. 
 
You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest. 
 
Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.`,
      },
      {
        level: 1,
        name: "Spellcasting",
        description: `You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. 
 
Your spells are part of your vast repertoire, magic that you can tune to different situations. 
 
#### Cantrips 
 
You know two cantrips of your choice from the bard spell list. You learn additional bard cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Bard table. 
 
#### Spell Slots 
 
The Bard table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
For example, if you know the 1st-level spell *cure wounds* and have a 1st-level and a 2nd-level spell slot available, you can cast *cure wounds* using either slot. 
 
#### Spells Known of 1st Level and Higher 
 
You know four 1st-level spells of your choice from the bard spell list. 
 
The Spells Known column of the Bard table shows when you learn more bard spells of your choice. Each of these spells must be of a level for which you have spell slots, as shown on the table. For instance, when you reach 3rd level in this class, you can learn one new spell of 1st or 2nd level. 
 
Additionally, when you gain a level in this class, you can choose one of the bard spells you know and replace it with another spell from the bard spell list, which also must be of a level for which you have spell slots. 
 
#### Spellcasting Ability 
 
Charisma is your spellcasting ability for your bard spells. Your magic comes from the heart and soul you pour into the performance of your music or oration. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a bard spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Charisma modifier 
 
**Spell attack modifier** = your proficiency bonus + your Charisma modifier 
 
#### Ritual Casting 
 
You can cast any bard spell you know as a ritual if that spell has the ritual tag. 
 
#### Spellcasting Focus 
 
You can use a musical instrument (see chapter 5, “Equipment”) as a spellcasting focus for your bard spells.`,
      },
      {
        level: 2,
        name: "Jack of All Trades",
        description: `Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.`,
      },
      {
        level: 2,
        name: "Song of Rest",
        description: `Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest by spending one or more Hit Dice, each of those creatures regains an extra 1d6 hit points. 
 
The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.`,
      },
      {
        level: 3,
        name: "Expertise",
        description: `At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies. 
 
At 10th level, you can choose another two skill proficiencies to gain this benefit.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Font of Inspiration",
        description: `Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.`,
      },
      {
        level: 6,
        name: "Countercharm",
        description: `At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).`,
      },
      {
        level: 10,
        name: "Magical Secrets",
        description: `By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. 
 
The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table. 
 
You learn two additional spells from any class at 14th level and again at 18th level.`,
      },
      {
        level: 20,
        name: "Superior Inspiration",
        description: `At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.`,
      },
    ],
    subclasses: [
      {
        id: "college-of-lore",
        name: "College of Lore",
        summary: `Bards of the College of Lore know something about most things, collecting bits of knowledge from sources as diverse as scholarly tomes and peasant tales. Whether singing folk ballads in taverns or elaborate compositions in royal courts, these bards use their gifts to hold audiences spellbound. When the applause dies down, the audience members might find themselves questioning everything they held `,
        srdLicensed: true,
        features: [
          {
            level: 3,
            name: "Bonus Proficiencies",
            description: `When you join the College of Lore at 3rd level, you gain proficiency with three skills of your choice.`,
          },
          {
            level: 3,
            name: "Cutting Words",
            description: `Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll. You can choose to use this feature after the creature makes its roll, but before the GM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage. The creature is immune if it can't hear you or if it's immune to being charmed.`,
          },
          {
            level: 6,
            name: "Additional Magical Secrets",
            description: `At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don't count against the number of bard spells you know.`,
          },
          {
            level: 14,
            name: "Peerless Skill",
            description: `Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the GM tells you whether you succeed or fail.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2, spellsKnown: 4 },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2, spellsKnown: 5 },
      { level: 3, slots: [4, 2, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2, spellsKnown: 6 },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 7 },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 8 },
      { level: 6, slots: [4, 3, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 9 },
      { level: 7, slots: [4, 3, 3, 1, 0, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 10 },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 11 },
      { level: 9, slots: [4, 3, 3, 3, 1, 0, 0, 0, 0], cantripsKnown: 3, spellsKnown: 12 },
      { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 14 },
      { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 4, spellsKnown: 15 },
      { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 4, spellsKnown: 15 },
      { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 4, spellsKnown: 16 },
      { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 4, spellsKnown: 18 },
      { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 4, spellsKnown: 19 },
      { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 4, spellsKnown: 19 },
      { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantripsKnown: 4, spellsKnown: 20 },
      { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantripsKnown: 4, spellsKnown: 22 },
      { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantripsKnown: 4, spellsKnown: 22 },
      { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantripsKnown: 4, spellsKnown: 22 },
    ],
  },
  {
    classId: "cleric",
    subclassLevel: 1,
    subclassLabel: "Divine Domain",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "cleric-channel-divinity",
        name: "Channel Divinity",
        usesByLevel: { 2: 1, 6: 2, 18: 3 },
        shortRestRegain: "all",
      },
    ],
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: `As a conduit for divine power, you can cast cleric spells. 
 
#### Cantrips 
 
At 1st level, you know three cantrips of your choice from the cleric spell list. You learn additional cleric cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Cleric table. 
 
#### Preparing and Casting Spells 
 
The Cleric table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
You prepare the list of cleric spells that are available for you to cast, choosing from the cleric spell list. When you do so, choose a number of cleric spells equal to your Wisdom modifier + your cleric level (minimum of one spell). The spells must be of a level for which you have spell slots. 
 
For example, if you are a 3rd-level cleric, you have four 
1st-level and two 2nd-level spell slots. With a Wisdom of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell *cure wounds*, you can cast it using a 1st-level or 2nd-level slot. Casting the spell doesn't remove it from your list of prepared spells. 
 
You can change your list of prepared spells when you finish a long rest. Preparing a new list of cleric spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list. 
 
#### Spellcasting Ability 
 
Wisdom is your spellcasting ability for your cleric spells. The power of your spells comes from your devotion to your deity. You use your Wisdom whenever a cleric spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a cleric spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Wisdom modifier 
 
**Spell attack modifier** = your proficiency bonus + your Wisdom modifier 
 
#### Ritual Casting 
 
You can cast a cleric spell as a ritual if that spell has the ritual tag and you have the spell prepared. 
 
#### Spellcasting Focus 
 
You can use a holy symbol (see chapter 5, “Equipment”) as a spellcasting focus for your cleric spells.`,
      },
      {
        level: 2,
        name: "Channel Divinity",
        description: `At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with two such effects: Turn Undead and an effect determined by your domain. Some domains grant you additional effects as you advance in levels, as noted in the domain description. 
 
When you use your Channel Divinity, you choose which effect to create. You must then finish a short or long rest to use your Channel Divinity again. 
 
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your cleric spell save DC. 
 
Beginning at 6th level, you can use your Channel 
 
Divinity twice between rests, and beginning at 18th level, you can use it three times between rests. When you finish a short or long rest, you regain your expended uses. 
 
#### Channel Divinity: Turn Undead 
 
As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. 
 
A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Destroy Undead",
        description: `Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold, as shown in the Destroy Undead table. 
 
**Destroy Undead (table)** 
 
| Cleric Level | Destroys Undead of CR... | 
|--------------|--------------------------| 
| 5th          | 1/2 or lower             | 
| 8th          | 1 or lower               | 
| 11th         | 2 or lower               | 
| 14th         | 3 or lower               | 
| 17th         | 4 or lower               |`,
      },
      {
        level: 10,
        name: "Divine Intervention",
        description: `Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great. 
 
Imploring your deity's aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The GM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate. 
 
If your deity intervenes, you can't use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest. 
 
At 20th level, your call for intervention succeeds automatically, no roll required.`,
      },
    ],
    subclasses: [
      {
        id: "life-domain",
        name: "Life Domain",
        summary: `The Life domain focuses on the vibrant positive energy-one of the fundamental forces of the universe-that sustains all life. The gods of life promote vitality and health through healing the sick and wounded, caring for those in need, and driving away the forces of death and undeath. Almost any non-evil deity can claim influence over this domain, particularly agricultural deities (such as Chauntea,`,
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Bonus Proficiency",
            description: `When you choose this domain at 1st level, you gain proficiency with heavy armor.`,
          },
          {
            level: 1,
            name: "Disciple of Life",
            description: `Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.`,
          },
          {
            level: 2,
            name: "Channel Divinity: Preserve Life",
            description: `Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. 
 
As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.`,
          },
          {
            level: 6,
            name: "Blessed Healer",
            description: `Beginning at 6th level, the healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level.`,
          },
          {
            level: 8,
            name: "Divine Strike",
            description: `At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.`,
          },
          {
            level: 17,
            name: "Supreme Healing",
            description: `Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 3, slots: [4, 2, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 6, slots: [4, 3, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 7, slots: [4, 3, 3, 1, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 9, slots: [4, 3, 3, 3, 1, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0], cantripsKnown: 5 },
      { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 5 },
      { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 5 },
      { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 5 },
      { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 5 },
      { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 5 },
      { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 5 },
      { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantripsKnown: 5 },
      { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantripsKnown: 5 },
      { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantripsKnown: 5 },
      { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantripsKnown: 5 },
    ],
  },
  {
    classId: "druid",
    subclassLevel: 2,
    subclassLabel: "Druid Circle",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "druid-wild-shape",
        name: "Wild Shape",
        usesByLevel: { 2: 2 },
        shortRestRegain: "all",
      },
    ],
    features: [
      {
        level: 1,
        name: "Druidic",
        description: `You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic.`,
      },
      {
        level: 1,
        name: "Spellcasting",
        description: `Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will. 
 
#### Cantrips 
 
At 1st level, you know two cantrips of your choice from the druid spell list. You learn additional druid cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Druid table. 
 
#### Preparing and Casting Spells 
 
The Druid table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these druid spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
You prepare the list of druid spells that are available for you to cast, choosing from the druid spell list. When you do so, choose a number of druid spells equal to your Wisdom modifier + your druid level (minimum of one spell). The spells must be of a level for which you have spell slots. 
 
For example, if you are a 3rd-level druid, you have four 1st-level and two 2nd-level spell slots. With a Wisdom of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell *cure wounds,* you can cast it using a 1st-level or 2nd-level slot. Casting the spell doesn't remove it from your list of prepared spells. 
 
You can also change your list of prepared spells when you finish a long rest. Preparing a new list of druid spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list.`,
      },
      {
        level: 2,
        name: "Wild Shape",
        description: `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest. 
 
Your druid level determines the beasts you can transform into, as shown in the Beast Shapes table. At 2nd level, for example, you can transform into any beast that has a challenge rating of 1/4 or lower that doesn't have a flying or swimming speed. 
 
**Beast Shapes (table)** 
 
| Level | Max. CR | Limitations                 | Example     | 
|-------|---------|-----------------------------|-------------| 
| 2nd   | 1/4     | No flying or swimming speed | Wolf        | 
| 4th   | 1/2     | No flying speed             | Crocodile   | 
| 8th   | 1       | -                           | Giant eagle | 
 
You can stay in a beast shape for a number of hours equal to half your druid level (rounded down). You then revert to your normal form unless you expend another use of this feature. You can revert to your normal form earlier by using a bonus action on your turn. You automatically revert if you fall unconscious, drop to 0 hit points, or die. 
 
While you are transformed, the following rules apply: 
 
* Your game statistics are replaced by the statistics of the beast, but you retain your alignment, personality, and Intelligence, Wisdom, and Charisma scores. You also retain all of your skill and saving throw proficiencies, in addition to gaining those of the creature. If the creature has the same proficiency as you and the bonus in its stat block is higher than yours, use the creature's bonus instead of yours. If the creature has any legendary or lair actions, you can't use them. 
* When you transform, you assume the beast's hit points and Hit Dice. When you revert to your normal form, you return to the number of hit points you had before you transformed. However, if you revert as a result of dropping to 0 hit points, any excess damage carries over to your normal form. For example, if you take 10 damage in animal form and have only 1 hit point left, you revert and take 9 damage. As long as the excess damage doesn't reduce your normal form to 0 hit points, you aren't knocked unconscious. 
* You can't cast spells, and your ability to speak or take any action that requires hands is limited to the capabilities of your beast form. Transforming doesn't break your concentration on a spell you've already cast, however, or prevent you from taking actions that are part of a spell, such as *call lightning*, that you've already cast. 
* You retain the benefit of any features from your class, race, or other source and can use them if the new form is physically capable of doing so. However, you can't use any of your special senses, such as darkvision, unless your new form also has that sense. 
* You choose whether your equipment falls to the ground in your space, merges into your new form, or is worn by it. Worn equipment functions as normal, but the GM decides whether it is practical for the new form to wear a piece of equipment, based on the creature's shape and size. Your equipment doesn't change size or shape to match the new form, and any equipment that the new form can't wear must either fall to the ground or merge with it. Equipment that merges with the form has no effect until you leave the form.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 18,
        name: "Beast Spells",
        description: `Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren't able to provide material components.`,
      },
      {
        level: 18,
        name: "Timeless Body",
        description: `Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.`,
      },
      {
        level: 20,
        name: "Archdruid",
        description: `At 20th level, you can use your Wild Shape an unlimited number of times. 
 
Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.`,
      },
    ],
    subclasses: [
      {
        id: "circle-of-the-land",
        name: "Circle of the Land",
        summary: `The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites through a vast oral tradition. These druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic. The circle's wisest members preside as the chief priests of communities that hold to the Old Faith and serve as advisors to the rulers of those folk. As a member of t`,
        srdLicensed: true,
        resources: [
          {
            id: "druid-natural-recovery",
            name: "Natural Recovery",
            usesByLevel: { 2: 1 },
          },
        ],
        features: [
          {
            level: 2,
            name: "Bonus Cantrip",
            description: `When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice.`,
          },
          {
            level: 2,
            name: "Natural Recovery",
            description: `Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level 
(rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest. 
 
For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.`,
          },
          {
            level: 3,
            name: "Circle Spells",
            description: `Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land-arctic, coast, desert, forest, grassland, mountain, or swamp-and consult the associated list of spells. 
 
Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you. 
 
**Arctic (table)** 
 
| Druid Level | Circle Spells                     | 
|-------------|-----------------------------------| 
| 3rd         | hold person, spike growth         | 
| 5th         | sleet storm, slow                 | 
| 7th         | freedom of movement, ice storm    | 
| 9th         | commune with nature, cone of cold | 
 
**Coast (table)** 
 
| Druid Level | Circle Spells                      | 
|-------------|------------------------------------| 
| 3rd         | mirror image, misty step           | 
| 5th         | water breathing, water walk        | 
| 7th         | control water, freedom of movement | 
| 9th         | conjure elemental, scrying         | 
 
**Desert (table)** 
 
| Druid Level | Circle Spells                                 | 
|-------------|-----------------------------------------------| 
| 3rd         | blur, silence                                 | 
| 5th         | create food and water, protection from energy | 
| 7th         | blight, hallucinatory terrain                 | 
| 9th         | insect plague, wall of stone                  | 
 
**Forest (table)** 
 
| Druid Level | Circle Spells                    | 
|-------------|----------------------------------| 
| 3rd         | barkskin, spider climb           | 
| 5th         | call lightning, plant growth     | 
| 7th         | divination, freedom of movement  | 
| 9th         | commune with nature, tree stride | 
 
**Grassland (table)** 
 
| Druid Level | Circle Spells                    | 
|-------------|----------------------------------| 
| 3rd         | invisibility, pass without trace | 
| 5th         | daylight, haste                  | 
| 7th         | divination, freedom of movement  | 
| 9th         | dream, insect plague             | 
 
**Mountain (table)** 
 
| Druid Level | Circle Spells                   | 
|-------------|---------------------------------| 
| 3rd         | spider climb, spike growth      | 
| 5th         | lightning bolt, meld into stone | 
| 7th         | stone shape, stoneskin          | 
| 9th         | passwall, wall of stone         | 
 
**Swamp (table)** 
 
| Druid Level | Circle Spells                        | 
|-------------|--------------------------------------| 
| 3rd         | acid arrow, darkness                 | 
| 5th         | water walk, stinking cloud           | 
| 7th         | freedom of movement, locate creature | 
| 9th         | insect plague, scrying               |`,
          },
          {
            level: 6,
            name: "Land's Stride",
            description: `Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. 
 
In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the *entangle* spell.`,
          },
          {
            level: 10,
            name: "Nature's Ward",
            description: `When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.`,
          },
          {
            level: 14,
            name: "Nature's Sanctuary",
            description: `When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours. 
 
The creature is aware of this effect before it makes its attack against you. 
 
> ### Sacred Plants and Wood 
> 
> A druid holds certain plants to be sacred, particularly alder, ash, birch, elder, hazel, holly, juniper, mistletoe, oak, rowan, willow, and yew. Druids often use such plants as part of a spellcasting focus, incorporating lengths of oak or yew or sprigs of mistletoe. 
> 
> Similarly, a druid uses such woods to make other objects, such as weapons and shields. Yew is associated with death and rebirth, so weapon handles for scimitars or sickles might be fashioned from it. Ash is associated with life and oak with strength. These woods make excellent hafts or whole weapons, such as clubs or quarterstaffs, as well as shields. Alder is associated with air, and it might be used for thrown weapons, such as darts or javelins. 
> 
> Druids from regions that lack the plants described here have chosen other plants to take on similar uses. For instance, a druid of a desert region might value the yucca tree and cactus plants. 
 
> ### Druids and the Gods 
> 
> Some druids venerate the forces of nature themselves, but most druids are devoted to one of the many nature deities worshiped in the multiverse (the lists of gods in appendix B include many such deities). The worship of these deities is often considered a more ancient tradition than the faiths of clerics and urbanized peoples.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2 },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2 },
      { level: 3, slots: [4, 2, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 2 },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 6, slots: [4, 3, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 7, slots: [4, 3, 3, 1, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 9, slots: [4, 3, 3, 3, 1, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 4 },
      { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 4 },
      { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 4 },
      { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 4 },
      { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 4 },
      { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 4 },
      { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantripsKnown: 4 },
      { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantripsKnown: 4 },
      { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantripsKnown: 4 },
      { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantripsKnown: 4 },
    ],
  },
  {
    classId: "fighter",
    subclassLevel: 3,
    subclassLabel: "Martial Archetype",
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    resources: [
      {
        id: "fighter-second-wind",
        name: "Second Wind",
        usesByLevel: { 1: 1 },
        shortRestRegain: "all",
      },
      {
        id: "fighter-action-surge",
        name: "Action Surge",
        usesByLevel: { 2: 1, 17: 2 },
        shortRestRegain: "all",
      },
      {
        id: "fighter-indomitable",
        name: "Indomitable",
        usesByLevel: { 9: 1, 13: 2, 17: 3 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Fighting Style",
        description: `You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again. 
 
#### Archery 
 
You gain a +2 bonus to attack rolls you make with ranged weapons. 
 
#### Defense 
 
While you are wearing armor, you gain a +1 bonus to AC. 
 
#### Dueling 
 
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. 
 
#### Great Weapon Fighting 
 
When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit. 
 
#### Protection 
 
When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield. 
 
#### Two-Weapon Fighting 
 
When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.`,
      },
      {
        level: 1,
        name: "Second Wind",
        description: `You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.`,
      },
      {
        level: 2,
        name: "Action Surge",
        description: `Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action on top of your regular action and a possible bonus action. 
 
Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 6th, 8th, 12th, 14th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Extra Attack",
        description: `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. 
 
The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.`,
      },
      {
        level: 9,
        name: "Indomitable",
        description: `Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest. 
 
You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.`,
      },
    ],
    subclasses: [
      {
        id: "champion",
        name: "Champion",
        summary: `The archetypal Champion focuses on the development of raw physical power honed to deadly perfection. Those who model themselves on this archetype combine rigorous training with physical excellence to deal devastating blows.`,
        srdLicensed: true,
        features: [
          {
            level: 3,
            name: "Improved Critical",
            description: `Beginning when you choose this archetype at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.`,
          },
          {
            level: 7,
            name: "Remarkable Athlete",
            description: `Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus. 
 
In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.`,
          },
          {
            level: 10,
            name: "Additional Fighting Style",
            description: `At 10th level, you can choose a second option from the Fighting Style class feature.`,
          },
          {
            level: 15,
            name: "Superior Critical",
            description: `Starting at 15th level, your weapon attacks score a critical hit on a roll of 18-20.`,
          },
          {
            level: 18,
            name: "Survivor",
            description: `At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don't gain this benefit if you have 0 hit points.`,
          },
        ],
      },
    ],
  },
  {
    classId: "monk",
    subclassLevel: 3,
    subclassLabel: "Monastic Tradition",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "monk-ki",
        name: "Ki Points",
        usesByLevel: pointsEqualToLevel(2, 20),
        shortRestRegain: "all",
        isPointPool: true,
      },
    ],
    features: [
      {
        level: 1,
        name: "Martial Arts",
        description: `At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two- handed or heavy property. 
 
You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield: 
 
* You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons. 
* You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table. 
* When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn. 
 
Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama). Whatever name you use for a monk weapon, you can use the game statistics provided for the weapon.`,
      },
      {
        level: 1,
        name: "Unarmored Defense",
        description: `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
      },
      {
        level: 2,
        name: "Ki",
        description: `Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of the Monk table. 
 
You can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class. 
 
When you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points. 
 
Some of your ki features require your target to make a saving throw to resist the feature's effects. The saving throw DC is calculated as follows: 
 
**Ki save DC** = 8 + your proficiency bonus + your Wisdom modifier 
 
#### Flurry of Blows 
 
Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action. 
 
#### Patient Defense 
 
You can spend 1 ki point to take the Dodge action as a bonus action on your turn. 
 
#### Step of the Wind 
 
You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn, and your jump distance is doubled for the turn.`,
      },
      {
        level: 2,
        name: "Unarmored Movement",
        description: `Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in the Monk table. 
 
At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.`,
      },
      {
        level: 3,
        name: "Deflect Missiles",
        description: `Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level. 
 
If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack, which has a normal range of 20 feet and a long range of 60 feet.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 4,
        name: "Slow Fall",
        description: `Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.`,
      },
      {
        level: 5,
        name: "Extra Attack",
        description: `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
      },
      {
        level: 5,
        name: "Stunning Strike",
        description: `Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.`,
      },
      {
        level: 6,
        name: "Ki-Empowered Strikes",
        description: `Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.`,
      },
      {
        level: 7,
        name: "Evasion",
        description: `At 7th level, your instinctive agility lets you dodge out of the way of certain area effects, such as a blue dragon's lightning breath or a *fireball* spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
      },
      {
        level: 7,
        name: "Stillness of Mind",
        description: `Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.`,
      },
      {
        level: 10,
        name: "Purity of Body",
        description: `At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.`,
      },
      {
        level: 13,
        name: "Tongue of the Sun and Moon",
        description: `Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.`,
      },
      {
        level: 14,
        name: "Diamond Soul",
        description: `Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws. 
 
Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.`,
      },
      {
        level: 15,
        name: "Timeless Body",
        description: `At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. In addition, you no longer need food or water.`,
      },
      {
        level: 18,
        name: "Empty Body",
        description: `Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage. 
 
Additionally, you can spend 8 ki points to cast the *astral projection* spell, without needing material components. When you do so, you can't take any other creatures with you.`,
      },
      {
        level: 20,
        name: "Perfect Self",
        description: `At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.`,
      },
    ],
    subclasses: [
      {
        id: "way-of-the-open-hand",
        name: "Way of the Open Hand",
        summary: `Monks of the Way of the Open Hand are the ultimate masters of martial arts combat, whether armed or unarmed. They learn techniques to push and trip their opponents, manipulate ki to heal damage to their bodies, and practice advanced meditation that can protect them from harm.`,
        srdLicensed: true,
        resources: [
          {
            id: "monk-wholeness-of-body",
            name: "Wholeness of Body",
            usesByLevel: { 6: 1 },
          },
        ],
        features: [
          {
            level: 3,
            name: "Open Hand Technique",
            description: `Starting when you choose this tradition at 3rd level, you can manipulate your enemy's ki when you harness your own. Whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects on that target: 
* It must succeed on a Dexterity saving throw or be knocked prone. 
* It must make a Strength saving throw. If it fails, you can push it up to 15 feet away from you. 
* It can't take reactions until the end of your next turn.`,
          },
          {
            level: 6,
            name: "Wholeness of Body",
            description: `At 6th level, you gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. You must finish a long rest before you can use this feature again.`,
          },
          {
            level: 11,
            name: "Tranquility",
            description: `Beginning at 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a *sanctuary* spell that lasts until the start of your next long rest (the spell can end early as normal). The saving throw DC for the spell equals 8 + your Wisdom modifier + your proficiency bonus.`,
          },
          {
            level: 17,
            name: "Quivering Palm",
            description: `At 17th level, you gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for a number of days equal to your monk level. The vibrations are harmless unless you use your action to end them. To do so, you and the target must be on the same plane of existence. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage. 
 
You can have only one creature under the effect of this feature at a time. You can choose to end the vibrations harmlessly without using an action.`,
          },
        ],
      },
    ],
  },
  {
    classId: "paladin",
    subclassLevel: 3,
    subclassLabel: "Sacred Oath",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "paladin-channel-divinity",
        name: "Channel Divinity",
        usesByLevel: { 3: 1 },
        shortRestRegain: "all",
      },
      {
        id: "paladin-lay-on-hands",
        name: "Lay on Hands",
        usesByLevel: pointsEqualToLevel(1, 20, 5),
        isPointPool: true,
      },
      {
        id: "paladin-divine-sense",
        name: "Divine Sense",
        // "1 + Charisma modifier" (no stated minimum of 1, unlike Bardic Inspiration).
        usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 1, minimum: 0, bonus: 1 },
      },
      {
        id: "paladin-cleansing-touch",
        name: "Cleansing Touch",
        usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 14, minimum: 1 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Divine Sense",
        description: `The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire 
 
Count Strahd von Zarovich, for instance). Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the *hallow* spell. 
 
You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.`,
      },
      {
        level: 1,
        name: "Lay on Hands",
        description: `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5. 
 
As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool. 
 
Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one. 
 
This feature has no effect on undead and constructs.`,
      },
      {
        level: 2,
        name: "Divine Smite",
        description: `Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend.`,
      },
      {
        level: 2,
        name: "Fighting Style",
        description: `At 2nd level, you adopt a style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again. 
 
#### Defense 
 
While you are wearing armor, you gain a +1 bonus to AC. 
 
#### Dueling 
 
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. 
 
#### Great Weapon Fighting 
 
When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property for you to gain this benefit. 
 
#### Protection 
 
When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
      },
      {
        level: 2,
        name: "Spellcasting",
        description: `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does. 
 
#### Preparing and Casting Spells 
 
The Paladin table shows how many spell slots you have to cast your spells. To cast one of your paladin spells of 1st level or higher, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
You prepare the list of paladin spells that are available for you to cast, choosing from the paladin spell list. When you do so, choose a number of paladin spells equal to your Charisma modifier + half your paladin level, rounded down (minimum of one spell). The spells must be of a level for which you have spell slots. 
 
For example, if you are a 5th-level paladin, you have four 1st-level and two 2nd-level spell slots. With a Charisma of 14, your list of prepared spells can include four spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell *cure wounds,* you can cast it using a 1st-level or a 2nd- level slot. Casting the spell doesn't remove it from your list of prepared spells. 
 
You can change your list of prepared spells when you finish a long rest. Preparing a new list of paladin spells requires time spent in prayer and meditation: at least 1 minute per spell level for each spell on your list. 
 
#### Spellcasting Ability 
 
Charisma is your spellcasting ability for your paladin spells, since their power derives from the strength of your convictions. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a paladin spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Charisma modifier 
 
**Spell attack modifier** = your proficiency bonus + your Charisma modifier 
 
#### Spellcasting Focus 
 
You can use a holy symbol as a spellcasting focus for your paladin spells.`,
      },
      {
        level: 3,
        name: "Divine Health",
        description: `By 3rd level, the divine magic flowing through you makes you immune to disease.

 ### Sacred Oath 

When you reach 3rd level, you swear the oath that binds you as a paladin forever. Up to this time you have been in a preparatory stage, committed to the path but not yet sworn to it. Now you choose the Oath of Devotion, the Oath of the Ancients, or the Oath of Vengeance, all detailed at the end of the class description. 
 
Your choice grants you features at 3rd level and again at 7th, 15th, and 20th level. Those features include oath spells and the Channel Divinity feature. 
 
#### Oath Spells 
 
Each oath has a list of associated spells. You gain access to these spells at the levels specified in the oath description. Once you gain access to an oath spell, you always have it prepared. Oath spells don't count against the number of spells you can prepare each day. 
 
If you gain an oath spell that doesn't appear on the paladin spell list, the spell is nonetheless a paladin spell for you. 
 
#### Channel Divinity 
 
Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it. 
 
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again. 
 
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.

>### Breaking Your Oath 
>
> A paladin tries to hold to the highest standards of conduct, but even the most virtuous paladin is fallible. Sometimes the right path proves too demanding, sometimes a situation calls for the lesser of two evils, and sometimes the heat of emotion causes a paladin to transgress his or her oath. 
> 
> A paladin who has broken a vow typically seeks absolution from a cleric who shares his or her faith or from another paladin of the same order. The paladin might spend an all- night vigil in prayer as a sign of penitence, or undertake a fast or similar act of self-denial. After a rite of confession and forgiveness, the paladin starts fresh. 
> 
> If a paladin willfully violates his or her oath and shows no sign of repentance, the consequences can be more serious. At the GM's discretion, an impenitent paladin might be forced to abandon this class and adopt another.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Extra Attack",
        description: `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
      },
      {
        level: 6,
        name: "Aura of Protection",
        description: `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus. 
 
At 18th level, the range of this aura increases to 30 feet.`,
      },
      {
        level: 10,
        name: "Aura of Courage",
        description: `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious. 
 
At 18th level, the range of this aura increases to 30 feet.`,
      },
      {
        level: 11,
        name: "Improved Divine Smite",
        description: `By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage. If you also use your Divine Smite with an attack, you add this damage to the extra damage of your Divine Smite.`,
      },
      {
        level: 14,
        name: "Cleansing Touch",
        description: `Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch. 
 
You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.`,
      },
      {
        level: 18,
        name: "Aura improvements",
        description: `At 18th level, the range of your Aura of Protection and Aura of Courage (and your Sacred Oath's aura feature, if any) increases from 10 feet to 30 feet.`,
      },
    ],
    subclasses: [
      {
        id: "oath-of-devotion",
        name: "Oath of Devotion",
        summary: `The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order. Sometimes called cavaliers, white knights, or holy warriors, these paladins meet the ideal of the knight in shining armor, acting with honor in pursuit of justice and the greater good. They hold themselves to the highest standards of conduct, and some, for better or worse, hold the rest of the world to the s`,
        srdLicensed: true,
        resources: [
          {
            id: "paladin-holy-nimbus",
            name: "Holy Nimbus",
            usesByLevel: { 20: 1 },
          },
        ],
        features: [
          {
            level: 3,
            name: "Channel Divinity",
            description: `When you take this oath at 3rd level, you gain the following two Channel Divinity options. 
 
**_Sacred Weapon._** As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration. 
 
You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends. 
 
**_Turn the Unholy._** As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage. 
 
A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
          },
          {
            level: 3,
            name: "Oath Spells",
            description: `You gain oath spells at the paladin levels listed. 
 
 | Level | Paladin Spells                           | 
|-------|------------------------------------------| 
| 3rd   | protection from evil and good, sanctuary | 
| 5th   | lesser restoration, zone of truth        | 
| 9th   | beacon of hope, dispel magic             | 
| 13th  | freedom of movement, guardian of faith   | 
| 17th  | commune, flame strike                    |`,
          },
          {
            level: 3,
            name: "Tenets of Devotion",
            description: `Though the exact words and strictures of the Oath of Devotion vary, paladins of this oath share these tenets. 
 
**_Honesty._** Don't lie or cheat. Let your word be your promise. 
 
**_Courage._** Never fear to act, though caution is wise. 
 
**_Compassion._** Aid others, protect the weak, and punish those who threaten them. Show mercy to your foes, but temper it with wisdom. 
 
**_Honor._** Treat others with fairness, and let your honorable deeds be an example to them. Do as much good as possible while causing the least amount of harm. 
 
**_Duty._** Be responsible for your actions and their consequences, protect those entrusted to your care, and obey those who have just authority over you.`,
          },
          {
            level: 7,
            name: "Aura of Devotion",
            description: `Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious. 
 
At 18th level, the range of this aura increases to 30 feet.`,
          },
          {
            level: 15,
            name: "Purity of Spirit",
            description: `Beginning at 15th level, you are always under the effects of a *protection from evil and good* spell.`,
          },
          {
            level: 20,
            name: "Holy Nimbus",
            description: `At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. 
 
Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. 
 
In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead. 
 
Once you use this feature, you can't use it again until you finish a long rest.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [0, 0, 0, 0, 0] },
      { level: 2, slots: [2, 0, 0, 0, 0] },
      { level: 3, slots: [3, 0, 0, 0, 0] },
      { level: 4, slots: [3, 0, 0, 0, 0] },
      { level: 5, slots: [4, 2, 0, 0, 0] },
      { level: 6, slots: [4, 2, 0, 0, 0] },
      { level: 7, slots: [4, 3, 0, 0, 0] },
      { level: 8, slots: [4, 3, 0, 0, 0] },
      { level: 9, slots: [4, 3, 2, 0, 0] },
      { level: 10, slots: [4, 3, 2, 0, 0] },
      { level: 11, slots: [4, 3, 3, 0, 0] },
      { level: 12, slots: [4, 3, 3, 0, 0] },
      { level: 13, slots: [4, 3, 3, 1, 0] },
      { level: 14, slots: [4, 3, 3, 1, 0] },
      { level: 15, slots: [4, 3, 3, 2, 0] },
      { level: 16, slots: [4, 3, 3, 2, 0] },
      { level: 17, slots: [4, 3, 3, 3, 1] },
      { level: 18, slots: [4, 3, 3, 3, 1] },
      { level: 19, slots: [4, 3, 3, 3, 2] },
      { level: 20, slots: [4, 3, 3, 3, 2] },
    ],
  },
  {
    classId: "ranger",
    subclassLevel: 3,
    subclassLabel: "Ranger Archetype",
    asiLevels: [4, 8, 12, 16, 19],
    features: [
      {
        level: 1,
        name: "Favored Enemy",
        description: `Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy. 
 
Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies. 
 
You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them. 
 
When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all. 
 
You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.`,
      },
      {
        level: 1,
        name: "Natural Explorer",
        description: `You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in. 
 
While traveling for an hour or more in your favored terrain, you gain the following benefits: 
* Difficult terrain doesn't slow your group's travel. 
* Your group can't become lost except by magical means. 
* Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger. 
* If you are traveling alone, you can move stealthily at a normal pace. 
* When you forage, you find twice as much food as you normally would. 
* While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area. 
 
You choose additional favored terrain types at 6th and 10th level.`,
      },
      {
        level: 2,
        name: "Fighting Style",
        description: `At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again. 
 
#### Archery 
 
You gain a +2 bonus to attack rolls you make with ranged weapons. 
 
#### Defense 
 
While you are wearing armor, you gain a +1 bonus to AC. 
 
#### Dueling 
 
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon. 
 
#### Two-Weapon Fighting 
 
When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.`,
      },
      {
        level: 2,
        name: "Spellcasting",
        description: `By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does. See chapter 10 for the general rules of spellcasting and chapter 11 for the ranger spell list. 
 
#### Spell Slots 
 
The Ranger table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
For example, if you know the 1st-level spell *animal friendship* and have a 1st-level and a 2nd-level spell slot available, you can cast *animal friendship* using either slot. 
 
#### Spells Known of 1st Level and Higher 
 
You know two 1st-level spells of your choice from the ranger spell list. 
 
The Spells Known column of the Ranger table shows when you learn more ranger spells of your choice. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 5th level in this class, you can learn one new spell of 1st or 2nd level. 
 
Additionally, when you gain a level in this class, you can choose one of the ranger spells you know and replace it with another spell from the ranger spell list, which also must be of a level for which you have spell slots. 
 
#### Spellcasting Ability 
 
Wisdom is your spellcasting ability for your ranger spells, since your magic draws on your attunement to nature. You use your Wisdom whenever a spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a ranger spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Wisdom modifier 
 
**Spell attack modifier** = your proficiency bonus + your Wisdom modifier`,
      },
      {
        level: 3,
        name: "Primeval Awareness",
        description: `Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn't reveal the creatures' location or number.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Extra Attack",
        description: `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
      },
      {
        level: 8,
        name: "Land's Stride",
        description: `Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. 
 
In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such those created by the *entangle* spell.`,
      },
      {
        level: 10,
        name: "Hide in Plain Sight",
        description: `Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage. 
 
Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.`,
      },
      {
        level: 14,
        name: "Vanish",
        description: `Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.`,
      },
      {
        level: 18,
        name: "Feral Senses",
        description: `At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it. 
 
You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.`,
      },
      {
        level: 20,
        name: "Foe Slayer",
        description: `At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.`,
      },
    ],
    subclasses: [
      {
        id: "hunter",
        name: "Hunter",
        summary: `Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness. As you walk the Hunter's path, you learn specialized techniques for fighting the threats you face, from rampaging ogres and hordes of orcs to towering giants and terrifying dragons.`,
        srdLicensed: true,
        features: [
          {
            level: 3,
            name: "Hunter's Prey",
            description: `At 3rd level, you gain one of the following features of your choice. 
 
**_Colossus Slayer._** Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it's below its hit point maximum. You can deal this extra damage only once per turn. 
 
**_Giant Killer._** When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature. 
 
**_Horde Breaker._** Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.`,
          },
          {
            level: 7,
            name: "Defensive Tactics",
            description: `At 7th level, you gain one of the following features of your choice. 
 
**_Escape the Horde._** Opportunity attacks against you are made with disadvantage. 
 
**_Multiattack Defense._** When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn. 
 
**_Steel Will._** You have advantage on saving throws against being frightened.`,
          },
          {
            level: 11,
            name: "Multiattack",
            description: `At 11th level, you gain one of the following features of your choice. 
 
**_Volley._** You can use your action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon's range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target. 
 
**_Whirlwind Attack._** You can use your action to make a melee attack against any number of creatures within 5 feet of you, with a separate attack roll for each target.`,
          },
          {
            level: 15,
            name: "Superior Hunter's Defense",
            description: `At 15th level, you gain one of the following features of your choice. 
 
**_Evasion._** When you are subjected to an effect, such as a red dragon's fiery breath or a *lightning bolt* spell, that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail. 
 
**_Stand Against the Tide._** When a hostile creature misses you with a melee attack, you can use your reaction to force that creature to repeat the same attack against another creature (other than itself) of your choice. 
 
**_Uncanny Dodge._** When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [0, 0, 0, 0, 0] },
      { level: 2, slots: [2, 0, 0, 0, 0], spellsKnown: 2 },
      { level: 3, slots: [3, 0, 0, 0, 0], spellsKnown: 3 },
      { level: 4, slots: [3, 0, 0, 0, 0], spellsKnown: 3 },
      { level: 5, slots: [4, 2, 0, 0, 0], spellsKnown: 4 },
      { level: 6, slots: [4, 2, 0, 0, 0], spellsKnown: 4 },
      { level: 7, slots: [4, 3, 0, 0, 0], spellsKnown: 5 },
      { level: 8, slots: [4, 3, 0, 0, 0], spellsKnown: 5 },
      { level: 9, slots: [4, 3, 2, 0, 0], spellsKnown: 6 },
      { level: 10, slots: [4, 3, 2, 0, 0], spellsKnown: 6 },
      { level: 11, slots: [4, 3, 3, 0, 0], spellsKnown: 7 },
      { level: 12, slots: [4, 3, 3, 0, 0], spellsKnown: 7 },
      { level: 13, slots: [4, 3, 3, 1, 0], spellsKnown: 8 },
      { level: 14, slots: [4, 3, 3, 1, 0], spellsKnown: 8 },
      { level: 15, slots: [4, 3, 3, 2, 0], spellsKnown: 9 },
      { level: 16, slots: [4, 3, 3, 2, 0], spellsKnown: 9 },
      { level: 17, slots: [4, 3, 3, 3, 1], spellsKnown: 10 },
      { level: 18, slots: [4, 3, 3, 3, 1], spellsKnown: 10 },
      { level: 19, slots: [4, 3, 3, 3, 2], spellsKnown: 11 },
      { level: 20, slots: [4, 3, 3, 3, 2], spellsKnown: 11 },
    ],
  },
  {
    classId: "rogue",
    subclassLevel: 3,
    subclassLabel: "Roguish Archetype",
    asiLevels: [4, 8, 10, 12, 16, 19],
    resources: [
      {
        id: "rogue-stroke-of-luck",
        name: "Stroke of Luck",
        usesByLevel: { 20: 1 },
        shortRestRegain: "all",
      },
    ],
    features: [
      {
        level: 1,
        name: "Expertise",
        description: `At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies. 
 
At 6th level, you can choose two more of your proficiencies (in skills or with thieves' tools) to gain this benefit.`,
      },
      {
        level: 1,
        name: "Sneak Attack",
        description: `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. 
 
You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll. 
 
The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
      },
      {
        level: 1,
        name: "Thieves' Cant",
        description: `During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly. 
 
In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.`,
      },
      {
        level: 2,
        name: "Cunning Action",
        description: `Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 10th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 5,
        name: "Uncanny Dodge",
        description: `Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
      },
      {
        level: 7,
        name: "Evasion",
        description: `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an *ice storm* spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
      },
      {
        level: 11,
        name: "Reliable Talent",
        description: `By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.`,
      },
      {
        level: 14,
        name: "Blindsense",
        description: `Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.`,
      },
      {
        level: 15,
        name: "Slippery Mind",
        description: `By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.`,
      },
      {
        level: 18,
        name: "Elusive",
        description: `Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated.`,
      },
      {
        level: 20,
        name: "Stroke of Luck",
        description: `At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. 
 
Once you use this feature, you can't use it again until you finish a short or long rest.`,
      },
    ],
    subclasses: [
      {
        id: "thief",
        name: "Thief",
        summary: `You hone your skills in the larcenous arts. Burglars, bandits, cutpurses, and other criminals typically follow this archetype, but so do rogues who prefer to think of themselves as professional treasure seekers, explorers, delvers, and investigators. In addition to improving your agility and stealth, you learn skills useful for delving into ancient ruins, reading unfamiliar languages, and using ma`,
        srdLicensed: true,
        features: [
          {
            level: 3,
            name: "Fast Hands",
            description: `Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action.`,
          },
          {
            level: 3,
            name: "Second-Story Work",
            description: `When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement. 
 
In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.`,
          },
          {
            level: 9,
            name: "Supreme Sneak",
            description: `Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn.`,
          },
          {
            level: 13,
            name: "Use Magic Device",
            description: `By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you. You ignore all class, race, and level requirements on the use of magic items.`,
          },
          {
            level: 17,
            name: "Thief's Reflexes",
            description: `When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised.`,
          },
        ],
      },
    ],
  },
  {
    classId: "sorcerer",
    subclassLevel: 1,
    subclassLabel: "Sorcerous Origin",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "sorcerer-sorcery-points",
        name: "Sorcery Points",
        usesByLevel: pointsEqualToLevel(2, 20),
        isPointPool: true,
      },
    ],
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: `An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells. 
 
#### Cantrips 
 
At 1st level, you know four cantrips of your choice from the sorcerer spell list. You learn additional sorcerer cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Sorcerer table. 
 
#### Spell Slots 
 
The Sorcerer table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these sorcerer spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
For example, if you know the 1st-level spell *burning hands* and have a 1st-level and a 2nd-level spell slot available, you can cast *burning hands* using either slot. 
 
#### Spells Known of 1st Level and Higher 
 
You know two 1st-level spells of your choice from the sorcerer spell list. 
 
The Spells Known column of the Sorcerer table shows when you learn more sorcerer spells of your choice. Each of these spells must be of a level for which you have spell slots. For instance, when you reach 3rd level in this class, you can learn one new spell of 1st or 2nd level. 
 
Additionally, when you gain a level in this class, you can choose one of the sorcerer spells you know and replace it with another spell from the sorcerer spell list, which also must be of a level for which you have spell slots. 
 
#### Spellcasting Ability 
 
Charisma is your spellcasting ability for your sorcerer spells, since the power of your magic relies on your ability to project your will into the world. You use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a sorcerer spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Charisma modifier 
 
**Spell attack modifier** = your proficiency bonus + your Charisma modifier 
 
#### Spellcasting Focus 
 
You can use an arcane focus as a spellcasting focus for your sorcerer spells.`,
      },
      {
        level: 2,
        name: "Font of Magic",
        description: `At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects. 
 
#### Sorcery Points 
 
You have 2 sorcery points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer table. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest. 
 
#### Flexible Casting 
 
You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points. You learn other ways to use your sorcery points as you reach higher levels. 
 
**_Creating Spell Slots._** You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. The Creating Spell Slots table shows the cost of creating a spell slot of a given level. You can create spell slots no higher in level than 5th. 
 
Any spell slot you create with this feature vanishes when you finish a long rest. 
 
**Creating Spell Slots (table)** 
 
| Spell Slot Level | Sorcery Point Cost | 
|------------------|--------------------| 
| 1st              | 2                  | 
| 2nd              | 3                  | 
| 3rd              | 5                  | 
| 4th              | 6                  | 
| 5th              | 7                  | 
 
**_Converting a Spell Slot to Sorcery Points._** As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot's level.`,
      },
      {
        level: 3,
        name: "Metamagic",
        description: `At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level. 
 
You can use only one Metamagic option on a spell when you cast it, unless otherwise noted. 
 
#### Careful Spell 
 
When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. To do so, you spend 1 sorcery point and choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell. 
 
#### Distant Spell 
 
When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell. 
 
When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet. 
 
#### Empowered Spell 
 
When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls. 
 
You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell. 
 
#### Extended Spell 
 
When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours. 
 
#### Heightened Spell 
 
When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell. 
 
#### Quickened Spell 
 
When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting. 
 
#### Subtle Spell 
 
When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components. 
 
#### Twinned Spell 
 
When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of sorcery points equal to the spell's level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip). 
 
To be eligible, a spell must be incapable of targeting more than one creature at the spell's current level. For example, *magic missile* and *scorching ray* aren't eligible, but *ray of frost* and *chromatic orb* are.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 20,
        name: "Sorcerous Restoration",
        description: `At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.`,
      },
    ],
    subclasses: [
      {
        id: "draconic-bloodline",
        name: "Draconic Bloodline",
        summary: `Your innate magic comes from draconic magic that was mingled with your blood or that of your ancestors. Most often, sorcerers with this origin trace their descent back to a mighty sorcerer of ancient times who made a bargain with a dragon or who might even have claimed a dragon parent. Some of these bloodlines are well established in the world, but most are obscure. Any given sorcerer could be the`,
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Draconic Resilience",
            description: `As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. At 1st level, your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class. 
 
Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.`,
          },
          {
            level: 1,
            name: "Dragon Ancestor",
            description: `At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later. 
 
**Draconic Ancestry (table)** 
 
| Dragon | Damage Type | 
|--------|-------------| 
| Black  | Acid        | 
| Blue   | Lightning   | 
| Brass  | Fire        | 
| Bronze | Lightning   | 
| Copper | Acid        | 
| Gold   | Fire        | 
| Green  | Poison      | 
| Red    | Fire        | 
| Silver | Cold        | 
| White  | Cold        | 
 
You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.`,
          },
          {
            level: 6,
            name: "Elemental Affinity",
            description: `Starting at 6th level, when you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.`,
          },
          {
            level: 14,
            name: "Dragon Wings",
            description: `At 14th level, you gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action on your turn. 
 
You can't manifest your wings while wearing armor unless the armor is made to accommodate them, and clothing not made to accommodate your wings might be destroyed when you manifest them.`,
          },
          {
            level: 18,
            name: "Draconic Presence",
            description: `Beginning at 18th level, you can channel the dread presence of your dragon ancestor, causing those around you to become awestruck or frightened. As an action, you can spend 5 sorcery points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet. For 1 minute or until you lose your concentration (as if you were casting a concentration spell), each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed (if you chose awe) or frightened (if you chose fear) until the aura ends. A creature that succeeds on this saving throw is immune to your aura for 24 hours.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 2 },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 3 },
      { level: 3, slots: [4, 2, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 4 },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 5 },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 6 },
      { level: 6, slots: [4, 3, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 7 },
      { level: 7, slots: [4, 3, 3, 1, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 8 },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 9 },
      { level: 9, slots: [4, 3, 3, 3, 1, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 10 },
      { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 11 },
      { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 6, spellsKnown: 12 },
      { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 6, spellsKnown: 12 },
      { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 6, spellsKnown: 13 },
      { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 6, spellsKnown: 13 },
      { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 6, spellsKnown: 14 },
      { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 6, spellsKnown: 14 },
      { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantripsKnown: 6, spellsKnown: 15 },
      { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantripsKnown: 6, spellsKnown: 15 },
      { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantripsKnown: 6, spellsKnown: 15 },
      { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantripsKnown: 6, spellsKnown: 15 },
    ],
  },
  {
    classId: "warlock",
    subclassLevel: 1,
    subclassLabel: "Otherworldly Patron",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "warlock-arcanum-6",
        name: "Mystic Arcanum (6th level)",
        usesByLevel: { 11: 1 },
      },
      {
        id: "warlock-arcanum-7",
        name: "Mystic Arcanum (7th level)",
        usesByLevel: { 13: 1 },
      },
      {
        id: "warlock-arcanum-8",
        name: "Mystic Arcanum (8th level)",
        usesByLevel: { 15: 1 },
      },
      {
        id: "warlock-arcanum-9",
        name: "Mystic Arcanum (9th level)",
        usesByLevel: { 17: 1 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Pact Magic",
        description: `Your arcane research and the magic bestowed on you by your patron have given you facility with spells. 
 
#### Cantrips 
 
You know two cantrips of your choice from the warlock spell list. You learn additional warlock cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Warlock table. 
 
#### Spell Slots 
 
The Warlock table shows how many spell slots you have. The table also shows what the level of those slots is; all of your spell slots are the same level. To cast one of your warlock spells of 1st level or higher, you must expend a spell slot. You regain all expended spell slots when you finish a short or long rest. 
 
For example, when you are 5th level, you have two 3rd-level spell slots. To cast the 1st-level spell *thunderwave*, you must spend one of those slots, and you cast it as a 3rd-level spell. 
 
#### Spells Known of 1st Level and Higher 
 
At 1st level, you know two 1st-level spells of your choice from the warlock spell list. 
 
The Spells Known column of the Warlock table shows when you learn more warlock spells of your choice of 1st level and higher. A spell you choose must be of a level no higher than what's shown in the table's Slot Level column for your level. When you reach 6th level, for example, you learn a new warlock spell, which can be 1st, 2nd, or 3rd level. 
 
Additionally, when you gain a level in this class, you can choose one of the warlock spells you know and replace it with another spell from the warlock spell list, which also must be of a level for which you have spell slots. 
 
#### Spellcasting Ability 
 
Charisma is your spellcasting ability for your warlock spells, so you use your Charisma whenever a spell refers to your spellcasting ability. In addition, you use your Charisma modifier when setting the saving throw DC for a warlock spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Charisma modifier 
 
**Spell attack modifier** = your proficiency bonus + your Charisma modifier 
 
#### Spellcasting Focus 
 
You can use an arcane focus as a spellcasting focus for your warlock spells.`,
      },
      {
        level: 2,
        name: "Eldritch Invocations",
        description: `If an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class. 
 
#### Agonizing Blast 
 
*Prerequisite:* eldritch blast *cantrip* 
 
When you cast *eldritch blast*, add your Charisma modifier to the damage it deals on a hit. 
 
#### Armor of Shadows 
 
You can cast *mage armor* on yourself at will, without expending a spell slot or material components. 
 
#### Ascendant Step 
 
*Prerequisite: 9th level* 
 
You can cast *levitate* on yourself at will, without expending a spell slot or material components. 
 
#### Beast Speech 
 
You can cast *speak with animals* at will, without expending a spell slot. 
 
#### Beguiling Influence 
 
You gain proficiency in the Deception and Persuasion skills. 
 
#### Bewitching Whispers 
 
*Prerequisite: 7th level* 
 
You can cast *compulsion* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Book of Ancient Secrets 
 
*Prerequisite: Pact of the Tome feature* 
 
You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag from any class's spell list (the two needn't be from the same list). The spells appear in the book and don't count against the number of spells you know. With your Book of Shadows in hand, you can cast the chosen spells as rituals. You can't cast the spells except as rituals, unless you've learned them by some other means. You can also cast a warlock spell you know as a ritual if it has the ritual tag. 
 
On your adventures, you can add other ritual spells to your Book of Shadows. When you find such a spell, you can add it to the book if the spell's level is equal to or less than half your warlock level (rounded up) and if you can spare the time to transcribe the spell. For each level of the spell, the transcription process takes 2 hours and costs 50 gp for the rare inks needed to inscribe it. 
 
#### Chains of Carceri 
 
*Prerequisite: 15th level, Pact of the Chain feature* 
 
You can cast *hold monster* at will-targeting a celestial, fiend, or elemental-without expending a spell slot or material components. You must finish a long rest before you can use this invocation on the same creature again. 
 
#### Devil's Sight 
 
You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet. 
 
#### Dreadful Word 
 
*Prerequisite: 7th level* 
 
You can cast *confusion* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Eldritch Sight 
 
You can cast *detect magic* at will, without expending a spell slot. 
 
#### Eldritch Spear 
 
*Prerequisite:* eldritch blast *cantrip* 
 
When you cast *eldritch blast*, its range is 300 feet. 
 
#### Eyes of the Rune Keeper 
 
You can read all writing. 
 
#### Fiendish Vigor 
 
You can cast *false life* on yourself at will as a 1st-level spell, without expending a spell slot or material components. 
 
#### Gaze of Two Minds 
 
You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection, extending the duration until the end of your next turn. While perceiving through the other creature's senses, you benefit from any special senses possessed by that creature, and you are blinded and deafened to your own surroundings. 
 
#### Lifedrinker 
 
*Prerequisite: 12th level, Pact of the Blade feature* 
 
When you hit a creature with your pact weapon, the creature takes extra necrotic damage equal to your Charisma modifier (minimum 1). 
 
#### Mask of Many Faces 
 
You can cast *disguise self* at will, without expending a spell slot. 
 
#### Master of Myriad Forms 
 
*Prerequisite: 15th level* 
 
You can cast *alter self* at will, without expending a spell slot. 
 
#### Minions of Chaos 
 
*Prerequisite: 9th level* 
 
You can cast *conjure elemental* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Mire the Mind 
 
*Prerequisite: 5th level* 
 
You can cast *slow* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Misty Visions 
 
You can cast *silent image* at will, without expending a spell slot or material components. 
 
#### One with Shadows 
 
*Prerequisite: 5th level* 
 
When you are in an area of dim light or darkness, you can use your action to become invisible until you move or take an action or a reaction. 
 
#### Otherworldly Leap 
 
*Prerequisite: 9th level* 
 
You can cast *jump* on yourself at will, without expending a spell slot or material components. 
 
#### Repelling Blast 
 
*Prerequisite:* eldritch blast *cantrip* 
 
When you hit a creature with *eldritch blast*, you can push the creature up to 10 feet away from you in a straight line. 
 
#### Sculptor of Flesh 
 
*Prerequisite: 7th level* 
 
You can cast *polymorph* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Sign of Ill Omen 
 
*Prerequisite: 5th level* 
 
You can cast *bestow curse* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Thief of Five Fates 
 
You can cast *bane* once using a warlock spell slot. You can't do so again until you finish a long rest. 
 
#### Thirsting Blade 
 
*Prerequisite: 5th level, Pact of the Blade feature* 
 
You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn. 
 
#### Visions of Distant Realms 
 
*Prerequisite: 15th level* 
 
You can cast *arcane eye* at will, without expending a spell slot. 
 
#### Voice of the Chain Master 
 
*Prerequisite: Pact of the Chain feature* 
 
You can communicate telepathically with your familiar and perceive through your familiar's senses as long as you are on the same plane of existence. Additionally, while perceiving through your familiar's senses, you can also speak through your familiar in your own voice, even if your familiar is normally incapable of speech. 
 
#### Whispers of the Grave 
 
*Prerequisite: 9th level* 
 
You can cast *speak with dead* at will, without expending a spell slot. 
 
#### Witch Sight 
 
*Prerequisite: 15th level* 
 
You can see the true form of any shapechanger or creature concealed by illusion or transmutation magic while the creature is within 30 feet of you and within line of sight.`,
      },
      {
        level: 3,
        name: "Pact Boon",
        description: `At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice. 
 
#### Pact of the Chain 
 
You learn the *find familiar* spell and can cast it as a ritual. The spell doesn't count against your number of spells known. 
 
When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite. 
 
Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to make one attack of its own with its reaction. 
 
#### Pact of the Blade 
 
You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it. You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. 
 
Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die. 
 
You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can't affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks. 
 
#### Pact of the Tome 
 
Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class's spell list (the three needn't be from the same list). While the book is on your person, you can cast those cantrips at will. They don't count against your number of cantrips known. If they don't appear on the warlock spell list, they are nonetheless warlock spells for you. 
 
If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.


 
> ### Your Pact Boon 
> 
> Each Pact Boon option produces a special creature or an object that reflects your patron's nature. 
> 
> **_Pact of the Chain._** Your familiar is more cunning than a typical familiar. Its default form can be a reflection of your patron, with sprites and pseudodragons tied to the Archfey and imps and quasits tied to the Fiend. Because the Great Old One's nature is inscrutable, any familiar form is suitable for it. 
> 
> **_Pact of the Blade._** If your patron is the Archfey, your weapon might be a slender blade wrapped in leafy vines. If you serve the Fiend, your weapon could be an axe made of black metal and adorned with decorative flames. If your patron is the Great Old One, your weapon might be an ancient-looking spear, with a gemstone embedded in its head, carved to look like a terrible unblinking eye. 
> 
> **_Pact of the Tome._** Your Book of Shadows might be a fine, gilt-edged tome with spells of enchantment and illusion, gifted to you by the lordly Archfey. It could be a weighty tome bound in demon hide studded with iron, holding spells of conjuration and a wealth of forbidden lore about the sinister regions of the cosmos, a gift of the Fiend. Or it could be the tattered diary of a lunatic driven mad by contact with the Great Old One, holding scraps of spells that only your own burgeoning insanity allows you to understand and cast.`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 11,
        name: "Mystic Arcanum",
        description: `At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th- level spell from the warlock spell list as this arcanum. 
 
You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again. 
 
At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th- level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest.`,
      },
      {
        level: 20,
        name: "Eldritch Master",
        description: `At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature. Once you regain spell slots with this feature, you must finish a long rest before you can do so again.`,
      },
    ],
    subclasses: [
      {
        id: "the-fiend",
        name: "The Fiend",
        summary: `You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you. Fiends powerful enough to forge a pact include demon lords such as Demogorgon, Orcus, Fraz'Urb-luu, and Baphomet; archdevils such as Asmodeus, Dispater, Mephistopheles, and`,
        srdLicensed: true,
        resources: [
          {
            id: "warlock-dark-ones-own-luck",
            name: "Dark One's Own Luck",
            usesByLevel: { 6: 1 },
            shortRestRegain: "all",
          },
          {
            id: "warlock-hurl-through-hell",
            name: "Hurl Through Hell",
            usesByLevel: { 14: 1 },
          },
        ],
        features: [
          {
            level: 1,
            name: "Dark One's Blessing",
            description: `Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).`,
          },
          {
            level: 1,
            name: "Expanded Spell List",
            description: `The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you. 
 
**Fiend Expanded Spells (table)** 
 
| Spell Level | Spells                            | 
|-------------|-----------------------------------| 
| 1st         | burning hands, command            | 
| 2nd         | blindness/deafness, scorching ray | 
| 3rd         | fireball, stinking cloud          | 
| 4th         | fire shield, wall of fire         | 
| 5th         | flame strike, hallow              |`,
          },
          {
            level: 6,
            name: "Dark One's Own Luck",
            description: `Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur. 
 
Once you use this feature, you can't use it again until you finish a short or long rest.`,
          },
          {
            level: 10,
            name: "Fiendish Resilience",
            description: `Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.`,
          },
          {
            level: 14,
            name: "Hurl Through Hell",
            description: `Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape. 
 
At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience. 
 
Once you use this feature, you can't use it again until you finish a long rest.`,
          },
        ],
      },
    ],
  },
  {
    classId: "wizard",
    subclassLevel: 2,
    subclassLabel: "Arcane Tradition",
    asiLevels: [4, 8, 12, 16, 19],
    resources: [
      {
        id: "wizard-arcane-recovery",
        name: "Arcane Recovery",
        usesByLevel: { 1: 1 },
      },
    ],
    features: [
      {
        level: 1,
        name: "Arcane Recovery",
        description: `You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher. 
 
For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level spell slot or two 1st-level spell slots.`,
      },
      {
        level: 1,
        name: "Spellcasting",
        description: `As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power. 
 
#### Cantrips 
 
At 1st level, you know three cantrips of your choice from the wizard spell list. You learn additional wizard cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Wizard table. 
 
#### Spellbook 
 
At 1st level, you have a spellbook containing six 1st- level wizard spells of your choice. Your spellbook is the repository of the wizard spells you know, except your cantrips, which are fixed in your mind.
 
> ### Your Spellbook 
> 
> The spells that you add to your spellbook as you gain levels reflect the arcane research you conduct on your own, as well as intellectual breakthroughs you have had about the nature of the multiverse. You might find other spells during your adventures. You could discover a spell recorded on a scroll in an evil wizard's chest, for example, or in a dusty tome in an ancient library. 
> 
> **_Copying a Spell into the Book._** When you find a wizard spell of 1st level or higher, you can add it to your spellbook if it is of a spell level you can prepare and if you can spare the time to decipher and copy it. 
> 
> Copying that spell into your spellbook involves reproducing the basic form of the spell, then deciphering the unique system of notation used by the wizard who wrote it. You must practice the spell until you understand the sounds or gestures required, then transcribe it into your spellbook using your own notation. 
> 
> For each level of the spell, the process takes 2 hours and costs 50 gp. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it. Once you have spent this time and money, you can prepare the spell just like your other spells. 
> 
> **_Replacing the Book._** You can copy a spell from your own spellbook into another book-for example, if you want to make a backup copy of your spellbook. This is just like copying a new spell into your spellbook, but faster and easier, since you understand your own notation and already know how to cast the spell. You need spend only 1 hour and 10 gp for each level of the copied spell. 
> 
> If you lose your spellbook, you can use the same procedure to transcribe the spells that you have prepared into a new spellbook. Filling out the remainder of your spellbook requires you to find new spells to do so, as normal. For this reason, many wizards keep backup spellbooks in a safe place. 
> 
> **_The Book's Appearance._** Your spellbook is a unique compilation of spells, with its own decorative flourishes and margin notes. It might be a plain, functional leather volume that you received as a gift from your master, a finely bound gilt-edged tome you found in an ancient library, or even a loose collection of notes scrounged together after you lost your previous spellbook in a mishap.
 
#### Preparing and Casting Spells 
 
The Wizard table shows how many spell slots you have to cast your spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest. 
 
You prepare the list of wizard spells that are available for you to cast. To do so, choose a number of wizard spells from your spellbook equal to your Intelligence modifier + your wizard level (minimum of one spell). The spells must be of a level for which you have spell slots. 
 
For example, if you're a 3rd-level wizard, you have four 1st-level and two 2nd-level spell slots. With an Intelligence of 16, your list of prepared spells can include six spells of 1st or 2nd level, in any combination, chosen from your spellbook. If you prepare the 1st-level spell *magic missile,* you can cast it using a 1st-level or a 2nd-level slot. Casting the spell doesn't remove it from your list of prepared spells. 
 
You can change your list of prepared spells when you finish a long rest. Preparing a new list of wizard spells requires time spent studying your spellbook and memorizing the incantations and gestures you must make to cast the spell: at least 1 minute per spell level for each spell on your list. 
 
#### Spellcasting Ability 
 
Intelligence is your spellcasting ability for your wizard spells, since you learn your spells through dedicated study and memorization. You use your Intelligence whenever a spell refers to your spellcasting ability. In addition, you use your Intelligence modifier when setting the saving throw DC for a wizard spell you cast and when making an attack roll with one. 
 
**Spell save DC** = 8 + your proficiency bonus + your Intelligence modifier 
 
**Spell attack modifier** = your proficiency bonus + your Intelligence modifier 
 
#### Ritual Casting 
 
You can cast a wizard spell as a ritual if that spell has the ritual tag and you have the spell in your spellbook. You don't need to have the spell prepared. 
 
#### Spellcasting Focus 
 
You can use an arcane focus as a spellcasting focus for your wizard spells. 
 
#### Learning Spells of 1st Level and Higher 
 
Each time you gain a wizard level, you can add two wizard spells of your choice to your spellbook for free. Each of these spells must be of a level for which you have spell slots, as shown on the Wizard table. On your adventures, you might find other spells that you can add to your spellbook (see the “Your Spellbook” sidebar).`,
      },
      {
        level: 4,
        name: "Ability Score Improvement",
        description: `When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.`,
      },
      {
        level: 18,
        name: "Spell Mastery",
        description: `At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal. 
 
By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels.`,
      },
      {
        level: 20,
        name: "Signature Spells",
        description: `When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest. 
 
If you want to cast either spell at a higher level, you must expend a spell slot as normal.`,
      },
    ],
    subclasses: [
      {
        id: "school-of-evocation",
        name: "School of Evocation",
        summary: `You focus your study on magic that creates powerful elemental effects such as bitter cold, searing flame, rolling thunder, crackling lightning, and burning acid. Some evokers find employment in military forces, serving as artillery to blast enemy armies from afar. Others use their spectacular power to protect the weak, while some seek their own gain as bandits, adventurers, or aspiring tyrants.`,
        srdLicensed: true,
        resources: [
          {
            id: "wizard-overchannel",
            name: "Overchannel (safe use)",
            usesByLevel: { 14: 1 },
          },
        ],
        features: [
          {
            level: 2,
            name: "Evocation Savant",
            description: `Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.`,
          },
          {
            level: 2,
            name: "Sculpt Spells",
            description: `Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.`,
          },
          {
            level: 6,
            name: "Potent Cantrip",
            description: `Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.`,
          },
          {
            level: 10,
            name: "Empowered Evocation",
            description: `Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.`,
          },
          {
            level: 14,
            name: "Overchannel",
            description: `Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. 
 
The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.`,
          },
        ],
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 3, slots: [4, 2, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 3 },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 6, slots: [4, 3, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 7, slots: [4, 3, 3, 1, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 9, slots: [4, 3, 3, 3, 1, 0, 0, 0, 0], cantripsKnown: 4 },
      { level: 10, slots: [4, 3, 3, 3, 2, 0, 0, 0, 0], cantripsKnown: 5 },
      { level: 11, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 5 },
      { level: 12, slots: [4, 3, 3, 3, 2, 1, 0, 0, 0], cantripsKnown: 5 },
      { level: 13, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 5 },
      { level: 14, slots: [4, 3, 3, 3, 2, 1, 1, 0, 0], cantripsKnown: 5 },
      { level: 15, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 5 },
      { level: 16, slots: [4, 3, 3, 3, 2, 1, 1, 1, 0], cantripsKnown: 5 },
      { level: 17, slots: [4, 3, 3, 3, 2, 1, 1, 1, 1], cantripsKnown: 5 },
      { level: 18, slots: [4, 3, 3, 3, 3, 1, 1, 1, 1], cantripsKnown: 5 },
      { level: 19, slots: [4, 3, 3, 3, 3, 2, 1, 1, 1], cantripsKnown: 5 },
      { level: 20, slots: [4, 3, 3, 3, 3, 2, 2, 1, 1], cantripsKnown: 5 },
    ],
  },
];
