import { NextRequest } from "next/server";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, isAbsolute, resolve, extname } from "node:path";
import { env } from "../../../lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ROOT = resolve(isAbsolute(env.UPLOAD_DIR) ? env.UPLOAD_DIR : join(process.cwd(), env.UPLOAD_DIR));

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const rel = (params.path || []).join("/");
  const abs = resolve(join(ROOT, rel));
  if (!abs.startsWith(ROOT + "/") && abs !== ROOT) {
    return new Response("Not found", { status: 404 });
  }

  let s;
  try {
    s = await stat(abs);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!s.isFile()) return new Response("Not found", { status: 404 });

  const type = MIME[extname(abs).toLowerCase()] ?? "application/octet-stream";
  const stream = createReadStream(abs) as unknown as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(s.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
