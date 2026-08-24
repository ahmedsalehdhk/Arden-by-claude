import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "./lib/auth-edge";

// Guards admin pages and admin API. Public API stays open.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // Auth API endpoints (login) must stay open even under /api/admin.
  if (pathname.startsWith("/api/admin/auth/")) return NextResponse.next();
  if (!isAdminApi && !isAdminPage) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);
  if (session) return NextResponse.next();

  if (isAdminApi) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
