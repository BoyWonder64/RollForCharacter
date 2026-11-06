# D&D 3.5 Edition: gap audit

Audited 2026-11-02 by reading the code and grepping for where each 3.5e field is used. Nothing here was checked on a device. Items say **Verified** when a search or the code confirmed them, and **Inferred** when it follows from the code but was not run.

## The short version

The 3.5e ruleset has real data: 11 core classes with level-by-level features, 7 core races, 45 skills, ~700 spell entries and the XP table. But **the app's calculation, roll and sheet code is 5e code**, and only the XP table branches on the ruleset. So a 3.5e character is created with 3.5e names and then computed with 5e rules: a flat proficiency bonus, six ability saves, advantage/disadvantage, death saves, inspiration and exhaustion.

Fixing 3.5e is mostly **not a data job**. It needs a rules layer that is edition-aware (saves, base attack bonus, skill ranks, spell DCs and slots, armor class, level-up). Section 1 is where to start. Sections 2 and 3 are the missing catalogs and the 5e-only features that show up on a 3.5e sheet.

Related, in [TODO.md](../TODO.md): the "Deferred: 2014 5e and 3.5e gaps" section (class and race diffs against d20srd) and "Starting equipment" (3.5e kits are text only).

---

## 1. Wrong numbers on the sheet (3.5e characters use 5e math)

### 1.1 Saving throws
- **Verified.** 3.5e classes have `baseSaveProgression` (Fortitude / Reflex / Will, good or poor) in [3.5e/classes.ts](../src/data/rulesets/3.5e/classes.ts), but **nothing reads it**. A search of `src` finds it only in the type and the data.
- 3.5e classes also have no `savingThrows`, so the Saving Throws block in [StatsTab.tsx](../src/features/characters/StatsTab.tsx) shows five-e style *six ability* saves with no proficiency: just the raw ability modifier.
- Needed: Fort (Con), Ref (Dex), Will (Wis) = class base save (summed across classes for multiclass) + ability modifier + feats/race. Roll buttons, the structured roller and the sheet all need it.

### 1.2 Attack bonus and Base Attack Bonus (BAB)
- **Verified.** There is no BAB anywhere (`ClassDefinition` has no field; classes only mention it in `summary` text).
- `weaponAttackBonus` and `buildStructuredRollPlan` add the 5e *proficiency bonus* for proficient weapons. In 3.5e an attack is BAB + ability modifier + size + misc, with a -4 non-proficiency penalty (not a lost bonus).
- Missing: BAB per class and level (full, 3/4, 1/2), multiclass stacking, iterative attacks (+6/+1, +11/+6/+1…), two-weapon fighting penalties, grapple bonus, ranged vs. melee modifiers, critical threat range and multiplier (the weapon table has neither).

### 1.3 Proficiency bonus
- **Verified.** `proficiencyBonusForLevel` is the 5e table (+2 to +6) and is stored on every character. 3.5e has no such value. It is shown as "Prof. Bonus" on the sheet and added to saves, skills, attacks and spell attacks for 3.5e characters.

### 1.4 Skills
- **Verified.** 3.5e skills are ranks, not proficiencies. The app models a trained / not-trained toggle plus the 5e proficiency bonus (`isSkillProficient`, `passiveSkillScore`, the `check` roll mode).
- Onboarding's skill step is 5e-shaped: `classSkills` only *groups* the list. The pick count falls back to a hard-coded 2 (`skillChoiceSpec` in [new.tsx](../src/app/(tabs)/characters/new.tsx)) because 3.5e classes have no `skillChoices`.
- Missing: skill points per level (class base + Int mod, x4 at 1st level, human bonus), 1 point per rank for class skills vs. 2 for cross-class, max ranks (level + 3, or half for cross-class), trained-only skills, armor check penalty, synergy bonuses, racial skill bonuses (e.g. Elf +2 Listen/Search/Spot), feat bonuses, "take 10 / take 20".
- Skill list shape: Craft, Profession and Perform are one entry each (the SRD lets you take several, e.g. Craft (armorsmithing)). Speak Language is given an Intelligence key as a convention.

