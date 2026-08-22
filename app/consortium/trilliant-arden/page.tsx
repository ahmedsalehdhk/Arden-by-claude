"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, cubicBezier } from "framer-motion";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import AnimatedHeading from "../../components/AnimatedHeading";
import { useIsLoaded } from "../../context/LoadContext";

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

export default function TrilliantArdenConsortiumPage() {
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
      <section className="bg-[#faf9f6] pt-[140px]" aria-label="Trilliant-Arden Consortium hero">
        <div className="px-[7.5%] pt-6 sm:pt-10 pb-6 sm:pb-8">
          <AnimatedHeading
            as="h1"
            text="Trilliant-Arden Consortium"
            trigger="load"
            active={isLoaded}
            delay={0.4}
            className="font-serif text-[#1a1a1a] text-center select-none uppercase w-full sm:whitespace-nowrap"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 4vw)",
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
                src="/consortium/trilliant-ardent/hero-01.jpg"
                alt="Trilliant-Arden Consortium"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRILLIANT–ARDEN CONSORTIUM ── */}
      <section className="bg-[#faf9f6] py-20 sm:py-28 lg:py-36">
        <div className="px-[7.5%]">
          <FadeIn>
            <AnimatedHeading
              as="h2"
              text="Trilliant–Arden Consortium"
              trigger="view"
              className="font-serif text-[#1a1a1a] leading-[1.2] mb-8 sm:mb-10"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
            <p className="font-serif text-[#1a1a1a]/80 mb-12 sm:mb-16" style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.6rem)", fontWeight: 400, lineHeight: 1.5 }}>
              Craftsmanship, reimagined at a higher order.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-6">
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                The Trilliant Arden Consortium represents a strategic partnership between Trilliant Holdings Ltd. and Arden Holdings Ltd., pairing engineering rigor with refined architectural design. Drawing on the shared expertise of both firms, the consortium is dedicated to developing premier luxury projects that set new standards in structural integrity, elevated craftsmanship and modern urban living.
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                A consortium is more than an association. It is a convergence of strengths, shared values and a common ambition. The Trilliant&ndash;Arden Consortium brings together Trilliant Holdings&rsquo; deep bench of construction and delivery expertise and Arden Holdings&rsquo; forward-looking vision for distinctive, high-end architecture and elevated urban living. This partnership has been formed with a deliberate purpose: to identify and develop exceptional projects that leave a lasting impression on the architectural landscape of Bangladesh. Together, Trilliant and Arden pursue opportunities where conventional thinking is not enough&mdash;projects that demand out-of-the-box creativity, bold architectural expression, intelligent planning and multidimensional lifestyle facilities.
              </p>
              <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                Our ambition extends beyond creating premium residences. We aspire to create destinations that redefine expectations of contemporary living and become reference points for the future of real estate in Bangladesh. And our vision does not end at the borders of Bangladesh. With a strong foundation of experience, a progressive mindset and an uncompromising commitment to excellence, the Trilliant&ndash;Arden Consortium looks forward to taking its vision of distinctive development beyond borders and onto a broader international horizon.
              </p>
            </div>
          </FadeIn>

        </div>

        <FadeIn delay={0.15} className="mt-16 sm:mt-20">
          <div className="w-full py-14 sm:py-20 lg:py-24 bg-[#c9a54a]/15">
            <div className="px-[7.5%]">
              <h3
                className="font-serif text-[#1a1a1a] mb-6 sm:mb-8"
                style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 500 }}
              >
                Inception of the Consortium
              </h3>
              <div className="space-y-6">
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  The Trilliant-Arden Consortium relies on a sharp, clear-headed leadership team focused on building real estate that stands out for all the right reasons. Guiding this joint venture is a partnership of principals who bring years of hands-on experience navigating Dhaka&rsquo;s real estate landscape and a practical, well-tested approach to every project the team touches.
                </p>
                <p className="font-sans font-medium text-body-lg text-[#1a1a1a] !leading-[1.6] sm:text-justify">
                  Throughout their careers, the team behind Trilliant-Arden has built a reputation for turning ambitious ideas into well-executed developments. The consortium was formed to bring together the best strengths of both companies. For the partnership, it isn&rsquo;t just about constructing buildings&mdash;it&rsquo;s about creating refined, high-quality spaces that deliver lasting value for the people who live in them.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="px-[7.5%]">
          <FadeIn delay={0.2} className="mt-16 sm:mt-20">
            <p
              className="font-serif text-[#1a1a1a] text-center italic"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", fontWeight: 400, lineHeight: 1.4 }}
            >
              Two strengths. One vision. A legacy in the making.
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
