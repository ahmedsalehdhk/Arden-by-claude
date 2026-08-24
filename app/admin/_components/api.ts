export async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`${r.status} ${r.statusText}: ${body}`);
  }
  if (r.status === 204) return undefined as T;
  return r.json();
}

export async function uploadImage(
  file: File,
  scope: "projects" | "news" | "team" | "misc",
  ownerId?: number | string,
): Promise<{ url: string; width: number; height: number }> {
  const fd = new FormData();
  fd.set("file", file);
  fd.set("scope", scope);
  if (ownerId != null) fd.set("ownerId", String(ownerId));
  const r = await fetch("/api/admin/uploads", { method: "POST", body: fd });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
