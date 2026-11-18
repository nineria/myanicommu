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

/** Gradient pill used for post tags and user ranks. */
export function TagBadge({
  label,
  from,
  to,
  deg = 30,
  className,
}: {
  label: string;
  from: string;
  to: string;
  deg?: number;
  className?: string;
}) {
  return (
    <Badge
      className={cn("border-0 px-2.5 text-white shadow-sm", className)}
      style={{
        backgroundImage: `linear-gradient(${deg}deg, ${c(from)}, ${c(to)})`,
        textShadow: "0 1px 1px rgb(0 0 0 / 0.25)",
      }}
    >
      {label}
    </Badge>
  );
}
