import { NextResponse } from "next/server";
import { getProjectBySlug } from "../../../../lib/projects";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}
