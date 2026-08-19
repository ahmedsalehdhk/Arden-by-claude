import Link from "next/link";
import { many, one } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [projects, news, jobs, team, contact, leads, recent, recentLeads] = await Promise.all([
    one<{ n: string }>("SELECT COUNT(*)::text n FROM projects"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM news_posts"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM job_postings"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM team_members"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM contact_submissions WHERE is_archived = FALSE"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM floorplan_leads WHERE is_archived = FALSE"),
    many<{ id: number; name: string; created_at: string }>(
      "SELECT id, name, created_at FROM contact_submissions WHERE is_archived = FALSE ORDER BY created_at DESC LIMIT 5",
    ),
    many<{ id: number; name: string; project_slug: string; created_at: string }>(
      "SELECT id, name, project_slug, created_at FROM floorplan_leads WHERE is_archived = FALSE ORDER BY created_at DESC LIMIT 5",
    ),
  ]);

  const tiles = [
    { href: "/admin/projects", label: "Projects", count: projects?.n ?? "0" },
    { href: "/admin/news", label: "News & events", count: news?.n ?? "0" },
    { href: "/admin/jobs", label: "Careers", count: jobs?.n ?? "0" },
    { href: "/admin/team", label: "Team", count: team?.n ?? "0" },
    { href: "/admin/contact", label: "Contact inbox", count: contact?.n ?? "0" },
    { href: "/admin/floorplan-leads", label: "Floor-plan leads", count: leads?.n ?? "0" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 20px" }}>Overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="card" style={{ display: "block" }}>
            <div className="muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{t.count}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <section className="card">
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Recent contact messages</h2>
          {recent.length === 0 ? (
            <div className="muted">No messages yet.</div>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {recent.map((r) => (
                <li key={r.id} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                  <strong>{r.name || "—"}</strong>
                  <span className="muted" style={{ marginLeft: 8 }}>{new Date(r.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Recent floor-plan leads</h2>
          {recentLeads.length === 0 ? (
            <div className="muted">No leads yet.</div>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {recentLeads.map((r) => (
                <li key={r.id} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: 14 }}>
                  <strong>{r.name}</strong>
                  <span className="muted" style={{ marginLeft: 8 }}>{r.project_slug} · {new Date(r.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
