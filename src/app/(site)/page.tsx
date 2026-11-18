import { CategorySection } from "@/components/home/category-section";
import { ExternalNews } from "@/components/home/external-news";
import { HeroSection } from "@/components/home/hero-section";
import {
  CreateHomePostButton,
  HomePostCard,
  TopReviews,
} from "@/components/home/home-section";
import { WidePage } from "@/components/layout/page-shell";
import { getAnnNews } from "@/lib/external-news";
import { getApi } from "@/trpc/caller";

export const dynamic = "force-dynamic";

const fmt = (d: Date) =>
  d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function HomePage() {
  const api = await getApi();
  const [homePosts, today, reviews, news, qnas, general, annNews] =
    await Promise.all([
      api.homePost.list(),
      api.post.list({ take: 3 }),
      api.post.topReviews(),
      api.post.list({ kind: "NEWS", take: 3 }),
      api.post.list({ kind: "QNA", take: 3 }),
      api.post.list({ kind: "GENERAL", take: 3 }),
      getAnnNews(8),
    ]);

  return (
    <>
      <WidePage className="space-y-8">
        {homePosts.length > 0 && (
          <div className="space-y-3">
            {homePosts.map((p) => (
              <HomePostCard key={p.id} post={{ ...p, body: p.body }} />
            ))}
          </div>
        )}
        {today.length > 0 && <HeroSection posts={today} />}
        <div>
          <TopReviews
            reviews={reviews.map((r) => ({
              id: r.id,
              title: r.title,
              href: `/posts/${r.username}/${r.id}`,
              excerpt: r.excerpt,
              date: fmt(r.createdAt),
            }))}
          />
        </div>
        <CategorySection
          id="cat-news"
          title="ข่าวสาร"
          href="/news"
          posts={news}
        />
        <ExternalNews items={annNews} />
        <CategorySection
          id="cat-qna"
          title="Q&A ถาม-ตอบ"
          href="/qandas"
          posts={qnas}
        />
        <CategorySection
          id="cat-general"
          title="โพสต์ทั่วไป"
          href="/posts"
          posts={general}
        />
        <CreateHomePostButton />
      </WidePage>
    </>
  );
}
