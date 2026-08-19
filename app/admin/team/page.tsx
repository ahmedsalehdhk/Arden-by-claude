"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../_components/api";
import { DragList } from "../_components/DragList";
import PageHeader from "../_components/PageHeader";
import ImageUploader from "../_components/ImageUploader";

type Row = {
  id: number; slug: string; name: string; role: string; image: string | null;
  is_published: boolean; sort_order: number;
};

export default function TeamListPage() {
  const [rows, setRows] = useState<(Row & { _key: string })[]>([]);
  const [dirty, setDirty] = useState(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);

  useEffect(() => { load(); loadGroupImage(); }, []);
  async function load() {
    const data = await api<Row[]>("/api/admin/team");
    setRows(data.map((r) => ({ ...r, _key: String(r.id) })));
    setDirty(false);
  }
  async function loadGroupImage() {
    const { url } = await api<{ url: string | null }>("/api/admin/settings/team-group-image");
    setGroupImage(url);
  }
  async function saveGroupImage(url: string | null) {
    setGroupImage(url);
    await api("/api/admin/settings/team-group-image", { method: "PUT", body: JSON.stringify({ url }) });
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
        <div style={{ display: "flex", gap: 8 }}>
          {dirty && <button className="btn btn-primary" onClick={saveOrder}>Save order</button>}
          <Link href="/admin/team/new" className="btn btn-primary">Add member</Link>
        </div>
      } />

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Full team group photo</h2>
        <p className="muted" style={{ marginTop: 0 }}>Displayed at the bottom of the About page. Recommended aspect ratio 16:7.</p>
        <ImageUploader value={groupImage} onChange={(v) => saveGroupImage(v ?? null)} scope="team" label="Group photo" />
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
