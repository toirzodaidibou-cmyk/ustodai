"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { easeOutQuint } from "@/lib/motion";

/** Ягона лаҳзаи калидии саҳифа: матни hero ҳангоми боркунӣ қадам ба қадам пайдо мешавад. */
export function HeroIntro({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: easeOutQuint } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
