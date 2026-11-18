import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { PostKind, Prisma } from "@/generated/prisma/client";
import { getBlur, getBlurMap } from "@/lib/blur";
import { KIND_BY_TAG } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { stripHtml } from "@/lib/utils";
import {
  adminProcedure,
  authProcedure,
  baseProcedure,
  createTRPCRouter,
} from "../init";

const tagSchema = z.object({
  label: z.string(),
  colorFrom: z.string(),
  colorTo: z.string(),
});

const postInput = z.object({
  title: z
    .string()
    .min(10, "หัวข้อโพสต์ต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(120, "หัวข้อโพสต์ต้องไม่เกิน 120 ตัวอักษร"),
  tags: z.array(tagSchema).min(1, "กรุณาเลือกประเภทของโพสต์"),
  genres: z.array(z.string()).default([]),
  image: z.string().min(1, "กรุณาใส่รูปภาพประจำโพสต์!"),
  content: z.string().min(1),
  credit: z.string().default(""),
});

export const postCardSelect = {
  id: true,
  title: true,
  image: true,
  tags: true,
  kind: true,
  genres: true,
  createdAt: true,
  author: { select: { username: true, avatar: true } },
  _count: { select: { likes: true, comments: true } },
  stars: { select: { value: true } },
} satisfies Prisma.PostSelect;

type CardRow = Prisma.PostGetPayload<{ select: typeof postCardSelect }>;

export type PostCard = {
  id: string;
  title: string;
  image: string;
  /** tiny blur-up placeholder for `image` (null for external urls) */
  blur: string | null;
  kind: PostKind;
  tags: z.infer<typeof tagSchema>[];
  genres: string[];
  createdAt: Date;
  author: { username: string; avatar: string | null };
  likes: number;
  comments: number;
  stars: number;
};

export function toPostCard(p: CardRow, blur?: string): PostCard {
  const starCount = p.stars.length;
  return {
    id: p.id,
    title: p.title,
    image: p.image,
    blur: blur ?? null,
    kind: p.kind,
    tags: p.tags as PostCard["tags"],
    genres: p.genres,
    createdAt: p.createdAt,
    author: p.author,
    likes: p._count.likes,
    comments: p._count.comments,
    stars: starCount
      ? Math.round(
          (p.stars.reduce((a, s) => a + s.value, 0) / starCount) * 10,
        ) / 10
      : 0,
  };
}

/** Maps rows to cards, attaching each image's stored blur placeholder in one query. */
export async function toPostCards(rows: CardRow[]): Promise<PostCard[]> {
  const blurs = await getBlurMap(rows.map((r) => r.image));
  return rows.map((r) => toPostCard(r, blurs.get(r.image)));
}

function kindOf(tags: { label: string }[]): PostKind {
  return KIND_BY_TAG[tags[0]?.label ?? ""] ?? "GENERAL";
}

export const postRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z
        .object({
          kind: z.enum(["NEWS", "REVIEW", "QNA", "GENERAL"]).optional(),
          q: z.string().trim().max(120).optional(),
          take: z.number().int().min(1).max(100).default(60),
        })
        .default({ take: 60 }),
    )
    .query(async ({ input }) => {
      const rows = await prisma.post.findMany({
        where: {
          ...(input.kind ? { kind: input.kind } : {}),
          ...(input.q
            ? { title: { contains: input.q, mode: "insensitive" } }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        take: input.take,
        select: postCardSelect,
      });
      return toPostCards(rows);
    }),

  listPage: baseProcedure
    .input(
      z.object({
        kind: z.enum(["NEWS", "REVIEW", "QNA", "GENERAL"]).optional(),
        q: z.string().trim().max(120).optional(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(60).default(12),
      }),
    )
    .query(async ({ input }) => {
      const where: Prisma.PostWhereInput = {
        ...(input.kind ? { kind: input.kind } : {}),
        ...(input.q
          ? { title: { contains: input.q, mode: "insensitive" } }
          : {}),
      };
      const total = await prisma.post.count({ where });
      const pageCount = Math.max(1, Math.ceil(total / input.pageSize));
      const page = Math.min(input.page, pageCount);
      const rows = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * input.pageSize,
        take: input.pageSize,
        select: postCardSelect,
      });
      return { items: await toPostCards(rows), total, page, pageCount };
    }),

  byAuthor: baseProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const rows = await prisma.post.findMany({
        where: { author: { username: input.username } },
        orderBy: { createdAt: "desc" },
        select: postCardSelect,
      });
      return toPostCards(rows);
    }),

  byId: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              role: true,
              ranks: true,
              _count: { select: { posts: true, comments: true } },
            },
          },
          _count: { select: { likes: true, comments: true } },
          stars: { select: { value: true, userId: true } },
          likes: ctx.user
            ? { where: { userId: ctx.user.id }, select: { id: true } }
            : false,
        },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const { stars, likes, ...rest } = post;
      return {
        ...rest,
        imageBlur: await getBlur(post.image),
        tags: post.tags as z.infer<typeof tagSchema>[],
        content: sanitizeRichText(post.content),
        likeCount: post._count.likes,
        liked: Array.isArray(likes) && likes.length > 0,
        starAverage: stars.length
          ? stars.reduce((a, s) => a + s.value, 0) / stars.length
          : 0,
        starCount: stars.length,
        myStar: ctx.user
          ? (stars.find((s) => s.userId === ctx.user?.id)?.value ?? 0)
          : 0,
      };
    }),

  create: authProcedure.input(postInput).mutation(async ({ ctx, input }) => {
    const post = await prisma.post.create({
      data: {
        ...input,
        content: sanitizeRichText(input.content),
        kind: kindOf(input.tags),
        authorId: ctx.user.id,
      },
    });
    return { id: post.id, username: ctx.user.username };
  }),

  update: authProcedure
    .input(postInput.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      if (existing.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await prisma.post.update({
        where: { id },
        data: {
          ...data,
          content: sanitizeRichText(data.content),
          kind: kindOf(data.tags),
        },
      });
      return { ok: true };
    }),

  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.post.findUnique({
        where: { id: input.id },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      if (existing.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await prisma.post.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  toggleLike: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const where = {
        userId_postId: { userId: ctx.user.id, postId: input.id },
      };
      const existing = await prisma.like.findUnique({ where });
      if (existing) await prisma.like.delete({ where });
      else
        await prisma.like.create({
          data: { userId: ctx.user.id, postId: input.id },
        });
      return { liked: !existing };
    }),

  rate: authProcedure
    .input(z.object({ id: z.string(), value: z.number().int().min(1).max(5) }))
    .mutation(async ({ ctx, input }) => {
      await prisma.star.upsert({
        where: { userId_postId: { userId: ctx.user.id, postId: input.id } },
        create: { userId: ctx.user.id, postId: input.id, value: input.value },
        update: { value: input.value },
      });
      return { ok: true };
    }),

  topReviews: baseProcedure.query(async () => {
    const rows = await prisma.post.findMany({
      where: { kind: "REVIEW" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: { select: { username: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      username: r.author.username,
      createdAt: r.createdAt,
      excerpt: stripHtml(r.content).slice(0, 200),
    }));
  }),

  siteStats: baseProcedure.query(async () => {
    const [posts, members] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
    ]);
    return { posts, members };
  }),

  adminStats: adminProcedure.query(async () => {
    const [posts, comments, likes, stars, users] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.star.count(),
      prisma.user.count(),
    ]);
    return { posts, comments, likes, stars, users };
  }),
});
