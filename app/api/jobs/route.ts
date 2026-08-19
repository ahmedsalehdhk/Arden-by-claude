import { NextResponse } from "next/server";
import { getOpenJobs } from "../../../lib/jobs";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getOpenJobs());
}
