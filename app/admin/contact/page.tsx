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
      <PageHeader title="Inbox" right={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn"
            onClick={async () => {
              await api("/api/admin/contact", { method: "POST", body: JSON.stringify({ action: "mark_all_read" }) });
              load();
            }}
          >
            Read all
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
            <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
            Show archived
          </label>
        </div>
      } />
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Contact</th><th>Message</th><th>Received</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="muted">Nothing to show.</td></tr>}
            {rows.map((r) => (
              <tr
                key={r.id}
                style={{ background: r.is_read ? undefined : "#fef3c7", cursor: "pointer" }}
                onClick={() => setOpen(r.id)}
              >
                <td><strong>{r.name || "—"}</strong></td>
                <td>
                  {r.email && <div>{r.email}</div>}
                  {r.phone && <div className="muted">{r.phone}</div>}
                </td>
                <td style={{ maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.message}
                </td>
                <td className="muted" style={{ whiteSpace: "nowrap" }}>{new Date(r.created_at).toLocaleString()}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn" style={{ fontSize: 12 }} onClick={() => markRead(r.id, !r.is_read)}>{r.is_read ? "Unread" : "Read"}</button>{" "}
                  <button className="btn" style={{ fontSize: 12 }} onClick={() => archive(r.id, !r.is_archived)}>{r.is_archived ? "Unarchive" : "Archive"}</button>{" "}
                  <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open !== null && (() => {
        const r = rows.find((x) => x.id === open);
        if (!r) return null;
        return (
          <div
            onClick={() => setOpen(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(17,24,39,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff", borderRadius: 10, padding: 24, width: "min(640px, 100%)",
                maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{r.name || "—"}</h2>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{new Date(r.created_at).toLocaleString()}</div>
                </div>
                <button className="btn" onClick={() => setOpen(null)}>Close</button>
              </div>
              <div style={{ display: "grid", gap: 6, marginBottom: 16, fontSize: 14 }}>
                {r.email && <div><strong>Email:</strong> {r.email}</div>}
                {r.phone && <div><strong>Phone:</strong> {r.phone}</div>}
                {r.active_form && <div className="muted" style={{ fontSize: 12 }}>Form: {r.active_form}</div>}
              </div>
              <div style={{ whiteSpace: "pre-wrap", padding: "12px 14px", background: "#f9fafb", borderRadius: 6, fontSize: 14 }}>
                {r.message}
              </div>
              {r.extra_json && Object.keys(r.extra_json).length > 0 && (
                <pre style={{ fontSize: 12, background: "#f9fafb", padding: 10, borderRadius: 6, marginTop: 12, overflow: "auto" }}>
                  {JSON.stringify(r.extra_json, null, 2)}
                </pre>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button className="btn" onClick={() => markRead(r.id, !r.is_read)}>{r.is_read ? "Mark unread" : "Mark read"}</button>
                <button className="btn" onClick={() => archive(r.id, !r.is_archived)}>{r.is_archived ? "Unarchive" : "Archive"}</button>
                <button className="btn btn-danger" onClick={() => { del(r.id); setOpen(null); }}>Delete</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
