"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/*
 * Графики схематикии қаҷхаттаи фаромӯшӣ (Эббингауз).
 * Рақамҳо тасвирӣ мебошанд: R(t) = e^(-t/S). Пас аз ҳар такрор S калон мешавад.
 * Хатҳо ҳангоми ворид шудан ба экран «кашида» мешаванд.
 */
const DAYS = 20;
const W = 560;
const H = 220;
const PAD = { l: 36, r: 12, t: 12, b: 28 };

const x = (d: number) => PAD.l + (d / DAYS) * (W - PAD.l - PAD.r);
const y = (r: number) => PAD.t + (1 - r) * (H - PAD.t - PAD.b);

function curve(segments: { from: number; to: number; s: number }[]) {
  const pts: string[] = [];
  for (const seg of segments) {
    for (let d = seg.from; d <= seg.to + 1e-9; d += 0.25) {
      const r = Math.exp(-(d - seg.from) / seg.s);
      pts.push(`${pts.length === 0 ? "M" : "L"}${x(d).toFixed(1)},${y(r).toFixed(1)}`);
    }
  }
  return pts.join(" ");
}

const noReview = curve([{ from: 0, to: DAYS, s: 1.6 }]);
const reviews = [1, 4, 11];
const withReview = curve([
  { from: 0, to: 1, s: 1.6 },
  { from: 1, to: 4, s: 4.5 },
  { from: 4, to: 11, s: 12 },
  { from: 11, to: DAYS, s: 40 },
]);

export function ForgettingChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Бе такрор хотира зуд кам мешавад, бо такрорҳои фосилавӣ дар сатҳи баланд мемонад"
      >
        {[0, 0.5, 1].map((r) => (
          <g key={r}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(r)} y2={y(r)} stroke="var(--border)" />
            <text x={PAD.l - 8} y={y(r) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
              {r * 100}%
            </text>
          </g>
        ))}
        {[0, 5, 10, 15, 20].map((d) => (
          <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
            {d === 0 ? "рӯзи 0" : d}
          </text>
        ))}
        <motion.path
          d={noReview}
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease }}
        />
        <motion.path
          d={withReview}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, ease, delay: 0.2 }}
        />
        {reviews.map((d, i) => (
          <motion.circle
            key={d}
            cx={x(d)}
            cy={y(1)}
            r="4"
            fill="var(--foreground)"
            stroke="var(--card)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.5 + (d / DAYS) * 1.4 + i * 0.05 }}
          />
        ))}
      </svg>
      <div className="mt-4 flex gap-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-px w-4 border-t border-dashed border-muted-foreground" /> Бе такрор
        </span>
        <span className="flex items-center gap-2 text-foreground">
          <span className="h-0.5 w-4 bg-foreground" /> Бо UstodAI
        </span>
      </div>
    </>
  );
}
