import type { Metadata } from "next";
import { META, ROUNDS } from "@/lib/shops";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "データの出典、集計方法とその限界、運営者についての情報です。",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-5 py-12 text-[0.8125rem] leading-7 text-ink-soft sm:py-16">
      <h1 className="display text-[clamp(1.6rem,5vw,2.3rem)] text-ink">このサイトについて</h1>

      <h2 className="display !mt-12 text-xl text-ink">何をするサイトか</h2>
      <p>
        ジャンボ宝くじで1億円以上の高額当せんが出た売り場の
        <strong className="font-bold text-ink">記録</strong>です。
        公式が抽せんのたびに公表している売り場情報を集め、都道府県別・売り場別に整理しています。
      </p>
      <p>
        <strong className="font-bold text-ink">
          当せん確率は売り場によって変わりません。
        </strong>
        当サイトは実績の記録であり、特定の売り場での購入を勧めるものではありません。
        実績が集中する理由は「販売枚数が多いから」で、その説明は記事に書いています。
      </p>

      <h2 className="display !mt-12 text-xl text-ink">出典</h2>
      <p>{META.source}</p>
      <ul className="space-y-1.5">
        {ROUNDS.map((r) => (
          <li key={`${r.lottery}${r.firstSeen}`} className="ml-5 list-disc">
            {r.lottery}（{r.count}件）
          </li>
        ))}
      </ul>

      <h2 className="display !mt-12 text-xl text-ink">集計方法と、その限界</h2>
      <ul className="space-y-1.5">
        <li className="ml-5 list-disc">
          公式は最新回でページを更新するため、過去回は Internet Archive の
          スナップショットから収集しています
        </li>
        <li className="ml-5 list-disc">
          <strong className="font-bold text-ink">{META.note}</strong>
          載っていない売り場で当せんが出ていることがあります
        </li>
        <li className="ml-5 list-disc">
          売り場名は公式の表記に揺れがあるため、空白などを無視したキーで名寄せしています
        </li>
        <li className="ml-5 list-disc">
          売り場が特定できなかった当せんは、売り場一覧から外し、都道府県の集計にだけ残しています
        </li>
        <li className="ml-5 list-disc">
          販売枚数は公表されていないため、「1枚あたりの当せん率」は計算できません
        </li>
      </ul>

      <h2 className="display !mt-12 text-xl text-ink">運営者</h2>
      <p>しがないランナー（個人運営・東京都）</p>
      <p className="text-xs text-ink-faint">個人運営のため詳細な住所は非公開としています。</p>

      <h2 className="display !mt-12 text-xl text-ink">広告について</h2>
      <p>
        当サイトはアフィリエイトプログラムによる広告を掲載する場合があります。
        掲載する場合は広告である旨を明示します。
      </p>

      {/* 同一運営者の開示。金運というテーマで内容が地続きのサイトは本文からも案内する。 */}
      <h2 className="display !mt-12 text-xl text-ink">同じ運営者のサイト</h2>
      <ul className="space-y-1.5">
        <li className="ml-5 list-disc">
          <a href="https://kichijitsu.vercel.app" className="text-shu underline underline-offset-2">吉日カレンダー</a>
          ：一粒万倍日・天赦日・大安を月別と用途別に引けるカレンダー
        </li>
        <li className="ml-5 list-disc">
          <a href="https://jikka-chika.vercel.app" className="text-shu underline underline-offset-2">実家の地価</a>
          ：全国の住宅地の地価と30年の推移を市区町村別に
        </li>
        <li className="ml-5 list-disc">
          <a href="https://circle-map.com" className="text-shu underline underline-offset-2">circle-map</a>
          ：地図上に同心円を描き、距離を確認できるツール
        </li>
        <li className="ml-5 list-disc">
          <a href="https://kyuyo-rank.vercel.app" className="text-shu underline underline-offset-2">医療・介護の給与相場ランキング</a>
          ：公的統計から給与相場を都道府県別に
        </li>
      </ul>
    </main>
  );
}
