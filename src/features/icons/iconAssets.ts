import type { IconStyleId } from "./iconStyles";

export const CAMPAIGN_ITEM_ICON_IDS = [
  "potion",
  "key",
  "book",
  "scroll",
  "gem",
  "coin",
  "material",
  "food",
  "chest",
  "necklace",
  "sword",
  "shield",
] as const;
export type CampaignItemIconId = (typeof CAMPAIGN_ITEM_ICON_IDS)[number];

export const CAMPAIGN_ITEM_ICON_LABELS: Record<CampaignItemIconId, string> = {
  potion: "Potion",
  key: "Key",
  book: "Book",
  scroll: "Scroll",
  gem: "Gem",
  coin: "Coin",
  material: "Material",
  food: "Food",
  chest: "Chest",
  necklace: "Necklace",
  sword: "Sword",
  shield: "Shield",
};

// Equipment icons here are per-SLOT placeholders (what kind of item goes in
// that slot), not per-item art -- the equipment catalog itself is still
// empty (see FEATURES.md). Swap this map's values when a new icon style is
// added; keys (slot names) stay the same.
const EQUIPMENT_SLOT_ICONS_PIXEL: Record<string, number> = {
  Head: require("../../../assets/icons/equipment/head.png"),
  Body: require("../../../assets/icons/equipment/body.png"),
  Feet: require("../../../assets/icons/equipment/feet.png"),
  "Left Hand": require("../../../assets/icons/equipment/weapon.png"),
  "Right Hand": require("../../../assets/icons/equipment/shield.png"),
  Back: require("../../../assets/icons/equipment/back.png"),
  Accessory: require("../../../assets/icons/equipment/accessory.png"),
};

// Keyed by lowercase 5e spell school name.
const SPELL_SCHOOL_ICONS_PIXEL: Record<string, number> = {
  abjuration: require("../../../assets/icons/spell-schools/abjuration.png"),
  conjuration: require("../../../assets/icons/spell-schools/conjuration.png"),
  divination: require("../../../assets/icons/spell-schools/divination.png"),
  enchantment: require("../../../assets/icons/spell-schools/enchantment.png"),
  evocation: require("../../../assets/icons/spell-schools/evocation.png"),
  illusion: require("../../../assets/icons/spell-schools/illusion.png"),
  necromancy: require("../../../assets/icons/spell-schools/necromancy.png"),
  transmutation: require("../../../assets/icons/spell-schools/transmutation.png"),
};

// Bottom tab bar icons. No literal dice/gear/person art exists in this
// pack (it's fantasy items, not generic UI glyphs), so these are the
// closest thematic stand-ins: a helmet for Characters, a faceted gem for
// Dice Roller, a key for Settings.
const TAB_ICONS_PIXEL: Record<string, number> = {
  characters: require("../../../assets/icons/tabs/characters.png"),
  "dice-roller": require("../../../assets/icons/tabs/dice-roller.png"),
  settings: require("../../../assets/icons/tabs/settings.png"),
};

// Selectable icons for campaign notes' "special items" list -- a curated
// general-inventory spread (potion/key/book/scroll/gem/coin/material/food/
// chest), not tied to any one item catalog, cropped from the same Raven
// Fantasy Icons spritesheet as the equipment/spell-school icons above.
const CAMPAIGN_ITEM_ICONS_PIXEL: Record<CampaignItemIconId, number> = {
  potion: require("../../../assets/icons/campaign-items/potion.png"),
  key: require("../../../assets/icons/campaign-items/key.png"),
  book: require("../../../assets/icons/campaign-items/book.png"),
  scroll: require("../../../assets/icons/campaign-items/scroll.png"),
  gem: require("../../../assets/icons/campaign-items/gem.png"),
  coin: require("../../../assets/icons/campaign-items/coin.png"),
  material: require("../../../assets/icons/campaign-items/material.png"),
  food: require("../../../assets/icons/campaign-items/food.png"),
  chest: require("../../../assets/icons/campaign-items/chest.png"),
  necklace: require("../../../assets/icons/campaign-items/necklace.png"),
  sword: require("../../../assets/icons/campaign-items/sword.png"),
  shield: require("../../../assets/icons/campaign-items/shield.png"),
};

