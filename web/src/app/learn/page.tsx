import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LearnSession } from "@/components/learn/learn-session";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { getStudyQueue } from "@/lib/learning/queue";

export const metadata: Metadata = { title: "Дарс" };

export default function LearnPage() {
  return (
    <Suspense fallback={<SessionSkeleton />}>
      <Session />
    </Suspense>
  );
}

async function Session() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const queue = await getStudyQueue(user.id);
  return <LearnSession initial={queue} />;
}

function SessionSkeleton() {
  return (
    <div aria-hidden className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-4 pb-6 sm:pt-10">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-1.5 flex-1" />
      </div>
      <Skeleton className="mt-8 h-80 rounded-xl" />
      <Skeleton className="mt-auto h-10 rounded-lg sm:mt-6" />
    </div>
  );
}
