import { NextResponse } from "next/server";
import { z } from "zod";
import { many, query } from "../../../../lib/db";

const CreateBody = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
});

export async function GET() {
  const rows = await many(
    `SELECT id, slug, name, type, status, location, is_featured, featured_order, display_order, is_published, updated_at
       FROM projects ORDER BY display_order ASC, name ASC`,
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let body: z.infer<typeof CreateBody>;
  try { body = CreateBody.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  try {
    const r = await query<{ id: number }>(
      `INSERT INTO projects (slug, name, is_published) VALUES ($1,$2,FALSE) RETURNING id`,
      [body.slug, body.name],
    );
    return NextResponse.json({ id: r.rows[0].id }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw e;
  }
}
