"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOutLink() {
  const { signOut } = useClerk();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => signOut(() => router.push("/"))}
      className="mt-1 block w-full text-right text-sm text-muted-foreground hover:underline"
    >
      ออกจากระบบ
    </button>
  );
}
