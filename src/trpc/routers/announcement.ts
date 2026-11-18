import { z } from "zod";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";

const input = z.object({
  type: z.enum(["DANGER", "WARNING", "SUCCESS"]),
  title: z
    .string()
    .min(1, "กรุณาเขียนหัวข้อของประกาศ")
    .max(100, "หัวข้อต้องไม่เกิน 100 ตัวอักษร"),
  content: z.string().min(1, "กรุณาเขียนเนื้อหาของประกาศ"),
  published: z.boolean().default(false),
});

export const announcementRouter = createTRPCRouter({
  published: baseProcedure.query(async () => {
    const rows = await prisma.announcement.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { author: { select: { username: true } } },
    });
    return rows.map((r) => ({ ...r, content: sanitizeRichText(r.content) }));
  }),

  all: adminProcedure.query(() =>
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { username: true } } },
    }),
  ),

  create: adminProcedure.input(input).mutation(({ ctx, input }) =>
    prisma.announcement.create({
      data: {
        ...input,
        content: sanitizeRichText(input.content),
        authorId: ctx.user.id,
      },
    }),
  ),

  update: adminProcedure
    .input(input.extend({ id: z.string() }))
    .mutation(({ input: { id, ...data } }) =>
      prisma.announcement.update({
        where: { id },
        data: { ...data, content: sanitizeRichText(data.content) },
      }),
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.announcement.delete({ where: { id: input.id } }),
    ),
});
