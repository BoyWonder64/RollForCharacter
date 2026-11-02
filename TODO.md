# TODO

Last reviewed: 2026-11-02. Items marked "(from code)" are limitations the source comments call out. When a feature is checked on a device and works, move it to **Features** in [README.md](README.md).

## Needs a device check
Built and covered by Jest, but nobody has run these on a device or the web build yet (there is no render-test library installed). Once each one is confirmed, move it to README Features.
- [ ] **Custom abilities and trackers**: the Class Resources card's "+ Create" modal (name, description, max uses by fixed / level / ability modifier, recharge, pips or counter, icon), "Use + Roll", and "Adjust" to change or hide a built-in ability. Logic: `resourceRepo.test.ts`, `rollFormula.ts`.
- [ ] **Starting equipment screen**: 2024 kit packages (A / B / C / gold), swapping weapons and armor by proficiency, Gear & Supplies, auto-equip and the Armor Class preview. Logic: `startingEquipment.test.ts`.
- [ ] **DM Encounter tab**: party roller, bestiary browser (filters, quantity, roll HP, custom creatures), creature stat-block rolls, initiative tracker and saved encounters. Logic: `monsterRolls.test.ts`, `dmCreatureRepo.test.ts`. The roll buttons come from parsing stat-block text, so look at a few odd monsters as well as common ones.

## Top priority: make everything homebrewable
Goal: anything the app ships as a catalog entry, a player can also create, edit and reuse. Custom abilities and trackers are done (see above). What's left is a shared library: today homebrew is per-character and one-off.

### Reusable homebrew library
- [ ] Custom race and class are one overlay per character (`customRace*` / `customClass*` columns on `characters`). A second custom class (multiclass) is not modeled (from code).
- [ ] Store homebrew once and pick it from any character: races, classes, subclasses, spells, feats, items, monsters and resources.
- [ ] Custom class progression (per-level features, spell slot table, resources, subclass level) so homebrew classes can use Level Up.
- [ ] Create UI for custom spells (the `spells` table already allows a null `slug` for hand-typed ones), conditions, skills, languages and backgrounds.
- [ ] Custom DM creatures can be added from the Encounter tab but only with name, HP, AC and DEX, and only into the current encounter. Give them actions and keep them in the library.
- [ ] Edit and delete for existing custom weapons, armor, magic items and feats (add flows exist; edit does not).
- [ ] Clone a catalog entry as a starting point for homebrew.
- [ ] Export and import homebrew as JSON to share between players.
- [ ] Custom abilities: an attached roll's `level` is total character level, not class level. Built-in abilities can be resized or hidden, but their recharge rule can't be changed and they can't get a roll.

