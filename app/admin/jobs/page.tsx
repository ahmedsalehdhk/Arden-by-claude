"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; title: string; department: string; location: string;
  type: string; is_open: boolean; posted_at: string;
};

export default function JobsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [creating, setCreating] = useState(false);
  useEffect(() => { load(); }, []);
  async function load() { setRows(await api<Row[]>("/api/admin/jobs")); }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/jobs", {
        method: "POST",
        body: JSON.stringify({ slug: fd.get("slug"), title: fd.get("title") }),
      });
      router.push(`/admin/jobs/${id}`);
    } catch (err: any) { alert(err.message); }
    finally { setCreating(false); }
  }
  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api(`/api/admin/jobs/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <div>
      <PageHeader title="Career postings" />
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={create} className="row" style={{ alignItems: "flex-end" }}>
          <div><label>Title</label><input name="title" required /></div>
          <div><label>Slug</label><input name="slug" pattern="[a-z0-9-]+" required /></div>
          <div style={{ flex: 0 }}><button className="btn btn-primary" disabled={creating}>Add posting</button></div>
        </form>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="muted">No postings yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/admin/jobs/${r.id}`} style={{ fontWeight: 600 }}>{r.title}</Link></td>
                <td>{r.department || "—"}</td>
                <td>{r.location || "—"}</td>
                <td>{r.type}</td>
                <td><span className={`badge ${r.is_open ? "badge-on" : "badge-off"}`}>{r.is_open ? "Open" : "Closed"}</span></td>
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
