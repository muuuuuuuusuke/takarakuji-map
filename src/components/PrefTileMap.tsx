import Link from "next/link";
import { PREF_SLUG, PREF_TILES, winsOfPref } from "@/lib/shops";

const CELL = 46;
const GAP = 4;

/**
 * 都道府県のタイルマップ。
 *
 * 実際の地形図を使うと、面積の大きい北海道が濃く見えるだけで
 * 件数の比較にならない。すべての県を同じ大きさの正方形にして、
 * 地理的な相対位置だけ残す。濃さは公表された当せん件数。
 */
export function PrefTileMap() {
  const max = Math.max(...PREF_TILES.map((t) => winsOfPref(t.pref)));
  const cols = Math.max(...PREF_TILES.map((t) => t.x)) + 1;
  const rows = Math.max(...PREF_TILES.map((t) => t.y)) + 1;

  return (
    <figure className="mt-6">
      <svg
        viewBox={`0 0 ${cols * (CELL + GAP)} ${rows * (CELL + GAP)}`}
        className="w-full"
        role="img"
        aria-label="都道府県別の高額当せん件数"
      >
        {PREF_TILES.map(({ pref, x, y }) => {
          const n = winsOfPref(pref);
          // 0件は塗らない。件数はべき乗で圧縮し、上位1県だけが濃くなるのを避ける
          const t = n === 0 ? 0 : 0.12 + 0.88 * (n / max) ** 0.6;
          return (
            <Link key={pref} href={`/pref/${PREF_SLUG[pref]}`}>
              <g>
                <rect
                  x={x * (CELL + GAP)}
                  y={y * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  fill={n === 0 ? "var(--paper-raised)" : "var(--shu)"}
                  fillOpacity={n === 0 ? 1 : t}
                  stroke="var(--line)"
                />
                <text
                  x={x * (CELL + GAP) + CELL / 2}
                  y={y * (CELL + GAP) + 19}
                  textAnchor="middle"
                  fontSize={11}
                  fill={t > 0.55 ? "#fff" : "var(--ink)"}
                >
                  {pref.replace(/[都府県]$/, "")}
                </text>
                <text
                  x={x * (CELL + GAP) + CELL / 2}
                  y={y * (CELL + GAP) + 36}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill={t > 0.55 ? "#fff" : "var(--ink-soft)"}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {n || "–"}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-xs leading-6 text-ink-faint">
        数字は公表された高額当せんの本数。都道府県は実際の形ではなく、
        位置関係を保った同じ大きさのタイルで並べています（面積の差が
        件数の印象を変えないため）。押すとその県の売り場一覧に移動します。
      </figcaption>
    </figure>
  );
}
