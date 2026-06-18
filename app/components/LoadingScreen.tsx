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
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = imagesToPreload.length || 1;
    const startTime = Date.now();

    const tick = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDuration - elapsed);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setDone(true), 300);
      }, remaining);
    };

    if (imagesToPreload.length === 0) {
      // No images to preload — just wait minimum duration
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setDone(true), 300);
      }, minimumDuration);
      return;
    }

    let completed = 0;
    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        completed++;
        tick();
        if (completed >= total) finish();
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src="/logo.png"
              alt="Arden Holdings"
              width={160}
              height={40}
              className="h-[32px] w-auto mb-10 brightness-0 invert"
              priority
            />
          </motion.div>

          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative"
          >
            <div className="w-10 h-10 relative">
              <div
                className="absolute inset-0 rounded-full border border-white/[0.1]"
              />
              <div
                className="absolute inset-0 rounded-full border border-transparent border-t-[#c9a54a] animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
          </motion.div>

          {/* Progress text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="font-sans text-white/25 mt-8"
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
