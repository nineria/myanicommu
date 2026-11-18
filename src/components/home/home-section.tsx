"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronUp, Megaphone, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HomePostFormDialog,
  type HomePostValues,
} from "@/components/home/home-post-form-dialog";
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

/** Collapsible section card (the old "Body" component). Collapsed state is remembered per title. */
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
    <div className={cn("rounded-lg bg-card shadow-md", open ? "pb-2" : "pb-0")}>
      <div
        className={cn(
          "flex items-center justify-between border-primary/30 px-3 py-1 text-sm font-bold text-foreground md:text-base",
          open ? "rounded-t-lg border-b-2" : "rounded-lg",
        )}
      >
        <Link
          href={titleLink || "/"}
          className="max-w-[600px] truncate hover:underline"
        >
          {title}
        </Link>
        <div className="flex items-center gap-2">
          {edit}
          <button type="button" onClick={toggle} aria-label="toggle">
            <ChevronUp
              className={cn(
                "size-5 transition-all hover:opacity-75",
                !open && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-[3px] bg-background">{children}</div>
      )}
    </div>
  );
}

function Status({
  header,
  headerLink,
  body,
  date,
  html,
}: {
  header: string;
  headerLink: string;
  body: string;
  date?: string;
  html?: boolean;
}) {
  return (
    <div className="bg-card px-3 py-2 text-foreground">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={headerLink || "/"}
          className="truncate font-semibold hover:underline"
        >
          {header}
        </Link>
        {date && (
          <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
        )}
      </div>
      {html ? (
        <div
          className="rich-text line-clamp-4 text-sm opacity-80"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ) : (
        <p className="line-clamp-2 text-sm opacity-80">{body}</p>
      )}
    </div>
  );
}

export function TopReviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;
  return (
    <Collapsible title="TOP รีวิว 🔥">
      {reviews.map((r) => (
        <Status
          key={r.id}
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

export function HomePostCard({ post }: { post: HomePostItem }) {
  const trpc = useTRPC();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [editing, setEditing] = useState(false);
  return (
    <>
      <div
        role="status"
        className="flex gap-3 rounded-lg border-l-4 border-l-primary bg-card p-3 text-foreground shadow-md"
      >
        <Megaphone className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={post.titleLink || "/"}
                className="text-xs text-foreground/60 hover:underline"
              >
                {post.title || "ประกาศ"}
              </Link>
              <Link
                href={post.headerLink || "/"}
                className="block font-bold hover:underline"
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
                >
                  <Pencil className="size-4 hover:opacity-75" />
                </button>
              )}
            </div>
          </div>
          <div
            className="rich-text mt-1 text-sm opacity-80"
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-75"
      >
        สร้างโพสต์ +
      </button>
      {open && <HomePostFormDialog open={open} onOpenChange={setOpen} />}
    </div>
  );
}
