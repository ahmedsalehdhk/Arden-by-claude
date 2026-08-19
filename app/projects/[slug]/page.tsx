import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "../../../lib/projects";
import ProjectPageClient from "./ProjectPageClient";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();
  return <ProjectPageClient project={project} />;
}
