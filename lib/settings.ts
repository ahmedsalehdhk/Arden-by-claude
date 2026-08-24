import { one, query } from "./db";

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const row = await one<{ value: T }>("SELECT value FROM site_settings WHERE key = $1", [key]);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await query(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)],
  );
}
