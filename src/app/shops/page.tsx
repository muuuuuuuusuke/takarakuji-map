import type { Metadata } from "next";
import Link from "next/link";
import { META, PREF_SLUG, SHOPS } from "@/lib/shops";

export const metadata: Metadata = {
  title: "高額当せんが出た売り場の一覧",
  description:
    `ジャンボ宝くじで1億円以上の当せんが公表された全${META.shopCount}売り場を、当せん本数の多い順に並べています。`,
};

export default function ShopsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <h1 className="display text-[clamp(1.6rem,5vw,2.4rem)]">
        高額当せんが出た売り場
      </h1>
      <p className="mt-5 text-[0.8125rem] leading-7 text-ink-soft">
        直近{META.roundCount}回で公表された{META.totalWins}件を、
        {META.shopCount}売り場に名寄せしたものです。本数の多い順。
      </p>

      <ol className="mt-8 border-t border-line">
        {SHOPS.map((s, i) => (
          <li key={`${s.pref}${s.name}`} className="border-b border-line">
            <Link
              href={`/pref/${PREF_SLUG[s.pref]}`}
              className="flex items-baseline gap-3 py-2.5 text-sm transition-colors hover:text-shu"
            >
              <span className="w-7 shrink-0 text-xs tabular-nums text-ink-faint">{i + 1}</span>
              <span className="flex-1">
                {s.name}
                <span className="ml-2 text-xs text-ink-faint">{s.pref}{s.city}</span>
              </span>
              <span className="figure w-12 text-right">{s.wins}</span>
              {s.firstOku > 0 && (
                <span className="hidden w-24 text-right text-xs text-ink-faint sm:block">
                  1等計 {s.firstOku}億
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
