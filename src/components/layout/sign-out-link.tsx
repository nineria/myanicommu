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
      className="block py-1 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ออกจากระบบ
    </button>
  );
}
