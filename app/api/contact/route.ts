import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query } from "../../../lib/db";
import { rateLimit, clientIp } from "../../../lib/rate-limit";

const Body = z.object({
  activeForm: z.string().max(64).optional(),
  name: z.string().max(200).default(""),
  email: z.string().email().max(200).or(z.literal("")).default(""),
  phone: z.string().max(50).default(""),
  message: z.string().max(5000).default(""),
  extra: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(`contact:${clientIp(req)}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "retry-after": String(rl.retryAfter) } });
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await query(
    `INSERT INTO contact_submissions (active_form, name, email, phone, message, extra_json)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      body.activeForm ?? null,
      body.name,
      body.email,
      body.phone,
      body.message,
      body.extra ?? {},
    ],
  );
  return NextResponse.json({ ok: true });
}
