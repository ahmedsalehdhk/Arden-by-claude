import Link from "next/link";
import { one } from "../../lib/db";
import RefreshOnMount from "./_components/RefreshOnMount";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [projects, news, jobs, team, contact, leads] = await Promise.all([
    one<{ n: string }>("SELECT COUNT(*)::text n FROM projects"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM news_posts"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM job_postings"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM team_members"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM contact_submissions WHERE is_archived = FALSE AND is_read = FALSE"),
    one<{ n: string }>("SELECT COUNT(*)::text n FROM floorplan_leads WHERE is_archived = FALSE AND is_read = FALSE"),
  ]);

  const priority = [
    { href: "/admin/contact", label: "Inbox", count: contact?.n ?? "0" },
    { href: "/admin/floorplan-leads", label: "Website leads", count: leads?.n ?? "0" },
  ];

  const content = [
    { href: "/admin/projects", label: "Projects", count: projects?.n ?? "0" },
    { href: "/admin/blog", label: "News & events", count: news?.n ?? "0" },
    { href: "/admin/jobs", label: "Careers", count: jobs?.n ?? "0" },
    { href: "/admin/team", label: "Team", count: team?.n ?? "0" },
  ];

  const wideStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 120,
    boxSizing: "border-box",
    marginTop: 0,
  };

  const tallStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    aspectRatio: "4 / 3",
    boxSizing: "border-box",
    marginTop: 0,
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div>
      <RefreshOnMount />
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 20px" }}>Overview</h1>

      <div className="admin-priority-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {priority.map((t) => {
          const n = Number(t.count) || 0;
          const hot = n > 0;
          return (
            <Link key={t.href} href={t.href} className="card" style={wideStyle}>
              <div className="muted" style={label}>{t.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: hot ? "#ea580c" : "#111827",
                  }}
                >
                  {t.count}
                </span>
                {hot && (
                  <span
                    style={{
                      background: "#ea580c",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    New
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />

      <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {content.map((t) => (
          <Link key={t.href} href={t.href} className="card" style={tallStyle}>
            <div className="muted" style={label}>{t.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{t.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
