import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { HubHeader, HubSection, PlannedList } from "@/components/hub/hub-blocks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Блогерон" };

const COURSES = [
  { title: "Сохтани контент", text: "Мавзӯъ, ғоя ва нақшаи нашрҳо: чӣ гуна контенти фоиданок бо забони тоҷикӣ созем." },
  { title: "Навиштани матн", text: "Сарлавҳа, матни кӯтоҳ ва фаҳмо, имло ва услуб барои шабакаҳои иҷтимоӣ." },
  { title: "Видео ва монтаж", text: "Наворбардорӣ бо телефон, нур, садо ва монтажи оддӣ." },
  { title: "SMM ва таҳлил", text: "Аудитория, вақти нашр ва фаҳмидани омори саҳифа." },
  { title: "Ҳуқуқ ва одоби блогерӣ", text: "Ҳуқуқи муаллифӣ, иқтибос ва масъулият дар назди хонанда." },
  { title: "Тестҳо барои санҷиши дониш", text: "Пас аз ҳар модул тести кӯтоҳ бо шарҳ — дар ҳамон муҳаррики тестҳо." },
];

/* Озмунҳое, ки дар манбаъҳои расмӣ ёфт шуданд (санҷида: 20.10.2026). */
const CONTESTS = [
  {
    title: "Озмуни Кумитаи рушди сайёҳӣ",
    text: "Озмун оид ба рушди соҳаи сайёҳӣ ва муаррифии иқтидори сайёҳии Тоҷикистон. Яке аз номинатсияҳо: «Беҳтарин блогер ва пешниҳоди инноватсионӣ дар асоси зеҳни сунъӣ».",
    when: "Эълон: сентябри 2026. Мӯҳлатҳоро дар манбаъ санҷед.",
    source: {
      title: "НИАТ «Ховар» (бо забони русӣ)",
      url: "https://khovar.tj/rus/2026/09/komitet-po-razvitiyu-turizma-obyavil-konkurs-po-razvitiyu-turisticheskoj-sfery-i-prodvizheniyu-turisticheskogo-potentsiala-tadzhikistana/",
    },
  },
];

export default function BloggersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <Bloggers />
    </Suspense>
  );
}

async function Bloggers() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  return (
    <div className="grid gap-8">
      <HubHeader
        title="Барои блогерон"
        description="Малакаҳои блогерӣ бо забони тоҷикӣ ва озмунҳое, ки блогерон метавонанд дар онҳо иштирок кунанд."
      />
      <HubSection title="Озмунҳо">
        <div className="grid gap-3">
          {CONTESTS.map((c) => (
            <div key={c.title} className="rounded-xl border bg-card p-4">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">{c.when}</p>
              <a
                href={c.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {c.source.title}
                <ExternalLink className="size-3" />
              </a>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Озмунҳои нав барои блогерон ҳамин ки дар манбаъҳои расмӣ эълон шаванд, дар ин ҷо илова мешаванд.
          </p>
        </div>
      </HubSection>
      <HubSection title="Курсҳо" action={<Badge variant="secondary">дар таҳия</Badge>}>
        <PlannedList items={COURSES} />
      </HubSection>
    </div>
  );
}
