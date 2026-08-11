"use client";

import { useRef } from "react";
import { useParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Wind,
  ShieldCheck,
  Droplets,
  Flame,
  Car,
  Wifi,
  Dumbbell,
  TreePine,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import AnimatedHeading from "../../components/AnimatedHeading";
import ProjectGallery from "../../components/ProjectGallery";
import FloorPlansSection from "../../components/FloorPlansSection";
import { Section } from "../../components/ui";
import { getProjectBySlug } from "../../data/projects";
import type { ProjectDetail } from "../../data/projects";

// ─────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
  Zap,
  Wind,
  ShieldCheck,
  Droplets,
  Flame,
  Car,
  Wifi,
  Dumbbell,
  TreePine,
  Users,
};

// ─────────────────────────────────────────────
// FADE-IN WRAPPER
// ─────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// NOT FOUND
// ─────────────────────────────────────────────

function ProjectNotFound() {
  return (
    <main className="bg-[#faf9f6]">
      <Nav />
      <section className="pt-[120px] pb-32 text-center">
        <div className="px-[7.5%]">
          <h1
            className="font-serif text-[#1a1a1a] mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 500 }}
          >
            Project Not Found
          </h1>
          <p className="font-sans text-[#1a1a1a]/50 text-lg mb-10">
            The project you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-sans text-[13px] tracking-[0.22em] uppercase text-[#c9a54a] border border-[#c9a54a]/40 px-8 py-4 hover:bg-[#c9a54a] hover:text-white transition-all duration-300"
          >
            View All Projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────

function ProjectHero({ project }: { project: ProjectDetail }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "600px" }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Top-down dark fade — keeps the transparent nav legible on any image */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "45%",
            background: "linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.35) 45%, rgba(10,10,10,0) 100%)",
          }}
        />
        {/* Subtle overall darkening so centered text reads on any shot */}
        <div className="absolute inset-0 bg-[#0a0a0a]/25" />
      </div>

      {/* Content — sits high, roughly 1/4 from top */}
      <div className="relative z-10 h-full flex flex-col items-center justify-start pt-[28vh] px-[7.5%] text-center">
        <AnimatedHeading
          as="h1"
          text={project.name}
          trigger="load"
          active
          delay={0.3}
          className="font-serif text-white uppercase"
          style={{
            fontSize: "clamp(3rem, 7.5vw, 8rem)",
            letterSpacing: "0.14em",
            fontWeight: 700,
            lineHeight: 1,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-sans text-white mt-8 sm:mt-10 max-w-3xl"
          style={{
            fontSize: "clamp(15px, 1.4vw, 19px)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 500,
            textShadow: "0 1px 24px rgba(0,0,0,0.35)",
          }}
        >
          {project.tagline}
        </motion.p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// AT A GLANCE SECTION
// ─────────────────────────────────────────────

function AtAGlance({ project }: { project: ProjectDetail }) {
  const allSpecs = [...project.specsLeft, ...project.specsRight];

  return (
    <section className="py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#f5f0e8" }}>
      <div className="px-[7.5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] gap-14 lg:gap-24 items-start">

          {/* Left — title + status + address */}
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="At a Glance"
              trigger="view"
              className="font-serif text-[#1a1a1a] uppercase mb-10 sm:mb-14"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
                letterSpacing: "0.04em",
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            />
            <p
              className="font-sans text-[#c9a54a] mb-8"
              style={{ fontSize: "13px", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 600 }}
            >
              Status: {project.status}
            </p>
            <div>
              <p
                className="font-sans text-[#1a1a1a] mb-2"
                style={{ fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}
              >
                Address:
              </p>
              <p className="font-sans text-[#1a1a1a]/75" style={{ fontSize: "16px", lineHeight: 1.6 }}>
                {project.address}
              </p>
            </div>
          </FadeIn>

          {/* Right — specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-9">
            {allSpecs.map((spec, i) => (
              <FadeIn key={spec.label} delay={0.05 + i * 0.04}>
                <div className="pb-6 border-b border-[#1a1a1a]/15">
                  <p
                    className="font-sans text-[#1a1a1a] mb-3"
                    style={{ fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}
                  >
                    {spec.label} :
                  </p>
                  <p className="font-serif text-[#1a1a1a]" style={{ fontSize: "1.1rem", fontWeight: 400 }}>
                    {spec.value}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FEATURES & AMENITIES SECTION
// ─────────────────────────────────────────────

function FeaturesSection({ project }: { project: ProjectDetail }) {
  const mid = Math.ceil(project.features.length / 2);
  const leftFeatures = project.features.slice(0, mid);
  const rightFeatures = project.features.slice(mid);

  const renderFeature = (feature: (typeof project.features)[number]) => {
    const IconComp = ICON_MAP[feature.icon];
    return (
      <div key={feature.label} className="flex items-start gap-6 py-7 sm:py-8 border-b border-ink/10 last:border-b-0">
        <div className="w-11 h-11 border border-ink/25 flex items-center justify-center flex-shrink-0">
          {IconComp && <IconComp size={20} strokeWidth={1.25} className="text-ink/80" />}
        </div>
        <span className="font-sans text-body text-ink pt-2.5">{feature.label}</span>
      </div>
    );
  };

  return (
    <Section tone="cream" rhythm="loose">
      <FadeIn>
        <AnimatedHeading
          as="h2"
          text="Features & Amenities"
          trigger="view"
          className="font-serif text-ink uppercase text-center mb-16 sm:mb-20"
          style={{
            fontSize: "clamp(2rem, 5vw, 4.25rem)",
            letterSpacing: "0.06em",
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-10 lg:gap-16 items-start">
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden w-full" style={{ aspectRatio: "4/5" }}>
            <Image
              src={project.buildingImage}
              alt={`${project.name} Features`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              loading="lazy"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 lg:gap-x-20">
            <div>{leftFeatures.map(renderFeature)}</div>
            <div>{rightFeatures.map(renderFeature)}</div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// KNOW YOUR NEIGHBORHOOD SECTION
// ─────────────────────────────────────────────

function NeighborhoodSection({ project }: { project: ProjectDetail }) {
  const n = project.neighborhood;
  if (!n) return null;

  return (
    <Section tone="bone" rhythm="loose">
      <FadeIn>
        <p className="font-sans text-gold mb-3 text-eyebrow-sm uppercase">Around You</p>
        <AnimatedHeading
          as="h2"
          text="Know Your Neighborhood"
          trigger="view"
          className="font-serif text-ink mb-10 sm:mb-14"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <FadeIn delay={0.05}>
          <div className="relative overflow-hidden w-full" style={{ aspectRatio: "4/3" }}>
            <Image
              src={n.image}
              alt={`${project.location} neighborhood`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6">
            {n.paragraphs.map((para, i) => (
              <p
                key={i}
                className="font-sans font-medium text-ink/70 leading-[1.9]"
                style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}
              >
                {para}
              </p>
            ))}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// LOCATION SECTION
// ─────────────────────────────────────────────

function ProjectLocation({ project }: { project: ProjectDetail }) {
  const embedSrc =
    project.mapEmbedSrc ??
    `https://www.google.com/maps?q=${encodeURIComponent(project.address)}&output=embed`;

  return (
    <section className="w-full py-20 sm:py-28 lg:py-32" style={{ backgroundColor: "#faf9f6" }}>
      <div className="px-[7.5%]">
        <FadeIn className="mb-8 sm:mb-12">
          <p
            className="font-sans text-[#c9a54a] mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            Location
          </p>
          <AnimatedHeading
            as="h2"
            text={`Find ${project.name} in ${project.location}`}
            trigger="view"
            className="font-serif text-[#1a1a1a] mb-4"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
          />
          <p
            className="font-sans text-[#1a1a1a]/60"
            style={{ fontSize: "15px", letterSpacing: "0.02em" }}
          >
            {project.address}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="w-full" style={{ height: "clamp(280px, 40vw, 520px)" }}>
            <iframe
              src={embedSrc}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title={`${project.name} — ${project.address}`}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────

function ProjectCTA({ project }: { project: ProjectDetail }) {
  return (
    <section className="bg-[#1a1a1a] py-20 sm:py-28">
      <div className="px-[7.5%] text-center">
        <FadeIn>
          <p
            className="font-sans text-white/40 mb-5"
            style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            Interested in {project.name}?
          </p>
          <AnimatedHeading
            as="h2"
            text="Schedule a private viewing or inquire today."
            trigger="view"
            className="font-serif text-white mb-10"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 font-sans text-[13px] tracking-[0.22em] uppercase text-[#c9a54a] border border-[#c9a54a]/40 px-8 py-4 hover:bg-[#c9a54a] hover:text-white transition-all duration-300"
            >
              Contact Us
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 font-sans text-[13px] tracking-[0.22em] uppercase text-white/50 border border-white/15 px-8 py-4 hover:border-white/40 hover:text-white transition-all duration-300"
            >
              All Projects
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const project = getProjectBySlug(slug);

  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <main className="bg-[#faf9f6]">
      <Nav transparent />
      <ProjectHero project={project} />
      <AtAGlance project={project} />
      <ProjectGallery images={project.gallery} projectName={project.name} />
      <FloorPlansSection project={project} />
      <FeaturesSection project={project} />
      <NeighborhoodSection project={project} />
      <ProjectLocation project={project} />
      <ProjectCTA project={project} />
      <Footer />
    </main>
  );
}
