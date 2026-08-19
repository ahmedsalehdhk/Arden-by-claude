"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../_components/api";
import { DragList } from "../_components/DragList";
import PageHeader from "../_components/PageHeader";

type Row = {
  id: number; slug: string; name: string; type: string; status: string;
  location: string; is_featured: boolean; featured_order: number; is_published: boolean;
};

export default function ProjectsListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"all" | "featured">("all");
  const [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    const data = await api<Row[]>("/api/admin/projects");
    setRows(data);
    setDirty(false);
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ slug: fd.get("slug"), name: fd.get("name") }),
      });
      router.push(`/admin/projects/${id}`);
    } catch (err: any) { alert(err.message); }
    finally { setCreating(false); }
  }
  async function remove(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await api(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  }
  async function toggleFeatured(id: number, is: boolean) {
    await api(`/api/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify({ is_featured: is }) });
    load();
  }

  const featured = rows.filter((r) => r.is_featured).sort((a, b) => a.featured_order - b.featured_order)
    .map((r) => ({ ...r, _key: String(r.id) }));

  async function saveOrder(next: typeof featured) {
    setDirty(false);
    await api("/api/admin/projects/featured-order", {
      method: "PATCH", body: JSON.stringify({ ids: next.map((r) => r.id) }),
    });
    load();
  }

  return (
    <div>
      <PageHeader title="Projects" />
      <div className="tabs">
        <div className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All ({rows.length})</div>
        <div className={`tab ${tab === "featured" ? "active" : ""}`} onClick={() => setTab("featured")}>Featured on home ({featured.length})</div>
      </div>

      {tab === "all" && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <form onSubmit={create} className="row" style={{ alignItems: "flex-end" }}>
              <div><label>Name</label><input name="name" required /></div>
              <div><label>Slug</label><input name="slug" pattern="[a-z0-9-]+" required /></div>
              <div style={{ flex: 0 }}><button className="btn btn-primary" disabled={creating}>New project</button></div>
            </form>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Location</th><th>Featured</th><th>Published</th><th></th></tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={7} className="muted">No projects yet.</td></tr>}
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td><Link href={`/admin/projects/${r.id}`} style={{ fontWeight: 600 }}>{r.name}</Link>
                        <div className="muted" style={{ fontSize: 12 }}>/{r.slug}</div></td>
                    <td>{r.type}</td>
                    <td>{r.status}</td>
                    <td>{r.location}</td>
                    <td>
                      <label style={{ margin: 0, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
                        <input type="checkbox" checked={r.is_featured} onChange={(e) => toggleFeatured(r.id, e.target.checked)} />
                      </label>
                    </td>
                    <td><span className={`badge ${r.is_published ? "badge-on" : "badge-off"}`}>{r.is_published ? "Live" : "Draft"}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => remove(r.id, r.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "featured" && (
        <div>
          <p className="muted">Drag to change the order these appear on the homepage. Save to apply.</p>
          <DragList
            items={featured}
            onChange={(next) => { setDirty(true); setRowsFromFeatured(next); }}
            renderItem={(r) => (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{r.location}</div>
                </div>
                <Link href={`/admin/projects/${r.id}`} className="btn" style={{ fontSize: 12 }}>Open</Link>
              </div>
            )}
          />
          {dirty && (
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={() => saveOrder(featured)}>Save order</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function setRowsFromFeatured(next: typeof featured) {
    setRows((prev) => {
      const featuredMap = new Map(next.map((r, i) => [r.id, i]));
      return prev.map((r) => featuredMap.has(r.id) ? { ...r, featured_order: featuredMap.get(r.id)! } : r);
    });
  }
}
