# TODO

Last reviewed: 2026-11-11. Items marked "(from code)" are limitations the source comments call out. When a feature is checked on a device and works, move it to **Features** in [README.md](README.md).

## Needs a device check
Built and covered by Jest, but nobody has run these on a device or the web build yet (there is no render-test library installed). Once each one is confirmed, move it to README Features.
- [ ] **Custom abilities and trackers**: the Class Resources card's "+ Create" modal (name, description, max uses by fixed / level / ability modifier, recharge, pips or counter, icon), "Use + Roll", and "Adjust" to change or hide a built-in ability. Logic: `resourceRepo.test.ts`, `rollFormula.ts`.
- [ ] **Starting equipment screen**: 2024 kit packages (A / B / C / gold), swapping weapons and armor by proficiency, Gear & Supplies, auto-equip and the Armor Class preview; also the newer "your choice" item picker (musical instrument/artisan's tools), 2014's "take gold instead" roll, the 3.5e weapon/armor catalog and swap picker, and 2024 weapon Mastery showing on the Equipment tab. Logic: `startingEquipment.test.ts`, `gearRepo.test.ts`, `weaponMastery.test.ts`.
- [ ] **Armor Class now recomputes live** from equipped armor/shields, feat bonuses, and Dex ASIs (previously fixed at creation) -- check equipping/unequipping armor and a shield updates the sheet immediately without leaving the Equipment tab, and that a Dex ASI at level-up updates it too. Logic: `armorClass.test.ts`, `gearRepo.test.ts`.
- [ ] **DM Encounter tab**: party roller, bestiary browser (filters, quantity, roll HP, custom creatures), creature stat-block rolls, initiative tracker and saved encounters. Logic: `monsterRolls.test.ts`, `dmCreatureRepo.test.ts`. The roll buttons come from parsing stat-block text, so look at a few odd monsters as well as common ones.
- [ ] **Per-character homebrew rules** (Edit → Homebrew, uncommitted work in progress): death-save counts, crit range, attunement limit, ability score cap, inspiration points. Logic: `homebrewRules.ts`, `homebrewRules.test.ts`. Check each override applies only while the toggle is on, and that the sheet (Stats tab inspiration, Equipment attunement, dice roller crit flag, Level Up cap) reflects it.
- [ ] **Homebrew Library screen** (Settings → Homebrew Library, [homebrew.tsx](src/app/homebrew.tsx)): browse, create, edit and delete library races, classes, subclasses, weapons, armor, magic items, feats, monsters, abilities and spells, plus "Add to Character" to clone a library entry onto a chosen character. Logic: `homebrewRepo.ts`, `gearRepo.ts`, `magicItemRepo.ts`, `featRepo.ts`, `dmCreatureRepo.ts`, `resourceRepo.ts`, `spellRepo.ts`.

## Top priority: make everything homebrewable
Goal: anything the app ships as a catalog entry, a player can also create, edit and reuse. Custom abilities and trackers are done (see above). The reusable library's **data layer** is now done too (see below) -- what's left is the UI on top of it.

### Reusable homebrew library
- [x] Data layer: races, classes, subclasses, spells, feats, items, monsters and resources can each be stored once in a shared library and cloned onto any character. New `homebrewRepo.ts` (races/classes/subclasses), plus homebrew-aware additions to `featRepo.ts`, `magicItemRepo.ts`, `dmCreatureRepo.ts` (monsters), `gearRepo.ts` (weapons/armor), `resourceRepo.ts`, and `spellRepo.ts`. Picking a library race/class still clones onto the existing `customRace*`/`customClass*` overlay columns -- see the item below, unchanged by this.
- [x] "Add to character" from the Homebrew Library screen: every row except monsters (DM-only, not a PC concept) has an "Add to Character" button that picks a character and clones the entry onto it, via the existing clone functions in each repo. Needs a device check -- see above.
- [ ] Wire the existing add-item/add-spell modals on the character sheet to offer "pick from library" for weapons and armor (their catalog pickers are static SRD-only data, unlike feats/spells/magic items whose catalog search already surfaces homebrew rows -- verified, no change needed there) and add a "from library" option next to Class Resources' "+ Create". Also offer "save to library" from each custom-add form (Add Weapon/Armor/Magic Item's Custom tab, the feat and spell pickers' Custom tab, Class Resources' "+ Create") so a one-off homebrew item typed on a character can be reused elsewhere.
- [ ] Custom race and class are still one overlay per character (`customRace*` / `customClass*` columns on `characters`). A second custom class (multiclass) is not modeled (from code).
- [ ] Custom class progression (per-level features, spell slot table, resources, subclass level) so homebrew classes can use Level Up.
- [ ] Create UI for custom conditions, skills, languages and backgrounds (spells now have a UI-ready data path -- see above -- these four still don't).
- [ ] Custom DM creatures: the repo now supports a full stat block (traits/actions/legendary actions) for a homebrew monster, but the Encounter tab's "+ custom creature" flow still only collects name/HP/AC/DEX and only adds into the current encounter, not the library -- the UI item above covers this.
- [ ] Edit and delete for a character's own one-off custom weapons, armor, magic items and feats (the ones typed directly onto a character, distinct from the new shared library, which does have edit/delete) -- add flows exist; edit still does not.
- [ ] Clone a catalog entry as a starting point for homebrew.
- [ ] Export and import homebrew as JSON to share between players.
- [ ] Custom abilities: an attached roll's `level` is total character level, not class level. Built-in abilities can be resized or hidden, but their recharge rule can't be changed and they can't get a roll.
- [ ] Custom race size picker ([new.tsx](src/app/(tabs)/characters/new.tsx), also `HomebrewRaceModal.tsx`) only offers Small/Medium. Add Large, and widen the `"Small" | "Medium"` union in [types.ts](src/data/rulesets/types.ts) (`size`, `sizeOptions`), `characterRepo.ts`, `homebrewRepo.ts`, plus the `customRaceSize` column type.

### Content and legal wording
- [x] The `feats` table comment in [schema.ts](src/db/schema.ts) said the app "only ships official D&D content" -- reworded to note homebrew feats share the same table (`sourceKey: "homebrew"`) and aren't SRD/CC-BY/OGL content.
- [x] Credits/content-sources moved off the main Settings screen into their own [legal.tsx](src/app/legal.tsx) screen (Settings → Legal & Licenses), which now also states that Homebrew Library content isn't covered by the SRD/CC-BY/OGL licenses listed there.
- [x] Icon packs: Shikashi (v2) added as selectable icon styles with credit to Matt Firth (shikashipx) and game-icons.net; 32rogues credit present; license terms reviewed and accepted by user 2026-11-05 (see [docs/ICON_PACKS.md](docs/ICON_PACKS.md)).

## Starting equipment: done (2026-11-04), needs a device check
All seven items below are implemented and covered by Jest (`startingEquipment.test.ts`, `gearRepo.test.ts`, `armorClass.test.ts`, `weaponMastery.test.ts`) -- see the "Needs a device check" section at the top. Once confirmed on a device, fold this into README Features.
- [x] **3.5e weapon/armor/shield catalog + proficiency model**: `WEAPONS_35E`/`ARMOR_35E` ([3.5e/weapons.ts](src/data/rulesets/3.5e/weapons.ts), [3.5e/armor.ts](src/data/rulesets/3.5e/armor.ts)), sourced from d20srd.org (see [LEGAL.md](src/data/rulesets/3.5e/LEGAL.md)). `isProficientWithWeapon`/`isProficientWithArmor` now understand 3.5e's phrasing ("All simple weapons", comma-form names, "Crossbow (light or heavy)", "(except tower shields)", combined qualifiers). 3.5e classes' `startingEquipment` now grants real catalog items instead of flavor text. Known gaps: Medium-creature damage only (no size-based damage), armor's check-penalty/spell-failure/speed fields are stored but nothing computes with them yet (3.5e's AC/attack math is still 5e-shaped -- see [docs/EDITION_3_5E_GAPS.md](docs/EDITION_3_5E_GAPS.md)).
- [x] **2014 "take starting gold instead"**: every 2014 class's first starting-equipment line now offers a `goldRoll("4d4")` option alongside its kit. Deliberately a generic, non-PHB-specific formula (the real per-class PHB table isn't SRD-licensed) -- picking it forfeits the character's whole kit, not just that line.
- [x] **Subclass proficiencies**: `Subclass.bonusArmorProficiencies`/`bonusWeaponProficiencies` (types.ts), set on 2014 Life Domain Cleric (heavy armor); unioned in via `effectiveArmorProficiencies`/`effectiveWeaponProficiencies` (characterCalculations.ts) at every proficiency-check call site. "War Domain" from the original TODO wording doesn't exist in this app's catalog and never will -- it's non-SRD (see `project_subclass_policy` memory) -- so Life Domain's heavy armor was the only real case in scope.
- [x] **2014 Druid nonmetal shield**: `isProficientWithArmor` now runs shields through the same nonmetal check as other armor (the one generic 5e Shield entry counts as the default wooden-equivalent option) instead of exempting shields from the check entirely.
- [x] **Armor Class now derives from equipped armor**: `computeEquippedArmorClass` (characterCalculations.ts) + `recomputeArmorClass` (new `armorClassRepo.ts`), called from equip/unequip/add/remove armor, a Dex ASI at level-up, and feat add/toggle/remove. The manual AC field on the Edit screen stays, matching how Max HP/Proficiency Bonus are also manually overridable there.
- [x] **2024 weapon Mastery**: `WeaponDefinition.mastery` (types.ts), populated in `5e-2024/weapons.ts` from open5e's SRD 5.2 data, shown on the Equipment tab's weapon card.
- [x] **"Your choice" kit items**: new `itemChoice` equipment grant (types.ts) resolves to a real named pick from `toolsAndInstruments.ts` (artisan's tools, musical instruments, gaming sets) or a typed custom name, same pattern as the existing weapon swap picker.

## DM mode: follow-ups
- [ ] The SRD data we ship has no monster saving-throw or skill proficiencies, so creature saves and checks use the raw ability modifier (the Bonus box covers proficiency).
- [ ] Conditions on creatures don't change their rolls automatically.
- [ ] The round counter and current-turn marker reset when the app restarts (initiative values persist).
- [ ] Spellcasting entries are shown as text only.
- [x] The Encounter tab now has its own icon (Raven and Shikashi packs).

## Party mode: WiFi/LAN option (pinned, not started)
Idea: let a DM and players join a party over the same WiFi network instead of through Supabase, so a table with no internet access can still use party sync. Current `partyRepo.ts` is tightly coupled to Supabase (RPCs, `auth.getUser()`, Postgres tables, realtime channels), so this would need a backend-agnostic layer underneath [party.tsx](src/app/(tabs)/party.tsx), [CreatePartyModal.tsx](src/components/CreatePartyModal.tsx) and [JoinPartyModal.tsx](src/components/JoinPartyModal.tsx).

Design decisions made (2026-11-03), not yet built:
- [ ] LAN mode works fully offline, no Supabase account/sign-in required -- separate from cloud party mode, not a transport swap underneath the same accounts.
- [ ] Player discovery is automatic via Bonjour/mDNS (DM's party appears in a list, no manual IP entry) rather than manual IP or QR code.
- [ ] Blocked on: this requires a native TCP/socket module (e.g. `react-native-tcp-socket`) plus an mDNS module (e.g. `react-native-zeroconf`), which means the app can no longer run in Expo Go for this feature and needs a dev-client rebuild (`npx expo run:ios|android` or an EAS dev build). User put a pin in accepting that tradeoff on 2026-11-03 -- revisit before implementing.

## Mini campaigns (not started)
- [ ] Mini campaigns: short, self-contained adventures a DM can run from the app.
- [ ] Extra: ship a set of campaigns written by the project owner. These are hand-written, **not AI-generated** -- don't draft, expand or fill in campaign content with AI; the app only provides the structure to hold and display them.

## Known gaps (from code)
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
- [x] Races were split into SRD subraces (Hill Dwarf, High Elf, Lightfoot Halfling, Rock Gnome). Old saves named "Dwarf" etc. resolve through `aliases`. Audited: every race lookup goes through `getRaceDefinition` (name, id, then alias), so nothing keys on the old ids.

### 3.5e
- [ ] 3.5e has no language, weapon or armor catalog, and class progressions are partial.
- [ ] Sorcerer and Wizard progressions were not diffed against d20srd (only the shared sorcererWizard.htm page exists). Feature text for all 3.5e classes was not diffed either.
- [ ] Paladin Remove Disease is per week; the tracker has no weekly reset, so reset it by hand.
- [ ] Race rules aren't enforced: Half-Orc minimum Intelligence of 3, racial skill, save and attack bonuses, and favored class are all trait text only. With no language catalog, race languages aren't granted.
- [ ] Scaling class steps (rage uses, trap sense, damage reduction, wild shape, slow fall, sneak attack dice, etc.) are descriptive only; nothing applies the bonuses.
- [ ] Rogue special abilities (13/16/19) and Monk/Fighter bonus feats are listed, but the picks aren't tracked.

## Docs
- [x] `LEGAL.md` (3.5e OGL notes, at `src/data/rulesets/3.5e/LEGAL.md`), `docs/DND_CONTENT_SOURCES.md`, `FEATURES.md`, `ART_ONBOARDING.md` and `EQUIPMENT_ICON_CATALOG.md` all exist now -- the old "points to files that don't exist" note was stale.
- [ ] Keep README.md and [docs/DATA_LAYER.md](docs/DATA_LAYER.md) in step with any schema change (see Checks in README).

## Programmer additions
- [x] Long-press delete only works with Developer mode on (done 2026-11-05). Long-press now offers Duplicate or Delete.
- [x] Developer mode review done (2026-11-05). Built, needs a device check: dice override (Settings → Developer mode; random / nat 20 / nat 1 / max / min / seeded), sample character generator (5e, 2024, 3.5e at levels 1/5/10/20), duplicate character, data health check, red DEV badge in the tab header, diagnostics now share the Supabase host and "signed in: yes/no" instead of the full URL and email. Logic: `diceOverride.test.ts`, `devTools.test.ts`.
- [ ] Developer mode ideas not built yet: sync inspector with force push/pull, character JSON export/import, feature-flag toggles, in-app error log (many `.catch(() => {})` swallow failures), theme/font preview sheet, reset tools, hiding the toggle behind a hidden gesture, and gating other destructive actions (homebrew delete, character reset) the same way as character delete.

- [x] Profile picture not saving (fixed 2026-11-05, needs a device check): sprite/upload portraits now persist via `persistPortrait` for non-`file://` URIs, the Edit screen saves a changed/removed portrait immediately, and the wizard alerts if the portrait save fails. Check: new character with a sprite and with an upload, then change it from Edit; it should show on the list, sheet header and after restart.
## Ideas
- [ ] Look into Game Center (and Google Play Games) for multiplayer.
