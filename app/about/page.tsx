"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, cubicBezier } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import { useIsLoaded } from "../context/LoadContext";

const TEAM = [
  {
    name: "Mazharul Haque",
    role: "Founder & Chairman",
    quote: "We measure a building the way people measure a home — by how it lives, not how it looks on day one.",
    image: "/team/mazharul.jpg",
  },
  {
    name: "Mohiuddin Ahmed",
    role: "Director",
    quote: "The best projects begin with saying no to the wrong ones. Discipline is the quiet part of luxury.",
    image: "/team/mohiuddin.jpg",
  },
  {
    name: "Yaminul Haq",
    role: "Director, Alliance-Arden Consortium",
    quote: "Setting a new standard in property development through high-level strategies, uncompromised execution and honesty.",
    image: "/team/yaminul.jpg",
  },
];

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
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-[#faf9f6] pt-[140px]" aria-label="About Arden hero">
        {/* Headline */}
        <div className="px-[7.5%] pt-6 sm:pt-10 pb-6 sm:pb-8">
          <AnimatedHeading
            as="h1"
            text="About Arden"
            trigger="load"
            active={isLoaded}
            delay={0.4}
            className="font-serif text-[#1a1a1a] text-center select-none uppercase w-full sm:whitespace-nowrap"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4.5vw)",
              letterSpacing: "0.22em",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          />
        </div>

        {/* Hero image */}
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
                src="/projectimages/amanat/front-side-view-01.jpg"
                alt="Amanat by Arden Holdings"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
        <div className="px-[7.5%]">
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="Our Vision"
              trigger="view"
              className="font-serif text-[#1a1a1a] leading-[1.2] mb-14 sm:mb-20"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
          </FadeIn>

          {/* Row 1 — text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-stretch items-start mb-16 sm:mb-24">
            <FadeIn delay={0.15}>
              <div className="space-y-6">
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a]/60">
                  Arden Holdings was established with a singular vision—to bring a new dimension of architectural excellence, refined living and enduring value to Bangladesh.
                </p>
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a]/60">
                  From the very beginning, Arden has chosen a distinctive path: not to simply develop properties, but to create addresses that become landmarks in their own right. Every project is conceived with a clear purpose—to harmonise exceptional architecture, uncompromising quality, contemporary lifestyle and timeless elegance.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:h-full">
              <div className="relative w-full bg-[#1a1a1a]/5 overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-full">
                <Image
                  src="/about/hero-01.jpg"
                  alt="Arden project view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>

          {/* Row 2 — full-width text */}
          <FadeIn delay={0.15}>
            <div className="space-y-6">
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a]/60">
                Our journey has taken us to some of the most prestigious and coveted locations of Dhaka. From the historic Chairman Bari, Banani, to the distinguished Banani DOHS; from the emerging landmark of Jolshiri to the heritage-rich surroundings of Dhanmondi—Arden is steadily establishing its presence through projects that aspire to stand apart.
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a]/60">
                For Arden, a building is never merely a structure. It is an expression of character, an embodiment of aspiration and, ultimately, a legacy that transcends generations.
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a]/60">
                We do not simply build spaces. We create addresses that endure.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-cream py-20 sm:py-28 lg:py-36">
        <div className="px-[7.5%]">
          <FadeIn className="mb-14 sm:mb-20">
            <AnimatedHeading
              as="h2"
              text="Our principles guide every decision we make."
              trigger="view"
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, maxWidth: "500px" }}
            />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]/[0.07]">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08} className="h-full">
                <div className="bg-cream p-8 sm:p-10 lg:p-12 h-full">
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

      {/* ── TEAM ── */}
      <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
        <div className="px-[7.5%]">
          <FadeIn className="mb-14 sm:mb-20 max-w-3xl">
            <AnimatedHeading
              as="h2"
              text="Meet the team."
              trigger="view"
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
          </FadeIn>

          {/* Key members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 sm:mb-28">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.06}>
                <article className="flex flex-col">
                  <div className="relative overflow-hidden bg-[#1a1a1a]/5 mb-6" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                      loading="lazy"
                    />
                  </div>
                  <h3
                    className="font-serif text-[#1a1a1a] mb-1"
                    style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)", fontWeight: 500 }}
                  >
                    {member.name}
                  </h3>
                  <p className="font-sans text-[#c9a54a] mb-5" style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                    {member.role}
                  </p>
                  <blockquote
                    className="font-serif text-[#1a1a1a]/70 italic border-l-2 border-[#c9a54a]/40 pl-4"
                    style={{ fontSize: "15px", lineHeight: 1.7 }}
                  >
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* Group photo */}
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden w-full mb-6" style={{ aspectRatio: "16/7" }}>
              <Image
                src="/team/group.jpg"
                alt="The Arden Holdings team"
                fill
                className="object-cover"
                sizes="100vw"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-[#1a1a1a]/40 text-center" style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              The Arden team, Dhaka
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="px-[7.5%] text-center">
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="How about we catch up over coffee?"
              trigger="view"
              className="font-serif text-[#1a1a1a] mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "0.03em" }}
            />
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 font-sans text-[12px] tracking-[0.26em] uppercase text-[#1a1a1a] border border-[#1a1a1a]/40 px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
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
