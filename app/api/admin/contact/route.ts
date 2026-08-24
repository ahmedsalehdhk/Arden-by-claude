import { NextRequest, NextResponse } from "next/server";
import { many, query } from "../../../../lib/db";

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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "mark_all_read") {
    await query("UPDATE contact_submissions SET is_read = TRUE WHERE is_archived = FALSE AND is_read = FALSE");
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
