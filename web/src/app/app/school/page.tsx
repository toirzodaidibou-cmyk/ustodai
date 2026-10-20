import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CompetitionsBlock, HubHeader, HubSection, PracticeBlock } from "@/components/hub/hub-blocks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";
import { getLearningProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Хонандагон" };

export default function SchoolPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <School />
    </Suspense>
  );
}

async function School() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  const profile = await getLearningProfile(user.id);
  const grade = profile?.role === "school" ? profile.grade : null;

  return (
    <div className="grid gap-8">
      <HubHeader
        title="Барои хонандагони мактаб"
        description="Олимпиадаҳо, «Илм — фурӯғи маърифат», имтиҳонҳои дохилшавӣ ва тестҳои машқӣ аз рӯи фанҳои мактабӣ."
      >
        {grade ? (
          <p className="mt-2 text-sm text-muted-foreground">Синфи шумо: {grade}. Саволҳо барои ҳамин синф интихоб мешаванд.</p>
        ) : (
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/onboarding">Синфи худро нишон диҳед</Link>
          </Button>
        )}
      </HubHeader>
      <HubSection title="Озмунҳо барои хонандагон">
        <CompetitionsBlock role="school" now={new Date()} />
      </HubSection>
      <HubSection title="Тестҳои машқӣ">
        <PracticeBlock grade={grade} />
      </HubSection>
    </div>
  );
}
