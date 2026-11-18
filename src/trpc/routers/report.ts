import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminProcedure, authProcedure, createTRPCRouter } from "../init";

export const reportRouter = createTRPCRouter({
  create: authProcedure
    .input(
      z.object({
        title: z.string(),
        from: z.string(),
        detail: z.object({
          inappropriateUsername: z.boolean().default(false),
          inappropriateVerbUse: z.boolean().default(false),
          advertisement: z.boolean().default(false),
          hateSpeech: z.boolean().default(false),
          contentGotUpdated: z.boolean().default(false),
          other: z.string().default(""),
        }),
      }),
    )
    .mutation(({ ctx, input }) =>
      prisma.report.create({ data: { ...input, reporterId: ctx.user.id } }),
    ),

  list: adminProcedure.query(() =>
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: { reporter: { select: { username: true } } },
    }),
  ),

  resolve: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) =>
      prisma.report.update({
        where: { id: input.id },
        data: { resolved: true },
      }),
    ),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => prisma.report.delete({ where: { id: input.id } })),
});
