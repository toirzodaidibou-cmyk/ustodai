"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { useSpeech } from "@/lib/learning/use-speech";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/** Ҷадвали такрори FSRS: нуқтаҳо яке пас аз дигар фаъол мешаванд, фосилаҳо дароз мешаванд. */
export function FsrsTimeline() {
  const steps = ["Имрӯз", "1 рӯз", "4 рӯз", "11 рӯз", "1 моҳ", "3 моҳ"];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? steps.length - 1 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % (steps.length + 2)), 900);
    return () => window.clearInterval(id);
  }, [inView, reduce, steps.length]);

  return (
    <div ref={ref} className="rounded-lg border bg-muted/30 p-5">
      <div className="mb-5 flex items-baseline justify-between text-xs text-muted-foreground">
        <span>
          Ҷадвали такрори калимаи <span className="font-medium text-foreground">door</span>
        </span>
        <span>ҳар дафъа «Хуб»</span>
      </div>
      <div className="relative">
        <div className="absolute top-[7px] right-2 left-2 h-px bg-border" />
        <motion.div
          className="absolute top-[7px] left-2 h-px bg-foreground"
          animate={{ width: `calc(${(Math.min(active, steps.length - 1) / (steps.length - 1)) * 100}% - 16px)` }}
          transition={{ duration: 0.6, ease }}
        />
        <div className="relative flex justify-between">
          {steps.map((s, i) => {
            const on = i <= active;
            return (
              <div key={s} className="flex flex-col items-center gap-2">
                <motion.span
                  className="size-[15px] rounded-full border-2 border-background"
                  animate={{
                    backgroundColor: on ? "var(--foreground)" : "var(--border)",
                    scale: i === active ? 1.35 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                />
                <span className={cn("text-[11px] whitespace-nowrap transition-colors", on ? "text-foreground" : "text-muted-foreground")}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PAIRS = [
  ["door", "дар"],
  ["water", "об"],
  ["friend", "дӯст"],
  ["mountain", "кӯҳ"],
  ["book", "китоб"],
];

/** Калима чоп мешавад, баъд тарҷумаи тоҷикӣ пайдо мешавад. */
export function TypingTranslate() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(reduce ? PAIRS[0][0] : "");
  const [showTg, setShowTg] = useState(!!reduce);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });

  useEffect(() => {
    if (!inView || reduce) return;
    const [en] = PAIRS[i % PAIRS.length];
    let n = 0;
    let t: number;
    const type = () => {
      n++;
      setTyped(en.slice(0, n));
      if (n < en.length) t = window.setTimeout(type, 90);
      else {
        t = window.setTimeout(() => setShowTg(true), 250);
        t = window.setTimeout(() => {
          setShowTg(false);
          setTyped("");
          setI((x) => x + 1);
        }, 2200);
      }
    };
    t = window.setTimeout(type, 300);
    return () => window.clearTimeout(t);
  }, [i, inView, reduce]);

  const tg = PAIRS[i % PAIRS.length][1];

  return (
    <div ref={ref} className="flex h-full min-h-28 flex-col justify-center rounded-lg border bg-muted/30 p-5">
      <div className="text-2xl font-semibold tracking-tight">
        {typed}
        <span className="ml-0.5 inline-block h-6 w-px translate-y-1 animate-pulse bg-foreground motion-reduce:animate-none" />
      </div>
      <div className="mt-2 h-6 text-lg text-muted-foreground">
        <AnimatePresence mode="wait">
          {showTg && (
            <motion.span
              key={tg}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="inline-block"
            >
              → {tg}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Мавҷи овоз ва тугма, ки калимаро воқеан талаффуз мекунад. */
export function SpeakDemo() {
  const { speak, supported } = useSpeech();
  const [playing, setPlaying] = useState(false);
  const bars = [30, 55, 40, 80, 60, 95, 70, 45, 85, 50, 65, 35, 75, 55, 40, 60, 30, 50];

  const play = () => {
    speak("Close the door, please.", 0.85);
    setPlaying(true);
    window.setTimeout(() => setPlaying(false), 1800);
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
      <button
        type="button"
        onClick={play}
        disabled={!supported}
        aria-label="Гӯш кардан: Close the door, please."
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
      >
        <Play className="size-4 translate-x-px fill-current" />
      </button>
      <div className="flex h-10 flex-1 items-center justify-between" aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn("wave-bar w-[3px] rounded-full bg-foreground/70", playing && "wave-bar-play")}
            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Ҳалқаи пешрафт ва сутунҳои ҳафта, ки ҳангоми ворид шудан ба экран месабзанд. */
export function ProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const week = [4, 7, 5, 9, 6, 10, 8];
  const days = ["Дш", "Сш", "Чш", "Пш", "Ҷм", "Шб", "Яш"];
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <div ref={ref} className="flex items-center gap-5 rounded-lg border bg-muted/30 p-4">
      <div className="relative size-16 shrink-0">
        <svg viewBox="0 0 64 64" className="size-full -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
          <motion.circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={inView ? { strokeDashoffset: C * (1 - 0.48) } : {}}
            transition={{ duration: 1.4, ease }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">48%</span>
      </div>
      <div className="flex h-16 flex-1 items-end gap-1.5">
        {week.map((v, i) => (
          <div key={days[i]} className="flex flex-1 flex-col items-center gap-1">
            <motion.span
              className="w-full rounded-sm bg-foreground/80"
              initial={{ height: 0 }}
              animate={inView ? { height: `${v * 4}px` } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.06 }}
            />
            <span className="text-[10px] text-muted-foreground">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Масъалаи мантиқӣ: қатори рақамҳо, ҷавоб бо клик кушода мешавад. */
export function LogicDemo() {
  const [solved, setSolved] = useState(false);
  const nums = ["2", "6", "12", "20"];
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-1.5">
        {nums.map((n) => (
          <span key={n} className="flex h-11 flex-1 items-center justify-center rounded-md border bg-background text-lg font-semibold tabular-nums">
            {n}
          </span>
        ))}
        <button
          type="button"
          onClick={() => setSolved((s) => !s)}
          className={cn(
            "relative flex h-11 flex-1 items-center justify-center overflow-hidden rounded-md border text-lg font-semibold tabular-nums transition-colors",
            solved ? "border-success/50 bg-success/10 text-success" : "border-dashed bg-background hover:bg-muted",
          )}
          aria-label={solved ? "Ҷавоб: 30" : "Ҷавобро нишон деҳ"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={solved ? "a" : "q"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
            >
              {solved ? "30" : "?"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <p className="mt-3 h-4 text-xs text-muted-foreground">
        {solved ? "n × (n + 1): 1×2, 2×3, 3×4, 4×5, 5×6" : "Рақами навбатиро ёб — клик кун"}
      </p>
    </div>
  );
}

/** Чати AI: аввал «навишта истодааст», баъд ҷавоб пайдо мешавад. */
export function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(reduce ? 2 : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const a = window.setTimeout(() => setStage(1), 500);
    const b = window.setTimeout(() => setStage(2), 1900);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex min-h-36 flex-col gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease }}
        className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3.5 py-2 text-primary-foreground"
      >
        Чаро «went», на «goed»?
      </motion.div>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-fit gap-1 rounded-xl rounded-bl-sm border bg-background px-3.5 py-3"
          >
            {[0, 1, 2].map((d) => (
              <span key={d} className="typing-dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 150}ms` }} />
            ))}
          </motion.div>
        )}
        {stage === 2 && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease }}
            className="max-w-[90%] rounded-xl rounded-bl-sm border bg-background px-3.5 py-2 leading-relaxed"
          >
            «Go» феъли нодуруст аст: шакли гузаштаи он аз қоида пайравӣ намекунад. Онро дар ёд гир: go → went → gone.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
