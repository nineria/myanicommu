/**
 * Generates blur placeholders for images uploaded before the `blur` column existed.
 *   bun run db:backfill-blur
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { makeBlurDataURL } from "../src/lib/blur-encode";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const ids = await prisma.image.findMany({
    where: { blur: null },
    select: { id: true },
  });
  console.log(`${ids.length} images to backfill`);
  let done = 0;
  for (const { id } of ids) {
    const row = await prisma.image.findUnique({
      where: { id },
      select: { data: true },
    });
    if (!row) continue;
    const blur = await makeBlurDataURL(row.data);
    if (!blur) {
      console.warn(`skip ${id}: could not decode`);
      continue;
    }
    await prisma.image.update({ where: { id }, data: { blur } });
    done++;
  }
  console.log(`done: ${done}/${ids.length}`);
}

main().finally(() => prisma.$disconnect());
