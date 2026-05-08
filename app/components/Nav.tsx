"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Arden", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Entrance animation — slide down after hero loads
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      // Hide on scroll down, show on scroll up (only after passing 90px nav height)
      if (y > 90) {
        setHidden(y > lastY);
      } else {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={visible ? { y: hidden && !menuOpen ? -100 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 bg-[#faf9f6] transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_1px_0_rgba(26,26,26,0.08)]"
            : "border-b border-[#1a1a1a]/[0.07]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 h-[90px] flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Arden Holdings"
              width={180}
              height={45}
              className="h-[38px] w-auto"
              priority
            />
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto flex items-center gap-2.5"
            aria-label="Toggle menu"
          >
            <span className="font-sans text-[14px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a]/50">
              Menu
            </span>
            {menuOpen ? (
              <X size={15} strokeWidth={1.5} className="text-[#1a1a1a]" />
            ) : (
              <Menu size={15} strokeWidth={1.5} className="text-[#1a1a1a]" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#faf9f6] flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-[28px] right-5 sm:right-8 flex items-center gap-2.5"
            >
              <span className="font-sans text-[12px] tracking-[0.2em] uppercase text-[#1a1a1a]/50">
                Close
              </span>
              <X size={15} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </button>
            <ul className="space-y-6 text-center">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-[3rem] sm:text-[4rem] text-[#1a1a1a] hover:text-[#c9a54a] transition-colors tracking-[0.04em] block"
                    style={{ fontWeight: 400 }}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="absolute bottom-10 flex items-center gap-6">
              <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a]/25">
                Mohakhali DOHS, Dhaka
              </span>
              <span className="w-px h-3 bg-[#1a1a1a]/15" />
              <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#1a1a1a]/25">
                +880 2-9882345
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
