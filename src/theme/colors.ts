import type { ImageSourcePropType } from "react-native";
import { GEAR_SPRITES, type GearSprite } from "./gearAssets";
import {
  CRIMSON_PIXEL_KIT,
  DARKMAGIC_PIXEL_KIT,
  FOREST_PIXEL_KIT,
  GALAXY_PIXEL_KIT,
  JOURNAL_PIXEL_KIT,
  SCIFI_PIXEL_KIT,
  SHADOW_PIXEL_KIT,
  STEAMPUNK_PIXEL_KIT,
  TORCHLIGHT_PIXEL_KIT,
  WATER_PIXEL_KIT,
  WESTERN_PIXEL_KIT,
  buildCustomKit,
  type CustomThemeConfig,
  type PixelKit,
} from "./pixelKits";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  accent: string;
  danger: string;
};

export type ThemeMode = "light" | "dark";

export type ThemeFamilyId =
  | "classic"
  | "grimdark"
  | "journal"
  | "steampunk"
  | "scifi"
  | "crimson"
  | "shadow"
  | "darkmagic"
  | "western"
  | "galaxy"
  | "water"
  | "custom";

/** Families a Custom theme can borrow its colours/font from. */
export type BaseThemeFamilyId = Exclude<ThemeFamilyId, "custom">;

export type Theme = {
  family: ThemeFamilyId;
  mode: ThemeMode;
  colors: ThemeColors;
  radius: number;
  /** fontFamily for titles/headers only; undefined means "use the system default". */
  displayFontFamily?: string;
  /** Full-screen image painted behind every screen (screens go transparent). */
  backdrop?: ImageSourcePropType;
  /** Background for screen roots: `colors.background`, or transparent when a backdrop is showing. */
  screenBackground: string;
  /** Pixel-art frames/banners; absent for themes that use flat boxes. */
  pixel?: PixelKit;
  /** Scenery drawn behind a screen's content (see ThemeBackdropArt). */
  backgroundArt?: BackgroundArt;
};

/**
 * Art that sits behind the stat page's information.
 * - "bottom": one image pinned to the bottom edge, scaled to the screen width.
 * - "gears": several chains of meshed, turning gears dropped down the page (see
 *   ThemeBackdropArt); the layout is re-rolled each time the page opens.
 */
export type BackgroundArt =
  | { kind: "bottom"; source: ImageSourcePropType; aspectRatio: number }
  | { kind: "gears"; sprites: GearSprite[]; chains: number; minPerChain: number; maxPerChain: number }
  | { kind: "specks"; count: number }
  | { kind: "stars"; count: number }
  | { kind: "desert"; props: ImageSourcePropType[]; propCount: number }
  | {
      kind: "castle";
      wall: ImageSourcePropType;
      /** Wall recolored to sit on this theme's light-mode background. */
      wallLight?: ImageSourcePropType;
      /** Source pixels of the wall image (a pre-baked 8x8 sheet of 32px tiles). */
      wallSize: { width: number; height: number };
    };

type ThemeFamilyDefinition = {
  label: string;
  backgroundArt?: BackgroundArt;
  pixel?: PixelKit;
  light: ThemeColors;
  dark: ThemeColors;
  displayFontFamily?: string;
  /** Backdrop image per mode; modes without an entry use the plain background color. */
  backdrop?: { light?: ImageSourcePropType; dark?: ImageSourcePropType };
};

// Square, flat design across every family: no rounded corners, no
// shadows/elevation anywhere.
const RADIUS = 0;

