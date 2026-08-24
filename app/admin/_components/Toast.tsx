"use client";

export default function Toast({ show, text = "Saved" }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 200,
        background: "#dcfce7", color: "#166534",
        border: "1px solid #86efac",
        padding: "10px 18px",
        borderRadius: 8, fontSize: 14, fontWeight: 600,
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        display: "flex", alignItems: "center", gap: 8,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </div>
  );
}
