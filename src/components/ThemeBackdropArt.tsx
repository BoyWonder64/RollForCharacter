import { memo, useEffect, useMemo, useState } from "react";
import { Animated, Easing, Image, Platform, StyleSheet, View } from "react-native";
import { useIsFocused } from "expo-router";
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

// Memoised: a parent re-render (e.g. switching a sheet tab) must not re-render ~20 gears.
const GearLayer = memo(function GearLayer({
  art,
  active,
  bottomGears,
}: {
  art: GearsArt;
  active: boolean;
  bottomGears: boolean;
}) {
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
    return [...top.map((g) => ({ ...g, bottomStrip: false })), ...(bottomGears ? strip : [])];
  }, [art, bottomGears]);
  const [clock] = useState(() => new Animated.Value(0));

  // Native: one linear clock (seconds) drives every gear, so meshed gears stay in step.
  // Web: CSS animations do the spinning (see below), so no JS runs per frame.
  // Only the visible screen spins: every tab stays mounted, and N screens each
  // animating ~20 gears forever is what made switching feel slow.
  useEffect(() => {
    if (IS_WEB || !active) return;
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
  }, [clock, active]);

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
});

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

type SpecksArt = Extract<BackgroundArt, { kind: "specks" }>;

const SPECK_W = 600;
const SPECK_H = 2400;

const CELL = 5; // dp per blot pixel
const MIN_GAP = 280; // minimum distance between blot centres, dp

type Rect = { left: number; top: number; w: number; h: number };
type Blot = { key: number; alpha: number; white: Rect[]; black: Rect[]; ink: Rect[] };

/** Opaque mix of `fg` over `bg` (hex colors) at `alpha`, so overlapping pieces never show through. */
function mix(fg: string, bg: string, alpha: number): string {
  const ch = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = (i: number) => Math.round(ch(fg, i) * alpha + ch(bg, i) * (1 - alpha)).toString(16).padStart(2, "0");
  return `#${c(0)}${c(1)}${c(2)}`;
}

/** Grow a cell set by one cell in the four directions. */
function dilate(cells: boolean[][]): boolean[][] {
  const n = cells.length;
  return cells.map((row, y) =>
    row.map((on, x) => on || !!cells[y - 1]?.[x] || !!cells[y + 1]?.[x] || !!row[x - 1] || !!row[x + 1])
  ).slice(0, n);
}

/** Merge each row's filled cells into horizontal runs (1dp taller so rows never leave seams). */
function toRects(cells: boolean[][], ox: number, oy: number): Rect[] {
  const out: Rect[] = [];
  cells.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let end = x;
      while (end + 1 < row.length && row[end + 1]) end++;
      out.push({ left: ox + x * CELL, top: oy + y * CELL, w: (end - x + 1) * CELL, h: CELL + 1 });
      x = end + 1;
    }
  });
  return out;
}

/**
 * Pixel-art ink blots: a lumpy, noise-shaped blob plus splatter dots, wrapped in a black
 * then a white outline (outer edge). Fixed seed. Colors are pre-blended with the
 * background into opaque solids, so the fill is one flat color with no seams or overlap lines.
 */
const SpeckLayer = memo(function SpeckLayer({ art }: { art: SpecksArt }) {
  const { colors } = useTheme();
  const dark = parseInt(colors.background.slice(1, 3), 16) < 0x80;
  const ink = dark ? "#9A7650" : "#6B4423";
  const blots = useMemo(() => {
    let s = 1337;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    const out: Blot[] = [];
    const centres: { x: number; y: number }[] = [];
    for (let b = 0; b < art.count; b++) {
      // Base radius in cells: 5..13 rolled, then compressed so mid and large blots run smaller.
      const R = [5, 5, 6, 6, 7, 8, 9, 9, 10][Math.floor(rand() * 9)];
      const reach = Math.ceil(R * 1.7) + 4; // room for lobes, splatter and the outline
      const N = reach * 2 + 1;
      const p1 = rand() * 6.28;
      const p2 = rand() * 6.28;
      const p3 = rand() * 6.28;
      const cells = Array.from({ length: N }, () => Array<boolean>(N).fill(false));
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const dx = x - reach;
          const dy = y - reach;
          const ang = Math.atan2(dy, dx);
          const rad = R * (1 + 0.25 * Math.sin(2 * ang + p1) + 0.18 * Math.sin(3 * ang + p2) + 0.1 * Math.sin(5 * ang + p3));
          if (Math.hypot(dx, dy) < rad) cells[y][x] = true;
        }
      }
      const dots = 3 + Math.floor(rand() * 5);
      for (let d = 0; d < dots; d++) {
        const ang = rand() * 6.28;
        const dist = R * 1.25 + 2 + rand() * R * 0.35;
        const cx = Math.round(reach + Math.cos(ang) * dist);
        const cy = Math.round(reach + Math.sin(ang) * dist);
        const big = rand() < 0.3;
        for (let oy = 0; oy < (big ? 2 : 1); oy++)
          for (let ox = 0; ox < (big ? 2 : 1); ox++) if (cells[cy + oy]?.[cx + ox] !== undefined) cells[cy + oy][cx + ox] = true;
      }
      const black = dilate(cells);
      const white = dilate(black);
      // Pick a centre well away from every earlier blot (best of 60 tries), so they never pile up.
      let best = { x: SPECK_W / 2, y: SPECK_H / 2, d: -1 };
      for (let t = 0; t < 60 && best.d < MIN_GAP; t++) {
        const x = 60 + rand() * (SPECK_W - 120);
        const y = 60 + rand() * (SPECK_H - 120);
        const d = centres.reduce((m, c) => Math.min(m, Math.hypot(c.x - x, c.y - y)), Infinity);
        if (d > best.d) best = { x, y, d };
      }
      centres.push(best);
      const ox = Math.round(best.x / CELL) * CELL - reach * CELL;
      const oy = Math.round(best.y / CELL) * CELL - reach * CELL;
      out.push({
        key: b,
        alpha: 0.25 + rand() * 0.2,
        white: toRects(white, ox, oy),
        black: toRects(black, ox, oy),
        ink: toRects(cells, ox, oy),
      });
    }
    return out;
  }, [art.count]);

  const draw = (rects: Rect[], color: string) =>
    rects.map((p, i) => (
      <View key={i} style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, backgroundColor: color }} />
    ));

  return (
    <View pointerEvents="none" style={styles.layer}>
      {blots.map((blot) => (
        <View key={blot.key} style={StyleSheet.absoluteFill}>
          {draw(blot.white, mix("#FFFFFF", colors.background, blot.alpha))}
          {draw(blot.black, mix("#000000", colors.background, blot.alpha))}
          {draw(blot.ink, mix(ink, colors.background, blot.alpha))}
        </View>
      ))}
    </View>
  );
});

/**
 * Scenery layer BEHIND a screen's information. Render it as the first child of a
 * relatively-positioned content wrapper (the wrapper is what it fills). It bleeds out
 * of the screen's 16px padding, ignores touches, and renders nothing for themes
 * without `backgroundArt`.
 */
export function ThemeBackdropArt({ bottomGears = true }: { bottomGears?: boolean } = {}) {
  const { backgroundArt } = useTheme();
  const focused = useIsFocused();
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
  if (backgroundArt.kind === "specks") {
    return <SpeckLayer art={backgroundArt} />;
  }
  return <GearLayer art={backgroundArt} active={focused} bottomGears={bottomGears} />;
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
  },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 0, width: "100%" },
});
