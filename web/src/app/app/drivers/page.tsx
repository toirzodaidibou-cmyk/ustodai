import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { HubHeader, HubSection, PlannedList } from "@/components/hub/hub-blocks";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Ронандагон" };

const MODULES = [
  { title: "Қоидаҳои ҳаракат дар роҳ", text: "Тестҳо аз рӯи бобҳои қоидаҳо: ҳаракат, гузариш, суръат, таваққуф, чорроҳаҳо." },
  { title: "Аломатҳои роҳ", text: "Аломатҳои огоҳкунанда, манъкунанда, амрӣ ва нишонадиҳанда бо тасвир." },
  { title: "Ёрии аввалия ва бехатарӣ", text: "Амалҳо ҳангоми садама ва асосҳои ёрии аввалия." },
  { title: "Имтиҳони озмоишӣ", text: "Тест бо вақт дар формати наздик ба имтиҳони расмӣ ва холи гузариш." },
  { title: "Дафтари хатоҳо", text: "Саволҳои хатошуда бо такрори фосилавӣ (FSRS) то вақте ки дар ёд бимонанд." },
  { title: "Шарҳи ҳар савол", text: "Барои ҳар ҷавоб — истинод ба банди қоидаҳо ва шарҳ бо забони тоҷикӣ." },
];

export default function DriversPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <Drivers />
    </Suspense>
  );
}

async function Drivers() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  return (
    <div className="grid gap-8">
      <HubHeader
        title="Барои ронандагон"
        description="Омодагӣ ба имтиҳони назариявии гирифтани шаҳодатномаи ронандагӣ: тестҳо аз рӯи Қоидаҳои ҳаракат дар роҳ бо шарҳ бо забони тоҷикӣ."
      />
      <Alert>
        <Info />
        <AlertDescription>
          Саволҳо аз рӯи матни Қоидаҳои ҳаракат дар роҳи Ҷумҳурии Тоҷикистон аз ҷониби UstodAI навишта мешаванд ва
          билетҳои расмии имтиҳон нестанд. Формати имтиҳони расмӣ (шумораи саволҳо, вақт, ҳадди гузариш) пеш аз нашр
          аз манбаъҳои расмӣ санҷида мешавад.
        </AlertDescription>
      </Alert>
      <HubSection title="Модулҳо" action={<Badge variant="secondary">дар таҳия</Badge>}>
        <PlannedList items={MODULES} />
      </HubSection>
    </div>
  );
}
