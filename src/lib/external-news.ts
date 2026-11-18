import "server-only";

export type ExternalNewsItem = {
  title: string;
  link: string;
  summary: string;
  category: string;
  publishedAt: Date;
  source: string;
};

const ANN_FEED = "https://www.animenewsnetwork.com/all/rss.xml";

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(Number.parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();

const tag = (xml: string, name: string) =>
  decode(
    xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "",
  );

/**
 * Latest headlines from Anime News Network's public RSS feed. Only the headline, a one-line
 * summary and a link back to the original article are shown; the feed is cached for 10 minutes.
 * Never throws - the home page must still render when the feed is down.
 */
export async function getAnnNews(limit = 8): Promise<ExternalNewsItem[]> {
  try {
    const res = await fetch(ANN_FEED, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .map(([, item]) => ({
        title: tag(item, "title"),
        link: tag(item, "link"),
        summary: tag(item, "description"),
        category: tag(item, "category"),
        publishedAt: new Date(tag(item, "pubDate")),
        source: "Anime News Network",
      }))
      .filter(
        (i) =>
          i.title &&
          i.link.startsWith("https://www.animenewsnetwork.com/") &&
          !Number.isNaN(i.publishedAt.getTime()),
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}
