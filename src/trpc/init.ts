import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { getCurrentUser } from "@/lib/auth";

export const createTRPCContext = cache(async () => {
  const user = await getCurrentUser();
  return { user };
});

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const authProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { user: ctx.user } });
});

export const adminProcedure = authProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});
