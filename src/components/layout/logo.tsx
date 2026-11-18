import Link from "next/link";
import { cn } from "@/lib/utils";

/** MyAniCommu wordmark: "My" blue, "A" accent, "niCommu" neutral. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("font-display font-semibold", className)}>
      <span className="text-[#4C6EF5]">My</span>
      <span className="text-primary">A</span>
      <span className="text-foreground opacity-80">niCommu</span>
    </Link>
  );
}

export function ResponsiveLogo() {
  return <Logo className="text-3xl" />;
}
