import { NextRequest, NextResponse } from "next/server";
import { saveImageFromFormData } from "../../../../lib/uploads";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const scope = (form.get("scope") as string) || "misc";
  const ownerId = (form.get("ownerId") as string) || undefined;
  const rawMaxWidth = form.get("maxWidth") ? Number(form.get("maxWidth")) : 2400;
  const maxWidth = Math.min(Math.max(64, rawMaxWidth || 2400), 4000);

  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 413 });
  }
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }
  if (!["projects","news","team","misc"].includes(scope)) {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }
  const saved = await saveImageFromFormData(file, { scope: scope as any, ownerId, maxWidth });
  return NextResponse.json(saved);
}
