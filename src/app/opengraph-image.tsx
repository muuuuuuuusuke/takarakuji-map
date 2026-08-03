import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { META, topShops } from "@/lib/shops";

export const alt = "高額当せん売り場の地図";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(path.join(process.cwd(), "src/og/NotoSansJP-Bold.otf"));
  const top = topShops(3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "#f7f2df", color: "#2b2a24", padding: "66px 80px", fontFamily: "Noto",
        }}
      >
        <div style={{ fontSize: 30, color: "#938f7c", letterSpacing: 2 }}>
          {`宝くじ公式の公表分 ${META.roundCount}回・${META.totalWins}件を集計`}
        </div>
        <div style={{ fontSize: 74, fontWeight: 700, marginTop: 16, lineHeight: 1.25 }}>
          1億円以上が出た売り場は、
        </div>
        <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.25 }}>
          どこにあるのか
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 32, color: "#5d5a4c" }}>
          {top.map((s, i) => (
            <div key={s.name} style={{ display: "flex", marginTop: 8 }}>
              <div style={{ width: 60, color: "#938f7c" }}>{`${i + 1}`}</div>
              <div style={{ width: 620 }}>{s.name}</div>
              <div style={{ color: "#c14330", fontWeight: 700 }}>{`${s.wins}件`}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", fontSize: 26, color: "#938f7c" }}>
          当せん確率は売り場によって変わりません ｜ 高額当せん売り場の地図
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Noto", data: font, weight: 700, style: "normal" }] },
  );
}
