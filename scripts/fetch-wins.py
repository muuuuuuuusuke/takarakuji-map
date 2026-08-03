#!/usr/bin/env python3
"""宝くじ公式の「高額当せん発生本数確定」ページから、当選売り場を集める。

公式は最新回でページを上書きするため、過去回は Wayback Machine の
スナップショットから拾う。売り場は「※売り場へのヒアリングによる」と
公式が但し書きしているとおり網羅ではない。その旨はサイトにも明記する。

出力: src/data/wins.json
"""
from __future__ import annotations

import json
import re
import time
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "wins.json"
TARGET = "takarakuji-official.jp/special/kougaku-tousen/"
CDX = ("http://web.archive.org/cdx/search/cdx?url=" + TARGET +
       "&output=json&filter=statuscode:200&collapse=digest&limit=60")

PREFS = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県",
"群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県",
"長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県",
"和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県",
"福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"]
PREF_RE = "|".join(PREFS)


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "ignore")


def plain(html: str) -> str:
    t = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", t)


def parse(text: str) -> tuple[str | None, list[dict]]:
    """本文から (くじ名, 当選売り場リスト) を取り出す。"""
    lottery = None
    m = re.search(r"「([^」]{3,24}(?:ジャンボ|ミニ|BIG|LOTO)[^」]{0,8})」", text)
    if m:
        lottery = m.group(1)

    wins = []
    # 「1等7億円はこちらの…」の見出しごとに、後続の表を読む
    for h in re.finditer(r"((?:1等|2等|3等)(?:の前後賞)?)\s*([0-9.]+)\s*億円[^!]{0,24}!(.{0,6000}?)(?=(?:1等|2等|3等)(?:の前後賞)?\s*[0-9.]+\s*億円|※|$)", text):
        rank, oku, body = h.group(1), h.group(2), h.group(3)
        # 「都道府県 組 番号 発売場所」以降の行: 県名 数字 数字 売り場名 市区町村
        for r in re.finditer(rf"({PREF_RE})\s+(\d+)\s+(\d+)\s+(.+?)(?=(?:{PREF_RE})\s+\d+\s+\d+|$)", body):
            pref, kumi, ban, rest = r.groups()
            rest = rest.strip()
            if not rest or len(rest) > 60:
                continue
            # 末尾が市区町村。「○○市××区」まで含めて取る
            mm = re.search(r"^(.*?)\s*([^\s]{2,10}?(?:市[^\s]{0,6}区|市|区|町|村|郡[^\s]{1,8}))$", rest)
            name, city = (mm.group(1).strip(), mm.group(2)) if mm else (rest, "")
            if not name:
                continue
            wins.append({
                "rank": rank, "oku": float(oku), "pref": pref,
                "kumi": kumi, "ban": ban, "shop": name, "city": city,
            })
    return lottery, wins


def main() -> None:
    snaps = json.loads(get(CDX))[1:]
    print(f"スナップショット {len(snaps)}件")

    seen: set[tuple] = set()
    records: list[dict] = []
    rounds: dict[str, dict] = {}

    for row in snaps:
        ts = row[1]
        try:
            html = get(f"http://web.archive.org/web/{ts}id_/https://www.{TARGET}")
        except Exception as e:
            print(f"  {ts}: 取得失敗 {e}")
            continue
        lottery, wins = parse(plain(html))
        added = 0
        for w in wins:
            key = (w["rank"], w["pref"], w["shop"], w["kumi"], w["ban"])
            if key in seen:
                continue
            seen.add(key)
            w["lottery"] = lottery or "不明"
            w["snapshot"] = ts
            records.append(w)
            added += 1
        if lottery and added:
            rounds.setdefault(lottery, {"lottery": lottery, "firstSeen": ts, "count": 0})
            rounds[lottery]["count"] += added
        print(f"  {ts[:8]} {lottery or '?':<16} 新規 {added:3}件")
        time.sleep(1.0)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "source": "宝くじ公式サイト「高額当せん発生本数確定」（Internet Archive のスナップショットを含む）",
        "note": "当せん発生売り場は宝くじ公式による売り場へのヒアリングにもとづく公表分で、全当せんを網羅するものではありません。",
        "rounds": sorted(rounds.values(), key=lambda r: r["firstSeen"]),
        "wins": records,
    }, ensure_ascii=False, separators=(",", ":")) + "\n")
    print(f"\n合計 {len(records)}件 / {len(rounds)}回分 → {OUT}")


if __name__ == "__main__":
    main()
