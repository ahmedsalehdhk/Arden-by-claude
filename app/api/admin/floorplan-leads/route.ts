import { NextRequest, NextResponse } from "next/server";
import { many } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const showArchived = req.nextUrl.searchParams.get("archived") === "true";
  const project = req.nextUrl.searchParams.get("project") ?? "";
  const params: unknown[] = [showArchived];
  let where = "is_archived = $1";
  if (project) { params.push(project); where += ` AND project_slug = $${params.length}`; }
  const rows = await many(
    `SELECT id, project_id, project_slug, name, phone, created_at, is_read, is_archived
       FROM floorplan_leads WHERE ${where} ORDER BY created_at DESC LIMIT 1000`,
    params,
  );
  return NextResponse.json(rows);
}
