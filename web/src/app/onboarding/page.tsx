import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth/server";
import { getLearningProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Профили омӯзишӣ" };

export default function OnboardingPage() {
  return (
    <div className="min-h-dvh">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="px-4 pt-6 sm:px-6 sm:pt-10">
        <Suspense fallback={<FormSkeleton />}>
          <Form />
        </Suspense>
      </main>
    </div>
  );
}

async function Form() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const profile = await getLearningProfile(user.id);
  // Санаи имрӯза аз сервер, то ҳисоби рӯзҳо дар сервер ва браузер якхела бошад
  const today = new Date().toISOString().slice(0, 10);
  return <OnboardingForm key={profile ? "edit" : "new"} editing={!!profile?.role} initial={profile ?? undefined} today={today} />;
}

function FormSkeleton() {
  return (
    <div aria-hidden className="mx-auto grid w-full max-w-3xl gap-4">
      <Skeleton className="h-1 w-full" />
      <Skeleton className="mt-6 h-8 w-72" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="mt-6 grid gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
