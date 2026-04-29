"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ children, delay = 0, y = 32, once = true, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function MaskWords({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="mask-reveal" aria-hidden>
          <motion.span
            initial={reduce ? false : { y: "110%" }}
            animate={reduce ? undefined : { y: "0%" }}
            transition={{ duration: 0.95, ease: [0.19, 1, 0.22, 1], delay: 0.05 * i }}
            style={{ display: "inline-block" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
