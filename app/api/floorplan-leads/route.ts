import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query, one } from "../../../lib/db";
import { normalizeBdPhone } from "../../../lib/phone";

const Body = z.object({
  projectSlug: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const phone = normalizeBdPhone(body.phone);
  if (!phone) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

  const proj = await one<{ id: number }>(
    "SELECT id FROM projects WHERE slug = $1",
    [body.projectSlug],
  );

  await query(
    `INSERT INTO floorplan_leads (project_id, project_slug, name, phone)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (project_slug, phone)
     DO UPDATE SET name = EXCLUDED.name, created_at = NOW(), is_read = FALSE, is_archived = FALSE`,
    [proj?.id ?? null, body.projectSlug, body.name.trim(), phone],
  );

  return NextResponse.json({ ok: true, phone });
}
