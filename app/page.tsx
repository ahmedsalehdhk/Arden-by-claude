"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────


const FEATURED_PROJECTS = [
  {
    category: "Featured Projects",
    tag: "Residential",
    name: "Amanat",
    location: "Banani, Dhaka",
    image: "/projectimages/amanat/Front Side View_01.jpg",
    buildingImage: "/projectimages/amanat/Eye Level View_01.jpg",
  },
  {
    category: "Featured Projects",
    tag: "Residential",
    name: "Rahma",
    location: "Sector 11, Jolshiri",
    image: "/projectimages/rahma/view 02.jpg",
    buildingImage: "/projectimages/rahma/View 01.jpg",
  },
];

const LEFT_STATS = [
  { value: 11, suffix: "M+", label: "Total Area Built\n(Million sft)" },
];

const RIGHT_STATS = [
  { value: 100, suffix: "+", label: "Number of\nProjects" },
  { value: 1500, suffix: "+", label: "Happy Clients" },
  { value: 18, suffix: "M+", label: "Total Area in Pipeline\n(Million sft)" },
];

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

function useCountUp(target: number, duration = 2400, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─────────────────────────────────────────────
// PLACEHOLDER
// ─────────────────────────────────────────────

function Placeholder({
  className = "",
  color = "#c8bfb0",
  style = {},
}: {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: color, ...style }}
    />
  );
}


// ─────────────────────────────────────────────
// SECTION 1 — HERO
// ─────────────────────────────────────────────

