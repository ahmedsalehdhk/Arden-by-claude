"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence retained for internal plan-switching animation
import { Lock, ArrowRight, BedDouble, Ruler } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";
import { Section, FadeIn } from "./ui";
import type { ProjectDetail, FloorPlan } from "../data/projects";

// localStorage keys — one flag per site (unlock once, see everywhere).
const UNLOCK_KEY = "arden.floorplans.unlocked";
const SUBSCRIBERS_KEY = "arden.floorplans.subscribers";

function loadUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(UNLOCK_KEY) === "1";
}

function saveSubscriber(entry: { name: string; email: string; project: string }) {
  try {
    const raw = window.localStorage.getItem(SUBSCRIBERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...entry, at: new Date().toISOString() });
    window.localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
    // Also log so it's easy to inspect during development.
    // eslint-disable-next-line no-console
    console.log("[arden] new floor-plan subscriber", entry);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export default function FloorPlansSection({ project }: { project: ProjectDetail }) {
  const plans = project.floorPlans ?? [];

  // Gate state. Hydrate from localStorage after mount to avoid SSR mismatch.
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setUnlocked(loadUnlocked());
    setHydrated(true);
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Which plan is being viewed
  const [activePlan, setActivePlan] = useState(0);

  if (plans.length === 0) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please share your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    saveSubscriber({ name: name.trim(), email: email.trim(), project: project.name });
    // Small delay for a considered feel; not doing real network work.
    setTimeout(() => {
      window.localStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
      setSubmitting(false);
    }, 500);
  };

  return (
    <Section tone="bone" rhythm="loose">
      <FadeIn>
        <p className="font-sans text-gold mb-3 text-eyebrow-sm uppercase">Floor Plans</p>
        <AnimatedHeading
          as="h2"
          text="See the layout of your home"
          trigger="view"
          className="font-serif text-ink mb-4"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
        <p className="font-sans text-ink/55 max-w-2xl mb-10 sm:mb-14" style={{ fontSize: "15px" }}>
          {unlocked && hydrated
            ? `Detailed layouts for every residence at ${project.name}. Each type is designed for light, flow, and privacy.`
            : `Enter your details to view detailed floor plans for every residence at ${project.name}.`}
        </p>
      </FadeIn>

      {/* Toggle between gate and unlocked. SSR always renders the gate; on hydration
          the client swaps to the unlocked view if localStorage says so. */}
      {hydrated && unlocked ? (
        <UnlockedView
          plans={plans}
          activePlan={activePlan}
          setActivePlan={setActivePlan}
          projectName={project.name}
        />
      ) : (
        <GateView
          name={name}
          email={email}
          error={error}
          submitting={submitting}
          setName={setName}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          previewImage={plans[0].image}
        />
      )}
    </Section>
  );
}

// ─────────────────────────────────────────────
// GATE (form)
// ─────────────────────────────────────────────

function GateView({
  name,
  email,
  error,
  submitting,
  setName,
  setEmail,
  onSubmit,
  previewImage,
}: {
  name: string;
  email: string;
  error: string | null;
  submitting: boolean;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  previewImage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-stretch"
    >
      {/* Blurred preview so people can see what they'll unlock */}
      <div className="relative overflow-hidden bg-ink/5" style={{ aspectRatio: "4/3" }}>
        <Image
          src={previewImage}
          alt="Floor plan preview"
          fill
          className="object-cover"
          style={{ filter: "blur(24px)", transform: "scale(1.05)" }}
          loading="lazy"
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
        <div className="absolute inset-0 bg-ink/25 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center">
            <Lock size={22} strokeWidth={1.5} className="text-ink" />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col justify-center max-w-md">
        <label className="block mb-6">
          <span className="font-sans text-gold uppercase text-eyebrow-sm block mb-2">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-transparent border-b border-ink/25 py-3 font-sans text-ink placeholder-ink/40 focus:outline-none focus:border-gold transition-colors"
            style={{ fontSize: "15px" }}
            autoComplete="name"
          />
        </label>

        <label className="block mb-6">
          <span className="font-sans text-gold uppercase text-eyebrow-sm block mb-2">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent border-b border-ink/25 py-3 font-sans text-ink placeholder-ink/40 focus:outline-none focus:border-gold transition-colors"
            style={{ fontSize: "15px" }}
            autoComplete="email"
          />
        </label>

        {error && (
          <p className="font-sans text-[13px] text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-3 self-start font-sans uppercase bg-ink text-white px-8 py-4 mt-2 tracking-[0.24em] text-[12px] hover:bg-gold transition-colors duration-300 disabled:opacity-60"
        >
          {submitting ? "Unlocking…" : "View Floor Plans"}
          <ArrowRight size={14} />
        </button>

        <p className="font-sans text-ink/40 mt-6" style={{ fontSize: "12px", lineHeight: 1.6 }}>
          We&apos;ll add you to our newsletter for project updates. Unsubscribe anytime.
        </p>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// UNLOCKED (viewer)
// ─────────────────────────────────────────────

function UnlockedView({
  plans,
  activePlan,
  setActivePlan,
  projectName,
}: {
  plans: FloorPlan[];
  activePlan: number;
  setActivePlan: (i: number) => void;
  projectName: string;
}) {
  const plan = plans[activePlan];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Type selector */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
        {plans.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setActivePlan(i)}
            className={`font-sans px-5 sm:px-6 py-2 rounded-full text-[13px] transition-all duration-300 ${
              i === activePlan ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Plan viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] gap-10 lg:gap-16 items-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={plan.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden bg-ink/5"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={plan.image}
              alt={`${projectName} ${plan.label} floor plan`}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col justify-center">
          <p className="font-sans text-gold uppercase text-eyebrow-sm mb-3">{projectName}</p>
          <h3
            className="font-serif text-ink mb-6"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)", fontWeight: 500 }}
          >
            {plan.label}
          </h3>

          <div className="flex items-center gap-8 border-t border-b border-ink/10 py-5 mb-6">
            <div className="flex items-center gap-3">
              <Ruler size={18} strokeWidth={1.5} className="text-ink/60" />
              <span className="font-sans text-ink" style={{ fontSize: "15px" }}>{plan.sizeSft}</span>
            </div>
            <div className="flex items-center gap-3">
              <BedDouble size={18} strokeWidth={1.5} className="text-ink/60" />
              <span className="font-sans text-ink" style={{ fontSize: "15px" }}>
                {plan.bedrooms} Bedrooms
              </span>
            </div>
          </div>

          <p className="font-sans text-ink/55" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            A representative layout — the sales team can share the fully dimensioned drawing on request.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
