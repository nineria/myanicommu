import { TRPCError } from "@trpc/server";
import { ChevronRight, User } from "lucide-react";
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
      <article className="space-y-4">
        <nav
          aria-label="breadcrumb"
          className="flex items-center gap-1.5 truncate text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground">
            หน้าหลัก
          </Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href="/posts" className="hover:text-foreground">
            โพสต์ทั้งหมด
          </Link>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.map((t) => (
              <TagBadge
                key={t.label}
                label={t.label}
                from={t.colorFrom}
                to={t.colorTo}
              />
            ))}
          </div>
          <h1 className="text-2xl leading-snug font-bold sm:text-3xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/${post.author.username}`}
              className="flex items-center gap-1 font-medium text-foreground hover:text-primary"
            >
              <User className="size-3.5" />
              {post.author.username}
            </Link>
            {post.genres.map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="rounded-md text-[11px]"
              >
                {g}
              </Badge>
            ))}
          </div>
        </header>

        <div className="relative overflow-hidden rounded-3xl bg-muted">
          {/* biome-ignore lint/performance/noImgElement: arbitrary remote post image */}
          <img
            src={post.image}
            alt={post.title}
            className="mx-auto max-h-[28rem] w-full object-contain"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="flex flex-col md:flex-row">
            <div className="border-b md:w-56 md:shrink-0 md:border-r md:border-b-0">
              <AuthorPanel
                author={post.author}
                date={post.createdAt}
                stars={Math.round(post.starAverage * 10) / 10}
                likes={post.likeCount}
              />
            </div>
            <div className="min-w-0 flex-1 p-5">
              <ExternalLinkGuard>
                <div
                  className="rich-text text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </ExternalLinkGuard>
              {post.credit && (
                <p className="mt-4 text-xs text-muted-foreground">
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
      </article>
    </PageShell>
  );
}
