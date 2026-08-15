export type NewsCategory = "News" | "Event";

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  date: string; // ISO
  image: string;
}

export const NEWS: NewsItem[] = [];
