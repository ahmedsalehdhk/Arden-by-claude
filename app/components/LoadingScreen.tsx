"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  imagesToPreload?: string[];
  onComplete: () => void;
  minimumDuration?: number;
}

export default function LoadingScreen({
  imagesToPreload = [],
  onComplete,
  minimumDuration = 1800,
}: LoadingScreenProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDuration - elapsed);
      setTimeout(() => setTimeout(() => setDone(true), 300), remaining);
    };

    if (imagesToPreload.length === 0) {
      setTimeout(() => setDone(true), minimumDuration);
      return;
    }

    let completed = 0;
    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        completed++;
        if (completed >= imagesToPreload.length) finish();
      };
      img.src = src;
    });
  }, [imagesToPreload, minimumDuration]);

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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
            style={{ width: 160, height: 40 }}
          >
            {/* Ghost layer — dim, always visible */}
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

            {/* Fill layer — clips from bottom to top */}
            <div
              className="absolute inset-0 overflow-hidden logo-fill"
              style={{ height: "100%" }}
            >
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
