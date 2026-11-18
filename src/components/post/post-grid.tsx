"use client";

import { LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PostCard as PostCardData } from "@/trpc/routers/post";

type Layout = "grid" | "list";
const KEY = "post-layout";

/** Remembers the grid/list choice in localStorage, like the old site. */
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
      size="sm"
    >
      <ToggleGroupItem value="grid" aria-label="Grid">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List">
        <List />
      </ToggleGroupItem>
    </ToggleGroup>
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
    return (
      <div className="flex justify-center py-6 text-foreground">ยังไม่มีโพสต์</div>
    );
  }
  return layout === "grid" ? (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} layout="grid" />
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} layout="list" />
      ))}
    </div>
  );
}
