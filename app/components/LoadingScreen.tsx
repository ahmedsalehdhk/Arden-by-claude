"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Fill animation: 0.3s delay + 1.6s duration = 1.9s total.
// MINIMUM_MS must equal this so dismissal fires exactly when the fill completes.
const FILL_ANIMATION_MS = 1900;

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Resolves when the browser has finished loading all resources
    const windowLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    // Minimum delay — matches fill animation end exactly
    const minimumDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, FILL_ANIMATION_MS)
    );

    // Dismiss only when BOTH conditions are met
    Promise.all([windowLoaded, minimumDelay]).then(() => setDone(true));
  }, []);

  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
            style={{ width: 160, height: 40 }}
          >
            {/* Ghost layer — dim silhouette */}
            <Image
              src="/logo.png"
              alt=""
              width={160}
              height={40}
              className="absolute inset-0 h-[40px] w-auto brightness-0 invert"
              style={{ opacity: 0.12 }}
              priority
              aria-hidden
            />

            {/* Fill layer — reveals from bottom to top */}
            <div className="absolute inset-0 overflow-hidden logo-fill">
              <Image
                src="/logo.png"
                alt="Arden Holdings"
                width={160}
                height={40}
                className="h-[40px] w-auto brightness-0 invert"
                priority
              />
            </div>
          </motion.div>

          <style>{`
            @keyframes logoFill {
              from { clip-path: inset(100% 0 0 0); }
              to   { clip-path: inset(0% 0 0 0); }
            }
            .logo-fill {
              animation: logoFill 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
