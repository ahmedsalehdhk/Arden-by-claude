"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function Placeholder({ color = "#c2b9ab", className = "" }: { color?: string; className?: string }) {
  return <div className={`w-full h-full ${className}`} style={{ backgroundColor: color }} />;
}

const VALUES = [
  {
    num: "01",
    title: "Integrity",
    body: "We build relationships on trust and transparency, ensuring every commitment we make is one we keep — to clients, partners, and communities alike.",
  },
  {
    num: "02",
    title: "Excellence",
    body: "From design to delivery, we hold ourselves to the highest standard of quality, craftsmanship, and attention to detail in every project we undertake.",
  },
  {
    num: "03",
    title: "Innovation",
    body: "We continuously push the boundaries of architecture and urban living, integrating thoughtful design with modern technology to shape the future of real estate.",
  },
  {
    num: "04",
    title: "Community",
    body: "Every development we create is designed not just as a building, but as a contribution to the social and cultural fabric of the city and its people.",
  },
];


function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative pt-[60px] overflow-hidden" style={{ minHeight: "90vh" }}>
        <div className="absolute inset-0">
          <Placeholder color="#1c1b1a" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/20 to-[#faf9f6]" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 pt-24 sm:pt-36 pb-24 sm:pb-40">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans text-white/50 mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            About Arden
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-white lowercase"
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              letterSpacing: "0.06em",
              fontWeight: 300,
              lineHeight: 1.0,
              maxWidth: "700px",
            }}
          >
            A mark of distinction.
          </motion.h1>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <FadeIn>
              <p className="font-sans text-[#c9a54a] mb-5" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
                Our Story
              </p>
              <h2
                className="font-serif text-[#1a1a1a] leading-[1.2]"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
              >
                Built on ambition, delivered with precision.
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="font-sans text-[#1a1a1a]/50 leading-[2] mb-6" style={{ fontSize: "16px" }}>
                Arden Group was founded in 2003 with a singular vision: to set a new standard for real estate in Bangladesh. Over two decades, we have grown from a single project in Gulshan into one of the country&apos;s most respected property developers, with a portfolio spanning premium residential towers, Grade A commercial buildings, and mixed-use landmark developments.
              </p>
              <p className="font-sans text-[#1a1a1a]/50 leading-[2]" style={{ fontSize: "16px" }}>
                Our success is built not merely on the quality of bricks and mortar, but on the trust of the thousands of clients, investors, and landowners who have partnered with us. Every project we undertake carries the weight of that trust — and it is a responsibility we take seriously.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE ── */}
      <section className="w-full" style={{ height: "clamp(300px, 55vw, 700px)" }}>
        <Placeholder color="#c8bfb0" />
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#f0ede6" }}>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <FadeIn className="mb-14 sm:mb-20">
            <p className="font-sans text-[#c9a54a] mb-4" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
              What We Stand For
            </p>
            <h2
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, maxWidth: "500px" }}
            >
              Our principles guide every decision we make.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]/[0.07]">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <div className="bg-[#f0ede6] p-8 sm:p-10 lg:p-12">
                  <p className="font-sans text-[#c9a54a] mb-5" style={{ fontSize: "12px", letterSpacing: "0.22em" }}>
                    {v.num}
                  </p>
                  <h3
                    className="font-serif text-[#1a1a1a] mb-4"
                    style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 500 }}
                  >
                    {v.title}
                  </h3>
                  <p className="font-sans text-[#1a1a1a]/45 leading-[1.9]" style={{ fontSize: "15px" }}>
                    {v.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE GRID ── */}
      <section className="bg-[#faf9f6] pb-20 sm:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div style={{ aspectRatio: "3/4" }}><Placeholder color="#c2b9ab" /></div>
            <div className="sm:mt-12" style={{ aspectRatio: "3/4" }}><Placeholder color="#b8ae9f" /></div>
            <div className="lg:mt-6" style={{ aspectRatio: "3/4" }}><Placeholder color="#cdc4b5" /></div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 sm:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 text-center">
          <FadeIn>
            <p className="font-sans text-white/40 mb-5" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
              Work With Us
            </p>
            <h2
              className="font-serif text-white mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "0.03em" }}
            >
              Ready to find your next landmark?
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
