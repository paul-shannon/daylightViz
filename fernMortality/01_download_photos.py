#!/usr/bin/env python3
"""
Step 1: Download and extract SEW101 photos.

Usage options:
  A) From Dropbox zip (run locally where Dropbox is accessible):
       python 01_download_photos.py --dropbox URL

  B) From a local zip file already on disk:
       python 01_download_photos.py --zip /path/to/SEW101-photos.zip

  C) From a GitHub release (if zip is uploaded there):
       python 01_download_photos.py --github-release OWNER/REPO/releases/download/TAG/file.zip

Photos are extracted to ./photos/  with original filenames preserved.
"""

import argparse
import os
import sys
import urllib.request
import zipfile
from pathlib import Path

PHOTOS_DIR = Path(__file__).parent / "photos"


def download_url(url: str, dest: Path) -> None:
    print(f"Downloading {url} ...")
    urllib.request.urlretrieve(url, dest, reporthook=_progress)
    print()


def _progress(block_num, block_size, total_size):
    if total_size > 0:
        pct = block_num * block_size / total_size * 100
        sys.stdout.write(f"\r  {min(pct, 100):.1f}%")
        sys.stdout.flush()


def extract_zip(zip_path: Path) -> None:
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Extracting {zip_path} -> {PHOTOS_DIR} ...")
    with zipfile.ZipFile(zip_path, "r") as zf:
        members = zf.namelist()
        image_members = [m for m in members if m.lower().endswith((".jpg", ".jpeg", ".png"))]
        print(f"  Found {len(image_members)} images in zip (total entries: {len(members)})")
        for i, m in enumerate(image_members, 1):
            # Flatten: put all images directly in PHOTOS_DIR regardless of zip subdirs
            filename = Path(m).name
            dest = PHOTOS_DIR / filename
            with zf.open(m) as src, open(dest, "wb") as dst:
                dst.write(src.read())
            if i % 50 == 0 or i == len(image_members):
                print(f"  Extracted {i}/{len(image_members)}")
    print(f"Done. {len(list(PHOTOS_DIR.glob('*.jp*g')))} images in {PHOTOS_DIR}")


def main():
    ap = argparse.ArgumentParser(description="Download & extract SEW101 photos")
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--dropbox", metavar="URL", help="Dropbox share URL (use ?dl=1 suffix)")
    group.add_argument("--zip", metavar="PATH", help="Path to a local zip file")
    group.add_argument("--github-release", metavar="URL", help="Direct URL to zip in GitHub release")
    args = ap.parse_args()

    tmp_zip = Path("/tmp/SEW101-photos.zip")

    if args.dropbox:
        url = args.dropbox.replace("dl=0", "dl=1")
        download_url(url, tmp_zip)
        extract_zip(tmp_zip)
    elif args.zip:
        extract_zip(Path(args.zip))
    elif args.github_release:
        download_url(args.github_release, tmp_zip)
        extract_zip(tmp_zip)


if __name__ == "__main__":
    main()
