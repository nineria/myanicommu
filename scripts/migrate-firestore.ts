/**
 * One-off Firestore -> Postgres migration for the old MyAniCommu data.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
 *   DATABASE_URL=postgres://... \
 *   bun run migrate:firestore            # dry run, prints counts only
 *   bun run migrate:firestore --apply    # writes to Postgres (idempotent upserts)
 *
 * Notes
 * - Users are created with clerkId = `legacy_<firebase uid>`. The first time that person signs in
 *   with Clerk using the same email, `getCurrentUser()` re-links the row to their Clerk id.
 * - Post / comment ids are preserved so existing /posts/<username>/<id> URLs keep working.
 * - Comment likes were only a counter in Firestore, so they cannot be mapped to users and are dropped.
 * - Images keep their existing URLs (Firebase Storage / imgbb); nothing is re-uploaded.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { cert, initializeApp } from "firebase-admin/app";
import { type DocumentData, getFirestore } from "firebase-admin/firestore";
import { PrismaClient } from "../src/generated/prisma/client";

const ADMIN_UID = "ViTbVpVfXVQHcK9WmvzAUJggayk2";
const KIND_BY_TAG: Record<string, "NEWS" | "REVIEW" | "QNA"> = {
  ข่าวสาร: "NEWS",
  รีวิว: "REVIEW",
  คำถาม: "QNA",
};

const apply = process.argv.includes("--apply");

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  initializeApp({
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  });
} else {
  initializeApp();
}
const db = getFirestore();
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ts = (v: unknown) =>
  v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : new Date();

const color = (c?: { from?: string; to?: string }) => ({
  colorFrom: c?.from ?? "#5C3D2E",
  colorTo: c?.to ?? "#5C3D2E",
});

async function main() {
  console.log(
    apply
      ? "APPLY mode: writing to Postgres"
      : "DRY RUN (pass --apply to write)",
  );
  const counts: Record<string, number> = {};
  const bump = (k: string) => {
    counts[k] = (counts[k] ?? 0) + 1;
  };

  // ---- users (+ ranks) ----------------------------------------------------
  const idByUid = new Map<string, string>();
  const usedNames = new Set<string>();
  const users = await db.collection("users").get();
  for (const doc of users.docs) {
    const u = doc.data() as DocumentData;
    let username: string = u.username ?? `user_${doc.id.slice(0, 6)}`;
    while (usedNames.has(username.toLowerCase())) username = `${username}_`;
    usedNames.add(username.toLowerCase());
    bump("users");
    if (!apply) continue;
    const row = await prisma.user.upsert({
      where: { legacyUid: doc.id },
      create: {
        clerkId: `legacy_${doc.id}`,
        legacyUid: doc.id,
        username,
        email: u.email ?? "",
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        avatar: u.avatar ?? null,
        banner: u.image || null,
        role:
          doc.id === ADMIN_UID || u.rule === "ผู้ดูแลระบบ" ? "ADMIN" : "MEMBER",
        createdAt: ts(u.createdAt),
      },
      update: {},
    });
    idByUid.set(doc.id, row.id);

    for (const r of (await doc.ref.collection("ranks").get()).docs) {
      bump("ranks");
      const d = r.data();
      await prisma.userRank.upsert({
        where: { userId_label: { userId: row.id, label: d.label } },
        create: { userId: row.id, label: d.label, ...color(d.color) },
        update: {},
      });
    }
  }

  // ---- posts (+ comments, likes, stars) ------------------------------------
  for (const userDoc of users.docs) {
    const authorId = idByUid.get(userDoc.id);
    for (const p of (await userDoc.ref.collection("posts").get()).docs) {
      const d = p.data();
      bump("posts");
      if (!apply || !authorId) continue;
      const tags = (
        (d.tag ?? []) as {
          label: string;
          color?: { from?: string; to?: string };
        }[]
      ).map((t) => ({ label: t.label, ...color(t.color) }));
      await prisma.post.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          authorId,
          title: d.title ?? "",
          kind: KIND_BY_TAG[tags[0]?.label ?? ""] ?? "GENERAL",
          tags,
          genres: d.genre ?? [],
          image: d.image ?? "",
          content: d.content ?? "",
          credit: d.credit ?? "",
          createdAt: ts(d.createdAt),
          updatedAt: ts(d.updatedAt),
        },
        update: {},
      });

      for (const c of (await p.ref.collection("comments").get()).docs) {
        const cd = c.data();
        const cAuthor = idByUid.get(cd.uid);
        if (!cAuthor) continue;
        bump("comments");
        await prisma.comment.upsert({
          where: { id: c.id },
          create: {
            id: c.id,
            postId: p.id,
            authorId: cAuthor,
            content: cd.content ?? "",
            createdAt: ts(cd.createdAt),
            updatedAt: ts(cd.updatedAt),
          },
          update: {},
        });
      }
      for (const l of (await p.ref.collection("likes").get()).docs) {
        const userId = idByUid.get(l.data().uid);
        if (!userId) continue;
        bump("likes");
        await prisma.like.upsert({
          where: { userId_postId: { userId, postId: p.id } },
          create: { userId, postId: p.id },
          update: {},
        });
      }
      for (const s of (await p.ref.collection("stars").get()).docs) {
        const sd = s.data();
        const userId = idByUid.get(sd.uid);
        if (!userId || typeof sd.stars !== "number") continue;
        bump("stars");
        await prisma.star.upsert({
          where: { userId_postId: { userId, postId: p.id } },
          create: {
            userId,
            postId: p.id,
            value: Math.max(1, Math.min(5, Math.round(sd.stars))),
          },
          update: {},
        });
      }
    }

    // ---- announcements & home posts --------------------------------------
    for (const a of (await userDoc.ref.collection("announcements").get())
      .docs) {
      const d = a.data();
      bump("announcements");
      if (!apply || !authorId) continue;
      await prisma.announcement.upsert({
        where: { id: a.id },
        create: {
          id: a.id,
          authorId,
          type: String(d.type ?? "success").toUpperCase() as
            | "DANGER"
            | "WARNING"
            | "SUCCESS",
          title: d.title ?? "",
          content: d.content ?? "",
          published: !!d.published,
          createdAt: ts(d.createdAt),
        },
        update: {},
      });
    }
    for (const h of (await userDoc.ref.collection("homePosts").get()).docs) {
      const d = h.data();
      bump("homePosts");
      if (!apply || !authorId) continue;
      await prisma.homePost.upsert({
        where: { id: h.id },
        create: {
          id: h.id,
          authorId,
          title: d.title ?? "",
          titleLink: d.titleLink ?? "",
          header: d.header ?? "",
          headerLink: d.headerLink ?? "",
          body: d.body ?? "",
          createdAt: ts(d.createdAt),
        },
        update: {},
      });
    }
  }

  // ---- reports -------------------------------------------------------------
  for (const r of (await db.collection("reports").get()).docs) {
    const d = r.data();
    const reporterId = idByUid.get(d.reporterUid);
    bump("reports");
    if (!apply || !reporterId) continue;
    await prisma.report.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        reporterId,
        title: d.title ?? "",
        from: d.from ?? "",
        detail: d.detail ?? {},
        createdAt: ts(d.createdAt),
      },
      update: {},
    });
  }

  console.table(counts);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
