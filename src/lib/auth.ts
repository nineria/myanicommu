import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { DEFAULT_RANK, RESERVED_USERNAMES, USERNAME_REGEX } from "./constants";
import { prisma } from "./db";
import { env } from "./env";

function slugifyUsername(raw: string) {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 12);
  return cleaned.length >= 3 ? cleaned : `user${cleaned}`;
}

async function uniqueUsername(base: string) {
  let candidate = slugifyUsername(base);
  if (!USERNAME_REGEX.test(candidate) || RESERVED_USERNAMES.has(candidate)) {
    candidate = `user${Math.floor(1000 + Math.random() * 9000)}`;
  }
  for (let i = 0; i < 20; i++) {
    const taken = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    candidate = `${candidate.slice(0, 10)}${Math.floor(100 + Math.random() * 900)}`;
  }
  return `user${Date.now().toString(36)}`.slice(0, 15);
}

/**
 * The local user row for the signed-in Clerk user.
 * Created lazily on first request so the app works even before the Clerk
 * webhook has fired. A user created by the legacy Firestore migration is
 * linked by email the first time they sign in.
 */
export const getCurrentUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) {
    // Dev only: act as a seeded user (e.g. DEV_AS_USER=hunter) without Clerk.
    if (process.env.NODE_ENV === "development" && env.DEV_AS_USER) {
      return prisma.user.findUnique({ where: { username: env.DEV_AS_USER } });
    }
    return null;
  }

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  if (!cu) return null;

  const email = cu.primaryEmailAddress?.emailAddress ?? "";

  if (email) {
    const legacy = await prisma.user.findFirst({
      where: { email, clerkId: { startsWith: "legacy_" } },
    });
    if (legacy) {
      return prisma.user.update({
        where: { id: legacy.id },
        data: { clerkId: userId, avatar: legacy.avatar ?? cu.imageUrl },
      });
    }
  }

  const adminEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const username = await uniqueUsername(
    cu.username ?? email.split("@")[0] ?? "user",
  );

  return prisma.user.create({
    data: {
      clerkId: userId,
      username,
      email,
      firstName: cu.firstName ?? "",
      lastName: cu.lastName ?? "",
      avatar: cu.imageUrl,
      role: adminEmails.includes(email.toLowerCase()) ? "ADMIN" : "MEMBER",
      ranks: {
        create: DEFAULT_RANK,
      },
    },
  });
});
