import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAMED: Record<string, string> = {
  indigo: "#4c6ef5",
  cyan: "#15aabf",
  red: "#fa5252",
  teal: "#12b886",
  lime: "#82c91e",
  orange: "#fd7e14",
};
const c = (v: string) => NAMED[v] ?? v;

/** Neutral label with a colour dot (post tags and user ranks). Text stays high-contrast. */
export function TagBadge({
  label,
  from,
  className,
}: {
  label: string;
  from: string;
  /** Kept for call-site compatibility; badges no longer render gradients. */
  to?: string;
  deg?: number;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-md border-border bg-card px-2 font-medium text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-2 rounded-full"
        style={{ backgroundColor: c(from) }}
      />
      {label}
    </Badge>
  );
}
