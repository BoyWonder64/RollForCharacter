import { perLevel, type SubclassDetails } from "../nonSrdSubclasses";

/**
 * Non-SRD subclasses of the 2014 rules, as original-wording summaries of what
 * each feature does (mechanics and numbers, not the book's text). The SRD
 * subclass of each class lives in `classProgression.ts` with its full text.
 * Classes not listed here fall back to name-only entries from
 * `nonSrdSubclasses.ts` until their features are written.
 */

/** Wisdom-modifier uses per Long Rest, minimum 1, from the level the feature is gained. */
const wisdomUses = (id: string, name: string, level: number) => ({
  id,
  name,
  usesFromAbilityModifier: { ability: "wisdom" as const, grantedAtLevel: level, minimum: 1 },
});

const PROFICIENCY_USES = { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 };

export const SUBCLASSES_5E: SubclassDetails = {
  cleric: [
    {
      name: "Knowledge Domain",
      summary: "Gods of learning and secrets.",
      features: [
        [1, "Knowledge Domain Spells", "Always prepared: Command, Identify (1st); Augury, Suggestion (3rd); Nondetection, Speak with Dead (5th); Arcane Eye, Confusion (7th); Legend Lore, Scrying (9th)."],
        [1, "Blessings of Knowledge", "You learn two languages of your choice and become proficient in two of Arcana, History, Nature or Religion; your proficiency bonus is doubled for checks with those skills."],
        [2, "Channel Divinity: Knowledge of the Ages", "As an action, choose a skill or tool and gain proficiency with it for 10 minutes."],
        [6, "Channel Divinity: Read Thoughts", "As an action, choose a creature within 60 ft that you can see; it makes a Wisdom save or you read its surface thoughts. While you do, you can cast Suggestion on it without a slot, and the target has Disadvantage on the save."],
        [8, "Potent Spellcasting", "Add your Wisdom modifier to the damage of any Cleric cantrip."],
        [17, "Visions of the Past", "After a minute of meditation holding an object or standing in a place, you see visions of its past events, such as who held it or what happened there. The vision lasts up to 1 minute. Once per Short or Long Rest."],
      ],
      resources: [{ id: "knowledge-visions-of-the-past", name: "Visions of the Past", usesByLevel: { 17: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "Light Domain",
      summary: "Gods of fire, radiance and truth.",
      features: [
        [1, "Light Domain Spells", "Always prepared: Burning Hands, Faerie Fire (1st); Flaming Sphere, Scorching Ray (3rd); Daylight, Fireball (5th); Guardian of Faith, Wall of Fire (7th); Flame Strike, Scrying (9th)."],
        [1, "Bonus Cantrip", "You learn the Light cantrip."],
        [1, "Warding Flare", "When a creature you can see within 30 ft attacks you, use your Reaction to impose Disadvantage on the roll. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [2, "Channel Divinity: Radiance of the Dawn", "As an action, dispel magical Darkness within 30 ft; hostile creatures within 30 ft make a Constitution save, taking 2d10 + your Cleric level Radiant damage on a failure (half on a success). Creatures with total cover are unaffected."],
        [6, "Improved Flare", "You can use Warding Flare to protect a creature within 30 ft as well as yourself."],
        [8, "Potent Spellcasting", "Add your Wisdom modifier to the damage of any Cleric cantrip."],
        [17, "Corona of Light", "As an action, emit sunlight (60 ft bright, 30 ft dim) for 1 minute; enemies in the bright light have Disadvantage on saves against your Fire or Radiant spells."],
      ],
      resources: [wisdomUses("light-warding-flare", "Warding Flare", 1)],
    },
    {
      name: "Nature Domain",
      summary: "Gods of the wilds, beasts and seasons.",
      features: [
        [1, "Nature Domain Spells", "Always prepared: Animal Friendship, Speak with Animals (1st); Barkskin, Spike Growth (3rd); Plant Growth, Wind Wall (5th); Dominate Beast, Grasping Vine (7th); Insect Plague, Tree Stride (9th)."],
        [1, "Acolyte of Nature", "You learn one Druid cantrip and gain proficiency in one of Animal Handling, Nature or Survival."],
        [1, "Bonus Proficiency", "You gain proficiency with Heavy armor."],
        [2, "Channel Divinity: Charm Animals and Plants", "As an action, creatures within 30 ft that are Beasts or Plants make a Wisdom save or are Charmed by you for 1 minute (ending if you or allies harm them)."],
        [6, "Dampen Elements", "When you or a creature within 30 ft takes Acid, Cold, Fire, Lightning or Thunder damage, use your Reaction to grant resistance to that instance of damage."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Cold, Fire or Lightning damage (2d8 at 14th level)."],
        [17, "Master of Nature", "As a Bonus Action, command Beasts and Plants Charmed by your Charm Animals and Plants (as long as you can see them) to take actions."],
      ],
    },
    {
      name: "Tempest Domain",
      summary: "Gods of storm, sea and thunder.",
      features: [
        [1, "Tempest Domain Spells", "Always prepared: Fog Cloud, Thunderwave (1st); Gust of Wind, Shatter (3rd); Call Lightning, Sleet Storm (5th); Control Water, Ice Storm (7th); Destructive Wave, Insect Plague (9th)."],
        [1, "Bonus Proficiencies", "Proficiency with Martial weapons and Heavy armor."],
        [1, "Wrath of the Storm", "When a creature within 5 ft hits you, use your Reaction to make it take 2d8 Lightning or Thunder damage (Dexterity save for half). Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [2, "Channel Divinity: Destructive Wrath", "When you roll Lightning or Thunder damage, you can deal maximum damage instead of rolling."],
        [6, "Thunderbolt Strike", "When you deal Lightning damage to a Large or smaller creature, you can push it up to 10 ft away."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Thunder damage (2d8 at 14th level)."],
        [17, "Stormborn", "While outdoors and not underground, you have a Fly Speed equal to your current walking Speed."],
      ],
      resources: [wisdomUses("tempest-wrath-of-the-storm", "Wrath of the Storm", 1)],
    },
    {
      name: "Trickery Domain",
      summary: "Gods of mischief, illusion and rebellion.",
      features: [
        [1, "Trickery Domain Spells", "Always prepared: Charm Person, Disguise Self (1st); Mirror Image, Pass without Trace (3rd); Blink, Dispel Magic (5th); Dimension Door, Polymorph (7th); Dominate Person, Modify Memory (9th)."],
        [1, "Blessing of the Trickster", "As an action, touch a willing creature other than yourself to give it Advantage on Dexterity (Stealth) checks for 1 hour or until you use this again."],
        [2, "Channel Divinity: Invoke Duplicity", "As an action, create an illusory duplicate of yourself within 30 ft for 1 minute (Concentration). You can cast spells as though standing in its space, and you and the duplicate have Advantage on attacks against a creature adjacent to both."],
        [6, "Channel Divinity: Cloak of Shadows", "As an action, become Invisible until the end of your next turn (ends if you attack or cast a spell)."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Poison damage (2d8 at 14th level)."],
        [17, "Improved Duplicity", "You can create up to four duplicates; as a Bonus Action you can move any number of them up to 30 ft."],
      ],
    },
    {
      name: "War Domain",
      summary: "Gods of battle, valor and conquest.",
      features: [
        [1, "War Domain Spells", "Always prepared: Divine Favor, Shield of Faith (1st); Magic Weapon, Spiritual Weapon (3rd); Crusader's Mantle, Spirit Guardians (5th); Freedom of Movement, Stoneskin (7th); Flame Strike, Hold Monster (9th)."],
        [1, "Bonus Proficiencies", "Proficiency with Martial weapons and Heavy armor."],
        [1, "War Priest", "When you take the Attack action, you can make one weapon attack as a Bonus Action. Uses equal your Wisdom modifier (minimum 1); regained on a Short or Long Rest."],
        [2, "Channel Divinity: Guided Strike", "When you make an attack roll, add +10 to it (after seeing the die, before the result)."],
        [6, "Channel Divinity: War God's Blessing", "When a creature within 30 ft makes an attack roll, use your Reaction to grant it a +10 bonus."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 damage of the weapon's type (2d8 at 14th level)."],
        [17, "Avatar of Battle", "You have resistance to Bludgeoning, Piercing and Slashing damage from nonmagical weapons."],
      ],
      resources: [{ ...wisdomUses("war-war-priest", "War Priest", 1), shortRestRegain: "all" }],
    },
    {
      name: "Arcana Domain",
      summary: "Gods of magic itself.",
      features: [
        [1, "Arcana Domain Spells", "Always prepared: Detect Magic, Magic Missile (1st); Magic Weapon, Nystul's Magic Aura (3rd); Dispel Magic, Magic Circle (5th); Arcane Eye, Leomund's Secret Chest (7th); Planar Binding, Teleportation (9th)."],
        [1, "Arcane Initiate", "You gain proficiency in Arcana (with doubled bonus) and learn two Wizard cantrips of your choice, which count as Cleric cantrips."],
        [2, "Channel Divinity: Arcane Abjuration", "As an action, a celestial, elemental, fey or fiend within 30 ft makes a Wisdom save or is turned for 1 minute; one whose CR is low enough (1/2 at 2nd level, rising with level) is instead banished to its home plane."],
        [6, "Spell Breaker", "When you restore Hit Points to an ally with a spell of 1st level or higher, you can also end one spell of level equal to or less than the slot used on that creature."],
        [8, "Potent Spellcasting", "Add your Wisdom modifier to the damage of any Cleric cantrip."],
        [17, "Arcane Mastery", "Choose four Wizard spells (one each of 6th, 7th, 8th and 9th level); they count as Cleric spells for you and are always prepared."],
      ],
    },
    {
      name: "Forge Domain",
      summary: "Gods of craft, metal and fire.",
      features: [
        [1, "Forge Domain Spells", "Always prepared: Identify, Searing Smite (1st); Heat Metal, Magic Weapon (3rd); Elemental Weapon, Protection from Energy (5th); Fabricate, Wall of Fire (7th); Animate Objects, Creation (9th)."],
        [1, "Bonus Proficiencies", "Proficiency with Heavy armor and Smith's Tools."],
        [1, "Blessing of the Forge", "At the end of a Long Rest, touch a nonmagical weapon or armor to give it a +1 bonus to attack and damage (weapon) or AC (armor) until your next Long Rest."],
        [2, "Channel Divinity: Artisan's Blessing", "During a 1-hour ritual, create a nonmagical metal item worth up to 100 gp (e.g. tools, armor, weapons) from metal you provide."],
        [6, "Soul of the Forge", "You have resistance to Fire damage, and while wearing Heavy armor you gain +1 AC."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Fire damage (2d8 at 14th level)."],
        [17, "Saint of Forge and Fire", "You are immune to Fire damage, and while wearing Heavy armor you have resistance to nonmagical Bludgeoning, Piercing and Slashing damage."],
      ],
    },
    {
      name: "Grave Domain",
      summary: "Gods of the boundary between life and death.",
      features: [
        [1, "Grave Domain Spells", "Always prepared: Bane, False Life (1st); Gentle Repose, Ray of Enfeeblement (3rd); Revivify, Vampiric Touch (5th); Blight, Death Ward (7th); Antilife Shell, Raise Dead (9th)."],
        [1, "Circle of Mortality", "When you would roll healing dice for a spell on a creature at 0 Hit Points, use the maximum instead. You also learn the Spare the Dying cantrip, and can cast it as a Bonus Action at 30 ft range."],
        [1, "Eyes of the Grave", "As an action, sense the location of undead within 60 ft that aren't behind total cover (not warded by Hallow-like effects) until the end of your next turn. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [2, "Channel Divinity: Path to the Grave", "As an action, curse a creature within 30 ft; the next attack against it before the end of your next turn counts as if the creature were vulnerable to all damage from that attack."],
        [6, "Sentinel at Death's Door", "When a creature within 30 ft takes a Critical Hit, use your Reaction to turn it into a normal hit. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [8, "Potent Spellcasting", "Add your Wisdom modifier to the damage of any Cleric cantrip."],
        [17, "Keeper of Souls", "Once per turn when an enemy dies within 60 ft, you or an ally within 60 ft regains Hit Points equal to the enemy's Hit Dice."],
      ],
      resources: [
        wisdomUses("grave-eyes-of-the-grave", "Eyes of the Grave", 1),
        wisdomUses("grave-sentinel-at-death", "Sentinel at Death's Door", 6),
      ],
    },
    {
      name: "Order Domain",
      summary: "Gods of law, discipline and obedience.",
      features: [
        [1, "Order Domain Spells", "Always prepared: Command, Heroism (1st); Hold Person, Zone of Truth (3rd); Mass Healing Word, Slow (5th); Compulsion, Locate Creature (7th); Commune, Dominate Person (9th)."],
        [1, "Bonus Proficiencies", "Proficiency with Heavy armor and in Intimidation or Persuasion."],
        [1, "Voice of Authority", "When you cast a spell of 1st level or higher on an ally, that ally can use its Reaction to make one weapon attack against a creature of your choice you can see."],
        [2, "Channel Divinity: Order's Demand", "As an action, creatures of your choice within 30 ft that can see or hear you make a Wisdom save or are Charmed until the end of your next turn, dropping what they hold."],
        [6, "Embodiment of the Law", "When you cast an Enchantment spell with a 1-action casting time, you can cast it as a Bonus Action instead. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Psychic damage (2d8 at 14th level)."],
        [17, "Order's Wrath", "Once per turn when you deal Divine Strike damage, you curse the target; the next time an ally hits it, the ally deals extra 2d8 Psychic damage and the curse ends."],
      ],
      resources: [wisdomUses("order-embodiment-of-the-law", "Embodiment of the Law", 6)],
    },
    {
      name: "Peace Domain",
      summary: "Gods of harmony and bonds between people.",
      features: [
        [1, "Peace Domain Spells", "Always prepared: Heroism, Sanctuary (1st); Aid, Warding Bond (3rd); Beacon of Hope, Sending (5th); Aura of Purity, Otiluke's Resilient Sphere (7th); Greater Restoration, Rary's Telepathic Bond (9th)."],
        [1, "Implement of Peace", "You gain proficiency in Insight, Performance or Persuasion (your choice)."],
        [1, "Emboldening Bond", "As an action, bond up to your proficiency bonus creatures within 30 ft for 10 minutes; each can add 1d4 to an attack roll, ability check or saving throw once per turn while within 30 ft of another bonded creature. Uses equal your proficiency bonus; regained on a Long Rest."],
        [2, "Channel Divinity: Balm of Peace", "As an action, move up to your Speed without provoking Opportunity Attacks, and heal any creature you pass within 5 ft for 2d6 + your Wisdom modifier Hit Points (once per creature)."],
        [6, "Protective Bond", "When a bonded creature is about to take damage, another bonded creature within 30 ft can use its Reaction to teleport next to it and take the damage instead."],
        [8, "Potent Spellcasting", "Add your Wisdom modifier to the damage of any Cleric cantrip."],
        [17, "Expansive Bond", "Emboldening Bond and Protective Bond now work at 60 ft, and resistance to the damage taken is shared when a bonded creature uses Protective Bond."],
      ],
      resources: [{ id: "peace-emboldening-bond", name: "Emboldening Bond", usesByLevel: PROFICIENCY_USES }],
    },
    {
      name: "Twilight Domain",
      summary: "Gods of the border between day and night.",
      features: [
        [1, "Twilight Domain Spells", "Always prepared: Faerie Fire, Sleep (1st); Moonbeam, See Invisibility (3rd); Aura of Vitality, Leomund's Tiny Hut (5th); Aura of Life, Greater Invisibility (7th); Circle of Power, Mislead (9th)."],
        [1, "Bonus Proficiencies", "Proficiency with Martial weapons and Heavy armor."],
        [1, "Eyes of Night", "You have Darkvision 300 ft, and as an action you can share it with creatures within 10 ft for 1 hour. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [1, "Vigilant Blessing", "As an action, touch a creature (not yourself) to give it Advantage on its next Initiative roll; the effect ends when it rolls."],
        [2, "Channel Divinity: Twilight Sanctuary", "As an action, create a 30-ft-radius sphere of twilight around you for 1 minute. When a creature ends its turn there, it gains Temporary Hit Points (1d6 + your Cleric level) or ends the Charmed or Frightened condition."],
        [6, "Steps of Night", "While in Dim Light or Darkness, use a Bonus Action to gain a Fly Speed equal to your walking Speed for 1 minute. Uses equal your proficiency bonus; regained on a Long Rest."],
        [8, "Divine Strike", "Once per turn when you hit with a weapon, deal extra 1d8 Radiant damage (2d8 at 14th level)."],
        [17, "Twilight Shroud", "You and allies in your Twilight Sanctuary have Half Cover while inside it."],
      ],
      resources: [
        wisdomUses("twilight-eyes-of-night", "Eyes of Night", 1),
        { id: "twilight-steps-of-night", name: "Steps of Night", usesByLevel: { 6: 3, 9: 4, 13: 5, 17: 6 } },
      ],
    },
  ],
  sorcerer: [
    {
      name: "Wild Magic",
      summary: "Chaotic magic that surges unpredictably.",
      features: [
        [1, "Wild Magic Surge", "After you cast a spell of 1st level or higher, the DM may have you roll a d20; on a 1 roll on the Wild Magic Surge table for a random effect."],
        [1, "Tides of Chaos", "Gain Advantage on one attack roll, ability check or saving throw. You regain it after a Long Rest, or whenever the DM has you roll on the Wild Magic Surge table after casting a spell."],
        [6, "Bend Luck", "When another creature you can see makes an attack roll, ability check or saving throw, use your Reaction and spend 2 Sorcery Points to roll 1d4 and add or subtract it."],
        [14, "Controlled Chaos", "When you roll on the Wild Magic Surge table, roll twice and use either result."],
        [18, "Spell Bombardment", "Once per turn when you roll the highest number on a die for a spell's damage, roll that die again and add it."],
      ],
      resources: [{ id: "wild-magic-tides-of-chaos", name: "Tides of Chaos", usesByLevel: { 1: 1 } }],
    },
    {
      name: "Divine Soul",
      summary: "Divine heritage that blends cleric magic into your own.",
      features: [
        [1, "Divine Magic", "Your Sorcerer spell list also includes the Cleric list. You also learn an affinity spell based on alignment: Good - Cure Wounds, Evil - Inflict Wounds, Lawful - Bless, Chaotic - Bane, Neutral - your pick of these."],
        [1, "Favored by the Gods", "If you fail a saving throw or miss an attack roll, add 2d4 to the total. Once per Short or Long Rest."],
        [6, "Empowered Healing", "Once per turn, when you or an ally within 5 ft rolls dice to heal with a spell, spend 1 Sorcery Point to reroll any of those dice (keeping the new rolls)."],
        [14, "Otherworldly Wings", "As a Bonus Action, manifest spectral wings (angelic or demonic) and gain a Fly Speed of 30 ft until you dismiss them."],
        [18, "Unearthly Recovery", "As a Bonus Action when you have half your Hit Points or fewer, regain Hit Points equal to half your maximum. Once per Long Rest."],
      ],
      resources: [
        { id: "divine-soul-favored-by-the-gods", name: "Favored by the Gods", usesByLevel: { 1: 1 }, shortRestRegain: "all" },
        { id: "divine-soul-unearthly-recovery", name: "Unearthly Recovery", usesByLevel: { 18: 1 } },
      ],
    },
    {
      name: "Shadow Magic",
      summary: "Power from the Shadowfell, resistant even to death.",
      features: [
        [1, "Eyes of the Dark", "You have Darkvision 120 ft. At 3rd level you can cast Darkness for 2 Sorcery Points and see through the darkness you create."],
        [1, "Strength of the Grave", "When damage would reduce you to 0 Hit Points, make a Charisma save (DC 5 + damage taken); on a success you drop to 1 Hit Point instead (not against radiant damage or a critical hit). Once per Long Rest."],
        [6, "Hound of Ill Omen", "As a Bonus Action, spend 3 Sorcery Points to summon a Hound of Ill Omen against a creature within 120 ft, which has Advantage on attacks and is hard to hit and harms the target's saves against your spells."],
        [14, "Shadow Walk", "While in Dim Light or Darkness, use a Bonus Action to teleport up to 120 ft to an unoccupied space you can see that is also in Dim Light or Darkness."],
        [18, "Umbral Form", "As a Bonus Action, spend 6 Sorcery Points to become a shadow for 1 minute: resistance to all damage except Force and Radiant, and you can move through creatures and objects."],
      ],
      resources: [{ id: "shadow-strength-of-the-grave", name: "Strength of the Grave", usesByLevel: { 1: 1 } }],
    },
    {
      name: "Storm Sorcery",
      summary: "Command wind, lightning and thunder.",
      features: [
        [1, "Wind Speaker", "You can speak, read and write Primordial and its dialects (Aquan, Auran, Ignan, Terran)."],
        [1, "Tempestuous Magic", "As a Bonus Action before or after casting a spell of 1st level or higher, fly up to 10 ft without provoking Opportunity Attacks."],
        [6, "Heart of the Storm", "You have resistance to Lightning and Thunder damage. When you cast a spell of 1st level or higher that deals Lightning or Thunder damage, creatures of your choice within 10 ft take damage equal to half your Sorcerer level."],
        [6, "Storm Guide", "You can stop rain from falling on you and nearby creatures, and calm wind within 100 ft as an action."],
        [14, "Storm's Fury", "When a creature within 5 ft hits you with a melee attack, use your Reaction to deal Lightning damage equal to your Sorcerer level and the attacker makes a Strength save or is pushed up to 20 ft."],
        [18, "Wind Soul", "You gain immunity to Lightning and Thunder damage and a Fly Speed of 60 ft. As an action, reduce your Fly Speed to 30 ft to give a number of creatures equal to 3 + your Charisma modifier a Fly Speed of 30 ft for 1 hour. Once per Short or Long Rest."],
      ],
      resources: [{ id: "storm-wind-soul", name: "Wind Soul (share flight)", usesByLevel: { 18: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "Aberrant Mind",
      summary: "Psionic power from an alien mind.",
      features: [
        [1, "Psionic Spells", "Always known: Arms of Hadar, Dissonant Whispers, Mind Sliver (1st); Calm Emotions, Detect Thoughts (3rd); Hunger of Hadar, Sending (5th); Evard's Black Tentacles, Summon Aberration (7th); Rary's Telepathic Bond, Telekinesis (9th)."],
        [1, "Telepathic Speech", "As a Bonus Action, speak telepathically to a creature within 30 ft for a number of minutes equal to your Sorcerer level."],
        [6, "Psionic Sorcery", "Cast Psionic Spells by spending Sorcery Points equal to the spell level instead of a slot, with no Verbal or Somatic components."],
        [6, "Psychic Defenses", "You have resistance to Psychic damage and Advantage on saves against being Charmed or Frightened."],
        [14, "Revelation in Flesh", "As a Bonus Action for 10 minutes, spend 1+ Sorcery Points to gain: See Invisible, Fly Speed equal to your Speed, Swim Speed equal to your Speed, or the ability to squeeze through tiny gaps."],
        [18, "Warping Implosion", "As an action, teleport up to 120 ft; creatures within 30 ft of where you were make a Strength save or take 3d10 Force damage and are pulled to that spot. Once per Long Rest, or by spending 5 Sorcery Points."],
      ],
      resources: [{ id: "aberrant-mind-warping-implosion", name: "Warping Implosion", usesByLevel: { 18: 1 } }],
    },
    {
      name: "Clockwork Soul",
      summary: "Order from the cosmos that smooths out chaos.",
      features: [
        [1, "Clockwork Magic", "Always known: Alarm, Protection from Evil and Good (1st); Aid, Lesser Restoration (3rd); Dispel Magic, Protection from Energy (5th); Freedom of Movement, Summon Construct (7th); Greater Restoration, Wall of Force (9th)."],
        [1, "Restore Balance", "When a creature you can see within 60 ft is about to make a d20 Test with Advantage or Disadvantage, use your Reaction to cancel it. Uses equal your proficiency bonus; regained on a Long Rest."],
        [6, "Bastion of Law", "As an action, spend 1-5 Sorcery Points to create a ward of that many d8s around yourself or another creature; the ward absorbs damage by spending dice. It lasts until you finish a Long Rest."],
        [14, "Trance of Order", "As a Bonus Action for 1 minute, d20 rolls of 9 or lower count as 10 for your attack rolls, saving throws and ability checks. Once per Long Rest, or by spending 5 Sorcery Points."],
        [18, "Clockwork Cavalcade", "As an action, summon spirits in a 30-ft cube: they restore up to 100 Hit Points among creatures there, repair damaged objects and end spells of level 6 or lower. Once per Long Rest, or by spending 7 Sorcery Points."],
      ],
      resources: [
        { id: "clockwork-soul-restore-balance", name: "Restore Balance", usesByLevel: PROFICIENCY_USES },
        { id: "clockwork-soul-trance-of-order", name: "Trance of Order", usesByLevel: { 14: 1 } },
        { id: "clockwork-soul-cavalcade", name: "Clockwork Cavalcade", usesByLevel: { 18: 1 } },
      ],
    },
  ],
  warlock: [
    {
      name: "The Archfey",
      summary: "A fey lord's gifts of charm, teleportation and illusion.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Faerie Fire, Sleep (1st); Calm Emotions, Phantasmal Force (2nd); Blink, Plant Growth (3rd); Dominate Beast, Greater Invisibility (4th); Dominate Person, Seeming (5th)."],
        [1, "Fey Presence", "As an action, creatures of your choice in a 10-ft cube from you make a Wisdom save or are Charmed or Frightened (your choice) until the end of your next turn. Once per Short or Long Rest."],
        [6, "Misty Escape", "When you take damage, use your Reaction to turn Invisible and teleport up to 60 ft, remaining Invisible until the start of your next turn or you attack or cast a spell. Once per Short or Long Rest."],
        [10, "Beguiling Defenses", "You are immune to being Charmed. When a creature tries to Charm you, use your Reaction to force a Wisdom save; on a failure, it is Charmed by you for 1 minute."],
        [14, "Dark Delirium", "As an action, a creature within 60 ft makes a Wisdom save or is Charmed or Frightened (your choice) for 1 minute, lost in an illusory realm. Once per Short or Long Rest."],
      ],
      resources: [
        { id: "archfey-fey-presence", name: "Fey Presence", usesByLevel: { 1: 1 }, shortRestRegain: "all" },
        { id: "archfey-misty-escape", name: "Misty Escape", usesByLevel: { 6: 1 }, shortRestRegain: "all" },
        { id: "archfey-dark-delirium", name: "Dark Delirium", usesByLevel: { 14: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "The Great Old One",
      summary: "Psychic power from an unfathomable entity.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Dissonant Whispers, Tasha's Hideous Laughter (1st); Detect Thoughts, Phantasmal Force (2nd); Clairvoyance, Sending (3rd); Dominate Beast, Evard's Black Tentacles (4th); Dominate Person, Telekinesis (5th)."],
        [1, "Awakened Mind", "You can communicate telepathically with a creature within 30 ft that you can see."],
        [6, "Entropic Ward", "When a creature makes an attack roll against you, use your Reaction to impose Disadvantage on it; if it misses, you have Advantage on your next attack against it before the end of your next turn. Once per Short or Long Rest."],
        [10, "Thought Shield", "Your thoughts can't be read telepathically unless you allow it. You have resistance to Psychic damage, and a creature that deals Psychic damage to you takes the same amount."],
        [14, "Create Thrall", "As an action, touch an Incapacitated Humanoid to Charm it permanently, until Remove Curse or similar ends it. You can communicate with it telepathically."],
      ],
      resources: [{ id: "great-old-one-entropic-ward", name: "Entropic Ward", usesByLevel: { 6: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "The Celestial",
      summary: "Radiant power and healing from a celestial being.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Cure Wounds, Guiding Bolt (1st); Flaming Sphere, Lesser Restoration (2nd); Daylight, Revivify (3rd); Guardian of Faith, Wall of Fire (4th); Flame Strike, Greater Restoration (5th)."],
        [1, "Bonus Cantrips", "You learn the Light and Sacred Flame cantrips."],
        [1, "Healing Light", "You have a pool of d6s equal to 1 + your Warlock level. As a Bonus Action, spend up to your Charisma modifier dice to heal a creature within 60 ft. The pool refills on a Long Rest."],
        [6, "Radiant Soul", "You have resistance to Radiant damage, and when you deal Radiant or Fire damage with a spell you add your Charisma modifier to one damage roll."],
        [10, "Celestial Resilience", "After a Short or Long Rest you gain Temporary Hit Points equal to your Warlock level + Charisma modifier, and up to five allies gain half that amount."],
        [14, "Searing Vengeance", "When you start your turn Incapacitated by 0 Hit Points, you can spring up with half your maximum Hit Points, and creatures of your choice within 30 ft take 2d8 + Charisma Radiant damage and are Blinded until the end of the turn. Once per Long Rest."],
      ],
      resources: [
        { id: "celestial-healing-light", name: "Healing Light (d6 pool)", usesByLevel: perLevel(1, 20, (level) => level + 1), isPointPool: true },
        { id: "celestial-searing-vengeance", name: "Searing Vengeance", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "The Hexblade",
      summary: "A shadowy sentient weapon's champion.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Shield, Wrathful Smite (1st); Blur, Branding Smite (2nd); Blink, Elemental Weapon (3rd); Phantasmal Killer, Staggering Smite (4th); Banishing Smite, Cone of Cold (5th)."],
        [1, "Hexblade's Curse", "As a Bonus Action, curse a creature within 30 ft for 1 minute: add your proficiency bonus to damage against it, your attacks against it crit on 19-20, and you regain Hit Points equal to your Warlock level + Charisma modifier if it dies. Once per Short or Long Rest."],
        [1, "Hex Warrior", "You gain proficiency with Medium armor, Shields and Martial weapons. Whenever you finish a Long Rest you can touch one weapon (not Two-Handed) to use Charisma for its attack and damage rolls; a Pact of the Blade weapon gets this automatically."],
        [6, "Accursed Specter", "When you slay a Humanoid, you can raise its spirit as a specter under your control until the end of your next Long Rest; it has temporary Hit Points equal to half your Warlock level and adds your Charisma modifier to attacks. Once per Long Rest."],
        [10, "Armor of Hexes", "When a creature cursed by Hexblade's Curse hits you with an attack, use your Reaction to roll a d6; on a 4 or higher the attack misses."],
        [14, "Master of Hexes", "When the creature cursed by Hexblade's Curse dies, you can transfer the curse to another creature within 30 ft that you can see (no use of the feature spent)."],
      ],
      resources: [
        { id: "hexblade-curse", name: "Hexblade's Curse", usesByLevel: { 1: 1 }, shortRestRegain: "all" },
        { id: "hexblade-accursed-specter", name: "Accursed Specter", usesByLevel: { 6: 1 } },
      ],
    },
    {
      name: "The Fathomless",
      summary: "The power of the deep sea.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Create or Destroy Water, Thunderwave (1st); Gust of Wind, Silence (2nd); Lightning Bolt, Sleet Storm (3rd); Control Water, Evard's Black Tentacles (4th); Bigby's Hand, Cone of Cold (5th)."],
        [1, "Tentacle of the Deeps", "As a Bonus Action, summon a spectral tentacle within 60 ft for 1 minute. It deals 1d8 Cold damage on a hit and slows the target 10 ft; you can move it and attack with it as a Bonus Action. Uses equal your proficiency bonus; regained on a Long Rest."],
        [1, "Gift of the Sea", "You gain a Swim Speed of 40 ft and can breathe underwater."],
        [6, "Oceanic Soul", "You gain resistance to Cold damage and can converse with any creature that has a Swim Speed."],
        [6, "Guardian Coil", "When you or a creature within 10 ft of your tentacle takes damage, use your Reaction to reduce it by 1d8 (2d8 at 10th; no more than the damage taken)."],
        [10, "Grasping Tentacles", "You learn Evard's Black Tentacles, which doesn't count against your spells known. Cast it without a slot once per Long Rest; when you do you gain Temporary Hit Points equal to your Warlock level and can't lose Concentration from damage."],
        [14, "Fathomless Plunge", "As an action, teleport yourself and up to five willing creatures within 30 ft to a body of water or a place you can see within 1 mile. Once per Short or Long Rest."],
      ],
      resources: [
        { id: "fathomless-tentacle", name: "Tentacle of the Deeps", usesByLevel: PROFICIENCY_USES },
        { id: "fathomless-grasping-tentacles", name: "Grasping Tentacles", usesByLevel: { 10: 1 } },
        { id: "fathomless-plunge", name: "Fathomless Plunge", usesByLevel: { 14: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "The Genie",
      summary: "A genie patron's lamp, magic and wishes.",
      features: [
        [1, "Genie's Vessel", "You gain a vessel (lamp, bottle or similar) that the genie occupies. You choose a genie kind (Dao, Djinni, Efreeti or Marid) that determines your damage type and expanded spells. Bottled Respite: as an action, shrink into the vessel for up to your Warlock level + Charisma modifier hours, healing over a short rest. Genie's Wrath: once per turn on a hit, deal extra damage equal to your proficiency bonus of your genie's damage type."],
        [1, "Expanded Spell List", "Gain a spell per spell level (1st through 5th) from your genie's list; it matches Dao, Djinni, Efreeti or Marid (e.g. Divine Favor for a Dao at 1st)."],
        [6, "Elemental Gift", "You gain resistance to your genie's damage type, and as a Bonus Action gain a Fly Speed of 30 ft for 10 minutes. Uses equal your proficiency bonus; regained on a Long Rest."],
        [10, "Sanctuary Vessel", "When you use Bottled Respite you can take up to five willing creatures with you into the vessel; everyone regains Hit Points and Hit Dice as if resting."],
        [14, "Limited Wish", "As an action, ask your genie to duplicate any spell of 6th level or lower, with no components. You can't use this again for 1d4 Long Rests."],
      ],
      resources: [
        { id: "genie-bottled-respite", name: "Bottled Respite", usesByLevel: { 1: 1 } },
        { id: "genie-elemental-gift", name: "Elemental Gift (flight)", usesByLevel: { 6: 3, 9: 4, 13: 5, 17: 6 } },
        { id: "genie-limited-wish", name: "Limited Wish", usesByLevel: { 14: 1 }, manualRecharge: true },
      ],
    },
    {
      name: "The Undead",
      summary: "Dread power from a patron among the undead.",
      features: [
        [1, "Expanded Spell List", "Added to your Warlock spells: Bane, False Life (1st); Blindness/Deafness, Phantasmal Force (2nd); Phantom Steed, Speak with Dead (3rd); Death Ward, Greater Invisibility (4th); Antilife Shell, Cloudkill (5th)."],
        [1, "Form of Dread", "As a Bonus Action, transform for 1 minute: gain Temporary Hit Points (1d10 + Warlock level), immunity to the Frightened condition, and once per turn when you hit a creature it makes a Wisdom save or is Frightened until the end of your next turn. Uses equal your proficiency bonus; regained on a Long Rest."],
        [6, "Grave Touch", "Once per turn when you hit a creature with an attack, you can replace its damage type with Necrotic; the extra damage is a roll of your Form of Dread dice, and you can choose to maximize it."],
        [10, "Necrotic Husk", "You have resistance to Necrotic damage. When you drop to 0 Hit Points you can explode: creatures within 30 ft take 2d10 + Warlock level Necrotic damage, and you drop to 1 Hit Point instead (you gain levels of exhaustion). Once per Long Rest."],
        [14, "Spirit Projection", "As an action, project your spirit from your body for up to 1 hour or until Concentration ends: you can fly, are incorporeal, and cast spells but your body is unconscious. Once per Long Rest, or by expending a Pact Magic slot."],
      ],
      resources: [
        { id: "undead-form-of-dread", name: "Form of Dread", usesByLevel: PROFICIENCY_USES },
        { id: "undead-necrotic-husk", name: "Necrotic Husk", usesByLevel: { 10: 1 } },
        { id: "undead-spirit-projection", name: "Spirit Projection", usesByLevel: { 14: 1 } },
      ],
    },
  ],
  wizard: [
    {
      name: "School of Abjuration",
      summary: "Protective magic that wards you and your allies.",
      features: [
        [2, "Abjuration Savant", "Copying Abjuration spells into your spellbook costs half the gold and time."],
        [2, "Arcane Ward", "After casting an Abjuration spell of 1st level or higher, create a ward with Hit Points equal to twice your Wizard level + Intelligence modifier. It absorbs damage for you; casting Abjuration spells restores it (2 HP per slot level)."],
        [6, "Projected Ward", "When a creature within 30 ft takes damage, use your Reaction to have your Arcane Ward absorb it."],
        [10, "Improved Abjuration", "When you cast an Abjuration spell that needs an ability check (Counterspell, Dispel Magic), add your proficiency bonus to that check."],
        [14, "Spell Resistance", "You have Advantage on saving throws against spells and resistance to damage from spells."],
      ],
    },
    {
      name: "School of Conjuration",
      summary: "Summon creatures and objects from nowhere.",
      features: [
        [2, "Conjuration Savant", "Copying Conjuration spells into your spellbook costs half the gold and time."],
        [2, "Minor Conjuration", "As an action, conjure a nonmagical inanimate object up to 3 ft on a side and 10 pounds, which lasts 1 hour."],
        [6, "Benign Transposition", "As an action, teleport up to 30 ft or swap places with a willing Small or Medium creature. Once per Long Rest, or after casting a Conjuration spell of 1st level or higher."],
        [10, "Focused Conjuration", "Taking damage can't break your Concentration on a Conjuration spell."],
        [14, "Durable Summons", "Creatures you conjure with a Conjuration spell of 1st level or higher gain 30 Temporary Hit Points."],
      ],
      resources: [{ id: "conjuration-benign-transposition", name: "Benign Transposition", usesByLevel: { 6: 1 } }],
    },
    {
      name: "School of Divination",
      summary: "See the future and bend fate with rolled omens.",
      features: [
        [2, "Divination Savant", "Copying Divination spells into your spellbook costs half the gold and time."],
        [2, "Portent", "After a Long Rest, roll two d20s and record them. Replace any attack roll, saving throw or ability check made by you or a creature you can see with one of these rolls (before the roll). At 14th level you roll three dice."],
        [6, "Expert Divination", "When you cast a Divination spell of 2nd level or higher, you regain one expended spell slot of a lower level (max 5th)."],
        [10, "The Third Eye", "As an action, gain Darkvision 60 ft, Ethereal Sight 60 ft, Greater Comprehension (read any language) or See Invisibility 10 ft until you rest. Once per Short or Long Rest."],
        [14, "Greater Portent", "You roll a third d20 for Portent."],
      ],
      resources: [
        { id: "divination-portent", name: "Portent dice", usesByLevel: { 2: 2, 14: 3 } },
        { id: "divination-third-eye", name: "The Third Eye", usesByLevel: { 10: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "School of Enchantment",
      summary: "Charm, command and reshape minds.",
      features: [
        [2, "Enchantment Savant", "Copying Enchantment spells into your spellbook costs half the gold and time."],
        [2, "Hypnotic Gaze", "As an action, a creature within 5 ft that can see or hear you makes a Wisdom save or is Charmed and Incapacitated, with Speed 0, until the end of your next turn. You can keep it going each turn. Once per creature per Long Rest."],
        [6, "Instinctive Charm", "When a creature within 30 ft attacks you, use your Reaction to force it to make a Wisdom save or target another creature of your choice instead. Once per Long Rest, or after casting an Enchantment spell of 1st level or higher."],
        [10, "Split Enchantment", "When you cast an Enchantment spell of 1st level or higher that targets one creature, you can target a second creature."],
        [14, "Alter Memories", "When you charm a creature with an Enchantment spell, you can make it unaware it was charmed, and it can lose memory of up to 1 + Charisma modifier hours of recent events."],
      ],
      resources: [{ id: "enchantment-instinctive-charm", name: "Instinctive Charm", usesByLevel: { 6: 1 } }],
    },
    {
      name: "School of Illusion",
      summary: "Weave illusions and bring them to life.",
      features: [
        [2, "Illusion Savant", "Copying Illusion spells into your spellbook costs half the gold and time."],
        [2, "Improved Minor Illusion", "You learn Minor Illusion (not counted against cantrips known); you can create both a sound and an image with one casting."],
        [6, "Malleable Illusions", "When you cast an Illusion spell with a duration of 1 minute or longer, you can use your action to change its nature while it persists."],
        [10, "Illusory Self", "When a creature attacks you, use your Reaction to make that attack automatically miss, as you vanish and reappear. Once per Short or Long Rest."],
        [14, "Illusory Reality", "When you cast an Illusion spell of 1st level or higher, you can choose one inanimate nonmagical object in the illusion to be real for 1 minute."],
      ],
      resources: [{ id: "illusion-illusory-self", name: "Illusory Self", usesByLevel: { 10: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "School of Necromancy",
      summary: "Command the energies of life, death and the undead.",
      features: [
        [2, "Necromancy Savant", "Copying Necromancy spells into your spellbook costs half the gold and time."],
        [2, "Grim Harvest", "When you kill a creature with a spell of 1st level or higher, you regain Hit Points equal to twice the spell's level (three times for Necromancy spells). Not for constructs and undead."],
        [6, "Undead Thralls", "You learn Animate Dead. When you cast it you animate one extra creature and your undead gain Hit Points equal to your Wizard level and add your proficiency bonus to damage rolls."],
        [10, "Inured to Undeath", "You have resistance to Necrotic damage, and your Hit Point maximum can't be reduced."],
        [14, "Command Undead", "As an action, target an undead within 60 ft; it makes a Charisma save or becomes friendly and obeys you until your next Long Rest."],
      ],
    },
    {
      name: "School of Transmutation",
      summary: "Change the properties of matter.",
      features: [
        [2, "Transmutation Savant", "Copying Transmutation spells into your spellbook costs half the gold and time."],
        [2, "Minor Alchemy", "During 10 minutes of work, transform one nonmagical object made of wood, stone, iron, copper or silver into another of those materials (1 cubic foot per 10 minutes). Lasts 1 hour."],
        [6, "Transmuter's Stone", "Spend 8 hours creating a stone that grants Darkvision 60 ft, +10 ft Speed, Constitution save proficiency, or resistance to Acid, Cold, Fire, Lightning or Thunder damage (you choose when created or change by casting a Transmutation spell)."],
        [10, "Shapechanger", "You can cast Polymorph on yourself without a slot (only into a Beast with CR 1 or lower). Once per Short or Long Rest."],
        [14, "Master Transmuter", "As an action, consume your Transmuter's Stone to: transmute an object, cure a character (Panacea), revive a creature (Restore Life) or give someone a younger body (Restore Youth)."],
      ],
      resources: [{ id: "transmutation-shapechanger", name: "Shapechanger", usesByLevel: { 10: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "War Magic",
      summary: "Blend defense and offense, tactically.",
      features: [
        [2, "Arcane Deflection", "When you are hit by an attack or fail a saving throw, use your Reaction for +2 AC against that attack or +4 on the save. You can only cast cantrips until the end of your next turn."],
        [2, "Tactical Wit", "Add your Intelligence modifier to Initiative rolls."],
        [6, "Power Surge", "You store Power Surge charges (maximum your Intelligence modifier). Gain one when you succeed with Counterspell or Dispel Magic, or have none at the end of a Long Rest. When you hit with a weapon or spell, spend one for extra Force damage equal to half your Wizard level."],
        [10, "Durable Magic", "While you maintain Concentration on a spell, you gain +2 AC and +2 on all saving throws."],
        [14, "Deflecting Shroud", "When you use Arcane Deflection, up to three creatures within 60 ft take Force damage equal to half your Wizard level."],
      ],
    },
    {
      name: "Bladesinging",
      summary: "Elven-trained dancing swordplay woven with spells.",
      features: [
        [2, "Training in War and Song", "You gain proficiency with Light armor, one type of one-handed Melee weapon, and the Performance skill."],
        [2, "Bladesong", "As a Bonus Action while not in Medium or Heavy armor or using a Shield, invoke the Bladesong for 1 minute: +Intelligence modifier to AC, +10 ft Speed, Advantage on Acrobatics checks, and +Intelligence modifier to Concentration saves. Uses equal your proficiency bonus; regained on a Long Rest."],
        [6, "Extra Attack", "You can attack twice when you take the Attack action, and you can replace one attack with a cantrip."],
        [10, "Song of Defense", "While the Bladesong is active, use your Reaction to expend a spell slot to reduce damage you take by 5 times the slot's level."],
        [14, "Song of Victory", "While the Bladesong is active, add your Intelligence modifier to your melee weapon damage."],
      ],
      resources: [{ id: "bladesinging-bladesong", name: "Bladesong", usesByLevel: { 2: 2, 5: 3, 9: 4, 13: 5, 17: 6 } }],
    },
    {
      name: "Order of Scribes",
      summary: "Living-spellbook wizards.",
      features: [
        [2, "Wizardly Quill", "You can create a magical quill that writes without ink, whose copying cost for spells is much faster."],
        [2, "Awakened Spellbook", "You can cast a ritual spell from your spellbook using a spell slot (as a normal-time casting), and can change the damage type of one of your spells to another damage type that spell could deal."],
        [6, "Manifest Mind", "As a Bonus Action, summon your spellbook's mind as a spectral being within 60 ft that sees and hears; you can cast spells as though from its space. Uses equal your Intelligence modifier; regained on a Long Rest."],
        [10, "Master Scrivener", "At the end of a Long Rest, create a magical scroll of a Wizard spell of 1st or 2nd level you know or have prepared, which you can cast without using a slot."],
        [14, "One with the Word", "Your spellbook absorbs harm: when you would take damage, you can erase spells from your book to ignore it, and the book can later restore itself."],
      ],
      resources: [{ id: "scribes-manifest-mind", name: "Manifest Mind", usesFromAbilityModifier: { ability: "intelligence", grantedAtLevel: 6, minimum: 1 } }],
    },
  ],
};
