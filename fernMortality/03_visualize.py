#!/usr/bin/env python3
"""
Step 3: Aggregate scores and produce mortality visualizations.

Reads ./scores.jsonl produced by 02_score_photos.py and outputs:
  - mortality_by_month.png   — bar chart of mean mortality score by calendar month
  - mortality_by_quarter.png — bar chart of mean mortality score by quarter
  - mortality_timeseries.png — scatter + rolling-mean of all scored photos over time
  - summary.json             — numeric summary for further analysis

Usage:
  python 03_visualize.py
"""

import json
from collections import defaultdict
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

SCORES_FILE = Path(__file__).parent / "scores.jsonl"
OUT_DIR = Path(__file__).parent / "output"

MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

QUARTER_LABELS = ["Q1\n(Jan-Mar)", "Q2\n(Apr-Jun)", "Q3\n(Jul-Sep)", "Q4\n(Oct-Dec)"]

# Palette: green → yellow → orange → red matching health → mortality
MONTH_COLORS = [
    "#2e8b57", "#3aa060", "#4bb563", "#7ec850",   # Jan–Apr (winter/spring green)
    "#c8e050", "#f5e842", "#f5c842", "#f0943a",   # May–Aug (summer, some stress)
    "#e85f2a", "#d94020", "#c23018", "#a82010",   # Sep–Dec (fall/winter die-off)
]


def load_scores() -> list[dict]:
    records = []
    if not SCORES_FILE.exists():
        raise FileNotFoundError(f"{SCORES_FILE} not found. Run 02_score_photos.py first.")
    with open(SCORES_FILE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
                # Only keep records with a valid score and date
                if rec.get("mortality_score") is not None and rec.get("mortality_score") >= 0:
                    if rec.get("month") and rec.get("year"):
                        records.append(rec)
            except json.JSONDecodeError:
                pass
    return records


def monthly_stats(records: list[dict]) -> dict:
    by_month: dict[int, list[float]] = defaultdict(list)
    for r in records:
        by_month[r["month"]].append(r["mortality_score"])
    stats = {}
    for m in range(1, 13):
        vals = by_month.get(m, [])
        stats[m] = {
            "n": len(vals),
            "mean": float(np.mean(vals)) if vals else 0.0,
            "median": float(np.median(vals)) if vals else 0.0,
            "std": float(np.std(vals)) if vals else 0.0,
            "values": vals,
        }
    return stats


def quarterly_stats(records: list[dict]) -> dict:
    by_q: dict[int, list[float]] = defaultdict(list)
    for r in records:
        by_q[r["quarter"]].append(r["mortality_score"])
    stats = {}
    for q in range(1, 5):
        vals = by_q.get(q, [])
        stats[q] = {
            "n": len(vals),
            "mean": float(np.mean(vals)) if vals else 0.0,
            "median": float(np.median(vals)) if vals else 0.0,
            "std": float(np.std(vals)) if vals else 0.0,
        }
    return stats


def plot_monthly(mstats: dict, out_path: Path) -> None:
    months = list(range(1, 13))
    means = [mstats[m]["mean"] for m in months]
    errors = [mstats[m]["std"] for m in months]
    counts = [mstats[m]["n"] for m in months]
    colors = [MONTH_COLORS[m - 1] for m in months]

    fig, ax = plt.subplots(figsize=(13, 6))
    bars = ax.bar(months, means, color=colors, edgecolor="white", linewidth=0.8,
                  yerr=errors, capsize=4, error_kw={"elinewidth": 1.2, "ecolor": "#555"})

    # Annotate each bar with n
    for bar, n in zip(bars, counts):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.15,
                f"n={n}", ha="center", va="bottom", fontsize=8, color="#444")

    ax.set_xticks(months)
    ax.set_xticklabels(MONTH_NAMES, fontsize=11)
    ax.set_ylabel("Mean Mortality Score (0–10)", fontsize=12)
    ax.set_xlabel("Calendar Month", fontsize=12)
    ax.set_title("Sword Fern Mortality by Month — Seward Park SEW101\n(Sept 2022 – present)",
                 fontsize=14, fontweight="bold")
    ax.set_ylim(0, 11)
    ax.yaxis.set_minor_locator(mticker.MultipleLocator(0.5))
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    ax.spines[["top", "right"]].set_visible(False)

    # Shade winter months slightly
    for winter_m in [12, 1, 2]:
        ax.axvspan(winter_m - 0.5, winter_m + 0.5, alpha=0.06, color="blue")

    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    print(f"Saved: {out_path}")
    plt.close(fig)


