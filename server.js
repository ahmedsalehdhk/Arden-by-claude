// cPanel Node.js startup file.
// On boot: applies pending SQL migrations, creates the seed admin if missing,
// then starts the Next.js production server on process.env.PORT.

const path = require("node:path");
const fs = require("node:fs/promises");

async function runMigrations() {
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename    TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const done = new Set(
    (await pool.query("SELECT filename FROM _migrations")).rows.map((r) => r.filename),
  );

  const dir = path.join(__dirname, "db", "migrations");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await fs.readFile(path.join(dir, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`migration applied: ${file}`);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const pw = process.env.SEED_ADMIN_PASSWORD;
  if (email && pw) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount === 0) {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash(pw, 10);
      await pool.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
        [email, hash, process.env.SEED_ADMIN_NAME || "Admin"],
      );
      console.log(`seed admin created: ${email}`);
    }
  }

  await pool.end();
}

async function startNext() {
  const next = require("next");
  const http = require("node:http");
  const app = next({ dev: false, dir: __dirname });
  const handle = app.getRequestHandler();
  await app.prepare();
  const port = Number(process.env.PORT) || 3000;
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`arden listening on ${port}`);
  });
}

(async () => {
  try {
    await runMigrations();
    await startNext();
  } catch (e) {
    console.error("startup failed:", e);
    process.exit(1);
  }
})();
