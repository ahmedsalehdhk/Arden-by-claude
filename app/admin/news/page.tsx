"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; title: string; category: "news" | "event";
  is_published: boolean; published_at: string | null; cover_image: string | null;
};

export default function NewsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [creating, setCreating] = useState(false);
  useEffect(() => { load(); }, []);
  async function load() { setRows(await api<Row[]>("/api/admin/news")); }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/news", {
        method: "POST",
        body: JSON.stringify({ slug: fd.get("slug"), title: fd.get("title") }),
      });
      router.push(`/admin/news/${id}`);
    } catch (err: any) { alert(err.message); }
    finally { setCreating(false); }
  }
  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api(`/api/admin/news/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <div>
      <PageHeader title="News & events" />
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={create} className="row" style={{ alignItems: "flex-end" }}>
          <div><label>Title</label><input name="title" required /></div>
          <div><label>Slug</label><input name="slug" pattern="[a-z0-9-]+" required /></div>
          <div style={{ flex: 0 }}><button className="btn btn-primary" disabled={creating}>New post</button></div>
        </form>
      </div>
      <div className="card">
        <table>
          <thead><tr><th></th><th>Title</th><th>Type</th><th>Published</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="muted">No posts yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ width: 64 }}>
                  {r.cover_image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={r.cover_image} alt="" style={{ width: 48, height: 34, objectFit: "cover", borderRadius: 4 }} />
                    : <div style={{ width: 48, height: 34, background: "#e5e7eb", borderRadius: 4 }} />}
                </td>
                <td><Link href={`/admin/news/${r.id}`} style={{ fontWeight: 600 }}>{r.title}</Link></td>
                <td>{r.category}</td>
                <td>{r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}</td>
                <td><span className={`badge ${r.is_published ? "badge-on" : "badge-off"}`}>{r.is_published ? "Live" : "Draft"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => remove(r.id, r.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
