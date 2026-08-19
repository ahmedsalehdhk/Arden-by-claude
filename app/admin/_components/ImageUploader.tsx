"use client";
import { useState, useRef } from "react";
import { uploadImage } from "./api";

export default function ImageUploader({
  value, onChange, scope, ownerId, label = "Image",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  scope: "projects" | "news" | "team" | "misc";
  ownerId?: number | string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { const { url } = await uploadImage(f, scope, ownerId); onChange(url); }
    finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; }
  }
  return (
    <div>
      <label>{label}</label>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }} />
        ) : (
          <div style={{ width: 120, height: 90, borderRadius: 6, border: "1px dashed #d1d5db", background: "#f9fafb" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input ref={inputRef} type="file" accept="image/*" onChange={pick} disabled={busy}
                 style={{ fontSize: 12 }} />
          {value && (
            <button type="button" className="btn btn-danger" style={{ fontSize: 12, padding: "3px 8px" }}
                    onClick={() => onChange(null)}>Remove</button>
          )}
          {busy && <span className="muted">Uploading…</span>}
        </div>
      </div>
    </div>
  );
}
