"use client";

import { LayoutGrid, List, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

type Layout = "grid" | "list";
const KEY = "post-layout";

/** Remembers the grid/list choice in localStorage. */
export function useLayout() {
  const [layout, setLayoutState] = useState<Layout>("grid");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved === "grid" || saved === "list") setLayoutState(saved);
    } catch {}
  }, []);
  const setLayout = (l: Layout) => {
    setLayoutState(l);
    try {
      localStorage.setItem(KEY, JSON.stringify(l));
    } catch {}
  };
  return [layout, setLayout] as const;
}

export function LayoutToggle({
  layout,
  onChange,
}: {
  layout: Layout;
  onChange: (l: Layout) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={layout}
      onValueChange={(v) => v && onChange(v as Layout)}
      variant="outline"
      aria-label="รูปแบบการแสดงผล"
    >
      <ToggleGroupItem value="grid" aria-label="แบบตาราง">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="แบบรายการ">
        <List />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-card py-16 text-center shadow-sm">
      <SearchX className="size-8 text-muted-foreground" />
      <p className="font-semibold">{title}</p>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PostGridSkeleton({
  layout = "grid",
  count = 6,
}: {
  layout?: Layout;
  count?: number;
}) {
  const items = Array.from({ length: count }, (_, i) => i);
  return layout === "grid" ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i} className="overflow-hidden rounded-lg bg-card shadow-sm">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-2 p-3.5">
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {items.map((i) => (
        <div
          key={i}
          className="flex gap-3 overflow-hidden rounded-lg bg-card shadow-sm"
        >
          <Skeleton className="aspect-[16/10] w-32 shrink-0 sm:w-52" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-4 h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostGrid({
  posts,
  layout,
}: {
  posts: PostCardData[];
  layout: Layout;
}) {
  if (posts.length < 1) {
    return <EmptyState title="ยังไม่มีโพสต์" hint="เป็นคนแรกที่เริ่มต้นบทสนทนาได้เลย" />;
  }
  return layout === "grid" ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <PostCard key={p.id} post={p} layout="grid" priority={i < 3} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} layout="list" />
      ))}
    </div>
  );
}
