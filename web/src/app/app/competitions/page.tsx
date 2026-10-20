import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { COMPETITIONS, formatDate, nextStage, recommendCompetitions } from "@/lib/competitions";
import { getLearningProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Озмунҳо" };

export default function CompetitionsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <List />
    </Suspense>
  );
}

async function List() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const profile = await getLearningProfile(user.id);
  const now = new Date();
  const recommended = new Set(
    profile?.role ? recommendCompetitions({ role: profile.role, grade: profile.grade }).map((c) => c.id) : [],
  );
  const mine = new Set(profile?.competitions ?? []);
  // Аввал озмунҳои интихобшуда, баъд тавсияшуда, баъд дигарон
  const sorted = [...COMPETITIONS].sort(
    (a, b) => Number(mine.has(b.id)) - Number(mine.has(a.id)) || Number(recommended.has(b.id)) - Number(recommended.has(a.id)),
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Озмунҳо</h1>
        <p className="mt-1 text-muted-foreground">Озмунҳои ҷумҳуриявӣ ва чорабиниҳое, ки шумо метавонед дар онҳо иштирок кунед.</p>
      </div>
      <Stagger className="grid gap-3">
        {sorted.map((c) => {
          const next = nextStage(c, now);
          return (
            <StaggerItem key={c.id}>
              <Link
                href={`/app/competitions/${c.id}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{c.title}</span>
                    {mine.has(c.id) ? (
                      <Badge>интихоб шуд</Badge>
                    ) : recommended.has(c.id) ? (
                      <Badge variant="secondary">барои шумо</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5" />
                    {next
                      ? `${next.stage.label}: ${formatDate(next.stage.date!)}${next.stage.status === "estimated" ? " (тахминӣ)" : ""} · ${next.days} рӯз монд`
                      : "Санаи навбатӣ ҳанӯз эълон нашудааст"}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
