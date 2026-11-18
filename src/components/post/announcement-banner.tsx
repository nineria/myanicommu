import { AlertTriangle, CheckCircle2, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLE = {
  DANGER: {
    box: "border-red-500 bg-red-500/10",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  WARNING: {
    box: "border-yellow-500 bg-yellow-500/10",
    icon: Megaphone,
    color: "text-yellow-500",
  },
  SUCCESS: {
    box: "border-teal-500 bg-teal-500/10",
    icon: CheckCircle2,
    color: "text-teal-500",
  },
} as const;

export function AnnouncementBanner({
  type,
  title,
  content,
}: {
  type: keyof typeof STYLE;
  title: string;
  content: string;
}) {
  const s = STYLE[type];
  const Icon = s.icon;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border-l-4 p-3 text-foreground",
        s.box,
      )}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", s.color)} />
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <div
          className="rich-text text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
