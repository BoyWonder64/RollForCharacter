// Rarity-style colored square frames, sliced from
// `pixel assets/Pixel UI pack 3/02.png` (4 colors x 3 sizes x 4 style
// variants each -- see FEATURES.md for the exact slicing coordinates/history).
// There's no rarity data on `equipmentItems` yet, so these aren't wired to
// anything per-item -- just a single consistent color used as every slot
// card's border, replacing the old plain placeholder box. Swap `DEFAULT_FRAME_COLOR`
// (or make it per-item once rarity exists) to use a different color.
export type EquipmentFrameColor = "green" | "orange" | "cyan" | "purple";

const MEDIUM_FRAMES: Record<EquipmentFrameColor, number> = {
  green: require("../../../assets/icons/equipment-frames/green/medium_1.png"),
  orange: require("../../../assets/icons/equipment-frames/orange/medium_1.png"),
  cyan: require("../../../assets/icons/equipment-frames/cyan/medium_1.png"),
  purple: require("../../../assets/icons/equipment-frames/purple/medium_1.png"),
};

export const DEFAULT_FRAME_COLOR: EquipmentFrameColor = "green";

export function getEquipmentFrame(color: EquipmentFrameColor = DEFAULT_FRAME_COLOR): number {
  return MEDIUM_FRAMES[color];
}
