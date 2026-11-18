/**
 * Local-dev seed: a few users, posts, an announcement and a home post so every page has content.
 *   bun run db:seed
 */
import "./load-env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { ADMIN_RANK_LABEL, DEFAULT_RANK, RANKS } from "../src/lib/constants";

const rank = (label: string) => {
  const r = RANKS.find((x) => x.label === label);
  if (!r) throw new Error(`unknown rank ${label}`);
  return r;
};

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const img = (n: number) => `https://picsum.photos/seed/mac${n}/800/450`;

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: "hunter" },
    create: {
      clerkId: "seed_admin",
      username: "hunter",
      email: "admin@example.com",
      role: "ADMIN",
      bio: "ผู้ดูแลระบบ",
      ranks: {
        create: [rank(ADMIN_RANK_LABEL), rank("ตำนานแห่งชุมชน"), DEFAULT_RANK],
      },
    },
    update: {},
  });
  const member = await prisma.user.upsert({
    where: { username: "sakura" },
    create: {
      clerkId: "seed_member",
      username: "sakura",
      email: "sakura@example.com",
      ranks: {
        create: [rank("นักเขียนรีวิวมือหนึ่ง"), rank("โอตาคุตัวยง")],
      },
    },
    update: {},
  });

  const kinds = [
    {
      kind: "NEWS",
      tag: { label: "ข่าวสาร", colorFrom: "orange", colorTo: "red" },
    },
    {
      kind: "REVIEW",
      tag: { label: "รีวิว", colorFrom: "teal", colorTo: "lime" },
    },
    {
      kind: "QNA",
      tag: { label: "คำถาม", colorFrom: "indigo", colorTo: "cyan" },
    },
  ] as const;

  let n = 0;
  for (const { kind, tag } of kinds) {
    for (let i = 1; i <= 3; i++) {
      n++;
      const id = `seed-${kind.toLowerCase()}-${i}`;
      await prisma.post.upsert({
        where: { id },
        create: {
          id,
          authorId: i % 2 ? admin.id : member.id,
          title: `ตัวอย่างโพสต์ ${tag.label} หมายเลข ${i}`,
          kind,
          tags: [tag],
          genres: ["Action", "Drama"],
          image: img(n),
          content: `<p>นี่คือเนื้อหาตัวอย่างของโพสต์ <strong>${tag.label}</strong> ลำดับที่ ${i}</p>`,
          credit: "ตัวอย่าง",
        },
        update: {},
      });
    }
  }
  await prisma.comment.upsert({
    where: { id: "seed-comment-1" },
    create: {
      id: "seed-comment-1",
      postId: "seed-news-1",
      authorId: member.id,
      content: "<p>ขอบคุณสำหรับข่าวครับ</p>",
    },
    update: {},
  });
  await prisma.announcement.upsert({
    where: { id: "seed-ann-1" },
    create: {
      id: "seed-ann-1",
      authorId: admin.id,
      type: "SUCCESS",
      title: "ยินดีต้อนรับ",
      content: "<p>เปิดให้บริการแล้ว!</p>",
      published: true,
    },
    update: {},
  });
  await prisma.homePost.upsert({
    where: { id: "seed-home-1" },
    create: {
      id: "seed-home-1",
      authorId: admin.id,
      title: "ประกาศจากผู้ดูแล",
      titleLink: "/posts",
      header: "หัวข้อย่อย",
      headerLink: "/news",
      body: "<p>เนื้อหาตัวอย่างหน้าหลัก</p>",
    },
    update: {},
  });
  console.log("seeded");
}

main().finally(() => prisma.$disconnect());
