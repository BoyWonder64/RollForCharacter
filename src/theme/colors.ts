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

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
  radius: number;
};

const lightColors: ThemeColors = {
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
};

const darkColors: ThemeColors = {
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
};

// Square, flat design: no rounded corners, no shadows/elevation anywhere.
const RADIUS = 0;

export const lightTheme: Theme = { mode: "light", colors: lightColors, radius: RADIUS };
export const darkTheme: Theme = { mode: "dark", colors: darkColors, radius: RADIUS };
