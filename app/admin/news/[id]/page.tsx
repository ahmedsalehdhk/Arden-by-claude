"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../_components/api";
import MarkdownEditor from "../../_components/MarkdownEditor";
import GalleryUploader, { GalleryImage } from "../../_components/GalleryUploader";
import PageHeader from "../../_components/PageHeader";

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
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => {
    const data = await api<Post>(`/api/admin/news/${id}`);
    setP(data);
    setImages(data.images.map((i) => ({ _key: String(i.id), url: i.url, caption: i.caption, is_cover: i.is_cover })));
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
        images: images.map((i) => ({ url: i.url, caption: i.caption ?? null, is_cover: !!i.is_cover })),
      };
      await api(`/api/admin/news/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      alert("Saved");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm(`Delete "${p!.title}"?`)) return;
    await api(`/api/admin/news/${id}`, { method: "DELETE" });
    router.push("/admin/news");
  }

  const publishedLocal = p.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : "";

  return (
    <div>
      <PageHeader title={p.title || "Post"} right={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      } />
      <div className="card">
        <div className="row">
          <div><label>Title</label><input value={p.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div><label>Slug</label><input value={p.slug} onChange={(e) => set("slug", e.target.value)} /></div>
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
          <div><label>Publish date</label>
            <input type="datetime-local" value={publishedLocal}
                   onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)} />
          </div>
          <div><label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={p.is_published} onChange={(e) => set("is_published", e.target.checked)} />
            Published
          </label></div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Images</h2>
        <p className="muted" style={{ marginTop: 0 }}>Upload any number of images. Pick one as the cover — it becomes the listing thumbnail and detail hero.</p>
        <GalleryUploader images={images} onChange={setImages} scope="news" ownerId={id} allowCover />
      </div>
    </div>
  );
}
