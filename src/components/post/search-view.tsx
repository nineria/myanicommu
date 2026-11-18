"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import {
  EmptyState,
  LayoutToggle,
  PostGrid,
  PostGridSkeleton,
  useLayout,
} from "@/components/post/post-grid";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useTRPC } from "@/trpc/client";

export function SearchView() {
  const trpc = useTRPC();
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [pageParam, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );
  const [debounced] = useDebounce(q.trim(), 250);
  const [layout, setLayout] = useLayout();
  const { data, isFetching } = useQuery({
    ...trpc.post.listPage.queryOptions({
      q: debounced,
      page: Math.max(1, pageParam),
    }),
    enabled: debounced.length > 0,
  });
  const pending =
    debounced.length > 0 && (isFetching || q.trim() !== debounced);

  return (
    <div className="page-in space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">ค้นหา</h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value || null);
              setPage(null);
            }}
            placeholder="ค้นหาจากชื่อโพสต์"
            aria-label="ค้นหาจากชื่อโพสต์"
            className="bg-card pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
        {data && debounced.length > 0 && (
          <Pagination
            page={data.page}
            pageCount={data.pageCount}
            hrefFor={(n) =>
              `/search?q=${encodeURIComponent(debounced)}${n > 1 ? `&page=${n}` : ""}`
            }
            className="order-last w-full justify-center sm:order-none sm:w-auto"
          />
        )}
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {debounced.length === 0 && (
        <EmptyState
          title="เริ่มพิมพ์เพื่อค้นหา"
          hint="ค้นหาอนิเมะ รีวิว ข่าว หรือคำถามจากชื่อโพสต์"
        />
      )}
      {pending && !data && <PostGridSkeleton layout={layout} count={3} />}
      {debounced.length > 0 && data && (
        <div className={pending ? "opacity-60 transition-opacity" : undefined}>
          {data.items.length > 0 ? (
            <>
              <PostGrid posts={data.items} layout={layout} />
              <Pagination
                page={data.page}
                pageCount={data.pageCount}
                hrefFor={(n) =>
                  `/search?q=${encodeURIComponent(debounced)}${n > 1 ? `&page=${n}` : ""}`
                }
              />
            </>
          ) : (
            !pending && (
              <EmptyState
                title="ไม่พบโพสต์ที่ตรงกับคำค้นหา"
                hint="ลองใช้คำอื่น หรือสั้นลงอีกนิด"
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
