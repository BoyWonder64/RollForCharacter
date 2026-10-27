import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.rollHistoryEnabled";

type RollHistoryContextValue = {
  historyEnabled: boolean;
  setHistoryEnabled: (value: boolean) => void;
};

const RollHistoryContext = createContext<RollHistoryContextValue | null>(null);

export function RollHistoryProvider({ children }: { children: React.ReactNode }) {
  const [historyEnabled, setHistoryEnabledState] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "false") setHistoryEnabledState(false);
    });
  }, []);

  function setHistoryEnabled(value: boolean) {
    setHistoryEnabledState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <RollHistoryContext.Provider value={{ historyEnabled, setHistoryEnabled }}>
      {children}
    </RollHistoryContext.Provider>
  );
}

export function useRollHistorySetting(): RollHistoryContextValue {
  const ctx = useContext(RollHistoryContext);
  if (!ctx) throw new Error("useRollHistorySetting must be used within a RollHistoryProvider");
  return ctx;
}
