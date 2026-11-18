import { cn } from "@/lib/utils";

/**
 * Section title: a real heading on the page background (no chip), with an
 * optional trailing action. One style for every section so rhythm stays even.
 */
export function SectionHeading({
  id,
  title,
  badge,
  action,
  as: Heading = "h2",
  className,
}: {
  id?: string;
  title: string;
  badge?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-3 flex min-h-11 items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Heading
          id={id}
          className={cn(
            "truncate font-display font-bold tracking-tight text-foreground",
            Heading === "h1" ? "text-2xl" : "text-xl",
          )}
        >
          {title}
        </Heading>
        {badge && (
          <span className="bg-primary px-2 py-0.5 text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-primary-foreground">
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

/** Trailing "see all" link used in section headings. */
export const sectionLinkClass =
  "inline-flex min-h-11 items-center eyebrow text-primary hover:underline";
