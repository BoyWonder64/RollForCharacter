import { SUBCLASSES_5E_2024 } from "../5e-2024/subclasses";
import type { FeatureTuple, NonSrdSubclassData, SubclassDetails } from "../nonSrdSubclasses";
import type { ClassResourceDefinition } from "../types";

/**
 * 2014 non-SRD subclasses for Barbarian, Bard, Druid, Fighter, Monk, Paladin,
 * Ranger and Rogue (the other four casters live in `subclasses.ts`). Original
 * -wording summaries of each feature's mechanics -- see that file's header.
 */

/** Uses equal to the proficiency bonus (2 at 1st, 3 at 5th, 4 at 9th, 5 at 13th, 6 at 17th), starting from the level a feature is gained. */
const proficiencyUses = (from: number): Record<number, number> => {
  const bonus = (level: number) => Math.floor((level - 1) / 4) + 2;
  const out: Record<number, number> = { [from]: bonus(from) };
  for (const level of [5, 9, 13, 17]) if (level > from) out[level] = bonus(level);
  return out;
};

/**
 * Reuses a 2024 subclass whose 2014 version is essentially the same: remap
 * feature/resource levels (`levels`), swap wording (`text`, e.g. 2024's
 * "Focus Point" is "Ki Point" in 2014), and optionally add features.
 */
function adapt(
  classId: string,
  name: string,
  options: { levels?: Record<number, number>; text?: [string, string][]; extra?: FeatureTuple[]; as?: string } = {}
): NonSrdSubclassData {
  const source = SUBCLASSES_5E_2024[classId]?.find((s) => s.name === name);
  if (!source) throw new Error(`No 2024 subclass ${classId}/${name} to adapt`);
  const level = (n: number) => options.levels?.[n] ?? n;
  const text = (s: string) => (options.text ?? []).reduce((acc, [from, to]) => acc.split(from).join(to), s);
  const resources: ClassResourceDefinition[] | undefined = source.resources?.map((r) => ({
    ...r,
    ...(r.usesByLevel
      ? { usesByLevel: Object.fromEntries(Object.entries(r.usesByLevel).map(([l, v]) => [level(Number(l)), v])) }
      : {}),
    ...(r.usesFromAbilityModifier
      ? { usesFromAbilityModifier: { ...r.usesFromAbilityModifier, grantedAtLevel: level(r.usesFromAbilityModifier.grantedAtLevel) } }
      : {}),
    name: text(r.name),
  }));
  const features: FeatureTuple[] = [
    ...source.features.map(([l, n, d]): FeatureTuple => [level(l), text(n), text(d)]),
    ...(options.extra ?? []),
  ].sort((a, b) => a[0] - b[0]);
  return { name: options.as ?? name, summary: source.summary, features, ...(resources ? { resources } : {}) };
}

