"use client";
import { useEffect, useState } from "react";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; project_id: number | null; project_slug: string;
  name: string; phone: string; created_at: string; is_read: boolean; is_archived: boolean;
};

export default function LeadsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [archived, setArchived] = useState(false);
  const [project, setProject] = useState("");
  useEffect(() => { load(); }, [archived, project]);
  async function load() {
    const q = new URLSearchParams({ archived: String(archived) });
    if (project) q.set("project", project);
    setRows(await api<Row[]>(`/api/admin/floorplan-leads?${q.toString()}`));
  }
  async function toggleRead(id: number, v: boolean) {
    await api(`/api/admin/floorplan-leads/${id}`, { method: "PATCH", body: JSON.stringify({ is_read: v }) });
    load();
  }
  async function toggleArchive(id: number, v: boolean) {
    await api(`/api/admin/floorplan-leads/${id}`, { method: "PATCH", body: JSON.stringify({ is_archived: v }) });
    load();
  }
  async function del(id: number) {
    if (!confirm("Delete this lead?")) return;
    await api(`/api/admin/floorplan-leads/${id}`, { method: "DELETE" });
    load();
  }
  const uniqueProjects = Array.from(new Set(rows.map((r) => r.project_slug))).sort();

  return (
    <div>
      <PageHeader title="Website leads" right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn"
            onClick={async () => {
              await api("/api/admin/floorplan-leads", { method: "POST", body: JSON.stringify({ action: "mark_all_read" }) });
              load();
            }}
          >
            Read all
          </button>
          <label style={{ margin: 0, textTransform: "none", letterSpacing: 0, fontWeight: 500, fontSize: 12 }}>Project</label>
          <select value={project} onChange={(e) => setProject(e.target.value)} style={{ width: 200 }}>
            <option value="">All projects</option>
            {uniqueProjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0, fontSize: 13 }}>
            <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
            Archived
          </label>
          <a className="btn"
             href={`/api/admin/floorplan-leads/export?${new URLSearchParams({ archived: String(archived), ...(project ? { project } : {}) }).toString()}`}>
            Export CSV
          </a>
        </div>
      } />
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Project</th><th>Received</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="muted">No leads.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} style={{ background: r.is_read ? undefined : "#fef3c7" }}>
                <td><strong>{r.name}</strong></td>
                <td><a href={`tel:${r.phone}`}>{r.phone}</a></td>
                <td>{r.project_slug}</td>
                <td className="muted" style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleString()}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="btn" style={{ fontSize: 12 }} onClick={() => toggleRead(r.id, !r.is_read)}>{r.is_read ? "Unread" : "Read"}</button>{" "}
                  <button className="btn" style={{ fontSize: 12 }} onClick={() => toggleArchive(r.id, !r.is_archived)}>{r.is_archived ? "Unarchive" : "Archive"}</button>{" "}
                  <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
