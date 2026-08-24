"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return <button className="btn" onClick={logout} style={{ fontSize: 12, padding: "4px 10px" }}>Log out</button>;
}
