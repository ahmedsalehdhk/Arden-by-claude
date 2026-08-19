import { NextResponse } from "next/server";
import { z } from "zod";
import { one, query } from "../../../../../lib/db";

const Patch = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["full-time","part-time","contract","internship"]).optional(),
  summary: z.string().optional(),
  description_md: z.string().optional(),
  is_open: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const row = await one("SELECT * FROM job_postings WHERE id = $1", [Number(params.id)]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: z.infer<typeof Patch>;
  try { body = Patch.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const fields: Array<[string, unknown]> = [];
  for (const k of ["slug","title","department","location","type","summary","description_md","is_open"] as const) {
    if (body[k] !== undefined) fields.push([k, body[k]]);
  }
  if (!fields.length) return NextResponse.json({ ok: true });
  const set = fields.map(([k], i) => `${k} = $${i + 1}`).join(", ");
  await query(
    `UPDATE job_postings SET ${set}, updated_at = NOW() WHERE id = $${fields.length + 1}`,
    [...fields.map(([, v]) => v), Number(params.id)],
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await query("DELETE FROM job_postings WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
