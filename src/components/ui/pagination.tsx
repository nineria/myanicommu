import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function pageItems(page: number, count: number): (number | "gap")[] {
  const set = new Set([1, count, page - 1, page, page + 1]);
  const nums = [...set]
    .filter((n) => n >= 1 && n <= count)
    .sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

const item =
  "grid h-9 min-w-9 place-items-center rounded-none px-3 text-sm font-medium transition-colors";

/** Link-based pager; `hrefFor` builds the URL for a page number. */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  className,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  className?: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav
      aria-label="การแบ่งหน้า"
      className={cn(
        "flex flex-wrap items-center justify-center gap-1",
        className,
      )}
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label="หน้าก่อนหน้า"
          className={cn(item, "hover:bg-accent")}
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pageItems(page, pageCount).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            aria-label={`หน้า ${n}`}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              item,
              n === page
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent",
            )}
          >
            {n}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          aria-label="หน้าถัดไป"
          className={cn(item, "hover:bg-accent")}
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
