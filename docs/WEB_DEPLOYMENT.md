# Getting the web client live

Everything in code is done. What's left is infrastructure setup only the account owner can do: a Supabase project and the ZimaOS/Cloudflare Tunnel deploy. Last verified against the code on 2026-11-02.

## What's already done

- Web build works: [metro.config.js](../metro.config.js) adds `.wasm` asset support and dev-server COOP/COEP headers (`expo-sqlite` on web runs on WebAssembly SQLite, which needs `SharedArrayBuffer`, which needs cross-origin isolation). [src/features/characters/portraitStorage.ts](../src/features/characters/portraitStorage.ts) has a web branch since `expo-file-system` has no web implementation.
- Accounts + cloud sync are fully implemented against Supabase (auth, Postgres, Storage, Realtime) — see [src/features/supabase/supabaseClient.ts](../src/features/supabase/supabaseClient.ts), [src/features/auth/AuthContext.tsx](../src/features/auth/AuthContext.tsx), [src/features/sync/syncEngine.ts](../src/features/sync/syncEngine.ts). Login is optional everywhere; the app works fully offline with no account on every platform, including web.
- Party mode runs on Supabase (Realtime, not polling) — the old custom Express/Postgres/JWT server is gone.
- Deploy files for a self-hosted ZimaOS + Cloudflare Tunnel setup exist: [Caddyfile](../Caddyfile), [Dockerfile](../Dockerfile), [docker-compose.yml](../docker-compose.yml).

None of this has been tested against a real Supabase project or a real deploy yet — do that as you work through the steps below.

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the **Project URL** and **anon public key**.
3. **Authentication → Providers**: confirm **Email** is enabled (on by default).
4. **Storage**: create a bucket named `portraits`. Leave it **private**.
5. **SQL Editor**: paste in the full contents of [supabase/migrations/0001_init.sql](../supabase/migrations/0001_init.sql) and run it. This creates the `characters`, `parties`, `party_members`, `party_snapshots` tables, their Row Level Security policies, the `create_party`/`join_party_by_code` helper functions, and adds `party_members`/`party_snapshots` to the Realtime publication.
6. **Database → Replication**: double-check `party_members` and `party_snapshots` show as enabled for Realtime (the migration does this, but it's worth eyeballing).

## 2. Fill in `.env`

Edit [.env](../.env) at the repo root (already gitignored — don't commit real keys):

```
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Until these are filled in, the app still runs (sign-in/sync UI just shows "not set up yet") — see `isSupabaseConfigured` in `supabaseClient.ts`.

## 3. Test locally

```
npx expo start --web
```

Open it in a browser, sign up for an account from Settings → Account, create a character, and confirm a row shows up in Supabase's `characters` table (Table Editor) with a populated `data` column. Sign in from a second browser profile (or incognito) and confirm the character pulls down.

Known gap: the dev server's COOP/COEP headers (from `metro.config.js`) only attach to bundle/asset requests, not the `/` document itself in this Expo CLI version — so `expo-sqlite`'s WASM build may not get a fully cross-origin-isolated page locally. Symptom: writes made in a tight sequence right after a page load (e.g. onboarding's starting-equipment inserts, right after the character row itself) silently don't persist, even though the first write (the character) appears to work. This doesn't affect the production Caddy deploy (step 5), which sets the headers on every response.

Workaround for local web testing: run the dev-server-in-front-of-a-dev-server proxy in [scripts/web-coi-proxy.js](../scripts/web-coi-proxy.js), which stamps the COOP/COEP headers on every response (document included) and forwards Fast Refresh's WebSocket upgrade too.

```
npx expo start --web            # note the port it prints, e.g. 8081
npm run web:coi-proxy           # defaults to proxying :19006 -> :8081; pass proxyPort targetPort to override
```

Then open `http://localhost:19006` in the browser — not the Metro port directly.

## 4. Build the production bundle

```
npx expo export --platform web
```

This writes static files to `dist/`. The `Dockerfile` does this step automatically as part of the image build — you don't need to run it by hand unless you're debugging the export itself.

## 5. Deploy on the ZimaOS box

1. Copy the repo (or at least `Dockerfile`, `Caddyfile`, `docker-compose.yml`, and the full source + a filled-in `.env`) onto the ZimaOS box.
2. Create a `.env` next to `docker-compose.yml` **on the box** with:
   ```
   CLOUDFLARE_TUNNEL_TOKEN=<your tunnel token>
   ```
   (Get this from the Cloudflare Zero Trust dashboard → Networks → Tunnels → create or select a tunnel → "Install connector.")
3. Run:
   ```
   docker compose up -d --build
   ```
4. In the Cloudflare Zero Trust dashboard, add a **public hostname** for the tunnel pointing at `http://web:80` (the `web` service's name inside the compose network, port 80 — that's what Caddy listens on).

## 6. Verify

- `curl -I https://<your-domain>/` from anywhere and confirm both headers are present:
  ```
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  ```
  This is the thing local dev can't confirm (see step 3's gap) — it's the real check that `expo-sqlite` will work on the live site.
- Open the site, sign up, create a character with a portrait, confirm it syncs (check Supabase's `characters` table and the `portraits` Storage bucket).
- Test Party mode with two accounts (one DM, one player) and confirm the DM's screen updates live when the player changes their shared snapshot, with no manual refresh.
- Refresh the page / clear site data as a signed-out user and confirm the app still loads and works (offline/local-first guarantee, unrelated to having an account).

## If something's hosted differently later

If you ever move off ZimaOS/Cloudflare Tunnel (a managed static host, a different VPS, etc.), the only things that need to move are the two COOP/COEP headers and the SPA fallback rule — whatever serves `dist/` needs both. Everything else (Supabase, the app code) is host-independent.
