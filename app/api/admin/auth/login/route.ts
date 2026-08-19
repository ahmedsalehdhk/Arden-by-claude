import { NextResponse } from "next/server";
import { z } from "zod";
import { loginByEmail, setSessionCookie } from "../../../../../lib/auth";
import { rateLimit, clientIp } from "../../../../../lib/rate-limit";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`login:${ip}`, 10, 10 * 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "retry-after": String(rl.retryAfter) } });
  }

  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Invalid payload" }, { status: 400 }); }

  const session = await loginByEmail(body.email, body.password);
  if (!session) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await setSessionCookie(session);
  return NextResponse.json({ ok: true, user: session });
}
