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

const channel = (n: number) => {
  const v = n / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
function luminance(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 0;
  const n = Number.parseInt(m[1], 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

/** Black scrim strength so white label text reaches 4.5:1 on the lighter stop. */
function scrim(from: string, to: string) {
  const lum = Math.max(luminance(c(from)), luminance(c(to)));
  // white vs colour: 1.05 / (lum' + 0.05) >= 4.5  ->  lum' <= 0.183
  if (lum <= 0.183) return 0;
  return Math.min(0.6, 1 - (0.183 / lum) ** (1 / 2.2));
}

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
      className={cn("border-0 text-white", className)}
      style={{
        backgroundImage: `linear-gradient(rgb(0 0 0 / ${scrim(from, to).toFixed(2)}), rgb(0 0 0 / ${scrim(from, to).toFixed(2)})), linear-gradient(${deg}deg, ${c(from)}, ${c(to)})`,
      }}
    >
      {label}
    </Badge>
  );
}
