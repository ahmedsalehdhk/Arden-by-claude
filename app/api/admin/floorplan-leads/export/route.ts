import { NextRequest } from "next/server";
import { many } from "../../../../../lib/db";

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest) {
  const project = req.nextUrl.searchParams.get("project") ?? "";
  const includeArchived = req.nextUrl.searchParams.get("archived") === "true";
  const params: unknown[] = [];
  let where = "TRUE";
  if (!includeArchived) where += " AND is_archived = FALSE";
  if (project) { params.push(project); where += ` AND project_slug = $${params.length}`; }
  const rows = await many<{
    id: number; project_slug: string; name: string; phone: string; created_at: string;
  }>(
    `SELECT id, project_slug, name, phone, created_at
       FROM floorplan_leads WHERE ${where} ORDER BY created_at DESC`,
    params,
  );
  const header = "id,project_slug,name,phone,created_at";
  const body = rows.map((r) => [r.id, r.project_slug, r.name, r.phone, r.created_at].map(csvEscape).join(",")).join("\n");
  return new Response(header + "\n" + body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="floorplan-leads-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
