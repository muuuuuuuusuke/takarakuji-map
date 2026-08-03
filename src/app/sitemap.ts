import type { MetadataRoute } from "next";
import { PREF_SLUG } from "@/lib/shops";

const BASE_URL = "https://takarakuji-map.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: BASE_URL, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/shops`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...Object.values(PREF_SLUG).map((slug) => ({
      url: `${BASE_URL}/pref/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/articles`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/articles/ataru-uriba`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
