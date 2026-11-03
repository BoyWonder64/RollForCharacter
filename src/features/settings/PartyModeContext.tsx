import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.partyMode";

type PartyModeContextValue = {
  partyMode: boolean;
  setPartyMode: (value: boolean) => void;
};

const PartyModeContext = createContext<PartyModeContextValue | null>(null);

/**
 * Party mode is a paid feature (cross-device party sync + DM review) --
 * this context only persists the on/off switch, mirroring `DmModeContext`.
 * It does not itself enforce the paywall; `SettingsScreen` shows the
 * "premium" notice before flipping it on. Wiring real purchase/entitlement
 * gating here is a separate follow-up once IAP infrastructure exists.
 */
export function PartyModeProvider({ children }: { children: React.ReactNode }) {
  const [partyMode, setPartyModeState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "true") setPartyModeState(true);
    });
  }, []);

  function setPartyMode(value: boolean) {
    setPartyModeState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <PartyModeContext.Provider value={{ partyMode, setPartyMode }}>
      {children}
    </PartyModeContext.Provider>
  );
}

export function usePartyMode(): PartyModeContextValue {
  const ctx = useContext(PartyModeContext);
  if (!ctx) throw new Error("usePartyMode must be used within a PartyModeProvider");
  return ctx;
}