export const THEME_FAMILIES: Record<ThemeFamilyId, ThemeFamilyDefinition> = {
  // Forest: green accents over earthy browns (bark, soil, leather).
  classic: {
    label: "Forest",
    pixel: FOREST_PIXEL_KIT,
    light: {
      background: "#EFE6D6",
      surface: "#E3D5BC",
      surfaceAlt: "#D5C3A2",
      border: "#B89E76",
      text: "#2B1D12",
      textMuted: "#6B5238",
      primary: "#2E7D32",
      primaryText: "#FFFFFF",
      accent: "#2E7D32",
      danger: "#B3261E",
    },
    dark: {
      background: "#1E140C",
      surface: "#2A1D12",
      surfaceAlt: "#38281A",
      border: "#5A4129",
      text: "#F2E8D8",
      textMuted: "#B5A084",
      primary: "#2E7D32",
      primaryText: "#FFFFFF",
      accent: "#66BB6A",
      danger: "#E6887E",
    },
  },

  // Dungeon & torchlight: stone and ember, heavy carved-serif headers.
  grimdark: {
    label: "Torchlight",
    // Fort of Illusion (CraftPix "Background Castle"): tiled wall.
    backgroundArt: {
      kind: "castle",
      wall: require("../../assets/ui/backgrounds/castle-wall-sheet.png"),
      wallLight: require("../../assets/ui/backgrounds/castle-wall-torchlight-light-sheet.png"),
      wallSize: { width: 256, height: 256 },
    },
    pixel: TORCHLIGHT_PIXEL_KIT,
    displayFontFamily: "Cinzel_700Bold",
    light: {
      background: "#D9D4CC",
      surface: "#C7C1B6",
      surfaceAlt: "#B6AFA2",
      border: "#8F887A",
      text: "#241F1C",
      textMuted: "#5A5248",
      primary: "#B0581E",
      primaryText: "#1A1512",
      accent: "#B0581E",
      danger: "#8B2E22",
    },
    dark: {
      background: "#1C1814",
      surface: "#262019",
      surfaceAlt: "#322A20",
      border: "#473C2D",
      text: "#E8DFC9",
      textMuted: "#9C8F75",
      primary: "#D9722C",
      primaryText: "#1A1512",
      accent: "#D9722C",
      danger: "#C0392B",
    },
  },

  // Adventurer's journal: handwritten notebook, ink-blue accent.
  journal: {
    label: "Journal",
    pixel: JOURNAL_PIXEL_KIT,
    // Brown pixel-art ink blots scattered behind the page.
    backgroundArt: { kind: "specks", count: 12 },
    displayFontFamily: "Caveat_700Bold",
    light: {
      background: "#EFE4CB",
      surface: "#E6D9BA",
      surfaceAlt: "#DACBA5",
      border: "#C4B28A",
      text: "#2E2A20",
      textMuted: "#6B5F45",
      primary: "#35506B",
      primaryText: "#F6EEDC",
      accent: "#35506B",
      danger: "#8C3B2E",
    },
    dark: {
      background: "#201B14",
      surface: "#2A2318",
      surfaceAlt: "#352C1D",
      border: "#473B27",
      text: "#EFE6D2",
      textMuted: "#AFA383",
      primary: "#5C85A8",
      primaryText: "#15110B",
      accent: "#5C85A8",
      danger: "#C97A63",
    },
  },

  // Steampunk: brass, copper, oiled leather, Victorian typewriter headers.
  steampunk: {
    label: "Steampunk",
    // Two or three bronze/silver gears at random spots behind the stat page.
    backgroundArt: { kind: "gears", sprites: GEAR_SPRITES, chains: 6, minPerChain: 2, maxPerChain: 3 },
    pixel: STEAMPUNK_PIXEL_KIT,
    displayFontFamily: "SpecialElite_400Regular",
    light: {
      background: "#E8DCC2",
      surface: "#DCCBA3",
      surfaceAlt: "#CBB888",
      border: "#A98F5E",
      text: "#2B2015",
      textMuted: "#6B5A3C",
      primary: "#A8772E",
      primaryText: "#2B2015",
      accent: "#A8772E",
      danger: "#8C3B23",
    },
    dark: {
      background: "#1C1915",
      surface: "#262219",
      surfaceAlt: "#322C1F",
      border: "#4A4130",
      text: "#E8D9B0",
      textMuted: "#A89A74",
      primary: "#D99A3E",
      primaryText: "#1C1510",
      accent: "#D99A3E",
      danger: "#C0583A",
    },
  },

  // Sci-fi: deep space, electric cyan, geometric headers.
  scifi: {
    label: "Sci-Fi",
    pixel: SCIFI_PIXEL_KIT,
    displayFontFamily: "Orbitron_700Bold",
    light: {
      background: "#EAF0F2",
      surface: "#DCE6EA",
      surfaceAlt: "#C9D8DE",
      border: "#A9BEC6",
      text: "#141C1F",
      textMuted: "#53676D",
      primary: "#0E8A8A",
      primaryText: "#06201F",
      accent: "#0E8A8A",
      danger: "#C0392B",
    },
    dark: {
      background: "#0B1013",
      surface: "#121A1E",
      surfaceAlt: "#1A2429",
      border: "#263238",
      text: "#DCEFF2",
      textMuted: "#7E979C",
      primary: "#2EE6D6",
      primaryText: "#031412",
      accent: "#2EE6D6",
      danger: "#FF5C5C",
    },
  },

  // Crimson: classic red-box D&D — deep crimson, black, and gold trim.
  crimson: {
    label: "Crimson",
    // Fort of Illusion (CraftPix "Background Castle"): tiled wall.
    backgroundArt: {
      kind: "castle",
      wall: require("../../assets/ui/backgrounds/castle-wall-sheet.png"),
      wallLight: require("../../assets/ui/backgrounds/castle-wall-crimson-light-sheet.png"),
      wallSize: { width: 256, height: 256 },
    },
    pixel: CRIMSON_PIXEL_KIT,
    light: {
      background: "#E8D9BE",
      surface: "#DCC9A3",
      surfaceAlt: "#CBB585",
      border: "#8B1A1A",
      text: "#241212",
      textMuted: "#6B4A3C",
      primary: "#A31F1F",
      primaryText: "#F4E9D0",
      accent: "#B8860B",
      danger: "#5C1010",
    },
    dark: {
      background: "#140808",
      surface: "#1F0D0D",
      surfaceAlt: "#2B1414",
      border: "#5C1A1A",
      text: "#EEDFC0",
      textMuted: "#A8886B",
      primary: "#D32F2F",
      primaryText: "#140808",
      accent: "#D4AF37",
      danger: "#8B2E2E",
    },
  },

  // Shadow: thief's guild — charcoal and steel grey.
  shadow: {
    label: "Shadow",
    pixel: SHADOW_PIXEL_KIT,
    light: {
      background: "#D6D2CC",
      surface: "#C7C2BA",
      surfaceAlt: "#B6B0A5",
      border: "#8A8378",
      text: "#201F1D",
      textMuted: "#5C5650",
      primary: "#4A4E58",
      primaryText: "#F0EEE8",
      accent: "#5A6070",
      danger: "#8B2E2E",
    },
    dark: {
      background: "#0D0D10",
      surface: "#17171B",
      surfaceAlt: "#212126",
      border: "#333339",
      text: "#D8D6DC",
      textMuted: "#8A8792",
      primary: "#5C6270",
      primaryText: "#0D0D10",
      accent: "#A0A6B8",
      danger: "#C0392B",
    },
  },

  // Dark Magic: deep violet and amethyst.
  darkmagic: {
    label: "Dark Magic",
    pixel: DARKMAGIC_PIXEL_KIT,
    light: {
      background: "#E4DCEC",
      surface: "#D6CAE2",
      surfaceAlt: "#C4B4D6",
      border: "#8E78AC",
      text: "#1E1230",
      textMuted: "#5E4B7A",
      primary: "#6B3FA0",
      primaryText: "#F4EEFC",
      accent: "#8E4FD0",
      danger: "#8B2E4E",
    },
    dark: {
      background: "#0E0A16",
      surface: "#181224",
      surfaceAlt: "#231A34",
      border: "#3D2D5C",
      text: "#E6DCF4",
      textMuted: "#9C8AB8",
      primary: "#8F5BD6",
      primaryText: "#0E0A16",
      accent: "#B07CF0",
      danger: "#D0506F",
    },
  },

  // Western: dusty frontier — sand, saddle leather, and weathered rust.
  western: {
    label: "Western",
    pixel: WESTERN_PIXEL_KIT,
    // Cacti, a sign and bones scattered over the plain background.
    backgroundArt: {
      kind: "desert",
      props: [
        require("../../assets/ui/backgrounds/desert/cactus.png"),
        require("../../assets/ui/backgrounds/desert/barrel-cactus.png"),
        require("../../assets/ui/backgrounds/desert/sign.png"),
        require("../../assets/ui/backgrounds/desert/bones.png"),
      ],
      propCount: 12,
    },
    light: {
      background: "#D9C3A5",
      surface: "#CDB291",
      surfaceAlt: "#BC9F7D",
      border: "#7A5233",
      text: "#2B1D10",
      textMuted: "#64472D",
      primary: "#8B3A2B",
      primaryText: "#F2E4C4",
      accent: "#A9703A",
      danger: "#6B1E14",
    },
    dark: {
      background: "#1A140C",
      surface: "#241C12",
      surfaceAlt: "#30261A",
      border: "#4A3824",
      text: "#E8D9B4",
      textMuted: "#A8936B",
      primary: "#C1573E",
      primaryText: "#1A140C",
      accent: "#D4AF5A",
      danger: "#B33A2A",
    },
  },

  // Galaxy: Star Wars gold — black space with crawl-yellow, parchment gold in light mode.
  galaxy: {
    label: "Galaxy",
    pixel: GALAXY_PIXEL_KIT,
    // Tiny pixel stars: mostly white, some blue, a few slightly red.
    backgroundArt: { kind: "stars", count: 170 },
    light: {
      background: "#F4EDC8",
      surface: "#E8DFA8",
      surfaceAlt: "#D9CE88",
      border: "#A38B1A",
      text: "#1A1500",
      textMuted: "#6B5C10",
      primary: "#B58F00",
      primaryText: "#1A1500",
      accent: "#8A6D00",
      danger: "#9A2A1A",
    },
    dark: {
      background: "#050400",
      surface: "#100E02",
      surfaceAlt: "#1B1803",
      border: "#5C4F0A",
      text: "#F7E463",
      textMuted: "#A89A3E",
      primary: "#FFE81F",
      primaryText: "#0A0800",
      accent: "#FFD400",
      danger: "#FF5A3C",
    },
  },

  // Water: everything blue — sea-glass light mode, deep-ocean dark mode.
  water: {
    label: "Water",
    pixel: WATER_PIXEL_KIT,
    light: {
      background: "#EAF4FB",
      surface: "#D8EAF7",
      surfaceAlt: "#C2DDF0",
      border: "#8DB9DA",
      text: "#0B2236",
      textMuted: "#4A6F8C",
      primary: "#1F6FB2",
      primaryText: "#FFFFFF",
      accent: "#0E8FBF",
      danger: "#2B4F8C",
    },
    dark: {
      background: "#06121F",
      surface: "#0C1D30",
      surfaceAlt: "#12304A",
      border: "#1E4A6E",
      text: "#DCEEFA",
      textMuted: "#86A9C4",
      primary: "#3A8FD6",
      primaryText: "#04101C",
      accent: "#4FC3E8",
      danger: "#6FA8E8",
    },
  },

  // Custom: borrows another theme's colours, plus any border and banner colour
  // the user picks (see CustomThemeConfig). The entry here is only its placeholder
  // swatch/label; buildTheme swaps in the chosen base and kit.
  custom: {
    label: "Custom",
    light: {
      background: "#FAF6ED",
      surface: "#F1EAD9",
      surfaceAlt: "#E8DEC7",
      border: "#D8CBA8",
      text: "#2E2A20",
      textMuted: "#75694F",
      primary: "#35506B",
      primaryText: "#FAF6ED",
      accent: "#35506B",
      danger: "#8C3B2E",
    },
    dark: {
      background: "#201B14",
      surface: "#2A2318",
      surfaceAlt: "#352C1D",
      border: "#473B27",
      text: "#EFE6D2",
      textMuted: "#AFA383",
      primary: "#5C85A8",
      primaryText: "#15110B",
      accent: "#5C85A8",
      danger: "#C97A63",
    },
  },
};

