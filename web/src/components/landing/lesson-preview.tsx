"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, Volume2 } from "lucide-react";
import { BorderBeam } from "@/components/motion/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import { useSpeech } from "@/lib/learning/use-speech";
import { duration, easeOutQuint } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Калимаҳои намоишӣ — ҳамон маълумоте, ки дар луғати A1 ҳаст. */
const DEMO = [
  { term: "door", ipa: "/dɔːr/", pos: "исм", tg: "дар", ex: "Close the door, please.", exTg: "Лутфан, дарро пӯш." },
  { term: "water", ipa: "/ˈwɔːtər/", pos: "исм", tg: "об", ex: "I drink water every day.", exTg: "Ман ҳар рӯз об менӯшам." },
  { term: "friend", ipa: "/frend/", pos: "исм", tg: "дӯст", ex: "He is my best friend.", exTg: "Ӯ дӯсти беҳтарини ман аст." },
];

const RATINGS = [
  { label: "Боз", interval: "1 дақ", dot: "bg-destructive" },
  { label: "Душвор", interval: "6 дақ", dot: "bg-warning" },
  { label: "Хуб", interval: "10 дақ", dot: "bg-success" },
  { label: "Осон", interval: "6 рӯз", dot: "bg-primary" },
];

/** Намоиши интерактивии экрани дарс дар саҳифаи асосӣ: метавон тарҷумаро кушод ва калимаро баҳо дод. */
export function LessonPreview() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { speak, supported } = useSpeech();
  const reduce = useReducedMotion();
  const w = DEMO[index % DEMO.length];

  // Майли нарми 3D аз паси курсор
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const reveal = () => {
    setRevealed(true);
    speak(w.term);
  };

  const rate = (i: number) => {
    setToast(`Калимаи «${w.term}» пас аз ${RATINGS[i].interval} бармегардад`);
    setRevealed(false);
    setIndex((n) => n + 1);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="mx-auto w-full max-w-md [perspective:1200px]">
      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <Progress value={((index % DEMO.length) / DEMO.length) * 100 + 100 / DEMO.length / 2} className="h-1.5" aria-label="Пешрафти дарс" />
        <span className="tabular-nums">
          {(index % DEMO.length) + 1}/{DEMO.length}
        </span>
      </div>

      <motion.div onMouseMove={onMove} onMouseLeave={onLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        <Card className="relative gap-0 py-0 shadow-xl shadow-foreground/5">
          <BorderBeam duration={9} />
          <CardHeader className="flex flex-row items-center justify-between border-b py-3">
            <Badge variant="secondary">Намоиш</Badge>
            {supported && (
              <Button variant="ghost" size="icon" onClick={() => speak(w.term)} aria-label="Гӯш кардан">
                <Volume2 />
              </Button>
            )}
          </CardHeader>

          <CardContent className="relative min-h-64 py-8 text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={w.term}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: duration.base * 1.4, ease: easeOutQuint }}
              >
                <p className="text-4xl font-semibold tracking-tight">{w.term}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {w.ipa} · {w.pos}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  {revealed ? (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: duration.base, ease: easeOutQuint }}
                    >
                      <p className="mt-5 text-xl font-medium">{w.tg}</p>
                      <div className="mt-5 rounded-lg border bg-muted/40 p-3 text-left text-sm">
                        <p className="font-medium">{w.ex}</p>
                        <p className="text-muted-foreground">{w.exTg}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="question" exit={{ opacity: 0 }} className="mt-8">
                      <Button variant="outline" onClick={reveal} className="h-9">
                        Тарҷумаро нишон деҳ
                      </Button>
                      <p className="mt-3 text-xs text-muted-foreground">Аввал худат дар ёд овар</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: duration.base, ease: easeOutQuint }}
                  className="absolute inset-x-4 bottom-3 flex items-center justify-center gap-1.5 rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm backdrop-blur"
                >
                  <Check className="size-3.5 text-success" />
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="grid grid-cols-4 gap-2 bg-muted/30">
            {RATINGS.map((r, i) => (
              <motion.button
                key={r.label}
                type="button"
                disabled={!revealed}
                onClick={() => rate(i)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border bg-background px-1 py-2 text-xs transition-[opacity,background-color] hover:bg-muted disabled:opacity-40",
                )}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span className={cn("size-1.5 rounded-full", r.dot)} />
                  {r.label}
                </span>
                <span className="text-muted-foreground">{r.interval}</span>
                <Kbd className="hidden sm:inline-flex">{i + 1}</Kbd>
              </motion.button>
            ))}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
