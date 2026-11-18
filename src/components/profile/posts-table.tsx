"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TagBadge } from "@/components/post/tag-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PostCard } from "@/trpc/routers/post";

type SortKey = "title" | "createdAt" | "likes" | "stars";

export function PostsTable({
  posts,
  username,
}: {
  posts: PostCard[];
  username: string;
}) {
  const [key, setKey] = useState<SortKey>("createdAt");
  const [dir, setDir] = useState<1 | -1>(-1);

  const sorted = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const av =
          key === "createdAt" ? new Date(a.createdAt).getTime() : a[key];
        const bv =
          key === "createdAt" ? new Date(b.createdAt).getTime() : b[key];
        return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
      }),
    [posts, key, dir],
  );

  const head = (k: SortKey, label: string) => (
    <TableHead>
      <button
        type="button"
        className="flex items-center gap-1"
        onClick={() => {
          if (k === key) setDir((d) => (d === 1 ? -1 : 1));
          else {
            setKey(k);
            setDir(-1);
          }
        }}
      >
        {label}
        {k === key &&
          (dir === 1 ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          ))}
      </button>
    </TableHead>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border bg-card p-2">
      <Table>
        <TableHeader>
          <TableRow>
            {head("title", "หัวข้อ")}
            <TableHead>ประเภท</TableHead>
            {head("createdAt", "วันที่")}
            {head("likes", "ถูกใจ")}
            {head("stars", "ดาว")}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="max-w-64 truncate">
                <Link
                  href={`/posts/${username}/${p.id}`}
                  className="hover:text-primary hover:underline"
                >
                  {p.title}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {p.tags.slice(0, 2).map((t) => (
                    <TagBadge
                      key={t.label}
                      label={t.label}
                      from={t.colorFrom}
                      to={t.colorTo}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("th-TH", {
                  dateStyle: "medium",
                })}
              </TableCell>
              <TableCell>{p.likes}</TableCell>
              <TableCell>{p.stars}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
