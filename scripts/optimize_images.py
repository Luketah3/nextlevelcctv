"""Resize + recompress JPGs in img/ to web-friendly sizes.

Targets max 1920px on long edge, quality 82, strips EXIF.
Run: python scripts/optimize_images.py
"""
from pathlib import Path
from PIL import Image, ImageOps
import sys

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "img"
MAX_DIM = 1920
QUALITY = 82
SUFFIXES = {".jpg", ".jpeg", ".JPG", ".JPEG"}

total_before = 0
total_after = 0
processed = 0

for path in IMG_DIR.rglob("*"):
    if path.suffix not in SUFFIXES:
        continue
    if "stock" in path.parts:
        continue
    size_before = path.stat().st_size
    try:
        img = Image.open(path)
        img = ImageOps.exif_transpose(img)
        if img.mode != "RGB":
            img = img.convert("RGB")
        w, h = img.size
        if max(w, h) > MAX_DIM:
            img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
        img.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        size_after = path.stat().st_size
        total_before += size_before
        total_after += size_after
        processed += 1
        print(f"  {path.name}: {size_before//1024}KB -> {size_after//1024}KB")
    except Exception as e:
        print(f"  SKIP {path.name}: {e}", file=sys.stderr)

print(f"\nDone. {processed} files. {total_before//1024//1024}MB -> {total_after//1024//1024}MB ({100*(total_before-total_after)//max(total_before,1)}% saved)")
