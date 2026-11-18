import { WidePage } from "@/components/layout/page-shell";
import { AnnouncementBanner } from "@/components/post/announcement-banner";
import { PostListView } from "@/components/post/post-list-view";
import { getApi } from "@/trpc/caller";

const TITLES = {
  ALL: "โพสต์ทั้งหมด",
  NEWS: "ข่าวสาร",
  REVIEW: "รีวิว",
  QNA: "ถามตอบ Q&A",
} as const;

/** Shared by /posts, /news, /reviews and /qandas. */
export async function PostListPage({
  kind,
  searchParams,
}: {
  kind?: "NEWS" | "REVIEW" | "QNA";
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const q = (sp.q ?? "").trim().slice(0, 120);
  const api = await getApi();
  const [result, announcements] = await Promise.all([
    api.post.listPage({ kind, q, page }),
    api.announcement.published(),
  ]);

  return (
    <WidePage className="space-y-6">
      {announcements.map((a) => (
        <AnnouncementBanner
          key={a.id}
          type={a.type}
          title={a.title}
          content={a.content}
        />
      ))}
      <PostListView
        posts={result.items}
        page={result.page}
        pageCount={result.pageCount}
        q={q}
        title={TITLES[kind ?? "ALL"]}
      />
    </WidePage>
  );
}
