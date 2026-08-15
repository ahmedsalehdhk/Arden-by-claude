"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedHeading from "../components/AnimatedHeading";
import { FadeIn, Section, Tag, FilterChip } from "../components/ui";
import { useIsLoaded } from "../context/LoadContext";
import { NEWS, NewsCategory, NewsItem } from "../data/news";

const FILTERS: ("All" | NewsCategory)[] = ["All", "News", "Event"];

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return { day, month, year };
}

function NewsCard({ item }: { item: NewsItem }) {
  const { day, month, year } = formatDate(item.date);
  return (
    <Link href={`/news/${item.slug}`} className="block group">
      <article className="cursor-pointer">
        <div className="relative overflow-hidden mb-6" style={{ aspectRatio: "4/3" }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 ease-arden group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 flex items-end gap-2 text-white">
            <span className="font-serif leading-none" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", fontWeight: 400 }}>
              {day}
            </span>
            <span className="font-sans text-eyebrow-sm mb-1.5 opacity-85 uppercase">
              {month} {year}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <Tag variant="category">{item.category}</Tag>
          </div>
        </div>

        <h3 className="font-serif text-h3 text-ink group-hover:text-gold transition-colors duration-300 mb-2">
          {item.title}
        </h3>
        <p className="font-sans text-body-sm text-ink/55">{item.excerpt}</p>
      </article>
    </Link>
  );
}

export default function NewsPage() {
  const [filter, setFilter] = useState<"All" | NewsCategory>("All");
  const isLoaded = useIsLoaded();

  const filtered = useMemo(
    () => (filter === "All" ? NEWS : NEWS.filter((n) => n.category === filter)),
    [filter]
  );

  return (
    <main className="bg-bone">
      <Nav />

      {/* HERO */}
      <Section tone="bone" rhythm="flush" className="pt-nav-offset" innerClassName="pt-6 sm:pt-12 pb-10 sm:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <AnimatedHeading
            as="h1"
            text="News & Events"
            trigger="load"
            active={isLoaded}
            delay={0.4}
            className="font-serif text-ink select-none uppercase text-balance"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              letterSpacing: "0.02em",
              lineHeight: 1.02,
              fontWeight: 400,
              maxWidth: "12ch",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-body text-ink/60 lg:text-right"
          >
            Stay updated with us
          </motion.p>
        </div>
      </Section>

      {/* FILTERS */}
      <Section tone="bone" rhythm="flush" innerClassName="pb-8 sm:pb-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {FILTERS.map((f) => (
            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f}
            </FilterChip>
          ))}
        </div>
      </Section>

      {/* GRID */}
      <Section tone="bone" rhythm="flush" innerClassName="pb-20 sm:pb-28">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="font-sans text-ink/30 text-sm tracking-wide">Nothing to show yet.</p>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {filtered.map((item, i) => (
                <FadeIn key={item.slug} delay={i * 0.05}>
                  <NewsCard item={item} />
                </FadeIn>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      <Footer />
    </main>
  );
}
