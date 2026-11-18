import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await prisma.image.findUnique({
    where: { id },
    select: { data: true, contentType: true },
  });
  if (!image) return new Response("Not found", { status: 404 });

  return new Response(image.data, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.data.length),
      // ids are random and content never changes
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
