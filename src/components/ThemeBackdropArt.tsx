import { useEffect, useMemo, useState } from "react";
import { Animated, Easing, Image, Platform, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { BackgroundArt } from "../theme/colors";
import { LOOP_SECONDS, rollGears, type GearsArt } from "../theme/gearLayout";

// Keep pixel art crisp on web; native scales with the default filter.
const CRISP = Platform.OS === "web" ? ({ imageRendering: "pixelated" } as object) : null;

// One fixed reference canvas: every page (and every screen size) shows the same gears.
// Pages simply reveal more or less of it; the layer clips.
const GEAR_W = 600;
const GEAR_H = 2400;
const BOTTOM_H = 260; // height of the bottom-pinned gear strip
const IS_WEB = Platform.OS === "web";
const SPIN = [{ from: { transform: [{ rotate: "0deg" }] }, to: { transform: [{ rotate: "360deg" }] } }];

function GearLayer({ art }: { art: GearsArt }) {
  const gears = useMemo(() => {
    const top = rollGears(art, GEAR_W, GEAR_H);
    // A three-gear train pinned to the bottom edge, so every page ends on gears too.
    // Rolled on its own short canvas, then shifted down by (page height - strip height)
    // via the `bottom` offset below.
    const strip = rollGears(
      { ...art, chains: 1, minPerChain: 3, maxPerChain: 3 },
      GEAR_W,
      BOTTOM_H
    ).map((g) => ({ ...g, key: `b-${g.key}`, bottomStrip: true }));
    return [...top.map((g) => ({ ...g, bottomStrip: false })), ...strip];
  }, [art]);
  const [clock] = useState(() => new Animated.Value(0));

  // Native: one linear clock (seconds) drives every gear, so meshed gears stay in step.
  // Web: CSS animations do the spinning (see below), so no JS runs per frame.
  useEffect(() => {
    if (IS_WEB) return;
    const loop = Animated.loop(
      Animated.timing(clock, {
        toValue: LOOP_SECONDS,
        duration: LOOP_SECONDS * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [clock]);

  const rotations = useMemo(
    () =>
      gears.map((g) =>
        clock.interpolate({
          inputRange: [0, LOOP_SECONDS],
          outputRange: [`${g.startDeg}deg`, `${g.startDeg + g.degPerSec * LOOP_SECONDS}deg`],
        })
      ),
    [gears, clock]
  );

  return (
    <View pointerEvents="none" style={styles.layer}>
      {gears.map((g, i) => {
        const base = {
          position: "absolute" as const,
          left: g.left,
          ...(g.bottomStrip ? { bottom: BOTTOM_H - g.top - g.size } : { top: g.top }),
          width: g.size,
          height: g.size,
          opacity: g.opacity,
        };
        if (IS_WEB) {
          const speed = Math.abs(g.degPerSec); // deg/s, same for all gears
          const reverse = g.degPerSec < 0;
          // Negative delay jumps the spin to startDeg so teeth interlock.
          const delay = reverse ? -(360 - g.startDeg) / speed : -g.startDeg / speed;
          return (
            <Image
              key={g.key}
              source={g.sprite.source}
              resizeMode="stretch"
              pointerEvents="none"
              style={[
                base,
                CRISP,
                {
                  animationKeyframes: SPIN,
                  animationDuration: `${360 / speed}s`,
                  animationDelay: `${delay}s`,
                  animationIterationCount: "infinite",
                  animationTimingFunction: "linear",
                  animationDirection: reverse ? "reverse" : "normal",
                  pointerEvents: "none",
                } as object,
              ]}
            />
          );
        }
        return (
          <Animated.Image
            key={g.key}
            source={g.sprite.source}
            resizeMode="stretch"
            pointerEvents="none"
            style={[base, { transform: [{ rotate: rotations[i] }] }]}
          />
        );
      })}
    </View>
  );
}

type CastleArt = Extract<BackgroundArt, { kind: "castle" }>;

const CASTLE_SCALE = 3; // dp per source pixel

/** Fills the page with tiled castle wall. */
function CastleLayer({ art }: { art: CastleArt }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const tileW = art.wallSize.width * CASTLE_SCALE;
  const tileH = art.wallSize.height * CASTLE_SCALE;

  const cols = Math.ceil(size.w / tileW);
  const rows = Math.ceil(size.h / tileH);
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <Image
          key={`${r}-${c}`}
          source={art.wall}
          resizeMode="stretch"
          style={[{ position: "absolute", left: c * tileW, top: r * tileH, width: tileW, height: tileH }, CRISP]}
        />
      );
    }
  }

  return (
    <View
      pointerEvents="none"
      style={styles.layer}
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      <View style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}>{tiles}</View>
    </View>
  );
}

/**
 * Scenery layer BEHIND a screen's information. Render it as the first child of a
 * relatively-positioned content wrapper (the wrapper is what it fills). It bleeds out
 * of the screen's 16px padding, ignores touches, and renders nothing for themes
 * without `backgroundArt`.
 */
export function ThemeBackdropArt() {
  const { backgroundArt } = useTheme();
  if (!backgroundArt) return null;

  if (backgroundArt.kind === "bottom") {
    return (
      <View pointerEvents="none" style={styles.layer}>
        <Image
          source={backgroundArt.source}
          resizeMode="stretch"
          style={[styles.bottom, { aspectRatio: backgroundArt.aspectRatio }, CRISP]}
        />
      </View>
    );
  }
  if (backgroundArt.kind === "castle") {
    return <CastleLayer art={backgroundArt} />;
  }
  return <GearLayer art={backgroundArt} />;
}

const styles = StyleSheet.create({
  // Fills the content wrapper and cancels the scroll view's 16px padding so the art
  // reaches the screen edges and the bottom of the scroll area.
  layer: {
    position: "absolute",
    top: 0,
    left: -16,
    right: -16,
    bottom: -16,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: -1,
  },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 0, width: "100%" },
});
