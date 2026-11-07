"""Slices the bdragon1727 GUI pack (pixel assets/Second Icon Set/GUI) into the
PNGs used by the PixelFrame / PixelBanner components.

Every output is baked at BAKE x with nearest-neighbour. The phone then only
scales it by a small factor, so pixel edges stay crisp instead of being
smeared by bilinear upscaling of a tiny sprite.

Run: python scripts/build_gui_pixel_assets.py
"""
from PIL import Image, ImageDraw
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUI = os.path.join(ROOT, "pixel assets", "Second Icon Set", "GUI")
OUT = os.path.join(ROOT, "assets", "ui", "pixel-gui")
BAKE = 4
# Banners (ribbon + scroll) are multiplied by this brightness; 1.0 = original art.
# Alpha is untouched and the black outlines stay black.
BANNER_BRIGHTNESS = 0.7
# Banner text is black everywhere, so fills must stay light enough for it
# (>= 4.5:1). These themes' ribbons are too dark at 0.7 and bake at full brightness.
FULL_BRIGHT = 1.0
# Dark-mode banners are baked much darker so white text reads on them.
DARK_BRIGHTNESS = 0.4
os.makedirs(OUT, exist_ok=True)


def crop_to_content(im):
    return im.crop(im.getchannel("A").getbbox())


def save(im, name):
    im.resize((im.width * BAKE, im.height * BAKE), Image.NEAREST).save(os.path.join(OUT, name))
    print(name, im.size, "x", BAKE)


