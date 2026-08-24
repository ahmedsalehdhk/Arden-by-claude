import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, getFeaturedProjects } from "../../../lib/projects";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const featured = req.nextUrl.searchParams.get("featured") === "true";
  const rows = featured ? await getFeaturedProjects() : await getAllProjects();
  return NextResponse.json(rows);
}
