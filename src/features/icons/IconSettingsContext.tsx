import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_ICON_STYLE, type IconStyleId } from "./iconStyles";

const ENABLED_STORAGE_KEY = "rollforcharacter.iconsEnabled";
const STYLE_STORAGE_KEY = "rollforcharacter.iconStyle";

type IconSettingsContextValue = {
  iconsEnabled: boolean;
  setIconsEnabled: (value: boolean) => void;
  iconStyle: IconStyleId;
  setIconStyle: (value: IconStyleId) => void;
};

const IconSettingsContext = createContext<IconSettingsContextValue | null>(null);

export function IconSettingsProvider({ children }: { children: React.ReactNode }) {
  const [iconsEnabled, setIconsEnabledState] = useState(true);
  const [iconStyle, setIconStyleState] = useState<IconStyleId>(DEFAULT_ICON_STYLE);

  useEffect(() => {
    AsyncStorage.getItem(ENABLED_STORAGE_KEY).then((stored) => {
      if (stored === "false") setIconsEnabledState(false);
    });
    AsyncStorage.getItem(STYLE_STORAGE_KEY).then((stored) => {
      if (stored) setIconStyleState(stored as IconStyleId);
    });
  }, []);

  function setIconsEnabled(value: boolean) {
    setIconsEnabledState(value);
    AsyncStorage.setItem(ENABLED_STORAGE_KEY, String(value)).catch(() => {});
  }

  function setIconStyle(value: IconStyleId) {
    setIconStyleState(value);
    AsyncStorage.setItem(STYLE_STORAGE_KEY, value).catch(() => {});
  }

  return (
    <IconSettingsContext.Provider
      value={{ iconsEnabled, setIconsEnabled, iconStyle, setIconStyle }}
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
