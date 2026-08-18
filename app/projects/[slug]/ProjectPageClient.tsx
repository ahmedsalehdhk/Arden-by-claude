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
  ArrowUpDown,
  Waves,
  Sofa,
  DoorOpen,
  Video,
  ChefHat,
  Sparkles,
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
  ArrowUpDown,
  Waves,
  Sofa,
  DoorOpen,
  Video,
  ChefHat,
  Sparkles,
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
        {/* Top-down dark fade — keeps the transparent nav legible and carries a
            richer wash down almost the full hero for better text contrast. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "95%",
            background: "linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 35%, rgba(10,10,10,0.5) 65%, rgba(10,10,10,0.2) 90%, rgba(10,10,10,0) 100%)",
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

        {(project.byAllianceArden || project.byTrilliantArden) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-6 sm:gap-7 text-center"
        >
          <span
            className="font-sans text-white/75 uppercase"
            style={{ fontSize: "clamp(13px, 1.1vw, 15px)", letterSpacing: "0.3em", lineHeight: 1 }}
          >
            {project.byTrilliantArden ? "by Trilliant-Arden Consortium" : "by Alliance-Arden Consortium"}
          </span>
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <Image
              src={project.byTrilliantArden ? "/logos/trilliant-lockup.png" : "/logos/apl-lockup.png"}
              alt={project.byTrilliantArden ? "Trilliant Holdings" : "Alliance Properties"}
              width={280}
              height={164}
              className="h-11 sm:h-14 w-auto brightness-0 invert opacity-90 shrink-0"
              priority={false}
            />
            <span
              className="flex-shrink-0 bg-white/50"
              style={{ width: "1px", height: "clamp(28px, 3vw, 40px)" }}
              aria-hidden="true"
            />

            <Image
              src="/logo-lockup.png"
              alt="Arden Holdings"
              width={280}
              height={119}
              className="h-11 sm:h-14 w-auto brightness-0 invert opacity-90 shrink-0"
              priority={false}
            />
          </div>
        </motion.div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// AT A GLANCE SECTION
// ─────────────────────────────────────────────

function AtAGlance({ project }: { project: ProjectDetail }) {

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-36">
      <div className="px-[7.5%]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] gap-14 lg:gap-24 items-start">

          {/* Left — title + status + address */}
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="At a Glance"
              trigger="view"
              className="font-serif text-[#1a1a1a] mb-10 sm:mb-14"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
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
            {project.specs.map((spec, i) => (
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
  const renderFeature = (feature: (typeof project.features)[number]) => {
    const IconComp = ICON_MAP[feature.icon];
    return (
      <li
        key={feature.label}
        className="flex items-center gap-4 py-4 sm:py-5 border-b border-ink/15"
      >
        <div className="w-10 h-10 border border-ink/25 flex items-center justify-center flex-shrink-0">
          {IconComp && <IconComp size={18} strokeWidth={1.25} className="text-ink/80" />}
        </div>
        <span className="font-sans text-body-sm text-ink">{feature.label}</span>
      </li>
    );
  };

  return (
    <Section tone="bone" rhythm="loose">
      <FadeIn>
        <AnimatedHeading
          as="h2"
          text="Features & Amenities"
          trigger="view"
          className="font-serif text-ink mb-16 sm:mb-20"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-10 lg:gap-16 items-stretch">
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden w-full h-full" style={{ aspectRatio: "4/5" }}>
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-16">
            {project.features.map(renderFeature)}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// MEET THE ARCHITECT SECTION
// ─────────────────────────────────────────────

function ArchitectSection({ project }: { project: ProjectDetail }) {
  const a = project.architect;
  if (!a || !a.name.trim() || a.name.trim().toUpperCase() === "REDACTED") return null;

  return (
    <section
      className="w-full py-20 sm:py-28 lg:py-32"
      style={{
        backgroundImage: "url('/swatch-dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="px-[7.5%]">
        <FadeIn>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-full bg-ink/5 mb-6" style={{ width: 112, height: 64 }}>
              <Image
                src={a.image}
                alt={a.name}
                fill
                className="object-cover"
                sizes="128px"
                loading="lazy"
              />
            </div>

            <AnimatedHeading
              as="h2"
              text={a.name}
              trigger="view"
              className="font-serif text-ink mb-2"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 500 }}
            />
            <p className="font-sans text-body-sm text-ink/55 mb-6">
              {a.title}
            </p>
            <p className="font-sans font-medium text-body-lg text-ink !leading-[1.6]">
              {a.quote}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
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
        <AnimatedHeading
          as="h2"
          text="Know Your Neighborhood"
          trigger="view"
          className="font-serif text-ink mb-10 sm:mb-14"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
      </FadeIn>

      {/* Asymmetric 3-photo mosaic: one large left, two stacked right */}
      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-2 gap-3 sm:gap-4 mb-10 sm:mb-14 sm:h-[520px] lg:h-[620px]">
          <div className="relative overflow-hidden bg-ink/5 sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto">
            <iframe
              src={
                project.mapEmbedSrc ??
                `https://www.google.com/maps?q=${encodeURIComponent(project.address)}&output=embed`
              }
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title={`${project.name} — ${project.address}`}
            />
          </div>
          {n.images[0] && (
            <div className="relative overflow-hidden bg-ink/5 aspect-[4/3] sm:aspect-auto">
              <Image
                src={n.images[0]}
                alt={`${project.location} neighborhood`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
          )}
          {n.images[1] && (
            <div className="relative overflow-hidden bg-ink/5 aspect-[4/3] sm:aspect-auto">
              <Image
                src={n.images[1]}
                alt={`${project.location} neighborhood`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </FadeIn>

      {/* Titled paragraphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {n.sections.map((s, i) => (
          <FadeIn key={s.title} delay={0.1 + i * 0.05}>
            <h3
              className="font-serif text-ink mb-4"
              style={{ fontSize: "clamp(1.25rem, 1.6vw, 1.6rem)", fontWeight: 500 }}
            >
              {s.title}
            </h3>
            <p className="font-sans font-medium text-body-lg text-ink !leading-[1.6] sm:text-justify">
              {s.body}
            </p>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// CTA SECTION
// ─────────────────────────────────────────────

function ProjectCTA() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="px-[7.5%] text-center">
        <FadeIn>
          <AnimatedHeading
            as="h2"
            text="Schedule a private viewing or inquire today."
            trigger="view"
            className="font-serif text-ink mb-10"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400 }}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 font-sans text-eyebrow uppercase text-ink border border-ink/40 px-8 py-4 hover:bg-ink hover:text-white transition-all duration-300"
            >
              Contact Us
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2.5 font-sans text-eyebrow uppercase text-ink/50 border border-ink/15 px-8 py-4 hover:border-ink/40 hover:text-ink transition-all duration-300"
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
      <ArchitectSection project={project} />
      <NeighborhoodSection project={project} />
      <ProjectCTA />
      <Footer />
    </main>
  );
}
