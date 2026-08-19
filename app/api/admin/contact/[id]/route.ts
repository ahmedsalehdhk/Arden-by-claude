import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "../../../../../lib/db";

const Patch = z.object({
  is_read: z.boolean().optional(),
  is_archived: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  let body: z.infer<typeof Patch>;
  try { body = Patch.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  const fields: Array<[string, unknown]> = [];
  if (body.is_read !== undefined) fields.push(["is_read", body.is_read]);
  if (body.is_archived !== undefined) fields.push(["is_archived", body.is_archived]);
  if (!fields.length) return NextResponse.json({ ok: true });
  const set = fields.map(([k], i) => `${k} = $${i + 1}`).join(", ");
  await query(
    `UPDATE contact_submissions SET ${set} WHERE id = $${fields.length + 1}`,
    [...fields.map(([, v]) => v), Number(params.id)],
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await query("DELETE FROM contact_submissions WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
