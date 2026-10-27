import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { Asset } from "expo-asset";

// Pixel art: 6 discrete tiers (full -> empty), not a smooth proportional
// fill, so always render one whole frame at an integer scale -- never
// stretch/crop it -- to keep the pixel edges crisp.
//
// The source PNGs are pre-scaled 8x with nearest-neighbor (hard edges, no
// smoothing) up front, to 384x128 native -- RN's <Image> has no
// cross-platform "pixelated" rendering mode, so it always resamples when
// scaling. Feeding it an oversized crisp source means that resampling is a
// *downscale* (which stays sharp) instead of an *upscale* of the original
// tiny 48x16 sprite (which blurs visibly). Re-run this pre-scale if the
// source art changes: NATIVE_WIDTH/HEIGHT below describe the logical size
// for layout math, not the actual file dimensions.
// require() on a local image resolves to a numeric asset module id.
const TIER_FRAMES: number[] = [
  require("../../assets/ui/health-bar/hp_tier_0.png"),
  require("../../assets/ui/health-bar/hp_tier_1.png"),
  require("../../assets/ui/health-bar/hp_tier_2.png"),
  require("../../assets/ui/health-bar/hp_tier_3.png"),
  require("../../assets/ui/health-bar/hp_tier_4.png"),
  require("../../assets/ui/health-bar/hp_tier_5.png"),
];

// Preload + decode every frame once, up front, so switching tiers never
// shows a blank flash while a not-yet-cached local asset decodes.
Asset.loadAsync(TIER_FRAMES).catch(() => {});

const NATIVE_WIDTH = 48;
const NATIVE_HEIGHT = 16;
const MAX_TIER = TIER_FRAMES.length - 1;

function tierForRatio(ratio: number): number {
  if (ratio <= 0) return MAX_TIER;
  if (ratio >= 1) return 0;
  return Math.min(MAX_TIER, Math.round((1 - ratio) * MAX_TIER));
}

export function HealthBar({
  current,
  max,
  scale = 3,
}: {
  current: number;
  max: number;
  scale?: number;
}) {
  const ratio = max > 0 ? current / max : 0;
  const tier = tierForRatio(ratio);

  const [displayedTier, setDisplayedTier] = useState(tier);
  // Lazy useState (not useRef) gives the same create-once stable instance
  // Animated.Value needs, without reading ref.current during render.
  const [fade] = useState(() => new Animated.Value(1));
  const [punch] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (tier === displayedTier) return;
    Animated.timing(fade, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setDisplayedTier(tier);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(punch, { toValue: 1.15, duration: 90, useNativeDriver: true }),
          Animated.timing(punch, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]),
      ]).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const width = NATIVE_WIDTH * scale;
  const height = NATIVE_HEIGHT * scale;

  return (
    <View style={{ width, height }}>
      <Animated.Image
        source={TIER_FRAMES[displayedTier]}
        style={{ width, height, opacity: fade, transform: [{ scale: punch }] }}
        resizeMode="contain"
      />
    </View>
  );
}
