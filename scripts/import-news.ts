/**
 * One-off backfill of ANN posts (news / review / general) into whatever DATABASE_URL points at.
 *   bun run db:import-news
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { importAnnPosts } from "../src/lib/news-import";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

importAnnPosts(prisma)
  .then((r) => console.log(r))
  .finally(() => prisma.$disconnect());
