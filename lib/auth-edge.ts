// Edge-runtime-safe subset of auth: session cookie verify only.
// The middleware pulls from here to avoid importing `pg` / `bcryptjs` (both use Node crypto).

import { jwtVerify } from "jose";

const ALG = "HS256";

export type Session = { userId: number; email: string; name: string };
export const SESSION_COOKIE = "arden_session";

export async function readSessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const secretRaw = process.env.SESSION_SECRET;
  if (!secretRaw) return null;
  const secret = new TextEncoder().encode(secretRaw);
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [ALG] });
    if (typeof payload.userId !== "number" || typeof payload.email !== "string") return null;
    return {
      userId: payload.userId,
      email: payload.email,
      name: (payload.name as string) ?? "",
    };
  } catch {
    return null;
  }
}
