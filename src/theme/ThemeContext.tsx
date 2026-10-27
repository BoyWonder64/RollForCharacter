import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildTheme, type Theme, type ThemeFamilyId, type ThemeMode } from "./colors";
import { FONT_CHOICES, type FontChoiceId } from "./fonts";

export type ThemePreference = ThemeMode | "system";

const MODE_STORAGE_KEY = "rollforcharacter.themePreference";
const FAMILY_STORAGE_KEY = "rollforcharacter.themeFamily";
const FONT_STORAGE_KEY = "rollforcharacter.fontChoice";
const DEFAULT_FAMILY: ThemeFamilyId = "classic";
const DEFAULT_FONT_CHOICE: FontChoiceId = "auto";

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  family: ThemeFamilyId;
  setFamily: (family: ThemeFamilyId) => void;
  fontChoice: FontChoiceId;
  setFontChoice: (fontChoice: FontChoiceId) => void;
};

// Exported so a character-scoped screen can nest a second Provider (see
// CharacterThemeContext.tsx) carrying that one character's resolved theme --
// every descendant's existing `useTheme()`/`useThemeContext()` call then
// picks it up automatically, with no changes needed in StatsTab, SpellsTab,
// EquipmentTab, or any of the HP/currency/level-up modals.
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Shared by the global provider and the per-character override. */
export function resolveTheme(
  family: ThemeFamilyId,
  mode: ThemeMode,
  fontChoice: FontChoiceId
): Theme {
  const familyTheme = buildTheme(family, mode);
  return {
    ...familyTheme,
    displayFontFamily:
      fontChoice === "auto" ? familyTheme.displayFontFamily : FONT_CHOICES[fontChoice].fontFamily,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [family, setFamily] = useState<ThemeFamilyId>(DEFAULT_FAMILY);
  const [fontChoice, setFontChoice] = useState<FontChoiceId>(DEFAULT_FONT_CHOICE);

  useEffect(() => {
    AsyncStorage.getItem(MODE_STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored);
      }
    });
    AsyncStorage.getItem(FAMILY_STORAGE_KEY).then((stored) => {
      if (stored) setFamily(stored as ThemeFamilyId);
    });
    AsyncStorage.getItem(FONT_STORAGE_KEY).then((stored) => {
      if (stored) setFontChoice(stored as FontChoiceId);
    });
  }, []);

  function updatePreference(next: ThemePreference) {
    setPreference(next);
    AsyncStorage.setItem(MODE_STORAGE_KEY, next).catch(() => {});
  }

  function updateFamily(next: ThemeFamilyId) {
    setFamily(next);
    AsyncStorage.setItem(FAMILY_STORAGE_KEY, next).catch(() => {});
  }

  function updateFontChoice(next: FontChoiceId) {
    setFontChoice(next);
    AsyncStorage.setItem(FONT_STORAGE_KEY, next).catch(() => {});
  }

  const resolvedMode: ThemeMode =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const theme = useMemo<Theme>(
    () => resolveTheme(family, resolvedMode, fontChoice),
    [family, resolvedMode, fontChoice]
  );

  const value = useMemo(
    () => ({
      theme,
      preference,
      setPreference: updatePreference,
      family,
      setFamily: updateFamily,
      fontChoice,
      setFontChoice: updateFontChoice,
    }),
    [theme, preference, family, fontChoice]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within a ThemeProvider");
  return ctx;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}
