# D&D content sources — what's available to add

Research snapshot: 2026-10-27. Numbers below were pulled live from the
`open5e` v2 API (`https://api.open5e.com/v2/`), not from training data or
secondhand summaries — see "How to verify this yourself" at the bottom
before trusting a number past its shelf life.

## Scope policy (binding — read this before adding any new content source)

**This app ships official Wizards of the Coast D&D content only** —
currently the 5.1 (2014) and 5.2 (2024) System Reference Documents, both
CC BY 4.0. **Third-party publishers are out of scope by default**:
Kobold Press (Tome of Heroes, Black Flag SRD / Tales of the Valiant, Tome
of Beasts, Deep Magic, Vault of Magic, Creature Codex, etc.), EN
Publishing (Level Up Advanced 5e / the Adventurer's Guide), Open Design
LLC, or any other non-WotC publisher indexed by open5e or elsewhere.

This was tried once (2026-10-27): Extended Races/Classes pulled 10 species
from Kobold Press's Tome of Heroes and 2 classes from EN
Publishing/Kobold Press sources, and the feats catalog pulled 59 feats
from EN Publishing's Adventurer's Guide. **All of it was removed the same
day at the user's explicit instruction** — "we dont want external
projects without permission we just want official dnd classes." That
reversal is recorded in full in "Implementation outcome" below so the
history (and the reasoning) isn't lost, but it does not reflect this
app's current or intended content.

**Subclasses specifically (2026-11-03 policy)**: each class's catalog ships
*only* the one SRD-licensed subclass the SRD itself publishes in full.
Every other published subclass (Battle Master, Circle of the Moon, Oath of
Vengeance, etc.) used to be catalogued too — as an original-wording
paraphrase of the mechanic, never the book's text — but this was removed
entirely at the user's explicit instruction, including the name-only
suggestions. Even though an original paraphrase is legally distinct from
copying protected text (mechanics/rules aren't copyrightable, only their
specific expression is — see the Copyright & trademark boundaries section
below), the user's call is that it's simpler to build out real Homebrew
Subclass support (already shipped — `src/components/homebrew/
HomebrewSubclassModal.tsx`, `homebrewRepo.ts`) than to maintain any
non-SRD content, even content that's probably fine. This is a deliberate
risk-tolerance choice, not a gap: don't re-add non-SRD subclass names,
summaries, or features to the catalog, and don't suggest them as
placeholder examples in UI copy either (e.g. a text input's placeholder
text) — point users to Homebrew Subclass instead. The same reasoning likely
extends to other "original-paraphrase-of-non-SRD-content" categories if
they ever come up (e.g. non-SRD feats/invocations written in original
wording) — ask the user before adding any such category, don't assume
the subclass precedent only covers subclasses.

**If a future task calls for expanding content** (more races, classes,
feats, monsters, magic items, or anything else) and the official WotC SRD
doesn't have enough material to satisfy it, **stop and ask the user**
before pulling in a third-party/OGL-only source — don't substitute one
automatically the way this pass did. Two narrow exceptions, only with the
user's explicit sign-off each time: (1) a specific non-WotC source the
user names directly, or (2) `open5e`'s own "5e Core Concepts" compilation
document (key `core`), which is open5e's own CC BY 4.0 restatement of SRD
rules rather than a third-party publisher's original content — still ask
first regardless, since it's a judgment call, not a blanket exception.

This is a reference for **what legally-usable 5e-compatible content
exists**, researched broadly for completeness, so future work doesn't have
to re-research licensing from scratch — but "exists and is legally usable"
is not the same as "cleared to add here." The scope policy above decides
what actually gets pulled in. It complements the sourcing notes already in
`project_character_onboarding` memory (per-ruleset API endpoints, the
curl-not-WebFetch rule, the SRD-vs-PHB licensing split for
backgrounds/subclasses).

## Copyright & trademark boundaries (what's safe vs. protected)

General background, so future content decisions don't have to re-derive
this from scratch. This is not legal advice — it's working guidance for
staying inside the WotC-SRD-only scope policy above.

**Not copyrightable — safe regardless of source:**
- Game mechanics, math, and procedures themselves (rolling a d20 + modifier
  vs. AC, how advantage works, level-progression structure). U.S. copyright
  doesn't cover rules/mechanics, only their specific written expression.
- Rules re-written in this app's own words rather than copied verbatim.
- Generic fantasy tropes not unique to D&D (orcs, goblins, elves, dwarves,
  basic swords/potions) — stock mythological/public-domain elements, though
  a specific art depiction of one could still be protected.

**The CC-BY-4.0 SRD content** (5.1 and 5.2/5.2.1) is explicitly licensed for
reuse, verbatim text included, as long as the attribution terms are
followed — see the Settings → Legal & Licenses screen's "D&D Content Sources" section for the
exact required notices, sourced verbatim from each SRD's own Legal
Information page.

**Copyrighted/trademarked — stays out of scope regardless of CC-BY/OGL
status:**
- Verbatim text from non-SRD books (Player's Handbook, DMG, Xanathar's,
  Tasha's, any other sourcebook) — already excluded by the scope policy
  above, not just a copyright nicety.
- Product Identity / trademarks: "Dungeons & Dragons," "D&D," "Wizards of
  the Coast," proprietary monsters (Beholder, Mind Flayer/Illithid,
  Carrion Crawler, Displacer Beast, Yuan-ti, etc.), and proprietary
  lore/settings (Forgotten Realms, Ravenloft, Waterdeep, named NPCs like
  Elminster or Drizzt). Note this is mostly moot for this app already —
  the SRD itself omits almost all of these by design, so the monster/race
  catalogs pulled from `srd-2014`/`srd-2024` don't contain them in the
  first place.
- All official WotC art, maps, icons, and logos — this app's own art
  (Raven Fantasy Icons, etc., see the Settings Credits section) is
  separately licensed and never WotC's.

**If a future task wants non-SRD monster stats or named items**: per the
scope policy above, stop and ask the user first — don't "file-serial-number"
a proprietary monster (rename Mind Flayer to an original creature with its
own name/description) as a default workaround without checking, even though
that technique is legally valid in general.

## What the app already has

Three rulesets (`src/data/rulesets/{5e,5e-2024,3.5e}/`), each with races,
classes, class progression (features/subclasses/spell slots), spells, and
skills. 2014 5e also has weapons/armor; 2024 5e and 3.5e don't yet
(`types.ts` flags this as a known gap). All of it is sourced from
SRD-licensed content only — see the licensing split below for why
backgrounds and most subclasses are freetext instead of a fixed catalog.

**Not in the app at all yet:** a monster/bestiary catalog, a magic item
catalog, a structured feats catalog (freetext today), a structured
conditions catalog (freetext today). All four are open TODO.md items
(feats, conditions checklist, and TODO.md's own DM-mode "add creature"
request), and all four have ready-to-use data sources below.

## The open5e v2 API: full document index

`https://api.open5e.com/v2/documents/` lists every source it indexes. Each
has its own license, which determines how it can be shipped in a
commercial app (this one has ads + IAP, so "personal use only" content is
off the table — everything below is cleared for commercial use).

| Key | Document | Publisher | License |
|---|---|---|---|
| `srd-2014` | System Reference Document 5.1 | Wizards of the Coast | CC BY 4.0; OGL 1.0a |
| `srd-2024` | System Reference Document 5.2 | Wizards of the Coast | CC BY 4.0 only |
| `bfrd` | Black Flag SRD (Tales of the Valiant) | Kobold Press | CC BY 4.0 only |
| `a5e-ag` | Adventurer's Guide (Level Up A5E) | EN Publishing | CC BY 4.0; OGL 1.0a |
| `a5e-ddg` | Dungeon Delver's Guide (A5E) | EN Publishing | CC BY 4.0; OGL 1.0a |
| `a5e-gpg` | Gate Pass Gazette (A5E) | EN Publishing | CC BY 4.0; OGL 1.0a |
| `a5e-mm` | Monstrous Menagerie (A5E) | EN Publishing | OGL 1.0a only |
| `core` | 5e Core Concepts | open5e | CC BY 4.0; OGL 1.0a |
| `tob`, `tob-2023`, `tob2`, `tob3` | Tome of Beasts 1 (orig. + 2023 ed.), 2, 3 | Kobold Press | OGL 1.0a |
| `ccdx` | Creature Codex | Kobold Press | OGL 1.0a |
| `deepm`, `deepmx` | Deep Magic (+ Extended) | Kobold Press | OGL 1.0a |
| `vom` | Vault of Magic | Kobold Press | OGL 1.0a |
| `toh` | Tome of Heroes | Kobold Press | OGL 1.0a |
| `tdcs` | Tal'dorei Campaign Setting | Green Ronin / Critical Role | OGL 1.0a |
| `kp` | Kobold Press Compilation | Kobold Press | OGL 1.0a |
| `spells-that-dont-suck` | Spells That Don't Suck | — | CC BY 4.0 |
| `open5e`, `open5e-2024` | Open5e Originals | open5e | OGL 1.0a |
| `wz` | Warlock Zine | — | OGL 1.0a |
| `elderberry-inn-icons` | Elderberry Inn Icons | — | CC0 |

## Licensing cheat-sheet (verify exact wording before shipping either)

- **CC BY 4.0** — the newer, simpler license. Just needs visible
  attribution (document name, publisher, link, license name) somewhere in
  the app, e.g. a Credits/Licenses screen. Perpetual, irrevocable,
  commercial use explicitly fine. **SRD 5.2 (2024) and the Black Flag SRD
  are CC BY 4.0 only** — no extra bookkeeping needed beyond attribution.
- **OGL 1.0a** — the older license. Needs the full OGL 1.0a license text
  included in the product *and* a "Section 15" copyright notice block
  listing every OGL source used (standard, copy-paste boilerplate each
  publisher provides). More to include, but still free and commercial-safe
  — most of Kobold Press's catalog (Tome of Beasts, Deep Magic, Vault of
  Magic, Creature Codex) is OGL-only, so this gate matters if any of that
  gets used.
