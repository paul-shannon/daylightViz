# Sword Fern Mortality Analysis — SEW101

Analyzes the 630+ photos from Seward Park monitoring station SEW101
(chronolog.io) to find seasonal patterns in sword fern (*Polystichum munitum*)
frond mortality.

## Setup

```bash
cd fernMortality
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run (3 steps)

### Step 1 — Extract photos from the zip

```bash
# From the local zip on your machine:
python 01_download_photos.py --zip ~/github/swordFernMortalityStudies/photos/SEW101-photos.zip

# Or from Dropbox (if accessible):
python 01_download_photos.py --dropbox "https://www.dropbox.com/scl/fi/bglt63ryhqqjtqsnv0700/SEW101-photos.zip?rlkey=...&dl=0"
```

Photos are flattened into `./photos/`.

### Step 2 — Score every photo with Claude's vision API

```bash
# Full run (630+ photos; ~30–60 min depending on rate limits):
python 02_score_photos.py

# Quick test with 10 photos:
python 02_score_photos.py --limit 10

# Resume an interrupted run (skips already-scored photos):
python 02_score_photos.py --resume
```

Each photo gets a **mortality_score 0–10** plus estimated `pct_dead_fronds`.
Results are appended line-by-line to `scores.jsonl` so progress is never lost.

### Step 3 — Visualize

```bash
python 03_visualize.py
```

Outputs to `./output/`:
| File | Description |
|---|---|
| `mortality_by_month.png` | Bar chart: mean mortality score per calendar month |
| `mortality_by_quarter.png` | Bar chart: mean mortality score per quarter |
| `mortality_timeseries.png` | All photos over time + 20-photo rolling mean |
| `summary.json` | Numeric summary + peak month/quarter identification |

## How it works

**Date extraction** — The script first tries EXIF `DateTimeOriginal`. If that
fails it looks for `YYYY-MM-DD` / `YYYYMMDD` patterns in the filename.

**Mortality scoring** — Each image is sent to `claude-opus-4-6` (vision) with
a prompt asking for:
- `mortality_score` (0–10 integer)
- `pct_dead_fronds` (0–100 estimate)
- `health_summary` (one-sentence)
- `confidence` (low / medium / high)
- `notes` (season cues, lighting, occlusion, etc.)

Images where ferns aren't visible (snow, camera blocked, etc.) return
`mortality_score = -1` and are excluded from aggregation.

**Aggregation** — Scores are grouped by calendar month and quarter; mean ±
std is plotted. The month and quarter with the highest mean score are
identified as the **peak mortality period**.

## Cost estimate

~630 photos × ~0.5–1.5 MB each ≈ roughly $5–15 in Claude API vision tokens
(varies by image size and model version).
