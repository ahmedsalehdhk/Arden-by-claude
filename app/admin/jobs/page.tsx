"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; title: string; department: string; location: string;
  type: string; is_open: boolean; posted_at: string;
};

export default function JobsListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { load(); }, []);
  async function load() { setRows(await api<Row[]>("/api/admin/jobs")); }
  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await api(`/api/admin/jobs/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <div>
      <PageHeader title="Career postings" right={<Link href="/admin/jobs/new" className="btn btn-primary">Add posting</Link>} />
      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="muted">No postings yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id}>
                <td><span style={{ fontWeight: 600 }}>{r.title}</span></td>
                <td>{r.department || "—"}</td>
                <td>{r.location || "—"}</td>
                <td>{r.type}</td>
                <td><span className={`badge ${r.is_open ? "badge-on" : "badge-off"}`}>{r.is_open ? "Open" : "Closed"}</span></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/jobs/${r.id}`} className="btn" style={{ fontSize: 12 }}>Edit</Link>{" "}
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
