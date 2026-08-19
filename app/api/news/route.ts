import { NextResponse } from "next/server";
import { getPublishedNews } from "../../../lib/news";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPublishedNews());
}