function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const clipPercent = useTransform(scrollY, [0, 600], [7.5, 0]);

  useEffect(() => {
    const unsub = clipPercent.on("change", (v) => {
      if (imageRef.current) {
        imageRef.current.style.clipPath = `inset(0 ${v}%)`;
      }
    });
    return () => { unsub(); };
  }, [clipPercent]);

  return (
    <section className="bg-[#faf9f6] pt-[140px]" aria-label="Hero">
      {/* Main headline */}
      <div className="px-[7.5%] pt-6 sm:pt-10 pb-6 sm:pb-8">
        <div className="overflow-hidden pb-3">
          <motion.h1
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[#1a1a1a] text-center select-none uppercase w-full sm:whitespace-nowrap"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4.5vw)",
              letterSpacing: "0.22em",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            <span className="hidden sm:inline">Legacy In Every Landmark</span>
            <span className="sm:hidden">Legacy In<br />Every Landmark</span>
          </motion.h1>
        </div>
      </div>

      {/* Hero image placeholder */}
      <div className="relative w-full overflow-hidden" style={{ height: "78vh" }}>
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div
            ref={imageRef}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ clipPath: "inset(0 7.5%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projectimages/rahma/View 09.png"
              alt="Luxury real estate development"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTION 2 — ABOUT / INTRO TEXT
// ─────────────────────────────────────────────

function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="bg-[#faf9f6]">
      <div
        ref={ref}
        className="px-[7.5%] py-14 sm:py-20 lg:py-28"
      >
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {/* <p
              className="font-serif text-[#1a1a1a] leading-[1.25] mb-8"
              style={{
                fontSize: "clamp(1.55rem, 2.4vw, 2.1rem)",
                fontWeight: 400,
              }}
            >
              A mark of distinction in every development.
            </p> */}
            <p
              className="font-sans font-medium text-[#1a1a1a] leading-[2] mb-10"
              style={{ fontSize: "20px" }}
            >
              Our real estate portfolio is a mark of distinction. Featuring the
              country&apos;s most selective developments, we promise investors
              and buyers an unmatched level of service. Our success is built on
              strong standards and a keen eye for detail, embodying luxury and
              excellence.
            </p>
            <Link href="/about" className="self-start font-sans font-semibold text-[13px] tracking-[0.24em] uppercase text-[#1a1a1a] flex items-center gap-2 group hover:text-[#c9a54a] transition-colors duration-300">
              More about us
              <ArrowUpRight
                size={12}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTION 3 — FEATURED PROJECTS
// ─────────────────────────────────────────────

function FeaturedProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = FEATURED_PROJECTS[activeIndex];
  const total = FEATURED_PROJECTS.length;

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % total);

  return (
    <section id="projects" className="relative w-full overflow-hidden h-[100svh] lg:h-[80vh]">
      {/* Background images — crossfade */}
      {FEATURED_PROJECTS.map((p, i) => (
        <div
          key={p.name}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* Uniform dark overlay */}
      <div className="absolute inset-0 bg-[#1a1a1a]/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Building image — top on mobile, right column on desktop */}
        <div className="lg:hidden flex justify-center pt-8 sm:pt-10 px-[7.5%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.buildingImage}
                alt={`${project.name} building`}
                className="object-cover shadow-lg"
                style={{ width: "60vw", maxWidth: "320px", height: "38vh", maxHeight: "340px" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left column — text */}
        <div className="flex flex-col justify-center px-[7.5%] max-w-2xl w-full lg:w-auto flex-1 pt-6 sm:pt-8 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
            >
              {/* Category label */}
              <p className="font-sans text-[13px] sm:text-[15px] tracking-[0.35em] uppercase text-white mb-1">
                {project.category}
              </p>
              {/* Tag */}
              <p className="font-sans text-[12px] sm:text-[15px] tracking-[0.30em] uppercase text-[#c9a54a] mb-5 sm:mb-7">
                {project.tag}
              </p>
              {/* Project name */}
              <h2
                className="font-serif text-white uppercase leading-[1.05] mb-2 sm:mb-3"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {project.name}
              </h2>
              {/* Location */}
              <p className="font-sans text-white mb-8 sm:mb-12" style={{ fontSize: "14px", letterSpacing: "0.10em" }}>
                {project.location}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* View Project CTA */}
          <Link
            href={`/projects/${project.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center gap-3 mb-8 sm:mb-12"
          >
            <div className="w-[7px] h-[7px] rounded-full bg-[#c9a54a]" />
            <span className="font-serif text-[14px] sm:text-[15px] text-white hover:text-white/70 transition-colors tracking-wide">
              View Project
            </span>
          </Link>

          {/* Arrow navigation */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <button
              onClick={goPrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white flex items-center justify-center text-white hover:text-white/70 hover:border-white/70 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white flex items-center justify-center text-white hover:text-white/70 hover:border-white/70 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Progress bars */}
          <div className="flex items-center gap-1.5 w-[140px] sm:w-[160px]">
            {FEATURED_PROJECTS.map((_, i) => (
              <div
                key={i}
                className={`h-[2px] flex-1 transition-all duration-500 cursor-pointer ${
                  i === activeIndex ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Right column — building image (desktop only) */}
        <div className="hidden lg:block pr-[7.5%] flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.buildingImage}
                alt={`${project.name} building`}
                className="object-cover"
                style={{ width: "320px", height: "65vh", maxHeight: "520px" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTION 4 — STATISTICS
// ─────────────────────────────────────────────

const ALL_STATS = [...LEFT_STATS, ...RIGHT_STATS];

function StatNumber({
  stat,
  started,
}: {
  stat: { value: number; suffix: string; label: string };
  started: boolean;
}) {
  const count = useCountUp(stat.value, 2400, started);
  const lines = stat.label.split("\n");

  return (
    <div className="text-center">
      <p
        className="font-serif text-[#1a1a1a] leading-none"
        style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)", fontWeight: 700 }}
      >
        {count}
        <span style={{ color: "#c9a54a" }}>{stat.suffix}</span>
      </p>
      {lines.map((line, i) => (
        <p
          key={i}
          className="font-sans text-[#1a1a1a]/35 mt-1.5"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            lineHeight: 1.5,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function StatisticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="businesses" className="bg-[#faf9f6] py-16 sm:py-24 lg:py-36">
      <div ref={ref} className="px-[7.5%]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85 }}
          className="text-center mb-14 sm:mb-20 lg:mb-32"
        >
          <h2
            className="font-serif text-[#1a1a1a] leading-[1.25] mx-auto"
            style={{
              fontSize: "clamp(1.95rem, 3.4vw, 3.1rem)",
              fontWeight: 400,
            }}
          >
            Shaping Your Property into a  <span className="font-bold">Lasting Legacy</span>
          </h2>
        </motion.div>

        {/* All stats in a single responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-12 max-w-5xl mx-auto">
          {ALL_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
            >
              <StatNumber stat={s} started={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTION 5 — CONTACT + FOOTER
// ─────────────────────────────────────────────

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="connect" className="bg-[#faf9f6] py-16 sm:py-24 lg:py-36">
      <div ref={ref} className="px-[7.5%]">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-serif text-[#1a1a1a] uppercase mb-16"
          style={{
            fontSize: "clamp(2.1rem, 4vw, 3.8rem)",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          Let&apos;s Connect
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — contact blocks */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15 }}
          >
            {/* Clients */}
            <div className="pb-10 border-b border-[#1a1a1a]/8">
              <h3
                className="font-sans text-[#c9a54a] mb-3 tracking-[0.06em]"
                style={{ fontSize: "20px", fontWeight: 500 }}
              >
                Clients
              </h3>
              <p
                className="font-sans text-[#1a1a1a] leading-[1.95] mb-5"
                style={{ fontSize: "20px", maxWidth: "500px" }}
              >
                Discover exquisite apartments, commercial spaces, and investment
                opportunities with Arden Holdings Ltd. Let us turn your dreams
                into a reality.
              </p>
              <Link href="/contact" className="font-sans font-semibold text-[13px] tracking-[0.24em] uppercase text-[#1a1a1a] flex items-center gap-2 group hover:text-[#c9a54a] transition-colors">
                Reach Out
                <ArrowUpRight
                  size={11}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </div>
            {/* <Link href="/about" className="self-start font-sans font-semibold text-[13px] tracking-[0.24em] uppercase text-[#1a1a1a] flex items-center gap-2 group hover:text-[#c9a54a] transition-colors duration-300"> */}

            {/* Landowners */}
            <div className="pt-10">
              <h3
                className="font-sans text-[#c9a54a] mb-3 tracking-[0.06em]"
                style={{ fontSize: "20px", fontWeight: 500 }}
              >
                Landowners
              </h3>
              <p
                className="font-sans text-[#1a1a1a] leading-[1.95] mb-5"
                style={{ fontSize: "20px", maxWidth: "500px" }}
              >
                Partner with Arden to further our portfolio as part of the
                architectural landscape. Fill up the form to explore this
                partnership.
              </p>
              <Link href="/contact?tab=landowners" className="font-sans font-semibold text-[13px] tracking-[0.24em] uppercase text-[#1a1a1a] flex items-center gap-2 group hover:text-[#c9a54a] transition-colors">
                Partner With Us
                <ArrowUpRight
                  size={11}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </div>
          </motion.div>

          {/* Right — image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.25 }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projectimages/amanat/High Eye level View_04.jpg"
                alt="Arden Holdings development"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <AboutSection />
      <FeaturedProjectsSection />
      <StatisticsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
