"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Ҳамаи аниматсияҳои motion танзими «камтар ҳаракат»-и корбарро риоя мекунанд. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
