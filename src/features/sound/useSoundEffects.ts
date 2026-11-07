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
  const state = useRef<Record<string, { ready: boolean; played?: boolean; timer?: ReturnType<typeof setTimeout> }>>({});
  useEffect(() => {
    const timers = state.current;
    return () => Object.values(timers).forEach((t) => t.timer && clearTimeout(t.timer));
  }, []);

  // Warm-up: a player's very first play() often produces nothing (the native
  // pipeline is only fully primed by the first play). Do that first play
  // silently at mount so the user's first real roll is already a "second" play.
  useEffect(() => {
    const all = [diceThrow, diceLand, critNat20, critNat1];
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    all.forEach((p) => {
      let attempts = 0;
      const tryWarm = () => {
        if (cancelled) return;
        if (!p.isLoaded) {
          if (attempts++ < 80) timers.push(setTimeout(tryWarm, 50));
          return;
        }
        try {
          if (__DEV__) console.log(`[sfx] warm-up play loaded=${p.isLoaded} dur=${p.duration}`);
          p.volume = 0;
          p.play();
          timers.push(
            setTimeout(() => {
              try {
                p.pause();
                p.seekTo(0).catch(() => {});
              } catch {}
            }, 60)
          );
        } catch {}
      };
      tryWarm();
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const start = (attempt = 0) => {
        // The very first play can land before the native player has finished
        // loading its file, in which case play() is silently dropped. Wait
        // (briefly) for it to load instead.
        if (!player.isLoaded && attempt < 40) {
          st.timer = setTimeout(() => start(attempt + 1), 25);
          return;
        }
        if (__DEV__) {
          console.log(
            `[sfx] play ${name} attempt=${attempt} loaded=${player.isLoaded} playing=${player.playing} vol=${player.volume} muted=${player.muted} dur=${player.duration} t=${player.currentTime}`
          );
        }
        player.play();
        st.played = true;
        // Rewind shortly after the clip ends so the NEXT play is instant.
        const ms = (player.duration > 0 ? player.duration * 1000 : 1000) + 80;
        st.ready = false;
        st.timer = setTimeout(() => rewind(name), ms);
      };

      // The very first play of a clip goes through the pause + seekTo(0) path
      // too: that's the path every later play effectively takes (via rewind),
      // and it's the one known to produce sound.
      if (st.ready && st.played && !player.playing) {
        start();
      } else {
        // Still mid-clip (rapid re-roll): restart from 0 once the seek lands.
        player.pause();
        player.seekTo(0).then(() => start(), () => start());
      }
    },
    [soundEnabled, diceThrow, diceLand, critNat20, critNat1]
  );
}
