"use client";

import { useRef, Fragment } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedHeadingProps {
  as?: "h1" | "h2";
  text: string;
  trigger?: "load" | "view";
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delay?: number;
  boldFromWord?: number;
}

export default function AnimatedHeading({
  as = "h2",
  text,
  trigger = "view",
  active = true,
  className = "",
  style,
  stagger = 0.06,
  delay = 0,
  boldFromWord,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldAnimate = trigger === "load" ? active : inView;
  const words = text.split(/\s+/).filter(Boolean);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word: string, i: number) => {
        const isBold = boldFromWord !== undefined && i >= boldFromWord;
        return (
          <Fragment key={i}>
            <motion.span
              initial={{ y: 26, opacity: 0 }}
              animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.75,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
              style={isBold ? { fontWeight: 700 } : undefined}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
