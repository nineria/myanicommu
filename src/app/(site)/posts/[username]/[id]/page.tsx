import { TRPCError } from "@trpc/server";
import { Clock, MessageCircle, Star, ThumbsUp, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment/comment-section";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { AuthorPanel } from "@/components/post/author-panel";
import { ExternalLinkGuard } from "@/components/post/external-link-guard";
import { PostActions } from "@/components/post/post-actions";
import { PostCard } from "@/components/post/post-card";
import { TagBadge } from "@/components/post/tag-badge";
import { Badge } from "@/components/ui/badge";
import { kFormatter, stripHtml } from "@/lib/utils";
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
  const api = await getApi();
  const [byAuthor, sameKind] = await Promise.all([
    api.post.byAuthor({ username }),
    api.post.list({ kind: post.kind, take: 8 }),
  ]);
  const moreFromAuthor = byAuthor.filter((p) => p.id !== post.id).slice(0, 3);
  const shown = new Set([post.id, ...moreFromAuthor.map((p) => p.id)]);
  const related = sameKind.filter((p) => !shown.has(p.id)).slice(0, 3);

  // ~900 characters a minute for mixed Thai/English text.
  const readMinutes = Math.max(
    1,
    Math.round(stripHtml(post.content).length / 900),
  );
  const edited =
    post.updatedAt.getTime() - post.createdAt.getTime() > 60 * 60 * 1000;
  const fmt = (d: Date) =>
    d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            <dt className="sr-only">เผยแพร่</dt>
            <dd>
              {fmt(post.createdAt)}
              {edited && ` · แก้ไข ${fmt(post.updatedAt)}`} · อ่าน {readMinutes}{" "}
              นาที
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="size-3.5" aria-hidden />
            <dt className="sr-only">ถูกใจ</dt>
            <dd>{kFormatter(post.likeCount)} ถูกใจ</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="size-3.5" aria-hidden />
            <dt className="sr-only">คะแนน</dt>
            <dd>
              {post.starCount
                ? `${(Math.round(post.starAverage * 10) / 10).toFixed(1)} (${post.starCount} คน)`
                : "ยังไม่มีคะแนน"}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="size-3.5" aria-hidden />
            <dt className="sr-only">ความคิดเห็น</dt>
            <dd>{kFormatter(post._count.comments)} ความคิดเห็น</dd>
          </div>
        </dl>

        <div className="overflow-hidden rounded-lg bg-card">
          <div className="flex flex-col md:flex-row">
            <div className="bg-muted/40 md:w-56 md:shrink-0">
              <AuthorPanel
                author={post.author}
                date={post.createdAt}
                stars={Math.round(post.starAverage * 10) / 10}
                likes={post.likeCount}
              />
            </div>
            <div className="min-w-0 flex-1 p-5 md:p-6">
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

        {moreFromAuthor.length > 0 && (
          <section aria-labelledby="more-author" className="pt-4">
            <SectionHeading
              id="more-author"
              title={`โพสต์อื่นจาก ${post.author.username}`}
              action={
                <Link
                  href={`/${post.author.username}`}
                  className="eyebrow text-primary hover:underline"
                >
                  ดูทั้งหมด ({post.author._count.posts})
                </Link>
              }
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {moreFromAuthor.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related" className="pt-4">
            <SectionHeading id="related" title="โพสต์ที่เกี่ยวข้อง" />
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
