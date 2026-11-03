import { useCallback } from "react";
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

  return useCallback(
    (name: SoundEffectName) => {
      if (!soundEnabled) return;
      const player = { diceThrow, diceLand, critNat20, critNat1 }[name];
      player.volume = SOUND_VOLUMES[name];
      // Chained rather than fire-and-forget: seekTo() is async, and calling
      // play() before it resolves can replay from a stale position (audible
      // as a clipped/garbled blip) if this sound is still finishing up from
      // the previous trigger.
      player.seekTo(0).then(() => player.play());
    },
    [soundEnabled, diceThrow, diceLand, critNat20, critNat1]
  );
}
