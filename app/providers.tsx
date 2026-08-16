"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LoadContext } from "./context/LoadContext";
import LoadingScreen from "./components/LoadingScreen";


export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isLoaded, setIsLoaded] = useState(!isHomePage);

  const lenisRef = useRef<Lenis | null>(null);
  // popstate fires on browser back/forward. When it does, we skip the auto
  // scroll-to-top so the previous scroll position can be preserved.
  const isPopNavRef = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);
    const onPopState = () => { isPopNavRef.current = true; };
    window.addEventListener("popstate", onPopState);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("popstate", onPopState);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on every forward navigation. Back/forward (popstate) is
  // skipped so the browser's saved scroll position wins.
  useEffect(() => {
    if (isPopNavRef.current) {
      isPopNavRef.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <LoadContext.Provider value={{ isLoaded }}>
      {isHomePage && !isLoaded && (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      )}
      {children}
    </LoadContext.Provider>
  );
}
