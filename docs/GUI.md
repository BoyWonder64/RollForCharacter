# Pixel GUI (frames + banners)

Pixel-art borders and banners that "skin" a theme. Art is bdragon1727's GUI pack
(`pixel assets/Second Icon Set/GUI/`, credit/comment owed per its `Legal.txt`).
All 10 themes have a kit. A theme without one keeps flat boxes.

## Themes using it

| Theme      | Frame (Border All) | Ribbon / scroll | Banner text |
|------------|--------------------|-----------------|-------------|
| Journal    | 14 sky blue        | 08 blue         | black       |
| Crimson    | 7 dusty rose (dark)| 16 salmon       | black       |
| Forest     | 12 khaki (wood)    | 15 green        | black       |
| Manuscript | 9 mauve-brown      | 11 tan          | black       |
| Torchlight | 6 ice-silver (stone)| 14 orange (ember)| black       |
| Steampunk  | 1 amber (brass)    | 13 khaki-brown  | black       |
| Sci-Fi     | 3 cyan             | 06 teal         | black       |
| Shadow     | 13 purple          | 12 violet       | black       |
| Western    | 11 copper          | 17 brown-grey   | black       |
| Galaxy     | 10 steel blue      | 05 grey-blue    | black       |

Both are shown in light and dark mode with the same art.

## Pack layout (what to pick from)

- `Custom Border and Panels Menu All Part/Border All 1..16.png`: 640x512, 10x8
  grid of 64px frame styles, one colour per sheet. We use row 2, col 2 (the
  plain notched square). `Ram Border All` is black line art for tinting.
- `Retro Pixel Ribbons, Banners and Frames 2/01..18.png`: 320x256, same ~40
  sprites in 18 colours. Sprites used:
  - **ribbon**: straight ribbon with tails, box `(0, 84, 80, 113)` (top banner)
  - **scroll**: 5th sprite on the top row, rod-ended, box `(176, 5, 225, 26)` (headers)
- Border colours: 1 amber, 2 magenta, 3 cyan, 4 lime, 5 pink-silver, 6 ice-silver,
  7 dusty rose, 8 coral, 9 mauve-brown, 10 steel blue, 11 copper, 12 khaki,
  13 purple, 14 sky blue, 15 crimson, 16 emerald.
- Ribbon colours: 01 yellow, 02 lime, 03 mauve-grey, 04 magenta, 05 grey-blue,
  06 teal, 07 white, 08 blue, 09 grey, 10 coral, 11 tan, 12 purple, 13 khaki-brown,
  14 orange, 15 green, 16 salmon, 17 brown-grey, 18 mint.
  **Border and ribbon sheets do not share a colour order** -- always look.

## Darkening

Banner text is black (`BANNER_TEXT`) on every theme and mode, so fills must stay
light enough for it. Shadow and Western bake at full brightness for that reason.

Banners (ribbon + scroll) are baked at `BANNER_BRIGHTNESS` (0.7) in the asset
script: RGB is multiplied, alpha untouched, black outlines stay black. Change the
constant and re-run to adjust. Frames are not darkened. If a banner gets darker,
re-check its text colour contrast (WCAG ~4.5:1).

## Pipeline

1. Add the theme's pieces to `scripts/build_gui_pixel_assets.py` and run
   `python scripts/build_gui_pixel_assets.py`. Output goes to `assets/ui/pixel-gui/`:
   `<theme>-frame.png` (centre knocked out to transparent),
   `<theme>-banner-{left,mid,right}.png`, `<theme>-scroll-{left,mid,right}.png`.
2. Everything is baked 4x nearest-neighbour so phones don't bilinear-blur tiny
   sprites. The mid slice is 1 source px wider each side; the app overlaps by
   that much to avoid a hairline seam.
3. Add a `PixelKit` for the theme in `src/theme/pixelKits.ts` (sizes are
   *source* pixels, not baked) and set `pixel:` on the theme family in
   `src/theme/colors.ts`.

## Components (`src/components/PixelFrame.tsx`)

- `<PixelFrameOverlay scale={1} />` -- drop inside any box (Pressable/View).
  9-slice frame, absolute, non-interactive, renders nothing without a kit.
  Parent should drop its own border: `borderWidth: theme.pixel ? 0 : 1`.
  Scales used: `1` boxes and cards, `0.75` portrait.
- `<SectionHeading title textStyle centered />` -- the standard section heading.
- `<PixelBanner title variant="scroll"|"ribbon" fullWidth scale />` -- text on a
  banner; falls back to plain text without a kit. `ribbon` = top identity line,
  `scroll` = section headers.

## Standards (apply to every screen)

1. **Section headings are scroll banners.** Use `<SectionHeading title textStyle />`
   (renders the scroll banner on pixel themes, the screen's own plain title
   elsewhere; the style's vertical margins carry over; `centered` centres it).
   Never hand-roll `<Text style={styles.sectionTitle}>` on a new screen.
2. **Containers, cards, list rows and info rows get a frame.** Put
   `<PixelFrameOverlay scale />` as the first child and set the style's
   `borderWidth: theme.pixel ? 0 : 1`. Scale `1` for cards/boxes, `0.75` for
   compact rows and the portrait. One frame per group, not per line, when lines
   belong together (e.g. the Armor & Weapons list).
3. **Buttons never get a frame.** Anything that is a button (including the
   shared `Button`, action links, chips, +/- steppers) stays flat. Selectable
   option rows (theme/font pickers) are rows and do get a frame; their active
   state shows as a `surfaceAlt` fill on pixel themes since the border colour
   is gone.
4. **Group related controls in one framed box, split by divider lines.** Example:
   Hit Dice, Class Resources, Conditions/Exhaustion and Inspiration share one
   box (`ClassResourceTracker` `footer`, `boxDivider` between sections).
5. **Top of the character sheet is the ribbon** (`variant="ribbon"`), holding
   race / class / level only. Alignment is its own framed row after Feats.
6. **Portrait sits in a framed box** (56px box, scale 0.75).
7. **Text inside framed rows uses the same style as sibling rows** (e.g. the
   Alignment row uses `proficiencyName`, not a different font).
8. **Tiny icon buttons draw glyphs as Views** (+/- bars), not text.
9. **"+ Add ..." buttons in light mode** use the soft surface fill (`surfaceAlt`)
   with black text; dark mode keeps the themed fill and its normal text.
10. Frames never change layout on non-pixel themes: borders, padding and fills
   stay as they were.

## Coverage

Done
- Character sheet header (ribbon, portrait box), Stats tab (all headings,
  cards, rows, Armor & Weapons box, resources box, Alignment row), Spells tab,
  Notes tab (headings, note cards, item rows), Equipment tab (headings, item
  rows), Feats list, Death saves box.
- Character list rows, Settings (every heading centred as a banner, every
  option / toggle / credit row), Account card, Legal credit rows, Homebrew
  cards, Dice roller (headings, initiative + history rows), Party (headings,
  toggle rows), character Edit (headings, trait rows).

Not done yet
- Modals (their cards/titles), the character wizard (`new.tsx`), DM screen
  cards that use `dmStyles`, tab bar / nav header, Prepared pill and Save DC
  badge, plain inputs.
- Banner darkening is a separate pass (see Darkening).

## Gotchas

- RN `capInsets` is iOS-only, so 9-slice is done with overflow-hidden windows
  onto one image (`NineSlice`). Banners use three plain pre-cut images instead.
- Don't use text glyphs for tiny icon buttons; theme fonts shift baselines.
- Can't be verified headless: check changes on a device/web build.