// Conditions checklist (src/components/ConditionsChecklist.tsx) -- one icon per
// 5e boolean condition plus a 15th for exhaustion. The Raven sheet has no
// icons drawn for these specific D&D states, so these are the closest
// generic status-effect glyphs on the sheet (see ART_ONBOARDING.md if this
// ever gets swapped for purpose-drawn art) -- keys match `ConditionDefinition.id`
// in src/data/conditions.ts, plus "exhaustion".
const CONDITION_ICONS_PIXEL: Record<string, number> = {
  blinded: require("../../../assets/icons/conditions/blinded.png"),
  charmed: require("../../../assets/icons/conditions/charmed.png"),
  deafened: require("../../../assets/icons/conditions/deafened.png"),
  frightened: require("../../../assets/icons/conditions/frightened.png"),
  grappled: require("../../../assets/icons/conditions/grappled.png"),
  incapacitated: require("../../../assets/icons/conditions/incapacitated.png"),
  invisible: require("../../../assets/icons/conditions/invisible.png"),
  paralyzed: require("../../../assets/icons/conditions/paralyzed.png"),
  petrified: require("../../../assets/icons/conditions/petrified.png"),
  poisoned: require("../../../assets/icons/conditions/poisoned.png"),
  prone: require("../../../assets/icons/conditions/prone.png"),
  restrained: require("../../../assets/icons/conditions/restrained.png"),
  stunned: require("../../../assets/icons/conditions/stunned.png"),
  unconscious: require("../../../assets/icons/conditions/unconscious.png"),
  exhaustion: require("../../../assets/icons/conditions/exhaustion.png"),
};

const EQUIPMENT_SLOT_ICONS_BY_STYLE: Record<IconStyleId, Record<string, number>> = {
  pixel: EQUIPMENT_SLOT_ICONS_PIXEL,
};

const SPELL_SCHOOL_ICONS_BY_STYLE: Record<IconStyleId, Record<string, number>> = {
  pixel: SPELL_SCHOOL_ICONS_PIXEL,
};

const TAB_ICONS_BY_STYLE: Record<IconStyleId, Record<string, number>> = {
  pixel: TAB_ICONS_PIXEL,
};

const CAMPAIGN_ITEM_ICONS_BY_STYLE: Record<
  IconStyleId,
  Record<CampaignItemIconId, number>
> = {
  pixel: CAMPAIGN_ITEM_ICONS_PIXEL,
};

const CONDITION_ICONS_BY_STYLE: Record<IconStyleId, Record<string, number>> = {
  pixel: CONDITION_ICONS_PIXEL,
};

export function getEquipmentSlotIcon(
  style: IconStyleId,
  slot: string
): number | undefined {
  return EQUIPMENT_SLOT_ICONS_BY_STYLE[style]?.[slot];
}

export function getSpellSchoolIcon(
  style: IconStyleId,
  school: string
): number | undefined {
  return SPELL_SCHOOL_ICONS_BY_STYLE[style]?.[school.trim().toLowerCase()];
}

export function getTabIcon(style: IconStyleId, tabName: string): number | undefined {
  return TAB_ICONS_BY_STYLE[style]?.[tabName];
}

export function getCampaignItemIcon(
  style: IconStyleId,
  iconId: CampaignItemIconId
): number | undefined {
  return CAMPAIGN_ITEM_ICONS_BY_STYLE[style]?.[iconId];
}

export function getConditionIcon(
  style: IconStyleId,
  conditionId: string
): number | undefined {
  return CONDITION_ICONS_BY_STYLE[style]?.[conditionId];
}