### 1.5 Armor Class
- Sheet AC is a number fixed at creation (see the "Starting equipment" section in TODO.md). In 3.5e it is 10 + armor + shield + Dex (capped by armor's max Dex) + size + natural + deflection + dodge. There is no touch AC or flat-footed AC, no max Dex bonus, no armor check penalty, no arcane spell failure chance, and no speed reduction for armor or load.

### 1.6 Hit points and hit dice
- **Verified.** `ClassDefinition.hitDie` is typed `6 | 8 | 10 | 12`. The 3.5e **Sorcerer and Wizard have d4** and are stored as d6, so their HP at every level is too high.
- The HP formulas use the 5e average (`floor(die/2)+1`). 3.5e usually rolls or takes the average the same way, so that part is fine.
- `maxHp` is floored at 0 (`applyDamage` and `adjustHp` clamp to 0). 3.5e has *negative* hit points: disabled at 0, dying at -1 to -9, dead at -10, with a 10% stabilize roll each round. The 5e death-save tracker is used instead (`rollDeathSave`, `deathSaveSuccesses/Failures`).
- Hit Dice spending on a short rest (`spendHitDie`) and "long rest restores all HP" are 5e rules. 3.5e heals about 1 HP per character level per night of rest (2 with full bed rest) and has no short rest.

### 1.7 Level up
- **Verified.** The ability increase in [LevelUpModal.tsx](../src/components/LevelUpModal.tsx) is the 5e one: "+2 to one score, or +1 to two scores (max 20)". 3.5e gives **+1 to one ability** every 4th level, with no cap at 20.
- The 3.5e data separates `featLevels` and `abilityScoreIncreaseLevels`, but the code only calls `needsAsiOrFeatChoice` (a union). The modal offers "ability *or* feat" at any such level, so a level that grants a feat only, or an ability point only, is not presented as that. The data cannot say that a 1st-level human or Fighter gets *two* feats at once (a documented gap in `classProgression.ts`).
- Missing: skill points per level, BAB/save changes, new spells per day, new feats beyond the class table.

### 1.8 Spellcasting math
- **Verified.** The Spell Save DC is the 5e formula (`8 + proficiency + ability`, see the tooltip in StatsTab). 3.5e is `10 + spell level + ability modifier`, and it depends on the *spell's* level.
- Spell attacks (`buildStructuredRollPlan`, mode `spell`) use ability + proficiency. 3.5e uses BAB + ability for touch attacks.
- **Verified.** [spellLimits.ts](../src/features/characters/spellLimits.ts) is a 5e table. For `ruleset !== "5e"` it reads the progression row only if `spellsKnown` exists (3.5e Bard and Sorcerer). Wizard, Cleric, Druid, Paladin and Ranger fall through to the **5e** formulas (e.g. prepared = level + ability modifier; wizard spellbook = 6 + 2 per level). 3.5e prepares a number equal to *spells per day*, and a wizard's spellbook starts with all 0-level spells plus 3 + Int modifier 1st-level spells, then +2 per level.
- **Bonus spells for high ability scores** (extra slots per spell level) are not modeled.
- **0-level spells** are not a slot-limited resource in the data (`SpellSlotRow` has no field), so the cantrip-equivalents have no daily count. The data comment says so.
- Paladin and Ranger start casting at 4th level (handled in data), but onboarding's spell step offers spells up to `ceil(level / 2)` regardless of edition, which is a 5e shape.
- Arcane spell failure, Concentration checks (the app has the 5e *concentration tracker* instead), caster level vs. class level, spell resistance and metamagic are not modeled.

---

## 2. Missing catalogs and data

| Catalog | State |
| --- | --- |
| **Spells in the database** | **Verified. The 700 3.5e spell entries are never loaded.** [seedSpells.ts](../src/db/seedSpells.ts) seeds only `SPELLS_5E` (tagged `'5e'`), and `listSpellCatalog` has no ruleset filter. The spell pickers (onboarding, Manage Spells, Level Up Spells) read the DB, so **a 3.5e Wizard is offered 5e spells**. The same is true for `5e-2024`: `SPELLS_5E_2024` is also never seeded. This is the single biggest blocker for 3.5e casters (and affects 2024). |
| Weapons | **Resolved (2026-11-04).** `WEAPONS_35E` in [weapons.ts](../src/data/rulesets/3.5e/weapons.ts): 68 Simple/Martial/Exotic weapons with threat range, critical multiplier, and range increment (see `WeaponDefinition`'s 3.5e-only fields in [types.ts](../src/data/rulesets/types.ts)). Medium-creature damage only (no size-based damage). `isProficientWithWeapon` ([gearRepo.ts](../src/features/characters/gearRepo.ts)) now understands "All simple/martial weapons", comma-form catalog names in natural word order (e.g. "Hand crossbow" vs. "Crossbow, hand"), and combined qualifiers like "Crossbow (light or heavy)". |
| Armor and shields | **Resolved (2026-11-04).** `ARMOR_35E` in [armor.ts](../src/data/rulesets/3.5e/armor.ts): 18 entries with `maxDexBonus`/`armorCheckPenalty`/`arcaneSpellFailure`/`speedWith30FtBase`/`speedWith20FtBase` (data is stored; nothing computes with the check-penalty/spell-failure/speed fields yet -- AC/attack math is still the 5e-shaped gap below). `isProficientWithArmor` ([startingEquipment.ts](../src/features/characters/startingEquipment.ts)) now handles "(except/including tower shields)" and combined qualifiers like "(nonmetal, except tower shields)". |
| Feats | **Verified.** `src/data/feats.ts` is generated from open5e's 5e SRD only. 3.5e has ~100 SRD feats with prerequisites (BAB, ability scores, other feats), fighter bonus feats and metamagic and item-creation feats. The feat picker offers 5e feats to 3.5e characters. |
| Languages | None. Languages are free text; race languages are not granted. |
| Magic items | 5e SRD only (`magic_items` has no ruleset). 3.5e item rules (caster level, slots, costs) are different. |
| Monsters / DM mode | 5e SRD stat blocks only, and DM mode parses 5e stat-block text. 3.5e monsters (CR, Hit Dice, BAB, saves, space/reach, feats) are absent. |
| Conditions | **Verified.** One shared 5e list (blinded, charmed, deafened, frightened, grappled, incapacitated, invisible, paralyzed, petrified, poisoned, prone, restrained, stunned, unconscious) with **5e text** (advantage, disadvantage). 3.5e has others (dazed, dazzled, entangled, exhausted, fatigued, flat-footed, nauseated, panicked, shaken, sickened…) and different effects. |
| Domains and deities | The 22 cleric domains are in the data as subclasses, but the domain's spell list is text, not slots, and deities are not modeled. |
| Prestige classes, epic levels (21+) | Not present. The level input clamps to 1-20. |
| Starting gold | The PHB's starting gold by class is not in the SRD data. |
| Special materials, weapon and armor qualities, size-based weapon damage, magic weapon enhancement rules | Not modeled. |

---

## 3. 5e-only features that appear on a 3.5e sheet

**Verified** in code (nothing branches on `ruleset`): Inspiration, Exhaustion levels, death saves, Hit Dice and short rest, the concentration tracker, advantage/disadvantage in the roller, passive scores (cosmetic), electrum pieces (3.5e has none), and the **Background** onboarding step (3.5e has no backgrounds). The race step and the language grant are the only gameplay screens that skip 3.5e correctly (the languages step is hidden because there is no catalog).

---

## 4. Class and race features that are text only

Already noted in TODO.md; collected here for completeness. Nothing below changes a number:
- Class features: rage bonuses, Sneak Attack dice, Smite, Turn Undead, Wild Shape, Ki, bardic music effects, damage reduction, trap sense, evasion, fast movement. Only use counts (`resources`) are tracked.
- Bonus feat picks (Fighter, Monk, Wizard) and Ranger favored enemies and combat style are not recorded.
- **Companions**: Wizard/Sorcerer familiar, Druid animal companion, Ranger animal companion, Paladin special mount have no sheet.
- Race: Half-Orc Int minimum, racial skill/save/attack bonuses, favored class, size modifiers to AC and attacks, Human extra feat and 4 + 1 skill points, speed vs. armor.
- Alignment restrictions by class (Paladin lawful good, Monk lawful, Barbarian non-lawful, Druid neutral component, Bard non-lawful) are not enforced.

---

## 5. Multiclassing

**Verified** the shared code is 5e:
- [multiclass.ts](../src/features/characters/multiclass.ts) combines caster levels into one slot table (the 5e rule) using Wizard's progression. In 3.5e each class has its own spells per day and caster level.
- Missing: multiclass XP penalty and favored class, BAB and save stacking, skill points per class, the DM's prestige class prerequisites.
- `MulticlassModal` checks no prerequisites for either edition (5e requires 13 in the class's ability; 3.5e has none except prestige classes and alignment restrictions).

---

## 6. Onboarding flow for a 3.5e character

- Ability scores: Standard Array 15, 14, 13, 12, 10, 8 (5e) or 4d6 drop lowest. 3.5e's standard methods are **point buy (25 points)** or 4d6 drop lowest; no point buy exists for either edition.
- Skills step: pick count is fixed at 2 (see 1.4).
- Equipment step: text only, no swaps (see TODO.md).
- Languages: free text on the proficiencies step.
- Background step: shown, but 3.5e has no backgrounds.
- Max HP uses the d6 fix-up for Sorcerer and Wizard (see 1.6).
- Spells step: offered the wrong catalog (see Section 2) and the 5e spell-count limits (see 1.8).

---

## 7. Known approximations in the data itself

From the comments in `3.5e/*.ts`; these are documented choices rather than bugs:
- `ClassDefinition` has no BAB field and `hitDie` cannot express d4.
- `SpellSlotRow` excludes the 0-level column; `cantripsKnown` is reused for Bard and Sorcerer 0-level *known* counts only.
- ASI and feat levels are the universal table, plus class bonus-feat levels added to `featLevels` without counts.
- Wizard schools are the subclass choice (Universal excluded). Cleric domains are the subclass choice. Other classes have none.
- Concentration and ritual are `false` on every spell (no 3.5e equivalent).
- Spells with different levels for different classes get one entry per level (e.g. `cure-light-wounds` and `cure-light-wounds-ranger`), so the same name appears more than once (700 entries, 591 names).
- Target/Area/Effect, saving throw and spell resistance are folded into the start of each spell's description.
- Known from TODO.md: Sorcerer/Wizard progressions and all class feature text were not diffed against d20srd; Paladin Remove Disease is weekly with no weekly reset.

---

## 8. Process and tests

- **Verified.** The only automated 3.5e test is the XP table ([xpTable.test.ts](../src/features/characters/__tests__/xpTable.test.ts)). No 3.5e class, spell, skill, onboarding or sheet test exists.
- `LEGAL.md` (referenced from the 3.5e data) does not exist; the OGL notice is in the Settings credits screen. See TODO.md.

---

## Suggested order of work

1. **Load the right spells.** Seed per ruleset (or filter by it) so a 3.5e caster, and a 2024 caster, see their own list. Small, and unblocks everything caster-related. *(Small)*
2. **Edition-aware calculation layer.** One place that answers "what is this character's save / attack / skill / AC / spell DC", branching on `ruleset`, with tests. Use it from the sheet, rolls and onboarding. Add BAB and `baseSaveProgression` (already in the data) first. *(Medium; biggest payoff)*
3. **Skill ranks.** Skill points, class vs. cross-class, max ranks, the sheet and the roller. *(Medium)*
4. **Level-up for 3.5e.** +1 ability, feat vs. ability level specifics, skill points, d4 hit die (widen the type). *(Small to medium)*
5. **Catalogs:** weapons, armor, then feats (scrape d20srd.org, same method as the class data), then conditions and languages. *(Medium each)*
6. **Hide 5e-only features** (Inspiration, Exhaustion, death saves, Hit Dice, Background step, electrum) when the ruleset is 3.5e, and replace death/dying with negative HP. *(Small to medium)*
7. **Spells per day**: bonus spells, 0-level slots, prepared counts, spellbook size, spell DC by spell level. *(Medium)*
8. Multiclass rules, companions, point buy, prestige classes. *(Later)*
