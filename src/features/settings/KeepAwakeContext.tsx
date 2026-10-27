import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

const STORAGE_KEY = "rollforcharacter.keepScreenOn";

type KeepAwakeContextValue = {
  keepScreenOn: boolean;
  setKeepScreenOn: (value: boolean) => void;
};

const KeepAwakeContext = createContext<KeepAwakeContextValue | null>(null);

export function KeepAwakeProvider({ children }: { children: React.ReactNode }) {
  const [keepScreenOn, setKeepScreenOnState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "true") setKeepScreenOnState(true);
    });
  }, []);

  useEffect(() => {
    if (keepScreenOn) {
      activateKeepAwakeAsync().catch(() => {});
    } else {
      deactivateKeepAwake();
    }
  }, [keepScreenOn]);

  function setKeepScreenOn(value: boolean) {
    setKeepScreenOnState(value);
    AsyncStorage.setItem(STORAGE_KEY, String(value)).catch(() => {});
  }

  return (
    <KeepAwakeContext.Provider value={{ keepScreenOn, setKeepScreenOn }}>
      {children}
    </KeepAwakeContext.Provider>
  );
}

export function useKeepAwakeSetting(): KeepAwakeContextValue {
  const ctx = useContext(KeepAwakeContext);
  if (!ctx) throw new Error("useKeepAwakeSetting must be used within a KeepAwakeProvider");
  return ctx;
}
