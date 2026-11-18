import { TRPCError } from "@trpc/server";
import { User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment/comment-section";
import { PageShell } from "@/components/layout/page-shell";
import { AuthorPanel } from "@/components/post/author-panel";
import { ExternalLinkGuard } from "@/components/post/external-link-guard";
import { PostActions } from "@/components/post/post-actions";
import { TagBadge } from "@/components/post/tag-badge";
import { Badge } from "@/components/ui/badge";
import { stripHtml } from "@/lib/utils";
import { getApi } from "@/trpc/caller";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ username: string; id: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
};

async function load(username: string, id: string) {
  const api = await getApi();
  try {
    const post = await api.post.byId({ id });
    if (post.author.username !== username) return null;
    return post;
  } catch (e) {
    if (e instanceof TRPCError && e.code === "NOT_FOUND") return null;
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, id } = await params;
  const post = await load(username, id);
  if (!post) return {};
  const description = stripHtml(post.content).slice(0, 200);
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description, images: [post.image] },
  };
}

export default async function PostPage({ params }: Props) {
  const { username, id } = await params;
  const post = await load(username, id);
  if (!post) notFound();

  const path = `/posts/${username}/${id}`;

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-4">
        <nav className="flex items-center gap-2 truncate text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            หน้าหลัก
          </Link>
          →
          <Link href="/posts" className="hover:underline">
            โพสต์ทั้งหมด
          </Link>
          →<span className="truncate">{id}</span>
        </nav>

        <div className="text-foreground">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {post.tags.map((t) => (
              <TagBadge
                key={t.label}
                label={t.label}
                from={t.colorFrom}
                to={t.colorTo}
              />
            ))}
            <h1 className="ml-1 text-xl font-bold sm:text-2xl">{post.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="mr-1 flex items-center gap-0.5">
              <User className="size-3.5" />
              {post.author.username}
            </span>
            {post.genres.map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-card shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-56 md:shrink-0 md:border-r">
              <AuthorPanel
                author={post.author}
                date={post.createdAt}
                stars={Math.round(post.starAverage * 10) / 10}
                likes={post.likeCount}
              />
            </div>
            <div className="min-w-0 flex-1 border-t p-5 md:border-t-0 md:p-6">
              {/* biome-ignore lint/performance/noImgElement: arbitrary remote post image */}
              <img
                src={post.image}
                alt={post.title}
                className="mx-auto mb-5 max-h-[28rem] rounded-lg object-contain"
              />
              <ExternalLinkGuard>
                <div
                  className="rich-text text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </ExternalLinkGuard>
              {post.credit && (
                <p className="mt-5 text-sm text-muted-foreground">
                  เครดิต : {post.credit}
                </p>
              )}
            </div>
          </div>
          <PostActions
            username={username}
            post={{
              id: post.id,
              title: post.title,
              authorId: post.authorId,
              liked: post.liked,
              likeCount: post.likeCount,
              myStar: post.myStar,
              form: {
                id: post.id,
                title: post.title,
                tags: post.tags,
                genres: post.genres,
                image: post.image,
                content: post.content,
                credit: post.credit,
              },
            }}
          />
        </div>

        <ExternalLinkGuard>
          <CommentSection
            postId={post.id}
            postTitle={post.title}
            postPath={path}
          />
        </ExternalLinkGuard>
      </div>
    </PageShell>
  );
}
