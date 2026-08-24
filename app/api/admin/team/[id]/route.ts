import { NextResponse } from "next/server";
import { z } from "zod";
import { one, query } from "../../../../../lib/db";

const Patch = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  quote: z.string().optional(),
  image: z.string().nullable().optional(),
  bio_md: z.string().optional(),
  is_published: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const row = await one("SELECT * FROM team_members WHERE id = $1", [Number(params.id)]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: z.infer<typeof Patch>;
  try { body = Patch.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const fields: Array<[string, unknown]> = [];
  for (const k of ["slug","name","role","quote","image","bio_md","is_published"] as const) {
    if (body[k] !== undefined) fields.push([k, body[k]]);
  }
  if (!fields.length) return NextResponse.json({ ok: true });
  const set = fields.map(([k], i) => `${k} = $${i + 1}`).join(", ");
  await query(
    `UPDATE team_members SET ${set}, updated_at = NOW() WHERE id = $${fields.length + 1}`,
    [...fields.map(([, v]) => v), Number(params.id)],
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await query("DELETE FROM team_members WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
