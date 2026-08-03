import type { Metadata } from "next";
import Link from "next/link";
import { META } from "@/lib/shops";
import "./globals.css";

const SITE_URL = "https://takarakuji-map.vercel.app";
const SITE_NAME = "高額当せん売り場の地図";
const DESCRIPTION =
  `ジャンボ宝くじで1億円以上の高額当せんが出た売り場を、都道府県別の地図と一覧で。` +
  `宝くじ公式の公表分${META.totalWins}件・${META.shopCount}売り場を集計しています。`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "高額当せん売り場の地図｜ジャンボ宝くじの当せん実績を都道府県別に",
    template: `%s｜${SITE_NAME}`,
  },
  description: DESCRIPTION,
  verification: { google: "KPe0iMIzhr19t3Ml_nAZBxmRBeS5A_svFCPMSfH3Tv4" },
  openGraph: {
    title: SITE_NAME, description: DESCRIPTION, url: "/",
    siteName: SITE_NAME, locale: "ja_JP", type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <header className="border-b border-line bg-paper-raised">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3.5">
            <Link href="/" className="display text-sm hover:text-shu">
              高額当せん売り場の地図
            </Link>
            <nav className="flex gap-4 text-xs text-ink-soft">
              <Link href="/shops" className="hover:text-shu">売り場ランキング</Link>
              <Link href="/articles" className="hover:text-shu">記事</Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="mt-16 border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-5 py-8 text-xs leading-6 text-ink-faint">
            <p>
              出典：{META.source}。{META.note}
              当せん確率は売り場によって変わりません。当サイトは実績の記録であり、
              特定の売り場での購入を勧めるものではありません。
            </p>
            <p className="mt-3">
              <Link href="/shops" className="hover:text-ink">売り場ランキング</Link>
              <span className="mx-2">|</span>
              <Link href="/articles" className="hover:text-ink">記事</Link>
              <span className="mx-2">|</span>
              <Link href="/about" className="hover:text-ink">このサイトについて</Link>
              <span className="mx-2">|</span>
              <Link href="/privacy" className="hover:text-ink">プライバシーポリシー</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
