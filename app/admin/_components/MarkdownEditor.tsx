"use client";
import { useState } from "react";
import { marked } from "marked";

export default function MarkdownEditor({
  value, onChange, label = "Body (markdown)", rows = 12,
}: {
  value: string; onChange: (v: string) => void; label?: string; rows?: number;
}) {
  const [preview, setPreview] = useState(false);
  const html = preview ? (marked.parse(value ?? "", { async: false }) as string) : "";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <label>{label}</label>
        <button type="button" className="btn" style={{ fontSize: 12, padding: "2px 8px" }}
                onClick={() => setPreview((p) => !p)}>
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12, background: "#fff", minHeight: rows * 20 }}
             dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
