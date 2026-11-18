import Link from "next/link";
import {
  SectionHeading,
  sectionLinkClass,
} from "@/components/layout/section-heading";
import { HOME_GRID_CLASS, PostCard } from "@/components/post/post-card";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

export function HeroSection({ posts }: { posts: PostCardData[] }) {
  return (
    <section aria-labelledby="hero-title">
      <SectionHeading
        id="hero-title"
        title="โพสต์ใหม่ที่น่าสนใจ"
        badge="New"
        action={
          <Link href="/posts" className={sectionLinkClass}>
            ดูทั้งหมด
          </Link>
        }
      />
      <div className={HOME_GRID_CLASS}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} layout="grid" prefetch />
        ))}
      </div>
    </section>
  );
}
