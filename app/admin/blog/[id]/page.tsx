"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../_components/api";
import MarkdownEditor from "../../_components/MarkdownEditor";
import GalleryUploader, { GalleryImage } from "../../_components/GalleryUploader";
import ImageUploader from "../../_components/ImageUploader";
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

type Post = {
  id: number; slug: string; title: string; excerpt: string; body_md: string;
  category: "news" | "event"; published_at: string | null; is_published: boolean;
  images: Array<{ id: number; url: string; caption: string | null; is_cover: boolean; sort_order: number }>;
};

export default function EditNewsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [p, setP] = useState<Post | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => { (async () => {
    const data = await api<Post>(`/api/admin/blog/${id}`);
    setP(data);
    const coverImg = data.images.find((i) => i.is_cover);
    setCover(coverImg?.url ?? null);
    setGallery(
      data.images
        .filter((i) => !i.is_cover)
        .map((i) => ({ _key: String(i.id), url: i.url, caption: i.caption, is_cover: false })),
    );
  })(); }, [id]);

  if (!p) return <div className="muted">Loading…</div>;
  function set<K extends keyof Post>(k: K, v: Post[K]) { setP((prev) => prev ? { ...prev, [k]: v } : prev); }

  async function save() {
    setSaving(true);
    try {
      const body = {
        slug: p!.slug, title: p!.title, excerpt: p!.excerpt, body_md: p!.body_md,
        category: p!.category,
        published_at: p!.published_at ? new Date(p!.published_at).toISOString() : null,
        is_published: p!.is_published,
        images: [
          ...(cover ? [{ url: cover, caption: null, is_cover: true }] : []),
          ...gallery.map((i) => ({ url: i.url, caption: i.caption ?? null, is_cover: false })),
        ],
      };
      await api(`/api/admin/blog/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      setSavedToast(true);
      setTimeout(() => router.push("/admin/blog"), 900);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm(`Delete "${p!.title}"?`)) return;
    await api(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  const publishedLocal = p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : "";

  return (
    <div>
      <Toast show={savedToast} />
      <PageHeader title={p.title || "Post"} right={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      } />
      <div className="card">
        <div className="row">
          <div><label>Title</label><input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value, slug: slugify(e.target.value) })} /></div>
          <div><label>Slug</label><input value={p.slug} readOnly /></div>
          <div><label>Type</label>
            <select value={p.category} onChange={(e) => set("category", e.target.value as Post["category"])}>
              <option value="news">News</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12 }}><label>Excerpt</label><textarea rows={2} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>
        <div style={{ marginTop: 12 }}>
          <MarkdownEditor value={p.body_md} onChange={(v) => set("body_md", v)} />
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <div>
            <label>Publish date</label>
            {(() => {
              const isToday = !!p.published_at && new Date(p.published_at).toDateString() === new Date().toDateString();
              return (
                <>
                  <input
                    type="datetime-local"
                    value={publishedLocal}
                    disabled={isToday}
                    onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, marginTop: 6 }}>
                    <input
                      type="checkbox"
                      checked={isToday}
                      onChange={(e) => set("published_at", e.target.checked ? new Date().toISOString() : null)}
                    />
                    Today
                  </label>
                </>
              );
            })()}
          </div>
          <div><label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={p.is_published} onChange={(e) => set("is_published", e.target.checked)} />
            Published
          </label></div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Cover image</h2>
        <p className="muted" style={{ marginTop: 0 }}>Shown as the listing thumbnail and detail hero.</p>
        <ImageUploader value={cover} onChange={(v) => setCover(v ?? null)} scope="news" ownerId={id} label="Cover" />
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Gallery</h2>
        <p className="muted" style={{ marginTop: 0 }}>Additional images displayed in a gallery on the post page.</p>
        <GalleryUploader images={gallery} onChange={setGallery} scope="news" ownerId={id} />
      </div>
    </div>
  );
}
