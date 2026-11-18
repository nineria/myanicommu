import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MAX_IMAGE_BYTES, sniffImageType } from "@/lib/images";

const KINDS = new Set(["post", "avatar", "banner", "inline"]);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "inline");
  if (!(file instanceof File) || !KINDS.has(kind)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: "file too large" }, { status: 413 });
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const contentType = sniffImageType(data);
  if (!contentType)
    return Response.json({ error: "unsupported type" }, { status: 415 });

  const image = await prisma.image.create({
    data: { userId: user.id, kind, contentType, size: data.length, data },
    select: { id: true },
  });
  return Response.json({ url: `/api/images/${image.id}` });
}
