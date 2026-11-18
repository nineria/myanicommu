import { Clock, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TagBadge } from "@/components/post/tag-badge";
import { cn, kFormatter } from "@/lib/utils";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function Meta({ post, className }: { post: PostCardData; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="flex items-center gap-1">
        <Clock className="size-3.5" />
        {fmt(post.createdAt)}
      </span>
      <span className="flex items-center gap-1">
        <ThumbsUp className="size-3.5" />
        {kFormatter(post.likes)}
      </span>
      <span className="flex items-center gap-1">
        <Star className="size-3.5" />
        {post.stars}
      </span>
    </div>
  );
}

function Tags({ post }: { post: PostCardData }) {
  return (
    <div className="flex flex-wrap gap-1">
      {post.tags.map((t) => (
        <TagBadge
          key={t.label}
          label={t.label}
          from={t.colorFrom}
          to={t.colorTo}
        />
      ))}
    </div>
  );
}

export function PostCard({
  post,
  layout = "grid",
  priority,
}: {
  post: PostCardData;
  layout?: "grid" | "list" | "feature";
  priority?: boolean;
}) {
  const href = `/posts/${post.author.username}/${post.id}`;

  if (layout === "feature") {
    return (
      <Link
        href={href}
        className="group relative flex h-full min-h-72 overflow-hidden rounded-3xl bg-card outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width:1024px) 640px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="relative z-10 mt-auto flex w-full flex-col gap-2 p-5 text-white sm:p-6">
          <Tags post={post} />
          <h2 className="line-clamp-3 text-xl leading-snug font-bold sm:text-2xl">
            {post.title}
          </h2>
          <Meta post={post} className="text-white/75" />
        </div>
      </Link>
    );
  }

  if (layout === "list") {
    return (
      <Link
        href={href}
        className="group flex gap-4 rounded-2xl border bg-card p-2.5 transition-colors outline-none hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <div className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-52">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="208px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-1 pr-2">
          <div className="space-y-1.5">
            <Tags post={post} />
            <h2 className="line-clamp-2 font-semibold" title={post.title}>
              {post.title}
            </h2>
          </div>
          <Meta post={post} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all outline-none hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width:1024px) 320px, (min-width:640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 z-10">
          <Tags post={post} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h2 className="line-clamp-2 font-semibold" title={post.title}>
          {post.title}
        </h2>
        <Meta post={post} className="mt-auto" />
      </div>
    </Link>
  );
}
