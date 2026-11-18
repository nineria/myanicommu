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
  priority,
}: {
  post: PostCardData;
  layout?: "grid" | "list";
  priority?: boolean;
}) {
  const href = `/posts/${post.author.username}/${post.id}`;
  const badges = post.tags.map((t) => (
    <TagBadge key={t.label} label={t.label} from={t.colorFrom} to={t.colorTo} />
  ));
  const meta = (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <Clock className="size-3.5 text-primary" />
        <span className="text-muted-foreground">{fmt(post.createdAt)}</span>
      </span>
      <span className="flex items-center gap-1">
        <ThumbsUp className="size-3.5 text-primary" />
        <span className="text-muted-foreground">{kFormatter(post.likes)}</span>
      </span>
      <span className="flex items-center gap-1">
        <Star className="size-3.5 text-primary" />
        <span className="text-muted-foreground">{post.stars}</span>
      </span>
    </div>
  );

  if (layout === "list") {
    return (
      <Link
        href={href}
        className="relative flex w-full overflow-hidden rounded-lg shadow-sm transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring dark:hover:brightness-90"
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
        <div className="@container relative flex min-h-[120px] flex-1 flex-col justify-between gap-2 overflow-hidden bg-card px-4 py-3 text-foreground">
          <Watermark kind={post.kind} />
          <div className="relative z-10 flex flex-wrap gap-1 text-sm">
            {badges}
          </div>
          <h2
            className="relative z-10 truncate text-base font-bold"
            title={post.title}
          >
            {post.title}
          </h2>
          <div className="relative z-10">{meta}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-sm transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-ring dark:hover:brightness-90",
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
          priority={priority}
          sizes="(min-width:768px) 33vw, 100vw"
          className="object-contain"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 text-sm">
          {badges}
        </div>
      </div>
      <div className="@container relative flex flex-1 flex-col gap-3 overflow-hidden p-4 text-foreground">
        <Watermark kind={post.kind} />
        <h2
          className="relative z-10 line-clamp-2 text-base leading-snug font-bold"
          title={post.title}
        >
          {post.title}
        </h2>
        <div className="relative z-10 mt-auto">{meta}</div>
      </div>
    </Link>
  );
}

/**
 * Signature background word (REVIEW / NEWS / QUESTION). Decorative, sits behind the text.
 * Sized from the card's own width so every word spans ~90% of it, capped to fit the text area height.
 */
function Watermark({ kind }: { kind: string }) {
  const word = KIND_WATERMARK[kind] ?? "";
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-3 bottom-1 z-0 font-bold leading-none tracking-tighter uppercase opacity-[0.07] select-none"
      style={{
        fontSize: `min(calc(90cqw / ${(word.length * 0.62).toFixed(2)}), 5.5rem)`,
      }}
    >
      {word}
    </span>
  );
}
