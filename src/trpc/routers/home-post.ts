import { z } from "zod";
import { prisma } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";

const input = z.object({
  title: z.string().min(1),
  titleLink: z.string().default(""),
  header: z.string().default(""),
  headerLink: z.string().default(""),
  body: z.string().min(1),
});

export const homePostRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    const rows = await prisma.homePost.findMany({
      orderBy: { createdAt: "asc" },
      take: 10,
      include: { author: { select: { username: true } } },
    });
    return rows.map((r) => ({ ...r, body: sanitizeRichText(r.body) }));
  }),

  create: adminProcedure.input(input).mutation(({ ctx, input }) =>
    prisma.homePost.create({
      data: {
        ...input,
        body: sanitizeRichText(input.body),
        authorId: ctx.user.id,
      },
    }),
  ),

  update: adminProcedure
    .input(input.extend({ id: z.string() }))
    .mutation(({ input: { id, ...data } }) =>
      prisma.homePost.update({
        where: { id },
        data: { ...data, body: sanitizeRichText(data.body) },
      }),
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.homePost.delete({ where: { id: input.id } }),
    ),
});
