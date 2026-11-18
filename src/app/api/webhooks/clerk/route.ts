import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/** Keeps the local User row in sync. Lazy creation in `getCurrentUser` covers the gap before first delivery. */
export async function POST(req: NextRequest) {
  let evt: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.updated") {
    const u = evt.data;
    const email = u.email_addresses.find(
      (e) => e.id === u.primary_email_address_id,
    )?.email_address;
    await prisma.user.updateMany({
      where: { clerkId: u.id },
      data: {
        ...(email ? { email } : {}),
        firstName: u.first_name ?? "",
        lastName: u.last_name ?? "",
      },
    });
  }

  if (evt.type === "user.deleted" && evt.data.id) {
    await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
  }

  return new Response("ok", { status: 200 });
}
