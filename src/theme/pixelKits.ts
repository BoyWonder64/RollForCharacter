import type { ImageSourcePropType } from "react-native";

/**
 * A horizontal banner pre-cut into fixed left/right caps and a stretchy middle,
 * so it can span any width. Sizes are in source pixels.
 */
export type PixelBannerSpec = {
  left: ImageSourcePropType;
  mid: ImageSourcePropType;
  right: ImageSourcePropType;
  height: number;
  /** Width of the left and right caps. */
  cap: number;
  /** Height of the writable body, measured from the top of the sprite. */
  bodyHeight: number;
  /** Distance from each end before text may start. */
  textInset: number;
  /** Text colour that reads on this banner's fill. */
  textColor: string;
};

/**
 * Pixel-art frame + banners for a theme (bdragon1727 GUI pack, sliced by
 * scripts/build_gui_pixel_assets.py).
 */
export type PixelKit = {
  frame: ImageSourcePropType;
  /** Source pixel size of frame.png. */
  frameSize: { width: number; height: number };
  /** Source pixels kept fixed at each corner of the frame. */
  frameSlice: number;
  /** Tailed ribbon: identity line at the top of the sheet. */
  ribbon: PixelBannerSpec;
  /** Rod-ended scroll: section headers. */
  scroll: PixelBannerSpec;
};

/** Banner text is black on every theme and mode. */
const BANNER_TEXT = "#0A0A0A";

// Every kit is cut from the same sprites, so the source-pixel metrics are shared.
const FRAME_SIZE = { width: 62, height: 62 };
const FRAME_SLICE = 10;
const RIBBON_METRICS = { height: 27, cap: 26, bodyHeight: 18, textInset: 18 };
const SCROLL_METRICS = { height: 20, cap: 5, bodyHeight: 20, textInset: 8 };

export const JOURNAL_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/journal-frame.png"),
  frameSize: { width: 62, height: 62 },
  frameSlice: 10,
  ribbon: {
    left: require("../../assets/ui/pixel-gui/journal-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/journal-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/journal-banner-right.png"),
    height: 27,
    cap: 26,
    bodyHeight: 18,
    textInset: 18,
    textColor: BANNER_TEXT,
  },
  scroll: {
    left: require("../../assets/ui/pixel-gui/journal-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/journal-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/journal-scroll-right.png"),
    height: 20,
    cap: 5,
    bodyHeight: 20,
    textInset: 8,
    textColor: BANNER_TEXT,
  },
};

export const CRIMSON_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/crimson-frame.png"),
  frameSize: { width: 62, height: 62 },
  frameSlice: 10,
  ribbon: {
    left: require("../../assets/ui/pixel-gui/crimson-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/crimson-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/crimson-banner-right.png"),
    height: 27,
    cap: 26,
    bodyHeight: 18,
    textInset: 18,
    textColor: BANNER_TEXT,
  },
  scroll: {
    left: require("../../assets/ui/pixel-gui/crimson-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/crimson-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/crimson-scroll-right.png"),
    height: 20,
    cap: 5,
    bodyHeight: 20,
    textInset: 8,
    textColor: BANNER_TEXT,
  },
};

export const FOREST_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/forest-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/forest-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/forest-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/forest-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/forest-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/forest-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/forest-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const MANUSCRIPT_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/manuscript-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/manuscript-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/manuscript-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/manuscript-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/manuscript-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/manuscript-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/manuscript-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const TORCHLIGHT_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/torchlight-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/torchlight-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/torchlight-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/torchlight-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/torchlight-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/torchlight-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/torchlight-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const STEAMPUNK_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/steampunk-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/steampunk-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/steampunk-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/steampunk-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/steampunk-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/steampunk-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/steampunk-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const SCIFI_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/scifi-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/scifi-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/scifi-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/scifi-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/scifi-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/scifi-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/scifi-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const SHADOW_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/shadow-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/shadow-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/shadow-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/shadow-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/shadow-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/shadow-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/shadow-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const WESTERN_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/western-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/western-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/western-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/western-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/western-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/western-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/western-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};

export const GALAXY_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/galaxy-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/galaxy-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/galaxy-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/galaxy-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/galaxy-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/galaxy-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/galaxy-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
};
