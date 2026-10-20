"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, Loader2, School, Trophy } from "lucide-react";
import { saveOnboarding } from "@/app/onboarding/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, recommendCompetitions, type Role } from "@/lib/competitions";
import { SUBJECT_GROUPS, SUBJECTS, type SubjectId } from "@/lib/subjects";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const GRADES = [5, 6, 7, 8, 9, 10, 11];

const ROLES: { id: Role; title: string; description: string; icon: typeof School }[] = [
  { id: "school", title: "Хонандаи мактаб", description: "Синфҳои 5–11: дарсҳо, олимпиадаҳо ва омодагӣ ба ММТ", icon: School },
  { id: "student", title: "Донишҷӯ", description: "Коллеҷ ё донишгоҳ: фанҳо ва озмунҳои донишҷӯӣ", icon: GraduationCap },
  { id: "self", title: "Барои дониши худ", description: "Забон ё фанро барои худ, бо суръати худ меомӯзам", icon: BookOpen },
];

type Initial = {
  role: Role | null;
  grade: number | null;
  institution: "college" | "university" | null;
  course: number | null;
  subjects: SubjectId[];
  competitions: string[];
};

type Props = { initial?: Initial; editing?: boolean; today: string };

function Choice({ on, onClick, children, className }: { on: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center justify-center rounded-lg border bg-card px-3 text-sm font-medium tabular-nums transition-colors hover:border-foreground/30",
        on && "border-foreground bg-foreground text-background hover:border-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        on && "border-foreground bg-foreground text-background",
      )}
    >
      <AnimatePresence>
        {on && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 600, damping: 25 }}>
            <Check className="size-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function OnboardingForm({ initial, editing = false, today }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role | null>(initial?.role ?? null);
  const [grade, setGrade] = useState<number | null>(initial?.grade ?? null);
  const [institution, setInstitution] = useState<"college" | "university" | null>(initial?.institution ?? null);
  const [course, setCourse] = useState<number | null>(initial?.course ?? null);
  const [subjects, setSubjects] = useState<SubjectId[]>(initial?.subjects ?? []);
  const [competitions, setCompetitions] = useState<string[] | null>(initial?.competitions.length ? initial.competitions : null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const recommended = useMemo(() => (role ? recommendCompetitions({ role, grade }) : []), [role, grade]);
  // Агар корбар ҳанӯз озмун интихоб накарда бошад, ҳамаи тавсияшудаҳо пешакӣ интихоб мешаванд
  const chosen = competitions ?? recommended.map((c) => c.id);
  const maxCourse = institution === "college" ? 4 : 5;

  const step1Done =
    role === "self" ||
    (role === "school" && grade !== null) ||
    (role === "student" && institution !== null && course !== null && course <= maxCourse);

  const toggleSubject = (id: SubjectId) => setSubjects((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleCompetition = (id: string) =>
    setCompetitions(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);

  const submit = () => {
    if (!role) return;
    setError(null);
    startTransition(async () => {
      const res = await saveOnboarding({ role, grade, institution, course, subjects, competitions: chosen });
      if (res?.error) setError(res.error);
    });
  };

  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const nextFor = (id: string) => {
    const c = recommended.find((x) => x.id === id);
    const s = c?.stages.find((st) => st.date && Date.parse(`${st.date}T00:00:00Z`) >= todayMs);
    if (!s?.date) return null;
    return { label: s.label, date: s.date, estimated: s.status === "estimated", days: Math.round((Date.parse(`${s.date}T00:00:00Z`) - todayMs) / 86_400_000) };
  };

  const slide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.35, ease },
  };

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-clip pb-28">
      <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", n <= step ? "bg-foreground" : "bg-border")} />
        ))}
        <span className="ml-2 tabular-nums">{step}/3</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 && (
          <motion.section key="role" {...slide}>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Шумо кистед?</h1>
            <p className="mt-2 text-muted-foreground">Аз рӯи ин мо фанҳо ва озмунҳои мувофиқро пешниҳод мекунем.</p>

            <div role="radiogroup" aria-label="Шумо кистед" className="mt-8 grid gap-3">
              {ROLES.map((r) => {
                const on = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-[border-color,box-shadow] hover:border-foreground/30",
                      on && "border-foreground ring-1 ring-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        on ? "border-foreground bg-foreground text-background" : "bg-muted/50 text-muted-foreground",
                      )}
                    >
                      <r.icon className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{r.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{r.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {role === "school" && (
                <motion.div key="grade" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                  <h2 className="mt-8 mb-3 text-sm font-medium">Дар кадом синф мехонед?</h2>
                  <div role="radiogroup" aria-label="Синф" className="grid grid-cols-7 gap-2">
                    {GRADES.map((g) => (
                      <Choice key={g} on={grade === g} onClick={() => setGrade(g)}>
                        {g}
                      </Choice>
                    ))}
                  </div>
                </motion.div>
              )}
              {role === "student" && (
                <motion.div key="student" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                  <h2 className="mt-8 mb-3 text-sm font-medium">Дар куҷо мехонед?</h2>
                  <div role="radiogroup" aria-label="Муассиса" className="grid grid-cols-2 gap-2">
                    <Choice on={institution === "college"} onClick={() => { setInstitution("college"); if (course && course > 4) setCourse(null); }}>
                      Коллеҷ
                    </Choice>
                    <Choice on={institution === "university"} onClick={() => setInstitution("university")}>
                      Донишгоҳ
                    </Choice>
                  </div>
                  {institution && (
                    <>
                      <h2 className="mt-6 mb-3 text-sm font-medium">Курс</h2>
                      <div role="radiogroup" aria-label="Курс" className="grid grid-cols-5 gap-2">
                        {Array.from({ length: maxCourse }, (_, i) => i + 1).map((c) => (
                          <Choice key={c} on={course === c} onClick={() => setCourse(c)}>
                            {c}
                          </Choice>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section key="subjects" {...slide}>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Кадом фанҳоро меомӯзед?</h1>
            <p className="mt-2 text-muted-foreground">
              Якчанд фанро интихоб кунед. Фанҳои «дар таҳия» ҳамин ки тайёр шаванд, дар саҳифаи шумо пайдо мешаванд.
            </p>
            <div className="mt-8 grid gap-8">
              {SUBJECT_GROUPS.map((group) => (
                <div key={group.id}>
                  <h2 className="mb-3 text-sm font-medium text-muted-foreground">{group.title}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SUBJECTS.filter((s) => s.group === group.id).map((s) => {
                      const on = subjects.includes(s.id);
                      return (
                        <motion.button
                          key={s.id}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggleSubject(s.id)}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 text-left transition-[border-color,box-shadow] hover:border-foreground/30",
                            on && "border-foreground ring-1 ring-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                              on ? "border-foreground bg-foreground text-background" : "bg-muted/50",
                            )}
                          >
                            {s.glyph}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate font-medium">{s.title}</span>
                              {s.status === "soon" && (
                                <Badge variant="secondary" className="shrink-0">
                                  дар таҳия
                                </Badge>
                              )}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{s.description}</span>
                          </span>
                          <CheckBox on={on} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {step === 3 && (
          <motion.section key="competitions" {...slide}>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Озмунҳо барои шумо</h1>
            <p className="mt-2 text-muted-foreground">
              Шумо метавонед дар ин озмунҳо иштирок кунед. Озмунҳои интихобшуда дар саҳифаи шумо бо ҳисоби рӯзҳо нишон
              дода мешаванд.
            </p>
            {recommended.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                Барои худомӯзӣ озмун ҳатмӣ нест. Шумо метавонед ҳамин тавр идома диҳед.
              </div>
            ) : (
              <div className="mt-8 grid gap-3">
                {recommended.map((c, i) => {
                  const on = chosen.includes(c.id);
                  const next = nextFor(c.id);
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => toggleCompetition(c.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-[border-color,box-shadow] hover:border-foreground/30",
                        on && "border-foreground ring-1 ring-foreground",
                      )}
                    >
                      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors", on ? "border-foreground bg-foreground text-background" : "bg-muted/50 text-muted-foreground")}>
                        <Trophy className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{c.title}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{c.summary}</span>
                        <span className="mt-2 block text-xs text-muted-foreground">
                          {next ? (
                            <>
                              {next.label}: <span className="font-medium text-foreground">{formatDate(next.date)}</span>
                              {next.estimated && " (тахминӣ)"} · {next.days} рӯз монд
                            </>
                          ) : (
                            "Санаи навбатӣ ҳанӯз эълон нашудааст"
                          )}
                        </span>
                      </span>
                      <CheckBox on={on} />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep((s) => (s === 3 ? 2 : 1))} className="h-9">
              <ArrowLeft />
              Бозгашт
            </Button>
          )}
          <div className="flex-1 text-sm text-muted-foreground">
            {error ? (
              <Alert variant="destructive" className="py-2">
                <AlertCircle />
                <AlertDescription role="alert">{error}</AlertDescription>
              </Alert>
            ) : step === 2 ? (
              <span className="tabular-nums">{subjects.length ? `${subjects.length} фан интихоб шуд` : "Фанро интихоб кунед"}</span>
            ) : step === 3 && recommended.length > 0 ? (
              <span className="tabular-nums">{chosen.length} озмун интихоб шуд</span>
            ) : null}
          </div>
          {step === 1 && (
            <Button onClick={() => setStep(2)} disabled={!step1Done} className="h-9">
              Идома
              <ArrowRight />
            </Button>
          )}
          {step === 2 && (
            <Button onClick={() => setStep(3)} disabled={subjects.length === 0} className="h-9">
              Идома
              <ArrowRight />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={submit} disabled={isPending} className="h-9">
              {isPending && <Loader2 className="animate-spin" />}
              {editing ? "Захира кардан" : "Оғоз кардан"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
