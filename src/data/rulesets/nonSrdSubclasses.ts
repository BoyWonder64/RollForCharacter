import type { ClassFeature, ClassProgression, ClassResourceDefinition, Subclass } from "./types";

/**
 * The published (non-SRD) subclasses of each class, so every class offers
 * its full list of paths at onboarding, Level Up and Edit, not just the one
 * subclass each SRD edition ships. Keyed by `classId`.
 *
 * Two tiers: `NonSrdSubclassData` carries the subclass's features written as
 * original-wording rules summaries (never the book's text -- see
 * `srdLicensed: false` on `Subclass`), so the sheet shows them and any
 * limited-use resources are tracked; a bare name in `SubclassNames` is the
 * fallback for subclasses whose features haven't been written yet.
 */
type SubclassNames = Record<string, string[]>;

/** A feature as `[level, name, summary]`, to keep the data files compact. */
export type FeatureTuple = [level: number, name: string, summary: string];

export type NonSrdSubclassData = {
  name: string;
  summary: string;
  features: FeatureTuple[];
  resources?: ClassResourceDefinition[];
};

export type SubclassDetails = Record<string, NonSrdSubclassData[]>;

/** `{ [startLevel]: value }` for a value that follows a formula per level, e.g. `perLevel(3, 20, (l) => l + 1)`. */
export function perLevel(from: number, to: number, value: (level: number) => number): Record<number, number> {
  const out: Record<number, number> = {};
  for (let level = from; level <= to; level++) out[level] = value(level);
  return out;
}

export const NON_SRD_SUBCLASS_NAMES_5E: SubclassNames = {
  barbarian: [
    "Path of the Totem Warrior",
    "Path of the Ancestral Guardian",
    "Path of the Storm Herald",
    "Path of the Zealot",
    "Path of the Beast",
    "Path of Wild Magic",
  ],
  bard: [
    "College of Valor",
    "College of Glamour",
    "College of Swords",
    "College of Whispers",
    "College of Creation",
    "College of Eloquence",
  ],
  cleric: [
    "Knowledge Domain",
    "Light Domain",
    "Nature Domain",
    "Tempest Domain",
    "Trickery Domain",
    "War Domain",
    "Arcana Domain",
    "Forge Domain",
    "Grave Domain",
    "Order Domain",
    "Peace Domain",
    "Twilight Domain",
  ],
  druid: [
    "Circle of the Moon",
    "Circle of Dreams",
    "Circle of the Shepherd",
    "Circle of Spores",
    "Circle of the Stars",
    "Circle of Wildfire",
  ],
  fighter: [
    "Battle Master",
    "Eldritch Knight",
    "Arcane Archer",
    "Cavalier",
    "Samurai",
    "Echo Knight",
    "Psi Warrior",
    "Rune Knight",
    "Purple Dragon Knight",
  ],
  monk: [
    "Way of Shadow",
    "Way of the Four Elements",
    "Way of the Long Death",
    "Way of the Sun Soul",
    "Way of the Drunken Master",
    "Way of the Kensei",
    "Way of the Astral Self",
    "Way of Mercy",
  ],
  paladin: [
    "Oath of the Ancients",
    "Oath of Vengeance",
    "Oath of Conquest",
    "Oath of Redemption",
    "Oath of Glory",
    "Oath of the Watchers",
    "Oathbreaker",
  ],
  ranger: [
    "Beast Master",
    "Gloom Stalker",
    "Horizon Walker",
    "Monster Slayer",
    "Fey Wanderer",
    "Swarmkeeper",
    "Drakewarden",
  ],
  rogue: [
    "Assassin",
    "Arcane Trickster",
    "Inquisitive",
    "Mastermind",
    "Scout",
    "Swashbuckler",
    "Phantom",
    "Soulknife",
  ],
  sorcerer: [
    "Wild Magic",
    "Divine Soul",
    "Shadow Magic",
    "Storm Sorcery",
    "Aberrant Mind",
    "Clockwork Soul",
  ],
  warlock: [
    "The Archfey",
    "The Great Old One",
    "The Celestial",
    "The Hexblade",
    "The Fathomless",
    "The Genie",
    "The Undead",
  ],
  wizard: [
    "School of Abjuration",
    "School of Conjuration",
    "School of Divination",
    "School of Enchantment",
    "School of Illusion",
    "School of Necromancy",
    "School of Transmutation",
    "War Magic",
    "Bladesinging",
    "Order of Scribes",
  ],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns `progressions` with each class's name-only subclasses appended
 * after its SRD one(s). A name already catalogued (same id) is skipped, so
 * the SRD entry with real feature text always wins.
 */
export function withNonSrdSubclasses(
  progressions: ClassProgression[],
  names: SubclassNames,
  details: SubclassDetails = {}
): ClassProgression[] {
  return progressions.map((progression) => {
    if (progression.subclassLevel === undefined) return progression;
    const existing = progression.subclasses ?? [];
    const known = new Set(existing.map((s) => s.id));
    const added: Subclass[] = [];
    for (const data of details[progression.classId] ?? []) {
      const id = slugify(data.name);
      if (known.has(id)) continue;
      known.add(id);
      const features: ClassFeature[] = data.features.map(([level, name, description]) => ({
        level,
        name,
        description,
      }));
      added.push({
        id,
        name: data.name,
        summary: data.summary,
        srdLicensed: false,
        features,
        ...(data.resources ? { resources: data.resources } : {}),
      });
    }
    for (const name of names[progression.classId] ?? []) {
      const id = slugify(name);
      if (known.has(id)) continue;
      known.add(id);
      added.push({ id, name, summary: "", srdLicensed: false, features: [] });
    }
    return { ...progression, subclasses: [...existing, ...added] };
  });
}
