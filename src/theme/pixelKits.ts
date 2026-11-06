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
  },
  scroll: {
    left: require("../../assets/ui/pixel-gui/journal-scroll-left.png"),
    mid: require("../../assets/ui/pixel-gui/journal-scroll-mid.png"),
    right: require("../../assets/ui/pixel-gui/journal-scroll-right.png"),
    height: 20,
    cap: 5,
    bodyHeight: 20,
    textInset: 8,
  },
};
