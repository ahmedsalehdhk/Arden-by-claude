import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, type Session } from "./auth";

export async function requireAdminSession(): Promise<
  { session: Session } | { response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function parseJson<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | { response: NextResponse }> {
  try {
    const raw = await req.json();
    return { data: schema.parse(raw) };
  } catch (e) {
    const msg = e instanceof z.ZodError ? (e as any).issues ?? (e as any).errors ?? String(e) : "Invalid JSON";
    return {
      response: NextResponse.json({ error: "Invalid payload", detail: msg }, { status: 400 }),
    };
  }
}
