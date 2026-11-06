import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rollforcharacter.dmMode";
const EDITION_STORAGE_KEY = "rollforcharacter.dmEdition";

/**
 * Which D&D edition DM mode shows content from. The values match the
 * `sourceKey` on the seeded monster catalog ("srd-2014" / "srd-2024");
 * "all" shows both. Homebrew content is never filtered out.
 */
export type DmEdition = "all" | "srd-2014" | "srd-2024";

export const DM_EDITION_OPTIONS: { key: DmEdition; label: string }[] = [
  { key: "all", label: "All editions" },
  { key: "srd-2014", label: "5e (2014)" },
  { key: "srd-2024", label: "5e (2024)" },
];

/** True when a catalog entry with this sourceKey should be shown for `edition`. */
export function matchesDmEdition(sourceKey: string, edition: DmEdition): boolean {
  return edition === "all" || sourceKey === edition || sourceKey === "homebrew";
}

type DmModeContextValue = {
  dmMode: boolean;
  setDmMode: (value: boolean) => void;
  dmEdition: DmEdition;
  setDmEdition: (value: DmEdition) => void;
};

const DmModeContext = createContext<DmModeContextValue | null>(null);

export function DmModeProvider({ children }: { children: React.ReactNode }) {
  const [dmMode, setDmModeState] = useState(false);
  const [dmEdition, setDmEditionState] = useState<DmEdition>("all");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "true") setDmModeState(true);
    });
    AsyncStorage.getItem(EDITION_STORAGE_KEY).then((stored) => {
      if (stored === "all" || stored === "srd-2014" || stored === "srd-2024") {
        setDmEditionState(stored);
      }
    });
  }, []);

  function setDmMode(value: boolean) {
    setDmModeState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  function setDmEdition(value: DmEdition) {
    setDmEditionState(value);
    AsyncStorage.setItem(EDITION_STORAGE_KEY, value).catch(() => {});
  }

  return (
    <DmModeContext.Provider value={{ dmMode, setDmMode, dmEdition, setDmEdition }}>
      {children}
    </DmModeContext.Provider>
  );
}

export function useDmMode(): DmModeContextValue {
  const ctx = useContext(DmModeContext);
  if (!ctx) throw new Error("useDmMode must be used within a DmModeProvider");
  return ctx;
}
