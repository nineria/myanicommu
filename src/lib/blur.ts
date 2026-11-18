import "server-only";
import { prisma } from "@/lib/db";

const IMAGE_URL = /^\/api\/images\/([A-Za-z0-9_-]+)$/;

/** Maps our own `/api/images/<id>` urls to their stored blur placeholder (external urls get none). */
export async function getBlurMap(
  urls: Iterable<string | null | undefined>,
): Promise<Map<string, string>> {
  const idByUrl = new Map<string, string>();
  for (const u of urls) {
    const id = u?.match(IMAGE_URL)?.[1];
    if (u && id) idByUrl.set(u, id);
  }
  const out = new Map<string, string>();
  if (idByUrl.size === 0) return out;
  const rows = await prisma.image.findMany({
    where: { id: { in: [...new Set(idByUrl.values())] }, blur: { not: null } },
    select: { id: true, blur: true },
  });
  const blurById = new Map(rows.map((r) => [r.id, r.blur as string]));
  for (const [url, id] of idByUrl) {
    const b = blurById.get(id);
    if (b) out.set(url, b);
  }
  return out;
}

export async function getBlur(url: string | null | undefined) {
  return url ? ((await getBlurMap([url])).get(url) ?? null) : null;
}
