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
  UPLOAD_DIR: optional("UPLOAD_DIR", "public/uploads"),
  SEED_ADMIN_EMAIL: optional("SEED_ADMIN_EMAIL", ""),
  SEED_ADMIN_PASSWORD: optional("SEED_ADMIN_PASSWORD", ""),
  SEED_ADMIN_NAME: optional("SEED_ADMIN_NAME", "Admin"),
};
