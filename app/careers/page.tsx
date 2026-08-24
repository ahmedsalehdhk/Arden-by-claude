"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { ArrowUpRight, MapPin, Briefcase, Mail, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import MarkdownBody from "../components/MarkdownBody";
import { Section, FadeIn } from "../components/ui";
import { useIsLoaded } from "../context/LoadContext";

type Opening = {
  slug: string;
  title: string;
  location: string;
  type: string;
  department: string;
  summary: string;
  description: string;
};

function OpeningRow({ role, email }: { role: Opening; email: string }) {
  const [open, setOpen] = useState(false);
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(
    `Application — ${role.title}`
  )}&body=${encodeURIComponent(
    `Hello Arden Holdings,\n\nI'd like to apply for the ${role.title} role (${role.location}).\n\nMy CV is attached and a short note about myself is below.\n\n—\n`
  )}`;

  return (
    <li className="py-8 sm:py-10">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_auto] items-start gap-4 md:gap-8">
        <div>
          <h3
            className="font-serif text-ink"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 500 }}
          >
            {role.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-ink/50">
            <span className="inline-flex items-center gap-1.5 font-sans text-body-sm">
              <MapPin size={13} strokeWidth={1.5} />
              {role.location}
            </span>
            <span className="inline-flex items-center gap-1.5 font-sans text-body-sm">
              <Briefcase size={13} strokeWidth={1.5} />
              {role.type} · {role.department}
            </span>
          </div>
        </div>
        <p className="font-sans text-body text-ink/70">{role.summary}</p>
        <div className="flex flex-wrap gap-3 md:self-center md:flex-nowrap">
          {role.description?.trim() && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="group inline-flex items-center justify-center gap-2 px-4 py-2 border border-ink/25 rounded-full font-sans text-eyebrow uppercase text-ink hover:border-gold hover:text-gold transition-colors"
            >
              {open ? "Hide details" : "Read more"}
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          )}
          <a
            href={mailHref}
            className="group inline-flex items-center justify-center gap-2 px-4 py-2 border border-ink/25 rounded-full font-sans text-eyebrow uppercase text-ink hover:border-gold hover:text-gold transition-colors"
          >
            <Mail size={14} strokeWidth={1.5} />
            Email to apply
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>

      {open && role.description?.trim() && (
        <div className="mt-6 md:mt-8 md:pl-0">
          <MarkdownBody source={role.description} />
        </div>
      )}
    </li>
  );
}

export default function CareersPage() {
  const isLoaded = useIsLoaded();
  const imageRef = useRef<HTMLDivElement>(null);
  const [OPENINGS, setOpenings] = useState<Opening[]>([]);
  const [applyEmail, setApplyEmail] = useState("info@ardenholdingsltd.com");
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => setOpenings(rows.map((j) => ({
        slug: j.slug, title: j.title, location: j.location, type: j.type,
        department: j.department, summary: j.summary,
        description: j.description_md || "",
      }))))
      .catch(() => {});
    fetch("/api/settings/contact-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.email) setApplyEmail(d.email); })
      .catch(() => {});
  }, []);
  const { scrollY } = useScroll();
  const clipPercent = useTransform(scrollY, [0, 600], [7.5, 0], {
    ease: cubicBezier(0.22, 1, 0.36, 1),
  });

  useEffect(() => {
    const unsub = clipPercent.on("change", (v) => {
      if (imageRef.current) {
        imageRef.current.style.clipPath = `inset(0 ${v}%)`;
      }
    });
    return () => { unsub(); };
  }, [clipPercent]);

  return (
    <main className="bg-bone">
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-bone pt-nav-offset" aria-label="Careers hero">
        <div className="px-edge pt-6 sm:pt-10 pb-6 sm:pb-8">
          <AnimatedHeading
            as="h1"
            text="Careers"
            trigger="load"
            active={isLoaded}
            delay={0.4}
            className="font-serif text-ink text-center select-none uppercase w-full"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4.5vw)",
              letterSpacing: "0.22em",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          />
        </div>

        <div className="relative w-full overflow-hidden" style={{ height: "78vh" }}>
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
              <Image
                src="/static/careers-hero.jpg"
                alt="Working at Arden Holdings"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OPENINGS ── */}
      <Section tone="cream" rhythm="loose">
        <FadeIn className="mb-14 sm:mb-20">
          <p className="font-sans text-gold mb-4 text-eyebrow-sm uppercase">Open Roles</p>
          <AnimatedHeading
            as="h2"
            text={OPENINGS.length > 0 ? "Currently hiring." : "No open roles right now."}
            trigger="view"
            className="font-serif text-ink"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
          />
        </FadeIn>

        {OPENINGS.length > 0 && (
          <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
            {OPENINGS.map((role, i) => (
              <FadeIn key={role.title} delay={i * 0.06}>
                <OpeningRow role={role} email={applyEmail} />
              </FadeIn>
            ))}
          </ul>
        )}

        <FadeIn delay={0.1}>
          <p className="font-sans text-body text-ink/60 mt-10 max-w-2xl">
            {OPENINGS.length > 0
              ? <>Don&apos;t see a role that fits? </>
              : <>We aren&apos;t actively hiring, but we&apos;re always open to hearing from great people. </>}
            <Link href="/contact" className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-gold hover:text-gold transition-colors">
              Write to us anyway
            </Link>
            {" "}— we keep a running list of people we&apos;d like to hire when the next project starts.
          </p>
        </FadeIn>
      </Section>

      <Footer />
    </main>
  );
}
