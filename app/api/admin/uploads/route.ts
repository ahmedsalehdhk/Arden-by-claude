import { NextRequest, NextResponse } from "next/server";
import { saveImageFromFormData } from "../../../../lib/uploads";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const scope = (form.get("scope") as string) || "misc";
  const ownerId = (form.get("ownerId") as string) || undefined;
  const maxWidth = form.get("maxWidth") ? Number(form.get("maxWidth")) : 2400;

  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!["projects","news","team","misc"].includes(scope)) {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }
  const saved = await saveImageFromFormData(file, { scope: scope as any, ownerId, maxWidth });
  return NextResponse.json(saved);
}
