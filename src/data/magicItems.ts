// Magic item catalog: 5e SRD 5.1 (2014) + SRD 5.2 (2024), both CC BY 4.0,
// Wizards of the Coast. Sourced via the open5e v2 API (document=srd-2014 /
// document=srd-2024 -- note this endpoint filters on `document`, not
// `document__key` like /v2/creatures/ -- see docs/DND_CONTENT_SOURCES.md).
// Pulled by curl, not WebFetch, to preserve exact rules text.
export type MagicItemSeed = {
  slug: string;
  name: string;
  category: string;
  rarity: string;
  requiresAttunement: boolean;
  description: string;
  sourceKey: string;
  sourceName: string;
};

export const MAGIC_ITEMS: MagicItemSeed[] = [
  {
    slug: "srd-2014-adamantine-armor-breastplate",
    name: `Adamantine Armor (Breastplate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-chain-mail",
    name: `Adamantine Armor (Chain-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-chain-shirt",
    name: `Adamantine Armor (Chain-Shirt)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-half-plate",
    name: `Adamantine Armor (Half-Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-plate",
    name: `Adamantine Armor (Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-ring-mail",
    name: `Adamantine Armor (Ring-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-scale-mail",
    name: `Adamantine Armor (Scale-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-adamantine-armor-splint",
    name: `Adamantine Armor (Splint)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any critical hit against you becomes a normal hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-amulet-of-health",
    name: `Amulet of Health`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-amulet-of-proof-against-detection-and-location",
    name: `Amulet of Proof against Detection and Location`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this amulet, you are hidden from divination magic. You can't be targeted by such magic or perceived through magical scrying sensors.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-amulet-of-the-planes",
    name: `Amulet of the Planes`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this amulet, you can use an action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the _plane shift_ spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1-60, you travel to a random location on the plane you named. On a 61-100, you travel to a randomly determined plane of existence.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-animated-shield",
    name: `Animated Shield`,
    category: `Shield`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-apparatus-of-the-crab",
    name: `Apparatus of the Crab`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This item first appears to be a Large sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move either up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster.

The apparatus of the Crab is a Large object with the following statistics:

**Armor Class:** 20

**Hit Points:** 200

**Speed:** 30 ft., swim 30 ft. (or 0 ft. for both if the legs and tail aren't extended)

**Damage Immunities:** poison, psychic

To be used as a vehicle, the apparatus requires one pilot. While the apparatus's hatch is closed, the compartment is airtight and watertight. The compartment holds enough air for 10 hours of breathing, divided by the number of breathing creatures inside.

The apparatus floats on water. It can also go underwater to a depth of 900 feet. Below that, the vehicle takes 2d6 bludgeoning damage per minute from pressure.

A creature in the compartment can use an action to move as many as two of the apparatus's levers up or down. After each use, a lever goes back to its neutral position. Each lever, from left to right, functions as shown in the Apparatus of the Crab Levers table.

**Apparatus of the Crab Levers (table)**

| Lever | Up                                                                                                                               | Down                                                                                                                                        |
|-------|----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| 1     | Legs and tail extend, allowing the apparatus to walk and swim.                                                                   | Legs and tail retract, reducing the apparatus's speed to 0 and making it unable to benefit from bonuses to speed.                           |
| 2     | Forward window shutter opens.                                                                                                    | Forward window shutter closes.                                                                                                              |
| 3     | Side window shutters open (two per side).                                                                                        | Side window shutters close (two per side).                                                                                                  |
| 4     | Two claws extend from the front sides of the apparatus.                                                                          | The claws retract.                                                                                                                          |
| 5     | Each extended claw makes the following melee weapon attack: +8 to hit, reach 5 ft., one target. Hit: 7 (2d6) bludgeoning damage. | Each extended claw makes the following melee weapon attack: +8 to hit, reach 5 ft., one target. Hit: The target is grappled (escape DC 15). |
| 6     | The apparatus walks or swims forward.                                                                                            | The apparatus walks or swims backward.                                                                                                      |
| 7     | The apparatus turns 90 degrees left.                                                                                             | The apparatus turns 90 degrees right.                                                                                                       |
| 8     | Eyelike fixtures emit bright light in a 30-foot radius and dim light for an additional 30 feet.                                  | The light turns off.                                                                                                                        |
| 9     | The apparatus sinks as much as 20 feet in liquid.                                                                                | The apparatus rises up to 20 feet in liquid.                                                                                                |
| 10    | The rear hatch unseals and opens.                                                                                                | The rear hatch closes and seals.                                                                                                            |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-invulnerability",
    name: `Armor of Invulnerability`,
    category: `Armor`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You have resistance to nonmagical damage while you wear this armor. Additionally, you can use an action to make yourself immune to nonmagical damage for 10 minutes or until you are no longer wearing the armor. Once this special action is used, it can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-breastplate",
    name: `Armor of Resistance (Breastplate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-chain-mail",
    name: `Armor of Resistance (Chain Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-chain-shirt",
    name: `Armor of Resistance (Chain Shirt)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-half-plate",
    name: `Armor of Resistance (Half Plate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-hide",
    name: `Armor of Resistance (Hide)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-leather",
    name: `Armor of Resistance (Leather)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-padded",
    name: `Armor of Resistance (Padded)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-plate",
    name: `Armor of Resistance (Plate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-ring-mail",
    name: `Armor of Resistance (Ring Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-scale-mail",
    name: `Armor of Resistance (Scale Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-splint",
    name: `Armor of Resistance (Splint)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-resistance-studded-leather",
    name: `Armor of Resistance (Studded-Leather)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-armor-of-vulnerability",
    name: `Armor of Vulnerability`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have resistance to one of the following damage types: bludgeoning, piercing, or slashing. The GM chooses the type or determines it randomly.

**_Curse_**. This armor is cursed, a fact that is revealed only when an _identify_ spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by the _remove curse_ spell or similar magic; removing the armor fails to end the curse. While cursed, you have vulnerability to two of the three damage types associated with the armor (not the one to which it grants resistance).`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-arrow-catching-shield",
    name: `Arrow-Catching Shield`,
    category: `Shield`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to AC against ranged attacks while you wield this shield. This bonus is in addition to the shield's normal bonus to AC. In addition, whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-arrow-of-slaying",
    name: `Arrow of Slaying`,
    category: `Ammunition`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `An _arrow of slaying_ is a magic weapon meant to slay a particular kind of creature. Some are more focused than others; for example, there are both _arrows of dragon slaying_ and _arrows of blue dragon slaying_. If a creature belonging to the type, race, or group associated with an _arrow of slaying_ takes damage from the arrow, the creature must make a DC 17 Constitution saving throw, taking an extra 6d10 piercing damage on a failed save, or half as much extra damage on a successful one.\\n\\nOnce an _arrow of slaying_ deals its extra damage to a creature, it becomes a nonmagical arrow.\\n\\nOther types of magic ammunition of this kind exist, such as _bolts of slaying_ meant for a crossbow, though arrows are most common.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bag-of-beans",
    name: `Bag of Beans`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `Inside this heavy cloth bag are 3d4 dry beans. The bag weighs 1/2 pound plus 1/4 pound for each bean it contains.

If you dump the bag's contents out on the ground, they explode in a 10-foot radius, extending from the beans. Each creature in the area, including you, must make a DC 15 Dexterity saving throw, taking 5d4 fire damage on a failed save, or half as much damage on a successful one. The fire ignites flammable objects in the area that aren't being worn or carried.

If you remove a bean from the bag, plant it in dirt or sand, and then water it, the bean produces an effect 1 minute later from the ground where it was planted. The GM can choose an effect from the following table, determine it randomly, or create an effect.

| d100  | Effect                                                                                                                                                                                                                                                                                                                                                                |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01    | 5d4 toadstools sprout. If a creature eats a toadstool, roll any die. On an odd roll, the eater must succeed on a DC 15 Constitution saving throw or take 5d6 poison damage and become poisoned for 1 hour. On an even roll, the eater gains 5d6 temporary hit points for 1 hour.                                                                                      |
| 02-10 | A geyser erupts and spouts water, beer, berry juice, tea, vinegar, wine, or oil (GM's choice) 30 feet into the air for 1d12 rounds.                                                                                                                                                                                                                                   |
| 11-20 | A treant sprouts. There's a 50 percent chance that the treant is chaotic evil and attacks.                                                                                                                                                                                                                                                                            |
| 21-30 | An animate, immobile stone statue in your likeness rises. It makes verbal threats against you. If you leave it and others come near, it describes you as the most heinous of villains and directs the newcomers to find and attack you. If you are on the same plane of existence as the statue, it knows where you are. The statue becomes inanimate after 24 hours. |
| 31-40 | A campfire with blue flames springs forth and burns for 24 hours (or until it is extinguished).                                                                                                                                                                                                                                                                       |
| 41-50 | 1d6 + 6 shriekers sprout                                                                                                                                                                                                                                                                                                                                              |
| 51-60 | 1d4 + 8 bright pink toads crawl forth. Whenever a toad is touched, it transforms into a Large or smaller monster of the GM's choice. The monster remains for 1 minute, then disappears in a puff of bright pink smoke.                                                                                                                                                |
| 61-70 | A hungry bulette burrows up and attacks. 71-80 A fruit tree grows. It has 1d10 + 20 fruit, 1d8 of which act as randomly determined magic potions, while one acts as an ingested poison of the GM's choice. The tree vanishes after 1 hour. Picked fruit remains, retaining any magic for 30 days.                                                                     |
| 81-90 | A nest of 1d4 + 3 eggs springs up. Any creature that eats an egg must make a DC 20 Constitution saving throw. On a successful save, a creature permanently increases its lowest ability score by 1, randomly choosing among equally low scores. On a failed save, the creature takes 10d6 force damage from an internal magical explosion.                            |
| 91-99 | A pyramid with a 60-foot-square base bursts upward. Inside is a sarcophagus containing a mummy lord. The pyramid is treated as the mummy lord's lair, and its sarcophagus contains treasure of the GM's choice.                                                                                                                                                       |
| 100   | A giant beanstalk sprouts, growing to a height of the GM's choice. The top leads where the GM chooses, such as to a great view, a cloud giant's castle, or a different plane of existence.                                                                                                                                                                            |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bag-of-devouring",
    name: `Bag of Devouring`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This bag superficially resembles a _bag of holding_ but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice.

The extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 percent chance that the creature is pulled inside the bag. A creature inside the bag can use its action to try to escape with a successful DC 15 Strength check. Another creature can use its action to reach into the bag to pull a creature out, doing so with a successful DC 20 Strength check (provided it isn't pulled inside the bag first). Any creature that starts its turn inside the bag is devoured, its body destroyed.

Inanimate objects can be stored in the bag, which can hold a cubic foot of such material. However, once each day, the bag swallows any objects inside it and spits them out into another plane of existence. The GM determines the time and plane.

If the bag is pierced or torn, it is destroyed, and anything contained within it is transported to a random location on the Astral Plane.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bag-of-holding",
    name: `Bag of Holding`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This bag has an interior space considerably larger than its outside dimensions, roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item from the bag requires an action.

If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth, unharmed, but the bag must be put right before it can be used again. Breathing creatures inside the bag can survive up to a number of minutes equal to 10 divided by the number of creatures (minimum 1 minute), after which time they begin to suffocate.

Placing a _bag of holding_ inside an extradimensional space created by a _handy haversack_, _portable hole_, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bag-of-tricks",
    name: `Bag of Tricks`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This ordinary bag, made from gray, rust, or tan cloth, appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. The bag weighs 1/2 pound.

You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling a d8 and consulting the table that corresponds to the bag's color.

The creature is friendly to you and your companions, and it acts on your turn. You can use a bonus action to command how the creature moves and what action it takes on its next turn, or to give it general orders, such as to attack your enemies. In the absence of such orders, the creature acts in a fashion appropriate to its nature.

Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.

**Gray Bag of Tricks (table)**

| d8 | Creature     |
|----|--------------|
| 1  | Weasel       |
| 2  | Giant rat    |
| 3  | Badger       |
| 4  | Boar         |
| 5  | Panther      |
| 6  | Giant badger |
| 7  | Dire wolf    |
| 8  | Giant elk    |

**Rust Bag of Tricks (table)**

| d8 | Creature   |
|----|------------|
| 1  | Rat        |
| 2  | Owl        |
| 3  | Mastiff    |
| 4  | Goat       |
| 5  | Giant goat |
| 6  | Giant boar |
| 7  | Lion       |
| 8  | Brown bear |

**Tan Bag of Tricks (table)**

| d8 | Creature     |
|----|--------------|
| 1  | Jackal       |
| 2  | Ape          |
| 3  | Baboon       |
| 4  | Axe beak     |
| 5  | Black bear   |
| 6  | Giant weasel |
| 7  | Giant hyena  |
| 8  | Tiger        |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-battleaxe-1",
    name: `Battleaxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-battleaxe-2",
    name: `Battleaxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-battleaxe-3",
    name: `Battleaxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bead-of-force",
    name: `Bead of Force`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 _beads of force_ are found together.

You can use an action to throw the bead up to 60 feet. The bead explodes on impact and is destroyed. Each creature within a 10-foot radius of where the bead landed must succeed on a DC 15 Dexterity saving throw or take 5d4 force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the save, or are partially within the area, are pushed away from the center of the sphere until they are no longer inside it. Only breathable air can pass through the sphere's wall. No attack or other effect can.

An enclosed creature can use its action to push against the sphere's wall, moving the sphere up to half the creature's walking speed. The sphere can be picked up, and its magic causes it to weigh only 1 pound, regardless of the weight of creatures inside.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-cloud-giant-strength",
    name: `Belt of Cloud Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-dwarvenkind",
    name: `Belt of Dwarvenkind`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, you gain the following benefits:

* Your Constitution score increases by 2, to a maximum of 20.
* You have advantage on Charisma (Persuasion) checks made to interact with dwarves.

In addition, while attuned to the belt, you have a 50 percent chance each day at dawn of growing a full beard if you're capable of growing one, or a visibly thicker beard if you already have one.

If you aren't a dwarf, you gain the following additional benefits while wearing the belt:

* You have advantage on saving throws against poison, and you have resistance against poison damage.
* You have darkvision out to a range of 60 feet.
* You can speak, read, and write Dwarvish.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-fire-giant-strength",
    name: `Belt of Fire Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-frost-giant-strength",
    name: `Belt of Frost Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-hill-giant-strength",
    name: `Belt of Hill Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-stone-giant-strength",
    name: `Belt of Stone Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-belt-of-storm-giant-strength",
    name: `Belt of Storm Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength score changes to a score granted by the belt. If your Strength is already equal to or greater than the belt's score, the item has no effect on you.\\n\\nSix varieties of this belt exist, corresponding with and having rarity according to the six kinds of true giants. The _belt of stone giant strength_ and the _belt of frost giant strength_ look different, but they have the same effect.\\n\\n| Type              | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Rare      |\\n| Stone/frost giant | 23       | Very rare |\\n| Fire giant        | 25       | Very rare |\\n| Cloud giant       | 27       | Legendary |\\n| Storm giant       | 29       | Legendary |"`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-blowgun-1",
    name: `Blowgun (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-blowgun-2",
    name: `Blowgun (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-blowgun-3",
    name: `Blowgun (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-boots-of-elvenkind",
    name: `Boots of Elvenkind`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-boots-of-levitation",
    name: `Boots of Levitation`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear these boots, you can use an action to cast the _levitate_ spell on yourself at will.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-boots-of-speed",
    name: `Boots of Speed`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear these boots, you can use a bonus action and click the boots' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect.

When the boots' property has been used for a total of 10 minutes, the magic ceases to function until you finish a long rest.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-boots-of-striding-and-springing",
    name: `Boots of Striding and Springing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-boots-of-the-winterlands",
    name: `Boots of the Winterlands`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These furred boots are snug and feel quite warm. While you wear them, you gain the following benefits:

* You have resistance to cold damage.
* You ignore difficult terrain created by ice or snow.
* You can tolerate temperatures as low as -50 degrees Fahrenheit without any additional protection. If you wear heavy clothes, you can tolerate temperatures as low as -100 degrees Fahrenheit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bowl-of-commanding-water-elementals",
    name: `Bowl of Commanding Water Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While this bowl is filled with water, you can use an action to speak the bowl's command word and summon a water elemental, as if you had cast the _conjure elemental_ spell. The bowl can't be used this way again until the next dawn.

The bowl is about 1 foot in diameter and half as deep. It weighs 3 pounds and holds about 3 gallons.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bracers-of-archery",
    name: `Bracers of Archery`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing these bracers, you have proficiency with the longbow and shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-bracers-of-defense",
    name: `Bracers of Defense`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-brazier-of-commanding-fire-elementals",
    name: `Brazier of Commanding Fire Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While a fire burns in this brass brazier, you can use an action to speak the brazier's command word and summon a fire elemental, as if you had cast the _conjure elemental_ spell. The brazier can't be used this way again until the next dawn.

The brazier weighs 5 pounds.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-brooch-of-shielding",
    name: `Brooch of Shielding`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this brooch, you have resistance to force damage, and you have immunity to damage from the _magic missile_ spell.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-broom-of-flying",
    name: `Broom of Flying`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wooden broom, which weighs 3 pounds, functions like a mundane broom until you stand astride it and speak its command word. It then hovers beneath you and can be ridden in the air. It has a flying speed of 50 feet. It can carry up to 400 pounds, but its flying speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land.

You can send the broom to travel alone to a destination within 1 mile of you if you speak the command word, name the location, and are familiar with that place. The broom comes back to you when you speak another command word, provided that the broom is still within 1 mile of you.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-candle-of-invocation",
    name: `Candle of Invocation`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This slender taper is dedicated to a deity and shares that deity's alignment. The candle's alignment can be detected with the _detect evil and good_ spell. The GM chooses the god and associated alignment or determines the alignment randomly.

| d20   | Alignment       |
|-------|-----------------|
| 1-2   | Chaotic evil    |
| 3-4   | Chaotic neutral |
| 5-7   | Chaotic good    |
| 8-9   | Neutral evil    |
| 10-11 | Neutral         |
| 12-13 | Neutral good    |
| 14-15 | Lawful evil     |
| 16-17 | Lawful neutral  |
| 18-20 | Lawful good     |

The candle's magic is activated when the candle is lit, which requires an action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from the candle's total burn time.

While lit, the candle sheds dim light in a 30-foot radius. Any creature within that light whose alignment matches that of the candle makes attack rolls, saving throws, and ability checks with advantage. In addition, a cleric or druid in the light whose alignment matches the candle's can cast 1st* level spells he or she has prepared without expending spell slots, though the spell's effect is as if cast with a 1st-level slot.

Alternatively, when you light the candle for the first time, you can cast the _gate_ spell with it. Doing so destroys the candle.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cape-of-the-mountebank",
    name: `Cape of the Mountebank`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This cape smells faintly of brimstone. While wearing it, you can use it to cast the _dimension door_ spell as an action. This property of the cape can't be used again until the next dawn.

When you disappear, you leave behind a cloud of smoke, and you appear in a similar cloud of smoke at your destination. The smoke lightly obscures the space you left and the space you appear in, and it dissipates at the end of your next turn. A light or stronger wind disperses the smoke.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-carpet-of-flying",
    name: `Carpet of Flying`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You can speak the carpet's command word as an action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.

Four sizes of _carpet of flying_ exist. The GM chooses the size of a given carpet or determines it randomly.

| d100   | Size          | Capacity | Flying Speed |
|--------|---------------|----------|--------------|
| 01-20  | 3 ft. × 5 ft. | 200 lb.  | 80 feet      |
| 21-55  | 4 ft. × 6 ft. | 400 lb.  | 60 feet      |
| 56-80  | 5 ft. × 7 ft. | 600 lb.  | 40 feet      |
| 81-100 | 6 ft. × 9 ft. | 800 lb.  | 30 feet      |

A carpet can carry up to twice the weight shown on the table, but it flies at half speed if it carries more than its normal capacity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-censer-of-controlling-air-elementals",
    name: `Censer of Controlling Air Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While incense is burning in this censer, you can use an action to speak the censer's command word and summon an air elemental, as if you had cast the _conjure elemental_ spell. The censer can't be used this way again until the next dawn.

This 6-inch-wide, 1-foot-high vessel resembles a chalice with a decorated lid. It weighs 1 pound.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-chime-of-opening",
    name: `Chime of Opening`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This hollow metal tube measures about 1 foot long and weighs 1 pound. You can strike it as an action, pointing it at an object within 120 feet of you that can be opened, such as a door, lid, or lock. The chime issues a clear tone, and one lock or latch on the object opens unless the sound can't reach the object. If no locks or latches remain, the object itself opens.

The chime can be used ten times. After the tenth time, it cracks and becomes useless.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-circlet-of-blasting",
    name: `Circlet of Blasting`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this circlet, you can use an action to cast the _scorching ray_ spell with it. When you make the spell's attacks, you do so with an attack bonus of +5. The circlet can't be used this way again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-arachnida",
    name: `Cloak of Arachnida`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This fine garment is made of black silk interwoven with faint silvery threads. While wearing it, you gain the following benefits:

* You have resistance to poison damage.
* You have a climbing speed equal to your walking speed.
* You can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free.
* You can't be caught in webs of any sort and can move through webs as if they were difficult terrain.
* You can use an action to cast the _web_ spell (save DC 13). The web created by the spell fills twice its normal area. Once used, this property of the cloak can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-displacement",
    name: `Cloak of Displacement`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while you are incapacitated, restrained, or otherwise unable to move.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-elvenkind",
    name: `Cloak of Elvenkind`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you. Pulling the hood up or down requires an action.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-protection",
    name: `Cloak of Protection`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to AC and saving throws while you wear this cloak.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-the-bat",
    name: `Cloak of the Bat`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in dim light or darkness, you lose this flying speed.

While wearing the cloak in an area of dim light or darkness, you can use your action to cast _polymorph_ on yourself, transforming into a bat. While you are in the form of the bat, you retain your Intelligence, Wisdom, and Charisma scores. The cloak can't be used this way again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cloak-of-the-manta-ray",
    name: `Cloak of the Manta Ray`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this cloak with its hood up, you can breathe underwater, and you have a swimming speed of 60 feet. Pulling the hood up or down requires an action.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-club-1",
    name: `Club (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-club-2",
    name: `Club (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-club-3",
    name: `Club (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-hand-1",
    name: `Crossbow-Hand (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-hand-2",
    name: `Crossbow-Hand (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-hand-3",
    name: `Crossbow-Hand (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-heavy-1",
    name: `Crossbow-Heavy (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-heavy-2",
    name: `Crossbow-Heavy (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-heavy-3",
    name: `Crossbow-Heavy (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-light-1",
    name: `Crossbow-Light (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-light-2",
    name: `Crossbow-Light (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crossbow-light-3",
    name: `Crossbow-Light (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crystal-ball",
    name: `Crystal Ball`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crystal-ball-of-mind-reading",
    name: `Crystal Ball of Mind Reading`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.

You can use an action to cast the detect thoughts spell (save DC 17) while you are scrying with the crystal ball, targeting creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on this detect thoughts to maintain it during its duration, but it ends if scrying ends.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crystal-ball-of-telepathy",
    name: `Crystal Ball of Telepathy`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.

The following crystal ball variants are legendary items and have additional properties.

While scrying with the crystal ball, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor. You can also use an action to cast the suggestion spell (save DC 17) through the sensor on one of those creatures. You don't need to concentrate on this suggestion to maintain it during its duration, but it ends if scrying ends. Once used, the suggestion power of the crystal ball can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-crystal-ball-of-true-seeing",
    name: `Crystal Ball of True Seeing`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `The typical crystal ball, a very rare item, is about 6 inches in diameter. While touching it, you can cast the scrying spell (save DC 17) with it.

While scrying with the crystal ball, you have truesight with a radius of 120 feet centered on the spell's sensor.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cube-of-force",
    name: `Cube of Force`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This cube is about an inch across. Each face has a distinct marking on it that can be pressed. The cube starts with 36 charges, and it regains 1d20 expended charges daily at dawn.

You can use an action to press one of the cube's faces, expending a number of charges based on the chosen face, as shown in the Cube of Force Faces table. Each face has a different effect. If the cube has insufficient charges remaining, nothing happens. Otherwise, a barrier of invisible force springs into existence, forming a cube 15 feet on a side. The barrier is centered on you, moves with you, and lasts for 1 minute, until you use an action to press the cube's sixth face, or the cube runs out of charges. You can change the barrier's effect by pressing a different face of the cube and expending the requisite number of charges, resetting the duration.

If your movement causes the barrier to come into contact with a solid object that can't pass through the cube, you can't move any closer to that object as long as the barrier remains.

**Cube of Force Faces (table)**

| Face | Charges | Effect                                                                                                            |
|------|---------|-------------------------------------------------------------------------------------------------------------------|
| 1    | 1       | Gases, wind, and fog can't pass through the barrier.                                                              |
| 2    | 2       | Nonliving matter can't pass through the barrier. Walls, floors, and ceilings can pass through at your discretion. |
| 3    | 3       | Living matter can't pass through the barrier.                                                                     |
| 4    | 4       | Spell effects can't pass through the barrier.                                                                     |
| 5    | 5       | Nothing can pass through the barrier. Walls, floors, and ceilings can pass through at your discretion.            |
| 6    | 0       | The barrier deactivates.                                                                                          |

The cube loses charges when the barrier is targeted by certain spells or comes into contact with certain spell or magic item effects, as shown in the table below.

| Spell or Item    | Charges Lost |
|------------------|--------------|
| Disintegrate     | 1d12         |
| Horn of blasting | 1d10         |
| Passwall         | 1d6          |
| Prismatic spray  | 1d20         |
| Wall of fire     | 1d4          |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-cubic-gate",
    name: `Cubic Gate`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the GM.

You can use an action to press one side of the cube to cast the _gate_ spell with it, opening a portal to the plane keyed to that side. Alternatively, if you use an action to press one side twice, you can cast the _plane shift_ spell (save DC 17) with the cube and transport the targets to the plane keyed to that side.

The cube has 3 charges. Each use of the cube expends 1 charge. The cube regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dagger-1",
    name: `Dagger (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dagger-2",
    name: `Dagger (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dagger-3",
    name: `Dagger (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dagger-of-venom",
    name: `Dagger of Venom`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

You can use an action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 poison damage and become poisoned for 1 minute. The dagger can't be used this way again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dancing-sword-greatsword",
    name: `Dancing Sword (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.

While the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.

After the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet. If the sword has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or move more than 30 feet away from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dancing-sword-longsword",
    name: `Dancing Sword (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.

While the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.

After the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet. If the sword has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or move more than 30 feet away from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dancing-sword-rapier",
    name: `Dancing Sword (Rapier)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.

While the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.

After the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet. If the sword has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or move more than 30 feet away from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dancing-sword-shortsword",
    name: `Dancing Sword (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to toss this magic sword into the air and speak the command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.

While the sword hovers, you can use a bonus action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same bonus action, you can cause the sword to attack one creature within 5 feet of it.

After the hovering sword attacks for the fourth time, it flies up to 30 feet and tries to return to your hand. If you have no hand free, it falls to the ground at your feet. If the sword has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or move more than 30 feet away from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dart-1",
    name: `Dart (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dart-2",
    name: `Dart (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dart-3",
    name: `Dart (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-decanter-of-endless-water",
    name: `Decanter of Endless Water`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds.

You can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following options:

* "Stream" produces 1 gallon of water.
* "Fountain" produces 5 gallons of water.
* "Geyser" produces 30 gallons of water that gushes forth in a geyser 30 feet long and 1 foot wide. As a bonus action while holding the decanter, you can aim the geyser at a creature you can see within 30 feet of you. The target must succeed on a DC 13 Strength saving throw or take 1d4 bludgeoning damage and fall prone. Instead of a creature, you can target an object that isn't being worn or carried and that weighs no more than 200 pounds. The object is either knocked over or pushed up to 15 feet away from you.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-deck-of-illusions",
    name: `Deck of Illusions`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This box contains a set of parchment cards. A full deck has 34 cards. A deck found as treasure is usually missing 1d20 - 1 cards.

The magic of the deck functions only if cards are drawn at random (you can use an altered deck of playing cards to simulate the deck). You can use an action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of you.

An illusion of one or more creatures forms over the thrown card and remains until dispelled. An illusory creature appears real, of the appropriate size, and behaves as if it were a real creature except that it can do no harm. While you are within 120 feet of the illusory creature and can see it, you can use an action to move it magically anywhere within 30 feet of its card. Any physical interaction with the illusory creature reveals it to be an illusion, because objects pass through it. Someone who uses an action to visually inspect the creature identifies it as illusory with a successful DC 15 Intelligence (Investigation) check. The creature then appears translucent.

The illusion lasts until its card is moved or the illusion is dispelled. When the illusion ends, the image on its card disappears, and that card can't be used again.

| Playing Card      | Illusion                         |
|-------------------|----------------------------------|
| Ace of hearts     | Red dragon                       |
| King of hearts    | Knight and four guards           |
| Queen of hearts   | Succubus or incubus              |
| Jack of hearts    | Druid                            |
| Ten of hearts     | Cloud giant                      |
| Nine of hearts    | Ettin                            |
| Eight of hearts   | Bugbear                          |
| Two of hearts     | Goblin                           |
| Ace of diamonds   | Beholder                         |
| King of diamonds  | Archmage and mage apprentice     |
| Queen of diamonds | Night hag                        |
| Jack of diamonds  | Assassin                         |
| Ten of diamonds   | Fire giant                       |
| Nine of diamonds  | Ogre mage                        |
| Eight of diamonds | Gnoll                            |
| Two of diamonds   | Kobold                           |
| Ace of spades     | Lich                             |
| King of spades    | Priest and two acolytes          |
| Queen of spades   | Medusa                           |
| Jack of spades    | Veteran                          |
| Ten of spades     | Frost giant                      |
| Nine of spades    | Troll                            |
| Eight of spades   | Hobgoblin                        |
| Two of spades     | Goblin                           |
| Ace of clubs      | Iron golem                       |
| King of clubs     | Bandit captain and three bandits |
| Queen of clubs    | Erinyes                          |
| Jack of clubs     | Berserker                        |
| Ten of clubs      | Hill giant                       |
| Nine of clubs     | Ogre                             |
| Eight of clubs    | Orc                              |
| Two of clubs      | Kobold                           |
| Jokers (2)        | You (the deck's owner)           |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-deck-of-many-things",
    name: `Deck of Many Things`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75 percent) of these decks have only thirteen cards, but the rest have twenty-two.

Before you draw a card, you must declare how many cards you intend to draw and then draw them randomly (you can use an altered deck of playing cards to simulate the deck). Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number, the remaining number of cards fly from the deck on their own and take effect all at once.

Once a card is drawn, it fades from existence. Unless the card is the Fool or the Jester, the card reappears in the deck, making it possible to draw the same card twice.

| Playing Card       | Card        |
|--------------------|-------------|
| Ace of diamonds    | Vizier\\*    |
| King of diamonds   | Sun         |
| Queen of diamonds  | Moon        |
| Jack of diamonds   | Star        |
| Two of diamonds    | Comet\\*     |
| Ace of hearts      | The Fates\\* |
| King of hearts     | Throne      |
| Queen of hearts    | Key         |
| Jack of hearts     | Knight      |
| Two of hearts      | Gem\\*       |
| Ace of clubs       | Talons\\*    |
| King of clubs      | The Void    |
| Queen of clubs     | Flames      |
| Jack of clubs      | Skull       |
| Two of clubs       | Idiot\\*     |
| Ace of spades      | Donjon\\*    |
| King of spades     | Ruin        |
| Queen of spades    | Euryale     |
| Jack of spades     | Rogue       |
| Two of spades      | Balance\\*   |
| Joker (with TM)    | Fool\\*      |
| Joker (without TM) | Jester      |

\\*Found only in a deck with twenty-two cards

**_Balance_**. Your mind suffers a wrenching alteration, causing your alignment to change. Lawful becomes chaotic, good becomes evil, and vice versa. If you are true neutral or unaligned, this card has no effect on you.

**_Comet_**. If you single-handedly defeat the next hostile monster or group of monsters you encounter, you gain experience points enough to gain one level. Otherwise, this card has no effect.

**_Donjon_**. You disappear and become entombed in a state of suspended animation in an extradimensional sphere. Everything you were wearing and carrying stays behind in the space you occupied when you disappeared. You remain imprisoned until you are found and removed from the sphere. You can't be located by any divination magic, but a _wish_ spell can reveal the location of your prison. You draw no more cards.

**_Euryale_**. The card's medusa-like visage curses you. You take a -2 penalty on saving throws while cursed in this way. Only a god or the magic of The Fates card can end this curse.

**_The Fates_**. Reality's fabric unravels and spins anew, allowing you to avoid or erase one event as if it never happened. You can use the card's magic as soon as you draw the card or at any other time before you die.

**_Flames_**. A powerful devil becomes your enemy. The devil seeks your ruin and plagues your life, savoring your suffering before attempting to slay you. This enmity lasts until either you or the devil dies.

**_Fool_**. You lose 10,000 XP, discard this card, and draw from the deck again, counting both draws as one of your declared draws. If losing that much XP would cause you to lose a level, you instead lose an amount that leaves you with just enough XP to keep your level.

**_Gem_**. Twenty-five pieces of jewelry worth 2,000 gp each or fifty gems worth 1,000 gp each appear at your feet.

**_Idiot_**. Permanently reduce your Intelligence by 1d4 + 1 (to a minimum score of 1). You can draw one additional card beyond your declared draws.

**_Jester_**. You gain 10,000 XP, or you can draw two additional cards beyond your declared draws.

**_Key_**. A rare or rarer magic weapon with which you are proficient appears in your hands. The GM chooses the weapon.

**_Knight_**. You gain the service of a 4th-level fighter who appears in a space you choose within 30 feet of you. The fighter is of the same race as you and serves you loyally until death, believing the fates have drawn him or her to you. You control this character.

**_Moon_**. You are granted the ability to cast the _wish_ spell 1d3 times.

**_Rogue_**. A nonplayer character of the GM's choice becomes hostile toward you. The identity of your new enemy isn't known until the NPC or someone else reveals it. Nothing less than a _wish_ spell or divine intervention can end the NPC's hostility toward you.

**_Ruin_**. All forms of wealth that you carry or own, other than magic items, are lost to you. Portable property vanishes. Businesses, buildings, and land you own are lost in a way that alters reality the least. Any documentation that proves you should own something lost to this card also disappears.

**_Skull_**. You summon an avatar of death-a ghostly humanoid skeleton clad in a tattered black robe and carrying a spectral scythe. It appears in a space of the GM's choice within 10 feet of you and attacks you, warning all others that you must win the battle alone. The avatar fights until you die or it drops to 0 hit points, whereupon it disappears. If anyone tries to help you, the helper summons its own avatar of death. A creature slain by an avatar of death can't be restored to life.

#`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-defender-greatsword",
    name: `Defender (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon.

The first time you attack with the sword on each of your turns, you can transfer some or all of the sword's bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-defender-longsword",
    name: `Defender (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon.

The first time you attack with the sword on each of your turns, you can transfer some or all of the sword's bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-defender-rapier",
    name: `Defender (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon.

The first time you attack with the sword on each of your turns, you can transfer some or all of the sword's bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-defender-shortsword",
    name: `Defender (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon.

The first time you attack with the sword on each of your turns, you can transfer some or all of the sword's bonus to your Armor Class, instead of using the bonus on any attacks that turn. For example, you could reduce the bonus to your attack and damage rolls to +1 and gain a +2 bonus to AC. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the sword to gain a bonus to AC from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-demon-armor",
    name: `Demon Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to AC, and you can understand and speak Abyssal. In addition, the armor's clawed gauntlets turn unarmed strikes with your hands into magic weapons that deal slashing damage, with a +1 bonus to attack rolls and damage rolls and a damage die of 1d8.

**_Curse_**. Once you don this cursed armor, you can't doff it unless you are targeted by the _remove curse_ spell or similar magic. While wearing the armor, you have disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dimensional-shackles",
    name: `Dimensional Shackles`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can use an action to place these shackles on an incapacitated creature. The shackles adjust to fit a creature of Small to Large size. In addition to serving as mundane manacles, the shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don't prevent the creature from passing through an interdimensional portal.

You and any creature you designate when you use the shackles can use an action to remove them. Once every 30 days, the bound creature can make a DC 30 Strength (Athletics) check. On a success, the creature breaks free and destroys the shackles.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dragon-scale-mail",
    name: `Dragon Scale Mail`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `Dragon scale mail is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them to humanoids. Other times, hunters carefully skin and preserve the hide of a dead dragon. In either case, dragon scale mail is highly valued.

While wearing this armor, you gain a +1 bonus to AC, you have advantage on saving throws against the Frightful Presence and breath weapons of dragons, and you have resistance to one damage type that is determined by the kind of dragon that provided the scales (see the table).

Additionally, you can focus your senses as an action to magically discern the distance and direction to the closest dragon within 30 miles of you that is of the same type as the armor. This special action can't be used again until the next dawn.

| Dragon | Resistance |
|--------|------------|
| Black  | Acid       |
| Blue   | Lightning  |
| Brass  | Fire       |
| Bronze | Lightning  |
| Copper | Acid       |
| Gold   | Fire       |
| Green  | Poison     |
| Red    | Fire       |
| Silver | Cold       |
| White  | Cold       |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dragon-slayer-greatsword",
    name: `Dragon Slayer (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon's type. For the purpose of this weapon, "dragon" refers to any creature with the dragon type, including dragon turtles and wyverns.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dragon-slayer-longsword",
    name: `Dragon Slayer (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon's type. For the purpose of this weapon, "dragon" refers to any creature with the dragon type, including dragon turtles and wyverns.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dragon-slayer-rapier",
    name: `Dragon Slayer (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon's type. For the purpose of this weapon, "dragon" refers to any creature with the dragon type, including dragon turtles and wyverns.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dragon-slayer-shortsword",
    name: `Dragon Slayer (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a dragon with this weapon, the dragon takes an extra 3d6 damage of the weapon's type. For the purpose of this weapon, "dragon" refers to any creature with the dragon type, including dragon turtles and wyverns.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dust-of-disappearance",
    name: `Dust of Disappearance`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Found in a small packet, this powder resembles very fine sand. There is enough of it for one use. When you use an action to throw the dust into the air, you and each creature and object within 10 feet of you become invisible for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. If a creature affected by the dust attacks or casts a spell, the invisibility ends for that creature.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dust-of-dryness",
    name: `Dust of Dryness`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This small packet contains 1d6 + 4 pinches of dust. You can use an action to sprinkle a pinch of it over water. The dust turns a cube of water 15 feet on a side into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet's weight is negligible.

Someone can use an action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so ends that pellet's magic.

An elemental composed mostly of water that is exposed to a pinch of the dust must make a DC 13 Constitution saving throw, taking 10d6 necrotic damage on a failed save, or half as much damage on a successful one.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dust-of-sneezing-and-choking",
    name: `Dust of Sneezing and Choking`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Found in a small container, this powder resembles very fine sand. It appears to be _dust of disappearance_, and an _identify_ spell reveals it to be such. There is enough of it for one use.

When you use an action to throw a handful of the dust into the air, you and each creature that needs to breathe within 30 feet of you must succeed on a DC 15 Constitution saving throw or become unable to breathe, while sneezing uncontrollably. A creature affected in this way is incapacitated and suffocating. As long as it is conscious, a creature can repeat the saving throw at the end of each of its turns, ending the effect on it on a success. The _lesser restoration_ spell can also end the effect on a creature.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dwarven-plate",
    name: `Dwarven Plate`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you gain a +2 bonus to AC. In addition, if an effect moves you against your will along the ground, you can use your reaction to reduce the distance you are moved by up to 10 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-dwarven-thrower",
    name: `Dwarven Thrower`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. It has the thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 damage or, if the target is a giant, 2d8 damage. Immediately after the attack, the weapon flies back to your hand.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-efficient-quiver",
    name: `Efficient Quiver`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Each of the quiver's three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to sixty arrows, bolts, or similar objects. The midsize compartment holds up to eighteen javelins or similar objects. The longest compartment holds up to six long objects, such as bows, quarterstaffs, or spears.

You can draw any item the quiver contains as if doing so from a regular quiver or scabbard.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-efreeti-bottle",
    name: `Efreeti Bottle`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This painted brass bottle weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke flows out of the bottle. At the end of your turn, the smoke disappears with a flash of harmless fire, and an efreeti appears in an unoccupied space within 30 feet of you.

The first time the bottle is opened, the GM rolls to determine what happens.

| d100   | Effect                                                                                                                                                                                                                                                                                                                                                 |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01-10  | The efreeti attacks you. After fighting for 5 rounds, the efreeti disappears, and the bottle loses its magic.                                                                                                                                                                                                                                          |
| 11-90  | The efreeti serves you for 1 hour, doing as you command. Then the efreeti returns to the bottle, and a new stopper contains it. The stopper can't be removed for 24 hours. The next two times the bottle is opened, the same effect occurs. If the bottle is opened a fourth time, the efreeti escapes and disappears, and the bottle loses its magic. |
| 91-100 | The efreeti can cast the wish spell three times for you. It disappears when it grants the final wish or after 1 hour, and the bottle loses its magic.                                                                                                                                                                                                  |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-elemental-gem",
    name: `Elemental Gem`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This gem contains a mote of elemental energy. When you use an action to break the gem, an elemental is summoned as if you had cast the _conjure elemental_ spell, and the gem's magic is lost. The type of gem determines the elemental summoned by the spell.

| Gem            | Summoned Elemental |
|----------------|--------------------|
| Blue sapphire  | Air elemental      |
| Yellow diamond | Earth elemental    |
| Red corundum   | Fire elemental     |
| Emerald        | Water elemental    |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-elven-chain",
    name: `Elven Chain`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to AC while you wear this armor. You are considered proficient with this armor even if you lack proficiency with medium armor.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-eversmoking-bottle",
    name: `Eversmoking Bottle`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Smoke leaks from the lead-stoppered mouth of this brass bottle, which weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle. The cloud's area is heavily obscured. Each minute the bottle remains open and within the cloud, the radius increases by 10 feet until it reaches its maximum radius of 120 feet.

The cloud persists as long as the bottle is open. Closing the bottle requires you to speak its command word as an action. Once the bottle is closed, the cloud disperses after 10 minutes. A moderate wind (11 to 20 miles per hour) can also disperse the smoke after 1 minute, and a strong wind (21 or more miles per hour) can do so after 1 round.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-eyes-of-charming",
    name: `Eyes of Charming`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 charge as an action to cast the _charm person_ spell (save DC 13) on a humanoid within 30 feet of you, provided that you and the target can see each other. The lenses regain all expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-eyes-of-minute-seeing",
    name: `Eyes of Minute Seeing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `These crystal lenses fit over the eyes. While wearing them, you can see much better than normal out to a range of 1 foot. You have advantage on Intelligence (Investigation) checks that rely on sight while searching an area or studying an object within that range.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-eyes-of-the-eagle",
    name: `Eyes of the Eagle`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These crystal lenses fit over the eyes. While wearing them, you have advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-feather-token",
    name: `Feather Token`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This tiny object looks like a feather. Different types of feather tokens exist, each with a different single* use effect. The GM chooses the kind of token or determines it randomly.

| d100   | Feather Token |
|--------|---------------|
| 01-20  | Anchor        |
| 21-35  | Bird          |
| 36-50  | Fan           |
| 51-65  | Swan boat     |
| 66-90  | Tree          |
| 91-100  | Whip          |

**_Anchor_**. You can use an action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears.

**_Bird_**. You can use an action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a roc, but it obeys your simple commands and can't attack. It can carry up to 500 pounds while flying at its maximum speed (16 miles an hour for a maximum of 144 miles per day, with a one-hour rest for every 3 hours of flying), or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 hit points. You can dismiss the bird as an action.

**_Fan_**. If you are on a boat or ship, you can use an action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a wind strong enough to fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as an action.

**_Swan Boat_**. You can use an action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-foot-long, 20-foot* wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can use an action while on the boat to command it to move or to turn up to 90 degrees. The boat can carry up to thirty-two Medium or smaller creatures. A Large creature counts as four Medium creatures, while a Huge creature counts as nine. The boat remains for 24 hours and then disappears. You can dismiss the boat as an action.

**_Tree_**. You must be outdoors to use this token. You can use an action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**_Whip_**. You can use an action to throw the token to a point within 10 feet of you. The token disappears, and a floating whip takes its place. You can then use a bonus action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 force damage.

As a bonus action on your turn, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of it. The whip disappears after 1 hour, when you use an action to dismiss it, or when you are incapacitated or die.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-bronze-griffon",
    name: `Figurine of Wondrous Power (Bronze Griffon)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Bronze Griffon (Rare)_**. This bronze statuette is of a griffon rampant. It can become a griffon for up to 6 hours. Once it has been used, it can't be used again until 5 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-ebony-fly",
    name: `Figurine of Wondrous Power (Ebony Fly)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Ebony Fly (Rare)_**. This ebony statuette is carved in the likeness of a horsefly. It can become a giant fly for up to 12 hours and can be ridden as a mount. Once it has been used, it can’t be used again until 2 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-golden-lions",
    name: `Figurine of Wondrous Power (Golden Lions)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Golden Lions (Rare)_**. These gold statuettes of lions are always created in pairs. You can use one figurine or both simultaneously. Each can become a lion for up to 1 hour. Once a lion has been used, it can’t be used again until 7 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-ivory-goats",
    name: `Figurine of Wondrous Power (Ivory Goats)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Ivory Goats (Rare_**.These ivory statuettes of goats are always created in sets of three. Each goat looks unique and functions differently from the others. Their properties are as follows:\\n\\n* The _goat of traveling_ can become a Large goat with the same statistics as a riding horse. It has 24 charges, and each hour or portion thereof it spends in beast form costs 1 charge. While it has charges, you can use it as often as you wish. When it runs out of charges, it reverts to a figurine and can't be used again until 7 days have passed, when it regains all its charges.\\n* The _goat of travail_ becomes a giant goat for up to 3 hours. Once it has been used, it can't be used again until 30 days have passed.\\n* The _goat of terror_ becomes a giant goat for up to 3 hours. The goat can't attack, but you can remove its horns and use them as weapons. One horn becomes a _+1 lance_, and the other becomes a _+2 longsword_. Removing a horn requires an action, and the weapons disappear and the horns return when the goat reverts to figurine form. In addition, the goat radiates a 30-foot-radius aura of terror while you are riding it. Any creature hostile to you that starts its turn in the aura must succeed on a DC 15 Wisdom saving throw or be frightened of the goat for 1 minute, or until the goat reverts to figurine form. The frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Once it successfully saves against the effect, a creature is immune to the goat's aura for the next 24 hours. Once the figurine has been used, it can't be used again until 15 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-marble-elephant",
    name: `Figurine of Wondrous Power (Marble Elephant)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Marble Elephant (Rare)_**. This marble statuette is about 4 inches high and long. It can become an elephant for up to 24 hours. Once it has been used, it can’t be used again until 7 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-obsidian-steed",
    name: `Figurine of Wondrous Power (Obsidian Steed)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Obsidian Steed (Very Rare)_**. This polished obsidian horse can become a nightmare for up to 24 hours. The nightmare fights only to defend itself. Once it has been used, it can't be used again until 5 days have passed.\\n\\nIf you have a good alignment, the figurine has a 10 percent chance each time you use it to ignore your orders, including a command to revert to figurine form. If you mount the nightmare while it is ignoring your orders, you and the nightmare are instantly transported to a random location on the plane of Hades, where the nightmare reverts to figurine form.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-onyx-dog",
    name: `Figurine of Wondrous Power (Onyx Dog)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Onyx Dog (Rare)_**. This onyx statuette of a dog can become a mastiff for up to 6 hours. The mastiff has an Intelligence of 8 and can speak Common. It also has darkvision out to a range  of 60 feet and can see invisible creatures and objects within that range. Once it has been used, it can’t be used again until 7 days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-serpentine-owl",
    name: `Figurine of Wondrous Power (Serpentine Owl)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Serpentine Owl (Rare)_**. This serpentine statuette of an owl can become a giant owl for up to 8 hours. Once it has been used, it can’t be used again until 2 days have passed. The owl can telepathically communicate with you at any range if you and it are on the same plane of existence.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-figurine-of-wondrous-power-silver-raven",
    name: `Figurine of Wondrous Power (Silver Raven)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `A _figurine of wondrous power_ is a statuette of a beast small enough to fit in a pocket. If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.\\n\\nThe creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.\\n\\nThe creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.\\n\\n**_Silver Raven (Uncommon)_**. This silver statuette of a raven can become a raven for up to 12 hours. Once it has been used, it can’t be used again until 2 days have passed. While in raven form, the figurine allows you to cast the animal messenger spell on it at will.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flail-1",
    name: `Flail (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flail-2",
    name: `Flail (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flail-3",
    name: `Flail (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flame-tongue-greatsword",
    name: `Flame Tongue (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to speak this magic sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flame-tongue-longsword",
    name: `Flame Tongue (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to speak this magic sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flame-tongue-rapier",
    name: `Flame Tongue (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to speak this magic sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-flame-tongue-shortsword",
    name: `Flame Tongue (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use a bonus action to speak this magic sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and dim light for an additional 40 feet. While the sword is ablaze, it deals an extra 2d6 fire damage to any target it hits. The flames last until you use a bonus action to speak the command word again or until you drop or sheathe the sword.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-folding-boat",
    name: `Folding Boat`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring you to use an action to speak it.

One command word causes the box to unfold into a boat 10 feet long, 4 feet wide, and 2 feet deep. The boat has one pair of oars, an anchor, a mast, and a lateen sail. The boat can hold up to four Medium creatures comfortably.

The second command word causes the box to unfold into a ship 24 feet long, 8 feet wide, and 6 feet deep. The ship has a deck, rowing seats, five sets of oars, a steering oar, an anchor, a deck cabin, and a mast with a square sail. The ship can hold fifteen Medium creatures comfortably.

When the box becomes a vessel, its weight becomes that of a normal vessel its size, and anything that was stored in the box remains in the boat.

The third command word causes the _folding boat_ to fold back into a box, provided that no creatures are aboard. Any objects in the vessel that can't fit inside the box remain outside the box as it folds. Any objects in the vessel that can fit inside the box do so.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-frost-brand-greatsword",
    name: `Frost Brand (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.

In freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.

When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of you. This property can be used no more than once per hour.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-frost-brand-longsword",
    name: `Frost Brand (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.

In freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.

When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of you. This property can be used no more than once per hour.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-frost-brand-rapier",
    name: `Frost Brand (Rapier)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.

In freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.

When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of you. This property can be used no more than once per hour.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-frost-brand-shortsword",
    name: `Frost Brand (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack using this magic sword, the target takes an extra 1d6 cold damage. In addition, while you hold the sword, you have resistance to fire damage.

In freezing temperatures, the blade sheds bright light in a 10-foot radius and dim light for an additional 10 feet.

When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of you. This property can be used no more than once per hour.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-gauntlets-of-ogre-power",
    name: `Gauntlets of Ogre Power`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-gem-of-brightness",
    name: `Gem of Brightness`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This prism has 50 charges. While you are holding it, you can use an action to speak one of three command words to cause one of the following effects:

* The first command word causes the gem to shed bright light in a 30-foot radius and dim light for an additional 30 feet. This effect doesn't expend a charge. It lasts until you use a bonus action to repeat the command word or until you use another function of the gem.
* The second command word expends 1 charge and causes the gem to fire a brilliant beam of light at one creature you can see within 60 feet of you. The creature must succeed on a DC 15 Constitution saving throw or become blinded for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.
* The third command word expends 5 charges and causes the gem to flare with blinding light in a 30* foot cone originating from it. Each creature in the cone must make a saving throw as if struck by the beam created with the second command word.

When all of the gem's charges are expended, the gem becomes a nonmagical jewel worth 50 gp.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-gem-of-seeing",
    name: `Gem of Seeing`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This gem has 3 charges. As an action, you can speak the gem's command word and expend 1 charge. For the next 10 minutes, you have truesight out to 120 feet when you peer through the gem.

The gem regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-battleaxe",
    name: `Giant Slayer (Battleaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-greataxe",
    name: `Giant Slayer (Greataxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-greatsword",
    name: `Giant Slayer (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-handaxe",
    name: `Giant Slayer (Handaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-longsword",
    name: `Giant Slayer (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-rapier",
    name: `Giant Slayer (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-giant-slayer-shortsword",
    name: `Giant Slayer (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

When you hit a giant with it, the giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or fall prone. For the purpose of this weapon, "giant" refers to any creature with the giant type, including ettins and trolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-glaive-1",
    name: `Glaive (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-glaive-2",
    name: `Glaive (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-glaive-3",
    name: `Glaive (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-glamoured-studded-leather",
    name: `Glamoured Studded Leather`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you gain a +1 bonus to AC. You can also use a bonus action to speak the armor's command word and cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like, including color, style, and accessories, but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or remove the armor.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-gloves-of-missile-snaring",
    name: `Gloves of Missile Snaring`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These gloves seem to almost meld into your hands when you don them. When a ranged weapon attack hits you while you're wearing them, you can use your reaction to reduce the damage by 1d10 + your Dexterity modifier, provided that you have a free hand. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in that hand.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-gloves-of-swimming-and-climbing",
    name: `Gloves of Swimming and Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-goggles-of-night",
    name: `Goggles of Night`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greataxe-1",
    name: `Greataxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greataxe-2",
    name: `Greataxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greataxe-3",
    name: `Greataxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatclub-1",
    name: `Greatclub (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatclub-2",
    name: `Greatclub (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatclub-3",
    name: `Greatclub (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatsword-1",
    name: `Greatsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatsword-2",
    name: `Greatsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-greatsword-3",
    name: `Greatsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-halberd-1",
    name: `Halberd (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-halberd-2",
    name: `Halberd (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-halberd-3",
    name: `Halberd (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-hammer-of-thunderbolts",
    name: `Hammer of Thunderbolts`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon.

**_Giant's Bane (Requires Attunement)_**. You must be wearing a _belt of giant strength_ (any variety) and _gauntlets of ogre power_ to attune to this weapon. The attunement ends if you take off either of those items. While you are attuned to this weapon and holding it, your Strength score increases by 4 and can exceed 20, but not 30. When you roll a 20 on an attack roll made with this weapon against a giant, the giant must succeed on a DC 17 Constitution saving throw or die.

The hammer also has 5 charges. While attuned to it, you can expend 1 charge and make a ranged weapon attack with the hammer, hurling it as if it had the thrown property with a normal range of 20 feet and a long range of 60 feet. If the attack hits, the hammer unleashes a thunderclap audible out to 300 feet. The target and every creature within 30 feet of it must succeed on a DC 17 Constitution saving throw or be stunned until the end of your next turn. The hammer regains 1d4 + 1 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-handaxe-1",
    name: `Handaxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-handaxe-2",
    name: `Handaxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-handaxe-3",
    name: `Handaxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-handy-haversack",
    name: `Handy Haversack`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 20 pounds of material, not exceeding a volume of 2 cubic feet. The large central pouch can hold up to 8 cubic feet or 80 pounds of material. The backpack always weighs 5 pounds, regardless of its contents.

Placing an object in the haversack follows the normal rules for interacting with objects. Retrieving an item from the haversack requires you to use an action. When you reach into the haversack for a specific item, the item is always magically on top.

The haversack has a few limitations. If it is overloaded, or if a sharp object pierces it or tears it, the haversack ruptures and is destroyed. If the haversack is destroyed, its contents are lost forever, although an artifact always turns up again somewhere. If the haversack is turned inside out, its contents spill forth, unharmed, and the haversack must be put right before it can be used again. If a breathing creature is placed within the haversack, the creature can survive for up to 10 minutes, after which time it begins to suffocate.

Placing the haversack inside an extradimensional space created by a _bag of holding_, _portable hole_, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-hat-of-disguise",
    name: `Hat of Disguise`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this hat, you can use an action to cast the _disguise self_ spell from it at will. The spell ends if the hat is removed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-headband-of-intellect",
    name: `Headband of Intellect`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-helm-of-brilliance",
    name: `Helm of Brilliance`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This dazzling helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic.

You gain the following benefits while wearing it:

* You can use an action to cast one of the following spells (save DC 18), using one of the helm's gems of the specified type as a component: _daylight_ (opal), _fireball_ (fire opal), _prismatic spray_ (diamond), or _wall of fire_ (ruby). The gem is destroyed when the spell is cast and disappears from the helm.
* As long as it has at least one diamond, the helm emits dim light in a 30-foot radius when at least one undead is within that area. Any undead that starts its turn in that area takes 1d6 radiant damage.
* As long as the helm has at least one ruby, you have resistance to fire damage.
* As long as the helm has at least one fire opal, you can use an action and speak a command word to cause one weapon you are holding to burst into flames. The flames emit bright light in a 10-foot radius and dim light for an additional 10 feet. The flames are harmless to you and the weapon. When you hit with an attack using the blazing weapon, the target takes an extra 1d6 fire damage. The flames last until you use a bonus action to speak the command word again or until you drop or stow the weapon.

Roll a d20 if you are wearing the helm and take fire damage as a result of failing a saving throw against a spell. On a roll of 1, the helm emits beams of light from its remaining gems. Each creature within 60 feet of the helm other than you must succeed on a DC 17 Dexterity saving throw or be struck by a beam, taking radiant damage equal to the number of gems in the helm. The helm and its gems are then destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-helm-of-comprehending-languages",
    name: `Helm of Comprehending Languages`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this helm, you can use an action to cast the _comprehend languages_ spell from it at will.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-helm-of-telepathy",
    name: `Helm of Telepathy`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this helm, you can use an action to cast the _detect thoughts_ spell (save DC 13) from it. As long as you maintain concentration on the spell, you can use a bonus action to send a telepathic message to a creature you are focused on. It can reply-using a bonus action to do so-while your focus on it continues.

While focusing on a creature with _detect thoughts_, you can use an action to cast the _suggestion_ spell (save DC 13) from the helm on that creature. Once used, the _suggestion_ property can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-helm-of-teleportation",
    name: `Helm of Teleportation`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This helm has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the _teleport_ spell from it. The helm regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-holy-avenger-greatsword",
    name: `Holy Avenger (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.

While you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-holy-avenger-longsword",
    name: `Holy Avenger (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.

While you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-holy-avenger-rapier",
    name: `Holy Avenger (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.

While you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-holy-avenger-shortsword",
    name: `Holy Avenger (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a fiend or an undead with it, that creature takes an extra 2d10 radiant damage.

While you hold the drawn sword, it creates an aura in a 10-foot radius around you. You and all creatures friendly to you in the aura have advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the paladin class, the radius of the aura increases to 30 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horn-of-blasting",
    name: `Horn of Blasting`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can use an action to speak the horn's command word and then blow the horn, which emits a thunderous blast in a 30-foot cone that is audible 600 feet away. Each creature in the cone must make a DC 15 Constitution saving throw. On a failed save, a creature takes 5d6 thunder damage and is deafened for 1 minute. On a successful save, a creature takes half as much damage and isn't deafened. Creatures and objects made of glass or crystal have disadvantage on the saving throw and take 10d6 thunder damage instead of 5d6.

Each use of the horn's magic has a 20 percent chance of causing the horn to explode. The explosion deals 10d6 fire damage to the blower and destroys the horn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horn-of-valhalla-brass",
    name: `Horn of Valhalla (Brass)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed.\\n\\nFour types of _horn of Valhalla_ are known to exist, each made of a different metal. The horn's type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn's type or determines it randomly.\\n\\n| d100   | Horn Type | Berserkers Summoned | Requirement                          |\\n|--------|-----------|---------------------|--------------------------------------|\\n| 01-40  | Silver    | 2d4 + 2             | None                                 |\\n| 41-75  | Brass     | 3d4 + 3             | Proficiency with all simple weapons  |\\n| 76-90  | Bronze    | 4d4 + 4             | Proficiency with all medium armor    |\\n| 91-00  | Iron      | 5d4 + 5             | Proficiency with all martial weapons |\\n\\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you. If you meet the requirement, they are friendly to you and your companions and follow your commands.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horn-of-valhalla-bronze",
    name: `Horn of Valhalla (Bronze)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed.\\n\\nFour types of _horn of Valhalla_ are known to exist, each made of a different metal. The horn's type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn's type or determines it randomly.\\n\\n| d100   | Horn Type | Berserkers Summoned | Requirement                          |\\n|--------|-----------|---------------------|--------------------------------------|\\n| 01-40  | Silver    | 2d4 + 2             | None                                 |\\n| 41-75  | Brass     | 3d4 + 3             | Proficiency with all simple weapons  |\\n| 76-90  | Bronze    | 4d4 + 4             | Proficiency with all medium armor    |\\n| 91-00  | Iron      | 5d4 + 5             | Proficiency with all martial weapons |\\n\\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you. If you meet the requirement, they are friendly to you and your companions and follow your commands.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horn-of-valhalla-iron",
    name: `Horn of Valhalla (Iron)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed.\\n\\nFour types of _horn of Valhalla_ are known to exist, each made of a different metal. The horn's type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn's type or determines it randomly.\\n\\n| d100   | Horn Type | Berserkers Summoned | Requirement                          |\\n|--------|-----------|---------------------|--------------------------------------|\\n| 01-40  | Silver    | 2d4 + 2             | None                                 |\\n| 41-75  | Brass     | 3d4 + 3             | Proficiency with all simple weapons  |\\n| 76-90  | Bronze    | 4d4 + 4             | Proficiency with all medium armor    |\\n| 91-00  | Iron      | 5d4 + 5             | Proficiency with all martial weapons |\\n\\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you. If you meet the requirement, they are friendly to you and your companions and follow your commands.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horn-of-valhalla-silver",
    name: `Horn of Valhalla (silver)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use an action to blow this horn. In response, warrior spirits from the Valhalla appear within 60 feet of you. They use the statistics of a berserker. They return to Valhalla after 1 hour or when they drop to 0 hit points. Once you use the horn, it can't be used again until 7 days have passed.\\n\\nFour types of _horn of Valhalla_ are known to exist, each made of a different metal. The horn's type determines how many berserkers answer its summons, as well as the requirement for its use. The GM chooses the horn's type or determines it randomly.\\n\\n| d100   | Horn Type | Berserkers Summoned | Requirement                          |\\n|--------|-----------|---------------------|--------------------------------------|\\n| 01-40  | Silver    | 2d4 + 2             | None                                 |\\n| 41-75  | Brass     | 3d4 + 3             | Proficiency with all simple weapons  |\\n| 76-90  | Bronze    | 4d4 + 4             | Proficiency with all medium armor    |\\n| 91-00  | Iron      | 5d4 + 5             | Proficiency with all martial weapons |\\n\\nIf you blow the horn without meeting its requirement, the summoned berserkers attack you. If you meet the requirement, they are friendly to you and your companions and follow your commands.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horseshoes-of-a-zephyr",
    name: `Horseshoes of a Zephyr`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above the ground. This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores difficult terrain. In addition, the creature can move at normal speed for up to 12 hours a day without suffering exhaustion from a forced march.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-horseshoes-of-speed",
    name: `Horseshoes of Speed`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `These iron horseshoes come in a set of four. While all four shoes are affixed to the hooves of a horse or similar creature, they increase the creature's walking speed by 30 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-immovable-rod",
    name: `Immovable Rod`,
    category: `Rod`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can use an action to make a DC 30 Strength check, moving the fixed rod up to 10 feet on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-instant-fortress",
    name: `Instant Fortress`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can use an action to place this 1-inch metal cube on the ground and speak its command word. The cube rapidly grows into a fortress that remains until you use an action to speak the command word that dismisses it, which works only if the fortress is empty.

The fortress is a square tower, 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior is divided into two floors, with a ladder running along one wall to connect them. The ladder ends at a trapdoor leading to the roof. When activated, the tower has a small door on the side facing you. The door opens only at your command, which you can speak as a bonus action. It is immune to the _knock_ spell and similar magic, such as that of a _chime of opening_.

Each creature in the area where the fortress appears must make a DC 15 Dexterity saving throw, taking 10d10 bludgeoning damage on a failed save, or half as much damage on a successful one. In either case, the creature is pushed to an unoccupied space outside but next to the fortress. Objects in the area that aren't being worn or carried take this damage and are pushed automatically.

The tower is made of adamantine, and its magic prevents it from being tipped over. The roof, the door, and the walls each have 100 hit points, immunity to damage from nonmagical weapons excluding siege weapons, and resistance to all other damage. Only a _wish_ spell can repair the fortress (this use of the spell counts as replicating a spell of 8th level or lower). Each casting of _wish_ causes the roof, the door, or one wall to regain 50 hit points.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-absorption",
    name: `Ioun Stone (Absorption)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Fortitude (Very Rare)_**. Your Constitution score increases by 2, to a maximum of 20, while this pink rhomboid orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-agility",
    name: `Ioun Stone (Agility)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Agility (Very Rare)._** Your Dexterity score increases by 2, to a maximum of 20, while this deep red sphere orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-awareness",
    name: `Ioun Stone (Awareness)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Awareness (Rare)._** You can't be surprised while this dark blue rhomboid orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-greater-absorption",
    name: `Ioun Stone (Greater Absorption)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Greater Absorption (Legendary)._** While this marbled lavender and green ellipsoid orbits your head, you can use your reaction to cancel a spell of 8th level or lower cast by a creature you can see and targeting only you.\\n\\nOnce the stone has canceled 50 levels of spells, it burns out and turns dull gray, losing its magic. If you are targeted by a spell whose level is higher than the number of spell levels the stone has left, the stone can't cancel it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-insight",
    name: `Ioun Stone (Insight)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Insight (Very Rare)._** Your Wisdom score increases by 2, to a maximum of 20, while this incandescent blue sphere orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-intellect",
    name: `Ioun Stone (Intellect)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Intellect (Very Rare)._** Your Intelligence score increases by 2, to a maximum of 20, while this marbled scarlet and blue sphere orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-leadership",
    name: `Ioun Stone (Leadership)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Leadership (Very Rare)._** Your Charisma score increases by 2, to a maximum of 20, while this marbled pink and green sphere orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-mastery",
    name: `Ioun Stone (Mastery)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Mastery (Legendary)._** Your proficiency bonus increases by 1 while this pale green prism orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-protection",
    name: `Ioun Stone (Protection)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Protection (Rare)_**. You gain a +1 bonus to AC while this dusty rose prism orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-regeneration",
    name: `Ioun Stone (Regeneration)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Regeneration (Legendary)_**. You regain 15 hit points at the end of each hour this pearly white spindle orbits your head, provided that you have at least 1 hit point.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-reserve",
    name: `Ioun Stone (Reserve)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Reserve (Rare)._** This vibrant purple prism stores spells cast into it, holding them until you use them. The stone can store up to 3 levels worth of spells at a time. When found, it contains 1d4 - 1 levels of stored spells chosen by the GM.\\n\\nAny creature can cast a spell of 1st through 3rd level into the stone by touching it as the spell is cast. The spell has no effect, other than to be stored in the stone. If the stone can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.\\n\\nWhile this stone orbits your head, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster, but is otherwise treated as if you cast the spell. The spell cast from the stone is no longer stored in it, freeing up space.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-strength",
    name: `Ioun Stone (Strength)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Strength (Very Rare)._** Your Strength score increases by 2, to a maximum of 20, while this pale blue rhomboid orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ioun-stone-sustenance",
    name: `Ioun Stone (Sustenance)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `An Ioun stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of Ioun stone exist, each type a distinct combination of shape and color.\\n\\nWhen you use an action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet and confers a benefit to you. Thereafter, another creature must use an action to grasp or net the stone to separate it from you, either by making a successful attack roll against AC 24 or a successful DC 24 Dexterity (Acrobatics) check. You can use an action to seize and stow the stone, ending its effect.\\n\\nA stone has AC 24, 10 hit points, and resistance to all damage. It is considered to be an object that is being worn while it orbits your head.\\n\\n**_Sustenance (Rare)._** You don't need to eat or drink while this clear spindle orbits your head.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-iron-bands-of-binding",
    name: `Iron Bands of Binding`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can use an action to speak the command word and throw the sphere at a Huge or smaller creature you can see within 60 feet of you. As the sphere moves through the air, it opens into a tangle of metal bands.

Make a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your proficiency bonus. On a hit, the target is restrained until you take a bonus action to speak the command word again to release it. Doing so, or missing with the attack, causes the bands to contract and become a sphere once more.

A creature, including the one restrained, can use an action to make a DC 20 Strength check to break the iron bands. On a success, the item is destroyed, and the restrained creature is freed. If the check fails, any further attempts made by that creature automatically fail until 24 hours have elapsed.

Once the bands are used, they can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-iron-flask",
    name: `Iron Flask`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This iron bottle has a brass stopper. You can use an action to speak the flask's command word, targeting a creature that you can see within 60 feet of you. If the target is native to a plane of existence other than the one you're on, the target must succeed on a DC 17 Wisdom saving throw or be trapped in the flask. If the target has been trapped by the flask before, it has advantage on the saving throw. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn't need to breathe, eat, or drink and doesn't age.

You can use an action to remove the flask's stopper and release the creature the flask contains. The creature is friendly to you and your companions for 1 hour and obeys your commands for that duration. If you give no commands or give it a command that is likely to result in its death, it defends itself but otherwise takes no actions. At the end of the duration, the creature acts in accordance with its normal disposition and alignment.

An _identify_ spell reveals that a creature is inside the flask, but the only way to determine the type of creature is to open the flask. A newly discovered bottle might already contain a creature chosen by the GM or determined randomly.

| d100  | Contents          |
|-------|-------------------|
| 1-50  | Empty             |
| 51-54 | Demon (type 1)    |
| 55-58 | Demon (type 2)    |
| 59-62 | Demon (type 3)    |
| 63-64 | Demon (type 4)    |
| 65    | Demon (type 5)    |
| 66    | Demon (type 6)    |
| 67    | Deva              |
| 68-69 | Devil (greater)   |
| 70-73 | Devil (lesser)    |
| 74-75 | Djinni            |
| 76-77 | Efreeti           |
| 78-83 | Elemental (any)   |
| 84-86 | Invisible stalker |
| 87-90 | Night hag         |
| 91    | Planetar          |
| 92-95 | Salamander        |
| 96    | Solar             |
| 97-99 | Succubus/incubus  |
| 100   | Xorn              |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-javelin-1",
    name: `Javelin (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-javelin-2",
    name: `Javelin (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-javelin-3",
    name: `Javelin (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-javelin-of-lightning",
    name: `Javelin of Lightning`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This javelin is a magic weapon. When you hurl it and speak its command word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, and half as much damage on a successful one. The lightning bolt turns back into a javelin when it reaches the target. Make a ranged weapon attack against the target. On a hit, the target takes damage from the javelin plus 4d6 lightning damage.

The javelin's property can't be used again until the next dawn. In the meantime, the javelin can still be used as a magic weapon.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-lance-1",
    name: `Lance (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-lance-2",
    name: `Lance (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-lance-3",
    name: `Lance (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-lantern-of-revealing",
    name: `Lantern of Revealing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding bright light in a 30-foot radius and dim light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's bright light. You can use an action to lower the hood, reducing the light to dim light in a 5* foot radius.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-light-hammer-1",
    name: `Light-Hammer (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-light-hammer-2",
    name: `Light-Hammer (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-light-hammer-3",
    name: `Light-Hammer (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longbow-1",
    name: `Longbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longbow-2",
    name: `Longbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longbow-3",
    name: `Longbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longsword-1",
    name: `Longsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longsword-2",
    name: `Longsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-longsword-3",
    name: `Longsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-luck-blade-greatsword",
    name: `Luck Blade (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.

**_Luck_**. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can't be used again until the next dawn.

**_Wish_**. The sword has 1d4 - 1 charges. While holding it, you can use an action to expend 1 charge and cast the _wish_ spell from it. This property can't be used again until the next dawn. The sword loses this property if it has no charges.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-luck-blade-longsword",
    name: `Luck Blade (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.

**_Luck_**. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can't be used again until the next dawn.

**_Wish_**. The sword has 1d4 - 1 charges. While holding it, you can use an action to expend 1 charge and cast the _wish_ spell from it. This property can't be used again until the next dawn. The sword loses this property if it has no charges.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-luck-blade-rapier",
    name: `Luck Blade (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.

**_Luck_**. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can't be used again until the next dawn.

**_Wish_**. The sword has 1d4 - 1 charges. While holding it, you can use an action to expend 1 charge and cast the _wish_ spell from it. This property can't be used again until the next dawn. The sword loses this property if it has no charges.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-luck-blade-shortsword",
    name: `Luck Blade (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you also gain a +1 bonus to saving throws.

**_Luck_**. If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can't be used again until the next dawn.

**_Wish_**. The sword has 1d4 - 1 charges. While holding it, you can use an action to expend 1 charge and cast the _wish_ spell from it. This property can't be used again until the next dawn. The sword loses this property if it has no charges.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-1",
    name: `Mace (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-2",
    name: `Mace (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-3",
    name: `Mace (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-of-disruption",
    name: `Mace of Disruption`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a fiend or an undead with this magic weapon, that creature takes an extra 2d6 radiant damage. If the target has 25 hit points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature becomes frightened of you until the end of your next turn.

While you hold this weapon, it sheds bright light in a 20-foot radius and dim light for an additional 20 feet.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-of-smiting",
    name: `Mace of Smiting`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack and damage rolls made with this magic weapon. The bonus increases to +3 when you use the mace to attack a construct.

When you roll a 20 on an attack roll made with this weapon, the target takes an extra 2d6 bludgeoning damage, or 4d6 bludgeoning damage if it's a construct. If a construct has 25 hit points or fewer after taking this damage, it is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mace-of-terror",
    name: `Mace of Terror`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This magic weapon has 3 charges. While holding it, you can use an action and expend 1 charge to release a wave of terror. Each creature of your choice in a 30-foot radius extending from you must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can use the Dodge action. At the end of each of its turns, a creature can repeat the saving throw, ending the effect on itself on a success.

The mace regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mantle-of-spell-resistance",
    name: `Mantle of Spell Resistance`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have advantage on saving throws against spells while you wear this cloak.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-manual-of-bodily-health",
    name: `Manual of Bodily Health`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains health and diet tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-manual-of-gainful-exercise",
    name: `Manual of Gainful Exercise`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-manual-of-golems",
    name: `Manual of Golems`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This tome contains information and incantations necessary to make a particular type of golem. The GM chooses the type or determines it randomly. To decipher and use the manual, you must be a spellcaster with at least two 5th-level spell slots. A creature that can't use a _manual of golems_ and attempts to read it takes 6d6 psychic damage.

| d20   | Golem | Time     | Cost       |
|-------|-------|----------|------------|
| 1-5   | Clay  | 30 days  | 65,000 gp  |
| 6-17  | Flesh | 60 days  | 50,000 gp  |
| 18    | Iron  | 120 days | 100,000 gp |
| 19-20 | Stone | 90 days  | 80,000 gp  |

To create a golem, you must spend the time shown on the table, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay the specified cost to purchase supplies.

Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual are sprinkled on it. It is under your control, and it understands and obeys your spoken commands.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-manual-of-quickness-of-action",
    name: `Manual of Quickness of Action`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-marvelous-pigments",
    name: `Marvelous Pigments`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `Typically found in 1d4 pots inside a fine wooden box with a brush (weighing 1 pound in total), these pigments allow you to create three-dimensional objects by painting them in two dimensions. The paint flows from the brush to form the desired object as you concentrate on its image.

Each pot of paint is sufficient to cover 1,000 square feet of a surface, which lets you create inanimate objects or terrain features-such as a door, a pit, flowers, trees, cells, rooms, or weapons- that are up to 10,000 cubic feet. It takes 10 minutes to cover 100 square feet.

When you complete the painting, the object or terrain feature depicted becomes a real, nonmagical object. Thus, painting a door on a wall creates an actual door that can be opened to whatever is beyond. Painting a pit on a floor creates a real pit, and its depth counts against the total area of objects you create.

Nothing created by the pigments can have a value greater than 25 gp. If you paint an object of greater value (such as a diamond or a pile of gold), the object looks authentic, but close inspection reveals it is made from paste, bone, or some other worthless material.

If you paint a form of energy such as fire or lightning, the energy appears but dissipates as soon as you complete the painting, doing no harm to anything.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-maul-1",
    name: `Maul (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-maul-2",
    name: `Maul (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-maul-3",
    name: `Maul (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-medallion-of-thoughts",
    name: `Medallion of Thoughts`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `The medallion has 3 charges. While wearing it, you can use an action and expend 1 charge to cast the _detect thoughts_ spell (save DC 13) from it. The medallion regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mirror-of-life-trapping",
    name: `Mirror of Life Trapping`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When this 4-foot-tall mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, 10 hit points, and vulnerability to bludgeoning damage. It shatters and is destroyed when reduced to 0 hit points.

If the mirror is hanging on a vertical surface and you are within 5 feet of it, you can use an action to speak its command word and activate it. It remains activated until you use an action to speak the command word again.

Any creature other than you that sees its reflection in the activated mirror while within 30 feet of it must succeed on a DC 15 Charisma saving throw or be trapped, along with anything it is wearing or carrying, in one of the mirror's twelve extradimensional cells. This saving throw is made with advantage if the creature knows the mirror's nature, and constructs succeed on the saving throw automatically.

An extradimensional cell is an infinite expanse filled with thick fog that reduces visibility to 10 feet. Creatures trapped in the mirror's cells don't age, and they don't need to eat, drink, or sleep. A creature trapped within a cell can escape using magic that permits planar travel. Otherwise, the creature is confined to the cell until freed.

If the mirror traps a creature but its twelve extradimensional cells are already occupied, the mirror frees one trapped creature at random to accommodate the new prisoner. A freed creature appears in an unoccupied space within sight of the mirror but facing away from it. If the mirror is shattered, all creatures it contains are freed and appear in unoccupied spaces near it.

While within 5 feet of the mirror, you can use an action to speak the name of one creature trapped in it or call out a particular cell by number. The creature named or contained in the named cell appears as an image on the mirror's surface. You and the creature can then communicate normally.

In a similar way, you can use an action to speak a second command word and free one creature trapped in the mirror. The freed creature appears, along with its possessions, in the unoccupied space nearest to the mirror and facing away from it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-breastplate",
    name: `Mithral Armor (Breastplate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-chain-mail",
    name: `Mithral Armor (Chain-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-chain-shirt",
    name: `Mithral Armor (Chain-Shirt)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-half-plate",
    name: `Mithral Armor (Half-Plate)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-plate",
    name: `Mithral Armor (Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-ring-mail",
    name: `Mithral Armor (Ring-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-scale-mail",
    name: `Mithral Armor (Scale-Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-mithral-armor-splint",
    name: `Mithral Armor (Splint)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. A mithral chain shirt or breastplate can be worn under normal clothes. If the armor normally imposes disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-morningstar-1",
    name: `Morningstar (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-morningstar-2",
    name: `Morningstar (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-morningstar-3",
    name: `Morningstar (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-necklace-of-adaptation",
    name: `Necklace of Adaptation`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this necklace, you can breathe normally in any environment, and you have advantage on saving throws made against harmful gases and vapors (such as _cloudkill_ and _stinking cloud_ effects, inhaled poisons, and the breath weapons of some dragons).`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-necklace-of-fireballs",
    name: `Necklace of Fireballs`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This necklace has 1d6 + 3 beads hanging from it. You can use an action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a 3rd-level _fireball_ spell (save DC 15).

You can hurl multiple beads, or even the whole necklace, as one action. When you do so, increase the level of the _fireball_ by 1 for each bead beyond the first.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-necklace-of-prayer-beads",
    name: `Necklace of Prayer Beads`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many nonmagical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic.

Six types of magic beads exist. The GM decides the type of each bead on the necklace or determines it randomly. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a bonus action (using your spell save DC if a save is necessary). Once a magic bead's spell is cast, that bead can't be used again until the next dawn.

| d20   | Bead of...   | Spell                                         |
|-------|--------------|-----------------------------------------------|
| 1-6   | Blessing     | Bless                                         |
| 7-12  | Curing       | Cure wounds (2nd level) or lesser restoration |
| 13-16 | Favor        | Greater restoration                           |
| 17-18 | Smiting      | Branding smite                                |
| 19    | Summons      | Planar ally                                   |
| 20    | Wind walking | Wind walk                                     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-net-1",
    name: `Net (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-net-2",
    name: `Net (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-net-3",
    name: `Net (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-nine-lives-stealer-greatsword",
    name: `Nine Lives Stealer (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack and damage rolls made with this magic weapon.

The sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-nine-lives-stealer-longsword",
    name: `Nine Lives Stealer (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack and damage rolls made with this magic weapon.

The sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-nine-lives-stealer-rapier",
    name: `Nine Lives Stealer (Rapier)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack and damage rolls made with this magic weapon.

The sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-nine-lives-stealer-shortsword",
    name: `Nine Lives Stealer (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack and damage rolls made with this magic weapon.

The sword has 1d8 + 1 charges. If you score a critical hit against a creature that has fewer than 100 hit points, it must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body (a construct or an undead is immune). The sword loses 1 charge if the creature is slain. When the sword has no charges remaining, it loses this property.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-oathbow",
    name: `Oathbow`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you nock an arrow on this bow, it whispers in Elvish, "Swift defeat to my enemies." When you use this weapon to make a ranged attack, you can, as a command phrase, say, "Swift death to you who have wronged me." The target of your attack becomes your sworn enemy until it dies or until dawn seven days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn.

When you make a ranged attack roll with this weapon against your sworn enemy, you have advantage on the roll. In addition, your target gains no benefit from cover, other than total cover, and you suffer no disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 piercing damage.

While your sworn enemy lives, you have disadvantage on attack rolls with all other weapons.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-oil-of-etherealness",
    name: `Oil of Etherealness`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `Beads of this cloudy gray oil form on the outside of its container and quickly evaporate. The oil can cover a Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the _etherealness_ spell for 1 hour.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-oil-of-sharpness",
    name: `Oil of Sharpness`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This clear, gelatinous oil sparkles with tiny, ultrathin silver shards. The oil can coat one slashing or piercing weapon or up to 5 pieces of slashing or piercing ammunition. Applying the oil takes 1 minute. For 1 hour, the coated item is magical and has a +3 bonus to attack and damage rolls.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-oil-of-slipperiness",
    name: `Oil of Slipperiness`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This sticky black unguent is thick and heavy in the container, but it flows quickly when poured. The oil can cover a Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of a _freedom of movement_ spell for 8 hours.

Alternatively, the oil can be poured on the ground as an action, where it covers a 10-foot square, duplicating the effect of the _grease_ spell in that area for 8 hours.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-orb-of-dragonkind",
    name: `Orb of Dragonkind`,
    category: `Wondrous Item`,
    rarity: `Artifact`,
    requiresAttunement: true,
    description: `Ages past, elves and humans waged a terrible war against evil dragons. When the world seemed doomed, powerful wizards came together and worked their greatest magic, forging five _Orbs of Dragonkind_ (or _Dragon Orbs_) to help them defeat the dragons. One orb was taken to each of the five wizard towers, and there they were used to speed the war toward a victorious end. The wizards used the orbs to lure dragons to them, then destroyed the dragons with powerful magic.\\n\\nAs the wizard towers fell in later ages, the orbs were destroyed or faded into legend, and only three are thought to survive. Their magic has been warped and twisted over the centuries, so although their primary purpose of calling dragons still functions, they also allow some measure of control over dragons.\\n\\nEach orb contains the essence of an evil dragon, a presence that resents any attempt to coax magic from it. Those lacking in force of personality might find themselves enslaved to an orb.\\n\\nAn orb is an etched crystal globe about 10 inches in diameter. When used, it grows to about 20 inches in diameter, and mist swirls inside it.\\n\\nWhile attuned to an orb, you can use an action to peer into the orb's depths and speak its command word. You must then make a DC 15 Charisma check. On a successful check, you control the orb for as long as you remain attuned to it. On a failed check, you become charmed by the orb for as long as you remain attuned to it.\\n\\nWhile you are charmed by the orb, you can't voluntarily end your attunement to it, and the orb casts _suggestion_ on you at will (save DC 18), urging you to work toward the evil ends it desires. The dragon essence within the orb might want many things: the annihilation of a particular people, freedom from the orb, to spread suffering in the world, to advance the worship of Tiamat, or something else the GM decides.\\n\\n**_Random Properties_**. An _Orb of Dragonkind_ has the following random properties:\\n\\n* 2 minor beneficial properties\\n* 1 minor detrimental property\\n* 1 major detrimental property\\n\\n**_Spells_**. The orb has 7 charges and regains 1d4 + 3 expended charges daily at dawn. If you control the orb, you can use an action and expend 1 or more charges to cast one of the following spells (save DC 18) from it: _cure wounds_ (5th-level version, 3 charges), _daylight_ (1 charge), _death ward_ (2 charges), or _scrying_ (3 charges).\\n\\nYou can also use an action to cast the _detect magic_ spell from the orb without using any charges.\\n\\n**_Call Dragons_**. While you control the orb, you can use an action to cause the artifact to issue a telepathic call that extends in all directions for 40 miles. Evil dragons in range feel compelled to come to the orb as soon as possible by the most direct route. Dragon deities such as Tiamat are unaffected by this call. Dragons drawn to the orb might be hostile toward you for compelling them against their will. Once you have used this property, it can't be used again for 1 hour.\\n\\n**_Destroying an Orb_**. An _Orb of Dragonkind_ appears fragile but is impervious to most damage, including the attacks and breath weapons of dragons. A _disintegrate_ spell or one good hit from a +3 magic weapon is sufficient to destroy an orb, however.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pearl-of-power",
    name: `Pearl of Power`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you use the pearl, it can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-periapt-of-health",
    name: `Periapt of Health`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed you while you wear the pendant.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-periapt-of-proof-against-poison",
    name: `Periapt of Proof against Poison`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, poisons have no effect on you. You are immune to the poisoned condition and have immunity to poison damage.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-periapt-of-wound-closure",
    name: `Periapt of Wound Closure`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain hit points, double the number of hit points it restores.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-philter-of-love",
    name: `Philter of Love`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `The next time you see a creature within 10 minutes after drinking this philter, you become charmed by that creature for 1 hour. If the creature is of a species and gender you are normally attracted to, you regard it as your true love while you are charmed. This potion's rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pike-1",
    name: `Pike (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pike-2",
    name: `Pike (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pike-3",
    name: `Pike (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pipes-of-haunting",
    name: `Pipes of Haunting`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You must be proficient with wind instruments to use these pipes. They have 3 charges. You can use an action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature within 30 feet of you that hears you play must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. If you wish, all creatures in the area that aren't hostile toward you automatically succeed on the saving throw. A creature that fails the saving throw can repeat it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its saving throw is immune to the effect of these pipes for 24 hours. The pipes regain 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-pipes-of-the-sewers",
    name: `Pipes of the Sewers`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `You must be proficient with wind instruments to use these pipes. While you are attuned to the pipes, ordinary rats and giant rats are indifferent toward you and will not attack you unless you threaten or harm them.

The pipes have 3 charges. If you play the pipes as an action, you can use a bonus action to expend 1 to 3 charges, calling forth one swarm of rats with each expended charge, provided that enough rats are within half a mile of you to be called in this fashion (as determined by the GM). If there aren't enough rats to form a swarm, the charge is wasted. Called swarms move toward the music by the shortest available route but aren't under your control otherwise. The pipes regain 1d3 expended charges daily at dawn.

Whenever a swarm of rats that isn't under another creature's control comes within 30 feet of you while you are playing the pipes, you can make a Charisma check contested by the swarm's Wisdom check. If you lose the contest, the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours. If you win the contest, the swarm is swayed by the pipes' music and becomes friendly to you and your companions for as long as you continue to play the pipes each round as an action. A friendly swarm obeys your commands. If you issue no commands to a friendly swarm, it defends itself but otherwise takes no actions. If a friendly swarm starts its turn and can't hear the pipes' music, your control over that swarm ends, and the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-plate-armor-of-etherealness",
    name: `Plate Armor of Etherealness`,
    category: `Armor`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While you're wearing this armor, you can speak its command word as an action to gain the effect of the _etherealness_ spell, which last for 10 minutes or until you remove the armor or use an action to speak the command word again. This property of the armor can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-portable-hole",
    name: `Portable Hole`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.

You can use an action to unfold a _portable hole_ and place it on or against a solid surface, whereupon the _portable hole_ creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane, so it can't be used to create open passages. Any creature inside an open _portable hole_ can exit the hole by climbing out of it.

You can use an action to close a _portable hole_ by taking hold of the edges of the cloth and folding it up. Folding the cloth closes the hole, and any creatures or objects within remain in the extradimensional space. No matter what's in it, the hole weighs next to nothing.

If the hole is folded up, a creature within the hole's extradimensional space can use an action to make a DC 10 Strength check. On a successful check, the creature forces its way out and appears within 5 feet of the _portable hole_ or the creature carrying it. A breathing creature within a closed _portable hole_ can survive for up to 10 minutes, after which time it begins to suffocate.

Placing a _portable hole_ inside an extradimensional space created by a _bag of holding_, _handy haversack_, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-animal-friendship",
    name: `Potion of Animal Friendship`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you can cast the _animal friendship_ spell (save DC 13) for 1 hour at will. Agitating this muddy liquid brings little bits into view: a fish scale, a hummingbird tongue, a cat claw, or a squirrel hair.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-clairvoyance",
    name: `Potion of Clairvoyance`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the _clairvoyance_ spell. An eyeball bobs in this yellowish liquid but vanishes when the potion is opened.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-climbing",
    name: `Potion of Climbing`,
    category: `Potion`,
    rarity: `Common`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain a climbing speed equal to your walking speed for 1 hour. During this time, you have advantage on Strength (Athletics) checks you make to climb. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-cloud-giant-strength",
    name: `Potion of Cloud Giant Strength`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-diminution",
    name: `Potion of Diminution`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the "reduce" effect of the _enlarge/reduce_ spell for 1d4 hours (no concentration required). The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-fire-giant-strength",
    name: `Potion of Fire Giant Strength`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-flying",
    name: `Potion of Flying`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-frost-giant-strength",
    name: `Potion of Frost Giant Strength`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-gaseous-form",
    name: `Potion of Gaseous Form`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the _gaseous form_ spell for 1 hour (no concentration required) or until you end the effect as a bonus action. This potion's container seems to hold fog that moves and pours like water.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-greater-healing",
    name: `Potion of Greater Healing`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You regain hit points when you drink this potion. The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. Whatever its potency, the potion's red liquid glimmers when agitated.\\n\\n**Potions of Healing (table)**\\n\\n| Potion of ...    | Rarity    | HP Regained |\\n|------------------|-----------|-------------|\\n| Healing          | Common    | 2d4 + 2     |\\n| Greater healing  | Uncommon  | 4d4 + 4     |\\n| Superior healing | Rare      | 8d4 + 8     |\\n| Supreme healing  | Very rare | 10d4 + 20   |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-growth",
    name: `Potion of Growth`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the "enlarge" effect of the _enlarge/reduce_ spell for 1d4 hours (no concentration required). The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-healing",
    name: `Potion of Healing`,
    category: `Potion`,
    rarity: `Common`,
    requiresAttunement: false,
    description: `You regain hit points when you drink this potion. The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. Whatever its potency, the potion's red liquid glimmers when agitated.\\n\\n**Potions of Healing (table)**\\n\\n| Potion of ...    | Rarity    | HP Regained |\\n|------------------|-----------|-------------|\\n| Healing          | Common    | 2d4 + 2     |\\n| Greater healing  | Uncommon  | 4d4 + 4     |\\n| Superior healing | Rare      | 8d4 + 8     |\\n| Supreme healing  | Very rare | 10d4 + 20   |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-heroism",
    name: `Potion of Heroism`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `For 1 hour after drinking it, you gain 10 temporary hit points that last for 1 hour. For the same duration, you are under the effect of the _bless_ spell (no concentration required). This blue potion bubbles and steams as if boiling.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-hill-giant-strength",
    name: `Potion of Hill Giant Strength`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-invisibility",
    name: `Potion of Invisibility`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This potion's container looks empty but feels as though it holds liquid. When you drink it, you become invisible for 1 hour. Anything you wear or carry is invisible with you. The effect ends early if you attack or cast a spell.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-mind-reading",
    name: `Potion of Mind Reading`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the _detect thoughts_ spell (save DC 13). The potion's dense, purple liquid has an ovoid cloud of pink floating in it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-poison",
    name: `Potion of Poison`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This concoction looks, smells, and tastes like a _potion of healing_ or other beneficial potion. However, it is actually poison masked by illusion magic. An _identify_ spell reveals its true nature.

If you drink it, you take 3d6 poison damage, and you must succeed on a DC 13 Constitution saving throw or be poisoned. At the start of each of your turns while you are poisoned in this way, you take 3d6 poison damage. At the end of each of your turns, you can repeat the saving throw. On a successful save, the poison damage you take on your subsequent turns decreases by 1d6. The poison ends when the damage decreases to 0.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-resistance",
    name: `Potion of Resistance`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain resistance to one type of damage for 1 hour. The GM chooses the type or determines it randomly from the options below.

| d10 | Damage Type |
|-----|-------------|
| 1   | Acid        |
| 2   | Cold        |
| 3   | Fire        |
| 4   | Force       |
| 5   | Lightning   |
| 6   | Necrotic    |
| 7   | Poison      |
| 8   | Psychic     |
| 9   | Radiant     |
| 10  | Thunder     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-speed",
    name: `Potion of Speed`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the _haste_ spell for 1 minute (no concentration required). The potion's yellow fluid is streaked with black and swirls on its own.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-stone-giant-strength",
    name: `Potion of Stone Giant Strength`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-storm-giant-strength",
    name: `Potion of Storm Giant Strength`,
    category: `Potion`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.\\n\\nThis potion's transparent liquid has floating in it a sliver of fingernail from a giant of the appropriate type. The _potion of frost giant strength_ and the _potion of stone giant strength_ have the same effect.\\n\\n| Type of Giant     | Strength | Rarity    |\\n|-------------------|----------|-----------|\\n| Hill giant        | 21       | Uncommon  |\\n| Frost/stone giant | 23       | Rare      |\\n| Fire giant        | 25       | Rare      |\\n| Cloud giant       | 27       | Very rare |\\n| Storm giant       | 29       | Legendary |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-superior-healing",
    name: `Potion of Superior Healing`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You regain hit points when you drink this potion. The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. Whatever its potency, the potion's red liquid glimmers when agitated.\\n\\n**Potions of Healing (table)**\\n\\n| Potion of ...    | Rarity    | HP Regained |\\n|------------------|-----------|-------------|\\n| Healing          | Common    | 2d4 + 2     |\\n| Greater healing  | Uncommon  | 4d4 + 4     |\\n| Superior healing | Rare      | 8d4 + 8     |\\n| Supreme healing  | Very rare | 10d4 + 20   |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-supreme-healing",
    name: `Potion of Supreme Healing`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You regain hit points when you drink this potion. The number of hit points depends on the potion's rarity, as shown in the Potions of Healing table. Whatever its potency, the potion's red liquid glimmers when agitated.\\n\\n**Potions of Healing (table)**\\n\\n| Potion of ...    | Rarity    | HP Regained |\\n|------------------|-----------|-------------|\\n| Healing          | Common    | 2d4 + 2     |\\n| Greater healing  | Uncommon  | 4d4 + 4     |\\n| Superior healing | Rare      | 8d4 + 8     |\\n| Supreme healing  | Very rare | 10d4 + 20   |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-potion-of-water-breathing",
    name: `Potion of Water Breathing`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You can breathe underwater for 1 hour after drinking this potion. Its cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-quarterstaff-1",
    name: `Quarterstaff (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-quarterstaff-2",
    name: `Quarterstaff (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-quarterstaff-3",
    name: `Quarterstaff (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rapier-1",
    name: `Rapier (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rapier-2",
    name: `Rapier (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rapier-3",
    name: `Rapier (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-restorative-ointment",
    name: `Restorative Ointment`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This glass jar, 3 inches in diameter, contains 1d4 + 1 doses of a thick mixture that smells faintly of aloe. The jar and its contents weigh 1/2 pound.

As an action, one dose of the ointment can be swallowed or applied to the skin. The creature that receives it regains 2d8 + 2 hit points, ceases to be poisoned, and is cured of any disease.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-animal-influence",
    name: `Ring of Animal Influence`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 of its charges to cast one of the following spells:

* _Animal friendship_ (save DC 13)
* _Fear_ (save DC 13), targeting only beasts that have an Intelligence of 3 or lower
* _Speak with animals_`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-djinni-summoning",
    name: `Ring of Djinni Summoning`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you can speak its command word as an action to summon a particular djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of you. It remains as long as you concentrate (as if concentrating on a spell), to a maximum of 1 hour, or until it drops to 0 hit points. It then returns to its home plane.

While summoned, the djinni is friendly to you and your companions. It obeys any commands you give it, no matter what language you use. If you fail to command it, the djinni defends itself against attackers but takes no other actions.

After the djinni departs, it can't be summoned again for 24 hours, and the ring becomes nonmagical if the djinni dies.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-elemental-command",
    name: `Ring of Elemental Command`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This ring is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane.

While wearing this ring, you have advantage on attack rolls against elementals from the linked plane, and they have disadvantage on attack rolls against you. In addition, you have access to properties based on the linked plane.

The ring has 5 charges. It regains 1d4 + 1 expended charges daily at dawn. Spells cast from the ring have a save DC of 17.

**_Ring of Air Elemental Command_**. You can expend 2 of the ring's charges to cast _dominate monster_ on an air elemental. In addition, when you fall, you descend 60 feet per round and take no damage from falling. You can also speak and understand Auran.

If you help slay an air elemental while attuned to the ring, you gain access to the following additional properties:

* You have resistance to lightning damage.
* You have a flying speed equal to your walking speed and can hover.
* You can cast the following spells from the ring, expending the necessary number of charges: _chain lightning_ (3 charges), _gust of wind_ (2 charges), or _wind wall_ (1 charge).

**_Ring of Earth Elemental Command_**. You can expend 2 of the ring's charges to cast _dominate monster_ on an earth elemental. In addition, you can move in difficult terrain that is composed of rubble, rocks, or dirt as if it were normal terrain. You can also speak and understand Terran.

If you help slay an earth elemental while attuned to the ring, you gain access to the following additional properties:

* You have resistance to acid damage.
* You can move through solid earth or rock as if those areas were difficult terrain. If you end your turn there, you are shunted out to the nearest unoccupied space you last occupied.
* You can cast the following spells from the ring, expending the necessary number of charges: _stone shape_ (2 charges), _stoneskin_ (3 charges), or _wall of stone_ (3 charges).

**_Ring of Fire Elemental Command_**. You can expend 2 of the ring's charges to cast _dominate monster_ on a fire elemental. In addition, you have resistance to fire damage. You can also speak and understand Ignan.

If you help slay a fire elemental while attuned to the ring, you gain access to the following additional properties:

* You are immune to fire damage.
* You can cast the following spells from the ring, expending the necessary number of charges: _burning hands_ (1 charge), _fireball_ (2 charges), and _wall of fire_ (3 charges).

**_Ring of Water Elemental Command_**. You can expend 2 of the ring's charges to cast _dominate monster_ on a water elemental. In addition, you can stand on and walk across liquid surfaces as if they were solid ground. You can also speak and understand Aquan.

If you help slay a water elemental while attuned to the ring, you gain access to the following additional properties:

* You can breathe underwater and have a swimming speed equal to your walking speed.
* You can cast the following spells from the ring, expending the necessary number of charges: _create or destroy water_ (1 charge), _control water_ (3 charges), _ice storm_ (2 charges), or _wall of ice_ (3 charges).`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-evasion",
    name: `Ring of Evasion`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can use your reaction to expend 1 of its charges to succeed on that saving throw instead.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-feather-falling",
    name: `Ring of Feather Falling`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-free-action",
    name: `Ring of Free Action`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear this ring, difficult terrain doesn't cost you extra movement. In addition, magic can neither reduce your speed nor cause you to be paralyzed or restrained.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-invisibility",
    name: `Ring of Invisibility`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you can turn invisible as an action. Anything you are wearing or carrying is invisible with you. You remain invisible until the ring is removed, until you attack or cast a spell, or until you use a bonus action to become visible again.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-jumping",
    name: `Ring of Jumping`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this ring, you can cast the _jump_ spell from it as a bonus action at will, but can target only yourself when you do so.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-mind-shielding",
    name: `Ring of Mind Shielding`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it.

You can use an action to cause the ring to become invisible until you use another action to make it visible, until you remove the ring, or until you die.

If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can't prevent this telepathic communication.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-protection",
    name: `Ring of Protection`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to AC and saving throws while wearing this ring.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-regeneration",
    name: `Ring of Regeneration`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you regain 1d6 hit points every 10 minutes, provided that you have at least 1 hit point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 hit point the whole time.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-resistance",
    name: `Ring of Resistance`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have resistance to one damage type while wearing this ring. The gem in the ring indicates the type, which the GM chooses or determines randomly.

| d10 | Damage Type | Gem        |
|-----|-------------|------------|
| 1   | Acid        | Pearl      |
| 2   | Cold        | Tourmaline |
| 3   | Fire        | Garnet     |
| 4   | Force       | Sapphire   |
| 5   | Lightning   | Citrine    |
| 6   | Necrotic    | Jet        |
| 7   | Poison      | Amethyst   |
| 8   | Psychic     | Jade       |
| 9   | Radiant     | Topaz      |
| 10  | Thunder     | Spinel     |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-shooting-stars",
    name: `Ring of Shooting Stars`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this ring in dim light or darkness, you can cast _dancing lights_ and _light_ from the ring at will. Casting either spell from the ring requires an action.

The ring has 6 charges for the following other properties. The ring regains 1d6 expended charges daily at dawn.

**_Faerie Fire_**. You can expend 1 charge as an action to cast _faerie fire_ from the ring.

**_Ball Lightning_**. You can expend 2 charges as an action to create one to four 3-foot-diameter spheres of lightning. The more spheres you create, the less powerful each sphere is individually.

Each sphere appears in an unoccupied space you can see within 120 feet of you. The spheres last as long as you concentrate (as if concentrating on a spell), up to 1 minute. Each sphere sheds dim light in a 30-foot radius.

As a bonus action, you can move each sphere up to 30 feet, but no farther than 120 feet away from you. When a creature other than you comes within 5 feet of a sphere, the sphere discharges lightning at that creature and disappears. That creature must make a DC 15 Dexterity saving throw. On a failed save, the creature takes lightning damage based on the number of spheres you created.

| Spheres | Lightning Damage |
|---------|------------------|
| 4       | 2d4              |
| 3       | 2d6              |
| 2       | 5d4              |
| 1       | 4d12             |

**_Shooting Stars_**. You can expend 1 to 3 charges as an action. For every charge you expend, you launch a glowing mote of light from the ring at a point you can see within 60 feet of you. Each creature within a 15-foot cube originating from that point is showered in sparks and must make a DC 15 Dexterity saving throw, taking 5d4 fire damage on a failed save, or half as much damage on a successful one.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-spell-storing",
    name: `Ring of Spell Storing`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 - 1 levels of stored spells chosen by the GM.

Any creature can cast a spell of 1st through 5th level into the ring by touching the ring as the spell is cast. The spell has no effect, other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.

While wearing this ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster, but is otherwise treated as if you cast the spell. The spell cast from the ring is no longer stored in it, freeing up space.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-spell-turning",
    name: `Ring of Spell Turning`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you have advantage on saving throws against any spell that targets only you (not in an area of effect). In addition, if you roll a 20 for the save and the spell is 7th level or lower, the spell has no effect on you and instead targets the caster, using the slot level, spell save DC, attack bonus, and spellcasting ability of the caster.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-swimming",
    name: `Ring of Swimming`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a swimming speed of 40 feet while wearing this ring.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-telekinesis",
    name: `Ring of Telekinesis`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you can cast the _telekinesis_ spell at will, but you can target only objects that aren't being worn or carried.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-the-ram",
    name: `Ring of the Ram`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can use an action to expend 1 to 3 of its charges to attack one creature you can see within 60 feet of you. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 force damage and is pushed 5 feet away from you.

Alternatively, you can expend 1 to 3 of the ring's charges as an action to try to break an object you can see within 60 feet of you that isn't being worn or carried. The ring makes a Strength check with a +5 bonus for each charge you spend.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-three-wishes",
    name: `Ring of Three Wishes`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `While wearing this ring, you can use an action to expend 1 of its 3 charges to cast the _wish_ spell from it. The ring becomes nonmagical when you use the last charge.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-warmth",
    name: `Ring of Warmth`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this ring, you have resistance to cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as -50 degrees Fahrenheit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-water-walking",
    name: `Ring of Water Walking`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-ring-of-x-ray-vision",
    name: `Ring of X-ray Vision`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you can use an action to speak its command word. When you do so, you can see into and through solid matter for 1 minute. This vision has a radius of 30 feet. To you, solid objects within that radius appear transparent and don't prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances block the vision, as does a thin sheet of lead.

Whenever you use the ring again before taking a long rest, you must succeed on a DC 15 Constitution saving throw or gain one level of exhaustion.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-robe-of-eyes",
    name: `Robe of Eyes`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits:

* The robe lets you see in all directions, and you have advantage on Wisdom (Perception) checks that rely on sight.
* You have darkvision out to a range of 120 feet.
* You can see invisible creatures and objects, as well as see into the Ethereal Plane, out to a range of 120 feet.

The eyes on the robe can't be closed or averted. Although you can close or avert your own eyes, you are never considered to be doing so while wearing this robe.

A _light_ spell cast on the robe or a _daylight_ spell cast within 5 feet of the robe causes you to be blinded for 1 minute. At the end of each of your turns, you can make a Constitution saving throw (DC 11 for _light_ or DC 15 for _daylight_), ending the blindness on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-robe-of-scintillating-colors",
    name: `Robe of Scintillating Colors`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can use an action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds bright light in a 30-foot radius and dim light for an additional 30 feet. Creatures that can see you have disadvantage on attack rolls against you. In addition, any creature in the bright light that can see you when the robe's power is activated must succeed on a DC 15 Wisdom saving throw or become stunned until the effect ends.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-robe-of-stars",
    name: `Robe of Stars`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This black or dark blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it.

Six stars, located on the robe's upper front portion, are particularly large. While wearing this robe, you can use an action to pull off one of the stars and use it to cast _magic missile_ as a 5th-level spell. Daily at dusk, 1d6 removed stars reappear on the robe.

While you wear the robe, you can use an action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you use an action to return to the plane you were on. You reappear in the last space you occupied, or if that space is occupied, the nearest unoccupied space.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-robe-of-the-archmagi",
    name: `Robe of the Archmagi`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This elegant garment is made from exquisite cloth of white, gray, or black and adorned with silvery runes. The robe's color corresponds to the alignment for which the item was created. A white robe was made for good, gray for neutral, and black for evil. You can't attune to a _robe of the archmagi_ that doesn't correspond to your alignment.

You gain these benefits while wearing the robe:

* If you aren't wearing armor, your base Armor Class is 15 + your Dexterity modifier.
* You have advantage on saving throws against spells and other magical effects.
* Your spell save DC and spell attack bonus each increase by 2.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-robe-of-useful-items",
    name: `Robe of Useful Items`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can use an action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.

The robe has two of each of the following patches:

* Dagger
* Bullseye lantern (filled and lit)
* Steel mirror
* 10-foot pole
* Hempen rope (50 feet, coiled)
* Sack

In addition, the robe has 4d4 other patches. The GM chooses the patches or determines them randomly.

| d100   | Patch                                                                                                                                                                                             |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01-08  | Bag of 100 gp                                                                                                                                                                                     |
| 09-15  | Silver coffer (1 foot long, 6 inches wide and deep) worth 500 gp                                                                                                                                  |
| 16-22  | Iron door (up to 10 feet wide and 10 feet high, barred on one side of your choice), which you can place in an opening you can reach; it conforms to fit the opening, attaching and hinging itself |
| 23-30  | 10 gems worth 100 gp each                                                                                                                                                                         |
| 31-44  | Wooden ladder (24 feet long) |
| 45-51 | A riding horse with saddle bags                                                                                                                                |
| 52-59  | Pit (a cube 10 feet on a side), which you can place on the ground within 10 feet of you                                                                                                           |
| 60-68  | 4 potions of healing                                                                                                                                                                              |
| 69-75  | Rowboat (12 feet long)                                                                                                                                                                            |
| 76-83  | Spell scroll containing one spell of 1st to 3rd level                                                                                                                                             |
| 84-90  | 2 mastiffs                                                                                                                                                                                        |
| 91-96  | Window (2 feet by 4 feet, up to 2 feet deep), which you can place on a vertical surface you can reach                                                                                             |
| 97-100 | Portable ram                                                                                                                                                                                      |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rod-of-absorption",
    name: `Rod of Absorption`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this rod, you can use your reaction to absorb a spell that is targeting only you and not with an area of effect. The absorbed spell's effect is canceled, and the spell's energy-not the spell itself-is stored in the rod. The energy has the same level as the spell when it was cast. The rod can absorb and store up to 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can't absorb more. If you are targeted by a spell that the rod can't store, the rod has no effect on that spell.

When you become attuned to the rod, you know how many levels of energy the rod has absorbed over the course of its existence, and how many levels of spell energy it currently has stored.

If you are a spellcaster holding the rod, you can convert energy stored in it into spell slots to cast spells you have prepared or know. You can create spell slots only of a level equal to or lower than your own spell slots, up to a maximum of 5th level. You use the stored levels in place of your slots, but otherwise cast the spell as normal. For example, you can use 3 levels stored in the rod as a 3rd-level spell slot.

A newly found rod has 1d10 levels of spell energy stored in it already. A rod that can no longer absorb spell energy and has no energy remaining becomes nonmagical.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rod-of-alertness",
    name: `Rod of Alertness`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This rod has a flanged head and the following properties.

**_Alertness_**. While holding the rod, you have advantage on Wisdom (Perception) checks and on rolls for initiative.

**_Spells_**. While holding the rod, you can use an action to cast one of the following spells from it: _detect evil and good_, _detect magic_, _detect poison and disease_, or _see invisibility._

**_Protective Aura_**. As an action, you can plant the haft end of the rod in the ground, whereupon the rod's head sheds bright light in a 60-foot radius and dim light for an additional 60 feet. While in that bright light, you and any creature that is friendly to you gain a +1 bonus to AC and saving throws and can sense the location of any invisible hostile creature that is also in the bright light.

The rod's head stops glowing and the effect ends after 10 minutes, or when a creature uses an action to pull the rod from the ground. This property can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rod-of-lordly-might",
    name: `Rod of Lordly Might`,
    category: `Rod`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This rod has a flanged head, and it functions as a magic mace that grants a +3 bonus to attack and damage rolls made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below.

**_Six Buttons_**. You can press one of the rod's six buttons as a bonus action. A button's effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form.

If you press **button 1**, the rod becomes a _flame tongue_, as a fiery blade sprouts from the end opposite the rod's flanged head.

If you press **button 2**, the rod's flanged head folds down and two crescent-shaped blades spring out, transforming the rod into a magic battleaxe that grants a +3 bonus to attack and damage rolls made with it.

If you press **button 3**, the rod's flanged head folds down, a spear point springs from the rod's tip, and the rod's handle lengthens into a 6-foot haft, transforming the rod into a magic spear that grants a +3 bonus to attack and damage rolls made with it.

If you press **button 4**, the rod transforms into a climbing pole up to 50 feet long, as you specify. In surfaces as hard as granite, a spike at the bottom and three hooks at the top anchor the pole. Horizontal bars 3 inches long fold out from the sides, 1 foot apart, forming a ladder. The pole can bear up to 4,000 pounds. More weight or lack of solid anchoring causes the rod to revert to its normal form.

If you press **button 5**, the rod transforms into a handheld battering ram and grants its user a +10 bonus to Strength checks made to break through doors, barricades, and other barriers.

If you press **button 6**, the rod assumes or remains in its normal form and indicates magnetic north. (Nothing happens if this function of the rod is used in a location that has no magnetic north.) The rod also gives you knowledge of your approximate depth beneath the ground or your height above it.

**_Drain Life_**. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failure, the target takes an extra 4d6 necrotic damage, and you regain a number of hit points equal to half that necrotic damage. This property can't be used again until the next dawn.

**_Paralyze_**. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Strength saving throw. On a failure, the target is paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success. This property can't be used again until the next dawn.

**_Terrify_**. While holding the rod, you can use an action to force each creature you can see within 30 feet of you to make a DC 17 Wisdom saving throw. On a failure, a target is frightened of you for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. This property can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rod-of-rulership",
    name: `Rod of Rulership`,
    category: `Rod`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can use an action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of you. Each target must succeed on a DC 15 Wisdom saving throw or be charmed by you for 8 hours. While charmed in this way, the creature regards you as its trusted leader. If harmed by you or your companions, or commanded to do something contrary to its nature, a target ceases to be charmed in this way. The rod can't be used again until the next dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rod-of-security",
    name: `Rod of Security`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While holding this rod, you can use an action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a paradise that exists in an extraplanar space. You choose the form that the paradise takes. It could be a tranquil garden, lovely glade, cheery tavern, immense palace, tropical island, fantastic carnival, or whatever else you can imagine. Regardless of its nature, the paradise contains enough water and food to sustain its visitors. Everything else that can be interacted with inside the extraplanar space can exist only there. For example, a flower picked from a garden in the paradise disappears if it is taken outside the extraplanar space.

For each hour spent in the paradise, a visitor regains hit points as if it had spent 1 Hit Die. Also, creatures don't age while in the paradise, although time passes normally. Visitors can remain in the paradise for up to 200 days divided by the number of creatures present (round down).

When the time runs out or you use an action to end it, all visitors reappear in the location they occupied when you activated the rod, or an unoccupied space nearest that location. The rod can't be used again until ten days have passed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rope-of-climbing",
    name: `Rope of Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination you choose. That end moves 10 feet on your turn when you first command it and 10 feet on each of your turns until reaching its destination, up to its maximum length away, or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying.

If you tell the rope to knot, large knots appear at 1* foot intervals along the rope. While knotted, the rope shortens to a 50-foot length and grants advantage on checks made to climb it.

The rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-rope-of-entanglement",
    name: `Rope of Entanglement`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This rope is 30 feet long and weighs 3 pounds. If you hold one end of the rope and use an action to speak its command word, the other end darts forward to entangle a creature you can see within 20 feet of you. The target must succeed on a DC 15 Dexterity saving throw or become restrained.

You can release the creature by using a bonus action to speak a second command word. A target restrained by the rope can use an action to make a DC 15 Strength or Dexterity check (target's choice). On a success, the creature is no longer restrained by the rope.

The rope has AC 20 and 20 hit points. It regains 1 hit point every 5 minutes as long as it has at least 1 hit point. If the rope drops to 0 hit points, it is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-scarab-of-protection",
    name: `Scarab of Protection`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `If you hold this beetle-shaped medallion in your hand for 1 round, an inscription appears on its surface revealing its magical nature. It provides two benefits while it is on your person:

* You have advantage on saving throws against spells.
* The scarab has 12 charges. If you fail a saving throw against a necromancy spell or a harmful effect originating from an undead creature, you can use your reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-scimitar-1",
    name: `Scimitar (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-scimitar-2",
    name: `Scimitar (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-scimitar-3",
    name: `Scimitar (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-scimitar-of-speed",
    name: `Scimitar of Speed`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make one attack with it as a bonus action on each of your turns.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shield-of-missile-attraction",
    name: `Shield of Missile Attraction`,
    category: `Shield`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this shield, you have resistance to damage from ranged weapon attacks.

**_Curse_**. This shield is cursed. Attuning to it curses you until you are targeted by the _remove curse_ spell or similar magic. Removing the shield fails to end the curse on you. Whenever a ranged weapon attack is made against a target within 10 feet of you, the curse causes you to become the target instead.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortbow-1",
    name: `Shortbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortbow-2",
    name: `Shortbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortbow-3",
    name: `Shortbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortsword-1",
    name: `Shortsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortsword-2",
    name: `Shortsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-shortsword-3",
    name: `Shortsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sickle-1",
    name: `Sickle (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sickle-2",
    name: `Sickle (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sickle-3",
    name: `Sickle (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sling-1",
    name: `Sling (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sling-2",
    name: `Sling (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sling-3",
    name: `Sling (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-slippers-of-spider-climbing",
    name: `Slippers of Spider Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear these light shoes, you can move up, down, and across vertical surfaces and upside down along ceilings, while leaving your hands free. You have a climbing speed equal to your walking speed. However, the slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sovereign-glue",
    name: `Sovereign Glue`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with _oil of slipperiness._ When found, a container contains 1d6 + 1 ounces.

One ounce of the glue can cover a 1-foot square surface. The glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of _universal solvent_ or _oil of etherealness_, or with a _wish_ spell.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spear-1",
    name: `Spear (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spear-2",
    name: `Spear (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spear-3",
    name: `Spear (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-1st-level",
    name: `Spell Scroll (1st Level)`,
    category: `Scroll`,
    rarity: `Common`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-2nd-level",
    name: `Spell Scroll (2nd Level)`,
    category: `Scroll`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-3rd-level",
    name: `Spell Scroll (3rd Level)`,
    category: `Scroll`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-4th-level",
    name: `Spell Scroll (4th Level)`,
    category: `Scroll`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-5th-level",
    name: `Spell Scroll (5th Level)`,
    category: `Scroll`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-6th-level",
    name: `Spell Scroll (6th Level)`,
    category: `Scroll`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-7th-level",
    name: `Spell Scroll (7th Level)`,
    category: `Scroll`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-8th-level",
    name: `Spell Scroll (8th Level)`,
    category: `Scroll`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-9th-level",
    name: `Spell Scroll (9th Level)`,
    category: `Scroll`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spell-scroll-cantrip",
    name: `Spell Scroll (Cantrip)`,
    category: `Scroll`,
    rarity: `Common`,
    requiresAttunement: false,
    description: `A _spell scroll_ bears the words of a single spell, written in a mystical cipher. If the spell is on your class's spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell's components. Otherwise, the scroll is unintelligible.\\n\\nIf the spell is on your class's spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell's level. On a failed check, the spell disappears from the scroll with no other effect. Once the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.\\n\\nThe level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the Spell Scroll table.\\n\\n**Spell Scroll (table)**\\n\\n| Spell Level | Rarity    | Save DC | Attack Bonus |\\n|-------------|-----------|---------|--------------|\\n| Cantrip     | Common    | 13      | +5           |\\n| 1st         | Common    | 13      | +5           |\\n| 2nd         | Uncommon  | 13      | +5           |\\n| 3rd         | Uncommon  | 15      | +7           |\\n| 4th         | Rare      | 15      | +7           |\\n| 5th         | Rare      | 17      | +9           |\\n| 6th         | Very rare | 17      | +9           |\\n| 7th         | Very rare | 18      | +10          |\\n| 8th         | Very rare | 18      | +10          |\\n| 9th         | Legendary | 19      | +11          |\\n\\nA wizard spell on a _spell scroll_ can be copied just as spells in spellbooks can be copied. When a spell is copied from a the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 + the spell's level. If the check succeeds, the spell is successfully copied. Whether the check succeeds or fails, the _spell scroll_ is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-spellguard-shield",
    name: `Spellguard Shield`,
    category: `Shield`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this shield, you have advantage on saving throws against spells and other magical effects, and spell attacks have disadvantage against you.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sphere-of-annihilation",
    name: `Sphere of Annihilation`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it.

The sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an artifact is susceptible to damage from a _sphere of annihilation_, it passes through the sphere unscathed. Anything else that touches the sphere but isn't wholly engulfed and obliterated by it takes 4d10 force damage.

The sphere is stationary until someone controls it. If you are within 60 feet of an uncontrolled sphere, you can use an action to make a DC 25 Intelligence (Arcana) check. On a success, the sphere levitates in one direction of your choice, up to a number of feet equal to 5 × your Intelligence modifier (minimum 5 feet). On a failure, the sphere moves 10 feet toward you. A creature whose space the sphere enters must succeed on a DC 13 Dexterity saving throw or be touched by it, taking 4d10 force damage.

If you attempt to control a sphere that is under another creature's control, you make an Intelligence (Arcana) check contested by the other creature's Intelligence (Arcana) check. The winner of the contest gains control of the sphere and can levitate it as normal.

If the sphere comes into contact with a planar portal, such as that created by the _gate_ spell, or an extradimensional space, such as that within a _portable hole_, the GM determines randomly what happens, using the following table.

| d100   | Result                                                                                                                             |
|--------|------------------------------------------------------------------------------------------------------------------------------------|
| 01-50  | The sphere is destroyed.                                                                                                           |
| 51-85  | The sphere moves through the portal or into the extradimensional space.                                                            |
| 86-00  | A spatial rift sends each creature and object within 180 feet of the sphere, including the sphere, to a random plane of existence. |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-charming",
    name: `Staff of Charming`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this staff, you can use an action to expend 1 of its 10 charges to cast _charm person_, _command_, _or comprehend languages_ from it using your spell save DC. The staff can also be used as a magic quarterstaff.

If you are holding the staff and fail a saving throw against an enchantment spell that targets only you, you can turn your failed save into a successful one. You can't use this property of the staff again until the next dawn. If you succeed on a save against an enchantment spell that targets only you, with or without the staff's intervention, you can use your reaction to expend 1 charge from the staff and turn the spell back on its caster as if you had cast the spell.

The staff regains 1d8 + 2 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a nonmagical quarterstaff.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-fire",
    name: `Staff of Fire`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You have resistance to fire damage while you hold this staff.

The staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: _burning hands_ (1 charge), _fireball_ (3 charges), or _wall of fire_ (4 charges).

The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff blackens, crumbles into cinders, and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-frost",
    name: `Staff of Frost`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You have resistance to cold damage while you hold this staff.

The staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC: _cone of cold_ (5 charges), _fog cloud_ (1 charge), _ice storm_ (4 charges), or _wall of ice_ (4 charges).

The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff turns to water and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-healing",
    name: `Staff of Healing`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 10 charges. While holding it, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC and spellcasting ability modifier: _cure wounds_ (1 charge per spell level, up to 4th), _lesser restoration_ (2 charges), or _mass cure wounds_ (5 charges).

The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff vanishes in a flash of light, lost forever.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-power",
    name: `Staff of Power`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls.

The staff has 20 charges for the following properties. The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff retains its +2 bonus to attack and damage rolls but loses all other properties. On a 20, the staff regains 1d8 + 2 charges.

**_Power Strike_**. When you hit with a melee attack using the staff, you can expend 1 charge to deal an extra 1d6 force damage to the target.

**_Spells_**. While holding this staff, you can use an action to expend 1 or more of its charges to cast one of the following spells from it, using your spell save DC and spell attack bonus: _cone of cold_ (5 charges), _fireball_ (5th-level version, 5 charges), _globe of invulnerability_ (6 charges), _hold monster_ (5 charges), _levitate_ (2 charges), _lightning bolt_ (5th-level version, 5 charges), _magic missile_ (1 charge), _ray of enfeeblement_ (1 charge), or _wall of force_ (5 charges).

**_Retributive Strike_**. You can use an action to break the staff over your knee or against a solid surface, performing a retributive strike. The staff is destroyed and releases its remaining magic in an explosion that expands to fill a 30-foot-radius sphere centered on it.

You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take force damage equal to 16 × the number of charges in the staff. Every other creature in the area must make a DC 17 Dexterity saving throw. On a failed save, a creature takes an amount of damage based on how far away it is from the point of origin, as shown in the following table. On a successful save, a creature takes half as much damage.

| Distance from Origin  | Damage                                 |
|-----------------------|----------------------------------------|
| 10 ft. away or closer | 8 × the number of charges in the staff |
| 11 to 20 ft. away     | 6 × the number of charges in the staff |
| 21 to 30 ft. away     | 4 × the number of charges in the staff |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-striking",
    name: `Staff of Striking`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic quarterstaff that grants a +3 bonus to attack and damage rolls made with it.

The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 of its charges. For each charge you expend, the target takes an extra 1d6 force damage. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff becomes a nonmagical quarterstaff.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-swarming-insects",
    name: `Staff of Swarming Insects`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff has 10 charges and regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses.

**_Spells_**. While holding the staff, you can use an action to expend some of its charges to cast one of the following spells from it, using your spell save DC: _giant insect_ (4 charges) or _insect plague_ (5 charges).

**_Insect Cloud_**. While holding the staff, you can use an action and expend 1 charge to cause a swarm of harmless flying insects to spread out in a 30-foot radius from you. The insects remain for 10 minutes, making the area heavily obscured for creatures other than you. The swarm moves with you, remaining centered on you. A wind of at least 10 miles per hour disperses the swarm and ends the effect.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-the-magi",
    name: `Staff of the Magi`,
    category: `Staff`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls.

The staff has 50 charges for the following properties. It regains 4d6 + 2 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 20, the staff regains 1d12 + 1 charges.

**_Spell Absorption_**. While holding the staff, you have advantage on saving throws against spells. In addition, you can use your reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell's level. However, if doing so brings the staff's total number of charges above 50, the staff explodes as if you activated its retributive strike (see below).

**_Spells_**. While holding the staff, you can use an action to expend some of its charges to cast one of the following spells from it, using your spell save DC and spellcasting ability: _conjure elemental_ (7 charges), _dispel magic_ (3 charges), _fireball_ (7th-level version, 7 charges), _flaming sphere_ (2 charges), _ice storm_ (4 charges), _invisibility_ (2 charges), _knock_ (2 charges), _lightning bolt_ (7th-level version, 7 charges), _passwall_ (5 charges), _plane shift_ (7 charges), _telekinesis_ (5 charges), _wall of fire_ (4 charges), or _web_ (2 charges).

You can also use an action to cast one of the following spells from the staff without using any charges: _arcane lock_, _detect magic_, _enlarge/reduce_, _light_, _mage hand_, or _protection from evil and good._

**_Retributive Strike_**. You can use an action to break the staff over your knee or against a solid surface, performing a retributive strike. The staff is destroyed and releases its remaining magic in an explosion that expands to fill a 30-foot-radius sphere centered on it.

You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take force damage equal to 16 × the number of charges in the staff. Every other creature in the area must make a DC 17 Dexterity saving throw. On a failed save, a creature takes an amount of damage based on how far away it is from the point of origin, as shown in the following table. On a successful save, a creature takes half as much damage.

| Distance from Origin  | Damage                                 |
|-----------------------|----------------------------------------|
| 10 ft. away or closer | 8 × the number of charges in the staff |
| 11 to 20 ft. away     | 6 × the number of charges in the staff |
| 21 to 30 ft. away     | 4 × the number of charges in the staff |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-the-python",
    name: `Staff of the Python`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can use an action to speak this staff's command word and throw the staff on the ground within 10 feet of you. The staff becomes a giant constrictor snake under your control and acts on its own initiative count. By using a bonus action to speak the command word again, you return the staff to its normal form in a space formerly occupied by the snake.

On your turn, you can mentally command the snake if it is within 60 feet of you and you aren't incapacitated. You decide what action the snake takes and where it moves during its next turn, or you can issue it a general command, such as to attack your enemies or guard a location.

If the snake is reduced to 0 hit points, it dies and reverts to its staff form. The staff then shatters and is destroyed. If the snake reverts to staff form before losing all its hit points, it regains all of them.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-the-woodlands",
    name: `Staff of the Woodlands`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls.

The staff has 10 charges for the following properties. It regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the staff loses its properties and becomes a nonmagical quarterstaff.

**_Spells_**. You can use an action to expend 1 or more of the staff's charges to cast one of the following spells from it, using your spell save DC: _animal friendship_ (1 charge), _awaken_ (5 charges), _barkskin_ (2 charges), _locate animals or plants_ (2 charges), _speak with animals_ (1 charge), _speak with plants_ (3 charges), or _wall of thorns_ (6 charges).

You can also use an action to cast the _pass without trace_ spell from the staff without using any charges. **_Tree Form_**. You can use an action to plant one end of the staff in fertile earth and expend 1 charge to transform the staff into a healthy tree. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

The tree appears ordinary but radiates a faint aura of transmutation magic if targeted by _detect magic_. While touching the tree and using another action to speak its command word, you return the staff to its normal form. Any creature in the tree falls when it reverts to a staff.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-thunder-and-lightning",
    name: `Staff of Thunder and Lightning`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic quarterstaff that grants a +2 bonus to attack and damage rolls made with it. It also has the following additional properties. When one of these properties is used, it can't be used again until the next dawn.

**_Lightning_**. When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 lightning damage.

**_Thunder_**. When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder, audible out to 300 feet. The target you hit must succeed on a DC 17 Constitution saving throw or become stunned until the end of your next turn.

**_Lightning Strike_**. You can use an action to cause a bolt of lightning to leap from the staff's tip in a line that is 5 feet wide and 120 feet long. Each creature in that line must make a DC 17 Dexterity saving throw, taking 9d6 lightning damage on a failed save, or half as much damage on a successful one.

**_Thunderclap_**. You can use an action to cause the staff to issue a deafening thunderclap, audible out to 600 feet. Each creature within 60 feet of you (not including you) must make a DC 17 Constitution saving throw. On a failed save, a creature takes 2d6 thunder damage and becomes deafened for 1 minute. On a successful save, a creature takes half damage and isn't deafened.

**_Thunder and Lightning_**. You can use an action to use the Lightning Strike and Thunderclap properties at the same time. Doing so doesn't expend the daily use of those properties, only the use of this one.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-staff-of-withering",
    name: `Staff of Withering`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 3 charges and regains 1d3 expended charges daily at dawn.

The staff can be wielded as a magic quarterstaff. On a hit, it deals damage as a normal quarterstaff, and you can expend 1 charge to deal an extra 2d10 necrotic damage to the target. In addition, the target must succeed on a DC 15 Constitution saving throw or have disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-stone-of-controlling-earth-elementals",
    name: `Stone of Controlling Earth Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `If the stone is touching the ground, you can use an action to speak its command word and summon an earth elemental, as if you had cast the _conjure elemental_ spell. The stone can't be used this way again until the next dawn. The stone weighs 5 pounds.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-stone-of-good-luck-luckstone",
    name: `Stone of Good Luck (Luckstone)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sun-blade",
    name: `Sun Blade`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This item appears to be a longsword hilt. While grasping the hilt, you can use a bonus action to cause a blade of pure radiance to spring into existence, or make the blade disappear. While the blade exists, this magic longsword has the finesse property. If you are proficient with shortswords or longswords, you are proficient with the _sun blade_.

You gain a +2 bonus to attack and damage rolls made with this weapon, which deals radiant damage instead of slashing damage. When you hit an undead with it, that target takes an extra 1d8 radiant damage.

The sword's luminous blade emits bright light in a 15-foot radius and dim light for an additional 15 feet. The light is sunlight. While the blade persists, you can use an action to expand or reduce its radius of bright and dim light by 5 feet each, to a maximum of 30 feet each or a minimum of 10 feet each.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-life-stealing-greatsword",
    name: `Sword of Life Stealing (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 necrotic damage, provided that the target isn't a construct or an undead. You gain temporary hit points equal to the extra damage dealt.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-life-stealing-longsword",
    name: `Sword of Life Stealing (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 necrotic damage, provided that the target isn't a construct or an undead. You gain temporary hit points equal to the extra damage dealt.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-life-stealing-rapier",
    name: `Sword of Life Stealing (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 necrotic damage, provided that the target isn't a construct or an undead. You gain temporary hit points equal to the extra damage dealt.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-life-stealing-shortsword",
    name: `Sword of Life Stealing (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the attack roll, that target takes an extra 3d6 necrotic damage, provided that the target isn't a construct or an undead. You gain temporary hit points equal to the extra damage dealt.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-sharpness-greatsword",
    name: `Sword of Sharpness (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target's limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.

In addition, you can speak the sword's command word to cause the blade to shed bright light in a 10* foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-sharpness-longsword",
    name: `Sword of Sharpness (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target's limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.

In addition, you can speak the sword's command word to cause the blade to shed bright light in a 10* foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-sharpness-scimitar",
    name: `Sword of Sharpness (Scimitar)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target's limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.

In addition, you can speak the sword's command word to cause the blade to shed bright light in a 10* foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-sharpness-shortsword",
    name: `Sword of Sharpness (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the attack roll, that target takes an extra 4d6 slashing damage. Then roll another d20. If you roll a 20, you lop off one of the target's limbs, with the effect of such loss determined by the GM. If the creature has no limb to sever, you lop off a portion of its body instead.

In addition, you can speak the sword's command word to cause the blade to shed bright light in a 10* foot radius and dim light for an additional 10 feet. Speaking the command word again or sheathing the sword puts out the light.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-wounding-greatsword",
    name: `Sword of Wounding (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Hit points lost to this weapon's damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.

Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature's turns, it takes 1d4 necrotic damage for each time you've wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-wounding-longsword",
    name: `Sword of Wounding (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Hit points lost to this weapon's damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.

Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature's turns, it takes 1d4 necrotic damage for each time you've wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-wounding-rapier",
    name: `Sword of Wounding (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Hit points lost to this weapon's damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.

Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature's turns, it takes 1d4 necrotic damage for each time you've wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-sword-of-wounding-shortsword",
    name: `Sword of Wounding (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Hit points lost to this weapon's damage can be regained only through a short or long rest, rather than by regeneration, magic, or any other means.

Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. At the start of each of the wounded creature's turns, it takes 1d4 necrotic damage for each time you've wounded it, and it can then make a DC 15 Constitution saving throw, ending the effect of all such wounds on itself on a success. Alternatively, the wounded creature, or a creature within 5 feet of it, can use an action to make a DC 15 Wisdom (Medicine) check, ending the effect of such wounds on it on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-talisman-of-pure-good",
    name: `Talisman of Pure Good`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This talisman is a mighty symbol of goodness. A creature that is neither good nor evil in alignment takes 6d6 radiant damage upon touching the talisman. An evil creature takes 8d6 radiant damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman.

If you are a good cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it.

The talisman has 7 charges. If you are wearing or holding it, you can use an action to expend 1 charge from it and choose one creature you can see on the ground within 120 feet of you. If the target is of evil alignment, a flaming fissure opens under it. The target must succeed on a DC 20 Dexterity saving throw or fall into the fissure and be destroyed, leaving no remains. The fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman disperses into motes of golden light and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-talisman-of-the-sphere",
    name: `Talisman of the Sphere`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `When you make an Intelligence (Arcana) check to control a _sphere of annihilation_ while you are holding this talisman, you double your proficiency bonus on the check. In addition, when you start your turn with control over a _sphere of annihilation_, you can use an action to levitate it 10 feet plus a number of additional feet equal to 10 × your Intelligence modifier.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-talisman-of-ultimate-evil",
    name: `Talisman of Ultimate Evil`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This item symbolizes unrepentant evil. A creature that is neither good nor evil in alignment takes 6d6 necrotic damage upon touching the talisman. A good creature takes 8d6 necrotic damage upon touching the talisman. Either sort of creature takes the damage again each time it ends its turn holding or carrying the talisman.

If you are an evil cleric or paladin, you can use the talisman as a holy symbol, and you gain a +2 bonus to spell attack rolls while you wear or hold it.

The talisman has 6 charges. If you are wearing or holding it, you can use an action to expend 1 charge from the talisman and choose one creature you can see on the ground within 120 feet of you. If the target is of good alignment, a flaming fissure opens under it. The target must succeed on a DC 20 Dexterity saving throw or fall into the fissure and be destroyed, leaving no remains. The fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman dissolves into foul-smelling slime and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-tome-of-clear-thought",
    name: `Tome of Clear Thought`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Intelligence score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-tome-of-leadership-and-influence",
    name: `Tome of Leadership and Influence`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Charisma score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-tome-of-understanding",
    name: `Tome of Understanding`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Wisdom score increases by 2, as does your maximum for that score. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-trident-1",
    name: `Trident (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-trident-2",
    name: `Trident (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-trident-3",
    name: `Trident (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-trident-of-fish-command",
    name: `Trident of Fish Command`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `This trident is a magic weapon. It has 3 charges. While you carry it, you can use an action and expend 1 charge to cast _dominate beast_ (save DC 15) from it on a beast that has an innate swimming speed. The trident regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-universal-solvent",
    name: `Universal Solvent`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This tube holds milky liquid with a strong alcohol smell. You can use an action to pour the contents of the tube onto a surface within reach. The liquid instantly dissolves up to 1 square foot of adhesive it touches, including _sovereign glue._`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-battleaxe",
    name: `Vicious Weapon (Battleaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-blowgun",
    name: `Vicious Weapon (Blowgun)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-club",
    name: `Vicious Weapon (Club)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-crossbow-hand",
    name: `Vicious Weapon (Crossbow-Hand)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-crossbow-heavy",
    name: `Vicious Weapon (Crossbow-Heavy)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-crossbow-light",
    name: `Vicious Weapon (Crossbow-Light)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-dagger",
    name: `Vicious Weapon (Dagger)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-dart",
    name: `Vicious Weapon (Dart)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-flail",
    name: `Vicious Weapon (Flail)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-glaive",
    name: `Vicious Weapon (Glaive)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-greataxe",
    name: `Vicious Weapon (Greataxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-greatclub",
    name: `Vicious Weapon (Greatclub)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-greatsword",
    name: `Vicious Weapon (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-halberd",
    name: `Vicious Weapon (Halberd)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-handaxe",
    name: `Vicious Weapon (Handaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-javelin",
    name: `Vicious Weapon (Javelin)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-lance",
    name: `Vicious Weapon (Lance)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-light-hammer",
    name: `Vicious Weapon (Light-Hammer)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-longbow",
    name: `Vicious Weapon (Longbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-longsword",
    name: `Vicious Weapon (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-mace",
    name: `Vicious Weapon (Mace)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-maul",
    name: `Vicious Weapon (Maul)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-morningstar",
    name: `Vicious Weapon (Morningstar)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-net",
    name: `Vicious Weapon (Net)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-pike",
    name: `Vicious Weapon (Pike)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-quarterstaff",
    name: `Vicious Weapon (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-rapier",
    name: `Vicious Weapon (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-scimitar",
    name: `Vicious Weapon (Scimitar)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-shortbow",
    name: `Vicious Weapon (Shortbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-shortsword",
    name: `Vicious Weapon (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-sickle",
    name: `Vicious Weapon (Sickle)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-sling",
    name: `Vicious Weapon (Sling)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-spear",
    name: `Vicious Weapon (Spear)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-trident",
    name: `Vicious Weapon (Trident)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-war-pick",
    name: `Vicious Weapon (War-Pick)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-warhammer",
    name: `Vicious Weapon (Warhammer)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vicious-weapon-whip",
    name: `Vicious Weapon (Whip)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 2d6 damage of the weapon's type.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vorpal-sword-greatsword",
    name: `Vorpal Sword (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.

When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn't have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vorpal-sword-longsword",
    name: `Vorpal Sword (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.

When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn't have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vorpal-sword-scimitar",
    name: `Vorpal Sword (Scimitar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.

When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn't have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-vorpal-sword-shortsword",
    name: `Vorpal Sword (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores resistance to slashing damage.

When you attack a creature that has at least one head with this weapon and roll a 20 on the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it is immune to slashing damage, doesn't have or need a head, has legendary actions, or the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 6d8 slashing damage from the hit.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-binding",
    name: `Wand of Binding`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.

**_Spells_**. While holding the wand, you can use an action to expend some of its charges to cast one of the following spells (save DC 17): _hold monster_ (5 charges) or _hold person_ (2 charges).

**_Assisted Escape_**. While holding the wand, you can use your reaction to expend 1 charge and gain advantage on a saving throw you make to avoid being paralyzed or restrained, or you can expend 1 charge and gain advantage on any check you make to escape a grapple.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-enemy-detection",
    name: `Wand of Enemy Detection`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action and expend 1 charge to speak its command word. For the next minute, you know the direction of the nearest creature hostile to you within 60 feet, but not its distance from you. The wand can sense the presence of hostile creatures that are ethereal, invisible, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-fear",
    name: `Wand of Fear`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges for the following properties. It regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.

**_Command_**. While holding the wand, you can use an action to expend 1 charge and command another creature to flee or grovel, as with the _command_ spell (save DC 15).

**_Cone of Fear_**. While holding the wand, you can use an action to expend 2 charges, causing the wand's tip to emit a 60-foot cone of amber light. Each creature in the cone must succeed on a DC 15 Wisdom saving throw or become frightened of you for 1 minute. While it is frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can use the Dodge action. At the end of each of its turns, a creature can repeat the saving throw, ending the effect on itself on a success.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-fireballs",
    name: `Wand of Fireballs`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the _fireball_ spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-lightning-bolts",
    name: `Wand of Lightning Bolts`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the _lightning bolt_ spell (save DC 15) from it. For 1 charge, you cast the 3rd-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-magic-detection",
    name: `Wand of Magic Detection`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wand has 3 charges. While holding it, you can expend 1 charge as an action to cast the _detect magic_ spell from it. The wand regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-magic-missiles",
    name: `Wand of Magic Missiles`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the _magic missile_ spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-paralysis",
    name: `Wand of Paralysis`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of you. The target must succeed on a DC 15 Constitution saving throw or be paralyzed for 1 minute. At the end of each of the target's turns, it can repeat the saving throw, ending the effect on itself on a success.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-polymorph",
    name: `Wand of Polymorph`,
    category: `Wand`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the _polymorph_ spell (save DC 15) from it.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-secrets",
    name: `Wand of Secrets`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `The wand has 3 charges. While holding it, you can use an action to expend 1 of its charges, and if a secret door or trap is within 30 feet of you, the wand pulses and points at the one nearest to you. The wand regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-the-war-mage-1",
    name: `Wand of the War Mage (+1)`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity. In addition, you ignore half cover when making a spell attack.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-the-war-mage-2",
    name: `Wand of the War Mage (+2)`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity. In addition, you ignore half cover when making a spell attack.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-the-war-mage-3",
    name: `Wand of the War Mage (+3)`,
    category: `Wand`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity. In addition, you ignore half cover when making a spell attack.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-web",
    name: `Wand of Web`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the _web_ spell (save DC 15) from it.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wand-of-wonder",
    name: `Wand of Wonder`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges and choose a target within 120 feet of you. The target can be a creature, an object, or a point in space. Roll d100 and consult the following table to discover what happens.

If the effect causes you to cast a spell from the wand, the spell's save DC is 15. If the spell normally has a range expressed in feet, its range becomes 120 feet if it isn't already.

If an effect covers an area, you must center the spell on and include the target. If an effect has multiple possible subjects, the GM randomly determines which ones are affected.

The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into dust and is destroyed.

| d100   | Effect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01-05  | You cast slow. 06-10 You cast faerie fire.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 11-15  | You are stunned until the start of your next turn, believing something awesome just happened. 16-20 You cast gust of wind.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 21-25  | You cast detect thoughts on the target you chose. If you didn't target a creature, you instead take 1d6 psychic damage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 26-30  | You cast stinking cloud.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 31-33  | Heavy rain falls in a 60-foot radius centered on the target. The area becomes lightly obscured. The rain falls until the start of your next turn.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 34-36  | An animal appears in the unoccupied space nearest the target. The animal isn't under your control and acts as it normally would. Roll a d100 to determine which animal appears. On a 01-25, a rhinoceros appears; on a 26-50, an elephant appears; and on a 51-100, a rat appears.                                                                                                                                                                                                                                                                                                                       |
| 37-46  | You cast lightning bolt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 47-49  | A cloud of 600 oversized butterflies fills a 30-foot radius centered on the target. The area becomes heavily obscured. The butterflies remain for 10 minutes.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 50-53  | You enlarge the target as if you had cast enlarge/reduce. If the target can't be affected by that spell, or if you didn't target a creature, you become the target.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 54-58  | You cast darkness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 59-62  | Grass grows on the ground in a 60-foot radius centered on the target. If grass is already there, it grows to ten times its normal size and remains overgrown for 1 minute.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 63-65  | An object of the GM's choice disappears into the Ethereal Plane. The object must be neither worn nor carried, within 120 feet of the target, and no larger than 10 feet in any dimension.                                                                                                                                                                                                                                                                                                                                                                                                                |
| 66-69  | You shrink yourself as if you had cast enlarge/reduce on yourself.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 70-79  | You cast fireball.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 80-84  | You cast invisibility on yourself.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 85-87  | Leaves grow from the target. If you chose a point in space as the target, leaves sprout from the creature nearest to that point. Unless they are picked off, the leaves turn brown and fall off after 24 hours.                                                                                                                                                                                                                                                                                                                                                                                          |
| 88-90  | A stream of 1d4 × 10 gems, each worth 1 gp, shoots from the wand's tip in a line 30 feet long and 5 feet wide. Each gem deals 1 bludgeoning damage, and the total damage of the gems is divided equally among all creatures in the line.                                                                                                                                                                                                                                                                                                                                                                 |
| 91-95  | A burst of colorful shimmering light extends from you in a 30-foot radius. You and each creature in the area that can see must succeed on a DC 15 Constitution saving throw or become blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.                                                                                                                                                                                                                                                                            |
| 96-97  | The target's skin turns bright blue for 1d10 days. If you chose a point in space, the creature nearest to that point is affected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 98-100 | If you targeted a creature, it must make a DC 15 Constitution saving throw. If you didn't target a creature, you become the target and must make the saving throw. If the saving throw fails by 5 or more, the target is instantly petrified. On any other failed save, the target is restrained and begins to turn to stone. While restrained in this way, the target must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the target is freed by the greater restoration spell or similar magic. |`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-war-pick-1",
    name: `War-Pick (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-war-pick-2",
    name: `War-Pick (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-war-pick-3",
    name: `War-Pick (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-warhammer-1",
    name: `Warhammer (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-warhammer-2",
    name: `Warhammer (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-warhammer-3",
    name: `Warhammer (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-well-of-many-worlds",
    name: `Well of Many Worlds`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.

You can use an action to unfold and place the _well of many worlds_ on a solid surface, whereupon it creates a two-way portal to another world or plane of existence. Each time the item opens a portal, the GM decides where it leads. You can use an action to close an open portal by taking hold of the edges of the cloth and folding it up. Once _well of many worlds_ has opened a portal, it can't do so again for 1d8 hours.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-whip-1",
    name: `Whip (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-whip-2",
    name: `Whip (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-whip-3",
    name: `Whip (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wind-fan",
    name: `Wind Fan`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While holding this fan, you can use an action to cast the _gust of wind_ spell (save DC 13) from it. Once used, the fan shouldn't be used again until the next dawn. Each time it is used again before then, it has a cumulative 20 percent chance of not working and tearing into useless, nonmagical tatters.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-winged-boots",
    name: `Winged Boots`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear these boots, you have a flying speed equal to your walking speed. You can use the boots to fly for up to 4 hours, all at once or in several shorter flights, each one using a minimum of 1 minute from the duration. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land.

The boots regain 2 hours of flying capability for every 12 hours they aren't in use.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2014-wings-of-flying",
    name: `Wings of Flying`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this cloak, you can use an action to speak its command word. This turns the cloak into a pair of bat wings or bird wings on your back for 1 hour or until you repeat the command word as an action. The wings give you a flying speed of 60 feet. When they disappear, you can't use them again for 1d12 hours.




## Sentient Magic Items

Some magic items possess sentience and personality. Such an item might be possessed, haunted by the spirit of a previous owner, or self-aware thanks to the magic used to create it. In any case, the item behaves like a character, complete with personality quirks, ideals, bonds, and sometimes flaws. A sentient item might be a cherished ally to its wielder or a continual thorn in the side.

Most sentient items are weapons. Other kinds of items can manifest sentience, but consumable items such as potions and scrolls are never sentient.

Sentient magic items function as NPCs under the GM's control. Any activated property of the item is under the item's control, not its wielder's. As long as the wielder maintains a good relationship with the item, the wielder can access those properties normally. If the relationship is strained, the item can suppress its activated properties or even turn them against the wielder.`,
    sourceKey: "srd-2014",
    sourceName: "System Reference Document 5.1",
  },
  {
    slug: "srd-2024-adamantine-armor-breastplate",
    name: `Adamantine Armor (Breastplate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-chain-mail",
    name: `Adamantine Armor (Chain Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-chain-shirt",
    name: `Adamantine Armor (Chain Shirt)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-half-plate",
    name: `Adamantine Armor (Half Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-plate",
    name: `Adamantine Armor (Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-ring-mail",
    name: `Adamantine Armor (Ring Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-scale-mail",
    name: `Adamantine Armor (Scale Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-adamantine-armor-splint",
    name: `Adamantine Armor (Splint)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-aberration-slaying",
    name: `Ammunition of Aberration Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-beast-slaying",
    name: `Ammunition of Beast Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-celestial-slaying",
    name: `Ammunition of Celestial Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-construct-slaying",
    name: `Ammunition of Construct Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-dragon-slaying",
    name: `Ammunition of Dragon Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-elemental-slaying",
    name: `Ammunition of Elemental Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-fey-slaying",
    name: `Ammunition of Fey Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-fiend-slaying",
    name: `Ammunition of Fiend Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-giant-slaying",
    name: `Ammunition of Giant Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-humanoid-slaying",
    name: `Ammunition of Humanoid Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-monstrosity-slaying",
    name: `Ammunition of Monstrosity Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-ooze-slaying",
    name: `Ammunition of Ooze Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-plant-slaying",
    name: `Ammunition of Plant Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-of-undead-slaying",
    name: `Ammunition of Undead Slaying`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This magic ammunition is meant to slay creatures of a particular type, which the GM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.

After dealing its extra damage to a creature, the ammunition becomes nonmagical.

| 1d100 | Creature Type |
|-------|---------------|
| 01–10 | Aberrations   |
| 11–15 | Beasts        |
| 16–20 | Celestials    |
| 21–25 | Constructs    |
| 26–35 | Dragons       |
| 36–45 | Elementals    |
| 46–50 | Humanoids     |
| 51–60 | Fey           |
| 61–70 | Fiends        |
| 71–75 | Giants        |
| 76–80 | Monstrosities |
| 81–85 | Oozes         |
| 86–90 | Plants        |
| 91–00 | Undead        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-1",
    name: `Ammunition (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this piece of magic ammunition. The bonus is determined by the rarity of the ammunition. Once it hits a target, the ammunition is no longer magical. This ammunition is typically found or sold in quantities of ten or twenty pieces. Ten pieces of this ammunition are equivalent in value to a potion of the same rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-3",
    name: `Ammunition (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this piece of magic ammunition. The bonus is determined by the rarity of the ammunition. Once it hits a target, the ammunition is no longer magical. This ammunition is typically found or sold in quantities of ten or twenty pieces. Ten pieces of this ammunition are equivalent in value to a potion of the same rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ammunition-2",
    name: `Ammunition (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this piece of magic ammunition. The bonus is determined by the rarity of the ammunition. Once it hits a target, the ammunition is no longer magical. This ammunition is typically found or sold in quantities of ten or twenty pieces. Ten pieces of this ammunition are equivalent in value to a potion of the same rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-amulet-of-health",
    name: `Amulet of Health`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `Your Constitution is 19 while you wear this amulet. It has no effect on you if your Constitution is 19 or higher without it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-amulet-of-proof-against-detection-and-location",
    name: `Amulet of Proof against Detection and Location`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this amulet, you can't be targeted by Divination spells or perceived through magical scrying sensors unless you allow it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-amulet-of-the-planes",
    name: `Amulet of the Planes`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this amulet, you can take a Magic action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence (Arcana) check. On a successful check, you cast *Plane Shift*. On a failed check, you and each creature and object within 15 feet of you travel to a random destination determined by rolling 1d100 and consulting the following table.

| 1d100 | Destination
|-------|-----------------------------------------|
| 01–60 | Random location on the plane you named  |
| 61–70 | Random location on an Inner Plane determined by rolling 1d6: on a **1,** the Plane of Air; on a **2,** the Plane of Earth; on a **3,** the Plane of Fire; on a **4,** the Plane of Water; on a **5,** the Feywild; on a **6,** the Shadowfell |
| 71–80 | Random location on an Outer Plane determined by rolling 1d8: on a **1,** Arborea; on a **2,** Arcadia; on a **3,** the Beastlands; on a **4,** Bytopia; on a **5,** Elysium; on a **6,** Mechanus; on a **7,** Mount Celestia; on an **8,** Ysgard |
| 81–90 | Random location on an Outer Plane determined by rolling 1d8: on a **1,** the Abyss; on a **2,** Acheron; on a **3,** Carceri; on a **4,** Gehenna; on a **5,** Hades; on a **6,** Limbo; on a **7,** the Nine Hells; on an **8,** Pandemonium |
| 91–00 | Random location on the Astral Plane     |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-animated-shield",
    name: `Animated Shield`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this Shield, you can take a Bonus Action to cause it to animate. The Shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The Shield remains animate for 1 minute, until you take a Bonus Action to end this effect, or until you die or have the Incapacitated condition, at which point the Shield falls to the ground or into your hand if you have one free.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-apparatus-of-the-crab",
    name: `Apparatus of the Crab`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This item first appears to be a sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster.

The *Apparatus of the Crab* is a Large object with the following statistics: AC 20; HP 200; Speed 30 ft., Swim 30 ft. (or 0 ft. for both if the legs aren't extended); Immunity to Poison and Psychic damage.

To be used as a vehicle, the apparatus requires one pilot. While the apparatus's hatch is closed, the compartment is airtight and watertight. The compartment holds enough air for 10 hours of breathing, divided by the number of breathing creatures inside.

The apparatus floats on water. It can also go underwater to a depth of 900 feet. Below that, the vehicle takes 2d6 Bludgeoning damage each minute from pressure.

A creature in the compartment can take a Utilize action to move as many as two of the apparatus's levers up or down. After each use, a lever goes back to its neutral position. Each lever, from left to right, functions as shown in the Apparatus of the Crab Levers table.

Table: Apparatus of the Crab Levers

| Lever | Up                                                     | Down                                       |
|-------|--------------------------------------------------------|--------------------------------------------|
| 1     | Legs extend, allowing the apparatus to walk and swim.  | Legs retract, reducing the apparatus's Speed and Swim Speed to 0 and making it unable to benefit from bonuses to speed. |
| 2     | Forward window shutter opens.                          | Forward window shutter closes.             |
| 3     | Side window shutters open (two per side).              | Side window shutters close (two per side). |
| 4     | Two claws extend from the front side of the apparatus. | The claws retract.                         |
| 5     | Each extended claw makes the following melee attack: +8 to hit, reach 5 ft. *Hit:* 7 (2d6) Bludgeoning damage. | Each extended claw makes the following melee attack: +8 to hit, reach 5 ft. *Hit:* The target has the Grappled condition (escape DC 15). |
| 6     | The apparatus walks or swims forward provided its legs are extended. | The apparatus walks or swims backward provided its legs are extended. |
| 7     | The apparatus turns 90 degrees counterclockwise provided its legs are extended. | The apparatus turns 90 degrees clockwise provided its legs are extended. |
| 8     | Eyelike fixtures emit Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. | The light turns off. 
| 9     | The apparatus sinks up to 20 feet if it's in liquid.   | The apparatus rises up to 20 feet if it's in liquid. |
| 10    | The rear hatch unseals and opens.                      | The rear hatch closes and seals.           |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-invulnerability",
    name: `Armor of Invulnerability`,
    category: `Armor`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You have Resistance to Bludgeoning, Piercing, and Slashing damage while you wear this armor. Metal Shell. You can take a Magic action to give yourself Immunity to Bludgeoning, Piercing, and Slashing damage for 10 minutes or until you are no longer wearing the armor. Once this property is used, it can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-breastplate",
    name: `Armor of Resistance (Breastplate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-chain-mail",
    name: `Armor of Resistance (Chain Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-chain-shirt",
    name: `Armor of Resistance (Chain Shirt)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-half-plate",
    name: `Armor of Resistance (Half Plate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-hide-armor",
    name: `Armor of Resistance (Hide Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-leather-armor",
    name: `Armor of Resistance (Leather Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-padded",
    name: `Armor of Resistance (Padded)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-plate",
    name: `Armor of Resistance (Plate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-ring-mail",
    name: `Armor of Resistance (Ring Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-scale-mail",
    name: `Armor of Resistance (Scale Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-splint",
    name: `Armor of Resistance (Splint)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-resistance-studded-leather",
    name: `Armor of Resistance (Studded Leather)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Resistance to one type of damage while you wear this armor. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|---|---|
|1|Acid|
|2|Cold|
|3|Fire|
|4|Force|
|5|Lightning|
|6|Necrotic|
|7| Poison|
|8|Psychic|
|9|Radiant|
|10|Thunder|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-breastplate",
    name: `Armor of Vulnerability (Breastplate)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-chain-mail",
    name: `Armor of Vulnerability (Chain Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-chain-shirt",
    name: `Armor of Vulnerability (Chain Shirt)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-half-plate-armor",
    name: `Armor of Vulnerability (Half Plate Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-hide-armor",
    name: `Armor of Vulnerability (Hide Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-leather-armor",
    name: `Armor of Vulnerability (Leather Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-padded-armor",
    name: `Armor of Vulnerability (Padded Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-plate-armor",
    name: `Armor of Vulnerability (Plate Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-ring-mail",
    name: `Armor of Vulnerability (Ring Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-scale-mail",
    name: `Armor of Vulnerability (Scale Mail)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-splint-armor",
    name: `Armor of Vulnerability (Splint Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-armor-of-vulnerability-studded-leather-armor",
    name: `Armor of Vulnerability (Studded Leather Armor)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly. Curse. This armor is cursed, a fact that is revealed only when the Identify spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a Remove Curse spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which it grants Resistance).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-arrow-catching-shield",
    name: `Arrow-Catching Shield`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to Armor Class against ranged attack rolls while you wield this Shield. This bonus is in addition to the Shield's normal bonus to AC. Whenever an attacker makes a ranged attack roll against a target within 5 feet of you, you can take a Reaction to become the target of the attack instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bag-of-beans",
    name: `Bag of Beans`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This heavy cloth bag contains 3d4 dry beans when found. The bag weighs half a pound regardless of how many beans it contains and becomes a nonmagical item when it no longer contains any beans.

If you dump one or more beans out of the bag, they explode in a 10-foot-radius Sphere centered on them. All the dumped beans are destroyed in the explosion, and each creature in the Sphere, including you, makes a DC 15 Dexterity saving throw, taking 5d4 Force damage on a failed save or half as much damage on a successful one.

If you remove a bean from the bag, plant it in dirt or sand, and then water it, the bean disappears as it produces an effect 1 minute later from the ground where it was planted. The GM can choose an effect from the following table or determine it randomly.

| 1d100 | Effect                   |
|-------|--------------------------|
| 01    | 5d4 toadstools sprout. If a creature eats a toadstool, roll any die. On an odd roll, the eater must succeed on a DC 15 Constitution saving throw or take 5d6 Poison damage and have the Poisoned condition for 1 hour. On an even roll, the eater gains 5d6 Temporary Hit Points for 1 hour. |
| 02–10 | A geyser erupts and spouts water, beer, mayonnaise, tea, vinegar, wine, or oil (GM's choice) 30 feet into the air for 1d4 minutes. |
| 11–20 | A **Treant** sprouts. Roll any die. On an odd roll, the treant is Chaotic Evil. On an even roll, the treant is Chaotic Good. |
| 21–30 | An animate but immobile stone statue in your likeness rises and makes verbal threats against you. If you leave it and others come near, it describes you as the most heinous of villains and directs the newcomers to find and attack you. If you are on the same plane of existence as the statue, it knows where you are. The statue becomes inanimate after 24 hours. |
| 31–40 | A campfire with green flames springs forth and burns for 24 hours or until it is extinguished. |
| 41–50 | Three **Shrieker Fungi** sprout. |
| 51–60 | 1d4 + 4 bright-pink toads crawl forth. Whenever a toad is touched, it transforms into a Large or smaller monster of the GM's choice that acts in accordance with its alignment and nature. The monster remains for 1 minute, then disappears in a puff of bright-pink smoke. |
| 61–70 | A hungry **Bulette** burrows up and attacks. |
| 71–80 | A fruit tree grows. It has 1d10 + 20 fruit, 1d8 of which act as randomly determined potions. The tree vanishes after 1 hour. Picked fruit remains, retaining any magic for 30 days. |
| 81–90 | A nest of 1d4 + 3 rainbow-colored eggs springs up. Any creature that eats an egg makes a DC 20 Constitution saving throw. On a successful save, a creature permanently increases its lowest ability score by 1, randomly choosing among equally low scores. On a failed save, the creature takes 10d6 Force damage from an internal explosion. |
| 91–95 | A pyramid with a 60-foot-square base bursts upward. Inside is a burial chamber containing a **Mummy,** a **Mummy Lord,** or some other Undead of the GM's choice. Its sarcophagus contains treasure of the GM's choice. |
| 96–00 | A giant beanstalk sprouts, growing to a height of the GM's choice. The top leads where the GM chooses, such as to a great view, a cloud giant's castle, or another plane of existence. |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bag-of-devouring",
    name: `Bag of Devouring`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This bag resembles a Bag of Holding but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice. The extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 percent chance that the creature is pulled inside the bag. A creature inside the bag can take an action to try to escape, doing so with a successful DC 15 Strength (Athletics) check. Another creature can take an action to reach into the bag to pull a creature out, doing so with a successful DC 20 Strength (Athletics) check, provided the puller isn't pulled inside the bag first. Any creature that starts its turn inside the bag is devoured, its body destroyed. Inanimate objects can be stored in the bag, which can hold a cubic foot of such material. However, once each day, the bag swallows any objects inside it and spits them out into another plane of existence. The GM determines the time and plane. If the bag is pierced or torn, it is destroyed, and anything contained within it is transported to a random location on the Astral Plane.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bag-of-holding",
    name: `Bag of Holding`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This bag has an interior space considerably larger than its outside dimensions—roughly 2 feet square and 4 feet deep on the inside. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 5 pounds, regardless of its contents. Retrieving an item from the bag requires a Utilize action. If the bag is overloaded, pierced, or torn, it is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth unharmed, but the bag must be put right before it can be used again. The bag holds enough air for 10 minutes of breathing, divided by the number of breathing creatures inside. Placing a Bag of Holding inside an extradimensional space created by a Handy Haversack, Portable Hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within a 10-foot-radius Sphere centered on the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way and can't be reopened.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bag-of-tricks",
    name: `Bag of Tricks`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This bag made from gray, rust, or tan cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object.

You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table that corresponds to the bag's color. See "Monsters" for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points.

The creature is Friendly to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to command how the creature moves and what action it takes on its next turn, such as attacking an enemy. In the absence of such orders, the creature acts in a fashion appropriate to its nature.

Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.

Table: Gray Bag of Tricks

| 1d8 | Creature     |
|-----|--------------|
| 1   | Weasel       |
| 2   | Giant Rat    |
| 3   | Badger       |
| 4   | Boar         |
| 5   | Panther      |
| 6   | Giant Badger |
| 7   | Dire Wolf    |
| 8   | Giant Elk    |

Table: Rust Bag of Tricks

| 1d8 | Creature   |
|-----|------------|
| 1   | Rat        |
| 2   | Owl        |
| 3   | Mastiff    |
| 4   | Goat       |
| 5   | Giant Goat |
| 6   | Giant Boar |
| 7   | Lion       |
| 8   | Brown Bear |

Table: Tan Bag of Tricks

| 1d8 | Creature     |
|-----|--------------|
| 1   | Jackal       |
| 2   | Ape          |
| 3   | Baboon       |
| 4   | Axe Beak     |
| 5   | Black Bear   |
| 6   | Giant Weasel |
| 7   | Giant Hyena  |
| 8   | Tiger        |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-battleaxe-1",
    name: `Battleaxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-battleaxe-2",
    name: `Battleaxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-battleaxe-3",
    name: `Battleaxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bead-of-force",
    name: `Bead of Force`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 Beads of Force are found together. You can take a Magic action to throw the bead up to 60 feet. The bead explodes in a 10-foot-radius Sphere on impact and is destroyed. Each creature in the Sphere must succeed on a DC 15 Dexterity saving throw or take 5d4 Force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the save or are partially within the area are pushed away from the center of the sphere until they are no longer inside it. Only breathable air can pass through the sphere's wall. No attack or other effect can pass through. An enclosed creature can take a Utilize action to push against the sphere's wall, moving the sphere up to half the creature's Speed. The sphere can be picked up, and its magic causes it to weigh only 1 pound, regardless of the weight of creatures inside.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-dwarvenkind",
    name: `Belt of Dwarvenkind`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, you gain the following benefits:

**Dwarvish.** You know Dwarvish.

**Friend of Dwarvenkind.** You have Advantage on Charisma (Persuasion) checks made to interact with dwarves and duergar.

**Toughness.** Your Constitution increases by 2, to a maximum of 20.

In addition, while attuned to the belt, you have a 50 percent chance each day at dawn of growing a full beard if you can grow one, or a thicker beard if you already have one.

If you aren’t a dwarf or duergar, you gain the following additional benefits while wearing the belt:

**Darkvision.** You have Darkvision with a range of 60 feet.

**Resilience.** You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-giant-strength-cloud",
    name: `Belt of Giant Strength (Cloud)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.

| Belt                                    | Str. | Rarity    |
|-----------------------------------------|------|-----------|
| Belt of Giant Strength (hill)           | 21   | Rare      |
| Belt of Giant Strength (frost or stone) | 23   | Very Rare |
| Belt of Giant Strength (fire)           | 25   | Very Rare |
| Belt of Giant Strength (cloud)          | 27   | Legendary |
| Belt of Giant Strength (storm)          | 29   | Legendary |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-giant-strength-fire",
    name: `Belt of Giant Strength (Fire)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.

| Belt                                    | Str. | Rarity    |
|-----------------------------------------|------|-----------|
| Belt of Giant Strength (hill)           | 21   | Rare      |
| Belt of Giant Strength (frost or stone) | 23   | Very Rare |
| Belt of Giant Strength (fire)           | 25   | Very Rare |
| Belt of Giant Strength (cloud)          | 27   | Legendary |
| Belt of Giant Strength (storm)          | 29   | Legendary |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-giant-strength-frost-or-stone",
    name: `Belt of Giant Strength (Frost or Stone)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.

| Belt                                    | Str. | Rarity    |
|-----------------------------------------|------|-----------|
| Belt of Giant Strength (hill)           | 21   | Rare      |
| Belt of Giant Strength (frost or stone) | 23   | Very Rare |
| Belt of Giant Strength (fire)           | 25   | Very Rare |
| Belt of Giant Strength (cloud)          | 27   | Legendary |
| Belt of Giant Strength (storm)          | 29   | Legendary |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-giant-strength-hill",
    name: `Belt of Giant Strength (Hill)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.

| Belt                                    | Str. | Rarity    |
|-----------------------------------------|------|-----------|
| Belt of Giant Strength (hill)           | 21   | Rare      |
| Belt of Giant Strength (frost or stone) | 23   | Very Rare |
| Belt of Giant Strength (fire)           | 25   | Very Rare |
| Belt of Giant Strength (cloud)          | 27   | Legendary |
| Belt of Giant Strength (storm)          | 29   | Legendary |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-belt-of-giant-strength-storm",
    name: `Belt of Giant Strength (Storm)`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.

| Belt                                    | Str. | Rarity    |
|-----------------------------------------|------|-----------|
| Belt of Giant Strength (hill)           | 21   | Rare      |
| Belt of Giant Strength (frost or stone) | 23   | Very Rare |
| Belt of Giant Strength (fire)           | 25   | Very Rare |
| Belt of Giant Strength (cloud)          | 27   | Legendary |
| Belt of Giant Strength (storm)          | 29   | Legendary |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-berserker-battleaxe",
    name: `Berserker Battleaxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your Hit Point maximum increases by 1 for each level you have attained. Curse. This weapon is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the weapon, keeping it within reach at all times. You also have Disadvantage on attack rolls with weapons other than this one. Whenever another creature damages you while the weapon is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. This berserk state ends when you start your turn and there are no creatures within 60 feet of you that you can see or hear. While berserk, you regard the creature nearest to you that you can see or hear as your enemy. If there are multiple possible creatures, choose one at random. On each of your turns, you must move as close to the creature as possible and take the Attack action, targeting the creature. If you're unable to get close enough to the creature to attack it with the weapon, your turn ends after you've used up all your available movement. If the creature dies or can no longer be seen or heard by you, the next nearest creature that you can see or hear becomes your new target.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-berserker-greataxe",
    name: `Berserker Greataxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your Hit Point maximum increases by 1 for each level you have attained. Curse. This weapon is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the weapon, keeping it within reach at all times. You also have Disadvantage on attack rolls with weapons other than this one. Whenever another creature damages you while the weapon is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. This berserk state ends when you start your turn and there are no creatures within 60 feet of you that you can see or hear. While berserk, you regard the creature nearest to you that you can see or hear as your enemy. If there are multiple possible creatures, choose one at random. On each of your turns, you must move as close to the creature as possible and take the Attack action, targeting the creature. If you're unable to get close enough to the creature to attack it with the weapon, your turn ends after you've used up all your available movement. If the creature dies or can no longer be seen or heard by you, the next nearest creature that you can see or hear becomes your new target.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-berserker-halberd",
    name: `Berserker Halberd`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your Hit Point maximum increases by 1 for each level you have attained. Curse. This weapon is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the weapon, keeping it within reach at all times. You also have Disadvantage on attack rolls with weapons other than this one. Whenever another creature damages you while the weapon is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. This berserk state ends when you start your turn and there are no creatures within 60 feet of you that you can see or hear. While berserk, you regard the creature nearest to you that you can see or hear as your enemy. If there are multiple possible creatures, choose one at random. On each of your turns, you must move as close to the creature as possible and take the Attack action, targeting the creature. If you're unable to get close enough to the creature to attack it with the weapon, your turn ends after you've used up all your available movement. If the creature dies or can no longer be seen or heard by you, the next nearest creature that you can see or hear becomes your new target.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-blowgun-1",
    name: `Blowgun (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-blowgun-2",
    name: `Blowgun (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-blowgun-3",
    name: `Blowgun (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-boots-of-elvenkind",
    name: `Boots of Elvenkind`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have Advantage on Dexterity (Stealth) checks.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-boots-of-levitation",
    name: `Boots of Levitation`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear these boots, you can cast Levitate on yourself.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-boots-of-speed",
    name: `Boots of Speed`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear these boots, you can take a Bonus Action to click the boots' heels together. If you do, the boots double your Speed, and any creature that makes an Opportunity Attack against you has Disadvantage on the attack roll. If you click your heels together again, you end the effect. When you've used the boots' property for a total of 10 minutes, the magic ceases to function for you until you finish a Long Rest.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-boots-of-striding-and-springing",
    name: `Boots of Striding and Springing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear these boots, your Speed becomes 30 feet unless your Speed is higher, and your Speed isn't reduced by you carrying weight in excess of your carrying capacity or wearing Heavy Armor. Once on each of your turns, you can jump up to 30 feet by spending only 10 feet of movement.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-boots-of-the-winterlands",
    name: `Boots of the Winterlands`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These furred boots are snug and feel warm. While wearing them, you gain the following benefits. Cold Resistance. You have Resistance to Cold damage and can tolerate temperatures of 0 degrees Fahrenheit or lower without any additional protection. Winter Strider. You ignore Difficult Terrain created by ice or snow.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bowl-of-commanding-water-elementals",
    name: `Bowl of Commanding Water Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While this bowl is filled with water and you are within 5 feet of it, you can take a Magic action to summon a Water Elemental. The elemental appears in an unoccupied space as close to the bowl as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The bowl can't be used this way again until the next dawn. The bowl is about 1 foot in diameter and half as deep. It holds about 3 gallons.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bracers-of-archery",
    name: `Bracers of Archery`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing these bracers, you have proficiency with the Longbow and Shortbow, and you gain a +2 bonus to damage rolls made with such weapons.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-bracers-of-defense",
    name: `Bracers of Defense`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing these bracers, you gain a +2 bonus to Armor Class if you are wearing no armor and using no Shield.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-brazier-of-commanding-fire-elementals",
    name: `Brazier of Commanding Fire Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While you are within 5 feet of this brazier, you can take a Magic action to summon a Fire Elemental. The elemental appears in an unoccupied space as close to the brazier as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The brazier can't be used this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-breastplate-1",
    name: `Breastplate (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-breastplate-2",
    name: `Breastplate (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-breastplate-3",
    name: `Breastplate (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-brooch-of-shielding",
    name: `Brooch of Shielding`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this brooch, you have Resistance to Force damage, and you have Immunity to damage from the Magic Missile spell.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-broom-of-flying",
    name: `Broom of Flying`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `This wooden broom functions like a mundane broom until you stand astride it and take a Magic action to make it hover beneath you, at which time it can be ridden in the air. It has a Fly Speed of 50 feet. It can carry up to 400 pounds, but its Fly Speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land or when you're no longer riding it. As a Magic action, you can send the broom to travel alone to a destination within 1 mile of you if you name the location and are familiar with it. The broom comes back to you when you take a Magic action and use a command word if the broom is still within 1 mile of you.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-candle-of-invocation",
    name: `Candle of Invocation`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This candle's magic is activated when the candle is lit, which requires a Magic action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from its total burn time.

While lit, the candle sheds Dim Light in a 30-foot radius. While you are within that light, you have Advantage on D20 Tests. In addition, a Cleric or Druid in the light can cast level 1 spells they have prepared without expending spell slots.

Alternatively, when you light the candle for the first time, you can cast *Gate* with it. Doing so destroys the candle. The portal created by the spell links to a particular Outer Plane chosen by the GM or determined by rolling on the following table.

| 1d100 | Outer Plane    |
|-------|----------------|
| 01–05 | Abyss          |
| 06–10 | Acheron        |
| 11–17 | Arborea        |
| 18–25 | Arcadia        |
| 26–33 | Beastlands     |
| 34–41 | Bytopia        |
| 42–46 | Carceri        |
| 47–54 | Elysium        |
| 55–59 | Gehenna        |
| 60–64 | Hades          |
| 65–69 | Limbo          |
| 70–77 | Mechanus       |
| 78–85 | Mount Celestia |
| 86–90 | Nine Hells     |
| 91–95 | Pandemonium    |
| 96–00 | Ysgard         |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cape-of-the-mountebank",
    name: `Cape of the Mountebank`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This cape smells faintly of brimstone. While wearing it, you can use it to cast Dimension Door as a Magic action. This property can't be used again until the next dawn. When you teleport with that spell, you leave behind a cloud of smoke. The space you left is Lightly Obscured by that smoke until the end of your next turn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-carpet-of-flying",
    name: `Carpet of Flying`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it.

Four sizes of *Carpet of Flying* exist. The GM chooses the size of a given carpet or determines it randomly by rolling on the following table. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity.

| 1d100 | Size          | Capacity | Fly Speed |
|-------|---------------|----------|-----------|
| 01–20 | 3 ft. × 5 ft. | 200 lb.  | 80 feet   |
| 21–55 | 4 ft. × 6 ft. | 400 lb.  | 60 feet   |
| 56–80 | 5 ft. × 7 ft. | 600 lb.  | 40 feet   |
| 81–00 | 6 ft. × 9 ft. | 800 lb.  | 30 feet   |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-censer-of-controlling-air-elementals",
    name: `Censer of Controlling Air Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While gently swinging this censer, you can take a Magic action to summon an Air Elemental. The elemental appears in an unoccupied space as close to the censer as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The censer can't be used this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-mail-1",
    name: `Chain Mail (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-mail-2",
    name: `Chain Mail (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-mail-3",
    name: `Chain Mail (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-shirt-1",
    name: `Chain Shirt (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-shirt-2",
    name: `Chain Shirt (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chain-shirt-3",
    name: `Chain Shirt (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-chime-of-opening",
    name: `Chime of Opening`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This hollow metal tube measures about 1 foot long and weighs 1 pound. As a Magic action, you can strike the chime to cast Knock. The spell's customary knocking sound is replaced by the clear, ringing tone of the chime, which is audible out to 300 feet. The chime can be used 10 times. After the tenth time, it cracks and becomes useless.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-circlet-of-blasting",
    name: `Circlet of Blasting`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this circlet, you can cast Scorching Ray with it (+5 to hit). The circlet can't cast this spell again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-arachnida",
    name: `Cloak of Arachnida`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This fine garment is made of black silk interwoven with faint, silvery threads. While wearing it, you gain the following benefits. Poison Resistance. You have Resistance to Poison damage. Spider Climb. You have a Climb Speed equal to your Speed and can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free. Spider Walk. You can't be caught in webs of any sort and can move through webs as if they were Difficult Terrain. Web. You can cast Web (save DC 13). The web created by the spell fills twice its normal area. Once used, this property can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-displacement",
    name: `Cloak of Displacement`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear this cloak, it magically projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have Disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while your Speed is 0.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-elvenkind",
    name: `Cloak of Elvenkind`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear this cloak, Wisdom (Perception) checks made to perceive you have Disadvantage, and you have Advantage on Dexterity (Stealth) checks.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-protection",
    name: `Cloak of Protection`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to Armor Class and saving throws while you wear this cloak.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-the-bat",
    name: `Cloak of the Bat`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this cloak, you have Advantage on Dexterity (Stealth) checks. In an area of Dim Light or Darkness, you can grip the edges of the cloak and use it to gain a Fly Speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in Dim Light or Darkness, you lose this Fly Speed. While wearing the cloak in an area of Dim Light or Darkness, you can cast Polymorph on yourself, shape-shifting into a Bat. While in that form, you retain your Intelligence, Wisdom, and Charisma scores. The cloak can't be used this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cloak-of-the-manta-ray",
    name: `Cloak of the Manta Ray`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this cloak, you can breathe underwater, and you have a Swim Speed of 60 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-club-1",
    name: `Club (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-club-2",
    name: `Club (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-club-3",
    name: `Club (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-crystal-ball",
    name: `Crystal Ball`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While touching this crystal orb, you can cast Scrying (save DC 17) with it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-crystal-ball-of-mind-reading",
    name: `Crystal Ball of Mind Reading`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While touching this crystal orb, you can cast Scrying (save DC 17) with it. In addition, you can cast Detect Thoughts (save DC 17) targeting creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on this Detect Thoughts spell to maintain it during its duration, but it ends if the Scrying spell ends.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-crystal-ball-of-telepathy",
    name: `Crystal Ball of Telepathy`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While touching this crystal orb, you can cast Scrying (save DC 17) with it. In addition, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor. You can also cast Suggestion (save DC 17) through the sensor on one of those creatures. You don't need to concentrate on this Suggestion to maintain it during its duration, but it ends if Scrying ends. You can't cast Suggestion in this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-crystal-ball-of-true-seeing",
    name: `Crystal Ball of True Seeing`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While touching this crystal orb, you can cast Scrying (save DC 17) with it. In addition, you have Truesight with a range of 120 feet centered on the spell's sensor.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cube-of-force",
    name: `Cube of Force`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This cube is about an inch across. Each face has a distinct marking on it. You can press one of those faces, expend the number of charges required for it, and thereby cast the spell associated with it (save DC 17), as shown in the Cube of Force Faces table.

The cube starts with 10 charges, and it regains 1d6 expended charges daily at dawn.

Table: Cube of Force Faces

| Spell            | Charge Cost |
|------------------|-------------|
| Mage Armor       | 1           |
| Shield           | 1           |
| Tiny Hut         | 3           |
| Private Sanctum  | 4           |
| Resilient Sphere | 4           |
| Wall of Force    | 5           |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-cubic-gate",
    name: `Cubic Gate`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the GM. The cube has 3 charges and regains 1d3 expended charges daily at dawn. As a Magic action, you can expend 1 of the cube's charges to cast one of the following spells using the cube. Gate. Pressing one side of the cube, you cast Gate, opening a portal to the plane of existence keyed to that side. Plane Shift. Pressing one side of the cube twice, you cast Plane Shift, transporting the targets to the plane of existence keyed to that side.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dagger-of-venom",
    name: `Dagger of Venom`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. You can take a Bonus Action to magically coat the blade with poison. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 Poison damage and have the Poisoned condition for 1 minute. The weapon can't be used this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dagger-1",
    name: `Dagger (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dagger-2",
    name: `Dagger (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dagger-3",
    name: `Dagger (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dancing-greatsword",
    name: `Dancing Greatsword`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls. While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon. After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dancing-longsword",
    name: `Dancing Longsword`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls. While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon. After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dancing-rapier",
    name: `Dancing Rapier`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls. While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon. After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dancing-scimitar",
    name: `Dancing Scimitar`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls. While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon. After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dancing-shortsword",
    name: `Dancing Shortsword`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls. While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon. After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dart-1",
    name: `Dart (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dart-2",
    name: `Dart (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dart-3",
    name: `Dart (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-decanter-of-endless-water",
    name: `Decanter of Endless Water`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds. You can take a Magic action to remove the stopper and issue one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following command words: Splash. The decanter produces 1 gallon of water. Fountain. The decanter produces 5 gallons of water. Geyser. The decanter produces 30 gallons of water that gushes forth in a Line 30 feet long and 1 foot wide. If you're holding the decanter, you can aim the geyser in one direction (no action required). One creature of your choice in the Line must succeed on a DC 13 Strength saving throw or take 1d4 Bludgeoning damage and have the Prone condition. Instead of a creature, you can target one object in the Line that isn't being worn or carried and that weighs no more than 200 pounds. The object is knocked over by the geyser.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-deck-of-illusions",
    name: `Deck of Illusions`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This box contains a set of cards. A full deck has 34 cards: 32 depicting specific creatures and two with a mirrored surface. A deck found as treasure is usually missing 1d20 − 1 cards.

The magic of the deck functions only if its cards are drawn at random. You can take a Magic action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of yourself. An illusion of a creature, determined by rolling on the Deck of Illusions table, forms over the thrown card and remains until dispelled. The illusory creature created by the card looks and behaves like a real creature of its kind, except that it can do no harm. While you are within 120 feet of the illusory creature and can see it, you can take a Magic action to move it anywhere within 30 feet of its card.

Any physical interaction with the illusory creature reveals it to be false, because objects pass through it. A creature that takes a Study action to visually inspect the illusory creature identifies it as an illusion with a successful DC 15 Intelligence (Investigation) check. The illusion lasts until its card is moved or the illusion is dispelled (using a *Dispel Magic* spell or a similar effect). When the illusion ends, the image on its card disappears, and that card can't be used again.

Table: Deck of Illusions

| 1d100 | Illusion*         |
|-------|-------------------|
| 01–03 | Adult Red Dragon  |
| 04–06 | Archmage          |
| 07–09 | Assassin          |
| 10–12 | Bandit Captain    |
| 13–15 | Basilisk          |
| 16–18 | Berserker         |
| 19–21 | Bugbear Warrior   |
| 22–24 | Cloud Giant       |
| 25–27 | Druid             |
| 28–30 | Erinyes           |
| 31–33 | Ettin             |
| 34–36 | Fire Giant        |
| 37–39 | Frost Giant       |
| 40–42 | Gnoll Warrior     |
| 43–45 | Goblin Warrior    |
| 46–48 | Guardian Naga     |
| 49–51 | Hill Giant        |
| 52–54 | Hobgoblin Warrior |
| 55–57 | Incubus           |
| 58–60 | Iron Golem        |
| 61–63 | Knight            |
| 64–66 | Kobold Warrior    |
| 67–69 | Lich              |
| 70–72 | Medusa            |
| 73–75 | Night Hag         |
| 76–78 | Ogre              |
| 79–81 | Oni               |
| 82–84 | Priest            |
| 85–87 | Succubus          |
| 88–90 | Troll             |
| 91–93 | Veteran Warrior   |
| 94–96 | Wyvern            |
| 97–00 | The card drawer   |

\\*Stat blocks for these creatures (except the card drawer) appear in "Monsters."`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender",
    name: `Defender`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-battleaxe",
    name: `Defender (Battleaxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-blowgun",
    name: `Defender (Blowgun)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-club",
    name: `Defender (Club)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-dagger",
    name: `Defender (Dagger)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-dart",
    name: `Defender (Dart)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-flail",
    name: `Defender (Flail)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-glaive",
    name: `Defender (Glaive)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-greataxe",
    name: `Defender (Greataxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-greatclub",
    name: `Defender (Greatclub)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-greatsword",
    name: `Defender (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-halberd",
    name: `Defender (Halberd)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-hand-crossbow",
    name: `Defender (Hand Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-handaxe",
    name: `Defender (Handaxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-heavy-crossbow",
    name: `Defender (Heavy Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-javelin",
    name: `Defender (Javelin)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-lance",
    name: `Defender (Lance)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-light-crossbow",
    name: `Defender (Light Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-light-hammer",
    name: `Defender (Light Hammer)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-longbow",
    name: `Defender (Longbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-longsword",
    name: `Defender (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-mace",
    name: `Defender (Mace)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-maul",
    name: `Defender (Maul)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-morningstar",
    name: `Defender (Morningstar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-musket",
    name: `Defender (Musket)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-pike",
    name: `Defender (Pike)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-pistol",
    name: `Defender (Pistol)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-quarterstaff",
    name: `Defender (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-rapier",
    name: `Defender (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-scimitar",
    name: `Defender (Scimitar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-shortbow",
    name: `Defender (Shortbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-shortsword",
    name: `Defender (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-sickle",
    name: `Defender (Sickle)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-sling",
    name: `Defender (Sling)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-spear",
    name: `Defender (Spear)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-trident",
    name: `Defender (Trident)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-war-pick",
    name: `Defender (War Pick)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-warhammer",
    name: `Defender (Warhammer)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-defender-whip",
    name: `Defender (Whip)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.

The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-breastplate",
    name: `Demon Breastplate`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-chain-mail",
    name: `Demon Chain Mail`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-chain-shirt",
    name: `Demon Chain Shirt`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-half-plate-armor",
    name: `Demon Half Plate Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-hide-armor",
    name: `Demon Hide Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-leather-armor",
    name: `Demon Leather Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-padded-armor",
    name: `Demon Padded Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-plate-armor",
    name: `Demon Plate Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-ring-mail",
    name: `Demon Ring Mail`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-scale-mail",
    name: `Demon Scale Mail`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-splint-armor",
    name: `Demon Splint Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-demon-studded-leather-armor",
    name: `Demon Studded Leather Armor`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.

**Curse.** Once you don this cursed armor, you can't doff it unless you are targeted by a Remove Curse spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dimensional-shackles",
    name: `Dimensional Shackles`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can take a Utilize action to place these shackles on a creature that has the Incapacitated condition. The shackles adjust to fit a creature of Small to Large size. The shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don't prevent the creature from passing through an interdimensional portal. You and any creature you designate when you use the shackles can take a Utilize action to remove them. Once every 30 days, the bound creature can make a DC 30 Strength (Athletics) check. On a successful check, the creature breaks free and destroys the shackles.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dragon-orb",
    name: `Dragon Orb`,
    category: `Wondrous Item`,
    rarity: `Artifact`,
    requiresAttunement: true,
    description: `An orb is an etched crystal globe about 10 inches in diameter. When used, it grows to about 20 inches in diameter, and mist swirls inside it.

While attuned to an orb, you can take a Magic action to peer into the orb's depths. You must then make a DC 15 Charisma saving throw. On a successful save, you control the orb for as long as you remain attuned to it. On a failed save, the orb imposes the Charmed condition on you for as long as you remain attuned to it.

While you are Charmed by the orb, you can't voluntarily end your Attunement to it, and the orb casts *Suggestion* on you at will (save DC 18), urging you to work toward the evil ends it desires. The dragon essence within the orb might want many things: the annihilation of a particular society or organization, freedom from the orb, to spread suffering in the world, to advance the worship of Tiamat, or something else the GM decides.

**_Spells._** The orb has 7 charges and regains 1d4 + 3 expended charges daily at dawn. If you control the orb, you can cast one of the spells on the following table from it. The table indicates how many charges you must expend to cast the spell.

| Spell                         | Charge Cost    |
|-------------------------------|----------------|
| Cure Wounds (level 9 version) | 4              |
| Daylight                      | 1              |
| Death Ward                    | 2              |
| Detect Magic                  | 0              |
| Scrying (save DC 18)          | 3              |

**_Call Dragons._** While you control the orb, you can take a Magic action to cause the orb to issue a telepathic call that extends in all directions for 40 miles. Chromatic dragons in range feel compelled to come to the orb as soon as possible by the most direct route. Dragon deities such as Tiamat are unaffected by this call. Chromatic dragons drawn to the orb might be Hostile toward you for compelling them against their will. Once you have used this property, it can't be used again for 1 hour.

**_Destroying an Orb._** A *Dragon Orb* has AC 20 and is destroyed if it takes damage from a *+3 Weapon* or a *Disintegrate* spell. Nothing else can harm it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dragon-scale-mail",
    name: `Dragon Scale Mail`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `*Dragon Scale Mail* is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them. Other times, hunters carefully preserve the hide of a dead dragon. In either case, *Dragon Scale Mail* is highly valued.

While wearing this armor, you gain a +1 bonus to Armor Class, you have Advantage on saving throws against the breath weapons of Dragons, and you have Resistance to one damage type determined by the kind of dragon that provided the scales (see the accompanying table).

Additionally, you can focus your senses as a Magic action to discern the distance and direction to the closest dragon within 30 miles of yourself that is of the same type as the armor. This action can't be used again until the next dawn.

| Dragon | Resistance |
|--------|------------|
| Black  | Acid       |
| Blue   | Lightning  |
| Brass  | Fire       |
| Bronze | Lightning  |
| Copper | Acid       |
| Gold   | Fire       |
| Green  | Poison     |
| Red    | Fire       |
| Silver | Cold       |
| White  | Cold       |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dragon-slayer",
    name: `Dragon Slayer`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The weapon deals an extra 3d6 damage of the weapon's type if the target is a Dragon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dust-of-disappearance",
    name: `Dust of Disappearance`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This powder resembles fine sand. There is enough of it for one use. When you take a Utilize action to throw the dust into the air, you and each creature and object within a 10-foot Emanation originating from you have the Invisible condition for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. Immediately after an affected creature makes an attack roll, deals damage, or casts a spell, the Invisible condition ends for that creature.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dust-of-dryness",
    name: `Dust of Dryness`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This small packet contains 1d6 + 4 pinches of dust. As a Utilize action, you can sprinkle a pinch of the dust over water, turning up to a 15-foot Cube of water into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet's weight is negligible. A creature can take a Utilize action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so destroys the pellet and ends its magic. As a Utilize action, you can sprinkle a pinch of the dust on an Elemental within 5 feet of yourself that is composed mostly of water (such as a Water Elemental). Such a creature exposed to a pinch of the dust makes a DC 13 Constitution saving throw, taking 10d6 Necrotic damage on a failed save or half as much damage on a successful one.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dust-of-sneezing-and-choking",
    name: `Dust of Sneezing and Choking`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Found in a small container, this powder resembles Dust of Disappearance, and Identify reveals it to be such. There is enough of it for one use. As a Utilize action, you can throw the dust into the air, forcing yourself and every creature in a 30-foot Emanation originating from you to make a DC 15 Constitution saving throw. Constructs, Elementals, Oozes, Plants, and Undead succeed on the save automatically. On a failed save, a creature begins sneezing uncontrollably; it has the Incapacitated condition and is suffocating. The creature repeats the save at the end of each of its turns, ending the effect on itself on a success. The effect also ends on any creature targeted by a Lesser Restoration spell.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dwarven-half-plate",
    name: `Dwarven Half Plate`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you gain a +2 bonus to Armor Class. In addition, if an effect moves you against your will along the ground, you can take a Reaction to reduce the distance you are moved by up to 10 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dwarven-plate",
    name: `Dwarven Plate`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you gain a +2 bonus to Armor Class. In addition, if an effect moves you against your will along the ground, you can take a Reaction to reduce the distance you are moved by up to 10 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-dwarven-thrower",
    name: `Dwarven Thrower`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. It has the Thrown property with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 Force damage, or an extra 2d8 Force damage if the target is a Giant. Immediately after hitting or missing, the weapon flies back to your hand.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-efficient-quiver",
    name: `Efficient Quiver`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Each of the quiver's three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to 60 Arrows, Bolts, or similar objects. The midsize compartment holds up to 18 Javelins or similar objects. The longest compartment holds up to 6 long objects, such as bows, Quarterstaffs, or Spears. You can draw any item the quiver contains as if doing so from a regular quiver or scabbard.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-efreeti-bottle",
    name: `Efreeti Bottle`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you take a Magic action to remove the stopper of this painted brass bottle, a cloud of thick smoke flows out of it. At the end of your turn, the smoke disappears with a flash of harmless fire, and an **Efreeti** appears in an unoccupied space within 30 feet of you.

The first time the bottle is opened, the GM rolls on the following table to determine what happens.

| 1d10 | Effect                       |
|------|------------------------------|
| 1    | The efreeti attacks you. After fighting for 5 rounds, the efreeti disappears, and the bottle loses its magic. |
| 2–9  | The efreeti understands your languages and obeys your commands for 1 hour, after which it returns to the bottle, and a new stopper contains it. The stopper can't be removed for 24 hours. The next two times the bottle is opened, the same effect occurs. If the bottle is opened a fourth time, the efreeti escapes and disappears, and the bottle loses its magic. |
| 10   | The efreeti understands your languages and can cast *Wish* once for you. It disappears when it grants the wish or after 1 hour, and the bottle loses its magic. |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-elemental-gem",
    name: `Elemental Gem`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This gem contains a mote of elemental energy. When you take a Utilize action to break the gem, an elemental is summoned (see "Monsters" for its stat block), and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The type of gem determines the elemental, as shown in the following table.

| Gem            | Summoned Elemental |
|----------------|--------------------|
| Blue sapphire  | Air Elemental      |
| Emerald        | Water Elemental    |
| Red corundum   | Fire Elemental     |
| Yellow diamond | Earth Elemental    |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-elven-chain-mail",
    name: `Elven Chain Mail`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to Armor Class while you wear this armor. You are considered trained with this armor even if you lack training with Heavy armor.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-elven-chain-shirt",
    name: `Elven Chain Shirt`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to Armor Class while you wear this armor. You are considered trained with this armor even if you lack training with Medium armor.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-eversmoking-bottle",
    name: `Eversmoking Bottle`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `As a Magic action, you can open or close this bottle. Opening the bottle causes thick smoke to billow out, forming a cloud that fills a 60-foot Emanation originating from the bottle. The area within the smoke is Heavily Obscured. Each minute the bottle remains open, the size of the Emanation increases by 10 feet until it reaches its maximum size of 120 feet. Closing the bottle causes the cloud to become fixed in place until it disperses after 10 minutes. A strong wind (such as that created by the Gust of Wind spell) disperses the cloud after 1 minute.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-eyes-of-charming",
    name: `Eyes of Charming`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 or more charges to cast Charm Person (save DC 13). For 1 charge, you cast the level 1 version of the spell. You increase the spell's level by one for each additional charge you expend. The lenses regain all expended charges daily at dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-eyes-of-minute-seeing",
    name: `Eyes of Minute Seeing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `These crystal lenses fit over the eyes. While wearing them, your vision improves significantly out to a range of 1 foot, granting you Darkvision within that range and Advantage on Intelligence (Investigation) checks made to examine something within that range.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-eyes-of-the-eagle",
    name: `Eyes of the Eagle`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `These crystal lenses fit over the eyes. While wearing them, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-anchor",
    name: `Feather Token (Anchor)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-bird",
    name: `Feather Token (Bird)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-fan",
    name: `Feather Token (Fan)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-swan-boat",
    name: `Feather Token (Swan Boat)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-tree",
    name: `Feather Token (Tree)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-feather-token-whip",
    name: `Feather Token (Whip)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens table. The type of token determines its rarity.

**Anchor (Uncommon).** You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears. Bird (Rare). You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a Roc, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.

**Fan (Uncommon).** If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.

**Swan Boat (Rare).** You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.

**Tree (Uncommon).** You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.

**Whip (Rare).** You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.

As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.

|1d100|Token|Rarity|
|---|---|---|
|01–20|Anchor|Uncommon|
|21–35|Bird|Rare|
|36–50|Fan|Uncommon|
|51–65|Swan boat|Rare|
|66–90|Tree|Uncommon|
|91–00|Whip|Rare|`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-bronze-griffon",
    name: `Figurine of Wondrous Power (Bronze Griffon)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Bronze Griffon (Rare)._** This bronze statuette is of a griffon rampant. It can become a **Griffon** for up to 6 hours. Once it has been used, it can't be used again until 5 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-ebony-fly",
    name: `Figurine of Wondrous Power (Ebony Fly)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Ebony Fly (Rare)._** This ebony statuette, carved in the likeness of a horsefly, can become a **Giant Fly** (see the accompanying stat block) for up to 12 hours and can be ridden as a mount. Once it has been used, it can't be used again until 2 days have passed.

> #### **Giant Fly**
> *Large Beast, Unaligned*
> **AC** 11
> **Initiative** +1 (11)
> **HP** 15 (3d10 + 3)
> **Speed** Speed 30 ft., Fly 60 ft.
> |Attribute|Score|Mod|Save|
> |---|---|---|---|
> |Str|14|+2|+2|
> |Dex|13|+1|+1|
> |Con|13|+1|+1|
> |Int|2|-4|-4|
> |Wis|10|+0|+0|
> |Cha|3|-4|-4|

> **Senses** Darkvision 60 ft., Passive Perception 10
> **Languages** None
> **CR** 0 (XP 0; PB +2)`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-golden-lions",
    name: `Figurine of Wondrous Power (Golden Lions)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Golden Lions (Rare)._** These gold statuettes of lions are always created in pairs. You can use one figurine or both simultaneously. Each can become a **Lion** for up to 1 hour. Once a lion has been used, it can't be used again until 7 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-ivory-goats",
    name: `Figurine of Wondrous Power (Ivory Goats)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Golden Lions (Rare)._** These gold statuettes of lions are always created in pairs. You can use one figurine or both simultaneously. Each can become a **Lion** for up to 1 hour. Once a lion has been used, it can't be used again until 7 days have passed.

**Goat of Terror.** This figurine can become a **Giant Goat** for up to 3 hours. The goat can't attack, but you can (harmlessly) remove its horns and use them as weapons. One horn becomes a *+1 Lance*, and the other becomes a *+2 Longsword*. Removing a horn requires a Magic action, and the weapons disappear and the horns return when the goat reverts to figurine form. While you ride the goat, any Hostile creature that starts its turn within a 30-foot Emanation originating from the goat must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute, until you are no longer riding the goat, or until the goat reverts to figurine form. The Frightened creature repeats the save at the end of each of its turns, ending the effect on itself on a success. Once it succeeds on the save, a creature is immune to this effect for the next 24 hours. Once the figurine has been used, it can't be used again until 15 days have passed.

**_Goat of Traveling._** This figurine can become a Large goat with the same statistics as a **Riding Horse**. It has 24 charges, and each hour or portion thereof it spends in goat form costs 1 charge. While it has charges, you can use it as often as you wish. When it runs out of charges, it reverts to a figurine and can't be used again until 7 days have passed, when it regains all expended charges.

**_Goat of Travail._** This figurine can become a **Giant Goat** for up to 3 hours. Once it has been used, it can't be used again until 30 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-marble-elephant",
    name: `Figurine of Wondrous Power (Marble Elephant)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Marble Elephant (Rare)._** This marble statuette resembles a trumpeting elephant. It can become an **Elephant** for up to 24 hours. Once it has been used, it can't be used again until 7 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-obsidian-stead",
    name: `Figurine of Wondrous Power (Obsidian Stead)`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Obsidian Steed (Very Rare)._** This polished obsidian horse can become a **Nightmare** for up to 24 hours. The nightmare fights only to defend itself. Once it has been used, it can't be used again until 5 days have passed.

The figurine has a 10 percent chance each time you use it to ignore your orders, including a command to revert to figurine form. If you mount the nightmare while it is ignoring your orders, you and the nightmare are instantly transported to a random location on the plane of Hades, where the nightmare reverts to figurine form.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-onyx-dog",
    name: `Figurine of Wondrous Power (Onyx Dog)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Onyx Dog (Rare)._** This onyx statuette of a dog can become a **Mastiff** for up to 6 hours. The mastiff has an Intelligence of 8 and can speak Common. It also has Blindsight with a range of 60 feet. Once it has been used, it can't be used again until 7 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-serpentine-owl",
    name: `Figurine of Wondrous Power (Serpentine Owl)`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Serpentine Owl (Rare)._** This serpentine statuette of an owl can become a **Giant Owl** for up to 8 hours. The owl can communicate telepathically with you at any range if you and it are on the same plane of existence. Once it has been used, it can't be used again until 2 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-figurine-of-wondrous-power-silver-raven",
    name: `Figurine of Wondrous Power (Silver Raven)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description.

**_Silver Raven (Uncommon)._** This silver statuette of a raven can become a **Raven** for up to 12 hours. Once it has been used, it can't be used again until 2 days have passed. While in raven form, the figurine grants you the ability to cast *Animal Messenger* on it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flail-1",
    name: `Flail (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flail-2",
    name: `Flail (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flail-3",
    name: `Flail (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-battleaxe",
    name: `Flame Tongue Battleaxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-club",
    name: `Flame Tongue Club`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-dagger",
    name: `Flame Tongue Dagger`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-dart",
    name: `Flame Tongue Dart`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-flail",
    name: `Flame Tongue Flail`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-glaive",
    name: `Flame Tongue Glaive`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-greataxe",
    name: `Flame Tongue Greataxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-greatclub",
    name: `Flame Tongue Greatclub`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-greatsword",
    name: `Flame Tongue Greatsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-halberd",
    name: `Flame Tongue Halberd`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-handaxe",
    name: `Flame Tongue Handaxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-javelin",
    name: `Flame Tongue Javelin`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-lance",
    name: `Flame Tongue Lance`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-light-hammer",
    name: `Flame Tongue Light Hammer`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-longsword",
    name: `Flame Tongue Longsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-mace",
    name: `Flame Tongue Mace`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-maul",
    name: `Flame Tongue Maul`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-morningstar",
    name: `Flame Tongue Morningstar`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-pike",
    name: `Flame Tongue Pike`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-quarterstaff",
    name: `Flame Tongue Quarterstaff`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-rapier",
    name: `Flame Tongue Rapier`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-scimitar",
    name: `Flame Tongue Scimitar`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-shortsword",
    name: `Flame Tongue Shortsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-sickle",
    name: `Flame Tongue Sickle`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-spear",
    name: `Flame Tongue Spear`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-trident",
    name: `Flame Tongue Trident`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-war-pick",
    name: `Flame Tongue War Pick`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-warhammer",
    name: `Flame Tongue Warhammer`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-flame-tongue-whip",
    name: `Flame Tongue Whip`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40 foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-folding-boat",
    name: `Folding Boat`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring a Magic action to use: First Command Word. The box unfolds into a Rowboat. Second Command Word. The box unfolds into a Keelboat. Third Command Word. The Folding Boat folds back into a box if no creatures are aboard. Any objects in the vessel that can't fit inside the box remain outside the box as it folds. Any objects in the vessel that can fit inside the box do so. When the box becomes a vessel, its weight becomes that of a normal vessel its size, and anything that was stored in the box remains in the boat. Statistics for the Rowboat and Keelboat appear in "Equipment." If either vessel is reduced to 0 Hit Points, the Folding Boat is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-glaive",
    name: `Frost Brand (Glaive)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-greatsword",
    name: `Frost Brand (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-longsword",
    name: `Frost Brand (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-rapier",
    name: `Frost Brand (Rapier)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-scimitar",
    name: `Frost Brand (Scimitar)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-frost-brand-shortsword",
    name: `Frost Brand (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage. In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-gauntlets-of-ogre-power",
    name: `Gauntlets of Ogre Power`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `Your Strength is 19 while you wear these gauntlets. They have no effect on you if your Strength is 19 or higher without them.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-gem-of-brightness",
    name: `Gem of Brightness`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This prism has 50 charges. While you are holding it, you can take a Magic action and use one of three command words to cause one of the following effects: First Command Word. The gem sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. This effect doesn't expend a charge. It lasts until you take a Bonus Action to repeat the command word or until you use another function of the gem. Second Command Word. You expend 1 charge and cause the gem to fire a brilliant beam of light at one creature you can see within 60 feet of yourself. The creature must succeed on a DC 15 Constitution saving throw or have the Blinded condition for 1 minute. The creature repeats the save at the end of each of its turns, ending the effect on itself on a success. Third Command Word. You expend 5 charges and cause the gem to flare with intense light in a 30 foot Cone. Each creature in the Cone makes a saving throw as if struck by the beam created with the second command word. When all of the gem's charges are expended, the gem becomes a nonmagical jewel worth 50 GP.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-gem-of-seeing",
    name: `Gem of Seeing`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This gem has 3 charges. As a Magic action, you can expend 1 charge. For the next 10 minutes, you have Truesight out to 120 feet when you peer through the gem. The gem regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-battleaxe",
    name: `Giant Slayer (Battleaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-blowgun",
    name: `Giant Slayer (Blowgun)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-club",
    name: `Giant Slayer (Club)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-dagger",
    name: `Giant Slayer (Dagger)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-dart",
    name: `Giant Slayer (Dart)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-flail",
    name: `Giant Slayer (Flail)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-glaive",
    name: `Giant Slayer (Glaive)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-greataxe",
    name: `Giant Slayer (Greataxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-greatclub",
    name: `Giant Slayer (Greatclub)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-greatsword",
    name: `Giant Slayer (Greatsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-halberd",
    name: `Giant Slayer (Halberd)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-hand-crossbow",
    name: `Giant Slayer (Hand Crossbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-handaxe",
    name: `Giant Slayer (Handaxe)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-heavy-crossbow",
    name: `Giant Slayer (Heavy Crossbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-javelin",
    name: `Giant Slayer (Javelin)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-lance",
    name: `Giant Slayer (Lance)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-light-crossbow",
    name: `Giant Slayer (Light Crossbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-light-hammer",
    name: `Giant Slayer (Light Hammer)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-longbow",
    name: `Giant Slayer (Longbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-longsword",
    name: `Giant Slayer (Longsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-mace",
    name: `Giant Slayer (Mace)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-maul",
    name: `Giant Slayer (Maul)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-morningstar",
    name: `Giant Slayer (Morningstar)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-musket",
    name: `Giant Slayer (Musket)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-pike",
    name: `Giant Slayer (Pike)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-pistol",
    name: `Giant Slayer (Pistol)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-quarterstaff",
    name: `Giant Slayer (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-rapier",
    name: `Giant Slayer (Rapier)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-scimitar",
    name: `Giant Slayer (Scimitar)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-shortbow",
    name: `Giant Slayer (Shortbow)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-shortsword",
    name: `Giant Slayer (Shortsword)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-sickle",
    name: `Giant Slayer (Sickle)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-sling",
    name: `Giant Slayer (Sling)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-spear",
    name: `Giant Slayer (Spear)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-trident",
    name: `Giant Slayer (Trident)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-war-pick",
    name: `Giant Slayer (War Pick)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-warhammer",
    name: `Giant Slayer (Warhammer)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-giant-slayer-whip",
    name: `Giant Slayer (Whip)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.

When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-of-life-stealing",
    name: `Glaive of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-of-sharpness",
    name: `Glaive of Sharpness`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic weapon and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-of-wounding",
    name: `Glaive of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-1",
    name: `Glaive (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-2",
    name: `Glaive (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glaive-3",
    name: `Glaive (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-glamoured-studded-leather",
    name: `Glamoured Studded Leather`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While wearing this armor, you gain a +1 bonus to Armor Class. You can also take a Bonus Action to cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like—including color, style, and accessories—but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or doff the armor.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-gloves-of-missile-snaring",
    name: `Gloves of Missile Snaring`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `If you're hit by an attack roll made with a Ranged or Thrown weapon while wearing these gloves, you can take a Reaction to reduce the damage by 1d10 plus your Dexterity modifier if you have a free hand. If you reduce the damage to 0, you can catch the ammunition or weapon if it is small enough for you to hold in that hand.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-gloves-of-swimming-and-climbing",
    name: `Gloves of Swimming and Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing these gloves, you have a Climb Speed and a Swim Speed equal to your Speed, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-goggles-of-night",
    name: `Goggles of Night`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing these dark lenses, you have Darkvision out to 60 feet. If you already have Darkvision, wearing the goggles increases its range by 60 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greataxe-1",
    name: `Greataxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greataxe-2",
    name: `Greataxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greataxe-3",
    name: `Greataxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatclub-1",
    name: `Greatclub (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatclub-2",
    name: `Greatclub (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatclub-3",
    name: `Greatclub (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-of-life-stealing",
    name: `Greatsword of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-of-sharpness",
    name: `Greatsword of Sharpness`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic weapon and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-of-wounding",
    name: `Greatsword of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-1",
    name: `Greatsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-2",
    name: `Greatsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-greatsword-3",
    name: `Greatsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-halberd-1",
    name: `Halberd (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-halberd-2",
    name: `Halberd (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-halberd-3",
    name: `Halberd (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-half-plate-armor-of-etherealness",
    name: `Half Plate Armor of Etherealness`,
    category: `Armor`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While you're wearing this armor, you can take a Magic action and use a command word to gain the effect of the Etherealness spell. The spell ends immediately if you remove the armor or take a Magic action to repeat the command word. This property of the armor can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-half-plate-armor-1",
    name: `Half Plate Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-half-plate-armor-2",
    name: `Half Plate Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-half-plate-armor-3",
    name: `Half Plate Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hammer-of-thunderbolts-maul",
    name: `Hammer of Thunderbolts (Maul)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The weapon has 5 charges. You can expend 1 charge and make a ranged attack with the weapon, hurling it as if it had the Thrown property with a normal range of 20 feet and a long range of 60 feet. If the attack hits, the weapon unleashes a thunderclap audible out to 300 feet. The target and every creature within 30 feet of it other than you must succeed on a DC 17 Constitution saving throw or have the Stunned condition until the end of your next turn. Immediately after hitting or missing, the weapon flies back to your hand. The weapon regains 1d4 + 1 expended charges daily at dawn. Giant's Bane. While you are attuned to the weapon and wearing either a Belt of Giant Strength or Gauntlets of Ogre Power to which you are also attuned, you gain the following benefits: Giants' Bane. When you roll a 20 on the d20 for an attack roll made with this weapon against a Giant, the creature must succeed on a DC 17 Constitution saving throw or die. Might of Giants. The Strength score bestowed by your Belt of Giant Strength or Gauntlets of Ogre Power increases by 4, to a maximum of 30.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hammer-of-thunderbolts-warhammer",
    name: `Hammer of Thunderbolts (Warhammer)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The weapon has 5 charges. You can expend 1 charge and make a ranged attack with the weapon, hurling it as if it had the Thrown property with a normal range of 20 feet and a long range of 60 feet. If the attack hits, the weapon unleashes a thunderclap audible out to 300 feet. The target and every creature within 30 feet of it other than you must succeed on a DC 17 Constitution saving throw or have the Stunned condition until the end of your next turn. Immediately after hitting or missing, the weapon flies back to your hand. The weapon regains 1d4 + 1 expended charges daily at dawn. Giant's Bane. While you are attuned to the weapon and wearing either a Belt of Giant Strength or Gauntlets of Ogre Power to which you are also attuned, you gain the following benefits: Giants' Bane. When you roll a 20 on the d20 for an attack roll made with this weapon against a Giant, the creature must succeed on a DC 17 Constitution saving throw or die. Might of Giants. The Strength score bestowed by your Belt of Giant Strength or Gauntlets of Ogre Power increases by 4, to a maximum of 30.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hand-crossbow-1",
    name: `Hand Crossbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hand-crossbow-2",
    name: `Hand Crossbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hand-crossbow-3",
    name: `Hand Crossbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-handaxe-1",
    name: `Handaxe (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-handaxe-2",
    name: `Handaxe (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-handaxe-3",
    name: `Handaxe (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-handy-haversack",
    name: `Handy Haversack`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 200 pounds of material, not exceeding a volume of 25 cubic feet. The central pouch can hold up to 500 pounds of material, not exceeding a volume of 64 cubic feet. The haversack always weighs 5 pounds, regardless of its contents. Retrieving an item from the haversack requires a Utilize action or a Bonus Action (your choice). When you reach into the haversack for a specific item, the item is always magically on top. If any of its pouches is overloaded, pierced, or torn, the haversack ruptures and is destroyed. If the haversack is destroyed, its contents are lost forever, although an Artifact always turns up again somewhere. If the haversack is turned inside out, its contents spill forth unharmed, and the haversack must be put right before it can be used again. Each pouch of the haversack holds enough air for 10 minutes of breathing, divided by the number of breathing creatures inside. Placing the haversack inside an extradimensional space created by a Bag of Holding, Portable Hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hat-of-disguise",
    name: `Hat of Disguise`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this hat, you can cast the Disguise Self spell. The spell ends if the hat is removed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-headband-of-intellect",
    name: `Headband of Intellect`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `Your Intelligence is 19 while you wear this headband. It has no effect on you if your Intelligence is 19 or higher without it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-heavy-crossbow-1",
    name: `Heavy Crossbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-heavy-crossbow-2",
    name: `Heavy Crossbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-heavy-crossbow-3",
    name: `Heavy Crossbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-helm-of-brilliance",
    name: `Helm of Brilliance`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic. You gain the following benefits while wearing the helm. Diamond Light. As long as it has at least one diamond, the helm emits a 30-foot Emanation. When at least one Undead is within that area, the Emanation is filled with Dim Light. Any Undead that starts its turn in that area takes 1d6 Radiant damage. Fire Opal Flames. As long as the helm has at least one fire opal, you can take a Magic action to cause one weapon you are holding to burst into flames. The flames emit Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The flames are harmless to you and the weapon. When you hit with an attack using the blazing weapon, the target takes an extra 1d6 Fire damage. The flames last until you take a Bonus Action to extinguish them or until you drop or stow the weapon. Ruby Resistance. As long as the helm has at least one ruby, you have Resistance to Fire damage. Spells. You can cast one of the following spells (save DC 18), using one of the helm's gems of the specified type as a component: Daylight (opal), Fireball (fire opal), Prismatic Spray (diamond), or Wall of Fire (ruby). The gem is destroyed when the spell is cast and disappears from the helm. Taking Fire Damage. Roll 1d20 if you are wearing the helm and take Fire damage as a result of failing a saving throw against a spell. On a roll of 1, the helm emits beams of light from its remaining gems and is then destroyed. Each creature within a 60 foot Emanation originating from you must succeed on a DC 17 Dexterity saving throw or be struck by a beam, taking Radiant damage equal to the number of gems in the helm.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-helm-of-comprehending-languages",
    name: `Helm of Comprehending Languages`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this helm, you can cast Comprehend Languages from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-helm-of-telepathy",
    name: `Helm of Telepathy`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this helm, you have telepathy with a range of 30 feet, and you can cast Detect Thoughts or Suggestion (save DC 13) from the helm. Once either spell is cast from the helm, that spell can't be cast from it again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-helm-of-teleportation",
    name: `Helm of Teleportation`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This helm has 3 charges. While wearing it, you can expend 1 charge to cast Teleport from it. The helm regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hide-armor-1",
    name: `Hide Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hide-armor-2",
    name: `Hide Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-hide-armor-3",
    name: `Hide Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger",
    name: `Holy Avenger`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage. While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-battleaxe",
    name: `Holy Avenger (Battleaxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-blowgun",
    name: `Holy Avenger (Blowgun)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-club",
    name: `Holy Avenger (Club)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-dagger",
    name: `Holy Avenger (Dagger)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-dart",
    name: `Holy Avenger (Dart)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-flail",
    name: `Holy Avenger (Flail)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-glaive",
    name: `Holy Avenger (Glaive)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-greataxe",
    name: `Holy Avenger (Greataxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-greatclub",
    name: `Holy Avenger (Greatclub)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-greatsword",
    name: `Holy Avenger (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-halberd",
    name: `Holy Avenger (Halberd)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-hand-crossbow",
    name: `Holy Avenger (Hand Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-handaxe",
    name: `Holy Avenger (Handaxe)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-heavy-crossbow",
    name: `Holy Avenger (Heavy Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-javelin",
    name: `Holy Avenger (Javelin)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-lance",
    name: `Holy Avenger (Lance)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-light-crossbow",
    name: `Holy Avenger (Light Crossbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-light-hammer",
    name: `Holy Avenger (Light Hammer)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-longbow",
    name: `Holy Avenger (Longbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-longsword",
    name: `Holy Avenger (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-mace",
    name: `Holy Avenger (Mace)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-maul",
    name: `Holy Avenger (Maul)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-morningstar",
    name: `Holy Avenger (Morningstar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-musket",
    name: `Holy Avenger (Musket)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-pike",
    name: `Holy Avenger (Pike)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-pistol",
    name: `Holy Avenger (Pistol)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-quarterstaff",
    name: `Holy Avenger (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-rapier",
    name: `Holy Avenger (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-scimitar",
    name: `Holy Avenger (Scimitar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-shortbow",
    name: `Holy Avenger (Shortbow)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-shortsword",
    name: `Holy Avenger (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-sickle",
    name: `Holy Avenger (Sickle)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-sling",
    name: `Holy Avenger (Sling)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-spear",
    name: `Holy Avenger (Spear)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-trident",
    name: `Holy Avenger (Trident)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-war-pick",
    name: `Holy Avenger (War Pick)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-warhammer",
    name: `Holy Avenger (Warhammer)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-holy-avenger-whip",
    name: `Holy Avenger (Whip)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.

While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-horn-of-blasting",
    name: `Horn of Blasting`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You can take a Magic action to blow the horn, which emits a thunderous blast in a 30-foot Cone that is audible out to 600 feet. Each creature in the Cone makes a DC 15 Constitution saving throw. On a failed save, a creature takes 5d8 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only. Glass or crystal objects in the Cone that aren't being worn or carried take 10d8 Thunder damage. Each use of the horn's magic has a 20 percent chance of causing the horn to explode. The explosion deals 10d6 Force damage to the user and destroys the horn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-horn-of-valhalla",
    name: `Horn of Valhalla`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the **Berserker** stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed.

Four types of *Horn of Valhalla* are known to exist, each made of a different metal. The horn's type determines how many spirits it summons, as well as the requirement for its use. The GM chooses the horn's type or determines it randomly by rolling on the following table.

If you blow the horn without meeting its requirement, the summoned spirits attack you. If you meet the requirement, they are Friendly to you and your allies and follow your commands.

| 1d100 | Horn Type | Spirits | Requirement                          |
|-------|-----------|---------|--------------------------------------|
| 01–40 | Silver    | 2       | None                                 |
| 41–75 | Brass     | 3       | Proficiency with all Simple weapons  |
| 76–90 | Bronze    | 4       | Training with all Medium armor       |
| 91–00 | Iron      | 5       | Proficiency with all Martial weapons |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-horseshoes-of-a-zephyr",
    name: `Horseshoes of a Zephyr`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action. While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above a surface. This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores Difficult Terrain. In addition, the creature can travel for up to 12 hours a day without gaining Exhaustion levels from extended travel.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-horseshoes-of-speed",
    name: `Horseshoes of Speed`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action. While all four horseshoes are attached to the same creature, its Speed is increased by 30 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-immovable-rod",
    name: `Immovable Rod`,
    category: `Rod`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This iron rod has a button on one end. You can take a Utilize action to press the button, which causes the rod to become magically fixed in place. Until you or another creature takes a Utilize action to push the button again, the rod doesn't move, even if it defies gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can take a Utilize action to make a DC 30 Strength (Athletics) check, moving the fixed rod up to 10 feet on a successful check.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-instant-fortress",
    name: `Instant Fortress`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `As a Magic action, you can place this 1-inch adamantine statuette on the ground and, using a command word, cause it to grow rapidly into a square adamantine tower. Repeating the command word causes the tower to revert to statuette form, which works only if the tower is empty. Each creature in the area where the tower appears is pushed to an unoccupied space outside but next to the tower. Objects in the area that aren't being worn or carried are also pushed clear of the tower. The tower is 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior is divided into two floors, with a ladder, staircase, or ramp (your choice) connecting them. This ladder, staircase, or ramp ends at a trapdoor leading to the roof. When created, the tower has a single door at ground level on the side facing you. The door opens only at your command, which you can issue as a Bonus Action. It is immune to the Knock spell and similar magic. Magic prevents the tower from being tipped over. The roof, the door, and the walls each have AC 20; HP 100; Immunity to Bludgeoning, Piercing, and Slashing damage except that which is dealt by siege equipment; and Resistance to all other damage. Shrinking the tower back down to statuette form doesn't repair damage to the tower. Only a Wish spell can repair the tower (this use of the spell counts as replicating a spell of level 8 or lower). Each casting of Wish causes the tower to regain all its Hit Points.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-iron-bands",
    name: `Iron Bands`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can take a Magic action to throw the sphere at a Huge or smaller creature you can see within 60 feet of yourself. As the sphere moves through the air, it opens into a tangle of metal bands. Make a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your Proficiency Bonus. On a hit, the target has the Restrained condition until you take a Bonus Action to issue a command that releases it. Doing so or missing with the attack causes the bands to contract and become a sphere once more. A creature that can touch the bands, including the one Restrained, can take an action to make a DC 20 Strength (Athletics) check to break the iron bands. On a successful check, the item is destroyed, and the Restrained creature is freed. On a failed check, any further attempts made by that creature automatically fail until 24 hours have elapsed. Once the bands are used, they can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-iron-flask",
    name: `Iron Flask`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `While holding this brass-stoppered iron flask, you can take a Magic action to target a creature that you can see within 60 feet of yourself. If the flask is empty and the target is native to a plane of existence other than the one you're on, the target must succeed on a DC 17 Wisdom saving throw or be trapped in the flask. If the target has been trapped by the flask before, it has Advantage on the save. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn't age and doesn't need to breathe, eat, or drink. You can take a Magic action to remove the flask's stopper and release the creature in the flask. The creature then obeys your commands for 1 hour, understanding those commands even if it doesn't know the language in which the commands are given. If you issue no commands or give the creature a command that is likely to result in its death or imprisonment, it defends itself but otherwise takes no actions. At the end of the duration, the creature acts in accordance with its normal disposition and alignment. An Identify spell reveals if the flask contains a creature, but the only way to determine the type of creature is to open the flask. A newly discovered Iron Flask might already contain a creature chosen by the GM.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-javelin-of-lightning",
    name: `Javelin of Lightning`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Each time you make an attack roll with this magic weapon and hit, you can have it deal Lightning damage instead of Piercing damage. Lightning Bolt. When you throw this weapon at a target no farther than 120 feet from you, you can forgo making a ranged attack roll and instead turn the weapon into a bolt of lightning. This bolt forms a 5-foot-wide Line between you and the target. The target and each other creature in the Line (excluding you) makes a DC 13 Dexterity saving throw, taking 4d6 Lightning damage on a failed save or half as much damage on a successful one. Immediately after dealing this damage, the weapon reappears in your hand. This property can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-javelin-1",
    name: `Javelin (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-javelin-2",
    name: `Javelin (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-javelin-3",
    name: `Javelin (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-lance-1",
    name: `Lance (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-lance-2",
    name: `Lance (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-lance-3",
    name: `Lance (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-lantern-of-revealing",
    name: `Lantern of Revealing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's Bright Light. You can take a Utilize action to lower the hood, reducing the lantern's light to Dim Light in a 5-foot radius.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-leather-armor-1",
    name: `Leather Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-leather-armor-2",
    name: `Leather Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-leather-armor-3",
    name: `Leather Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-crossbow-1",
    name: `Light Crossbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-crossbow-2",
    name: `Light Crossbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-crossbow-3",
    name: `Light Crossbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-hammer-1",
    name: `Light Hammer (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-hammer-2",
    name: `Light Hammer (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-light-hammer-3",
    name: `Light Hammer (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longbow-1",
    name: `Longbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longbow-2",
    name: `Longbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longbow-3",
    name: `Longbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-of-life-stealing",
    name: `Longsword of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-of-sharpness",
    name: `Longsword of Sharpness`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic weapon and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-of-wounding",
    name: `Longsword of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-1",
    name: `Longsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-2",
    name: `Longsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-longsword-3",
    name: `Longsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-glaive",
    name: `Luck Blade (Glaive)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-greatsword",
    name: `Luck Blade (Greatsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-longsword",
    name: `Luck Blade (Longsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-rapier",
    name: `Luck Blade (Rapier)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-scimitar",
    name: `Luck Blade (Scimitar)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-shortsword",
    name: `Luck Blade (Shortsword)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-luck-blade-sickle",
    name: `Luck Blade (Sickle)`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws. Luck. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn. Wish. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-of-disruption",
    name: `Mace of Disruption`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a Fiend or an Undead with this magic weapon, that creature takes an extra 2d6 Radiant damage. If the target has 25 Hit Points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature has the Frightened condition until the end of your next turn. Light. While you hold this weapon, it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-of-smiting",
    name: `Mace of Smiting`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The bonus increases to +3 when you use the weapon to attack a Construct. When you roll a 20 on an attack roll made with this weapon, the target takes an extra 7 Bludgeoning damage, or 14 Bludgeoning damage if it's a Construct. If a Construct has 25 Hit Points or fewer after taking this damage, it is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-of-terror",
    name: `Mace of Terror`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This magic weapon has 3 charges and regains 1d3 expended charges daily at dawn. While holding the weapon, you can take a Magic action and expend 1 charge to release a wave of terror from it. Each creature of your choice within 30 feet of you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute. While Frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't make Opportunity Attacks. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can take the Dodge action. At the end of each of its turns, a creature repeats the save, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-1",
    name: `Mace (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-2",
    name: `Mace (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mace-3",
    name: `Mace (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mantle-of-spell-resistance",
    name: `Mantle of Spell Resistance`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You have Advantage on saving throws against spells while you wear this cloak.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-manual-of-bodily-health",
    name: `Manual of Bodily Health`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains health and nutrition tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution increases by 2, to a maximum of 30. The manual then loses its magic but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-manual-of-gainful-exercise",
    name: `Manual of Gainful Exercise`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength increases by 2, to a maximum of 30. The manual then loses its magic but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-manual-of-golems",
    name: `Manual of Golems`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This tome contains information and incantations necessary to make a particular type of golem. The GM chooses the type or determines it randomly by rolling on the accompanying table. To decipher and use the manual, you must be a spellcaster with at least two level 5 spell slots. A creature that can't use a *Manual of Golems* and attempts to read it takes 6d6 Psychic damage.

To create a golem, you must spend the time shown on the table, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay the specified cost to purchase supplies.

Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual are sprinkled on it. See "Monsters" for the golem's stat block. The golem is under your control, and it understands and obeys your commands.

| 1d20  | Golem       | Time     | Cost       |
|-------|-------------|----------|------------|
| 1–5   | Clay Golem  | 30 days  | 65,000 GP  |
| 6–17  | Flesh Golem | 60 days  | 50,000 GP  |
| 18    | Iron Golem  | 120 days | 100,000 GP |
| 19–20 | Stone Golem | 90 days  | 80,000 GP  |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-manual-of-quickness-of-action",
    name: `Manual of Quickness of Action`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity increases by 2, to a maximum of 30. The manual then loses its magic but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-marvelous-pigments",
    name: `Marvelous Pigments`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This fine wooden box contains 1d4 pots of pigment and a brush (weighing 1 pound in total). Using the brush and expending 1 pot of pigment, you can paint any number of three-dimensional objects and terrain features (such as walls, doors, trees, flowers, weapons, webs, and pits), provided these elements are all confined to a 20-foot Cube. The effort takes 10 minutes (regardless of the number of elements you create), during which time you must remain in the Cube, and requires Concentration. If your Concentration is broken or you leave the Cube before the work is done, all the painted elements vanish, and the pot of pigment is wasted. When the work is done, all the painted objects and terrain features become real. Thus, painting a door on a wall creates an actual door, which can be opened to whatever is beyond. Painting a pit creates a real pit, the entire depth of which must lie within the 20-foot Cube. No object created by a pot of pigment can have a value greater than 25 GP, and the total value of all objects created by a pot of pigment can't exceed 500 GP. If you paint objects of greater value (such as a large pile of gold), they look authentic, but close inspection reveals they're made from paste, cookies, or some other worthless material. If you paint a form of energy such as fire or lightning, the energy dissipates as soon as you complete the painting, doing no harm.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-maul-1",
    name: `Maul (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-maul-2",
    name: `Maul (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-maul-3",
    name: `Maul (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-medallion-of-thoughts",
    name: `Medallion of Thoughts`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `The medallion has 5 charges. While wearing it, you can expend 1 charge to cast Detect Thoughts (save DC 13) from it. The medallion regains 1d4 expended charges daily at dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mirror-of-life-trapping",
    name: `Mirror of Life Trapping`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When this 4-foot-tall, 2-foot-wide mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, HP 10, Immunity to Poison and Psychic damage, and Vulnerability to Bludgeoning damage. It shatters and is destroyed when reduced to 0 Hit Points. If the mirror is hanging on a vertical surface and you are within 5 feet of it, you can take a Magic action and use a command word to activate it. It remains activated until you take a Magic action and repeat the command word to deactivate it. Any creature other than you that sees its reflection in the activated mirror while within 30 feet of the mirror must succeed on a DC 15 Charisma saving throw or be trapped, along with anything it is wearing or carrying, in one of the mirror's twelve extradimensional cells. A creature that knows the mirror's nature makes the save with Advantage, and Constructs succeed on the save automatically. An extradimensional cell is an infinite expanse filled with thick fog that reduces visibility to 10 feet. Creatures trapped in the mirror's cells don't age, and they don't need to eat, drink, or sleep. A creature trapped within a cell can escape using magic that permits planar travel. Otherwise, the creature is confined to the cell until freed. If the mirror traps a creature but its twelve extradimensional cells are already occupied, the mirror frees one trapped creature at random to accommodate the new prisoner. A freed creature appears in an unoccupied space within sight of the mirror but facing away from it. If the mirror is shattered, all creatures it contains are freed and appear in unoccupied spaces near it. While within 5 feet of the mirror, you can take a Magic action to name one creature trapped in it or call out a particular cell by number. The creature named or contained in the named cell appears as an image on the mirror's surface. You and the creature can then communicate. In a similar way, you can take a Magic action and use a second command word to free one creature trapped in the mirror. The freed creature appears, along with its possessions, in the unoccupied space nearest to the mirror and facing away from it. Placing the mirror inside an extradimensional space created by a Bag of Holding, Portable Hole, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-breastplate",
    name: `Mithral Armor (Breastplate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-chain-mail",
    name: `Mithral Armor (Chain Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-chain-shirt",
    name: `Mithral Armor (Chain Shirt)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-half-plate",
    name: `Mithral Armor (Half Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-plate",
    name: `Mithral Armor (Plate)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-ring-mail",
    name: `Mithral Armor (Ring Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-scale-mail",
    name: `Mithral Armor (Scale Mail)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mithral-armor-splint",
    name: `Mithral Armor (Splint)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-morningstar-1",
    name: `Morningstar (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-morningstar-2",
    name: `Morningstar (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-morningstar-3",
    name: `Morningstar (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-musket-1",
    name: `Musket (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-musket-2",
    name: `Musket (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-musket-3",
    name: `Musket (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-mysterious-deck",
    name: `Mysterious Deck`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75 percent) of these decks have thirteen cards, but some have twenty-two. Use the appropriate column of the Mysterious Deck table when randomly determining cards drawn from the deck.

Before you draw a card, you must declare how many cards you intend to draw and then draw them randomly. Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number, the remaining number of cards fly from the deck on their own and take effect all at once.

Once a card is drawn, it disappears. Unless the card is the Fool or Jester, the card reappears in the deck, making it possible to draw the same card twice. (Once the Fool or Jester has left the deck, reroll on the table if that card comes up again.)

Table: Mysterious Deck

| 1d100 (13-Card Deck) | 1d100 (22-Card Deck) | Card    |
|----------------------|----------------------|---------|
| —                    | 01–05                | Balance |
| —                    | 06–10                | Comet   |
| —                    | 11–14                | Donjon  |
| 01–08                | 15–18                | Euryale |
| —                    | 19–23                | Fates   |
| 09–16                | 24–27                | Flames  |
| —                    | 28–31                | Fool    |
| —                    | 32–36                | Gem     |
| 17–24                | 37–41                | Jester  |
| 25–32                | 42–46                | Key     |
| 33–40                | 47–51                | Knight  |
| 41–48                | 52–56                | Moon    |
| —                    | 57–60                | Puzzle  |
| 49–56                | 61–64                | Rogue   |
| 57–64                | 65–68                | Ruin    |
| —                    | 69–73                | Sage    |
| 65–72                | 74–77                | Skull   |
| 73–80                | 78–82                | Star    |
| 81–88                | 83–87                | Sun     |
| —                    | 88–91                | Talons  |
| 89–96                | 92–96                | Throne  |
| 97–00                | 97–00                | Void    |

Each card's effect is described below.

**_Balance._** You can increase one of your ability scores by 2, to a maximum of 22, provided you also decrease another one of your ability scores by 2. You can't decrease an ability that has a score of 5 or lower. Alternatively, you can choose not to adjust your ability scores, in which case this card has no effect.

**_Comet._** The next time you enter combat against one or more Hostile creatures, you can select one of them as your foe when you roll Initiative. If you reduce your foe to 0 Hit Points during that combat, you have Advantage on Death Saving Throws for 1 year. If someone else reduces your chosen foe to 0 Hit Points or you don't choose a foe, this card has no effect.

**_Euryale._** The card's medusa-like visage curses you. You take a −2 penalty to saving throws while cursed in this way. Only a god or the magic of the Fates card can end this curse.

**_Fates._** Reality's fabric unravels and spins anew, allowing you to avoid or erase one event as if it never happened. You can use the card's magic as soon as you draw the card or at any other time before you die.

**_Flames._** A powerful devil becomes your enemy. The devil seeks your ruin and torments you, savoring your suffering before attempting to slay you. This enmity lasts until either you or the devil dies.

**_Fool._** You have Disadvantage on D20 Tests for the next 72 hours. Draw another card; this draw doesn't count as one of your declared draws.

**_Gem._** Twenty-five pieces of jewelry worth 2,000 GP each or fifty gems worth 1,000 GP each appear at your feet.

**_Jester._** You have Advantage on D20 Tests for the next 72 hours, or you can draw two additional cards beyond your declared draws.

**_Key._** A Rare or rarer magic weapon with which you are proficient appears on your person. The GM chooses the weapon.

**_Knight._** You gain the service of a **Knight**, who magically appears in an unoccupied space you choose within 30 feet of yourself. The knight has the same alignment as you and serves you loyally until death, believing the two of you have been drawn together by fate. Work with your GM to create a name and backstory for this NPC. The GM can use a different stat block to represent the knight, as desired.

**_Moon._** You gain the ability to cast *Wish* 1d3 times.

**_Puzzle._** Permanently reduce your Intelligence or Wisdom by 1d4 + 1 (to a minimum score of 1). You can draw one additional card beyond your declared draws.

**_Rogue._** An NPC of the GM's choice becomes Hostile toward you. You don't know the identity of this NPC until they or someone else reveals it. Nothing less than a *Wish* spell or divine intervention can end the NPC's hostility toward you.

**_Ruin._** All forms of wealth that you carry or own, other than magic items, are lost to you. Portable property vanishes. Businesses, buildings, and land you own are lost in a way that alters reality the least. Any documentation that proves you should own something lost to this card also disappears.

**_Sage._** At any time you choose within one year of drawing this card, you can ask a question in meditation and mentally receive a truthful answer to that question.

**_Skull._** An **Avatar of Death** (see the accompanying stat block) appears in an unoccupied space as close

to you as possible. The avatar targets only you with its attacks, appearing as a ghostly skeleton clad in a tattered black robe and carrying a spectral scythe. The avatar disappears when it drops to 0 Hit Points or you die. If an ally of yours deals damage to the avatar, that ally summons another **Avatar of Death**. The new avatar appears in an unoccupied space as close to that ally as possible and targets only that ally with its attacks. You and your allies can each summon only one avatar as a consequence of this draw. A creature slain by an avatar can't be restored to life.

**_Star._** Increase one of your ability scores by 2, to a maximum of 24.

**_Sun._** A magic item (chosen by the GM) appears on your person. In addition, you gain 10 Temporary Hit Points daily at dawn until you die.

**_Talons._** Every magic item you wear or carry disintegrates. Artifacts in your possession vanish instead.

**_Throne._** You gain proficiency and Expertise in your choice of History, Insight, Intimidation, or Persuasion. In addition, you gain rightful ownership of a small keep somewhere in the world. However, the keep is currently home to one or more monsters, which must be cleared out before you can claim the keep as yours.

**_Void._** Your soul is drawn from your body and contained in an object in a place of the GM's choice. One or more powerful beings guard the place. While your soul is trapped in this way, your body is inert, ceases aging, and requires no food, air, or water. A *Wish* spell can't return your soul to your body, but the spell reveals the location of the object that holds your soul. You draw no more cards.

> #### Avatar of Death
> 
> *Medium Undead, Neutral evil*
> 
> **AC** 20 
>
> **Initiative** +3 (13) 
>
> **HP** Half the HP maximum of its summoner 
>
> **Speed** 60 ft., Fly 60 ft. (hover)
>
> | Attribute | Score | Mod | Save |
> |-----------|-------|-----|------|
> | Str       | 16    | +3  | +3   |
> | Dex       | 16    | +3  | +3   |
> | Con       | 16    | +3  | +3   |
> | Int       | 16    | +3  | +3   |
> | Wis       | 16    | +3  | +3   |
> | Cha       | 16    | +3  | +3   |
> 
>
> **Immunities** Necrotic, Poison; Charmed, Exhaustion, Frightened, Paralyzed, Petrified, Poisoned, Unconscious 
>
> **Senses** Truesight 60 ft., Passive Perception 13 
>
> **Languages** All languages known to its summoner 
>
> **CR** None (XP 0; PB equals its summoner's)
>
> ##### Traits
>
> **_Incorporeal Movement._** The avatar can move through other creatures and objects as if they were Difficult Terrain. It takes 5 (1d10) Force damage if it ends its turn inside an object.
>
> ##### Actions
>
> **_Multiattack._** The avatar makes a number of Reaping Scythe attacks equal to half the summoner's Proficiency Bonus (rounded up).
>
> **_Reaping Scythe. Melee Attack Roll:_** Automatic hit, reach 5 ft. *Hit:* 7 (1d8 + 3) Slashing damage plus 4 (1d8) Necrotic damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-necklace-of-adaptation",
    name: `Necklace of Adaptation`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this necklace, you can breathe normally in any environment, and you have Advantage on saving throws made to avoid or end the Poisoned condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-necklace-of-fireballs",
    name: `Necklace of Fireballs`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This necklace has 1d6 + 3 beads hanging from it. You can take a Magic action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a level 3 Fireball (save DC 15). You can hurl multiple beads, or even the whole necklace, at one time. When you do so, increase the damage of the Fireball by 1d6 for each bead after the first (maximum 12d6).`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-necklace-of-prayer-beads",
    name: `Necklace of Prayer Beads`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many nonmagical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic.

Six types of magic beads exist. The GM decides the type of each bead on the necklace or determines it randomly by rolling on the table below. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a Bonus Action (using your spell save DC if a save is necessary). Once a magic bead's spell is cast, that bead can't be used again until the next dawn.

| 1d20  | Bead                 | Spell                         |
|-------|----------------------|-------------------------------|
| 1–6   | Bead of Blessing     | Bless                         |
| 7–12  | Bead of Curing       | Cure Wounds (level 2 version) |
| 13–16 | Bead of Favor        | Greater Restoration           |
| 17–18 | Bead of Smiting      | Shining Smite                 |
| 19    | Bead of Summons      | Guardian of Faith             |
| 20    | Bead of Wind Walking | Wind Walk                     |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-battleaxe",
    name: `Nine Lives Stealer (Battleaxe)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-blowgun",
    name: `Nine Lives Stealer (Blowgun)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-club",
    name: `Nine Lives Stealer (Club)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-dagger",
    name: `Nine Lives Stealer (Dagger)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-dart",
    name: `Nine Lives Stealer (Dart)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-flail",
    name: `Nine Lives Stealer (Flail)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-glaive",
    name: `Nine Lives Stealer (Glaive)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-greataxe",
    name: `Nine Lives Stealer (Greataxe)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-greatclub",
    name: `Nine Lives Stealer (Greatclub)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-greatsword",
    name: `Nine Lives Stealer (Greatsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-halberd",
    name: `Nine Lives Stealer (Halberd)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-hand-crossbow",
    name: `Nine Lives Stealer (Hand Crossbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-handaxe",
    name: `Nine Lives Stealer (Handaxe)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-heavy-crossbow",
    name: `Nine Lives Stealer (Heavy Crossbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-javelin",
    name: `Nine Lives Stealer (Javelin)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-lance",
    name: `Nine Lives Stealer (Lance)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-light-crossbow",
    name: `Nine Lives Stealer (Light Crossbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-light-hammer",
    name: `Nine Lives Stealer (Light Hammer)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-longbow",
    name: `Nine Lives Stealer (Longbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-longsword",
    name: `Nine Lives Stealer (Longsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-mace",
    name: `Nine Lives Stealer (Mace)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-maul",
    name: `Nine Lives Stealer (Maul)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-morningstar",
    name: `Nine Lives Stealer (Morningstar)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-musket",
    name: `Nine Lives Stealer (Musket)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-pike",
    name: `Nine Lives Stealer (Pike)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-pistol",
    name: `Nine Lives Stealer (Pistol)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-quarterstaff",
    name: `Nine Lives Stealer (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-rapier",
    name: `Nine Lives Stealer (Rapier)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-scimitar",
    name: `Nine Lives Stealer (Scimitar)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-shortbow",
    name: `Nine Lives Stealer (Shortbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-shortsword",
    name: `Nine Lives Stealer (Shortsword)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-sickle",
    name: `Nine Lives Stealer (Sickle)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-sling",
    name: `Nine Lives Stealer (Sling)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-spear",
    name: `Nine Lives Stealer (Spear)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-trident",
    name: `Nine Lives Stealer (Trident)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-war-pick",
    name: `Nine Lives Stealer (War Pick)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-warhammer",
    name: `Nine Lives Stealer (Warhammer)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-nine-lives-stealer-whip",
    name: `Nine Lives Stealer (Whip)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.

**Life Stealing.** The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-oathbow-longbow",
    name: `Oathbow (Longbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you nock an arrow on this bow, it whispers in Elvish, "Swift defeat to my enemies." When you use this weapon to make a ranged attack, you can utter or sign the following command words: "Swift death to you who have wronged me." The target of your attack becomes your sworn enemy until it dies or until dawn 7 days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn. When you make a ranged attack roll with this weapon against your sworn enemy, you have Advantage on the roll. In addition, your target gains no benefit from Half Cover or Three-Quarters Cover, and you suffer no Disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 Piercing damage. While your sworn enemy lives, you have Disadvantage on attack rolls with all other weapons.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-oathbow-shortbow",
    name: `Oathbow (Shortbow)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you nock an arrow on this bow, it whispers in Elvish, "Swift defeat to my enemies." When you use this weapon to make a ranged attack, you can utter or sign the following command words: "Swift death to you who have wronged me." The target of your attack becomes your sworn enemy until it dies or until dawn 7 days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn. When you make a ranged attack roll with this weapon against your sworn enemy, you have Advantage on the roll. In addition, your target gains no benefit from Half Cover or Three-Quarters Cover, and you suffer no Disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 Piercing damage. While your sworn enemy lives, you have Disadvantage on attack rolls with all other weapons.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-oil-of-etherealness",
    name: `Oil of Etherealness`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the Etherealness spell for 1 hour. Beads of this cloudy, gray oil form on the outside of its container and quickly evaporate.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-oil-of-sharpness",
    name: `Oil of Sharpness`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `One vial of this oil can coat one Melee weapon or twenty pieces of ammunition, but only ammunition and Melee weapons that are nonmagical and deal Slashing or Piercing damage are affected. Applying the oil takes 1 minute, after which the oil magically seeps into whatever it coats, turning the coated weapon into a +3 Weapon or the coated ammunition into +3 Ammunition. This clear, gelatinous oil sparkles with tiny, ultrathin silver shards.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-oil-of-slipperiness",
    name: `Oil of Slipperiness`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the Freedom of Movement spell for 8 hours. Alternatively, the oil can be poured on the ground as a Magic action, where it covers a 10-foot square, duplicating the effect of the Grease spell in that area for 8 hours. This sticky, black unguent is thick and heavy, but it flows quickly when poured.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-padded-armor-1",
    name: `Padded Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-padded-armor-2",
    name: `Padded Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-padded-armor-3",
    name: `Padded Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pearl-of-power",
    name: `Pearl of Power`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While this pearl is on your person, you can take a Magic action to regain one expended spell slot of level 3 or lower. Once you use the pearl, it can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-periapt-of-health",
    name: `Periapt of Health`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this pendant, you can take a Magic action to regain 2d4 + 2 Hit Points. Once used, this property can't be used again until the next dawn. In addition, you have Advantage on saving throws to avoid or end the Poisoned condition while you wear this pendant.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-periapt-of-proof-against-poison",
    name: `Periapt of Proof against Poison`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, you have Immunity to the Poisoned condition and Poison damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-periapt-of-wound-closure",
    name: `Periapt of Wound Closure`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this pendant, you gain the following benefits. Life Preservation. Whenever you make a Death Saving Throw, you can change a roll of 9 or lower to a 10, turning a failed save into a successful one. Natural Healing Boost. Whenever you roll a Hit Point Die to regain Hit Points, double the number of Hit Points it restores.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-philter-of-love",
    name: `Philter of Love`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `The next time you see a creature within 10 minutes after drinking this philter, you are charmed by that creature and have the Charmed condition for 1 hour. This rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pike-1",
    name: `Pike (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pike-2",
    name: `Pike (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pike-3",
    name: `Pike (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pipes-of-haunting",
    name: `Pipes of Haunting`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `These pipes have 3 charges and regain 1d3 expended charges daily at dawn. You can take a Magic action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature of your choice within 30 feet of you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute. A creature that fails the save repeats it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its save is immune to the effect of these pipes for 24 hours.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pipes-of-the-sewers",
    name: `Pipes of the Sewers`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While these pipes are on your person, ordinary rats and giant rats are Indifferent toward you and won't attack you unless you threaten or harm them. The pipes have 3 charges and regain 1d3 expended charges daily at dawn. If you play the pipes as a Magic action, you can take a Bonus Action to expend 1 to 3 charges, calling forth one Swarm of Rats with each expended charge if enough rats are within half a mile of you to be called in this fashion (as determined by the GM). If there aren't enough rats to form a swarm, the charge is wasted. Called swarms move toward the music by the shortest available route but aren't under your control otherwise. Whenever a Swarm of Rats that isn't under another creature's control comes within 30 feet of you while you are playing the pipes, the swarm makes a DC 15 Wisdom saving throw. On a successful save, the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours. On a failed save, the swarm is swayed by the pipes' music and becomes Friendly to you and your allies for as long as you continue to play the pipes each round as a Magic action. A Friendly swarm obeys your commands. If you issue no commands to a Friendly swarm, it defends itself but otherwise takes no actions. If a Friendly swarm starts its turn more than 30 feet away from you, your control over that swarm ends, and the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pistol-1",
    name: `Pistol (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pistol-2",
    name: `Pistol (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-pistol-3",
    name: `Pistol (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-plate-armor-of-etherealness",
    name: `Plate Armor of Etherealness`,
    category: `Armor`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While you're wearing this armor, you can take a Magic action and use a command word to gain the effect of the Etherealness spell. The spell ends immediately if you remove the armor or take a Magic action to repeat the command word. This property of the armor can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-plate-armor-1",
    name: `Plate Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-plate-armor-2",
    name: `Plate Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-plate-armor-3",
    name: `Plate Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-portable-hole",
    name: `Portable Hole`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can take a Magic action to unfold a Portable Hole and place it on or against a solid surface, whereupon the Portable Hole creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane of existence, so it can't be used to create open passages. Any creature inside an open Portable Hole can exit the hole by climbing out of it. You can take a Magic action to close a Portable Hole by taking hold of the edges of the cloth and folding it up. Folding the cloth closes the hole, and any creatures or objects within remain in the extradimensional space. No matter what's in it, the hole weighs next to nothing. If the hole is folded up, a creature within the hole's extradimensional space can take an action to make a DC 10 Strength (Athletics) check. On a successful check, the creature forces its way out and appears within 5 feet of the Portable Hole. A closed Portable Hole holds enough air for 1 hour of breathing, divided by the number of breathing creatures inside. Placing a Portable Hole inside an extradimensional space created by a Bag of Holding, Handy Haversack, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-animal-friendship",
    name: `Potion of Animal Friendship`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you can cast the level 3 version of the Animal Friendship spell (save DC 13). Agitating this potion's muddy liquid brings little bits into view: a fish scale, a hummingbird feather, a cat claw, or a squirrel hair.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-clairvoyance",
    name: `Potion of Clairvoyance`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the Clairvoyance spell (no Concentration required). An eyeball bobs in this potion's yellowish liquid but vanishes when the potion is opened.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-climbing",
    name: `Potion of Climbing`,
    category: `Potion`,
    rarity: `Common`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain a Climb Speed equal to your Speed for 1 hour. During this time, you have Advantage on Strength (Athletics) checks to climb. This potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-diminution",
    name: `Potion of Diminution`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the "reduce" effect of the Enlarge/Reduce spell for 1d4 hours (no Concentration required). The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-flying",
    name: `Potion of Flying`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain a Fly Speed equal to your Speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-gaseous-form",
    name: `Potion of Gaseous Form`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the Gaseous Form spell for 1 hour (no Concentration required) or until you end the effect as a Bonus Action. This potion's container seems to hold fog that moves and pours like water.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-growth",
    name: `Potion of Growth`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the "enlarge" effect of the Enlarge/Reduce spell for 10 minutes (no Concentration required). The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-heroism",
    name: `Potion of Heroism`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain 10 Temporary Hit Points that last for 1 hour. For the same duration, you are under the effect of the Bless spell (no Concentration required). This potion's blue liquid bubbles and steams as if boiling.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-invisibility",
    name: `Potion of Invisibility`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This potion's container looks empty but feels as though it holds liquid. When you drink the potion, you have the Invisible condition for 1 hour. The effect ends early if you make an attack roll, deal damage, or cast a spell.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-mind-reading",
    name: `Potion of Mind Reading`,
    category: `Potion`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the Detect Thoughts spell (save DC 13) for 10 minutes (no Concentration required). This potion's dense, purple liquid has an ovoid cloud of pink floating in it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-poison",
    name: `Potion of Poison`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This concoction looks, smells, and tastes like a Potion of Healing or another beneficial potion. However, it is actually poison masked by illusion magic. Identify reveals its true nature. If you drink this potion, you take 4d6 Poison damage and must succeed on a DC 13 Constitution saving throw or have the Poisoned condition for 1 hour.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-resistance",
    name: `Potion of Resistance`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `When you drink this potion, you have Resistance to one type of damage for 1 hour. The GM chooses the type or determines it randomly by rolling on the following table.

| 1d10 | Damage Type |
|------|-------------|
| 1    | Acid        |
| 2    | Cold        |
| 3    | Fire        |
| 4    | Force       |
| 5    | Lightning   |
| 6    | Necrotic    |
| 7    | Poison      |
| 8    | Psychic     |
| 9    | Radiant     |
| 10   | Thunder     |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-speed",
    name: `Potion of Speed`,
    category: `Potion`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `When you drink this potion, you gain the effect of the Haste spell for 1 minute (no Concentration required) without suffering the wave of lethargy that typically occurs when the effect ends. This potion's yellow fluid is streaked with black and swirls on its own.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-potion-of-water-breathing",
    name: `Potion of Water Breathing`,
    category: `Potion`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You can breathe underwater for 24 hours after drinking this potion. This potion's cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-quarterstaff-1",
    name: `Quarterstaff (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-quarterstaff-2",
    name: `Quarterstaff (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-quarterstaff-3",
    name: `Quarterstaff (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rapier-of-life-stealing",
    name: `Rapier of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rapier-of-wounding",
    name: `Rapier of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rapier-1",
    name: `Rapier (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rapier-2",
    name: `Rapier (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rapier-3",
    name: `Rapier (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-mail-1",
    name: `Ring Mail (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-mail-2",
    name: `Ring Mail (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-mail-3",
    name: `Ring Mail (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-animal-influence",
    name: `Ring of Animal Influence`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can expend 1 charge to cast one of the following spells (save DC 13) from it: - Animal Friendship - Fear (affects Beasts only) - Speak with Animals`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-djinni-summoning",
    name: `Ring of Djinni Summoning`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you can take a Magic action to summon a particular Djinni from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of yourself. It remains as long as you maintain Concentration, to a maximum of 1 hour, or until it drops to 0 Hit Points. While summoned, the djinni is Friendly to you and your allies, and it obeys your commands. If you fail to command it, the djinni defends itself against attackers but takes no other actions. After the djinni departs, it can't be summoned again for 24 hours, and the ring becomes nonmagical if the djinni dies. Rings of Djinni Summoning are often created by the djinn they summon and given to mortals as gifts of friendship or tokens of esteem.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-elemental-command",
    name: `Ring of Elemental Command`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `Each *Ring of Elemental Command* is linked to one of the four Elemental Planes. The GM chooses or randomly determines the linked plane. For example, a *Ring of Elemental Command* (air) is linked to the Elemental Plane of Air.

Every *Ring of Elemental Command* has the following two properties:

**_Elemental Bane._** While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.

**_Elemental Compulsion._** While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.

**_Elemental Focus._** While wearing the ring, you benefit from additional properties corresponding to the ring's linked Elemental Plane:

**Air.** You know Auran, you have Resistance to Lightning damage, and you have a Fly Speed equal to your Speed and can hover.

**Earth.** You know Terran, and you have Resistance to Acid damage. Terrain composed of rubble, rocks, or dirt isn't Difficult Terrain for you. In addition, you can move through solid earth or rock as if those areas were Difficult Terrain without disturbing the matter through which you pass. If you end your turn in solid earth or rock, you are shunted out to the nearest unoccupied space you last occupied.

**Fire.** You know Ignan, and you have Immunity to Fire damage.

**Water.** You know Aquan, you gain a Swim Speed of 60 feet, and you can breathe underwater.

**_Spellcasting._** The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. Choose the spell from the list of available spells based on the Elemental Plane the ring is linked to, as shown in the following table. The table indicates how many charges you must expend to cast the spell, which has a save DC of 18.

| Plane | Spells (Charges)                                                                                                                |
|-------|---------------------------------------------------------------------------------------------------------------------------------|
| Air   | Chain Lightning (3 charges), Feather Fall (0 charges), Gust of Wind (2 charges), Wind Wall (1 charge)                           |
| Earth | Earthquake (5 charges), Stone Shape (2 charges), Stoneskin (3 charges), Wall of Stone (3 charges)                               |
| Fire  | Burning Hands (1 charge), Fireball (2 charges), Fire Storm (4 charges), Wall of Fire (3 charges)                                |
| Water | Create or Destroy Water (1 charge), Ice Storm (2 charges), Tsunami (5 charges), Wall of Ice (3 charges), Water Walk (2 charges) |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-evasion",
    name: `Ring of Evasion`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing the ring, you can take a Reaction to expend 1 charge to succeed on that save instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-feather-falling",
    name: `Ring of Feather Falling`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-free-action",
    name: `Ring of Free Action`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While you wear this ring, Difficult Terrain doesn't cost you extra movement. In addition, magic can neither reduce any of your Speeds nor cause you to have the Paralyzed or Restrained condition.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-invisibility",
    name: `Ring of Invisibility`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you can take a Magic action to give yourself the Invisible condition. You remain Invisible until the ring is removed or until you take a Bonus Action to become visible again.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-jumping",
    name: `Ring of Jumping`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this ring, you can cast Jump from it, but can target only yourself when you do so.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-mind-shielding",
    name: `Ring of Mind Shielding`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it. You can take a Magic action to cause the ring to become imperceptible until you take another Magic action to make it perceptible, until you remove the ring, or until you die. If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can't prevent this telepathic communication.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-protection",
    name: `Ring of Protection`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You gain a +1 bonus to Armor Class and saving throws while wearing this ring.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-regeneration",
    name: `Ring of Regeneration`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you regain 1d6 Hit Points every 10 minutes if you have at least 1 Hit Point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 Hit Point the whole time.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-resistance",
    name: `Ring of Resistance`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have Resistance to one damage type while wearing this ring. The gemstone in the ring indicates the type, which the GM chooses or determines randomly by rolling on the following table.

| 1d10 | Damage Type | Gemstone   |
|------|-------------|------------|
| 1    | Acid        | Pearl      |
| 2    | Cold        | Tourmaline |
| 3    | Fire        | Garnet     |
| 4    | Force       | Sapphire   |
| 5    | Lightning   | Citrine    |
| 6    | Necrotic    | Jet        |
| 7    | Poison      | Amethyst   |
| 8    | Psychic     | Jade       |
| 9    | Radiant     | Topaz      |
| 10   | Thunder     | Spinel     |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-shooting-stars",
    name: `Ring of Shooting Stars`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You can cast *Dancing Lights* or *Light* from the ring.

The ring has 6 charges and regains 1d6 expended charges daily at dawn. You can expend its charges to use the properties below.

**_Faerie Fire._** You can expend 1 charge to cast *Faerie Fire* from the ring.

**_Lightning Spheres._** You can expend 2 charges as a Magic action to create up to four 3-foot-diameter spheres of lightning.

Each sphere appears in an unoccupied space you can see within 120 feet of yourself. The spheres last as long as you maintain Concentration, up to 1 minute. Each sphere sheds Dim Light in a 30-foot radius.

As a Bonus Action, you can move each sphere up to 30 feet, but no farther than 120 feet away from yourself. The first time the sphere comes within 5 feet of a creature other than you that isn't behind Total Cover, the sphere discharges lightning at that creature and disappears. That creature makes a DC 15 Dexterity saving throw. On a failed save, the creature takes Lightning damage based on the number of spheres you created, as shown in the following table. On a successful save, the creature takes half as much damage.

| Number of Spheres | Lightning Damage | Number of Spheres | Lightning Damage |
|-------------------|------------------|-------------------|------------------|
| 1                 | 4d12             | 3                 | 2d6              |
| 2                 | 5d4              | 4                 | 2d4              |

**_Shooting Stars._** You can expend 1 to 3 charges as a Magic action. For every charge you expend, you launch a glowing mote of light from the ring at a point you can see within 60 feet of yourself. Each creature in a 15-foot Cube originating from that point is showered in sparks and makes a DC 15 Dexterity saving throw, taking 5d4 Radiant damage on a failed save or half as much damage on a successful one.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-spell-storing",
    name: `Ring of Spell Storing`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 − 1 levels of stored spells chosen by the GM. Any creature can cast a spell of level 1 through 5 into the ring by touching the ring as the spell is cast. The spell has no effect other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses. While wearing this ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster but is otherwise treated as if you cast the spell. The spell cast from the ring is no longer stored in it, freeing up space.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-spell-turning",
    name: `Ring of Spell Turning`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While wearing this ring, you have Advantage on saving throws against spells. If you succeed on the save for a spell of level 7 or lower, the spell has no effect on you. If that spell targeted only you and didn't create an area of effect, you can take a Reaction to deflect the spell back at the spell's caster; the caster must make a saving throw against the spell using their own spell save DC.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-swimming",
    name: `Ring of Swimming`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a Swim Speed of 40 feet while wearing this ring.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-telekinesis",
    name: `Ring of Telekinesis`,
    category: `Ring`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you can cast Telekinesis from it.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-the-ram",
    name: `Ring of the Ram`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This ring has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the ring, you can take a Magic action to expend 1 to 3 charges to make a ranged spell attack against one creature you can see within 60 feet of yourself. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 Force damage and is pushed 5 feet away from you. Alternatively, you can expend 1 to 3 of the ring's charges as a Magic action to try to break a nonmagical object you can see within 60 feet of yourself that isn't being worn or carried. The ring makes a Strength check with a +5 bonus for each charge you spend.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-three-wishes",
    name: `Ring of Three Wishes`,
    category: `Ring`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `While wearing this ring, you can expend 1 of its 3 charges to cast Wish from it. The ring becomes nonmagical when you use the last charge.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-warmth",
    name: `Ring of Warmth`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `If you take Cold damage while wearing this ring, the ring reduces the damage you take by 2d8. In addition, while wearing this ring, you and everything you wear and carry are unharmed by temperatures of 0 degrees Fahrenheit or lower.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-water-walking",
    name: `Ring of Water Walking`,
    category: `Ring`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While wearing this ring, you cast Water Walk from it, targeting only yourself.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-ring-of-x-ray-vision",
    name: `Ring of X-ray Vision`,
    category: `Ring`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this ring, you can take a Magic action to gain X-ray vision with a range of 30 feet for 1 minute. To you, solid objects within that radius appear transparent and don't prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances or a thin sheet of lead block the vision. Whenever you use the ring again before taking a Long Rest, you must succeed on a DC 15 Constitution saving throw or gain 1 Exhaustion level.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-robe-of-eyes",
    name: `Robe of Eyes`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits: All-Around Vision. The robe gives you Advantage on Wisdom (Perception) checks that rely on sight. Special Senses. You have Darkvision and Truesight, both with a range of 120 feet. Drawbacks. A Light spell cast on the robe or a Daylight spell cast within 5 feet of the robe gives you the Blinded condition for 1 minute. At the end of each of your turns, you make a Constitution saving throw (DC 11 for Light or DC 15 for Daylight), ending the condition on yourself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-robe-of-scintillating-colors",
    name: `Robe of Scintillating Colors`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can take a Magic action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet, and creatures that can see you have Disadvantage on attack rolls against you. Any creature in the Bright Light that can see you when the robe's power is activated must succeed on a DC 15 Wisdom saving throw or have the Stunned condition until the effect ends.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-robe-of-stars",
    name: `Robe of Stars`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This black or dark-blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it. Six stars, located on the robe's upper-front portion, are particularly large. While wearing this robe, you can take a Magic action to remove one of the stars and expend it to cast the level 5 version of Magic Missile. Daily at dusk, 1d6 removed stars reappear on the robe. While you wear the robe, you can take a Magic action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you take a Magic action to return to the plane you were on. You reappear in the last space you occupied or, if that space is occupied, the nearest unoccupied space.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-robe-of-the-archmagi",
    name: `Robe of the Archmagi`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This elegant garment is made from exquisite cloth and adorned with runes. You gain these benefits while wearing the robe. Armor. If you aren't wearing armor, your base Armor Class is 15 plus your Dexterity modifier. Magic Resistance. You have Advantage on saving throws against spells and other magical effects. War Mage. Your spell save DC and spell attack bonus each increase by 2.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-robe-of-useful-items",
    name: `Robe of Useful Items`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can take a Magic action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.

The robe has two of each of the following patches:

- Bullseye Lantern (filled and lit)
- Dagger
- Mirror
- Pole
- Rope (coiled)
- Sack

In addition, the robe has 4d4 other patches. The GM chooses the patches or determines them randomly by rolling on the following table.

| 1d100 | Patch                                                                                                                                                   |
|-------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01–08 | Bag of 100 GP                                                                                                                                           |
| 09–15 | Silver coffer (1 foot long, 6 inches wide and deep) worth 500 GP                                                                                        |
| 16–22 | Iron door (up to 10 feet wide and 10 feet high, barred on one side of your choice), which you can place in an opening you can reach; it con forms to fit the opening, attaching and hinging itself |
| 23–30 | 10 gems worth 100 GP each                                                                                                                               |
| 31–44 | Wooden ladder (24 feet long)                                                                                                                            |
| 45–51 | Riding Horse with a Riding Saddle                                                                                                                       |
| 52–59 | Open pit (a 10-foot Cube), which you can place on the ground within 10 feet of yourself                                                                 |
| 60–68 | 4 Potions of Healing                                                                                                                                    |
| 69–75 | Rowboat (12 feet long)                                                                                                                                  |
| 76–83 | Spell Scroll containing one spell of level 1, 2, or 3 (your choice)                                                                                     |
| 84–90 | 2 Mastiffs                                                                                                                                              |
| 91–96 | Window (2 feet by 4 feet, up to 2 feet deep), which you can place on a vertical surface you can reach                                                   |
| 97–00 | Portable Ram                                                                                                                                            |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rod-of-absorption",
    name: `Rod of Absorption`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this rod, you can take a Reaction to absorb a spell that is targeting only you and doesn't create an area of effect. The absorbed spell's effect is canceled, and the spell's energy—not the spell itself—is stored in the rod. The energy has the same level as the spell when it was cast. A canceled spell dissipates with no effect, and any resources used to cast it are wasted. The rod can absorb and store up to 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can't absorb more. If you are targeted by a spell that the rod can't store, the rod has no effect on that spell. When you become attuned to the rod, you know how many levels of energy the rod has absorbed over the course of its existence and how many levels of spell energy it currently has stored. If you are a spellcaster holding the rod, you can convert energy stored in it into spell slots to cast spells you have prepared or know. You can create spell slots only of a level equal to or lower than your own spell slots, up to a maximum of level 5. You use the stored levels in place of your slots but otherwise cast the spell as normal. For example, you can use 3 levels stored in the rod as a level 3 spell slot. A newly found rod typically has 1d10 levels of spell energy stored in it. A rod that can no longer absorb spell energy and has no energy remaining becomes nonmagical.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rod-of-alertness",
    name: `Rod of Alertness`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This rod has the following properties. Alertness. While holding the rod, you have Advantage on Wisdom (Perception) checks and on Initiative rolls. Spells. While holding the rod, you can cast the following spells from it: - Detect Evil and Good - Detect Magic - Detect Poison and Disease - See Invisibility Protective Aura. As a Magic action, you can plant the haft end of the rod in the ground, whereupon the rod's head sheds Bright Light in a 60-foot radius and Dim Light for an additional 60 feet. While in that Bright Light, you and your allies gain a +1 bonus to Armor Class and saving throws and can sense the location of any Invisible creature that is also in the Bright Light. The rod's head stops glowing and the effect ends after 10 minutes or when a creature takes a Magic action to pull the rod from the ground. Once used, this property can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rod-of-lordly-might",
    name: `Rod of Lordly Might`,
    category: `Rod`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This rod has a flanged head, and it functions as a magic Mace that grants a +3 bonus to attack rolls and damage rolls made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below. Buttons. You can press one of the following buttons as a Bonus Action; a button's effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form: Button 1. A fiery blade sprouts from the end opposite the rod's flanged head. The flames shed Bright Light in a 40-foot radius and Dim Light for an additional 40 feet, and the blade functions as a magic Longsword or Shortsword (your choice) that deals an extra 2d6 Fire damage on a hit. Button 2. The rod's flanged head folds down and two crescent-shaped blades spring out, transforming the rod into a magic Battleaxe that grants a +3 bonus to attack rolls and damage rolls made with it. Button 3. The rod's flanged head folds down, a spear point springs from the rod's tip, and the rod's handle lengthens into a 6-foot haft, transforming the rod into a magic Spear that grants a +3 bonus to attack rolls and damage rolls made with it. Button 4. The rod transforms into a climbing pole up to 50 feet long (you specify the length), though the rod's buttons remain within your reach. In surfaces as hard as granite, a spike at the bottom and three hooks at the top anchor the pole. Horizontal bars 3 inches long fold out from the sides, 1 foot apart, forming a ladder. The pole can bear up to 4,000 pounds. More weight or lack of solid anchoring causes the rod to revert to its normal form. Button 5. The rod transforms into a handheld battering ram and grants its user a +10 bonus to Strength (Athletics) checks made to break through doors, barricades, and other barriers. Button 6. The rod assumes or remains in its normal form and indicates magnetic north. (Nothing happens if this function of the rod is used in a location that has no magnetic north.) The rod also gives you knowledge of your approximate depth beneath the ground or your height above it. Drain Life. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failed save, the target takes an extra 4d6 Necrotic damage, and you regain a number of Hit Points equal to half that Necrotic damage. Once used, this property can't be used again until the next dawn. Paralyze. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failed save, the target has the Paralyzed condition for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on a success. Once used, this property can't be used again until the next dawn. Terrify. While holding the rod, you can take a Magic action to force each creature you can see within 30 feet of yourself to make a DC 17 Wisdom saving throw. On a failed save, a target has the Frightened condition for 1 minute. A Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once used, this property can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rod-of-rulership",
    name: `Rod of Rulership`,
    category: `Rod`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `You can take a Magic action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of yourself. Each target must succeed on a DC 15 Wisdom saving throw or have the Charmed condition for 8 hours. While Charmed in this way, the creature regards you as its trusted leader. If harmed by you or your allies or commanded to do something contrary to its nature, a target ceases to be Charmed in this way. Once used, this property can't be used again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rod-of-security",
    name: `Rod of Security`,
    category: `Rod`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While holding this rod, you can take a Magic action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a demiplane. You choose the form the demiplane takes. It could be a tranquil garden, a cheery tavern, an immense palace, a tropical island, a fantastic carnival, or whatever else you can imagine. Regardless of its nature, the demiplane contains enough water and food to sustain its visitors, and the demiplane's environment can't harm its occupants. Everything else that can be interacted with there can exist only there. For example, a flower picked from a garden there disappears if it is taken outside the demiplane. For each hour spent in the demiplane, a visitor regains Hit Points as if it had spent 1 Hit Point Die. Also, creatures don't age while there, although time passes normally. Visitors can remain there for up to 200 days divided by the number of creatures present (round down). When the time runs out or you take a Magic action to end the effect, all visitors reappear in the location they occupied when you activated the rod or an unoccupied space nearest that location. Once used, this property can't be used again until 10 days have passed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rope-of-climbing",
    name: `Rope of Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This 60-foot length of rope can hold up to 3,000 pounds. While holding one end of the rope, you can take a Magic action to command the other end of the rope to animate and move toward a destination you choose, up to the rope's length away from you. That end moves 10 feet on your turn when you first command it and 10 feet at the start of each of your subsequent turns until reaching its destination or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying. If you tell the rope to knot, large knots appear at 1-foot intervals along the rope. While knotted, the rope shortens to a 50-foot length and grants Advantage on ability checks made to climb using the rope. The rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every 5 minutes as long as it has at least 1 Hit Point. If the rope drops to 0 Hit Points, it is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-rope-of-entanglement",
    name: `Rope of Entanglement`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This rope is 30 feet long. While holding one end of the rope, you can take a Magic action to command the other end to dart forward and entangle one creature you can see within 20 feet of yourself. The target must succeed on a DC 15 Dexterity saving throw or have the Restrained condition. You can release the target by letting go of your end of the rope (causing the rope to coil up in the target's space) or by using a Bonus Action to repeat the command (causing the rope to coil up in your hand). A target Restrained by the rope can take an action to make its choice of a DC 15 Strength (Athletics) or Dexterity (Acrobatics) check. On a successful check, the target is no longer Restrained by the rope. If you're still holding onto the rope when a target escapes from it, you can take a Reaction to command the rope to coil up in your hand; otherwise, the rope coils up in the target's space. The rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every 5 minutes as long as it has at least 1 Hit Point. If the rope drops to 0 Hit Points, it is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scale-mail-1",
    name: `Scale Mail (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scale-mail-2",
    name: `Scale Mail (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scale-mail-3",
    name: `Scale Mail (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scarab-of-protection",
    name: `Scarab of Protection`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This beetle-shaped medallion provides three benefits while it is on your person. Defense. You gain a +1 bonus to Armor Class. Preservation. The scarab has 12 charges. If you fail a saving throw against a Necromancy spell or a harmful effect originating from an Undead, you can take a Reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended. Spell Resistance. You have Advantage on saving throws against spells.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-of-life-stealing",
    name: `Scimitar of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-of-sharpness",
    name: `Scimitar of Sharpness`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `When you attack an object with this magic weapon and hit, maximize your weapon damage dice against the target.

When you attack a creature with this weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-of-speed",
    name: `Scimitar of Speed`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon. In addition, you can make one attack with it as a Bonus Action on each of your turns.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-of-wounding",
    name: `Scimitar of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-1",
    name: `Scimitar (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-2",
    name: `Scimitar (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-scimitar-3",
    name: `Scimitar (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shield-of-missile-attraction",
    name: `Shield of Missile Attraction`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this Shield, you have Resistance to damage from attacks made with Ranged weapons. Curse. This Shield is cursed. Attuning to it curses you until you are targeted by a Remove Curse spell or similar magic. Removing the Shield fails to end the curse on you. Whenever an attack with a Ranged weapon targets a creature within 10 feet of you, the curse causes you to become the target instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shield-1",
    name: `Shield (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While holding this Shield, you have a bonus to Armor Class determined by the Shield's rarity, in addition to the Shield's normal bonus to AC.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shield-2",
    name: `Shield (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While holding this Shield, you have a bonus to Armor Class determined by the Shield's rarity, in addition to the Shield's normal bonus to AC.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shield-3",
    name: `Shield (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `While holding this Shield, you have a bonus to Armor Class determined by the Shield's rarity, in addition to the Shield's normal bonus to AC.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortbow-1",
    name: `Shortbow (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortbow-2",
    name: `Shortbow (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortbow-3",
    name: `Shortbow (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortsword-of-life-stealing",
    name: `Shortsword of Life Stealing`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortsword-of-wounding",
    name: `Shortsword of Wounding`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortsword-1",
    name: `Shortsword (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortsword-2",
    name: `Shortsword (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-shortsword-3",
    name: `Shortsword (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sickle-1",
    name: `Sickle (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sickle-2",
    name: `Sickle (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sickle-3",
    name: `Sickle (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sling-1",
    name: `Sling (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sling-2",
    name: `Sling (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sling-3",
    name: `Sling (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-slippers-of-spider-climbing",
    name: `Slippers of Spider Climbing`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While you wear these light shoes, you can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free. You have a Climb Speed equal to your Speed. However, the slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sovereign-glue",
    name: `Sovereign Glue`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with Oil of Slipperiness. When found, a container contains 1d6 + 1 ounces. One ounce of the glue can cover a 1-foot square surface. Applying an ounce of Sovereign Glue takes a Utilize action, and the applied glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of Universal Solvent or Oil of Etherealness, or with a Wish spell.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-spear-1",
    name: `Spear (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-spear-2",
    name: `Spear (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-spear-3",
    name: `Spear (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-spellguard-shield",
    name: `Spellguard Shield`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this Shield, you have Advantage on saving throws against spells and other magical effects, and spell attack rolls have Disadvantage against you.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sphere-of-annihilation",
    name: `Sphere of Annihilation`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it.

The sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an Artifact is susceptible to damage from a *Sphere of Annihilation*, it passes through the sphere unscathed. Anything else that touches the sphere but isn't wholly engulfed and obliterated by it takes 8d10 Force damage.

**_Controlling the Sphere._** A *Sphere of Annihilation* is stationary until someone takes control of it. If you are within 60 feet of a sphere, you can take a Magic action to make a DC 25 Intelligence (Arcana) check. On a successful check, you control the sphere until the start of your next turn, and if it was under another creature's control, that creature loses control of the sphere. On a failed check, the sphere moves 10 feet toward you in a straight line.

While in control of the sphere, you can take a Bonus Action to cause it to move in one direction of your choice, up to a number of feet equal to 5 times your Intelligence modifier (minimum 5 feet). Any creature whose space the sphere enters must succeed on a DC 19 Dexterity saving throw or be touched by it, taking 8d10 Force damage. A creature reduced to 0 Hit Points by this damage is obliterated, leaving its possessions behind but no other physical remains.

**_Sphere Interactions._** If the sphere comes into contact with a planar portal (such as that created by the *Gate* spell) or an extradimensional space (such as that within a *Portable Hole*), the GM determines randomly what happens using the following table.

| 1d100 | Result                                                                                                                     |
|-------|----------------------------------------------------------------------------------------------------------------------------|
| 01–50 | The sphere is destroyed.                                                                                                   |
| 51–85 | The sphere moves through the portal or into the extradimensional space.                                                    |
| 86–00 | A spatial rift sends the sphere and each creature and object within 180 feet of the sphere to a random plane of existence. |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-splint-armor-1",
    name: `Splint Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-splint-armor-2",
    name: `Splint Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-splint-armor-3",
    name: `Splint Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-charming",
    name: `Staff of Charming`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 10 charges. While holding the staff, you can use any of its properties: Cast Spell. You can expend 1 of the staff's charges to cast Charm Person, Command, or Comprehend Languages from it using your spell save DC. Reflect Enchantment.* If you succeed on a saving throw against an Enchantment spell that targets only you, you can take a Reaction to expend 1 charge from the staff and turn the spell back on its caster as if you had cast the spell. Resist Enchantment. If you fail a saving throw against an Enchantment spell that targets only you, you can turn your failed save into a successful one. You can't use this property of the staff again until the next dawn. Regaining Charges. The staff regains 1d8 + 2 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff crumbles to dust and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-fire",
    name: `Staff of Fire`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You have Resistance to Fire damage while you hold this staff.

**_Spells._** The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.

| Spell         | Charge Cost |
|---------------|-------------|
| Burning Hands | 1           |
| Fireball      | 3           |
| Wall of Fire  | 4           |

**_Regaining Charges._** The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff crumbles into cinders and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-frost",
    name: `Staff of Frost`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `You have Resistance to Cold damage while you hold this staff.

**_Spells._** The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.

| Spell        | Charge Cost |
|--------------|-------------|
| Cone of Cold | 5           |
| Fog Cloud    | 1           |
| Ice Storm    | 4           |
| Wall of Ice  | 4           |

**_Regaining Charges._** The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff turns to water and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-healing",
    name: `Staff of Healing`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spellcasting ability modifier. The table indicates how many charges you must expend to cast the spell.

| Spell              | Charge Cost                                              |
|--------------------|----------------------------------------------------------|
| Cure Wounds        | 1 charge per spell level (maximum 4 for a level 4 spell) |
| Lesser Restoration | 2                                                        |
| Mass Cure Wounds   | 5                                                        |

**_Regaining Charges._** The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff vanishes in a flash of light, lost forever.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-power",
    name: `Staff of Power`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff has 20 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls.

**_Spells._** While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.

| Spell                            | Charge Cost |
|----------------------------------|-------------|
| Cone of Cold                     | 5           |
| Fireball (level 5 version)       | 5           |
| Globe of Invulnerability         | 6           |
| Hold Monster                     | 5           |
| Levitate                         | 2           |
| Lightning Bolt (level 5 version) | 5           |
| Magic Missile                    | 1           |
| Ray of Enfeeblement              | 1           |
| Wall of Force                    | 5           |

**_Regaining Charges._** The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff retains its +2 bonus to attack rolls and damage rolls but loses all other properties. On a 20, the staff regains 1d8 + 2 charges.

**_Retributive Strike._** You can take a Magic action to break the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in an explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take Force damage equal to 16 times the number of charges in the staff. Each other creature in the area makes a DC 17 Dexterity saving throw. On a failed save, a creature takes Force damage equal to 4 times the number of charges in the staff. On a successful save, a creature takes half as much damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-striking",
    name: `Staff of Striking`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic Quarterstaff that grants a +3 bonus to attack rolls and damage rolls made with it. The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 charges. For each charge you expend, the target takes an extra 1d6 Force damage. Regaining Charges. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff becomes a nonmagical Quarterstaff.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-swarming-insects",
    name: `Staff of Swarming Insects`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 10 charges.

**_Insect Cloud._** While holding the staff, you can take a Magic action and expend 1 charge to cause a swarm of harmless flying insects to fill a 30-foot Emanation originating from you. The insects remain for 10 minutes, making the area Heavily Obscured for creatures other than you. A strong wind (like that created by *Gust of Wind*) disperses the swarm and ends the effect.

**_Spells._** While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC and spell attack modifier. The table indicates how many charges you must expend to cast the spell.

| Spell         | Charge Cost |
|---------------|-------------|
| Giant Insect  | 4           |
| Insect Plague | 5           |

**_Regaining Charges._** The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-the-magi",
    name: `Staff of the Magi`,
    category: `Staff`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This staff has 50 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls.

**_Spell Absorption._** While holding the staff, you have Advantage on saving throws against spells. In addition, you can take a Reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell's level. However, if doing so brings the staff's total number of charges above 50, the staff explodes as if you activated its Retributive Strike (see below).

**_Spells._** While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.

| Spell                            | Charge Cost |
|----------------------------------|-------------|
| Arcane Lock                      | 0           |
| Conjure Elemental                | 7           |
| Detect Magic                     | 0           |
| Dispel Magic                     | 3           |
| Enlarge/Reduce                   | 0           |
| Fireball (level 7 version)       | 7           |
| Flaming Sphere                   | 2           |
| Ice Storm                        | 4           |
| Invisibility                     | 2           |
| Knock                            | 2           |
| Light                            | 0           |
| Lightning Bolt (level 7 version) | 7           |
| Mage Hand                        | 0           |
| Passwall                         | 5           |
| Plane Shift                      | 7           |
| Protection from Evil and Good    | 0           |
| Telekinesis                      | 5           |
| Wall of Fire                     | 4           |
| Web                              | 2           |

**_Regaining Charges._** The staff regains 4d6 + 2 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 20, the staff regains 1d12 + 1 charges.

**_Retributive Strike._** You can take a Magic action to break the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in an explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take Force damage equal to 16 times the number of charges in the staff. Each other creature in the area makes a DC 17 Dexterity saving throw. On a failed save, a creature takes Force damage equal to 6 times the number of charges in the staff. On a successful save, a creature takes half as much damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-the-python",
    name: `Staff of the Python`,
    category: `Staff`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As a Magic action, you can throw this staff so that it lands in an unoccupied space within 10 feet of you, causing the staff to become a Giant Constrictor Snake in that space. The snake is under your control and shares your Initiative count, taking its turn immediately after yours. On your turn, you can mentally command the snake (no action required) if it is within 60 feet of you and you don't have the Incapacitated condition. You decide what action the snake takes and where it moves during its turn, or you can issue it a general command, such as to attack your enemies or guard a location. Absent commands from you, the snake defends itself. As a Bonus Action, you can command the snake to revert to staff form in its current space, and you can't use the staff's property again for 1 hour. If the snake is reduced to 0 Hit Points, it dies and reverts to its staff form; the staff then shatters and is destroyed. If the snake reverts to staff form before losing all its Hit Points, it regains all of them.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-the-woodlands",
    name: `Staff of the Woodlands`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 6 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls.

**_Spells._** While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.

| Spell                    | Charge Cost |
|--------------------------|-------------|
| Animal Friendship        | 1           |
| Awaken                   | 5           |
| Barkskin                 | 2           |
| Locate Animals or Plants | 2           |
| Pass without Trace       | 2           |
| Speak with Animals       | 1           |
| Speak with Plants        | 3           |
| Wall of Thorns           | 6           |

**_Tree Form._** You can take a Magic action to plant one end of the staff in earth in an unoccupied space and expend 1 charge to transform the staff into a healthy tree. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius. The tree appears ordinary but radiates a faint aura of Transmutation magic that can be discerned with the *Detect Magic* spell. While touching the tree and using a Magic action, you return the staff to its normal form. Any creature in the tree falls when the tree reverts to a staff.

**_Regaining Charges._** The staff regains 1d6 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-thunder-and-lightning",
    name: `Staff of Thunder and Lightning`,
    category: `Staff`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. It also has the following additional properties. Once one of these properties is used, it can't be used again until the next dawn. Lightning. When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 Lightning damage (no action required). Thunder. When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder audible out to 300 feet (no action required). The target you hit must succeed on a DC 17 Constitution saving throw or have the Stunned condition until the end of your next turn. Thunder and Lightning. Immediately after you hit with a melee attack using the staff, you can take a Bonus Action to use the Lightning and Thunder properties (see above) at the same time. Doing so doesn't expend the daily use of those properties, only the use of this one. Lightning Strike. You can take a Magic action to cause a bolt of lightning to leap from the staff's tip in a Line that is 5 feet wide and 120 feet long. Each creature in that Line makes a DC 17 Dexterity saving throw, taking 9d6 Lightning damage on a failed save or half as much damage on a successful one. Thunderclap. You can take a Magic action to cause the staff to produce a thunderclap audible out to 600 feet. Every creature within a 60-foot Emanation originating from you makes a DC 17 Constitution saving throw. On a failed save, a creature takes 2d6 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-staff-of-withering",
    name: `Staff of Withering`,
    category: `Staff`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This staff has 3 charges and regains 1d3 expended charges daily at dawn. The staff can be wielded as a magic Quarterstaff. On a hit, it deals damage as a normal Quarterstaff, and you can expend 1 charge to deal an extra 2d10 Necrotic damage to the target and force it to make a DC 15 Constitution saving throw. On a failed save, the target has Disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-stone-of-controlling-earth-elementals",
    name: `Stone of Controlling Earth Elementals`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `While touching this 5-pound stone to the ground, you can take a Magic action to summon an Earth Elemental. The elemental appears in an unoccupied space you choose within 30 feet of yourself, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The stone can't be used this way again until the next dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-stone-of-good-luck-luckstone",
    name: `Stone of Good Luck (Luckstone)`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-studded-leather-armor-1",
    name: `Studded Leather Armor (+1)`,
    category: `Armor`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-studded-leather-armor-2",
    name: `Studded Leather Armor (+2)`,
    category: `Armor`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-studded-leather-armor-3",
    name: `Studded Leather Armor (+3)`,
    category: `Armor`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-sun-blade",
    name: `Sun Blade`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This item appears to be a sword hilt. Blade of Radiance. While grasping the hilt, you can take a Bonus Action to cause a blade of pure radiance to spring into existence or make the blade disappear. While the blade exists, this magic weapon functions as a Longsword with the Finesse property. If you are proficient with Longswords or Shortswords, you are proficient with the Sun Blade. You gain a +2 bonus to attack rolls and damage rolls made with this weapon, which deals Radiant damage instead of Slashing damage. When you hit an Undead with it, that target takes an extra 1d8 Radiant damage. Sunlight. The sword's luminous blade emits Bright Light in a 15-foot radius and Dim Light for an additional 15 feet. The light is sunlight. While the blade persists, you can take a Magic action to expand or reduce its radius of Bright Light and Dim Light by 5 feet each, to a maximum of 30 feet each or a minimum of 10 feet each.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-talisman-of-pure-good",
    name: `Talisman of Pure Good`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This talisman is a mighty symbol of goodness. A Fiend or an Undead that touches the talisman takes 8d6 Radiant damage and takes the damage again each time it ends its turn holding or carrying the talisman. Holy Symbol. You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it. Pure Rebuke. The talisman has 7 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and the target makes a DC 20 Dexterity saving throw. If the target is a Fiend or an Undead, it has Disadvantage on the save. On a failed save, the target falls into the fissure and is destroyed, leaving no remains. On a successful save, the target isn't cast into the fissure but takes 4d6 Psychic damage from the ordeal. In either case, the fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman disperses into motes of golden light and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-talisman-of-the-sphere",
    name: `Talisman of the Sphere`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `While holding or wearing this talisman, you have Advantage on any Intelligence (Arcana) check you make to control a Sphere of Annihilation. In addition, when you start your turn in control of a Sphere of Annihilation, you can take a Magic action to move it 10 feet plus a number of additional feet equal to 10 times your Intelligence modifier. This movement doesn't have to be in a straight line.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-talisman-of-ultimate-evil",
    name: `Talisman of Ultimate Evil`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `This item symbolizes unrepentant evil. A creature that isn't a Fiend or an Undead that touches the talisman takes 8d6 Necrotic damage and takes the damage again each time it ends its turn holding or carrying the talisman. Holy Symbol. You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it. Ultimate End. The talisman has 6 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and the target makes a DC 20 Dexterity saving throw. If the target is a Celestial, it has Disadvantage on the save. On a failed save, the target falls into the fissure and is destroyed, leaving no remains. On a successful save, the target isn't cast into the fissure but takes 4d6 Psychic damage from the ordeal. In either case, the fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman dissolves into foul-smelling slime and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-tome-of-clear-thought",
    name: `Tome of Clear Thought`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Intelligence increases by 2, to a maximum of 30. The manual then loses its magic but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-tome-of-leadership-and-influence",
    name: `Tome of Leadership and Influence`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Charisma increases by 2, to a maximum of 30. The manual then loses its magic but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-tome-of-understanding",
    name: `Tome of Understanding`,
    category: `Wondrous Item`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Wisdom increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-trident-of-fish-command",
    name: `Trident of Fish Command`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `This magic weapon has 3 charges, and it regains 1d3 expended charges daily at dawn. While you carry it, you can expend 1 charge to cast Dominate Beast (save DC 15) from it on a Beast that has a Swim Speed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-trident-1",
    name: `Trident (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-trident-2",
    name: `Trident (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-trident-3",
    name: `Trident (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-universal-solvent",
    name: `Universal Solvent`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This tube holds milky liquid with a strong alcohol smell. When found, a tube contains 1d6 + 1 ounces. You can take a Utilize action to pour 1 or more ounces of solvent from the tube onto a surface within reach. Each ounce instantly dissolves up to 1 square foot of adhesive it touches, including Sovereign Glue.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-battleaxe",
    name: `Vicious Battleaxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-blowgun",
    name: `Vicious Blowgun`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-club",
    name: `Vicious Club`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-dagger",
    name: `Vicious Dagger`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-dart",
    name: `Vicious Dart`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-flail",
    name: `Vicious Flail`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-glaive",
    name: `Vicious Glaive`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-greataxe",
    name: `Vicious Greataxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-greatclub",
    name: `Vicious Greatclub`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-greatsword",
    name: `Vicious Greatsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-halberd",
    name: `Vicious Halberd`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-hand-crossbow",
    name: `Vicious Hand Crossbow`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-handaxe",
    name: `Vicious Handaxe`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-heavy-crossbow",
    name: `Vicious Heavy Crossbow`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-javelin",
    name: `Vicious Javelin`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-lance",
    name: `Vicious Lance`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-light-crossbow",
    name: `Vicious Light Crossbow`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-light-hammer",
    name: `Vicious Light Hammer`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-longbow",
    name: `Vicious Longbow`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-longsword",
    name: `Vicious Longsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-mace",
    name: `Vicious Mace`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-maul",
    name: `Vicious Maul`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-morningstar",
    name: `Vicious Morningstar`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-musket",
    name: `Vicious Musket`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-pike",
    name: `Vicious Pike`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-pistol",
    name: `Vicious Pistol`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-quarterstaff",
    name: `Vicious Quarterstaff`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-rapier",
    name: `Vicious Rapier`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-scimitar",
    name: `Vicious Scimitar`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-shortbow",
    name: `Vicious Shortbow`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-shortsword",
    name: `Vicious Shortsword`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-sickle",
    name: `Vicious Sickle`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-sling",
    name: `Vicious Sling`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-spear",
    name: `Vicious Spear`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-trident",
    name: `Vicious Trident`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-war-pick",
    name: `Vicious War Pick`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-warhammer",
    name: `Vicious Warhammer`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vicious-whip",
    name: `Vicious Whip`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vorpal-glaive",
    name: `Vorpal Glaive`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage.

When you use this weapon to attack a creature that has at least one head and roll a 20 on the d20 for the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it has Immunity to Slashing damage, if it doesn't have or need a head, or if the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 30 Slashing damage from the hit. If the creature has Legendary Resistance, it can expend one daily use of that trait to avoid losing its head, taking the extra damage instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vorpal-greatsword",
    name: `Vorpal Greatsword`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage.

When you use this weapon to attack a creature that has at least one head and roll a 20 on the d20 for the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it has Immunity to Slashing damage, if it doesn't have or need a head, or if the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 30 Slashing damage from the hit. If the creature has Legendary Resistance, it can expend one daily use of that trait to avoid losing its head, taking the extra damage instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vorpal-longsword",
    name: `Vorpal Longsword`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage.

When you use this weapon to attack a creature that has at least one head and roll a 20 on the d20 for the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it has Immunity to Slashing damage, if it doesn't have or need a head, or if the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 30 Slashing damage from the hit. If the creature has Legendary Resistance, it can expend one daily use of that trait to avoid losing its head, taking the extra damage instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-vorpal-scimitar",
    name: `Vorpal Scimitar`,
    category: `Weapon`,
    rarity: `Legendary`,
    requiresAttunement: true,
    description: `You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage.

When you use this weapon to attack a creature that has at least one head and roll a 20 on the d20 for the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it has Immunity to Slashing damage, if it doesn't have or need a head, or if the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 30 Slashing damage from the hit. If the creature has Legendary Resistance, it can expend one daily use of that trait to avoid losing its head, taking the extra damage instead.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-binding",
    name: `Wand of Binding`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges.

**_Spells._** While holding the wand, you can cast one of the spells (save DC 17) on the following table from it. The table indicates how many charges you must expend to cast the spell.

| Spell        | Charge Cost |
|--------------|-------------|
| Hold Monster | 5           |
| Hold Person  | 2           |

**_Regaining Charges._** The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-enemy-detection",
    name: `Wand of Enemy Detection`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge. For 1 minute, you know the direction of the nearest creature Hostile to you within 60 feet, but not its distance from you. The wand can sense the presence of Hostile creatures that are Invisible, ethereal, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-fear",
    name: `Wand of Fear`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges.

**Spells.** While holding the wand, you can cast one of the spells (save DC 15) on the following table from it. The table indicates how many charges you must expend to cast the spell.

| Spell | Charge Cost |
|---|---|
| Command ("flee" or "grovel" only) | 1 |
| Fear (60-foot Cone) | 3 |
`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-fireballs",
    name: `Wand of Fireballs`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Fireball (save DC 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-lightning-bolts",
    name: `Wand of Lightning Bolts`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Lightning Bolt (save DC 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-magic-detection",
    name: `Wand of Magic Detection`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wand has 3 charges. While holding it, you can expend 1 charge to cast Detect Magic from it. The wand regains 1d3 expended charges daily at dawn.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-magic-missiles",
    name: `Wand of Magic Missiles`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast Magic Missile from it. For 1 charge, you cast the level 1 version of the spell. You can increase the spell's level by 1 for each additional charge you expend. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-paralysis",
    name: `Wand of Paralysis`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of yourself. The target must succeed on a DC 15 Constitution saving throw or have the Paralyzed condition for 1 minute. At the end of each of the target's turns, it repeats the save, ending the effect on itself on a success. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-polymorph",
    name: `Wand of Polymorph`,
    category: `Wand`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can expend 1 charge to cast Polymorph (save DC 15) from it. Regaining Charges. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-secrets",
    name: `Wand of Secrets`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding it, you can take a Magic action to expend 1 charge, and if a secret door or trap is within 60 feet of you, the wand pulses and points at the one nearest to you.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-the-war-mage-1",
    name: `Wand of the War Mage +1`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity (Uncommon +1, Rare +2, Very Rare +3). In addition, you ignore Half Cover when making a spell attack roll.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-the-war-mage-2",
    name: `Wand of the War Mage +2`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity (Uncommon +1, Rare +2, Very Rare +3). In addition, you ignore Half Cover when making a spell attack roll.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-the-war-mage-3",
    name: `Wand of the War Mage +3`,
    category: `Wand`,
    rarity: `Very Rare`,
    requiresAttunement: true,
    description: `While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity (Uncommon +1, Rare +2, Very Rare +3). In addition, you ignore Half Cover when making a spell attack roll.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-web",
    name: `Wand of Web`,
    category: `Wand`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `**_Spells._** While holding the wand, you can cast one of the spells (save DC 15) on the following table from it. The table indicates how many charges you must expend to cast the spell.

| Spell                             | Charge Cost |
|-----------------------------------|-------------|
| Command ("flee" or "grovel" only) | 1           |
| Fear (60-foot Cone)               | 3           |

**_Regaining Charges._** The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wand-of-wonder",
    name: `Wand of Wonder`,
    category: `Wand`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge while choosing a point within 120 feet of yourself. That location becomes the point of origin of a spell or other magical effect determined by rolling on the Wand of Wonder Effects table. Spells cast from the wand have a save DC of 15. If a spell's maximum range is normally less than 120 feet, it becomes 120 feet when cast from the wand. If an effect has multiple possible subjects, the GM determines randomly which among them are affected.

**_Regaining Charges._** The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into dust and is destroyed.

Table: Wand of Wonder Effects
| 1d100 | Effect |
|-------|--------|
| 01–20 | You cast a spell originating from the chosen point. Roll 1d10 to determine the spell: on a **1–2,** *Darkness*; on a **3–4,** *Faerie Fire*; on a **5–6,** *Fireball*; on a **7–8,** *Slow*; on a **9–10,** *Stinking Cloud*. |
| 21–25 | Nothing happens at the chosen point of origin. Instead, you have the Stunned condition until the start of your next turn, believing something awesome just happened. |
| 26–30 | You cast *Gust of Wind*. The Line created by the spell extends from you to the chosen point of origin. |
| 31–35 | Nothing happens at the chosen point of origin. Instead, you take 1d6 Psychic damage. |
| 36–40 | Heavy rain falls for 1 minute in a 120-foothigh, 60-foot-radius Cylinder centered on the chosen point of origin. During that time, the area of effect is Lightly Obscured. |
| 41–45 | A cloud of 600 oversized butterflies fills a 60-foot-high, 30-foot-radius Cylinder centered on the chosen point of origin. The butterflies remain for 10 minutes, during which time the area of effect is Heavily Obscured. |
| 46–50 | You cast *Lightning Bolt*. The Line created by the spell extends from you to the chosen point of origin. |
| 51–55 | The creature closest to the chosen point of origin is enlarged as if you had cast *Enlarge/ Reduce* on it. If the target isn't you and can't be affected by that spell, you become the target instead. |
| 56–60 | A magically formed creature appears in an unoccupied space as close to the chosen point of origin as possible. The creature isn't under your control, acts as it normally would, and disappears after 1 hour or when it drops to 0 Hit Points. Roll 1d4 to determine which creature appears. On a **1,** a **Rhinoceros** appears; on a **2,** an **Elephant** appears; and on a **3–4,** a **Rat** appears. |
| 61–64 | Grass covers a 60-foot-radius circle of ground, with the center of that circle as close to the chosen point of origin as possible. Grass that's already there grows to ten times its normal size and remains overgrown for 1 minute. |
| 65–68 | An object of the GM's choice disappears into the Ethereal Plane. The object must be neither worn nor carried, within 120 feet of the chosen point of origin, and no larger than 10 feet in any dimension. If there are no such objects in range, nothing happens. |
| 69–72 | Nothing happens at the chosen point of origin. Instead, you shrink as if you had cast *Enlarge/ Reduce* on yourself and remain in that state for 1 minute. |
| 73–77 | Leaves grow from the creature nearest to the chosen point of origin. Unless they are picked off, the leaves turn brown and fall off after 24 hours. |
| 78–82 | Nothing happens at the chosen point of origin. Instead, a burst of colorful, shimmering light extends from you in a 30-foot Emanation. Each creature in the area must succeed on a DC 15 Constitution saving throw or have the Blinded condition for 1 minute. A creature repeats the save at the end of each of its turns, ending the effect on itself on a success. |
| 83–87 | Nothing happens at the chosen point of origin. Instead, you cast *Invisibility* on yourself. |
| 88–92 | Nothing happens at the chosen point of origin. Instead, a stream of 1d4 × 10 gems, each worth 1 GP, shoots from the wand's tip in a Line 30 feet long and 5 feet wide toward the chosen point of origin. Each gem deals 1 Bludgeoning damage, and the total damage of the gems is divided equally among all creatures in the Line. |
| 93–97 | You cast *Polymorph*, targeting the creature closest to the chosen point of origin. Roll 1d4 to determine the target's new form. On a **1,** the new form is a **Black Bear;** on a **2,** the new form is a **Giant Wasp;** on a **3–4,** the new form is a **Frog.** |
| 98–00 | The creature closest to the chosen point of origin makes a DC 15 Constitution saving throw. On a failed save, the creature has the Restrained condition and begins to turn to stone. While Restrained in this way, the creature repeats the save at the end of its next turn. On a successful save, the effect ends. On a failed save, the creature has the Petrified condition instead of the Restrained condition. The petrification lasts until the creature is freed by the *Greater Restoration* spell or similar magic. |`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-war-pick-1",
    name: `War Pick (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-war-pick-2",
    name: `War Pick (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-war-pick-3",
    name: `War Pick (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-warhammer-1",
    name: `Warhammer (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-warhammer-2",
    name: `Warhammer (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-warhammer-3",
    name: `Warhammer (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-battleaxe",
    name: `Weapon of Warning (Battleaxe)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-blowgun",
    name: `Weapon of Warning (Blowgun)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-club",
    name: `Weapon of Warning (Club)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-dagger",
    name: `Weapon of Warning (Dagger)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-dart",
    name: `Weapon of Warning (Dart)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-flail",
    name: `Weapon of Warning (Flail)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-glaive",
    name: `Weapon of Warning (Glaive)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-greataxe",
    name: `Weapon of Warning (Greataxe)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-greatclub",
    name: `Weapon of Warning (Greatclub)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-greatsword",
    name: `Weapon of Warning (Greatsword)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-halberd",
    name: `Weapon of Warning (Halberd)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-hand-crossbow",
    name: `Weapon of Warning (Hand Crossbow)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-handaxe",
    name: `Weapon of Warning (Handaxe)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-heavy-crossbow",
    name: `Weapon of Warning (Heavy Crossbow)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-javelin",
    name: `Weapon of Warning (Javelin)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-lance",
    name: `Weapon of Warning (Lance)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-light-crossbow",
    name: `Weapon of Warning (Light Crossbow)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-light-hammer",
    name: `Weapon of Warning (Light Hammer)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-longbow",
    name: `Weapon of Warning (Longbow)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-longsword",
    name: `Weapon of Warning (Longsword)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-mace",
    name: `Weapon of Warning (Mace)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-maul",
    name: `Weapon of Warning (Maul)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-morningstar",
    name: `Weapon of Warning (Morningstar)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-musket",
    name: `Weapon of Warning (Musket)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-pike",
    name: `Weapon of Warning (Pike)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-pistol",
    name: `Weapon of Warning (Pistol)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-quarterstaff",
    name: `Weapon of Warning (Quarterstaff)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-rapier",
    name: `Weapon of Warning (Rapier)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-scimitar",
    name: `Weapon of Warning (Scimitar)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-shortbow",
    name: `Weapon of Warning (Shortbow)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-shortsword",
    name: `Weapon of Warning (Shortsword)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-sickle",
    name: `Weapon of Warning (Sickle)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-sling",
    name: `Weapon of Warning (Sling)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-spear",
    name: `Weapon of Warning (Spear)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-trident",
    name: `Weapon of Warning (Trident)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-war-pick",
    name: `Weapon of Warning (War Pick)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-warhammer",
    name: `Weapon of Warning (Warhammer)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-weapon-of-warning-whip",
    name: `Weapon of Warning (Whip)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.

**Alarm.** The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.

**Supernatural Readiness.** Each subject has Advantage on its Initiative rolls.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-well-of-many-worlds",
    name: `Well of Many Worlds`,
    category: `Wondrous Item`,
    rarity: `Legendary`,
    requiresAttunement: false,
    description: `This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can take a Magic action to unfold the Well of Many Worlds and place it on a solid surface, whereupon it forms a two-way, 6-foot-diameter, circular portal to another world or plane of existence. Each time the item opens a portal, the GM decides where it leads. The portal remains open until a creature within 5 feet of it takes a Magic action to close it by taking hold of the edges of the cloth and folding it up. Once the Well of Many Worlds has opened a portal, it can't do so again for 1d8 hours.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-whip-1",
    name: `Whip (+1)`,
    category: `Weapon`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-whip-2",
    name: `Whip (+2)`,
    category: `Weapon`,
    rarity: `Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-whip-3",
    name: `Whip (+3)`,
    category: `Weapon`,
    rarity: `Very Rare`,
    requiresAttunement: false,
    description: `You have a bonus to attack rolls and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wind-fan",
    name: `Wind Fan`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: false,
    description: `While holding this fan, you can cast Gust of Wind (save DC 13) from it. Each subsequent time the fan is used before the next dawn, it has a cumulative 20 percent chance of not working; if the fan fails to work, it tears into useless, nonmagical tatters.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-winged-boots",
    name: `Winged Boots`,
    category: `Wondrous Item`,
    rarity: `Uncommon`,
    requiresAttunement: true,
    description: `These boots have 4 charges and regain 1d4 expended charges daily at dawn. While wearing the boots, you can take a Magic action to expend 1 charge, gaining a Fly Speed of 30 feet for 1 hour. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
  {
    slug: "srd-2024-wings-of-flying",
    name: `Wings of Flying`,
    category: `Wondrous Item`,
    rarity: `Rare`,
    requiresAttunement: true,
    description: `While wearing this cloak, you can take a Magic action to turn the cloak into a pair of wings on your back. The wings lasts for 1 hour or until you end the effect early as a Magic action. The wings give you a Fly Speed of 60 feet. If you are aloft when the wings disappear, you fall. When the wings disappear, you can't use them again for 1d12 hours.`,
    sourceKey: "srd-2024",
    sourceName: "System Reference Document 5.2",
  },
];
