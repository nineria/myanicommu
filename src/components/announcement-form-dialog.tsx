"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";

export type AnnouncementValues = {
  id?: string;
  type: "DANGER" | "WARNING" | "SUCCESS";
  title: string;
  content: string;
  published: boolean;
};

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: AnnouncementValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const [v, setV] = useState<AnnouncementValues>(
    initial ?? { type: "SUCCESS", title: "", content: "", published: false },
  );
  const create = useMutation(trpc.announcement.create.mutationOptions());
  const update = useMutation(trpc.announcement.update.mutationOptions());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (v.id) await update.mutateAsync({ ...v, id: v.id });
      else await create.mutateAsync(v);
      toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{v.id ? "แก้ไขประกาศ" : "สร้างประกาศ"}</DialogTitle>
          <DialogDescription className="sr-only">ฟอร์มประกาศ</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>ประเภท</Label>
            <Select
              value={v.type}
              onValueChange={(t) =>
                setV({ ...v, type: t as AnnouncementValues["type"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทของประกาศ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DANGER">
                  Danger - ระดับความสำคัญสูงสุด
                </SelectItem>
                <SelectItem value="WARNING">
                  Warning - ระดับความสำคัญปานกลาง
                </SelectItem>
                <SelectItem value="SUCCESS">
                  Success - ระดับความสำคัญทั่วไป
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ann-title">หัวข้อ</Label>
            <Input
              id="ann-title"
              required
              maxLength={100}
              value={v.title}
              onChange={(e) => setV({ ...v, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>เนื้อหา</Label>
            <RichTextEditor
              value={v.content}
              onChange={(content) => setV({ ...v, content })}
            />
          </div>
          <Label className="font-normal">
            <Checkbox
              checked={v.published}
              onCheckedChange={(c) => setV({ ...v, published: c === true })}
            />
            เผยแพร่
          </Label>
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
              disabled={create.isPending || update.isPending || !v.content}
            >
              {(create.isPending || update.isPending) && (
                <Loader2 className="animate-spin" />
              )}
              บันทึก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
