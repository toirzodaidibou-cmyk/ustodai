import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarClock, CheckCircle2, Settings2 } from "lucide-react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { getTodayStats } from "@/lib/learning/queue";
import { getLearningProfile, isProfileComplete } from "@/lib/profile";
import { formatDate, getCompetition, nextStage } from "@/lib/competitions";
import { countQuestions } from "@/lib/tests";
import { getSubject } from "@/lib/subjects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Имрӯз" };

export default function TodayPage() {
  return (
    <Suspense fallback={<TodaySkeleton />}>
      <Today />
    </Suspense>
  );
}

async function Today() {
  const user = await getCurrentUser();
  // Ҳифзи дуюм: proxy.ts аллакай redirect мекунад, вале саҳифа худаш ҳам месанҷад
  if (!user) redirect("/auth/sign-in");

  const [stats, profile] = await Promise.all([
    getTodayStats(user.id),
    getLearningProfile(user.id),
  ]);
  // Корбаре, ки ҳанӯз нақш ва фанҳоро интихоб накардааст, ба onboarding меравад
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const now = new Date();
  const myCompetitions = profile.competitions
    .map((id) => getCompetition(id))
    .filter((c) => c !== undefined)
    .map((c) => ({ c, next: nextStage(c, now) }));
  const mySubjects = profile.subjects
    .map((id) => getSubject(id)!)
    .filter(Boolean);
  const learnsEnglish = profile.subjects.includes("english");
  // Фанҳое, ки барояшон тести машқӣ ҳаст
  const testCounts = await countQuestions(profile.subjects, profile.role === "school" ? profile.grade : null);
  const firstName = user.name.split(" ")[0];
  const toStudy = stats.newToday + stats.due;
  // Тахминан: калимаи нав ~25 сония (шиносоӣ ва 2 такрор), такрор ~8 сония
  const minutes = Math.max(
    1,
    Math.round((stats.newToday * 25 + stats.due * 8) / 60),
  );
  const courseProgress = stats.totalWords
    ? Math.round((stats.learned / stats.totalWords) * 100)
    : 0;
  const courseDone = stats.learned >= stats.totalWords;

  const plan = [
    stats.newToday > 0 && `${stats.newToday} калимаи нав`,
    stats.due > 0 && `${stats.due} такрор`,
  ]
    .filter(Boolean)
    .join(" ва ");

  return (
    <Stagger className="grid gap-6">
      <StaggerItem className="flex items-center gap-4">
        <UserAvatar seed={user.id} size={48} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Салом, {firstName}
          </h1>
          <p className="mt-0.5 text-muted-foreground">Нақшаи омӯзиши имрӯза.</p>
        </div>
      </StaggerItem>

      {learnsEnglish && (
        <StaggerItem>
          <Card>
            {toStudy > 0 ? (
              <>
                <CardHeader>
                  <CardTitle>Ҷаласаи имрӯза</CardTitle>
                  <CardDescription>
                    {plan}. Тақрибан {minutes} дақиқа.
                  </CardDescription>
                  <CardAction className="hidden sm:block">
                    <Button asChild>
                      <Link href="/learn">
                        {stats.learned === 0
                          ? "Оғози дарси аввал"
                          : "Оғози дарс"}
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="sm:hidden">
                  <Button asChild className="h-9 w-full">
                    <Link href="/learn">
                      {stats.learned === 0 ? "Оғози дарси аввал" : "Оғози дарс"}
                    </Link>
                  </Button>
                </CardContent>
              </>
            ) : (
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  {courseDone
                    ? "Курси A1 анҷом ёфт"
                    : "Барои имрӯз ҳамааш тамом"}
                </CardTitle>
                <CardDescription>
                  Калимаҳо дар вақти лозимӣ барои такрор бармегарданд. Фардо боз
                  биёед, то силсилаи рӯзҳо канда нашавад.
                </CardDescription>
              </CardHeader>
            )}
          </Card>
        </StaggerItem>
      )}

      {myCompetitions.length > 0 && (
        <StaggerItem>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Озмунҳои ман</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/competitions">Ҳамаи озмунҳо</Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {myCompetitions.map(({ c, next }) => (
              <Link
                key={c.id}
                href={`/app/competitions/${c.id}`}
                className="group flex min-w-0 items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30"
              >
                <div className="flex w-16 shrink-0 flex-col items-center rounded-lg border bg-muted/40 py-2">
                  {next ? (
                    <>
                      <NumberTicker value={next.days} className="text-xl font-semibold tabular-nums" />
                      <span className="text-[11px] text-muted-foreground">рӯз</span>
                    </>
                  ) : (
                    <CalendarClock className="my-1.5 size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{c.title}</div>
                  <div className="mt-0.5 truncate text-sm text-muted-foreground">
                    {next
                      ? `${next.stage.label} — ${formatDate(next.stage.date!)}${next.stage.status === "estimated" ? " (тахминӣ)" : ""}`
                      : "Санаи навбатӣ ҳанӯз эълон нашудааст"}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </StaggerItem>
      )}

      <StaggerItem>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Фанҳои ман</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/onboarding">
              <Settings2 />
              Тағйир додан
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {mySubjects.map((s) => {
            const live = s.status === "live";
            const hasTests = (testCounts[s.id] ?? 0) > 0;
            const inner = (
              <>
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold",
                    live || hasTests
                      ? "border-foreground bg-foreground text-background"
                      : "bg-muted/50 text-muted-foreground",
                  )}
                >
                  {s.glyph}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{s.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.description}
                  </span>
                </span>
                {live ? (
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                ) : hasTests ? (
                  <Badge variant="outline">тест</Badge>
                ) : (
                  <Badge variant="secondary">дар таҳия</Badge>
                )}
              </>
            );
            if (!live && hasTests) {
              return (
                <Link
                  key={s.id}
                  href={`/app/subjects/${s.id}`}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30"
                >
                  {inner}
                </Link>
              );
            }
            return live ? (
              <Link
                key={s.id}
                href="/learn"
                className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={s.id}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-dashed bg-card p-3"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </StaggerItem>

      {learnsEnglish && (
        <>
          <StaggerItem className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                label: "Калимаҳои омӯхта",
                value: stats.learned,
                hint: `аз ${stats.totalWords}`,
              },
              { label: "Рӯзҳои пай дар пай", value: stats.streak, hint: "рӯз" },
              {
                label: "Ҷавобҳои имрӯза",
                value: stats.reviewedToday,
                hint: "ҷавоб",
              },
            ].map((s) => (
              <Card key={s.label} size="sm">
                <CardHeader>
                  <CardDescription className="text-xs sm:text-sm">
                    {s.label}
                  </CardDescription>
                  <NumberTicker
                    value={s.value}
                    className="text-2xl font-semibold tracking-tight tabular-nums"
                  />
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {s.hint}
                </CardContent>
              </Card>
            ))}
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Курси англисӣ, сатҳи A1</CardTitle>
                <CardDescription>
                  Ҳар рӯз то 10 калимаи нав илова мешавад.
                </CardDescription>
                <CardAction className="text-sm font-medium tabular-nums">
                  {courseProgress}%
                </CardAction>
              </CardHeader>
              <CardContent>
                <Progress value={courseProgress} aria-label="Пешрафти курс" />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {stats.learned} аз {stats.totalWords} калима
              </CardFooter>
            </Card>
          </StaggerItem>
        </>
      )}
    </Stagger>
  );
}

function TodaySkeleton() {
  return (
    <div aria-hidden className="grid gap-6">
      <div className="grid gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-28 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-xl" />
    </div>
  );
}
