"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { duration, easeOutQuint } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Пайдошавии ором ҳангоми ворид шудан ба экран (як бор). */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: duration.slow * 1.4, ease: easeOutQuint, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Гурӯҳ: фарзандон бо фосилаи хурд яке пас аз дигар пайдо мешаванд. */
export function Stagger({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: duration.slow * 1.3, ease: easeOutQuint } },
      }}
      className={cn("min-w-0", className)}
    >
      {children}
    </motion.div>
  );
}
