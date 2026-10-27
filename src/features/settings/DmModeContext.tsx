import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.dmMode";

type DmModeContextValue = {
  dmMode: boolean;
  setDmMode: (value: boolean) => void;
};

const DmModeContext = createContext<DmModeContextValue | null>(null);

export function DmModeProvider({ children }: { children: React.ReactNode }) {
  const [dmMode, setDmModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "true") setDmModeState(true);
    });
  }, []);

  function setDmMode(value: boolean) {
    setDmModeState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <DmModeContext.Provider value={{ dmMode, setDmMode }}>{children}</DmModeContext.Provider>
  );
}

export function useDmMode(): DmModeContextValue {
  const ctx = useContext(DmModeContext);
  if (!ctx) throw new Error("useDmMode must be used within a DmModeProvider");
  return ctx;
}
