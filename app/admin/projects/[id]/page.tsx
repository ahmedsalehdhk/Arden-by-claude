"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../_components/api";
import { DragList } from "../../_components/DragList";
import ImageUploader from "../../_components/ImageUploader";
import GalleryUploader, { GalleryImage } from "../../_components/GalleryUploader";
import MarkdownEditor from "../../_components/MarkdownEditor";
import PageHeader from "../../_components/PageHeader";
import Toast from "../../_components/Toast";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SPEC_LABELS = [
  "Land Area",
  "Size of Apartments",
  "Facing of Land",
  "Front Road Width",
  "Number of Floors",
  "Number of Basements",
  "Number of Apartments",
  "Number of Parking",
  "Specialty of Land",
] as const;

type Spec = { _key: string; label: string; value: string; enabled: boolean };
type Feature = { _key: string; icon: string; label: string; enabled: boolean };

const FEATURE_CATALOG: ReadonlyArray<{ icon: string; label: string }> = [
  { icon: "Zap",         label: "Full Load Power Backup Generator" },
  { icon: "ArrowUpDown", label: "High Speed Elevators" },
  { icon: "TreePine",    label: "Landscaped Gardens" },
  { icon: "Waves",       label: "Swimming Pool" },
  { icon: "Dumbbell",    label: "Loaded Fitness Centre" },
  { icon: "Droplets",    label: "Central Water Treatment Plant" },
  { icon: "Flame",       label: "Firefighting System" },
  { icon: "ShieldCheck", label: "Earthquake Proof Structure" },
  { icon: "Car",         label: "Chauffeurs' Waiting Room" },
  { icon: "Sofa",        label: "Elegant Reception & Waiting Room" },
  { icon: "DoorOpen",    label: "Double Height Entrance" },
  { icon: "Video",       label: "24-Hour CCTV Surveillance" },
  { icon: "ChefHat",     label: "BBQ Zone" },
  { icon: "Sparkles",    label: "Artistic Lighting & Water Features" },
  { icon: "Moon",        label: "Prayer Room" },
  { icon: "ToyBrick",    label: "Kids' Playground" },
  { icon: "Sun",         label: "Solar Power" },
  { icon: "Thermometer", label: "Sauna and Steam Room" },
  { icon: "Bath",        label: "Jacuzzi" },
  { icon: "Tent",        label: "Gazebo" },
];
type FloorPlan = { _key: string; label: string; full_label: string; image: string; kind: string | null };
type Neighborhood = { image_1: string | null; image_2: string | null; body_md: string };
type Architect = { name: string; title: string; image: string | null; quote: string };

