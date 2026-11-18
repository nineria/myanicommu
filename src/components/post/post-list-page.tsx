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
}: {
  kind?: "NEWS" | "REVIEW" | "QNA";
}) {
  const api = await getApi();
  const [posts, announcements] = await Promise.all([
    api.post.list({ kind, take: 100 }),
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
      <PostListView posts={posts} title={TITLES[kind ?? "ALL"]} />
    </WidePage>
  );
}
