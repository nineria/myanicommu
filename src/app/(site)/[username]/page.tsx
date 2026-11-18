import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { AdminPanel } from "@/components/profile/admin-panel";
import { PostsTable } from "@/components/profile/posts-table";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { getCurrentUser } from "@/lib/auth";
import { getApi } from "@/trpc/caller";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `โปรไฟล์ของ ${decodeURIComponent(username)}` };
}

export default async function ProfilePage({ params }: Props) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);
  const api = await getApi();
  const [user, me] = await Promise.all([
    api.user.byUsername({ username }),
    getCurrentUser(),
  ]);
  if (!user) notFound();

  const posts = await api.post.byAuthor({ username });
  const isOwner = me?.id === user.id;

  return (
    <PageShell>
      <div className="space-y-4">
        <ProfileHeader user={user} isOwner={isOwner} />
        <ProfileStats
          username={username}
          posts={posts}
          given={{
            comments: user._count.comments,
            likes: user._count.likes,
            stars: user._count.stars,
          }}
        />
        {posts.length > 0 ? (
          <PostsTable posts={posts} username={username} />
        ) : (
          <p className="rounded-lg bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
            {isOwner ? "คุณยังไม่มีโพสต์" : "ยังไม่มีโพสต์"}
          </p>
        )}
        {isOwner && me?.role === "ADMIN" && <AdminPanel />}
      </div>
    </PageShell>
  );
}
