import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.soundEffectsEnabled";

type SoundSettingsContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
};

const SoundSettingsContext = createContext<SoundSettingsContextValue | null>(null);

export function SoundSettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "false") setSoundEnabledState(false);
    });
  }, []);

  function setSoundEnabled(value: boolean) {
    setSoundEnabledState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <SoundSettingsContext.Provider value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundSettingsContext.Provider>
  );
}

export function useSoundSettings(): SoundSettingsContextValue {
  const ctx = useContext(SoundSettingsContext);
  if (!ctx) throw new Error("useSoundSettings must be used within a SoundSettingsProvider");
  return ctx;
}
