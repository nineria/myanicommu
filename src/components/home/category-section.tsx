import Link from "next/link";
import {
  SectionHeading,
  sectionLinkClass,
} from "@/components/layout/section-heading";
import { HOME_GRID_CLASS, PostCard } from "@/components/post/post-card";
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
      <SectionHeading
        id={id}
        title={title}
        action={
          <Link href={href} className={sectionLinkClass}>
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
