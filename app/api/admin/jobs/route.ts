import { NextResponse } from "next/server";
import { z } from "zod";
import { many, query } from "../../../../lib/db";

const Create = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
});

export async function GET() {
  return NextResponse.json(
    await many(
      `SELECT id, slug, title, department, location, type, is_open, posted_at, updated_at
         FROM job_postings ORDER BY posted_at DESC`,
    ),
  );
}

export async function POST(req: Request) {
  let body: z.infer<typeof Create>;
  try { body = Create.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  try {
    const r = await query<{ id: number }>(
      `INSERT INTO job_postings (slug, title, is_open) VALUES ($1,$2,FALSE) RETURNING id`,
      [body.slug, body.title],
    );
    return NextResponse.json({ id: r.rows[0].id }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw e;
  }
}
