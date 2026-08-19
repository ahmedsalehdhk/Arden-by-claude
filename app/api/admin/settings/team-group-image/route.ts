import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting } from "../../../../../lib/settings";

const KEY = "team_group_image";

export async function GET() {
  const url = await getSetting<string>(KEY);
  return NextResponse.json({ url });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = typeof body?.url === "string" ? body.url : null;
  await setSetting(KEY, url);
  return NextResponse.json({ ok: true, url });
}
