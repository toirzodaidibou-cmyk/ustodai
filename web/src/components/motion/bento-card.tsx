"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Корти bento: нури нарм аз паси курсор ва канори дурахшон дар ҳамон ҷое, ки курсор наздик аст.
 * Танҳо CSS-тағйирёбандаҳо иваз мешаванд — бе re-render.
 */
export function BentoCard({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn("group/bento relative overflow-hidden rounded-xl border bg-card p-6", className)}
    >
      {/* Нур дар дохили корт */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--x) var(--y), color-mix(in oklch, var(--foreground) 6%, transparent), transparent 65%)",
        }}
      />
      {/* Канори дурахшон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--x) var(--y), color-mix(in oklch, var(--foreground) 45%, transparent), transparent 70%)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}
