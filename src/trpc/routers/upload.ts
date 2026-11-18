import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createUploadUrl } from "@/lib/s3";
import { authProcedure, createTRPCRouter } from "../init";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export const uploadRouter = createTRPCRouter({
  /** Returns a presigned PUT url; the browser uploads straight to S3/R2. */
  presign: authProcedure
    .input(
      z.object({
        kind: z.enum(["post", "avatar", "banner", "inline"]),
        contentType: z
          .string()
          .refine((t) => ALLOWED.has(t), "ไฟล์รูปภาพไม่ถูกต้อง"),
      }),
    )
    .mutation(({ ctx, input }) => {
      const ext = input.contentType.split("/")[1];
      const key = `${input.kind}/${ctx.user.id}/${randomUUID()}.${ext}`;
      return createUploadUrl(key, input.contentType);
    }),
});
