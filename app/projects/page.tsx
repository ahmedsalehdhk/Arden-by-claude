"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function Placeholder({ color = "#c2b9ab", className = "" }: { color?: string; className?: string }) {
  return <div className={`w-full h-full ${className}`} style={{ backgroundColor: color }} />;
}

// Project data extracted from Shanta — adapted for Arden
const PROJECTS = [
  { name: "Oasis", address: "1373, Block L, Bashundhara R/A", location: "Bashundhara", status: "Ongoing", type: "Residential", color: "#c8bfb0" },
  { name: "Moin's Harbour", address: "Plot 58, Road 5/A, Dhanmondi", location: "Dhanmondi", status: "Ongoing", type: "Residential", color: "#bfb5a5" },
  { name: "Majesta", address: "Plot 06, Road 67, North Gulshan", location: "Gulshan", status: "Ongoing", type: "Residential", color: "#c4bba8" },
  { name: "Zenith", address: "199, Bir Uttam Mir Shawkat Sarak, Tejgaon", location: "Tejgaon", status: "Ongoing", type: "Commercial", color: "#b8ae9e" },
  { name: "Evermore", address: "Plot 4/1, Road 75 and 80, North Gulshan", location: "Gulshan", status: "Upcoming", type: "Residential", color: "#ccc3b2" },
  { name: "Iris", address: "Plot 14, Road 1, Baridhara", location: "Baridhara", status: "Upcoming", type: "Residential", color: "#c0b7a7" },
  { name: "Shalmolee", address: "Plot 57, Road 6/A, Dhanmondi", location: "Dhanmondi", status: "Completed", type: "Residential", color: "#b5ab9b" },
  { name: "Liberty", address: "Plot 16, Dutabash Road, Baridhara", location: "Baridhara", status: "Completed", type: "Residential", color: "#c9c0af" },
  { name: "Adore", address: "Plot 33, Road 43, Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#bdb3a2" },
  { name: "Orchard", address: "Plot 17, Road 4, Dhanmondi", location: "Dhanmondi", status: "Completed", type: "Residential", color: "#c6bda0" },
  { name: "Mirage", address: "1369, 1370; Block L, Bashundhara R/A", location: "Bashundhara", status: "Completed", type: "Residential", color: "#b0a898" },
  { name: "Nirantar", address: "Road 02 & 03, Block H, Bashundhara R/A", location: "Bashundhara", status: "Completed", type: "Residential", color: "#c3baa0" },
  { name: "Vista", address: "212, Tejgaon", location: "Tejgaon", status: "Completed", type: "Commercial", color: "#bbb1a1" },
  { name: "Dhaka Tower", address: "203-204, Tejgaon I/A", location: "Tejgaon", status: "Completed", type: "Commercial", color: "#c8bfb0" },
  { name: "Magnus", address: "Plot 02, Road 80, North Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#bfb5a6" },
  { name: "Luxor", address: "Plot 07, Road 51 & 54, North Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#c2b9a9" },
  { name: "Inani", address: "Plot 3/A, Road 58, North Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#b8ae9f" },
  { name: "Atlantis", address: "Plot 18, Road 62, North Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#ccc2b2" },
  { name: "Auberge", address: "Plot 9B, Road 83, North Gulshan", location: "Gulshan", status: "Completed", type: "Residential", color: "#c0b6a6" },
  { name: "Aurobhi", address: "Plot 36, Road 1, Banani DOHS", location: "Banani", status: "Completed", type: "Residential", color: "#bab0a0" },
];

const LOCATIONS = ["All Location", "Banani", "Gulshan", "Baridhara", "Tejgaon", "Mirpur", "Uttara", "Bashundhara", "Dhanmondi"];
const STATUSES = ["All", "Ongoing", "Upcoming", "Completed"];
const TYPES = ["All", "Residential", "Commercial"];

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
  const [location, setLocation] = useState("All Location");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const filtered = PROJECTS.filter((p) => {
    const locMatch = location === "All Location" || p.location === location;
    const statMatch = status === "All" || p.status === status;
    const typeMatch = type === "All" || p.type === type;
    return locMatch && statMatch && typeMatch;
  });

  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative pt-[60px] overflow-hidden" style={{ minHeight: "55vh" }}>
        <div className="absolute inset-0">
          <Placeholder color="#1c1b1a" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/40 via-transparent to-[#faf9f6]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-20 sm:pt-32 pb-20 sm:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans text-white/50 mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-white uppercase"
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

      {/* ── FILTERS ── */}
      <section className="bg-[#faf9f6] sticky top-[60px] z-30 border-b border-[#1a1a1a]/[0.07] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          {/* Location filter — scrollable on mobile */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-0 py-0 min-w-max">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`font-sans text-[12px] tracking-[0.18em] uppercase px-4 py-4 sm:py-5 whitespace-nowrap transition-all duration-200 border-b-2 ${
                    location === loc
                      ? "text-[#1a1a1a] border-[#c9a54a]"
                      : "text-[#1a1a1a]/40 border-transparent hover:text-[#1a1a1a]"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          {/* Status + Type filter */}
          <div className="flex flex-wrap items-center gap-6 py-3 border-t border-[#1a1a1a]/[0.06]">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a]/30">Status:</span>
              <div className="flex gap-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`font-sans text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 transition-all duration-200 ${
                      status === s
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a]/30">Type:</span>
              <div className="flex gap-1">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`font-sans text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 transition-all duration-200 ${
                      type === t
                        ? "bg-[#1a1a1a] text-white"
                        : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <span className="ml-auto font-sans text-[11px] tracking-[0.16em] uppercase text-[#1a1a1a]/30">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="bg-[#faf9f6] py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <p className="font-sans text-[#1a1a1a]/30 text-sm tracking-wide">No projects match the selected filters.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${location}-${status}-${type}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filtered.map((project, i) => (
                  <FadeIn key={project.name} delay={i * 0.04}>
                    <Link href={`/projects/${project.name.toLowerCase().replace(/['\s]+/g, "-")}`} className="block">
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
                  </FadeIn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 sm:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 text-center">
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
