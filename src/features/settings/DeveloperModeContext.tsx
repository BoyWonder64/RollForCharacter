import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { setDiceOverride } from "../dice/diceEngine";

const STORAGE_KEY = "rollforcharacter.developerMode";

type DeveloperModeContextValue = {
  developerMode: boolean;
  setDeveloperMode: (value: boolean) => void;
};

const DeveloperModeContext = createContext<DeveloperModeContextValue | null>(null);

export function DeveloperModeProvider({ children }: { children: React.ReactNode }) {
  const [developerMode, setDeveloperModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "true") setDeveloperModeState(true);
    });
  }, []);

  function setDeveloperMode(value: boolean) {
    setDeveloperModeState(value);
    // Never leave forced dice running once developer mode is off.
    if (!value) setDiceOverride("random");
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <DeveloperModeContext.Provider value={{ developerMode, setDeveloperMode }}>
      {children}
    </DeveloperModeContext.Provider>
  );
}

export function useDeveloperMode(): DeveloperModeContextValue {
  const ctx = useContext(DeveloperModeContext);
  if (!ctx) throw new Error("useDeveloperMode must be used within a DeveloperModeProvider");
  return ctx;
}
