"use client";

import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnnouncementFormDialog } from "@/components/announcement-form-dialog";
import { PostFormDialog } from "@/components/post/post-form-dialog";
import { LayoutToggle, PostGrid, useLayout } from "@/components/post/post-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import type { PostCard } from "@/trpc/routers/post";

/** Post listing with client-side title filter, layout toggle and create buttons (admin extras included). */
export function PostListView({ posts }: { posts: PostCard[] }) {
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [layout, setLayout] = useLayout();
  const [term, setTerm] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [annOpen, setAnnOpen] = useState(false);

  const results =
    applied === null
      ? []
      : posts.filter((p) =>
          p.title.toLowerCase().includes(applied.toLowerCase()),
        );

  return (
    <div className="space-y-2">
      <form
        className="flex"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(term.trim());
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="ค้นหา"
            className="rounded-r-none rounded-l-full pl-9"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="rounded-r-full rounded-l-none"
          aria-label="ค้นหา"
        >
          <Search />
        </Button>
      </form>

      {applied !== null &&
        (results.length > 0 ? (
          <>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              ผลการค้นหา
            </p>
            <PostGrid posts={results} layout={layout} />
            <Separator />
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            ไม่พบโพสต์ที่ต้องการ 😭
          </p>
        ))}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
                  <Pencil />{" "}
                  <span className="hidden md:inline">จัดการประกาศ</span>
                </Link>
              </Button>
            </>
          )}
        </div>
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      <PostGrid posts={posts} layout={layout} />

      {postOpen && (
        <PostFormDialog open={postOpen} onOpenChange={setPostOpen} />
      )}
      {annOpen && (
        <AnnouncementFormDialog open={annOpen} onOpenChange={setAnnOpen} />
      )}
    </div>
  );
}
