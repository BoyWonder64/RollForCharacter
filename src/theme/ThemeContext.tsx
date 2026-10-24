import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkTheme, lightTheme, type Theme, type ThemeMode } from "./colors";

export type ThemePreference = ThemeMode | "system";

const STORAGE_KEY = "rollforcharacter.themePreference";

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored);
      }
    });
  }, []);

  function updatePreference(next: ThemePreference) {
    setPreference(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  const resolvedMode: ThemeMode =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

  const theme = resolvedMode === "dark" ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({ theme, preference, setPreference: updatePreference }),
    [theme, preference]
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
