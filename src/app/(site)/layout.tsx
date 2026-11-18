import { Suspense } from "react";
import { CONTAINER_CLASS } from "@/components/layout/container";
import { Footer, FooterSkeleton } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";
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
        <main className={cn(CONTAINER_CLASS, "flex-1 pt-4 pb-6 sm:pt-6")}>
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
