import { ReactNode } from "react";

export default function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>{right}</div>
    </div>
  );
}
