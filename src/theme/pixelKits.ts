import type { ImageSourcePropType } from "react-native";
import {
  CUSTOM_FRAMES,
  CUSTOM_RIBBONS,
  CUSTOM_RIBBONS_DARK,
  CUSTOM_SCROLLS,
  CUSTOM_SCROLLS_DARK,
} from "./customPixelAssets";

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
  /** Darker banners (white text) used in dark mode; falls back to the above. */
  dark?: { ribbon: PixelBannerSpec; scroll: PixelBannerSpec };
};

/** Banner text is black in light mode and white in dark mode (on darker banners). */
const BANNER_TEXT = "#0A0A0A";
const DARK_BANNER_TEXT = "#D8D4CC";

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
  dark: {
    ribbon: {
      left: require("../../assets/ui/pixel-gui/journal-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/journal-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/journal-banner-dark-right.png"),
      height: 27,
      cap: 26,
      bodyHeight: 18,
      textInset: 18,
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      left: require("../../assets/ui/pixel-gui/journal-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/journal-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/journal-scroll-dark-right.png"),
      height: 20,
      cap: 5,
      bodyHeight: 20,
      textInset: 8,
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      left: require("../../assets/ui/pixel-gui/crimson-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/crimson-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/crimson-banner-dark-right.png"),
      height: 27,
      cap: 26,
      bodyHeight: 18,
      textInset: 18,
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      left: require("../../assets/ui/pixel-gui/crimson-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/crimson-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/crimson-scroll-dark-right.png"),
      height: 20,
      cap: 5,
      bodyHeight: 20,
      textInset: 8,
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/forest-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/forest-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/forest-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/forest-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/forest-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/forest-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/torchlight-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/torchlight-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/torchlight-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/torchlight-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/torchlight-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/torchlight-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/steampunk-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/steampunk-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/steampunk-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/steampunk-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/steampunk-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/steampunk-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/scifi-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/scifi-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/scifi-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/scifi-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/scifi-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/scifi-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
  },
};

export const DARKMAGIC_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/darkmagic-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/darkmagic-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/darkmagic-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/darkmagic-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/darkmagic-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/darkmagic-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/darkmagic-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/darkmagic-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/darkmagic-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/darkmagic-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/darkmagic-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/darkmagic-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/darkmagic-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/shadow-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/shadow-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/shadow-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/shadow-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/shadow-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/shadow-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
  },
};

export const WATER_PIXEL_KIT: PixelKit = {
  frame: require("../../assets/ui/pixel-gui/water-frame.png"),
  frameSize: FRAME_SIZE,
  frameSlice: FRAME_SLICE,
  ribbon: {
    ...RIBBON_METRICS,
    left: require("../../assets/ui/pixel-gui/water-banner-left.png"),
    mid: require("../../assets/ui/pixel-gui/water-banner-mid.png"),
    right: require("../../assets/ui/pixel-gui/water-banner-right.png"),
    textColor: BANNER_TEXT,
  },
  scroll: {
    ...SCROLL_METRICS,
    left: require("../../assets/ui/pixel-gui/water-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/water-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/water-scroll-right.png"),
    textColor: BANNER_TEXT,
  },
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/water-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/water-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/water-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/water-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/water-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/water-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/western-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/western-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/western-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/western-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/western-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/western-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
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
  dark: {
    ribbon: {
      ...RIBBON_METRICS,
      left: require("../../assets/ui/pixel-gui/galaxy-banner-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/galaxy-banner-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/galaxy-banner-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
    scroll: {
      ...SCROLL_METRICS,
      left: require("../../assets/ui/pixel-gui/galaxy-scroll-dark-left.png"),
      mid: require("../../assets/ui/pixel-gui/galaxy-scroll-dark-mid.png"),
      right: require("../../assets/ui/pixel-gui/galaxy-scroll-dark-right.png"),
      textColor: DARK_BANNER_TEXT,
    },
  },
};

/** User-built look: any border colour (1-16) with any banner colour (1-18). */
export type CustomThemeConfig = {
  /** Built-in theme whose colours, font and background the custom theme borrows. */
  base: string;
  /** Border sheet 1-16 (see docs/GUI.md). */
  frame: number;
  /** Ribbon sheet 1-18 (see docs/GUI.md). */
  banner: number;
};

export const CUSTOM_FRAME_COUNT = 16;
export const CUSTOM_BANNER_COUNT = 18;

export function buildCustomKit(frame: number, banner: number): PixelKit {
  const f = CUSTOM_FRAMES[frame] ? frame : 14;
  const b = CUSTOM_RIBBONS[banner] ? banner : 8;
  return {
    frame: CUSTOM_FRAMES[f],
    frameSize: FRAME_SIZE,
    frameSlice: FRAME_SLICE,
    ribbon: { ...RIBBON_METRICS, ...CUSTOM_RIBBONS[b], textColor: BANNER_TEXT },
    scroll: { ...SCROLL_METRICS, ...CUSTOM_SCROLLS[b], textColor: BANNER_TEXT },
    dark: {
      ribbon: { ...RIBBON_METRICS, ...CUSTOM_RIBBONS_DARK[b], textColor: DARK_BANNER_TEXT },
      scroll: { ...SCROLL_METRICS, ...CUSTOM_SCROLLS_DARK[b], textColor: DARK_BANNER_TEXT },
    },
  };
}
