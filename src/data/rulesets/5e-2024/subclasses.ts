import { perLevel, type SubclassDetails } from "../nonSrdSubclasses";

/**
 * Non-SRD subclasses of the 2024 rules, as original-wording summaries of what
 * each feature does (mechanics and numbers, not the book's text). The SRD
 * subclass of each class lives in `classProgression.ts` with its full text.
 * Spell slots for "third-caster" subclasses (Eldritch Knight, Arcane
 * Trickster) are not modeled by this data -- see the Spells tab.
 */
export const SUBCLASSES_5E_2024: SubclassDetails = {
  barbarian: [
    {
      name: "Path of the Wild Heart",
      summary: "Draw on animal spirits for a different benefit each time you rage.",
      features: [
        [3, "Animal Speaker", "You can cast Beast Sense and Speak with Animals as rituals, using Wisdom."],
        [3, "Rage of the Wilds", "Each time you Rage, choose a spirit: Bear (resistance to every damage type except Force, Necrotic, Psychic and Radiant), Eagle (Dash as a Bonus Action and when you Rage), or Wolf (allies have Advantage on attacks against enemies within 5 ft of you)."],
        [6, "Aspect of the Wilds", "Permanent benefit of your choice: Owl (Darkvision 60 ft, or +60 ft if you have it), Panther (Climb Speed equal to your Speed), or Salmon (Swim Speed equal to your Speed)."],
        [10, "Nature Speaker", "You can cast Commune with Nature as a ritual, using Wisdom."],
        [14, "Power of the Wilds", "Each time you Rage, choose another spirit: Falcon (Fly Speed equal to your Speed while not in Heavy armor), Lion (enemies within 5 ft have Disadvantage on attacks against anyone but you), or Ram (on a melee hit, knock a Large or smaller target Prone)."],
      ],
    },
    {
      name: "Path of the World Tree",
      summary: "Channel the cosmic tree to heal allies, restrain foes and travel instantly.",
      features: [
        [3, "Vitality of the Tree", "When you Rage you gain Temporary Hit Points equal to your Barbarian level, and at the end of each of your turns while raging you can grant another creature within 10 ft Temporary Hit Points rolled on d6s (number equal to your Rage Damage bonus)."],
        [6, "Branches of the Tree", "When a creature you can see starts its turn within 30 ft while you Rage, use your Reaction to teleport it to an open space within 5 ft of you; it makes a Strength save or its Speed becomes 0 until the start of your next turn."],
        [10, "Battering Roots", "Your reach with Heavy or Versatile melee weapons increases by 10 ft, and you can apply the Push and Topple mastery properties of those weapons in addition to the weapon's own."],
        [14, "Travel Along the Tree", "When you Rage, and as a Bonus Action while raging, you can teleport up to 60 ft to an unoccupied space you can see; you can bring up to six willing creatures within 10 ft with you (once per Rage for the extra creatures)."],
      ],
    },
    {
      name: "Path of the Zealot",
      summary: "Fight with divine fury, fall without staying down.",
      features: [
        [3, "Divine Fury", "While raging, your first hit on each of your turns deals extra Necrotic or Radiant damage (your choice): 1d6 + half your Barbarian level (rounded down)."],
        [3, "Warrior of the Gods", "You have a pool of four d12s that you spend as a Bonus Action to regain Hit Points equal to the dice rolled. The pool grows to five at 6th level, six at 12th and seven at 17th, and refills on a Long Rest."],
        [6, "Fanatical Focus", "Once per Rage, when you fail a saving throw you can reroll it and must take the new result, adding your Rage Damage bonus."],
        [10, "Zealous Presence", "As a Bonus Action, up to ten creatures of your choice within 60 ft gain Advantage on attack rolls and saving throws until the start of your next turn. Once per Long Rest, or by expending a level 4+ spell slot."],
        [14, "Rage of the Gods", "When you Rage you can assume a divine form for 1 minute: Fly Speed equal to your Speed, resistance to Necrotic, Psychic and Radiant damage, and when you would drop to 0 Hit Points you drop to 1 instead (once per form). Once per Long Rest."],
      ],
      resources: [
        { id: "zealot-warrior-of-the-gods", name: "Warrior of the Gods (d12 healing dice)", usesByLevel: { 3: 4, 6: 5, 12: 6, 17: 7 }, isPointPool: true },
        { id: "zealot-zealous-presence", name: "Zealous Presence", usesByLevel: { 10: 1 } },
        { id: "zealot-rage-of-the-gods", name: "Rage of the Gods", usesByLevel: { 14: 1 } },
      ],
    },
  ],
  bard: [
    {
      name: "College of Dance",
      summary: "Unarmored performers who fight with graceful, inspiring footwork.",
      features: [
        [3, "Dazzling Footwork", "While unarmored and without a shield: Advantage on Performance checks that involve dancing, AC equals 10 + Dexterity + Charisma modifiers, and your Unarmed Strikes can use Dexterity and deal Bardic Inspiration-die damage (or 1d6 if higher) of Bludgeoning. When you use Bardic Inspiration you can make an Unarmed Strike as part of the same Bonus Action."],
        [6, "Inspiring Movement", "When an enemy ends its turn within 5 ft of you, use your Reaction and expend a Bardic Inspiration die to move half your Speed without provoking, and an ally within 30 ft can do the same."],
        [6, "Tandem Footwork", "When you roll Initiative you can expend a Bardic Inspiration die; you and allies within 30 ft who can see you add the roll to Initiative."],
        [14, "Leading Evasion", "When you are subjected to an effect that allows a Dexterity save for half damage, you take no damage on a success and half on a failure, and allies within 5 ft of you gain the same benefit."],
      ],
    },
    {
      name: "College of Glamour",
      summary: "Fey-touched performers who beguile, inspire and command.",
      features: [
        [3, "Beguiling Magic", "Charm Person and Mirror Image are always prepared. After you cast an Enchantment or Illusion spell, creatures of your choice within 30 ft make a Wisdom save or are Charmed or Frightened (your choice) for 1 minute. Once per Long Rest, or by expending a Bardic Inspiration die."],
        [3, "Mantle of Inspiration", "As a Bonus Action, expend a Bardic Inspiration die: a number of creatures up to your Charisma modifier within 60 ft gain Temporary Hit Points equal to twice the die roll and can use their Reaction to move up to their Speed without provoking."],
        [6, "Mantle of Majesty", "Command is always prepared. As a Bonus Action you take on an unearthly appearance for 1 minute, casting Command each turn as a Bonus Action without a spell slot. Once per Long Rest, or by expending a level 3+ slot."],
        [14, "Unbreakable Majesty", "As a Bonus Action you assume a majestic presence for 1 minute. Creatures that attack you first make a Charisma save or must choose a new target (or lose the attack); on a failure they also take Psychic damage. Once per Short or Long Rest."],
      ],
      resources: [
        { id: "glamour-beguiling-magic", name: "Beguiling Magic", usesByLevel: { 3: 1 } },
        { id: "glamour-mantle-of-majesty", name: "Mantle of Majesty", usesByLevel: { 6: 1 } },
        { id: "glamour-unbreakable-majesty", name: "Unbreakable Majesty", usesByLevel: { 14: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "College of Valor",
      summary: "Battle-bards who inspire with steel and song.",
      features: [
        [3, "Combat Inspiration", "A creature with your Bardic Inspiration die can add it to a weapon damage roll, or use their Reaction to add it to their AC against one attack (after seeing the roll)."],
        [3, "Martial Training", "You gain proficiency with Martial weapons and training with Medium armor and Shields, and you can use a weapon as a spellcasting focus."],
        [6, "Extra Attack", "You can attack twice instead of once whenever you take the Attack action; you can replace one of those attacks with a cantrip that has a casting time of one action."],
        [14, "Battle Magic", "After you cast a spell with a casting time of an action, you can make one weapon attack as a Bonus Action."],
      ],
    },
  ],
  cleric: [
    {
      name: "Light Domain",
      summary: "Wield radiance and fire to protect allies and burn away darkness.",
      features: [
        [3, "Light Domain Spells", "Always prepared: Burning Hands, Faerie Fire, Scorching Ray, See Invisibility (3rd); Daylight, Fireball (5th); Arcane Eye, Wall of Fire (7th); Flame Strike, Scrying (9th)."],
        [3, "Radiance of the Dawn", "Channel Divinity: dispel magical Darkness within 30 ft; enemies of your choice within 30 ft make a Constitution save, taking 2d10 + your Cleric level Radiant damage on a failure (half on a success)."],
        [3, "Warding Flare", "When a creature you can see within 30 ft attacks, use your Reaction to impose Disadvantage on the attack roll. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [6, "Improved Warding Flare", "You regain Warding Flare uses on a Short Rest too, and when you use it the target's ally or you gains Temporary Hit Points of 2d6 + your Wisdom modifier."],
        [17, "Corona of Light", "As an action, emit bright light in 60 ft for 1 minute; enemies in it have Disadvantage on saves against your Radiant or Fire spells. Once per Long Rest, or by expending a level 5+ slot."],
      ],
      resources: [
        { id: "light-warding-flare", name: "Warding Flare", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 3, minimum: 1 } },
        { id: "light-corona-of-light", name: "Corona of Light", usesByLevel: { 17: 1 } },
      ],
    },
    {
      name: "Trickery Domain",
      summary: "Masters of illusion, deception and misdirection.",
      features: [
        [3, "Trickery Domain Spells", "Always prepared: Charm Person, Disguise Self, Invisibility, Pass without Trace (3rd); Hypnotic Pattern, Nondetection (5th); Confusion, Dimension Door (7th); Dominate Person, Modify Memory (9th)."],
        [3, "Blessing of the Trickster", "As a Magic action, give yourself or a willing creature you touch Advantage on Dexterity (Stealth) checks for 1 hour or until you use this again."],
        [3, "Invoke Duplicity", "Channel Divinity: create an illusory duplicate of yourself within 30 ft for 1 minute (Concentration). You can cast spells as if in its space, and you and it have Advantage on attacks against a creature that is within 5 ft of both of you."],
        [6, "Trickster's Transposition", "When you create or move the duplicate (Bonus Action), you can teleport, swapping places with it."],
        [17, "Improved Duplicity", "You can create up to four duplicates with Invoke Duplicity, and when it ends you or a creature near a duplicate regains Hit Points."],
      ],
    },
    {
      name: "War Domain",
      summary: "Warrior-priests who blend martial skill with divine favor.",
      features: [
        [3, "War Domain Spells", "Always prepared: Guiding Bolt, Magic Weapon, Shield of Faith, Spiritual Weapon (3rd); Crusader's Mantle, Spirit Guardians (5th); Fire Shield, Freedom of Movement (7th); Hold Monster, Steel Wind Strike (9th)."],
        [3, "Martial Proficiency", "You gain proficiency with Martial weapons and training with Heavy armor."],
        [3, "War Priest", "When you take the Attack action, you can make one weapon attack as a Bonus Action. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [3, "Guided Strike", "Channel Divinity: when you or a creature within 30 ft makes an attack roll, add +10 to the roll (after seeing the die, before the result)."],
        [6, "War God's Blessing", "When you use Guided Strike you can instead cast Shield of Faith or Spiritual Weapon without a slot (Concentration)."],
        [17, "Avatar of Battle", "You have resistance to Bludgeoning, Piercing and Slashing damage."],
      ],
      resources: [
        { id: "war-war-priest", name: "War Priest", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 3, minimum: 1 } },
      ],
    },
  ],
  druid: [
    {
      name: "Circle of the Moon",
      summary: "Become a powerful beast in combat and heal with moonlight.",
      features: [
        [3, "Circle Forms", "When you Wild Shape: your AC is at least 13 + Wisdom modifier, you gain Temporary Hit Points equal to three times your Druid level, and you can transform into a beast with a CR up to your level divided by 3 (rounded down)."],
        [3, "Circle of the Moon Spells", "Always prepared: Cure Wounds, Moonbeam, Starry Wisp (3rd); Conjure Animals (5th); Fount of Moonlight (7th); Mass Cure Wounds (9th)."],
        [6, "Improved Circle Forms", "Your beast-form attacks deal Radiant damage if you choose, and you add your Wisdom modifier to Constitution saves while in a Wild Shape form."],
        [10, "Moonlight Step", "As a Bonus Action, teleport up to 30 ft to a space you can see and gain Advantage on your next attack before the end of the turn. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest, or by expending a level 2+ slot."],
        [14, "Lunar Form", "Once per turn, your Wild Shape attack deals an extra 2d10 Radiant damage, and you can bring another creature with you when you use Moonlight Step."],
      ],
      resources: [
        { id: "moon-moonlight-step", name: "Moonlight Step", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 10, minimum: 1 } },
      ],
    },
    {
      name: "Circle of the Sea",
      summary: "Command tides, storms and the cold depths.",
      features: [
        [3, "Wrath of the Sea", "As a Bonus Action, spend a use of Wild Shape to surround yourself with a 5-ft emanation of sea spray for 10 minutes. When it appears and as a Bonus Action later, one creature in it makes a Constitution save or takes Cold damage (d6s equal to your Wisdom modifier) and is pushed up to 15 ft."],
        [3, "Circle of the Sea Spells", "Always prepared: Fog Cloud, Gust of Wind, Ray of Frost, Shatter, Thunderwave (3rd); Lightning Bolt, Water Breathing (5th); Control Water, Ice Storm (7th); Conjure Elemental, Hold Monster (9th)."],
        [6, "Aquatic Affinity", "The Wrath of the Sea emanation grows to 10 ft, and you gain a Swim Speed equal to your Speed."],
        [10, "Stormborn", "While Wrath of the Sea is active you gain a Fly Speed equal to your Speed and resistance to Cold, Lightning and Thunder damage."],
        [14, "Oceanic Gift", "You can manifest Wrath of the Sea around another creature as well as yourself (using the same use of Wild Shape)."],
      ],
    },
    {
      name: "Circle of the Stars",
      summary: "Read the constellations to gain starry forms and omens.",
      features: [
        [3, "Star Map", "You have a star map: Guidance and Guiding Bolt are always prepared, and you can cast Guiding Bolt without a slot a number of times equal to your Wisdom modifier (minimum 1) per Long Rest."],
        [3, "Starry Form", "As a Bonus Action, spend a use of Wild Shape to shine with a constellation for 10 minutes. Archer: Bonus Action ranged spell attack for 1d8 + Wisdom Radiant damage. Chalice: when you cast a healing spell with a slot, you or another creature within 30 ft heals 1d8 + Wisdom. Dragon: treat a d20 roll of 9 or lower as 10 on Intelligence, Wisdom and Constitution (Concentration) checks."],
        [6, "Cosmic Omen", "After each Long Rest roll a die. Weal (even): Reaction to add 1d6 to an ally's d20 Test within 30 ft. Woe (odd): Reaction to subtract 1d6 from an enemy's d20 Test within 30 ft. Uses equal your Wisdom modifier (minimum 1)."],
        [10, "Twinkling Constellations", "Archer and Chalice dice become 2d8, Dragon gives you a Fly Speed of 20 ft (hover), and you can change your constellation at the start of each of your turns."],
        [14, "Full of Stars", "While in Starry Form you have resistance to Bludgeoning, Piercing and Slashing damage."],
      ],
      resources: [
        { id: "stars-guiding-bolt", name: "Guiding Bolt (free casts)", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 3, minimum: 1 } },
        { id: "stars-cosmic-omen", name: "Cosmic Omen", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 6, minimum: 1 } },
      ],
    },
  ],
  fighter: [
    {
      name: "Battle Master",
      summary: "Tactical combat expert who fuels special maneuvers with superiority dice.",
      features: [
        [3, "Combat Superiority", "You have four Superiority Dice (d8), becoming five at 7th level and six at 15th, and the die grows to d10 at 10th and d12 at 18th. You learn three maneuvers (five at 7th, seven at 10th, nine at 15th) and spend a die to use one. Maneuver save DC = 8 + proficiency bonus + Strength or Dexterity modifier. Dice return on a Short or Long Rest."],
        [3, "Student of War", "Proficiency with one type of Artisan's Tools and one Fighter skill."],
        [7, "Know Your Enemy", "As a Bonus Action, study a creature within 30 ft for 1 minute to learn whether it is your equal, superior or inferior in a few stats. Once per Long Rest, or by expending a Superiority Die."],
        [10, "Improved Combat Superiority", "Your Superiority Dice become d10s."],
        [15, "Relentless", "Once per turn, when you use a maneuver you can roll a d8 instead of expending a Superiority Die."],
        [18, "Ultimate Combat Superiority", "Your Superiority Dice become d12s."],
      ],
      resources: [
        { id: "battle-master-superiority-dice", name: "Superiority Dice", usesByLevel: { 3: 4, 7: 5, 15: 6 }, shortRestRegain: "all" },
        { id: "battle-master-know-your-enemy", name: "Know Your Enemy", usesByLevel: { 7: 1 } },
      ],
    },
    {
      name: "Eldritch Knight",
      summary: "Fighter who weaves wizard spells into swordplay.",
      features: [
        [3, "Spellcasting", "You cast Wizard spells using Intelligence. You know two cantrips and prepare a small list of 1st-level and higher spells as you level, using a third-caster slot progression."],
        [3, "War Bond", "You bond with up to two weapons through a Short Rest ritual. A bonded weapon can't be disarmed, and as a Bonus Action you can summon it to your hand from anywhere on the same plane."],
        [7, "War Magic", "When you take the Attack action you can replace one attack with a cantrip you cast as an action."],
        [10, "Eldritch Strike", "When you hit a creature with a weapon attack, it has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."],
        [15, "Arcane Charge", "When you use Action Surge, you can also teleport up to 30 ft to an unoccupied space you can see."],
        [18, "Improved War Magic", "When you take the Attack action you can replace two attacks with a spell of level 1 or 2 that has a casting time of one action."],
      ],
    },
    {
      name: "Psi Warrior",
      summary: "Channel psionic energy into protective fields, bonus force damage and telekinesis.",
      features: [
        [3, "Psionic Power", "You have Psionic Energy Dice equal to twice your proficiency bonus (d6s, growing to d8 at 5th, d10 at 11th and d12 at 17th). They return on a Long Rest and one returns on a Short Rest. Protective Field: Reaction to reduce damage to you or an ally within 30 ft by the die + Intelligence modifier. Psionic Strike: once per turn after a hit, deal extra Force damage of the die + Intelligence modifier. Telekinetic Movement: move an object or willing creature up to 30 ft, once per Long Rest or by expending a die."],
        [7, "Telekinetic Adept", "Psi-Powered Leap: Bonus Action to gain a Fly Speed of twice your Speed until the end of your turn (once per Short or Long Rest, or a die). Telekinetic Thrust: when you deal Psionic Strike damage, the target makes a Strength save or is knocked Prone or pushed 10 ft."],
        [10, "Guarded Mind", "You have resistance to Psychic damage, and at the start of each turn you can expend a Psionic Energy Die to end the Charmed or Frightened condition on yourself."],
        [15, "Bulwark of Force", "As a Bonus Action, choose up to your Intelligence modifier creatures within 30 ft; they gain Half Cover for 1 minute. Once per Long Rest, or by expending a die."],
        [18, "Telekinetic Master", "You can cast Telekinesis without a slot or components (Intelligence). While concentrating on it, you can make one weapon attack as a Bonus Action. Once per Long Rest."],
      ],
      resources: [
        { id: "psi-warrior-dice", name: "Psionic Energy Dice", usesByLevel: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, shortRestRegain: 1, isPointPool: true },
      ],
    },
  ],
  monk: [
    {
      name: "Warrior of Mercy",
      summary: "Masked healers and executioners who harm or mend with a touch.",
      features: [
        [3, "Hand of Harm", "Once per turn when you hit with an Unarmed Strike, spend 1 Focus Point to deal extra Necrotic damage equal to your Martial Arts die + Wisdom modifier."],
        [3, "Hand of Healing", "As a Magic action (or replacing one Flurry of Blows attack), spend 1 Focus Point to touch a creature and restore Hit Points equal to your Martial Arts die + Wisdom modifier."],
        [3, "Implements of Mercy", "Proficiency in Insight and Medicine and with the Herbalism Kit."],
        [6, "Physician's Touch", "Hand of Harm also leaves the target Poisoned until the end of your next turn, and Hand of Healing can also end one of: Blinded, Deafened, Paralyzed, Poisoned or Stunned."],
        [11, "Flurry of Healing and Harm", "When you use Flurry of Blows you can replace each Unarmed Strike with Hand of Healing at no Focus Point cost, and you apply Hand of Harm to each strike without spending Focus Points. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [17, "Hand of Ultimate Mercy", "As a Magic action, touch a creature that died within the last 24 hours to return it to life with 4d10 + Wisdom modifier Hit Points, ending most conditions. Once per Long Rest, or by spending 5 Focus Points."],
      ],
      resources: [
        { id: "mercy-flurry-healing-harm", name: "Flurry of Healing and Harm", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 11, minimum: 1 } },
        { id: "mercy-ultimate-mercy", name: "Hand of Ultimate Mercy", usesByLevel: { 17: 1 } },
      ],
    },
    {
      name: "Warrior of Shadow",
      summary: "Use darkness to hide, teleport and strike from the gloom.",
      features: [
        [3, "Shadow Arts", "You can see in Darkness (including magical) and gain Darkvision 60 ft (or +60 ft). Spend 1 Focus Point to cast Darkness, Darkvision, Pass without Trace or Silence without components, using Wisdom."],
        [3, "Shadowy Senses", "Your Darkvision improves and you can see through your own Darkness spell."],
        [6, "Shadow Step", "As a Bonus Action while in Dim Light or Darkness, teleport up to 60 ft to an unoccupied space in Dim Light or Darkness you can see. You have Advantage on the first melee attack you make before the end of the turn."],
        [11, "Improved Shadow Step", "You can spend 1 Focus Point to use Shadow Step without needing darkness at your destination, and you can make an Unarmed Strike as part of the teleport."],
        [17, "Cloak of Shadows", "As a Magic action, turn Invisible for 1 minute (ending if you make an attack or cast a spell) while in Dim Light or Darkness. Once per Long Rest, or by spending 3 Focus Points."],
      ],
      resources: [
        { id: "shadow-cloak-of-shadows", name: "Cloak of Shadows", usesByLevel: { 17: 1 } },
      ],
    },
    {
      name: "Warrior of the Elements",
      summary: "Wield the four elements with your fists and your body.",
      features: [
        [3, "Elemental Attunement", "As a Bonus Action spend 1 Focus Point to attune for 10 minutes (or until you end it or are Incapacitated): your Unarmed Strikes gain 10 ft of reach and can deal Acid, Cold, Fire, Lightning or Thunder damage, and a hit can push the target 10 ft or pull it 10 ft toward you."],
        [6, "Elemental Burst", "As a Magic action spend 2 Focus Points to unleash a 20-ft-radius sphere within 120 ft; creatures in it make a Dexterity save, taking three Martial Arts dice of damage of an element you choose (half on a success)."],
        [11, "Stride of the Elements", "While Elemental Attunement is active you gain a Fly Speed and a Swim Speed equal to your Speed."],
        [17, "Elemental Epitome", "While Elemental Attunement is active you gain resistance to one element (changeable each turn) and your Step of the Elements and Destructive Stride features gain bonus damage once per turn equal to a Martial Arts die."],
      ],
    },
  ],
  paladin: [
    {
      name: "Oath of Glory",
      summary: "Strive for heroic deeds and legendary athleticism.",
      features: [
        [3, "Oath of Glory Spells", "Always prepared: Guiding Bolt, Heroism, Enhance Ability, Magic Weapon (3rd); Haste, Protection from Energy (5th); Compulsion, Freedom of Movement (9th); Commune, Flame Strike (13th)."],
        [3, "Inspiring Smite", "Channel Divinity: immediately after you cast Divine Smite, distribute Temporary Hit Points of 2d8 + your Paladin level among creatures of your choice within 30 ft."],
        [3, "Peerless Athlete", "Channel Divinity: for 1 hour you have Advantage on Strength (Athletics) and Dexterity (Acrobatics) checks and your carrying capacity doubles and jump distance increases by 10 ft."],
        [7, "Aura of Alacrity", "Your Speed increases by 10 ft, and allies in your Aura of Protection gain a Speed increase of 10 ft until they leave it (and for their first round in it)."],
        [15, "Glorious Defense", "When you or a creature within 10 ft is hit by an attack, use your Reaction to add your Charisma modifier to AC for that attack, and if it misses you can make a weapon attack against the attacker. Uses equal your Charisma modifier; regained on a Long Rest."],
        [20, "Living Legend", "As a Bonus Action you gain Advantage on Charisma checks, can turn a missed attack into a hit once per turn, and can reroll a failed save once per use, for 1 minute. Once per Long Rest, or by expending a level 5 slot."],
      ],
      resources: [
        { id: "glory-glorious-defense", name: "Glorious Defense", usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 15, minimum: 1 } },
        { id: "glory-living-legend", name: "Living Legend", usesByLevel: { 20: 1 } },
      ],
    },
    {
      name: "Oath of the Ancients",
      summary: "Protect light and life with the power of nature.",
      features: [
        [3, "Oath of the Ancients Spells", "Always prepared: Ensnaring Strike, Speak with Animals (3rd); Misty Step, Moonbeam (5th); Plant Growth, Protection from Energy (9th); Ice Storm, Stoneskin (13th); Commune with Nature, Tree Stride (17th)."],
        [3, "Nature's Wrath", "Channel Divinity: spectral vines restrain a creature within 15 ft; it makes a Strength or Dexterity save or is Restrained for 1 minute, repeating the save at the end of each of its turns."],
        [7, "Aura of Warding", "You and allies in your Aura of Protection have resistance to damage from spells."],
        [15, "Undying Sentinel", "When you would drop to 0 Hit Points and not die outright, you drop to 1 instead. Once per Long Rest. You also suffer no drawbacks of aging."],
        [20, "Elder Champion", "As a Bonus Action, for 1 minute: you regain 10 Hit Points at the start of each turn, you can cast Paladin spells as a Bonus Action, and enemies within 10 ft have Disadvantage on saves against your spells and Channel Divinity. Once per Long Rest, or by expending a level 5 slot."],
      ],
      resources: [
        { id: "ancients-undying-sentinel", name: "Undying Sentinel", usesByLevel: { 15: 1 } },
        { id: "ancients-elder-champion", name: "Elder Champion", usesByLevel: { 20: 1 } },
      ],
    },
    {
      name: "Oath of Vengeance",
      summary: "Relentlessly hunt those who commit grave evil.",
      features: [
        [3, "Oath of Vengeance Spells", "Always prepared: Bane, Hunter's Mark (3rd); Hold Person, Misty Step (5th); Haste, Protection from Energy (9th); Banishment, Dimension Door (13th); Hold Monster, Scrying (17th)."],
        [3, "Vow of Enmity", "Channel Divinity: choose a creature within 30 ft; for 1 minute you have Advantage on attack rolls against it."],
        [7, "Relentless Avenger", "When you hit a creature with an Opportunity Attack, you can move up to half your Speed immediately after, without provoking Opportunity Attacks."],
        [15, "Soul of Vengeance", "When a creature under your Vow of Enmity makes an attack, you can use your Reaction to make a melee attack against it."],
        [20, "Avenging Angel", "As a Bonus Action, take wing-bearing form for 10 minutes: Fly Speed 60 ft and an aura of dread, so enemies that start their turn within 30 ft make a Wisdom save or are Frightened. Once per Long Rest, or by expending a level 5 slot."],
      ],
      resources: [
        { id: "vengeance-avenging-angel", name: "Avenging Angel", usesByLevel: { 20: 1 } },
      ],
    },
  ],
  ranger: [
    {
      name: "Beast Master",
      summary: "Bond with a primal animal companion that fights at your side.",
      features: [
        [3, "Primal Companion", "You summon a Beast of the Land, Sea or Sky (Medium, uses your proficiency bonus, HP = 5 + 5 per Ranger level). It obeys your commands, acts on your Initiative and can take the Help or Dodge action unless you command otherwise with a Bonus Action. You can revive it during a Long Rest."],
        [7, "Exceptional Training", "As a Bonus Action you can command your companion to Dash, Disengage, Dodge or Help, and its attacks count as Magical."],
        [11, "Bestial Fury", "Your companion can make two attacks when it takes the Attack action, and once per turn when it hits a target marked by your Hunter's Mark it deals extra Force damage (1d8)."],
        [15, "Share Spells", "When you cast a spell targeting only yourself, it also affects your companion if it is within 30 ft of you."],
      ],
    },
    {
      name: "Fey Wanderer",
      summary: "Wear the glamour of the Feywild and bend minds.",
      features: [
        [3, "Dreadful Strikes", "Once per turn when you hit with a weapon, deal extra Psychic damage: 1d4 (1d6 at 11th)."],
        [3, "Otherworldly Glamour", "Add your Wisdom modifier to Charisma checks (minimum +1), and gain proficiency in Deception, Performance or Persuasion."],
        [3, "Fey Wanderer Spells", "Always prepared: Charm Person (3rd); Misty Step (5th); Summon Fey (9th); Dimension Door (13th); Mislead (17th)."],
        [7, "Beguiling Twist", "You have Advantage on saves against being Charmed or Frightened. When a creature within 120 ft succeeds on such a save, use your Reaction to force another creature you can see within 120 ft to make a Wisdom save or be Charmed or Frightened (same condition) for 1 minute."],
        [11, "Fey Reinforcements", "You can cast Summon Fey without a Material component or slot once per Long Rest (without Concentration if you choose, for 1 minute)."],
        [15, "Misty Wanderer", "You can cast Misty Step without a slot a number of times equal to your Wisdom modifier per Long Rest, and bring a willing creature within 5 ft with you."],
      ],
      resources: [
        { id: "fey-wanderer-reinforcements", name: "Fey Reinforcements", usesByLevel: { 11: 1 } },
        { id: "fey-wanderer-misty-wanderer", name: "Misty Wanderer", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 15, minimum: 1 } },
      ],
    },
    {
      name: "Gloom Stalker",
      summary: "Hunter of the dark who strikes first and vanishes into shadow.",
      features: [
        [3, "Gloom Stalker Spells", "Always prepared: Disguise Self (3rd); Rope Trick (5th); Fear (9th); Greater Invisibility (13th); Seeming (17th)."],
        [3, "Dread Ambusher", "Add your Wisdom modifier to Initiative rolls. On your first turn of combat your Speed is +10 ft, and you can make one extra weapon attack as part of the Attack action; that attack deals an extra 2d8 damage on a hit."],
        [3, "Umbral Sight", "You gain Darkvision 60 ft (or +60 ft), and while in Darkness you are Invisible to creatures that rely on Darkvision to see you."],
        [7, "Iron Mind", "You gain proficiency in Wisdom saving throws (or Intelligence or Charisma saves if you already have it)."],
        [11, "Stalker's Flurry", "Once per turn when you miss with a weapon attack you can make another attack as part of the same action (or deal Psychic damage instead)."],
        [15, "Shadowy Dodge", "When a creature makes an attack roll against you without Advantage, use your Reaction to impose Disadvantage on it, then teleport up to 30 ft to an unoccupied space you can see."],
      ],
    },
  ],
  rogue: [
    {
      name: "Arcane Trickster",
      summary: "Rogue who layers illusions and enchantments into trickery.",
      features: [
        [3, "Spellcasting", "You cast Wizard spells using Intelligence, with two cantrips (one must be Mage Hand) and a small third-caster list of prepared spells."],
        [3, "Mage Hand Legerdemain", "Your Mage Hand is invisible and can stow or retrieve items, pick locks or disarm traps, and you can make a Sleight of Hand check to steal from a creature with it as a Bonus Action."],
        [9, "Magical Ambush", "If you are hidden when you cast a spell on a creature, it has Disadvantage on any saving throw against that spell this turn."],
        [13, "Versatile Trickster", "As a Bonus Action you can direct your Mage Hand to distract a creature within 5 ft of it, giving you Advantage on attacks against it until the end of your turn."],
        [17, "Spell Thief", "When a creature casts a spell that targets you or includes you in its area, use your Reaction to force a spellcasting ability save; on a failure the spell has no effect on you and you steal it for 8 hours. Once per Long Rest."],
      ],
      resources: [
        { id: "arcane-trickster-spell-thief", name: "Spell Thief", usesByLevel: { 17: 1 } },
      ],
    },
    {
      name: "Assassin",
      summary: "Master of ambush, infiltration and lethal strikes.",
      features: [
        [3, "Assassinate", "You have Advantage on Initiative rolls, and on the first turn of combat Advantage on attacks against any creature that hasn't acted yet. A hit on a creature that hasn't acted deals extra damage equal to your Rogue level."],
        [3, "Assassin's Tools", "You gain a Disguise Kit and a Poisoner's Kit, with proficiency in both."],
        [9, "Infiltration Expertise", "Masterful Mimicry lets you mimic another person's speech or handwriting after studying it; Roving Aim means your Speed isn't reduced when you use Steady Aim."],
        [13, "Envenom Weapons", "When you use Cunning Strike to apply Poison, the target takes an extra 2d6 Poison damage whenever it fails the save."],
        [17, "Death Strike", "When you hit with Sneak Attack on the first round of combat, the target makes a Constitution save (DC 8 + Dexterity modifier + proficiency bonus) or takes double damage from that attack."],
      ],
    },
    {
      name: "Soulknife",
      summary: "Wield psychic blades and psionic energy.",
      features: [
        [3, "Psionic Power", "You have Psionic Energy Dice equal to twice your proficiency bonus (d6s, d8 at 5th, d10 at 11th, d12 at 17th), returning on a Long Rest (one on a Short Rest). Psi-Bolstered Knack: add a die to a failed skill or tool check. Psychic Whispers: telepathy with creatures you can see within range for the die roll in hours."],
        [3, "Psychic Blades", "You can manifest a blade (1d6 + Dexterity Psychic, Finesse, thrown 60/120 ft) when you take the Attack action, and make a second blade attack as a Bonus Action (1d4)."],
        [9, "Soul Blades", "Homing Strikes: when a Psychic Blade attack misses, add a die to the roll. Psychic Teleportation: as a Bonus Action throw a blade and teleport to it, up to 10 ft times the die roll."],
        [13, "Psychic Veil", "As an action, turn Invisible for 1 hour or until you deal damage or force a save. Once per Long Rest, or by expending a die."],
        [17, "Rend Mind", "When you deal Sneak Attack damage with a Psychic Blade, the target makes a Wisdom save or is Stunned for 1 minute (repeating the save). Once per Long Rest, or by expending 3 dice."],
      ],
      resources: [
        { id: "soulknife-psionic-dice", name: "Psionic Energy Dice", usesByLevel: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, shortRestRegain: 1, isPointPool: true },
      ],
    },
  ],
  sorcerer: [
    {
      name: "Aberrant Sorcery",
      summary: "Psionic power from an alien mind.",
      features: [
        [3, "Telepathic Speech", "As a Bonus Action, speak telepathically to a creature within 30 ft for a number of minutes equal to your Sorcerer level."],
        [3, "Psionic Spells", "Always prepared: Arms of Hadar, Dissonant Whispers, Mind Sliver (3rd); Calm Emotions, Detect Thoughts (5th); Hunger of Hadar, Sending (7th); Evard's Black Tentacles, Summon Aberration (9th); Rary's Telepathic Bond, Telekinesis (11th)."],
        [6, "Psionic Sorcery", "Cast Psionic Spells by spending Sorcery Points equal to the spell level instead of a slot, with no Verbal or Somatic components."],
        [6, "Psychic Defenses", "You have resistance to Psychic damage and Advantage on saves against being Charmed or Frightened."],
        [14, "Revelation in Flesh", "As a Bonus Action for 10 minutes, spend 1+ Sorcery Points to gain: See Invisible, Fly Speed equal to your Speed, Swim Speed equal to your Speed, or the ability to squeeze through tiny gaps."],
        [18, "Warping Implosion", "As a Magic action, teleport up to 120 ft; creatures within 30 ft of where you were make a Strength save or take 3d10 Force damage and are pulled to that spot. Once per Long Rest, or by spending 5 Sorcery Points."],
      ],
      resources: [
        { id: "aberrant-warping-implosion", name: "Warping Implosion", usesByLevel: { 18: 1 } },
      ],
    },
    {
      name: "Clockwork Sorcery",
      summary: "Bring order and balance to the chaos of magic.",
      features: [
        [3, "Restore Balance", "When a creature you can see within 60 ft is about to make a d20 Test with Advantage or Disadvantage, use your Reaction to cancel it. Uses equal your proficiency bonus; regained on a Long Rest."],
        [3, "Clockwork Spells", "Always prepared: Alarm, Protection from Evil and Good (3rd); Aid, Lesser Restoration (5th); Dispel Magic, Protection from Energy (7th); Freedom of Movement, Summon Construct (9th); Greater Restoration, Wall of Force (11th)."],
        [6, "Bastion of Law", "As a Magic action, spend 1-5 Sorcery Points to create a ward of that many d8s around yourself or another creature; the ward absorbs damage by spending dice (roll them to reduce damage). It lasts until you finish a Long Rest."],
        [14, "Trance of Order", "As a Bonus Action for 1 minute, d20 rolls of 9 or lower count as 10 for your attack rolls, saving throws and ability checks. Once per Long Rest, or by spending 5 Sorcery Points."],
        [18, "Clockwork Cavalcade", "As a Magic action, summon spirits in a 30-ft cube: they restore up to 100 Hit Points of your choice among creatures there, repair damaged objects and end spells of level 6 or lower. Once per Long Rest, or by spending 7 Sorcery Points."],
      ],
      resources: [
        { id: "clockwork-restore-balance", name: "Restore Balance", usesByLevel: { 3: 2, 5: 3, 9: 4, 13: 5, 17: 6 } },
        { id: "clockwork-trance-of-order", name: "Trance of Order", usesByLevel: { 14: 1 } },
        { id: "clockwork-cavalcade", name: "Clockwork Cavalcade", usesByLevel: { 18: 1 } },
      ],
    },
    {
      name: "Wild Magic Sorcery",
      summary: "Chaotic magic that surges unpredictably.",
      features: [
        [3, "Wild Magic Surge", "When you cast a level 1+ spell, you can roll a d20; on a 1 roll on the Wild Magic Surge table for a random magical effect."],
        [3, "Tides of Chaos", "Gain Advantage on one d20 Test. Once you use it, you can't again until you trigger a Wild Magic Surge or finish a Long Rest."],
        [6, "Bend Luck", "When another creature makes a d20 Test, use your Reaction and spend 1 Sorcery Point to roll 1d4 and add or subtract it."],
        [14, "Controlled Chaos", "When you roll on the Wild Magic Surge table, roll twice and use either result."],
        [18, "Tamed Surge", "After you cast a spell that triggers a Wild Magic Surge, you may choose the effect instead of rolling. Once per Long Rest."],
      ],
      resources: [
        { id: "wild-magic-tides-of-chaos", name: "Tides of Chaos", usesByLevel: { 3: 1 } },
        { id: "wild-magic-tamed-surge", name: "Tamed Surge", usesByLevel: { 18: 1 } },
      ],
    },
  ],
  warlock: [
    {
      name: "Archfey Patron",
      summary: "A fey lord's gifts of charm, teleportation and illusion.",
      features: [
        [3, "Archfey Spells", "Always prepared: Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep (3rd); Blink, Plant Growth (5th); Dominate Beast, Greater Invisibility (7th); Dominate Person, Seeming (9th)."],
        [3, "Steps of the Fey", "You can cast Misty Step without a slot a number of times equal to your Charisma modifier per Long Rest. Refreshing Step: gain Temporary Hit Points (1d10). Taunting Step: creatures within 5 ft of your destination make a Wisdom save or have Disadvantage on attacks against anyone but you."],
        [6, "Misty Escape", "When you take damage, use your Reaction to cast Misty Step and, if you do, become Invisible until the start of your next turn. Once per Long Rest, or by expending a Pact Magic slot."],
        [10, "Beguiling Defenses", "You are immune to the Charmed condition. When a creature tries to charm you, use your Reaction to force a Wisdom save; on a failure, it is Charmed by you for 1 minute."],
        [14, "Bewitching Magic", "After you cast an Enchantment or Illusion spell using a spell slot, you can cast Misty Step as part of the same action without expending a slot."],
      ],
      resources: [
        { id: "archfey-steps-of-the-fey", name: "Steps of the Fey (Misty Step)", usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 3, minimum: 1 } },
        { id: "archfey-misty-escape", name: "Misty Escape", usesByLevel: { 6: 1 } },
      ],
    },
    {
      name: "Celestial Patron",
      summary: "Radiant power and healing from a celestial being.",
      features: [
        [3, "Celestial Spells", "Always prepared: Aid, Cure Wounds, Guiding Bolt, Lesser Restoration, Light, Sacred Flame (3rd); Daylight, Revivify (5th); Guardian of Faith, Wall of Fire (7th); Greater Restoration, Summon Celestial (9th)."],
        [3, "Healing Light", "You have a pool of d6s equal to 1 + your Warlock level. As a Bonus Action, spend up to your Charisma modifier dice to heal a creature within 60 ft. The pool refills on a Long Rest."],
        [6, "Radiant Soul", "You have resistance to Radiant damage, and when you deal Radiant or Fire damage with a spell you add your Charisma modifier to one damage roll."],
        [10, "Celestial Resilience", "You gain Temporary Hit Points equal to your Warlock level + Charisma modifier after a Short or Long Rest, and up to five allies of your choice gain half that amount."],
        [14, "Searing Vengeance", "When you make a Death saving throw, you can spring up with Hit Points equal to half your maximum, and creatures within 30 ft take Radiant damage and are Blinded until the end of the turn. Once per Long Rest."],
      ],
      resources: [
        { id: "celestial-healing-light", name: "Healing Light (d6 pool)", usesByLevel: perLevel(3, 20, (level) => level + 1), isPointPool: true },
        { id: "celestial-searing-vengeance", name: "Searing Vengeance", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "Great Old One Patron",
      summary: "Psychic power from an unfathomable entity.",
      features: [
        [3, "Great Old One Spells", "Always prepared: Detect Thoughts, Dissonant Whispers, Phantasmal Force, Tasha's Hideous Laughter, Mind Sliver (3rd); Clairvoyance, Hunger of Hadar (5th); Confusion, Summon Aberration (7th); Modify Memory, Telekinesis (9th)."],
        [3, "Psychic Spells", "When you cast a Warlock spell that deals Necrotic, Radiant or Fire damage, you can choose Psychic damage instead, and you can cast Enchantment and Illusion spells without Verbal or Somatic components."],
        [3, "Awakened Mind", "You can communicate telepathically with a creature within 30 ft that you can see."],
        [6, "Clairvoyant Combatant", "When you attack a creature you can read its thoughts: it must make a Wisdom save or you gain Advantage on attacks against it and it has Disadvantage on attacks against you for 1 minute. Once per Short or Long Rest, or by expending a Pact Magic slot."],
        [10, "Eldritch Hex", "Your Hex also gives the target Disadvantage on saves of the chosen ability."],
        [10, "Thought Shield", "You have resistance to Psychic damage and, when a creature deals Psychic damage to you, it takes the same damage."],
        [14, "Create Thrall", "As a Magic action, touch an Incapacitated Humanoid to Charm it permanently, until Remove Curse or similar ends it."],
      ],
      resources: [
        { id: "great-old-one-clairvoyant-combatant", name: "Clairvoyant Combatant", usesByLevel: { 6: 1 }, shortRestRegain: "all" },
      ],
    },
  ],
  wizard: [
    {
      name: "Abjurer",
      summary: "Protective magic that wards you and your allies.",
      features: [
        [3, "Abjuration Savant", "Add two Abjuration spells of level 2 or lower to your spellbook for free, and one more each time you gain a spell level."],
        [3, "Arcane Ward", "After casting an Abjuration spell using a slot, create a ward with Hit Points equal to twice your Wizard level + Intelligence modifier. It absorbs damage for you; casting Abjuration spells restores it (2 HP per slot level)."],
        [6, "Projected Ward", "When a creature within 30 ft takes damage, use your Reaction to have your Arcane Ward absorb it."],
        [10, "Spell Breaker", "You always have Counterspell and Dispel Magic prepared. Casting Dispel Magic is a Bonus Action, and you add your proficiency bonus to its ability check. You can cast each once without a slot per Long Rest."],
        [14, "Spell Resistance", "You have Advantage on saving throws against spells and resistance to damage from spells."],
      ],
      resources: [
        { id: "abjurer-spell-breaker", name: "Spell Breaker (free casts)", usesByLevel: { 10: 1 } },
      ],
    },
    {
      name: "Diviner",
      summary: "See the future and bend fate with rolled omens.",
      features: [
        [3, "Divination Savant", "Add two Divination spells of level 2 or lower to your spellbook for free, and one more each time you gain a spell level."],
        [3, "Portent", "After a Long Rest, roll two d20s and record them. Replace any d20 Test made by you or a creature you can see with one of these rolls (you must do so before the roll). At 14th level you roll three dice."],
        [6, "Expert Divination", "When you cast a Divination spell of level 2 or higher, you regain one expended spell slot of a lower level (max 5th)."],
        [10, "The Third Eye", "As a Bonus Action, gain Darkvision 120 ft, Greater Comprehension (read any language), or See Invisibility, until you rest. Once per Short or Long Rest."],
        [14, "Greater Portent", "You roll a third d20 for Portent."],
      ],
      resources: [
        { id: "diviner-portent", name: "Portent dice", usesByLevel: { 3: 2, 14: 3 } },
        { id: "diviner-third-eye", name: "The Third Eye", usesByLevel: { 10: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "Illusionist",
      summary: "Weave illusions and bring them to life.",
      features: [
        [3, "Illusion Savant", "Add two Illusion spells of level 2 or lower to your spellbook for free, and one more each time you gain a spell level."],
        [3, "Improved Illusions", "Illusion spells you cast have their range doubled for spells with 10+ ft range, and Minor Illusion can create both a sound and an image with one casting (as a Bonus Action for Minor Illusion)."],
        [6, "Phantasmal Creatures", "Summon Beast and Summon Fey are always prepared. Once per Long Rest you can cast either without a slot; the creature has half its usual Hit Points and the spell doesn't require Concentration but lasts 1 hour."],
        [10, "Illusory Self", "When a creature attacks you, use your Reaction to make that attack automatically miss, as you vanish and reappear. Once per Short or Long Rest, or by expending a level 2+ slot."],
        [14, "Illusory Reality", "When you cast an Illusion spell of level 1+, you can choose one inanimate nonmagical object in the illusion to be real for 1 minute."],
      ],
      resources: [
        { id: "illusionist-phantasmal-creatures", name: "Phantasmal Creatures (free cast)", usesByLevel: { 6: 1 } },
        { id: "illusionist-illusory-self", name: "Illusory Self", usesByLevel: { 10: 1 }, shortRestRegain: "all" },
      ],
    },
  ],
};