### Content and legal wording
- [ ] The comment at [schema.ts:362](src/db/schema.ts#L362) says the app "only ships official D&D content". User-created content is the user's own, so reword it and add a note that homebrew is not covered by the SRD credits.
- [ ] Make the Credits screen in [settings.tsx](src/app/(tabs)/settings.tsx) distinguish shipped SRD/OGL content from user content.

## Starting equipment: still open
- [ ] 3.5e kits are text only ("A greataxe or other martial weapon"), with no swap and no stats, and the text ends up as gear items. This needs a 3.5e weapon, armor and shield catalog (from d20srd.org) and a proficiency model.
- [ ] 2014 "take starting gold instead" (rolled by class, unlike 2024's fixed amount) is not offered.
- [ ] Subclass proficiencies are not modeled (e.g. Life or War Domain Cleric heavy armor or martial weapons). Use the "show items I'm not proficient with" toggle for now.
- [ ] 2014 Druid: the picker follows the "(nonmetal)" proficiency, but "Shield" is assumed to be wooden.
- [ ] Sheet Armor Class is fixed at creation. Equipping or removing armor, levelling up or changing Dex does not recompute it. It should be derived from equipped armor.
- [ ] 2024 weapon Mastery properties are not modeled (the 2014 weapon table is shared with 2024).
- [ ] Kit items that say "your choice" (musical instrument, artisan's tools) are added as generic gear with no specific pick.

## DM mode: follow-ups
- [ ] The SRD data we ship has no monster saving-throw or skill proficiencies, so creature saves and checks use the raw ability modifier (the Bonus box covers proficiency).
- [ ] Conditions on creatures don't change their rolls automatically.
- [ ] The round counter and current-turn marker reset when the app restarts (initiative values persist).
- [ ] Spellcasting entries are shown as text only.
- [ ] The Encounter tab borrows the dice-roller tab icon; it needs its own.

## Known gaps (from code)
- [ ] The default ruleset is set in two places, and they disagree: `DEFAULT_RULESET` is `"5e"` in `rulesets/index.ts`, but `new.tsx` hard-codes `useState("5e-2024")`, and `RULESETS` was reordered to put 5e-2024 first. Set `DEFAULT_RULESET` to the one you want and use it in `new.tsx`.
- [ ] Provisions: `tracksProvisions` is stored at onboarding, but no mechanic uses it.
- [ ] Conditions on characters are a checklist only and don't change derived stats.
- [ ] Hit dice are tracked as a single pool; check mixed-die pools for multiclass characters.
- [ ] The old freeform `characters.feats` column is kept only for migration; remove once safe.
- [ ] `package.json` pins very new versions (Expo 58, React Native 0.88, TypeScript 6); confirm they install cleanly on a fresh clone and with `eas build`.

## Deferred: 2014 5e and 3.5e gaps (focus is 5e 2024 for now)
Found in the 2026-11-02 class and race review against open5e v2 (srd-2014) and d20srd.org. The full 3.5e audit is in [docs/EDITION_3_5E_GAPS.md](docs/EDITION_3_5E_GAPS.md).

### 2014 5e
- [ ] Cleric Divine Intervention: the 7-day cooldown after a success is not tracked (a long rest refills the single use).
- [ ] Sorcerer Sorcerous Restoration (regain 4 Sorcery Points on a short rest) and Fiend Fiendish Resilience (pick a damage type per rest) have no tracker; they are not use counters.
- [ ] Race traits that grant proficiencies or choices (Elf Weapon Training, Keen Senses, Skill Versatility, High Elf cantrip, Dwarven Combat Training, tool picks) are text only and aren't applied. The same goes for 2024 Keen Senses, Skillful and lineage cantrips.
- [ ] Races were split into SRD subraces (Hill Dwarf, High Elf, Lightfoot Halfling, Rock Gnome). Old saves named "Dwarf" etc. resolve through `aliases`; check that nothing else keys on the old race ids.

### 3.5e
- [ ] 3.5e has no language, weapon or armor catalog, and class progressions are partial.
- [ ] Sorcerer and Wizard progressions were not diffed against d20srd (only the shared sorcererWizard.htm page exists). Feature text for all 3.5e classes was not diffed either.
- [ ] Paladin Remove Disease is per week; the tracker has no weekly reset, so reset it by hand.
- [ ] Race rules aren't enforced: Half-Orc minimum Intelligence of 3, racial skill, save and attack bonuses, and favored class are all trait text only. With no language catalog, race languages aren't granted.
- [ ] Scaling class steps (rage uses, trap sense, damage reduction, wild shape, slow fall, sneak attack dice, etc.) are descriptive only; nothing applies the bonuses.
- [ ] Rogue special abilities (13/16/19) and Monk/Fighter bonus feats are listed, but the picks aren't tracked.

## Docs
- [ ] Code comments point to files that don't exist: `LEGAL.md` (3.5e OGL notes), `docs/DND_CONTENT_SOURCES.md` (SRD source and licence history), `FEATURES.md` / `ART_ONBOARDING.md` (icon pack notes) and `EQUIPMENT_ICON_CATALOG.md`. Recreate them or remove the comments.
- [ ] Keep README.md and [docs/DATA_LAYER.md](docs/DATA_LAYER.md) in step with any schema change (see Checks in README).
