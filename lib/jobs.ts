import { many, one } from "./db";

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export interface JobPosting {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  summary: string;
  description_md: string;
  is_open: boolean;
  posted_at: string;
}

export async function getOpenJobs(): Promise<JobPosting[]> {
  return many<JobPosting>(
    `SELECT id, slug, title, department, location, type, summary, description_md, is_open, posted_at
       FROM job_postings WHERE is_open = TRUE ORDER BY posted_at DESC`,
  );
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  return one<JobPosting>(
    `SELECT id, slug, title, department, location, type, summary, description_md, is_open, posted_at
       FROM job_postings WHERE slug = $1`,
    [slug],
  );
}
