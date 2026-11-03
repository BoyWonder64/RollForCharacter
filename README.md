# RollForCharacter

RollForCharacter is a cross-platform character sheet and tabletop companion app. It helps players manage characters and gives both players and game masters quick access to dice and game-tracking tools.

## Features

- Create and manage characters across three rulesets (D&D 5e 2014, 5e 2024, and 3.5e), including classes, multiclassing, level up, spells, equipment, feats, and portraits.
- Track limited-use class abilities such as Action Surge and Second Wind, with short and long rest recharge.
- Add homebrew content: a custom race and class per character, plus custom weapons, armor, magic items, and feats. A shared homebrew library is planned (see [TODO.md](TODO.md)).
- Roll dice and use character-aware rolls, with dice sound effects; roll history can be managed in the app.
- Track combat and game details such as hit points, conditions, rests, currency, and death saves.
- Customize the app with themes, fonts, and icons.
- Store app data locally in SQLite. The app is fully usable offline with no account.

### Built, awaiting a device check

These are implemented and covered by tests but haven't been confirmed on a device yet. They move up into the list above once they are (see "Needs a device check" in [TODO.md](TODO.md)).

- Create your own limited-use abilities and trackers (with icons and attached rolls), and adjust or hide built-in ones per character.
- Starting equipment from the class's real kit packages, with swaps limited to what the class is proficient with, and gear, gold and armor carried onto the new character.
- DM mode's Encounter tab: roll for the whole party at once, build encounters from the SRD bestiary, roll anything on a monster's stat block, and run a combined initiative order with saved encounters, plus session notes.

### Built, awaiting a live Supabase project and deploy

Fully implemented but not yet run against a real Supabase project or a real web deploy. See [docs/WEB_DEPLOYMENT.md](docs/WEB_DEPLOYMENT.md) for the setup steps and what to verify.

- Optional accounts with cloud sync and portrait backup across devices (Supabase auth, Postgres, Storage).
- Party mode: a DM and players join a shared party by code and see each other's live state (initiative, HP, conditions) via Supabase Realtime.
- Self-hosted web deploy (ZimaOS + Cloudflare Tunnel, via the included `Dockerfile`, `Caddyfile`, and `docker-compose.yml`).

## Tech stack

- React Native and React
- Expo and Expo Router
- TypeScript
- Expo SQLite with Drizzle ORM
- Supabase (auth, Postgres, Storage, Realtime) for optional accounts, cloud sync, and party mode
- AsyncStorage for local settings and preferences
- expo-audio for dice sound effects
- Jest with `jest-expo`
- ESLint

The app is configured for Android, iOS, and web. The web build can be self-hosted with the included `Dockerfile`, `Caddyfile`, and `docker-compose.yml` (see [docs/WEB_DEPLOYMENT.md](docs/WEB_DEPLOYMENT.md)).

## Getting started

Install dependencies:

```sh
npm install
```

Start the Expo development server:

```sh
npm start
```

You can also start a platform-specific target with:

```sh
npm run android
npm run ios
npm run web
```

Use the Expo development server to open the app on a compatible simulator, device, or browser.

## Checks

Run the test suite:

```sh
npm test
```

Run the linter:

```sh
npm run lint
```

## Documentation

- [TODO.md](TODO.md) — roadmap, with homebrew as the top priority
- [docs/DATA_LAYER.md](docs/DATA_LAYER.md) — database tables, repo functions, and how to change the schema
- [docs/WEB_DEPLOYMENT.md](docs/WEB_DEPLOYMENT.md) — Supabase project setup and self-hosted web deploy

## Project structure

- `src/app/` — Expo Router screens and navigation
- `src/components/` — reusable UI and modal components
- `src/features/` — character, dice, DM, auth, sync, supabase, settings, icon, and spell functionality
- `src/data/` — game data and ruleset catalogs
- `src/db/` — SQLite setup, schema, migrations, and seed data (`schema.ts` and `schemaSql.ts` must be changed together)
- `supabase/migrations/` — SQL migrations for the Supabase project (tables, RLS policies, Realtime config)
- `src/theme/` — themes, colors, and fonts
- `assets/` — app images, icons, fonts, and sound effects
