"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import { Section, FadeIn } from "../components/ui";
import { useIsLoaded } from "../context/LoadContext";

// Dummy openings — replace when the actual roles are confirmed.
const OPENINGS: {
  title: string;
  location: string;
  type: string;
  department: string;
  summary: string;
}[] = [];

export default function CareersPage() {
  const isLoaded = useIsLoaded();
  const imageRef = useRef<HTMLDivElement>(null);
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
                src="/projectimages/amanat/lobby-view-01.jpg"
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
                <li>
                  <Link
                    href={`/contact?role=${encodeURIComponent(role.title)}`}
                    className="group grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_auto] items-start gap-4 md:gap-8 py-8 sm:py-10"
                  >
                    <div>
                      <h3
                        className="font-serif text-ink group-hover:text-gold transition-colors duration-300"
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
                    <p className="font-sans text-body text-ink/70">
                      {role.summary}
                    </p>
                    <span className="hidden md:inline-flex self-center items-center gap-2 font-sans text-eyebrow uppercase text-ink group-hover:text-gold transition-colors">
                      Apply
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </span>
                  </Link>
                </li>
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
