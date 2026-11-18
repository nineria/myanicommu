import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

/** One home-page row per post category: heading, "ดูทั้งหมด" link and the latest few posts. */
export function CategorySection({
  id,
  title,
  href,
  posts,
}: {
  id: string;
  title: string;
  href: string;
  posts: PostCardData[];
}) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby={id}>
      <div className="flex items-center justify-between rounded-lg bg-card px-3 py-1 text-sm font-bold shadow md:text-base">
        <h2 id={id} className="truncate">
          {title}
        </h2>
        <Link
          href={href}
          className="text-xs font-normal text-foreground/60 hover:underline"
        >
          ดูทั้งหมด →
        </Link>
      </div>
      <div className="mt-0.5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} layout="grid" />
        ))}
      </div>
    </section>
  );
}
