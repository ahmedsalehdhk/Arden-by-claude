import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export interface ProjectCardData {
  name: string;
  address: string;
  location: string;
  status: "Ongoing" | "Upcoming" | "Completed" | string;
  type: "Residential" | "Commercial" | string;
  image?: string;
  color?: string;
  byAllianceArden?: boolean;
  byTrilliantArden?: boolean;
}

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  const slug = project.name.toLowerCase().replace(/['\s]+/g, "-");

  return (
    <Link href={`/projects/${slug}`} className="block">
      <article className="group cursor-pointer">
        {/* Image / placeholder */}
        <div
          className="relative overflow-hidden mb-5"
          style={{ aspectRatio: "3/4" }}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
            />
          ) : (
            <div
              className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              style={{ backgroundColor: project.color || "#c2b9ab" }}
            />
          )}
          {/* Status badge */}
          <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
            <span className="font-sans text-eyebrow-sm uppercase px-2.5 py-1.5 bg-white text-[#1a1a1a]">
              {project.status}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/20 transition-colors duration-500 flex items-end justify-end p-5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight size={14} className="text-[#1a1a1a]" />
            </div>
          </div>
        </div>
        {/* Info */}
        <div>
          <h3
            className="font-serif text-[#1a1a1a] uppercase group-hover:text-[#c9a54a] transition-colors duration-300 mb-1.5"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 500, letterSpacing: "0.12em" }}
          >
            {project.name}
            {project.byAllianceArden ? " by Alliance-Arden" : ""}
            {project.byTrilliantArden ? " by Trilliant-Arden" : ""}
          </h3>
          <p className="font-sans text-body text-[#1a1a1a]/65">
            {project.location}
          </p>
        </div>
      </article>
    </Link>
  );
}
