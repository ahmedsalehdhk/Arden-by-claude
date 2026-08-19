"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = [href: string, label: string];

const PRIMARY: NavItem[] = [
  ["/admin", "Overview"],
  ["/admin/contact", "Inbox"],
  ["/admin/floorplan-leads", "Website leads"],
];

const SECONDARY: NavItem[] = [
  ["/admin/projects", "Projects"],
  ["/admin/blog", "News & events"],
  ["/admin/jobs", "Careers"],
  ["/admin/team", "Team"],
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ href, label, active, onNavigate }: { href: string; label: string; active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="admin-sidebar-link"
      style={{
        padding: "10px 12px",
        borderRadius: 6,
        fontSize: 14,
        color: active ? "#111827" : "#374151",
        background: active ? "#f3f4f6" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </Link>
  );
}

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const raw = usePathname() || "";
  const pathname = raw.length > 1 ? raw.replace(/\/$/, "") : raw;
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(0);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const nav = (onNavigate?: () => void) => (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {PRIMARY.map(([href, label]) => (
        <NavLink key={href} href={href} label={label} active={isActive(pathname, href)} onNavigate={onNavigate} />
      ))}
      <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />
      {SECONDARY.map(([href, label]) => (
        <NavLink key={href} href={href} label={label} active={isActive(pathname, href)} onNavigate={onNavigate} />
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop: static column */}
      <div className="admin-sidebar-desktop">{nav()}</div>

      {/* Mobile top bar with hamburger */}
      <div className="admin-mobile-bar">
        <button
          className="admin-hamburger"
          onPointerDown={(e) => { e.preventDefault(); setOpen(true); setOpenedAt(Date.now()); }}
          onClick={(e) => { e.preventDefault(); setOpen(true); setOpenedAt(Date.now()); }}
          aria-label="Open menu"
          type="button"
        >
          <span /><span /><span />
        </button>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Arden Admin</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="admin-drawer-backdrop"
          onClick={() => { if (Date.now() - openedAt > 250) setOpen(false); }}
        >
          <aside
            className="admin-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Arden Admin</div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                type="button"
                className="btn"
                style={{ fontSize: 14, padding: "4px 10px" }}
              >
                ✕
              </button>
            </div>
            {nav(() => setOpen(false))}
            {children && <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>{children}</div>}
          </aside>
        </div>
      )}
    </>
  );
}
