"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";
import { Section, FadeIn } from "./ui";
import type { ProjectDetail } from "../data/projects";

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
    // eslint-disable-next-line no-console
    console.log("[arden] floor-plan subscriber saved", record);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// Bangladeshi mobile numbers: 10 local digits, starting with 1.
function isValidBdMobile(local: string): boolean {
  return /^1\d{9}$/.test(local);
}

export default function FloorPlansSection({ project }: { project: ProjectDetail }) {
  const image = project.floorPlanImage;

  // Gate state. Hydrate from localStorage after mount to avoid SSR mismatch.
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setUnlocked(loadUnlocked());
    setHydrated(true);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  if (!image) return null;
  const isUnlocked = hydrated && unlocked;

  return (
    <Section tone="bone" rhythm="loose">
      <FadeIn>
        <p className="font-sans text-gold mb-3 text-eyebrow-sm uppercase">Floor Plan</p>
        <AnimatedHeading
          as="h2"
          text={`See floor layout of ${project.name}`}
          trigger="view"
          className="font-serif text-ink mb-4"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
        />
        <p className="font-sans text-ink/55 max-w-2xl mb-10 sm:mb-14" style={{ fontSize: "15px" }}>
          {isUnlocked
            ? `A representative layout for a typical residence at ${project.name}.`
            : `A quick look at the typical layout of a residence at ${project.name}. Share your details to view it in full.`}
        </p>
      </FadeIn>

      {/* Floor plan image — blurred while locked, sharp when unlocked. Same image, one file. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-white"
        style={{ aspectRatio: "16/10" }}
      >
        <Image
          src={image}
          alt={`${project.name} floor plan`}
          fill
          className="object-contain transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ filter: isUnlocked ? "none" : "blur(24px)", transform: isUnlocked ? "none" : "scale(1.04)" }}
          loading="lazy"
          sizes="100vw"
        />
        {!isUnlocked && (
          <div className="absolute inset-0 bg-ink/25 flex items-center justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 font-sans uppercase bg-white text-ink px-8 py-4 tracking-[0.24em] text-[12px] hover:bg-gold hover:text-white transition-colors duration-300 shadow-lg"
            >
              View Floor Plan
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modalOpen && !isUnlocked && (
          <UnlockModal
            projectName={project.name}
            onClose={() => setModalOpen(false)}
            onUnlock={() => {
              window.localStorage.setItem(UNLOCK_KEY, "1");
              setUnlocked(true);
              setModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

// ─────────────────────────────────────────────
// MODAL — name + phone capture
// ─────────────────────────────────────────────

function UnlockModal({
  projectName,
  onClose,
  onUnlock,
}: {
  projectName: string;
  onClose: () => void;
  onUnlock: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll while modal is open, and close on Escape.
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
      aria-label={`View floor plan for ${projectName}`}
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
          <p className="font-sans text-gold text-eyebrow-sm uppercase mb-3">Floor Plan</p>
          <h3
            className="font-serif text-ink mb-3"
            style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)", fontWeight: 500 }}
          >
            View {projectName}&apos;s layout
          </h3>
          <p className="font-sans text-ink/55 mb-8" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            Share your details to view the floor plan.
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
              {submitting ? "Unlocking…" : "View Floor Plan"}
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
