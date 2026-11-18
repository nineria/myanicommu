"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import { PostGrid, useLayout } from "@/components/post/post-grid";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

export function SearchView() {
  const trpc = useTRPC();
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [debounced] = useDebounce(q.trim(), 300);
  const [layout] = useLayout();
  const { data, isFetching } = useQuery({
    ...trpc.post.list.queryOptions({ q: debounced, take: 60 }),
    enabled: debounced.length > 0,
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value || null)}
          placeholder="ค้นหา"
          className="rounded-full pl-9"
        />
      </div>
      {debounced.length > 0 &&
        data &&
        (data.length > 0 ? (
          <>
            <p className="text-center text-sm text-muted-foreground">
              ผลการค้นหา
            </p>
            <PostGrid posts={data} layout={layout} />
          </>
        ) : (
          !isFetching && (
            <p className="text-center text-sm text-muted-foreground">
              ไม่พบโพสต์ที่ต้องการ 😭
            </p>
          )
        ))}
    </div>
  );
}
