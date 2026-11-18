"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Star, ThumbsUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  PostFormDialog,
  type PostFormValues,
} from "@/components/post/post-form-dialog";
import { ReportButton } from "@/components/report-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export function PostActions({
  post,
  username,
}: {
  post: {
    id: string;
    title: string;
    authorId: string;
    liked: boolean;
    likeCount: number;
    myStar: number;
    form: PostFormValues;
  };
  username: string;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: me } = useQuery(trpc.user.me.queryOptions());
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [myStar, setMyStar] = useState(post.myStar);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const like = useMutation(trpc.post.toggleLike.mutationOptions());
  const rate = useMutation(trpc.post.rate.mutationOptions());
  const del = useMutation(trpc.post.delete.mutationOptions());

  const canEdit = me && (me.id === post.authorId || me.role === "ADMIN");

  // Optimistic: update the UI first, roll back if the request fails.
  const toggleLike = async () => {
    if (!me) return toast.error("เข้าสู่ระบบเพื่อกดถูกใจ");
    const prev = { liked, likeCount };
    setLiked(!liked);
    setLikeCount((c) => c + (liked ? -1 : 1));
    try {
      const res = await like.mutateAsync({ id: post.id });
      if (res.liked !== !prev.liked) {
        setLiked(res.liked);
        setLikeCount(
          prev.likeCount + (res.liked ? 1 : 0) - (prev.liked ? 1 : 0),
        );
      }
    } catch {
      setLiked(prev.liked);
      setLikeCount(prev.likeCount);
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  const setStar = async (value: number) => {
    if (!me) return toast.error("เข้าสู่ระบบเพื่อให้คะแนน");
    const prev = myStar;
    setMyStar(value);
    try {
      await rate.mutateAsync({ id: post.id, value });
      toast.success(`คุณได้ให้คะแนนโพสต์นี้ ${value} ดาว`);
      router.refresh();
    } catch {
      setMyStar(prev);
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  const remove = async () => {
    try {
      await del.mutateAsync({ id: post.id });
      toast.success("ลบโพสต์แล้ว");
      router.push("/posts");
      router.refresh();
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-t px-3 py-2.5">
      <Button
        variant={liked ? "default" : "ghost"}
        size="sm"
        onClick={toggleLike}
      >
        <ThumbsUp className={cn(liked && "fill-current")} /> {likeCount}
      </Button>
      <div className="flex items-center" role="group" aria-label="ให้คะแนน">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStar(n)}
            aria-label={`${n} ดาว`}
            className="rounded p-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={cn(
                "size-5",
                n <= myStar
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1">
        {me && (
          <ReportButton
            from={`/posts/${username}/${post.id}`}
            title={post.title}
          />
        )}
        {canEdit && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil /> แก้ไขโพสต์
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 /> ลบโพสต์
            </Button>
          </>
        )}
      </div>

      {editing && (
        <PostFormDialog
          open={editing}
          onOpenChange={setEditing}
          initial={post.form}
        />
      )}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบโพสต์นี้?</AlertDialogTitle>
            <AlertDialogDescription>
              การลบไม่สามารถย้อนกลับได้ ความคิดเห็นทั้งหมดจะถูกลบด้วย
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
