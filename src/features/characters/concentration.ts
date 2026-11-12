/**
 * Concentration bookkeeping. RAW 5e allows one concentration spell at a time; with the
 * character's Homebrew option on, `extraConcentrationSlots` more can be held at once.
 *
 * Storage: the first (oldest) spell lives in the original `concentratingSpell*` columns,
 * any others in `extraConcentrations` as JSON, so older code and data keep working.
 */
export type ConcentrationEntry = { id: number | null; name: string };

export type ConcentrationFields = {
  concentratingSpellId: number | null;
  concentratingSpellName: string;
  extraConcentrations: string;
  homebrewEnabled: boolean;
  extraConcentrationSlots: number;
};

export type ConcentrationPatch = {
  concentratingSpellId: number | null;
  concentratingSpellName: string;
  extraConcentrations: string;
};

function parseExtras(raw: string): ConcentrationEntry[] {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is { id: unknown; name: string } => !!e && typeof e.name === "string" && e.name !== "")
      .map((e) => ({ id: typeof e.id === "number" ? e.id : null, name: e.name }));
  } catch {
    return [];
  }
}

/** How many spells this character may concentrate on at once. */
export function maxConcentrations(
  c: Pick<ConcentrationFields, "homebrewEnabled" | "extraConcentrationSlots">
): number {
  return 1 + (c.homebrewEnabled ? Math.max(0, c.extraConcentrationSlots) : 0);
}

/** Current concentration spells, oldest first (extras only count while Homebrew is on). */
export function getConcentrations(c: ConcentrationFields): ConcentrationEntry[] {
  const list: ConcentrationEntry[] = [];
  if (c.concentratingSpellName !== "") {
    list.push({ id: c.concentratingSpellId, name: c.concentratingSpellName });
  }
  if (c.homebrewEnabled) list.push(...parseExtras(c.extraConcentrations));
  return list.slice(0, maxConcentrations(c));
}

export function isConcentratingOn(c: ConcentrationFields, characterSpellId: number): boolean {
  return getConcentrations(c).some((e) => e.id === characterSpellId);
}

export function toConcentrationPatch(list: ConcentrationEntry[]): ConcentrationPatch {
  const [first, ...rest] = list;
  return {
    concentratingSpellId: first?.id ?? null,
    concentratingSpellName: first?.name ?? "",
    extraConcentrations: JSON.stringify(rest),
  };
}

/** Adds a spell; when every slot is taken the oldest one is dropped to make room. */
export function addConcentration(c: ConcentrationFields, entry: ConcentrationEntry): ConcentrationPatch {
  const current = getConcentrations(c).filter((e) => e.id !== entry.id);
  const next = [...current, entry];
  return toConcentrationPatch(next.slice(next.length - maxConcentrations(c)));
}

/** Ends the spell at `index` in getConcentrations() order, or every concentration when no index is given. */
export function removeConcentration(c: ConcentrationFields, index?: number): ConcentrationPatch {
  if (index === undefined) return toConcentrationPatch([]);
  return toConcentrationPatch(getConcentrations(c).filter((_, i) => i !== index));
}

/** Extras reference character_spells rows that get new ids when a character is synced in. */
export function stripExtraConcentrationIds(raw: string): string {
  return JSON.stringify(parseExtras(raw).map((e) => ({ id: null, name: e.name })));
}
