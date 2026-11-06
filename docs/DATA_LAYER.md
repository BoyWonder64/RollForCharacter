# Data layer reference

RollForCharacter has no network API. All data is local: SQLite (via `expo-sqlite` and Drizzle ORM) plus AsyncStorage for UI settings. The "API" is the set of repo modules under `src/features/`, which screens and components call directly. Last verified against the code on 2026-11-02.

## Database

- [src/db/client.ts](../src/db/client.ts) opens `rollforcharacter.db`, turns on foreign keys, then runs in order: `CREATE_TABLES_SQL`, `runColumnMigrations`, and the seeders (spells, equipment items, magic items, monsters, feats). It exports `db`.
- [src/db/schema.ts](../src/db/schema.ts) is the Drizzle schema. [src/db/schemaSql.ts](../src/db/schemaSql.ts) is the matching raw `CREATE TABLE IF NOT EXISTS` SQL. **Both must be changed together.** Jest builds its in-memory DB from the SQL ([src/db/__mocks__/client.ts](../src/db/__mocks__/client.ts), sql.js).
- A column added to an existing table also needs an entry in `COLUMN_MIGRATIONS` in [migrateColumns.ts](../src/db/migrateColumns.ts), because `CREATE TABLE IF NOT EXISTS` does nothing on an existing install. A brand-new table does not.

### Tables

| Group | Tables |
| --- | --- |
| Character | `characters`, `character_classes` (multiclass rows), `character_resource_uses`, `character_custom_resources` (player-made abilities), `character_resource_overrides` (house rules on built-in ones) |
| Spells | `spells` (catalog and hand-typed), `character_spells`, `spell_slots` |
| Gear | `character_weapons` (with `quantity`), `character_armor`, `character_gear_items` (packs, foci, tools, ammunition), `character_magic_items` |
| Feats | `feats` (catalog), `character_feats` |
| Campaign | `campaign_notes`, `campaign_items` |
| DM | `monsters` (catalog), `dm_creatures`, `dm_party_initiative`, `dm_encounters` |
| Dice | `dice_roll_history` |
| Reference catalogs | `feats`, `magic_items`, `monsters`, `spells`, `equipment_items` (seeded on startup) |

Rulesets (races, classes, class progressions, skills, weapons, armor, languages) are not in the database. They are TypeScript data in `src/data/rulesets/<id>/` and are read through [src/data/rulesets/index.ts](../src/data/rulesets/index.ts) (`RULESETS`, `getRulesetCatalog`). Ruleset ids: `5e`, `5e-2024`, `3.5e`.

Custom race/class ("homebrew") is stored as overlay columns on `characters` (`custom_race_*`, `custom_class_*`) and merged by `getRaceDefinitionForCharacter` / `getClassDefinitionForCharacter` in [characterCalculations.ts](../src/features/characters/characterCalculations.ts).

## Repo modules

All functions are async unless noted and take a character id or `Character` object.

