import { NextResponse } from "next/server";
import { getPublishedTeam } from "../../../lib/team";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublishedTeam());
}
