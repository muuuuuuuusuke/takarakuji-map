import data from "@/data/shops.json";

export interface WinDetail {
  lottery: string;
  rank: string;
  oku: number;
}

export interface Shop {
  pref: string;
  name: string;
  city: string;
  /** 公表された高額当せんの本数（1等・前後賞・2等の合計）。 */
  wins: number;
  /** そのうち1等の当せん金の合計（億円）。 */
  firstOku: number;
  rounds: string[];
  detail: WinDetail[];
}

const d = data as unknown as {
  source: string;
  note: string;
  rounds: { lottery: string; firstSeen: string; count: number }[];
  totalWins: number;
  prefCounts: Record<string, number>;
  prefUnknown: Record<string, number>;
  shops: Shop[];
};

export const META = {
  source: d.source,
  note: d.note,
  totalWins: d.totalWins,
  roundCount: d.rounds.length,
  shopCount: d.shops.length,
};

export const ROUNDS = d.rounds;
export const SHOPS = d.shops;
export const PREF_COUNTS = d.prefCounts;

/**
 * 都道府県の並びとタイル座標。
 * 正確な地形図ではなく、地理的な相対位置を保った格子で表す。
 * 面積の大小が件数の印象を歪めないので、件数の比較にはこちらが正しい。
 */
export const PREF_TILES: { pref: string; x: number; y: number }[] = [
  { pref: "北海道", x: 10, y: 0 },
  { pref: "青森県", x: 10, y: 2 }, { pref: "岩手県", x: 11, y: 3 },
  { pref: "秋田県", x: 10, y: 3 }, { pref: "宮城県", x: 11, y: 4 },
  { pref: "山形県", x: 10, y: 4 }, { pref: "福島県", x: 11, y: 5 },
  { pref: "新潟県", x: 9, y: 4 }, { pref: "栃木県", x: 10, y: 5 },
  { pref: "群馬県", x: 9, y: 5 }, { pref: "茨城県", x: 11, y: 6 },
  { pref: "埼玉県", x: 10, y: 6 }, { pref: "千葉県", x: 11, y: 7 },
  { pref: "東京都", x: 10, y: 7 }, { pref: "神奈川県", x: 10, y: 8 },
  { pref: "山梨県", x: 9, y: 7 }, { pref: "長野県", x: 8, y: 5 },
  { pref: "静岡県", x: 9, y: 8 }, { pref: "愛知県", x: 8, y: 7 },
  { pref: "岐阜県", x: 8, y: 6 }, { pref: "富山県", x: 8, y: 4 },
  { pref: "石川県", x: 7, y: 4 }, { pref: "福井県", x: 6, y: 5 },
  { pref: "滋賀県", x: 7, y: 6 }, { pref: "三重県", x: 7, y: 8 },
  { pref: "京都府", x: 6, y: 6 }, { pref: "奈良県", x: 6, y: 8 },
  { pref: "大阪府", x: 6, y: 7 }, { pref: "和歌山県", x: 5, y: 8 },
  { pref: "兵庫県", x: 5, y: 6 }, { pref: "鳥取県", x: 4, y: 5 },
  { pref: "岡山県", x: 4, y: 6 }, { pref: "島根県", x: 3, y: 5 },
  { pref: "広島県", x: 3, y: 6 }, { pref: "山口県", x: 2, y: 6 },
  { pref: "香川県", x: 4, y: 7 }, { pref: "徳島県", x: 5, y: 7 },
  { pref: "愛媛県", x: 3, y: 7 }, { pref: "高知県", x: 4, y: 8 },
  { pref: "福岡県", x: 2, y: 7 }, { pref: "大分県", x: 3, y: 8 },
  { pref: "佐賀県", x: 1, y: 7 }, { pref: "熊本県", x: 2, y: 8 },
  { pref: "長崎県", x: 0, y: 7 }, { pref: "宮崎県", x: 3, y: 9 },
  { pref: "鹿児島県", x: 2, y: 9 }, { pref: "沖縄県", x: 0, y: 10 },
];

export const PREF_SLUG: Record<string, string> = {
  北海道: "hokkaido", 青森県: "aomori", 岩手県: "iwate", 宮城県: "miyagi",
  秋田県: "akita", 山形県: "yamagata", 福島県: "fukushima", 茨城県: "ibaraki",
  栃木県: "tochigi", 群馬県: "gunma", 埼玉県: "saitama", 千葉県: "chiba",
  東京都: "tokyo", 神奈川県: "kanagawa", 新潟県: "niigata", 富山県: "toyama",
  石川県: "ishikawa", 福井県: "fukui", 山梨県: "yamanashi", 長野県: "nagano",
  岐阜県: "gifu", 静岡県: "shizuoka", 愛知県: "aichi", 三重県: "mie",
  滋賀県: "shiga", 京都府: "kyoto", 大阪府: "osaka", 兵庫県: "hyogo",
  奈良県: "nara", 和歌山県: "wakayama", 鳥取県: "tottori", 島根県: "shimane",
  岡山県: "okayama", 広島県: "hiroshima", 山口県: "yamaguchi", 徳島県: "tokushima",
  香川県: "kagawa", 愛媛県: "ehime", 高知県: "kochi", 福岡県: "fukuoka",
  佐賀県: "saga", 長崎県: "nagasaki", 熊本県: "kumamoto", 大分県: "oita",
  宮崎県: "miyazaki", 鹿児島県: "kagoshima", 沖縄県: "okinawa",
};

const SLUG_TO_PREF = Object.fromEntries(
  Object.entries(PREF_SLUG).map(([k, v]) => [v, k]),
);

export function prefFromSlug(slug: string): string | undefined {
  return SLUG_TO_PREF[slug];
}

export function shopsOfPref(pref: string): Shop[] {
  return SHOPS.filter((s) => s.pref === pref);
}

export function winsOfPref(pref: string): number {
  return PREF_COUNTS[pref] ?? 0;
}

/** 1等の当せん金の合計が大きい順。件数だけだと前後賞の多さで歪むため。 */
export function topShops(limit = 20): Shop[] {
  return [...SHOPS].sort((a, b) => b.wins - a.wins || b.firstOku - a.firstOku).slice(0, limit);
}
