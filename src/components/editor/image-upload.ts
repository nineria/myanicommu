"use client";

/** Uploads a File straight to S3/R2 using a presigned URL from `upload.presign`. */
export async function uploadImage(
  file: File,
  presign: (input: {
    kind: "post" | "avatar" | "banner" | "inline";
    contentType: string;
  }) => Promise<{ uploadUrl: string; publicUrl: string }>,
  kind: "post" | "avatar" | "banner" | "inline",
) {
  const { uploadUrl, publicUrl } = await presign({
    kind,
    contentType: file.type,
  });
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error("Upload failed");
  return publicUrl;
}
