import type { BackgroundArt } from "./colors";
import type { GearSprite } from "./gearAssets";

export type GearsArt = Extract<BackgroundArt, { kind: "gears" }>;

export type PlacedGear = {
  key: string;
  sprite: GearSprite;
  size: number; // dp
  left: number; // dp, top-left corner within the layer
  top: number;
  startDeg: number; // rotation at t = 0, chosen so teeth interlock with the neighbour
  degPerSec: number; // signed: neighbours turn opposite ways
  opacity: number;
};

export const SEC_PER_REV = 36; // a meshed gear completes a turn in this long
export const LOOP_SECONDS = 3600; // one linear animation run; it restarts hourly

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const rad = (deg: number) => (deg * Math.PI) / 180;
// Seeded so a given page size always yields the same gears (never a fresh roll).
let rand: () => number = Math.random;
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(list: T[]): T => list[Math.floor(rand() * list.length)];

const GAP = 8; // dp of clear space kept between gears that are not meshed

type Circle = { x: number; y: number; r: number };
const clear = (a: Circle, b: Circle) => Math.hypot(a.x - b.x, a.y - b.y) >= a.r + b.r + GAP;

/**
 * Builds chains of gears that really mesh. Every gear in a chain has the same size and
 * tooth count (so equal pitch), sits one pitch-diameter from its neighbour, starts with
 * one gear's tooth facing the other's gap, and turns the opposite way at the same speed.
 * One chain per vertical band so they spread down the page. Meshed neighbours touch on
 * purpose; every other pair of gears (other chains, or non-adjacent in a chain) is kept
 * apart, and a chain that can't be placed clear of the rest is skipped.
 */
export function rollGears(art: GearsArt, width: number, height: number): PlacedGear[] {
  rand = seeded(Math.round(width) * 7919 + Math.round(height) * 31 + art.chains);
  // Only gears with the same size AND tooth count can mesh.
  const groups = new Map<string, GearSprite[]>();
  for (const sprite of art.sprites) {
    const key = `${sprite.width}-${sprite.teeth}`;
    groups.set(key, [...(groups.get(key) ?? []), sprite]);
  }
  const meshable = [...groups.values()].filter((g) => g.length >= 2);

  const gears: PlacedGear[] = [];
  const taken: Circle[] = []; // every gear placed so far, for overlap checks

  for (let c = 0; c < art.chains; c++) {
    for (let attempt = 0; attempt < 40; attempt++) {
      const group = pick(meshable);
      const perChain =
        art.minPerChain + Math.floor(rand() * (art.maxPerChain - art.minPerChain + 1));
      const scale = 3 + rand() * 1.4; // dp per source pixel
      const opacity = 0.34 + rand() * 0.16;
      const speed = (rand() < 0.5 ? 1 : -1) * (360 / SEC_PER_REV);
      const first = pick(group);
      const pitchDeg = 360 / first.teeth;
      // Same size => equal pitch radii, so neighbouring centres are two pitch radii apart.
      const centreDist = (first.tip + first.root) * scale;
      const radius = first.tip * scale;

      // Chain start, inside this chain's vertical band; may poke off either side.
      let x = -0.05 * width + rand() * 0.65 * width;
      let y = ((c + 0.2 + rand() * 0.6) / art.chains) * height;
      // Direction from gear 0 toward gear 1: mostly horizontal so chains read as trains.
      let phi = (rand() < 0.5 ? 0 : 180) + (rand() * 100 - 50);
      let prevPhi = phi;

      const chain: PlacedGear[] = [];
      const circles: Circle[] = [];
      for (let i = 0; i < perChain; i++) {
        const sprite = i === 0 ? first : pick(group);
        let startDeg: number;
        if (i === 0) {
          startDeg = phi - sprite.phase; // a tooth points straight at the next gear
        } else {
          // A gap faces the previous gear: (prevPhi + 180) - phase - half a pitch.
          startDeg = prevPhi + 180 - sprite.phase - pitchDeg / 2;
          // The next gear lies along one of THIS gear's tooth directions, not back at the last gear.
          const target = prevPhi + (rand() * 160 - 80);
          const tooth = norm(startDeg + sprite.phase);
          phi = tooth + Math.round((target - tooth) / pitchDeg) * pitchDeg;
        }
        const size = sprite.width * scale;
        chain.push({
          key: `${c}-${i}`,
          sprite,
          size,
          left: x - size / 2,
          top: y - size / 2,
          startDeg: norm(startDeg),
          degPerSec: i % 2 === 0 ? speed : -speed,
          opacity,
        });
        circles.push({ x, y, r: radius });
        prevPhi = phi;
        x += Math.cos(rad(phi)) * centreDist;
        y += Math.sin(rad(phi)) * centreDist;
      }

      // Reject if any gear overlaps one from another chain, or a non-adjacent one in its own.
      const ok = circles.every(
        (circle, i) =>
          taken.every((other) => clear(circle, other)) &&
          circles.every((other, j) => Math.abs(i - j) < 2 || j <= i || clear(circle, other))
      );
      if (ok) {
        gears.push(...chain);
        taken.push(...circles);
        break;
      }
    }
  }
  return gears;
}

