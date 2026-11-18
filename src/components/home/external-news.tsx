import { ExternalLink } from "lucide-react";
import type { ExternalNewsItem } from "@/lib/external-news";

const fmt = (d: Date) =>
  d.toLocaleDateString("th-TH", { month: "short", day: "numeric" });

/** Headlines from other anime news sites. Each row links out to the original article. */
export function ExternalNews({ items }: { items: ExternalNewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="external-news-title"
      className="rounded-lg bg-card shadow-md"
    >
      <div className="flex items-baseline justify-between gap-2 border-primary/30 border-b-2 px-3 py-1">
        <h2 id="external-news-title" className="text-sm font-bold md:text-base">
          ข่าวอนิเมะจากทั่วโลก
        </h2>
        <span className="text-xs text-muted-foreground">
          via Anime News Network
        </span>
      </div>
      <ul className="flex flex-col gap-[3px] bg-background pb-0">
        {items.map((n) => (
          <li key={n.link}>
            <a
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-3 bg-card px-3 py-2 hover:brightness-95"
            >
              <span className="min-w-0">
                <span className="block font-semibold group-hover:underline">
                  {n.title}
                </span>
                {n.summary && (
                  <span className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {n.summary}
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {n.category && (
                  <span className="rounded-sm bg-primary px-1 text-white">
                    {n.category}
                  </span>
                )}
                {fmt(n.publishedAt)}
                <ExternalLink className="size-3" aria-hidden />
                <span className="sr-only">(เปิดในแท็บใหม่)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
