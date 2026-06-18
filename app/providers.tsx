"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LoadContext } from "./context/LoadContext";
import LoadingScreen from "./components/LoadingScreen";


export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isLoaded, setIsLoaded] = useState(!isHomePage);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <LoadContext.Provider value={{ isLoaded }}>
      {isHomePage && !isLoaded && (
        <LoadingScreen onComplete={() => setIsLoaded(true)} />
      )}
      {children}
    </LoadContext.Provider>
  );
}
