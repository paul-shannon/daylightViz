#!/usr/bin/env python3
"""
Step 2: Score each photo for sword fern mortality using Claude's vision API.

For each image in ./photos/ the script:
  1. Extracts the photo date (from EXIF DateTimeOriginal, then filename patterns)
  2. Sends the image to Claude with a mortality-scoring prompt
  3. Writes one JSON record per photo to ./scores.jsonl

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python 02_score_photos.py [--limit N] [--resume]

Options:
  --limit N   Only process first N images (useful for testing)
  --resume    Skip images already recorded in scores.jsonl
  --model     Claude model to use (default: claude-opus-4-6)
"""

import argparse
import base64
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import anthropic

PHOTOS_DIR = Path(__file__).parent / "photos"
SCORES_FILE = Path(__file__).parent / "scores.jsonl"

MORTALITY_PROMPT = """You are analyzing a photograph of sword ferns (Polystichum munitum) taken at a fixed monitoring station in Seattle's Seward Park (site SEW101).

Your task: estimate the level of visible frond mortality in this image.

Please evaluate the following and respond with ONLY valid JSON (no markdown, no explanation):

{
  "mortality_score": <integer 0-10>,
  "pct_dead_fronds": <integer 0-100>,
  "health_summary": "<one sentence>",
  "confidence": "<low|medium|high>",
  "notes": "<any notable observations about the ferns, season cues, lighting, etc.>"
}

Scoring guide for mortality_score:
  0  = All fronds bright green, completely healthy
  1-2 = Tiny fraction of fronds yellowing/browning; plant clearly healthy
  3-4 = Noticeable dead/dying fronds (10-25%), plant mostly healthy
  5-6 = Significant mortality (25-50%), plant stressed
  7-8 = Majority of fronds dead or dying (50-75%)
  9-10 = Nearly all fronds dead/brown/collapsed; severe die-off

If ferns are not visible (blocked, very dark, snow-covered, etc.), set mortality_score to -1 and explain in notes.
"""


def extract_date(image_path: Path) -> datetime | None:
    """Try to extract photo date from EXIF, then filename patterns."""
    # 1. Try EXIF
    try:
        from PIL import Image
        from PIL.ExifTags import TAGS
        img = Image.open(image_path)
        exif_data = img._getexif()
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "DateTimeOriginal":
                    return datetime.strptime(value, "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass

    # 2. Try common filename patterns
    name = image_path.stem
    patterns = [
        r"(\d{4})[_\-](\d{2})[_\-](\d{2})",           # YYYY-MM-DD or YYYY_MM_DD
        r"(\d{4})(\d{2})(\d{2})[_T\-]",                 # YYYYMMDD
        r"[_\-](\d{4})[_\-](\d{2})[_\-](\d{2})[_\-]",  # _YYYY-MM-DD_
    ]
    for pat in patterns:
        m = re.search(pat, name)
        if m:
            try:
                y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
                if 2020 <= y <= 2030 and 1 <= mo <= 12 and 1 <= d <= 31:
                    return datetime(y, mo, d)
            except ValueError:
                continue

    return None


def encode_image(image_path: Path) -> tuple[str, str]:
    """Return (base64_data, media_type)."""
    suffix = image_path.suffix.lower()
    media_type = "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"
    with open(image_path, "rb") as f:
        data = base64.standard_b64encode(f.read()).decode("utf-8")
    return data, media_type


def score_image(client: anthropic.Anthropic, image_path: Path, model: str) -> dict:
    """Send image to Claude and return parsed score dict."""
    data, media_type = encode_image(image_path)
    response = client.messages.create(
        model=model,
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": data,
                        },
                    },
                    {"type": "text", "text": MORTALITY_PROMPT},
                ],
            }
        ],
    )
    raw = response.content[0].text.strip()
    # Strip any accidental markdown fences
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"```\s*$", "", raw)
    return json.loads(raw)


def load_already_scored() -> set[str]:
    if not SCORES_FILE.exists():
        return set()
    scored = set()
    with open(SCORES_FILE) as f:
        for line in f:
            try:
                rec = json.loads(line)
                scored.add(rec["filename"])
            except Exception:
                pass
    return scored


def main():
    ap = argparse.ArgumentParser(description="Score fern photos with Claude vision API")
    ap.add_argument("--limit", type=int, default=None, help="Max images to process")
    ap.add_argument("--resume", action="store_true", help="Skip already-scored images")
    ap.add_argument("--model", default="claude-opus-4-6", help="Claude model")
    ap.add_argument("--delay", type=float, default=0.5, help="Seconds between API calls")
    args = ap.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        sys.exit("ERROR: Set ANTHROPIC_API_KEY environment variable")

    client = anthropic.Anthropic(api_key=api_key)

    images = sorted(PHOTOS_DIR.glob("*.jp*g")) + sorted(PHOTOS_DIR.glob("*.png"))
    if not images:
        sys.exit(f"No images found in {PHOTOS_DIR}. Run 01_download_photos.py first.")

    already_scored = load_already_scored() if args.resume else set()
    images = [p for p in images if p.name not in already_scored]

    if args.limit:
        images = images[: args.limit]

    print(f"Scoring {len(images)} images (model: {args.model})")
    if already_scored:
        print(f"  Skipping {len(already_scored)} already scored")

    with open(SCORES_FILE, "a") as out:
        for i, img_path in enumerate(images, 1):
            photo_date = extract_date(img_path)
            date_str = photo_date.strftime("%Y-%m-%d") if photo_date else "unknown"
            print(f"[{i:3d}/{len(images)}] {img_path.name} ({date_str}) ... ", end="", flush=True)

            try:
                score = score_image(client, img_path, args.model)
                record = {
                    "filename": img_path.name,
                    "date": date_str,
                    "year": photo_date.year if photo_date else None,
                    "month": photo_date.month if photo_date else None,
                    "quarter": ((photo_date.month - 1) // 3 + 1) if photo_date else None,
                    **score,
                }
                out.write(json.dumps(record) + "\n")
                out.flush()
                print(f"score={score.get('mortality_score', '?')} pct_dead={score.get('pct_dead_fronds', '?')}%")
            except json.JSONDecodeError as e:
                print(f"JSON parse error: {e}")
                record = {
                    "filename": img_path.name,
                    "date": date_str,
                    "error": f"JSON parse error: {e}",
                }
                out.write(json.dumps(record) + "\n")
                out.flush()
            except Exception as e:
                print(f"ERROR: {e}")
                record = {
                    "filename": img_path.name,
                    "date": date_str,
                    "error": str(e),
                }
                out.write(json.dumps(record) + "\n")
                out.flush()

            if i < len(images):
                time.sleep(args.delay)

    print(f"\nDone. Results written to {SCORES_FILE}")


if __name__ == "__main__":
    main()
