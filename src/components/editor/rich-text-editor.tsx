"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/components/editor/image-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

/** Tiptap replacement for the old @mantine/rte editor. Stores HTML. */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const trpc = useTRPC();
  const presign = useMutation(trpc.upload.presign.mutationOptions());
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "เขียนข้อความ..." }),
    ],
    content: value,
    editorProps: { attributes: { class: "tiptap rich-text px-3 py-2" } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  if (!editor)
    return <div className={cn("min-h-40 rounded-md border", className)} />;

  const btn = (
    label: string,
    Icon: typeof Bold,
    run: () => void,
    active?: boolean,
  ) => (
    <Button
      key={label}
      type="button"
      size="icon"
      variant={active ? "secondary" : "ghost"}
      className="size-8"
      aria-label={label}
      onClick={run}
    >
      <Icon className="size-4" />
    </Button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file, presign.mutateAsync, "inline");
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
    }
  };

  return (
    <div className={cn("rounded-md border bg-input/40", className)}>
      <div className="flex flex-wrap gap-0.5 border-b p-1">
        {btn(
          "Bold",
          Bold,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
        )}
        {btn(
          "Italic",
          Italic,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
        )}
        {btn(
          "Strike",
          Strikethrough,
          () => editor.chain().focus().toggleStrike().run(),
          editor.isActive("strike"),
        )}
        {btn(
          "Heading",
          Heading2,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading"),
        )}
        {btn(
          "Bullet list",
          List,
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
        )}
        {btn(
          "Ordered list",
          ListOrdered,
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
        )}
        {btn(
          "Quote",
          Quote,
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote"),
        )}
        {btn("Link", LinkIcon, setLink, editor.isActive("link"))}
        {btn("Image", ImagePlus, () => fileRef.current?.click())}
        {btn("Undo", Undo2, () => editor.chain().focus().undo().run())}
        {btn("Redo", Redo2, () => editor.chain().focus().redo().run())}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
