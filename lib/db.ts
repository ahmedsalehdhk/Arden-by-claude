import { Pool, type QueryResult, type QueryResultRow } from "pg";
import { env } from "./env";

// Single Pool across HMR reloads.
declare global {
  // eslint-disable-next-line no-var
  var __ardenPgPool: Pool | undefined;
}

export const pool: Pool =
  global.__ardenPgPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__ardenPgPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params as never);
}

export async function one<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const r = await query<T>(text, params);
  return r.rows[0] ?? null;
}

export async function many<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const r = await query<T>(text, params);
  return r.rows;
}

export async function withTx<T>(fn: (client: import("pg").PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const out = await fn(client);
    await client.query("COMMIT");
    return out;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
