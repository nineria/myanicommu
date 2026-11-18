import sharp from "sharp";

/** Builds a tiny (≤16px) webp data URL (~300-600 bytes) to use as a blur-up placeholder. */
export async function makeBlurDataURL(
  data: Uint8Array,
): Promise<string | null> {
  try {
    const buf = await sharp(data, { animated: false })
      .rotate()
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
