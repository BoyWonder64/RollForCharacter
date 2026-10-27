import type { ClassProgression } from "../types";

// Per-level class & subclass progression for 3.5e (d20srd.org, "The
// Hypertext d20 SRD", OGL 1.0a Open Game Content). Sourced verbatim from
// each class's own SRD page (e.g. http://www.d20srd.org/srd/classes/barbarian.htm)
// via a scratch Python/BeautifulSoup script, not transcribed from memory --
// same discipline as the rest of this ruleset's data (see classes.ts's
// top comment and LEGAL.md). Sorcerer and Wizard share one SRD page
// (srd/classes/sorcererWizard.htm); Cleric's 22 domains live on their own
// page (srd/spellLists/clericDomains.htm). open5e has no 3.5e coverage at
// all, so d20srd.org is the only source used.
//
// Modeling judgment calls, since 3.5e's leveling mechanics differ
// structurally from 5e's (see classes.ts for the save/skill/BAB-scoping
// decisions already made there):
//
// - ASI and feat levels are UNIVERSAL 3.5e character-advancement rules,
//   not a per-class table entry the way 5e's "Ability Score Improvement"
//   row is. Every class in the SRD's own "Table: Character Advancement"
//   (d20srd.org/srd/xp.htm) gains an ability score increase at 4th, 8th,
//   12th, 16th, and 20th level, and a feat at 1st, 3rd, 6th, 9th, 12th,
//   15th, and 18th level -- regardless of class. `abilityScoreIncreaseLevels`
//   is therefore [4, 8, 12, 16, 20] for every class below. `featLevels`
//   starts from that same universal [1, 3, 6, 9, 12, 15, 18] baseline and
//   is additionally unioned with each class's own EXTRA class-granted bonus
//   feat levels where its own SRD page lists them: Fighter (1, 2, 4, 6, 8,
//   10, 12, 14, 16, 18, 20 -- "Bonus Feat" in its own Special column, by far
//   the most of any class), Monk (1, 2, 6 -- a short restricted list of
//   feats, not a free pick), and Wizard (5, 10, 15, 20 -- metamagic/item
//   creation/Spell Mastery bonus feats). This array doesn't carry a *count*
//   per level, so e.g. a 1st-level Fighter getting two feats at once (the
//   universal one plus the class one) isn't distinguishable from getting
//   one -- a known, documented gap, same spirit as BAB/skill-points being
//   out of scope for `ClassDefinition`.
// - No 5e-style mandatory "subclass" for most classes: Barbarian, Bard,
//   Druid, Fighter, Monk, Paladin, Ranger, Rogue, and Sorcerer have no
//   subclass-equivalent in the core 3.5e SRD at all, so `subclassLevel`/
//   `subclassLabel`/`subclasses` are simply omitted for them (all optional
//   on `ClassProgression` for exactly this reason). Two classes DO get a
//   real, cleanly-sourced, one-time "pick at level 1" choice modeled as a
//   subclass:
//     - Cleric's Domain (subclassLevel 1): all 22 core SRD domains (Air
//       through Water) are included, each with its one "Granted Power" and
//       verbatim domain spell list. NOTE: real 3.5e clerics choose TWO
//       domains, not one -- but the shared `Subclass`/`currentSubclass`
//       single-select data model (shared across every ruleset in this app)
//       only supports one slot. This is a deliberate, documented
//       simplification rather than a forced 5e shape; a future UI could run
//       this same picker twice for full fidelity.
//     - Wizard's School Specialization (subclassLevel 1, optional in the
//       fiction -- a wizard may choose not to specialize at all, which this
//       data model doesn't represent since `needsSubclassChoice` assumes a
//       pick is always made, same as every 5e subclass choice): the 8
//       specializable schools (Universal is excluded -- the SRD says a
//       wizard can't select it as a specialty or prohibited school). The
//       shared mechanic explanation (prepare one extra spell/level, give up
//       two other schools, etc.) lives once as a base Wizard feature rather
//       than repeated in all 8 subclasses.
// - Spell slots (`spellProgression`): `slots[0]` is always 1st-level, same
//   indexing as the 5e file, EXCLUDING each class's 0-level ("cantrip
//   equivalent") column -- 3.5e 0-level spells are their own slot-limited
//   daily resource (not unlimited-use like a 5e cantrip), and there's no
//   field on `SpellSlotRow` for a separate 0-level daily count, so it's
//   simply not modeled (same scoping spirit as BAB). `cantripsKnown` is
//   repurposed for Bard and Sorcerer only (3.5e's two "spells known"
//   casters) to hold their FIXED 0-level KNOWN-list size (from "Table:
//   Bard"/"Table: Sorcerer Spells Known"'s own 0-level column) --
//   deliberately NOT the 0-level per-day cast count, to stay closest to
//   what the field name implies. `spellsKnown` for those two classes is the
//   sum of their known-spell counts across 1st level and up (mirroring the
//   5e file's own "Spells Known of 1st Level and Higher" framing). Cleric,
//   Druid, Paladin, Ranger, and Wizard all prepare from their whole class
//   list (no fixed "known" list at any level), so both fields are omitted
//   for them, matching the 2014 5e file's own convention for prepared
//   casters. Cleric's domain-granted bonus spell slot (the "+1" in the
//   SRD's own spell table) is folded directly into the relevant `slots`
//   entry, since every cleric always has two domains and thus always has
//   that bonus slot -- it isn't optional the way a 5e subclass pick's
//   effects sometimes are.
// - Paladin and Ranger only gain spellcasting at 4th level in 3.5e (not
//   1st), so their `spellProgression` arrays start at level 4, not level 1
//   -- there is nothing meaningful to report at earlier levels.
// - Bard's 3.5e spell list caps at 6th-level spells (not 9th like 5e), so
//   its `slots` arrays are length 6, not 9 -- array length tracks each
//   class's real spell-level cap rather than a fixed 9.
export const CLASS_PROGRESSIONS_35E: ClassProgression[] = [
  {
    classId: "barbarian",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Fast Movement (Ex)",
        description: "A barbarian's land speed is faster than the norm for his race by +10 feet. This benefit applies only when he is wearing no armor, light armor, or medium armor and not carrying a heavy load. Apply this bonus before modifying the barbarian's speed because of any load carried or armor worn.",
      },
      {
        level: 1,
        name: "Illiteracy",
        description: "Barbarians are the only characters who do not automatically know how to read and write. A barbarian may spend 2 skill points to gain the ability to read and write all languages he is able to speak.\n\nA barbarian who gains a level in any other class automatically gains literacy. Any other character who gains a barbarian level does not lose the literacy he or she already had.",
      },
      {
        level: 1,
        name: "Rage (Ex)",
        description: "A barbarian can fly into a rage a certain number of times per day. In a rage, a barbarian temporarily gains a +4 bonus to Strength, a +4 bonus to Constitution, and a +2 morale bonus on Will saves, but he takes a -2 penalty to Armor Class. The increase in Constitution increases the barbarian's hit points by 2 points per level, but these hit points go away at the end of the rage when his Constitution score drops back to normal. (These extra hit points are not lost first the way temporary hit points are.) While raging, a barbarian cannot use any Charisma-, Dexterity-, or Intelligence-based skills (except for Balance, Escape Artist, Intimidate, and Ride), the Concentration skill, or any abilities that require patience or concentration, nor can he cast spells or activate magic items that require a command word, a spell trigger (such as a wand), or spell completion (such as a scroll) to function. He can use any feat he has except Combat Expertise, item creation feats, and metamagic feats. A fit of rage lasts for a number of rounds equal to 3 + the character's (newly improved) Constitution modifier. A barbarian may prematurely end his rage. At the end of the rage, the barbarian loses the rage modifiers and restrictions and becomes fatigued (-2 penalty to Strength, -2 penalty to Dexterity, can't charge or run) for the duration of the current encounter (unless he is a 17th-level barbarian, at which point this limitation no longer applies).\n\nA barbarian can fly into a rage only once per encounter. At 1st level he can use his rage ability once per day. At 4th level and every four levels thereafter, he can use it one additional time per day (to a maximum of six times per day at 20th level). Entering a rage takes no time itself, but a barbarian can do it only during his action, not in response to someone else's action.",
      },
      {
        level: 2,
        name: "Uncanny Dodge (Ex)",
        description: "At 2nd level, a barbarian retains his Dexterity bonus to AC (if any) even if he is caught flat-footed or struck by an invisible attacker. However, he still loses his Dexterity bonus to AC if immobilized. If a barbarian already has uncanny dodge from a different class, he automatically gains improved uncanny dodge instead.",
      },
      {
        level: 3,
        name: "Trap Sense (Ex)",
        description: "Starting at 3rd level, a barbarian gains a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses rise by +1 every three barbarian levels thereafter (6th, 9th, 12th, 15th, and 18th level). Trap sense bonuses gained from multiple classes stack.",
      },
      {
        level: 5,
        name: "Improved Uncanny Dodge (Ex)",
        description: "At 5th level and higher, a barbarian can no longer be flanked. This defense denies a rogue the ability to sneak attack the barbarian by flanking him, unless the attacker has at least four more rogue levels than the target has barbarian levels. If a character already has uncanny dodge from a second class, the character automatically gains improved uncanny dodge instead, and the levels from the classes that grant uncanny dodge stack to determine the minimum level a rogue must be to flank the character.",
      },
      {
        level: 7,
        name: "Damage Reduction (Ex)",
        description: "At 7th level, a barbarian gains Damage Reduction. Subtract 1 from the damage the barbarian takes each time he is dealt damage from a weapon or a natural attack. At 10th level, and every three barbarian levels thereafter (13th, 16th, and 19th level), this damage reduction rises by 1 point. Damage reduction can reduce damage to 0 but not below 0.",
      },
      {
        level: 11,
        name: "Greater Rage (Ex)",
        description: "At 11th level, a barbarian's bonuses to Strength and Constitution during his rage each increase to +6, and his morale bonus on Will saves increases to +3. The penalty to AC remains at -2.",
      },
      {
        level: 14,
        name: "Indomitable Will (Ex)",
        description: "While in a rage, a barbarian of 14th level or higher gains a +4 bonus on Will saves to resist enchantment spells. This bonus stacks with all other modifiers, including the morale bonus on Will saves he also receives during his rage.",
      },
      {
        level: 17,
        name: "Tireless Rage (Ex)",
        description: "At 17th level and higher, a barbarian no longer becomes fatigued at the end of his rage.",
      },
      {
        level: 20,
        name: "Mighty Rage (Ex)",
        description: "At 20th level, a barbarian's bonuses to Strength and Constitution during his rage each increase to +8, and his morale bonus on Will saves increases to +4. The penalty to AC remains at -2.",
      },
    ],
  },
  {
    classId: "bard",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Spells",
        description: "A bard casts arcane spells, which are drawn from the bard spell list. He can cast any spell he knows without preparing it ahead of time. Every bard spell has a verbal component (singing, reciting, or music). To learn or cast a spell, a bard must have a Charisma score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a bard's spell is 10 + the spell level + the bard's Charisma modifier.\n\nLike other spellcasters, a bard can cast only a certain number of spells of each spell level per day. His base daily spell allotment is given on Table: The Bard. In addition, he receives bonus spells per day if he has a high Charisma score. When Table: The Bard indicates that the bard gets 0 spells per day of a given spell level, he gains only the bonus spells he would be entitled to based on his Charisma score for that spell level.\n\nThe bard's selection of spells is extremely limited. A bard begins play knowing four 0-level spells of your choice. At most new bard levels, he gains one or more new spells, as indicated on Table: The Bard. (Unlike spells per day, the number of spells a bard knows is not affected by his Charisma score; the numbers on Table: The Bard are fixed.)\n\nUpon reaching 5th level, and at every third bard level after that (8th, 11th, and so on), a bard can choose to learn a new spell in place of one he already knows. In effect, the bard \"loses\" the old spell in exchange for the new one. The new spell's level must be the same as that of the spell being exchanged, and it must be at least two levels lower than the highest-level bard spell the bard can cast. A bard may swap only a single spell at any given level, and must choose whether or not to swap the spell at the same time that he gains new spells known for the level.\n\nAs noted above, a bard need not prepare his spells in advance. He can cast any spell he knows at any time, assuming he has not yet used up his allotment of spells per day for the spell's level.",
      },
      {
        level: 1,
        name: "Bardic Knowledge",
        description: "A bard may make a special bardic knowledge check with a bonus equal to his bard level + his Intelligence modifier to see whether he knows some relevant information about local notable people, legendary items, or noteworthy places. (If the bard has 5 or more ranks in Knowledge (history), he gains a +2 bonus on this check.)\n\nA successful bardic knowledge check will not reveal the powers of a magic item but may give a hint as to its general function. A bard may not take 10 or take 20 on this check; this sort of knowledge is essentially random.\n\n| DC | Type of Knowledge |\n| --- | --- |\n| 10 | Common, known by at least a substantial minority of the local population. |\n| 20 | Uncommon but available, known by only a few people legends. |\n| 25 | Obscure, known by few, hard to come by. |\n| 30 | Extremely obscure, known by very few, possibly forgotten by most who once knew it, possibly known only by those who don't understand the significance of the knowledge. |",
      },
      {
        level: 1,
        name: "Bardic Music",
        description: "Once per day per bard level, a bard can use his song or poetics to produce magical effects on those around him (usually including himself, if desired). While these abilities fall under the category of bardic music and the descriptions discuss singing or playing instruments, they can all be activated by reciting poetry, chanting, singing lyrical songs, singing melodies, whistling, playing an instrument, or playing an instrument in combination with some spoken performance. Each ability requires both a minimum bard level and a minimum number of ranks in the Perform skill to qualify; if a bard does not have the required number of ranks in at least one Perform skill, he does not gain the bardic music ability until he acquires the needed ranks.\n\nStarting a bardic music effect is a standard action. Some bardic music abilities require concentration, which means the bard must take a standard action each round to maintain the ability. Even while using bardic music that doesn't require concentration, a bard cannot cast spells, activate magic items by spell completion (such as scrolls), spell trigger (such as wands), or command word. Just as for casting a spell with a verbal component, a deaf bard has a 20% chance to fail when attempting to use bardic music. If he fails, the attempt still counts against his daily limit.",
      },
      {
        level: 1,
        name: "Countersong (Su)",
        description: "A bard with 3 or more ranks in a Perform skill can use his music or poetics to counter magical effects that depend on sound (but not spells that simply have verbal components). Each round of the countersong, he makes a Perform check. Any creature within 30 feet of the bard (including the bard himself) that is affected by a sonic or language-dependent magical attack may use the bard's Perform check result in place of its saving throw if, after the saving throw is rolled, the Perform check result proves to be higher. If a creature within range of the countersong is already under the effect of a noninstantaneous sonic or language-dependent magical attack, it gains another saving throw against the effect each round it hears the countersong, but it must use the bard's Perform check result for the save. Countersong has no effect against effects that don't allow saves. The bard may keep up the countersong for 10 rounds.",
      },
      {
        level: 1,
        name: "Fascinate (Sp)",
        description: "A bard with 3 or more ranks in a Perform skill can use his music or poetics to cause one or more creatures to become fascinated with him. Each creature to be fascinated must be within 90 feet, able to see and hear the bard, and able to pay attention to him. The bard must also be able to see the creature. The distraction of a nearby combat or other dangers prevents the ability from working. For every three levels a bard attains beyond 1st, he can target one additional creature with a single use of this ability.\n\nTo use the ability, a bard makes a Perform check. His check result is the DC for each affected creature's Will save against the effect. If a creature's saving throw succeeds, the bard cannot attempt to fascinate that creature again for 24 hours. If its saving throw fails, the creature sits quietly and listens to the song, taking no other actions, for as long as the bard continues to play and concentrate (up to a maximum of 1 round per bard level). While fascinated, a target takes a -4 penalty on skill checks made as reactions, such as Listen and Spot checks. Any potential threat requires the bard to make another Perform check and allows the creature a new saving throw against a DC equal to the new Perform check result.\n\nAny obvious threat, such as someone drawing a weapon, casting a spell, or aiming a ranged weapon at the target, automatically breaks the effect. Fascinate is an enchantment (compulsion), mind-affecting ability.",
      },
      {
        level: 1,
        name: "Inspire Courage (Su)",
        description: "A bard with 3 or more ranks in a Perform skill can use song or poetics to inspire courage in his allies (including himself), bolstering them against fear and improving their combat abilities. To be affected, an ally must be able to hear the bard sing. The effect lasts for as long as the ally hears the bard sing and for 5 rounds thereafter. An affected ally receives a +1 morale bonus on saving throws against charm and fear effects and a +1 morale bonus on attack and weapon damage rolls. At 8th level, and every six bard levels thereafter, this bonus increases by 1 (+2 at 8th, +3 at 14th, and +4 at 20th). Inspire courage is a mind-affecting ability.",
      },
      {
        level: 3,
        name: "Inspire Competence (Su)",
        description: "A bard of 3rd level or higher with 6 or more ranks in a Perform skill can use his music or poetics to help an ally succeed at a task. The ally must be within 30 feet and able to see and hear the bard. The bard must also be able to see the ally.\n\nThe ally gets a +2 competence bonus on skill checks with a particular skill as long as he or she continues to hear the bard's music. Certain uses of this ability are infeasible. The effect lasts as long as the bard concentrates, up to a maximum of 2 minutes. A bard can't inspire competence in himself. Inspire competence is a mind-affecting ability.",
      },
      {
        level: 6,
        name: "Suggestion (Sp)",
        description: "A bard of 6th level or higher with 9 or more ranks in a Perform skill can make a suggestion (as the spell) to a creature that he has already fascinated. Using this ability does not break the bard's concentration on the fascinate effect, nor does it allow a second saving throw against the fascinate effect.\n\nMaking a suggestion doesn't count against a bard's daily limit on bardic music performances. A Will saving throw (DC 10 + \u00bd bard's level + bard's Cha modifier) negates the effect. This ability affects only a single creature (but see mass suggestion, below). Suggestion is an enchantment (compulsion), mind-affecting, language dependent ability.",
      },
      {
        level: 9,
        name: "Inspire Greatness (Su)",
        description: "A bard of 9th level or higher with 12 or more ranks in a Perform skill can use music or poetics to inspire greatness in himself or a single willing ally within 30 feet, granting him or her extra fighting capability. For every three levels a bard attains beyond 9th, he can target one additional ally with a single use of this ability (two at 12th level, three at 15th, four at 18th). To inspire greatness, a bard must sing and an ally must hear him sing. The effect lasts for as long as the ally hears the bard sing and for 5 rounds thereafter. A creature inspired with greatness gains 2 bonus Hit Dice (d10s), the commensurate number of temporary hit points (apply the target's Constitution modifier, if any, to these bonus Hit Dice), a +2 competence bonus on attack rolls, and a +1 competence bonus on Fortitude saves. The bonus Hit Dice count as regular Hit Dice for determining the effect of spells that are Hit Dice dependant. Inspire greatness is a mind-affecting ability.",
      },
      {
        level: 12,
        name: "Song of Freedom (Sp)",
        description: "A bard of 12th level or higher with 15 or more ranks in a Perform skill can use music or poetics to create an effect equivalent to the break enchantment spell (caster level equals the character's bard level). Using this ability requires 1 minute of uninterrupted concentration and music, and it functions on a single target within 30 feet. A bard can't use song of freedom on himself.",
      },
      {
        level: 15,
        name: "Inspire Heroics (Su)",
        description: "A bard of 15th level or higher with 18 or more ranks in a Perform skill can use music or poetics to inspire tremendous heroism in himself or a single willing ally within 30 feet. For every three bard levels the character attains beyond 15th, he can inspire heroics in one additional creature. To inspire heroics, a bard must sing and an ally must hear the bard sing for a full round. A creature so inspired gains a +4 morale bonus on saving throws and a +4 dodge bonus to AC. The effect lasts for as long as the ally hears the bard sing and for up to 5 rounds thereafter. Inspire heroics is a mind-affecting ability.",
      },
      {
        level: 18,
        name: "Mass Suggestion (Sp)",
        description: "This ability functions like suggestion, above, except that a bard of 18th level or higher with 21 or more ranks in a Perform skill can make the suggestion simultaneously to any number of creatures that he has already fascinated. Mass suggestion is an enchantment (compulsion), mind-affecting, language-dependent ability.",
      },
    ],
    spellProgression: [
      { level: 1, slots: [0, 0, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 0 },
      { level: 2, slots: [0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 2 },
      { level: 3, slots: [1, 0, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 3 },
      { level: 4, slots: [2, 0, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 5 },
      { level: 5, slots: [3, 1, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 7 },
      { level: 6, slots: [3, 2, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 7 },
      { level: 7, slots: [3, 2, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 10 },
      { level: 8, slots: [3, 3, 1, 0, 0, 0], cantripsKnown: 6, spellsKnown: 11 },
      { level: 9, slots: [3, 3, 2, 0, 0, 0], cantripsKnown: 6, spellsKnown: 11 },
      { level: 10, slots: [3, 3, 2, 0, 0, 0], cantripsKnown: 6, spellsKnown: 14 },
      { level: 11, slots: [3, 3, 3, 1, 0, 0], cantripsKnown: 6, spellsKnown: 15 },
      { level: 12, slots: [3, 3, 3, 2, 0, 0], cantripsKnown: 6, spellsKnown: 15 },
      { level: 13, slots: [3, 3, 3, 2, 0, 0], cantripsKnown: 6, spellsKnown: 18 },
      { level: 14, slots: [3, 3, 3, 3, 1, 0], cantripsKnown: 6, spellsKnown: 19 },
      { level: 15, slots: [4, 3, 3, 3, 2, 0], cantripsKnown: 6, spellsKnown: 19 },
      { level: 16, slots: [4, 4, 3, 3, 2, 0], cantripsKnown: 6, spellsKnown: 23 },
      { level: 17, slots: [4, 4, 4, 3, 3, 1], cantripsKnown: 6, spellsKnown: 25 },
      { level: 18, slots: [4, 4, 4, 4, 3, 2], cantripsKnown: 6, spellsKnown: 26 },
      { level: 19, slots: [4, 4, 4, 4, 4, 3], cantripsKnown: 6, spellsKnown: 28 },
      { level: 20, slots: [4, 4, 4, 4, 4, 4], cantripsKnown: 6, spellsKnown: 29 },
    ],
  },
  {
    classId: "cleric",
    subclassLevel: 1,
    subclassLabel: "Domain",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Aura (Ex)",
        description: "A cleric of a chaotic, evil, good, or lawful deity has a particularly powerful aura corresponding to the deity's alignment (see the detect evil spell for details). Clerics who don't worship a specific deity but choose the Chaos, Evil, Good, or Law domain have a similarly powerful aura of the corresponding alignment.",
      },
      {
        level: 1,
        name: "Spells",
        description: "A cleric casts divine spells, which are drawn from the cleric spell list. However, his alignment may restrict him from casting certain spells opposed to his moral or ethical beliefs; see Chaotic, Evil, Good, and Lawful Spells, below. A cleric must choose and prepare his spells in advance (see below).\n\nTo prepare or cast a spell, a cleric must have a Wisdom score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a cleric's spell is 10 + the spell level + the cleric's Wisdom modifier.\n\nLike other spellcasters, a cleric can cast only a certain number of spells of each spell level per day. His base daily spell allotment is given on Table: The Cleric. In addition, he receives bonus spells per day if he has a high Wisdom score. A cleric also gets one domain spell of each spell level he can cast, starting at 1st level. When a cleric prepares a spell in a domain spell slot, it must come from one of his two domains (see Deities, Domains, and Domain Spells, below).\n\nClerics meditate or pray for their spells. Each cleric must choose a time at which he must spend 1 hour each day in quiet contemplation or supplication to regain his daily allotment of spells. Time spent resting has no effect on whether a cleric can prepare spells. A cleric may prepare and cast any spell on the cleric spell list, provided that he can cast spells of that level, but he must choose which spells to prepare during his daily meditation.",
      },
      {
        level: 1,
        name: "Spontaneous Casting",
        description: "A good cleric (or a neutral cleric of a good deity) can channel stored spell energy into healing spells that the cleric did not prepare ahead of time. The cleric can \"lose\" any prepared spell that is not a domain spell in order to cast any cure spell of the same spell level or lower (a cure spell is any spell with \"cure\" in its name).\n\nAn evil cleric (or a neutral cleric of an evil deity), can't convert prepared spells to cure spells but can convert them to inflict spells (an inflict spell is one with \"inflict\" in its name).\n\nA cleric who is neither good nor evil and whose deity is neither good nor evil can convert spells to either cure spells or inflict spells (player's choice). Once the player makes this choice, it cannot be reversed. This choice also determines whether the cleric turns or commands undead.",
      },
      {
        level: 1,
        name: "Alignment-Restricted Spells",
        description: "A cleric can't cast spells of an alignment opposed to his own or his deity's (if he has one). Spells associated with particular alignments are indicated by the chaos, evil, good, and law descriptors in their spell descriptions.",
      },
      {
        level: 1,
        name: "Turn or Rebuke Undead (Su)",
        description: "Any cleric, regardless of alignment, has the power to affect undead creatures by channeling the power of his faith through his holy (or unholy) symbol (see Turn or Rebuke Undead).\n\nA good cleric (or a neutral cleric who worships a good deity) can turn or destroy undead creatures. An evil cleric (or a neutral cleric who worships an evil deity) instead rebukes or commands such creatures. A neutral cleric of a neutral deity must choose whether his turning ability functions as that of a good cleric or an evil cleric. Once this choice is made, it cannot be reversed. This decision also determines whether the cleric can cast spontaneous cure or inflict spells.\n\nA cleric may attempt to turn undead a number of times per day equal to 3 + his Charisma modifier. A cleric with 5 or more ranks in Knowledge (religion) gets a +2 bonus on turning checks against undead.",
      },
      {
        level: 1,
        name: "Bonus Languages",
        description: "A cleric's bonus language options include Celestial, Abyssal, and Infernal (the languages of good, chaotic evil, and lawful evil outsiders, respectively). These choices are in addition to the bonus languages available to the character because of his race.",
      },
    ],
    spellProgression: [
      { level: 1, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 2, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 3, slots: [3, 2, 0, 0, 0, 0, 0, 0, 0] },
      { level: 4, slots: [4, 3, 0, 0, 0, 0, 0, 0, 0] },
      { level: 5, slots: [4, 3, 2, 0, 0, 0, 0, 0, 0] },
      { level: 6, slots: [4, 4, 3, 0, 0, 0, 0, 0, 0] },
      { level: 7, slots: [5, 4, 3, 2, 0, 0, 0, 0, 0] },
      { level: 8, slots: [5, 4, 4, 3, 0, 0, 0, 0, 0] },
      { level: 9, slots: [5, 5, 4, 3, 2, 0, 0, 0, 0] },
      { level: 10, slots: [5, 5, 4, 4, 3, 0, 0, 0, 0] },
      { level: 11, slots: [6, 5, 5, 4, 3, 2, 0, 0, 0] },
      { level: 12, slots: [6, 5, 5, 4, 4, 3, 0, 0, 0] },
      { level: 13, slots: [6, 6, 5, 5, 4, 3, 2, 0, 0] },
      { level: 14, slots: [6, 6, 5, 5, 4, 4, 3, 0, 0] },
      { level: 15, slots: [6, 6, 6, 5, 5, 4, 3, 2, 0] },
      { level: 16, slots: [6, 6, 6, 5, 5, 4, 4, 3, 0] },
      { level: 17, slots: [6, 6, 6, 6, 5, 5, 4, 3, 2] },
      { level: 18, slots: [6, 6, 6, 6, 5, 5, 4, 4, 3] },
      { level: 19, slots: [6, 6, 6, 6, 6, 5, 5, 4, 4] },
      { level: 20, slots: [6, 6, 6, 6, 6, 5, 5, 5, 5] },
    ],
    subclasses: [
      {
        id: "air-domain",
        name: "Air Domain",
        summary: "Turn or destroy earth creatures as a good cleric turns undead. Rebuke, command, or bolster air creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to ",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Air Domain",
            description: "Turn or destroy earth creatures as a good cleric turns undead. Rebuke, command, or bolster air creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatural ability.\n\nDomain spells: Obscuring Mist: Fog surrounds you.; Wind Wall: Deflects arrows, smaller creatures, and gases.; Gaseous Form: Subject becomes insubstantial and can fly slowly.; Air Walk: Subject treads on air as if solid (climb at 45-degree angle).; Control Winds: Change wind direction and speed.; Chain Lightning: 1d6/level damage; 1 secondary bolt/level each deals half damage.; Control Weather: Changes weather in local area.; Whirlwind: Cyclone deals damage and can pick up creatures.; Elemental Swarm *: Summons multiple elementals.",
          },
        ],
      },
      {
        id: "animal-domain",
        name: "Animal Domain",
        summary: "You can use speak with animals once per day as a spell-like ability. Add Knowledge (nature) to your list of cleric class skills.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Animal Domain",
            description: "You can use speak with animals once per day as a spell-like ability. Add Knowledge (nature) to your list of cleric class skills.\n\nDomain spells: Calm Animals: Calms (2d4 + level) HD of animals.; Hold Animal: Paralyzes one animal for 1 round/level.; Dominate Animal: Subject animal obeys silent mental commands.; Summon Nature's Ally IV *: Calls creature to fight.; Commune with Nature: Learn about terrain for 1 mile/level.; Antilife Shell: 10-ft. field hedges out living creatures.; Animal Shapes: One ally/level polymorphs into chosen animal.; Summon Nature's Ally VIII *: Calls creature to fight.; Shapechange: Transforms you into any creature, and change forms once per round.",
          },
        ],
      },
      {
        id: "chaos-domain",
        name: "Chaos Domain",
        summary: "You cast chaos spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Chaos Domain",
            description: "You cast chaos spells at +1 caster level.\n\nDomain spells: Protection from Law: +2 to AC and saves, counter mind control, hedge out elementals and outsiders.; Shatter: Sonic vibration damages objects or crystalline creatures.; Magic Circle against Law: As protection spells, but 10-ft. radius and 10 min./level.; Chaos Hammer: Damages and staggers lawful creatures.; Dispel Law: +4 bonus against attacks by lawful creatures.; Animate Objects: Objects attack your foes.; Word of Chaos: Kills, confuses, stuns, or deafens nonchaotic subjects.; Cloak of Chaos: +4 to AC, +4 resistance, SR 25 against lawful spells.; Summon Monster IX *: Calls extraplanar creature to fight for you.",
          },
        ],
      },
      {
        id: "death-domain",
        name: "Death Domain",
        summary: "You may use a death touch once per day. Your death touch is a supernatural ability that produces a death effect. You must succeed on a melee touch attack against a living creature (using the rules for",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Death Domain",
            description: "You may use a death touch once per day. Your death touch is a supernatural ability that produces a death effect. You must succeed on a melee touch attack against a living creature (using the rules for touch spells). When you touch, roll 1d6 per cleric level you possess. If the total at least equals the creature's current hit points, it dies (no save).\n\nDomain spells: Cause Fear: One creature of 5 HD or less flees for 1d4 rounds.; Death Knell: Kill dying creature and gain 1d8 temporary hp, +2 to Str, and +1 caster level.; Animate Dead: Creates undead skeletons and zombies.; Death Ward: Grants immunity to death spells and negative energy effects.; Slay Living: Touch attack kills subject.; Create Undead: Create ghouls, ghasts, mummies, or mohrgs.; Destruction: Kills subject and destroys remains.; Create Greater Undead: Create shadows, wraiths, spectres, or devourers.; Wail of the Banshee: Kills one creature/level.",
          },
        ],
      },
      {
        id: "destruction-domain",
        name: "Destruction Domain",
        summary: "You gain the smite power, the supernatural ability to make a single melee attack with a +4 bonus on attack rolls and a bonus on damage rolls equal to your cleric level (if you hit). You must declare t",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Destruction Domain",
            description: "You gain the smite power, the supernatural ability to make a single melee attack with a +4 bonus on attack rolls and a bonus on damage rolls equal to your cleric level (if you hit). You must declare the smite before making the attack. This ability is usable once per day.\n\nDomain spells: Inflict Light Wounds: Touch attack, 1d8 damage +1/level (max +5).; Shatter: Sonic vibration damages objects or crystalline creatures.; Contagion: Infects subject with chosen disease.; Inflict Critical Wounds: Touch attack, 4d8 damage +1/level (max +20).; Inflict Light Wounds, Mass: Deals 1d8 damage +1/level to any creatures.; Harm: Deals 10 points/level damage to target.; Disintegrate: Makes one creature or object vanish.; Earthquake: Intense tremor shakes 80-ft.-radius.; Implosion: Kills one creature/round.",
          },
        ],
      },
      {
        id: "earth-domain",
        name: "Earth Domain",
        summary: "Turn or destroy air creatures as a good cleric turns undead. Rebuke, command, or bolster earth creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to ",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Earth Domain",
            description: "Turn or destroy air creatures as a good cleric turns undead. Rebuke, command, or bolster earth creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatural ability.\n\nDomain spells: Magic Stone: Three stones become +1 projectiles, 1d6 +1 damage.; Soften Earth and Stone: Turns stone to clay or dirt to sand or mud.; Stone Shape: Sculpts stone into any shape.; Spike Stones: Creatures in area take 1d8 damage, may be lowed.; Wall of Stone: Creates a stone wall that can be shaped.; Stoneskin: Ignore 10 points of damage per attack.; Earthquake: Intense tremor shakes 80-ft.-radius.; Iron Body: Your body becomes living iron.; Elemental Swarm *: Summons multiple elementals.",
          },
        ],
      },
      {
        id: "evil-domain",
        name: "Evil Domain",
        summary: "You cast evil spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Evil Domain",
            description: "You cast evil spells at +1 caster level.\n\nDomain spells: Protection from Good: +2 to AC and saves, counter mind control, hedge out elementals and outsiders.; Desecrate: Fills area with negative energy, making undead stronger.; Magic Circle against Good: As protection spells, but 10-ft. radius and 10 min./level.; Unholy Blight: Damages and sickens good creatures.; Dispel Good: +4 bonus against attacks by good creatures.; Create Undead: Create ghouls, ghasts, mummies, or mohrgs.; Blasphemy: Kills, paralyzes, weakens, or dazes nonevil subjects.; Unholy Aura: +4 to AC, +4 resistance, SR 25 against good spells.; Summon Monster IX *: Calls extraplanar creature to fight for you.",
          },
        ],
      },
      {
        id: "fire-domain",
        name: "Fire Domain",
        summary: "Turn or destroy water creatures as a good cleric turns undead. Rebuke, command, or bolster fire creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Fire Domain",
            description: "Turn or destroy water creatures as a good cleric turns undead. Rebuke, command, or bolster fire creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatural ability.\n\nDomain spells: Burning Hands: 1d4/level fire damage (max 5d4).; Produce Flame: 1d6 damage +1/ level, touch or thrown.; Resist Energy *: Ignores 10 (or more) points of damage/attack from specified energy type.; Wall of Fire: Deals 2d4 fire damage out to 10 ft. and 1d4 out to 20 ft. Passing through wall deals 2d6 damage +1/level.; Fire Shield: Creatures attacking you take fire damage; you're protected from heat or cold.; Fire Seeds: Acorns and berries become grenades and bombs.; Fire Storm: Deals 1d6/level fire damage.; Incendiary Cloud: Cloud deals 4d6 fire damage/round.; Elemental Swarm **: Summons multiple elementals.",
          },
        ],
      },
      {
        id: "good-domain",
        name: "Good Domain",
        summary: "You cast good spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Good Domain",
            description: "You cast good spells at +1 caster level.\n\nDomain spells: Protection from Evil: +2 to AC and saves, counter mind control, hedge out elementals and outsiders.; Aid: +1 on attack rolls, +1 on saves against fear, 1d8 temporary hp +1/level (max +10).; Magic Circle against Evil: As protection spells, but 10-ft. radius and 10 min./level.; Holy Smite: Damages and blinds evil creatures.; Dispel Evil: +4 bonus against attacks by evil creatures.; Blade Barrier: Wall of blades deals 1d6/level damage.; Holy Word: Kills, paralyzes, slows, or deafens nongood subjects.; Holy Aura: +4 to AC, +4 resistance, and SR 25 against evil spells.; Summon Monster IX *: Calls extraplanar creature to fight for you.",
          },
        ],
      },
      {
        id: "healing-domain",
        name: "Healing Domain",
        summary: "You cast healing spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Healing Domain",
            description: "You cast healing spells at +1 caster level.\n\nDomain spells: Cure Light Wounds: Cures 1d8 damage +1/level (max +5).; Cure Moderate Wounds: Cures 2d8 damage +1/level (max +10).; Cure Serious Wounds: Cures 3d8 damage +1/level (max +15).; Cure Critical Wounds: Cures 4d8 damage +1/level (max +20).; Cure Light Wounds, Mass: Cures 1d8 damage +1/level (max +25) for many creatures.; Heal: Cures 10 points/level of damage, all diseases and mental conditions.; Regenerate: Subject's severed limbs grow back, cures 4d8 damage +1/level (max +35).; Cure Critical Wounds, Mass: Cures 4d8 damage +1/level (max +40) for many creatures.; Heal, Mass: As heal, but with several subjects.",
          },
        ],
      },
      {
        id: "knowledge-domain",
        name: "Knowledge Domain",
        summary: "Add all Knowledge skills to your list of cleric class skills. You cast divination spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Knowledge Domain",
            description: "Add all Knowledge skills to your list of cleric class skills. You cast divination spells at +1 caster level.\n\nDomain spells: Detect Secret Doors: Reveals hidden doors within 60 ft.; Detect Thoughts: Allows \"listening\" to surface thoughts.; Clairaudience/Clairvoyance: Hear or see at a distance for 1 min./level.; Divination: Provides useful advice for specific proposed actions.; True Seeing: Lets you see all things as they really are.; Find the Path: Shows most direct way to a location.; Legend Lore: Lets you learn tales about a person, place, or thing.; Discern Location: Reveals exact location of creature or object.; Foresight: \"Sixth sense\" warns of impending danger.",
          },
        ],
      },
      {
        id: "law-domain",
        name: "Law Domain",
        summary: "You cast law spells at +1 caster level.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Law Domain",
            description: "You cast law spells at +1 caster level.\n\nDomain spells: Protection from Chaos: +2 to AC and saves, counter mind control, hedge out elementals and outsiders.; Calm Emotions: Calms creatures, negating emotion effects.; Magic Circle against Chaos: As protection spells, but 10-ft. radius and 10 min./level.; Order's Wrath: Damages and dazes chaotic creatures.; Dispel Chaos: +4 bonus against attacks by chaotic creatures.; Hold Monster: As hold person, but any creature.; Dictum: Kills, paralyzes, slows, or deafens nonlawful subjects.; Shield of Law: +4 to AC, +4 resistance, and SR 25 against chaotic spells.; Summon Monster IX *: Calls extraplanar creature to fight for you.",
          },
        ],
      },
      {
        id: "luck-domain",
        name: "Luck Domain",
        summary: "You gain the power of good fortune, which is usable once per day. This extraordinary ability allows you to reroll one roll that you have just made before the game master declares whether the roll resu",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Luck Domain",
            description: "You gain the power of good fortune, which is usable once per day. This extraordinary ability allows you to reroll one roll that you have just made before the game master declares whether the roll results in success or failure. You must take the result of the reroll, even if it's worse than the original roll.\n\nDomain spells: Entropic Shield: Ranged attacks against you have 20% miss chance.; Aid: +1 on attack rolls, +1 against fear, 1d8 temporary hp +1/level (max +10).; Protection from Energy: Absorb 12 points/level of damage from one kind of energy.; Freedom of Movement: Subject moves normally despite impediments.; Break Enchantment: Frees subjects from enchantments, alterations, curses, and petrification.; Mislead: Turns you invisible and creates illusory double.; Spell Turning: Reflect 1d4+6 spell levels back at caster.; Moment of Prescience: You gain insight bonus on single attack roll, check, or save.; Miracle: Requests a deity's intercession.",
          },
        ],
      },
      {
        id: "magic-domain",
        name: "Magic Domain",
        summary: "Use scrolls, wands, and other devices with spell completion or spell trigger activation as a wizard of one-half your cleric level (at least 1st level). For the purpose of using a scroll or other magic",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Magic Domain",
            description: "Use scrolls, wands, and other devices with spell completion or spell trigger activation as a wizard of one-half your cleric level (at least 1st level). For the purpose of using a scroll or other magic device, if you are also a wizard, actual wizard levels and these effective wizard levels stack.\n\nDomain spells: Magic Aura: Alters object's magic aura.; Identify: Determines properties of magic item.; Dispel Magic: Cancels magical spells and effects.; Imbue with Spell Ability: Transfer spells to subject.; Spell Resistance: Subject gains SR 12 + level.; Antimagic Field: Negates magic within 10 ft.; Spell Turning: Reflect 1d4+6 spell levels back at caster.; Protection from Spells: Confers +8 resistance bonus.; Mage's Disjunction: Dispels magic, disenchants magic items.",
          },
        ],
      },
      {
        id: "plant-domain",
        name: "Plant Domain",
        summary: "Rebuke or command plant creatures as an evil cleric rebukes or commands undead. Use this ability a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatur",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Plant Domain",
            description: "Rebuke or command plant creatures as an evil cleric rebukes or commands undead. Use this ability a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatural ability. Add Knowledge (nature) to your list of cleric class skills.\n\nDomain spells: Entangle: Plants entangle everyone in 40-ft.-radius.; Barkskin: Grants +2 (or higher) enhancement to natural armor.; Plant Growth: Grows vegetation, improves crops.; Command Plants: Sway the actions of one or more plant creatures.; Wall of Thorns: Thorns damage anyone who tries to pass.; Repel Wood: Pushes away wooden objects.; Animate Plants: One or more trees animate and fight for you.; Control Plants: Control actions of one or more plant creatures.; Shambler: Summons 1d4+2 shambling mounds to fight for you.",
          },
        ],
      },
      {
        id: "protection-domain",
        name: "Protection Domain",
        summary: "You can generate a protective ward as a supernatural ability. Grant someone you touch a resistance bonus equal to your cleric level on his or her next saving throw. Activating this power is a standard",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Protection Domain",
            description: "You can generate a protective ward as a supernatural ability. Grant someone you touch a resistance bonus equal to your cleric level on his or her next saving throw. Activating this power is a standard action. The protective ward is an abjuration effect with a duration of 1 hour that is usable once per day.\n\nDomain spells: Sanctuary: Opponents can't attack you, and you can't attack.; Shield Other: You take half of subject's damage.; Protection from Energy: Absorb 12 points/level of damage from one kind of energy.; Spell Immunity: Subject is immune to one spell per four levels.; Spell Resistance: Subject gains SR 12 + level.; Antimagic Field: Negates magic within 10 ft.; Repulsion: Creatures can't approach you.; Mind Blank: Subject is immune to mental/emotional magic and scrying.; Prismatic Sphere: As prismatic wall, but surrounds on all sides.",
          },
        ],
      },
      {
        id: "strength-domain",
        name: "Strength Domain",
        summary: "You can perform a feat of strength as a supernatural ability. You gain an enhancement bonus to Strength equal to your cleric level. Activating the power is a free action, the power lasts 1 round, and ",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Strength Domain",
            description: "You can perform a feat of strength as a supernatural ability. You gain an enhancement bonus to Strength equal to your cleric level. Activating the power is a free action, the power lasts 1 round, and it is usable once per day.\n\nDomain spells: Enlarge Person: Humanoid creature doubles in size.; Bull's Strength: Subject gains +4 to Str for 1 min./level.; Magic Vestment: Armor or shield gains +1 enhancement per four levels.; Spell Immunity: Subject is immune to one spell per four levels.; Righteous Might: Your size increases, and you gain combat bonuses.; Stoneskin: Ignore 10 points of damage per attack.; Grasping Hand: Large hand provides cover, pushes, or grapples.; Clenched Fist: Large hand provides cover, pushes, or attacks your foes.; Crushing Hand: Large hand provides cover, pushes, or crushes your foes.",
          },
        ],
      },
      {
        id: "sun-domain",
        name: "Sun Domain",
        summary: "Once per day, you can perform a greater turning against undead in place of a regular turning. The greater turning is like a normal turning except that the undead creatures that would be turned are des",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Sun Domain",
            description: "Once per day, you can perform a greater turning against undead in place of a regular turning. The greater turning is like a normal turning except that the undead creatures that would be turned are destroyed instead.\n\nDomain spells: Endure Elements: Exist comfortably in hot or cold environments.; Heat Metal: Make metal so hot it damages those who touch it.; Searing Light: Ray deals 1d8/two levels, more against undead.; Fire Shield: Creatures attacking you take fire damage; you're protected from heat or cold.; Flame Strike: Smite foes with divine fire (1d6/level damage).; Fire Seeds: Acorns and berries become grenades and bombs.; Sunbeam: Beam blinds and deals 4d6 damage.; Sunburst: Blinds all within 10 ft., deals 6d6 damage.; Prismatic Sphere: As prismatic wall, but surrounds on all sides.",
          },
        ],
      },
      {
        id: "travel-domain",
        name: "Travel Domain",
        summary: "For a total time per day of 1 round per cleric level you possess, you can act normally regardless of magical effects that impede movement as if you were affected by the spell freedom of movement. This",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Travel Domain",
            description: "For a total time per day of 1 round per cleric level you possess, you can act normally regardless of magical effects that impede movement as if you were affected by the spell freedom of movement. This effect occurs automatically as soon as it applies, lasts until it runs out or is no longer needed, and can operate multiple times per day (up to the total daily limit of rounds). This granted power is a supernatural ability. Add Survival to your list of cleric class skills.\n\nDomain spells: Longstrider: Increases your speed.; Locate Object: Senses direction toward object (specific or type).; Fly: Subject flies at speed of 60 ft.; Dimension Door: Teleports you short distance.; Teleport: Instantly transports you as far as 100 miles/level.; Find the Path: Shows most direct way to a location.; Teleport, Greater: As teleport, but no range limit and no off-target arrival.; Phase Door: Creates an invisible passage through wood or stone.; Astral Projection: Projects you and companions onto Astral Plane.",
          },
        ],
      },
      {
        id: "trickery-domain",
        name: "Trickery Domain",
        summary: "Add Bluff, Disguise, and Hide to your list of cleric class skills.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Trickery Domain",
            description: "Add Bluff, Disguise, and Hide to your list of cleric class skills.\n\nDomain spells: Disguise Self: Disguise own appearance.; Invisibility: Subject invisible 1 min./level or until it attacks.; Nondetection: Hides subject from divination, scrying.; Confusion: Subjects behave oddly for 1 round/level.; False Vision: Fools scrying with an illusion.; Mislead: Turns you invisible and creates illusory double.; Screen: Illusion hides area from vision, scrying.; Polymorph Any Object: Changes any subject into anything else.; Time Stop: You act freely for 1d4+1 rounds.",
          },
        ],
      },
      {
        id: "war-domain",
        name: "War Domain",
        summary: "Free Martial Weapon Proficiency with deity's favored weapon (if necessary) and Weapon Focus with the deity's favored weapon.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "War Domain",
            description: "Free Martial Weapon Proficiency with deity's favored weapon (if necessary) and Weapon Focus with the deity's favored weapon.\n\nDomain spells: Magic Weapon: Weapon gains +1 bonus.; Spiritual Weapon: Magical weapon attacks on its own.; Magic Vestment: Armor or shield gains +1 enhancement per four levels.; Divine Power: You gain attack bonus, +6 to Str, and 1 hp/level.; Flame Strike: Smite foes with divine fire (1d6/level damage).; Blade Barrier: Wall of blades deals 1d6/level damage.; Power Word Blind: Blinds creature with 200 hp or less.; Power Word Stun: Stuns creature with 150 hp or less.; Power Word Kill: Kills creature with 100 hp or less.",
          },
        ],
      },
      {
        id: "water-domain",
        name: "Water Domain",
        summary: "Turn or destroy fire creatures as a good cleric turns undead. Rebuke, command, or bolster water creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Water Domain",
            description: "Turn or destroy fire creatures as a good cleric turns undead. Rebuke, command, or bolster water creatures as an evil cleric rebukes undead. Use these abilities a total number of times per day equal to 3 + your Charisma modifier. This granted power is a supernatural ability.\n\nDomain spells: Obscuring Mist: Fog surrounds you.; Fog Cloud: Fog obscures vision.; Water Breathing: Subjects can breathe underwater.; Control Water: Raises or lowers bodies of water.; Ice Storm: Hail deals 5d6 damage in cylinder 40 ft. across.; Cone of Cold: 1d6/level cold damage.; Acid Fog: Fog deals acid damage.; Horrid Wilting: Deals 1d6/level damage within 30 ft.; Elemental Swarm *: Summons multiple elementals.",
          },
        ],
      },
    ],
  },
  {
    classId: "druid",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Animal Companion (Ex)",
        description: "A druid may begin play with an animal companion selected from the following list: badger, camel, dire rat, dog, riding dog, eagle, hawk, horse (light or heavy), owl, pony, snake (Small or Medium viper), or wolf. If the campaign takes place wholly or partly in an aquatic environment, the following creatures are also available: porpoise, Medium shark, and squid. This animal is a loyal companion that accompanies the druid on her adventures as appropriate for its kind.\n\nA 1st-level druid's companion is completely typical for its kind except as noted below. As a druid advances in level, the animal's power increases as shown on the table. If a druid releases her companion from service, she may gain a new one by performing a ceremony requiring 24 uninterrupted hours of prayer. This ceremony can also replace an animal companion that has perished.\n\nA druid of 4th level or higher may select from alternative lists of animals. Should she select an animal companion from one of these alternative lists, the creature gains abilities as if the character's druid level were lower than it actually is. Subtract the value indicated in the appropriate list header from the character's druid level and compare the result with the druid level entry on the table to determine the animal companion's powers. (If this adjustment would reduce the druid's effective level to 0 or lower, she can't have that animal as a companion.)",
      },
      {
        level: 1,
        name: "Nature Sense (Ex)",
        description: "A druid gains a +2 bonus on Knowledge (nature) and Survival checks.",
      },
      {
        level: 1,
        name: "Wild Empathy (Ex)",
        description: "A druid can improve the attitude of an animal. This ability functions just like a Diplomacy check made to improve the attitude of a person. The druid rolls 1d20 and adds her druid level and her Charisma modifier to determine the wild empathy check result.\n\nThe typical domestic animal has a starting attitude of indifferent, while wild animals are usually unfriendly.\n\nTo use wild empathy, the druid and the animal must be able to study each other, which means that they must be within 30 feet of one another under normal conditions. Generally, influencing an animal in this way takes 1 minute but, as with influencing people, it might take more or less time.\n\nA druid can also use this ability to influence a magical beast with an Intelligence score of 1 or 2, but she takes a -4 penalty on the check.",
      },
      {
        level: 1,
        name: "Spells",
        description: "A druid casts divine spells, which are drawn from the druid spell list. Her alignment may restrict her from casting certain spells opposed to her moral or ethical beliefs; see Chaotic, Evil, Good, and Lawful Spells, below. A druid must choose and prepare her spells in advance (see below).\n\nTo prepare or cast a spell, the druid must have a Wisdom score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a druid's spell is 10 + the spell level + the druid's Wisdom modifier.\n\nLike other spellcasters, a druid can cast only a certain number of spells of each spell level per day. Her base daily spell allotment is given on Table: The Druid. In addition, she receives bonus spells per day if she has a high Wisdom score. She does not have access to any domain spells or granted powers, as a cleric does.\n\nA druid prepares and casts spells the way a cleric does, though she cannot lose a prepared spell to cast a cure spell in its place (but see Spontaneous Casting, below). A druid may prepare and cast any spell on the druid spell list, provided that she can cast spells of that level, but she must choose which spells to prepare during her daily meditation.",
      },
      {
        level: 1,
        name: "Spontaneous Casting",
        description: "A druid can channel stored spell energy into summoning spells that she hasn't prepared ahead of time. She can \"lose\" a prepared spell in order to cast any summon nature's ally spell of the same level or lower.",
      },
      {
        level: 1,
        name: "Bonus Languages",
        description: "A druid's bonus language options include Sylvan, the language of woodland creatures. This choice is in addition to the bonus languages available to the character because of her race.\n\nA druid also knows Druidic, a secret language known only to druids, which she learns upon becoming a 1st-level druid. Druidic is a free language for a druid; that is, she knows it in addition to her regular allotment of languages and it doesn't take up a language slot. Druids are forbidden to teach this language to nondruids.\n\nDruidic has its own alphabet.",
      },
      {
        level: 2,
        name: "Woodland Stride (Ex)",
        description: "Starting at 2nd level, a druid may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at her normal speed and without taking damage or suffering any other impairment. However, thorns, briars, and overgrown areas that have been magically manipulated to impede motion still affect her.",
      },
      {
        level: 3,
        name: "Trackless Step (Ex)",
        description: "Starting at 3rd level, a druid leaves no trail in natural surroundings and cannot be tracked. She may choose to leave a trail if so desired.",
      },
      {
        level: 4,
        name: "Resist Nature's Lure (Ex)",
        description: "Starting at 4th level, a druid gains a +4 bonus on saving throws against the spell-like abilities of fey.",
      },
      {
        level: 5,
        name: "Wild Shape (Su)",
        description: "At 5th level, a druid gains the ability to turn herself into any Small or Medium animal and back again once per day. Her options for new forms include all creatures with the animal type. This ability functions like the alternate form special ability, except as noted here. The effect lasts for 1 hour per druid level, or until she changes back. Changing form (to animal or back) is a standard action and doesn't provoke an attack of opportunity. Each time you use wild shape, you regain lost hit points as if you had rested for a night.\n\nAny gear worn or carried by the druid melds into the new form and becomes nonfunctional. When the druid reverts to her true form, any objects previously melded into the new form reappear in the same location on her body that they previously occupied and are once again functional. Any new items worn in the assumed form fall off and land at the druid's feet.\n\nThe form chosen must be that of an animal the druid is familiar with.\n\nA druid loses her ability to speak while in animal form because she is limited to the sounds that a normal, untrained animal can make, but she can communicate normally with other animals of the same general grouping as her new form. (The normal sound a wild parrot makes is a squawk, so changing to this form does not permit speech.)\n\nA druid can use this ability more times per day at 6th, 7th, 10th, 14th, and 18th level, as noted on Table: The Druid. In addition, she gains the ability to take the shape of a Large animal at 8th level, a Tiny animal at 11th level, and a Huge animal at 15th level.\n\nThe new form's Hit Dice can't exceed the character's druid level.\n\nAt 12th level, a druid becomes able to use wild shape to change into a plant creature with the same size restrictions as for animal forms. (A druid can't use this ability to take the form of a plant that isn't a creature.)\n\nAt 16th level, a druid becomes able to use wild shape to change into a Small, Medium, or Large elemental (air, earth, fire, or water) once per day. These elemental forms are in addition to her normal wild shape usage. In addition to the normal effects of wild shape, the druid gains all the elemental's extraordinary, supernatural, and spell-like abilities. She also gains the elemental's feats for as long as she maintains the wild shape, but she retains her own creature type.\n\nAt 18th level, a druid becomes able to assume elemental form twice per day, and at 20th level she can do so three times per day. At 20th level, a druid may use this wild shape ability to change into a Huge elemental.",
      },
      {
        level: 9,
        name: "Venom Immunity (Ex)",
        description: "At 9th level, a druid gains immunity to all poisons.",
      },
      {
        level: 13,
        name: "A Thousand Faces (Su)",
        description: "At 13th level, a druid gains the ability to change her appearance at will, as if using the disguise self spell, but only while in her normal form. This affects the druid's body but not her possessions. It is not an illusory effect, but a minor physical alteration of the druid's appearance, within the limits described for the spell.",
      },
      {
        level: 15,
        name: "Timeless Body (Ex)",
        description: "After attaining 15th level, a druid no longer takes ability score penalties for aging and cannot be magically aged. Any penalties she may have already incurred, however, remain in place.\n\nBonuses still accrue, and the druid still dies of old age when her time is up.",
      },
    ],
    spellProgression: [
      { level: 1, slots: [1, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 2, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 3, slots: [2, 1, 0, 0, 0, 0, 0, 0, 0] },
      { level: 4, slots: [3, 2, 0, 0, 0, 0, 0, 0, 0] },
      { level: 5, slots: [3, 2, 1, 0, 0, 0, 0, 0, 0] },
      { level: 6, slots: [3, 3, 2, 0, 0, 0, 0, 0, 0] },
      { level: 7, slots: [4, 3, 2, 1, 0, 0, 0, 0, 0] },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { level: 9, slots: [4, 4, 3, 2, 1, 0, 0, 0, 0] },
      { level: 10, slots: [4, 4, 3, 3, 2, 0, 0, 0, 0] },
      { level: 11, slots: [5, 4, 4, 3, 2, 1, 0, 0, 0] },
      { level: 12, slots: [5, 4, 4, 3, 3, 2, 0, 0, 0] },
      { level: 13, slots: [5, 5, 4, 4, 3, 2, 1, 0, 0] },
      { level: 14, slots: [5, 5, 4, 4, 3, 3, 2, 0, 0] },
      { level: 15, slots: [5, 5, 5, 4, 4, 3, 2, 1, 0] },
      { level: 16, slots: [5, 5, 5, 4, 4, 3, 3, 2, 0] },
      { level: 17, slots: [5, 5, 5, 5, 4, 4, 3, 2, 1] },
      { level: 18, slots: [5, 5, 5, 5, 4, 4, 3, 3, 2] },
      { level: 19, slots: [5, 5, 5, 5, 5, 4, 4, 3, 3] },
      { level: 20, slots: [5, 5, 5, 5, 5, 4, 4, 4, 4] },
    ],
  },
  {
    classId: "fighter",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20],
    features: [
      {
        level: 1,
        name: "Bonus Feats",
        description: "At 1st level, a fighter gets a bonus combat-oriented feat in addition to the feat that any 1st-level character gets and the bonus feat granted to a human character. The fighter gains an additional bonus feat at 2nd level and every two fighter levels thereafter (4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, and 20th). These bonus feats must be drawn from the feats noted as fighter bonus feats. A fighter must still meet all prerequisites for a bonus feat, including ability score and base attack bonus minimums.\n\nThese bonus feats are in addition to the feat that a character of any class gets from advancing levels. A fighter is not limited to the list of fighter bonus feats when choosing these feats.",
      },
    ],
  },
  {
    classId: "monk",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 2, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "AC Bonus (Ex)",
        description: "When unarmored and unencumbered, the monk adds her Wisdom bonus (if any) to her AC. In addition, a monk gains a +1 bonus to AC at 5th level. This bonus increases by 1 for every five monk levels thereafter (+2 at 10th, +3 at 15th, and +4 at 20th level).\n\nThese bonuses to AC apply even against touch attacks or when the monk is flat-footed. She loses these bonuses when she is immobilized or helpless, when she wears any armor, when she carries a shield, or when she carries a medium or heavy load.",
      },
      {
        level: 1,
        name: "Flurry of Blows (Ex)",
        description: "When unarmored, a monk may strike with a flurry of blows at the expense of accuracy. When doing so, she may make one extra attack in a round at her highest base attack bonus, but this attack takes a -2 penalty, as does each other attack made that round. The resulting modified base attack bonuses are shown in the Flurry of Blows Attack Bonus column on Table: The Monk. This penalty applies for 1 round, so it also affects attacks of opportunity the monk might make before her next action. When a monk reaches 5th level, the penalty lessens to -1, and at 9th level it disappears. A monk must use a full attack action to strike with a flurry of blows.\n\nWhen using flurry of blows, a monk may attack only with unarmed strikes or with special monk weapons (kama, nunchaku, quarterstaff, sai, shuriken, and siangham). She may attack with unarmed strikes and special monk weapons interchangeably as desired. When using weapons as part of a flurry of blows, a monk applies her Strength bonus (not Str bonus \u00d7 1\u00bd or \u00d7\u00bd) to her damage rolls for all successful attacks, whether she wields a weapon in one or both hands. The monk can't use any weapon other than a special monk weapon as part of a flurry of blows.\n\nIn the case of the quarterstaff, each end counts as a separate weapon for the purpose of using the flurry of blows ability. Even though the quarterstaff requires two hands to use, a monk may still intersperse unarmed strikes with quarterstaff strikes, assuming that she has enough attacks in her flurry of blows routine to do so.\n\n#### Greater Flurry\n\nWhen a monk reaches 11th level, her flurry of blows ability improves. In addition to the standard single extra attack she gets from flurry of blows, she gets a second extra attack at her full base attack bonus.\n\n| Level | Damage (Small Monk) | Damage (Large Monk) |\n| --- | --- | --- |\n| 1st-3rd | 1d4 | 1d8 |\n| 4th-7th | 1d6 | 2d6 |\n| 8th-11th | 1d8 | 2d8 |\n| 12th-15th | 1d10 | 3d6 |\n| 16th-19th | 2d6 | 3d8 |\n| 20th | 2d8 | 4d8 |",
      },
      {
        level: 1,
        name: "Unarmed Strike",
        description: "At 1st level, a monk gains Improved Unarmed Strike as a bonus feat. A monk's attacks may be with either fist interchangeably or even from elbows, knees, and feet. This means that a monk may even make unarmed strikes with her hands full. There is no such thing as an off-hand attack for a monk striking unarmed. A monk may thus apply her full Strength bonus on damage rolls for all her unarmed strikes.\n\nUsually a monk's unarmed strikes deal lethal damage, but she can choose to deal nonlethal damage instead with no penalty on her attack roll. She has the same choice to deal lethal or nonlethal damage while grappling.\n\nA monk's unarmed strike is treated both as a manufactured weapon and a natural weapon for the purpose of spells and effects that enhance or improve either manufactured weapons or natural weapons.\n\nA monk also deals more damage with her unarmed strikes than a normal person would, as shown on Table: The Monk. The unarmed damage on Table: The Monk is for Medium monks. A Small monk deals less damage than the amount given there with her unarmed attacks, while a Large monk deals more damage; see Table: Small or Large Monk Unarmed Damage.",
      },
      {
        level: 1,
        name: "Bonus Feat",
        description: "At 1st level, a monk may select either Improved Grapple or Stunning Fist as a bonus feat. At 2nd level, she may select either Combat Reflexes or Deflect Arrows as a bonus feat. At 6th level, she may select either Improved Disarm or Improved Trip as a bonus feat. A monk need not have any of the prerequisites normally required for these feats to select them.",
      },
      {
        level: 2,
        name: "Evasion (Ex)",
        description: "At 2nd level or higher if a monk makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, she instead takes no damage. Evasion can be used only if a monk is wearing light armor or no armor. A helpless monk does not gain the benefit of evasion.",
      },
      {
        level: 3,
        name: "Still Mind (Ex)",
        description: "A monk of 3rd level or higher gains a +2 bonus on saving throws against spells and effects from the school of enchantment.",
      },
      {
        level: 3,
        name: "Fast Movement (Ex)",
        description: "At 3rd level, a monk gains an enhancement bonus to her speed, as shown on Table: The Monk. A monk in armor or carrying a medium or heavy load loses this extra speed.",
      },
      {
        level: 4,
        name: "Ki Strike (Su)",
        description: "At 4th level, a monk's unarmed attacks are empowered with ki. Her unarmed attacks are treated as magic weapons for the purpose of dealing damage to creatures with damage reduction. Ki strike improves with the character's monk level. At 10th level, her unarmed attacks are also treated as lawful weapons for the purpose of dealing damage to creatures with damage reduction. At 16th level, her unarmed attacks are treated as adamantine weapons for the purpose of dealing damage to creatures with damage reduction and bypassing hardness.",
      },
      {
        level: 4,
        name: "Slow Fall (Ex)",
        description: "At 4th level or higher, a monk within arm's reach of a wall can use it to slow her descent. When first using this ability, she takes damage as if the fall were 20 feet shorter than it actually is. The monk's ability to slow her fall (that is, to reduce the effective distance of the fall when next to a wall) improves with her monk level until at 20th level she can use a nearby wall to slow her descent and fall any distance without harm.",
      },
      {
        level: 5,
        name: "Purity of Body (Ex)",
        description: "At 5th level, a monk gains immunity to all diseases except for supernatural and magical diseases.",
      },
      {
        level: 7,
        name: "Wholeness of Body (Su)",
        description: "At 7th level or higher, a monk can heal her own wounds. She can heal a number of hit points of damage equal to twice her current monk level each day, and she can spread this healing out among several uses.",
      },
      {
        level: 9,
        name: "Improved Evasion (Ex)",
        description: "At 9th level, a monk's evasion ability improves. She still takes no damage on a successful Reflex saving throw against attacks, but henceforth she takes only half damage on a failed save. A helpless monk does not gain the benefit of improved evasion.",
      },
      {
        level: 11,
        name: "Diamond Body (Su)",
        description: "At 11th level, a monk gains immunity to poisons of all kinds.",
      },
      {
        level: 12,
        name: "Abundant Step (Su)",
        description: "At 12th level or higher, a monk can slip magically between spaces, as if using the spell dimension door, once per day. Her caster level for this effect is one-half her monk level (rounded down).",
      },
      {
        level: 13,
        name: "Diamond Soul (Ex)",
        description: "At 13th level, a monk gains spell resistance equal to her current monk level + 10. In order to affect the monk with a spell, a spellcaster must get a result on a caster level check (1d20 + caster level) that equals or exceeds the monk's spell resistance.",
      },
      {
        level: 15,
        name: "Quivering Palm (Su)",
        description: "Starting at 15th level, a monk can set up vibrations within the body of another creature that can thereafter be fatal if the monk so desires. She can use this quivering palm attack once a week, and she must announce her intent before making her attack roll. Constructs, oozes, plants, undead, incorporeal creatures, and creatures immune to critical hits cannot be affected. Otherwise, if the monk strikes successfully and the target takes damage from the blow, the quivering palm attack succeeds. Thereafter the monk can try to slay the victim at any later time, as long as the attempt is made within a number of days equal to her monk level. To make such an attempt, the monk merely wills the target to die (a free action), and unless the target makes a Fortitude saving throw (DC 10 + \u00bd the monk's level + the monk's Wis modifier), it dies. If the saving throw is successful, the target is no longer in danger from that particular quivering palm attack, but it may still be affected by another one at a later time.",
      },
      {
        level: 17,
        name: "Timeless Body (Ex)",
        description: "Upon attaining 17th level, a monk no longer takes penalties to her ability scores for aging and cannot be magically aged. Any such penalties that she has already taken, however, remain in place. Bonuses still accrue, and the monk still dies of old age when her time is up.",
      },
      {
        level: 17,
        name: "Tongue of the Sun and Moon (Ex)",
        description: "A monk of 17th level or higher can speak with any living creature.",
      },
      {
        level: 19,
        name: "Empty Body (Su)",
        description: "At 19th level, a monk gains the ability to assume an ethereal state for 1 round per monk level per day, as though using the spell etherealness. She may go ethereal on a number of different occasions during any single day, as long as the total number of rounds spent in an ethereal state does not exceed her monk level.",
      },
      {
        level: 20,
        name: "Perfect Self",
        description: "At 20th level, a monk becomes a magical creature. She is forevermore treated as an outsider rather than as a humanoid (or whatever the monk's creature type was) for the purpose of spells and magical effects. Additionally, the monk gains damage reduction 10/magic, which allows her to ignore the first 10 points of damage from any attack made by a nonmagical weapon or by any natural attack made by a creature that doesn't have similar damage reduction. Unlike other outsiders, the monk can still be brought back from the dead as if she were a member of her previous creature type.",
      },
    ],
  },
  {
    classId: "paladin",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Aura of Good (Ex)",
        description: "The power of a paladin's aura of good (see the detect good spell) is equal to her paladin level.",
      },
      {
        level: 1,
        name: "Detect Evil (Sp)",
        description: "At will, a paladin can use detect evil, as the spell.",
      },
      {
        level: 1,
        name: "Smite Evil (Su)",
        description: "Once per day, a paladin may attempt to smite evil with one normal melee attack. She adds her Charisma bonus (if any) to her attack roll and deals 1 extra point of damage per paladin level. If the paladin accidentally smites a creature that is not evil, the smite has no effect, but the ability is still used up for that day.\n\nAt 5th level, and at every five levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: The Paladin, to a maximum of five times per day at 20th level.",
      },
      {
        level: 1,
        name: "Code of Conduct",
        description: "A paladin must be of lawful good alignment and loses all class abilities if she ever willingly commits an evil act.\n\nAdditionally, a paladin's code requires that she respect legitimate authority, act with honor (not lying, not cheating, not using poison, and so forth), help those in need (provided they do not use the help for evil or chaotic ends), and punish those who harm or threaten innocents.",
      },
      {
        level: 1,
        name: "Associates",
        description: "While she may adventure with characters of any good or neutral alignment, a paladin will never knowingly associate with evil characters, nor will she continue an association with someone who consistently offends her moral code. A paladin may accept only henchmen, followers, or cohorts who are lawful good.",
      },
      {
        level: 2,
        name: "Divine Grace (Su)",
        description: "At 2nd level, a paladin gains a bonus equal to her Charisma bonus (if any) on all saving throws.",
      },
      {
        level: 2,
        name: "Lay on Hands (Su)",
        description: "Beginning at 2nd level, a paladin with a Charisma score of 12 or higher can heal wounds (her own or those of others) by touch. Each day she can heal a total number of hit points of damage equal to her paladin level \u00d7 her Charisma bonus. A paladin may choose to divide her healing among multiple recipients, and she doesn't have to use it all at once. Using lay on hands is a standard action.\n\nAlternatively, a paladin can use any or all of this healing power to deal damage to undead creatures. Using lay on hands in this way requires a successful melee touch attack and doesn't provoke an attack of opportunity. The paladin decides how many of her daily allotment of points to use as damage after successfully touching an undead creature.",
      },
      {
        level: 3,
        name: "Aura of Courage (Su)",
        description: "Beginning at 3rd level, a paladin is immune to fear (magical or otherwise). Each ally within 10 feet of her gains a +4 morale bonus on saving throws against fear effects.\n\nThis ability functions while the paladin is conscious, but not if she is unconscious or dead.",
      },
      {
        level: 3,
        name: "Divine Health (Ex)",
        description: "At 3rd level, a paladin gains immunity to all diseases, including supernatural and magical diseases.",
      },
      {
        level: 4,
        name: "Turn Undead (Su)",
        description: "When a paladin reaches 4th level, she gains the supernatural ability to turn undead. She may use this ability a number of times per day equal to 3 + her Charisma modifier. She turns undead as a cleric of three levels lower would.",
      },
      {
        level: 4,
        name: "Spells",
        description: "Beginning at 4th level, a paladin gains the ability to cast a small number of divine spells, which are drawn from the paladin spell list. A paladin must choose and prepare her spells in advance.\n\nTo prepare or cast a spell, a paladin must have a Wisdom score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a paladin's spell is 10 + the spell level + the paladin's Wisdom modifier.\n\nLike other spellcasters, a paladin can cast only a certain number of spells of each spell level per day. Her base daily spell allotment is given on Table: The Paladin. In addition, she receives bonus spells per day if she has a high Wisdom score. When Table: The Paladin indicates that the paladin gets 0 spells per day of a given spell level, she gains only the bonus spells she would be entitled to based on her Wisdom score for that spell level The paladin does not have access to any domain spells or granted powers, as a cleric does.\n\nA paladin prepares and casts spells the way a cleric does, though she cannot lose a prepared spell to spontaneously cast a cure spell in its place. A paladin may prepare and cast any spell on the paladin spell list, provided that she can cast spells of that level, but she must choose which spells to prepare during her daily meditation.\n\nThrough 3rd level, a paladin has no caster level. At 4th level and higher, her caster level is one-half her paladin level.",
      },
      {
        level: 5,
        name: "Special Mount (Sp)",
        description: "Upon reaching 5th level, a paladin gains the service of an unusually intelligent, strong, and loyal steed to serve her in her crusade against evil. This mount is usually a heavy warhorse (for a Medium paladin) or a warpony (for a Small paladin).\n\nOnce per day, as a full-round action, a paladin may magically call her mount from the celestial realms in which it resides. This ability is the equivalent of a spell of a level equal to one-third the paladin's level. The mount immediately appears adjacent to the paladin and remains for 2 hours per paladin level; it may be dismissed at any time as a free action. The mount is the same creature each time it is summoned, though the paladin may release a particular mount from service.\n\nEach time the mount is called, it appears in full health, regardless of any damage it may have taken previously. The mount also appears wearing or carrying any gear it had when it was last dismissed. Calling a mount is a conjuration (calling) effect.\n\nShould the paladin's mount die, it immediately disappears, leaving behind any equipment it was carrying. The paladin may not summon another mount for thirty days or until she gains a paladin level, whichever comes first, even if the mount is somehow returned from the dead. During this thirty-day period, the paladin takes a -1 penalty on attack and weapon damage rolls.",
      },
      {
        level: 6,
        name: "Remove Disease (Sp)",
        description: "At 6th level, a paladin can produce a remove disease effect, as the spell, once per week. She can use this ability one additional time per week for every three levels after 6th (twice per week at 9th, three times at 12th, and so forth).",
      },
    ],
    spellProgression: [
      { level: 4, slots: [0, 0, 0, 0] },
      { level: 5, slots: [0, 0, 0, 0] },
      { level: 6, slots: [1, 0, 0, 0] },
      { level: 7, slots: [1, 0, 0, 0] },
      { level: 8, slots: [1, 0, 0, 0] },
      { level: 9, slots: [1, 0, 0, 0] },
      { level: 10, slots: [1, 1, 0, 0] },
      { level: 11, slots: [1, 1, 0, 0] },
      { level: 12, slots: [1, 1, 1, 0] },
      { level: 13, slots: [1, 1, 1, 0] },
      { level: 14, slots: [2, 1, 1, 0] },
      { level: 15, slots: [2, 1, 1, 1] },
      { level: 16, slots: [2, 2, 1, 1] },
      { level: 17, slots: [2, 2, 2, 1] },
      { level: 18, slots: [3, 2, 2, 1] },
      { level: 19, slots: [3, 3, 3, 2] },
      { level: 20, slots: [3, 3, 3, 3] },
    ],
  },
  {
    classId: "ranger",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Favored Enemy (Ex)",
        description: "At 1st level, a ranger may select a type of creature from among those given on Table: Ranger Favored Enemies. The ranger gains a +2 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks when using these skills against creatures of this type. Likewise, he gets a +2 bonus on weapon damage rolls against such creatures.\n\nAt 5th level and every five levels thereafter (10th, 15th, and 20th level), the ranger may select an additional favored enemy from those given on the table. In addition, at each such interval, the bonus against any one favored enemy (including the one just selected, if so desired) increases by 2.\n\nIf the ranger chooses humanoids or outsiders as a favored enemy, he must also choose an associated subtype, as indicated on the table. If a specific creature falls into more than one category of favored enemy, the ranger's bonuses do not stack; he simply uses whichever bonus is higher.",
      },
      {
        level: 1,
        name: "Track",
        description: "A ranger gains Track as a bonus feat.",
      },
      {
        level: 1,
        name: "Wild Empathy (Ex)",
        description: "A ranger can improve the attitude of an animal. This ability functions just like a Diplomacy check to improve the attitude of a person. The ranger rolls 1d20 and adds his ranger level and his Charisma modifier to determine the wild empathy check result. The typical domestic animal has a starting attitude of indifferent, while wild animals are usually unfriendly.\n\nTo use wild empathy, the ranger and the animal must be able to study each other, which means that they must be within 30 feet of one another under normal visibility conditions. Generally, influencing an animal in this way takes 1 minute, but, as with influencing people, it might take more or less time.\n\nThe ranger can also use this ability to influence a magical beast with an Intelligence score of 1 or 2, but he takes a -4 penalty on the check.",
      },
      {
        level: 2,
        name: "Combat Style (Ex)",
        description: "At 2nd level, a ranger must select one of two combat styles to pursue: archery or two-weapon combat. This choice affects the character's class features but does not restrict his selection of feats or special abilities in any way.\n\nIf the ranger selects archery, he is treated as having the Rapid Shot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selects two-weapon combat, he is treated as having the Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nThe benefits of the ranger's chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.",
      },
      {
        level: 3,
        name: "Endurance",
        description: "A ranger gains Endurance as a bonus feat at 3rd level.",
      },
      {
        level: 4,
        name: "Animal Companion (Ex)",
        description: "At 4th level, a ranger gains an animal companion selected from the following list: badger, camel, dire rat, dog, riding dog, eagle, hawk, horse (light or heavy), owl, pony, snake (Small or Medium viper), or wolf. If the campaign takes place wholly or partly in an aquatic environment, the following creatures may be added to the ranger's list of options: manta ray, porpoise, Medium shark, and squid. This animal is a loyal companion that accompanies the ranger on his adventures as appropriate for its kind.\n\nThis ability functions like the druid ability of the same name, except that the ranger's effective druid level is one-half his ranger level. A ranger may select from the alternative lists of animal companions just as a druid can, though again his effective druid level is half his ranger level. Like a druid, a ranger cannot select an alternative animal if the choice would reduce his effective druid level below 1st.",
      },
      {
        level: 4,
        name: "Spells",
        description: "Beginning at 4th level, a ranger gains the ability to cast a small number of divine spells, which are drawn from the ranger spell list. A ranger must choose and prepare his spells in advance (see below).\n\nTo prepare or cast a spell, a ranger must have a Wisdom score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a ranger's spell is 10 + the spell level + the ranger's Wisdom modifier.\n\nLike other spellcasters, a ranger can cast only a certain number of spells of each spell level per day. His base daily spell allotment is given on Table: The Ranger. In addition, he receives bonus spells per day if he has a high Wisdom score. When Table: The Ranger indicates that the ranger gets 0 spells per day of a given spell level, he gains only the bonus spells he would be entitled to based on his Wisdom score for that spell level. The ranger does not have access to any domain spells or granted powers, as a cleric does.\n\nA ranger prepares and casts spells the way a cleric does, though he cannot lose a prepared spell to cast a cure spell in its place. A ranger may prepare and cast any spell on the ranger spell list, provided that he can cast spells of that level, but he must choose which spells to prepare during his daily meditation.\n\nThrough 3rd level, a ranger has no caster level. At 4th level and higher, his caster level is one-half his ranger level.",
      },
      {
        level: 6,
        name: "Improved Combat Style (Ex)",
        description: "At 6th level, a ranger's aptitude in his chosen combat style (archery or two-weapon combat) improves. If he selected archery at 2nd level, he is treated as having the Manyshot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selected two-weapon combat at 2nd level, he is treated as having the Improved Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nAs before, the benefits of the ranger's chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.",
      },
      {
        level: 7,
        name: "Woodland Stride (Ex)",
        description: "Starting at 7th level, a ranger may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at his normal speed and without taking damage or suffering any other impairment.\n\nHowever, thorns, briars, and overgrown areas that are enchanted or magically manipulated to impede motion still affect him.",
      },
      {
        level: 8,
        name: "Swift Tracker (Ex)",
        description: "Beginning at 8th level, a ranger can move at his normal speed while following tracks without taking the normal -5 penalty. He takes only a -10 penalty (instead of the normal -20) when moving at up to twice normal speed while tracking.",
      },
      {
        level: 9,
        name: "Evasion (Ex)",
        description: "At 9th level, a ranger can avoid even magical and unusual attacks with great agility. If he makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, he instead takes no damage. Evasion can be used only if the ranger is wearing light armor or no armor. A helpless ranger does not gain the benefit of evasion.",
      },
      {
        level: 11,
        name: "Combat Style Mastery (Ex)",
        description: "At 11th level, a ranger's aptitude in his chosen combat style (archery or two-weapon combat) improves again. If he selected archery at 2nd level, he is treated as having the Improved Precise Shot feat, even if he does not have the normal prerequisites for that feat.\n\nIf the ranger selected two-weapon combat at 2nd level, he is treated as having the Greater Two-Weapon Fighting feat, even if he does not have the normal prerequisites for that feat.\n\nAs before, the benefits of the ranger's chosen style apply only when he wears light or no armor. He loses all benefits of his combat style when wearing medium or heavy armor.",
      },
      {
        level: 13,
        name: "Camouflage (Ex)",
        description: "A ranger of 13th level or higher can use the Hide skill in any sort of natural terrain, even if the terrain doesn't grant cover or concealment.",
      },
      {
        level: 17,
        name: "Hide in Plain Sight (Ex)",
        description: "While in any sort of natural terrain, a ranger of 17th level or higher can use the Hide skill even while being observed.",
      },
    ],
    spellProgression: [
      { level: 4, slots: [0, 0, 0, 0] },
      { level: 5, slots: [0, 0, 0, 0] },
      { level: 6, slots: [1, 0, 0, 0] },
      { level: 7, slots: [1, 0, 0, 0] },
      { level: 8, slots: [1, 0, 0, 0] },
      { level: 9, slots: [1, 0, 0, 0] },
      { level: 10, slots: [1, 1, 0, 0] },
      { level: 11, slots: [1, 1, 0, 0] },
      { level: 12, slots: [1, 1, 1, 0] },
      { level: 13, slots: [1, 1, 1, 0] },
      { level: 14, slots: [2, 1, 1, 0] },
      { level: 15, slots: [2, 1, 1, 1] },
      { level: 16, slots: [2, 2, 1, 1] },
      { level: 17, slots: [2, 2, 2, 1] },
      { level: 18, slots: [3, 2, 2, 1] },
      { level: 19, slots: [3, 3, 3, 2] },
      { level: 20, slots: [3, 3, 3, 3] },
    ],
  },
  {
    classId: "rogue",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Sneak Attack",
        description: "If a rogue can catch an opponent when he is unable to defend himself effectively from her attack, she can strike a vital spot for extra damage.\n\nThe rogue's attack deals extra damage any time her target would be denied a Dexterity bonus to AC (whether the target actually has a Dexterity bonus or not), or when the rogue flanks her target. This extra damage is 1d6 at 1st level, and it increases by 1d6 every two rogue levels thereafter. Should the rogue score a critical hit with a sneak attack, this extra damage is not multiplied.\n\nRanged attacks can count as sneak attacks only if the target is within 30 feet.\n\nWith a sap (blackjack) or an unarmed strike, a rogue can make a sneak attack that deals nonlethal damage instead of lethal damage. She cannot use a weapon that deals lethal damage to deal nonlethal damage in a sneak attack, not even with the usual -4 penalty.\n\nA rogue can sneak attack only living creatures with discernible anatomies-undead, constructs, oozes, plants, and incorporeal creatures lack vital areas to attack. Any creature that is immune to critical hits is not vulnerable to sneak attacks. The rogue must be able to see the target well enough to pick out a vital spot and must be able to reach such a spot. A rogue cannot sneak attack while striking a creature with concealment or striking the limbs of a creature whose vitals are beyond reach.",
      },
      {
        level: 1,
        name: "Trapfinding",
        description: "Rogues (and only rogues) can use the Search skill to locate traps when the task has a Difficulty Class higher than 20.\n\nFinding a nonmagical trap has a DC of at least 20, or higher if it is well hidden. Finding a magic trap has a DC of 25 + the level of the spell used to create it.\n\nRogues (and only rogues) can use the Disable Device skill to disarm magic traps. A magic trap generally has a DC of 25 + the level of the spell used to create it.\n\nA rogue who beats a trap's DC by 10 or more with a Disable Device check can study a trap, figure out how it works, and bypass it (with her party) without disarming it.",
      },
      {
        level: 2,
        name: "Evasion (Ex)",
        description: "At 2nd level and higher, a rogue can avoid even magical and unusual attacks with great agility. If she makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, she instead takes no damage. Evasion can be used only if the rogue is wearing light armor or no armor. A helpless rogue does not gain the benefit of evasion.",
      },
      {
        level: 3,
        name: "Trap Sense (Ex)",
        description: "At 3rd level, a rogue gains an intuitive sense that alerts her to danger from traps, giving her a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses rise to +2 when the rogue reaches 6th level, to +3 when she reaches 9th level, to +4 when she reaches 12th level, to +5 at 15th, and to +6 at 18th level.\n\nTrap sense bonuses gained from multiple classes stack.",
      },
      {
        level: 4,
        name: "Uncanny Dodge (Ex)",
        description: "Starting at 4th level, a rogue can react to danger before her senses would normally allow her to do so. She retains her Dexterity bonus to AC (if any) even if she is caught flat-footed or struck by an invisible attacker. However, she still loses her Dexterity bonus to AC if immobilized.\n\nIf a rogue already has uncanny dodge from a different class she automatically gains improved uncanny dodge instead.",
      },
      {
        level: 8,
        name: "Improved Uncanny Dodge (Ex)",
        description: "A rogue of 8th level or higher can no longer be flanked.\n\nThis defense denies another rogue the ability to sneak attack the character by flanking her, unless the attacker has at least four more rogue levels than the target does.\n\nIf a character already has uncanny dodge from a second class, the character automatically gains improved uncanny dodge instead, and the levels from the classes that grant uncanny dodge stack to determine the minimum rogue level required to flank the character.",
      },
      {
        level: 10,
        name: "Special Abilities",
        description: "On attaining 10th level, and at every three levels thereafter (13th, 16th, and 19th), a rogue gains a special ability of her choice from among the following options.\n\n#### Crippling Strike ( Ex )\n\nA rogue with this ability can sneak attack opponents with such precision that her blows weaken and hamper them. An opponent damaged by one of her sneak attacks also takes 2 points of Strength damage. Ability points lost to damage return on their own at the rate of 1 point per day for each damaged ability.\n\n#### Defensive Roll ( Ex )\n\nThe rogue can roll with a potentially lethal blow to take less damage from it than she otherwise would. Once per day, when she would be reduced to 0 or fewer hit points by damage in combat (from a weapon or other blow, not a spell or special ability), the rogue can attempt to roll with the damage. To use this ability, the rogue must attempt a Reflex saving throw (DC = damage dealt). If the save succeeds, she takes only half damage from the blow; if it fails, she takes full damage. She must be aware of the attack and able to react to it in order to execute her defensive roll-if she is denied her Dexterity bonus to AC, she can't use this ability. Since this effect would not normally allow a character to make a Reflex save for half damage, the rogue's evasion ability does not apply to the defensive roll.\n\n#### Improved Evasion ( Ex )\n\nThis ability works like evasion, except that while the rogue still takes no damage on a successful Reflex saving throw against attacks henceforth she takes only half damage on a failed save. A helpless rogue does not gain the benefit of improved evasion.\n\n#### Opportunist ( Ex )\n\nOnce per round, the rogue can make an attack of opportunity against an opponent who has just been struck for damage in melee by another character. This attack counts as the rogue's attack of opportunity for that round. Even a rogue with the Combat Reflexes feat can't use the opportunist ability more than once per round.\n\n#### Skill Mastery\n\nThe rogue becomes so certain in the use of certain skills that she can use them reliably even under adverse conditions.\n\nUpon gaining this ability, she selects a number of skills equal to 3 + her Intelligence modifier. When making a skill check with one of these skills, she may take 10 even if stress and distractions would normally prevent her from doing so. A rogue may gain this special ability multiple times, selecting additional skills for it to apply to each time.\n\n#### Slippery Mind ( Ex )\n\nThis ability represents the rogue's ability to wriggle free from magical effects that would otherwise control or compel her. If a rogue with slippery mind is affected by an enchantment spell or effect and fails her saving throw, she can attempt it again 1 round later at the same DC. She gets only this one extra chance to succeed on her saving throw.\n\n#### Feat\n\nA rogue may gain a bonus feat in place of a special ability.",
      },
    ],
  },
  {
    classId: "sorcerer",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 6, 9, 12, 15, 18],
    features: [
      {
        level: 1,
        name: "Spells",
        description: "A sorcerer casts arcane spells which are drawn primarily from the sorcerer/wizard spell list. He can cast any spell he knows without preparing it ahead of time, the way a wizard or a cleric must (see below).\n\nTo learn or cast a spell, a sorcerer must have a Charisma score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a sorcerer's spell is 10 + the spell level + the sorcerer's Charisma modifier.\n\nLike other spellcasters, a sorcerer can cast only a certain number of spells of each spell level per day. His base daily spell allotment is given on Table: The Sorcerer. In addition, he receives bonus spells per day if he has a high Charisma score.\n\nA sorcerer's selection of spells is extremely limited. A sorcerer begins play knowing four 0-level spells and two 1st-level spells of your choice. At each new sorcerer level, he gains one or more new spells, as indicated on Table: Sorcerer Spells Known. (Unlike spells per day, the number of spells a sorcerer knows is not affected by his Charisma score; the numbers on Table: Sorcerer Spells Known are fixed.) These new spells can be common spells chosen from the sorcerer/wizard spell list, or they can be unusual spells that the sorcerer has gained some understanding of by study. The sorcerer can't use this method of spell acquisition to learn spells at a faster rate, however.\n\nUpon reaching 4th level, and at every even-numbered sorcerer level after that (6th, 8th, and so on), a sorcerer can choose to learn a new spell in place of one he already knows. In effect, the sorcerer \"loses\" the old spell in exchange for the new one. The new spell's level must be the same as that of the spell being exchanged, and it must be at least two levels lower than the highest-level sorcerer spell the sorcerer can cast. A sorcerer may swap only a single spell at any given level, and must choose whether or not to swap the spell at the same time that he gains new spells known for the level.\n\nUnlike a wizard or a cleric, a sorcerer need not prepare his spells in advance. He can cast any spell he knows at any time, assuming he has not yet used up his spells per day for that spell level. He does not have to decide ahead of time which spells he'll cast.",
      },
      {
        level: 1,
        name: "Summon Familiar",
        description: "A sorcerer can obtain a familiar. Doing so takes 24 hours and uses up magical materials that cost 100 gp. A familiar is a magical beast that resembles a small animal and is unusually tough and intelligent. The creature serves as a companion and servant.\n\nThe sorcerer chooses the kind of familiar he gets. As the sorcerer advances in level, his familiar also increases in power.\n\nIf the familiar dies or is dismissed by the sorcerer, the sorcerer must attempt a DC 15 Fortitude saving throw. Failure means he loses 200 experience points per sorcerer level; success reduces the loss to one-half that amount. However, a sorcerer's experience point total can never go below 0 as the result of a familiar's demise or dismissal. A slain or dismissed familiar cannot be replaced for a year and day. A slain familiar can be raised from the dead just as a character can be, and it does not lose a level or a Constitution point when this happy event occurs.\n\nA character with more than one class that grants a familiar may have only one familiar at a time.",
      },
    ],
    spellProgression: [
      { level: 1, slots: [3, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 4, spellsKnown: 2 },
      { level: 2, slots: [4, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 2 },
      { level: 3, slots: [5, 0, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 5, spellsKnown: 3 },
      { level: 4, slots: [6, 3, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 4 },
      { level: 5, slots: [6, 4, 0, 0, 0, 0, 0, 0, 0], cantripsKnown: 6, spellsKnown: 6 },
      { level: 6, slots: [6, 5, 3, 0, 0, 0, 0, 0, 0], cantripsKnown: 7, spellsKnown: 7 },
      { level: 7, slots: [6, 6, 4, 0, 0, 0, 0, 0, 0], cantripsKnown: 7, spellsKnown: 10 },
      { level: 8, slots: [6, 6, 5, 3, 0, 0, 0, 0, 0], cantripsKnown: 8, spellsKnown: 11 },
      { level: 9, slots: [6, 6, 6, 4, 0, 0, 0, 0, 0], cantripsKnown: 8, spellsKnown: 14 },
      { level: 10, slots: [6, 6, 6, 5, 3, 0, 0, 0, 0], cantripsKnown: 9, spellsKnown: 15 },
      { level: 11, slots: [6, 6, 6, 6, 4, 0, 0, 0, 0], cantripsKnown: 9, spellsKnown: 19 },
      { level: 12, slots: [6, 6, 6, 6, 5, 3, 0, 0, 0], cantripsKnown: 9, spellsKnown: 20 },
      { level: 13, slots: [6, 6, 6, 6, 6, 4, 0, 0, 0], cantripsKnown: 9, spellsKnown: 23 },
      { level: 14, slots: [6, 6, 6, 6, 6, 5, 3, 0, 0], cantripsKnown: 9, spellsKnown: 24 },
      { level: 15, slots: [6, 6, 6, 6, 6, 6, 4, 0, 0], cantripsKnown: 9, spellsKnown: 27 },
      { level: 16, slots: [6, 6, 6, 6, 6, 6, 5, 3, 0], cantripsKnown: 9, spellsKnown: 28 },
      { level: 17, slots: [6, 6, 6, 6, 6, 6, 6, 4, 0], cantripsKnown: 9, spellsKnown: 30 },
      { level: 18, slots: [6, 6, 6, 6, 6, 6, 6, 5, 3], cantripsKnown: 9, spellsKnown: 31 },
      { level: 19, slots: [6, 6, 6, 6, 6, 6, 6, 6, 4], cantripsKnown: 9, spellsKnown: 33 },
      { level: 20, slots: [6, 6, 6, 6, 6, 6, 6, 6, 6], cantripsKnown: 9, spellsKnown: 34 },
    ],
  },
  {
    classId: "wizard",
    subclassLevel: 1,
    subclassLabel: "School Specialization",
    abilityScoreIncreaseLevels: [4, 8, 12, 16, 20],
    featLevels: [1, 3, 5, 6, 9, 10, 12, 15, 18, 20],
    features: [
      {
        level: 1,
        name: "Spells",
        description: "A wizard casts arcane spells which are drawn from the sorcerer/wizard spell list. A wizard must choose and prepare her spells ahead of time (see below).\n\nTo learn, prepare, or cast a spell, the wizard must have an Intelligence score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a wizard's spell is 10 + the spell level + the wizard's Intelligence modifier.\n\nLike other spellcasters, a wizard can cast only a certain number of spells of each spell level per day. Her base daily spell allotment is given on Table: The Wizard. In addition, she receives bonus spells per day if she has a high Intelligence score.\n\nUnlike a bard or sorcerer, a wizard may know any number of spells. She must choose and prepare her spells ahead of time by getting a good night's sleep and spending 1 hour studying her spellbook. While studying, the wizard decides which spells to prepare.",
      },
      {
        level: 1,
        name: "Bonus Languages",
        description: "A wizard may substitute Draconic for one of the bonus languages available to the character because of her race.",
      },
      {
        level: 1,
        name: "Summon Familiar",
        description: "A wizard can obtain a familiar in exactly the same manner as a sorcerer can.",
      },
      {
        level: 1,
        name: "Scribe Scroll",
        description: "At 1st level, a wizard gains Scribe Scroll as a bonus feat.",
      },
      {
        level: 1,
        name: "School Specialization",
        description: "A school is one of eight groupings of spells, each defined by a common theme. If desired, a wizard may specialize in one school of magic (see below). Specialization allows a wizard to cast extra spells from her chosen school, but she then never learns to cast spells from some other schools.\n\nA specialist wizard can prepare one additional spell of her specialty school per spell level each day. She also gains a +2 bonus on Spellcraft checks to learn the spells of her chosen school.\n\nThe wizard must choose whether to specialize and, if she does so, choose her specialty at 1st level. At this time, she must also give up two other schools of magic (unless she chooses to specialize in divination; see below), which become her prohibited schools.\n\nA wizard can never give up divination to fulfill this requirement.\n\nSpells of the prohibited school or schools are not available to the wizard, and she can't even cast such spells from scrolls or fire them from wands. She may not change either her specialization or her prohibited schools later.\n\nThe eight schools of arcane magic are abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, and transmutation.\n\nSpells that do not fall into any of these schools are called universal spells.",
      },
      {
        level: 5,
        name: "Bonus Feats",
        description: "At 5th, 10th, 15th, and 20th level, a wizard gains a bonus feat. At each such opportunity, she can choose a metamagic feat, an item creation feat, or Spell Mastery. The wizard must still meet all prerequisites for a bonus feat, including caster level minimums.\n\nThese bonus feats are in addition to the feat that a character of any class gets from advancing levels. The wizard is not limited to the categories of item creation feats, metamagic feats, or Spell Mastery when choosing these feats.",
      },
    ],
    spellProgression: [
      { level: 1, slots: [1, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 2, slots: [2, 0, 0, 0, 0, 0, 0, 0, 0] },
      { level: 3, slots: [2, 1, 0, 0, 0, 0, 0, 0, 0] },
      { level: 4, slots: [3, 2, 0, 0, 0, 0, 0, 0, 0] },
      { level: 5, slots: [3, 2, 1, 0, 0, 0, 0, 0, 0] },
      { level: 6, slots: [3, 3, 2, 0, 0, 0, 0, 0, 0] },
      { level: 7, slots: [4, 3, 2, 1, 0, 0, 0, 0, 0] },
      { level: 8, slots: [4, 3, 3, 2, 0, 0, 0, 0, 0] },
      { level: 9, slots: [4, 4, 3, 2, 1, 0, 0, 0, 0] },
      { level: 10, slots: [4, 4, 3, 3, 2, 0, 0, 0, 0] },
      { level: 11, slots: [4, 4, 4, 3, 2, 1, 0, 0, 0] },
      { level: 12, slots: [4, 4, 4, 3, 3, 2, 0, 0, 0] },
      { level: 13, slots: [4, 4, 4, 4, 3, 2, 1, 0, 0] },
      { level: 14, slots: [4, 4, 4, 4, 3, 3, 2, 0, 0] },
      { level: 15, slots: [4, 4, 4, 4, 4, 3, 2, 1, 0] },
      { level: 16, slots: [4, 4, 4, 4, 4, 3, 3, 2, 0] },
      { level: 17, slots: [4, 4, 4, 4, 4, 4, 3, 2, 1] },
      { level: 18, slots: [4, 4, 4, 4, 4, 4, 3, 3, 2] },
      { level: 19, slots: [4, 4, 4, 4, 4, 4, 4, 3, 3] },
      { level: 20, slots: [4, 4, 4, 4, 4, 4, 4, 4, 4] },
    ],
    subclasses: [
      {
        id: "abjuration",
        name: "Abjuration",
        summary: "Spells that protect, block, or banish. An abjuration specialist is called an abjurer.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Abjuration Specialist",
            description: "Spells that protect, block, or banish. An abjuration specialist is called an abjurer.",
          },
        ],
      },
      {
        id: "conjuration",
        name: "Conjuration",
        summary: "Spells that bring creatures or materials to the caster. A conjuration specialist is called a conjurer.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Conjuration Specialist",
            description: "Spells that bring creatures or materials to the caster. A conjuration specialist is called a conjurer.",
          },
        ],
      },
      {
        id: "divination",
        name: "Divination",
        summary: "Spells that reveal information. A divination specialist is called a diviner. Unlike the other specialists, a diviner must give up only one other school.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Divination Specialist",
            description: "Spells that reveal information. A divination specialist is called a diviner. Unlike the other specialists, a diviner must give up only one other school.",
          },
        ],
      },
      {
        id: "enchantment",
        name: "Enchantment",
        summary: "Spells that imbue the recipient with some property or grant the caster power over another being. An enchantment specialist is called an enchanter.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Enchantment Specialist",
            description: "Spells that imbue the recipient with some property or grant the caster power over another being. An enchantment specialist is called an enchanter.",
          },
        ],
      },
      {
        id: "evocation",
        name: "Evocation",
        summary: "Spells that manipulate energy or create something from nothing. An evocation specialist is called an evoker.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Evocation Specialist",
            description: "Spells that manipulate energy or create something from nothing. An evocation specialist is called an evoker.",
          },
        ],
      },
      {
        id: "illusion",
        name: "Illusion",
        summary: "Spells that alter perception or create false images. An illusion specialist is called an illusionist.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Illusion Specialist",
            description: "Spells that alter perception or create false images. An illusion specialist is called an illusionist.",
          },
        ],
      },
      {
        id: "necromancy",
        name: "Necromancy",
        summary: "Spells that manipulate, create, or destroy life or life force. A necromancy specialist is called a necromancer.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Necromancy Specialist",
            description: "Spells that manipulate, create, or destroy life or life force. A necromancy specialist is called a necromancer.",
          },
        ],
      },
      {
        id: "transmutation",
        name: "Transmutation",
        summary: "Spells that transform the recipient physically or change its properties in a more subtle way. A transmutation specialist is called a transmuter.",
        srdLicensed: true,
        features: [
          {
            level: 1,
            name: "Transmutation Specialist",
            description: "Spells that transform the recipient physically or change its properties in a more subtle way. A transmutation specialist is called a transmuter.",
          },
        ],
      },
    ],
  },
];
