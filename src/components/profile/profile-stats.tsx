import { FileText, Heart, MessageCircle, Star, Trophy } from "lucide-react";
import Link from "next/link";
import {
  PostKindChart,
  PostsPerMonthChart,
} from "@/components/profile/profile-charts";
import { kFormatter } from "@/lib/utils";
import type { PostCard } from "@/trpc/routers/post";

const KINDS = [
  { key: "NEWS", label: "ข่าวสาร", color: "var(--primary)" },
  { key: "REVIEW", label: "รีวิว", color: "var(--foreground)" },
  { key: "QNA", label: "คำถาม", color: "#737373" },
  { key: "GENERAL", label: "ทั่วไป", color: "#a3a3a3" },
] as const;

const MONTHS = 6;

function lastMonths(posts: PostCard[]) {
  const now = new Date();
  const buckets = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("th-TH", { month: "short" }),
      count: 0,
    };
  });
  for (const p of posts) {
    const d = new Date(p.createdAt);
    const b = buckets.find(
      (x) => x.key === `${d.getFullYear()}-${d.getMonth()}`,
    );
    if (b) b.count++;
  }
  return buckets;
}

export function ProfileStats({
  username,
  posts,
  given,
}: {
  username: string;
  posts: PostCard[];
  /** What this user has done to others: comments written, likes and stars given. */
  given: { comments: number; likes: number; stars: number };
}) {
  const likesReceived = posts.reduce((a, p) => a + p.likes, 0);
  const commentsReceived = posts.reduce((a, p) => a + p.comments, 0);
  const rated = posts.filter((p) => p.stars > 0);
  const avgRating = rated.length
    ? rated.reduce((a, p) => a + p.stars, 0) / rated.length
    : 0;
  const top = [...posts].sort((a, b) => b.likes - a.likes)[0];

  const months = lastMonths(posts);
  const kinds = KINDS.map((k) => ({
    ...k,
    count: posts.filter((p) => p.kind === k.key).length,
  })).filter((k) => k.count > 0);

  const kpis = [
    { label: "โพสต์", value: kFormatter(posts.length), icon: FileText },
    { label: "ถูกใจที่ได้รับ", value: kFormatter(likesReceived), icon: Heart },
    {
      label: "ความคิดเห็นที่ได้รับ",
      value: kFormatter(commentsReceived),
      icon: MessageCircle,
    },
    {
      label: "คะแนนเฉลี่ย",
      value: avgRating ? avgRating.toFixed(1) : "-",
      icon: Star,
    },
  ];

  return (
    <section aria-labelledby="stats-title" className="bg-card p-4 sm:p-6">
      <h2
        id="stats-title"
        className="font-display text-lg font-bold text-foreground"
      >
        สถิติ
      </h2>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-muted p-3">
            <dd className="font-display text-3xl leading-none font-bold text-foreground">
              {k.value}
            </dd>
            <dt className="eyebrow mt-2 flex items-center gap-1 text-muted-foreground">
              {k.icon && (
                <k.icon className="size-3 shrink-0 text-primary" aria-hidden />
              )}
              <span>{k.label}</span>
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <figure>
          <figcaption className="eyebrow mb-2 text-foreground">
            โพสต์ต่อเดือน{" "}
            <span className="font-medium tracking-normal text-muted-foreground normal-case">
              ({MONTHS} เดือนล่าสุด)
            </span>
          </figcaption>
          <PostsPerMonthChart
            data={months.map((m) => ({ month: m.label, posts: m.count }))}
          />
        </figure>

        <figure>
          <figcaption className="eyebrow mb-2 text-foreground">
            ประเภทโพสต์
          </figcaption>
          {kinds.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>
          ) : (
            <PostKindChart
              data={kinds.map((k) => ({
                kind: k.key,
                label: k.label,
                count: k.count,
                fill: k.color,
              }))}
            />
          )}
        </figure>
      </div>

      {top && top.likes > 0 && (
        <Link
          href={`/posts/${username}/${top.id}`}
          className="mt-5 flex items-center gap-3 bg-muted p-3 transition-colors hover:bg-accent"
        >
          <Trophy className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="eyebrow block text-muted-foreground">
              โพสต์ยอดนิยม
            </span>
            <span className="block truncate font-display text-sm font-bold text-foreground">
              {top.title}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <Heart className="size-3.5" aria-hidden /> {top.likes}
          </span>
        </Link>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        ให้ถูกใจ {kFormatter(given.likes)} · ให้ดาว {kFormatter(given.stars)} ·
        แสดงความคิดเห็น {kFormatter(given.comments)}
      </p>
    </section>
  );
}
