// The SRD's three "your choice" gear categories a starting-equipment kit can
// grant (e.g. "a musical instrument of your choice", "one type of artisan's
// tools") -- named options only, no mechanical stats, since these are
// flavor/proficiency gear rather than weapons or armor. Sourced from
// open5e's Tools category (https://api.open5e.com/v2/items/?document__key=srd-2024,
// CC-BY licensed, SRD 5.2 -- identical set in SRD 5.1/2014). Used by
// `EquipmentGrant`'s `itemChoice` kind -- see startingEquipment.ts.
export type ToolOrInstrumentCategory = "artisanTools" | "instrument" | "gamingSet";

export const ARTISAN_TOOLS = [
  "Alchemist's Supplies",
  "Brewer's Supplies",
  "Calligrapher's Supplies",
  "Carpenter's Tools",
  "Cartographer's Tools",
  "Cobbler's Tools",
  "Cook's Utensils",
  "Glassblower's Tools",
  "Jeweler's Tools",
  "Leatherworker's Tools",
  "Mason's Tools",
  "Painter's Supplies",
  "Potter's Tools",
  "Smith's Tools",
  "Tinker's Tools",
  "Weaver's Tools",
  "Woodcarver's Tools",
] as const;

export const MUSICAL_INSTRUMENTS = [
  "Bagpipes",
  "Drum",
  "Dulcimer",
  "Flute",
  "Horn",
  "Lute",
  "Lyre",
  "Pan Flute",
  "Shawm",
  "Viol",
] as const;

export const GAMING_SETS = [
  "Dice Set",
  "Dragonchess Set",
  "Playing Card Set",
  "Three-Dragon Ante Set",
] as const;

export function optionsForToolCategory(category: ToolOrInstrumentCategory): readonly string[] {
  if (category === "artisanTools") return ARTISAN_TOOLS;
  if (category === "instrument") return MUSICAL_INSTRUMENTS;
  return GAMING_SETS;
}

export const TOOL_CATEGORY_LABELS: Record<ToolOrInstrumentCategory, string> = {
  artisanTools: "Artisan's tools",
  instrument: "Musical instrument",
  gamingSet: "Gaming set",
};
