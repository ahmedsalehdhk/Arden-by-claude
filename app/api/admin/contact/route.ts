import { NextRequest, NextResponse } from "next/server";
import { many } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const showArchived = req.nextUrl.searchParams.get("archived") === "true";
  const rows = await many(
    `SELECT id, active_form, name, email, phone, message, extra_json, created_at, is_read, is_archived
       FROM contact_submissions
      WHERE is_archived = $1
      ORDER BY created_at DESC LIMIT 500`,
    [showArchived],
  );
  return NextResponse.json(rows);
}
