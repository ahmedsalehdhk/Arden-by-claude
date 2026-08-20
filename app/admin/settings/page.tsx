"use client";

import { useEffect, useState } from "react";
import PageHeader from "../_components/PageHeader";
import Toast from "../_components/Toast";
import { api } from "../_components/api";

type ContactInfo = { phone: string; email: string; address: string };

export default function SettingsPage() {
  const [info, setInfo] = useState<ContactInfo>({ phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api<ContactInfo>("/api/admin/settings/contact-info")
      .then(setInfo)
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr("");
    try {
      const next = await api<ContactInfo>("/api/admin/settings/contact-info", {
        method: "PUT",
        body: JSON.stringify(info),
      });
      setInfo(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Toast show={saved} text="Saved" />
      <PageHeader title="Site settings" />

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <form onSubmit={onSave} className="card" style={{ maxWidth: 640 }}>
          <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
            These values appear in the site footer, on the Contact page, and in the
            &ldquo;Email to apply&rdquo; button on Careers. Leave a field blank to fall back
            to the built-in default.
          </p>

          <div style={{ marginBottom: 14 }}>
            <label>Primary phone</label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              placeholder="+88 019 1688 2330"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label>Primary email</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              placeholder="info@ardenholdingsltd.com"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label>Office address</label>
            <textarea
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
              placeholder={"House 40 (2nd Floor), Road 20,\nMohakhali DOHS, Dhaka-1206"}
              rows={3}
            />
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Line breaks are preserved on the website.
            </div>
          </div>

          {err && (
            <p style={{ color: "#b91c1c", fontSize: 13, marginBottom: 12 }}>{err}</p>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
