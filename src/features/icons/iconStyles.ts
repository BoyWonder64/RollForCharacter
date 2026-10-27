export type IconStyleId = "pixel";

// More styles get added here later (e.g. the user's own custom art) --
// each needs its own equipment/spell-school lookup maps registered in
// iconAssets.ts and a label here.
export const ICON_STYLES: Record<IconStyleId, { label: string }> = {
  pixel: { label: "Pixel (Raven Fantasy Icons)" },
};

export const ICON_STYLE_ORDER: IconStyleId[] = ["pixel"];

export const DEFAULT_ICON_STYLE: IconStyleId = "pixel";
