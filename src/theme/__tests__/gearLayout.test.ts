import { rollGears } from "../gearLayout";
import { GEAR_SPRITES } from "../gearAssets";

const art = { kind: "gears" as const, sprites: GEAR_SPRITES, chains: 6, minPerChain: 2, maxPerChain: 3 };

describe("rollGears", () => {
  it("never overlaps gears that are not meshed, and meshes neighbours at pitch distance", () => {
    for (let run = 0; run < 300; run++) {
      const width = 360 + Math.random() * 100;
      const height = 800 + Math.random() * 2500;
      const gears = rollGears(art, width, height);
      expect(gears.length).toBeGreaterThan(0);
      const centre = (g: (typeof gears)[number]) => ({
        x: g.left + g.size / 2,
        y: g.top + g.size / 2,
        r: (g.sprite.tip / g.sprite.width) * g.size,
        chain: g.key.split("-")[0],
        idx: Number(g.key.split("-")[1]),
        pitch: ((g.sprite.tip + g.sprite.root) / 2 / g.sprite.width) * g.size,
      });
      const cs = gears.map(centre);
      for (let i = 0; i < cs.length; i++) {
        for (let j = i + 1; j < cs.length; j++) {
          const d = Math.hypot(cs[i].x - cs[j].x, cs[i].y - cs[j].y);
          const sameChain = cs[i].chain === cs[j].chain;
          if (sameChain && Math.abs(cs[i].idx - cs[j].idx) === 1) {
            // meshed pair: centres exactly two pitch radii apart
            expect(d).toBeCloseTo(cs[i].pitch + cs[j].pitch, 3);
          } else {
            expect(d).toBeGreaterThanOrEqual(cs[i].r + cs[j].r);
          }
        }
      }
    }
  });
});
