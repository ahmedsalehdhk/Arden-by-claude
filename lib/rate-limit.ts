// Simple in-memory sliding-window rate limiter.
// Good enough for single-process Node on cPanel; not distributed.

type Bucket = { count: number; resetAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __ardenRateBuckets: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = global.__ardenRateBuckets ?? new Map();
if (process.env.NODE_ENV !== "production") global.__ardenRateBuckets = buckets;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function clientIp(req: Request): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}
