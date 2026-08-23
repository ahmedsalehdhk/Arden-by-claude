"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import AnimatedHeading from "./AnimatedHeading";

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
  showHeading?: boolean;
}

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 60;

export default function ProjectGallery({ images, projectName, showHeading = true }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-20%" });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const slideWidth = isMobile ? "min(94vw, 560px)" : "min(60vw, 900px)";
  const containerHeight = isMobile ? "min(94vw, 560px)" : "min(62vw, 640px)";
  const offsetVw = isMobile ? 96 : 62;

  const count = images.length;
  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  const goNext = useCallback(() => setIndex((i) => wrap(i + 1)), [wrap]);
  const goPrev = useCallback(() => setIndex((i) => wrap(i - 1)), [wrap]);

  // Autoplay — pause on hover, lightbox, or when out of view
  useEffect(() => {
    if (!inView || hovering || lightboxOpen || count < 2) return;
    const t = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [inView, hovering, lightboxOpen, count, goNext]);

  // Keyboard nav — inline when in view, always when lightbox open
  useEffect(() => {
    if (!inView && !lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape" && lightboxOpen) setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, lightboxOpen, goNext, goPrev]);

  // Lock body scroll while lightbox open
  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  const slides = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        alt: `${projectName} — image ${i + 1}`,
      })),
    [images, projectName]
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "#faf9f6" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {showHeading && (
        <div className="text-center mb-12 sm:mb-16">
          <AnimatedHeading
            as="h2"
            text="Gallery"
            trigger="view"
            className="font-serif text-[#1a1a1a]"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}
          />
        </div>
      )}

      {/* Carousel */}
      <div
        className="relative w-full select-none"
        style={{ height: containerHeight }}
      >
        {slides.map((slide, i) => {
          // Position each slide as a card centered horizontally, offset by (i - index)
          const offset = i - index;
          // Bring adjacent slides closer to center to peek
          const isCenter = offset === 0;
          const isNeighbor = Math.abs(offset) === 1 || Math.abs(offset) === count - 1;

          // Normalize the wrap-around neighbors so previous/next always show even at boundaries.
          // Guard on count > 1 so a lone slide (offset 0, count-1 0) is not pushed to the left.
          let visualOffset = offset;
          if (count > 1 && offset === count - 1) visualOffset = -1;
          else if (count > 1 && offset === -(count - 1)) visualOffset = 1;

          const isVisible = Math.abs(visualOffset) <= 1;

          return (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2"
              initial={false}
              animate={{
                x: `calc(-50% + ${visualOffset * offsetVw}vw)`,
                scale: isCenter ? 1 : 0.92,
                opacity: isVisible ? 1 : 0,
                zIndex: isCenter ? 2 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: slideWidth,
                height: "100%",
                pointerEvents: isVisible ? "auto" : "none",
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (isCenter) setLightboxOpen(true);
                else if (isNeighbor) setIndex(wrap(i));
              }}
            >
              <div
                className="relative w-full h-full overflow-hidden"
                style={{ cursor: isCenter ? "zoom-in" : "pointer" }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 639px) 94vw, (max-width: 900px) 60vw, 900px"
                  draggable={false}
                  priority={i === 0}
                />
                {!isCenter && (
                  <div className="absolute inset-0 bg-[#1a1a1a]/25 transition-colors duration-500 hover:bg-[#1a1a1a]/10" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Controls — hidden when only one image, since nav and counter add no value */}
      {count > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Previous image"
            onClick={goPrev}
            className="w-11 h-11 rounded-full border border-[#1a1a1a]/25 flex items-center justify-center text-[#1a1a1a]/70 hover:border-[#c9a54a] hover:text-[#c9a54a] transition-colors duration-300"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <span
            className="font-sans text-[#1a1a1a]/50 tabular-nums"
            style={{ fontSize: "12px", letterSpacing: "0.28em" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="w-11 h-11 rounded-full border border-[#1a1a1a]/25 flex items-center justify-center text-[#1a1a1a]/70 hover:border-[#c9a54a] hover:text-[#c9a54a] transition-colors duration-300"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-[92vw] h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={slides[index].src}
                alt={slides[index].alt}
                fill
                className="object-contain"
                sizes="92vw"
                priority
              />
            </motion.div>

            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors duration-300"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-white/60 tabular-nums"
              style={{ fontSize: "12px", letterSpacing: "0.28em" }}
            >
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
