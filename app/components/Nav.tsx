"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";

// Inline social glyphs — the installed lucide-react is old and does not ship brand icons.
type IconProps = { size?: number; className?: string };

const FacebookIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3.1h-3V8.4c0-.9.3-1.5 1.5-1.5H16.7V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.4H7.6v3.1h2.7V21h3.2z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3v-11zm7 0h3.8v1.5h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v5.46h-4v-4.84c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57v4.92h-4v-11z" />
  </svg>
);

const SOCIALS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61567335483561", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/arden_holdings_ltd/",         Icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/116103933/",           Icon: LinkedinIcon },
];
import { useIsLoaded } from "../context/LoadContext";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Arden", href: "/about" },
  { label: "Projects", href: "/projects" },
  {
    label: "Consortium",
    children: [
      { label: "Alliance-Arden Consortium", href: "/consortium/alliance-arden" },
      { label: "Trilliant-Arden Consortium", href: "/consortium/trilliant-arden" },
    ],
  },
  { label: "News & Events", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ transparent = false }: { transparent?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const isLoaded = useIsLoaded();

  useEffect(() => {
    if (!menuOpen) return;
    const activeParent = NAV_LINKS.find(
      (l) => l.children && l.children.some((c) => pathname.startsWith(c.href))
    );
    if (activeParent) setExpanded(activeParent.label);
  }, [menuOpen, pathname]);

  // Appear only after the global load gate opens
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
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

  // Transparent-over-hero mode: only while the requested page opts in AND user hasn't scrolled past the hero
  // Transparency depends only on the page's own state (transparent prop + scroll
  // position). Opening the menu should not flip the nav to opaque — the menu
  // panel has its own background and sits above the nav.
  const isTransparent = transparent && !scrolled;

  return (
    <>
      <motion.nav
        initial={{ y: "-100%", opacity: 0 }}
        animate={visible ? { y: hidden && !menuOpen ? "-100%" : 0, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-[28px] left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : scrolled
              ? "bg-[#faf9f6] shadow-[0_1px_0_rgba(26,26,26,0.08)]"
              : "bg-[#faf9f6] border-b border-[#1a1a1a]/[0.07]"
        }`}
      >
        <div className="mx-auto flex items-center" style={{ paddingTop: "18px", paddingBottom: "18px", paddingLeft: "7.5%", paddingRight: "7.5%" }}>
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Arden Holdings"
              width={240}
              height={60}
              className={`h-[32px] sm:h-[40px] md:h-[44px] w-auto transition-[filter] duration-300 ${
                isTransparent ? "brightness-0 invert" : ""
              }`}
              priority
            />
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto flex items-center gap-2.5"
            aria-label="Toggle menu"
          >
            <span className={`font-sans text-eyebrow-lg font-semibold uppercase transition-colors duration-300 ${
              isTransparent ? "text-white/85" : "text-[#1a1a1a]"
            }`}>
              Menu
            </span>
            {menuOpen ? (
              <X size={20} strokeWidth={2} className={isTransparent ? "text-white" : "text-[#1a1a1a]"} />
            ) : (
              <Menu size={20} strokeWidth={2} className={isTransparent ? "text-white" : "text-[#1a1a1a]"} />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Slide-in nav panel from the right */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — dim the page, click to close */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/45 cursor-default"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] md:w-[500px] bg-[#111111] text-white flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              {/* Close */}
              <div className="flex justify-end px-8 sm:px-10 pt-8">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
                >
                  <span className="font-sans text-eyebrow uppercase">Close</span>
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 flex flex-col justify-center px-8 sm:px-10">
                <ul>
                  {NAV_LINKS.map((link, i) => {
                    const isGroup = !!link.children;
                    const active = !isGroup && pathname === link.href;
                    const groupActive = isGroup && link.children!.some((c) => pathname.startsWith(c.href));
                    const isExpanded = expanded === link.label;
                    return (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {isGroup ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setExpanded(isExpanded ? null : link.label)}
                              aria-expanded={isExpanded}
                              className={`group w-full flex items-center justify-between py-4 border-b border-white/10 transition-colors ${
                                groupActive ? "text-[#c9a54a]" : "text-white hover:text-[#c9a54a]"
                              }`}
                            >
                              <span
                                className="font-sans text-left"
                                style={{ fontSize: "clamp(1.2rem, 1.9vw, 1.55rem)", fontWeight: 500, letterSpacing: "0.01em" }}
                              >
                                {link.label}
                              </span>
                              <ChevronDown
                                size={20}
                                strokeWidth={1.5}
                                className={`text-white/30 group-hover:text-[#c9a54a] transition-all duration-300 ${
                                  isExpanded ? "rotate-180 text-[#c9a54a]" : ""
                                }`}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                  className="overflow-hidden"
                                >
                                  {link.children!.map((child) => {
                                    const childActive = pathname === child.href;
                                    return (
                                      <li key={child.href}>
                                        <Link
                                          href={child.href}
                                          onClick={() => setMenuOpen(false)}
                                          className={`group flex items-center justify-between py-3 pl-4 border-b border-white/5 transition-colors ${
                                            childActive ? "text-[#c9a54a]" : "text-white/75 hover:text-[#c9a54a]"
                                          }`}
                                        >
                                          <span
                                            className="font-sans"
                                            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", fontWeight: 400, letterSpacing: "0.01em" }}
                                          >
                                            {child.label}
                                          </span>
                                          <ChevronRight
                                            size={16}
                                            strokeWidth={1.5}
                                            className="text-white/25 group-hover:text-[#c9a54a] group-hover:translate-x-1 transition-all duration-300"
                                          />
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={link.href!}
                            onClick={() => setMenuOpen(false)}
                            className={`group flex items-center justify-between py-4 border-b border-white/10 transition-colors ${
                              active ? "text-[#c9a54a]" : "text-white hover:text-[#c9a54a]"
                            }`}
                          >
                            <span
                              className="font-sans"
                              style={{ fontSize: "clamp(1.2rem, 1.9vw, 1.55rem)", fontWeight: 500, letterSpacing: "0.01em" }}
                            >
                              {link.label}
                            </span>
                            <ChevronRight
                              size={20}
                              strokeWidth={1.5}
                              className="text-white/30 group-hover:text-[#c9a54a] group-hover:translate-x-1 transition-all duration-300"
                            />
                          </Link>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Follow Us */}
              <div className="px-8 sm:px-10 pb-10 pt-6">
                <p className="font-sans text-eyebrow-sm uppercase text-white/40 mb-4">
                  Follow Us
                </p>
                <div className="flex items-center gap-4">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-[#c9a54a] hover:border-[#c9a54a]/50 transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
