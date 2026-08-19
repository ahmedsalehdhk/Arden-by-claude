"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";
import { Section, FadeIn } from "./ui";
import type { ProjectDetail, FloorPlan } from "../../lib/projects";

// localStorage keys — one flag per site (unlock once, see everywhere).
const UNLOCK_KEY = "arden.floorplans.unlocked";
const SUBSCRIBERS_KEY = "arden.floorplans.subscribers";

interface Subscriber {
  name: string;
  phone: string;   // stored WITHOUT the +880 prefix (10 local digits)
  project: string;
  at: string;      // ISO timestamp
}

function loadUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(UNLOCK_KEY) === "1";
}

// Update-on-duplicate: same phone from same browser overwrites the previous record.
function saveSubscriber(entry: Omit<Subscriber, "at">) {
  try {
    const raw = window.localStorage.getItem(SUBSCRIBERS_KEY);
    const list: Subscriber[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((s) => s.phone === entry.phone);
    const record: Subscriber = { ...entry, at: new Date().toISOString() };
    if (idx >= 0) list[idx] = record;
    else list.push(record);
    window.localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// Fire-and-forget POST to the backend so the admin sees this lead.
// Never blocks the unlock UX: any error is swallowed with a console log.
function reportLeadToServer(projectSlug: string, name: string, phone: string) {
  fetch("/api/floorplan-leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectSlug, name, phone }),
    keepalive: true,
  }).catch((e) => {
    // eslint-disable-next-line no-console
    console.warn("[arden] floor-plan lead report failed", e);
  });
}

// Bangladeshi mobile numbers: 10 local digits, starting with 1.
function isValidBdMobile(local: string): boolean {
  return /^1\d{9}$/.test(local);
}

export default function FloorPlansSection({ project }: { project: ProjectDetail }) {
  // Data is authored bottom-to-top (basement → roof). Display top-to-bottom so the
  // strip mirrors an actual building — roof at the top, basement at the bottom.
  const plans = (project.floorPlans ?? []).slice().reverse();

  // Gate state. Hydrate from localStorage after mount to avoid SSR mismatch.
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setUnlocked(loadUnlocked());
    setHydrated(true);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Default to Ground Floor if present; otherwise the bottom-most floor in the display.
  const initialIndex = (() => {
    const groundIdx = plans.findIndex((p) => /^ground\b/i.test(p.fullLabel));
    if (groundIdx >= 0) return groundIdx;
    return plans.length - 1;
  })();
  const [activePlan, setActivePlan] = useState(initialIndex);

  if (plans.length === 0) return null;
  const activePlanData = plans[activePlan] ?? plans[0];
  const isUnlocked = hydrated && unlocked;

  return (
    <Section tone="bone" rhythm="loose">
      <FadeIn>
        <AnimatedHeading
          as="h2"
          text={`See floor layout of ${project.name}`}
          trigger="view"
          className="font-serif text-ink mb-4"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
        <p className="font-sans text-body text-ink/55 max-w-2xl mb-10 sm:mb-14">
          {isUnlocked
            ? `Every floor at ${project.name} — pick a level from the strip to view its layout.`
            : `A quick look at every floor of ${project.name}. Share your details to view them in full.`}
        </p>
      </FadeIn>

      {/* Locked: single blurred preview with a centered CTA */}
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-white"
          style={{ aspectRatio: "16/10" }}
        >
          <Image
            src={plans[0].image}
            alt={`${project.name} floor plan`}
            fill
            className="object-contain"
            style={{ filter: "blur(24px)", transform: "scale(1.04)" }}
            loading="lazy"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/25 flex items-center justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 font-sans uppercase bg-white text-ink px-8 py-4 tracking-[0.24em] text-[12px] hover:bg-gold hover:text-white transition-colors duration-300 shadow-lg"
            >
              View Floor Plans
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Unlocked: elevator strip on the left, active plan on the right */}
      {isUnlocked && (
        <FloorPlanViewer
          plans={plans}
          activeIndex={activePlan}
          setActiveIndex={setActivePlan}
          projectName={project.name}
          activePlanData={activePlanData}
          onOpenLightbox={() => setLightboxOpen(true)}
        />
      )}

      <AnimatePresence>
        {modalOpen && !isUnlocked && (
          <UnlockModal
            projectName={project.name}
            projectSlug={project.slug}
            onClose={() => setModalOpen(false)}
            onUnlock={() => {
              window.localStorage.setItem(UNLOCK_KEY, "1");
              setUnlocked(true);
              setModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && isUnlocked && (
          <FloorPlanLightbox
            plans={plans}
            activeIndex={activePlan}
            setActiveIndex={setActivePlan}
            projectName={project.name}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

// ─────────────────────────────────────────────
// UNLOCKED VIEWER — elevator strip + plan
// ─────────────────────────────────────────────

function FloorPlanViewer({
  plans,
  activeIndex,
  setActiveIndex,
  projectName,
  activePlanData,
  onOpenLightbox,
}: {
  plans: FloorPlan[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  projectName: string;
  activePlanData: FloorPlan;
  onOpenLightbox: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)] gap-6 lg:gap-10 items-stretch">
      {/* Elevator strip — vertical on desktop, horizontal-scroll on mobile */}
      <ul
        className="flex lg:flex-col gap-1 lg:gap-0 overflow-x-auto lg:overflow-visible lg:border-l lg:border-ink/10 shrink-0"
        role="tablist"
        aria-label={`${projectName} floors`}
      >
        {plans.map((plan, i) => {
          const active = i === activeIndex;
          return (
            <li key={plan.label} className="lg:relative">
              <button
                role="tab"
                aria-selected={active}
                onClick={() => setActiveIndex(i)}
                className={`group relative w-full flex flex-col items-center justify-center px-5 lg:px-6 py-4 lg:py-5 min-w-[74px] lg:min-w-[96px] font-sans transition-colors duration-300 ${
                  active
                    ? "text-gold"
                    : "text-ink/45 hover:text-ink"
                }`}
              >
                <span
                  className="uppercase leading-none"
                  style={{
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                    letterSpacing: "0.14em",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {plan.label}
                </span>
                {/* Active indicator — gold line on the left (desktop) or bottom (mobile) */}
                <span
                  aria-hidden="true"
                  className={`absolute transition-all duration-300 bg-gold ${
                    active
                      ? "lg:left-[-1px] lg:top-2 lg:bottom-2 lg:w-[3px] lg:h-auto left-3 right-3 bottom-0 h-[2px] w-auto"
                      : "opacity-0"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Plan viewer — click to expand full-screen */}
      <div>
        <button
          type="button"
          onClick={onOpenLightbox}
          aria-label={`Expand ${activePlanData.fullLabel} floor plan`}
          className="group relative block w-full overflow-hidden bg-white"
          style={{ aspectRatio: "16/10", cursor: "zoom-in" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlanData.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activePlanData.image}
                alt={`${projectName} ${activePlanData.fullLabel}`}
                fill
                className="object-contain"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>
          {/* Expand affordance — appears on hover */}
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-ink/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Maximize2 size={16} strokeWidth={1.75} />
          </div>
        </button>

        <div className="flex items-baseline justify-between mt-5">
          <p className="font-serif text-ink" style={{ fontSize: "clamp(17px, 1.6vw, 22px)", fontWeight: 500 }}>
            {activePlanData.fullLabel}
          </p>
          <p className="font-sans text-ink/40 uppercase" style={{ fontSize: "12px", letterSpacing: "0.24em" }}>
            {activeIndex + 1} / {plans.length}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIGHTBOX — full-screen floor plan viewer
// ─────────────────────────────────────────────

function FloorPlanLightbox({
  plans,
  activeIndex,
  setActiveIndex,
  projectName,
  onClose,
}: {
  plans: FloorPlan[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  projectName: string;
  onClose: () => void;
}) {
  const count = plans.length;
  const wrap = (i: number) => ((i % count) + count) % count;
  const goNext = () => setActiveIndex(wrap(activeIndex + 1));
  const goPrev = () => setActiveIndex(wrap(activeIndex - 1));

  const active = plans[activeIndex];

  // Lock body scroll + arrow key nav + Esc to close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, count]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} floor plans — full view`}
    >
      {/* Close */}
      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
      >
        <X size={18} strokeWidth={1.5} />
      </button>

      {/* Prev */}
      {count > 1 && (
        <button
          type="button"
          aria-label="Previous floor"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 sm:left-8 w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
      )}

      {/* Plan */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-[92vw] h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={active.image}
          alt={`${projectName} ${active.fullLabel}`}
          fill
          className="object-contain"
          sizes="92vw"
          priority
        />
      </motion.div>

      {/* Next */}
      {count > 1 && (
        <button
          type="button"
          aria-label="Next floor"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 sm:right-8 w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      )}

      {/* Caption */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="font-serif text-white" style={{ fontSize: "17px", fontWeight: 500 }}>
          {active.fullLabel}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MODAL — name + phone capture
// ─────────────────────────────────────────────

function UnlockModal({
  projectName,
  projectSlug,
  onClose,
  onUnlock,
}: {
  projectName: string;
  projectSlug: string;
  onClose: () => void;
  onUnlock: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanName) {
      setError("Please share your name.");
      return;
    }
    if (!isValidBdMobile(cleanPhone)) {
      setError("Please enter a valid Bangladeshi mobile number (10 digits, starting with 1).");
      return;
    }

    setSubmitting(true);
    saveSubscriber({ name: cleanName, phone: cleanPhone, project: projectName });
    // Fire-and-forget: the API normalizes the phone to 11-digit "01…" format on the server side.
    reportLeadToServer(projectSlug, cleanName, cleanPhone);
    setTimeout(() => {
      setSubmitting(false);
      onUnlock();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`View floor plans for ${projectName}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg bg-bone shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="p-8 sm:p-10">
          <p className="font-sans text-gold text-eyebrow-sm uppercase mb-3">Floor Plans</p>
          <h3
            className="font-serif text-ink mb-3"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)", fontWeight: 500 }}
          >
            View {projectName}&apos;s layout
          </h3>
          <p className="font-sans text-ink/55 mb-8" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            Share your details to view every floor of {projectName}.
          </p>

          <form onSubmit={handleSubmit}>
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
                autoFocus
              />
            </label>

            <label className="block mb-6">
              <span className="font-sans text-gold uppercase text-eyebrow-sm block mb-2">Phone</span>
              <div className="flex items-center border-b border-ink/25 focus-within:border-gold transition-colors">
                <span
                  className="font-sans text-ink/70 pr-2 py-3 border-r border-ink/15 mr-3 select-none"
                  style={{ fontSize: "15px" }}
                >
                  +880
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="1XXXXXXXXX"
                  className="w-full bg-transparent py-3 font-sans text-ink placeholder-ink/40 focus:outline-none"
                  style={{ fontSize: "15px", letterSpacing: "0.02em" }}
                  autoComplete="tel-national"
                  maxLength={10}
                />
              </div>
            </label>

            {error && (
              <p className="font-sans text-[13px] text-red-600 mb-4" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-3 font-sans uppercase bg-ink text-white px-8 py-4 tracking-[0.24em] text-[12px] hover:bg-gold transition-colors duration-300 disabled:opacity-60 w-full sm:w-auto"
            >
              {submitting ? "Unlocking…" : "View Floor Plans"}
              <ArrowRight size={14} />
            </button>

            <p className="font-sans text-ink/40 mt-6" style={{ fontSize: "12px", lineHeight: 1.6 }}>
              We may contact you about this project. We won&apos;t share your number.
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
