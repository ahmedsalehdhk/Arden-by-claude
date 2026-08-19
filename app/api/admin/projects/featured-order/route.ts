import { NextResponse } from "next/server";
import { z } from "zod";
import { setFeaturedOrder } from "../../../../../lib/projects";

const Body = z.object({ ids: z.array(z.number().int().positive()) });

export async function PATCH(req: Request) {
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }
  await setFeaturedOrder(body.ids);
  return NextResponse.json({ ok: true });
}
