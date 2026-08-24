// Migration runner. Applies every .sql file under db/migrations that hasn't been recorded yet.
// Run with: npm run db:migrate

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(HERE, "migrations");

async function main() {
  const { pool } = await import("../lib/db");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename    TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const doneRows = await pool.query<{ filename: string }>(`SELECT filename FROM _migrations`);
  const done = new Set(doneRows.rows.map((r) => r.filename));

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(join(MIGRATIONS_DIR, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(`INSERT INTO _migrations (filename) VALUES ($1)`, [file]);
      await client.query("COMMIT");
      console.log(`✔ ${file}`);
      ran++;
    } catch (e) {
      await client.query("ROLLBACK");
      console.error(`✖ ${file}`);
      throw e;
    } finally {
      client.release();
    }
  }

  if (ran === 0) console.log("Nothing to apply — schema up to date.");
  else console.log(`Applied ${ran} migration(s).`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
