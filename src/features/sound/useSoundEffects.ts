import { useCallback, useEffect, useRef } from "react";
import { useAudioPlayer } from "expo-audio";
import { useSoundSettings } from "../settings/SoundSettingsContext";

// A small CC0 sound pack -- Kenney Casino Audio (kenney.nl, pixel/retro
// style) for the dice throw/land, and two 8-bit stingers from Juhani
// Junkala's "512 Sound Effects" pack for nat20/nat1. All CC0. See
// Settings > Credits.
const SOUND_SOURCES = {
  diceThrow: require("../../../assets/sounds/dice-throw.mp3"),
  diceLand: require("../../../assets/sounds/dice-land.mp3"),
  critNat20: require("../../../assets/sounds/crit-nat20.mp3"),
  critNat1: require("../../../assets/sounds/crit-nat1.mp3"),
} as const;

// Kept well under full volume -- these fire often (every roll) and shouldn't
// compete with whatever else is making noise around the table.
const SOUND_VOLUMES: Record<SoundEffectName, number> = {
  diceThrow: 0.5,
  diceLand: 0.55,
  critNat20: 0.6,
  critNat1: 0.55,
};

export type SoundEffectName = keyof typeof SOUND_SOURCES;

/** Plays short, pre-loaded sound effects, gated on the Settings sound toggle. */
export function useSoundEffects() {
  const { soundEnabled } = useSoundSettings();

  const diceThrow = useAudioPlayer(SOUND_SOURCES.diceThrow);
  const diceLand = useAudioPlayer(SOUND_SOURCES.diceLand);
  const critNat20 = useAudioPlayer(SOUND_SOURCES.critNat20);
  const critNat1 = useAudioPlayer(SOUND_SOURCES.critNat1);

  // Per-sound state: whether the player is already parked at 0 (so play()
  // can fire instantly, in sync with the visual) and the pending rewind timer.
  const state = useRef<Record<string, { ready: boolean; timer?: ReturnType<typeof setTimeout> }>>({});
  useEffect(() => {
    const timers = state.current;
    return () => Object.values(timers).forEach((t) => t.timer && clearTimeout(t.timer));
  }, []);

  return useCallback(
    (name: SoundEffectName) => {
      if (!soundEnabled) return;
      const players = { diceThrow, diceLand, critNat20, critNat1 };

      const rewind = (key: SoundEffectName) => {
        const st = (state.current[key] ??= { ready: true });
        if (st.timer) clearTimeout(st.timer);
        st.timer = undefined;
        st.ready = false;
        const p = players[key];
        p.pause();
        p.seekTo(0)
          .then(() => {
            st.ready = true;
          })
          .catch(() => {});
      };

      // A new roll cuts off whatever is still ringing from the last one.
      if (name === "diceThrow") {
        for (const other of ["diceLand", "critNat20", "critNat1"] as const) {
          if (players[other].playing) rewind(other);
        }
      }

      const player = players[name];
      const st = (state.current[name] ??= { ready: true });
      player.volume = SOUND_VOLUMES[name];
      if (st.timer) clearTimeout(st.timer);

      const start = () => {
        player.play();
        // Rewind shortly after the clip ends so the NEXT play is instant.
        const ms = (player.duration > 0 ? player.duration * 1000 : 1000) + 80;
        st.ready = false;
        st.timer = setTimeout(() => rewind(name), ms);
      };

      if (st.ready && !player.playing) {
        start();
      } else {
        // Still mid-clip (rapid re-roll): restart from 0 once the seek lands.
        player.pause();
        player.seekTo(0).then(start, start);
      }
    },
    [soundEnabled, diceThrow, diceLand, critNat20, critNat1]
  );
}
