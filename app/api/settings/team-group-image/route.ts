import { NextResponse } from "next/server";
import { getSetting } from "../../../../lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = await getSetting<string>("team_group_image");
  return NextResponse.json({ url });
}
