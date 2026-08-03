import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  META, PREF_SLUG, prefFromSlug, shopsOfPref, winsOfPref,
} from "@/lib/shops";

export function generateStaticParams() {
  return Object.values(PREF_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pref = prefFromSlug(slug);
  if (!pref) return {};
  const n = winsOfPref(pref);
  const shops = shopsOfPref(pref);
  return {
    title: { absolute: `${pref}で高額当せんが出た宝くじ売り場｜${shops.length}か所` },
    description:
      `${pref}では直近${META.roundCount}回のジャンボ宝くじで${n}件の高額当せんが公表され、` +
      `${shops.length}か所の売り場から出ています。売り場名と当せん内容の一覧です。`,
  };
}

export default async function PrefPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pref = prefFromSlug(slug);
  if (!pref) notFound();
  const shops = shopsOfPref(pref);
  const n = winsOfPref(pref);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <nav className="text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink">全国</Link>
        <span className="mx-1.5">/</span>
        {pref}
      </nav>

      <h1 className="display mt-4 text-[clamp(1.6rem,5vw,2.4rem)]">
        {pref}で高額当せんが出た売り場
      </h1>

      {n === 0 ? (
        <p className="mt-6 text-sm leading-7 text-ink-soft">
          直近{META.roundCount}回のジャンボ宝くじでは、{pref}の売り場から出た高額当せんは
          公表されていません。これは「{pref}では当たらない」という意味ではなく、
          公表分に含まれていないというだけです（公式の公表は売り場へのヒアリングによります）。
        </p>
      ) : (
        <>
          <p className="mt-5 text-[0.8125rem] leading-7 text-ink-soft">
            直近{META.roundCount}回で公表された高額当せんは
            <strong className="font-bold text-ink">{n}件</strong>、
            <strong className="font-bold text-ink">{shops.length}か所</strong>の売り場から出ています。
          </p>
          <ul className="mt-8 border-t border-line">
            {shops.map((s) => (
              <li key={s.name} className="border-b border-line py-3">
                <div className="flex items-baseline gap-3">
                  <span className="flex-1 text-sm">
                    {s.name}
                    <span className="ml-2 text-xs text-ink-faint">{s.city}</span>
                  </span>
                  <span className="figure text-sm">{s.wins}件</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-ink-faint">
                  {s.detail
                    .map((d) => `${d.lottery} ${d.rank}${d.oku}億`)
                    .join(" ／ ")}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <section className="perforation mt-12 pt-8">
        <p className="text-[0.8125rem] leading-7 text-ink-soft">
          当せん確率は売り場によって変わりません。当せんが多い売り場は、
          売っている枚数が多い売り場です。
          <Link href="/articles/ataru-uriba" className="ml-1 text-shu underline underline-offset-2">
            くわしく
          </Link>
        </p>
      </section>

      <section className="mt-12">
        <p className="label">ほかの都道府県</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {Object.entries(PREF_SLUG)
            .filter(([p]) => p !== pref)
            .map(([p, sl]) => (
              <Link key={sl} href={`/pref/${sl}`} className="text-ink-soft transition-colors hover:text-shu">
                {p}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
