// Central env reader. Throws early with a clear message if something required is missing.

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing env var: ${name}`);
  return v;
}

function optional(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : fallback;
}

export const env = {
  DATABASE_URL: required("DATABASE_URL"),
  SESSION_SECRET: required("SESSION_SECRET"),
  // Path where uploaded images are written. Absolute in production (e.g.
  // /home/ardenhol/arden-uploads, kept outside the app dir so redeploys don't
  // touch it); relative for local dev. Served by app/uploads/[...path]/route.ts
  // at UPLOAD_URL_PREFIX — no symlink required.
  UPLOAD_DIR: optional("UPLOAD_DIR", ".uploads"),
  // Public URL path prefix that maps to UPLOAD_DIR. Kept configurable so the
  // filesystem path and the public URL are decoupled.
  UPLOAD_URL_PREFIX: optional("UPLOAD_URL_PREFIX", "/uploads"),
  SEED_ADMIN_EMAIL: optional("SEED_ADMIN_EMAIL", ""),
  SEED_ADMIN_PASSWORD: optional("SEED_ADMIN_PASSWORD", ""),
  SEED_ADMIN_NAME: optional("SEED_ADMIN_NAME", "Admin"),
};
