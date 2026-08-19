import { NextResponse } from "next/server";
import { z } from "zod";
import { many, one, query, withTx } from "../../../../../lib/db";

const Image = z.object({
  url: z.string(),
  caption: z.string().nullable().optional(),
  is_cover: z.boolean().default(false),
});

const Patch = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  body_md: z.string().optional(),
  category: z.enum(["news","event"]).optional(),
  published_at: z.string().datetime().nullable().optional(),
  is_published: z.boolean().optional(),
  images: z.array(Image).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const post = await one("SELECT * FROM news_posts WHERE id = $1", [id]);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const images = await many(
    `SELECT id, url, caption, is_cover, sort_order FROM news_images WHERE post_id = $1
     ORDER BY is_cover DESC, sort_order ASC`,
    [id],
  );
  return NextResponse.json({ ...post, images });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  let body: z.infer<typeof Patch>;
  try { body = Patch.parse(await req.json()); }
  catch (e) { return NextResponse.json({ error: "Invalid payload", detail: (e as any).errors }, { status: 400 }); }

  if (body.images && body.images.filter((i) => i.is_cover).length > 1) {
    return NextResponse.json({ error: "Only one cover image allowed" }, { status: 400 });
  }

  await withTx(async (c) => {
    const fields: Array<[string, unknown]> = [];
    for (const k of ["slug","title","excerpt","body_md","category","published_at","is_published"] as const) {
      if (body[k] !== undefined) fields.push([k, body[k]]);
    }
    if (fields.length) {
      const set = fields.map(([k], i) => `${k} = $${i + 1}`).join(", ");
      await c.query(
        `UPDATE news_posts SET ${set}, updated_at = NOW() WHERE id = $${fields.length + 1}`,
        [...fields.map(([, v]) => v), id],
      );
    }
    if (body.images !== undefined) {
      await c.query("DELETE FROM news_images WHERE post_id = $1", [id]);
      const nonCover = body.images.filter((i) => !i.is_cover);
      const cover = body.images.find((i) => i.is_cover);
      let sortIdx = 0;
      if (cover) {
        await c.query(
          "INSERT INTO news_images (post_id, url, caption, is_cover, sort_order) VALUES ($1,$2,$3,TRUE,$4)",
          [id, cover.url, cover.caption ?? null, sortIdx++],
        );
      }
      for (const img of nonCover) {
        await c.query(
          "INSERT INTO news_images (post_id, url, caption, is_cover, sort_order) VALUES ($1,$2,$3,FALSE,$4)",
          [id, img.url, img.caption ?? null, sortIdx++],
        );
      }
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await query("DELETE FROM news_posts WHERE id = $1", [Number(params.id)]);
  return NextResponse.json({ ok: true });
}
