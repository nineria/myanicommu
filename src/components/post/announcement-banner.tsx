import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR = {
  DANGER: "border-red-500 bg-red-500",
  WARNING: "border-orange-500 bg-orange-500",
  SUCCESS: "border-green-500 bg-green-500",
} as const;

/** Old Mantine-era alert: coloured frame + icon strip around a flat card. */
export function AlertBox({
  color,
  children,
  action,
}: {
  color: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg shadow-md" role="status">
      <div
        className={cn("flex flex-row items-center rounded-lg border-2", color)}
      >
        <AlertCircle size={25} className="m-1 shrink-0 text-white" />
        <div className="relative flex w-full flex-row rounded-r-lg bg-card px-2 py-2 text-foreground">
          <div className="w-full pr-8">{children}</div>
          {action}
        </div>
      </div>
    </div>
  );
}

export function AnnouncementBanner({
  type,
  title,
  content,
}: {
  type: keyof typeof COLOR;
  title: string;
  content: string;
}) {
  return (
    <AlertBox color={COLOR[type]}>
      <h1 className="text-sm font-bold md:text-base">{title}</h1>
      <div
        className="rich-text text-xs md:text-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </AlertBox>
  );
}
