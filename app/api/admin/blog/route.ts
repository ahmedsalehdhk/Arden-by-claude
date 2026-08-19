import { NextResponse } from "next/server";
import { z } from "zod";
import { many, query } from "../../../../lib/db";

const Create = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
});

export async function GET() {
  const rows = await many(
    `SELECT p.id, p.slug, p.title, p.category, p.is_published, p.published_at, p.updated_at,
            (SELECT url FROM news_images i WHERE i.post_id = p.id AND i.is_cover LIMIT 1) AS cover_image
       FROM news_posts p ORDER BY COALESCE(p.published_at, p.created_at) DESC`,
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let body: z.infer<typeof Create>;
  try { body = Create.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  try {
    const r = await query<{ id: number }>(
      `INSERT INTO news_posts (slug, title, category, is_published) VALUES ($1,$2,'news',FALSE) RETURNING id`,
      [body.slug, body.title],
    );
    return NextResponse.json({ id: r.rows[0].id }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw e;
  }
}
