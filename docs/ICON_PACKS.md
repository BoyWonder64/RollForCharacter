# Icon & Pixel-Art Packs

Inventory of every art pack in `pixel assets/`, its license, and how it could feed per-theme icon styles. See also `EQUIPMENT_ICON_CATALOG.md` (Raven deep-dive).

## Summary

| Pack | Folder | Size / format | License | Attribution required? | Used in app today |
|---|---|---|---|---|---|
| Raven Fantasy Icons (Clockwork Raven) | `Free - Raven Fantasy Icons/` | 2192 icons @ 16/32/64px, colorful | Free pack, credited in Legal screen (confirmed licensed in audit 2026-10-27) | Yes (already credited) | Equipment, spell schools, tab bar (`pixel` style) |
| Shikashi's Fantasy Icons Pack v2 | `Second Icon Set/Shikashi's Fantasy Icons Pack v2/` | 284 icons @ 32px, 16 cols | Commercial use + editing OK. **Based on game-icons.net (CC BY).** | **YES: "Matt Firth (shikashipx)" and "game-icons.net"** | Not yet (credit added to Legal screen) |
| Shikashi's Fantasy Icons Pack v1 | `Second Icon Set/Shikashi's Fantasy Icons Pack/` | 245 icons, older subset of v2 | Same | Same | No. **Superseded by v2, ignore/delete.** |
| 32rogues (Seth Boyles) | `32rogues/` | 32px sprites: rogues, monsters, animals, items, tiles | Commercial OK, modify OK, **no redistribution/resale, no NFT/blockchain, no generative-AI/ML projects** | No (appreciated) | Character portraits (`assets/portraits/`) |
| Pixel Dice (LullabyJazz) | `Dice/` | Dice sprites | See Legal screen | Yes (credited) | Dice roller |

## Shikashi v2: layout

Each sheet is **512px wide = 16 columns of 32x32**. v2 sheets are 512x867 (27 rows). Row order follows the pack's own list:

| Rows (approx.) | Content | Count |
|---|---|---|
| 0 | Status effects (skull, poison, sleep, silence, curse, dizzy, charm, zzz, paralysis, burn, sweat-drop) | 11 |
| 1 | Body (heart, lungs, stomach, brain, strong arm) | 5 |
| 2 | Buff/debuff arrows | 7 |
| 3 | Special moves (dripping blade ... sunrays) | 16 |
| 4 | Non-combat actions (speech bubbles, campfire, tent, forge, mining, woodcutting, spellbook, steal) | 9 |
| 5-6 | Weapons: swords, axes, flail, whip, shields (buckler/wooden/checkered), bows, crossbow, sling, boomerang, staves | 28 |
| 7-9 | Clothing/armour: hats, helms, armours, tunics, trousers, dress, cloak, belt, gauntlets, boots, rings, necklaces, pouch | 26 |
| 10 | Potions (4 normal, 4 upgraded, 4 rare, 3 special) + bandage | 16 |
| 11-17 | General items: tools, lantern, torch, bomb, rope, trap, instruments, keys, chest, herbs, coins, gems, 8 books, letter, scrolls, map, dice, card, wine | 64 |
| 18-20 | Food | 31 |
| 21 | Fishing | 15 |
| 22 | Resources (wood, stone, ore, gold, gems, cotton, yarn, cloth, pelts, claw, feathers) | 11 |
| 23 | Orbs (6 colors) | 6 |
| 24-26 | v2 additions: flasks, cauldrons, horse, beam, basket, 12 powders, casting hand, 6 magic scrolls, sunrise/sun/sunset/moon, snowflake, hot/cold | 39 |

Row numbers are approximate; verify by viewing the sheet before slicing.

### Background variants (v2)

All sheets share identical icon positions, so one slicing map works for all of them.

