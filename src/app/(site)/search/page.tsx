import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/post/search-view";

export const metadata: Metadata = { title: "ค้นหา" };

export default function Page() {
  return (
    <div className="w-full">
      <Suspense>
        <SearchView />
      </Suspense>
    </div>
  );
}
