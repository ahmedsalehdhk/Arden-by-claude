import "./admin.css";
import { headers, cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE } from "../../lib/auth-edge";
import LogoutButton from "./_components/LogoutButton";
import Sidebar from "./_components/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-invoke-path") || "";
  const isLogin = pathname.startsWith("/admin/login");
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);

  if (isLogin || !session) {
    return <div className="admin-root">{children}</div>;
  }

  const account = (
    <div style={{ fontSize: 12, color: "#6b7280" }}>
      <div style={{ marginBottom: 8 }}>Signed in as</div>
      <div style={{ fontWeight: 600, color: "#111827", marginBottom: 12 }}>{session.email}</div>
      <LogoutButton />
    </div>
  );

  return (
    <div className="admin-root admin-shell">
      <aside className="admin-aside">
        <div className="admin-aside-sticky">
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Arden Admin</div>
          <Sidebar>{account}</Sidebar>
          <div className="admin-aside-account">{account}</div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
