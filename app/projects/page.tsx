"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import ProjectCard from "../components/ProjectCard";
import { useIsLoaded } from "../context/LoadContext";

type ProjectRow = {
  name: string;
  slug: string;
  address: string;
  location: string;
  status: string;
  type: string;
  image: string;
  byAllianceArden?: boolean;
  byTrilliantArden?: boolean;
};


function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const isLoaded = useIsLoaded();
  const [PROJECTS, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/projects", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => setProjects(rows.map((p) => ({
        name: p.name, slug: p.slug, address: p.address, location: p.location,
        status: p.status, type: p.type, image: p.buildingImage || p.heroImage,
        byAllianceArden: p.byAllianceArden, byTrilliantArden: p.byTrilliantArden,
      }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = PROJECTS.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
  });

  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-[#faf9f6] pt-[140px]" aria-label="Projects hero">
        <div className="px-[7.5%] pt-6 sm:pt-10 pb-10 sm:pb-16">
          <AnimatedHeading
            as="h1"
            text="Prime Residences in Elite Destinations"
            trigger="load"
            active={isLoaded}
            delay={0.4}
            className="font-serif text-[#1a1a1a] text-center select-none uppercase mx-auto text-balance"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4.5vw)",
              letterSpacing: "0.22em",
              lineHeight: 1.25,
              fontWeight: 400,
              maxWidth: "min(1000px, 92vw)",
              textWrap: "balance",
            }}
          />
        </div>
      </section>

      {/* Full-width divider between hero and search */}
      <hr className="border-t border-[#1a1a1a]/10 w-full m-0" />

      {/* ── SEARCH ── */}
      <section className="bg-[#faf9f6] sticky top-[60px] z-30">
        <div className="px-[7.5%] pt-12 sm:pt-16 pb-2 sm:pb-3">
          <label
            htmlFor="project-search"
            className="block font-sans text-eyebrow-sm uppercase text-[#c9a54a] mb-3"
          >
            Find a Project
          </label>
          <div className="relative max-w-xl">
            <Search
              size={17}
              strokeWidth={1.75}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/55 pointer-events-none"
            />
            <input
              id="project-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location…"
              className="w-full bg-transparent border-b border-[#1a1a1a]/25 pl-7 pr-8 py-3 font-sans text-body text-[#1a1a1a] placeholder-[#1a1a1a]/45 focus:outline-none focus:border-[#c9a54a] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors text-xl leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="bg-[#faf9f6] pt-4 sm:pt-6 pb-12 sm:pb-16 lg:pb-20">
        <div className="px-[7.5%]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-24"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-[#1a1a1a]/10 border-t-[#c9a54a] animate-spin"
                  aria-label="Loading projects"
                />
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <p className="font-sans text-[#1a1a1a]/30 text-sm tracking-wide">No projects match your search.</p>
              </motion.div>
            ) : (
              <motion.div
                key={query}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filtered.map((project, i) => (
                  <FadeIn key={`${project.name}-${i}`} delay={i * 0.04}>
                    <ProjectCard project={project} />
                  </FadeIn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="px-[7.5%] text-center">
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="Partner with us to build something extraordinary."
              trigger="view"
              className="font-serif text-ink mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "0.03em" }}
            />
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 font-sans text-eyebrow uppercase text-ink border border-ink/40 px-8 py-4 hover:bg-ink hover:text-white transition-all duration-300"
            >
              Get In Touch
              <ArrowUpRight size={13} />
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
