import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { TestResult } from "@/components/tests/test-result";
import { TestRunner } from "@/components/tests/test-runner";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { getCompetition } from "@/lib/competitions";
import { getSubject } from "@/lib/subjects";
import { finishAttempt, getResult, getRunnerData, isExpired } from "@/lib/tests";

export const metadata: Metadata = { title: "Тест" };

export default function TestPage(props: PageProps<"/app/tests/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-2xl rounded-xl" />}>
      <Test {...props} />
    </Suspense>
  );
}

async function Test({ params }: PageProps<"/app/tests/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  let data = await getRunnerData(user.id, id);
  if (!data) notFound();

  // Агар вақт гузашта бошад, тест худкор анҷом меёбад
  if (isExpired(data.attempt)) {
    await finishAttempt(user.id, id);
    data = await getRunnerData(user.id, id);
    if (!data) notFound();
  }

  const subject = getSubject(data.attempt.subject)?.title ?? "Тест";
  const competition = data.attempt.competition ? getCompetition(data.attempt.competition)?.title : null;
  const title = competition ? `${subject} — тести машқӣ, ${competition}` : `${subject} — тести машқӣ`;

  if (data.attempt.finishedAt) {
    const result = await getResult(user.id, id);
    if (!result) notFound();
    return <TestResult attempt={result.attempt} items={result.items} title={title} />;
  }

  return (
    <TestRunner
      attemptId={id}
      items={data.items}
      deadline={data.deadline.toISOString()}
      serverNow={new Date().toISOString()}
      title={title}
    />
  );
}
