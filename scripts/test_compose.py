"""Test compose formula (mirrors src/lib/compose.ts) and generate demo assets."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "examples"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 480, 640


def make_a() -> Image.Image:
    im = Image.new("RGB", (W, H), (245, 245, 250))
    d = ImageDraw.Draw(im)
    d.ellipse([170, 80, 310, 220], fill=(255, 200, 180))
    d.rounded_rectangle([190, 220, 290, 420], radius=30, fill=(120, 160, 255))
    d.rectangle([200, 420, 240, 560], fill=(80, 80, 120))
    d.rectangle([250, 420, 290, 560], fill=(80, 80, 120))
    d.text((140, 580), "STATE A (TL)", fill=(60, 60, 80))
    return im


def make_b() -> Image.Image:
    im = Image.new("RGB", (W, H), (10, 10, 20))
    d = ImageDraw.Draw(im)
    d.ellipse([100, 140, 180, 400], fill=(255, 240, 120))
    d.ellipse([300, 140, 380, 400], fill=(255, 240, 120))
    d.ellipse([170, 80, 310, 220], fill=(255, 210, 190))
    d.rounded_rectangle([190, 220, 290, 420], radius=30, fill=(160, 120, 255))
    d.rectangle([200, 420, 240, 560], fill=(200, 200, 255))
    d.rectangle([250, 420, 290, 560], fill=(200, 200, 255))
    for x, y in [(80, 100), (400, 120), (90, 500), (390, 480), (240, 50)]:
        d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(255, 255, 200))
    d.text((130, 580), "STATE B (OPEN)", fill=(255, 255, 200))
    return im


def compose_luma(img_a: Image.Image, img_b: Image.Image, strength: float = 1.0) -> Image.Image:
    a = img_a.convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    b = img_b.convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    pa, pb = a.load(), b.load()
    out = Image.new("RGBA", (W, H))
    po = out.load()
    for y in range(H):
        for x in range(W):
            ar, ag, ab = (c / 255 for c in pa[x, y])
            br, bg, bb = (c / 255 for c in pb[x, y])
            wl = 0.2126 * ar + 0.7152 * ag + 0.0722 * ab
            bl = 0.2126 * br + 0.7152 * bg + 0.0722 * bb
            alpha = max(0.0, min(1.0, (1 - wl + bl) * strength))
            if alpha > 1e-6:
                r = max(0.0, min(1.0, br / alpha))
                g = max(0.0, min(1.0, bg / alpha))
                bch = max(0.0, min(1.0, bb / alpha))
            else:
                r = g = bch = 0.0
            po[x, y] = (int(r * 255), int(g * 255), int(bch * 255), int(alpha * 255))
    return out


def composite_on(bg_rgb: tuple[int, int, int], rgba: Image.Image) -> Image.Image:
    bg = Image.new("RGBA", rgba.size, bg_rgb + (255,))
    return Image.alpha_composite(bg, rgba).convert("RGB")


def main() -> None:
    a, b = make_a(), make_b()
    a.save(OUT / "demo-a.png")
    b.save(OUT / "demo-b.png")
    composed = compose_luma(a, b)
    composed.save(OUT / "demo-composed.png")
    composed.convert("P", palette=Image.ADAPTIVE, colors=256).save(OUT / "demo-composed-png8.png")

    on_white = composite_on((255, 255, 255), composed)
    on_black = composite_on((0, 0, 0), composed)
    on_white.save(OUT / "demo-preview-white.png")
    on_black.save(OUT / "demo-preview-black.png")

    card = Image.new("RGB", (W * 2 + 40, H + 80), (247, 249, 249))
    card.paste(on_white, (10, 50))
    card.paste(on_black, (W + 30, 50))
    d = ImageDraw.Draw(card)
    d.text((10, 15), "White bg (Timeline)", fill=(15, 20, 25))
    d.text((W + 30, 15), "Black bg (Lightbox)", fill=(15, 20, 25))
    card.save(OUT / "demo-compare.png")

    # recon error stats
    wa = list(on_white.getdata())
    aa = list(a.convert("RGB").getdata())
    ba_px = list(on_black.getdata())
    bb = list(b.convert("RGB").getdata())
    err_w = sum(abs(x - y) for p, q in zip(wa, aa) for x, y in zip(p, q)) / (len(wa) * 3)
    err_b = sum(abs(x - y) for p, q in zip(ba_px, bb) for x, y in zip(p, q)) / (len(ba_px) * 3)
    alphas = [p[3] for p in composed.getdata()]
    print(f"mean abs err white vs A: {err_w:.2f}")
    print(f"mean abs err black vs B: {err_b:.2f}")
    print(f"alpha mean: {sum(alphas)/len(alphas):.1f}")
    print("files:")
    for f in sorted(OUT.iterdir()):
        print(f"  {f.name}: {f.stat().st_size}")


if __name__ == "__main__":
    main()
