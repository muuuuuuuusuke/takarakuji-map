#!/usr/bin/env python3
"""fetch-wins.py の生データを、サイトが使う形に整える。

売り場名は公式の表記に揺れがある（「西銀座チャンスセンター」と
「西銀座 チャンスセンター」など）ので、空白と全半角を潰した
キーで名寄せする。表示名は最も長い表記を採る。

「特定できず」は公式が売り場を特定できなかった当せんで、
売り場ランキングからは外し、都道府県の集計にだけ残す。
"""
from __future__ import annotations

import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data" / "wins.json"
OUT = ROOT / "src" / "data" / "shops.json"

UNKNOWN = "特定できず"


def norm(name: str) -> str:
    s = unicodedata.normalize("NFKC", name)
    return re.sub(r"[\s　・（）()]+", "", s)


def main() -> None:
    raw = json.loads(SRC.read_text())
    wins = raw["wins"]

    shops: dict[tuple[str, str], dict] = {}
    pref_counts: Counter[str] = Counter()
    pref_unknown: Counter[str] = Counter()

    for w in wins:
        pref_counts[w["pref"]] += 1
        if UNKNOWN in w["shop"]:
            pref_unknown[w["pref"]] += 1
            continue
        key = (w["pref"], norm(w["shop"]))
        s = shops.setdefault(key, {
            "pref": w["pref"], "names": [], "city": w["city"],
            "wins": 0, "first": 0.0, "rounds": set(), "detail": [],
        })
        s["names"].append(w["shop"])
        s["wins"] += 1
        if w["rank"] == "1等":
            s["first"] += w["oku"]
        s["rounds"].add(w["lottery"])
        s["detail"].append({
            "lottery": w["lottery"], "rank": w["rank"], "oku": w["oku"],
        })
        if len(w["city"]) > len(s["city"]):
            s["city"] = w["city"]

    rows = []
    for s in shops.values():
        # 表示名は最長表記（略記より情報が多い）
        name = max(s["names"], key=len)
        rows.append({
            "pref": s["pref"], "name": name, "city": s["city"],
            "wins": s["wins"], "firstOku": round(s["first"], 1),
            "rounds": sorted(s["rounds"]), "detail": s["detail"],
        })
    rows.sort(key=lambda r: (-r["wins"], -r["firstOku"]))

    out = {
        "source": raw["source"],
        "note": raw["note"],
        "rounds": raw["rounds"],
        "totalWins": len(wins),
        "prefCounts": dict(pref_counts),
        "prefUnknown": dict(pref_unknown),
        "shops": rows,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n")

    print(f"売り場 {len(rows)}件 / 当せん {len(wins)}件 → {OUT.name}")
    print("\n■ 名寄せ後の上位10売り場")
    for r in rows[:10]:
        print(f"  {r['wins']:2}件 1等計{r['firstOku']:5.1f}億  {r['pref']} {r['name']}（{r['city']}）")
    print(f"\n■ 売り場が特定できなかった当せん: {sum(pref_unknown.values())}件")


if __name__ == "__main__":
    main()
