import { NextResponse } from "next/server";
import { z } from "zod";
import { many, query } from "../../../../lib/db";

const Create = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
});

export async function GET() {
  const rows = await many(
    `SELECT id, slug, name, role, image, is_published, sort_order, updated_at
       FROM team_members ORDER BY sort_order ASC, id ASC`,
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  let body: z.infer<typeof Create>;
  try { body = Create.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const maxRow = await many<{ mx: number | null }>(`SELECT MAX(sort_order) AS mx FROM team_members`);
  const nextOrder = (maxRow[0]?.mx ?? -1) + 1;
  try {
    const r = await query<{ id: number }>(
      `INSERT INTO team_members (slug, name, sort_order, is_published) VALUES ($1,$2,$3,FALSE) RETURNING id`,
      [body.slug, body.name, nextOrder],
    );
    return NextResponse.json({ id: r.rows[0].id }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "23505") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    throw e;
  }
}
