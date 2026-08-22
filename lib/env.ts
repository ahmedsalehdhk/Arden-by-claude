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
  // Absolute path where uploaded images are written. On cPanel this points
  // OUTSIDE the app dir (e.g. /home/ardenhol/arden-uploads) and is symlinked
  // into public/uploads so Next serves them at UPLOAD_URL_PREFIX.
  UPLOAD_DIR: optional("UPLOAD_DIR", "public/uploads"),
  // Public URL path prefix that maps to UPLOAD_DIR. Kept configurable so the
  // filesystem path and the public URL are decoupled.
  UPLOAD_URL_PREFIX: optional("UPLOAD_URL_PREFIX", "/uploads"),
  SEED_ADMIN_EMAIL: optional("SEED_ADMIN_EMAIL", ""),
  SEED_ADMIN_PASSWORD: optional("SEED_ADMIN_PASSWORD", ""),
  SEED_ADMIN_NAME: optional("SEED_ADMIN_NAME", "Admin"),
};
