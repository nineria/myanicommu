import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

/**
 * Newest posts. The lead post's cover bleeds into the page as a soft glow:
 * the one expressive moment on the home page.
 */
export function HeroSection({ posts }: { posts: PostCardData[] }) {
  const [lead, ...rest] = posts;
  return (
    <section className="relative isolate" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 top-0 -z-10 h-[30rem] overflow-hidden opacity-40 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_70%)] dark:opacity-30"
      >
        <Image
          src={lead.image}
          alt=""
          fill
          sizes="256px"
          className="scale-125 object-cover blur-3xl saturate-150"
        />
      </div>

      <div className="mb-4 flex items-end justify-between">
        <h1 id="hero-title" className="text-2xl font-bold sm:text-3xl">
          โพสต์ใหม่ที่น่าสนใจ
        </h1>
        <Link
          href="/posts"
          className="text-sm font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <PostCard post={lead} layout="feature" priority />
        {rest.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((p) => (
              <PostCard key={p.id} post={p} layout="list" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
