# Leveling guides

Per-class, per-level leveling documentation, one folder per ruleset:

- `5e-2014/` — D&D 5th Edition (2014 SRD 5.1, OGL 1.0a). Done.
- `5e-2024/` — D&D 5th Edition (2024 SRD 5.2, CC BY 4.0). In progress.
- `3.5e/` — D&D 3.5 Edition (d20 SRD, OGL 1.0a). In progress.

Each class file documents the base-class features by level, the one subclass
the free SRD publishes in full for that class (every other published
subclass is PHB/sourcebook-only content and isn't reproduced here — same
licensing call already made for the Background picker, see
`project_character_onboarding` memory), and a spellcasting progression table
where applicable.

This data also drives the in-app Level Up workflow via
`src/data/rulesets/<ruleset>/classProgression.ts` (`ClassProgression` type in
`src/data/rulesets/types.ts`) — these docs and that data are sourced
together, not independently.

## Future setting/splatbook content (flagged, not built)

Spelljammer (and other D&D settings/splatbooks beyond the core SRD, e.g.
Eberron, Ravenloft) were raised as a future consideration. Per the project
owner's call, this is noted here as a flag for later scoping, not built now:

- Spelljammer's player-facing additions (Giff, Thri-kreen, and other astral
  races; the Astral Self monk/other setting-specific subclasses; spelljamming
  helm/ship equipment rules) are **not** SRD content — they'd need the same
  SRD-vs-PHB/sourcebook licensing triage already applied elsewhere in this
  app (see `project_character_onboarding` memory and the subclass-licensing
  note above) before any of it could ship as structured data rather than
  free text.
- If/when this gets picked up, it fits the existing extensibility pattern:
  a new ruleset-adjacent "setting" concept layered on top of an existing
  ruleset's races/classes (most likely 5e 2014 or 2024), not a new ruleset
  of its own — Spelljammer doesn't change core class/leveling mechanics.
