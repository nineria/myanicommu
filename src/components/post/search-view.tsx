"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import {
  EmptyState,
  LayoutToggle,
  PostGrid,
  PostGridSkeleton,
  useLayout,
} from "@/components/post/post-grid";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

export function SearchView() {
  const trpc = useTRPC();
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [debounced] = useDebounce(q.trim(), 250);
  const [layout, setLayout] = useLayout();
  const { data, isFetching } = useQuery({
    ...trpc.post.list.queryOptions({ q: debounced, take: 60 }),
    enabled: debounced.length > 0,
  });
  const pending =
    debounced.length > 0 && (isFetching || q.trim() !== debounced);

  return (
    <div className="page-in space-y-2">
      <h1 className="rounded-lg bg-card px-3 py-1 text-sm font-bold shadow-md md:text-base">
        ค้นหา
      </h1>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value || null)}
            placeholder="ค้นหาจากชื่อโพสต์"
            aria-label="ค้นหาจากชื่อโพสต์"
            className="rounded-full bg-card pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
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
          {data.length > 0 ? (
            <PostGrid posts={data} layout={layout} />
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
