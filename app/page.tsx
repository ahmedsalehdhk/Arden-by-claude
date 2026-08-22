"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  cubicBezier,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AnimatedHeading from "./components/AnimatedHeading";
import { useIsLoaded } from "./context/LoadContext";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

// Add more images here to auto-rotate through them in the hero.
// Each image plays a Ken Burns loop; when its cycle ends, the next crossfades in.
const HERO_IMAGES = [
  { src: "/static/home-hero-1.png", alt: "Luxury real estate development" },
  { src: "/static/home-and-careers-hero.jpg", alt: "Luxury real estate development"},
  { src: "/static/home-hero-2.png", alt: "Luxury real estate development"}
];

const KEN_BURNS_DURATION_S = 6;

type FeaturedProject = {
  category: string;
  tag: string;
  name: string;
  slug: string;
  location: string;
  image: string;
  buildingImage: string;
};

const STATS = [
  { value: 100, suffix: "%", label: "On-Time Handover" },
  { value: 0, suffix: "", label: "Compromised Standards" },
  { value: 100, suffix: "%", label: "Success Rate" },
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
// SECTION 1 — HERO
// ─────────────────────────────────────────────

function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const clipPercent = useTransform(scrollY, [0, 600], [7.5, 0], {
    ease: cubicBezier(0.22, 1, 0.36, 1),
  });
  const isLoaded = useIsLoaded();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const unsub = clipPercent.on("change", (v) => {
      if (imageRef.current) {
        imageRef.current.style.clipPath = `inset(0 ${v}%)`;
      }
    });
    return () => { unsub(); };
  }, [clipPercent]);

  // Rotate hero images once per Ken Burns cycle (only kicks in when >1 image)
  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, KEN_BURNS_DURATION_S * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#faf9f6] pt-[calc(69px_+_7.5vw)] sm:pt-[140px] pb-[7.5vw] sm:pb-0" aria-label="Hero">
      {/* Main headline */}
      <div className="px-[7.5%] pt-6 sm:pt-10 pb-6 sm:pb-8">
        <AnimatedHeading
          as="h1"
          text="Legacy In Every Landmark"
          trigger="load"
          active={isLoaded}
          delay={0.4}
          className="font-serif text-[#1a1a1a] text-center select-none uppercase w-full sm:whitespace-nowrap"
          style={{
            fontSize: "clamp(1.5rem, 4.5vw, 4.5vw)",
            letterSpacing: "0.22em",
            lineHeight: 1.25,
            fontWeight: 400,
          }}
        />
      </div>

      {/* Hero image — mobile height is derived so the whole hero fits one viewport
          with a bottom gap that mirrors the top nav offset + text padding (~164px).
          Desktop keeps the original fixed 78vh. */}
      <div className="relative w-full overflow-hidden h-[calc(100svh_-_177px_-_15vw)] sm:h-[78vh]">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div
            ref={imageRef}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ clipPath: "inset(0 7.5%)" }}
          >
            {HERO_IMAGES.map((img, i) => (
              <div
                key={img.src}
                className="absolute inset-0 hero-ken-burns"
                style={{
                  opacity: i === activeImageIndex ? 1 : 0,
                  transition: "opacity 1500ms cubic-bezier(0.4,0,0.2,1)",
                  animationPlayState: i === activeImageIndex ? "running" : "paused",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="100vw"
                />
              </div>
            ))}
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
            <AnimatedHeading
              as="h2"
              text="Our Strategy"
              trigger="view"
              className="font-serif text-[#1a1a1a]  mb-6"
              style={{
                fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
                letterSpacing: "0.18em",
                fontWeight: 500,
                lineHeight: 1.1,
              }}
            />
            <p className="font-sans font-medium text-body-lg text-[#1a1a1a] mb-10">
              Building the country&apos;s most selective projects requires more than just a vision—it requires a standard of excellence that never wavers. Discover a portfolio where luxury meets structural perfection.
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

const FEATURED_AUTO_ADVANCE_MS = 7000;
const FEATURED_SWIPE_DURATION_MS = 1600;

function FeaturedProjectsSection() {
  const [FEATURED_PROJECTS, setFeatured] = useState<FeaturedProject[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects?featured=true")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => {
        if (cancelled) return;
        setFeatured(
          rows.map((p) => ({
            category: "Featured Projects",
            tag: p.type,
            name: p.name,
            slug: p.slug,
            location: p.location,
            image: p.heroImage,
            buildingImage: p.buildingImage || p.heroImage,
          })),
        );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const total = FEATURED_PROJECTS.length;

  const switchTo = (next: number) => {
    if (next === activeIndex || fading) return;
    setFading(true);
    setPrevIndex(activeIndex);
    setActiveIndex(next);
    setTimeout(() => {
      setFading(false);
      setPrevIndex(null);
    }, FEATURED_SWIPE_DURATION_MS);
  };

  const goPrev = () => switchTo((activeIndex - 1 + total) % total);
  const goNext = () => switchTo((activeIndex + 1) % total);

  // Auto-advance every N ms; timer resets whenever activeIndex changes (manual or auto)
  useEffect(() => {
    if (total <= 1) return;
    const id = setTimeout(() => {
      const next = (activeIndex + 1) % total;
      setFading(true);
      setPrevIndex(activeIndex);
      setActiveIndex(next);
      setTimeout(() => {
        setFading(false);
        setPrevIndex(null);
      }, FEATURED_SWIPE_DURATION_MS);
    }, FEATURED_AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [activeIndex, total]);

  if (total === 0) return null;

  const project = FEATURED_PROJECTS[activeIndex];

  return (
    <section id="projects" className="relative w-full overflow-hidden min-h-[100svh] lg:min-h-0 lg:h-[80vh]">
      <div className="absolute inset-0 isolate">
        {FEATURED_PROJECTS.map((p, i) => {
          const isActive = i === activeIndex;
          const isExiting = i === prevIndex;
          const isRelevant = isActive || isExiting;
          return (
            <motion.div
              key={p.name}
              className="absolute inset-0 overflow-hidden"
              style={{
                zIndex: isExiting ? 3 : isActive ? 2 : 1,
                visibility: isRelevant ? "visible" : "hidden",
                willChange: "transform",
              }}
              initial={{ y: 0 }}
              animate={{ y: isExiting ? "-100%" : "0%" }}
              transition={isExiting
                ? { duration: FEATURED_SWIPE_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 }}
            >
              {/* Subtle Ken Burns — scale down from 1.18 → 1 across the full slide
                  duration so motion runs right up to the handoff. Keyed on activeIndex
                  so each new slide restarts fresh. */}
              <motion.div
                key={`kb-${p.name}-${isActive ? activeIndex : "idle"}`}
                initial={{ scale: isActive ? 1.18 : 1 }}
                animate={{ scale: isActive ? 1 : 1.18 }}
                transition={{ duration: FEATURED_AUTO_ADVANCE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      {/* Uniform dark overlay */}
      <div className="absolute inset-0 bg-[#1a1a1a]/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Building image — top on mobile, right column on desktop */}
        <motion.div className="lg:hidden flex justify-center pt-4 sm:pt-6 px-[7.5%]">
          <div
            className="relative shadow-lg"
            style={{ width: "88vw", maxWidth: "480px", height: "56vh", maxHeight: "540px" }}
          >
            {FEATURED_PROJECTS.map((p, i) => (
              <div
                key={p.name}
                className="absolute inset-0"
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  transition: "opacity 380ms cubic-bezier(0.4,0,0.2,1)",
                  willChange: "opacity",
                }}
              >
                <Image
                  src={p.buildingImage}
                  alt={`${p.name} building`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 88vw, 480px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Left column — text */}
        <div className="flex flex-col justify-center px-[7.5%] max-w-2xl w-full lg:w-auto flex-1 pt-4 sm:pt-6 lg:pt-0 pb-6 lg:pb-0">
          {/* Static category label — doesn't re-animate on slide change */}
          <p className="font-sans text-eyebrow-lg uppercase text-white mb-5 sm:mb-7">
            {project.category}
          </p>

          {/* Text — staggered entrance on slide change */}
          <div className="relative" style={{ minHeight: "140px" }}>
            <AnimatePresence mode="sync">
              <motion.div
                key={activeIndex}
                className="absolute inset-x-0 top-0"
                exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }}
              >
                <motion.h2
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-white uppercase leading-[1.05] mb-3 sm:mb-4"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)", fontWeight: 700, letterSpacing: "0.02em" }}
                >
                  {project.name}
                </motion.h2>
                <motion.p
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="font-sans text-body-lg text-white/85 mb-8 sm:mb-12"
                  style={{ letterSpacing: "0.06em" }}
                >
                  {project.location}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls group — visually separated from the text above */}
          <div className="mt-2 sm:mt-20">
            {/* View Project CTA */}
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-3 mb-10 sm:mb-14 w-fit"
            >
              <span className="font-sans font-semibold text-eyebrow uppercase text-white group-hover:text-[#c9a54a] transition-colors duration-300">
                View Project
              </span>
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="text-white group-hover:text-[#c9a54a] group-hover:translate-x-1 transition-all duration-300"
              />
            </Link>

            {/* Arrow navigation — larger, pressable */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(12);
                  goPrev();
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 flex items-center justify-center text-white hover:bg-white hover:text-[#1a1a1a] active:scale-90 transition-all duration-150 ease-out"
                aria-label="Previous"
              >
                <ChevronLeft size={22} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(12);
                  goNext();
                }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/80 flex items-center justify-center text-white hover:bg-white hover:text-[#1a1a1a] active:scale-90 transition-all duration-150 ease-out"
                aria-label="Next"
              >
                <ChevronRight size={22} strokeWidth={1.75} />
              </button>
            </div>

            {/* Progress bars */}
            <div className="flex items-center gap-1.5 w-[140px] sm:w-[160px]">
              {FEATURED_PROJECTS.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] flex-1 cursor-pointer ${i === activeIndex ? "bg-white" : "bg-white/40"}`}
                  style={{ transition: "background-color 300ms" }}
                  onClick={() => switchTo(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column — building image (desktop only) */}
        <motion.div className="hidden lg:block pr-[7.5%] flex-shrink-0">
          <div className="relative" style={{ width: "min(520px, 38vw)", height: "75vh", maxHeight: "640px" }}>
            {FEATURED_PROJECTS.map((p, i) => (
              <div
                key={p.name}
                className="absolute inset-0"
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  transition: "opacity 380ms cubic-bezier(0.4,0,0.2,1)",
                  willChange: "opacity",
                }}
              >
                <Image
                  src={p.buildingImage}
                  alt={`${p.name} building`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 520px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// SECTION 4 — STATISTICS
// ─────────────────────────────────────────────

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
        <div className="text-center mb-14 sm:mb-20 lg:mb-32">
          <AnimatedHeading
            as="h2"
            text="Shaping Your Property into a Lasting Legacy"
            trigger="view"
            boldFromWord={5}
            className="font-serif text-[#1a1a1a] leading-[1.25] mx-auto"
            style={{
              fontSize: "clamp(1.95rem, 3.4vw, 3.1rem)",
              fontWeight: 400,
            }}
          />
        </div>

        {/* All stats in a single responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-12 max-w-4xl mx-auto">
          {STATS.map((s, i) => (
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
    <section id="connect" className="relative bg-[#faf9f6] py-16 sm:py-24 lg:py-36 overflow-hidden">
      {/* Right — image, absolutely positioned to fill full section height on lg */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.85, delay: 0.25 }}
        className="hidden lg:block absolute top-0 right-0 bottom-0"
        style={{ width: "46%" }}
      >
        <Image
          src="/static/home-cta.jpg"
          alt="Arden Holdings development"
          fill
          className="object-cover"
          sizes="46vw"
          loading="lazy"
        />
      </motion.div>

      <div ref={ref} className="relative z-10 px-[7.5%]">
        {/* Heading */}
        <AnimatedHeading
          as="h2"
          text="Get in touch"
          trigger="view"
          className="font-serif text-[#1a1a1a] uppercase mb-16"
          style={{
            fontSize: "clamp(2.1rem, 4vw, 3.8rem)",
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.15 }}
          className="lg:w-1/2 lg:pr-20"
        >
          {/* Clients */}
          <div className="pb-10 border-b border-[#1a1a1a]/8">
            <h3
              className="font-serif text-[#c9a54a] mb-3 tracking-[0.04em]"
              style={{ fontSize: "clamp(1.4rem, 1.9vw, 1.6rem)", fontWeight: 500 }}
            >
              Clients
            </h3>
            <p
              className="font-sans text-body-lg text-[#1a1a1a] mb-5"
              style={{ maxWidth: "500px" }}
            >
              Discover exclusive real estate opportunities designed for the modern investor. We don&apos;t just develop land, we create landmarks that stand the test of time.
            </p>
            <Link href="/contact" className="font-sans font-semibold text-[13px] tracking-[0.24em] uppercase text-[#1a1a1a] flex items-center gap-2 group hover:text-[#c9a54a] transition-colors">
              Reach Out
              <ArrowUpRight
                size={11}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>

          {/* Landowners */}
          <div className="pt-10">
            <h3
              className="font-serif text-[#c9a54a] mb-3 tracking-[0.04em]"
              style={{ fontSize: "clamp(1.4rem, 1.9vw, 1.6rem)", fontWeight: 500 }}
            >
              Landowners
            </h3>
            <p
              className="font-sans text-body-lg text-[#1a1a1a] mb-5"
              style={{ maxWidth: "500px" }}
            >
              Partner with Arden to leave a lasting mark on the city&apos;s skyline. Let&apos;s start the conversation—share your information to explore partnership opportunities.
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

      </div>
    </section>
  );
}


// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function Home() {
  const isLoaded = useIsLoaded();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={isLoaded ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <Nav />
      <Hero />
      <AboutSection />
      <FeaturedProjectsSection />
      <StatisticsSection />
      <ContactSection />
      <Footer />
    </motion.main>
  );
}
