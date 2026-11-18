import { Advertisement } from "@/components/home/advertisement";
import { HeroSection } from "@/components/home/hero-section";
import {
  CreateHomePostButton,
  HomePostCard,
  TopReviews,
} from "@/components/home/home-section";
import { AdSide } from "@/components/layout/ad-side";
import { PageShell } from "@/components/layout/page-shell";
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
  const [homePosts, today, reviews] = await Promise.all([
    api.homePost.list(),
    api.post.list({ take: 3 }),
    api.post.topReviews(),
  ]);

  return (
    <PageShell ads={<AdSide />}>
      <div className="space-y-2">
        {today.length > 0 && <HeroSection posts={today} />}
        <TopReviews
          reviews={reviews.map((r) => ({
            id: r.id,
            title: r.title,
            href: `/posts/${r.username}/${r.id}`,
            excerpt: r.excerpt,
            date: fmt(r.createdAt),
          }))}
        />
        <div className="space-y-2">
          {homePosts.map((p) => (
            <HomePostCard key={p.id} post={{ ...p, body: p.body }} />
          ))}
        </div>
        <Advertisement />
        <CreateHomePostButton />
      </div>
    </PageShell>
  );
}
