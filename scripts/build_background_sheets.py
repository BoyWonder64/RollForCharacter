"""Bakes the small background tiles into big sheets for ThemeBackdropArt.

A page tiled with 80dp tiles needs ~150-200 <Image> views (per mounted screen);
tiled with one of these 640dp sheets it needs about five. Same art, same scale.

  castle-wall*.png (32px)  -> castle-wall*-sheet.png  (8x8 tiles, 256px)
  desert/sand-*.png (64px) -> desert/sand-sheet.png   (8x8 random tiles, 512px)

Run: python scripts/build_background_sheets.py
"""
from PIL import Image
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = os.path.join(ROOT, "assets", "ui", "backgrounds")
GRID = 8


def sheet(tiles, pick):
    w, h = tiles[0].size
    out = Image.new("RGBA", (w * GRID, h * GRID))
    for r in range(GRID):
        for c in range(GRID):
            out.paste(pick(tiles), (c * w, r * h))
    return out


for name in ("castle-wall", "castle-wall-crimson-light", "castle-wall-torchlight-light"):
    tile = Image.open(os.path.join(BG, f"{name}.png")).convert("RGBA")
    sheet([tile], lambda t: t[0]).save(os.path.join(BG, f"{name}-sheet.png"), optimize=True)

rng = random.Random(9001)  # fixed seed: rebuilding gives the same floor
sand = [Image.open(os.path.join(BG, "desert", f"sand-{i}.png")).convert("RGBA") for i in range(4)]
sheet(sand, rng.choice).save(os.path.join(BG, "desert", "sand-sheet.png"), optimize=True)
print("done")
