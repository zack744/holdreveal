"""Build eye-catching before/after showcase cards for the homepage."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "examples"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 480, 640


def load_rgb(path: Path, size=(W, H)) -> Image.Image:
    im = Image.open(path).convert("RGB")
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)


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


def on_bg(rgba: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    base = Image.new("RGBA", rgba.size, rgb + (255,))
    return Image.alpha_composite(base, rgba).convert("RGB")


def save_pair(name: str, rgba: Image.Image) -> None:
    w = on_bg(rgba, (255, 255, 255))
    b = on_bg(rgba, (0, 0, 0))
    w.save(OUT / f"case-{name}-before.jpg", quality=90, optimize=True)
    b.save(OUT / f"case-{name}-after.jpg", quality=90, optimize=True)
    print("saved", name, (OUT / f"case-{name}-before.jpg").stat().st_size)


def day_night_pair(base: Image.Image) -> tuple[Image.Image, Image.Image]:
    day = ImageEnhance.Color(base).enhance(1.15)
    day = ImageEnhance.Brightness(day).enhance(1.08)
    night = ImageOps.colorize(
        ImageOps.grayscale(base),
        black=(5, 10, 35),
        white=(180, 200, 255),
    )
    night = ImageEnhance.Brightness(night).enhance(0.85)
    # moon glow
    d = ImageDraw.Draw(night)
    d.ellipse([340, 40, 430, 130], fill=(255, 250, 210))
    d.ellipse([355, 55, 420, 120], fill=(20, 30, 60))
    return day, night


def wings_pair(base: Image.Image) -> tuple[Image.Image, Image.Image]:
    a = base.copy()
    b = base.copy()
    db = ImageDraw.Draw(b)
    # glowing wing shapes
    for box, color in [
        ((20, 120, 180, 480), (255, 230, 120, 180)),
        ((300, 120, 460, 480), (255, 230, 120, 180)),
    ]:
        wing = Image.new("RGBA", b.size, (0, 0, 0, 0))
        ImageDraw.Draw(wing).ellipse(box, fill=color)
        wing = wing.filter(ImageFilter.GaussianBlur(8))
        b = Image.alpha_composite(b.convert("RGBA"), wing).convert("RGB")
    # sparkles on B
    db = ImageDraw.Draw(b)
    for x, y in [(60, 100), (420, 90), (80, 500), (400, 520), (240, 60), (200, 200)]:
        db.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(255, 255, 220))
    return a, b


def sketch_to_color(base: Image.Image) -> tuple[Image.Image, Image.Image]:
    edges = base.convert("L").filter(ImageFilter.FIND_EDGES)
    edges = ImageOps.invert(edges)
    sketch = ImageOps.autocontrast(edges)
    sketch = ImageEnhance.Contrast(sketch).enhance(1.4)
    sketch_rgb = Image.merge("RGB", (sketch, sketch, sketch))
    color = ImageEnhance.Color(base).enhance(1.3)
    color = ImageEnhance.Contrast(color).enhance(1.1)
    return sketch_rgb, color


def silhouette_reveal(base: Image.Image) -> tuple[Image.Image, Image.Image]:
    # A: dark silhouette on light
    gray = ImageOps.grayscale(base)
    sil = gray.point(lambda p: 30 if p < 140 else 245)
    a = Image.merge("RGB", (sil, sil, sil))
    # B: full color vivid
    b = ImageEnhance.Color(base).enhance(1.4)
    b = ImageEnhance.Contrast(b).enhance(1.15)
    return a, b


def make_illustration_pair() -> tuple[Image.Image, Image.Image]:
    """Hand-drawn style character without / with magic effect."""
    a = Image.new("RGB", (W, H), (248, 246, 252))
    b = Image.new("RGB", (W, H), (12, 10, 28))
    da, db = ImageDraw.Draw(a), ImageDraw.Draw(b)

    # character shared pose
    def draw_char(d: ImageDraw.ImageDraw, body, head, accent):
        d.ellipse([170, 90, 310, 240], fill=head)
        d.rounded_rectangle([185, 230, 295, 430], radius=36, fill=body)
        d.rectangle([200, 430, 240, 560], fill=accent)
        d.rectangle([250, 430, 290, 560], fill=accent)
        d.ellipse([200, 140, 230, 170], fill=(40, 40, 50))
        d.ellipse([250, 140, 280, 170], fill=(40, 40, 50))

    draw_char(da, (130, 170, 255), (255, 210, 190), (90, 90, 140))
    draw_char(db, (190, 120, 255), (255, 220, 200), (220, 220, 255))
    # B extras: aura + stars + floating orbs
    for box, col in [
        ((60, 80, 160, 420), (120, 80, 255)),
        ((320, 80, 420, 420), (255, 100, 200)),
    ]:
        db.ellipse(box, outline=col, width=6)
    for x, y, r, col in [
        (90, 160, 18, (255, 240, 120)),
        (390, 200, 14, (120, 255, 220)),
        (70, 480, 12, (255, 160, 200)),
        (410, 460, 16, (180, 220, 255)),
        (240, 50, 10, (255, 255, 255)),
    ]:
        db.ellipse([x - r, y - r, x + r, y + r], fill=col)
    da.text((150, 590), "BEFORE", fill=(100, 100, 120))
    db.text((165, 590), "AFTER", fill=(255, 240, 200))
    return a, b


def main() -> None:
    # 1) real dual sample from open source repo
    dual = OUT / "case-dual-full.png"
    if dual.exists():
        im = Image.open(dual).convert("RGBA")
        im.thumbnail((720, 720), Image.Resampling.LANCZOS)
        # rebuild at fixed size by letterbox
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        x = (W - im.width) // 2
        y = (H - im.height) // 2
        canvas.paste(im, (x, y), im if im.mode == "RGBA" else None)
        save_pair("photo-swap", canvas)

    dual_g = OUT / "case-dual-gray.png"
    if dual_g.exists():
        im = Image.open(dual_g).convert("RGBA")
        im.thumbnail((720, 720), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        x = (W - im.width) // 2
        y = (H - im.height) // 2
        canvas.paste(im, (x, y), im if im.mode == "RGBA" else None)
        save_pair("mono-reveal", canvas)

    # photo-based dramatic pairs
    a1 = load_rgb(OUT / "gen-a1.jpg")
    b1 = load_rgb(OUT / "gen-b1.jpg")
    a2 = load_rgb(OUT / "gen-a2.jpg")
    b2 = load_rgb(OUT / "gen-b2.jpg")
    src01 = load_rgb(OUT / "src-dual-01.jpg") if (OUT / "src-dual-01.jpg").exists() else a1
    src02 = load_rgb(OUT / "src-dual-02.jpg") if (OUT / "src-dual-02.jpg").exists() else b1

    day, night = day_night_pair(src01)
    save_pair("day-night", compose_luma(day, night, 1.05))

    plain, winged = wings_pair(a2)
    save_pair("wings", compose_luma(plain, winged, 1.0))

    sketch, color = sketch_to_color(b2)
    save_pair("sketch-color", compose_luma(sketch, color, 1.0))

    sil, full = silhouette_reveal(a1)
    save_pair("silhouette", compose_luma(sil, full, 1.05))

    # cross-photo dramatic swap (two different pics as A/B)
    save_pair("world-swap", compose_luma(src01, src02, 1.0))

    char_a, char_b = make_illustration_pair()
    save_pair("magic-char", compose_luma(char_a, char_b, 1.0))

    # keep viral previews under consistent names if present
    viral_w = OUT / "case-viral-preview-white.jpg"
    viral_b = OUT / "case-viral-preview-black.jpg"
    if viral_w.exists() and viral_b.exists():
        # normalize size for grid
        for src, dst in [
            (viral_w, OUT / "case-viral-before.jpg"),
            (viral_b, OUT / "case-viral-after.jpg"),
        ]:
            im = ImageOps.fit(Image.open(src).convert("RGB"), (W, H), Image.Resampling.LANCZOS)
            im.save(dst, quality=90, optimize=True)
        print("normalized viral")

    # cleanup bulky intermediates from public (keep previews only)
    for bulky in [
        "case-dual-full.png",
        "case-dual-gray.png",
        "src-dual-01.jpg",
        "src-dual-02.jpg",
        "gen-a1.jpg",
        "gen-b1.jpg",
        "gen-a2.jpg",
        "gen-b2.jpg",
    ]:
        p = OUT / bulky
        if p.exists() and p.stat().st_size > 100_000:
            # keep smaller gens? remove all intermediates
            p.unlink()
            print("removed", bulky)

    print("done. files:")
    for f in sorted(OUT.glob("case-*-*.jpg")):
        print(" ", f.name, f.stat().st_size)


if __name__ == "__main__":
    main()
