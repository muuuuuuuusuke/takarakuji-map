import Link from "next/link";
import { PrefTileMap } from "@/components/PrefTileMap";
import { META, PREF_SLUG, ROUNDS, topShops } from "@/lib/shops";

export default function Home() {
  const top = topShops(12);
  const head = top[0];

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <p className="label">宝くじ公式の公表分・{META.roundCount}回分を集計</p>
      <h1 className="display mt-3 text-[clamp(1.8rem,5.5vw,2.8rem)]">
        1億円以上が出た売り場は、
        <br />
        どこにあるのか
      </h1>
      <p className="mt-5 max-w-xl text-[0.8125rem] leading-7 text-ink-soft">
        ジャンボ宝くじで高額当せんが出た売り場は、抽せんのたびに公式が実名で公表しています。
        直近{META.roundCount}回分・
        <strong className="font-bold text-ink">{META.totalWins}件</strong>を集めて、
        {META.shopCount}売り場に整理しました。
      </p>

      <PrefTileMap />

      <section className="mt-14">
        <h2 className="display text-xl">当せんが多い売り場</h2>
        <p className="mt-3 text-[0.8125rem] leading-7 text-ink-soft">
          この{META.roundCount}回で、公表された当せん本数が多かった売り場です。
          1等が同じ組・番号で複数の売り場から出るのは、同じ番号が全国の複数ユニットで
          発売されるためです。
        </p>
        <ol className="mt-5 border-t border-line">
          {top.map((s, i) => (
            <li key={`${s.pref}${s.name}`} className="border-b border-line">
              <Link
                href={`/pref/${PREF_SLUG[s.pref]}`}
                className="flex items-baseline gap-3 py-2.5 text-sm transition-colors hover:text-shu"
              >
                <span className="w-6 shrink-0 text-xs tabular-nums text-ink-faint">
                  {i + 1}
                </span>
                <span className="flex-1">
                  {s.name}
                  <span className="ml-2 text-xs text-ink-faint">
                    {s.pref}
                    {s.city}
                  </span>
                </span>
                <span className="figure w-14 text-right">{s.wins}件</span>
                {s.firstOku > 0 && (
                  <span className="hidden w-24 text-right text-xs text-ink-faint sm:block">
                    1等計 {s.firstOku}億
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm">
          <Link href="/shops" className="text-shu underline underline-offset-2">
            {META.shopCount}売り場すべてを見る
          </Link>
        </p>
      </section>

      {/* 数字を見せた直後に、その数字の読み方を置く。ここがこのサイトの立場。 */}
      <section className="perforation mt-14 pt-8">
        <h2 className="display text-xl">
          {head.name}に集中しているのは、なぜか
        </h2>
        <p className="mt-3 text-[0.8125rem] leading-7 text-ink-soft">
          上の表で突出している売り場があります。ただしこれは
          <strong className="font-bold text-ink">
            「その売り場だと当たりやすい」という意味ではありません
          </strong>
          。宝くじの当せん確率は、どこで買っても同じです。番号は発売前に決まっていて、
          売り場が確率に影響する仕組みはありません。
        </p>
        <p className="mt-3 text-[0.8125rem] leading-7 text-ink-soft">
          当せんが集まる売り場に共通しているのは、
          <strong className="font-bold text-ink">売っている枚数が桁違いに多い</strong>
          ことです。たくさん売れば、そのぶん当せん券も出ます。
          行列ができる売り場ほど当せん実績が積み上がり、実績があるからまた行列ができる——
          この循環が「よく当たる売り場」を作っています。
        </p>
        <p className="mt-4 text-sm">
          <Link href="/articles/ataru-uriba" className="text-shu underline underline-offset-2">
            「よく当たる売り場」の正体をくわしく読む
          </Link>
        </p>
      </section>

      <section className="mt-14">
        <p className="label">集計した回</p>
        <ul className="mt-4 border-t border-line">
          {ROUNDS.map((r) => (
            <li
              key={`${r.lottery}${r.firstSeen}`}
              className="flex items-baseline justify-between border-b border-line py-2.5 text-sm"
            >
              <span>{r.lottery}</span>
              <span className="figure text-xs text-ink-faint">{r.count}件</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 text-xs leading-6 text-ink-faint">
        <p className="label mb-3">このデータについて</p>
        <p>
          出典：{META.source}。{META.note}
          そのため、ここに載っていない売り場で当せんが出ていることもあります。
          金額は当せん時点のもので、当せん者が受け取った額とは限りません
          （共同購入などの事情は公表されません）。
        </p>
      </section>
    </main>
  );
}
