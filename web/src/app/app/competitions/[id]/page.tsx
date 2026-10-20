import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDashed, ExternalLink, FileQuestion, Play, Trophy } from "lucide-react";
import { startTestAction } from "@/app/app/tests/actions";
import { getLearningProfile } from "@/lib/profile";
import { SUBJECTS, getSubject } from "@/lib/subjects";
import { SECONDS_PER_QUESTION, TEST_SIZE, countQuestions } from "@/lib/tests";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { COMPETITIONS, formatDate, getCompetition, nextStage, type Stage } from "@/lib/competitions";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/app/competitions/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: getCompetition(id)?.title ?? "Озмун" };
}

export function generateStaticParams() {
  return COMPETITIONS.map((c) => ({ id: c.id }));
}

export default function CompetitionPage(props: PageProps<"/app/competitions/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <CompetitionDetail {...props} />
    </Suspense>
  );
}

const STATUS: Record<Stage["status"], { label: string; icon: typeof CheckCircle2; cls: string }> = {
  confirmed: { label: "тасдиқшуда", icon: CheckCircle2, cls: "text-success" },
  estimated: { label: "тахминӣ", icon: CircleDashed, cls: "text-warning" },
  unknown: { label: "эълон нашудааст", icon: CalendarClock, cls: "text-muted-foreground" },
};

async function CompetitionDetail({ params }: PageProps<"/app/competitions/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const { id } = await params;
  const c = getCompetition(id);
  if (!c) notFound();
  const next = nextStage(c, new Date());

  // Фанҳое, ки барои тести машқӣ савол доранд: номинатсияҳои озмун ё ҳамаи фанҳои тестӣ
  const profile = await getLearningProfile(user.id);
  const grade = profile?.role === "school" ? profile.grade : null;
  const candidates = c.nominations?.some((n) => n.subject)
    ? [...new Set(c.nominations.map((n) => n.subject).filter((s) => s !== undefined))]
    : SUBJECTS.filter((s) => s.mode === "tests").map((s) => s.id);
  const counts = c.practice ? await countQuestions(candidates, grade) : {};
  const practiceSubjects = candidates.filter((id) => (counts[id] ?? 0) > 0);

  return (
    <Stagger className="grid gap-6">
      <StaggerItem>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/app/competitions">
            <ArrowLeft />
            Ҳамаи озмунҳо
          </Link>
        </Button>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{c.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{c.summary}</p>
        <p className="mt-2 text-xs text-muted-foreground">Ташкилкунанда: {c.organizer}</p>
      </StaggerItem>

      {next && (
        <StaggerItem>
          <Card>
            <CardContent className="flex items-center gap-5">
              <div className="flex w-20 shrink-0 flex-col items-center rounded-lg border bg-muted/40 py-3">
                <NumberTicker value={next.days} className="text-3xl font-semibold tabular-nums" />
                <span className="text-xs text-muted-foreground">рӯз монд</span>
              </div>
              <div>
                <p className="font-medium">{next.stage.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {formatDate(next.stage.date!)}
                  {next.stage.status === "estimated" && " — сана тахминӣ аст"}
                </p>
                {next.stage.note && <p className="mt-1 text-xs text-muted-foreground">{next.stage.note}</p>}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle>Марҳилаҳо ва санаҳо</CardTitle>
            <CardDescription>Ҳар сана нишон медиҳад, ки тасдиқшуда аст ё тахминӣ.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative grid gap-5 border-l pl-5">
              {c.stages.map((s) => {
                const st = STATUS[s.status];
                return (
                  <li key={s.label} className="relative">
                    <span className="absolute top-1 -left-[25px] size-2.5 rounded-full border-2 border-background bg-foreground" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{s.label}</span>
                      <span className={cn("inline-flex items-center gap-1 text-xs", st.cls)}>
                        <st.icon className="size-3.5" />
                        {st.label}
                      </span>
                    </div>
                    {s.date && <p className="text-sm text-muted-foreground">{formatDate(s.date)}</p>}
                    {s.note && <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle>Кӣ иштирок карда метавонад</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm">
              {c.audience.map((a) => (
                <li key={a} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </StaggerItem>

      {c.nominations && (
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle>Номинатсияҳо</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
                {c.nominations.map((n) => (
                  <div key={n.title} className="bg-card p-4">
                    <p className="font-medium">{n.title}</p>
                    {n.topics && <p className="mt-1 text-sm text-muted-foreground">Мавзӯъҳо: {n.topics}</p>}
                    {n.format && <p className="mt-1 text-xs text-muted-foreground">{n.format}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="size-4 text-muted-foreground" />
              Формат ва саволҳо
            </CardTitle>
            <CardDescription>Озмун чӣ гуна мегузарад ва чӣ гуна саволҳо интизор шавад.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ul className="grid gap-2 text-sm">
              {c.format.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                  {f}
                </li>
              ))}
            </ul>
            {c.practice && (
              <div className="rounded-lg border p-4">
                <p className="font-medium">Тести машқӣ дар формати ҳамин озмун</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Саволҳои намунавии UstodAI бо вақт, хол ва шарҳи ҳар ҷавоб бо забони тоҷикӣ. Ин саволҳои расмии озмун нестанд.
                </p>
                {practiceSubjects.length > 0 ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {practiceSubjects.map((id) => {
                      const n = Math.min(TEST_SIZE, counts[id] ?? 0);
                      return (
                        <form key={id} action={startTestAction}>
                          <input type="hidden" name="subject" value={id} />
                          <input type="hidden" name="competition" value={c.id} />
                          <Button type="submit" variant="outline" className="h-auto w-full justify-start gap-3 py-2.5">
                            <Play className="size-4" />
                            <span className="text-left">
                              <span className="block font-medium">{getSubject(id)?.title}</span>
                              <span className="block text-xs font-normal text-muted-foreground">
                                {n} савол · {Math.round((n * SECONDS_PER_QUESTION) / 60)} дақиқа
                              </span>
                            </span>
                          </Button>
                        </form>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3">
                    <Badge variant="secondary">саволҳо ба зудӣ</Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </StaggerItem>

      {c.prizes && (
        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 text-muted-foreground" />
                Мукофотҳо ва имтиёзҳо
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm">
                {c.prizes.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </StaggerItem>
      )}

      <StaggerItem>
        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">Манбаъҳо</p>
          <ul className="mt-2 grid gap-1.5">
            {c.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {s.title}
                  <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Маълумот 20 октябри 2026 санҷида шуд. Санаҳои расмиро ҳамеша дар манбаъ тафтиш кунед.</p>
        </div>
      </StaggerItem>
    </Stagger>
  );
}
