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
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-4 py-6 text-center",
        !compact && "md:sticky md:top-20",
      )}
    >
      <Link href={`/${author.username}`} className="shrink-0">
        <Avatar className={compact ? "size-14" : "size-20 md:size-24"}>
          <AvatarImage src={author.avatar ?? undefined} alt={author.username} />
          <AvatarFallback>
            {author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 max-w-full">
        <Link
          href={`/${author.username}`}
          className="block truncate font-display text-lg leading-tight font-bold text-foreground hover:text-primary"
        >
          {author.username}
        </Link>
        <p
          className={cn(
            "eyebrow mt-0.5",
            author.role === "ADMIN" ? "text-primary" : "text-muted-foreground",
          )}
        >
          {author.role === "ADMIN" ? ADMIN_RANK_LABEL : "สมาชิก"}
        </p>
      </div>
      {author.ranks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {author.ranks.map((r) => (
            <TagBadge
              key={r.id}
              label={r.label}
              from={r.colorFrom}
              to={r.colorTo}
              deg={35}
            />
          ))}
        </div>
      )}
      {date !== undefined && (
        <dl className="grid w-full grid-cols-2 gap-px bg-border text-sm">
          <div className="col-span-2 bg-muted px-2 py-2">
            <dt className="eyebrow text-muted-foreground">โพสต์เมื่อ</dt>
            <dd className="text-foreground">{fmt(date)}</dd>
          </div>
          {stars !== undefined && (
            <div className="bg-muted px-2 py-2">
              <dt className="eyebrow text-muted-foreground">คะแนน</dt>
              <dd className="font-display font-bold text-foreground">
                {stars.toFixed(1)}
              </dd>
            </div>
          )}
          {likes !== undefined && (
            <div className="bg-muted px-2 py-2">
              <dt className="eyebrow text-muted-foreground">ถูกใจ</dt>
              <dd className="font-display font-bold text-foreground">
                {likes}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
