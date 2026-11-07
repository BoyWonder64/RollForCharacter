import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_CUSTOM_THEME,
  buildTheme,
  normalizeFamilyId,
  type Theme,
  type ThemeFamilyId,
  type ThemeMode,
} from "./colors";
import type { CustomThemeConfig } from "./pixelKits";
import { getCharacter, updateCharacter } from "../features/characters/characterRepo";
import { FONT_CHOICES, type FontChoiceId } from "./fonts";

export type ThemePreference = ThemeMode | "system";

const MODE_STORAGE_KEY = "rollforcharacter.themePreference";
const FAMILY_STORAGE_KEY = "rollforcharacter.themeFamily";
const FONT_STORAGE_KEY = "rollforcharacter.fontChoice";
const CUSTOM_THEME_STORAGE_KEY = "rollforcharacter.customTheme";
const ACTIVE_CHARACTER_STORAGE_KEY = "rollforcharacter.activeCharacterId";
const DEFAULT_FAMILY: ThemeFamilyId = "classic";
const DEFAULT_FONT_CHOICE: FontChoiceId = "auto";

/** The character whose look the whole app is wearing right now. */
type ActiveCharacterLook = {
  id: number;
  name: string;
  themeFamily: ThemeFamilyId | null;
  fontChoice: FontChoiceId | null;
};

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** The theme currently in effect: the active character's own, else the device default. */
  family: ThemeFamilyId;
  /** Sets the active character's theme, or the device default when no character is active. */
  setFamily: (family: ThemeFamilyId) => void;
  fontChoice: FontChoiceId;
  setFontChoice: (fontChoice: FontChoiceId) => void;
  /** Device-wide defaults, used by anything that isn't the active character. */
  defaultFamily: ThemeFamilyId;
  defaultFontChoice: FontChoiceId;
  /** Make this character the one the app is themed for (null = none). */
  setActiveCharacter: (id: number | null) => void;
  activeCharacterId: number | null;
  activeCharacterName: string | null;
  /** The Custom theme's base palette, border colour and banner colour. */
  customTheme: CustomThemeConfig;
  setCustomTheme: (config: CustomThemeConfig) => void;
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
  fontChoice: FontChoiceId,
  custom: CustomThemeConfig = DEFAULT_CUSTOM_THEME
): Theme {
  const familyTheme = buildTheme(family, mode, custom);
  return {
    ...familyTheme,
    displayFontFamily:
      fontChoice === "auto" ? familyTheme.displayFontFamily : FONT_CHOICES[fontChoice].fontFamily,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [defaultFamily, setDefaultFamily] = useState<ThemeFamilyId>(DEFAULT_FAMILY);
  const [defaultFontChoice, setDefaultFontChoice] = useState<FontChoiceId>(DEFAULT_FONT_CHOICE);
  const [active, setActive] = useState<ActiveCharacterLook | null>(null);
  const [customTheme, setCustomThemeState] = useState<CustomThemeConfig>(DEFAULT_CUSTOM_THEME);

  useEffect(() => {
    AsyncStorage.getItem(MODE_STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored);
      }
    });
    AsyncStorage.getItem(FAMILY_STORAGE_KEY).then((stored) => {
      // Themes removed in later versions (e.g. Manuscript) fall back via normalizeFamilyId.
      const normalized = normalizeFamilyId(stored);
      if (normalized) setDefaultFamily(normalized);
    });
    AsyncStorage.getItem(FONT_STORAGE_KEY).then((stored) => {
      if (stored) setDefaultFontChoice(stored as FontChoiceId);
    });
    AsyncStorage.getItem(ACTIVE_CHARACTER_STORAGE_KEY).then((stored) => {
      const id = stored ? Number(stored) : NaN;
      if (Number.isFinite(id)) loadActiveCharacter(id);
    });
    AsyncStorage.getItem(CUSTOM_THEME_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as Partial<CustomThemeConfig>;
        setCustomThemeState({ ...DEFAULT_CUSTOM_THEME, ...parsed });
      } catch {
        // Corrupt value: keep the default custom look.
      }
    });
  }, []);

  function updatePreference(next: ThemePreference) {
    setPreference(next);
    AsyncStorage.setItem(MODE_STORAGE_KEY, next).catch(() => {});
  }

  // Reads the character's saved look from the database. Called whenever a
  // character is opened/selected and again each time its sheet regains focus,
  // so edits made in Edit -> Appearance show up straight away.
  function loadActiveCharacter(id: number) {
    getCharacter(id)
      .then((character) => {
        if (!character) {
          setActive(null);
          AsyncStorage.removeItem(ACTIVE_CHARACTER_STORAGE_KEY).catch(() => {});
          return;
        }
        setActive({
          id: character.id,
          name: character.name,
          themeFamily: normalizeFamilyId(character.themeFamily),
          fontChoice: (character.fontChoice as FontChoiceId | null) ?? null,
        });
      })
      .catch(() => {});
  }

  function setActiveCharacter(id: number | null) {
    if (id === null) {
      setActive(null);
      AsyncStorage.removeItem(ACTIVE_CHARACTER_STORAGE_KEY).catch(() => {});
      return;
    }
    AsyncStorage.setItem(ACTIVE_CHARACTER_STORAGE_KEY, String(id)).catch(() => {});
    loadActiveCharacter(id);
  }

  function updateFamily(next: ThemeFamilyId) {
    if (active) {
      setActive({ ...active, themeFamily: next });
      updateCharacter(active.id, { themeFamily: next }).catch(() => {});
      return;
    }
    setDefaultFamily(next);
    AsyncStorage.setItem(FAMILY_STORAGE_KEY, next).catch(() => {});
  }

  function updateCustomTheme(next: CustomThemeConfig) {
    setCustomThemeState(next);
    AsyncStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }

  function updateFontChoice(next: FontChoiceId) {
    if (active) {
      setActive({ ...active, fontChoice: next });
      updateCharacter(active.id, { fontChoice: next }).catch(() => {});
      return;
    }
    setDefaultFontChoice(next);
    AsyncStorage.setItem(FONT_STORAGE_KEY, next).catch(() => {});
  }

  const family: ThemeFamilyId = active?.themeFamily ?? defaultFamily;
  const fontChoice: FontChoiceId = active?.fontChoice ?? defaultFontChoice;

  const resolvedMode: ThemeMode =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const theme = useMemo<Theme>(
    () => resolveTheme(family, resolvedMode, fontChoice, customTheme),
    [family, resolvedMode, fontChoice, customTheme]
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
      defaultFamily,
      defaultFontChoice,
      setActiveCharacter,
      activeCharacterId: active?.id ?? null,
      activeCharacterName: active?.name ?? null,
      customTheme,
      setCustomTheme: updateCustomTheme,
    }),
    [theme, preference, family, fontChoice, defaultFamily, defaultFontChoice, active, customTheme]
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