- **Recommendation:** build one Settings → Licenses/Credits screen now,
  sized to hold both the CC BY attribution blurbs and the OGL text + a
  growing Section 15 list. It'll be needed regardless of which sources get
  pulled in next, so it's a one-time cost that unblocks everything else
  here.

## Content categories available now, not yet in the app

**Read the Scope policy above first.** Everything below is background
research into what's *legally available in the wider ecosystem* — it is
not a backlog of things to build. The "Suggested path" bullets in this
section predate that policy and name third-party sources (Kobold Press,
Level Up A5E); none of them are cleared to implement without asking the
user first, regardless of license.

### 1. Monsters / bestiary — unblocks TODO.md's DM-mode "add creature" request

| Source | Creature count | License |
|---|---|---|
| `srd-2014` | 325 | CC BY 4.0 |
| `srd-2024` | 331 | CC BY 4.0 |
| `tob` (Tome of Beasts 1, original ed.) | 391 | OGL 1.0a |
| `tob-2023` (Tome of Beasts 1, 2023 ed.) | 408 | OGL 1.0a |
| `tob2` (Tome of Beasts 2) | 383 | OGL 1.0a |
| `tob3` (Tome of Beasts 3) | 397 | OGL 1.0a |
| `ccdx` (Creature Codex) | 356 | OGL 1.0a |

