/*
 * Токенҳои ҳаракат барои китобхонаи motion (motion/react).
 * Ҳамон қиматҳое, ки дар DESIGN.md → Motion ва globals.css (--duration-*, --ease-out-quint) ҳастанд.
 */
export const duration = { fast: 0.15, base: 0.24, slow: 0.42 } as const;

export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

/** Барои пахш ва ивази кортҳо */
export const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

/** Пайдошавии оддӣ: аз поён ба боло */
export const reveal = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: easeOutQuint },
} as const;
