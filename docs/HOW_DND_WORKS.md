# How D&D works

A plain-language overview of core tabletop D&D mechanics, for anyone working
on this app who isn't already a player. This describes the *default* rules
(mostly 5th Edition's, since that's the most common baseline) — **every
single rule below is a default a table can and does override**. That's not
a footnote, it's the actual design center of the game: the rulebooks are a
starting point, the Dungeon Master (DM) is the final authority at their own
table, and reskinning/homebrewing is normal, expected play. See
"Customization is the default" at the end for how that shows up concretely,
and how this app is built to not fight it.

## The basic loop

D&D is a cooperative storytelling game played with dice as the arbiter of
uncertainty:

1. The **DM** describes a situation (a room, an NPC, a monster).
2. **Players** say what their character does.
3. If the outcome is uncertain, someone **rolls dice** against a target
   number to see if it succeeds.
4. The DM narrates the result, and the loop continues.

Most of a session is conversation, not dice — rolls happen when the outcome
is genuinely in doubt and failure would be interesting.

## Characters

A character is defined by:

- **Race/species** (Elf, Dwarf, Human, Tiefling, …) — flavor plus small
  mechanical bonuses (ability score bumps, speed, darkvision, minor innate
  traits).
- **Class** (Fighter, Wizard, Rogue, Cleric, …) — the main mechanical
  identity: what you're good at, what features you unlock by leveling, and
  whether you cast spells.
- **Background** (Soldier, Criminal, Acolyte, …) — mostly flavor/roleplay,
  grants a couple of skill proficiencies and minor starting gear.
- **Ability scores** — six stats, each 1–20 for a typical character:
  - **Strength** — melee power, carrying capacity
  - **Dexterity** — agility, reflexes, ranged/finesse attacks, AC
  - **Constitution** — toughness, hit points
  - **Intelligence** — reasoning, some casters' spellcasting
  - **Wisdom** — perception/intuition, some casters' spellcasting
  - **Charisma** — force of personality, some casters' spellcasting
- **Level** (1–20) — overall power/experience. Higher level means more hit
  points, more class features, and (for casters) stronger spells.

Each ability score has a **modifier**, roughly `(score - 10) / 2` rounded
down — a 14 gives +2, an 8 gives -1. Modifiers, not raw scores, are what get
added to rolls.

## The core mechanic: the d20 roll

Almost everything uncertain is resolved the same way:

```
1d20 + relevant modifier(s)  vs.  a target number
```

- **Ability checks**: can you climb this wall, recall this lore, persuade
  this guard? Roll d20 + ability modifier (+ proficiency bonus if trained
  in the relevant skill) vs. a **Difficulty Class (DC)** the DM sets.
- **Attack rolls**: roll d20 + ability modifier + proficiency bonus (if
  proficient with the weapon) vs. the target's **Armor Class (AC)**. Meet or
  beat it, you hit.
- **Saving throws**: when something bad targets you (a trap, a spell, a
  dragon's breath), roll d20 + the relevant ability modifier (+ proficiency
  if your class is proficient in that save) vs. a DC the effect sets, to
  resist or lessen it.

A natural **20** on an attack roll is a **critical hit** (extra damage); a
natural **1** always misses, regardless of modifiers.

**Proficiency bonus** is a single flat number (+2 at level 1, rising to +6
by level 17) added whenever a character is "trained" in whatever's being
rolled — a skill, a weapon, a saving throw. It's the main way the game
represents "this character is good at this specific thing."

**Advantage/disadvantage**: instead of a flat bonus or penalty, situational
help or hindrance is usually modeled by rolling **two** d20s and taking the
higher (advantage) or lower (disadvantage) result.

## Skills

Each ability has a handful of associated skills (e.g. Dexterity → Acrobatics,
Stealth, Sleight of Hand). A character is **proficient** in some subset,
chosen at creation from their class/background — proficient skills add the
proficiency bonus on top of the ability modifier.

## Combat