Kobold Press's five bestiaries alone add **1,935** more creatures beyond
the 656 in the two WotC SRDs — by far the largest single content category
available, gated only by the OGL 1.0a bookkeeping described above.

The `/v2/creatures/` endpoint returns structured stat blocks (AC, HP,
speeds, saves, skills, senses, languages, CR, traits, actions, legendary
actions, lair actions) — no prose parsing needed, same clean shape as the
2024 classes endpoint already used for `classProgression.ts`.

**Suggested path:** SRD 2014 + 2024 creatures first (656 total, CC BY
only, no OGL bookkeeping required) for the DM-mode creature picker. Treat
Kobold Press's bestiaries (over a thousand more creatures) as a follow-up
expansion once the Licenses screen exists.

### 2. Magic items — no catalog exists in the app today

| Source | Item count | License |
|---|---|---|
| `srd-2014` | 499 | CC BY 4.0 |
| `srd-2024` | 760 | CC BY 4.0 |
| `vom` (Vault of Magic) | 1,063 | OGL 1.0a |
| All documents combined | 2,322 | mixed |

Each item has `category` (armor/weapon/wondrous/etc.), `rarity`
(common→artifact, with a sort `rank`), attunement info, and — where
relevant — a nested `armor`/`weapon` stat block matching the shapes
already used in `armor.ts`/`weapons.ts`. **Filter by `?document=<key>`**
(not `document__key` or `document__slug` — see verification note below;
this endpoint's filter param differs from the one documented in
`project_character_onboarding` memory for classes).

**Suggested path:** SRD 2014 + 2024 magic items (1,259 combined, CC BY
only) as a browsable catalog, modeled on the existing weapon/armor
pattern; Vault of Magic as an OGL follow-up.

### 3. Feats — currently freetext only (open TODO item)

- **SRD 2014 has essentially none** — only **Grappler** (count: 1).
  Historically correct: the 2014 core SRD never published a feat list:
  this isn't a data-fetch bug, don't assume the import is broken if 2014
  queries come back nearly empty.
- **SRD 2024 has 17** (16 new + Grappler carried over): Ability Score
  Improvement, Alert, Archery, Boon of Combat Prowess, Boon of Dimensional
  Travel, Boon of Fate, Boon of Irresistible Offense, Boon of Spell Recall,
  Boon of the Night Spirit, Boon of Truesight, Defense, Grappler, Great
  Weapon Fighting, Magic Initiate, Savage Attacker, Skilled,
  Two-Weapon Fighting. All CC BY 4.0.
