"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import { useIsLoaded } from "../context/LoadContext";

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

function InputField({ label, type = "text", textarea = false }: { label: string; type?: string; textarea?: boolean }) {
  return (
    <div className="group">
      <label
        className="block font-sans text-[11px] tracking-[0.26em] uppercase text-[#1a1a1a]/40 mb-2"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={4}
          className="w-full bg-transparent border-b border-[#1a1a1a]/15 py-3 font-sans text-[15px] text-[#1a1a1a] placeholder-[#1a1a1a]/20 focus:outline-none focus:border-[#c9a54a] transition-colors resize-none"
          placeholder={`Your ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          className="w-full bg-transparent border-b border-[#1a1a1a]/15 py-3 font-sans text-[15px] text-[#1a1a1a] placeholder-[#1a1a1a]/20 focus:outline-none focus:border-[#c9a54a] transition-colors"
          placeholder={`Your ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

type FormType = "clients" | "landowners";

function ContactInner() {
  const [activeForm, setActiveForm] = useState<FormType>("clients");
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const isLoaded = useIsLoaded();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const clipPercent = useTransform(scrollY, [0, 600], [7.5, 0]);

  useEffect(() => {
    if (searchParams.get("tab") === "landowners") {
      setActiveForm("landowners");
    }
  }, [searchParams]);

  useEffect(() => {
    const unsub = clipPercent.on("change", (v) => {
      if (imageRef.current) {
        imageRef.current.style.clipPath = `inset(0 ${v}%)`;
      }
    });
    return () => { unsub(); };
  }, [clipPercent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="bg-[#faf9f6]">
      <Nav />

      {/* ── HERO ── */}
      <section className="bg-[#faf9f6] pt-[140px]" aria-label="Contact hero">
        {/* Headline */}
        <div className="px-[7.5%] pt-6 sm:pt-10 pb-6 sm:pb-8">
          <AnimatedHeading
            as="h1"
            text="Contact"
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
                src="/projectimages/amanat/rooftop-01.jpg"
                alt="Amanat rooftop by Arden Holdings"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="bg-[#faf9f6] py-16 sm:py-24 lg:py-32">
        <div className="px-[7.5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — description + tabs */}
            <FadeIn>
              {/* Tab switcher */}
              <div className="flex gap-0 mb-12 border-b border-[#1a1a1a]/[0.08]">
                {(["clients", "landowners"] as FormType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveForm(tab)}
                    className={`font-sans text-[12px] tracking-[0.24em] uppercase pb-4 pr-8 transition-all duration-300 border-b-2 -mb-px ${
                      activeForm === tab
                        ? "text-[#1a1a1a] border-[#c9a54a]"
                        : "text-[#1a1a1a]/35 border-transparent hover:text-[#1a1a1a]/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeForm === "clients" ? (
                <div>
                  <h2
                    className="font-serif text-[#1a1a1a] mb-5"
                    style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 400 }}
                  >
                    Clients
                  </h2>
                  <p className="font-sans text-[#1a1a1a]/45 leading-[2] mb-0" style={{ fontSize: "16px", maxWidth: "420px" }}>
                    Discover exquisite apartments, commercial spaces, and investment opportunities with Arden Holdings Ltd. Let us turn your dreams into a reality.
                  </p>
                </div>
              ) : (
                <div>
                  <h2
                    className="font-serif text-[#1a1a1a] mb-5"
                    style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 400 }}
                  >
                    Landowners
                  </h2>
                  <p className="font-sans text-[#1a1a1a]/45 leading-[2]" style={{ fontSize: "16px", maxWidth: "420px" }}>
                    Share your land with Arden Holdings and be part of the architectural splendor. Fill out the form to explore this partnership and help shape Dhaka&apos;s skyline.
                  </p>
                </div>
              )}
            </FadeIn>

            {/* Right — form */}
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <InputField label="First Name" />
                  <InputField label="Last Name" />
                </div>
                <InputField label="Email" type="email" />
                <InputField label="Phone" type="tel" />
                {activeForm === "landowners" && (
                  <InputField label="Land Location" />
                )}
                <InputField label="Message" textarea />

                {submitted ? (
                  <div className="flex items-center gap-3 py-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a54a]" />
                    <span className="font-sans text-[13px] tracking-[0.18em] uppercase text-[#1a1a1a]/50">
                      Message received — we&apos;ll be in touch soon.
                    </span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 font-sans text-[12px] tracking-[0.26em] uppercase bg-[#1a1a1a] text-white px-10 py-4 hover:bg-[#c9a54a] transition-colors duration-400"
                  >
                    Submit
                    <ArrowUpRight size={13} />
                  </button>
                )}
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO ── */}
      <section style={{ backgroundColor: "#f0ede6" }} className="py-16 sm:py-24">
        <div className="px-[7.5%]">
          <FadeIn className="mb-12 sm:mb-16">
            <p className="font-sans text-[#c9a54a] mb-2" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
              Get In Touch
            </p>
            <h2
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            >
              We&apos;d love to hear from you.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <FadeIn delay={0.05}>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[#c9a54a]/30">
                  <Phone size={14} className="text-[#c9a54a]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-[11px] tracking-[0.26em] uppercase text-[#1a1a1a]/40 mb-2">Phone</p>
                  <a href="tel:+8801615759822" className="font-serif text-[#1a1a1a] hover:text-[#c9a54a] transition-colors" style={{ fontSize: "1.3rem" }}>
                    +88 016 1575 9822
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[#c9a54a]/30">
                  <Mail size={14} className="text-[#c9a54a]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-[11px] tracking-[0.26em] uppercase text-[#1a1a1a]/40 mb-2">Email</p>
                  <a
                    href="mailto:inquiries@ardengroup.com"
                    className="font-serif text-[#1a1a1a] hover:text-[#c9a54a] transition-colors break-all"
                    style={{ fontSize: "1.1rem" }}
                  >
                    inquiries@ardengroup.com
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[#c9a54a]/30">
                  <MapPin size={14} className="text-[#c9a54a]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-[11px] tracking-[0.26em] uppercase text-[#1a1a1a]/40 mb-2">Address</p>
                  <p className="font-serif text-[#1a1a1a]" style={{ fontSize: "1.1rem", lineHeight: 1.5 }}>
                    House 40 (2nd Floor), Road 20,<br />
                    Mohakhali DOHS, Dhaka-1206
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="w-full pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="px-[7.5%]">
          <FadeIn className="mb-8 sm:mb-12">
            <p className="font-sans text-[#c9a54a] mb-3" style={{ fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase" }}>
              Our Office
            </p>
            <AnimatedHeading
              as="h2"
              text="Come visit us"
              trigger="view"
              className="font-serif text-[#1a1a1a]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
            />
          </FadeIn>
          <div className="w-full" style={{ height: "clamp(280px, 40vw, 520px)" }}>
            <iframe
              src="https://www.google.com/maps?q=House%2040%20Road%2020%20Mohakhali%20DOHS%20Dhaka%201206&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Arden Holdings Ltd. — House 40, Road 20, Mohakhali DOHS, Dhaka-1206"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactInner />
    </Suspense>
  );
}
