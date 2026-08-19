import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { env } from "./env";

// Directory URLs are always /uploads/... (relative to public/).
const ROOT = env.UPLOAD_DIR; // e.g. "public/uploads"
const PUBLIC_PREFIX = "/" + ROOT.replace(/^public\//, "");

type SaveOptions = {
  scope: "projects" | "news" | "team" | "misc";
  ownerId?: number | string;
  maxWidth?: number;
};

export type SavedImage = { url: string; width: number; height: number };

export async function saveImageFromFormData(
  file: File,
  opts: SaveOptions,
): Promise<SavedImage> {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No file provided");
  }
  const buf = Buffer.from(await file.arrayBuffer());
  return saveImageBuffer(buf, file.name || "upload", opts);
}

export async function saveImageBuffer(
  buf: Buffer,
  filename: string,
  opts: SaveOptions,
): Promise<SavedImage> {
  const subdir = opts.ownerId != null ? `${opts.scope}/${opts.ownerId}` : opts.scope;
  const dir = join(process.cwd(), ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const ext = (extname(filename) || ".jpg").toLowerCase();
  const okExt = [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext) ? ext : ".jpg";
  const base = randomBytes(8).toString("hex");
  const outPath = join(dir, base + okExt);

  const img = sharp(buf, { failOn: "none" }).rotate();
  const resized = opts.maxWidth
    ? img.resize({ width: opts.maxWidth, withoutEnlargement: true })
    : img;

  const outBuf = await resized.toBuffer({ resolveWithObject: true });
  await writeFile(outPath, outBuf.data);

  return {
    url: `${PUBLIC_PREFIX}/${subdir}/${base}${okExt}`,
    width: outBuf.info.width,
    height: outBuf.info.height,
  };
}