type Project = {
  id: number; slug: string; name: string; tagline: string;
  type: "residential"|"commercial"; status: "ongoing"|"upcoming"|"completed";
  address: string; location: string; hero_image: string; building_image: string;
  map_embed_src: string | null;
  by_alliance_arden: boolean; by_trilliant_arden: boolean;
  is_featured: boolean; is_published: boolean;
};

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()));

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [p, setP] = useState<Project | null>(null);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [nb, setNb] = useState<Neighborhood | null>(null);
  const [arch, setArch] = useState<Architect | null>(null);
  const [tab, setTab] = useState<"basics"|"specs"|"features"|"gallery"|"floors"|"nb"|"arch">("basics");
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => { (async () => {
    const d = await api<any>(`/api/admin/projects/${id}`);
    setP({
      id: d.id, slug: d.slug, name: d.name, tagline: d.tagline,
      type: d.type, status: d.status, address: d.address, location: d.location,
      hero_image: d.hero_image, building_image: d.building_image, map_embed_src: d.map_embed_src,
      by_alliance_arden: d.by_alliance_arden, by_trilliant_arden: d.by_trilliant_arden,
      is_featured: d.is_featured, is_published: d.is_published,
    });
    {
      const existing = new Map<string, string>((d.specs || []).map((s: any) => [s.label, s.value]));
      setSpecs(
        SPEC_LABELS.map((label) => ({
          _key: uid(),
          label,
          value: existing.get(label) ?? "",
          enabled: existing.has(label),
        })),
      );
    }
    {
      const existing = new Set<string>((d.features || []).map((f: any) => f.label));
      setFeatures(
        FEATURE_CATALOG.map((f) => ({
          _key: uid(),
          icon: f.icon,
          label: f.label,
          enabled: existing.has(f.label),
        })),
      );
    }
    setGallery((d.gallery || []).map((g: any) => ({ _key: uid(), url: g.url, caption: g.caption })));
    setFloorPlans((d.floor_plans || []).map((f: any) => ({ ...f, _key: uid() })));
    setNb(d.neighborhood ? { image_1: d.neighborhood.image_1, image_2: d.neighborhood.image_2, body_md: d.neighborhood.body_md ?? "" } : null);
    setArch(d.architect ? { name: d.architect.name, title: d.architect.title, image: d.architect.image, quote: d.architect.quote } : null);
  })(); }, [id]);

  if (!p) return <div className="muted">Loading…</div>;

  function set<K extends keyof Project>(k: K, v: Project[K]) { setP((prev) => prev ? { ...prev, [k]: v } : prev); }

  async function save() {
    setSaving(true);
    try {
      const body = {
        ...p,
        specs: specs.filter((s) => s.enabled).map(({ _key, enabled, ...s }) => s),
        features: features.filter((f) => f.enabled).map(({ _key, enabled, ...f }) => f),
        gallery: gallery.map((g) => ({ url: g.url, caption: g.caption ?? null })),
        floor_plans: floorPlans.map(({ _key, ...f }) => f),
        neighborhood: nb,
        architect: arch ? { ...arch, title: "Principal Architect" } : null,
      };
      // Server doesn't accept `id` in body
      delete (body as any).id;
      await api(`/api/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      setSavedToast(true);
      setTimeout(() => router.push("/admin/projects"), 900);
      return;
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!confirm(`Delete "${p!.name}"?`)) return;
    await api(`/api/admin/projects/${id}`, { method: "DELETE" });
    router.push("/admin/projects");
  }

  return (
    <div>
      <Toast show={savedToast} />
      <PageHeader title={p.name || "Project"} right={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger" onClick={remove}>Delete</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      } />

      <div className="tabs">
        {([
          ["basics","Basics"], ["specs","Specs"], ["features","Features"],
          ["gallery","Gallery"], ["floors","Floor plans"], ["nb","Neighborhood"], ["arch","Architect"],
        ] as const).map(([k, l]) => (
          <div key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</div>
        ))}
      </div>

      {tab === "basics" && (
        <div className="card">
          <div className="row">
            <div><label>Name</label><input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div><label>Slug</label><input value={p.slug} readOnly /></div>
          </div>
          <div style={{ marginTop: 12 }}><label>Tagline</label><input value={p.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div className="row" style={{ marginTop: 12 }}>
            <div><label>Type</label>
              <select value={p.type} onChange={(e) => set("type", e.target.value as Project["type"])}>
                <option value="residential">Residential</option><option value="commercial">Commercial</option>
              </select>
            </div>
            <div><label>Status</label>
              <select value={p.status} onChange={(e) => set("status", e.target.value as Project["status"])}>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}><label>Address</label><input value={p.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div style={{ marginTop: 12 }}><label>Location (short)</label><input value={p.location} onChange={(e) => set("location", e.target.value)} /></div>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <ImageUploader value={p.hero_image || null} onChange={(v) => set("hero_image", v ?? "")} scope="projects" ownerId={id} label="Hero image" />
            <ImageUploader value={p.building_image || null} onChange={(v) => set("building_image", v ?? "")} scope="projects" ownerId={id} label="Building image" />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ marginBottom: 6 }}>Consortium</label>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              {(["none", "alliance", "trilliant"] as const).map((val) => {
                const checked =
                  val === "alliance" ? p.by_alliance_arden :
                  val === "trilliant" ? p.by_trilliant_arden :
                  !p.by_alliance_arden && !p.by_trilliant_arden;
                const label =
                  val === "alliance" ? "By Alliance-Arden Consortium" :
                  val === "trilliant" ? "By Trilliant-Arden Consortium" : "None";
                return (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
                    <input
                      type="radio"
                      name="consortium"
                      checked={checked}
                      onChange={() => {
                        setP({ ...p, by_alliance_arden: val === "alliance", by_trilliant_arden: val === "trilliant" });
                      }}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
              <input type="checkbox" checked={p.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
              Featured on homepage
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
              <input type="checkbox" checked={p.is_published} onChange={(e) => set("is_published", e.target.checked)} />
              Published
            </label>
          </div>
        </div>
      )}

      {tab === "specs" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <p className="muted" style={{ margin: 0 }}>Check each spec you want to show on the project page and fill in its value.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" style={{ fontSize: 12 }} onClick={() => setSpecs(specs.map((s) => ({ ...s, enabled: true })))}>Select all</button>
              <button className="btn" style={{ fontSize: 12 }} onClick={() => setSpecs(specs.map((s) => ({ ...s, enabled: false })))}>Clear all</button>
            </div>
          </div>
          {specs.map((s) => (
            <div key={s.label} className="row" style={{ marginTop: 8, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0, minWidth: 220, flex: 0 }}>
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={(e) => setSpecs(specs.map((x) => x.label === s.label ? { ...x, enabled: e.target.checked } : x))}
                />
                {s.label}
              </label>
              <div>
                <input
                  placeholder="Value"
                  disabled={!s.enabled}
                  value={s.value}
                  onChange={(e) => setSpecs(specs.map((x) => x.label === s.label ? { ...x, value: e.target.value } : x))}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "features" && (
        <div className="card">
          <p className="muted" style={{ marginTop: 0 }}>Check each feature you want to show on the project page.</p>
          {features.map((f) => (
            <div key={f.label} style={{ marginTop: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, textTransform: "none", letterSpacing: 0, fontWeight: 500, margin: 0 }}>
                <input
                  type="checkbox"
                  checked={f.enabled}
                  onChange={(e) => setFeatures(features.map((x) => x.label === f.label ? { ...x, enabled: e.target.checked } : x))}
                />
                {f.label}
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "gallery" && (
        <div className="card">
          <GalleryUploader images={gallery} onChange={setGallery} scope="projects" ownerId={id} />
        </div>
      )}

      {tab === "floors" && (
        <div className="card">
          <p className="muted" style={{ marginTop: 0 }}>Add one entry per floor. Order matters — the elevator strip renders top-to-bottom in reverse.</p>
          <DragList items={floorPlans} onChange={setFloorPlans}
            renderItem={(f) => (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, alignItems: "start" }}>
                <input placeholder="Short label (e.g. GF)" value={f.label} onChange={(e) => setFloorPlans(floorPlans.map((x) => x._key === f._key ? { ...x, label: e.target.value.toUpperCase() } : x))} />
                <input placeholder="Full label (e.g. Ground Floor)" value={f.full_label} onChange={(e) => setFloorPlans(floorPlans.map((x) => x._key === f._key ? { ...x, full_label: e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()) } : x))} />
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <ImageUploaderInline value={f.image} onChange={(v) => setFloorPlans(floorPlans.map((x) => x._key === f._key ? { ...x, image: v ?? "" } : x))} ownerId={id} />
                  </div>
                  <button className="btn btn-danger" style={{ fontSize: 12 }} onClick={() => setFloorPlans(floorPlans.filter((x) => x._key !== f._key))}>Remove</button>
                </div>
              </div>
            )} />
          <button className="btn" style={{ marginTop: 8 }}
                  onClick={() => setFloorPlans([...floorPlans, { _key: uid(), label: "", full_label: "", image: "", kind: null }])}>
            Add floor
          </button>
        </div>
      )}

      {tab === "nb" && (
        <div className="card">
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={nb !== null} onChange={(e) => setNb(e.target.checked ? { image_1: null, image_2: null, body_md: "" } : null)} />
            Show a neighborhood section on this project
          </label>
          {nb && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <ImageUploader value={nb.image_1} onChange={(v) => setNb({ ...nb, image_1: v })} scope="projects" ownerId={id} label="Image 1" />
                <ImageUploader value={nb.image_2} onChange={(v) => setNb({ ...nb, image_2: v })} scope="projects" ownerId={id} label="Image 2" />
              </div>
              <div style={{ marginTop: 12 }}>
                <MarkdownEditor value={nb.body_md} onChange={(v) => setNb({ ...nb, body_md: v })} label="Paragraph about the neighborhood" rows={6} />
              </div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <label>Google Maps embed src (iframe URL)</label>
            <input value={p.map_embed_src ?? ""} onChange={(e) => set("map_embed_src", e.target.value || null)} />
          </div>
        </div>
      )}

      {tab === "arch" && (
        <div className="card">
          <label style={{ display: "flex", alignItems: "center", gap: 6, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
            <input type="checkbox" checked={arch !== null} onChange={(e) => setArch(e.target.checked ? { name: "", title: "Principal Architect", image: null, quote: "" } : null)} />
            Show an architect section on this project
          </label>
          {arch && (
            <div style={{ marginTop: 12 }}>
              <div><label>Name</label><input value={arch.name} onChange={(e) => setArch({ ...arch, name: e.target.value })} /></div>
              <div style={{ marginTop: 12 }}>
                <ImageUploader value={arch.image} onChange={(v) => setArch({ ...arch, image: v })} scope="projects" ownerId={id} label="Portrait" />
              </div>
              <div style={{ marginTop: 12 }}><label>Quote</label><textarea rows={3} value={arch.quote} onChange={(e) => setArch({ ...arch, quote: e.target.value })} /></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImageUploaderInline({ value, onChange, ownerId }: { value: string; onChange: (v: string | null) => void; ownerId: number }) {
  return <ImageUploader value={value || null} onChange={onChange} scope="projects" ownerId={ownerId} label="Image" />;
}
