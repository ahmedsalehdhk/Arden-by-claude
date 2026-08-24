"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; title: string; category: "news" | "event";
  is_published: boolean; published_at: string | null; cover_image: string | null;
};

export default function NewsListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { load(); }, []);
  async function load() { setRows(await api<Row[]>("/api/admin/blog")); }
  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <div>
      <PageHeader title="News & events" right={<Link href="/admin/blog/new" className="btn btn-primary">New post</Link>} />
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
                <td><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                <td>{r.category}</td>
                <td>{r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}</td>
                <td><span className={`badge ${r.is_published ? "badge-on" : "badge-off"}`}>{r.is_published ? "Live" : "Draft"}</span></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/blog/${r.id}`} className="btn" style={{ fontSize: 12 }}>Edit</Link>{" "}
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
