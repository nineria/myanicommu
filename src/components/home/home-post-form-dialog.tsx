"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { WebsiteRuleNotice } from "@/components/legal/legal-dialog";
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
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";

export type HomePostValues = {
  id?: string;
  title: string;
  titleLink: string;
  header: string;
  headerLink: string;
  body: string;
};

export function HomePostFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: HomePostValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const [v, setV] = useState<HomePostValues>(
    initial ?? {
      title: "",
      titleLink: "",
      header: "",
      headerLink: "",
      body: "",
    },
  );
  const create = useMutation(trpc.homePost.create.mutationOptions());
  const update = useMutation(trpc.homePost.update.mutationOptions());
  const del = useMutation(trpc.homePost.delete.mutationOptions());
  const pending = create.isPending || update.isPending || del.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (v.id) await update.mutateAsync({ ...v, id: v.id });
      else await create.mutateAsync(v);
      toast.success(v.id ? "บันทึกการเปลี่ยนแปลงเรียบร้อย" : "สร้างโพสต์แล้ว");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  const remove = async () => {
    if (!v.id || !window.confirm("ต้องการลบโพสต์นี้หรือไม่?")) return;
    try {
      await del.mutateAsync({ id: v.id });
      toast.success("ลบโพสต์แล้ว");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  const field = (
    id: keyof HomePostValues,
    label: string,
    placeholder: string,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={`hp-${id}`}>{label}</Label>
      <Input
        id={`hp-${id}`}
        placeholder={placeholder}
        value={v[id] ?? ""}
        onChange={(e) => setV({ ...v, [id]: e.target.value })}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {v.id ? "แก้ไขโพสต์ - หน้าหลัก" : "สร้างโพสต์ - หน้าหลัก"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            ฟอร์มโพสต์หน้าหลัก
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {field("titleLink", "เชื่อมโยง", "/https")}
          {field("title", "หัวข้อโพสต์", "โพสต์ใหม่ที่น่าสนใจ")}
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            หัวข้อย่อย และเนื้อหา
          </p>
          {field("headerLink", "เชื่อมโยง", "/https")}
          {field("header", "หัวข้อย่อย", "หัวข้อย่อย")}
          <div className="space-y-2">
            <Label>เนื้อหา</Label>
            <p className="text-xs text-muted-foreground">
              รายละเอียดเนื้อหาของโพสต์
            </p>
            <RichTextEditor
              value={v.body}
              onChange={(body) => setV({ ...v, body })}
              placeholder="เขียนรายละเอียด"
            />
          </div>
          <WebsiteRuleNotice />
          <div className="flex justify-between gap-2">
            {v.id ? (
              <Button
                type="button"
                variant="destructive"
                onClick={remove}
                disabled={pending}
              >
                ลบ
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={pending || !v.title || !v.body}>
                {pending && <Loader2 className="animate-spin" />}
                บันทึก
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
