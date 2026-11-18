"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/editor/image-dropzone";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { WebsiteRuleNotice } from "@/components/legal/legal-dialog";
import { TagBadge } from "@/components/post/tag-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_TAGS, type TagValue } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export type PostFormValues = {
  id?: string;
  title: string;
  tags: TagValue[];
  genres: string[];
  image: string | null;
  content: string;
  credit: string;
};

const EMPTY: PostFormValues = {
  title: "",
  tags: [],
  genres: [],
  image: null,
  content: "",
  credit: "",
};

export function PostFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: PostFormValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const editing = !!initial?.id;
  const [v, setV] = useState<PostFormValues>(initial ?? EMPTY);
  const [genreInput, setGenreInput] = useState("");
  const set = <K extends keyof PostFormValues>(k: K, val: PostFormValues[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const create = useMutation(trpc.post.create.mutationOptions());
  const update = useMutation(trpc.post.update.mutationOptions());
  const pending = create.isPending || update.isPending;

  const toggleTag = (t: TagValue) =>
    set(
      "tags",
      v.tags.some((x) => x.label === t.label)
        ? v.tags.filter((x) => x.label !== t.label)
        : [...v.tags, t],
    );

  const addGenres = () => {
    const parts = genreInput
      .split(/[,\s]+/)
      .map((g) => g.trim())
      .filter((g) => g && !v.genres.includes(g));
    if (parts.length) set("genres", [...v.genres, ...parts]);
    setGenreInput("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.image) return toast.error("กรุณาใส่รูปภาพประจำโพสต์!");
    const payload = { ...v, image: v.image };
    try {
      if (editing && v.id) {
        await update.mutateAsync({ ...payload, id: v.id });
        toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
        onOpenChange(false);
        router.refresh();
      } else {
        const res = await create.mutateAsync(payload);
        toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
        onOpenChange(false);
        router.push(`/posts/${res.username}/${res.id}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      toast.error(msg || "มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{editing ? "แก้ไขโพสต์" : "สร้างโพสต์"}</DialogTitle>
          <DialogDescription className="sr-only">ฟอร์มโพสต์</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              <Tag className="size-3.5" /> ประเภทของโพสต์
            </Label>
            <div className="flex flex-wrap gap-2">
              {POST_TAGS.map((t) => {
                const on = v.tags.some((x) => x.label === t.label);
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      "rounded-full opacity-50 transition",
                      on && "opacity-100 ring-2 ring-primary",
                    )}
                  >
                    <TagBadge
                      label={t.label}
                      from={t.colorFrom}
                      to={t.colorTo}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              <Tag className="size-3.5" /> ประเภทของเนื้อหา
            </Label>
            <p className="text-xs text-muted-foreground">
              เช่น Action, Comedy, Romance, Drama - กด Enter เพื่อเพิ่มประเภทของเนื้อหา
            </p>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border px-3 py-2">
              {v.genres.map((g) => (
                <Badge key={g} variant="outline" className="gap-1 pr-1">
                  {g}
                  <button
                    type="button"
                    aria-label={`ลบ ${g}`}
                    onClick={() =>
                      set(
                        "genres",
                        v.genres.filter((x) => x !== g),
                      )
                    }
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGenres();
                  }
                }}
                className="min-w-24 flex-1 bg-transparent py-1 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-title">หัวข้อโพสต์</Label>
            <Input
              id="post-title"
              required
              minLength={10}
              maxLength={120}
              value={v.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="หัวข้อโพสต์ต้องมีอย่างน้อย 10 ตัวอักษร"
            />
          </div>

          <div className="space-y-2">
            <Label>รูปภาพประจำโพสต์</Label>
            <ImageDropzone
              value={v.image}
              onChange={(url) => set("image", url)}
              kind="post"
            />
          </div>

          <div className="space-y-2">
            <Label>เนื้อหา</Label>
            <RichTextEditor
              value={v.content}
              onChange={(h) => set("content", h)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-credit">เครดิต / แหล่งที่มา</Label>
            <Input
              id="post-credit"
              value={v.credit}
              onChange={(e) => set("credit", e.target.value)}
            />
          </div>

          <WebsiteRuleNotice />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={pending || !v.content || v.tags.length === 0}
            >
              {pending && <Loader2 className="animate-spin" />}
              {editing ? "บันทึก" : "โพสต์"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
