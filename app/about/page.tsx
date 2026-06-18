"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useIsLoaded } from "../context/LoadContext";

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
  const isLoaded = useIsLoaded();

  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative pt-[60px] overflow-hidden bg-[#faf9f6]" style={{ minHeight: "55vh" }}>
        <div className="relative z-10 px-[7.5%] pt-20 sm:pt-32 pb-20 sm:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-sans text-[#1a1a1a]/40 mb-6"
            style={{ fontSize: "12px", letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            About Arden
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
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
            A Mark of Distinction.
          </motion.h1>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
        <div className="px-[7.5%]">
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
              <p className="font-sans font-medium text-left text-[#1a1a1a]/60 leading-[2] mb-6" style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                Arden Group was founded in 2003 with a singular vision: to set a new standard for real estate in Bangladesh. Over two decades, we have grown from a single project in Gulshan into one of the country&apos;s most respected property developers, with a portfolio spanning premium residential towers, Grade A commercial buildings, and mixed-use landmark developments.
              </p>
              <p className="font-sans font-medium text-left text-[#1a1a1a]/60 leading-[2]" style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                Our success is built not merely on the quality of bricks and mortar, but on the trust of the thousands of clients, investors, and landowners who have partnered with us. Every project we undertake carries the weight of that trust — and it is a responsibility we take seriously.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE ── */}
      <section className="w-full relative" style={{ height: "clamp(300px, 55vw, 700px)" }}>
        <Image
          src="/projectimages/amanat/rooftop-02.jpg"
          alt="Arden rooftop development"
          fill
          className="object-cover"
          loading="lazy"
          sizes="100vw"
        />
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 sm:py-28 lg:py-36" style={{ backgroundColor: "#f0ede6" }}>
        <div className="px-[7.5%]">
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
                  <p className="font-sans text-left text-[#1a1a1a] leading-[1.9]" style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                    {v.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1a1a1a] py-20 sm:py-28">
        <div className="px-[7.5%] text-center">
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