| Module | Functions |
| --- | --- |
| `characters/characterRepo` | `listCharacters`, `getCharacter`, `createCharacter`, `createCharacterFromOnboarding`, `deleteCharacter`, `updateCharacter`, `adjustHp`, `applyDamage`, `applyHeal`, `adjustCurrency`, `toggleCondition`, `setExhaustionLevel`, `toggleInspiration`, `addXp`, `levelUp`, `rollDeathSave`, `stabilizeDeathSaves`, `reviveCharacter`, `startConcentration`, `endConcentration`, `spendHitDie`, `shortRest`, `longRest` |
| `characters/characterClassRepo` | `listCharacterClasses`, `addClass`, `levelUpClass` |
| `characters/resourceRepo` | `listCharacterResources`, `spendResourceUse`, `restoreResourceUse`, `restoreAllResources`, `applyShortRestRecharge`; player-made abilities: `listCustomResources`, `addCustomResource`, `updateCustomResource`, `removeCustomResource`, `rollResource`, `setResourceOverride` (and `listCharacterResources(character, { includeHidden })`), plus `parseLevelBreakpoints` / `formatLevelBreakpoints` (pure) |
| `characters/gearRepo` | weapon and armor catalogs, add (catalog or custom, with optional `{ equipped, quantity }`), remove, set equipped, gear items (`listGearItems`, `addGearItem` which stacks by name, `setGearItemQuantity`, `removeGearItem`), plus attack and AC helpers (`weaponAttackBonus`, `describeWeaponDamage`, `describeArmorAc`, `isProficientWithWeapon`, ...) |
| `characters/startingGearRepo` | `applyStartingGear`: saves what onboarding's Starting Equipment step resolved to (weapons, equipped armor, gear items, gold) |
| `characters/magicItemRepo` | `listMagicItemCatalog`, `listMagicItemRarities`, `listCharacterMagicItems`, `addMagicItemFromCatalog`, `addCustomMagicItem`, `removeCharacterMagicItem`, `setMagicItemAttuned`, `setMagicItemEquipped` |
| `characters/featRepo` | `listFeatCatalog`, `listCharacterFeats`, `addResolvedFeat`, `addCatalogFeat`, `addCustomFeat`, `setFeatEnabled`, `removeCharacterFeat` |
| `characters/campaignRepo` | notes and special items: list, add, update (notes only), remove |
| `spells/spellRepo` | `listSpellsForCharacter`, `listSpellCatalog`, `addSpellToCharacter`, `addCatalogSpellToCharacter`, `togglePrepared`, `removeCharacterSpell`, `listSpellSlots`, `setSpellSlot`, `adjustSpellSlotUsage`, `resetSpellSlotUsage` |
| `dice/diceRepo` | `saveRoll`, `recentRolls`, `clearRollHistory` |
| `dm/dmCreatureRepo` | `listMonsterCatalog`, `getMonsterCatalog` (cached), `listDmCreatures`, `addDmCreatureFromCatalog` (quantity, rollHp, auto-numbering), `addCustomDmCreature`, `updateDmCreatureHp`, `updateDmCreatureNotes`, `setDmCreatureInitiative`, `toggleDmCreatureCondition`, `setDmCreatureAbilityUses`, `removeDmCreature`, `clearDmCreatures`, `clearAllInitiative`, `listPartyInitiative`, `setPartyInitiative`, `saveCurrentEncounter`, `listSavedEncounters`, `loadSavedEncounter`, `deleteSavedEncounter` |
| `dm/monsterRolls` | Pure (no DB): parses stat-block text into rollable attacks, damage, save DCs, recharge and multiattack components; rolls checks, saves, initiative, attacks and damage (with crit doubling) |

Pure helpers with no database access: `dice/diceEngine`, `dice/structuredRolls`, `characters/characterCalculations`, `characters/multiclass`, `characters/spellLimits`, `characters/xpTable`, `characters/startingEquipment` (proficiency checks, swap candidates, resolving a selection, starting Armor Class; it imports `isProficientWithWeapon` from `gearRepo`, so tests that import it mock the db client).

## Starting equipment

A class's `startingEquipment` is a list of lines; each line is a list of options; each option is a list of grants (`weapon`, `weaponChoice`, `armor`, `item`, `gold`). One option = included, several = the player picks one. 5e (2014) uses many lines (the SRD's "(a) or (b)" choices). 5e-2024 uses a single line whose options are the SRD packages (A, B, C, and gold only). Builders live in `src/data/rulesets/equipmentHelpers.ts`. `StartingEquipmentSelection` holds the player's chosen option per line plus any weapon/armor swapped for another; `resolveStartingGear` turns it into concrete gear and `applyStartingGear` saves it. 3.5e kits are still text-only (no catalog).

## Limited-use resources (Action Surge, Second Wind, ...)

Defined as `ClassResourceDefinition` ([types.ts](../src/data/rulesets/types.ts)) inside class progressions, subclasses and races. `listCharacterResources` merges every source for the character and joins spent uses from `character_resource_uses` (no row means full). Short rests apply `shortRestRegain`; a long rest restores everything. 
Player-created abilities live in `character_custom_resources` and are converted to a `ClassResourceDefinition` with id `custom-<rowId>` (`customRowToDefinition`), so spent uses use the same `character_resource_uses` table. Max uses is one of: fixed, level breakpoints, or ability modifier (+ bonus, with a minimum). `rechargeOn` is `short` (short or long rest), `long` (long rest only) or `manual` (rests never touch it, via `manualRecharge`). Stored uses above a lowered max are clamped when listed. Deleting a resource also deletes its spent-use row. An optional `rollFormula` (resolved by `dice/rollFormula.ts`, rolled by `rollResource`, which does not spend a use) and an `icon` (a campaign-item icon id) are stored on the row. Built-in resources can be changed per character via `character_resource_overrides` (a replacement max, or hidden); overrides never apply to custom resources. Remaining work is in [TODO.md](../TODO.md).

## Settings (AsyncStorage)

React contexts under `src/features/settings/`, `src/features/icons/` and `src/theme/` hold: theme and font (global and per character), icon style, DM mode, keep-awake, roll history.
