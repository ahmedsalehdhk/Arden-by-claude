import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";
import { one } from "./db";

const COOKIE = "arden_session";
const ALG = "HS256";
const secret = new TextEncoder().encode(env.SESSION_SECRET);

export type Session = { userId: number; email: string; name: string };

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function signSession(s: Session): Promise<string> {
  return new SignJWT({ ...s })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function readSessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
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

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE)?.value;
  return readSessionToken(token);
}

export async function setSessionCookie(s: Session): Promise<void> {
  const token = await signSession(s);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function requireAdmin(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new AuthError("Unauthorized");
  return s;
}

export class AuthError extends Error {}

export async function loginByEmail(
  email: string,
  password: string,
): Promise<Session | null> {
  const row = await one<{ id: number; email: string; name: string; password_hash: string }>(
    "SELECT id, email, name, password_hash FROM users WHERE email = $1",
    [email],
  );
  if (!row) return null;
  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return null;
  return { userId: row.id, email: row.email, name: row.name };
}

export const SESSION_COOKIE = COOKIE;
