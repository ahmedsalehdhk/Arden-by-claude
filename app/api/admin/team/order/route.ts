import { NextResponse } from "next/server";
import { z } from "zod";
import { withTx } from "../../../../../lib/db";

const Body = z.object({ ids: z.array(z.number().int().positive()) });

export async function PATCH(req: Request) {
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  await withTx(async (c) => {
    for (let i = 0; i < body.ids.length; i++) {
      await c.query("UPDATE team_members SET sort_order = $1, updated_at = NOW() WHERE id = $2", [i, body.ids[i]]);
    }
  });
  return NextResponse.json({ ok: true });
}
