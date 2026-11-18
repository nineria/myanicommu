import { Clock, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TagBadge } from "@/components/post/tag-badge";
import { KIND_WATERMARK } from "@/lib/constants";
import { cn, kFormatter } from "@/lib/utils";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function PostCard({
  post,
  layout = "grid",
}: {
  post: PostCardData;
  layout?: "grid" | "list";
}) {
  const href = `/posts/${post.author.username}/${post.id}`;
  const badges = post.tags.map((t) => (
    <TagBadge key={t.label} label={t.label} from={t.colorFrom} to={t.colorTo} />
  ));
  const meta = (
    <div className="flex items-center gap-4 text-sm">
      <span className="flex items-center gap-1">
        <Clock className="size-3.5 text-primary" />
        <span className="opacity-80">{fmt(post.createdAt)}</span>
      </span>
      <span className="flex items-center gap-1">
        <ThumbsUp className="size-3.5 text-primary" />
        <span className="opacity-80">{kFormatter(post.likes)}</span>
      </span>
      <span className="flex items-center gap-1">
        <Star className="size-3.5 text-primary" />
        <span className="opacity-80">{post.stars}</span>
      </span>
    </div>
  );

  if (layout === "list") {
    return (
      <Link
        href={href}
        className="relative flex w-full overflow-hidden rounded-lg shadow-md hover:brightness-90"
      >
        <div className="relative hidden h-[120px] w-[350px] shrink-0 overflow-hidden sm:block">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="350px"
            className="scale-110 object-cover blur-[3px]"
          />
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="350px"
            className="object-contain"
          />
        </div>
        <div className="relative flex min-h-[120px] flex-1 flex-col justify-between gap-2 bg-card px-3 py-2 text-foreground">
          <div className="flex flex-wrap gap-1 text-sm">{badges}</div>
          <h2 className="truncate text-base font-bold" title={post.title}>
            {post.title}
          </h2>
          {meta}
          <span className="pointer-events-none absolute right-2 bottom-2 text-6xl font-bold tracking-tighter uppercase opacity-5">
            {KIND_WATERMARK[post.kind]}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-md hover:brightness-90",
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width:768px) 33vw, 100vw"
          className="scale-110 object-cover blur-[3px]"
        />
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width:768px) 33vw, 100vw"
          className="object-contain"
        />
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 text-sm">
          {badges}
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-2 p-3 text-foreground">
        <h2 className="line-clamp-2 text-base font-bold" title={post.title}>
          {post.title}
        </h2>
        <div className="mt-auto">{meta}</div>
        <span className="pointer-events-none absolute right-2 bottom-1 text-5xl font-bold tracking-tighter uppercase opacity-5">
          {KIND_WATERMARK[post.kind]}
        </span>
      </div>
    </Link>
  );
}
