"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="block w-full text-sm text-muted-foreground hover:text-foreground"
    >
      {"< กลับไป"}
    </button>
  );
}
