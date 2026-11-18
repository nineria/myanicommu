"use client";

import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
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
import { Pagination } from "@/components/ui/pagination";
import { useTRPC } from "@/trpc/client";
import type { PostCard } from "@/trpc/routers/post";

/** Post listing with live title filter, layout toggle and create buttons (admin extras included). */
export function PostListView({
  posts,
  page,
  pageCount,
  q,
  title,
}: {
  posts: PostCard[];
  page: number;
  pageCount: number;
  q: string;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [layout, setLayout] = useLayout();
  const [term, setTerm] = useState(q);
  const [debounced] = useDebounce(term.trim(), 300);
  const current = useRef(q);
  const [postOpen, setPostOpen] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);

  const hrefFor = (n: number, query = q) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // Search runs on the server: reset to page 1 whenever the term changes.
  useEffect(() => {
    if (debounced === current.current) return;
    current.current = debounced;
    router.replace(hrefFor(1, debounced), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="ค้นหาจากชื่อโพสต์"
            aria-label="ค้นหาจากชื่อโพสต์"
            className="bg-card pr-11 pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              aria-label="ล้างคำค้นหา"
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Pagination
          page={page}
          pageCount={pageCount}
          hrefFor={(n) => hrefFor(n)}
          className="order-last w-full justify-center sm:order-none sm:w-auto"
        />
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {q && posts.length === 0 ? (
        <EmptyState title="ไม่พบโพสต์ที่ตรงกับคำค้นหา" hint="ลองใช้คำอื่น หรือสั้นลงอีกนิด" />
      ) : (
        <>
          <PostGrid posts={posts} layout={layout} />
          <Pagination
            page={page}
            pageCount={pageCount}
            hrefFor={(n) => hrefFor(n)}
          />
        </>
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
