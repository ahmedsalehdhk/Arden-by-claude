import { getAllProjectSlugs } from "../../data/projects";
import ProjectPageClient from "./ProjectPageClient";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export default function Page() {
  return <ProjectPageClient />;
}
