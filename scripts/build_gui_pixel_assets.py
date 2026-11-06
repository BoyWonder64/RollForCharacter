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


def banner(sheet_no, box, name, cap, brightness=None):
    """Cut a sprite into left cap / stretchy middle / right cap. The middle is
    taken 1 source pixel wider on each side; the app overlaps the pieces by that
    much so no hairline seam shows between them."""
    sheet = Image.open(
        os.path.join(GUI, "Retro Pixel Ribbons, Banners and Frames 2", f"{sheet_no:02d}.png")
    ).convert("RGBA")
    im = crop_to_content(sheet.crop(box))
    r, g, b, a = im.split()
    r, g, b = (c.point(lambda v: int(v * (BANNER_BRIGHTNESS if brightness is None else brightness))) for c in (r, g, b))
    im = Image.merge("RGBA", (r, g, b, a))
    w, h = im.size
    print(name, "source", im.size)
    save(im.crop((0, 0, cap, h)), f"{name}-left.png")
    save(im.crop((cap - 1, 0, w - cap + 1, h)), f"{name}-mid.png")
    save(im.crop((w - cap, 0, w, h)), f"{name}-right.png")


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

# manuscript: Border All 9 + ribbons 11.
frame(9, 1, 1, "manuscript-frame.png")
banner(11, RIBBON_BOX, "manuscript-banner", 26)
banner(11, SCROLL_BOX, "manuscript-scroll", 5)

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

# shadow: Border All 13 + ribbons 12.
frame(13, 1, 1, "shadow-frame.png")
banner(12, RIBBON_BOX, "shadow-banner", 26, FULL_BRIGHT)
banner(12, SCROLL_BOX, "shadow-scroll", 5, FULL_BRIGHT)

# western: Border All 11 + ribbons 17.
frame(11, 1, 1, "western-frame.png")
banner(17, RIBBON_BOX, "western-banner", 26, FULL_BRIGHT)
banner(17, SCROLL_BOX, "western-scroll", 5, FULL_BRIGHT)

# galaxy: Border All 10 + ribbons 05.
frame(10, 1, 1, "galaxy-frame.png")
banner(5, RIBBON_BOX, "galaxy-banner", 26)
banner(5, SCROLL_BOX, "galaxy-scroll", 5)
