import { NextResponse } from "next/server";
import { z } from "zod";
import { many, query } from "../../../../lib/db";
import { getDisplayOrder } from "../../../../lib/projects";

const CreateBody = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
});

type AdminRow = {
  id: number; slug: string; name: string; type: string; status: string;
  location: string; is_featured: boolean; featured_order: number;
  is_published: boolean; updated_at: string;
};

export async function GET() {
  const [rows, orderIds] = await Promise.all([
    many<AdminRow>(
      `SELECT id, slug, name, type, status, location, is_featured, featured_order, is_published, updated_at
         FROM projects`,
    ),
    getDisplayOrder(),
  ]);

  // Attach display_order derived from the saved id-array so the admin UI can
  // show the current order and re-emit it on save.
  const pos = new Map(orderIds.map((id, i) => [id, i]));
  const BIG = Number.MAX_SAFE_INTEGER;
  const withOrder = rows.map((r) => ({
    ...r,
    display_order: pos.has(r.id) ? (pos.get(r.id) as number) : BIG,
  }));
  withOrder.sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name));

  return NextResponse.json(withOrder);
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
