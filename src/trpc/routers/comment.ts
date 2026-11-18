import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { stripHtml } from "@/lib/utils";
import { authProcedure, baseProcedure, createTRPCRouter } from "../init";

const authorSelect = {
  id: true,
  username: true,
  avatar: true,
  role: true,
  ranks: true,
  _count: { select: { posts: true, comments: true } },
} as const;

export const commentRouter = createTRPCRouter({
  list: baseProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await prisma.comment.findMany({
        where: { postId: input.postId },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: authorSelect },
          _count: { select: { likes: true } },
          likes: ctx.user
            ? { where: { userId: ctx.user.id }, select: { id: true } }
            : false,
        },
      });
      return rows.map(({ likes, content, ...c }) => ({
        ...c,
        content: sanitizeRichText(content),
        likeCount: c._count.likes,
        liked: Array.isArray(likes) && likes.length > 0,
      }));
    }),

  create: authProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!stripHtml(input.content).trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ข้อความของคุณว่างเปล่า?",
        });
      }
      await prisma.comment.create({
        data: {
          postId: input.postId,
          authorId: ctx.user.id,
          content: sanitizeRichText(input.content),
        },
      });
      return { ok: true };
    }),

  update: authProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const c = await prisma.comment.findUnique({ where: { id: input.id } });
      if (!c) throw new TRPCError({ code: "NOT_FOUND" });
      if (c.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await prisma.comment.update({
        where: { id: input.id },
        data: { content: sanitizeRichText(input.content) },
      });
      return { ok: true };
    }),

  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const c = await prisma.comment.findUnique({ where: { id: input.id } });
      if (!c) throw new TRPCError({ code: "NOT_FOUND" });
      if (c.authorId !== ctx.user.id && ctx.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await prisma.comment.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  toggleLike: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const where = {
        userId_commentId: { userId: ctx.user.id, commentId: input.id },
      };
      const existing = await prisma.like.findUnique({ where });
      if (existing) await prisma.like.delete({ where });
      else
        await prisma.like.create({
          data: { userId: ctx.user.id, commentId: input.id },
        });
      return { liked: !existing };
    }),
});
