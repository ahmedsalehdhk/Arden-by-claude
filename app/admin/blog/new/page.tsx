"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../_components/api";
import PageHeader from "../../_components/PageHeader";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewNewsPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const slug = slugify(title);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({ title, slug }),
      });
      router.push(`/admin/blog/${id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create post");
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader title="New post" right={<Link href="/admin/blog" className="btn">Cancel</Link>} />
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={create}>
          <div style={{ marginBottom: 14 }}>
            <label>Title</label>
            <input required autoFocus value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Slug</label>
            <input value={slug} readOnly />
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>URL: /news/{slug || "<slug>"}</div>
          </div>
          <button className="btn btn-primary" disabled={creating || !title || !slug}>
            {creating ? "Creating…" : "Create post"}
          </button>
        </form>
      </div>
    </div>
  );
}
