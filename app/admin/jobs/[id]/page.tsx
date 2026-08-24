"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../_components/api";
import MarkdownEditor from "../../_components/MarkdownEditor";
import PageHeader from "../../_components/PageHeader";
import Toast from "../../_components/Toast";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Job = {
  id: number; slug: string; title: string; department: string; location: string;
  type: "full-time"|"part-time"|"contract"|"internship";
  summary: string; description_md: string; is_open: boolean;
};

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [j, setJ] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => { (async () => setJ(await api<Job>(`/api/admin/jobs/${id}`)))(); }, [id]);
  if (!j) return <div className="muted">Loading…</div>;
  function set<K extends keyof Job>(k: K, v: Job[K]) { setJ((p) => p ? { ...p, [k]: v } : p); }
  async function save() {
    setSaving(true);
    try {
      const { id: _drop, ...body } = j!;
      await api(`/api/admin/jobs/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      setSavedToast(true);
      setTimeout(() => router.push("/admin/jobs"), 900);
      return;
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm(`Delete "${j!.title}"?`)) return;
    await api(`/api/admin/jobs/${id}`, { method: "DELETE" });
    router.push("/admin/jobs");
  }
  return (
    <div>
      <Toast show={savedToast} />
      <PageHeader title={j.title || "Job posting"} right={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      } />
      <div className="card">
        <div className="row">
          <div><label>Title</label><input value={j.title} onChange={(e) => setJ({ ...j, title: e.target.value, slug: slugify(e.target.value) })} /></div>
          <div><label>Slug</label><input value={j.slug} readOnly /></div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <div><label>Department</label><input value={j.department} onChange={(e) => set("department", e.target.value)} /></div>
          <div><label>Location</label>
            <select value={j.location} onChange={(e) => set("location", e.target.value)}>
              <option value="">Select…</option>
              <option value="Head office">Head office</option>
              <option value="On-Site">On-Site</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div><label>Type</label>
            <select value={j.type} onChange={(e) => set("type", e.target.value as Job["type"])}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Summary (one-line)</label>
          <input value={j.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div style={{ marginTop: 12 }}>
          <MarkdownEditor value={j.description_md} onChange={(v) => set("description_md", v)} label="Description (markdown)" />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={j.is_open} onChange={(e) => set("is_open", e.target.checked)} />
            Published
          </label>
        </div>
      </div>
    </div>
  );
}
