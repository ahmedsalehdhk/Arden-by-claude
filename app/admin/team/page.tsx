"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../_components/api";
import { DragList } from "../_components/DragList";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; name: string; role: string; image: string | null;
  is_published: boolean; sort_order: number;
};

export default function TeamListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<(Row & { _key: string })[]>([]);
  const [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    const data = await api<Row[]>("/api/admin/team");
    setRows(data.map((r) => ({ ...r, _key: String(r.id) })));
    setDirty(false);
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/team", {
        method: "POST",
        body: JSON.stringify({ slug: fd.get("slug"), name: fd.get("name") }),
      });
      router.push(`/admin/team/${id}`);
    } catch (err: any) { alert(err.message); }
    finally { setCreating(false); }
  }
  async function saveOrder() {
    await api("/api/admin/team/order", { method: "PATCH", body: JSON.stringify({ ids: rows.map((r) => r.id) }) });
    setDirty(false);
  }
  async function remove(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await api(`/api/admin/team/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader title="Team" right={
        dirty && <button className="btn btn-primary" onClick={saveOrder}>Save order</button>
      } />

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={create} className="row" style={{ alignItems: "flex-end" }}>
          <div><label>Name</label><input name="name" required /></div>
          <div><label>Slug (a–z, 0–9, -)</label><input name="slug" pattern="[a-z0-9-]+" required /></div>
          <div style={{ flex: 0 }}><button className="btn btn-primary" disabled={creating}>Add member</button></div>
        </form>
      </div>

      <DragList
        items={rows}
        onChange={(next) => { setRows(next); setDirty(true); }}
        renderItem={(r) => (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {r.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.image} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e5e7eb" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{r.role || "—"}</div>
            </div>
            <span className={`badge ${r.is_published ? "badge-on" : "badge-off"}`}>
              {r.is_published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/team/${r.id}`} className="btn" style={{ fontSize: 12 }}>Edit</Link>
            <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => remove(r.id, r.name)}>Delete</button>
          </div>
        )}
      />
    </div>
  );
}
