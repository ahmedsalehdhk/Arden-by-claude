"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../_components/api";
import ImageUploader from "../../_components/ImageUploader";
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

type TeamRow = {
  id: number; slug: string; name: string; role: string; quote: string;
  image: string | null; bio_md: string; is_published: boolean;
};

export default function EditTeamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [t, setT] = useState<TeamRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => { (async () => setT(await api<TeamRow>(`/api/admin/team/${id}`)))(); }, [id]);

  if (!t) return <div className="muted">Loading…</div>;

  function set<K extends keyof TeamRow>(k: K, v: TeamRow[K]) { setT((prev) => prev ? { ...prev, [k]: v } : prev); }

  async function save() {
    setSaving(true);
    try {
      const { id: _drop, ...body } = t!;
      await api(`/api/admin/team/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      setSavedToast(true);
      setTimeout(() => router.push("/admin/team"), 900);
      return;
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm(`Delete "${t!.name}"?`)) return;
    await api(`/api/admin/team/${id}`, { method: "DELETE" });
    router.push("/admin/team");
  }

  return (
    <div>
      <Toast show={savedToast} />
      <PageHeader title={t.name || "Team member"} right={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      } />
      <div className="card">
        <div className="row"><div><label>Name</label><input value={t.name} onChange={(e) => setT({ ...t, name: e.target.value, slug: slugify(e.target.value) })} /></div>
          <div><label>Slug</label><input value={t.slug} readOnly /></div></div>
        <div style={{ marginTop: 12 }}><label>Role</label><input value={t.role} onChange={(e) => set("role", e.target.value)} /></div>
        <div style={{ marginTop: 12 }}><label>Quote</label><textarea rows={2} value={t.quote} onChange={(e) => set("quote", e.target.value)} /></div>
        <div style={{ marginTop: 12 }}>
          <ImageUploader value={t.image} onChange={(v) => set("image", v)} scope="team" ownerId={id} label="Portrait" />
        </div>
        <div style={{ marginTop: 12 }}>
          <MarkdownEditor value={t.bio_md} onChange={(v) => set("bio_md", v)} label="Bio (markdown — one paragraph per blank line)" />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={t.is_published} onChange={(e) => set("is_published", e.target.checked)} />
            Published (visible on About page)
          </label>
        </div>
      </div>
    </div>
  );
}
