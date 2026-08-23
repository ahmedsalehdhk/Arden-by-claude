// DB-backed project helpers. Return the same shape the existing UI expects (ProjectDetail).
import { many, one, withTx } from "./db";

export interface ProjectSpec { label: string; value: string; sort_order?: number }
export interface ProjectFeature { icon: string; label: string; sort_order?: number }
export interface FloorPlan {
  label: string;
  fullLabel: string;
  image: string;
  kind?: "basement" | "ground" | "mezzanine" | "typical" | "roof";
  sort_order?: number;
}
export interface Architect { name: string; title: string; image: string; quote: string }
export interface Neighborhood { images: string[]; body_md: string }

export interface ProjectDetail {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: "Residential" | "Commercial";
  status: "Ongoing" | "Upcoming" | "Completed";
  address: string;
  location: string;
  heroImage: string;
  buildingImage: string;
  byAllianceArden?: boolean;
  byTrilliantArden?: boolean;
  is_featured: boolean;
  featured_order: number;
  display_order: number;
  is_published: boolean;
  specs: ProjectSpec[];
  features: ProjectFeature[];
  gallery: string[];
  mapEmbedSrc?: string;
  neighborhood?: Neighborhood;
  floorPlans?: FloorPlan[];
  architect?: Architect;
}

export interface ProjectSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: "Residential" | "Commercial";
  status: "Ongoing" | "Upcoming" | "Completed";
  address: string;
  location: string;
  heroImage: string;
  buildingImage: string;
  byAllianceArden: boolean;
  byTrilliantArden: boolean;
  is_featured: boolean;
  featured_order: number;
  display_order: number;
}

type Row = {
  id: number; slug: string; name: string; tagline: string;
  type: string; status: string; address: string; location: string;
  hero_image: string; building_image: string; map_embed_src: string | null;
  by_alliance_arden: boolean; by_trilliant_arden: boolean;
  is_featured: boolean; featured_order: number; display_order: number; is_published: boolean;
};

function cap<T extends string>(s: string): T {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as T;
}

function toSummary(r: Row): ProjectSummary {
  return {
    id: r.id, slug: r.slug, name: r.name, tagline: r.tagline,
    type: cap<"Residential" | "Commercial">(r.type),
    status: cap<"Ongoing" | "Upcoming" | "Completed">(r.status),
    address: r.address, location: r.location,
    heroImage: r.hero_image, buildingImage: r.building_image,
    byAllianceArden: r.by_alliance_arden, byTrilliantArden: r.by_trilliant_arden,
    is_featured: r.is_featured, featured_order: r.featured_order,
    display_order: r.display_order,
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const rows = await many<{ slug: string }>(
    "SELECT slug FROM projects WHERE is_published = TRUE ORDER BY display_order ASC, name ASC",
  );
  return rows.map((r) => r.slug);
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const rows = await many<Row>(
    "SELECT * FROM projects WHERE is_published = TRUE ORDER BY display_order ASC, name ASC",
  );
  return rows.map(toSummary);
}

export async function getFeaturedProjects(): Promise<ProjectSummary[]> {
  const rows = await many<Row>(
    `SELECT * FROM projects
     WHERE is_featured = TRUE AND is_published = TRUE
     ORDER BY featured_order ASC, name ASC`,
  );
  return rows.map(toSummary);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const row = await one<Row>("SELECT * FROM projects WHERE slug = $1", [slug]);
  if (!row) return null;

  const [specs, features, gallery, floorPlans, nb, arch] = await Promise.all([
    many<ProjectSpec>(
      "SELECT label, value, sort_order FROM project_specs WHERE project_id = $1 ORDER BY sort_order",
      [row.id],
    ),
    many<ProjectFeature>(
      "SELECT icon, label, sort_order FROM project_features WHERE project_id = $1 ORDER BY sort_order",
      [row.id],
    ),
    many<{ url: string }>(
      "SELECT url FROM project_gallery WHERE project_id = $1 ORDER BY sort_order",
      [row.id],
    ),
    many<{ label: string; full_label: string; image: string; kind: FloorPlan["kind"]; sort_order: number }>(
      "SELECT label, full_label, image, kind, sort_order FROM project_floor_plans WHERE project_id = $1 ORDER BY sort_order",
      [row.id],
    ),
    one<{ image_1: string | null; image_2: string | null; body_md: string }>(
      "SELECT image_1, image_2, body_md FROM project_neighborhood WHERE project_id = $1",
      [row.id],
    ),
    one<{ name: string; title: string; image: string | null; quote: string }>(
      "SELECT name, title, image, quote FROM project_architect WHERE project_id = $1",
      [row.id],
    ),
  ]);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    type: cap<"Residential" | "Commercial">(row.type),
    status: cap<"Ongoing" | "Upcoming" | "Completed">(row.status),
    address: row.address,
    location: row.location,
    heroImage: row.hero_image,
    buildingImage: row.building_image,
    byAllianceArden: row.by_alliance_arden || undefined,
    byTrilliantArden: row.by_trilliant_arden || undefined,
    is_featured: row.is_featured,
    featured_order: row.featured_order,
    display_order: row.display_order,
    is_published: row.is_published,
    specs,
    features,
    gallery: gallery.map((g) => g.url),
    mapEmbedSrc: row.map_embed_src ?? undefined,
    neighborhood: nb
      ? {
          images: [nb.image_1, nb.image_2].filter((x): x is string => Boolean(x)),
          body_md: nb.body_md,
        }
      : undefined,
    floorPlans: floorPlans.length
      ? floorPlans.map((f) => ({
          label: f.label, fullLabel: f.full_label, image: f.image, kind: f.kind ?? undefined,
        }))
      : undefined,
    architect: arch
      ? { name: arch.name, title: arch.title, image: arch.image ?? "", quote: arch.quote }
      : undefined,
  };
}

// Admin: rewrite featured_order for a set of projects in one transaction.
export async function setFeaturedOrder(orderedIds: number[]): Promise<void> {
  await withTx(async (c) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await c.query(
        "UPDATE projects SET is_featured = TRUE, featured_order = $2, updated_at = NOW() WHERE id = $1",
        [orderedIds[i], i],
      );
    }
  });
}

// Admin: rewrite display_order (used on the /projects listing page) for all projects in one transaction.
export async function setDisplayOrder(orderedIds: number[]): Promise<void> {
  await withTx(async (c) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await c.query(
        "UPDATE projects SET display_order = $2, updated_at = NOW() WHERE id = $1",
        [orderedIds[i], i],
      );
    }
  });
}