Combat happens in **rounds**; each round, every participant takes one turn
in an **initiative** order (rolled once at the start of combat: d20 + Dex
modifier, highest goes first). On your turn you typically get one **action**
(attack, cast a spell, dash, help, etc.), a **move**, and sometimes a
**bonus action**/**reaction** depending on class features.

- **Hit points (HP)**: a pool that decreases when you take damage. Hitting
  0 doesn't necessarily mean death — it means you're **unconscious** and
  making **death saving throws** (flat d20, no modifiers) each turn: three
  successes (10+) stabilizes you, three failures kills you, a natural 20
  wakes you at 1 HP, a natural 1 counts as two failures. Taking damage while
  already at 0 counts as an automatic failure (two if the hit is a critical).
- **Armor Class (AC)**: the number attacks must meet or beat to hit you —
  derived from armor worn, Dexterity, and sometimes class features.
- **Hit dice**: each class has a die size (d6 through d12) used to roll HP
  gained per level, and spent to heal during short rests.

## Spellcasting (for classes that have it)

Casters (Wizard, Cleric, Sorcerer, Bard, Druid, Warlock, and partial casters
like Paladin/Ranger) draw spells from **spell slots** — a limited pool per
spell level (1st through 9th) that refreshes on a long rest (Warlocks are a
deliberate exception: fewer slots that recharge on a short rest). Casting a
spell "uses" a slot of its level or higher.

- **Known vs. prepared**: some classes (Sorcerer, Bard, Warlock, Ranger)
  pick a small fixed list of spells they **know** and can always cast.
  Others (Cleric, Druid, Paladin) can **prepare** a daily selection from
  their *entire* class list. Wizards keep a growing **spellbook** and
  prepare from it.
- **Cantrips**: level-0 spells, castable any number of times, no slot
  needed.
- **Spell save DC**: `8 + proficiency bonus + spellcasting ability
  modifier` — what a target rolls against to resist the spell's effect.
- **Concentration**: some spells require ongoing focus; taking damage while
  concentrating risks losing the spell, and only one concentration spell
  can be active at a time.
- **Rituals**: certain spells can be cast slowly (10 extra minutes) without
  spending a slot at all, if the caster has the ritual tag for that spell.

## Leveling up

Characters grow stronger over time via two common methods — **a DM picks
one for their table, it's not simultaneous**:

- **Experience points (XP)**: monsters/challenges award XP; hitting a
  published threshold (which grows steeply per level) triggers a level-up.
- **Milestone leveling**: no XP math at all — the DM just declares "you
  level up" at meaningful story beats.

A level-up typically grants: more max HP (roll or take the average of the
class's hit die + Constitution modifier), new class features at certain
levels, and periodically a higher proficiency bonus or an Ability Score
Improvement (a chance to raise ability scores).

## Equipment and currency

Characters carry gear — weapons, armor, tools, adventuring supplies — priced
in a few denominations of coin (copper/silver/electrum/gold/platinum,
10:1 between most adjacent tiers). What's **equipped** (worn/wielded) vs.
merely **carried** matters mechanically: only equipped armor/shields affect
AC, only a wielded weapon can attack with its own stats.

## Customization is the default

Every rule above is the *published default*, not a constraint. In actual
play:

- **The DM can override any rule at any table.** A monster's stats, a
  spell's effect, whether a critical hit doubles damage dice or adds a flat
  bonus instead — all "house rules" territory, all common.
- **Homebrew content is normal**, not a hack: homebrew races, classes,
  subclasses, spells, and magic items circulate constantly, built by players
  and DMs with no official sanction, and get used at tables exactly like
  official content.
- **Editions and rule systems are themselves swappable.** "D&D" isn't one
  fixed ruleset — 5th Edition (2014), 5th Edition (2024 revision), and 3.5
  Edition are meaningfully different rule systems (different skill lists,
  different save math, different spell-slot tables), and plenty of tables
  mix in third-party systems (Pathfinder grew out of exactly this kind of
  divergence) or invent their own from scratch.
- **Settings/splatbooks layer on top** of a base ruleset without changing
  its core mechanics — e.g. Spelljammer adds setting-specific races and
  equipment on top of 5e's existing class/leveling rules, rather than being
  a rules system of its own.
- **What's legally reproducible vs. not** is a separate axis from "what's
  customizable" — the SRD (System Reference Document) for each edition is
  openly licensed and safe to use verbatim; most named Backgrounds, most
  subclasses, and setting-specific content are Player's Handbook/sourcebook
  content that isn't. That's a copyright boundary, not a rules boundary —
  it affects what this app can ship as structured data, not what a table is
  allowed to play.

**How this app is built around that**: rules data lives per-ruleset under
`src/data/rulesets/<id>/` (currently `5e` [2014], `5e-2024`, and `3.5e`),
registered generically in `src/data/rulesets/index.ts` so the onboarding
wizard, leveling data, and dice roller all pick up a new ruleset
automatically rather than hardcoding "D&D 5e" assumptions anywhere. Within
a ruleset, race/class pickers include a **"Custom…"** option specifically so
homebrew content isn't a dead end, and Background is deliberately a
free-text field rather than a fixed catalog (partly a licensing call, partly
because named Backgrounds are exactly the kind of thing tables customize or
replace outright). See `docs/leveling/README.md` for how per-ruleset class
data is sourced, and the `project_character_onboarding` memory for the
licensing reasoning behind what's modeled as structured data vs. free text.
