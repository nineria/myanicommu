import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { RESERVED_USERNAMES, USERNAME_REGEX } from "@/lib/constants";
import { prisma } from "@/lib/db";
import {
  adminProcedure,
  authProcedure,
  baseProcedure,
  createTRPCRouter,
} from "../init";

const rankInput = z.object({
  label: z.string(),
  colorFrom: z.string(),
  colorTo: z.string(),
});

export const userRouter = createTRPCRouter({
  me: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const { id, username, avatar, email, role } = ctx.user;
    return { id, username, avatar, email, role };
  }),

  byUsername: baseProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { username: input.username },
        include: {
          ranks: true,
          _count: {
            select: { posts: true, comments: true, likes: true, stars: true },
          },
        },
      });
      if (!user) return null;
      // never expose clerkId / legacyUid / email on the public profile
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        role: user.role,
        website: user.website,
        facebook: user.facebook,
        twitter: user.twitter,
        instagram: user.instagram,
        createdAt: user.createdAt,
        ranks: user.ranks,
        _count: user._count,
      };
    }),

  checkUsername: baseProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (
        !USERNAME_REGEX.test(input.username) ||
        RESERVED_USERNAMES.has(input.username)
      ) {
        return { available: false };
      }
      const found = await prisma.user.findUnique({
        where: { username: input.username },
        select: { id: true },
      });
      return { available: !found || found.id === ctx.user?.id };
    }),

  updateProfile: authProcedure
    .input(
      z.object({
        username: z.string().regex(USERNAME_REGEX),
        bio: z.string().max(500).default(""),
        avatar: z.string().nullable().optional(),
        banner: z.string().nullable().optional(),
        website: z.string().url().or(z.literal("")).nullable().optional(),
        facebook: z.string().url().or(z.literal("")).nullable().optional(),
        twitter: z.string().url().or(z.literal("")).nullable().optional(),
        instagram: z.string().url().or(z.literal("")).nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (RESERVED_USERNAMES.has(input.username)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ชื่อผู้ใช้นี้ไม่สามารถใช้งานได้",
        });
      }
      const taken = await prisma.user.findFirst({
        where: { username: input.username, NOT: { id: ctx.user.id } },
        select: { id: true },
      });
      if (taken)
        throw new TRPCError({ code: "CONFLICT", message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
      const clean = (v?: string | null) => (v ? v : null);
      return prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          username: input.username,
          bio: input.bio,
          avatar: input.avatar ?? ctx.user.avatar,
          banner: input.banner === undefined ? ctx.user.banner : input.banner,
          website: clean(input.website),
          facebook: clean(input.facebook),
          twitter: clean(input.twitter),
          instagram: clean(input.instagram),
        },
        select: { username: true },
      });
    }),

  /**
   * Deletes this app's data only. The Clerk identity is shared with other apps on the same
   * Clerk instance, so it is deliberately NOT deleted here.
   */
  deleteAccount: authProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.user.id } });
    return { ok: true };
  }),

  // ---- admin -------------------------------------------------------------
  list: adminProcedure.query(async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        ranks: true,
        _count: { select: { posts: true, comments: true } },
      },
    });
    return users;
  }),

  giveRank: adminProcedure
    .input(z.object({ userId: z.string(), ranks: z.array(rankInput).min(1) }))
    .mutation(async ({ input }) => {
      await prisma.$transaction(
        input.ranks.map((r) =>
          prisma.userRank.upsert({
            where: { userId_label: { userId: input.userId, label: r.label } },
            create: { userId: input.userId, ...r },
            update: { colorFrom: r.colorFrom, colorTo: r.colorTo },
          }),
        ),
      );
      return { ok: true };
    }),

  removeRank: adminProcedure
    .input(z.object({ rankId: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.userRank.delete({ where: { id: input.rankId } });
      return { ok: true };
    }),

  /** Admin removes a member's app data (posts, comments... cascade). Not themselves, not other admins. */
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const target = await prisma.user.findUnique({
        where: { id: input.userId },
        select: { role: true },
      });
      if (!target) throw new TRPCError({ code: "NOT_FOUND" });
      if (target.role === "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "ต้องถอดสิทธิ์ผู้ดูแลก่อนลบผู้ใช้",
        });
      }
      await prisma.user.delete({ where: { id: input.userId } });
      return { ok: true };
    }),

  setRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["MEMBER", "ADMIN"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
      return { ok: true };
    }),
});
