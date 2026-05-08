import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ProjectCardData {
  name: string;
  address: string;
  location: string;
  status: "Ongoing" | "Upcoming" | "Completed" | string;
  type: "Residential" | "Commercial" | string;
  color: string;
}

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  const slug = project.name.toLowerCase().replace(/['\s]+/g, "-");

  return (
    <Link href={`/projects/${slug}`} className="block">
      <article className="group cursor-pointer">
        {/* Image placeholder */}
        <div
          className="relative overflow-hidden mb-5"
          style={{ aspectRatio: "4/3" }}
        >
          <div
            className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            style={{ backgroundColor: project.color }}
          />
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span
              className="font-sans text-[10px] tracking-[0.22em] uppercase px-2.5 py-1.5"
              style={{
                backgroundColor:
                  project.status === "Ongoing"
                    ? "#c9a54a"
                    : project.status === "Upcoming"
                    ? "#1a1a1a"
                    : "rgba(26,26,26,0.45)",
                color: "white",
              }}
            >
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
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3
              className="font-serif text-[#1a1a1a] group-hover:text-[#c9a54a] transition-colors duration-300"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 500 }}
            >
              {project.name}
            </h3>
            <span
              className="font-sans text-[#c9a54a] flex-shrink-0 mt-1"
              style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              {project.type}
            </span>
          </div>
          <p
            className="font-sans text-[#1a1a1a]/40"
            style={{ fontSize: "14px", letterSpacing: "0.04em" }}
          >
            {project.address}
          </p>
        </div>
      </article>
    </Link>
  );
}
