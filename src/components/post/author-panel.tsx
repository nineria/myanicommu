import { CalendarDays, Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/components/post/tag-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ADMIN_RANK_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Author = {
  username: string;
  avatar: string | null;
  role: "MEMBER" | "ADMIN";
  ranks: { id: string; label: string; colorFrom: string; colorTo: string }[];
};

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/** Left column of a post / comment: avatar, username, ranks. */
export function AuthorPanel({
  author,
  date,
  stars,
  likes,
  compact,
}: {
  author: Author;
  date?: Date | string;
  stars?: number;
  likes?: number;
  compact?: boolean;
}) {
  return (
    <div className="px-2 py-4">
      <div className="flex flex-wrap items-center justify-around gap-2">
        <Link href={`/${author.username}`}>
          <Avatar
            className={cn(
              "border-2 border-foreground/50",
              compact ? "size-14" : "size-20",
            )}
          >
            <AvatarImage
              src={author.avatar ?? undefined}
              alt={author.username}
            />
            <AvatarFallback>
              {author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/${author.username}`}
            className="text-red-500 hover:underline"
          >
            {author.username}
          </Link>
          <p
            className={cn(
              "text-xs",
              author.role === "ADMIN" ? "text-yellow-400" : "text-foreground",
            )}
          >
            {author.role === "ADMIN" ? ADMIN_RANK_LABEL : "สมาชิก"}
          </p>
        </div>
        {author.ranks.length > 0 && (
          <div className="flex flex-col gap-1">
            {author.ranks.map((r) => (
              <TagBadge
                key={r.id}
                label={r.label}
                from={r.colorFrom}
                to={r.colorTo}
                deg={35}
                className="w-full justify-center rounded-none"
              />
            ))}
          </div>
        )}
      </div>
      {date !== undefined && (
        <div className="mt-4 flex justify-around text-xs text-foreground/80">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {fmt(date)}
          </span>
          {stars !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5" />
              {stars} คะแนน
            </span>
          )}
          {likes !== undefined && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-3.5" />
              {likes} คน
            </span>
          )}
        </div>
      )}
    </div>
  );
}