- **A5E's Adventurer's Guide alone has 91** feats, dual-licensed CC BY
  4.0 + OGL 1.0a — meaning they're usable under CC BY alone, no OGL
  bookkeeping needed. Large, varied, genuinely useful expansion set.

**Suggested path:** this is the easiest win on the list — pull SRD 2024's
17 feats first to close out the "Structured feats & racial traits
catalog" TODO with zero licensing overhead, then layer in A5E's 91 later
for depth.

### 4. Conditions — currently freetext only (open TODO item)

The `/v2/conditions/` endpoint returns 21 total, resolved (via each
result's own `document.key` field) into two clean groups:

- **15 core 5e conditions**, tagged `core` (the "5e Core Concepts"
  document, CC BY 4.0 + OGL 1.0a): Blinded, Charmed, Deafened, Exhaustion,
  Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified,
  Poisoned, Prone, Restrained, Stunned, Unconscious.
- **6 A5E-specific conditions**, tagged `a5e-ag` (Adventurer's Guide, also
  CC BY 4.0 + OGL 1.0a): Bloodied, Confused, Doomed, Encumbered, Rattled,
  Slowed. These are genuinely useful (e.g. "Bloodied" is a popular
  unofficial-but-common tracker feature) but are A5E house rules, not core
  5e — worth a visual "non-core" marker if both sets ship together rather
  than presenting them as one undifferentiated list.

**Filter gotcha, now resolved:** `document__key=` is the correct param for
`/v2/conditions/` and `/v2/creatures/`; `document=` is correct for
`/v2/magicitems/`. The two endpoints do **not** share a filter param name
— confirmed by testing both against known-good keys, not assumed.

**Suggested path:** both groups are cleared to ship (same CC BY 4.0
baseline as everything else here) — no reason to hand-pick a subset once
the group split above is used to label them correctly in the UI.

### 5. Whole alternate rulesets worth considering later

- **Black Flag SRD** (`bfrd`, Tales of the Valiant) — a complete,
  standalone 5e-compatible ruleset (lineages/heritages, classes, spells,
  monsters), **100% CC BY 4.0**. Could be added as a fourth ruleset entry
  using the exact same pattern as `3.5e`'s registration in
  `src/data/rulesets/index.ts` — no OGL bookkeeping at all if pulled from
  this document alone.
- **Level Up Advanced 5e** (`a5e-*`) — a 5e-compatible expansion/variant
  ruleset. Adventurer's Guide + Dungeon Delver's Guide + Gate Pass Gazette
  are CC BY 4.0 (dual-licensed); Monstrous Menagerie is OGL-only. Rich
  source for feats (91, see above) and alternate subclasses/species if a
  fourth or fifth ruleset is ever wanted.

## Sourcing method (reuse what already worked)

- Reuse the curl-raw-JSON-to-file → transform script pattern already
  established for the spell catalog and 2024 class data (see
  `project_character_onboarding` memory) — never pull exact rules text
  through `WebFetch`, since it runs content through a summarizing model
  and risks paraphrasing text that needs to ship verbatim.
- The v2 API gives clean structured JSON for creatures/magicitems/feats/
  conditions (no markdown-table parsing needed) — this is the same v2
  endpoint style already used for 2024 classes, not the prose-blob v1
  style that had to be parsed for 2014 classes.
- Filter param names are **not** consistent across v2 endpoints — confirmed
  by testing, not assumed: `/v2/creatures/` and `/v2/conditions/` use
  `document__key=<key>`, while `/v2/magicitems/` uses `document=<key>`
  (the latter found by inspecting a result's own `document.key` field,
  since the endpoint's filter-form labels were ambiguous). Verify the
  working param per-endpoint before writing an import script, the same
  way the v1-vs-v2 classes-endpoint difference already had to be worked
  out for the existing rulesets.

## Implementation outcome (2026-10-27)

Everything above was researched before building; this section records what
was actually built, including a same-day reversal. Future work should
trust this section over the speculative research above where they
disagree, and should trust the **"Current state"** sub-section specifically
over the **"What was tried and reverted"** one for what's actually in the
app today.

### Current state (WotC-only, matches the scope policy above)

- **Feats**: 17 shipped, all SRD 2024 (Wizards of the Coast, CC BY 4.0).
  Catalog + `FeatPickerModal` wired into Level Up's ASI-or-feat step;
  storage is the existing freetext `characters.feats` field (picking a
  catalog feat just writes its name/description into that field the same
  way a hand-typed feat always has), not a new join table.
- **Monsters**: 656 shipped (325 SRD 2014 + 331 SRD 2024, both Wizards of
  the Coast, CC BY 4.0; no pagination needed — both fit one `limit=400`
  page). DM mode gained a creature tracker (add from catalog, current/max
  HP, remove) on the Dice Roller screen — not a full combat/initiative
  tracker. Kobold Press's five bestiaries are out of scope per the policy
  above, not just "deferred."
- **Magic items**: 1,259 shipped (499 SRD 2014 + 760 SRD 2024, Wizards of
  the Coast, CC BY 4.0), with a new Magic Items section on the Equipment
  tab (rarity, attunement, equip toggles, custom-item fallback). Vault of
  Magic (Kobold Press, OGL) is out of scope, not just "deferred."
- **Extended Races/Classes**: removed entirely (see below) — the onboarding
  race/class steps are back to core-SRD-only, same as before this day's
  work. No "Extended" toggle exists in the UI anymore.
- **Subclasses (2026-11-03)**: originally each class's catalog carried one
  SRD subclass with real feature text plus every other published subclass
  as an original-wording paraphrase (`src/data/rulesets/nonSrdSubclasses.ts`,
  `5e/subclasses.ts`, `5e/subclassesMartial.ts`, `5e-2024/subclasses.ts`,
  merged in via `withNonSrdSubclasses` in `index.ts`). All four files and
  the merge call were removed at the user's explicit instruction — see the
  "Subclasses specifically" note above. Each class's catalog now carries
  exactly its one SRD subclass; `SubclassPicker.tsx` and `LevelUpModal.tsx`
  were updated so their free-text fallback points to Homebrew Subclass
  instead of suggesting a non-SRD name (the old placeholder text literally
  said "e.g. Battle Master").

### What was tried and reverted the same day

The original plan (before the scope policy above existed) called for an
"Extended Races/Classes" onboarding feature sourced from Level Up A5E (EN
Publishing) and the Black Flag SRD (Kobold Press), on the reasoning that
both are CC BY 4.0 licensed and therefore legally cleared. That reasoning
was correct on the licensing question and wrong on the actual ask — the
user wanted official D&D content, not legally-clearable third-party
content, and said so directly once it shipped: *"we dont want external
projects without permission we just want official dnd classes."*

What had briefly shipped, for the historical record:
- **Races**: Level Up A5E and Black Flag SRD turned out to have **no
  species data at all** in open5e's `/v2/species/` endpoint (confirmed by
  fetching every row and tallying by document key — only
  srd-2014/srd-2024/toh/open5e appeared). Tome of Heroes (Kobold Press,
  OGL 1.0a — not even CC BY 4.0) was substituted in in order to deliver
  *something*, which compounded the original scoping mistake with a
  licensing-tier one. 10 species were pulled (Alseid, Catfolk, Darakhul,
  Derro, Drow, Erina, Gearforged, Minotaur, Mushroomfolk, Satarre), which
  in turn required adding full OGL 1.0a compliance (the license text plus
  a Section 15 copyright notice) to Settings — all of which was removed
  along with the content.
- **Classes**: only 2 real base classes existed across the two originally-
  planned sources — Marshal (EN Publishing) and Mechanist (Kobold
  Press) — both removed.
- **Feats**: 59 of the 76 shipped feats were from EN Publishing's
  Adventurer's Guide; removed, leaving the 17 SRD-2024 feats described
  above. A `DELETE FROM feats WHERE source_key = 'a5e-ag'` cleanup runs
  unconditionally in `seedFeats.ts` so a dev install that already seeded
  the old catalog gets cleaned up too, independent of the normal
  seed-once guard.
- **Conditions**: 6 extended conditions from EN Publishing's Adventurer's
  Guide (Bloodied, Confused, Doomed, Encumbered, Rattled, Slowed) were
  added behind a toggle and then removed; `ConditionsChecklist` is back to
  just the 14 core conditions it already had before this day.

**Lesson for next time**: "CC BY 4.0" and "cleared to ship" are not the
same question as "is this what the user actually asked for." Before
pulling in any source beyond the official WotC SRD — even one that's
fully legally clear — ask first. See the Scope policy section above, which
exists because of this exact sequence of events.

## How to verify this yourself (numbers drift)

All counts above came from hitting `https://api.open5e.com/v2/<resource>/
?document=<key>&limit=1` and reading the `count` field, on 2026-10-27.
Before building an import against any number in this doc, re-run that
query — open5e's dataset is community-maintained and grows over time.
