import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  short,
}: {
  className?: string;
  short?: boolean;
}) {
  return (
    <Link href="/" className={cn("font-display font-semibold", className)}>
      <span className="text-[#4C6EF5]">My</span>
      <span className="text-primary">A</span>
      <span className="text-foreground opacity-80">
        {short ? "niCommu" : "nimeCommunity"}
      </span>
    </Link>
  );
}

/** Navbar logo: full name on md+, short name below. */
export function ResponsiveLogo() {
  return (
    <>
      <Logo className="hidden text-3xl md:block" />
      <Logo className="block text-3xl md:hidden" short />
    </>
  );
}