export const SUBCLASSES_5E_MARTIAL: SubclassDetails = {
  barbarian: [
    {
      name: "Path of the Totem Warrior",
      summary: "Take on the spirit of a bear, eagle or wolf.",
      features: [
        [3, "Spirit Seeker", "You can cast Beast Sense and Speak with Animals as rituals."],
        [3, "Totem Spirit", "Choose a totem animal. Bear: while raging you resist every damage type except Psychic. Eagle: while raging, enemies have Disadvantage on Opportunity Attacks against you and you can Dash as a Bonus Action. Wolf: while raging, allies have Advantage on melee attacks against creatures within 5 ft of you."],
        [6, "Aspect of the Beast", "Bear: your carrying capacity doubles and you have Advantage on Strength checks to push, pull, lift or break. Eagle: you see up to 1 mile clearly and ignore Dim Light penalties on Perception. Wolf: you track at a fast pace and move stealthily at a normal pace."],
        [10, "Spirit Walker", "You can cast Commune with Nature as a ritual; a spirit version of your totem animal appears to you."],
        [14, "Totemic Attunement", "Bear: while raging, enemies within 5 ft have Disadvantage on attacks against anyone but you. Eagle: while raging, you have a Fly Speed equal to your walking Speed. Wolf: while raging, you can knock a Large or smaller target Prone with a melee hit as a Bonus Action."],
      ],
    },
    {
      name: "Path of the Ancestral Guardian",
      summary: "Spirits of your ancestors guard allies and hamper enemies.",
      features: [
        [3, "Ancestral Protectors", "While raging, the first creature you hit on your turn has Disadvantage on attacks against anyone but you until your next turn, and anyone else's attacks against it that aren't against you are made with resistance."],
        [6, "Spirit Shield", "While raging, when an ally within 30 ft takes damage, use your Reaction to reduce it by 2d6 (3d6 at 10th, 4d6 at 14th)."],
        [10, "Consult the Spirits", "You can cast Augury or Clairvoyance without a slot or components (Wisdom). Once per Short or Long Rest."],
        [14, "Vengeful Ancestors", "When you use Spirit Shield, the attacker takes Force damage equal to the damage you prevented."],
      ],
      resources: [{ id: "ancestral-consult-the-spirits", name: "Consult the Spirits", usesByLevel: { 10: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "Path of the Storm Herald",
      summary: "Surround yourself with a raging desert, sea or tundra storm.",
      features: [
        [3, "Storm Aura", "While raging, you emit an aura (10 ft) of your chosen environment as a Bonus Action. Desert: creatures take Fire damage (2, increasing to 3 at 5th, 4 at 10th, 5 at 15th, 6 at 20th). Sea: one creature in the aura makes a Dexterity save or takes Lightning damage of the same amount. Tundra: allies in the aura gain Temporary Hit Points of the same amount."],
        [6, "Storm Soul", "Desert: resistance to Fire and you can ignite flammable objects. Sea: resistance to Lightning, breathe underwater, Swim Speed 30 ft. Tundra: resistance to Cold and you can freeze water."],
        [10, "Shielding Storm", "You grant your aura's damage resistance to allies in the aura while you rage: Fire (Desert), Lightning (Sea) or Cold (Tundra)."],
        [14, "Raging Storm", "Desert: when a creature hits you, it takes Fire damage (Dexterity save for half). Sea: a Large or smaller creature that hits you makes a Strength save or is knocked Prone. Tundra: when you hit a creature, its Speed becomes 0 (Strength save)."],
      ],
    },
    {
      name: "Path of the Zealot",
      summary: "Fight with divine fury, fall without staying down.",
      features: [
        [3, "Divine Fury", "While raging, your first hit on each of your turns deals extra Necrotic or Radiant damage (1d6 + half your Barbarian level, rounded down)."],
        [3, "Warrior of the Gods", "Spells that restore you to life cost no material components."],
        [6, "Fanatical Focus", "Once per Rage, when you fail a saving throw you can reroll it and must take the new result."],
        [10, "Zealous Presence", "As a Bonus Action, up to ten creatures within 60 ft gain Advantage on attack rolls and saving throws until the start of your next turn. Once per Long Rest."],
        [14, "Rage Beyond Death", "While raging, having 0 Hit Points doesn't knock you Unconscious; you die only if you end the Rage at 0 HP (or take massive damage)."],
      ],
      resources: [{ id: "zealot-zealous-presence", name: "Zealous Presence", usesByLevel: { 10: 1 } }],
    },
    {
      name: "Path of the Beast",
      summary: "Manifest bestial weapons when you rage.",
      features: [
        [3, "Form of the Beast", "When you Rage, choose a natural weapon to manifest: Bite (1d8 Piercing, regain HP once per Rage), Claws (1d6 Slashing, extra attack with Claws), or Tail (1d8 Piercing, reach 10 ft, reaction +1d8 AC)."],
        [6, "Bestial Soul", "Your natural weapons are magical. You can choose a swim, climb or jump enhancement when you finish a Rest, applied while raging."],
        [10, "Infectious Fury", "When you hit a creature with your natural weapons, it makes a Wisdom save or takes 2d12 Psychic damage or must attack another creature. Uses equal your proficiency bonus; regained on a Long Rest."],
        [14, "Call the Hunt", "When you Rage, choose Constitution-modifier willing creatures within 30 ft; they gain 5 Temporary Hit Points per creature and 1d6 extra damage once per turn. Once per Long Rest, or by expending a Rage use."],
      ],
      resources: [
        { id: "beast-infectious-fury", name: "Infectious Fury", usesByLevel: proficiencyUses(10) },
        { id: "beast-call-the-hunt", name: "Call the Hunt", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "Path of Wild Magic",
      summary: "Barbarians who tap into wild, unpredictable magic.",
      features: [
        [3, "Magic Awareness", "As an action, sense the location of spells and magic items within 60 ft until the end of your next turn. Uses equal your proficiency bonus; regained on a Long Rest."],
        [3, "Wild Surge", "When you Rage, roll a d8 on the Wild Magic table for a random magical effect (it ends when the Rage ends)."],
        [6, "Bolstering Magic", "As an action, touch a creature (or yourself) to give +d3 to attack rolls and ability checks for 10 minutes, or to regain a spell slot (level ≤ d3 roll). Uses equal your proficiency bonus; regained on a Long Rest."],
        [10, "Unstable Backlash", "When you are affected by a spell or Rage ends, use your Reaction to roll on the Wild Magic table again; a new effect replaces the old one."],
        [14, "Controlled Surge", "When you roll on the Wild Magic table, you can roll twice and use either result."],
      ],
      resources: [
        { id: "wild-magic-barbarian-awareness", name: "Magic Awareness", usesByLevel: proficiencyUses(3) },
        { id: "wild-magic-barbarian-bolstering", name: "Bolstering Magic", usesByLevel: proficiencyUses(6) },
      ],
    },
  ],
  bard: [
    {
      name: "College of Valor",
      summary: "Battle-bards who inspire with steel and song.",
      features: [
        [3, "Bonus Proficiencies", "You gain proficiency with Medium armor, Shields and Martial weapons."],
        [3, "Combat Inspiration", "A creature with your Bardic Inspiration die can add it to a weapon damage roll, or use its Reaction to add it to its AC against one attack."],
        [6, "Extra Attack", "You can attack twice whenever you take the Attack action."],
        [14, "Battle Magic", "After you cast a spell with a casting time of an action, you can make one weapon attack as a Bonus Action."],
      ],
    },
    {
      name: "College of Glamour",
      summary: "Fey-touched performers who beguile and inspire.",
      features: [
        [3, "Mantle of Inspiration", "As a Bonus Action, expend a Bardic Inspiration die: up to your Charisma modifier creatures within 60 ft gain Temporary Hit Points (twice the die roll) and can move up to their Speed without provoking."],
        [3, "Enthralling Performance", "After performing for 1 minute, up to your Charisma modifier humanoids that watched make a Wisdom save or are Charmed by you for 1 hour. Once per Short or Long Rest."],
        [6, "Mantle of Majesty", "As a Bonus Action, cast Command each turn without a slot for 1 minute (Concentration). Once per Long Rest."],
        [14, "Unbreakable Majesty", "As a Bonus Action, assume a majestic presence for 1 minute: creatures that attack you first make a Charisma save or must choose a new target. Once per Short or Long Rest."],
      ],
      resources: [
        { id: "glamour-enthralling-performance", name: "Enthralling Performance", usesByLevel: { 3: 1 }, shortRestRegain: "all" },
        { id: "glamour-mantle-of-majesty", name: "Mantle of Majesty", usesByLevel: { 6: 1 } },
        { id: "glamour-unbreakable-majesty", name: "Unbreakable Majesty", usesByLevel: { 14: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "College of Swords",
      summary: "Blade-flourishing bards who duel with style.",
      features: [
        [3, "Bonus Proficiencies", "You gain proficiency with Medium armor and the Scimitar, and can use a Simple or Martial weapon you're proficient with as a spellcasting focus."],
        [3, "Fighting Style", "Choose Dueling or Two-Weapon Fighting."],
        [3, "Blade Flourish", "Your Speed increases by 10 ft when you take the Attack action. Once per turn when you hit, expend a Bardic Inspiration die for a flourish: Defensive (+die to AC), Slashing (damage to a second creature), or Mobile (push the target and follow), each adding the die to damage."],
        [6, "Extra Attack", "You can attack twice whenever you take the Attack action."],
        [14, "Master's Flourish", "Whenever you use Blade Flourish you can roll a d6 and use it instead of expending a Bardic Inspiration die."],
      ],
    },
    {
      name: "College of Whispers",
      summary: "Bards of secrets, shadow and fear.",
      features: [
        [3, "Psychic Blades", "When you hit with a weapon, expend a Bardic Inspiration die to deal extra Psychic damage: 2d6, increasing to 3d6 at 5th, 5d6 at 10th and 8d6 at 15th. Once per turn."],
        [3, "Words of Terror", "After talking to a humanoid for 1 minute, it makes a Wisdom save or is Frightened of a creature of your choice for 1 hour. Once per Short or Long Rest."],
        [6, "Mantle of Whispers", "When a humanoid dies within 30 ft, use your Reaction to capture its shadow; as an action you can take its appearance and a few memories for 1 hour. Once per Short or Long Rest."],
        [14, "Shadow Lore", "As an action, a creature within 30 ft makes a Wisdom save or is Charmed for 8 hours, as if you whisper its secrets. Once per Long Rest."],
      ],
      resources: [
        { id: "whispers-words-of-terror", name: "Words of Terror", usesByLevel: { 3: 1 }, shortRestRegain: "all" },
        { id: "whispers-mantle-of-whispers", name: "Mantle of Whispers", usesByLevel: { 6: 1 }, shortRestRegain: "all" },
        { id: "whispers-shadow-lore", name: "Shadow Lore", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "College of Creation",
      summary: "Sing the world's creation into being.",
      features: [
        [3, "Mote of Potential", "When you give someone a Bardic Inspiration die, it gains an extra effect when used. Ability check: roll the die twice, take the higher. Attack roll: a thunderous burst deals Thunder damage to the target and others nearby. Saving throw: gain Temporary Hit Points (die + Charisma modifier)."],
        [3, "Performance of Creation", "As an action, create a nonmagical item worth up to 20 times your Bard level gp, up to Large size, that lasts for hours equal to your proficiency bonus. Once per Long Rest, or by expending a slot."],
        [6, "Animating Performance", "As an action, animate a Large or smaller nonmagical object as a Dancing Item for 1 hour; it follows your commands and attacks. Once per Long Rest, or by expending a slot."],
        [14, "Creative Crescendo", "When you use Performance of Creation you can create several items (Charisma modifier), and you can create one item without spending a use of the feature."],
      ],
      resources: [
        { id: "creation-performance", name: "Performance of Creation", usesByLevel: { 3: 1 } },
        { id: "creation-animating-performance", name: "Animating Performance", usesByLevel: { 6: 1 } },
      ],
    },
    {
      name: "College of Eloquence",
      summary: "Silver-tongued bards of persuasion.",
      features: [
        [3, "Silver Tongue", "When you make a Persuasion or Deception check, treat a d20 roll of 9 or lower as a 10."],
        [3, "Unsettling Words", "As a Bonus Action, expend a Bardic Inspiration die: a creature within 60 ft subtracts the die roll from its next saving throw before the start of your next turn."],
        [6, "Unfailing Inspiration", "When a creature adds your Bardic Inspiration die and still fails, it keeps the die."],
        [6, "Universal Speech", "As an action, choose Charisma-modifier creatures within 60 ft; they understand you regardless of language for 1 hour. Once per Long Rest, or by expending a slot."],
        [14, "Infectious Inspiration", "When a creature uses your Bardic Inspiration die and succeeds, use your Reaction to give a new Bardic Inspiration die to another creature within 60 ft. Uses equal your Charisma modifier; regained on a Long Rest."],
      ],
      resources: [
        { id: "eloquence-universal-speech", name: "Universal Speech", usesByLevel: { 6: 1 } },
        { id: "eloquence-infectious-inspiration", name: "Infectious Inspiration", usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 14, minimum: 1 } },
      ],
    },
  ],
  druid: [
    {
      name: "Circle of the Moon",
      summary: "Become a powerful beast in combat.",
      features: [
        [2, "Combat Wild Shape", "You can Wild Shape as a Bonus Action. While transformed, you can expend a spell slot as a Bonus Action to regain 1d8 Hit Points per slot level."],
        [2, "Circle Forms", "You can transform into a beast with a CR as high as 1 (ignoring the Moves restriction), and from 6th level up to your Druid level divided by 3 (rounded down)."],
        [6, "Primal Strike", "Your attacks in beast form count as Magical for overcoming resistance and immunity."],
        [10, "Elemental Wild Shape", "You can expend two uses of Wild Shape at once to transform into an Air, Earth, Fire or Water elemental."],
        [14, "Thousand Forms", "You can cast Alter Self at will."],
      ],
    },
    {
      name: "Circle of Dreams",
      summary: "Fey-touched druids of healing, comfort and travel through dreams.",
      features: [
        [2, "Balm of the Summer Court", "You have a pool of d6s equal to your Druid level. As a Bonus Action, spend up to half your Druid level dice (max) to heal a creature within 120 ft; it also gains 1 Temporary Hit Point per die rolled. The pool refills on a Long Rest."],
        [6, "Hearth of Moonlight and Shadow", "When you finish a Short or Long Rest, you can create a 30-ft sphere around your camp that hides it and grants +5 to Stealth and Perception to those inside."],
        [10, "Hidden Paths", "As a Bonus Action, teleport up to 60 ft to a space you can see, or touch a willing creature and teleport it up to 30 ft. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [14, "Walker in Dreams", "After a Short Rest, you can cast Dream, Scrying or Teleportation Circle without a slot (arriving at the last Long Rest location for Teleportation Circle). Once per Long Rest."],
      ],
      resources: [
        { id: "dreams-balm-of-the-summer-court", name: "Balm of the Summer Court (d6 pool)", usesByLevel: Object.fromEntries(Array.from({ length: 19 }, (_, i) => [i + 2, i + 2])), isPointPool: true },
        { id: "dreams-hidden-paths", name: "Hidden Paths", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 10, minimum: 1 } },
        { id: "dreams-walker-in-dreams", name: "Walker in Dreams", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "Circle of the Shepherd",
      summary: "Commune with spirits of nature and empower your summoned creatures.",
      features: [
        [2, "Speech of the Woods", "You learn Sylvan and can speak with Beasts."],
        [2, "Spirit Totem", "As a Bonus Action, summon a spirit aura (30 ft, 1 minute) centered on a point within 60 ft. Bear Spirit: allies in it gain Temporary Hit Points (5 + Druid level) and Advantage on Strength checks and saves. Hawk Spirit: allies gain Advantage on attacks against creatures in the aura (Reaction). Unicorn Spirit: allies in it regain extra Hit Points from healing and you sense creatures within. Once per Short or Long Rest."],
        [6, "Mighty Summoner", "Beasts and Fey you summon gain 2 extra Hit Points per Hit Die, and their attacks are Magical."],
        [10, "Guardian Spirit", "Beasts and Fey you summon within your Spirit Totem aura regain Hit Points at the end of your turn (half your Druid level)."],
        [14, "Faithful Summons", "When you are reduced to 0 Hit Points or Incapacitated, you can summon four Beasts (as Conjure Animals, CR 2 or lower each) near you for 1 hour. Once per Long Rest."],
      ],
      resources: [
        { id: "shepherd-spirit-totem", name: "Spirit Totem", usesByLevel: { 2: 1 }, shortRestRegain: "all" },
        { id: "shepherd-faithful-summons", name: "Faithful Summons", usesByLevel: { 14: 1 } },
      ],
    },
    {
      name: "Circle of Spores",
      summary: "Find beauty in decay and wield fungal power.",
      features: [
        [2, "Circle Spells", "Always prepared: Chill Touch (cantrip); Blindness/Deafness, Gentle Repose (3rd); Animate Dead, Gaseous Form (5th); Blight, Confusion (7th); Cloudkill, Contagion (9th)."],
        [2, "Halo of Spores", "When a creature you can see moves within 10 ft or starts its turn there, use your Reaction to deal 1d4 Necrotic damage (Constitution save negates). The die grows to 1d6 at 6th, 1d8 at 10th and 1d10 at 14th."],
        [2, "Symbiotic Entity", "As an action, spend a use of Wild Shape to gain 4 times your Druid level Temporary Hit Points for 10 minutes; your Halo of Spores damage doubles and your melee attacks deal an extra 1d6 Necrotic damage."],
        [6, "Fungal Infestation", "When a Small or Medium beast or humanoid dies near you, use your Reaction to animate it as a zombie for 1 hour (it obeys your commands). Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [10, "Spreading Spores", "While Symbiotic Entity is active, as a Bonus Action you can place a 10-ft cube of spores within 30 ft for 1 minute that deals your Halo damage to creatures that enter or start their turn in it."],
        [14, "Fungal Body", "You can't be Blinded, Deafened, Frightened or Poisoned, and any critical hit against you is a normal hit unless you're Incapacitated."],
      ],
      resources: [{ id: "spores-fungal-infestation", name: "Fungal Infestation", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 6, minimum: 1 } }],
    },
    adapt("druid", "Circle of the Stars", { levels: { 3: 2 } }),
    {
      name: "Circle of Wildfire",
      summary: "Bond with a wildfire spirit that cleanses and renews.",
      features: [
        [2, "Circle Spells", "Always prepared: Burning Hands, Cure Wounds (2nd); Flaming Sphere, Scorching Ray (3rd); Plant Growth, Revivify (5th); Aura of Life, Fire Shield (7th); Flame Strike, Mass Cure Wounds (9th)."],
        [2, "Summon Wildfire Spirit", "As an action, spend a use of Wild Shape to summon a wildfire spirit in an unoccupied space within 30 ft for 1 hour. Creatures near it make a Dexterity save or take 2d6 Fire damage. The spirit acts on your Initiative, shares your Concentration-based commands, and returns when you dismiss it."],
        [6, "Enhanced Bond", "When you cast a spell that deals Fire damage or restores Hit Points, add 1d8 to one roll. You can cast spells as if from the spirit's space, and can teleport adjacent to it."],
        [10, "Cauterizing Flame", "When a creature you can see dies within 30 ft, a spectral flame appears; a creature that touches it regains 2d10 + Wisdom modifier Hit Points or takes that much Fire damage. Uses equal your proficiency bonus; regained on a Long Rest."],
        [14, "Blazing Revival", "When you drop to 0 Hit Points while your spirit is within 120 ft, you can have it drop to 0 instead and you regain half your Hit Points and stand up. Once per Long Rest."],
      ],
      resources: [
        { id: "wildfire-cauterizing-flame", name: "Cauterizing Flame", usesByLevel: proficiencyUses(10) },
        { id: "wildfire-blazing-revival", name: "Blazing Revival", usesByLevel: { 14: 1 } },
      ],
    },
  ],
  fighter: [
    {
      name: "Battle Master",
      summary: "Tactical combat expert who fuels special maneuvers with superiority dice.",
      features: [
        [3, "Combat Superiority", "You have four Superiority Dice (d8), becoming five at 7th level and six at 15th; the die grows to d10 at 10th and d12 at 18th. You learn three maneuvers (five at 7th, seven at 10th, nine at 15th) and spend a die to use one. Save DC = 8 + proficiency bonus + Strength or Dexterity modifier. Dice return on a Short or Long Rest."],
        [3, "Student of War", "Proficiency with one type of Artisan's Tools."],
        [7, "Know Your Enemy", "As a Bonus Action, study a creature within 30 ft for 1 minute to learn whether it is your equal, superior or inferior in several stats. Once per Long Rest, or by expending a Superiority Die."],
        [10, "Improved Combat Superiority", "Your Superiority Dice become d10s."],
        [15, "Relentless", "When you roll Initiative and have no Superiority Dice, you regain one."],
        [18, "Improved Combat Superiority", "Your Superiority Dice become d12s."],
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
        [3, "Spellcasting", "You cast Wizard spells using Intelligence. You know two cantrips and a small list of 1st-level and higher spells (mostly Abjuration and Evocation), using a third-caster slot progression."],
        [3, "Weapon Bond", "You bond with up to two weapons through a 1-hour ritual. A bonded weapon can't be disarmed, and as a Bonus Action you can summon it to your hand from the same plane."],
        [7, "War Magic", "When you use your action to cast a cantrip, you can make one weapon attack as a Bonus Action."],
        [10, "Eldritch Strike", "When you hit a creature with a weapon attack, it has Disadvantage on its next saving throw against a spell you cast before the end of your next turn."],
        [15, "Arcane Charge", "When you use Action Surge, you can also teleport up to 30 ft to an unoccupied space you can see."],
        [18, "Improved War Magic", "When you use your action to cast a spell, you can make one weapon attack as a Bonus Action."],
      ],
    },
    {
      name: "Arcane Archer",
      summary: "Shoot arrows imbued with magical effects.",
      features: [
        [3, "Arcane Archer Lore", "Proficiency in Arcana or Nature and you learn Prestidigitation or Druidcraft."],
        [3, "Arcane Shot", "You learn two Arcane Shot options (banishing, bewildering, burning, enfeebling, grasping, piercing, seeking, shadow, etc.), more at 7th, 10th, 15th and 18th. Once per turn when you fire an arrow from a shortbow or longbow, apply one option. Two uses per Short or Long Rest (DC 8 + proficiency bonus + Intelligence modifier)."],
        [7, "Magic Arrow", "Any nonmagical arrow you fire counts as Magical."],
        [7, "Curving Shot", "When you miss with an attack, use a Bonus Action to redirect it to a different target within 60 ft and reroll."],
        [10, "Ever-Ready Shot", "When you roll Initiative and have no Arcane Shot uses, you regain one."],
        [15, "Arcane Shot Options", "You learn two additional Arcane Shot options."],
        [18, "Improved Shots", "Your Arcane Shot damage dice become 2d6."],
      ],
      resources: [{ id: "arcane-archer-shots", name: "Arcane Shot", usesByLevel: { 3: 2 }, shortRestRegain: "all" }],
    },
    {
      name: "Cavalier",
      summary: "Mounted knight who defends allies and draws enemies' attention.",
      features: [
        [3, "Bonus Proficiency", "Proficiency in Animal Handling, History, Insight, Performance or Persuasion, or you learn a language."],
        [3, "Born to the Saddle", "You have Advantage on saves to avoid falling off your mount, land on your feet when it falls, and mount or dismount using only 5 ft of movement."],
        [3, "Unwavering Mark", "When you hit a creature with a melee attack, mark it until the end of your next turn. It has Disadvantage on attacks against others, and if it damages someone else you can make a special melee attack against it as a Bonus Action with extra damage equal to half your Fighter level. Uses equal your Strength modifier (minimum 1); regained on a Long Rest."],
        [7, "Warding Maneuver", "When a creature within 5 ft is hit, use your Reaction to add 1d8 to its AC against that attack (and gain resistance to the attack's damage if it still hits). Uses equal your Constitution modifier; regained on a Long Rest."],
        [10, "Hold the Line", "Creatures provoke an Opportunity Attack from you when they move within 5 ft of you even if they Disengaged, and a hit reduces their Speed to 0."],
        [15, "Ferocious Charger", "If you move at least 10 ft in a line and hit a creature, it makes a Strength save or is knocked Prone. Once per turn."],
        [18, "Vigilant Defender", "On each creature's turn, you get a special Reaction usable only for an Opportunity Attack, in addition to your regular Reaction."],
      ],
      resources: [
        { id: "cavalier-unwavering-mark", name: "Unwavering Mark", usesFromAbilityModifier: { ability: "strength", grantedAtLevel: 3, minimum: 1 } },
        { id: "cavalier-warding-maneuver", name: "Warding Maneuver", usesFromAbilityModifier: { ability: "constitution", grantedAtLevel: 7, minimum: 1 } },
      ],
    },
    {
      name: "Samurai",
      summary: "Fierce warrior with unyielding fighting spirit.",
      features: [
        [3, "Bonus Proficiency", "Proficiency in History, Insight, Performance or Persuasion, or you learn a language."],
        [3, "Fighting Spirit", "As a Bonus Action, gain Advantage on weapon attacks until the end of the turn and 5 Temporary Hit Points (10 at 10th, 15 at 15th). Three uses per Long Rest."],
        [7, "Elegant Courtier", "Add your Wisdom modifier to Persuasion checks, and gain proficiency in Wisdom saves (or Intelligence/Charisma if you already have it)."],
        [10, "Tireless Spirit", "When you roll Initiative and have no uses of Fighting Spirit, you regain one."],
        [15, "Rapid Strike", "When you attack with Advantage, you can forgo it to make one extra weapon attack with the same action."],
        [18, "Strength Before Death", "When you would drop to 0 Hit Points and not die outright, use your Reaction to take an extra turn before falling Unconscious. Once per Long Rest."],
      ],
      resources: [
        { id: "samurai-fighting-spirit", name: "Fighting Spirit", usesByLevel: { 3: 3 } },
        { id: "samurai-strength-before-death", name: "Strength Before Death", usesByLevel: { 18: 1 } },
      ],
    },
    {
      name: "Echo Knight",
      summary: "Manifest an echo of yourself from another timeline.",
      features: [
        [3, "Manifest Echo", "As a Bonus Action, summon an echo (AC 14 + your proficiency bonus, HP 1) within 15 ft that vanishes if you're Incapacitated. You can swap places with it, make attacks as if from its space, and trigger Opportunity Attacks from it."],
        [3, "Unleash Incarnation", "When you take the Attack action, you can make one extra attack from the echo's position. Uses equal your Constitution modifier (minimum 1); regained on a Long Rest."],
        [7, "Echo Avatar", "As an action, see and hear through your echo up to 1,000 ft away for 10 minutes (Concentration), and you can swap places up to 30 ft."],
        [10, "Shadow Martyr", "When a creature attacks someone other than you, use your Reaction to teleport your echo adjacent to the target; the attack hits the echo instead. Once per Short or Long Rest."],
        [15, "Reclaim Potential", "When your echo is destroyed, you gain Temporary Hit Points equal to 2d6 + Constitution modifier. Uses equal your Constitution modifier; regained on a Long Rest."],
        [18, "Legion of One", "You can create two echoes at once, and when you roll Initiative with no Unleash Incarnation uses, you regain one."],
      ],
      resources: [
        { id: "echo-unleash-incarnation", name: "Unleash Incarnation", usesFromAbilityModifier: { ability: "constitution", grantedAtLevel: 3, minimum: 1 } },
        { id: "echo-shadow-martyr", name: "Shadow Martyr", usesByLevel: { 10: 1 }, shortRestRegain: "all" },
        { id: "echo-reclaim-potential", name: "Reclaim Potential", usesFromAbilityModifier: { ability: "constitution", grantedAtLevel: 15, minimum: 1 } },
      ],
    },
    adapt("fighter", "Psi Warrior"),
    {
      name: "Rune Knight",
      summary: "Enhance your gear with giant runes and grow in stature.",
      features: [
        [3, "Bonus Proficiencies", "Proficiency with Smith's Tools and you learn Giant."],
        [3, "Rune Carver", "You learn two runes (Cloud, Fire, Frost, Stone, Hill, Storm) and more at 7th, 10th and 15th; each can be invoked once per Short or Long Rest for an effect, and gives a passive benefit when worn."],
        [3, "Giant's Might", "As a Bonus Action, become Large for 1 minute: Advantage on Strength checks and saves, and once per turn deal extra 1d6 damage (1d8 at 10th, 1d10 at 18th). Uses equal your proficiency bonus; regained on a Long Rest."],
        [7, "Runic Shield", "When another creature you can see within 60 ft is hit by an attack, use your Reaction to force the attacker to reroll. Uses equal your proficiency bonus; regained on a Long Rest."],
        [10, "Great Stature", "You grow taller and your Giant's Might damage improves."],
        [15, "Master of Runes", "You can invoke each rune you know twice per Short or Long Rest instead of once."],
        [18, "Runic Juggernaut", "Your Giant's Might makes you Huge, your reach is 10 ft, and the extra damage is 1d10."],
      ],
      resources: [
        { id: "rune-knight-giants-might", name: "Giant's Might", usesByLevel: proficiencyUses(3) },
        { id: "rune-knight-runic-shield", name: "Runic Shield", usesByLevel: proficiencyUses(7) },
      ],
    },
    {
      name: "Purple Dragon Knight",
      summary: "A knightly leader who rallies allies.",
      features: [
        [3, "Rallying Cry", "When you use Second Wind, up to three creatures within 60 ft regain Hit Points equal to your Fighter level."],
        [7, "Royal Envoy", "Proficiency in Persuasion (or expertise if already proficient), and you can add a bonus to Charisma checks from your Fighter level scale."],
        [10, "Inspiring Surge", "When you use Action Surge, you can inspire an ally within 60 ft; it makes one melee or ranged weapon attack as a Reaction."],
        [15, "Bulwark", "When you use Indomitable, you can extend its benefit to an ally within 60 ft that can see or hear you, letting them reroll the same save."],
      ],
    },
  ],
  monk: [
    {
      name: "Way of Shadow",
      summary: "Use stealth and darkness to hide and strike.",
      features: [
        [3, "Shadow Arts", "Spend 2 ki to cast Darkness, Darkvision, Pass without Trace or Silence without components. You also learn Minor Illusion."],
        [6, "Shadow Step", "As a Bonus Action while in Dim Light or Darkness, teleport up to 60 ft to an unoccupied space in Dim Light or Darkness. You have Advantage on the first melee attack you make before the end of the turn."],
        [11, "Cloak of Shadows", "While in Dim Light or Darkness, you can use your action to turn Invisible until you attack, cast a spell or enter bright light."],
        [17, "Opportunist", "When a creature within 5 ft is hit by an attack from someone other than you, use your Reaction to make a melee attack against it."],
      ],
    },
    {
      name: "Way of the Four Elements",
      summary: "Bend the elements with ki.",
      features: [
        [3, "Disciple of the Elements", "You learn Elemental Attunement and one other elemental discipline, gaining more at 6th, 11th and 17th. Disciplines let you spend ki to cast spells like Fangs of the Fire Snake, Fist of Unbroken Air, Rush of the Gale Spirits or Water Whip (the ki cost rises with spell level)."],
        [6, "More Disciplines", "You learn an additional elemental discipline."],
        [11, "More Disciplines", "You learn an additional elemental discipline, and can spend ki to cast higher-level elemental spells."],
        [17, "More Disciplines", "You learn an additional elemental discipline."],
      ],
    },
    {
      name: "Way of the Long Death",
      summary: "Study death to master its power.",
      features: [
        [3, "Touch of Death", "When you reduce a creature to 0 Hit Points, you gain Temporary Hit Points equal to your Wisdom modifier + your Monk level."],
        [6, "Hour of Reaping", "As an action, creatures within 30 ft of you make a Wisdom save or are Frightened until the end of your next turn."],
        [11, "Mastery of Death", "When you would drop to 0 Hit Points, spend 1 ki to drop to 1 Hit Point instead."],
        [17, "Touch of the Long Death", "As an action, spend 1-10 ki to touch a creature; it makes a Constitution save, taking 2d10 Necrotic damage per ki point spent (half on a success)."],
      ],
    },
    {
      name: "Way of the Sun Soul",
      summary: "Channel ki into radiant light.",
      features: [
        [3, "Radiant Sun Bolt", "You can make a ranged spell attack as a Monk weapon (range 30 ft, Martial Arts die Radiant damage). After the Attack action, spend 1 ki to make two Sun Bolt attacks as a Bonus Action."],
        [6, "Searing Arc Strike", "After taking the Attack action, spend 2 ki to cast Burning Hands as a Bonus Action; extra ki raises its level by 1 per ki."],
        [11, "Searing Sunburst", "As an action, create a 150-ft, 20-ft-radius burst; creatures make a Constitution save or take 2d6 Radiant damage (spend up to 3 ki for +2d6 each)."],
        [17, "Sun Shield", "You shed bright light 30 ft and, when hit by a melee attack, use your Reaction to deal 5 + Wisdom modifier Radiant damage to the attacker."],
      ],
    },
    {
      name: "Way of the Drunken Master",
      summary: "Fight with unpredictable, tumbling grace.",
      features: [
        [3, "Bonus Proficiencies", "Proficiency in Performance and Brewer's Supplies."],
        [3, "Drunken Technique", "When you use Flurry of Blows you gain the benefit of Disengage and your Speed increases by 10 ft until the end of the turn."],
        [6, "Tipsy Sway", "Leap to Your Feet: stand from Prone using only 5 ft of movement. Redirect Attack: when a melee attack misses you, spend 1 ki to make the attacker hit another creature within 5 ft instead."],
        [11, "Drunkard's Luck", "When you make an ability check, attack roll or save with Disadvantage, spend 2 ki to cancel the Disadvantage."],
        [17, "Intoxicated Frenzy", "When you use Flurry of Blows you can make up to five attacks instead of two, each against a different target."],
      ],
    },
    {
      name: "Way of the Kensei",
      summary: "Master of weapons as an art.",
      features: [
        [3, "Path of the Kensei", "Choose two kensei weapons (a melee and a ranged weapon with no Heavy or special property); your attacks with them count as Monk weapons. Agile Parry: after an Unarmed Strike, +2 AC against melee attacks until your next turn. Kensei's Shot: as a Bonus Action, deal an extra 1d4 damage with a kensei ranged weapon."],
        [6, "One with the Blade", "Your kensei weapon attacks count as Magical. Deft Strike: when you hit with one, spend 1 ki to deal extra damage equal to your Martial Arts die once per turn."],
        [11, "Sharpen the Blade", "As a Bonus Action, spend 1-3 ki to give a kensei weapon a +1 to +3 bonus to attack and damage for 1 minute."],
        [17, "Unerring Accuracy", "When you miss with a Monk weapon attack on your turn, you can reroll the attack roll once."],
      ],
    },
    {
      name: "Way of the Astral Self",
      summary: "Project spectral arms and visage from your inner self.",
      features: [
        [3, "Arms of the Astral Self", "As a Bonus Action, spend 1 ki to summon spectral arms for 10 minutes: Wisdom for Strength checks and Dexterity saves, reach 5 ft, and you can use Wisdom for Unarmed Strike attack rolls, dealing Force damage."],
        [6, "Visage of the Astral Self", "As a Bonus Action, spend 1 ki (1 minute) to manifest a visage: Astral Sight (Darkvision 120 ft and see Invisible), Wisdom of the Spirit (Advantage on Insight and Intimidation), and Astral Voice (be heard within 600 ft)."],
        [11, "Body of the Astral Self", "While both arms and visage are active: Deflecting Arms (reduce Bludgeoning, Piercing, Slashing damage by 3 + Wisdom modifier) and Empowered Arms (extra damage on your Unarmed Strikes)."],
        [17, "Awakened Astral Self", "As a Bonus Action, spend 5 ki to awaken your full self for 10 minutes: +2 AC and an extra Unarmed Strike each turn."],
      ],
    },
    adapt("monk", "Warrior of Mercy", {
      as: "Way of Mercy",
      text: [
        ["Focus Points", "Ki Points"],
        ["Focus Point", "Ki Point"],
      ],
    }),
  ],
  paladin: [
    {
      ...adapt("paladin", "Oath of the Ancients", {
        extra: [[3, "Channel Divinity: Turn the Faithless", "As an action, fey and fiends within 30 ft make a Wisdom save or are Turned for 1 minute, and their true form is revealed."]],
      }),
    },
    {
      ...adapt("paladin", "Oath of Vengeance", {
        extra: [[3, "Channel Divinity: Abjure Enemy", "As an action, choose one creature within 60 ft; it makes a Wisdom save or is Frightened with a Speed of 0 for 1 minute (undead and fiends have Disadvantage on the save)."]],
      }),
    },
    {
      name: "Oath of Conquest",
      summary: "Crush the enemies of order through fear.",
      features: [
        [3, "Oath of Conquest Spells", "Always prepared: Armor of Agathys, Command (3rd); Hold Person, Spiritual Weapon (5th); Bestow Curse, Fear (9th); Dominate Beast, Stoneskin (13th); Cloudkill, Dominate Person (17th)."],
        [3, "Channel Divinity: Conquering Presence", "As an action, creatures of your choice within 30 ft make a Wisdom save or are Frightened for 1 minute."],
        [3, "Channel Divinity: Guided Strike", "When you make an attack roll, add +10 to it (after seeing the die, before the result)."],
        [7, "Aura of Conquest", "Frightened creatures within your aura have Speed 0 and take Psychic damage at the start of their turn equal to half your Paladin level."],
        [15, "Scornful Rebuke", "When a creature hits you with an attack, it takes Psychic damage equal to your Charisma modifier (minimum 1)."],
        [20, "Invincible Conqueror", "As an action for 1 minute: resistance to all damage, an extra attack, and critical hits on 19-20. Once per Long Rest."],
      ],
      resources: [{ id: "conquest-invincible-conqueror", name: "Invincible Conqueror", usesByLevel: { 20: 1 } }],
    },
    {
      name: "Oath of Redemption",
      summary: "Seek peace, and protect those who would do harm.",
      features: [
        [3, "Oath of Redemption Spells", "Always prepared: Sanctuary, Sleep (3rd); Calm Emotions, Hold Person (5th); Counterspell, Hypnotic Pattern (9th); Otiluke's Resilient Sphere, Stoneskin (13th); Hold Monster, Wall of Force (17th)."],
        [3, "Channel Divinity: Emissary of Peace", "As a Bonus Action, gain +5 to Charisma (Persuasion) checks for 10 minutes."],
        [3, "Channel Divinity: Rebuke the Violent", "When a creature within 30 ft damages another, use your Reaction to force a Wisdom save; it takes Radiant damage equal to the damage it dealt, or half on a success."],
        [7, "Aura of the Guardian", "When a creature within 10 ft is damaged, use your Reaction to take that damage instead."],
        [15, "Protective Spirit", "If you end a turn with half your Hit Points or fewer and aren't Incapacitated, you regain 1d6 + half your Paladin level Hit Points."],
        [20, "Emissary of Redemption", "For 1 minute you resist all damage from other creatures, and attackers take Radiant damage equal to half the damage dealt; the effect ends if you attack or cast a spell. Once per Long Rest."],
      ],
      resources: [{ id: "redemption-emissary", name: "Emissary of Redemption", usesByLevel: { 20: 1 } }],
    },
    adapt("paladin", "Oath of Glory"),
    {
      name: "Oath of the Watchers",
      summary: "Guard the world against extraplanar threats.",
      features: [
        [3, "Oath of the Watchers Spells", "Always prepared: Alarm, Detect Magic (3rd); Moonbeam, See Invisibility (5th); Counterspell, Nondetection (9th); Aura of Purity, Banishment (13th); Hold Monster, Scrying (17th)."],
        [3, "Channel Divinity: Watcher's Will", "As an action, up to your Charisma modifier creatures within 30 ft gain Advantage on Intelligence, Wisdom and Charisma saves for 1 minute."],
        [3, "Channel Divinity: Abjure the Extraplanar", "As an action, aberrations, celestials, elementals, fey and fiends within 30 ft make a Wisdom save or are Turned for 1 minute."],
        [7, "Aura of the Sentinel", "You and allies within your aura add your proficiency bonus to Initiative rolls."],
        [15, "Vigilant Rebuke", "When you or an ally within 30 ft succeeds on an Intelligence, Wisdom or Charisma save, use your Reaction to deal 2d8 + Charisma modifier Force damage to the source. Uses equal your Charisma modifier; regained on a Long Rest."],
        [20, "Mortal Bulwark", "As a Bonus Action for 1 minute: Truesight 120 ft, Advantage on attacks against extraplanar creatures, and a hit can banish one. Once per Long Rest."],
      ],
      resources: [
        { id: "watchers-vigilant-rebuke", name: "Vigilant Rebuke", usesFromAbilityModifier: { ability: "charisma", grantedAtLevel: 15, minimum: 1 } },
        { id: "watchers-mortal-bulwark", name: "Mortal Bulwark", usesByLevel: { 20: 1 } },
      ],
    },
    {
      name: "Oathbreaker",
      summary: "A paladin who has abandoned their oath for dark power.",
      features: [
        [3, "Oathbreaker Spells", "Always prepared: Hellish Rebuke, Inflict Wounds (3rd); Crown of Madness, Darkness (5th); Animate Dead, Bestow Curse (9th); Blight, Confusion (13th); Contagion, Dominate Person (17th)."],
        [3, "Channel Divinity: Control Undead", "As an action, target an undead within 30 ft; it makes a Wisdom save or obeys you for 24 hours (undead with high CR are immune)."],
        [3, "Channel Divinity: Dreadful Aspect", "As an action, creatures of your choice within 30 ft make a Wisdom save or are Frightened for 1 minute."],
        [7, "Aura of Hate", "You and fiends and undead within your aura add your Charisma modifier to melee weapon damage."],
        [15, "Supernatural Resistance", "You have resistance to Bludgeoning, Piercing and Slashing damage from nonmagical weapons."],
        [20, "Dread Lord", "As an action, surround yourself with an aura of gloom (30 ft) for 1 minute: creatures in it have Disadvantage on saves against fear, take Psychic damage at the start of their turn, and your attacks deal extra Necrotic damage. Once per Long Rest."],
      ],
      resources: [{ id: "oathbreaker-dread-lord", name: "Dread Lord", usesByLevel: { 20: 1 } }],
    },
  ],
  ranger: [
    {
      name: "Beast Master",
      summary: "Bond with a beast companion that fights beside you.",
      features: [
        [3, "Ranger's Companion", "You gain a beast companion (CR 1/4 or lower, Medium or smaller) that obeys your commands, adds your proficiency bonus to its AC, attacks, damage and saves, and has extra HP equal to your Ranger level times five (instead of normal HP)."],
        [7, "Exceptional Training", "As a Bonus Action, command your companion to Dash, Disengage, Dodge or Help, and its attacks count as Magical."],
        [11, "Bestial Fury", "Your companion can make two attacks when you command it to attack."],
        [15, "Share Spells", "When you cast a spell targeting only yourself, it also affects your companion if it is within 30 ft of you."],
      ],
    },
    {
      name: "Gloom Stalker",
      summary: "Hunter of the dark who strikes first and vanishes into shadow.",
      features: [
        [3, "Gloom Stalker Magic", "Always prepared: Disguise Self (3rd); Rope Trick (5th); Fear (9th); Greater Invisibility (13th); Seeming (17th)."],
        [3, "Dread Ambusher", "Add your Wisdom modifier to Initiative rolls. On your first turn of combat your Speed is +10 ft, and you can make one extra weapon attack as part of the Attack action; that attack deals an extra 1d8 damage on a hit."],
        [3, "Umbral Sight", "You gain Darkvision 60 ft (or +30 ft), and while in Darkness you are Invisible to creatures that rely on Darkvision to see you."],
        [7, "Iron Mind", "You gain proficiency in Wisdom saving throws (or Intelligence or Charisma saves if you already have it)."],
        [11, "Stalker's Flurry", "Once per turn when you miss with a weapon attack, you can make another weapon attack as part of the same action."],
        [15, "Shadowy Dodge", "When a creature makes an attack roll against you without Advantage, use your Reaction to impose Disadvantage on it."],
      ],
    },
    {
      name: "Horizon Walker",
      summary: "Guard the planes' boundaries, stepping between them.",
      features: [
        [3, "Horizon Walker Magic", "Always prepared: Protection from Evil and Good (3rd); Misty Step (5th); Haste (9th); Banishment (13th); Teleportation Circle (17th)."],
        [3, "Detect Portal", "As an action, sense the direction of a portal within 1 mile. Once per Short or Long Rest."],
        [3, "Planar Warrior", "As a Bonus Action, choose a creature within 30 ft; the first time you hit it on a turn, it takes extra Force damage (1d8, 2d8 at 11th), and the damage becomes Force."],
        [7, "Ethereal Step", "As a Bonus Action, cast Etherealness without a slot, ending at the end of the turn. Once per Short or Long Rest."],
        [11, "Distant Strike", "When you take the Attack action, teleport up to 10 ft before each attack; if you attack two different creatures you can make a third attack against a third creature."],
        [15, "Spectral Defense", "When you take damage from an attack, use your Reaction to gain resistance to all of that attack's damage."],
      ],
      resources: [
        { id: "horizon-walker-detect-portal", name: "Detect Portal", usesByLevel: { 3: 1 }, shortRestRegain: "all" },
        { id: "horizon-walker-ethereal-step", name: "Ethereal Step", usesByLevel: { 7: 1 }, shortRestRegain: "all" },
      ],
    },
    {
      name: "Monster Slayer",
      summary: "Hunt down creatures of the supernatural.",
      features: [
        [3, "Monster Slayer Magic", "Always prepared: Protection from Evil and Good (3rd); Zone of Truth (5th); Magic Circle (9th); Banishment (13th); Hold Monster (17th)."],
        [3, "Hunter's Sense", "As an action, learn whether a creature within 60 ft has any immunities, resistances or vulnerabilities, and which. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [3, "Slayer's Prey", "As a Bonus Action, designate a creature you can see within 60 ft; the first time you hit it each turn you deal extra 1d6 damage."],
        [7, "Supernatural Defense", "When your prey forces you to make a save or escape a grapple, add 1d6 to the roll."],
        [11, "Magic-User's Nemesis", "When a creature you can see within 60 ft casts a spell or teleports, use your Reaction to force a Wisdom save; on a failure the spell or teleportation fails. Once per Short or Long Rest."],
        [15, "Slayer's Counter", "When your prey forces you to make a saving throw, use your Reaction to make a weapon attack against it; if it hits, your save succeeds automatically."],
      ],
      resources: [
        { id: "monster-slayer-hunters-sense", name: "Hunter's Sense", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 3, minimum: 1 } },
        { id: "monster-slayer-magic-users-nemesis", name: "Magic-User's Nemesis", usesByLevel: { 11: 1 }, shortRestRegain: "all" },
      ],
    },
    adapt("ranger", "Fey Wanderer"),
    {
      name: "Swarmkeeper",
      summary: "Command a swarm of nature spirits.",
      features: [
        [3, "Gathered Swarm", "Once per turn when you hit a creature, your swarm can: deal extra Piercing damage (1d6, 1d8 at 11th, 1d10 at 15th), move the target 15 ft (Strength save), or move you 5 ft."],
        [3, "Swarmkeeper Magic", "Always prepared: Mage Hand (cantrip, your hand is a swarm); Faerie Fire, Web (3rd); Gaseous Form, Mislead (5th); Arcane Eye, Giant Insect (9th); Insect Plague, Telekinesis (13th)."],
        [7, "Writhing Tide", "As a Bonus Action, gain a Fly Speed of 10 ft and hover for 1 minute. Uses equal your proficiency bonus; regained on a Long Rest."],
        [11, "Mighty Swarm", "Gathered Swarm's damage increases and the target also becomes Prone on a failed Strength save; you gain half cover when it moves you."],
        [15, "Swarming Dispersal", "When you take damage, use your Reaction to gain resistance to it and teleport up to 30 ft. Uses equal your proficiency bonus; regained on a Long Rest."],
      ],
      resources: [
        { id: "swarmkeeper-writhing-tide", name: "Writhing Tide", usesByLevel: proficiencyUses(7) },
        { id: "swarmkeeper-swarming-dispersal", name: "Swarming Dispersal", usesByLevel: proficiencyUses(15) },
      ],
    },
    {
      name: "Drakewarden",
      summary: "Bond with a draconic companion.",
      features: [
        [3, "Draconic Gift", "You learn Thaumaturgy and speak, read and write Draconic."],
        [3, "Drake Companion", "As an action, summon a Drake (Small to Large; HP based on your Ranger level, AC 14 + proficiency bonus, bite and breath). It obeys your commands and can use a Bonus Action to attack with extra damage; you can resummon it with a spell slot. Once per Long Rest, or by expending a spell slot."],
        [7, "Bond of Fang and Scale", "Your drake can be mounted by you (and one ally if large), grants you resistance to one damage type of your choice, and your attacks gain bonus damage of its type once per turn."],
        [11, "Drake's Breath", "As an action, breathe a 30-ft cone of your drake's damage type (3d6 at 11th); Dexterity save for half. Once per Long Rest, or by expending a spell slot."],
        [15, "Perfected Bond", "Your drake grows, reaching Large with wings; you gain a Fly Speed while mounted, and its attacks deal extra damage."],
      ],
      resources: [
        { id: "drakewarden-companion", name: "Drake Companion", usesByLevel: { 3: 1 } },
        { id: "drakewarden-drakes-breath", name: "Drake's Breath", usesByLevel: { 11: 1 } },
      ],
    },
  ],
  rogue: [
    {
      name: "Assassin",
      summary: "Master of ambush, infiltration and lethal strikes.",
      features: [
        [3, "Bonus Proficiencies", "You gain a Disguise Kit and a Poisoner's Kit, with proficiency in both."],
        [3, "Assassinate", "You have Advantage on attack rolls against any creature that hasn't taken a turn in combat yet, and any hit against a surprised creature is a critical hit."],
        [9, "Infiltration Expertise", "You can spend 7 days and 25 gp to establish a convincing false identity, complete with documentation and contacts."],
        [13, "Impostor", "You can mimic another person's speech, writing and behavior after studying them for 3 hours; Insight checks against you have Disadvantage."],
        [17, "Death Strike", "When you hit a surprised creature on your first turn in combat, it makes a Constitution save (DC 8 + Dexterity modifier + proficiency bonus) or takes double damage."],
      ],
    },
    adapt("rogue", "Arcane Trickster"),
    {
      name: "Inquisitive",
      summary: "Spot lies, clues and weaknesses.",
      features: [
        [3, "Ear for Deceit", "When you make a Wisdom (Insight) check to detect a lie, treat a d20 roll of 7 or lower as an 8."],
        [3, "Eye for Detail", "As a Bonus Action, make a Wisdom (Perception) check to spot a hidden creature or object, or an Intelligence (Investigation) check to uncover clues."],
        [3, "Insightful Fighting", "As a Bonus Action, make an Insight check against a creature's Deception; on a success you can use Sneak Attack against it without Advantage for 1 minute (or until you succeed on another target)."],
        [9, "Steady Eye", "You have Advantage on Perception and Investigation checks if you moved no more than half your Speed this turn."],
        [13, "Unerring Eye", "As an action, sense illusions, shapechangers and other magical deceptions within 30 ft. Uses equal your Wisdom modifier (minimum 1); regained on a Long Rest."],
        [17, "Eye for Weakness", "While Insightful Fighting is active, your Sneak Attack deals an extra 3d6 damage."],
      ],
      resources: [{ id: "inquisitive-unerring-eye", name: "Unerring Eye", usesFromAbilityModifier: { ability: "wisdom", grantedAtLevel: 13, minimum: 1 } }],
    },
    {
      name: "Mastermind",
      summary: "Manipulate people and use battlefield tactics.",
      features: [
        [3, "Master of Intrigue", "Proficiency with a Disguise Kit, a Forgery Kit and one gaming set, plus two languages. You can mimic a person's speech after hearing it for 1 minute."],
        [3, "Master of Tactics", "You can use the Help action as a Bonus Action, with range 30 ft."],
        [9, "Insightful Manipulator", "After observing or talking to a creature for 1 minute, you learn whether it is your equal, superior or inferior in two of Intelligence, Wisdom, Charisma and class levels."],
        [13, "Misdirection", "When a creature makes an attack roll against you and another creature is within 5 ft of you, use your Reaction to have the attack hit that creature instead."],
        [17, "Soul of Deceit", "Your thoughts can't be read telepathically, and you can present false thoughts. Magic can't tell whether you're lying unless you let it."],
      ],
    },
    {
      name: "Scout",
      summary: "Skirmisher and survival expert.",
      features: [
        [3, "Skirmisher", "When an enemy ends its turn within 5 ft of you, use your Reaction to move up to half your Speed without provoking Opportunity Attacks."],
        [3, "Survivalist", "Proficiency in Nature and Survival, and your proficiency bonus is doubled for both."],
        [9, "Superior Mobility", "Your walking Speed increases by 10 ft (and your Climb/Swim Speeds if you have them)."],
        [13, "Ambush Master", "You have Advantage on Initiative rolls. The first creature you hit in the first round of combat gives your allies Advantage on attacks against it until your next turn."],
        [17, "Sudden Strike", "As a Bonus Action, make an extra weapon attack; it can deal Sneak Attack damage to a different creature than your Sneak Attack this turn."],
      ],
    },
    {
      name: "Swashbuckler",
      summary: "Daring duelist with flair.",
      features: [
        [3, "Fancy Footwork", "When you make a melee attack against a creature, it can't make Opportunity Attacks against you for the rest of your turn."],
        [3, "Rakish Audacity", "Add your Charisma modifier to Initiative rolls. You can use Sneak Attack without Advantage if no other creature is within 5 ft of you (and you don't have Disadvantage)."],
        [9, "Panache", "As an action, make a Persuasion check against a creature's Insight; if it hears you, it is Charmed (or has Disadvantage on attacks against anyone but you and can't take Opportunity Attacks if hostile) for 1 minute."],
        [13, "Elegant Maneuver", "As a Bonus Action, gain Advantage on your next Acrobatics or Athletics check this turn."],
        [17, "Master Duelist", "When you miss with an attack roll, you can reroll it with Advantage. Once per Short or Long Rest."],
      ],
      resources: [{ id: "swashbuckler-master-duelist", name: "Master Duelist", usesByLevel: { 17: 1 }, shortRestRegain: "all" }],
    },
    {
      name: "Phantom",
      summary: "Draw on the dead for strength and secrets.",
      features: [
        [3, "Whispers of the Dead", "Whenever you finish a Short or Long Rest, you gain proficiency in one skill or tool of your choice, lasting until your next rest."],
        [3, "Wails from the Grave", "When you deal Sneak Attack damage to a creature, you can have a second creature within 30 ft take Psychic damage equal to half your Sneak Attack dice. Uses equal your proficiency bonus; regained on a Long Rest."],
        [9, "Tokens of the Departed", "When a creature dies within 30 ft, use your Reaction to create a soul trinket (up to your proficiency bonus at once). You can use one for Advantage on Constitution saves vs death or to ask the spirit a question."],
        [13, "Ghost Walk", "As a Bonus Action, take on a spectral form for 10 minutes: Fly Speed 10 ft (hover), attacks against you have Disadvantage, and you can move through creatures and objects. Once per Long Rest, or by destroying a soul trinket."],
        [17, "Death's Friend", "Wails from the Grave no longer uses up a use if the first target is Sneak Attacked, and you regain a soul trinket after each Long Rest if you have none."],
      ],
      resources: [
        { id: "phantom-wails-from-the-grave", name: "Wails from the Grave", usesByLevel: proficiencyUses(3) },
        { id: "phantom-ghost-walk", name: "Ghost Walk", usesByLevel: { 13: 1 } },
      ],
    },
    adapt("rogue", "Soulknife"),
  ],
};
