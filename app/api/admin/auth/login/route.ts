import { NextResponse } from "next/server";
import { z } from "zod";
import { loginByEmail, setSessionCookie } from "../../../../../lib/auth";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const session = await loginByEmail(body.email, body.password);
  if (!session) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await setSessionCookie(session);
  return NextResponse.json({ ok: true, user: session });
}
