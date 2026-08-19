import "./admin.css";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE } from "../../lib/auth-edge";
import LogoutButton from "./_components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-invoke-path") || "";
  const isLogin = pathname.startsWith("/admin/login");
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);

  if (isLogin || !session) {
    return <div className="admin-root">{children}</div>;
  }

  const links: Array<[string, string]> = [
    ["/admin", "Overview"],
    ["/admin/projects", "Projects"],
    ["/admin/news", "News & events"],
    ["/admin/jobs", "Careers"],
    ["/admin/team", "Team"],
    ["/admin/contact", "Contact inbox"],
    ["/admin/floorplan-leads", "Floor-plan leads"],
  ];

  return (
    <div className="admin-root" style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #e5e7eb", background: "#fff", padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Arden Admin</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "8px 10px", borderRadius: 6, fontSize: 14, color: "#374151",
              }}
              className="admin-sidebar-link"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #e5e7eb", fontSize: 12, color: "#6b7280" }}>
          <div style={{ marginBottom: 8 }}>Signed in as</div>
          <div style={{ fontWeight: 600, color: "#111827", marginBottom: 12 }}>{session.email}</div>
          <LogoutButton />
        </div>
      </aside>
      <main style={{ padding: "28px 32px", maxWidth: 1200 }}>{children}</main>
    </div>
  );
}
