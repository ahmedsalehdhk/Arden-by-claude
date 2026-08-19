import { NextResponse } from "next/server";
import { getNewsBySlug } from "../../../../lib/news";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post || !post.is_published) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}
