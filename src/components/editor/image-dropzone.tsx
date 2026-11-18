"use client";

import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { uploadImage } from "@/components/editor/image-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export function ImageDropzone({
  value,
  onChange,
  kind = "post",
  label = "ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์",
  className,
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  kind?: "post" | "avatar" | "banner";
  label?: string;
  className?: string;
}) {
  const trpc = useTRPC();
  const presign = useMutation(trpc.upload.presign.mutationOptions());

  const upload = useMutation({
    mutationFn: (file: File) => uploadImage(file, presign.mutateAsync, kind),
    onSuccess: (url) => onChange(url),
    onError: () => toast.error("อัปโหลดรูปภาพไม่สำเร็จ"),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error("ไฟล์ต้องเป็นรูปภาพขนาดไม่เกิน 5MB"),
    onDrop: (files) => files[0] && upload.mutate(files[0]),
  });

  if (value) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-md border", className)}
      >
        {/* biome-ignore lint/performance/noImgElement: user supplied remote url preview */}
        <img src={value} alt="" className="max-h-64 w-full object-contain" />
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={() => onChange(null)}
          aria-label="ลบรูปภาพ"
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-primary",
        isDragActive && "border-primary bg-primary/5",
        className,
      )}
    >
      <input {...getInputProps()} />
      {upload.isPending ? <Loader2 className="animate-spin" /> : <ImagePlus />}
      <span>{label}</span>
    </div>
  );
}
