import { NextResponse } from "next/server";
import { z } from "zod";
import { many, one, query, withTx } from "../../../../../lib/db";

const Spec    = z.object({ label: z.string(), value: z.string() });
const Feature = z.object({ icon: z.string(), label: z.string() });
const GalleryItem = z.object({ url: z.string(), caption: z.string().nullable().optional() });
const FloorPlan = z.object({
  label: z.string(), full_label: z.string(), image: z.string(),
  kind: z.enum(["basement","ground","mezzanine","typical","roof"]).nullable().optional(),
});
const Neighborhood = z.object({
  image_1: z.string().nullable().optional(),
  image_2: z.string().nullable().optional(),
  body_md: z.string().default(""),
}).nullable();
const Architect = z.object({
  name: z.string(), title: z.string(), image: z.string().nullable().optional(), quote: z.string(),
}).nullable();

const PatchBody = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).optional(),
  tagline: z.string().optional(),
  type: z.enum(["residential","commercial"]).optional(),
  status: z.enum(["ongoing","upcoming","completed"]).optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  hero_image: z.string().optional(),
  building_image: z.string().optional(),
  map_embed_src: z.string().nullable().optional(),
  by_alliance_arden: z.boolean().optional(),
  by_trilliant_arden: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
  specs: z.array(Spec).optional(),
  features: z.array(Feature).optional(),
  gallery: z.array(GalleryItem).optional(),
  floor_plans: z.array(FloorPlan).optional(),
  neighborhood: Neighborhood.optional(),
  architect: Architect.optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const row = await one("SELECT * FROM projects WHERE id = $1", [id]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [specs, features, gallery, floor_plans, nb, arch] = await Promise.all([
    many("SELECT label, value, sort_order FROM project_specs WHERE project_id=$1 ORDER BY sort_order", [id]),
    many("SELECT icon, label, sort_order FROM project_features WHERE project_id=$1 ORDER BY sort_order", [id]),
    many("SELECT id, url, caption, sort_order FROM project_gallery WHERE project_id=$1 ORDER BY sort_order", [id]),
    many("SELECT label, full_label, image, kind, sort_order FROM project_floor_plans WHERE project_id=$1 ORDER BY sort_order", [id]),
    one("SELECT image_1, image_2, body_md FROM project_neighborhood WHERE project_id=$1", [id]),
    one("SELECT name, title, image, quote FROM project_architect WHERE project_id=$1", [id]),
  ]);
  return NextResponse.json({ ...row, specs, features, gallery, floor_plans, neighborhood: nb, architect: arch });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  let body: z.infer<typeof PatchBody>;
  try { body = PatchBody.parse(await req.json()); }
  catch (e) { return NextResponse.json({ error: "Invalid payload", detail: (e as any).errors }, { status: 400 }); }

  await withTx(async (c) => {
    // Basics
    const fields: Array<[string, unknown]> = [];
    for (const k of [
      "slug","name","tagline","type","status","address","location","hero_image","building_image",
      "map_embed_src","by_alliance_arden","by_trilliant_arden","is_featured","is_published",
    ] as const) {
      if (body[k] !== undefined) fields.push([k, body[k]]);
    }
    if (fields.length) {
      const set = fields.map(([k], i) => `${k} = $${i + 1}`).join(", ");
      await c.query(
        `UPDATE projects SET ${set}, updated_at = NOW() WHERE id = $${fields.length + 1}`,
        [...fields.map(([, v]) => v), id],
      );
    }

    if (body.specs !== undefined) {
      await c.query("DELETE FROM project_specs WHERE project_id = $1", [id]);
      for (let i = 0; i < body.specs.length; i++) {
        const s = body.specs[i];
        await c.query(
          "INSERT INTO project_specs (project_id, label, value, sort_order) VALUES ($1,$2,$3,$4)",
          [id, s.label, s.value, i],
        );
      }
    }
    if (body.features !== undefined) {
      await c.query("DELETE FROM project_features WHERE project_id = $1", [id]);
      for (let i = 0; i < body.features.length; i++) {
        const f = body.features[i];
        await c.query(
          "INSERT INTO project_features (project_id, icon, label, sort_order) VALUES ($1,$2,$3,$4)",
          [id, f.icon, f.label, i],
        );
      }
    }
    if (body.gallery !== undefined) {
      await c.query("DELETE FROM project_gallery WHERE project_id = $1", [id]);
      for (let i = 0; i < body.gallery.length; i++) {
        const g = body.gallery[i];
        await c.query(
          "INSERT INTO project_gallery (project_id, url, caption, sort_order) VALUES ($1,$2,$3,$4)",
          [id, g.url, g.caption ?? null, i],
        );
      }
    }
    if (body.floor_plans !== undefined) {
      await c.query("DELETE FROM project_floor_plans WHERE project_id = $1", [id]);
      for (let i = 0; i < body.floor_plans.length; i++) {
        const f = body.floor_plans[i];
        await c.query(
          "INSERT INTO project_floor_plans (project_id, label, full_label, image, kind, sort_order) VALUES ($1,$2,$3,$4,$5,$6)",
          [id, f.label, f.full_label, f.image, f.kind ?? null, i],
        );
      }
    }
    if (body.neighborhood !== undefined) {
      await c.query("DELETE FROM project_neighborhood WHERE project_id = $1", [id]);
      if (body.neighborhood) {
        await c.query(
          "INSERT INTO project_neighborhood (project_id, image_1, image_2, body_md) VALUES ($1,$2,$3,$4)",
          [id, body.neighborhood.image_1 ?? null, body.neighborhood.image_2 ?? null, body.neighborhood.body_md ?? ""],
        );
      }
    }
    if (body.architect !== undefined) {
      await c.query("DELETE FROM project_architect WHERE project_id = $1", [id]);
      if (body.architect) {
        await c.query(
          "INSERT INTO project_architect (project_id, name, title, image, quote) VALUES ($1,$2,$3,$4,$5)",
          [id, body.architect.name, body.architect.title, body.architect.image ?? null, body.architect.quote],
        );
      }
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await query("DELETE FROM projects WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
