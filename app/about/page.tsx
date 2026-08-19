"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, cubicBezier } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import { useIsLoaded } from "../context/LoadContext";

type TeamMember = { name: string; role: string; quote: string; image: string; bio: string[] };

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
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [TEAM, setTeam] = useState<TeamMember[]>([]);
  const [groupImage, setGroupImage] = useState<string>("/team/group.jpg");
  useEffect(() => {
    fetch("/api/settings/team-group-image")
      .then((r) => (r.ok ? r.json() : { url: null }))
      .then((d: { url: string | null }) => { if (d?.url) setGroupImage(d.url); })
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch("/api/team")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => setTeam(rows.map((m) => ({
        name: m.name, role: m.role, quote: m.quote, image: m.image || "",
        bio: (m.bio_md || "").split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean),
      }))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeMember === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMember(null);
    };
    document.addEventListener("keydown", onKey);

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyPadRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.paddingRight = prevBodyPadRight;
    };
  }, [activeMember]);

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
                src="/about/hero-01.jpg"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-stretch items-start lg:min-h-[560px]">
            <FadeIn delay={0.15}>
              <div className="space-y-6">
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  Arden Holdings was established with a singular vision—to bring a new dimension of architectural excellence, refined living and enduring value to Bangladesh.
                </p>
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  From the very beginning, Arden has chosen a distinctive path: not to simply develop properties, but to create addresses that become landmarks in their own right. Every project is conceived with a clear purpose—to harmonise exceptional architecture, uncompromising quality, contemporary lifestyle and timeless elegance.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:h-full">
              <div className="relative w-full bg-[#1a1a1a]/5 overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-full">
                <Image
                  src="/about/hero-02.jpg"
                  alt="Arden project view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  loading="lazy"
                />
              </div>
            </FadeIn>
          </div>

        </div>

        {/* Row 2 — full-bleed swatch background, text kept within padding */}
        <FadeIn delay={0.15}>
          <div
            className="w-full py-8 sm:py-10 lg:py-12"
            style={{
              backgroundImage: "url('/swatch-light.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="px-[7.5%] space-y-6">
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                Our journey has taken us to some of the most prestigious and coveted locations of Dhaka. From the historic Chairman Bari, Banani, to the distinguished Banani DOHS; from the emerging landmark of Jolshiri to the heritage-rich surroundings of Dhanmondi—Arden is steadily establishing its presence through projects that aspire to stand apart.
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                For Arden, a building is never merely a structure. It is an expression of character, an embodiment of aspiration and, ultimately, a legacy that transcends generations. We do not simply build spaces, we create addresses that endure.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-cream py-14 sm:py-18 lg:py-22">
        <div className="px-[7.5%]">
          <FadeIn className="mb-8 sm:mb-10">
            <AnimatedHeading
              as="h2"
              text="Our principles guide every decision we make"
              trigger="view"
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, maxWidth: "500px" }}
            />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]/[0.07]">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08} className="h-full">
                <div className="bg-cream px-6 sm:px-8 lg:px-10 py-5 sm:py-6 lg:py-7 h-full">
                  <p className="font-sans text-[#c9a54a] mb-2" style={{ fontSize: "12px", letterSpacing: "0.22em" }}>
                    {v.num}
                  </p>
                  <h3
                    className="font-serif text-[#1a1a1a] mb-2"
                    style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 500 }}
                  >
                    {v.title}
                  </h3>
                  <p className="font-sans font-medium text-body-lg text-[#1a1a1a] text-left !leading-[1.5]">
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
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="The Team Behind Arden"
              trigger="view"
              className="font-serif text-[#1a1a1a] leading-[1.2] mb-8 sm:mb-10"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify mb-6">
              Leadership with vision. Execution with integrity. Behind every enduring institution is a team that believes in something greater than business.
            </p>
          </FadeIn>
        </div>

        {/* Full-bleed swatch block for the Chowdhury bio paragraphs */}
        <FadeIn delay={0.15}>
          <div
            className="w-full py-8 sm:py-10 lg:py-12 mb-20 sm:mb-28"
            style={{
              backgroundImage: "url('/swatch-light.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="px-[7.5%] space-y-6">
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                Arden Holdings is driven by a dedicated, resilient and dependable team committed to transforming vision into reality. At the heart of this leadership is Mr. Mazharul Haque Chowdhury, a visionary business leader whose professional journey began in 1997 and spans nearly three decades of experience across media, communications, marketing, business and entrepreneurship. He played a pivotal role in establishing and developing Havas Group Bangladesh, building a significant presence in the country&rsquo;s media and communications landscape in association with the Impress Group (Channel i).
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                His career has been defined by a combination of strategic vision, professional integrity, relationship-building and an ability to identify opportunities ahead of the curve. His entrepreneurial journey subsequently expanded into diversified business ventures, including Trilliant Holdings, established in 2021, which has undertaken and delivered a number of projects across Dhaka with a strong emphasis on customer satisfaction, quality and execution. These experiences have shaped the philosophy behind Arden Holdings.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="px-[7.5%]">
          {/* Text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-stretch items-start mb-20 sm:mb-28 lg:min-h-[560px]">
            <FadeIn delay={0.15} className="lg:h-full lg:order-2">
              <div className="relative w-full bg-[#1a1a1a]/5 overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-full">
                <Image
                  src="/about/hero-03.png"
                  alt="Arden project view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  loading="lazy"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:order-1">
              <div className="space-y-6">
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  Arden was created with a clear and ambitious objective: to develop exceptional architectural destinations for discerning customers in the most prestigious locations of Dhaka and its emerging premium neighborhoods. The philosophy is simple but uncompromising&mdash;select the right location, envision the extraordinary, execute with discipline and deliver a standard of living worthy of those who aspire to the very best.
                </p>
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  With a leadership grounded in experience, a team committed to excellence and a vision that reaches beyond the present, Arden Holdings is building not merely for today, but for the generations that will follow.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn className="mb-14 sm:mb-20 max-w-3xl">
            <AnimatedHeading
              as="h2"
              text="Meet the team"
              trigger="view"
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
          </FadeIn>

          {/* Key members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 sm:mb-28">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => setActiveMember(i)}
                  className="group flex flex-col text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a54a]/60"
                  aria-label={`Read bio for ${member.name}`}
                >
                  <div className="relative overflow-hidden bg-[#1a1a1a]/5 mb-6" style={{ aspectRatio: "3/4" }}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                      loading="lazy"
                    />
                    <span
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 bg-[#1a1a1a]/80 text-white px-3 py-1.5 transition-colors duration-300 group-hover:bg-[#1a1a1a]"
                      style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" }}
                    >
                      Read bio <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <h3
                    className="font-serif text-[#1a1a1a] mb-1"
                    style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)", fontWeight: 500 }}
                  >
                    {member.name}
                  </h3>
                  <p className="font-sans text-[#c9a54a] mb-5 min-h-[3em]" style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1.5 }}>
                    {member.role}
                  </p>
                  <blockquote
                    className="font-serif text-[#1a1a1a]/70 italic border-l-2 border-[#c9a54a]/40 pl-4"
                    style={{ fontSize: "15px", lineHeight: 1.7 }}
                  >
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                </button>
              </FadeIn>
            ))}
          </div>

          {/* Group photo */}
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden w-full mb-6" style={{ aspectRatio: "16/7" }}>
              <Image
                src={groupImage}
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

      {/* ── TEAM MEMBER MODAL ── */}
      <AnimatePresence>
        {activeMember !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveMember(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-name"
          >
            <div className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-sm" />
            <motion.div
              className="relative bg-[#faf9f6] w-full max-w-5xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveMember(null)}
                aria-label="Close bio"
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#faf9f6]/90 hover:bg-white text-[#1a1a1a] transition-colors"
              >
                <X size={18} />
              </button>

              <div className="relative bg-[#1a1a1a]/5 aspect-[3/4] md:aspect-auto md:h-full">
                <Image
                  src={TEAM[activeMember].image}
                  alt={TEAM[activeMember].name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              <div className="p-8 sm:p-10 lg:p-12 overflow-y-auto">
                <h3
                  id="team-modal-name"
                  className="font-serif text-[#1a1a1a] mb-2"
                  style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.25rem)", fontWeight: 400, lineHeight: 1.2 }}
                >
                  {TEAM[activeMember].name}
                </h3>
                <p
                  className="font-sans text-[#1a1a1a]/60 mb-6"
                  style={{ fontSize: "15px", lineHeight: 1.5 }}
                >
                  {TEAM[activeMember].role}
                </p>
                <blockquote
                  className="font-serif text-[#1a1a1a]/70 italic border-l-2 border-[#c9a54a]/40 pl-4 mb-8"
                  style={{ fontSize: "16px", lineHeight: 1.7 }}
                >
                  &ldquo;{TEAM[activeMember].quote}&rdquo;
                </blockquote>
                <div className="space-y-4">
                  {TEAM[activeMember].bio.map((para, idx) => (
                    <p
                      key={idx}
                      className="font-sans font-medium text-[#1a1a1a] !leading-[1.7]"
                      style={{ fontSize: "15px" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
