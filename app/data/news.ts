export type NewsCategory = "News" | "Event";

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory;
  date: string; // ISO
  image: string;
}

export const NEWS: NewsItem[] = [
  {
    slug: "amanat-groundbreaking-banani",
    title: "Amanat Groundbreaking Marks Arden's Return to Banani",
    excerpt:
      "Arden Holdings hosted an intimate groundbreaking ceremony for Amanat, its newest luxury residence on Road 1, Block I.",
    category: "Event",
    date: "2026-07-22",
    image: "/projectimages/amanat/front-side-view-01.jpg",
  },
  {
    slug: "rahma-jolshiri-milestone",
    title: "Rahma Reaches Structural Milestone in Jolshiri",
    excerpt:
      "The Rahma residence has topped out its final floor, moving into finishing works ahead of a Q2 2027 handover.",
    category: "News",
    date: "2026-06-05",
    image: "/projectimages/rahma/view-02.jpg",
  },
  {
    slug: "arden-design-forum-2026",
    title: "Arden Design Forum 2026: A Conversation on Legacy Architecture",
    excerpt:
      "Leading architects and homeowners joined Arden for an evening on materials, craft, and building for the next generation.",
    category: "Event",
    date: "2026-04-18",
    image: "/projectimages/amanat/front-side-view-01.jpg",
  },
];
