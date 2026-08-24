"use client";
import { useRef, useState } from "react";
import { uploadImage } from "./api";
import { DragList } from "./DragList";

export type GalleryImage = {
  _key: string;
  url: string;
  caption?: string | null;
  is_cover?: boolean;
};

export default function GalleryUploader({
  images, onChange, scope, ownerId, allowCover = false,
}: {
  images: GalleryImage[];
  onChange: (next: GalleryImage[]) => void;
  scope: "projects" | "news" | "team" | "misc";
  ownerId?: number | string;
  allowCover?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const f of files) {
        const { url } = await uploadImage(f, scope, ownerId);
        uploaded.push({ _key: crypto.randomUUID(), url, is_cover: false });
      }
      // If cover is required and none set, mark first uploaded as cover.
      const merged = [...images, ...uploaded];
      if (allowCover && !merged.some((i) => i.is_cover)) merged[0] = { ...merged[0], is_cover: true };
      onChange(merged);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(key: string) {
    const next = images.filter((i) => i._key !== key);
    if (allowCover && !next.some((i) => i.is_cover) && next.length) next[0] = { ...next[0], is_cover: true };
    onChange(next);
  }
  function setCover(key: string) {
    onChange(images.map((i) => ({ ...i, is_cover: i._key === key })));
  }
  function setCaption(key: string, v: string) {
    onChange(images.map((i) => (i._key === key ? { ...i, caption: v } : i)));
  }

  return (
    <div>
      <DragList
        items={images}
        onChange={onChange}
        renderItem={(img) => (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" style={{ width: 84, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #e5e7eb" }} />
            <input type="text" placeholder="Caption (optional)"
                   value={img.caption ?? ""}
                   onChange={(e) => setCaption(img._key, e.target.value)}
                   style={{ flex: 1 }} />
            {allowCover && (
              <label style={{ margin: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 12, textTransform: "none", letterSpacing: 0 }}>
                <input type="radio" name="cover" checked={!!img.is_cover} onChange={() => setCover(img._key)} />
                Cover
              </label>
            )}
            <button type="button" className="btn btn-danger" style={{ fontSize: 12, padding: "3px 8px" }}
                    onClick={() => remove(img._key)}>Remove</button>
          </div>
        )}
      />
      <div style={{ marginTop: 8 }}>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={pick} disabled={busy} />
        {busy && <span className="muted" style={{ marginLeft: 8 }}>Uploading…</span>}
      </div>
    </div>
  );
}
