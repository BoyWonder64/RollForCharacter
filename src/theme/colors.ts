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
  | "parchment"
  | "grimdark"
  | "journal"
  | "steampunk"
  | "scifi"
  | "crimson"
  | "shadow"
  | "western"
  | "galaxy";

export type Theme = {
  family: ThemeFamilyId;
  mode: ThemeMode;
  colors: ThemeColors;
  radius: number;
  /** fontFamily for titles/headers only; undefined means "use the system default". */
  displayFontFamily?: string;
};

type ThemeFamilyDefinition = {
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
  displayFontFamily?: string;
};

// Square, flat design across every family: no rounded corners, no
// shadows/elevation anywhere.
const RADIUS = 0;

export const THEME_FAMILIES: Record<ThemeFamilyId, ThemeFamilyDefinition> = {
  classic: {
    label: "Forest",
    light: {
      background: "#FFFFFF",
      surface: "#F2F6F3",
      surfaceAlt: "#E7EEE9",
      border: "#D3DED7",
      text: "#15201A",
      textMuted: "#5A6B60",
      primary: "#2E7D32",
      primaryText: "#FFFFFF",
      accent: "#2E7D32",
      danger: "#B3261E",
    },
    dark: {
      background: "#121212",
      surface: "#1B1F1C",
      surfaceAlt: "#232823",
      border: "#30362F",
      text: "#F1F4F2",
      textMuted: "#9FACA4",
      primary: "#2E7D32",
      primaryText: "#FFFFFF",
      accent: "#66BB6A",
      danger: "#E6887E",
    },
  },

  // Illuminated manuscript: warm parchment page, ink-brown text, deep green accent.
  parchment: {
    label: "Manuscript",
    displayFontFamily: "CormorantGaramond_700Bold",
    light: {
      background: "#F3EEE2",
      surface: "#EAE2D0",
      surfaceAlt: "#DFD4BB",
      border: "#C9BB97",
      text: "#2A2420",
      textMuted: "#6B5D45",
      primary: "#3F6B3C",
      primaryText: "#F3EEE2",
      accent: "#3F6B3C",
      danger: "#7A2E2E",
    },
    dark: {
      background: "#241F18",
      surface: "#2E2719",
      surfaceAlt: "#3A3122",
      border: "#4A4030",
      text: "#EDE3C8",
      textMuted: "#B8AA87",
      primary: "#5C8A55",
      primaryText: "#1A1510",
      accent: "#5C8A55",
      danger: "#B85C5C",
    },
  },

  // Dungeon & torchlight: stone and ember, heavy carved-serif headers.
  grimdark: {
    label: "Torchlight",
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
    displayFontFamily: "Caveat_700Bold",
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

  // Steampunk: brass, copper, oiled leather, Victorian typewriter headers.
  steampunk: {
    label: "Steampunk",
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

  // Shadow: thief's guild — charcoal and steel, with a poison-violet accent.
  shadow: {
    label: "Shadow",
    light: {
      background: "#D6D2CC",
      surface: "#C7C2BA",
      surfaceAlt: "#B6B0A5",
      border: "#8A8378",
      text: "#201F1D",
      textMuted: "#5C5650",
      primary: "#4A4E58",
      primaryText: "#F0EEE8",
      accent: "#6B4C7A",
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
      accent: "#9B6BC0",
      danger: "#C0392B",
    },
  },

  // Western: dusty frontier — sand, saddle leather, and weathered rust.
  western: {
    label: "Western",
    light: {
      background: "#E4D3AE",
      surface: "#D7C294",
      surfaceAlt: "#C7AF7D",
      border: "#8B6239",
      text: "#2B1D10",
      textMuted: "#6B4F30",
      primary: "#8B3A2B",
      primaryText: "#F2E4C4",
      accent: "#B08D3E",
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

  // Galaxy: space-opera bridge console — chrome, holo-blue, and gold insignia.
  galaxy: {
    label: "Galaxy",
    light: {
      background: "#E8ECEF",
      surface: "#D7DEE3",
      surfaceAlt: "#C4CDD4",
      border: "#9FAAB2",
      text: "#10151A",
      textMuted: "#55626B",
      primary: "#1B6FD1",
      primaryText: "#F2F6FA",
      accent: "#C9A227",
      danger: "#C0392B",
    },
    dark: {
      background: "#07090D",
      surface: "#0F141A",
      surfaceAlt: "#182029",
      border: "#2A3640",
      text: "#E4EEF5",
      textMuted: "#7E90A0",
      primary: "#3FA9F5",
      primaryText: "#05080C",
      accent: "#E8C547",
      danger: "#FF4136",
    },
  },
};

export function buildTheme(family: ThemeFamilyId, mode: ThemeMode): Theme {
  const definition = THEME_FAMILIES[family] ?? THEME_FAMILIES.classic;
  return {
    family,
    mode,
    colors: mode === "dark" ? definition.dark : definition.light,
    radius: RADIUS,
    displayFontFamily: definition.displayFontFamily,
  };
}