export const DEFAULT_CUSTOM_THEME: CustomThemeConfig = { base: "journal", frame: 14, banner: 8 };

/** Theme ids saved by older versions that no longer exist -> what they become. */
const LEGACY_FAMILY_ALIASES: Record<string, ThemeFamilyId> = { parchment: "classic" };

export function normalizeFamilyId(id: string | null | undefined): ThemeFamilyId | null {
  if (!id) return null;
  if (id in THEME_FAMILIES) return id as ThemeFamilyId;
  return LEGACY_FAMILY_ALIASES[id] ?? null;
}

export function buildTheme(
  family: ThemeFamilyId,
  mode: ThemeMode,
  custom: CustomThemeConfig = DEFAULT_CUSTOM_THEME
): Theme {
  const isCustom = family === "custom";
  const baseId = isCustom ? normalizeFamilyId(custom.base) ?? "journal" : family;
  const definition =
    THEME_FAMILIES[baseId === "custom" ? "journal" : baseId] ?? THEME_FAMILIES.classic;
  const colors = mode === "dark" ? definition.dark : definition.light;
  const backdrop = definition.backdrop?.[mode];
  return {
    family,
    mode,
    colors,
    radius: RADIUS,
    displayFontFamily: definition.displayFontFamily,
    backdrop,
    pixel: isCustom ? buildCustomKit(custom.frame, custom.banner) : definition.pixel,
    // Custom borrows its base theme's background too.
    backgroundArt: definition.backgroundArt,
    screenBackground: backdrop ? "transparent" : colors.background,
  };
}
