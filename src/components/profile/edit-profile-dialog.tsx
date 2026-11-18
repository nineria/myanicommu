"use client";

import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { ImageDropzone } from "@/components/editor/image-dropzone";
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
import { Textarea } from "@/components/ui/textarea";
import { USERNAME_REGEX } from "@/lib/constants";
import { useTRPC } from "@/trpc/client";

type ProfileValues = {
  username: string;
  bio: string;
  avatar: string | null;
  banner: string | null;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

const CONFIRM_TEXT = "ลบบัญชีส่วนบุคคลของฉัน";

export function EditProfileButton({ profile }: { profile: ProfileValues }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Pencil /> แก้ไขข้อมูลส่วนตัว
      </Button>
      {open && (
        <EditProfileDialog
          open={open}
          onOpenChange={setOpen}
          profile={profile}
        />
      )}
    </>
  );
}

function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  profile: ProfileValues;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { openUserProfile, signOut } = useClerk();
  const [v, setV] = useState(profile);
  const [confirm, setConfirm] = useState("");
  const [debounced] = useDebounce(v.username, 400);

  const validFormat = USERNAME_REGEX.test(v.username);
  const check = useQuery({
    ...trpc.user.checkUsername.queryOptions({ username: debounced }),
    enabled: validFormat && debounced === v.username,
  });

  const save = useMutation(trpc.user.updateProfile.mutationOptions());
  const remove = useMutation(trpc.user.deleteAccount.mutationOptions());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await save.mutateAsync(v);
      toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
      onOpenChange(false);
      router.replace(`/${res.username}`);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง",
      );
    }
  };

  const deleteAccount = async () => {
    try {
      await remove.mutateAsync();
      await signOut(() => router.push("/"));
    } catch {
      toast.error("มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้งภายหลัง");
    }
  };

  const text = (
    key: keyof ProfileValues,
    label: string,
    placeholder?: string,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={`ep-${key}`}>{label}</Label>
      <Input
        id={`ep-${key}`}
        placeholder={placeholder}
        value={(v[key] as string) ?? ""}
        onChange={(e) => setV({ ...v, [key]: e.target.value })}
      />
    </div>
  );

  const usernameStatus =
    v.username === profile.username
      ? null
      : !validFormat
        ? { ok: false, text: "ชื่อผู้ใช้ต้องมี 3-15 ตัวอักษร (a-z, 0-9, . และ _)" }
        : check.data
          ? check.data.available
            ? { ok: true, text: `${v.username} ใช้งานได้` }
            : { ok: false, text: "ชื่อผู้ใช้นี้ไม่สามารถใช้งานได้" }
          : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลส่วนตัว</DialogTitle>
          <DialogDescription className="sr-only">แก้ไขโปรไฟล์</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>รูปประจำตัว</Label>
            <ImageDropzone
              value={v.avatar}
              onChange={(avatar) => setV({ ...v, avatar })}
              kind="avatar"
            />
          </div>
          <div className="space-y-2">
            <Label>รูปปก</Label>
            <ImageDropzone
              value={v.banner}
              onChange={(banner) => setV({ ...v, banner })}
              kind="banner"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-username">ชื่อผู้ใช้</Label>
            <Input
              id="ep-username"
              required
              value={v.username}
              onChange={(e) => setV({ ...v, username: e.target.value })}
            />
            {usernameStatus && (
              <p
                className={`flex items-center gap-1 text-xs ${usernameStatus.ok ? "text-green-500" : "text-destructive"}`}
              >
                {usernameStatus.ok ? (
                  <Check className="size-3" />
                ) : (
                  <X className="size-3" />
                )}
                {usernameStatus.text}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ep-bio">แนะนำตัว</Label>
            <Textarea
              id="ep-bio"
              maxLength={500}
              value={v.bio}
              onChange={(e) => setV({ ...v, bio: e.target.value })}
            />
          </div>
          {text("website", "เว็บไซต์", "https://")}
          {text("facebook", "Facebook", "https://")}
          {text("twitter", "Twitter / X", "https://")}
          {text("instagram", "Instagram", "https://")}
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
              disabled={
                save.isPending || !validFormat || usernameStatus?.ok === false
              }
            >
              {save.isPending && <Loader2 className="animate-spin" />}
              บันทึก
            </Button>
          </div>
        </form>

        <Separator />
        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            บัญชีและความปลอดภัย
          </p>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => openUserProfile()}
          >
            จัดการอีเมล รหัสผ่าน และบัญชีที่เชื่อมต่อ
          </Button>
        </div>

        <Separator />
        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            ลบบัญชีส่วนบุคคล
          </p>
          <p className="text-xs text-muted-foreground">
            เพื่อทำการยืนยันพิมพ์ <b>{CONFIRM_TEXT}</b> ด้านล่าง:
          </p>
          <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={confirm !== CONFIRM_TEXT || remove.isPending}
            onClick={deleteAccount}
          >
            {remove.isPending && <Loader2 className="animate-spin" />}
            ลบบัญชีส่วนบุคคล
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
