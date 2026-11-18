"use client";

import { useRouter } from "next/navigation";

export function BackLink() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="block w-full opacity-80 hover:opacity-100"
    >
      {"< กลับไป"}
    </button>
  );
}
