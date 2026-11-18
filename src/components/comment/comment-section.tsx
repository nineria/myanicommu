"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Logo } from "@/components/layout/logo";
import { AuthorPanel } from "@/components/post/author-panel";
import { ReportButton } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export function CommentSection({
  postId,
  postTitle,
  postPath,
}: {
  postId: string;
  postTitle: string;
  postPath: string;
}) {
  const [highlight, setHighlight] = useState<string>();
  useEffect(() => {
    // reported comments are linked as #<commentId>; only the browser sees the hash
    const id = window.location.hash.slice(1);
    if (id) setHighlight(id);
  }, []);
  const trpc = useTRPC();
  const qc = useQueryClient();
  const { data: me, isPending: mePending } = useQuery(
    trpc.user.me.queryOptions(),
  );
  const listOpts = trpc.comment.list.queryOptions({ postId });
  const { data: comments, isPending } = useQuery(listOpts);
  const refresh = () => qc.invalidateQueries({ queryKey: listOpts.queryKey });

  return (
    <div className="space-y-3">
      <h2 className="pt-2 text-lg font-bold">
        ความคิดเห็น{comments ? ` (${comments.length})` : ""}
      </h2>
      {isPending && (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      )}
      {comments?.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          meId={me?.id}
          isAdmin={me?.role === "ADMIN"}
          canLike={!!me}
          postTitle={postTitle}
          postPath={postPath}
          active={highlight === c.id}
          onChanged={refresh}
        />
      ))}

      {!mePending && !me && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border bg-card py-10 text-foreground">
          <p className="text-center">เข้าสู่ระบบ หรือลงทะเบียน เพื่อเป็นส่วนหนึ่งของ</p>
          <p className="mb-2 text-center">
            <Logo className="inline" /> และอื่น ๆ อีกมากมาย!
          </p>
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button variant="secondary">เข้าสู่ระบบ</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>ลงทะเบียน</Button>
            </SignUpButton>
          </div>
        </div>
      )}
      {me && <AddComment postId={postId} onAdded={refresh} />}
    </div>
  );
}

function AddComment({
  postId,
  onAdded,
}: {
  postId: string;
  onAdded: () => void;
}) {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const [key, setKey] = useState(0);
  const create = useMutation(trpc.comment.create.mutationOptions());

  const submit = async () => {
    if (!value.trim())
      return toast.warning("ข้อความของคุณว่างเปล่า? กรุณาใส่ข้อความที่ต้องการตอบกลับ");
    try {
      await create.mutateAsync({ postId, content: value });
      setValue("");
      setKey((k) => k + 1);
      onAdded();
      toast.success("เขียนคอมเมนต์แล้ว");
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-3">
      <RichTextEditor
        key={key}
        value={value}
        onChange={setValue}
        placeholder="เขียนข้อความตอบกลับ"
      />
      <div className="mt-2 flex justify-end">
        <Button onClick={submit} disabled={create.isPending}>
          {create.isPending && <Loader2 className="animate-spin" />}
          ตอบกลับ
        </Button>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  meId,
  isAdmin,
  canLike,
  postTitle,
  postPath,
  active,
  onChanged,
}: {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author: {
      username: string;
      avatar: string | null;
      role: "MEMBER" | "ADMIN";
      ranks: {
        id: string;
        label: string;
        colorFrom: string;
        colorTo: string;
      }[];
    };
    likeCount: number;
    liked: boolean;
  };
  meId?: string;
  isAdmin: boolean;
  canLike: boolean;
  postTitle: string;
  postPath: string;
  active: boolean;
  onChanged: () => void;
}) {
  const trpc = useTRPC();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const like = useMutation(trpc.comment.toggleLike.mutationOptions());
  const update = useMutation(trpc.comment.update.mutationOptions());
  const del = useMutation(trpc.comment.delete.mutationOptions());
  const mine = meId === comment.authorId;

  return (
    <div
      id={comment.id}
      className={cn(
        "overflow-hidden rounded-2xl border bg-card",
        active && "border-2 border-destructive",
      )}
    >
      {active && (
        <div className="bg-destructive text-center text-sm font-medium text-white">
          เนื้อหาที่ถูกรายงาน
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-56 md:shrink-0 md:border-r">
          <AuthorPanel
            author={comment.author}
            date={comment.createdAt}
            compact
          />
        </div>
        <div className="min-w-0 flex-1 border-t p-3 md:border-t-0">
          {editing ? (
            <>
              <RichTextEditor value={draft} onChange={setDraft} />
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  ยกเลิก
                </Button>
                <Button
                  disabled={update.isPending}
                  onClick={async () => {
                    try {
                      await update.mutateAsync({
                        id: comment.id,
                        content: draft,
                      });
                      setEditing(false);
                      onChanged();
                      toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
                    } catch {
                      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
                    }
                  }}
                >
                  บันทึก
                </Button>
              </div>
            </>
          ) : (
            <div
              className="rich-text text-foreground"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          )}
          <div className="mt-3 flex flex-wrap items-center gap-1">
            <Button
              size="sm"
              variant={comment.liked ? "default" : "ghost"}
              disabled={!canLike || like.isPending}
              onClick={async () => {
                await like.mutateAsync({ id: comment.id });
                onChanged();
              }}
            >
              <ThumbsUp /> {comment.likeCount}
            </Button>
            <div className="ml-auto flex items-center gap-1">
              {canLike && !mine && (
                <ReportButton
                  from={`${postPath}#${comment.id}`}
                  title={postTitle}
                />
              )}
              {(mine || isAdmin) && !editing && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil /> แก้ไข
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={async () => {
                      if (!window.confirm("ต้องการลบความคิดเห็นนี้หรือไม่?")) return;
                      await del.mutateAsync({ id: comment.id });
                      onChanged();
                    }}
                  >
                    <Trash2 /> ลบ
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
