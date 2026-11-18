import Link from "next/link";
import { cn } from "@/lib/utils";

/** Monogram tile + wordmark. The tile takes the active accent colour. */
export function Logo({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="MyAniCommu"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl font-semibold tracking-tight",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-base leading-none font-bold text-primary-foreground"
      >
        A
      </span>
      {!compact && (
        <span className="text-lg leading-none">
          My<span className="text-primary">Ani</span>Commu
        </span>
      )}
    </Link>
  );
}

export function ResponsiveLogo() {
  return <Logo />;
}
