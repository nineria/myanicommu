"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronUp, Megaphone, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HomePostFormDialog,
  type HomePostValues,
} from "@/components/home/home-post-form-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export type ReviewItem = {
  id: string;
  title: string;
  href: string;
  excerpt: string;
  date: string;
};

/** Collapsible section card. Collapsed state is remembered per title. */
function Collapsible({
  title,
  titleLink,
  edit,
  children,
}: {
  title: string;
  titleLink?: string;
  edit?: React.ReactNode;
  children: React.ReactNode;
}) {
  const key = `home-collapsed:${title}`;
  const [open, setOpen] = useState(true);
  useEffect(() => {
    try {
      if (localStorage.getItem(key) === "false") setOpen(false);
    } catch {}
  }, [key]);
  const toggle = () => {
    setOpen(!open);
    try {
      localStorage.setItem(key, JSON.stringify(!open));
    } catch {}
  };
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <Link
          href={titleLink || "/"}
          className="truncate text-lg font-semibold hover:text-primary"
        >
          {title}
        </Link>
        <div className="flex items-center gap-1">
          {edit}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? "ย่อ" : "ขยาย"}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronUp
              className={cn(
                "size-5 transition-transform",
                !open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
      {open && <div className="divide-y border-t">{children}</div>}
    </section>
  );
}

function Status({
  header,
  headerLink,
  body,
  date,
  html,
  rank,
}: {
  header: string;
  headerLink: string;
  body: string;
  date?: string;
  html?: boolean;
  rank?: number;
}) {
  return (
    <div className="flex gap-3 px-4 py-3">
      {rank !== undefined && (
        <span className="w-5 shrink-0 pt-0.5 text-center text-lg font-bold text-primary tabular-nums">
          <span className="sr-only">อันดับ </span>
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={headerLink || "/"}
            className="truncate font-semibold hover:text-primary"
          >
            {header}
          </Link>
          {date && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {date}
            </span>
          )}
        </div>
        {html ? (
          <div
            className="rich-text mt-1 line-clamp-4 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {body}
          </p>
        )}
      </div>
    </div>
  );
}

export function TopReviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;
  return (
    <Collapsible title="รีวิวยอดนิยม" titleLink="/reviews">
      {reviews.map((r, i) => (
        <Status
          key={r.id}
          rank={i + 1}
          header={r.title}
          headerLink={r.href}
          body={r.excerpt}
          date={r.date}
        />
      ))}
    </Collapsible>
  );
}

export type HomePostItem = HomePostValues & {
  id: string;
  updatedAt: Date | string;
};

/** Admin announcement shown as an alert strip at the top of the home page. */
export function HomePostCard({ post }: { post: HomePostItem }) {
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [editing, setEditing] = useState(false);
  return (
    <>
      <div
        role="status"
        className="flex gap-3 rounded-xl border border-l-4 border-l-primary bg-card p-3.5 sm:p-4"
      >
        <Megaphone className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={post.titleLink || "/"}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {post.title || "ประกาศ"}
              </Link>
              <Link
                href={post.headerLink || "/"}
                className="block font-semibold hover:text-primary"
              >
                {post.header || "หัวข้อย่อย"}
              </Link>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {fmt(post.updatedAt)}
              </span>
              {me?.role === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  aria-label="แก้ไข"
                  className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
              )}
            </div>
          </div>
          <div
            className="rich-text mt-1 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </div>
      {editing && (
        <HomePostFormDialog
          open={editing}
          onOpenChange={setEditing}
          initial={{
            id: post.id,
            title: post.title,
            titleLink: post.titleLink,
            header: post.header,
            headerLink: post.headerLink,
            body: post.body,
          }}
        />
      )}
    </>
  );
}

export function CreateHomePostButton() {
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [open, setOpen] = useState(false);
  if (me?.role !== "ADMIN") return null;
  return (
    <div className="my-2 flex justify-center">
      <Button onClick={() => setOpen(true)}>
        <Plus /> สร้างโพสต์
      </Button>
      {open && <HomePostFormDialog open={open} onOpenChange={setOpen} />}
    </div>
  );
}
