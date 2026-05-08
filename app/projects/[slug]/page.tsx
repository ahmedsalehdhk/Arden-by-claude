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
    <section className="relative pt-[90px] overflow-hidden" style={{ minHeight: "70vh" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/50 to-[#1a1a1a]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-[7.5%] flex flex-col items-center justify-center text-center"
        style={{ minHeight: "calc(70vh - 90px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-5"
        >
          <span
            className="inline-block font-sans text-white/50 tracking-[0.32em] uppercase"
            style={{ fontSize: "12px" }}
          >
            {project.type} &middot; {project.location}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-white uppercase"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 7rem)",
            letterSpacing: "0.12em",
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {project.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-white/60 mt-5"
          style={{ fontSize: "17px", maxWidth: "500px", letterSpacing: "0.03em" }}
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
  return (
    <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
      <div className="px-[7.5%]">
        {/* Section heading */}
        <FadeIn>
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="font-sans text-[#1a1a1a]/30 mb-4"
              style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
            >
              Project Overview
            </p>
            <h2
              className="font-serif text-[#1a1a1a] uppercase"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              At a Glance
            </h2>
            {/* Decorative line */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-[#c9a54a]/40" />
              <div className="w-2 h-2 rotate-45 border border-[#c9a54a]/40" />
              <div className="w-12 h-px bg-[#c9a54a]/40" />
            </div>
          </div>
        </FadeIn>

        {/* Main grid: specs left — building center — specs right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_1fr] gap-10 lg:gap-8 items-center">
          {/* Left specs */}
          <FadeIn delay={0.1}>
            <div className="space-y-8 lg:space-y-10">
              {project.specsLeft.map((spec) => (
                <div key={spec.label} className="text-center lg:text-right">
                  <p
                    className="font-serif text-[#1a1a1a]"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 500 }}
                  >
                    {spec.value}
                  </p>
                  <p
                    className="font-sans text-[#1a1a1a]/40 mt-1"
                    style={{ fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {spec.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Center building image */}
          <FadeIn delay={0.2} className="order-first lg:order-none">
            <div className="relative mx-auto" style={{ maxWidth: "320px" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/5" }}>
                <Image
                  src={project.buildingImage}
                  alt={`${project.name} Building`}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span
                  className="inline-block font-sans text-white px-5 py-2.5"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    backgroundColor:
                      project.status === "Ongoing"
                        ? "#c9a54a"
                        : project.status === "Upcoming"
                        ? "#1a1a1a"
                        : "rgba(26,26,26,0.65)",
                  }}
                >
                  {project.status}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Right specs */}
          <FadeIn delay={0.3}>
            <div className="space-y-8 lg:space-y-10">
              {project.specsRight.map((spec) => (
                <div key={spec.label} className="text-center lg:text-left">
                  <p
                    className="font-serif text-[#1a1a1a]"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 500 }}
                  >
                    {spec.value}
                  </p>
                  <p
                    className="font-sans text-[#1a1a1a]/40 mt-1"
                    style={{ fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {spec.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Address below */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-16 sm:mt-20">
            <p
              className="font-sans text-[#1a1a1a]/35"
              style={{ fontSize: "14px", letterSpacing: "0.06em" }}
            >
              {project.address}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FEATURES & AMENITIES SECTION
// ─────────────────────────────────────────────

function FeaturesSection({ project }: { project: ProjectDetail }) {
  const leftFeatures = project.features.slice(0, Math.ceil(project.features.length / 2));
  const rightFeatures = project.features.slice(Math.ceil(project.features.length / 2));

  return (
    <section className="bg-[#f4f2ee] py-20 sm:py-28 lg:py-36">
      <div className="px-[7.5%]">
        {/* Section heading */}
        <FadeIn>
          <div className="text-center mb-16 sm:mb-20">
            <p
              className="font-sans text-[#1a1a1a]/30 mb-4"
              style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
            >
              What We Offer
            </p>
            <h2
              className="font-serif text-[#1a1a1a] uppercase"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              Features &amp; Amenities
            </h2>
            {/* Decorative line */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-[#c9a54a]/40" />
              <div className="w-2 h-2 rotate-45 border border-[#c9a54a]/40" />
              <div className="w-12 h-px bg-[#c9a54a]/40" />
            </div>
          </div>
        </FadeIn>

        {/* Features grid + image */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Left column of features */}
          <FadeIn delay={0.1}>
            <div className="space-y-0">
              {leftFeatures.map((feature, i) => {
                const IconComp = ICON_MAP[feature.icon];
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-4 py-5 border-b border-[#1a1a1a]/[0.07]"
                    style={i === 0 ? { borderTop: "1px solid rgba(26,26,26,0.07)" } : {}}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#c9a54a]/10 flex items-center justify-center flex-shrink-0">
                      {IconComp && <IconComp size={18} strokeWidth={1.5} className="text-[#c9a54a]" />}
                    </div>
                    <span
                      className="font-sans text-[#1a1a1a]/70"
                      style={{ fontSize: "15px", letterSpacing: "0.02em" }}
                    >
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Right column of features */}
          <FadeIn delay={0.2}>
            <div className="space-y-0">
              {rightFeatures.map((feature, i) => {
                const IconComp = ICON_MAP[feature.icon];
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-4 py-5 border-b border-[#1a1a1a]/[0.07]"
                    style={i === 0 ? { borderTop: "1px solid rgba(26,26,26,0.07)" } : {}}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#c9a54a]/10 flex items-center justify-center flex-shrink-0">
                      {IconComp && <IconComp size={18} strokeWidth={1.5} className="text-[#c9a54a]" />}
                    </div>
                    <span
                      className="font-sans text-[#1a1a1a]/70"
                      style={{ fontSize: "15px", letterSpacing: "0.02em" }}
                    >
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Building image */}
          <FadeIn delay={0.3} className="hidden lg:block">
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src={project.buildingImage}
                alt={`${project.name} Features`}
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
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
          <h2
            className="font-serif text-white mb-10"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
          >
            Schedule a private viewing or inquire today.
          </h2>
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
      <Nav />
      <ProjectHero project={project} />
      <AtAGlance project={project} />
      <FeaturesSection project={project} />
      <ProjectCTA project={project} />
      <Footer />
    </main>
  );
}
