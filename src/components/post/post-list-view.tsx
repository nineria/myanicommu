"use client";

import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { AnnouncementFormDialog } from "@/components/announcement-form-dialog";
import { PostFormDialog } from "@/components/post/post-form-dialog";
import {
  EmptyState,
  LayoutToggle,
  PostGrid,
  useLayout,
} from "@/components/post/post-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import type { PostCard } from "@/trpc/routers/post";

/** Post listing with live title filter, layout toggle and create buttons (admin extras included). */
export function PostListView({
  posts,
  title,
}: {
  posts: PostCard[];
  title: string;
}) {
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [layout, setLayout] = useLayout();
  const [term, setTerm] = useState("");
  const deferred = useDeferredValue(term.trim().toLowerCase());
  const [postOpen, setPostOpen] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);

  const results = useMemo(
    () =>
      deferred
        ? posts.filter((p) => p.title.toLowerCase().includes(deferred))
        : posts,
    [posts, deferred],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="rounded-lg bg-card px-3 py-1 text-sm font-bold shadow-md md:text-base">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {me && (
            <Button onClick={() => setPostOpen(true)}>
              <Plus /> สร้างโพสต์
            </Button>
          )}
          {me?.role === "ADMIN" && (
            <>
              <Button variant="secondary" onClick={() => setAnnOpen(true)}>
                <Plus /> สร้างประกาศ
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/${me.username}#announcementControl`}>
                  <Pencil />
                  <span className="hidden md:inline">จัดการประกาศ</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="ค้นหาจากชื่อโพสต์"
            aria-label="ค้นหาจากชื่อโพสต์"
            className="rounded-full bg-card pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="ล้างคำค้นหา"
              className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {deferred && results.length === 0 ? (
        <EmptyState title="ไม่พบโพสต์ที่ตรงกับคำค้นหา" hint="ลองใช้คำอื่น หรือสั้นลงอีกนิด" />
      ) : (
        <PostGrid posts={results} layout={layout} />
      )}

      {postOpen && (
        <PostFormDialog open={postOpen} onOpenChange={setPostOpen} />
      )}
      {annOpen && (
        <AnnouncementFormDialog open={annOpen} onOpenChange={setAnnOpen} />
      )}
    </div>
  );
}
