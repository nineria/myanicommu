"use client";

export type UploadKind = "post" | "avatar" | "banner" | "inline";

/** Uploads an image to our own database via POST /api/upload and returns its public URL. */
export async function uploadImage(file: File, kind: UploadKind) {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) throw new Error("Upload failed");
  const { url } = (await res.json()) as { url: string };
  return url;
}
