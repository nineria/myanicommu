import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { SearchView } from "@/components/post/search-view";

export const metadata: Metadata = { title: "ค้นหา" };

export default function Page() {
  return (
    <PageShell>
      <Suspense>
        <SearchView />
      </Suspense>
    </PageShell>
  );
}
