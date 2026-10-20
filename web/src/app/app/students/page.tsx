import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CompetitionsBlock, HubHeader, HubSection, PracticeBlock } from "@/components/hub/hub-blocks";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Донишҷӯён" };

export default function StudentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <Students />
    </Suspense>
  );
}

async function Students() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  return (
    <div className="grid gap-8">
      <HubHeader
        title="Барои донишҷӯён"
        description="Озмунҳои ҷумҳуриявӣ барои донишҷӯёни коллеҷ ва донишгоҳ — аз ҷумла номинатсияҳои «Зеҳни сунъӣ ва барномасозӣ» ва «Ихтироъкорӣ ва навоварӣ» — ва тестҳои машқӣ."
      />
      <HubSection title="Озмунҳо барои донишҷӯён">
        <CompetitionsBlock role="student" now={new Date()} />
      </HubSection>
      <HubSection title="Тестҳои машқӣ">
        <PracticeBlock grade={null} />
      </HubSection>
    </div>
  );
}
