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
      <div className="mb-4 flex items-end justify-between">
        <h2 id={id} className="text-xl font-bold sm:text-2xl">
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} layout="grid" />
        ))}
      </div>
    </section>
  );
}
