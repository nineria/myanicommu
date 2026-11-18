import type { PrismaClient } from "@/generated/prisma/client";
import { makeBlurDataURL } from "@/lib/blur-encode";
import { MAX_IMAGE_BYTES, sniffImageType } from "@/lib/images";

/**
 * Seeds the category pages (news / reviews / general) from Anime News Network's public RSS feeds.
 *
 * Each imported post carries only the headline, ANN's one-line summary and a prominent link + credit
 * back to the original article - never the article body. Thumbnails are copied into our own Image
 * table because ANN blocks hotlinked images. Importing is idempotent: the post id is derived from the
 * ANN article id, so re-runs only add what is new.
 *
 * Crunchyroll News is intentionally not a source: it publishes no RSS/API, renders its list
 * client-side and sits behind a Cloudflare bot challenge.
 */

type Db = Pick<PrismaClient, "user" | "post" | "image">;

type Feed = {
  url: string;
  kind: "NEWS" | "REVIEW" | "GENERAL";
  tag: { label: string; colorFrom: string; colorTo: string };
};

const FEEDS: Feed[] = [
  {
    url: "https://www.animenewsnetwork.com/news/rss.xml",
    kind: "NEWS",
    tag: { label: "ข่าวสาร", colorFrom: "orange", colorTo: "red" },
  },
  {
    url: "https://www.animenewsnetwork.com/review/rss.xml",
    kind: "REVIEW",
    tag: { label: "รีวิว", colorFrom: "teal", colorTo: "lime" },
  },
  {
    url: "https://www.animenewsnetwork.com/interest/rss.xml",
    kind: "GENERAL",
    tag: { label: "น่าสนใจ", colorFrom: "indigo", colorTo: "cyan" },
  },
];

const BOT = {
  clerkId: "bot_ann_import",
  username: "ann-news",
  bio: "รวบรวมข่าวและบทความจาก Anime News Network พร้อมลิงก์ไปยังต้นฉบับ",
};
const SOURCE = "Anime News Network";
const FALLBACK_IMAGE = "/background.png";
const UA = "MyAniCommuBot/1.0 (+news importer)";

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

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const tag = (xml: string, name: string) =>
  decode(
    xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "",
  );

type Item = {
  id: string;
  title: string;
  link: string;
  summary: string;
  category: string;
  publishedAt: Date;
  feed: Feed;
};

async function readFeed(feed: Feed): Promise<Item[]> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${feed.url} -> ${res.status}`);
  const xml = await res.text();
  const items: Item[] = [];
  for (const [, raw] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const link = tag(raw, "link");
    const annId = link.match(/\.(\d+)\/?$/)?.[1];
    const publishedAt = new Date(tag(raw, "pubDate"));
    const title = tag(raw, "title");
    if (
      !annId ||
      !title ||
      !link.startsWith("https://www.animenewsnetwork.com/") ||
      Number.isNaN(publishedAt.getTime())
    )
      continue;
    items.push({
      id: `ann-${annId}`,
      title,
      link,
      summary: tag(raw, "description"),
      category: tag(raw, "category"),
      publishedAt,
      feed,
    });
  }
  return items;
}

/** Copies the article's og:image into our own Image table. Returns null on any failure. */
async function mirrorThumbnail(
  db: Db,
  userId: string,
  articleUrl: string,
): Promise<string | null> {
  try {
    const page = await fetch(articleUrl, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8_000),
    });
    if (!page.ok) return null;
    const html = await page.text();
    const src = decode(
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      )?.[1] ?? "",
    );
    if (!src.startsWith("https://www.animenewsnetwork.com/")) return null;

    const img = await fetch(src, {
      headers: { "User-Agent": UA, Referer: articleUrl },
      signal: AbortSignal.timeout(8_000),
    });
    if (!img.ok) return null;
    const data = new Uint8Array(await img.arrayBuffer());
    if (data.length === 0 || data.length > MAX_IMAGE_BYTES) return null;
    const contentType = sniffImageType(data);
    if (!contentType) return null;

    const row = await db.image.create({
      data: {
        userId,
        kind: "post",
        contentType,
        size: data.length,
        data,
        blur: await makeBlurDataURL(data),
      },
      select: { id: true },
    });
    return `/api/images/${row.id}`;
  } catch {
    return null;
  }
}

function contentFor(item: Item) {
  const summary = item.summary ? `<p>${escapeHtml(item.summary)}</p>` : "";
  return (
    summary +
    `<p>อ่านบทความฉบับเต็มได้ที่ <a href="${escapeHtml(item.link)}">${escapeHtml(SOURCE)}</a></p>`
  );
}

async function inBatches<T>(
  items: T[],
  size: number,
  fn: (item: T) => Promise<void>,
) {
  for (let i = 0; i < items.length; i += size)
    await Promise.all(items.slice(i, i + size).map(fn));
}

export type ImportResult = {
  fetched: number;
  created: number;
  skipped: number;
  errors: string[];
};

/** `limit` caps how many new posts one run creates (serverless time budget); omit for no cap. */
export async function importAnnPosts(
  db: Db,
  { limit = Number.POSITIVE_INFINITY }: { limit?: number } = {},
): Promise<ImportResult> {
  const errors: string[] = [];
  const settled = await Promise.allSettled(FEEDS.map(readFeed));
  const items: Item[] = [];
  for (const r of settled) {
    if (r.status === "fulfilled") items.push(...r.value);
    else errors.push(String(r.reason));
  }

  const unique = [...new Map(items.map((i) => [i.id, i])).values()];
  const existing = new Set(
    (
      await db.post.findMany({
        where: { id: { in: unique.map((i) => i.id) } },
        select: { id: true },
      })
    ).map((p) => p.id),
  );
  // newest first so a capped run still publishes the freshest headlines
  const fresh = unique
    .filter((i) => !existing.has(i.id))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);

  if (fresh.length === 0)
    return {
      fetched: unique.length,
      created: 0,
      skipped: unique.length,
      errors,
    };

  const bot = await db.user.upsert({
    where: { clerkId: BOT.clerkId },
    create: { ...BOT, firstName: SOURCE },
    update: {},
  });

  let created = 0;
  await inBatches(fresh, 6, async (item) => {
    try {
      const image =
        (await mirrorThumbnail(db, bot.id, item.link)) ?? FALLBACK_IMAGE;
      await db.post.create({
        data: {
          id: item.id,
          authorId: bot.id,
          title: item.title.slice(0, 120),
          kind: item.feed.kind,
          tags: [item.feed.tag],
          genres: item.category ? [item.category] : [],
          image,
          content: contentFor(item),
          credit: SOURCE,
          createdAt: item.publishedAt,
        },
      });
      created++;
    } catch (e) {
      errors.push(`${item.id}: ${e instanceof Error ? e.message : e}`);
    }
  });

  return {
    fetched: unique.length,
    created,
    skipped: unique.length - created,
    errors,
  };
}
