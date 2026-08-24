import { many } from "./db";

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  quote: string;
  image: string | null;
  bio_md: string;
  sort_order: number;
  is_published: boolean;
}

export async function getPublishedTeam(): Promise<TeamMember[]> {
  return many<TeamMember>(
    `SELECT id, slug, name, role, quote, image, bio_md, sort_order, is_published
       FROM team_members WHERE is_published = TRUE ORDER BY sort_order ASC, id ASC`,
  );
}
