import { many, one } from "./db";

export type NewsCategory = "news" | "event";

export interface NewsImage {
  id: number;
  url: string;
  caption: string | null;
  is_cover: boolean;
  sort_order: number;
}

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  category: NewsCategory;
  cover_image: string | null;
  published_at: string | null;
  is_published: boolean;
  images: NewsImage[];
}

export interface NewsSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  cover_image: string | null;
  published_at: string | null;
}

export async function getPublishedNews(): Promise<NewsSummary[]> {
  return many<NewsSummary>(
    `SELECT p.id, p.slug, p.title, p.excerpt, p.category,
            p.published_at,
            (SELECT url FROM news_images i WHERE i.post_id = p.id AND i.is_cover LIMIT 1) AS cover_image
       FROM news_posts p
      WHERE p.is_published = TRUE
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC`,
  );
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const post = await one<Omit<NewsPost, "images" | "cover_image">>(
    `SELECT id, slug, title, excerpt, body_md, category, published_at, is_published
       FROM news_posts WHERE slug = $1`,
    [slug],
  );
  if (!post) return null;
  const images = await many<NewsImage>(
    `SELECT id, url, caption, is_cover, sort_order
       FROM news_images WHERE post_id = $1
       ORDER BY is_cover DESC, sort_order ASC`,
    [post.id],
  );
  const cover = images.find((i) => i.is_cover) ?? null;
  return { ...post, images, cover_image: cover?.url ?? null };
}
