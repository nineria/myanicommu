import { Suspense } from "react";
import { Footer, FooterSkeleton } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Navbar } from "@/components/layout/navbar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

/**
 * Persistent chrome. Navbar and tab bar render immediately; the footer streams
 * in behind a Suspense boundary, and each route's loading.tsx only swaps <main>.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  prefetch(trpc.user.me.queryOptions());
  return (
    <HydrateClient>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10">
          {children}
        </main>
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
        <MobileTabBar />
      </div>
    </HydrateClient>
  );
}
