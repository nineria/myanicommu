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

const GHOST: Record<PostCardData["kind"], string> = {
  NEWS: "News",
  REVIEW: "Review",
  QNA: "Question",
  GENERAL: "Other",
};

function Ghost({
  kind,
  className,
}: {
  kind: PostCardData["kind"];
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("ghost-word", className)}>
      {GHOST[kind]}
    </span>
  );
}

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

const CARD =
  "group relative flex overflow-hidden rounded-xl border bg-muted text-white outline-none transition-colors hover:border-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/60";

/** Signature card: the cover is the background, text sits on a flat scrim. */
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
  const feature = layout === "feature";
  const list = layout === "list";
  return (
    <Link
      href={href}
      className={cn(
        CARD,
        feature && "h-full min-h-72",
        list && "min-h-32",
        layout === "grid" && "aspect-[4/3] h-full",
      )}
    >
      <Image
        src={post.image}
        alt=""
        fill
        priority={priority}
        sizes={
          feature
            ? "(min-width:1024px) 640px, 100vw"
            : "(min-width:1024px) 320px, (min-width:640px) 45vw, 100vw"
        }
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/45" />
      <Ghost
        kind={post.kind}
        className={cn(
          "text-white opacity-[0.14]",
          feature
            ? "text-[7rem] sm:text-[9rem]"
            : list
              ? "text-5xl"
              : "text-6xl",
        )}
      />
      <div
        className={cn(
          "relative z-10 mt-auto flex w-full flex-col gap-2",
          feature ? "p-5 sm:p-6" : "p-3.5",
        )}
      >
        <Tags post={post} />
        <h2
          className={cn(
            "font-semibold",
            feature
              ? "line-clamp-3 text-xl leading-snug sm:text-2xl"
              : "line-clamp-2",
          )}
          title={post.title}
        >
          {post.title}
        </h2>
        <Meta post={post} className="text-white/80" />
      </div>
    </Link>
  );
}
