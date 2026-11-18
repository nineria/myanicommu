import {
  OrigamiCheck,
  type OrigamiIcon,
  OrigamiPlane,
  OrigamiWarning,
} from "@/components/post/origami-icons";
import { cn } from "@/lib/utils";

const STYLE = {
  DANGER: { color: "border-red-500 bg-red-500", icon: OrigamiWarning },
  WARNING: { color: "border-orange-500 bg-orange-500", icon: OrigamiPlane },
  SUCCESS: { color: "border-green-500 bg-green-500", icon: OrigamiCheck },
} as const;

/** Old Mantine-era alert: coloured frame + icon strip around a flat card. */
export function AlertBox({
  color,
  icon: Icon = OrigamiPlane,
  children,
  action,
}: {
  color: string;
  icon?: OrigamiIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg shadow-sm" role="status">
      <div
        className={cn("flex flex-row items-center rounded-lg border-2", color)}
      >
        <Icon size={26} className="m-2 shrink-0 shadow-sm-sm" />
        <div className="relative flex w-full flex-row rounded-r-[14px] bg-card px-4 py-3 text-foreground">
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
  type: keyof typeof STYLE;
  title: string;
  content: string;
}) {
  return (
    <AlertBox color={STYLE[type].color} icon={STYLE[type].icon}>
      <h1 className="text-base font-bold">{title}</h1>
      <div
        className="rich-text text-sm"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </AlertBox>
  );
}
