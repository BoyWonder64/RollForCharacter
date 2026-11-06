import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../theme/ThemeContext";
import {
  DEFAULT_ICON_STYLE_PREFERENCE,
  resolveIconStyle,
  type IconStyleId,
  type IconStylePreference,
} from "./iconStyles";

const ENABLED_STORAGE_KEY = "rollforcharacter.iconsEnabled";
const STYLE_STORAGE_KEY = "rollforcharacter.iconStyle";

type IconSettingsContextValue = {
  iconsEnabled: boolean;
  setIconsEnabled: (value: boolean) => void;
  /** The style actually in use (an "auto" preference is already resolved against the theme). */
  iconStyle: IconStyleId;
  iconStylePreference: IconStylePreference;
  setIconStyle: (value: IconStylePreference) => void;
};

const IconSettingsContext = createContext<IconSettingsContextValue | null>(null);

export function IconSettingsProvider({ children }: { children: React.ReactNode }) {
  const [iconsEnabled, setIconsEnabledState] = useState(true);
  const [iconStylePreference, setIconStyleState] = useState<IconStylePreference>(
    DEFAULT_ICON_STYLE_PREFERENCE
  );
  const theme = useTheme();
  const iconStyle = resolveIconStyle(iconStylePreference, theme.family, theme.mode);

  useEffect(() => {
    AsyncStorage.getItem(ENABLED_STORAGE_KEY).then((stored) => {
      if (stored === "false") setIconsEnabledState(false);
    });
    AsyncStorage.getItem(STYLE_STORAGE_KEY).then((stored) => {
      // "shikashi-dark" was removed; stale values fall back to auto.
      if (stored === "auto" || stored === "pixel" || stored === "shikashi") {
        setIconStyleState(stored);
      }
    });
  }, []);

  function setIconsEnabled(value: boolean) {
    setIconsEnabledState(value);
    AsyncStorage.setItem(ENABLED_STORAGE_KEY, String(value)).catch(() => {});
  }

  function setIconStyle(value: IconStylePreference) {
    setIconStyleState(value);
    AsyncStorage.setItem(STYLE_STORAGE_KEY, value).catch(() => {});
  }

  return (
    <IconSettingsContext.Provider
      value={{ iconsEnabled, setIconsEnabled, iconStyle, iconStylePreference, setIconStyle }}
    >
      {children}
    </IconSettingsContext.Provider>
  );
}

export function useIconSettings(): IconSettingsContextValue {
  const ctx = useContext(IconSettingsContext);
  if (!ctx) throw new Error("useIconSettings must be used within an IconSettingsProvider");
  return ctx;
}
