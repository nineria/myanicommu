"use client";

import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TagBadge } from "@/components/post/tag-badge";
import { cn } from "@/lib/utils";
import type { PostCard } from "@/trpc/routers/post";

type SortKey = "createdAt" | "likes" | "stars";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "createdAt", label: "ล่าสุด" },
  { key: "likes", label: "ถูกใจมากสุด" },
  { key: "stars", label: "ดาวมากสุด" },
];

export function PostsTable({
  posts,
  username,
}: {
  posts: PostCard[];
  username: string;
}) {
  const [key, setKey] = useState<SortKey>("createdAt");

  const sorted = useMemo(
    () =>
      [...posts].sort((a, b) =>
        key === "createdAt"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : b[key] - a[key],
      ),
    [posts, key],
  );

  return (
    <section className="bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-foreground">
          โพสต์ <span className="text-muted-foreground">({posts.length})</span>
        </h2>
        <div
          role="radiogroup"
          aria-label="เรียงโพสต์"
          className="flex gap-1 rounded-none bg-muted p-1"
        >
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              role="radio"
              aria-checked={key === s.key}
              onClick={() => setKey(s.key)}
              className={cn(
                "min-h-9 rounded-none px-3 text-xs font-medium text-muted-foreground transition-colors",
                key === s.key && "bg-card text-primary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {sorted.map((p) => (
          <li key={p.id}>
            <Link
              href={`/posts/${username}/${p.id}`}
              className="-mx-2 flex flex-col gap-1.5 rounded-md px-2 py-3 transition-colors hover:bg-muted/60"
            >
              <span className="line-clamp-2 font-medium text-foreground">
                {p.title}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex gap-1">
                  {p.tags.slice(0, 2).map((t) => (
                    <TagBadge
                      key={t.label}
                      label={t.label}
                      from={t.colorFrom}
                      to={t.colorTo}
                    />
                  ))}
                </span>
                <time dateTime={new Date(p.createdAt).toISOString()}>
                  {new Date(p.createdAt).toLocaleDateString("th-TH", {
                    dateStyle: "medium",
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <Heart className="size-3" aria-hidden /> {p.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3" aria-hidden /> {p.stars}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
