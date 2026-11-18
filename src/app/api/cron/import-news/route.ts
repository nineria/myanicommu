import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";
import { importAnnPosts } from "@/lib/news-import";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const safeEqual = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Pulls fresh Anime News Network posts into the news / review / general categories.
 * Vercel Cron calls this with `Authorization: Bearer $CRON_SECRET`; it is closed when the secret is unset.
 * `?limit=N` caps new posts per run (default 30) so a first backfill fits the function time budget.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`))
    return new Response("Unauthorized", { status: 401 });

  const raw = Number(new URL(req.url).searchParams.get("limit"));
  const limit = Number.isInteger(raw) && raw > 0 ? Math.min(raw, 60) : 30;
  return Response.json(await importAnnPosts(prisma, { limit }));
}
