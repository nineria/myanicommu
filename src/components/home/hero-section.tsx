import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

export function HeroSection({ posts }: { posts: PostCardData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-lg bg-card px-3 py-1 text-sm font-bold text-foreground drop-shadow md:text-base">
        <div className="flex items-center gap-2">
          <Link
            href="/posts"
            className="cursor-pointer truncate hover:underline"
          >
            โพสต์ใหม่ที่น่าสนใจ
          </Link>
          <span className="rounded-sm bg-primary px-1 text-xs text-white">
            New
          </span>
        </div>
      </div>
      <div className="mt-0.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} layout="grid" />
        ))}
      </div>
    </div>
  );
}
