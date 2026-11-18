import { cn } from "@/lib/utils";

/** Single source of truth for the site's content width. */
export const CONTAINER_CLASS = "mx-auto w-full max-w-5xl px-4";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(CONTAINER_CLASS, className)}>{children}</div>;
}
