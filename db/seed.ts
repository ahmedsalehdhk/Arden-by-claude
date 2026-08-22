// Minimal seed: creates the initial admin user from env vars.
// Projects, team members, news posts, and job postings are all managed
// through the admin panel — no content is seeded here.
// Run with: npm run db:seed

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import bcrypt from "bcryptjs";

async function main() {
  const { pool } = await import("../lib/db");

  const email = process.env.SEED_ADMIN_EMAIL;
  const pw = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !pw) {
    console.log("· no SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in env — skipping");
    await pool.end();
    return;
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    console.log(`· admin user ${email} already exists, skipping`);
  } else {
    const hash = await bcrypt.hash(pw, 10);
    await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
      [email, hash, process.env.SEED_ADMIN_NAME || "Admin"],
    );
    console.log(`✔ admin user ${email}`);
  }

  console.log("Done.");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
