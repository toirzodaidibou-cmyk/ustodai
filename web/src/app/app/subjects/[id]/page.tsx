import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import { startTestAction } from "@/app/app/tests/actions";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NOTES } from "@/content/notes";
import { getCurrentUser } from "@/lib/auth/server";
import { getLearningProfile } from "@/lib/profile";
import { SUBJECTS, getSubject } from "@/lib/subjects";
import { SECONDS_PER_QUESTION, TEST_SIZE, recentAttempts, topicCounts } from "@/lib/tests";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/app/subjects/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getSubject(id)?.title ?? "Фан" };
}

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ id: s.id }));
}

export default function SubjectPage(props: PageProps<"/app/subjects/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <SubjectDetail {...props} />
    </Suspense>
  );
}

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dushanbe" });

async function SubjectDetail({ params }: PageProps<"/app/subjects/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const { id } = await params;
  const subject = getSubject(id);
  if (!subject) notFound();

  const profile = await getLearningProfile(user.id);
  const grade = profile?.role === "school" ? profile.grade : null;
  const [topics, recent] = await Promise.all([topicCounts(subject.id, grade), recentAttempts(user.id, subject.id)]);
  const total = topics.reduce((s, t) => s + t.n, 0);
  const notes = NOTES[subject.id] ?? [];
  const n = Math.min(TEST_SIZE, total);

  return (
    <Stagger className="grid gap-6">
      <StaggerItem className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground bg-foreground text-lg font-semibold text-background">
          {subject.glyph}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{subject.title}</h1>
          <p className="mt-0.5 text-muted-foreground">{subject.description}</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle>Тести машқӣ</CardTitle>
            <CardDescription>
              {total > 0
                ? `${n} саволи тасодуфӣ аз ${total}${grade ? ` (барои синфи ${grade})` : ""} · ${Math.round((n * SECONDS_PER_QUESTION) / 60)} дақиқа. Саволҳо намунавӣ ва аз ҷониби UstodAI навишта шудаанд.`
                : "Саволҳо барои ин фан ҳанӯз омода нестанд."}
            </CardDescription>
          </CardHeader>
          {total > 0 && (
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <Badge key={t.topic} variant="secondary">
                    {t.topic} · {t.n}
                  </Badge>
                ))}
              </div>
              <form action={startTestAction}>
                <input type="hidden" name="subject" value={subject.id} />
                <Button type="submit" className="h-10 w-full sm:w-auto">
                  <Play />
                  Оғози тест
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      </StaggerItem>

      {notes.length > 0 && (
        <StaggerItem>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <h2 className="font-medium">Назария: қоидаҳо ва формулаҳо</h2>
          </div>
          <Accordion type="single" collapsible defaultValue={notes[0]?.topic} className="rounded-xl border bg-card px-4">
            {notes.map((t) => (
              <AccordionItem key={t.topic} value={t.topic}>
                <AccordionTrigger className="text-base">
                  <span className="text-left">
                    <span className="block font-medium">{t.topic}</span>
                    <span className="block text-xs font-normal text-muted-foreground">{t.summary}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 pb-2">
                    {t.rules.map((r) => (
                      <div key={r.title} className="rounded-lg border p-4">
                        <p className="font-medium">{r.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                        {r.formulas && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {r.formulas.map((f) => (
                              <code key={f} className="rounded-md border bg-muted/50 px-2.5 py-1 font-sans text-[13px] font-medium">
                                {f}
                              </code>
                            ))}
                          </div>
                        )}
                        {r.example && (
                          <p className="mt-3 text-sm">
                            <span className="text-muted-foreground">Мисол: </span>
                            {r.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StaggerItem>
      )}

      {recent.length > 0 && (
        <StaggerItem>
          <h2 className="mb-3 font-medium">Натиҷаҳои охирин</h2>
          <div className="grid gap-2">
            {recent.map((a) => (
              <Link
                key={a.id}
                href={`/app/tests/${a.id}`}
                className="group flex min-w-0 items-center gap-4 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30"
              >
                <span
                  className={cn(
                    "w-14 shrink-0 text-center text-lg font-semibold tabular-nums",
                    (a.scorePercent ?? 0) >= 75 ? "text-success" : (a.scorePercent ?? 0) < 50 ? "text-destructive" : "",
                  )}
                >
                  {a.scorePercent}%
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block tabular-nums">
                    {a.correct} аз {a.total} дуруст
                  </span>
                  <span className="block text-xs text-muted-foreground">{a.finishedAt ? dateFmt.format(a.finishedAt) : ""}</span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </StaggerItem>
      )}
    </Stagger>
  );
}
