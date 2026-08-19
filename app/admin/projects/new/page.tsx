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

export default function NewProjectPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const slug = slugify(name);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    try {
      const { id } = await api<{ id: number }>("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ name, slug }),
      });
      router.push(`/admin/projects/${id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create project");
      setCreating(false);
    }
  }

  return (
    <div>
      <PageHeader title="New project" right={<Link href="/admin/projects" className="btn">Cancel</Link>} />
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={create}>
          <div style={{ marginBottom: 14 }}>
            <label>Name</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Slug</label>
            <input value={slug} readOnly />
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>URL: /projects/{slug || "<slug>"}</div>
          </div>
          <button className="btn btn-primary" disabled={creating || !name || !slug}>
            {creating ? "Creating…" : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
}
