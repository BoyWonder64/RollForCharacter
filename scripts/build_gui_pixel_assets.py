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


def banner(sheet_no, box, name, cap):
    """Cut a sprite into left cap / stretchy middle / right cap. The middle is
    taken 1 source pixel wider on each side; the app overlaps the pieces by that
    much so no hairline seam shows between them."""
    sheet = Image.open(
        os.path.join(GUI, "Retro Pixel Ribbons, Banners and Frames 2", f"{sheet_no:02d}.png")
    ).convert("RGBA")
    im = crop_to_content(sheet.crop(box))
    w, h = im.size
    print(name, "source", im.size)
    save(im.crop((0, 0, cap, h)), f"{name}-left.png")
    save(im.crop((cap - 1, 0, w - cap + 1, h)), f"{name}-mid.png")
    save(im.crop((w - cap, 0, w, h)), f"{name}-right.png")


# Journal: Border All 14 (sky blue), plain notched frame (row 1, col 1).
frame(14, 1, 1, "journal-frame.png")
# Ribbon 08 (matching blue): straight ribbon with tails (top banner).
banner(8, (0, 84, 80, 113), "journal-banner", 26)
# 5th sprite on the top row of ribbon sheet 08: rod-ended scroll (section headers).
banner(8, (176, 5, 225, 26), "journal-scroll", 5)
