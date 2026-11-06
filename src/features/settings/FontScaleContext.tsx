import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.fontScale";

export const FONT_SCALE_MIN = 0.8;
export const FONT_SCALE_MAX = 1.6;
export const FONT_SCALE_STEP = 0.1;

type FontScaleContextValue = {
  fontScale: number;
  setFontScale: (value: number) => void;
};

// Defaults to a no-op scale so AppText works even outside the provider.
const FontScaleContext = createContext<FontScaleContextValue>({
  fontScale: 1,
  setFontScale: () => {},
});

function clamp(value: number): number {
  const stepped = Math.round(value / FONT_SCALE_STEP) * FONT_SCALE_STEP;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(stepped * 100) / 100));
}

export function FontScaleProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const parsed = stored ? parseFloat(stored) : NaN;
      if (Number.isFinite(parsed)) setFontScaleState(clamp(parsed));
    });
  }, []);

  function setFontScale(value: number) {
    const next = clamp(value);
    setFontScaleState(next);
    AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => {});
  }

  return (
    <FontScaleContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale(): FontScaleContextValue {
  return useContext(FontScaleContext);
}