- `#1 - Transparent Icons.png`: transparent, dark pixel outlines. Best for light themes.
- `#2 - ... Drop Shadow.png`: transparent plus shadow.
- `BG 1a ... BG 11`: icons pre-composited on a flat/tinted tile. **BG 11 is a near-black purple tile** on which the white-outlined icons (skull, speech bubbles, dice, crossed swords) read clearly: good for Shadow / Sci-Fi / Galaxy.
- To get a "transparent with white outline" look on dark themes, use the transparent sheet (#1) and let the white outlines show on the dark surface. Verify per icon: a few have mostly-dark outlines and sink into dark backgrounds.

## 32rogues: layout

Sprite sheets with a companion `.txt` listing each sprite's coordinates and name (e.g. `items.txt`: `1.a. dagger`, `1.b. short sword` ...). Those txt files are the lookup table; no need to eyeball.

- `rogues.png` 224x224: ~49 character classes (already used for portraits)
- `monsters.png`, `animals.png`: creatures. Potential for the DM encounter/monster cards.
- `items.png` 352x832 + `items-palette-swaps.png`: weapons, armor, helms, rings, necklaces, potions, books, keys, coins. **Thin, pale-outline, lower-contrast style, desaturated; fits Manuscript/Western/Journal.**
- `tiles.png`, `autotiles.png`, `animated-tiles.png`: dungeon tiles, only useful if we ever build a map feature.
- `32rogues-palette.png`: 16x4 palette. Handy as a color reference for building a matching theme.

## Licensing review: what to know

1. **Shikashi / game-icons.net (action taken).** The pack's own terms say credit "Matt Firth (shikashipx)" and "game-icons.net" because many icons derive from CC BY game-icons.net art. I added that credit to the Legal screen (`src/app/legal.tsx`). Note v1's readme says CC BY **3.0** and v2's says **4.0**, so we ship only v2. Commercial use is fine; ads and a possible paid tier are not a problem.
2. **32rogues (needs your judgment).**
   - "May not redistribute or resell": bundling sprites inside an app binary is normally treated as use, not redistribution, but the **web build serves the raw PNGs** and the repo is git-hosted. Keep the repo private, don't ship the full sheets (only the cropped assets actually used), and never publish the pack in a public repo. Consider emailing the author to confirm bundling in an app is OK.
   - "May not be used in conjunction with generative AI or ML projects": the app itself contains no AI/ML, so it appears fine. This app is developed with an AI coding assistant, though. That clause is about the project, not the tooling, but if you want to be certain, ask the author. Cheap insurance.
3. **Public-repo hygiene.** `pixel assets/` is untracked raw packs. Keep it out of any public remote (`.gitignore` or a private repo); the shipped copies live in `assets/`.
4. This matches the rule in memory: SRD content only for rules text. Art packs are separate from that rule, but each needs its license read once. Done above.

## Per-theme icon styles: proposal

The plumbing already exists: `src/features/icons/iconStyles.ts` (`IconStyleId`, currently only `"pixel"`), `iconAssets.ts` (per-style lookup maps) and the `IconSettingsContext` setting. Plan:

1. Add style ids, for example `"raven"` (current), `"shikashi"` (transparent, light-friendly), `"shikashi-dark"` (BG 11 / white-outline set) and `"rogues"`.
2. Add an optional `defaultIconStyle` to each theme family, so selecting a theme can auto-pick an icon set. The user's explicit choice in Settings should still override it ("Auto (follow theme)" as the default option).
3. Suggested mapping:
   - Shadow, Sci-Fi, Galaxy, Torchlight: `shikashi-dark`
   - Manuscript, Journal, Western: `rogues`
   - Crimson, Forest, Steampunk: `raven` / `shikashi`
4. (Done: `scripts/build_shikashi_icons.py`) Slice the Shikashi v2 sheet once into individual PNGs (32x32 grid, a script keyed by name) into `assets/icons/shikashi/`, and write a name-to-icon map covering the same ids the existing styles use (potion, key, book, scroll, gem, coin, sword, shield, plus the equipment ids). Expo bundles `require()`s statically, so every file needs an explicit entry in the map.
5. Render with `imageRendering: pixelated` on web and nearest-neighbor scaling on native, so 32px art stays crisp when enlarged.

Shikashi has no spell-school icons, so spell schools would fall back to Raven or use the status/special-move icons (e.g. disintegrate = Evocation, psychic waves = Enchantment, sleeping eye = Divination). That mapping is a design decision to make with you.

## Status (implemented)

- Three options in Settings > Icons & Sound: **Auto (follow theme, default)**, `pixel` (Raven), `shikashi` (drop-shadow). The `shikashi-dark` style was removed 2026-11-05. Auto = Raven for Forest, Crimson and every dark mode; other light modes get Shikashi (`resolveIconStyle` in `iconStyles.ts`; edit `FAMILY_ICON_STYLE` to override per family).
- `scripts/build_shikashi_icons.py` slices the v2 sheets using a (row, col) table and regenerates `assets/icons/shikashi/` plus `src/features/icons/shikashiAssets.ts`. Edit the table and rerun to change any icon.
- Spell-school mapping (guesses from the art): abjuration=guard shield, conjuration=casting hand, divination=purple orb, enchantment=heart, evocation=ring of fire, illusion=psychic figure, necromancy=skull, transmutation=burning cauldron.
- Not used: Shikashi v1, BG 1-11 background tiles, 32rogues items/monsters.
- 32rogues license: user reviewed and accepted (2026-11-05). Credit is in the Legal screen. Still keep raw packs out of public repos and ship only cropped sprites.