def hollow_centre(im):
    """The pack's panels are opaque dark; knock the interior out to transparent."""
    w, h = im.size
    marker = (255, 0, 255, 255)
    work = im.copy()
    ImageDraw.floodfill(work, (w // 2, h // 2), marker, thresh=40)
    px, src = work.load(), im.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == marker:
                src[x, y] = (0, 0, 0, 0)
    return im


def frame(sheet_no, row, col, name):
    sheet = Image.open(
        os.path.join(GUI, "Custom Border and Panels Menu All Part", f"Border All {sheet_no}.png")
    ).convert("RGBA")
    cell = sheet.crop((col * 64, row * 64, col * 64 + 64, row * 64 + 64))
    save(hollow_centre(crop_to_content(cell)), name)


def _tint(im, factor):
    r, g, b, a = im.split()
    r, g, b = (c.point(lambda v: int(v * factor)) for c in (r, g, b))
    return Image.merge("RGBA", (r, g, b, a))


def _save_parts(im, name, cap):
    w, h = im.size
    save(im.crop((0, 0, cap, h)), f"{name}-left.png")
    save(im.crop((cap - 1, 0, w - cap + 1, h)), f"{name}-mid.png")
    save(im.crop((w - cap, 0, w, h)), f"{name}-right.png")


def banner(sheet_no, box, name, cap, brightness=None):
    """Cut a sprite into left cap / stretchy middle / right cap, in a light-mode
    version (`name`) and a darker one (`name-dark`) for white text in dark mode.
    The middle is taken 1 source pixel wider on each side; the app overlaps the
    pieces by that much so no hairline seam shows between them."""
    sheet = Image.open(
        os.path.join(GUI, "Retro Pixel Ribbons, Banners and Frames 2", f"{sheet_no:02d}.png")
    ).convert("RGBA")
    raw = crop_to_content(sheet.crop(box))
    print(name, "source", raw.size)
    _save_parts(_tint(raw, BANNER_BRIGHTNESS if brightness is None else brightness), name, cap)
    _save_parts(_tint(raw, DARK_BRIGHTNESS), f"{name}-dark", cap)


RIBBON_BOX = (0, 84, 80, 113)  # straight ribbon with tails (top banner)
SCROLL_BOX = (176, 5, 225, 26)  # 5th sprite on the top row: rod-ended scroll (headers)

# Journal: Border All 14 (sky blue) + ribbons 08 (blue).
frame(14, 1, 1, "journal-frame.png")
banner(8, RIBBON_BOX, "journal-banner", 26)
banner(8, SCROLL_BOX, "journal-scroll", 5)

# Crimson: Border All 7 (dusty rose, dark) + ribbons 16 (muted salmon).
frame(7, 1, 1, "crimson-frame.png")
banner(16, RIBBON_BOX, "crimson-banner", 26)
banner(16, SCROLL_BOX, "crimson-scroll", 5)

# forest: Border All 12 + ribbons 15.
frame(12, 1, 1, "forest-frame.png")
banner(15, RIBBON_BOX, "forest-banner", 26)
banner(15, SCROLL_BOX, "forest-scroll", 5)

# torchlight: Border All 6 + ribbons 14.
frame(6, 1, 1, "torchlight-frame.png")
banner(14, RIBBON_BOX, "torchlight-banner", 26)
banner(14, SCROLL_BOX, "torchlight-scroll", 5)

# steampunk: Border All 1 + ribbons 13.
frame(1, 1, 1, "steampunk-frame.png")
banner(13, RIBBON_BOX, "steampunk-banner", 26)
banner(13, SCROLL_BOX, "steampunk-scroll", 5)

# scifi: Border All 3 + ribbons 06.
frame(3, 1, 1, "scifi-frame.png")
banner(6, RIBBON_BOX, "scifi-banner", 26)
banner(6, SCROLL_BOX, "scifi-scroll", 5)

# darkmagic (the purple, former "Shadow"): Border All 13 + ribbons 12.
frame(13, 1, 1, "darkmagic-frame.png")
banner(12, RIBBON_BOX, "darkmagic-banner", 26, FULL_BRIGHT)
banner(12, SCROLL_BOX, "darkmagic-scroll", 5, FULL_BRIGHT)

# shadow (thief, grey): Border All 5 + ribbons 09.
frame(5, 1, 1, "shadow-frame.png")
banner(9, RIBBON_BOX, "shadow-banner", 26)
banner(9, SCROLL_BOX, "shadow-scroll", 5)

# water (all blue): Border All 14 (sky blue) + ribbons 08.
frame(14, 1, 1, "water-frame.png")
banner(8, RIBBON_BOX, "water-banner", 26)
banner(8, SCROLL_BOX, "water-scroll", 5)

# western: Border All 11 + ribbons 17.
frame(11, 1, 1, "western-frame.png")
banner(17, RIBBON_BOX, "western-banner", 26, FULL_BRIGHT)
banner(17, SCROLL_BOX, "western-scroll", 5, FULL_BRIGHT)

# galaxy (gold): Border All 1 (amber) + ribbons 01 (yellow).
frame(1, 1, 1, "galaxy-frame.png")
banner(1, RIBBON_BOX, "galaxy-banner", 26, FULL_BRIGHT)
banner(1, SCROLL_BOX, "galaxy-scroll", 5, FULL_BRIGHT)


# Custom theme: every border colour (1-16) and every ribbon colour (1-18), at full
# brightness (banner text is black), so the user can mix any border with any banner.
# A generated TS map (src/theme/customPixelAssets.ts) lets the app require them.
CUSTOM_DIR = "custom"
os.makedirs(os.path.join(OUT, CUSTOM_DIR), exist_ok=True)
for n in range(1, 17):
    frame(n, 1, 1, f"{CUSTOM_DIR}/frame-{n}.png")
for n in range(1, 19):
    banner(n, RIBBON_BOX, f"{CUSTOM_DIR}/ribbon-{n}", 26, FULL_BRIGHT)
    banner(n, SCROLL_BOX, f"{CUSTOM_DIR}/scroll-{n}", 5, FULL_BRIGHT)

ts = ["// GENERATED by scripts/build_gui_pixel_assets.py -- do not edit.",
      'import type { ImageSourcePropType } from "react-native";', "",
      "export type CustomBannerParts = { left: ImageSourcePropType; mid: ImageSourcePropType; right: ImageSourcePropType };", "",
      "export const CUSTOM_FRAMES: Record<number, ImageSourcePropType> = {"]
for n in range(1, 17):
    ts.append(f'  {n}: require("../../assets/ui/pixel-gui/{CUSTOM_DIR}/frame-{n}.png"),')
ts.append("};")
for kind in ("ribbon", "scroll"):
    for dark in (False, True):
        suffix = "-dark" if dark else ""
        ts += ["", f"export const CUSTOM_{kind.upper()}S{'_DARK' if dark else ''}: Record<number, CustomBannerParts> = {{"]
        for n in range(1, 19):
            ts.append(f"  {n}: {{")
            for part in ("left", "mid", "right"):
                ts.append(f'    {part}: require("../../assets/ui/pixel-gui/{CUSTOM_DIR}/{kind}-{n}{suffix}-{part}.png"),')
            ts.append("  },")
        ts.append("};")
with open(os.path.join(ROOT, "src", "theme", "customPixelAssets.ts"), "w") as fh:
    fh.write(chr(10).join(ts) + chr(10))


import math


def analyse_gear(im):
    """Tooth count, tooth phase (degrees, clockwise from +x, modulo one tooth pitch), and tip /
    root radii in source pixels -- what the app needs to mesh gears so teeth interlock."""
    w, h = im.size
    cx, cy = (w - 1) / 2, (h - 1) / 2
    alpha = im.getchannel("A").load()
    n = 720
    bound = []
    for i in range(n):
        a = 2 * math.pi * i / n
        best, r = 0.0, 0.0
        while r < w / 2 + 1:
            xi, yi = int(round(cx + r * math.cos(a))), int(round(cy + r * math.sin(a)))
            if 0 <= xi < w and 0 <= yi < h and alpha[xi, yi] > 128:
                best = r
            r += 0.25
        bound.append(best)
    tip, root = max(bound), min(bound)
    above = [b > (tip + root) / 2 for b in bound]
    starts = [i for i in range(n) if above[i] and not above[i - 1]]
    teeth = len(starts)
    centres = []
    for st in starts:
        e = st
        while above[(e + 1) % n] and e - st < n:
            e += 1
        centres.append(((st + e) / 2) % n * 360 / n)
    pitch = 360 / teeth
    phase = sum(c % pitch for c in centres) / len(centres)
    return teeth, round(phase, 1), round(tip, 1), round(root, 1)


# Steampunk gears (pixel assets/Gears): frame 00 of each of the 11 gears in bronze and
# silver, baked like everything else. A generated map (src/theme/gearAssets.ts) lets the
# app require them; sizes are in source pixels so the app can scale them.
GEAR_SRC = os.path.join(ROOT, "pixel assets", "Gears", "Cog Wheels - Gears", "Sprites")
GEAR_OUT = os.path.join(ROOT, "assets", "ui", "gears")
os.makedirs(GEAR_OUT, exist_ok=True)
gear_entries = []
for metal, folder in (("bronze", "Bronze Gear Wheels"), ("silver", "Silver Gear Wheels")):
    for n in range(1, 12):
        src = Image.open(os.path.join(GEAR_SRC, folder, f"Gear {n} - {metal.capitalize()}_00.png")).convert("RGBA")
        src = crop_to_content(src)
        src.resize((src.width * BAKE, src.height * BAKE), Image.NEAREST).save(
            os.path.join(GEAR_OUT, f"{metal}-{n}.png")
        )
        gear_entries.append((metal, n, src.width, src.height, analyse_gear(src)))
lines = [
    "// GENERATED by scripts/build_gui_pixel_assets.py -- do not edit.",
    'import type { ImageSourcePropType } from "react-native";',
    "",
    "/**",
    " * Width/height/tip/root are in source pixels (the PNG itself is baked larger).",
    " * `phase` is the angle (deg, clockwise from +x) of a tooth centre modulo one pitch.",
    " */",
    "export type GearSprite = {",
    "  source: ImageSourcePropType; width: number; height: number;",
    "  teeth: number; phase: number; tip: number; root: number;",
    "};",
    "",
    "export const GEAR_SPRITES: GearSprite[] = [",
]
for metal, n, w, h, (teeth, phase, tip, root) in gear_entries:
    lines.append(
        f'  {{ source: require("../../assets/ui/gears/{metal}-{n}.png"), width: {w}, height: {h}, '
        f"teeth: {teeth}, phase: {phase}, tip: {tip}, root: {root} }},"
    )
lines.append("];")
with open(os.path.join(ROOT, "src", "theme", "gearAssets.ts"), "w") as fh:
    fh.write(chr(10).join(lines) + chr(10))
print("gears:", len(gear_entries))
