"use client";
import { usePathname } from "next/navigation";

export default function ConstructionBanner() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;

  const message = "Website under construction";
  const items = Array.from({ length: 12 });
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-black text-white overflow-hidden select-none"
      style={{ height: "28px" }}
      role="status"
      aria-label={message}
    >
      <div className="marquee-track flex items-center h-full whitespace-nowrap">
        {items.map((_, i) => (
          <span
            key={i}
            className="font-sans uppercase mx-8"
            style={{ fontSize: "11px", letterSpacing: "0.28em", lineHeight: 1 }}
          >
            {message}
            <span className="mx-6 opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
