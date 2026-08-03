import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "記事",
  description: "宝くじの当せん実績データの読み方についての記事です。",
};

const ARTICLES = [
  {
    slug: "ataru-uriba",
    title: "「よく当たる売り場」の正体",
    lead: "実績が集中する売り場は実在する。ただし理由は確率ではなく販売枚数。",
  },
];

/** 記事の図版。券の意匠で内容を図にする: 大小の山と、同じ高さの確率の線。 */
function Thumb() {
  return (
    <svg viewBox="0 0 160 100" className="h-[100px] w-40 shrink-0 border border-line" aria-hidden>
      <rect width="160" height="100" fill="var(--paper-raised)" />
      <g fill="none" strokeWidth="2">
        <rect x="24" y="34" width="26" height="46" fill="var(--shu)" fillOpacity="0.75" stroke="none" />
        <rect x="62" y="62" width="26" height="18" fill="var(--shu)" fillOpacity="0.4" stroke="none" />
        <rect x="100" y="68" width="26" height="12" fill="var(--shu)" fillOpacity="0.3" stroke="none" />
        <path d="M18 24h124" stroke="var(--midori)" strokeWidth="2" strokeDasharray="5 4" />
        <text x="18" y="18" fontSize="10" fill="var(--midori)">確率は同じ</text>
        <path d="M18 80h124" stroke="var(--ink)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function ArticlesIndex() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="display text-[clamp(1.6rem,5vw,2.3rem)]">記事</h1>
      <ul className="!ml-0 mt-8 list-none space-y-5">
        {ARTICLES.map((a) => (
          <li key={a.slug} className="!ml-0 !list-none">
            <Link href={`/articles/${a.slug}`} className="flex items-center gap-5 !no-underline transition-colors hover:text-shu">
              <Thumb />
              <span>
                <span className="display block text-lg leading-7">{a.title}</span>
                <span className="mt-1 block text-xs leading-6 text-ink-soft">{a.lead}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
