"use client";
import { useEffect, useState } from "react";
import { api } from "../_components/api";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; active_form: string | null; name: string; email: string;
  phone: string; message: string; extra_json: Record<string, unknown>;
  created_at: string; is_read: boolean; is_archived: boolean;
};

export default function ContactInbox() {
  const [rows, setRows] = useState<Row[]>([]);
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { load(); }, [archived]);
  async function load() { setRows(await api<Row[]>(`/api/admin/contact?archived=${archived}`)); }
  async function markRead(id: number, v: boolean) {
    await api(`/api/admin/contact/${id}`, { method: "PATCH", body: JSON.stringify({ is_read: v }) });
    load();
  }
  async function archive(id: number, v: boolean) {
    await api(`/api/admin/contact/${id}`, { method: "PATCH", body: JSON.stringify({ is_archived: v }) });
    load();
  }
  async function del(id: number) {
    if (!confirm("Delete this message?")) return;
    await api(`/api/admin/contact/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <div>
      <PageHeader title="Contact inbox" right={
        <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
          <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
          Show archived
        </label>
      } />
      <div className="card">
        <table>
          <thead><tr><th></th><th>Name</th><th>Contact</th><th>Message</th><th>Received</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="muted">Nothing to show.</td></tr>}
            {rows.map((r) => (
              <>
                <tr key={r.id} style={{ background: r.is_read ? undefined : "#fef3c7" }}>
                  <td style={{ width: 20 }}>
                    <button className="btn" style={{ fontSize: 12, padding: "2px 8px" }}
                            onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? "−" : "+"}</button>
                  </td>
                  <td><strong>{r.name || "—"}</strong></td>
                  <td>
                    {r.email && <div>{r.email}</div>}
                    {r.phone && <div className="muted">{r.phone}</div>}
                  </td>
                  <td style={{ maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.message}
                  </td>
                  <td className="muted" style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleString()}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="btn" style={{ fontSize: 12 }} onClick={() => markRead(r.id, !r.is_read)}>{r.is_read ? "Unread" : "Read"}</button>{" "}
                    <button className="btn" style={{ fontSize: 12 }} onClick={() => archive(r.id, !r.is_archived)}>{r.is_archived ? "Unarchive" : "Archive"}</button>{" "}
                    <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => del(r.id)}>Delete</button>
                  </td>
                </tr>
                {open === r.id && (
                  <tr key={`${r.id}-open`}>
                    <td></td>
                    <td colSpan={5}>
                      <div style={{ whiteSpace: "pre-wrap", padding: "8px 0" }}>{r.message}</div>
                      {r.active_form && <div className="muted" style={{ fontSize: 12 }}>Form: {r.active_form}</div>}
                      {r.extra_json && Object.keys(r.extra_json).length > 0 && (
                        <pre style={{ fontSize: 12, background: "#f9fafb", padding: 8, borderRadius: 4 }}>
                          {JSON.stringify(r.extra_json, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
