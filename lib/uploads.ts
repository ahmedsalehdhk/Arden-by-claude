import { mkdir, writeFile } from "node:fs/promises";
import { join, isAbsolute, extname } from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { env } from "./env";

// Physical write path — absolute if given, otherwise resolved against cwd.
const ROOT = isAbsolute(env.UPLOAD_DIR) ? env.UPLOAD_DIR : join(process.cwd(), env.UPLOAD_DIR);
// Public URL that maps to ROOT. Trimmed of any trailing slash for clean joins.
const URL_PREFIX = env.UPLOAD_URL_PREFIX.replace(/\/+$/, "");

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
  const dir = join(ROOT, subdir);
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
    url: `${URL_PREFIX}/${subdir}/${base}${okExt}`,
    width: outBuf.info.width,
    height: outBuf.info.height,
  };
}
