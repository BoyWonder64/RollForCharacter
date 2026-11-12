# Art, font and sound licences

One row per asset family the app ships, with where its licence text lives and what the licence requires. Raw packs sit in `pixel assets/` (git-ignored; the processed files the app uses are in `assets/`). Credits shown to users are in `src/app/legal.tsx`.

Last checked: 2026-11-11.

| Asset in the app | Pack / author | Licence | Where the licence text is | Credit required? | Credited in app |
|---|---|---|---|---|---|
| `assets/portraits/` (cropped sprites) | 32rogues, Seth Boyles | Commercial and non-commercial use, modification allowed. No redistribution or resale. Not for NFT/blockchain or generative-AI/ML projects. | `pixel assets/32rogues/LICENSE.txt` | No (appreciated) | Yes |
| `assets/icons/shikashi/` | Shikashi's Fantasy Icons Pack v2, Matt Firth (shikashipx) | Commercial use and editing allowed; many icons are based on game-icons.net (CC BY 4.0) | `pixel assets/Second Icon Set/Legal Info.txt` and the v2 pack's own `.txt` | Yes: "Matt Firth (shikashipx)" and "game-icons.net" | Yes |
| `assets/ui/pixel-gui/`, `assets/ui/health-bar/`, `assets/ui/loading/` | bdragon1727 GUI packs (the numbered `00`-`07.png` sheets, "Custom Border and Panels", "Retro Pixel Ribbons, Banners and Frames 2") | Per the pack's note: credit bdragon1727 and leave a comment on the store page | `pixel assets/Second Icon Set/GUI/Legal.txt` | Yes: bdragon1727 | Yes |
| `assets/ui/backgrounds/castle-wall*.png` | Fort of Illusion, Luis Zuno (Ansimuz) | CC0 1.0 | `pixel assets/Background Castle/public-license.pdf` | No | Yes (courtesy) |
| `assets/icons/equipment`, `spell-schools`, `tabs`, `conditions`, `campaign-items` (Raven style) | Free - Raven Fantasy Icons, Clockwork Raven Studios | Purchased pack; owner confirms the pack's terms are met (2026-10-28, 2026-11-11) | `pixel assets/Free - Raven Fantasy Icons/Special Note to the Dev.txt` (purchase note only; no terms text) | Credited | Yes |
| `assets/icons/dice/`, `src/features/dice/diceFaceAssets.ts` | Pixel Dice, LullabyJazz | Free for commercial use (noted in the source comment) | No licence file in `pixel assets/Dice/` | No (free for commercial use) | Yes (courtesy) |
| `assets/ui/gears/` (Steampunk theme) | "Cog Wheels - Gears" | Free for commercial use (owner confirms) | No licence file in `pixel assets/Gears/` | No | No |
| `assets/ui/backgrounds/desert/` (Western theme) | "Simple Sand - RPG / Topdown Tileset" | Free for commercial use (owner confirms) | `pixel assets/Free_Desert/Free Sand Tileset - Readme.txt` has pack title and contents only | No | No |
| `assets/fonts/Alkhemikal.ttf` | Alkhemikal, jeti | CC BY 4.0 | `assets/fonts/Alkhemikal-LICENSE.txt` | Yes | Yes |
| Cormorant Garamond, Cinzel, Caveat, Special Elite, Orbitron | Google Fonts via `@expo-google-fonts/*` | SIL OFL 1.1 | Each npm package | No | No (not required) |
| `assets/sounds/dice-*.mp3` | Kenney Casino Audio | CC0 1.0 | Kenney's pack page | No | Yes |
| `assets/sounds/crit-nat*.mp3` | "512 Sound Effects (8-bit style)", Juhani Junkala | CC0 1.0 | OpenGameArt page | No | Yes |
| `assets/icon.png`, `splash-icon.png`, `android-icon-*.png`, `favicon.png` | Expo project template placeholders | MIT (Expo template) | `LICENSE` | No | n/a |

## Notes

- **The app icon is still the Expo template placeholder** (a blue chevron on a grid). It carries no licence risk, but replace it before a store release.
- **Health bar and loading wedges** came from what the old notes call "Pixel UI pack 3". That is the numbered `00`-`07.png` sheets in `pixel assets/Second Icon Set/GUI/` (the bdragon1727 pack), so they are covered by that pack's credit.
- **Gears, Desert and Dice are free for commercial use, so no credit is needed.** Their folders hold no terms text. If you want the repo to prove it, save each pack's store page as `LICENSE.txt` beside the pack. The Dice credit stays in the app as a courtesy.
- **32rogues and Raven forbid redistribution.** Keep `pixel assets/` out of any public remote. The cropped, in-use copies in `assets/` still ship with the app and the web build.
