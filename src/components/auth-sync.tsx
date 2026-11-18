"use client";

import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Sign-in/out happens client-side (Clerk modal), so the cached `user.me` query and
 * server-rendered pages would stay stale until a reload. When the Clerk user changes,
 * invalidate every cached query and re-run the server components.
 */
export function AuthSync() {
  const { isLoaded, userId } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const previous = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    const current = userId ?? null;
    if (previous.current !== undefined && previous.current !== current) {
      void queryClient.invalidateQueries();
      router.refresh();
    }
    previous.current = current;
  }, [isLoaded, userId, queryClient, router]);

  return null;
}