def plot_quarterly(qstats: dict, out_path: Path) -> None:
    quarters = [1, 2, 3, 4]
    means = [qstats[q]["mean"] for q in quarters]
    errors = [qstats[q]["std"] for q in quarters]
    counts = [qstats[q]["n"] for q in quarters]
    q_colors = ["#4bb563", "#f5c842", "#e85f2a", "#a82010"]

    fig, ax = plt.subplots(figsize=(8, 5))
    bars = ax.bar(quarters, means, color=q_colors, edgecolor="white",
                  yerr=errors, capsize=5, error_kw={"elinewidth": 1.4})

    for bar, n in zip(bars, counts):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.15,
                f"n={n}", ha="center", va="bottom", fontsize=9)

    ax.set_xticks(quarters)
    ax.set_xticklabels(QUARTER_LABELS, fontsize=11)
    ax.set_ylabel("Mean Mortality Score (0–10)", fontsize=12)
    ax.set_title("Sword Fern Mortality by Quarter — SEW101", fontsize=14, fontweight="bold")
    ax.set_ylim(0, 11)
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    print(f"Saved: {out_path}")
    plt.close(fig)


def plot_timeseries(records: list[dict], out_path: Path) -> None:
    from datetime import datetime

    dated = []
    for r in records:
        try:
            dt = datetime.strptime(r["date"], "%Y-%m-%d")
            dated.append((dt, r["mortality_score"]))
        except Exception:
            pass
    if not dated:
        print("No dated records for timeseries — skipping")
        return

    dated.sort(key=lambda x: x[0])
    dates, scores = zip(*dated)

    fig, ax = plt.subplots(figsize=(16, 5))
    ax.scatter(dates, scores, s=18, alpha=0.55, color="#4a7ebf", zorder=3, label="Individual photo")

    # Rolling mean (window = 20 photos)
    win = 20
    if len(scores) >= win:
        rolling = np.convolve(scores, np.ones(win) / win, mode="valid")
        rolling_dates = dates[win // 2: win // 2 + len(rolling)]
        ax.plot(rolling_dates, rolling, color="#d94020", linewidth=2.0,
                label=f"{win}-photo rolling mean", zorder=4)

    ax.set_ylabel("Mortality Score (0–10)", fontsize=12)
    ax.set_xlabel("Photo Date", fontsize=12)
    ax.set_title("Sword Fern Mortality Over Time — Seward Park SEW101", fontsize=14, fontweight="bold")
    ax.set_ylim(-0.5, 10.5)
    ax.grid(linestyle="--", alpha=0.35)
    ax.legend(fontsize=10)
    ax.spines[["top", "right"]].set_visible(False)
    fig.autofmt_xdate()
    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    print(f"Saved: {out_path}")
    plt.close(fig)


def find_peak(mstats: dict) -> tuple[int, float]:
    best_m = max(range(1, 13), key=lambda m: mstats[m]["mean"])
    return best_m, mstats[best_m]["mean"]


def find_peak_quarter(qstats: dict) -> tuple[int, float]:
    best_q = max(range(1, 5), key=lambda q: qstats[q]["mean"])
    return best_q, qstats[best_q]["mean"]


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    records = load_scores()
    print(f"Loaded {len(records)} valid scored photos")

    mstats = monthly_stats(records)
    qstats = quarterly_stats(records)

    plot_monthly(mstats, OUT_DIR / "mortality_by_month.png")
    plot_quarterly(qstats, OUT_DIR / "mortality_by_quarter.png")
    plot_timeseries(records, OUT_DIR / "mortality_timeseries.png")

    peak_m, peak_score = find_peak(mstats)
    peak_q, peak_qscore = find_peak_quarter(qstats)

    summary = {
        "total_photos_scored": len(records),
        "date_range": {
            "earliest": min(r["date"] for r in records),
            "latest": max(r["date"] for r in records),
        },
        "peak_mortality_month": {
            "month": MONTH_NAMES[peak_m - 1],
            "month_number": peak_m,
            "mean_score": round(peak_score, 2),
            "n_photos": mstats[peak_m]["n"],
        },
        "peak_mortality_quarter": {
            "quarter": f"Q{peak_q}",
            "label": QUARTER_LABELS[peak_q - 1].replace("\n", " "),
            "mean_score": round(peak_qscore, 2),
            "n_photos": qstats[peak_q]["n"],
        },
        "monthly_summary": {
            MONTH_NAMES[m - 1]: {
                "mean_score": round(mstats[m]["mean"], 2),
                "n": mstats[m]["n"],
            }
            for m in range(1, 13)
        },
        "quarterly_summary": {
            f"Q{q}": {
                "mean_score": round(qstats[q]["mean"], 2),
                "n": qstats[q]["n"],
            }
            for q in range(1, 5)
        },
    }

    summary_path = OUT_DIR / "summary.json"
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    print(f"Saved: {summary_path}")

    print("\n=== RESULTS ===")
    print(f"Peak mortality month:   {MONTH_NAMES[peak_m - 1]} (mean score {peak_score:.2f}, n={mstats[peak_m]['n']})")
    print(f"Peak mortality quarter: Q{peak_q} ({QUARTER_LABELS[peak_q-1].replace(chr(10),' ')}) "
          f"(mean score {peak_qscore:.2f}, n={qstats[peak_q]['n']})")
    print("\nMonthly breakdown:")
    for m in range(1, 13):
        bar = "█" * int(mstats[m]["mean"])
        print(f"  {MONTH_NAMES[m-1]:>3}  {mstats[m]['mean']:4.2f}  {bar}  (n={mstats[m]['n']})")


if __name__ == "__main__":
    main()
