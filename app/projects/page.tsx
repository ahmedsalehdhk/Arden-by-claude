"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";

function Placeholder({ color = "#c2b9ab", className = "" }: { color?: string; className?: string }) {
  return <div className={`w-full h-full ${className}`} style={{ backgroundColor: color }} />;
}

// Project data extracted from Shanta — adapted for Arden
const PROJECTS = [
  { name: "Amanat", address: "Road 1, Block I, Banani, Dhaka", location: "Banani", status: "Ongoing", type: "Residential" },
  { name: "Rahma", address: "Road 410, Sector 11, Jolshiri", location: "Jolshiri", status: "Ongoing", type: "Residential" },
];


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

  const filtered = PROJECTS.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
  });

  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative pt-[60px] overflow-hidden bg-[#faf9f6]" style={{ minHeight: "55vh" }}>
        <div className="relative z-10 px-[7.5%] pt-20 sm:pt-32 pb-20 sm:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans text-[#1a1a1a]/40 mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[#1a1a1a] uppercase"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
              letterSpacing: "0.04em",
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: "800px",
            }}
          >
            Exclusive Properties<br />in Prime Locations
          </motion.h1>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section className="bg-[#faf9f6] sticky top-[60px] z-30 border-b border-[#1a1a1a]/[0.07]">
        <div className="px-[7.5%] py-4">
          <div className="relative max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location…"
              className="w-full bg-transparent border-b border-[#1a1a1a]/15 py-2.5 pr-8 font-sans text-[13px] text-[#1a1a1a] placeholder-[#1a1a1a]/30 focus:outline-none focus:border-[#1a1a1a]/50 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-colors text-lg leading-none"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="bg-[#faf9f6] py-12 sm:py-16 lg:py-20">
        <div className="px-[7.5%]">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
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
                  <FadeIn key={project.name} delay={i * 0.04}>
                    <ProjectCard project={project} />
                  </FadeIn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 sm:py-28">
        <div className="px-[7.5%] text-center">
          <FadeIn>
            <p className="font-sans text-white/40 mb-5" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
              Landowners
            </p>
            <h2
              className="font-serif text-white mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
            >
              Partner with Arden to build something landmark.
            </h2>
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 font-sans text-[12px] tracking-[0.26em] uppercase text-[#c9a54a] border border-[#c9a54a]/40 px-8 py-4 hover:bg-[#c9a54a] hover:text-white transition-all duration-300"
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
