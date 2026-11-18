import Link from "next/link";
import { cn } from "@/lib/utils";

/** MyAniCommu wordmark (VoiceBox): heavy Archivo Black with "Ani" knocked out of one red block. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="MyAniCommu"
      className={cn(
        "inline-flex items-center leading-none tracking-[-0.02em] text-foreground uppercase",
        className,
      )}
      style={{ fontFamily: "var(--font-archivo), Impact, sans-serif" }}
    >
      <span>My</span>
      <span className="mx-[0.1em] bg-primary px-[0.22em] py-[0.12em] text-primary-foreground">
        Ani
      </span>
      <span>Commu</span>
    </Link>
  );
}

export function ResponsiveLogo() {
  return <Logo className="text-xl sm:text-2xl" />;
}
